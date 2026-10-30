import * as THREE from 'three';
export const SEGMENTS=192,ROWS=12,BOTTOM=-3;
// Shape-preserving cubic Hermite, harmonic slopes prevent overshoot at shoulders/valleys.
export function ridgeAt(points,x){
 let i=0;while(i<points.length-2&&x>points[i+1].x)i++;
 const a=points[i],b=points[i+1],h=b.x-a.x;
 const slope=j=>(points[j+1].y-points[j].y)/(points[j+1].x-points[j].x);
 const tangent=j=>{if(j===0||j===points.length-1)return 0;const d0=slope(j-1),d1=slope(j);if(d0*d1<=0)return 0;const h0=points[j].x-points[j-1].x,h1=points[j+1].x-points[j].x;const w1=2*h1+h0,w2=h1+2*h0;return(w1+w2)/(w1/d0+w2/d1);};
 const t=Math.max(0,Math.min(1,(x-a.x)/h)),t2=t*t,t3=t2*t;
 return(2*t3-3*t2+1)*a.y+(t3-2*t2+t)*h*tangent(i)+(-2*t3+3*t2)*b.y+(t3-t2)*h*tangent(i+1);
}
export function makeRidgeGeometry(points){
 const pos=[],index=[],ridge=[];
 for(let x=0;x<=SEGMENTS;x++){
  const px=-4+8*x/SEGMENTS,top=ridgeAt(points,px);
  for(let y=0;y<=ROWS;y++){
   // concentrate rows in the visible air/lighting region; deep skirt needs one interval
   const py=y===ROWS?BOTTOM:top-(y/(ROWS-1))*.8;
   pos.push(px,py,0);ridge.push(top);
  }
 }
 for(let x=0;x<SEGMENTS;x++)for(let y=0;y<ROWS;y++){
  const a=x*(ROWS+1)+y,b=a+ROWS+1;index.push(a,a+1,b,b,a+1,b+1);
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));
 g.setAttribute('aRidgeHeight',new THREE.Float32BufferAttribute(ridge,1));
 g.setAttribute('color',new THREE.Float32BufferAttribute(new Float32Array(pos.length),3));g.setIndex(index);g.computeBoundingSphere();return g;
}
