import * as THREE from 'three';

export type Vec3 = [number, number, number];
export const DEER_GROUND_RATIO = .285;
export const DEER_PATROL_PERIOD = 132;
/** One bind pose for the effect carrier, the IK chains and the volume shader. */
export const DEER_LEGS = [
  { hip: [-27,-55,5], knee: [-20,-38.5,5], ankle: [-29,-21,5], sole: [-27,-1,5], phase: 0 },
  { hip: [18,-56,5], knee: [23,-31.5,5], ankle: [18,-8.7,5], sole: [18,-1,5], phase: .77 },
  { hip: [-27,-55,-5], knee: [-20,-38.5,-5], ankle: [-29,-21,-5], sole: [-27,-1,-5], phase: .5 },
  { hip: [18,-56,-5], knee: [23,-31.5,-5], ankle: [18,-8.7,-5], sole: [18,-1,-5], phase: .27 },
] as const;
export const DEER_LEG_RADII = [[4.4,2.5,1.4,1.05],[4.4,1.9,1.2,1.05],[4.4,2.5,1.4,1.05],[4.4,1.9,1.2,1.05]] as const;
/** Equal anatomy on both sides; a relaxed stagger belongs to the pose, not bone lengths. */
export const DEER_STANDING_FEET:readonly Vec3[]=[[-24,-1,5],[22,-1,5],[-32,-1,-5],[14,-1,-5]];
// Four local shoulder/haunch transforms supplement the articulated limbs.
export const DEER_BONE_COUNT=30;
export const DEER_SHOULDERS:readonly Vec3[]=[[22,-69,5],[22,-69,-5]];
export const DEER_SCAPULAE:readonly Vec3[]=[[14,-75,5],[14,-75,-5]];
export function deerMuscleWeight(p:THREE.Vector3,leg:number){
 const hip=DEER_LEGS[leg].hip,side=leg<2?1:-1;
 return (leg%2?.85:.8)*Math.exp(-(((p.x-hip[0])/12)**2+((p.y-hip[1])/13)**2))
  *smooth((side*p.z+2)/6)*smooth((p.y+80)/10);
}
/** Smooth soft-tissue correction on top of limb/trunk skinning. Fade it out
 * continuously as vertices become fully controlled by an articulated limb. */
export function skinDeerPoint(p:THREE.Vector3,bones:THREE.Matrix4[],rig:readonly number[]){
 const [a,b,w]=rig,result=p.clone().applyMatrix4(bones[b]).lerp(p.clone().applyMatrix4(bones[a]),w);
 if(a>=18)return result;
 const limb=a<16?(b<16?1:w):0;
 let influence=0,index=0;
 DEER_LEGS.forEach((_,i)=>{const weight=deerMuscleWeight(p,i)*(1-limb);if(weight>influence){influence=weight;index=i;}});
 const parent=index%2?17:16;
 return result.addScaledVector(p.clone().applyMatrix4(bones[22+index]).sub(p.clone().applyMatrix4(bones[parent])),influence);
}
export const smooth=(t:number)=>{const x=THREE.MathUtils.clamp(t,0,1);return x*x*(3-2*x);};
export function deerSupportLoad(phase:number,stance:number){
 if(phase>=stance)return 0;
 const u=phase/stance;
 return smooth(u/.18)*(1-smooth((u-.78)/.22));
}
export const vector=(p:readonly number[])=>new THREE.Vector3(p[0],p[1],p[2]);
export function bindJoints(leg:number) {const l=DEER_LEGS[leg];return [l.hip,l.knee,l.ankle,l.sole].map(vector);}

/** The short pastern is not a spare hinge for satisfying an arbitrary foot goal.
 * Keep its bend small and solve the major elbow/carpal chain analytically.
 * Limits are this stylised rig's authoring constraints, not biological measurements.
 */
