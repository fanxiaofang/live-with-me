import * as THREE from 'three';
import {MarchingCubes} from 'three/addons/objects/MarchingCubes.js';
import {mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {deerDistance} from './spiritDeerShape3D';
import {DEER_LEGS,DEER_BONE_COUNT,DEER_SHOULDERS,DEER_SCAPULAE,deerRigAttribute,smooth,vector} from './spiritDeerRig';

/** One continuous surface and one four-influence binding for every visible
 * layer. The field is used only to author the rest mesh, never rebuilt per pose. */
export function deerModelWeights(p:THREE.Vector3){
 const [a,b,w]=deerRigAttribute(p.toArray()),weights=new Map<number,number>();
 const add=(i:number,v:number)=>weights.set(i,(weights.get(i)??0)+v);
 add(a,w);add(b,1-w);
 // Continuous anatomical zones replace the height/x thresholds of the old
 // two-influence carrier around the throat and poll.
 const neck=Math.max(smooth((p.x-5)/14)*(1-smooth((p.y+72)/16)),smooth((-p.y-94)/7));
 if(neck>0){
  weights.clear();const chest=smooth((p.x+25)/45);
  add(16,(1-neck)*(1-chest));add(17,(1-neck)*chest);
  const head=Math.max(smooth((-p.y-82)/14),smooth((p.x-31)/8)*smooth((-p.y-84)/6));
  add(18,neck*(1-head));add(19,neck*head);
 }
 if(a<18){
  const limb=a<16?(b<16?1:w):0;
  const tissue=DEER_LEGS.map((leg,i)=>{
   const fore=i%2===1,cx=fore?20:leg.hip[0],cy=fore?-62:-50;
   const strength=.82*Math.exp(-(((p.x-cx)/12)**2+((p.y-cy)/14)**2))*smooth(((i<2?1:-1)*p.z+2)/6)*smooth((p.y+80)/10)*(1-limb)*(1-neck);
   return {i,fore,strength};
  });
  const sum=Math.min(.88,tissue.reduce((s,t)=>s+t.strength,0));
  for(const [i,v] of weights)weights.set(i,v*(1-sum));
  const total=tissue.reduce((s,t)=>s+t.strength,0)||1;
  tissue.forEach(t=>{
   const amount=t.strength/total*sum;
   if(t.fore){const side=t.i===1?0:1,arm=smooth((p.y+73)/15);add(26+side,amount*arm);add(28+side,amount*(1-arm));}
   else add(22+t.i,amount);
  });
 }
 const sorted=[...weights].filter(([,w])=>w>1e-7).sort((a,b)=>b[1]-a[1]).slice(0,4);
 const sum=sorted.reduce((s,[,w])=>s+w,0)||1;
 while(sorted.length<4)sorted.push([0,0]);
 return {indices:sorted.map(([i])=>i),weights:sorted.map(([,w])=>w/sum)};
}

const cached=new Map<string,THREE.BufferGeometry>();
export function deerModelGeometry(refined=false,guardian=false,paired=false){
 const cacheKey=`${refined}:${guardian}:${paired}`;
 if(cached.has(cacheKey))return cached.get(cacheKey)!.clone();
 const resolution=76,material=new THREE.MeshBasicMaterial(),march=new MarchingCubes(resolution,material,false,false,80000);
 march.isolation=0;
 const min=new THREE.Vector3(-51,-119,-15),span=new THREE.Vector3(119,126,30);
 for(let z=0;z<resolution;z++)for(let y=0;y<resolution;y++)for(let x=0;x<resolution;x++)
  march.field[x+y*resolution+z*resolution*resolution]=-deerDistance(min.x+x/resolution*span.x,min.y+y/resolution*span.y,min.z+z/resolution*span.z,refined,paired);
 march.update();
 const source=march.geometry.getAttribute('position'),count=march.geometry.drawRange.count,positions=new Float32Array(count*3);
 for(let i=0;i<count;i++){
  positions[i*3]=min.x+(source.getX(i)+1)*span.x/2;
  positions[i*3+1]=min.y+(source.getY(i)+1)*span.y/2;
  positions[i*3+2]=min.z+(source.getZ(i)+1)*span.z/2;
 }
 const raw=new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(positions,3));
 const geometry=mergeVertices(raw,1e-4);
 // Local, shrink-resistant fairing removes extraction ridges at the curved
 // head/neck join. Forelimbs and the fitted hoof geometry are left untouched.
 const gp=geometry.getAttribute('position'),neighbors=Array.from({length:gp.count},()=>new Set<number>()),gi=geometry.index!;
 for(let i=0;i<gi.count;i+=3){const a=gi.getX(i),b=gi.getX(i+1),c=gi.getX(i+2);neighbors[a].add(b).add(c);neighbors[b].add(a).add(c);neighbors[c].add(a).add(b);}
 for(const amount of [.35,-.36,.35,-.36]){
  const old=Float32Array.from(gp.array),out=Float32Array.from(old);
  for(let i=0;i<gp.count;i++){
   const x=old[i*3],y=old[i*3+1],weight=smooth((x-6)/12)*(1-smooth((y+64)/10))*(1-smooth((-y-99)/5));
   if(weight<.001||!neighbors[i].size)continue;
   for(let k=0;k<3;k++){let mean=0;for(const j of neighbors[i])mean+=old[j*3+k];mean/=neighbors[i].size;out[i*3+k]+=amount*weight*(mean-old[i*3+k]);}
  }
  gp.array.set(out);
 }
 if(guardian)for(let i=0;i<gp.count;i++){
  // A tangent-continuous distal bend: preserve the root/hip junction, let the
  // latter half of the leaf tail settle down rather than rotating its root.
  const u=THREE.MathUtils.clamp((-gp.getX(i)-38)/11,0,1);
  if(u>0)gp.setY(i,gp.getY(i)+3.1*u*u);
 }
 geometry.computeVertexNormals();
 const skinIndex:number[]=[],skinWeight:number[]=[],p=geometry.getAttribute('position');
 for(let i=0;i<p.count;i++){const w=deerModelWeights(new THREE.Vector3().fromBufferAttribute(p,i));skinIndex.push(...w.indices);skinWeight.push(...w.weights);}
 geometry.setAttribute('skinIndex',new THREE.Uint16BufferAttribute(skinIndex,4));
 geometry.setAttribute('skinWeight',new THREE.Float32BufferAttribute(skinWeight,4));
 geometry.computeBoundingSphere();
 cached.set(cacheKey,geometry);raw.dispose();march.geometry.dispose();material.dispose();
 return geometry.clone();
}

