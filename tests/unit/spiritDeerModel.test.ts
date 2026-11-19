import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {deerModelGeometry,createDeerSkeleton,skinModelPoint,createDeerModelSurface,deerSurfaceBinding} from '../../src/components/scenery/yorkshire/dressing/spiritDeerModel';
import {createSpiritPatrol} from '../../src/components/scenery/yorkshire/dressing/spiritDeerPatrol';
import {DEER_BONE_COUNT} from '../../src/components/scenery/yorkshire/dressing/spiritDeerRig';
import {DEER_SHOULDERS,DEER_SCAPULAE,DEER_LEGS,vector} from '../../src/components/scenery/yorkshire/dressing/spiritDeerRig';
import {createDeerFrameGate} from '../../src/components/scenery/yorkshire/dressing/spiritDeerFrameGate';
import {createDissolveAnchors,freezeDissolveAnchors} from '../../src/components/scenery/yorkshire/dressing/spiritDeerDissolve';
import {createDeerContourWisps} from '../../src/components/scenery/yorkshire/dressing/spiritDeerSurface';
import {SPIRIT_BOUNDS} from '../../src/components/scenery/yorkshire/dressing/spiritDeerShape3D';

test('主网格权重归一、四肢连接连续，真实骨架与表面CPU采样一致',()=>{
 const geometry=deerModelGeometry(),p=geometry.getAttribute('position'),si=geometry.getAttribute('skinIndex'),sw=geometry.getAttribute('skinWeight'),tri=geometry.index!;
 const parent=Array.from({length:p.count},(_,i)=>i),find=(i:number):number=>parent[i]===i?i:(parent[i]=find(parent[i]));
 for(let i=0;i<tri.count;i+=3){const a=find(tri.getX(i));parent[find(tri.getX(i+1))]=a;parent[find(tri.getX(i+2))]=a;}
 const groups=new Map<number,number>();parent.forEach((_,i)=>{const r=find(i);groups.set(r,(groups.get(r)??0)+1);});
 assert.equal(groups.size,1,'master surface has detached body parts');
 for(let i=0;i<p.count;i++){let sum=0;for(let k=0;k<4;k++){assert.ok(si.getComponent(i,k)<DEER_BONE_COUNT);sum+=sw.getComponent(i,k);}assert.ok(Math.abs(sum-1)<1e-6);}
 const rig=createDeerSkeleton(),mesh=new THREE.SkinnedMesh(geometry,new THREE.MeshBasicMaterial());mesh.add(rig.root);mesh.bind(rig.skeleton);
 const patrol=createSpiritPatrol();
 for(const time of [0,23.08,24,30.23,51,51.6]){
  const pose=patrol.sample(time);rig.update(pose.bones);
  [1,3].forEach((leg,side)=>{
   const elbow=vector(DEER_LEGS[leg].hip).applyMatrix4(pose.bones[26+side]);
   assert.ok(elbow.distanceTo(vector(pose.joints[leg*4]))<1e-8,'humerus does not join the elbow');
   const shoulder=vector(DEER_SHOULDERS[side]).applyMatrix4(pose.bones[26+side]);
   assert.ok(shoulder.distanceTo(vector(DEER_SHOULDERS[side]).applyMatrix4(pose.bones[28+side]))<1e-8,'scapula/humerus junction separates');
   const top=vector(DEER_SCAPULAE[side]).applyMatrix4(pose.bones[28+side]);
   assert.ok(Math.abs(top.distanceTo(shoulder)-vector(DEER_SCAPULAE[side]).distanceTo(vector(DEER_SHOULDERS[side])))<1e-8);
  });
  for(let i=0;i<p.count;i+=131){const point=new THREE.Vector3().fromBufferAttribute(p,i),indices=Array.from({length:4},(_,k)=>si.getComponent(i,k)),weights=Array.from({length:4},(_,k)=>sw.getComponent(i,k));
   assert.ok(mesh.applyBoneTransform(i,point.clone()).distanceTo(skinModelPoint(point,pose.bones,indices,weights))<1e-5,'mesh and effects use different deformation');}
 }
 assert.ok(rig.skeleton.getBoneByName('humerus_near'));assert.ok(rig.skeleton.getBoneByName('scapula_far'));
 rig.skeleton.dispose();geometry.dispose();(mesh.material as THREE.Material).dispose();
});

