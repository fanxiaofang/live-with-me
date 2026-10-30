import * as THREE from 'three';
import {PALETTES,WEATHER_LOOKS} from './config.js';
import {environmentLook} from './environment.js';
const rgb=v=>new THREE.Color(v),mix=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t);};
const gauss=(x,c,w)=>Math.exp(-(((x-c)/w)**2));
const IDS=['#b9b5d2','#819fa9','#617b65','#b29564'];
function legacyLook(config,layer,index,season=config.season,weather=config.weather,useConfig=true){
 const w=WEATHER_LOOKS[weather],p=PALETTES[season],base=rgb(useConfig?layer.color:p.colors[config.layers.length===2?index*2:index]);
 const air=rgb(useConfig?config.palette.air:p.air).lerp(rgb(w.sky),w.skyMix*.32),top=rgb(useConfig?config.palette.skyTop:p.skyTop).lerp(rgb(w.sky),w.skyMix);
 return{base,air,top,horizon:air.clone(),lit:base.clone(),shade:base.clone(),layerAir:Math.min(.9,layer.air+w.airBoost),foot:Math.min(.7,layer.footAir+w.footBoost),light:w.lightScale*(index===0?.008:.045+index*.009)};
}
export function resolveLook(config,layer,index,blend=null){
 const legacy=config.surfaceStyle==='legacy';
 const build=(season=config.season,weather=config.weather,timeOfDay=config.timeOfDay,useConfig=true)=>{
  if(legacy&&timeOfDay==='day')return legacyLook(config,layer,index,season,weather,useConfig);
  const l=environmentLook(config,layer,index,{season,weather,timeOfDay,useConfig});if(legacy)l.light*=index===0?.008:.045+index*.009;return l;
 };
 const a=build();
 if(blend&&blend.t>0){const b=build(blend.season,blend.weather,blend.timeOfDay??config.timeOfDay,false);for(const k of ['base','air','top','horizon','lit','shade'])a[k].lerp(b[k],blend.t);for(const k of ['layerAir','foot','light'])a[k]=mix(a[k],b[k],blend.t);}
 a.style=legacy?0:config.surfaceStyle==='silhouette'?1:2;
 if(config.diagnostics.layerIds)a.base=rgb(IDS[index]);
 a.solid=config.diagnostics.solid||config.diagnostics.layerIds;a.gray=config.diagnostics.grayscale;
 a.light=config.broadVariation?a.light:0;a.direction=config.lightDirection;a.phase=(config.seed%997)/997;
 a.footY=layer.footY;a.footWidth=layer.footWidth;a.fog={...layer.fog};a.faces=layer.faces.map(f=>({...f,center:layer.points[f.anchor].x}));return a;
}
// Finite, broad patches draped below the local ridge, anchored to authored shoulders.
// An art-directed slope proxy, not a reconstructed terrain normal.
export function faceMask(x,y,ridge,f,direction=-1){
 const q=(x-f.center)/(f.span*.5),horizontal=smooth(-1,-.65,q)*(1-smooth(.62,1,q));
 const depth=f.depth*(.70+.30*Math.max(0,Math.cos(q*Math.PI*.5))),down=ridge-y+f.lean*q*f.depth*.36*direction;
 return horizontal*(1-smooth(depth*.12,depth,Math.max(0,down)));
}
export function fogMask(x,y,ridge,l){
 const q=(x-l.fog.center)/l.fog.span,window=smooth(-1,-.45,q)*(1-smooth(.32,1,q));
 const top=Math.min(l.footY+l.fog.rise*window,ridge-.065);
 const local=window*(1-smooth(top-l.footWidth*.85,top,y)),skirt=(1-smooth(l.footY-l.footWidth*.9,l.footY-.04,y))*.10;
 return Math.min(1,skirt+local*l.fog.strength);
}
export function evaluateColor(x,y,ridge,l){
 let color=l.base.clone();
 if(!l.solid){
  if(l.style===0){
   const broad=gauss(x,-.72*l.direction,.78)*gauss(y,.14-.10*x*l.direction,.24)-.50*gauss(x,.85*l.direction,1.1)*gauss(y,-.08,.32);
   color.multiplyScalar(1+broad*l.light);
   const top=Math.min(l.footY+l.footWidth+.075*gauss(x,.18+l.phase*.15,.82),ridge-.035),foot=1-smooth(top-l.footWidth,top,y);
   color.lerp(l.air,Math.min(.93,l.layerAir+foot*l.foot));
  }else{
   if(l.style===2)for(const f of l.faces)color.lerp(f.role==='light'?l.lit:l.shade,Math.min(.9,faceMask(x,y,ridge,f,l.direction)*f.strength*l.light));
   color.lerp(l.air,Math.min(.92,l.layerAir+fogMask(x,y,ridge,l)*l.foot));
  }
 }
 if(l.gray){const v=.2126*color.r+.7152*color.g+.0722*color.b;color.setRGB(v,v,v);}return color;
}
const vertex=`attribute float aRidgeHeight;varying vec2 vLocal;varying float vRidge;
void main(){vLocal=position.xy;vRidge=aRidgeHeight;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const fragment=`uniform vec3 uBase,uAir,uLit,uShade;
uniform float uLayerAir,uFoot,uLight,uDirection,uPhase,uFootY,uFootWidth,uSolid,uGray,uStyle;
uniform vec4 uFaces[3];uniform vec2 uFaceWeights[3];uniform vec4 uFog;
varying vec2 vLocal;varying float vRidge;
float g(float x,float c,float w){float q=(x-c)/w;return exp(-q*q);}
float face(vec4 f,float x,float y){float q=(x-f.x)/(f.y*.5);float horizontal=smoothstep(-1.,-.65,q)*(1.-smoothstep(.62,1.,q));float depth=f.z*(.70+.30*max(0.,cos(q*3.14159265*.5)));float down=max(0.,vRidge-y+f.w*q*f.z*.36*uDirection);return horizontal*(1.-smoothstep(depth*.12,depth,down));}
void main(){vec3 color=uBase;float x=vLocal.x,y=vLocal.y;
 if(uSolid<.5){
  if(uStyle<.5){float broad=g(x,-.72*uDirection,.78)*g(y,.14-.10*x*uDirection,.24)-.50*g(x,.85*uDirection,1.1)*g(y,-.08,.32);color*=1.+broad*uLight;
   float top=min(uFootY+uFootWidth+.075*g(x,.18+uPhase*.15,.82),vRidge-.035);float foot=1.-smoothstep(top-uFootWidth,top,y);color=mix(color,uAir,min(.93,uLayerAir+foot*uFoot));
  }else{
   if(uStyle>1.5)for(int i=0;i<3;i++){float w=min(.9,face(uFaces[i],x,y)*uFaceWeights[i].x*uLight);color=mix(color,uFaceWeights[i].y>.5?uLit:uShade,w);}
   float q=(x-uFog.x)/uFog.y;float win=smoothstep(-1.,-.45,q)*(1.-smoothstep(.32,1.,q));float top=min(uFootY+uFog.z*win,vRidge-.065);
   float local=win*(1.-smoothstep(top-uFootWidth*.85,top,y));float skirt=(1.-smoothstep(uFootY-uFootWidth*.9,uFootY-.04,y))*.10;float foot=min(1.,skirt+local*uFog.w);
   color=mix(color,uAir,min(.92,uLayerAir+foot*uFoot));
  }
 }
 if(uGray>.5)color=vec3(dot(color,vec3(.2126,.7152,.0722)));gl_FragColor=vec4(color,1.);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
}`;
export function createRidgeMaterial(mode){
 if(mode==='basic')return new THREE.MeshBasicMaterial({vertexColors:true,depthTest:false,depthWrite:false,toneMapped:false});
 const values={uBase:new THREE.Color(),uAir:new THREE.Color(),uLit:new THREE.Color(),uShade:new THREE.Color(),uLayerAir:0,uFoot:0,uLight:0,uDirection:-1,uPhase:0,uFootY:0,uFootWidth:.27,uSolid:0,uGray:0,uStyle:2,uFaces:Array.from({length:3},()=>new THREE.Vector4(0,1,.2,0)),uFaceWeights:Array.from({length:3},()=>new THREE.Vector2()),uFog:new THREE.Vector4(0,1,.1,0)};
 return new THREE.ShaderMaterial({vertexShader:vertex,fragmentShader:fragment,uniforms:Object.fromEntries(Object.entries(values).map(([k,v])=>[k,{value:v}])),depthTest:false,depthWrite:false,toneMapped:false});
}
export function updateRidgeMaterial(mesh,l){
 if(mesh.material.isMeshBasicMaterial){const p=mesh.geometry.attributes.position,c=mesh.geometry.attributes.color,r=mesh.geometry.attributes.aRidgeHeight;for(let i=0;i<p.count;i++){const v=evaluateColor(p.getX(i),p.getY(i),r.getX(i),l);c.setXYZ(i,v.r,v.g,v.b);}c.needsUpdate=true;
 }else{
  const u=mesh.material.uniforms,map={uBase:'base',uAir:'air',uLit:'lit',uShade:'shade',uLayerAir:'layerAir',uFoot:'foot',uLight:'light',uDirection:'direction',uPhase:'phase',uFootY:'footY',uFootWidth:'footWidth',uSolid:'solid',uGray:'gray',uStyle:'style'};
  for(const[k,v]of Object.entries(map)){if(u[k].value?.isColor)u[k].value.copy(l[v]);else u[k].value=Number(l[v]);}
  for(let i=0;i<3;i++){const f=l.faces[i];u.uFaces.value[i].set(f?.center||0,f?.span||1,f?.depth||.2,f?.lean||0);u.uFaceWeights.value[i].set(f?.strength||0,f?.role==='light'?1:0);}
  u.uFog.value.set(l.fog.center,l.fog.span,l.fog.rise,l.fog.strength);
 }
}
export function createSky(){
 const mat=new THREE.ShaderMaterial({depthTest:false,depthWrite:false,toneMapped:false,dithering:true,uniforms:{uTop:{value:new THREE.Color()},uAir:{value:new THREE.Color()},uHorizon:{value:new THREE.Color()},uGray:{value:0},uGradientStart:{value:.12}},
 vertexShader:'varying float vY;void main(){vY=position.y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:`
#include <common>
varying float vY;uniform vec3 uTop,uAir,uHorizon;uniform float uGray,uGradientStart;
void main(){vec3 c=mix(uHorizon,uTop,smoothstep(uGradientStart,1.1,vY));if(uGray>.5)c=vec3(dot(c,vec3(.2126,.7152,.0722)));gl_FragColor=vec4(c,1.);
#include <colorspace_fragment>
#ifdef DITHERING
 // Static screen-pixel dither, bounded to half one 8-bit output step.
 // Apply after sRGB conversion; one shared offset keeps grayscale neutral.
 gl_FragColor.rgb=clamp(gl_FragColor.rgb+vec3((rand(gl_FragCoord.xy)-0.5)/255.0),0.0,1.0);
#endif
}`});
 const sky=new THREE.Mesh(new THREE.PlaneGeometry(12,8),mat);sky.renderOrder=-100;sky.frustumCulled=false;return sky;
}