const bindPoints=()=>{
 const points=DEER_LEGS.flatMap(leg=>[leg.hip,leg.knee,leg.ankle,leg.sole].map(vector));
 points.push(new THREE.Vector3(-27,-55,0),new THREE.Vector3(18,-59,0),new THREE.Vector3(21,-72,0),new THREE.Vector3(34,-95,0),new THREE.Vector3(-8,-59,0),new THREE.Vector3(-35,-62,0));
 points.push(...DEER_LEGS.map(leg=>vector(leg.hip)),...DEER_SHOULDERS.map(vector),...DEER_SCAPULAE.map(vector));return points;
};
export function createDeerSkeleton(){
 const points=bindPoints(),parents=[16,0,1,2,26,4,5,6,16,8,9,10,27,12,13,14,-1,20,17,18,16,16,16,17,16,17,28,29,17,17];
 const names=['femur_near','tibia_near','cannon_hind_near','hoof_hind_near','radius_near','cannon_fore_near','pastern_fore_near','hoof_fore_near','femur_far','tibia_far','cannon_hind_far','hoof_hind_far','radius_far','cannon_fore_far','pastern_fore_far','hoof_fore_far','pelvis','chest','neck','head','spine','tail','haunch_near','shoulder_tissue_near','haunch_far','shoulder_tissue_far','humerus_near','humerus_far','scapula_near','scapula_far'];
 const bones=Array.from({length:DEER_BONE_COUNT},(_,i)=>{const b=new THREE.Bone();b.name=names[i];return b;});
 bones.forEach((bone,i)=>{const parent=parents[i];bone.position.copy(points[i]);if(parent>=0){bone.position.sub(points[parent]);bones[parent].add(bone);}});
 bones[16].updateMatrixWorld(true);const skeleton=new THREE.Skeleton(bones);skeleton.calculateInverses();
 const bind=points.map(p=>new THREE.Matrix4().makeTranslation(p.x,p.y,p.z)),world=bind.map(m=>m.clone());
 return {root:bones[16],skeleton,update(pose:THREE.Matrix4[]){
  bones.forEach((_,i)=>world[i].multiplyMatrices(pose[i],bind[i]));
  bones.forEach((bone,i)=>{bone.matrixAutoUpdate=false;bone.matrix.copy(world[i]);if(parents[i]>=0)bone.matrix.premultiply(world[parents[i]].clone().invert());});
  bones[16].updateMatrixWorld(true);skeleton.update();
 }};
}

export {createFlowingDeerSurface as createDeerModelSurface} from './spiritDeerSurface';

export function deerSurfaceBinding(positions:ArrayLike<number>){
 const indices:number[]=[],weights:number[]=[];
 for(let i=0;i<positions.length;i+=3){const w=deerModelWeights(new THREE.Vector3(positions[i],positions[i+1],positions[i+2]));indices.push(...w.indices);weights.push(...w.weights);}
 return {indices,weights};
}

export function skinModelPoint(p:THREE.Vector3,bones:THREE.Matrix4[],indices:readonly number[],weights:readonly number[]){
 const out=new THREE.Vector3();for(let i=0;i<4;i++)if(weights[i])out.addScaledVector(p.clone().applyMatrix4(bones[indices[i]]),weights[i]);return out;
}
