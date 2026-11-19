import * as THREE from 'three';
import {smooth} from './spiritDeerRig';

/** Project continuous curves onto triangles, not onto their edges. A small
 * spatial grid is built once in the rest pose; it is never rebuilt per frame. */
export function deerSurfaceProjector(geometry:THREE.BufferGeometry){
 const p=geometry.getAttribute('position'),n=geometry.getAttribute('normal'),ix=geometry.index!,cell=4;
 const vertices=Array.from({length:p.count},(_,i)=>new THREE.Vector3().fromBufferAttribute(p,i));
 const grid=new Map<string,number[]>(),key=(x:number,y:number,z:number)=>`${x},${y},${z}`;
 for(let i=0;i<ix.count;i+=3){
  const tri=[vertices[ix.getX(i)],vertices[ix.getX(i+1)],vertices[ix.getX(i+2)]];
  const lo=tri[0].clone().min(tri[1]).min(tri[2]).divideScalar(cell).floor(),hi=tri[0].clone().max(tri[1]).max(tri[2]).divideScalar(cell).floor();
  for(let z=lo.z;z<=hi.z;z++)for(let y=lo.y;y<=hi.y;y++)for(let x=lo.x;x<=hi.x;x++){const k=key(x,y,z),list=grid.get(k)??[];list.push(i);grid.set(k,list);}
 }
 const triangle=new THREE.Triangle(),closest=new THREE.Vector3();
 return (point:THREE.Vector3)=>{
  const c=point.clone().divideScalar(cell).floor(),candidates=new Set<number>();
  for(let z=-1;z<=1;z++)for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++)for(const id of grid.get(key(c.x+x,c.y+y,c.z+z))??[])candidates.add(id);
  let best=Infinity,face=-1;const position=new THREE.Vector3();
  for(const id of candidates){triangle.set(vertices[ix.getX(id)],vertices[ix.getX(id+1)],vertices[ix.getX(id+2)]);triangle.closestPointToPoint(point,closest);const d=closest.distanceToSquared(point);if(d<best){best=d;face=id;position.copy(closest);}}
  if(face<0)throw new Error('Spirit surface guide outside attachment grid');
  const ids=[ix.getX(face),ix.getX(face+1),ix.getX(face+2)];triangle.set(vertices[ids[0]],vertices[ids[1]],vertices[ids[2]]);
  const bary=triangle.getBarycoord(position,new THREE.Vector3())!,normal=new THREE.Vector3();
  ids.forEach((id,i)=>normal.addScaledVector(new THREE.Vector3().fromBufferAttribute(n,id),bary.getComponent(i)));
  return {position,normal:normal.normalize(),ids,bary};
 };
}

