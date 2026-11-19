import * as THREE from 'three';
import data from './spiritDeerWalkClip.json';

/** Hand-keyed/baked joint animation. Contact IK is a separate, bounded layer. */
export const DEER_WALK_STRIDE=data.stride;
export const DEER_WALK_STANCE=data.stance;
export const DEER_WALK_STANCES=data.stances;
export const deerWalkClip=new THREE.AnimationClip(data.name,1,Object.entries(data.tracks).map(([name,values])=>
  new THREE.NumberKeyframeTrack(`.${name}`,data.times,values)));
export function createWalkPlayer(){
  const clips=[data.tracks,...data.variants];
  const interpolants=clips.map(tracks=>Object.fromEntries(Object.entries(tracks).map(([name,values])=>
    [name,new THREE.NumberKeyframeTrack(`.${name}`,data.times,values).InterpolantFactoryMethodLinear()])));
  return (name:string,phase:number,variation=0)=>{
    const t=((phase%1)+1)%1,mix=Math.max(0,Math.min(2,variation)),a=Math.min(1,Math.floor(mix));
    const x=Number(interpolants[a][name].evaluate(t)[0]),y=Number(interpolants[a+1][name].evaluate(t)[0]);
    return THREE.MathUtils.lerp(x,y,mix-a);
  };
}
