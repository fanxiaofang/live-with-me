import assert from 'node:assert/strict';
import {test} from 'node:test';
import * as THREE from 'three';
import {createSpiritPatrol,patrolRoute,DEFAULT_DEER_PATH,DEER_LEGS,DEER_GROUND_RATIO} from '../../src/components/scenery/yorkshire/dressing/spiritDeerPatrol';
import {deerPathFromLayout,isDeerPathClear} from '../../src/features/yard-editor/deerPatrolRoute';
import {defaultYardSnapshot} from '../../src/features/yard-editor/yardDefaults';
import {YARD_OBJECTS} from '../../src/features/yard-editor/yardLayout';
import {deerRigAttribute,DEER_STANDING_FEET,bindJoints,DEER_LEG_RADII,skinDeerPoint} from '../../src/components/scenery/yorkshire/dressing/spiritDeerRig';
import {DEER_TIMING} from '../../src/components/scenery/yorkshire/dressing/spiritDeerTiming';
import {createDissolveAnchors,freezeDissolveAnchors,dissolvePoint,dissolveEnvelope} from '../../src/components/scenery/yorkshire/dressing/spiritDeerDissolve';
import {SPIRIT_BOUNDS,deerBodyDistance,deerDistance} from '../../src/components/scenery/yorkshire/dressing/spiritDeerShape3D';
import {DEER_WALK_STANCES} from '../../src/components/scenery/yorkshire/dressing/spiritDeerWalkClip';
const v=(p:readonly number[])=>new THREE.Vector3(p[0],p[1],p[2]);

test('18秒守望和132秒循环保留，路线跨过整个大门，返回后恢复站姿',()=>{
 const patrol=createSpiritPatrol();
 for(const t of [0,17.99,120,131.99,132,145]){
  const p=patrol.sample(t);assert.equal(p.state,'watch');assert.equal(p.x,0);assert.equal(p.y,0);
  p.feet.forEach((foot,i)=>assert.ok(v(foot).distanceTo(v(DEER_STANDING_FEET[i]))<1e-8));
 }
 const end=patrol.sample(DEER_TIMING.depart+DEER_TIMING.walk+1);assert.ok(345+end.x>730+50);assert.ok(DEFAULT_DEER_PATH.length>400);
 assert.equal(patrol.sample(26).state,'walk-out');assert.equal(patrol.sample(DEER_TIMING.home+8).state,'walk-home');
});

test('两个循环保持骨长与支撑接触，摆动有重叠，蹄部和躯干有独立动作',()=>{
 const patrol=createSpiritPatrol();let previous:ReturnType<typeof patrol.sample>|undefined;
 let steady=0,overlap=0,hoofMotion=0,bodyMotion=0;const serials:number[]=[];
 for(let frame=0;frame<=264*24;frame++){
  const t=frame/24,p=patrol.sample(t),local=t%132;
  assert.ok(Math.max(...p.reachErrors)<.18,`contact residual ${p.reachErrors} at ${t}`);
  p.feet.forEach((foot,i)=>{
   if(previous&&p.state===previous.state&&p.state.startsWith('walk')&&!p.swinging[i]&&!previous.swinging[i])
    assert.ok(v(foot).distanceTo(v(previous.feet[i]))<.002,`sliding contact ${i} at ${t}`);
   if(previous&&p.state===previous.state&&p.state.startsWith('walk')){
    assert.ok(v(foot).distanceTo(v(previous.feet[i]))<7,`unbounded foot velocity ${i} at ${t}`);
    if(p.swinging[i]!==previous.swinging[i]){
     let a=t-1/24,b=t;const was=previous.swinging[i];
     for(let n=0;n<22;n++){const mid=(a+b)/2;if(patrol.sample(mid).swinging[i]===was)a=mid;else b=mid;}
     assert.ok(v(patrol.sample(a).feet[i]).distanceTo(v(patrol.sample(b).feet[i]))<.002,`contact discontinuity ${i} at ${t}`);
    }
   }
   const joints=p.joints.slice(i*4,i*4+4),rest=DEER_LEGS[i],bind=[rest.hip,rest.knee,rest.ankle,rest.sole];
   for(let s=0;s<3;s++)assert.ok(Math.abs(v(joints[s]).distanceTo(v(joints[s+1]))-v(bind[s]).distanceTo(v(bind[s+1])))<1e-8);
   hoofMotion=Math.max(hoofMotion,new THREE.Vector3(0,1,0).transformDirection(p.bones[i*4+3]).distanceTo(new THREE.Vector3(0,1,0)));
  });
  if(local>24&&local<38){steady++;if(p.swinging.filter(Boolean).length>=2)overlap++;}
  bodyMotion=Math.max(bodyMotion,Math.abs(p.bones[16].elements[1]),Math.abs(p.bones[19].elements[1]));
  serials.push(...p.landings.map(l=>l.serial));previous=p;
 }
 assert.ok(overlap/steady>.25);assert.ok(hoofMotion>.2);assert.ok(bodyMotion>.01);
 assert.equal(new Set(serials).size,serials.length);assert.ok(serials.length>100);
});

