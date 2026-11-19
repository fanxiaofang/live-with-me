import * as THREE from 'three';

type Point=[number,number,number];
/** Carrier coordinates: X is forward, Y down, Z is the head's two sides.
 * Roots share fore/aft and height; leaf/branch directions are independent. */
export const DEER_EAR_ROOTS:Point[]=[[30,-97.2,2.4],[30,-97.2,-2.4]];
export const DEER_CROWN_ROOTS:Point[]=[[33,-98.6,2.15],[33,-98.6,-2.15]];
export const PAIRED_DEER_EARS=DEER_EAR_ROOTS.map((root,i)=>{
 const sign=i===0?1:-1,direction=new THREE.Vector3(i===0?-6:3,i===0?-14:-13.4,sign*(i===0?7.2:7.8));
 const axis=direction.clone().normalize(),across=new THREE.Vector3(.65,0,sign*.76);
 across.addScaledVector(axis,-across.dot(axis)).normalize();
 const normal=new THREE.Vector3().crossVectors(across,axis).normalize();
 return {root:new THREE.Vector3(...root),center:new THREE.Vector3(...root).addScaledVector(direction,.5),axis,across,normal,half:direction.length()*.5,width:i===0?2.6:2.5,depth:.9};
});
export function pairedEarPoint(ear:typeof PAIRED_DEER_EARS[number],phi:number,theta:number){
 return ear.center.clone().addScaledVector(ear.axis,-ear.half*Math.cos(phi))
  .addScaledVector(ear.across,ear.width*Math.sin(phi)*Math.cos(theta))
  .addScaledVector(ear.normal,ear.depth*Math.sin(phi)*Math.sin(theta));
}
export function pairedEarDistance(x:number,y:number,z:number){
 let distance=Infinity;
 for(const ear of PAIRED_DEER_EARS){
  const dx=x-ear.center.x,dy=y-ear.center.y,dz=z-ear.center.z;
  const u=(dx*ear.across.x+dy*ear.across.y+dz*ear.across.z)/ear.width,v=(dx*ear.axis.x+dy*ear.axis.y+dz*ear.axis.z)/ear.half,w=(dx*ear.normal.x+dy*ear.normal.y+dz*ear.normal.z)/ear.depth;
  const length=Math.sqrt(u*u+v*v+w*w),gradient=Math.sqrt((u/ear.width)**2+(v/ear.half)**2+(w/ear.depth)**2);
  distance=Math.min(distance,length*(length-1)/Math.max(gradient,.001));
 }
 return distance;
}

const beams:Point[][]=[
 [[0,0,0],[-1.5,-7.4,2.1],[-5,-17.4,8.5],[-7.5,-28.4,13]],
 [[-1.6,-8.4,2.4],[3,-13.4,7.5],[5,-20.4,10]],
 [[-5,-17.4,8.5],[-1.5,-22.4,14],[-2,-29.4,17]],
 [[-3.7,-14.4,6.8],[-12,-17.4,12],[-15,-23.4,15]],
];
export const PAIRED_DEER_ANTLERS:Point[][]=DEER_CROWN_ROOTS.flatMap((root,i)=>beams.map(points=>points.map(([x,y,z])=>{
 const sign=i===0?1:-1;
 // Slight beam-direction variation keeps the two crowns readable in profile;
 // it never offsets their anatomical roots along the skull.
 return [root[0]+x+sign*.10*z*(-y/29.4),root[1]+y,root[2]+sign*z] as Point;
})));
export const PAIRED_DEER_ANTLER_TIPS=[0,1,4,6].map(i=>PAIRED_DEER_ANTLERS[i].at(-1)!);

/** Preserve the original sweeping branches. Only the upper tips separate
 * slightly; tine joins project onto the parent without rebuilding their arc. */
export const NATURAL_DEER_ANTLERS:Point[][]=DEER_CROWN_ROOTS.flatMap((root,side)=>{
 const original=PAIRED_DEER_ANTLERS.slice(side*4,side*4+4);
 const upper=(point:Point,branch:number)=>{
  const h=THREE.MathUtils.smoothstep(root[1]-point[1],16,30),sign=side===0?1:-1;
  const height=branch===0?(side===0?-.25:.30):branch===2?(side===0?-.4:.5):0;
  return new THREE.Vector3(point[0]+sign*.25*h,point[1]+height*h,point[2]+sign*.35*h);
 };
 const main=original[0].map(p=>upper(p,0)),curve=new THREE.CatmullRomCurve3(main);
 const oldCurve=new THREE.CatmullRomCurve3(original[0].map(p=>new THREE.Vector3(...p)));
 const tines=original.slice(1).map((points,i)=>{
  const oldRoot=new THREE.Vector3(...points[0]);let closest=0,distance=Infinity;
  for(let step=0;step<=2000;step++){
   const d=oldCurve.getPoint(step/2000).distanceToSquared(oldRoot);
   if(d<distance){closest=step/2000;distance=d;}
  }
  const restored=points.map(p=>upper(p,i+1));restored[0]=curve.getPoint(closest);
  return restored.map(p=>p.toArray() as Point);
 });
 return [main.map(p=>p.toArray() as Point),...tines];
});
export const NATURAL_DEER_ANTLER_TIPS=[0,1,4,6].map(i=>NATURAL_DEER_ANTLERS[i].at(-1)!);
