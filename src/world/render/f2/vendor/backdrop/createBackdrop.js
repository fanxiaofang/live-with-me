import * as THREE from 'three';
import { clone,makeConfig,validateConfig,changeSeason,WEATHERS,TIMES } from './config.js';
import { makeRidgeGeometry,ridgeAt,SEGMENTS } from './ridgeGeometry.js';
import { createSky,createRidgeMaterial,updateRidgeMaterial,resolveLook } from './ridgeMaterial.js';
import { WorldViewAdapter } from './WorldViewAdapter.js';

/** Self contained renderer. No GUI, SVG, localStorage, reference images or app loop imports. */
export function createBackdrop(container,{config=makeConfig(),observeResize=true,transparentBackground=false,pixelRatio=Math.min(globalThis.devicePixelRatio||1,2)}={}){
 let current=validateConfig(config),disposed=false,width=1,height=1,meshes=[],lines=[],blend=null;
 let view={camera:clone(current.camera),viewport:{width,height},isDragging:false,isTransitioning:false};
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:transparentBackground,preserveDrawingBuffer:true,powerPreference:'low-power'});
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.NoToneMapping;
 renderer.setPixelRatio(Math.min(2,Math.max(1,pixelRatio)));
 renderer.domElement.className='backdrop-canvas';renderer.domElement.setAttribute('aria-label','分层远山WebGL背景');
 renderer.domElement.style.pointerEvents='none';container.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.OrthographicCamera(-1,1,1,-1,.1,20);camera.position.z=5;
 const sky=createSky();sky.visible=!transparentBackground;scene.add(sky);
 let renderMs=0;
 function ensure(){if(disposed)throw Error('Backdrop已dispose');}
 function free(objects){for(const o of objects){scene.remove(o);o.geometry.dispose();o.material.dispose();}}
 function colors(){meshes.forEach((m,i)=>updateRidgeMaterial(m,resolveLook(current,current.layers[i],i,blend)));
  const l=resolveLook(current,current.layers[0],0,blend);sky.material.uniforms.uTop.value.copy(l.top);sky.material.uniforms.uAir.value.copy(l.air);sky.material.uniforms.uHorizon.value.copy(l.horizon);
  const start=current.surfaceStyle==='legacy'&&current.timeOfDay==='day'?-.05:.12,end=current.surfaceStyle==='legacy'&&(blend?.timeOfDay??current.timeOfDay)==='day'?-.05:.12;
  sky.material.uniforms.uGradientStart.value=start+(end-start)*(blend?.t||0);sky.material.uniforms.uGray.value=+current.diagnostics.grayscale;
 }
 function transforms(){meshes.forEach((m,i)=>{
  const a=WorldViewAdapter({...view,viewport:{width,height}},current.layers[i].response).backdrop;
  // Stable anchor is the design horizon, independent of each mesh bounding box.
  m.scale.set(a.scale,a.scale,1);m.position.set(a.x,current.horizon+a.y,0);
  lines[i].scale.copy(m.scale);lines[i].position.copy(m.position);
 });}
 function rebuild(next){
  const newMeshes=[],newLines=[];
  try{next.layers.forEach((layer,i)=>{
   const g=makeRidgeGeometry(layer.points),m=new THREE.Mesh(g,createRidgeMaterial(next.material));m.renderOrder=i*2;m.frustumCulled=false;newMeshes.push(m);
   const pts=Array.from({length:SEGMENTS+1},(_,j)=>{const x=-4+8*j/SEGMENTS;return new THREE.Vector3(x,ridgeAt(layer.points,x),0);});
   const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:'#354c45',depthTest:false,depthWrite:false}));line.renderOrder=20+i;line.visible=next.diagnostics.outlines;newLines.push(line);
  });}catch(e){free(newMeshes);free(newLines);throw e;}
  free(meshes);free(lines);meshes=newMeshes;lines=newLines;current=next;
  scene.add(...meshes,...lines);colors();transforms();
 }
 function render(){ensure();const t=performance.now();renderer.render(scene,camera);renderMs=performance.now()-t;}
 function resize(w=container.clientWidth,h=container.clientHeight,dpr=renderer.getPixelRatio()){
  ensure();if(!Number.isFinite(w)||!Number.isFinite(h)||w<=0||h<=0)return false;
  width=w;height=h;renderer.setPixelRatio(Math.min(2,Math.max(1,Number.isFinite(dpr)?dpr:1)));renderer.setSize(w,h,false);
  camera.left=-w/h;camera.right=w/h;camera.updateProjectionMatrix();transforms();render();return true;
 }
 function setConfig(input){ensure();const next=validateConfig(input);rebuild(next);view.camera=clone(next.camera);transforms();render();}
 function setViewState(state){ensure();const next={...view,...state,camera:{...state.camera},viewport:{width,height}};WorldViewAdapter(next);view=next;transforms();}
 function setPalette(palette){let next;if(typeof palette==='string')next=changeSeason(current,palette);else {next=clone(current);next.palette=clone(palette);}setConfig(next);}
 function setWeatherLook(weather){if(!WEATHERS.includes(weather))throw Error('非法天气');const next=clone(current);next.weather=weather;setConfig(next);}
 function setTimeOfDay(timeOfDay){if(!TIMES.includes(timeOfDay))throw Error('非法时段');const next=clone(current);next.timeOfDay=timeOfDay;setConfig(next);}
 function setBlend(value){ensure();if(value!==null&&(!WEATHERS.includes(value.weather)||!['spring','summer','autumn','winter'].includes(value.season)||(value.timeOfDay!==undefined&&!TIMES.includes(value.timeOfDay))||!Number.isFinite(value.t)||value.t<0||value.t>1))throw Error('非法混合');blend=value?{...value}:null;colors();render();}
 function stats(){return{revision:THREE.REVISION,width,height,dpr:renderer.getPixelRatio(),drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles,geometries:renderer.info.memory.geometries,textures:renderer.info.memory.textures,programs:renderer.info.programs?.length,renderSubmitMs:renderMs,disposed,transforms:meshes.map(m=>({x:m.position.x,y:m.position.y,scale:m.scale.x}))};}
 rebuild(current);
 const observer=observeResize?new ResizeObserver(()=>resize()):null;observer?.observe(container);resize();
 const onRestored=()=>{if(!disposed)render();};renderer.domElement.addEventListener('webglcontextrestored',onRestored);
 return {scene,camera,renderer,canvas:renderer.domElement,render,resize,setViewState,setPalette,setWeatherLook,setTimeOfDay,setConfig,setBlend,
  getConfig:()=>clone(current),getStats:stats,
  dispose(){if(disposed)return;observer?.disconnect();renderer.domElement.removeEventListener('webglcontextrestored',onRestored);free(meshes);free(lines);meshes=[];lines=[];sky.geometry.dispose();sky.material.dispose();scene.clear();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();disposed=true;}
 };
}