export function fitForeContact(source:THREE.Vector3[],target:THREE.Vector3,flexion?:number){
  const hip=source[0].clone(),a=source[1].distanceTo(hip),b=source[2].distanceTo(source[1]),c=source[3].distanceTo(source[2]);
  const middle=source[2].clone().sub(source[1]),distal=source[3].clone().sub(source[2]);
  const measured=Math.atan2(distal.x,distal.y)-Math.atan2(middle.x,middle.y);
  const bend=THREE.MathUtils.clamp(flexion??measured,Math.PI*.025,Math.PI*.10);
  const effective=Math.sqrt(b*b+c*c+2*b*c*Math.cos(bend));
  const axis=target.clone().sub(hip),reach=axis.length(),length=THREE.MathUtils.clamp(reach,.001,a+effective-.00001);
  axis.normalize();
  const along=(a*a-effective*effective+length*length)/(2*length),height=Math.sqrt(Math.max(0,a*a-along*along));
  // This visible joint is the carpal fold in the simplified carrier: it folds
  // forward as in the user's side-view reference, with the hoof recovering behind.
  const forwardPole=new THREE.Vector3(1,0,0).addScaledVector(axis,-axis.x).normalize();
  const knee=hip.clone().addScaledVector(axis,along).addScaledVector(forwardPole,height);
  const goal=hip.clone().addScaledVector(axis,length),lower=goal.clone().sub(knee).normalize();
  const forward=new THREE.Vector3(1,0,0).addScaledVector(lower,-lower.x).normalize();
  const offset=Math.atan2(c*Math.sin(bend),b+c*Math.cos(bend));
  const ankle=knee.clone().addScaledVector(lower,b*Math.cos(offset)).addScaledVector(forward,-b*Math.sin(offset));
  return {points:[hip,knee,ankle,goal],error:goal.distanceTo(target)};
}

/** A planted forelimb extends through mid support by letting its scapular
 * root glide within the chest. Never lengthen bones or move the planted hoof.
 * Keep a small flexion reserve; this is not a locked/reversed joint. */
export function extendForeSupport(source:THREE.Vector3[],target:THREE.Vector3,weight:number){
 const hip=source[0],a=source[1].distanceTo(hip),b=source[2].distanceTo(source[1]),c=source[3].distanceTo(source[2]);
 const middle=source[2].clone().sub(source[1]),distal=source[3].clone().sub(source[2]);
 const bend=THREE.MathUtils.clamp(Math.atan2(distal.x,distal.y)-Math.atan2(middle.x,middle.y),Math.PI*.025,Math.PI*.10);
 const lower=Math.sqrt(b*b+c*c+2*b*c*Math.cos(bend));
 const reach=Math.sqrt(a*a+lower*lower+2*a*lower*Math.cos(.16));
 const horizontal=(target.x-hip.x)**2+(target.z-hip.z)**2;
 const desired=target.y-Math.sqrt(Math.max(.01,reach*reach-horizontal));
 const lift=THREE.MathUtils.clamp(desired-hip.y,-1.8,0)*weight;
 return source.map(p=>p.clone().add(new THREE.Vector3(0,lift,0)));
}