export function createFlowingDeerSurface(geometry:THREE.BufferGeometry){
 const p=geometry.getAttribute('position'),project=deerSurfaceProjector(geometry);
 const positions:number[]=[],normals:number[]=[],strengths:number[]=[],phases:number[]=[],travel:number[]=[],dots:number[]=[],dotSeeds:number[]=[],triangleVertices:number[]=[],barycentric:number[]=[];
 let seed=739142;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(let i=0;i<1500;i++){const id=Math.floor(random()*p.count);dots.push(p.getX(id),p.getY(id),p.getZ(id));dotSeeds.push(random());}
 type Sample=ReturnType<typeof project>;
 const flow=(sample:Sample,phase:number)=>{
  const {position:q,normal}=sample;
  const neck=smooth((q.x-8)/15)*(1-smooth((q.y+77)/14)),leg=smooth((q.y+55)/14);
  const shoulder=Math.exp(-(((q.x-20)/10)**2))*smooth((q.y+66)/14);
  const haunch=Math.exp(-(((q.x+25)/12)**2))*smooth((q.y+62)/16);
  const d=new THREE.Vector3(-1,.12*Math.sin(q.x*.06+phase*.18),.05);
  d.lerp(new THREE.Vector3(-.42,.95,0),neck);
  d.lerp(new THREE.Vector3(.23,1,0),Math.max(leg,shoulder*.88,haunch*.9));
  d.addScaledVector(new THREE.Vector3().crossVectors(normal,d),.14*Math.sin(phase+q.x*.025+q.y*.018));
  return d.addScaledVector(normal,-d.dot(normal)).normalize();
 };
 for(let strand=0;strand<175;strand++){
  const id=Math.floor(random()*p.count),start=project(new THREE.Vector3().fromBufferAttribute(p,id)),phase=random()*Math.PI*2;
  const length=start.position.y<-87?13:start.position.y>-44?19:36+random()*17;
  const trace=(sign:number)=>{
   const points:Sample[]=[],steps=Math.ceil(length/1.1/2);let current=start,previous:THREE.Vector3|undefined;
   for(let j=0;j<steps;j++){
    const d=flow(current,phase).multiplyScalar(sign);if(previous)d.lerp(previous,.65).normalize();
    const next=project(current.position.clone().addScaledVector(d,.8));
    if(next.position.distanceTo(current.position)<.12||next.normal.dot(current.normal)<.35)break;
    points.push(next);previous=next.position.clone().sub(current.position).normalize();current=next;
   }
   return points;
  };
  const curve=[...trace(-1).reverse(),start,...trace(1)],strength=.32+random()*.35;
  for(let j=0;j<curve.length-1;j++)for(const k of [j,j+1]){
   const s=curve[k];positions.push(...s.position.toArray());normals.push(...s.normal.toArray());triangleVertices.push(...s.ids);barycentric.push(...s.bary.toArray());
   strengths.push(strength);phases.push(phase);travel.push(k/(curve.length-1));
  }
 }
 return {positions,normals,strengths,phases,travel,dots,dotSeeds,triangleVertices,barycentric};
}

/** Sparse dorsal wisps. Each strand has a single attached root and a curved
 * rest offset; wind is applied only to the tip after root skinning. */
export function createDeerContourWisps(geometry:THREE.BufferGeometry){
 const project=deerSurfaceProjector(geometry),roots:number[]=[],offsets:number[]=[],normals:number[]=[],travel:number[]=[],phases:number[]=[],strengths:number[]=[];
 const guides=[
  {a:new THREE.Vector3(24,-87,0),b:new THREE.Vector3(9,-73,0),count:13,length:15},
  {a:new THREE.Vector3(8,-72,0),b:new THREE.Vector3(-8,-69,0),count:6,length:9},
  {a:new THREE.Vector3(-37,-60,0),b:new THREE.Vector3(-41,-56,0),count:6,length:8},
 ];
 let seed=1829;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 for(const guide of guides)for(let i=0;i<guide.count;i++){
  const t=(i+.2+random()*.6)/guide.count,root=project(guide.a.clone().lerp(guide.b,t).add(new THREE.Vector3(0,0,(random()-.5)*4)));
  const phase=random()*Math.PI*2,length=guide.length*(.65+random()*.65),tail=guide===guides[2],strength=.34+random()*.1;
  // Leave the root outward from the surface, then comb backward/down toward
  // the shoulder. Upward straight rays read as bristles rather than silk.
  const control=root.normal.clone().multiplyScalar(length*.28).add(new THREE.Vector3(-length*.12,0,0));
  const end=new THREE.Vector3(-length,tail?-length*.16:length*.26,(random()-.5)*length*.25);
  for(let j=0;j<22;j++)for(const u of [j/22,(j+1)/22]){
   const offset=control.clone().multiplyScalar(2*(1-u)*u).addScaledVector(end,u*u);
   roots.push(...root.position.toArray());offsets.push(...offset.toArray());normals.push(...root.normal.toArray());travel.push(u);phases.push(phase);strengths.push(strength);
  }
 }
 return {roots,offsets,normals,travel,phases,strengths};
}
