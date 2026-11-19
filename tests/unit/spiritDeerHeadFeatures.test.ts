import assert from 'node:assert/strict';
import {test,after} from 'node:test';
import * as THREE from 'three';
import {DEER_EAR_ROOTS,DEER_CROWN_ROOTS,PAIRED_DEER_ANTLERS,PAIRED_DEER_ANTLER_TIPS,NATURAL_DEER_ANTLERS,NATURAL_DEER_ANTLER_TIPS} from '../../src/components/scenery/yorkshire/dressing/spiritDeerHeadFeatures';
import {deerModelGeometry,deerModelWeights} from '../../src/components/scenery/yorkshire/dressing/spiritDeerModel';
import {deerDistance} from '../../src/components/scenery/yorkshire/dressing/spiritDeerShape3D';
import {addAntlerFibers} from '../../src/components/scenery/yorkshire/dressing/spiritDeerAntlers';
import {createSpiritPatrol} from '../../src/components/scenery/yorkshire/dressing/spiritDeerPatrol';

const geometry=deerModelGeometry(true,true,true);after(()=>geometry.dispose());
test('角耳根在颅骨左右成对、连入头部，并随同一头骨绑定',()=>{
 for(const roots of [DEER_EAR_ROOTS,DEER_CROWN_ROOTS]){
  assert.equal(roots[0][0],roots[1][0]);assert.equal(roots[0][1],roots[1][1]);assert.equal(roots[0][2],-roots[1][2]);
  for(const root of roots){assert.ok(deerDistance(...root,true,true)<0,'root is outside the skull');const w=deerModelWeights(new THREE.Vector3(...root));assert.ok(w.weights[w.indices.indexOf(19)]>.99,'appendage is not on the head control');}
 }
 assert.deepEqual(PAIRED_DEER_ANTLERS[0][0],DEER_CROWN_ROOTS[0]);assert.deepEqual(PAIRED_DEER_ANTLERS[4][0],DEER_CROWN_ROOTS[1]);
});
test('新耳部仍与主模型连通，躯干和吻端顶点保留，耳面光丝贴合同一曲面',()=>{
 const old=deerModelGeometry(true,true),a=old.getAttribute('position'),p=geometry.getAttribute('position'),ix=geometry.index!,key=(q:THREE.Vector3)=>q.toArray().map(v=>v.toFixed(4)).join(',');
 const protectedRegion=(q:THREE.Vector3)=>q.y>-91||q.x>43&&q.y>-96,points=new Set<string>(),before:THREE.Vector3[]=[];
 for(let i=0;i<a.count;i++){const q=new THREE.Vector3().fromBufferAttribute(a,i);if(protectedRegion(q)){points.add(key(q));before.push(q);}}
 // Four local fairing passes can propagate sub-thousandth-unit differences
 // into the adjacent neck ring; this tolerance is below a display pixel.
 let checked=0;for(let i=0;i<p.count;i++){const q=new THREE.Vector3().fromBufferAttribute(p,i);if(protectedRegion(q)){if(!points.has(key(q)))assert.ok(Math.min(...before.map(v=>v.distanceToSquared(q)))<1e-6,'body or muzzle changed at '+key(q));checked++;}}assert.ok(checked>1000);
 const parent=Array.from({length:p.count},(_,i)=>i),find=(i:number):number=>parent[i]===i?i:(parent[i]=find(parent[i]));
 for(let i=0;i<ix.count;i+=3){const a=find(ix.getX(i));parent[find(ix.getX(i+1))]=a;parent[find(ix.getX(i+2))]=a;}assert.equal(new Set(parent.map((_,i)=>find(i))).size,1,'ear is detached from the skull');
 const surface={positions:[],normals:[],strengths:[],phases:[],travel:[],dots:[],dotSeeds:[],triangleVertices:[],barycentric:[]} as ReturnType<typeof import('../../src/components/scenery/yorkshire/dressing/spiritDeerModel').createDeerModelSurface>;
 addAntlerFibers(surface,true,true);
 for(let i=0;i<2*6*36*2;i+=17){const q=surface.positions.slice(i*3,i*3+3);assert.ok(deerDistance(q[0],q[1],q[2],true,true)<1e-6,'ear light uses a different shape');}
 old.dispose();
});
test('舒展角枝保留根部与原有弧线，分叉贴合主枝，仅上部少量错落',()=>{
 for(let side=0;side<2;side++){
  const main=NATURAL_DEER_ANTLERS[side*4],curve=new THREE.CatmullRomCurve3(main.map(p=>new THREE.Vector3(...p))),old=new THREE.CatmullRomCurve3(PAIRED_DEER_ANTLERS[side*4].map(p=>new THREE.Vector3(...p)));
  assert.deepEqual(main[0],DEER_CROWN_ROOTS[side]);assert.ok(curve.getLength()/old.getLength()>.85&&curve.getLength()/old.getLength()<1.15);
  const samples=Array.from({length:1001},(_,i)=>curve.getPoint(i/1000));
  for(let branch=1;branch<4;branch++){const root=new THREE.Vector3(...NATURAL_DEER_ANTLERS[side*4+branch][0]);assert.ok(Math.min(...samples.map(p=>p.distanceTo(root)))<.03,'tine floats away from its beam');}
 }
 for(let branch=0;branch<4;branch++){
  const a=NATURAL_DEER_ANTLERS[branch].at(-1)!,b=NATURAL_DEER_ANTLERS[branch+4].at(-1)!;
  assert.ok(a[2]>0&&b[2]<0,'side identity crossed the skull center');
  for(const index of [branch,branch+4]){
   const current=NATURAL_DEER_ANTLERS[index],original=PAIRED_DEER_ANTLERS[index];
   for(let point=1;point<current.length;point++)assert.ok(new THREE.Vector3(...current[point]).distanceTo(new THREE.Vector3(...original[point]))<.7,'original branch arc was redesigned');
  }
 }
 assert.ok(Math.abs(NATURAL_DEER_ANTLERS[2].at(-1)![1]-NATURAL_DEER_ANTLERS[6].at(-1)![1])>.5,'upper tine lost its restrained height difference');
});
