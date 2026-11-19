import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/** Temporary visual progress; never written to the yard placement or theme preferences. */
export function useDeerAwakening(target: number) {
  const progress=useRef(target),previousTarget=useRef(target),prepared=useRef(false);
  const woodMask=useRef<SVGCircleElement>(null),spiritMask=useRef<SVGCircleElement>(null);
  const band=useRef<SVGCircleElement>(null),awakening=useRef<SVGGElement>(null);
  const shadow=useRef<SVGGElement>(null),ground=useRef<SVGEllipseElement>(null);
  const flora=useRef<SVGGElement>(null);
  const [layers,setLayers]=useState({wood:target<1,spirit:target===1,transitioning:false});
  const apply=useCallback((value:number)=>{
    progress.current=value;
    const reveal=Math.max(0,Math.min(1,(value-.34)/.66));
    const radius=reveal*180;
    for(const ref of [woodMask,spiritMask,band]) ref.current?.setAttribute('r',String(radius));
    awakening.current?.setAttribute('opacity',String(Math.min(1,value/.32)*(1-reveal)));
    shadow.current?.setAttribute('opacity',String(1-reveal));
    ground.current?.setAttribute('opacity',String(value===0?0:.07*Math.min(1,value/.32)+.93*reveal));
    if(flora.current){
      flora.current.setAttribute('opacity',String(Math.min(1,value/.32)));
      for(const flower of flora.current.querySelectorAll<SVGGElement>('[data-spirit-flower]')){
        const delay=Number(flower.dataset.bloomDelay);
        const raw=Math.max(0,Math.min(1,(reveal-delay)/(1-delay)));
        const open=raw*raw*(3-2*raw);
        flower.querySelector('[data-flower-growth]')?.setAttribute('transform',`scale(${.25+.75*open})`);
        flower.querySelector('[data-flower-bud]')?.setAttribute('opacity',String(.28*(1-open)));
        const blossom=flower.querySelector('[data-flower-open]');
        blossom?.setAttribute('opacity',String(open));
        blossom?.setAttribute('transform',`scale(${.25+.75*open})`);
      }
      flora.current.querySelector('[data-flower-petals]')?.setAttribute('opacity',String(Math.max(0,(reveal-.55)/.45)));
    }
  },[]);
  const onPrepared=useCallback(()=>{prepared.current=true;},[]);
  // YardObject mounts its portal after the scene layer is ready, independently of this hook.
  const woodMaskRef=useCallback((node:SVGCircleElement|null)=>{woodMask.current=node;apply(progress.current);},[apply]);
  const spiritMaskRef=useCallback((node:SVGCircleElement|null)=>{spiritMask.current=node;apply(progress.current);},[apply]);
  const bandRef=useCallback((node:SVGCircleElement|null)=>{band.current=node;apply(progress.current);},[apply]);
  const awakeningRef=useCallback((node:SVGGElement|null)=>{awakening.current=node;apply(progress.current);},[apply]);
  const shadowRef=useCallback((node:SVGGElement|null)=>{shadow.current=node;apply(progress.current);},[apply]);
  const groundRef=useCallback((node:SVGEllipseElement|null)=>{ground.current=node;apply(progress.current);},[apply]);
  const floraRef=useCallback((node:SVGGElement|null)=>{flora.current=node;apply(progress.current);},[apply]);
  // Newly mounted optional layers receive the current progress before the next paint.
  useLayoutEffect(()=>{apply(progress.current);});
  useEffect(()=>{
    if(previousTarget.current===target) return;
    previousTarget.current=target;
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    let frame=0,lastTime:number|null=null;
    const finish=()=>{
      apply(target);setLayers({wood:target<1,spirit:target===1,transitioning:false});
      if(target<1) prepared.current=false;
    };
    if(motion.matches){finish();return;}
    setLayers(current=>({wood:true,spirit:current.spirit||target===1,transitioning:true}));
    const step=(time:number)=>{
      const delta=lastTime===null?0:Math.min((time-lastTime)/1000,.06);lastTime=time;
      // Do not erase the wood until the WebGL image (or its fallback) is available.
      if(target===1&&!prepared.current){frame=requestAnimationFrame(step);return;}
      const current=progress.current,direction=Math.sign(target-current);
      const next=current+direction*delta/4.8;
      if(direction===0||(target-next)*direction<=0){finish();return;}
      apply(next);frame=requestAnimationFrame(step);
    };
    const sync=()=>{
      cancelAnimationFrame(frame);lastTime=null;
      if(motion.matches) finish();
      else if(!document.hidden&&Math.abs(progress.current-target)>.0001) frame=requestAnimationFrame(step);
    };
    sync();document.addEventListener('visibilitychange',sync);motion.addEventListener('change',sync);
    return()=>{cancelAnimationFrame(frame);document.removeEventListener('visibilitychange',sync);motion.removeEventListener('change',sync);};
  },[target,apply]);
  return {...layers,progress,woodMask:woodMaskRef,spiritMask:spiritMaskRef,band:bandRef,awakening:awakeningRef,shadow:shadowRef,ground:groundRef,flora:floraRef,onPrepared};
}
