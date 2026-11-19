import type { RefObject } from 'react';
import type { createSpiritPatrol } from './spiritDeerPatrol';
type Pose=ReturnType<ReturnType<typeof createSpiritPatrol>['sample']>;
const colors=['#ee598b','#f5a83e','#9b70ea'];

export function SpiritDeerFootprints(){
  return <g data-deer-footprints="" opacity="0" pointerEvents="none" aria-hidden="true">
    {Array.from({length:10},(_,index)=><g key={index} data-deer-footprint="" opacity="0">
      <path d="M0,0 Q-.6,-1.8 .4,-3" fill="none" stroke="#94c9ad" strokeWidth=".45" opacity=".5" />
      <g data-trail-head="" transform="translate(.4 -3)">
        <g transform="scale(1 .48)">
          {[0,72,144,216,288].map(angle=><path key={angle} transform={`rotate(${angle})`} d="M0,.3 C-1.8,-.7 -2.5,-3.5 -.3,-4.5 C1.9,-4.9 2.1,-1.1 0,.3Z" fill="currentColor" />)}
          <circle r=".7" fill="#ffe48e" />
        </g>
      </g>
    </g>)}
  </g>;
}

/** Ground positions are captured at birth, never carried along with the moving deer. */
export function createDeerPatrolGround(root:SVGGElement){
  const slots=[...root.querySelectorAll<SVGGElement>('[data-deer-footprint]')];
  const births=slots.map(()=>({born:-100,x:0,y:0,size:1}));
  const light=root.querySelector('[data-deer-moving-light]'),home=root.querySelector('[data-deer-home-flowers]');
  const trail=root.querySelector('[data-deer-footprints]');
  let next=0;
  return {
    update(pose:Pose|null,weight:number,time:number){
      if(!pose||weight<.001){
        light?.removeAttribute('transform');light?.removeAttribute('opacity');home?.setAttribute('opacity','1');trail?.setAttribute('opacity','0');
        slots.forEach(slot=>slot.setAttribute('opacity','0'));births.forEach(b=>b.born=-100);return;
      }
      const x=pose.x*weight,y=pose.y*weight;
      light?.setAttribute('transform',`translate(${x} ${y})`);
      light?.setAttribute('opacity',String((.7+.3*pose.visibility)*pose.groundVisibility));
      home?.setAttribute('opacity',String((1-Math.min(1,Math.hypot(x,y)/24))*pose.groundVisibility));
      trail?.setAttribute('opacity',String(weight));
      if(weight>.98)for(const landing of pose.landings){
        if(landing.serial%3!==1)continue;
        const slot=slots[next],birth=births[next];
        birth.born=landing.at;birth.x=landing.x;birth.y=landing.y;birth.size=.5+(landing.serial%4)*.1;
        slot.style.color=colors[Math.floor(landing.serial/3)%colors.length];next=(next+1)%slots.length;
      }
      births.forEach((birth,index)=>{
        const age=time-birth.born;
        const grow=Math.max(0,Math.min(1,age/.75)),fade=1-Math.max(0,Math.min(1,(age-5)/3));
        slots[index].setAttribute('opacity',String(age>=0&&age<8?grow*fade*.85:0));
        slots[index].setAttribute('transform',`translate(${birth.x} ${birth.y}) scale(${birth.size*(.3+.7*grow)})`);
      });
    },
  };
}

export type PatrolMotionHandler=(pose:Pose|null,weight:number,time:number)=>void;
export type AwakeningProgress=RefObject<number>;
