import type { TimeOfDay } from '../../../types';
import { meadowHillNormal, meadowHillSurfaceY, MEADOW_FOOTHILL } from '../../scene/meadowFoothill';
import { MEADOW_GROUND_ROLES, SUMMER_MEADOW_VEGETATION, meadowVegetationWeights, type MeadowVegetationPalette } from '../../scene/meadowVegetation';
import { LANDSCAPE_SURFACES } from '../../scene/landscapeGeometry';
import { resolveF2Environment } from './F2Environment';
import { environmentLook } from './vendor/backdrop/environment.js';
import { sunVector, diffuseAt, heightSample, surfaceNormal, ridgeSample } from './vendor/f2/VirtualReliefModel.js';
import { fogMask } from './vendor/backdrop/ridgeMaterial.js';
import { resolveSourceHillsLook } from './F2Atmosphere';
import { F2_STUDIES, requestedF2Study } from './f2Config';

/** Accepted vegetation blending under the original F2 light and atmosphere. */
export function meadowFoothillMaterial(time:TimeOfDay,height:number=MEADOW_FOOTHILL.height,vegetation:MeadowVegetationPalette=SUMMER_MEADOW_VEGETATION) {
  const {config,study}=resolveF2Environment(time);
  const look=environmentLook(config,{...config.layers[2],color:'#899b70'},2);
  const nearest=resolveSourceHillsLook(config,2);
  const coverLooks=MEADOW_GROUND_ROLES.map(role=>environmentLook(config,{...config.layers[2],color:vegetation.ground[role]},2));
  const sun=sunVector(study.lighting);
  const response=(normal:number[])=>Math.max(-.65,Math.min(.65,
    (study.lighting.ambientIntensity+study.lighting.sunIntensity*diffuseAt(normal,sun)-.90)*.90));
  const shade=(material:typeof look,normal:number[],contrast=1)=>{
    const r=Math.max(-.8,Math.min(.8,response(normal)*contrast)),color=material.base.clone();
    return color.lerp(r>=0?material.lit:material.shade,Math.abs(r)*material.light);
  };
  const groundAt=(x:number)=>{
    const p=F2_STUDIES[requestedF2Study()].placement;
    const unit=p.unitsPerDesignUnit*p.scale*p.layerScale[2];
    const sx=(x-p.centerX-p.offsetX)/unit;
    const sy=(p.horizonY+p.offsetY+p.layerOffsetY[2]-meadowHillSurfaceY(x,1,height)!-LANDSCAPE_SURFACES.backgroundOffsetY)/unit;
    const ridge=ridgeSample(config.layers[2].points,sx).height;
    const z=Math.max(0,ridge-sy)*study.model.depth/study.model.screenDrop;
    const normal=surfaceNormal(heightSample(config.layers[2].points,study.model,sx,z),study.lighting.reliefStrength);
    return shade(nearest,normal).lerp(nearest.air,Math.min(.92,nearest.layerAir+fogMask(sx,sy,ridge,nearest)*nearest.foot));
  };
  const colorAt=(x:number,depth:number)=>{
    const normal=meadowHillNormal(x,depth,study.lighting.reliefStrength);
    const weights=meadowVegetationWeights(x,depth),color=look.base.clone().setRGB(0,0,0);
    coverLooks.forEach((cover,i)=>color.add(shade(cover,normal,.85).multiplyScalar(weights[i])));
    color.lerp(look.air,.18);
    const thickness=meadowHillSurfaceY(x,1,height)!-meadowHillSurfaceY(x,0,height)!;
    const endMix=1-Math.min(1,thickness/16);
    const toeMix=Math.max(0,(depth-.90)/(1-.90));
    return '#'+color.lerp(groundAt(x),Math.max(endMix,toeMix)).getHexString();
  };
  const landmarkColor=(hex:string,normal:number[])=>'#'+shade(
    environmentLook(config,{...config.layers[2],color:hex},2),normal).lerp(look.air,.18).getHexString();
  return {colorAt,landmarkColor,sun,lighting:study.lighting,air:'#'+look.air.getHexString(),response,
    groundAt:(x:number)=>'#'+groundAt(x).getHexString()};
}