test('朝向只在鹿形完全消失时翻转，换向不制造落脚花',()=>{
 const patrol=createSpiritPatrol();
 for(const start of [DEER_TIMING.turn,DEER_TIMING.homeTurn]){
  let last=patrol.sample(start);
  for(let i=1;i<750;i++){
   const p=patrol.sample(start+i/100);
   if(Math.abs(p.yaw-last.yaw)>2)assert.equal(p.visibility,0);
   assert.equal(p.landings.length,0);last=p;
  }
  for(let i=250;i<550;i++){
   const p=patrolRoute(start+i/100);
   assert.equal(p.effectPhase,'absent');assert.equal(p.visibility,0);assert.equal(p.groundVisibility,0);assert.equal(dissolveEnvelope(p.transition),0);
  }
  assert.equal(patrolRoute(start+5.5).effectPhase,'condensing');
  assert.equal(patrolRoute(start+7).visibility,1);
  const moving=patrolRoute(start+.8),earlier=patrolRoute(start+.1);
  assert.ok(moving.state.startsWith('walk'));assert.ok(Math.abs(moving.x-earlier.x)>.1);assert.ok(moving.visibility<1);
  for(const dt of [5.5,6,6.8,7.4])assert.equal(patrolRoute(start+dt).yaw,patrolRoute(start+7).yaw);
 }
});

test('减速与最后落脚同时发生，进入停留前已落稳且姿态连续',()=>{
 const patrol=createSpiritPatrol();
 for(const end of [DEER_TIMING.depart+DEER_TIMING.walk,DEER_TIMING.home+DEER_TIMING.walk]){
  const early=patrol.sample(end-2),late=patrol.sample(end-.15),standing=patrol.sample(end);
  assert.ok(Math.abs(late.x-early.x)>.2,'body stops before the final foot placements');
  assert.ok(early.swinging.some(Boolean));
  assert.ok(late.swinging.every(s=>!s),'final feet remain unsettled');
  const last=patrol.sample(end-.0001);
  last.feet.forEach((foot,i)=>assert.ok(v(foot).distanceTo(v(standing.feet[i]))<.001));
  assert.ok(Math.abs(last.bob-standing.bob)<.001);
  assert.ok(last.bones[19].elements.every((value,i)=>Math.abs(value-standing.bones[19].elements[i])<.001));
 }
 // Match stride phase at two different points of the walk: authored variation
 // should change the swing shape, while the contact invariants above still hold.
 const first=patrol.sample(26),target=first.clipPhase+5;
 let low=26,high=38;
 for(let i=0;i<25;i++){const mid=(low+high)/2;if(patrol.sample(mid).clipPhase<target)low=mid;else high=mid;}
 const later=patrol.sample((low+high)/2);
 assert.ok(first.joints.some((joint,i)=>v(joint).distanceTo(v(later.joints[i]))>.1));
});

test('门柱位置与旋转决定路线，东半程物件也会暂停巡视，计算不改布局',()=>{
 const layout=defaultYardSnapshot().layout,before=JSON.stringify(layout),path=deerPathFromLayout(layout);
 assert.equal(isDeerPathClear(path,layout),true);assert.equal(JSON.stringify(layout),before);
 const moved=structuredClone(layout);moved.fence_east.dx+=120;moved.fence_east.angle=8;
 const next=deerPathFromLayout(moved);assert.notEqual(next.signature,path.signature);assert.ok(next.points.at(-1)!.x>path.points.at(-1)!.x+90);
 const blocked=structuredClone(layout),point=path.points[80],home=YARD_OBJECTS.gate_spirit_deer,object=YARD_OBJECTS.pumpkin;
 blocked.pumpkin={...blocked.pumpkin,dx:home.x+point.x-object.x,dy:home.y+point.y-object.y};
 assert.equal(isDeerPathClear(path,blocked),false);
 blocked.pumpkin.removed=true;assert.equal(isDeerPathClear(path,blocked),true);
 assert.equal(isDeerPathClear({...path,points:[{x:65,y:-145},{x:70,y:-145}]},layout),false,'gate leaves and posts are also obstacles');
});

