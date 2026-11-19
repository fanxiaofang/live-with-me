/** Reference-guided authored poses, not motion capture. The user's 622199374.mp4
 * informs silhouette, recovery and cadence; occluded feet are not claimed tracked.
 * Support poses satisfy ground contact. Swing interpolates authored JOINT poses.
 */
import {writeFileSync} from 'node:fs';
import * as THREE from 'three';
import {bindJoints,DEER_LEGS,fitForeContact} from '../src/components/scenery/yorkshire/dressing/spiritDeerRig';
const stride=38,stances=[.65,.62,.65,.62],times=Array.from({length:121},(_,i)=>i/120);
const radians=THREE.MathUtils.degToRad;
type Key={time:number;angles:number[];hoof:number;shoulder:number};
function hindPose(bind:THREE.Vector3[],target:THREE.Vector3,cannon:number){
 const [hip]=bind,a=bind[0].distanceTo(bind[1]),b=bind[1].distanceTo(bind[2]),c=bind[2].distanceTo(bind[3]);
 const ankle=target.clone().sub(new THREE.Vector3(Math.sin(cannon)*c,Math.cos(cannon)*c,0));
 const axis=ankle.clone().sub(hip),d=Math.min(a+b-.00001,axis.length());axis.normalize();
 const along=(a*a-b*b+d*d)/(2*d),height=Math.sqrt(Math.max(0,a*a-along*along));
 const pole=new THREE.Vector3(1,0,0).addScaledVector(axis,-axis.x).normalize();
 const knee=hip.clone().addScaledVector(axis,along).addScaledVector(pole,height);
 return [hip,knee,ankle,target];
}
function author(index:number,variant:number):Key[]{
 const fore=index%2===1,stance=stances[index],span=stride*stance/2,bind=bindJoints(index),leg=DEER_LEGS[index];
 // Landing/load, pass support, toe-off, fold, advance, lower and land.
 const poses=fore?
  [[0,span,-.55,11,-2,.2],[.16,span-stride*.16,-.55,12,-2,.55],[.34,span-stride*.34,-.55,13,-3,.1],[.5,span-stride*.5,-.55,15,-7,-.45],
   [stance,-span,-.55,16,-14,-1.1],[.69,-12.5,-4.4,14,-15,-.65],[.77,-2.5,-8.4-variant*.3,11,-6,.5],[.88,11,-5.6,9,4,1.45],[.96,13.1,-1.8,10,2,1.05],[1,span,-.55,11,-2,.2]]:
  [[0,span,-.55,6,-1,.12],[.18,span-stride*.18,-.55,3,-1,.3],[.36,span-stride*.36,-.55,-2,-3,0],[.52,span-stride*.52,-.55,-7,-8,-.3],
   [stance,-span,-.55,-9,-16,-.75],[.73,-13.5,-3.6,-7,-12,-.5],[.82,-2,-7.0-variant*.25,9,-4,.4],[.92,11,-3.8,12,4,.65],[1,span,-.55,6,-1,.12]];
 return poses.map(([time,x,y,bend,hoof,shoulder])=>{
  const target=new THREE.Vector3(leg.sole[0]+x,leg.sole[1]+y,leg.sole[2]);
  const joints=fore?fitForeContact(bind,target,radians(bend)).points:hindPose(bind,target,radians(bend));
  return {time,angles:joints.slice(1).map((p,i)=>{const d=p.clone().sub(joints[i]);return Math.atan2(d.x,d.y);}),hoof:radians(hoof),shoulder};
 });
}
/** Cyclic cubic FK curves preserve angular velocity across contact/recovery. */
function curve(keys:Key[],phase:number,read:(key:Key)=>number){
 let i=0;while(i<keys.length-2&&phase>keys[i+1].time)i++;
 const a=keys[i],b=keys[i+1],before=i===0?{...keys[keys.length-2],time:keys[keys.length-2].time-1}:keys[i-1];
 const after=i+2===keys.length?{...keys[1],time:keys[1].time+1}:keys[i+2];
 const duration=b.time-a.time,u=(phase-a.time)/duration,u2=u*u,u3=u2*u;
 const m0=(read(b)-read(before))/(b.time-before.time)*duration,m1=(read(after)-read(a))/(after.time-a.time)*duration;
 return (2*u3-3*u2+1)*read(a)+(u3-2*u2+u)*m0+(-2*u3+3*u2)*read(b)+(u3-u2)*m1;
}
const bodyTimes=[0,.12,.25,.38,.5,.62,.75,.88,1];
const bodyKeys={
 bodyY:[.52,.82,.58,.25,.50,.79,.55,.25,.52],
 pelvisPitch:[.003,.009,.004,-.006,.003,.010,.004,-.006,.003],
 chestPitch:[-.004,-.002,.009,.005,-.004,-.003,.010,.004,-.004],
 pelvisRoll:[0,.010,.014,.009,0,-.010,-.014,-.009,0],
 chestRoll:[-.003,-.009,-.012,-.004,.003,.009,.012,.004,-.003],
};
function bodyKey(values:number[],phase:number){
 let i=0;while(i<bodyTimes.length-2&&phase>bodyTimes[i+1])i++;
 const last=bodyTimes.length-1,previous=i===0?last-1:i-1,next=i+2===bodyTimes.length?1:i+2;
 const beforeTime=i===0?bodyTimes[previous]-1:bodyTimes[previous],afterTime=i+2===bodyTimes.length?bodyTimes[next]+1:bodyTimes[next];
 const dt=bodyTimes[i+1]-bodyTimes[i],u=(phase-bodyTimes[i])/dt,u2=u*u,u3=u2*u;
 const m0=(values[i+1]-values[previous])/(bodyTimes[i+1]-beforeTime)*dt,m1=(values[next]-values[i])/(afterTime-bodyTimes[i])*dt;
 return (2*u3-3*u2+1)*values[i]+(u3-2*u2+u)*m0+(-2*u3+3*u2)*values[i+1]+(u3-u2)*m1;
}
function bake(variant:number){
 const tracks:Record<string,number[]>={},keys=DEER_LEGS.map((_,i)=>author(i,variant));
 const put=(name:string,n:number)=>(tracks[name]??=[]).push(Number(n.toFixed(7)));
 for(const phase of times){
  DEER_LEGS.forEach((_,i)=>{
   for(let j=0;j<3;j++)put(`leg${i}angle${j}`,curve(keys[i],phase,k=>k.angles[j]));
   put(`leg${i}hoof`,curve(keys[i],phase,k=>k.hoof));put(`leg${i}shoulder`,curve(keys[i],phase,k=>k.shoulder)*(1+variant*.06));
  });
  for(const [name,values] of Object.entries(bodyKeys))put(name,bodyKey(values,phase)*(name==='bodyY'?1:variant===1?.94:variant===2?1.05:1));
 }
 return tracks;
}
const tracks=bake(0),variants=[bake(1),bake(2)];
writeFileSync('src/components/scenery/yorkshire/dressing/spiritDeerWalkClip.json',JSON.stringify({name:'deer-reference-guided-walk',stride,stance:.635,stances,times,tracks,variants}));
console.log(`Baked ${times.length} FK poses × 3 variants; fore/hind support ${stances[1]}/${stances[0]}.`);
