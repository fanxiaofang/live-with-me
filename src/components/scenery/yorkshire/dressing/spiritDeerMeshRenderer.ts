import * as THREE from 'three';
import {SPIRIT_BOUNDS} from './spiritDeerShape3D';
import {DEER_BONE_COUNT,DEER_GROUND_RATIO} from './spiritDeerRig';
import {deerModelGeometry,createDeerSkeleton,createDeerModelSurface,deerSurfaceBinding} from './spiritDeerModel';
import {addAntlerFibers} from './spiritDeerAntlers';
import {createSpiritPatrol,patrolRoute} from './spiritDeerPatrol';
import {createDissolveAnchors,freezeDissolveAnchors,dissolveVertex,dissolveFragment} from './spiritDeerDissolve';
import {createWoodlandSpiritAura,woodlandVertex,woodlandFragment,type WoodlandAppearance} from './spiritDeerWoodland';
import {refineDeerNeckContour} from './spiritDeerNeckContour';
import {refineDeerTailContour} from './spiritDeerTailContour';
// Screen envelope includes released leaf/butterfly trails.
export const DEER_AURA_BOUNDS={x:-208,y:-194,width:416,height:258};
type Pose=ReturnType<ReturnType<typeof createSpiritPatrol>['sample']>;
const quadVertex='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}';
const projection=`uniform vec4 uMotion;
vec3 projectSpirit(vec3 p){float c=cos(uMotion.x),s=sin(uMotion.x);p.xz=mat2(c,-s,s,c)*p.xz;p.y+=uMotion.y+p.z*${DEER_GROUND_RATIO};return p;}`;
const masterVertex=`
${projection}
varying vec3 vRest;varying vec3 vPos;varying vec3 vNormal;
#include <common>
#include <skinning_pars_vertex>
void main(){
 #include <skinbase_vertex>
 vec3 objectNormal=normal;
 #include <skinnormal_vertex>
 vec3 transformed=position;
 #include <skinning_vertex>
 vRest=position;vPos=projectSpirit(transformed);
 float c=cos(uMotion.x),s=sin(uMotion.x);objectNormal.xz=mat2(c,-s,s,c)*objectNormal.xz;
 objectNormal.z-=${DEER_GROUND_RATIO}*objectNormal.y;vNormal=normalize(objectNormal);
 gl_Position=projectionMatrix*modelViewMatrix*vec4(vPos,1.);
}`;
const frontFragment=`uniform float uCinema;varying vec3 vRest;varying vec3 vPos;varying vec3 vNormal;
void main(){float light=max(0.,dot(normalize(vNormal),normalize(vec3(-.35,-.5,.8))));float shade=mix(.68+.32*light,.25+.75*light,uCinema);gl_FragColor=vec4(vPos.z/256.+.5,vRest.x/128.+.5,vRest.y/160.+1.,shade);}`;
const backFragment='varying vec3 vPos;void main(){float z=vPos.z/256.+.5;gl_FragColor=vec4(z,z,z,1.);}';
const bodyFragment=`
uniform sampler2D uFront;uniform sampler2D uBack;uniform float uTime;uniform float uVisibility;uniform float uSolid;uniform float uGuardian;uniform float uCinema;uniform vec4 uMotion;varying vec2 vUv;
uniform vec3 uBodyDark;uniform vec3 uBodyLight;
void main(){vec4 front=texture2D(uFront,vUv);if(front.r<.01){gl_FragColor=vec4(0.);return;}
 if(uSolid>.5){gl_FragColor=vec4(vec3(.69,.76,.66)*front.a*uVisibility,uVisibility);return;}
 float thickness=max(0.,front.r-texture2D(uBack,vUv).r)*256.;vec2 rest=vec2((front.g-.5)*128.,(front.b-1.)*160.);
 if(uCinema>.5){
  // Keep one clean carrier. Ambient magic is separate, outside the body.
  float alpha=(1.-exp(-thickness*.105))*.36;
  vec3 color=mix(uBodyDark,uBodyLight,smoothstep(.20,.93,front.a));
  alpha*=uVisibility;gl_FragColor=vec4(color*alpha,alpha);return;
 }
}`;
const surfaceSkin=`attribute vec4 aSkinIndex;attribute vec4 aSkinWeight;uniform mat4 uBones[${DEER_BONE_COUNT}];uniform sampler2D uFront;uniform float uVisibility;uniform float uTime;
${projection}
mat4 surfaceMatrix(){return uBones[int(aSkinIndex.x)]*aSkinWeight.x+uBones[int(aSkinIndex.y)]*aSkinWeight.y+uBones[int(aSkinIndex.z)]*aSkinWeight.z+uBones[int(aSkinIndex.w)]*aSkinWeight.w;}
float visibilityAt(vec3 posed,vec4 clip){vec2 uv=clip.xy/clip.w*.5+.5;float z=texture2D(uFront,uv).r;return z<.01?1.:exp(-max(0.,(z-.5)*256.-posed.z-.35)*.26);}`;
const fiberVertex=`${surfaceSkin}
attribute vec3 aBindB;attribute vec3 aBindC;attribute vec4 aIndexB;attribute vec4 aWeightB;attribute vec4 aIndexC;attribute vec4 aWeightC;attribute vec3 aBarycentric;
attribute vec3 aSurfaceNormal;attribute float aStrength;attribute float aPhase;attribute float aTravel;uniform float uSolid;uniform float uGuardian;uniform float uPairedHead;uniform float uCinema;uniform float uBodyFibers;varying float vAlpha;varying float vMoon;varying float vAntlerTint;varying float vBodyTint;
vec3 skinOther(vec3 p,vec4 ix,vec4 w){return ((uBones[int(ix.x)]*w.x+uBones[int(ix.y)]*w.y+uBones[int(ix.z)]*w.z+uBones[int(ix.w)]*w.w)*vec4(p,1.)).xyz;}
void main(){vec3 rest=position*aBarycentric.x+aBindB*aBarycentric.y+aBindC*aBarycentric.z;
 vec3 deformed=(surfaceMatrix()*vec4(position,1.)).xyz*aBarycentric.x+skinOther(aBindB,aIndexB,aWeightB)*aBarycentric.y+skinOther(aBindC,aIndexC,aWeightC)*aBarycentric.z;
 vec3 posed=projectSpirit(deformed);vec4 clip=projectionMatrix*modelViewMatrix*vec4(posed,1.);
 float pulse=.5+.5*sin(aTravel*7.-uTime*.7+aPhase);float ends=smoothstep(0.,.13,aTravel)*(1.-smoothstep(.8,1.,aTravel));
 float muzzle=smoothstep(36.,46.,rest.x)*smoothstep(-100.,-96.,rest.y)*(1.-smoothstep(-86.,-82.,rest.y));
 float crown=step(1.2,aStrength)*uGuardian,age=mod(uTime-aPhase*1.7+28.,14.),travel=clamp((aTravel-.08)/.84,0.,1.);
 float distanceToBeam=(travel-age/3.4)*7.;
 float beam=exp(-distanceToBeam*distanceToBeam)*smoothstep(0.,.35,age)*(1.-smoothstep(3.1,3.8,age));
 float tip=smoothstep(.8,.99,travel)*smoothstep(3.,3.6,age)*(1.-smoothstep(4.4,5.5,age));
 float visible=visibilityAt(posed,clip);vMoon=crown*(.22+.6*beam+.35*tip);
 vAlpha=uVisibility*(aStrength*(.11+.14*pulse*pulse)*ends*(1.-muzzle)*(1.-.4*crown)+crown*(.20*beam+.15*tip))*visible;
 float bodyFlow=uCinema*(1.-step(.8,aStrength));
 vBodyTint=bodyFlow;
 float selected=smoothstep(.72,.95,.5+.5*sin(aPhase*4.3));
 vAlpha*=mix(1.,.36+selected*(.10+.35*pulse*pulse),bodyFlow);
 vAlpha*=mix(uBodyFibers,1.,step(.8,aStrength));
 vec3 side=mat3(uBones[19])*vec3(0.,0.,rest.z<0.?-1.:1.);float c=cos(uMotion.x),s=sin(uMotion.x);side.xz=mat2(c,-s,s,c)*side.xz;
 float farSide=1.-mix(.66,.38,uCinema)*smoothstep(.15,.75,-normalize(side).z)*step(1.2,aStrength)*uPairedHead;
 vAntlerTint=uCinema*step(1.2,aStrength)*step(rest.z,0.)*smoothstep(.15,.75,travel);
 if(uSolid>.5)vAlpha=uVisibility*step(1.2,aStrength);vAlpha*=farSide;
 vAlpha*=1.-uPairedHead*step(1.2,aStrength)*(1.-smoothstep(0.,.12,travel));gl_Position=clip;}`;