test('前蹄短系部在支撑和摆动时均不横折，蹄体完整绑定同一骨骼',()=>{
 const patrol=createSpiritPatrol();
 for(let frame=0;frame<=132*48;frame++){
  const p=patrol.sample(frame/48);
  for(const leg of [1,3]){
   const joints=p.joints.slice(leg*4,leg*4+4),middle=v(joints[2]).sub(v(joints[1])),distal=v(joints[3]).sub(v(joints[2]));
   const bend=(Math.atan2(distal.x,distal.y)-Math.atan2(middle.x,middle.y))*180/Math.PI;
   assert.ok(bend>=4&&bend<=18.5,`pastern reversal ${bend} at ${frame/48}`);
   assert.ok(Math.abs(Math.atan2(distal.x,distal.y))*180/Math.PI<35);
  }
 }
 for(const leg of [1,3])for(const x of [-1,1])for(const y of [-1,1]){
  const sole=DEER_LEGS[leg].sole,rig=deerRigAttribute([sole[0]+x,sole[1]+y,sole[2]]);
  assert.deepEqual(rig,[leg*4+3,leg*4+3,1,1]);
 }
});

test('解体粒子包含鹿角、锚点在朝向翻转时保持连续并留在透明包络内',()=>{
 const anchors=createDissolveAnchors({dots:[-26,-2,5,25,-1,5,-38,-5,-5],positions:[70,-144,18]});
 assert.ok(anchors.positions.some((n,i)=>i%3===1&&n< -130));
 const flip=DEER_TIMING.depart+DEER_TIMING.walk+1.5;
 const patrol=createSpiritPatrol(),before=patrol.sample(flip-.01),after=patrol.sample(flip+.01);
 const a=freezeDissolveAnchors(anchors,before.bones,before.sourceYaw,before.targetYaw,before.bob);
 const b=freezeDissolveAnchors(anchors,after.bones,after.sourceYaw,after.targetYaw,after.bob);
 for(const key of ['from','to'] as const)a[key].forEach((n,i)=>assert.ok(Math.abs(n-b[key][i])<1e-10,'particle cloud follows the hidden body flip'));
 assert.equal(dissolveEnvelope(.5),0);assert.ok(dissolveEnvelope(.3)>.9&&dissolveEnvelope(.7)>.9);
 for(let i=0;i<a.from.length;i+=3)for(const seed of [0,.25,.5,.75,1]){
  const from=new THREE.Vector3().fromArray(a.from,i),to=new THREE.Vector3().fromArray(a.to,i);
  assert.ok(dissolvePoint(from,to,seed,0).distanceTo(from)<1e-9);
  assert.ok(dissolvePoint(from,to,seed,1).distanceTo(to)<1e-9);
  let previous=from;
  for(let step=1;step<=200;step++){
   const p=dissolvePoint(from,to,seed,step/200),y=p.y+p.z*DEER_GROUND_RATIO;
   if(step!==100)assert.ok(p.distanceTo(previous)<5,'particle jumps while visible');
   assert.ok(p.x>SPIRIT_BOUNDS.x+6&&p.x<SPIRIT_BOUNDS.x+SPIRIT_BOUNDS.width-6);
   assert.ok(y>SPIRIT_BOUNDS.y+6&&y<SPIRIT_BOUNDS.y+SPIRIT_BOUNDS.height-6);
   previous=p;
  }
 }
});

