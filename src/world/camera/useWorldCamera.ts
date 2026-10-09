import type React from 'react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { RoomId } from '../../types';
import { clientToSvg, FULL_VIEWBOX, visibleViewBox } from '../coordinates/viewport';
import { sceneExplorationBounds } from '../scene/explorationBounds';
import { resolveRoomCamera } from '../scene/roomTargets';
import type { SceneLayout } from '../scene/sceneTypes';
import { viewBoxPoint } from '../scene/sceneTypes';
import { clampZoom, focusCamera, viewBoxToScene, type Camera } from './cameraMath';
import { clampPan } from './cameraBounds';

export function useWorldCamera(room:RoomId|'overview',layout:SceneLayout,focusRevision=0,editing=false) {
  const svgRef=useRef<SVGSVGElement>(null);
  const [camera,setCamera]=useState(()=>resolveRoomCamera(room,layout));
  const [isDragging,setIsDragging]=useState(false);
  const [viewport,setViewport]=useState(FULL_VIEWBOX);
  const cameraRef=useRef(camera);
  const mode=useRef<'focus'|'pan'>('focus');
  const lastFocus=useRef({room,revision:focusRevision});
  const hasMovedRef=useRef(false);
  const pointers=useRef(new Map<number,{x:number;y:number}>());
  const gesture=useRef<{origin:Camera;originMode:'focus'|'pan';start:Camera;client:{x:number;y:number};point:{x:number;y:number};distance:number;midpoint:{x:number;y:number}} | null>(null);
  const apply=(value:Camera)=>{cameraRef.current=value;setCamera(value);};
  const focusedCamera=useMemo(()=>resolveRoomCamera(room,layout,viewport),[room,layout,viewport]);
  const selectionChanged=lastFocus.current.room!==room||lastFocus.current.revision!==focusRevision;
  // Put selection and its camera target in the same commit, rather than first
  // painting the old camera and scheduling another render from an effect.
  const renderedCamera=selectionChanged||mode.current==='focus'?focusedCamera:camera;
  const focus=()=>focusedCamera;
  const constrain=(value:Camera)=>clampPan(value,focus(),viewport,sceneExplorationBounds(layout));

  useEffect(()=>{
    const svg=svgRef.current;
    if(!svg) return;
    const measure=()=>{
      const {width,height}=svg.getBoundingClientRect();
      const next=visibleViewBox(width,height);
      setViewport(previous=>previous.minX===next.minX&&previous.minY===next.minY?previous:next);
    };
    measure();
    const observer=new ResizeObserver(measure);
    observer.observe(svg);
    return ()=>observer.disconnect();
  },[]);
  useLayoutEffect(()=>{
    if(selectionChanged) mode.current='focus';
    lastFocus.current={room,revision:focusRevision};
    if(mode.current==='focus') cameraRef.current=focusedCamera;
    else apply(constrain(cameraRef.current));
  },[room,layout,focusRevision,viewport]);

  useEffect(()=>{
    const svg=svgRef.current;
    if(!svg) return;
    const wheel=(e:WheelEvent)=>{
      e.preventDefault();
      if(editing||pointers.current.size) return;
      mode.current='pan';
      apply(constrain({...cameraRef.current,zoom:clampZoom(cameraRef.current.zoom-e.deltaY*0.0012)}));
    };
    svg.addEventListener('wheel',wheel,{passive:false});
    return ()=>svg.removeEventListener('wheel',wheel);
  },[editing,room,layout,viewport]);

  const rootPoint=(p:{x:number;y:number})=>svgRef.current ? clientToSvg(svgRef.current,p.x,p.y) : null;
  const rebase=()=>{
    const points=[...pointers.current.values()];
    if(!points.length||!gesture.current) return;
    const first=points[0];
    const point=rootPoint(first);
    if(!point) return;
    gesture.current={...gesture.current,start:cameraRef.current,client:first,point,
      distance:points.length>1?Math.hypot(points[1].x-first.x,points[1].y-first.y):0,
      midpoint:points.length>1?{x:(first.x+points[1].x)/2,y:(first.y+points[1].y)/2}:first};
  };
  const onPointerDown=(e:React.PointerEvent<HTMLDivElement>)=>{
    if(!pointers.current.size) hasMovedRef.current=false;
    if(editing||e.button!==0||(e.target as Element).closest('#iso-interactive-gizmo')||(e.target as Element).closest('svg')!==svgRef.current) return;
    const client={x:e.clientX,y:e.clientY};
    const point=rootPoint(client);
    if(!point) return;
    if(!pointers.current.size) gesture.current={origin:cameraRef.current,originMode:mode.current,start:cameraRef.current,client,point,distance:0,midpoint:client};
    pointers.current.set(e.pointerId,client);
    if(pointers.current.size>1){hasMovedRef.current=true;rebase();}
  };
  const onPointerMove=(e:React.PointerEvent<HTMLDivElement>)=>{
    if(!pointers.current.has(e.pointerId)||!gesture.current) return;
    pointers.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
    const g=gesture.current;
    const points=[...pointers.current.values()];
    if(points.length===1){
      const client=points[0];
      if(Math.hypot(client.x-g.client.x,client.y-g.client.y)<=4&&!hasMovedRef.current) return;
      const point=rootPoint(client);
      if(!point) return;
      apply(constrain({...g.start,x:g.start.x+point.x-g.point.x,y:g.start.y+point.y-g.point.y}));
    }else{
      const distance=Math.hypot(points[1].x-points[0].x,points[1].y-points[0].y);
      const initialMidpoint=rootPoint(g.midpoint);
      const midpoint=rootPoint({x:(points[0].x+points[1].x)/2,y:(points[0].y+points[1].y)/2});
      if(!g.distance||!initialMidpoint||!midpoint) return;
      const anchor=viewBoxToScene(viewBoxPoint(initialMidpoint.x,initialMidpoint.y),g.start);
      const zoom=clampZoom(g.start.zoom*distance/g.distance);
      apply(constrain(focusCamera(anchor,zoom,viewBoxPoint(midpoint.x,midpoint.y))));
    }
    if(!e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId);
    mode.current='pan';hasMovedRef.current=true;setIsDragging(true);
  };
  const cancel=()=>{
    if(gesture.current){apply(gesture.current.origin);mode.current=gesture.current.originMode;}
    pointers.current.clear();gesture.current=null;setIsDragging(false);
  };
  const onPointerUp=(e:React.PointerEvent<HTMLDivElement>)=>{
    if(!pointers.current.delete(e.pointerId)) return;
    if(e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if(pointers.current.size) rebase();
    else {gesture.current=null;setIsDragging(false);}
  };
  const onPointerCancel=(e:React.PointerEvent<HTMLDivElement>)=>{if(pointers.current.has(e.pointerId)) cancel();};
  // Ignore capture transferred from a child (including implicit touch capture).
  const onLostPointerCapture=(e:React.PointerEvent<HTMLDivElement>)=>{if(e.target===e.currentTarget&&pointers.current.has(e.pointerId)) cancel();};
  const zoomBy=(delta:number)=>{mode.current='pan';apply(constrain({...cameraRef.current,zoom:clampZoom(cameraRef.current.zoom+delta)}));};
  const restoreFocus=()=>{mode.current='focus';apply(focus());};
  const onClickCapture=(e:React.MouseEvent)=>{if(hasMovedRef.current){e.preventDefault();e.stopPropagation();}};
  return {camera:renderedCamera,isDragging,svgRef,hasMovedRef,zoomBy,restoreFocus,
    pointerHandlers:{onPointerDown,onPointerMove,onPointerUp,onPointerCancel,onLostPointerCapture,onClickCapture}};
}