const fiberFragment='varying float vAlpha;varying float vMoon;varying float vAntlerTint;varying float vBodyTint;uniform float uSolid;uniform float uMoonPalette;uniform vec3 uBodyThread;void main(){vec3 base=mix(vec3(.58,.86,.94),vec3(.94,.84,.62),vAntlerTint*.70);base=mix(base,uBodyThread,vBodyTint*uMoonPalette);vec3 color=mix(base,vec3(.84,.95,1.),clamp(vMoon,0.,1.)*(1.-vAntlerTint*.25));gl_FragColor=vec4(mix(color,vec3(.69,.76,.66),uSolid),vAlpha);}';
const blurFragment=`uniform sampler2D uMap;uniform vec2 uStep;varying vec2 vUv;
vec4 sampleLight(vec2 uv){return texture2D(uMap,uv);}
void main(){vec4 c=sampleLight(vUv)*.227027;c+=(sampleLight(vUv+uStep*1.384615)+sampleLight(vUv-uStep*1.384615))*.316216;c+=(sampleLight(vUv+uStep*3.230769)+sampleLight(vUv-uStep*3.230769))*.070270;gl_FragColor=c;}`;
const compositeFragment=`uniform sampler2D uSharp;uniform sampler2D uGlow;uniform sampler2D uAura;uniform float uAuraBloom;uniform float uSolid;uniform float uCinema;varying vec2 vUv;
void main(){vec4 sharp=texture2D(uSharp,vUv);if(uSolid>.5){gl_FragColor=sharp;return;}
 vec4 aura=texture2D(uAura,vUv)*uCinema,glow=texture2D(uGlow,vUv)*mix(1.,uAuraBloom,uCinema);
 vec3 mapped=1.-exp(-(sharp.rgb+aura.rgb+glow.rgb*mix(.45,.18,uCinema))*mix(2.15,2.35,uCinema));
 float alpha=clamp(sharp.a+aura.a+glow.a*mix(.16,.04,uCinema),0.,1.);alpha=max(alpha,max(mapped.r,max(mapped.g,mapped.b)));gl_FragColor=vec4(mapped,alpha);}`;

