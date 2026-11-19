import * as THREE from 'three';
import {makeDeerPatrolPath,type DeerPatrolPath} from '../../../../features/yard-editor/deerPatrolRoute';
import {DEER_LEGS,DEER_STANDING_FEET,DEER_GROUND_RATIO,DEER_BONE_COUNT,DEER_SHOULDERS,DEER_SCAPULAE,deerSupportLoad,bindJoints,fitContact,fitForeContact,extendForeSupport,segmentMatrix,smooth,vector,type Vec3} from './spiritDeerRig';
import {createWalkPlayer,DEER_WALK_STRIDE,DEER_WALK_STANCES} from './spiritDeerWalkClip';
import {DEER_TIMING,deerTurnPhase,type DeerEffectPhase} from './spiritDeerTiming';
import {stableDeerHead} from './spiritDeerHead';
export {DEER_LEGS,DEER_GROUND_RATIO,deerRigAttribute} from './spiritDeerRig';
export type {Vec3} from './spiritDeerRig';
export const DEER_PATROL_PERIOD=DEER_TIMING.period;
export const DEFAULT_DEER_PATH=makeDeerPatrolPath({x:345,y:1015},{x:410,y:870},{x:730,y:864});
const WALK_SECONDS=DEER_TIMING.walk,STOP_START=WALK_SECONDS-1.8;
const mod=(n:number)=>((n%1)+1)%1;
/** A small forward bound: crouch, flight with independent leg tuck, then recovery. */
export function deerHop(walkTime:number,returning=false){
  const t=walkTime-(DEER_TIMING.hop-.2),air=(t-.2)/.46,flight=air>0&&air<1;
  const lift=flight?4*air*(1-air):0;
  const crouch=t>=0&&t<.2?Math.sin(Math.PI*t/.2)**2:t>=.66&&t<1?Math.sin(Math.PI*(t-.66)/.34)**2*.65:0;
  return {active:!returning&&t>=0&&t<1,flight:!returning&&flight,lift:returning?0:lift,bob:returning?0:.85*crouch-5.2*lift,pitch:returning?0:.025*crouch-.035*lift};
}
// A shared, low-amplitude rhythm change keeps forward travel and swing in sync.
function gaitTime(t:number){return t+.09*smooth(t/3)*(1-smooth((t-(WALK_SECONDS-7))/4))*Math.sin(t*Math.PI*2/11);}
function gaitSeconds(clock:number){
  let low=0,high:number=WALK_SECONDS;
  for(let i=0;i<28;i++){const mid=(low+high)/2;if(clipSeconds(mid)<clock)low=mid;else high=mid;}
  return (low+high)/2;
}
function clipSeconds(t:number){return travel(gaitTime(t))*(WALK_SECONDS-1.8);}
const pathLengthCache=new WeakMap<DeerPatrolPath,number[]>();
function pathPoint(path:DeerPatrolPath,u:number){
  let lengths=pathLengthCache.get(path);
  if(!lengths){lengths=[0];for(let i=1;i<path.points.length;i++)lengths.push(lengths[i-1]+Math.hypot(path.points[i].x-path.points[i-1].x,(path.points[i].y-path.points[i-1].y)/DEER_GROUND_RATIO));pathLengthCache.set(path,lengths);}
  const distance=THREE.MathUtils.clamp(u,0,1)*path.length;
  let i=1;while(i<lengths.length-1&&lengths[i]<distance)i++;
  const a=path.points[i-1],b=path.points[i],t=(distance-lengths[i-1])/(lengths[i]-lengths[i-1]);
  return {x:THREE.MathUtils.lerp(a.x,b.x,t),y:THREE.MathUtils.lerp(a.y,b.y,t),yaw:-Math.atan2((b.y-a.y)/DEER_GROUND_RATIO,b.x-a.x)};
}
export {pathPoint as deerPathPoint};
/** Integrate smooth speed ramps; the final steps land while the body decelerates. */
function travel(t:number){
  const start=.8,end=2.8,duration=WALK_SECONDS,areaTotal=duration-(start+end)/2;
  const area=(v:number,ramp:number)=>v*v*v/(ramp*ramp)-.5*v*v*v*v/(ramp*ramp*ramp);
  if(t<start)return area(Math.max(0,t),start)/areaTotal;
  if(t>duration-end)return 1-area(Math.max(0,duration-t),end)/areaTotal;
  return (t-start*.5)/areaTotal;
}
export function patrolRoute(seconds:number,path=DEFAULT_DEER_PATH){
  const t=((seconds%132)+132)%132,end=pathPoint(path,1),start=pathPoint(path,0);
  let x=0,y=0,yaw=0,state='watch',walkTime=0,walkStart=0,returning=false,visibility=1,groundVisibility=1,veil=0,transition=-1,sourceYaw=0,targetYaw=0;
  let effectPhase:DeerEffectPhase='none',effectId='';
  const T=DEER_TIMING,outEnd=T.depart+T.walk,homeEnd=T.home+T.walk;
  if(t>=T.depart&&t<outEnd){walkTime=t-T.depart;walkStart=T.depart;state='walk-out';const p=pathPoint(path,travel(gaitTime(walkTime)));({x,y,yaw}=p);yaw*=smooth(walkTime/.8);}
  else if(t>=outEnd&&t<T.home){({x,y}=end);state='veil-turn';yaw=t<outEnd+1.5?end.yaw:end.yaw+Math.PI;}
  else if(t>=T.home&&t<homeEnd){walkTime=t-T.home;walkStart=T.home;state='walk-home';returning=true;const p=pathPoint(path,1-travel(gaitTime(walkTime)));({x,y}=p);yaw=p.yaw+Math.PI;}
  else if(t>=homeEnd&&t<T.rest){state='veil-home';yaw=t<homeEnd+1.5?start.yaw+Math.PI:0;}
  const effectStart=t>=DEER_TIMING.turn&&t<DEER_TIMING.home?DEER_TIMING.turn:t>=DEER_TIMING.homeTurn&&t<DEER_TIMING.rest?DEER_TIMING.homeTurn:-1;
  if(effectStart>=0){
    effectId=effectStart===DEER_TIMING.turn?'out':'home';
    ({transition,visibility,groundVisibility,veil,effectPhase}=deerTurnPhase(t-effectStart));
    sourceYaw=effectId==='out'?end.yaw:start.yaw+Math.PI;
    targetYaw=effectId==='out'?end.yaw+Math.PI:0;
  }
  return {time:seconds,x,y,yaw,state,walkTime,walkStart,returning,visibility,groundVisibility,effectPhase,effectId,veil,transition,sourceYaw,targetYaw,distance:(returning?1-travel(gaitTime(walkTime)):travel(gaitTime(walkTime)))*path.length};
}
export type DeerLanding={x:number;y:number;leg:number;serial:number;at:number};
function pivotMatrix(p:THREE.Vector3,angle:number,roll=0,dx=0,dy=0,yaw=0){
  return new THREE.Matrix4().makeTranslation(p.x+dx,p.y+dy,p.z)
    .multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(roll,yaw,-angle)))
    .multiply(new THREE.Matrix4().makeTranslation(-p.x,-p.y,-p.z));
}
function toWorld(point:THREE.Vector3,route:ReturnType<typeof patrolRoute>,bob=0):Vec3 {
  const p=point.clone().applyAxisAngle(new THREE.Vector3(0,1,0),route.yaw);
  return [p.x+route.x,p.y+bob,p.z+route.y/DEER_GROUND_RATIO];
}
function toLocal(point:Vec3,route:ReturnType<typeof patrolRoute>,bob:number){
  return new THREE.Vector3(point[0]-route.x,point[1]-bob,point[2]-route.y/DEER_GROUND_RATIO)
    .applyAxisAngle(new THREE.Vector3(0,1,0),-route.yaw);
}
export function createSpiritPatrol(path=DEFAULT_DEER_PATH,refined=false){
  const player=createWalkPlayer(),cycles=Math.max(8,Math.round(path.length/DEER_WALK_STRIDE)),frequency=cycles/(WALK_SECONDS-(.8+2.8)/2);
  const strideScale=path.length/(cycles*DEER_WALK_STRIDE);
  let lastTime=0;
  function reference(time:number){
    const route=patrolRoute(time,path),walking=route.walkStart>0,t=route.walkTime;
    const weight=walking?smooth(t/.45)*(1-smooth((t-STOP_START)/(WALK_SECONDS-STOP_START))):0,clock=clipSeconds(t)*frequency;
    const variation=1-Math.cos(t*Math.PI/13),body=(name:string)=>player(name,clock,variation)*weight;
    const hop=walking&&!refined?deerHop(t,route.returning):deerHop(0,true);
    // Two finite attentive gestures, independent of the repeating stride.
    const glance=(center:number,width:number)=>Math.abs(t-center)<width?Math.sin(Math.PI*(t-center+width)/(2*width))**2:0;
    const watchTime=((time%132)+132)%132;
    const watchGlance=(center:number,width:number)=>Math.abs(watchTime-center)<width?Math.sin(Math.PI*(watchTime-center+width)/(2*width))**2:0;
    const look=route.state==='watch'?.9*watchGlance(6,2.2)-watchGlance(12.5,2.6)+.85*watchGlance(DEER_TIMING.rest+9,2.4)-.7*watchGlance(DEER_TIMING.rest+19,3):0;
    const attention=walking?(glance(WALK_SECONDS*.3,2.4)-.65*glance(WALK_SECONDS*.68,2.5)):0;
    const bones=Array.from({length:DEER_BONE_COUNT},()=>new THREE.Matrix4());
    const loads=DEER_LEGS.map((leg,i)=>deerSupportLoad(mod(clock+leg.phase),DEER_WALK_STANCES[i]));
    const totalLoad=loads.reduce((a,b)=>a+b,0)||1;
    const compression=loads.reduce((sum,w,i)=>sum+w*(2*mod(clock+DEER_LEGS[i].phase)/DEER_WALK_STANCES[i]-1)**2,0)/totalLoad;
    bones[16]=pivotMatrix(new THREE.Vector3(-27,-55,0),body('pelvisPitch')+hop.pitch,.009*(loads[0]-loads[2])*weight);
    bones[17]=pivotMatrix(new THREE.Vector3(18,-59,0),body('chestPitch')+hop.pitch*.8,.007*(loads[1]-loads[3])*weight);
    bones[20]=pivotMatrix(new THREE.Vector3(-8,-59,0),(body('pelvisPitch')+body('chestPitch'))*.5);
    bones[21]=bones[16].clone().multiply(pivotMatrix(new THREE.Vector3(-35,-62,0),.025*weight*Math.sin(clock*Math.PI*2+.5),0,0,0,.04*look));
    const bob=(refined?.14*player('bodyY',clock,variation):.12+.65*compression)*weight+hop.bob,limbs=DEER_LEGS.map((leg,i)=>{
      const bind=bindJoints(i),parent=bones[i%2?17:16],hip=bind[0].clone();
      hip.x+=player(`leg${i}shoulder`,clock+leg.phase,variation)*weight;
      const points=[hip],phase=mod(clock+leg.phase);
      for(let segment=0;segment<3;segment++){
        const rest=bind[segment+1].clone().sub(bind[segment]),restAngle=Math.atan2(rest.x,rest.y);
        const angle=THREE.MathUtils.lerp(restAngle,player(`leg${i}angle${segment}`,phase,variation),weight);
        const planar=Math.hypot(rest.x,rest.y);
        points.push(points[segment].clone().add(new THREE.Vector3(Math.sin(angle)*planar,Math.cos(angle)*planar,rest.z)));
      }
      points.forEach(p=>p.applyMatrix4(parent));
      const foot=points[3].clone();foot.x=points[0].x+(foot.x-points[0].x-(leg.sole[0]-leg.hip[0]))*strideScale+(leg.sole[0]-leg.hip[0]);
      return {points,foot,phase,hoof:player(`leg${i}hoof`,phase,variation)*weight};
    });
    return {route,weight,clock,bones,bob,limbs,hop,look,attention};
  }
  function groundFeet(time:number){
    const ref=reference(time),{route}=ref,feet:Vec3[]=[],swinging:boolean[]=[],contactWeights:number[]=[];
    const beforeStop=route.walkStart>0&&route.walkTime>=STOP_START?groundFeet(route.walkStart+STOP_START-.00001):undefined;
    ref.limbs.forEach((limb,i)=>{
      const leg=DEER_LEGS[i],p=limb.phase,walking=route.walkStart>0,stance=DEER_WALK_STANCES[i];
      let foot=toWorld(limb.foot,route,ref.bob-ref.hop.bob),contact=walking&&p<stance;
      if(!walking){foot=toWorld(vector(DEER_STANDING_FEET[i]),route);contact=true;}
      else if(contact){
        const coordinate=ref.clock+leg.phase,touchClock=(Math.floor(coordinate)-leg.phase)/frequency,touch=gaitSeconds(touchClock);
        if(touchClock<0)foot=toWorld(vector(DEER_STANDING_FEET[i]),patrolRoute(route.walkStart,path));
        else {
          const landing=reference(route.walkStart+touch);
          foot=toWorld(landing.limbs[i].foot,landing.route,landing.bob-landing.hop.bob);foot[1]=leg.sole[1];
        }
      }
      else if(route.walkTime<STOP_START){
        // Match the planted point at lift-off, especially during the start blend.
        // The authored swing takes over gradually; no endpoint snap or sliding support.
        const cycle=Math.floor(ref.clock+leg.phase),touchClock=(cycle-leg.phase)/frequency,touch=gaitSeconds(touchClock);
        const lift=gaitSeconds((cycle+stance-leg.phase)/frequency);
        const liftPose=reference(route.walkStart+Math.max(0,lift));
        const rawLift=toWorld(liftPose.limbs[i].foot,liftPose.route,liftPose.bob-liftPose.hop.bob);
        let anchor:Vec3;
        if(touchClock<0)anchor=toWorld(vector(DEER_STANDING_FEET[i]),patrolRoute(route.walkStart,path));
        else{const landing=reference(route.walkStart+touch);anchor=toWorld(landing.limbs[i].foot,landing.route,landing.bob-landing.hop.bob);anchor[1]=leg.sole[1];}
        const u=(p-stance)/(1-stance),hold=1-smooth(u/.35);
        foot=foot.map((n,j)=>n+(anchor[j]-rawLift[j])*hold) as Vec3;
        const next=reference(route.walkStart+gaitSeconds((cycle+1-leg.phase)/frequency));
        const rawLand=toWorld(next.limbs[i].foot,next.route,next.bob-next.hop.bob);
        foot[1]+=(leg.sole[1]-rawLand[1])*smooth((u-.75)/.25);
      }
      if(walking&&route.walkTime>=STOP_START){
        const order=[3,0,1,2].indexOf(i);
        const u=THREE.MathUtils.clamp((route.walkTime-STOP_START-order*.25)/.82,0,1),blend=smooth(u);
        const end=toWorld(vector(DEER_STANDING_FEET[i]),patrolRoute(route.walkStart+WALK_SECONDS-.000001,path)),start=beforeStop!.feet[i];
        foot=[THREE.MathUtils.lerp(start[0],end[0],blend),THREE.MathUtils.lerp(start[1],end[1],blend)-(i%2?3:2.4)*Math.sin(Math.PI*u)**2,THREE.MathUtils.lerp(start[2],end[2],blend)];
        contact=u===0?!beforeStop!.swinging[i]:u===1;
      }
      const legAir=(route.walkTime-DEER_TIMING.hop)/(i%2?.46:.50);
      if(!refined&&walking&&!route.returning&&legAir>0&&legAir<1){
        // The body rises 5.2 units; feet rise farther to fold the major joints.
        // Fore and hind tucks differ, while grounded feet remain locked outside flight.
        const lift=4*legAir*(1-legAir),fold=lift**2;
        foot[0]+=(i%2?2:-1.5)*fold*Math.cos(route.yaw);
        foot[2]-=(i%2?2:-1.5)*fold*Math.sin(route.yaw);
        foot[1]-=5.2*lift+(i%2?1.8:2.8)*fold;
        contact=false;
      }
      feet.push(foot);swinging.push(!contact);contactWeights.push(contact?THREE.MathUtils.lerp(1,deerSupportLoad(p,stance),ref.weight):0);
    });
    const loadSum=contactWeights.reduce((a,b)=>a+b,0);
    if(loadSum>0)contactWeights.forEach((w,i)=>{contactWeights[i]=w/loadSum;});
    return {...ref,feet,swinging,contactWeights};
  }
  return {
    sample(seconds:number){
      const pose=groundFeet(seconds),{route,bones}=pose,joints:Vec3[]=[],reachErrors:number[]=[],landings:DeerLanding[]=[];
      let bob=pose.bob;
      pose.limbs.forEach((limb,i)=>{
        if(refined)return;
        const target=toLocal(pose.feet[i],route,0),hip=limb.points[0],bind=bindJoints(i);
        let reach=bind.slice(1).reduce((sum,p,j)=>sum+p.distanceTo(bind[j]),0)-.2;
        if(i%2){const a=bind[0].distanceTo(bind[1]),b=bind[1].distanceTo(bind[2]),c=bind[2].distanceTo(bind[3]);reach=a+Math.sqrt(b*b+c*c+2*b*c*Math.cos(Math.PI*.10))-.2;}
        const horizontal=(target.x-hip.x)**2+(target.z-hip.z)**2;
        bob=Math.max(bob,target.y-hip.y-Math.sqrt(Math.max(.01,reach*reach-horizontal)));
      });
      pose.limbs.forEach((limb,i)=>{
        const target=toLocal(pose.feet[i],route,bob),stance=limb.phase/DEER_WALK_STANCES[i];
        const extension=smooth((stance-.04)/.38)*(1-smooth((stance-.58)/.42))*pose.weight;
        const hopClear=refined||route.returning?1:1-smooth((route.walkTime-(DEER_TIMING.hop-.6))/.4)*(1-smooth((route.walkTime-(DEER_TIMING.hop+.9))/.4));
        let source=i%2&&!pose.swinging[i]?extendForeSupport(limb.points,target,extension*hopClear):limb.points;
        if(refined){
          const a=bindJoints(i),upper=a[0].distanceTo(a[1]),middle=a[1].distanceTo(a[2]),distal=a[2].distanceTo(a[3]);
          const reach=i%2?upper+Math.sqrt(middle*middle+distal*distal+2*middle*distal*Math.cos(Math.PI*.10))-.2:upper+middle+distal-.2,hip=source[0];
          const need=target.y-hip.y-Math.sqrt(Math.max(.01,reach*reach-(target.x-hip.x)**2-(target.z-hip.z)**2));
          // C1 positive part: local elbow/scapular glide absorbs reach demand,
          // instead of lowering the torso while the head stays suspended.
          const glide=need<-.15?0:need>.15?need:(need+.15)**2/.6;
          source=source.map(p=>p.clone().add(new THREE.Vector3(0,glide,0)));
        }
        const fit=i%2?fitForeContact(source,target):fitContact(source,target),bind=bindJoints(i);
        for(let s=0;s<3;s++)bones[i*4+s]=segmentMatrix(bind[s],bind[s+1],fit.points[s],fit.points[s+1]);
        bones[i*4+3]=pivotMatrix(bind[3],limb.hoof);
        bones[i*4+3].premultiply(new THREE.Matrix4().makeTranslation(fit.points[3].x-bind[3].x,fit.points[3].y-bind[3].y,fit.points[3].z-bind[3].z));
        joints.push(...fit.points.map(p=>p.toArray() as Vec3));reachErrors.push(fit.error);
      });
      // Scapular/haunch tissue follows the actual fitted limb root, with only
      // a fraction of its rotation. This carries motion into the silhouette
      // without swinging the entire chest or pelvis like another leg segment.
      DEER_LEGS.forEach((leg,i)=>{
        const parent=bones[i%2?17:16],upper=bones[i*4];
        const rotation=new THREE.Quaternion().setFromRotationMatrix(parent)
          .slerp(new THREE.Quaternion().setFromRotationMatrix(upper),i%2?.28:.34);
        const hip=vector(leg.hip),root=hip.clone().applyMatrix4(upper);
        bones[22+i]=new THREE.Matrix4().makeTranslation(root.x,root.y,root.z)
          .multiply(new THREE.Matrix4().makeRotationFromQuaternion(rotation))
          .multiply(new THREE.Matrix4().makeTranslation(-hip.x,-hip.y,-hip.z));
      });
      [1,3].forEach((leg,side)=>{
        const elbow=vector(joints[leg*4]),bindShoulder=vector(DEER_SHOULDERS[side]),bindElbow=vector(DEER_LEGS[leg].hip);
        const top=vector(DEER_SCAPULAE[side]),posedTop=top.clone().applyMatrix4(bones[17]);
        const a=top.distanceTo(bindShoulder),b=bindShoulder.distanceTo(bindElbow),axis=elbow.clone().sub(posedTop),distance=axis.length();axis.normalize();
        const along=(a*a-b*b+distance*distance)/(2*distance),height=Math.sqrt(Math.max(0,a*a-along*along));
        const forward=new THREE.Vector3(1,0,0).addScaledVector(axis,-axis.x).normalize();
        const shoulder=posedTop.clone().addScaledVector(axis,along).addScaledVector(forward,height);
        bones[26+side]=segmentMatrix(bindShoulder,bindElbow,shoulder,elbow);
        bones[28+side]=segmentMatrix(top,bindShoulder,posedTop,shoulder);
      });
      const headPose=stableDeerHead(bones[17],{phase:pose.clock,weight:pose.weight,bob,hopBob:pose.hop.bob,hopPitch:pose.hop.pitch,look:pose.look,attention:pose.attention,continuous:refined});
      bones[18]=headPose.neck;bones[19]=headPose.head;
      if(seconds>=lastTime&&seconds-lastTime<.5)for(const loop of new Set([Math.floor(lastTime/132),Math.floor(seconds/132)])){
        for(const start of [DEER_TIMING.depart,DEER_TIMING.home])DEER_LEGS.forEach((leg,i)=>{
          const a=clipSeconds(lastTime-loop*132-start)*frequency+leg.phase,b=clipSeconds(seconds-loop*132-start)*frequency+leg.phase;
          for(let cycle=Math.floor(a)+1;cycle<=Math.floor(b);cycle++){
            const clock=(cycle-leg.phase)/frequency;if(clock<0||clock>clipSeconds(STOP_START))continue;
            const local=gaitSeconds(clock);if(local<.2||local>=STOP_START)continue;
            if(!refined&&deerHop(local,start===DEER_TIMING.home).flight||patrolRoute(start+local,path).effectPhase!=='none')continue;
            const at=loop*132+start+local,landing=groundFeet(start+local+.000001).feet[i];
            landings.push({x:landing[0],y:landing[1]+landing[2]*DEER_GROUND_RATIO,leg:i,at,serial:loop*1000+(start===18?0:400)+cycle*4+i});
          }
        });
      }
      lastTime=seconds;
      return {...route,bob,bones,joints,feet:pose.feet,swinging:pose.swinging,contactWeights:pose.contactWeights,reachErrors,landings,
        head:0,look:pose.look,hop:pose.hop,clipPhase:pose.clock,clipWeight:pose.weight};
    },
  };
}
