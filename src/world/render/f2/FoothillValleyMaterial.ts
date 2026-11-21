import * as THREE from 'three';
import type { TimeOfDay } from '../../../types';
import { environmentLook } from './vendor/backdrop/environment.js';
import { F2_STUDIES, requestedF2Study } from './f2Config';
import { LANDSCAPE_SURFACES } from '../../scene/landscapeGeometry';
import { SUMMER_MEADOW_VEGETATION } from '../../scene/meadowVegetation';
import { valleyPeriodAir } from './F3AtmosphereStudy';

const smooth = (a:number,b:number,v:number) => { const t=Math.max(0,Math.min(1,(v-a)/(b-a)));return t*t*(3-2*t); };
export const VALLEY_S4 = { depthBack:.08, depthFront:.48, gateBack:.025, gateFront:.20,
  leftFadeStart:190, leftFadeEnd:430, rightFadeStart:720, rightFadeEnd:950,
  endRadiusX:220, endRadiusY:58, airStrength:.045, air:'#b9d2d8' } as const;

export function valleyMapping(depth:number,screenDrop:number) {
  const p=F2_STUDIES[requestedF2Study()].placement;
  return new THREE.Vector4(p.centerX+p.offsetX,
    p.horizonY+p.offsetY+p.layerOffsetY[2]-LANDSCAPE_SURFACES.backgroundOffsetY,
    p.unitsPerDesignUnit*p.scale*p.layerScale[2],depth/screenDrop);
}

/** Shared hill-local depth/proximity contract; x controls connection, never air distance. */
export function valleyFields(x:number,y:number,ridge:number,map:THREE.Vector4) {
  const p=VALLEY_S4,lx=map.x+x*map.z,ly=map.y-y*map.z,z=Math.max(0,ridge-y)*map.w;
  const side=Math.max(1-smooth(p.leftFadeStart,p.leftFadeEnd,lx),smooth(p.rightFadeStart,p.rightFadeEnd,lx));
  // Protect the hill body, not the entire central column of the valley.
  // This is the accepted foot curve in hill-local coordinates, not a screen band.
  const t=Math.max(0,Math.min(1,(lx-90)/900));
  const foot=247+21*Math.sin(Math.PI*t)-5*t;
  const front=smooth(foot,foot+34,ly);
  const coverage=Math.max(side,front);
  const proximity=(cx:number,cy:number)=>{
    const dx=(lx-cx)/p.endRadiusX,dy=(ly-cy)/p.endRadiusY;
    return Math.exp(-(dx*dx+dy*dy));
  };
  const near=Math.max(proximity(90,247),proximity(990,242));
  const d=smooth(p.depthBack,p.depthFront,z);
  const weight=coverage*smooth(p.gateBack,p.gateFront,z)*Math.min(.96,.16+.72*d+.20*near);
  // Broad terrain-attached cover, not horizontal stripes or high-frequency noise.
  const u=x+.12*Math.sin(z*4.1+x*.7),v=z+.055*Math.sin(x*2.4);
  const patch=(cx:number,cz:number,rx:number,rz:number)=>{const dx=(u-cx)/rx,dz=(v-cz)/rz;return Math.exp(-(dx*dx+dz*dz));};
  const dry=Math.max(patch(-1.48,.40,.66,.29),patch(1.65,.58,.85,.30),.85*patch(.18,.68,.78,.28));
  const hollow=Math.max(patch(-.96,.24,.42,.20),patch(1.04,.29,.53,.23),.85*patch(-.34,.43,.60,.19));
  const warm=.12+.24*d+.24*dry;
  const understory=.42*hollow;
  const variation=1+.065*(dry-.85*hollow)+.02*Math.sin(x*1.7+z*1.1);
  return { weight,warm,understory,variation,depth:d };
}

export function valleyPalette(config:unknown) {
  const c=config as {layers:Record<string,unknown>[];timeOfDay:TimeOfDay};
  const period=valleyPeriodAir(c.timeOfDay);
  const look=(color:string)=>environmentLook(config,{...c.layers[2],color},2);
  return { meadow:look(SUMMER_MEADOW_VEGETATION.ground.meadow),dry:look(SUMMER_MEADOW_VEGETATION.ground.dryGrass),understory:look(SUMMER_MEADOW_VEGETATION.ground.understory),air:new THREE.Color(period.color),airStrength:period.strength };
}

/** Called by the SVG hill's existing contact sampler, before its normal toe blending. */
export function applyValleyColor(originalLit:THREE.Color,air:THREE.Color,airStrength:number,
  response:number,light:number,fields:ReturnType<typeof valleyFields>,palette:ReturnType<typeof valleyPalette>) {
  if(fields.weight===0)return originalLit.lerp(air,airStrength);
  const shaded=(look:typeof palette.meadow)=>look.base.clone().lerp(response>=0?look.lit:look.shade,Math.abs(response)*light);
  const material=shaded(palette.meadow).lerp(shaded(palette.dry),fields.warm)
    .lerp(shaded(palette.understory),fields.understory).multiplyScalar(fields.variation);
  const color=originalLit.lerp(material,fields.weight);
  const localAir=air.clone().lerp(palette.air,fields.weight*.45);
  return color.lerp(localAir,airStrength+(palette.airStrength-airStrength)*fields.weight);
}