/** Small end-effector correction preserving the authored three-segment shape. */
export function fitContact(source:THREE.Vector3[],target:THREE.Vector3,iterations=48) {
  const points=source.map(p=>p.clone()),root=points[0].clone();
  const lengths=points.slice(1).map((p,i)=>p.distanceTo(points[i]));
  const reach=root.distanceTo(target),total=lengths.reduce((a,b)=>a+b,0);
  const goal=target.clone();
  if(reach>total-.0001)goal.copy(root).add(target.clone().sub(root).setLength(total-.0001));
  for(let pass=0;pass<iterations;pass++) {
    points[3].copy(goal);
    for(let i=2;i>=0;i--)points[i].sub(points[i+1]).setLength(lengths[i]).add(points[i+1]);
    points[0].copy(root);
    for(let i=1;i<4;i++)points[i].sub(points[i-1]).setLength(lengths[i-1]).add(points[i-1]);
    if(points[3].distanceToSquared(goal)<1e-10)break;
  }
  return {points,error:points[3].distanceTo(target)};
}
export function segmentMatrix(a:THREE.Vector3,b:THREE.Vector3,p:THREE.Vector3,q:THREE.Vector3) {
  const rotation=new THREE.Quaternion().setFromUnitVectors(b.clone().sub(a).normalize(),q.clone().sub(p).normalize());
  return new THREE.Matrix4().makeTranslation(p.x,p.y,p.z).multiply(new THREE.Matrix4().makeRotationFromQuaternion(rotation))
    .multiply(new THREE.Matrix4().makeTranslation(-a.x,-a.y,-a.z));
}
/** Anatomical chain attribution; a knee is fully bound, including its outer silhouette. */
export function deerRigAttribute(positions:ArrayLike<number>) {
  const attributes:number[]=[];
  for(let i=0;i<positions.length;i+=3) {
    const p=new THREE.Vector3(positions[i],positions[i+1],positions[i+2]);
    let closest=Infinity,leg=0,segment=0;
    DEER_LEGS.forEach((definition,index)=>{
      const bind=[definition.hip,definition.knee,definition.ankle,definition.sole];
      for(let part=0;part<3;part++) {
        const a=vector(bind[part]),b=vector(bind[part+1]),axis=b.clone().sub(a);
        const u=THREE.MathUtils.clamp(p.clone().sub(a).dot(axis)/axis.lengthSq(),0,1);
        const distance=p.distanceTo(a.addScaledVector(axis,u));
        if(distance<closest) {closest=distance;leg=index;segment=part;}
      }
    });
    const definition=DEER_LEGS[leg],bind=[definition.hip,definition.knee,definition.ankle,definition.sole];
    const radii=DEER_LEG_RADII[leg],u=THREE.MathUtils.clamp((p.y-bind[segment][1])/(bind[segment+1][1]-bind[segment][1]),0,1);
    const radius=THREE.MathUtils.lerp(radii[segment],radii[segment+1],u);
    const blend=smooth((p.y-definition.hip[1]-1)/8)*(1-smooth((closest-radius-1)/3));
    let first=segment,second=segment,weight=1;
    for(let joint=1;joint<3;joint++) {
      const width=Math.min(1.2,vector(bind[joint+1]).distanceTo(vector(bind[joint]))*.12);
      if(Math.abs(p.y-bind[joint][1])<width) {first=joint-1;second=joint;weight=1-smooth((p.y-bind[joint][1]+width)/(width*2));break;}
    }
    // The whole hoof is rigid. Only a narrow collar joins it to the pastern.
    if(p.y>definition.sole[1]-2.3){first=2;second=3;weight=1-smooth((p.y-definition.sole[1]+2.3)/.6);}
    if(p.y>=definition.sole[1]-1.7){first=second=3;weight=1;}
    if(blend<1) {
      // The trunk and head have real motion too; blend each limb into its parent.
      const parent=leg%2?17:16;
      if(blend<.001) {
        let a=16,b=17,w=1-smooth((p.x+25)/45);
        if(p.y< -98||(p.x>12&&p.y< -80)) {a=18;b=19;w=smooth((p.y+96)/16);}
        else if(p.x>12&&p.y< -60){a=17;b=18;w=1-smooth((-p.y-60)/20);}
        else if(p.x< -37&&p.y< -50) {a=21;b=16;w=1-smooth((p.x+43)/6);}
        attributes.push(a,b,w,1);continue;
      }
      // The upper segment meets the animated shoulder/pelvis without a rest-pose seam.
      attributes.push(leg*4+first,parent,blend,1);continue;
    }
    attributes.push(leg*4+first,leg*4+second,weight,1);
  }
  return attributes;
}