const cachedSurfaces=new Map<string,ReturnType<typeof createDeerModelSurface>>();
// The downward-Y scene camera reflects projected winding.
export const SPIRIT_NEAR_SIDE=THREE.BackSide,SPIRIT_FAR_SIDE=THREE.FrontSide;
export function createSpiritDeerCamera(bounds=SPIRIT_BOUNDS){
 const camera=new THREE.OrthographicCamera(bounds.x,bounds.x+bounds.width,bounds.y,bounds.y+bounds.height,.1,400);
 camera.position.set(0,0,160);camera.lookAt(0,0,0);return camera;
}
export function createSpiritDeerRenderer(canvas:HTMLCanvasElement,options:{solid?:boolean}={}){
 const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power',preserveDrawingBuffer:true});
 renderer.debug.onShaderError=()=>{throw new Error('Spirit mesh shader failed');};
 const resources:{dispose():void}[]=[],track=<T extends {dispose():void}>(v:T):T=>{resources.push(v);return v;};
 try{
  const originalRefined=true,guardian=true,paired=true,cinematic=true,woodland=true,cacheKey='approved';
  const bounds=DEER_AURA_BOUNDS;
  const geometry=track(deerModelGeometry(originalRefined,guardian,paired)),rig=createDeerSkeleton();resources.push(rig.skeleton);
  refineDeerNeckContour(geometry);refineDeerTailContour(geometry);
  let auraPath:Parameters<typeof patrolRoute>[1];
  const aura=createWoodlandSpiritAura(t=>patrolRoute(t,auraPath));
  const createPatrol=(path?:Parameters<typeof createSpiritPatrol>[0])=>{auraPath=path;aura.reset();return createSpiritPatrol(path,originalRefined);};
  const camera=createSpiritDeerCamera(bounds);
  const time={value:0},motion={value:new THREE.Vector4()},visibility={value:1},solid={value:options.solid?1:0},pixelScale={value:1};
  const boneValues=Array.from({length:DEER_BONE_COUNT},()=>new THREE.Matrix4()),type=renderer.extensions.has('EXT_color_buffer_float')?THREE.HalfFloatType:THREE.UnsignedByteType;
  const front=track(new THREE.WebGLRenderTarget(236,258,{type,depthBuffer:true,minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter})),back=track(new THREE.WebGLRenderTarget(236,258,{type,depthBuffer:false,minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter}));
  const shared={uMotion:motion,uTime:time,uVisibility:visibility,uSolid:solid,uGuardian:{value:guardian?1:0},uPairedHead:{value:paired?1:0},uCinema:{value:cinematic?1:0},uBodyFibers:{value:1},uPixelScale:pixelScale,uBones:{value:boneValues},uFront:{value:front.texture}};
  // Isolate hue/saturation from brightness: endpoint luminance stays close
  // to the original (.420/.678); opacity, light response and exposure stay put.
  const palette={dark:[.28,.45,.53],light:[.49,.73,.79],thread:[.64,.844,.916]};
  const paletteUniforms={uBodyDark:{value:new THREE.Vector3().fromArray(palette.dark)},uBodyLight:{value:new THREE.Vector3().fromArray(palette.light)},uBodyThread:{value:new THREE.Vector3().fromArray(palette.thread)},uMoonPalette:{value:1}};
  // The SVG-aligned orthographic camera has top < bottom: its Y reflection
  // reverses projected winding. Swap culling, not the anatomical normals.
  const frontMaterial=track(new THREE.ShaderMaterial({vertexShader:masterVertex,fragmentShader:frontFragment,uniforms:{uMotion:motion,uCinema:shared.uCinema},side:SPIRIT_NEAR_SIDE}));
  const backMaterial=track(new THREE.ShaderMaterial({vertexShader:masterVertex,fragmentShader:backFragment,uniforms:{uMotion:motion},side:SPIRIT_FAR_SIDE,depthTest:false,depthWrite:false,transparent:true,blending:THREE.CustomBlending,blendEquation:THREE.MinEquation,blendSrc:THREE.OneFactor,blendDst:THREE.OneFactor,blendEquationAlpha:THREE.MaxEquation}));
  const master=new THREE.SkinnedMesh(geometry,frontMaterial);master.frustumCulled=false;master.add(rig.root);master.bind(rig.skeleton);const meshScene=new THREE.Scene();meshScene.add(master);
  const scene=new THREE.Scene(),auraScene=new THREE.Scene(),quad=track(new THREE.PlaneGeometry(2,2));
  const bodyMaterial=track(new THREE.ShaderMaterial({vertexShader:quadVertex,fragmentShader:bodyFragment,uniforms:{...shared,...paletteUniforms,uBack:{value:back.texture}},depthTest:false,depthWrite:false,transparent:true,blending:THREE.CustomBlending,blendSrc:THREE.OneFactor,blendDst:THREE.OneFactor}));
  const body=new THREE.Mesh(quad,bodyMaterial);body.frustumCulled=false;scene.add(body);
  const auraAttributes:THREE.BufferAttribute[]=[];
  if(aura){
   const mesh=(data:{positions:Float32Array;index:number[]},vertexShader:string,fragmentShader:string,attributes:Record<string,[Float32Array,number]>)=>{
    const g=track(new THREE.BufferGeometry());g.setIndex(data.index);
    const position=new THREE.BufferAttribute(data.positions,3).setUsage(THREE.DynamicDrawUsage);g.setAttribute('position',position);auraAttributes.push(position);
    for(const [name,[array,size]] of Object.entries(attributes)){const a=new THREE.BufferAttribute(array,size).setUsage(THREE.DynamicDrawUsage);g.setAttribute(name,a);auraAttributes.push(a);}
    const defines={WOODLAND_SPIRITS:1};
    const material=track(new THREE.ShaderMaterial({vertexShader,fragmentShader,defines,uniforms:{uFront:shared.uFront,uTime:time,uCarrierVisibility:visibility,uFlowTexture:{value:null}},transparent:true,depthTest:false,depthWrite:false,side:THREE.DoubleSide,blending:THREE.CustomBlending,blendSrc:THREE.OneFactor,blendDst:THREE.OneFactor}));
    const m=new THREE.Mesh(g,material);m.frustumCulled=false;auraScene.add(m);return m;
   };
   const p=aura.spirits;
   mesh(p,woodlandVertex,woodlandFragment,{aUv:[p.uvs,2],aSize:[p.sizes,2],aAngle:[p.angles,1],aKind:[p.kinds,1],aAlpha:[p.alphas,1],aAge:[p.ages,1]});
  }
  if(!cachedSurfaces.has(cacheKey)){const surface=createDeerModelSurface(geometry);addAntlerFibers(surface,guardian,paired,cinematic);cachedSurfaces.set(cacheKey,surface);}
  const surface=cachedSurfaces.get(cacheKey)!;
  const binding=deerSurfaceBinding(surface.positions),dotBinding=deerSurfaceBinding(surface.dots);
  const surfaceGeometry=(positions:number[],bind:ReturnType<typeof deerSurfaceBinding>)=>{const g=track(new THREE.BufferGeometry());g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('aSkinIndex',new THREE.Float32BufferAttribute(bind.indices,4));g.setAttribute('aSkinWeight',new THREE.Float32BufferAttribute(bind.weights,4));return g;};
  const fiberGeometry=surfaceGeometry(surface.positions,binding);
  // Skin each corner before barycentric interpolation: interpolating rest
  // weights first would let a curve drift off the actual animated triangles.
  const masterP=geometry.getAttribute('position'),masterI=geometry.getAttribute('skinIndex'),masterW=geometry.getAttribute('skinWeight');
  const corners=Array.from({length:3},()=>({p:[] as number[],i:[] as number[],w:[] as number[]})),bary:number[]=[];
  for(let i=0;i<surface.positions.length/3;i++){
   const attached=i*3<surface.triangleVertices.length;
   bary.push(...(attached?surface.barycentric.slice(i*3,i*3+3):[1,0,0]));
   corners.forEach((corner,k)=>{
    if(attached){const id=surface.triangleVertices[i*3+k];corner.p.push(masterP.getX(id),masterP.getY(id),masterP.getZ(id));for(let j=0;j<4;j++){corner.i.push(masterI.getComponent(id,j));corner.w.push(masterW.getComponent(id,j));}}
    else{corner.p.push(...surface.positions.slice(i*3,i*3+3));corner.i.push(...binding.indices.slice(i*4,i*4+4));corner.w.push(...binding.weights.slice(i*4,i*4+4));}
   });
  }
  fiberGeometry.setAttribute('position',new THREE.Float32BufferAttribute(corners[0].p,3));fiberGeometry.setAttribute('aSkinIndex',new THREE.Float32BufferAttribute(corners[0].i,4));fiberGeometry.setAttribute('aSkinWeight',new THREE.Float32BufferAttribute(corners[0].w,4));
  for(const [k,suffix] of [[1,'B'],[2,'C']] as const){fiberGeometry.setAttribute('aBind'+suffix,new THREE.Float32BufferAttribute(corners[k].p,3));fiberGeometry.setAttribute('aIndex'+suffix,new THREE.Float32BufferAttribute(corners[k].i,4));fiberGeometry.setAttribute('aWeight'+suffix,new THREE.Float32BufferAttribute(corners[k].w,4));}
  fiberGeometry.setAttribute('aBarycentric',new THREE.Float32BufferAttribute(bary,3));
  fiberGeometry.setAttribute('aSurfaceNormal',new THREE.Float32BufferAttribute(surface.normals,3));fiberGeometry.setAttribute('aStrength',new THREE.Float32BufferAttribute(surface.strengths,1));fiberGeometry.setAttribute('aPhase',new THREE.Float32BufferAttribute(surface.phases,1));fiberGeometry.setAttribute('aTravel',new THREE.Float32BufferAttribute(surface.travel,1));
  const fibers=new THREE.LineSegments(fiberGeometry,track(new THREE.ShaderMaterial({vertexShader:fiberVertex,fragmentShader:fiberFragment,uniforms:{...shared,...paletteUniforms},transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending})));fibers.renderOrder=1;scene.add(fibers);
  const anchors=createDissolveAnchors({...surface,skinIndices:binding.indices,skinWeights:binding.weights,dotSkinIndices:dotBinding.indices,dotSkinWeights:dotBinding.weights}),particleGeometry=track(new THREE.BufferGeometry());
  for(const name of ['position','aFrom','aTo'])particleGeometry.setAttribute(name,new THREE.Float32BufferAttribute(anchors.positions,3));particleGeometry.setAttribute('aSeed',new THREE.Float32BufferAttribute(anchors.seeds,1));
  const progress={value:0},gather={value:0},actorOrigin={value:new THREE.Vector3()};
  const particles=new THREE.Points(particleGeometry,track(new THREE.ShaderMaterial({vertexShader:dissolveVertex,fragmentShader:dissolveFragment,uniforms:{uProgress:progress,uGather:gather,uActorOrigin:actorOrigin,uPixelScale:pixelScale},transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending})));particles.frustumCulled=false;particles.renderOrder=4;scene.add(particles);
  const eyeGeometry=track(new THREE.SphereGeometry(.6,8,8));const eyes=[1,-1].map(side=>{const material=track(new THREE.MeshBasicMaterial({color:'#dff6f8',transparent:true,depthTest:false,depthWrite:false,blending:THREE.AdditiveBlending}));const mesh=new THREE.Mesh(eyeGeometry,material);mesh.renderOrder=3;scene.add(mesh);return {mesh,material,side};});
  const sharp=track(new THREE.WebGLRenderTarget(236,258,{type,depthBuffer:false})),horizontal=track(new THREE.WebGLRenderTarget(118,129,{type,depthBuffer:false})),glow=track(new THREE.WebGLRenderTarget(118,129,{type,depthBuffer:false}));
  const auraTarget=cinematic?track(new THREE.WebGLRenderTarget(236,258,{type,depthBuffer:false})):sharp;
  const blur=track(new THREE.ShaderMaterial({vertexShader:quadVertex,fragmentShader:blurFragment,uniforms:{uMap:{value:sharp.texture},uStep:{value:new THREE.Vector2()}},depthTest:false,depthWrite:false}));
  const composite=track(new THREE.ShaderMaterial({vertexShader:quadVertex,fragmentShader:compositeFragment,uniforms:{uSharp:{value:sharp.texture},uGlow:{value:glow.texture},uAura:{value:auraTarget.texture},uBodyFront:shared.uFront,uAuraBloom:{value:1},uSolid:solid,uCinema:shared.uCinema},depthTest:false,depthWrite:false}));
  const postScene=new THREE.Scene(),postCamera=new THREE.Camera(),screen=new THREE.Mesh(quad,blur);screen.frustumCulled=false;postScene.add(screen);
  let resolution=0,frozenTurn='',gatherFrozen=false;const released=new Uint8Array(anchors.seeds.length),standing=createPatrol().sample(0);
  // Compile the later reveal now. First-use particle compilation must never
  // consume the short moving-dissolve window on the live patrol clock.
  rig.update(standing.bones);particles.visible=true;renderer.compile(scene,camera);particles.visible=false;
  renderer.compile(meshScene,camera);master.material=backMaterial;renderer.compile(meshScene,camera);master.material=frontMaterial;
  if(aura)renderer.compile(auraScene,camera);
  return {
   createPatrol,bounds,
   draw(seconds:number,scale:number,pose?:Pose,weight=0,maxResolution=4,appearance?:WoodlandAppearance){
    if(!pose||weight<.001){pose=standing;weight=1;}
    const next=Math.min(maxResolution,Math.max(1,Math.ceil(scale*2)/2));if(next!==resolution){resolution=next;renderer.setSize(bounds.width*next,bounds.height*next,false);for(const target of [front,back,sharp])target.setSize(bounds.width*next,bounds.height*next);horizontal.setSize(Math.ceil(sharp.width/2),Math.ceil(sharp.height/2));glow.setSize(horizontal.width,horizontal.height);if(cinematic)auraTarget.setSize(sharp.width,sharp.height);pixelScale.value=next;}
    time.value=seconds;visibility.value=pose.visibility;motion.value.set(pose.yaw,pose.bob,0,1);for(let i=0;i<DEER_BONE_COUNT;i++)boneValues[i].copy(pose.bones[i]);rig.update(boneValues);
    if(aura){aura.sample(pose,appearance);for(const a of auraAttributes)a.needsUpdate=true;}auraScene.visible=!options.solid;
    const turning=pose.transition>=0;particles.visible=turning&&pose.effectPhase!=='absent'&&!options.solid;
    if(turning){
     if(frozenTurn!==pose.effectId){released.fill(0);gatherFrozen=false;frozenTurn=pose.effectId;}actorOrigin.value.set(pose.x,0,pose.y/DEER_GROUND_RATIO);gather.value=pose.effectPhase==='condensing'||pose.effectPhase==='settling'?1:0;
     if(!gather.value&&pose.effectPhase==='dispersing'){const frozen=freezeDissolveAnchors(anchors,boneValues,pose.yaw,pose.yaw,pose.bob),from=particleGeometry.getAttribute('aFrom') as THREE.BufferAttribute;for(let i=0;i<released.length;i++)if(!released[i]){from.setXYZ(i,frozen.from[i*3]+pose.x,frozen.from[i*3+1],frozen.from[i*3+2]+pose.y/DEER_GROUND_RATIO);if(pose.transition>=anchors.seeds[i]*.08)released[i]=1;}from.needsUpdate=true;}
     if(gather.value&&!gatherFrozen){const frozen=freezeDissolveAnchors(anchors,boneValues,pose.targetYaw,pose.targetYaw,pose.bob),to=particleGeometry.getAttribute('aTo') as THREE.BufferAttribute;for(let i=0;i<released.length;i++)to.setXYZ(i,frozen.to[i*3]+pose.x,frozen.to[i*3+1],frozen.to[i*3+2]+pose.y/DEER_GROUND_RATIO);to.needsUpdate=true;gatherFrozen=true;}progress.value=pose.transition;
    }else frozenTurn='';
    for(const {mesh,material,side} of eyes){const p=new THREE.Vector3(39,-96,side*4).applyMatrix4(boneValues[19]),normal=new THREE.Vector3(0,0,side).transformDirection(boneValues[19]).applyAxisAngle(new THREE.Vector3(0,1,0),pose.yaw);p.applyAxisAngle(new THREE.Vector3(0,1,0),pose.yaw);p.y+=pose.bob+p.z*DEER_GROUND_RATIO;mesh.position.copy(p);material.opacity=options.solid?0:.55*pose.visibility*THREE.MathUtils.smoothstep(normal.z,0,.35);}
    master.material=frontMaterial;renderer.setClearColor(0,0);renderer.setRenderTarget(front);renderer.render(meshScene,camera);master.material=backMaterial;renderer.setClearColor(0xffffff,0);renderer.setRenderTarget(back);renderer.render(meshScene,camera);
    renderer.setClearColor(0,0);renderer.setRenderTarget(sharp);renderer.render(scene,camera);screen.material=blur;
    // Only the external magic feeds bloom in the current original spirit.
    // The carrier itself never becomes a blurred, enlarged silhouette.
    if(cinematic){renderer.setRenderTarget(auraTarget);renderer.render(auraScene,camera);}
    blur.uniforms.uMap.value=cinematic?auraTarget.texture:sharp.texture;blur.uniforms.uStep.value.set(1.1/bounds.width,0);renderer.setRenderTarget(horizontal);renderer.render(postScene,postCamera);
    blur.uniforms.uMap.value=horizontal.texture;blur.uniforms.uStep.value.set(0,1.1/bounds.height);renderer.setRenderTarget(glow);renderer.render(postScene,postCamera);
    screen.material=composite;renderer.setRenderTarget(null);renderer.render(postScene,postCamera);
   },
   dispose(){resources.forEach(r=>r.dispose());renderer.dispose();renderer.forceContextLoss();},
  };
 }catch(e){resources.forEach(r=>r.dispose());renderer.dispose();renderer.forceContextLoss();throw e;}
}