/** Host extension only: same nearest mesh, same relief/air shader when disabled. */
export function addValleyMaterial(material:THREE.ShaderMaterial) {
  const token='color=mix(color,uAir,min(.92,uLayerAir+foot*uFoot));';
  if(!material.fragmentShader.includes(token))throw new Error('S4 valley hook no longer matches F2 relief material');
  const p=VALLEY_S4;
  const functions=`
    uniform float uS4ValleyEnabled;
    uniform float uS4ValleyAirStrength;
    uniform vec4 uS4ValleyMap;
    uniform vec3 uS4ValleyMeadow,uS4ValleyMeadowLit,uS4ValleyMeadowShade;
    uniform vec3 uS4ValleyDry,uS4ValleyDryLit,uS4ValleyDryShade,uS4ValleyAir;
    uniform vec3 uS4ValleyUnderstory,uS4ValleyUnderstoryLit,uS4ValleyUnderstoryShade;
    float valleyPatchS4(vec2 p,vec2 c,vec2 r){vec2 q=(p-c)/r;return exp(-dot(q,q));}
    vec4 valleyFieldsS4(float x,float y,float ridge){
      float lx=uS4ValleyMap.x+x*uS4ValleyMap.z,ly=uS4ValleyMap.y-y*uS4ValleyMap.z;
      float z=max(0.,ridge-y)*uS4ValleyMap.w;
      float side=max(1.-smoothstep(${p.leftFadeStart}.,${p.leftFadeEnd}.,lx),smoothstep(${p.rightFadeStart}.,${p.rightFadeEnd}.,lx));
      float t=clamp((lx-90.)/900.,0.,1.);
      float footY=247.+21.*sin(3.141592653589793*t)-5.*t;
      float coverage=max(side,smoothstep(footY,footY+34.,ly));
      vec2 a=vec2((lx-90.)/${p.endRadiusX}.,(ly-247.)/${p.endRadiusY}.);
      vec2 b=vec2((lx-990.)/${p.endRadiusX}.,(ly-242.)/${p.endRadiusY}.);
      float nearHill=max(exp(-dot(a,a)),exp(-dot(b,b)));
      float d=smoothstep(${p.depthBack},${p.depthFront},z);
      float weight=coverage*smoothstep(${p.gateBack},${p.gateFront},z)*min(.96,.16+.72*d+.20*nearHill);
      vec2 uv=vec2(x+.12*sin(z*4.1+x*.7),z+.055*sin(x*2.4));
      float dry=max(max(valleyPatchS4(uv,vec2(-1.48,.40),vec2(.66,.29)),valleyPatchS4(uv,vec2(1.65,.58),vec2(.85,.30))),.85*valleyPatchS4(uv,vec2(.18,.68),vec2(.78,.28)));
      float hollow=max(max(valleyPatchS4(uv,vec2(-.96,.24),vec2(.42,.20)),valleyPatchS4(uv,vec2(1.04,.29),vec2(.53,.23))),.85*valleyPatchS4(uv,vec2(-.34,.43),vec2(.60,.19)));
      float warm=.12+.24*d+.24*dry;
      float variation=1.+.065*(dry-.85*hollow)+.02*sin(x*1.7+z*1.1);
      return vec4(weight,warm,variation,.42*hollow);
    }
  `;
  material.fragmentShader=material.fragmentShader.replace('void main(){',functions+'\nvoid main(){').replace(token,`
    if(uS4ValleyEnabled>.5){
      vec4 v=valleyFieldsS4(x,y,vRidge);
      vec3 m=mix(uS4ValleyMeadow,response>=0.?uS4ValleyMeadowLit:uS4ValleyMeadowShade,abs(response)*uLight);
      vec3 d=mix(uS4ValleyDry,response>=0.?uS4ValleyDryLit:uS4ValleyDryShade,abs(response)*uLight);
      vec3 s=mix(uS4ValleyUnderstory,response>=0.?uS4ValleyUnderstoryLit:uS4ValleyUnderstoryShade,abs(response)*uLight);
      color=mix(color,mix(mix(m,d,v.y),s,v.w)*v.z,v.x);
      float originalAir=min(.92,uLayerAir+foot*uFoot);
      color=mix(color,mix(uAir,uS4ValleyAir,v.x*.45),mix(originalAir,uS4ValleyAirStrength,v.x));
    }else{${token}}
  `);
  material.uniforms.uS4ValleyEnabled={value:0};
  material.uniforms.uS4ValleyAirStrength={value:VALLEY_S4.airStrength};
  material.uniforms.uS4ValleyMap={value:new THREE.Vector4()};
  for(const name of ['Meadow','MeadowLit','MeadowShade','Dry','DryLit','DryShade','Understory','UnderstoryLit','UnderstoryShade','Air'])
    material.uniforms['uS4Valley'+name]={value:new THREE.Color()};
  material.needsUpdate=true;
}

export function updateValleyMaterial(material:THREE.ShaderMaterial,config:unknown,
  model:{depth:number;screenDrop:number},time:TimeOfDay,enabled:boolean) {
  const u=material.uniforms,p=valleyPalette(config);
  u.uS4ValleyEnabled.value=enabled?1:0;
  u.uS4ValleyAirStrength.value=valleyPeriodAir(time).strength;
  u.uS4ValleyMap.value.copy(valleyMapping(model.depth,model.screenDrop));
  for(const [prefix,look] of [['Meadow',p.meadow],['Dry',p.dry],['Understory',p.understory]] as const){
    u['uS4Valley'+prefix].value.copy(look.base);
    u['uS4Valley'+prefix+'Lit'].value.copy(look.lit);
    u['uS4Valley'+prefix+'Shade'].value.copy(look.shade);
  }
  u.uS4ValleyAir.value.copy(p.air);
}