test('连续光丝在主三角面内，具有长弧和面内插值，消散仍使用同源蒙皮',()=>{
 const g=deerModelGeometry(),surface=createDeerModelSurface(g),pos=g.getAttribute('position');
 let interior=0,longest=0,length=0;
 for(let i=0;i<surface.positions.length;i+=3){
  const expected=new THREE.Vector3();let sum=0;
  for(let k=0;k<3;k++){const w=surface.barycentric[i+k];assert.ok(w>=-1e-6&&w<=1+1e-6);sum+=w;expected.addScaledVector(new THREE.Vector3().fromBufferAttribute(pos,surface.triangleVertices[i+k]),w);}
  assert.ok(Math.abs(sum-1)<1e-6);assert.ok(expected.distanceTo(new THREE.Vector3().fromArray(surface.positions,i))<1e-5);
  if(surface.barycentric[i]>.01&&surface.barycentric[i+1]>.01&&surface.barycentric[i+2]>.01)interior++;
  if(i%6===0)length+=new THREE.Vector3().fromArray(surface.positions,i).distanceTo(new THREE.Vector3().fromArray(surface.positions,i+3));
  if(surface.travel[i/3]===1){longest=Math.max(longest,length);length=0;}
 }
 assert.ok(interior>surface.positions.length/3*.3,'curves still snap to mesh edges');assert.ok(longest>28,'no long body arcs');
 const lines=deerSurfaceBinding(surface.positions),dots=deerSurfaceBinding(surface.dots);
 const anchors=createDissolveAnchors({...surface,skinIndices:lines.indices,skinWeights:lines.weights,dotSkinIndices:dots.indices,dotSkinWeights:dots.weights});
 const pose=createSpiritPatrol().sample(24),frozen=freezeDissolveAnchors(anchors,pose.bones,0,0,0);
 for(let i=0;i<anchors.positions.length;i+=3){const point=new THREE.Vector3().fromArray(anchors.positions,i),index=i/3*4,expected=skinModelPoint(point,pose.bones,anchors.indices.slice(index,index+4),anchors.weights.slice(index,index+4));assert.ok(expected.distanceTo(new THREE.Vector3().fromArray(frozen.from,i))<1e-8);}
 g.dispose();
});

test('颈背灵丝稀疏、根部连续，细丝和末端摆动不会越过渲染边界',()=>{
 const g=deerModelGeometry(),wisps=createDeerContourWisps(g),patrol=createSpiritPatrol();
 assert.equal(wisps.roots.length/3,25*44);
 for(const t of [0,6,24,30.23,51]){
  const pose=patrol.sample(t),binding=deerSurfaceBinding(wisps.roots);
  for(let i=0;i<wisps.roots.length;i+=3){
   const j=i/3,root=new THREE.Vector3().fromArray(wisps.roots,i),offset=new THREE.Vector3().fromArray(wisps.offsets,i);
   if(wisps.travel[j]===0)assert.equal(offset.length(),0,'root can drift');
   const index=j*4,point=skinModelPoint(root.clone().add(offset),pose.bones,binding.indices.slice(index,index+4),binding.weights.slice(index,index+4));
   point.applyAxisAngle(new THREE.Vector3(0,1,0),pose.yaw);point.y+=pose.bob+point.z*.285;
   assert.ok(point.x>SPIRIT_BOUNDS.x+2&&point.x<SPIRIT_BOUNDS.x+SPIRIT_BOUNDS.width-2);
   assert.ok(point.y>SPIRIT_BOUNDS.y+2&&point.y<SPIRIT_BOUNDS.y+SPIRIT_BOUNDS.height-2);
  }
 }
 g.dispose();
});

test('绘制门控保留时间余量，60/120/144Hz下均以30帧目标调度',()=>{
 for(const hz of [60,120,144]){const gate=createDeerFrameGate(),draws:number[]=[];for(let i=0;i<hz*10;i++)if(gate.ready(i*1000/hz))draws.push(i*1000/hz);assert.ok(draws.length>=299&&draws.length<=301);}
});