test('双侧解剖一致，静站前蹄错开且观察不移动支撑点，轻跃期间四蹄离地',()=>{
 const patrol=createSpiritPatrol();
 for(const [a,b] of [[0,2],[1,3]]){
  const ja=bindJoints(a),jb=bindJoints(b);
  for(let i=0;i<3;i++)assert.ok(Math.abs(ja[i].distanceTo(ja[i+1])-jb[i].distanceTo(jb[i+1]))<1e-8);
  assert.deepEqual(DEER_LEG_RADII[a],DEER_LEG_RADII[b]);
 }
 const rest=patrol.sample(0),left=patrol.sample(6),right=patrol.sample(12.5);
 assert.ok(Math.abs(rest.joints[7][0]-rest.joints[15][0])>7,'front hooves merge in side projection');
 assert.ok(left.look>.5&&right.look< -.5);
 assert.notDeepEqual(left.bones[19].elements,right.bones[19].elements);
 for(const pose of [left,right])pose.feet.forEach((foot,i)=>assert.deepEqual(foot,rest.feet[i]));
 const hop=patrol.sample(DEER_TIMING.depart+DEER_TIMING.hop+.23);
 assert.ok(hop.hop.flight);assert.ok(hop.bob< -3);assert.ok(hop.swinging.every(Boolean));
 assert.ok(hop.feet.every(foot=>foot[1]< -4));assert.equal(hop.landings.length,0);
 const after=patrol.sample(DEER_TIMING.depart+DEER_TIMING.hop+1.2);assert.ok(!after.hop.active);assert.ok(after.contactWeights.some(w=>w>0));assert.ok(Math.abs(after.contactWeights.reduce((a,b)=>a+b,0)-1)<1e-8);
});

test('参考步态允许身体经过前蹄，收腿主折点朝前，步频与推进一致',()=>{
 const patrol=createSpiritPatrol(),ranges=[{min:Infinity,max:-Infinity},{min:Infinity,max:-Infinity}];
 const a=patrol.sample(24),b=patrol.sample(28),period=4/(b.clipPhase-a.clipPhase);
 assert.ok(period>=1.75&&period<=1.95);
 for(let frame=0;frame<8*60;frame++){
  const p=patrol.sample(24+frame/60);
  [1,3].forEach((leg,index)=>{
   const [hip,knee,,foot]=p.joints.slice(leg*4,leg*4+4).map(v);
   // The main visible fold stays forward of the hip-to-hoof axis.
   const axis=foot.clone().sub(hip).normalize(),projection=hip.clone().addScaledVector(axis,knee.clone().sub(hip).dot(axis));
   assert.ok(knee.x>=projection.x-1e-6);
   if(!p.swinging[leg]){const dx=foot.x-hip.x;ranges[index].min=Math.min(ranges[index].min,dx);ranges[index].max=Math.max(ranges[index].max,dx);}
  });
 }
 ranges.forEach(range=>{assert.ok(range.min< -7,'missing late support');assert.ok(range.max>7,'missing forward placement');});
 const progress=b.x-a.x,cycleDistance=progress/(b.clipPhase-a.clipPhase);
 assert.ok(cycleDistance>37&&cycleDistance<40);
});

test('前腿中段承重舒展，回收仍可屈曲，后腿下段保留稳定支撑',()=>{
 const patrol=createSpiritPatrol();let supports=0,recovery=0;
 for(let i=0;i<=360;i++){
  const pose=patrol.sample(22+i/60);
  for(let leg=0;leg<4;leg++){
   const phase=((pose.clipPhase+DEER_LEGS[leg].phase)%1)/DEER_WALK_STANCES[leg];
   const joints=pose.joints.slice(leg*4,leg*4+4).map(v),segments=joints.slice(1).map((p,i)=>p.clone().sub(joints[i]));
   const bend=segments[0].angleTo(segments[1])*180/Math.PI;
   if(leg%2){
    if(!pose.swinging[leg]&&phase>=.35&&phase<=.65){assert.ok(bend>3&&bend<18,`loaded forelimb remains folded: ${bend}`);supports++;}
    if(pose.swinging[leg])recovery=Math.max(recovery,bend);
   }else if(!pose.swinging[leg]&&phase>=.25&&phase<=.75){
    assert.ok(Math.abs(Math.atan2(segments[2].x,segments[2].y))*180/Math.PI<10,'hind cannon loses its upright support');
    assert.ok(segments[1].angleTo(segments[2])*180/Math.PI>10,'hind hock has been flattened');
   }
  }
 }
 assert.ok(supports>60);assert.ok(recovery>30,'forelimb recovery has been stiffened');
});

