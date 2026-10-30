import * as THREE from 'three';
import {createRidgeMaterial} from '../backdrop/ridgeMaterial.js';
import {ridgeSample,sunVector} from './VirtualReliefModel.js';

const functions=`
uniform vec3 uSun;
uniform vec4 uMain; // height, ridgeGain, decay length, heightScale
uniform vec4 uShoulder,uValley; // x center, z center, x radius, z radius
uniform vec4 uFeature; // shoulder height, valley depth, shoulder lean, valley lean
uniform vec4 uLighting; // sun, ambient, reliefStrength, C manual mix
uniform vec2 uMapping; // virtual depth, screen drop
uniform float uGroup,uDebug;
uniform vec3 uRidgePoints[20]; // x, ridge height, Hermite derivative
uniform int uPointCount;
vec2 ridgeSampleF2(float x){
 for(int i=0;i<19;i++){if(i>=uPointCount-1)break;vec3 a=uRidgePoints[i],b=uRidgePoints[i+1];if(x<=b.x||i==uPointCount-2){float h=b.x-a.x,t=clamp((x-a.x)/h,0.,1.),t2=t*t,t3=t2*t;
 return vec2((2.*t3-3.*t2+1.)*a.y+(t3-2.*t2+t)*h*a.z+(-2.*t3+3.*t2)*b.y+(t3-t2)*h*b.z,
 ((6.*t2-6.*t)*a.y+(-6.*t2+6.*t)*b.y)/h+(3.*t2-4.*t+1.)*a.z+(3.*t2-2.*t)*b.z);}}
 return vec2(0.);
}
vec3 featureF2(float x,float z,vec4 f,float amplitude,float lean){
 float dx=x-f.x-lean*z,dz=z-f.y,t=1.-dx*dx/(f.z*f.z)-dz*dz/(f.w*f.w);if(t<=0.)return vec3(0.);
 float e=exp(-z*z/(.32*.32)),gate=1.-e,gd=2.*z/(.32*.32)*e,b=t*t*t;
 float bx=-6.*t*t*dx/(f.z*f.z),bz=6.*t*t*(dx*lean/(f.z*f.z)-dz/(f.w*f.w));
 return amplitude*vec3(gate*b,gate*bx,gd*b+gate*bz);
}
vec3 heightF2(float x,float z){vec2 r=ridgeSampleF2(x);float crest=uMain.x+uMain.y*(r.x+.04),decay=exp(-z/uMain.z);
 return uMain.w*(vec3(crest*decay,uMain.y*r.y*decay,-crest/uMain.z*decay)+featureF2(x,z,uShoulder,uFeature.x,uFeature.z)+featureF2(x,z,uValley,-uFeature.y,uFeature.w));
}
vec3 normalF2(vec3 h){return normalize(vec3(-h.y*uLighting.z,1.,-h.z*uLighting.z));}
`;
export function createReliefMaterial(){
 const mat=createRidgeMaterial('shader');
 const original='if(uStyle>1.5)for(int i=0;i<3;i++){float w=min(.9,face(uFaces[i],x,y)*uFaceWeights[i].x*uLight);color=mix(color,uFaceWeights[i].y>.5?uLit:uShade,w);}';
 if(!mat.fragmentShader.includes(original))throw Error('v2色面公式变更，F2需重新审计');
 mat.fragmentShader=mat.fragmentShader.replace('void main(){vec3 color=uBase;',functions+'\nvoid main(){vec3 color=uBase;');
 mat.fragmentShader=mat.fragmentShader.replace(original,`
   float virtualZ=max(0.,vRidge-y)*uMapping.x/uMapping.y;
   vec3 h=heightF2(x,virtualZ),n=normalF2(h);float diffuse=max(dot(n,uSun),0.);
   // Artistic palette mapping. Irradiance is geometric; these soft color weights are not.
   float irradiance=uLighting.y+uLighting.x*diffuse;
   float response=clamp((irradiance-.90)*.90,-.65,.65);
   if(uGroup>.5){color=mix(color,uLit,max(response,0.)*uLight);color=mix(color,uShade,max(-response,0.)*uLight);}
   if(uGroup<.5||uGroup>1.5)for(int i=0;i<3;i++){float w=min(.9,face(uFaces[i],x,y)*uFaceWeights[i].x*uLight*(uGroup<.5?1.:uLighting.w));color=mix(color,uFaceWeights[i].y>.5?uLit:uShade,w);}
 `);
 mat.fragmentShader=mat.fragmentShader.replace('gl_FragColor=vec4(color,1.);',`gl_FragColor=vec4(color,1.);
 if(uDebug>.5){float vz=max(0.,vRidge-y)*uMapping.x/uMapping.y;vec3 h=heightF2(x,vz),n=normalF2(h);float d=max(dot(n,uSun),0.);
  if(uDebug<1.5){float t=clamp((h.x+.1)/1.1,0.,1.);gl_FragColor.rgb=mix(vec3(.025,.055,.10),vec3(.78,.69,.34),t);}
  else if(uDebug<2.5)gl_FragColor.rgb=n*.5+.5;
  else gl_FragColor.rgb=vec3(d);
 }
 `);
 Object.assign(mat.uniforms,{uSun:{value:new THREE.Vector3()},uMain:{value:new THREE.Vector4()},uShoulder:{value:new THREE.Vector4()},uValley:{value:new THREE.Vector4()},uFeature:{value:new THREE.Vector4()},uLighting:{value:new THREE.Vector4()},uMapping:{value:new THREE.Vector2()},uGroup:{value:1},uDebug:{value:0},uRidgePoints:{value:Array.from({length:20},()=>new THREE.Vector3())},uPointCount:{value:0}});
 return mat;
}
export function updateReliefMaterial(mat,state,points){
 const u=mat.uniforms,m=state.model,l=state.lighting;
 u.uSun.value.fromArray(sunVector(l));u.uMain.value.set(m.main.height,m.main.ridgeGain,m.main.length,m.heightScale);
 for(const [key,f]of [['uShoulder',m.shoulder],['uValley',m.valley]])u[key].value.set(points[f.anchor].x+f.offset,f.z,f.width,f.length);
 u.uFeature.value.set(m.shoulder.height,m.valley.depth,m.shoulder.lean,m.valley.lean);u.uLighting.value.set(l.sunIntensity,l.ambientIntensity,l.reliefStrength,state.manualMix);u.uMapping.value.set(m.depth,m.screenDrop);
 u.uGroup.value=['A','B','C'].indexOf(state.mode);u.uDebug.value=['beauty','height','normal','light'].indexOf(state.view);u.uPointCount.value=points.length;
 points.forEach((p,i)=>u.uRidgePoints.value[i].set(p.x,p.y,ridgeSample(points,p.x).dx));
}
