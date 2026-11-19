import * as THREE from 'three';

const smooth=(a:number,b:number,v:number)=>{const t=THREE.MathUtils.clamp((v-a)/(b-a),0,1);return t*t*(3-2*t);};

/** Upper rest-space envelope for the small back-to-neck strip, before ears.
 * Intersect triangles rather than selecting an arbitrary nearest vertex. */
function crownAtX(geometry:THREE.BufferGeometry,x:number){
 const p=geometry.getAttribute('position'),index=geometry.index!;let top=Infinity;
 for(let t=0;t<index.count;t+=3)for(let k=0;k<3;k++){
  const a=index.getX(t+k),b=index.getX(t+(k+1)%3),ax=p.getX(a),bx=p.getX(b);
  if((ax<=x&&bx>x)||(bx<=x&&ax>x)){
   const f=(x-ax)/(bx-ax);top=Math.min(top,p.getY(a)+(p.getY(b)-p.getY(a))*f);
  }
 }
 return top;
}

/** Approved correction: fair the two dorsal neckline joins selected by the
 * user. Never touches the front of the neck, head, chest, legs, tail or rig.
 * Use the existing vertices and binding; no new body volume/material layers. */
export function refineDeerNeckContour(geometry:THREE.BufferGeometry){
 const p=geometry.getAttribute('position'),index=geometry.index;
 if(!index)throw new Error('Neck contour preview requires indexed original mesh');
 const original=Float32Array.from(p.array),weights=new Float32Array(p.count);
 // v33: the user marked a shallow saddle followed by a convex shoulder lump.
 // Edge fairing alone leaves both intact. Establish one rising reference
 // envelope and explicitly fill/trim the two deviations in a dorsal cap.
 const samples=Array.from({length:61},(_,i)=>crownAtX(geometry,-8+i*.5));
 const crown=(x:number)=>{const u=THREE.MathUtils.clamp((x+8)*2,0,60),i=Math.min(59,Math.floor(u));return THREE.MathUtils.lerp(samples[i],samples[i+1],u-i);};
 const start=crown(-6),end=crown(22);
 const neighbors=Array.from({length:p.count},()=>new Set<number>());
 for(let t=0;t<index.count;t+=3){const a=index.getX(t),b=index.getX(t+1),c=index.getX(t+2);neighbors[a].add(b).add(c);neighbors[b].add(a).add(c);neighbors[c].add(a).add(b);}
 for(let i=0;i<p.count;i++){
  const x=p.getX(i),y=p.getY(i),axisX=17+(-y-61)*.45;
  const ends=smooth(-98,-94,y)*(1-smooth(-68,-65,y))*smooth(-4,1,x);
  const dorsal=1-smooth(axisX-2,axisX+1.5,x);
  // Keep the earlier upper-neck refinement; lower-neck topology now follows
  // the explicit reference rather than another pass of generic fairing.
  weights[i]=ends*dorsal*(1-smooth(-84,-79,y));
 }
 let current=Float32Array.from(original);
 // Slightly shrink-resistant paired fairing. Blend masks are fixed in rest
 // coordinates; depth is deliberately preserved to limit thickness changes.
 for(let pass=0;pass<12;pass++)for(const amount of [.48,-.40]){
  const next=Float32Array.from(current);
  for(let i=0;i<p.count;i++){
   if(weights[i]<1e-6||!neighbors[i].size)continue;
   for(const axis of [0,1]){
    let mean=0;for(const j of neighbors[i])mean+=current[j*3+axis];mean/=neighbors[i].size;
    next[i*3+axis]+=amount*weights[i]*(mean-current[i*3+axis]);
   }
  }
  current=next;
 }
 let changedVertices=0,maxDisplacement=0;
 for(let i=0;i<p.count;i++){
  let dx=current[i*3]-original[i*3],dy=current[i*3+1]-original[i*3+1];
  const x=original[i*3],y=original[i*3+1];
  if(x>-8&&x<22){
   const oldTop=crown(x),t=THREE.MathUtils.clamp((x+6)/28,0,1);
   const target=THREE.MathUtils.lerp(start,end,t**3.25);
   const cap=(1-smooth(.35,4.5,y-oldTop))*(1-smooth(-66,-64,y));
   const ends=smooth(-8,-5,x)*(1-smooth(17,22,x));
   dy+=(target-oldTop)*cap*ends;
  }
  const length=Math.hypot(dx,dy),limit=2.5;
  if(length>limit){dx*=limit/length;dy*=limit/length;}
  const displacement=Math.hypot(dx,dy);if(displacement>1e-6)changedVertices++;
  maxDisplacement=Math.max(maxDisplacement,displacement);
  p.setXYZ(i,original[i*3]+dx,original[i*3+1]+dy,original[i*3+2]);
 }
 p.needsUpdate=true;geometry.computeVertexNormals();geometry.computeBoundingSphere();
 return {changedVertices,maxDisplacement,depthChanged:false,bindingChanged:false};
}