test('肩胯外皮随腿根变形，过渡连续且不向头部传递摆腿',()=>{
 for(const leg of DEER_LEGS){
  assert.ok(deerBodyDistance(leg.hip[0],leg.hip[1],leg.hip[2])< -1,'trunk has a hole at a limb insertion');
  assert.ok(deerBodyDistance(leg.ankle[0],leg.ankle[1],leg.ankle[2])>1,'trunk texture still contains rest-pose lower legs');
  assert.ok(deerDistance(leg.ankle[0],leg.ankle[1],leg.ankle[2])<0,'surface carrier lost its legs');
 }
 const patrol=createSpiritPatrol();
 const probes=[[16,-65,7],[-28,-63,7],[16,-65,-7],[-28,-63,-7]];
 for(const point of probes){
  const p=v(point),rig=deerRigAttribute(point),samples:THREE.Vector3[]=[];
  for(let i=0;i<=120;i++){
   const pose=patrol.sample(20+i/15);samples.push(skinDeerPoint(p,pose.bones,rig));
  }
  const range=Math.max(...samples.map(p=>p.x))-Math.min(...samples.map(p=>p.x));
  assert.ok(range>.25&&range<2,'shoulder/haunch remains a rigid shell or over-swings');
 }
 const pose=patrol.sample(24.2);
 for(const z of [-5,5])for(const x of [16,18,20])for(const y of [-80,-66,-60,-58]){
  const a=new THREE.Vector3(x,y-.01,z),b=new THREE.Vector3(x,y+.01,z);
  const delta=skinDeerPoint(a,pose.bones,deerRigAttribute(a.toArray())).distanceTo(skinDeerPoint(b,pose.bones,deerRigAttribute(b.toArray())));
  assert.ok(delta<.08,'skin tears across the leg-root weighting boundary');
 }
 const head=new THREE.Vector3(34,-95,0),rig=deerRigAttribute(head.toArray());
 const expected=head.clone().applyMatrix4(pose.bones[rig[1]]).lerp(head.clone().applyMatrix4(pose.bones[rig[0]]),rig[2]);
 assert.ok(skinDeerPoint(head,pose.bones,rig).distanceTo(expected)<1e-8);
});

test('慢步头部高度稳定，颈部吸收胸廓起伏，左右承重不产生交替点头',()=>{
 const patrol=createSpiritPatrol();let min=Infinity,max=-Infinity,minY=Infinity,maxY=-Infinity,relative=0;
 for(let i=0;i<=240;i++){
  const p=patrol.sample(24+i/60),head=p.bones[19],chest=p.bones[17];
  const pitch=Math.atan2(head.elements[1],head.elements[0]);min=Math.min(min,pitch);max=Math.max(max,pitch);
  const center=new THREE.Vector3(34,-95,0).applyMatrix4(head);minY=Math.min(minY,center.y+p.bob);maxY=Math.max(maxY,center.y+p.bob);
  const neckTop=new THREE.Vector3(27,-90,0);
  relative=Math.max(relative,neckTop.clone().applyMatrix4(p.bones[18]).distanceTo(neckTop.clone().applyMatrix4(chest)));
 }
 assert.ok(max-min<.012,'head pitch exaggerates ordinary slow walking');
 assert.ok(maxY-minY<.2,'head follows the chest vertically instead of stabilising');
 assert.ok(relative>.1,'neck does not compensate chest motion');
 const contact=(phase:number)=>{
  let low=18,high=24;
  for(let i=0;i<40;i++){const mid=(low+high)/2;if(patrol.sample(mid).clipPhase<phase)low=mid;else high=mid;}
  return patrol.sample((low+high)/2);
 };
 const a=contact(2.23),b=contact(2.73);
 const pitch=(p:typeof a)=>Math.atan2(p.bones[19].elements[1],p.bones[19].elements[0]);
 const height=(p:typeof a)=>new THREE.Vector3(34,-95,0).applyMatrix4(p.bones[19]).y+p.bob;
 assert.ok(Math.abs(pitch(a)-pitch(b))<.002,'opposite forelimb contacts receive asymmetric head pitch');
 assert.ok(Math.abs(height(a)-height(b))<.1,'opposite forelimb contacts receive asymmetric head height');
 // Stabilisation must retain intentional whole-body movement during the hop.
 const hop=patrol.sample(DEER_TIMING.depart+DEER_TIMING.hop+.23);
 assert.ok(height(hop)<height(a)-3,'head is frozen in space while the body jumps');
});
