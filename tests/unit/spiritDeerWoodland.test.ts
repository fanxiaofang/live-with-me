import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createSpiritPatrol,patrolRoute} from '../../src/components/scenery/yorkshire/dressing/spiritDeerPatrol';
import {createWoodlandSpiritAura,woodlandSpiritStage} from '../../src/components/scenery/yorkshire/dressing/spiritDeerWoodland';
import {DEER_GROUND_RATIO} from '../../src/components/scenery/yorkshire/dressing/spiritDeerRig';

test('D 单独模式只有叶灵、蝶光及飞行尾迹，没有星屑槽位',()=>{
 const aura=createWoodlandSpiritAura(patrolRoute,{ritual:false}),patrol=createSpiritPatrol(undefined,true);let leaves=0,butterflies=0,trails=0;
 for(const t of [6,9,12,24,29,55,61]){
  aura.sample(patrol.sample(t));const p=aura.spirits;
  for(let i=0;i<p.serials.length;i++)if(p.alphas[i*4]>.001){
   const kind=p.kinds[i*4];assert.ok(kind===0||kind===.25||kind===1||kind===6);
   if(kind<.5)leaves++;else if(kind===1)butterflies++;else trails++;
  }
 }
 assert.ok(leaves>10&&butterflies>5&&trails>50);assert.equal(aura.ribbons,undefined);
});

test('D 叶灵独立漂移且尾迹对应真实过去位置，连续帧不跳动',()=>{
 const aura=createWoodlandSpiritAura(patrolRoute,{ritual:false}),patrol=createSpiritPatrol(undefined,true);
 aura.sample(patrol.sample(9));const before=aura.spirits.positions.slice(),ids=aura.spirits.serials.slice();
 aura.sample(patrol.sample(9.3));assert.ok(Array.from({length:6},(_,i)=>i).some(i=>ids[i]>=0&&ids[i]===aura.spirits.serials[i]&&Math.hypot(...[0,1,2].map(k=>before[i*12+k]-aura.spirits.positions[i*12+k]))>.4));
 const pose=patrol.sample(24);aura.sample(pose);const current=aura.spirits.positions.slice(),currentIds=aura.spirits.serials.slice();
 aura.sample(patrol.sample(24+1/30));let shared=0;
 for(let i=0;i<9;i++)if(currentIds[i]>=0&&currentIds[i]===aura.spirits.serials[i]){assert.ok(Math.hypot(...[0,1,2].map(k=>current[i*12+k]-aura.spirits.positions[i*12+k]))<1.6);shared++;}
 assert.ok(shared>2);
 const lag=2.1*3.5/16,pastPose=patrol.sample(24-lag);aura.sample(pastPose);const past=aura.spirits.positions.slice(),pastIds=aura.spirits.serials.slice();aura.sample(pose);let histories=0;
 for(let i=0;i<6;i++){
  const trail=9+i*16+3;if(currentIds[i]<0||pastIds[i]!==currentIds[i]||aura.spirits.alphas[trail*4]<.01)continue;
  const a=[past[i*12]+pastPose.x,past[i*12+1],past[i*12+2]+pastPose.y/DEER_GROUND_RATIO];
  const b=[aura.spirits.positions[trail*12]+pose.x,aura.spirits.positions[trail*12+1],aura.spirits.positions[trail*12+2]+pose.y/DEER_GROUND_RATIO];
  const distance=Math.hypot(...a.map((v,k)=>v-b[k]));if(distance<.12)histories++;
 }
 assert.ok(histories>0,'尾迹应来自叶灵实际飞过的位置');
});

test('D 空窗、重置和逆序采样不会留下叶片或尾迹',()=>{
 const aura=createWoodlandSpiritAura(patrolRoute,{ritual:false}),patrol=createSpiritPatrol(undefined,true);
 aura.sample(patrol.sample(24));const p=aura.spirits.positions.slice(),a=aura.spirits.alphas.slice();
 aura.sample(patrol.sample(60));aura.sample(patrol.sample(24));assert.deepEqual(aura.spirits.positions,p);assert.deepEqual(aura.spirits.alphas,a);
 for(const t of [42,43.5,71,72.5,132]){assert.deepEqual(aura.sample(patrol.sample(t)),{spirits:0});assert.ok(aura.spirits.alphas.every(v=>v===0));}
 aura.sample(patrol.sample(24));aura.reset();assert.ok(aura.spirits.alphas.every(v=>v===0)&&aura.spirits.serials.every(v=>v<0));
});

test('灵息只在到来和离场窗口出现，日常巡视与真正空窗保持安静',()=>{
 const aura=createWoodlandSpiritAura(patrolRoute),patrol=createSpiritPatrol(undefined,true);
 for(const t of [3.1,9,18,24,38.4,44.1,44.9,50,60,67.4,73.1,73.9,79,100,132]){
  assert.equal(woodlandSpiritStage(t),undefined,`意外窗口 ${t}`);assert.equal(aura.sample(patrol.sample(t)).spirits,0);
 }
 for(const t of [.2,1.9,38.9,40.5,42.5,43.5,45.5,47.5,48.8,67.9,70,71.5,72.5,74.5,77]){
  assert.ok(woodlandSpiritStage(t)!.strength>0,`缺失窗口 ${t}`);assert.ok(aura.sample(patrol.sample(t)).spirits>0);
 }
 const context={reveal:.6,arrivalAge:-1};assert.ok(aura.sample(patrol.sample(0),context).spirits>0);
 assert.ok(aura.sample(patrol.sample(0),{reveal:1,arrivalAge:1.9}).spirits>0);
 assert.equal(aura.sample(patrol.sample(0),{reveal:1,arrivalAge:3.1}).spirits,0);
 assert.equal(aura.sample(patrol.sample(40),{reveal:1,arrivalAge:40,paused:true}).spirits,0);
});

test('鹿完全消散后保留两秒灵息，隐身转向时世界位置连续',()=>{
 const aura=createWoodlandSpiritAura(patrolRoute),patrol=createSpiritPatrol(undefined,true);
 for(const t of [42.8,71.8]){const pose=patrol.sample(t);assert.equal(pose.visibility,0);assert.ok(aura.sample(pose).spirits>0);assert.ok(aura.spirits.alphas.some(v=>v>.01));}
 for(const mid of [43.5,72.5]){
  const a=patrol.sample(mid-.01);aura.sample(a);const positions=aura.spirits.positions.slice(),ids=aura.spirits.serials.slice();
  const b=patrol.sample(mid+.01);aura.sample(b);let shared=0;
  for(let i=0;i<9;i++)if(ids[i]>=0&&ids[i]===aura.spirits.serials[i]){
   const j=i*12,dx=positions[j]+a.x-aura.spirits.positions[j]-b.x,dy=positions[j+1]-aura.spirits.positions[j+1],dz=positions[j+2]+a.y/DEER_GROUND_RATIO-aura.spirits.positions[j+2]-b.y/DEER_GROUND_RATIO;
   assert.ok(Math.hypot(dx,dy,dz)<.7,'转向不能带动余韵跳位置');shared++;
  }
  assert.ok(shared>3);
 }
 for(const t of [44,73]){assert.equal(aura.sample(patrol.sample(t)).spirits,0);assert.ok(aura.spirits.alphas.every(v=>v===0));}
 aura.sample(patrol.sample(47.5));const alpha=aura.spirits.alphas.slice(),p=aura.spirits.positions.slice();aura.sample(patrol.sample(72));aura.sample(patrol.sample(47.5));assert.deepEqual(aura.spirits.alphas,alpha);assert.deepEqual(aura.spirits.positions,p);
});