test('慢步承重连续归一，抬起的脚不分担支撑',()=>{
 const patrol=createSpiritPatrol();let last:number[]|undefined;
 for(let i=0;i<720;i++){
  const p=patrol.sample(22+i/120);assert.ok(Math.abs(p.contactWeights.reduce((a,b)=>a+b,0)-1)<1e-8);
  p.contactWeights.forEach((w,leg)=>{assert.ok(w>=0&&w<=1);if(p.swinging[leg])assert.equal(w,0);if(last)assert.ok(Math.abs(w-last[leg])<.13,'load transfers abruptly');});last=p.contactWeights;
 }
});

test('原生灵体修订保留头脸，臀尾连续且尾尖有明确延伸',()=>{
 const old=deerModelGeometry(),geometry=deerModelGeometry(true),p=geometry.getAttribute('position'),before=old.getAttribute('position'),ix=geometry.index!;
 const key=(a:THREE.BufferAttribute|THREE.InterleavedBufferAttribute,i:number)=>[a.getX(i),a.getY(i),a.getZ(i)].map(x=>x.toFixed(5)).join(',');
 const head=new Set<string>();for(let i=0;i<before.count;i++)if(before.getY(i)<-84&&before.getX(i)>10)head.add(key(before,i));
 let checked=0;for(let i=0;i<p.count;i++)if(p.getY(i)<-84&&p.getX(i)>10){assert.ok(head.has(key(p,i)),'head silhouette changed');checked++;}assert.ok(checked>100);
 const tail=(a:typeof p)=>Math.min(...Array.from({length:a.count},(_,i)=>a.getX(i)));assert.ok(tail(p)<tail(before)-6,'tail remains a short nub');
 const parent=Array.from({length:p.count},(_,i)=>i),find=(i:number):number=>parent[i]===i?i:(parent[i]=find(parent[i]));
 for(let i=0;i<ix.count;i+=3){const a=find(ix.getX(i));parent[find(ix.getX(i+1))]=a;parent[find(ix.getX(i+2))]=a;}
 assert.equal(new Set(parent.map((_,i)=>find(i))).size,1,'tail or body became detached');
 geometry.dispose();old.dispose();
});

test('原生慢走不由支撑腿压低整身，颈部两端连续且肩胛链保长',()=>{
 const patrol=createSpiritPatrol(undefined,true);let worst=0,last:ReturnType<typeof patrol.sample>|undefined;
 for(const start of [18,47])for(let frame=0;frame<24*60;frame++){
  const p=patrol.sample(start+frame/60);assert.equal(p.hop.active,false);assert.ok(p.bob>=0&&p.bob<.13,'torso drops to satisfy a planted foot');
  worst=Math.max(worst,...p.reachErrors);
  const top=new THREE.Vector3(27,-90,0);assert.ok(top.clone().applyMatrix4(p.bones[18]).distanceTo(top.clone().applyMatrix4(p.bones[19]))<1e-9,'neck separates from head');
  const base=new THREE.Vector3(21,-72,0);assert.ok(base.clone().applyMatrix4(p.bones[18]).distanceTo(base.clone().applyMatrix4(p.bones[17]))<1e-9,'neck separates from chest');
  [1,3].forEach((leg,side)=>{const top=vector(DEER_SCAPULAE[side]).applyMatrix4(p.bones[28+side]),shoulder=vector(DEER_SHOULDERS[side]).applyMatrix4(p.bones[28+side]),elbow=vector(DEER_LEGS[leg].hip).applyMatrix4(p.bones[26+side]);assert.ok(Math.abs(top.distanceTo(shoulder)-vector(DEER_SCAPULAE[side]).distanceTo(vector(DEER_SHOULDERS[side])))<1e-8);assert.ok(Math.abs(shoulder.distanceTo(elbow)-vector(DEER_SHOULDERS[side]).distanceTo(vector(DEER_LEGS[leg].hip)))<1e-8);});
  if(last&&p.state===last.state&&p.walkTime>0)p.feet.forEach((foot,i)=>{if(!p.swinging[i]&&!last!.swinging[i])assert.ok(vector(foot).distanceTo(vector(last!.feet[i]))<1e-6,'contact slips');});
  last=p;
 }
 assert.ok(worst<.18,`contact residual ${worst}`);
});
