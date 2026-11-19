import * as THREE from 'three';

const smooth=(t:number)=>{const v=THREE.MathUtils.clamp(t,0,1);return v*v*(3-2*v);};

/** Approved tail correction on the existing closed, bound mesh. The entire rump
 * and tail root at x >= -39 are protected. No extra fibers/material/rig. */
export function refineDeerTailContour(geometry:THREE.BufferGeometry){
 const p=geometry.getAttribute('position'),index=geometry.index;
 if(!index)throw new Error('Tail correction requires the indexed original mesh');
 const rootX=-39;let endX=rootX;
 for(let i=0;i<p.count;i++)endX=Math.min(endX,p.getX(i));
 const length=rootX-endX;if(length<5)throw new Error('Original tail span not found');
 const sections=Array.from({length:81},(_,i)=>{
  const x=rootX-length*i/80+ (i===80?1e-5:0);let lo=Infinity,hi=-Infinity;
  for(let t=0;t<index.count;t+=3)for(let k=0;k<3;k++){
   const a=index.getX(t+k),b=index.getX(t+(k+1)%3),ax=p.getX(a),bx=p.getX(b);
   if((ax<=x&&bx>x)||(bx<=x&&ax>x)){
    const f=(x-ax)/(bx-ax),y=p.getY(a)+(p.getY(b)-p.getY(a))*f;
    lo=Math.min(lo,y);hi=Math.max(hi,y);
   }
  }
  if(!Number.isFinite(lo)||!Number.isFinite(hi))throw new Error('Open tail section');
  return {center:(lo+hi)/2,radius:Math.max(.05,(hi-lo)/2)};
 });
 const root=sections[0];let changedVertices=0,maxDisplacement=0;
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),z=p.getZ(i);if(x>=rootX)continue;
  const t=THREE.MathUtils.clamp((rootX-x)/length,0,1),u=t*80,j=Math.min(79,Math.floor(u)),f=u-j;
  const center=THREE.MathUtils.lerp(sections[j].center,sections[j+1].center,f);
  const radius=THREE.MathUtils.lerp(sections[j].radius,sections[j+1].radius,f);
  // Smoothly leave the root, then gradually settle downward. A full-length
  // centerline replaces the old straight segments plus distal-only bend.
  const targetCenter=root.center+1.8*t+4*t*t;
  // A small, rounded middle and gradual taper, with a positive scale at the
  // tip: keep the original closed topology instead of collapsing a ring.
  const targetRadius=root.radius*(1-t)**.65+1.2*Math.sin(Math.PI*t)**1.4;
  const widthScale=THREE.MathUtils.clamp(targetRadius/radius,.45,1.18);
  const blend=smooth((rootX-x)/1.8);
  const nextY=THREE.MathUtils.lerp(y,targetCenter+(y-center)*widthScale,blend);
  const nextZ=z*(1-blend*.18*t**1.5),distance=Math.hypot(nextY-y,nextZ-z);
  if(distance>1e-6)changedVertices++;maxDisplacement=Math.max(maxDisplacement,distance);
  p.setXYZ(i,x,nextY,nextZ);
 }
 p.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere();
 return {changedVertices,maxDisplacement,tailSpan:length,lengthChanged:false,rootChanged:false,bindingChanged:false};
}
