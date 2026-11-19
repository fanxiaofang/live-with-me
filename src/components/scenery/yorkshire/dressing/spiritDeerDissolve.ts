import * as THREE from 'three';
import {deerRigAttribute,DEER_GROUND_RATIO,smooth,skinDeerPoint} from './spiritDeerRig';
import {skinModelPoint} from './spiritDeerModel';

export function createDissolveAnchors(surface:{dots:number[];positions:number[];dotSkinIndices?:number[];dotSkinWeights?:number[];skinIndices?:number[];skinWeights?:number[]}){
  const positions:number[]=[],seeds:number[]=[],indices:number[]=[],weights:number[]=[];
  const append=(source:number[],i:number,skinIndices?:number[],skinWeights?:number[])=>{
    positions.push(...source.slice(i,i+3));
    if(skinIndices&&skinWeights){indices.push(...skinIndices.slice(i/3*4,i/3*4+4));weights.push(...skinWeights.slice(i/3*4,i/3*4+4));}
  };
  for(let i=0;i<surface.dots.length;i+=9)append(surface.dots,i,surface.dotSkinIndices,surface.dotSkinWeights);
  // The silhouette includes antlers and ears, not only the sampled body volume.
  for(let i=0;i<surface.positions.length;i+=72){if(surface.positions[i+1]<-108)append(surface.positions,i,surface.skinIndices,surface.skinWeights);}
  for(let i=0;i<positions.length/3;i++){
    let hash=Math.imul(i+17,0x9e3779b1);hash^=hash>>>16;hash=Math.imul(hash,0x7feb352d);hash^=hash>>>15;
    seeds.push((hash>>>0)/4294967296);
  }
  return {positions,seeds,rig:deerRigAttribute(positions),indices,weights};
}
export function freezeDissolveAnchors(anchors:ReturnType<typeof createDissolveAnchors>,bones:THREE.Matrix4[],sourceYaw:number,targetYaw:number,bob=0){
  const from:number[]=[],to:number[]=[];
  const yaw=(p:THREE.Vector3,angle:number)=>p.clone().applyAxisAngle(new THREE.Vector3(0,1,0),angle).add(new THREE.Vector3(0,bob,0));
  for(let i=0;i<anchors.positions.length/3;i++){
    const p=new THREE.Vector3().fromArray(anchors.positions,i*3),r=anchors.rig.slice(i*4,i*4+4);
    const skin=anchors.indices.length?skinModelPoint(p,bones,anchors.indices.slice(i*4,i*4+4),anchors.weights.slice(i*4,i*4+4)):skinDeerPoint(p,bones,r);
    p.lerp(skin,r[3]);from.push(...yaw(p,sourceYaw).toArray());to.push(...yaw(p,targetYaw).toArray());
  }
  return {from,to};
}
/** Stable paths in actor/yard space, independent of the body's hidden heading flip. */
export function dissolvePoint(from:THREE.Vector3,to:THREE.Vector3,seed:number,u:number){
  const scatter=smooth((u-seed*.10)/.34),gather=smooth((u-.54-seed*.06)/.40);
  const hash=(n:number)=>{const x=Math.sin(n*127.1)*43758.5453;return x-Math.floor(x);};
  const cloud=scatter*(1-gather),drift=new THREE.Vector3(hash(seed*113+12)-.5,-.3-hash(seed*193+7)*.7,hash(seed*271+3)-.5).normalize().multiplyScalar(14+seed*17);
  // The invisible middle separates two independent effects. Re-form directly
  // around the destination; never interpolate the original deer into a new yaw.
  const p=(u<.5?from:to).clone().addScaledVector(drift,cloud);
  p.add(new THREE.Vector3(Math.sin(u*9+seed*31),Math.sin(u*7+seed*17),Math.cos(u*8+seed*23)).multiplyScalar(4*cloud));
  return p;
}
export function dissolveEnvelope(u:number){return Math.max(1-smooth((u-.38)/.10),smooth((u-.54)/.12));}
export const dissolveVertex=`
attribute vec3 aFrom;
attribute vec3 aTo;
attribute float aSeed;
uniform float uProgress;
uniform float uPixelScale;
uniform float uGather;
uniform vec3 uActorOrigin;
varying float vAlpha;
varying float vSeed;
float random(float n){return fract(sin(n*127.1)*43758.5453);}
void main(){
 float u=uProgress,scatter=smoothstep(aSeed*.10,.34+aSeed*.10,u);
 float gather=smoothstep(.54+aSeed*.06,.94+aSeed*.06,u),cloud=scatter*(1.-gather);
 vec3 drift=normalize(vec3(random(aSeed*113.+12.)-.5,-.3-random(aSeed*193.+7.)*.7,random(aSeed*271.+3.)-.5))*(14.+aSeed*17.);
 vec3 p=mix(aFrom,aTo,uGather)+drift*cloud-uActorOrigin;
 p+=vec3(sin(u*9.+aSeed*31.),sin(u*7.+aSeed*17.),cos(u*8.+aSeed*23.))*4.*cloud;
 p.y+=p.z*${DEER_GROUND_RATIO};
 float appear=smoothstep(aSeed*.08,.18+aSeed*.08,u);
 float fade=1.-smoothstep(.76+aSeed*.04,1.,u);
 float disappearance=max(1.-smoothstep(.38,.48,u),smoothstep(.54,.66,u));
 vAlpha=appear*fade*disappearance*(.14+.28*aSeed);vSeed=aSeed;
 gl_PointSize=(.8+1.7*pow(aSeed,3.))*uPixelScale;
 gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
}`;
export const dissolveFragment=`
varying float vAlpha;
varying float vSeed;
void main(){
 vec2 p=gl_PointCoord-.5;float r=dot(p,p);
 float glow=exp(-r*18.)*(1.-smoothstep(.12,.25,r));
 gl_FragColor=vec4(mix(vec3(.42,.75,.9),vec3(.83,.94,1.),vSeed),vAlpha*glow);
}`;
