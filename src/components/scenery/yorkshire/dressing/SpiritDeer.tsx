import { useEffect, useId, useRef, useState } from 'react';
import { createSpiritDeerRenderer, SPIRIT_ANTLERS, SPIRIT_BODY, SPIRIT_BOUNDS, DEER_AURA_BOUNDS, SPIRIT_EARS, SPIRIT_FAR_LEGS, SPIRIT_NEAR_LEGS } from './spiritDeerMaterial';
import type {DeerPatrolPath} from '../../../../features/yard-editor/deerPatrolRoute';
import { createSpiritPatrol } from './spiritDeerPatrol';
import {createDeerFrameGate} from './spiritDeerFrameGate';
import type { AwakeningProgress, PatrolMotionHandler } from './SpiritDeerFootprints';

/** A night-only, yard-local WebGL surface; layout ownership stays with GateSpiritDeer. */
export function SpiritDeer({ onPrepared,awakeningProgress,motionEnabled=true,onPatrol,patrolPath }: {
  onPrepared?:()=>void;awakeningProgress?:AwakeningProgress;motionEnabled?:boolean;onPatrol?:PatrolMotionHandler;patrolPath?:DeerPatrolPath;
}) {
  const surfaceRef = useRef<HTMLDivElement>(null);
  const actorRef=useRef<SVGGElement>(null),live=useRef({awakeningProgress,motionEnabled,onPatrol,patrolPath});
  live.current={awakeningProgress,motionEnabled,onPatrol,patrolPath};
  const [ready, setReady] = useState(false);
  const model='original',bounds=DEER_AURA_BOUNDS;
  const id = 'spirit-fallback-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  useEffect(() => {
    const surface = surfaceRef.current;
    if (!surface) return;
    // Each effect owns its canvas, including React's development setup/cleanup replay.
    const canvas = document.createElement('canvas');
    Object.assign(canvas.style, { width: '100%', height: '100%', display: 'block', pointerEvents: 'none' });
    canvas.setAttribute('aria-hidden', 'true'); surface.appendChild(canvas);
    let renderer: ReturnType<typeof createSpiritDeerRenderer> | undefined;
    let frame = 0, elapsed = 0, previous: number | null = null, scale = 2, nextSizeCheck = 0, failed = false, announced = false,disposed=false;
    const frameGate=createDeerFrameGate(30);
    let patrol=createSpiritPatrol(live.current.patrolPath),patrolTime=0,pathSignature=live.current.patrolPath?.signature;
    let lastPose:ReturnType<typeof patrol.sample>|undefined;
    let appearanceFinishedAt:number|null=null;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const lose = (event: Event) => {
      event.preventDefault(); failed = true; cancelAnimationFrame(frame);
      actorRef.current?.removeAttribute('transform');live.current.onPatrol?.(null,0,0);setReady(false);
    };
    const draw = (time: number) => {
      if (failed) return;
      if (!motion.matches && !frameGate.ready(time)) {
        frame=requestAnimationFrame(draw); return;
      }
      try {
        const delta=previous===null?0:Math.max(0,(time-previous)/1000);
        elapsed+=delta;
        previous = time;
        if (time >= nextSizeCheck) {
          const matrix = (surface.parentElement as unknown as SVGGraphicsElement).getScreenCTM();
          scale = (matrix ? Math.max(Math.hypot(matrix.a, matrix.b), Math.hypot(matrix.c, matrix.d)) : 1) * devicePixelRatio;
          nextSizeCheck = time + 250;
        }
        const progress=live.current.awakeningProgress?.current??1;
        if(pathSignature!==live.current.patrolPath?.signature){pathSignature=live.current.patrolPath?.signature;patrol=renderer!.createPatrol?.(live.current.patrolPath)??createSpiritPatrol(live.current.patrolPath);patrolTime=0;lastPose=undefined;}
        if(!live.current.motionEnabled&&patrolTime>0){patrol=renderer!.createPatrol?.(live.current.patrolPath)??createSpiritPatrol(live.current.patrolPath);patrolTime=0;lastPose=undefined;}
        if(!motion.matches&&live.current.motionEnabled&&progress>=.999){
          const steps=Math.max(1,Math.ceil(delta*24)),contacts:NonNullable<typeof lastPose>['landings']=[];
          for(let step=0;step<steps;step++){
            patrolTime+=delta/steps;lastPose=patrol.sample(patrolTime);contacts.push(...lastPose.landings);
          }
          if(lastPose)lastPose.landings=contacts;
        }
        const raw=Math.max(0,Math.min(1,(progress-.7)/.3));
        const weight=!motion.matches&&live.current.motionEnabled?raw*raw*(3-2*raw):0;
        actorRef.current?.setAttribute('data-deer-opacity',String(lastPose?.visibility??1));
        actorRef.current?.setAttribute('data-deer-effect-phase',lastPose?.effectPhase??'none');
        actorRef.current?.setAttribute('data-deer-dissolve',String(lastPose?.transition??-1));
        actorRef.current?.setAttribute('data-deer-patrol-time',patrolTime.toFixed(2));
        if(lastPose&&weight>0){
          actorRef.current?.setAttribute('transform',`translate(${lastPose.x*weight} ${lastPose.y*weight})`);
          actorRef.current?.setAttribute('data-deer-patrol',lastPose.state);
        }else{actorRef.current?.removeAttribute('transform');actorRef.current?.setAttribute('data-deer-patrol','watch');}
        if(progress<.999)appearanceFinishedAt=null;
        else if(appearanceFinishedAt===null)appearanceFinishedAt=elapsed;
        renderer!.draw(motion.matches ? 0 : elapsed, scale,lastPose,weight,4,{
          reveal:progress,arrivalAge:appearanceFinishedAt===null?-1:elapsed-appearanceFinishedAt,
          paused:motion.matches||!live.current.motionEnabled,
        });
        live.current.onPatrol?.(lastPose??null,weight,patrolTime);
        if (!announced) { announced = true; setReady(true); }
        if (!motion.matches && !document.hidden) frame = requestAnimationFrame(draw);
      } catch (error) {
        console.warn('Spirit deer switched to its static fallback:', error);
        failed = true;actorRef.current?.removeAttribute('transform');live.current.onPatrol?.(null,0,0);setReady(false);
      }
    };
    const sync = () => {
      if(!renderer||disposed)return;
      cancelAnimationFrame(frame); previous = null; nextSizeCheck = 0; frameGate.reset();
      if(motion.matches){patrol=renderer.createPatrol?.(live.current.patrolPath)??createSpiritPatrol(live.current.patrolPath);patrolTime=0;lastPose=undefined;}
      if (!document.hidden && !failed) draw(performance.now());
    };
    // SVG camera transforms do not resize the foreignObject's CSS layout box.
    // In reduced-motion mode they must still refresh the static raster resolution.
    const cameraObserver = new MutationObserver(() => {
      if (motion.matches) sync();
    });
    let ancestor: Element | null = surface.parentElement;
    while (ancestor && ancestor instanceof SVGElement) {
      cameraObserver.observe(ancestor, { attributes: true, attributeFilter: ['transform', 'style', 'viewBox'] });
      ancestor = ancestor.parentElement;
    }
    const prepare=async()=>{
      try {
        renderer=createSpiritDeerRenderer(canvas);
        patrol=renderer.createPatrol?.(live.current.patrolPath)??createSpiritPatrol(live.current.patrolPath);
        canvas.addEventListener('webglcontextlost',lose);sync();
      }catch(error){if(disposed)return;console.warn('Spirit deer WebGL is unavailable:',error);failed=true;setReady(false);}
      if(!disposed)onPrepared?.();
    };
    void prepare();
    motion.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    // A static reduced-motion frame still follows the scene's raster resolution on resize.
    window.addEventListener('resize', sync);
    return () => {
      disposed=true;
      cancelAnimationFrame(frame); cameraObserver.disconnect(); canvas.removeEventListener('webglcontextlost', lose);
      motion.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync);
      window.removeEventListener('resize', sync);renderer?.dispose();canvas.remove();live.current.onPatrol?.(null,0,0);
    };
  }, [onPrepared,model]);
  return <g ref={actorRef} data-deer-apparition="" data-deer-model={model} data-deer-contours={model==='original'?'neck-tail-v34':undefined} data-deer-palette={model==='original'?'moon':undefined} data-deer-aura={model==='original'?'woodland':undefined} data-deer-aura-timing={model==='original'?'transitions':undefined} data-deer-patrol-enabled={motionEnabled} data-spirit-renderer={ready ? 'webgl' : 'fallback'} pointerEvents="none">
    {!ready && <g data-spirit-fallback="">
      <defs><linearGradient id={id} x1="0" y1="0" x2=".8" y2="1">
        <stop stopColor="#b9edf5" /><stop offset=".5" stopColor="#69aaba" /><stop offset="1" stopColor="#376a83" />
      </linearGradient></defs>
      <path d={SPIRIT_FAR_LEGS} fill="#528392" opacity=".18" />
      <path d={SPIRIT_BODY} fill={`url(#${id})`} opacity=".25" />
      <path d={SPIRIT_NEAR_LEGS} fill={`url(#${id})`} opacity=".25" />
      <path d={SPIRIT_EARS} fill="#b9edf5" opacity=".35" />
      {SPIRIT_ANTLERS.map((d,i) => <path key={i} d={d} fill="none" stroke="#c9f2ff" strokeWidth="1.5" />)}
      <circle cx="44" cy="-94" r="1" fill="#f0fcff" />
    </g>}
    <foreignObject x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height}
      visibility={ready ? 'visible' : 'hidden'} data-spirit-surface="webgl" pointerEvents="none">
      <div ref={surfaceRef} style={{ width: '100%', height: '100%', pointerEvents: 'none' }} />
    </foreignObject>
  </g>;
}
