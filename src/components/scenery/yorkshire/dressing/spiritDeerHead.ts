import * as THREE from 'three';

export const DEER_HEAD_CENTER=new THREE.Vector3(34,-95,0);
const NECK_BASE=new THREE.Vector3(21,-72,0),NECK_TOP=new THREE.Vector3(27,-90,0);
type HeadMotion={phase:number;weight:number;bob:number;hopBob:number;hopPitch:number;look:number;attention:number;continuous?:boolean};

/** Follow the animal's forward travel, while keeping gaze and height steady
 * relative to the ground. The neck bridges the moving chest to that target.
 * Pure, seekable geometry: foot-contact sampling must not depend on frame history.
 */
export function stableDeerHead(chest:THREE.Matrix4,motion:HeadMotion){
 const {phase,weight,bob,hopBob,hopPitch,look,attention}=motion;
 // Equal residual at corresponding left/right forelimb phases. Deliberate
 // scanning spans several steps and is independent of this small gait residue.
 const step=phase*Math.PI*4;
 const pitch=.0012*weight*Math.sin(step+.4)+.002*look-.002*attention+hopPitch*.25;
 const yaw=.25*look+.09*attention;
 const dx=.035*weight*Math.sin(step-.2),dy=-bob+hopBob+.04*weight*Math.sin(step+.7);
 const head=new THREE.Matrix4().makeTranslation(DEER_HEAD_CENTER.x+dx,DEER_HEAD_CENTER.y+dy,0)
  .multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0,yaw,-pitch)))
  .multiply(new THREE.Matrix4().makeTranslation(-DEER_HEAD_CENTER.x,-DEER_HEAD_CENTER.y,0));
 const base=NECK_BASE.clone().applyMatrix4(chest),top=NECK_TOP.clone().applyMatrix4(head);
 const rest=NECK_TOP.clone().sub(NECK_BASE),axis=top.sub(base);
 const ratio=axis.length()/rest.length(),stretch=motion.continuous?ratio:THREE.MathUtils.clamp(ratio,.96,1.04);
 const unit=rest.clone().normalize(),k=stretch-1;
 const scale=motion.continuous?new THREE.Matrix4().set(1+k*unit.x*unit.x,k*unit.x*unit.y,k*unit.x*unit.z,0,k*unit.y*unit.x,1+k*unit.y*unit.y,k*unit.y*unit.z,0,k*unit.z*unit.x,k*unit.z*unit.y,1+k*unit.z*unit.z,0,0,0,0,1):new THREE.Matrix4().makeScale(stretch,stretch,stretch);
 const rotation=new THREE.Quaternion().setFromUnitVectors(rest.normalize(),axis.normalize());
 const neck=new THREE.Matrix4().makeTranslation(base.x,base.y,base.z)
  .multiply(new THREE.Matrix4().makeRotationFromQuaternion(rotation))
  .multiply(scale)
  .multiply(new THREE.Matrix4().makeTranslation(-NECK_BASE.x,-NECK_BASE.y,-NECK_BASE.z));
 return {neck,head,pitch,yaw,stretch};
}
