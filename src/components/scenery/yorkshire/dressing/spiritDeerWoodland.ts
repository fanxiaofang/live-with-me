import {DEER_GROUND_RATIO,smooth} from './spiritDeerRig';
import {DEER_TIMING} from './spiritDeerTiming';
import type {createSpiritPatrol,patrolRoute} from './spiritDeerPatrol';

type Pose=ReturnType<ReturnType<typeof createSpiritPatrol>['sample']>;
type Route=ReturnType<typeof patrolRoute>;
const hash=(n:number)=>{const v=Math.sin(n*127.1+81.7)*43758.5453;return v-Math.floor(v);};
const mix=(a:number,b:number,u:number)=>a+(b-a)*u;

function envelope(pose:Pose){
 if(pose.effectPhase==='absent'||pose.visibility<=0)return 0;
 if(pose.effectPhase==='dispersing')return pose.visibility**1.5;
 if(pose.effectPhase==='condensing')return .3*pose.visibility**2;
 if(pose.effectPhase==='settling'){
  const phase=((pose.time%DEER_TIMING.period)+DEER_TIMING.period)%DEER_TIMING.period;
  return .3+.7*smooth((phase-(pose.effectId==='out'?DEER_TIMING.home-.5:DEER_TIMING.rest-.5))/.5);
 }
 return 1;
}
function segment(t:number){
 const phase=((t%DEER_TIMING.period)+DEER_TIMING.period)%DEER_TIMING.period;
 return Math.floor(t/DEER_TIMING.period)*3+(phase<DEER_TIMING.home?0:phase<DEER_TIMING.rest?1:2);
}

export type WoodlandAppearance={reveal:number;arrivalAge:number;paused?:boolean};

/** D accompanies state changes, not the full patrol. Residual light has its
 * own clock; in particular it is NOT multiplied by the carrier visibility. */
export function woodlandSpiritStage(seconds:number,appearance?:WoodlandAppearance){
 if(appearance?.paused)return undefined;
 const initialAge=appearance?.arrivalAge??seconds;
 if(appearance&&appearance.reveal<.999||initialAge>=0&&initialAge<3){
  const clock=appearance&&appearance.reveal<.999?4.8*Math.max(0,appearance.reveal):4.8+initialAge;
  return {key:0,clock,start:0,end:7.8,anchor:0,sourceEnd:0,departure:false,
   strength:smooth(clock/.7)*(1-smooth((clock-6.8)/1))};
 }
 const loop=Math.floor(seconds/DEER_TIMING.period);
 for(const [i,turn] of [DEER_TIMING.turn,DEER_TIMING.homeTurn].entries()){
  const start=loop*DEER_TIMING.period+turn,gone=start+DEER_TIMING.scatter,condense=gone+DEER_TIMING.absent,full=condense+DEER_TIMING.condense;
  if(seconds>=start-1&&seconds<gone+2)return {
   key:loop*4+i*2+1,clock:seconds,start:start-1,end:gone+2,anchor:start-1,sourceEnd:gone-.001,departure:true,
   strength:smooth(seconds-(start-1))*(1-smooth((seconds-gone-.7)/1.3)),
  };
  if(seconds>=condense&&seconds<full+3)return {
   key:loop*4+i*2+2,clock:seconds,start:condense,end:full+3,anchor:full,sourceEnd:full,departure:false,
   strength:smooth((seconds-condense)/.6)*(1-smooth(seconds-full-2)),
  };
 }
 return undefined;
}

/** D only: leaf/butterfly spirits and finite trails of their actual flight.
 * Brief initial transport releases early into the birth-world frame; no
 * permanently body-local orbit, no dust slots and no preset ribbon paths. */
export function createWoodlandSpiritAura(sampleRoute:(time:number)=>Route,options:{ritual?:boolean}={}){
 const leaves=6,butterflies=3,heads=leaves+butterflies,steps=16,slots=heads*(steps+1);
 const positions=new Float32Array(slots*12),uvs=new Float32Array(slots*8),sizes=new Float32Array(slots*8),angles=new Float32Array(slots*4),kinds=new Float32Array(slots*4),alphas=new Float32Array(slots*4),ages=new Float32Array(slots*4),serials=new Int32Array(slots),index:number[]=[];
 for(let i=0;i<slots;i++){uvs.set([0,0,1,0,1,1,0,1],i*8);const v=i*4;index.push(v,v+1,v+2,v,v+2,v+3);}
 const spirits={positions,uvs,sizes,angles,kinds,alphas,ages,serials,index};
 const put=(slot:number,p:number[],size:number[],angle:number,kind:number,alpha:number,age:number,id:number)=>{
  for(let corner=0;corner<4;corner++){const i=slot*4+corner;positions.set(p,i*3);sizes.set(size,i*2);angles[i]=angle;kinds[i]=kind;alphas[i]=alpha;ages[i]=age;}serials[slot]=id;
 };
 const birthplace=(slot:number,seed:number):number[]=>{
  const a=hash(seed+7),b=hash(seed+13),z=mix(8,23,hash(seed+19))*(hash(seed+17)>.25?1:-1);
  if(slot>=leaves)return [mix(-53,62,a),mix(-115,-38,b),z];
  switch(slot%6){
   case 0:return [mix(-35,10,a),mix(-94,-82,b),z];
   case 1:return [mix(43,64,a),mix(-84,-59,b),z];
   case 2:return [mix(-63,-46,a),mix(-75,-43,b),z];
   case 3:return [mix(23,46,a),mix(-35,-16,b),z];
   case 4:return [mix(-18,10,a),mix(-42,-29,b),z];
   default:return [mix(23,46,a),mix(-116,-99,b),z];
  }
 };
 return {
  ribbons:undefined,spirits,
  reset(){alphas.fill(0);serials.fill(-1);},
  sample(pose:Pose,appearance?:WoodlandAppearance){
   alphas.fill(0);serials.fill(-1);
   const ritual=options.ritual!==false,stage=ritual?woodlandSpiritStage(pose.time,appearance):undefined;
   const strength=ritual?stage?.strength??0:envelope(pose);if(!strength)return {spirits:0};let count=0;
   for(let slot=0;slot<heads;slot++){
    const leaf=slot<leaves,period=(leaf?6.4:7.8)+hash(slot+2)*1.6;
    const offset=hash(slot+31)*period,cycle=stage?stage.key:Math.floor((pose.time-offset)/period);
    const birth=stage?stage.start-.25+slot*.105+hash(slot+11)*.16:cycle*period+offset;
    const age=(stage?.clock??pose.time)-birth,life=stage?stage.end-birth+.15:period*.88;
    if(age<0||age>=life||!stage&&(birth<0||segment(birth)!==segment(pose.time)))continue;
    const born=sampleRoute(stage?stage.departure?Math.min(stage.sourceEnd,Math.max(stage.anchor,birth)):stage.anchor:birth);
    if(!stage&&(born.effectPhase!=='none'||born.visibility<.999||born.returning!==pose.returning))continue;
    const seed=slot+cycle*43+209,phase=hash(seed+23)*Math.PI*2,origin=birthplace(slot,seed);
    const flight=(a:number)=>{
     const release=leaf?1.2:1.6,u=Math.min(1,a/release),carry=(leaf?.60:.75)*release*(u-u*u+u*u*u/3);
     const follow=stage?stage.departure?sampleRoute(Math.min(stage.sourceEnd,Math.max(stage.anchor,birth+carry))):born:sampleRoute(birth+carry),speed=leaf?.85:1.05;
     const x=origin[0]+(Math.sin(a*.73*speed+phase)-Math.sin(phase))*(leaf?9:12)-a*(leaf?.9:.25);
     const y=origin[1]+(Math.cos(a*.91*speed+phase)-Math.cos(phase))*(leaf?5:7)-a*(leaf?1.0:.65)+(leaf?0:Math.sin(a*3.1+phase)*.7);
     const z=origin[2]+(Math.sin(a*.58+phase*.7)-Math.sin(phase*.7))*8;
     const c=Math.cos(born.yaw),s=Math.sin(born.yaw);
     return [c*x+s*z+follow.x-pose.x,y,-s*x+c*z+(follow.y-pose.y)/DEER_GROUND_RATIO];
    };
    const p=flight(age),prior=flight(Math.max(0,age-.04)),next=flight(age+.04);
    const dx=next[0]-prior[0],dy=next[1]-prior[1]+(next[2]-prior[2])*DEER_GROUND_RATIO;
    const tilt=leaf?Math.atan2(dy,dx)+.23*Math.sin(age*1.1+phase):.22*Math.sin(age*.9+phase);
    const y=p[1]+p[2]*DEER_GROUND_RATIO,margin=smooth((198-Math.abs(p[0]))/18)*smooth((y+184)/16)*smooth((55-y)/16);
    const fade=smooth(age/.65)*(stage?1:1-smooth((age/life-.69)/.31)),breath=.9+.1*Math.sin(age*.9+phase);
    const alpha=strength*fade*breath*margin*(leaf?.85:.92);
    const size=leaf?[(10.5+hash(seed)*1.8)*(.68+.32*Math.cos(age*1.3+phase)**2),4.8*(.65+.35*Math.sin(age*1.1+phase)**2)]:[10.2,8.0];
    const kind=leaf?(slot%3===1?.25:0):1,id=(cycle+1)*heads+slot;
    put(slot,p,size,tilt,kind,alpha,age+phase,id);count++;
    const duration=Math.min(age,leaf?2.1:.8);
    for(let j=0;j<steps;j++){
     const a=flight(age-duration*j/steps),b=flight(age-duration*(j+1)/steps),u=(j+.5)/steps;
     const dx=a[0]-b[0],dy=a[1]-b[1]+(a[2]-b[2])*DEER_GROUND_RATIO,length=Math.hypot(dx,dy);
     if(length<.04)continue;
     const middle=a.map((v,k)=>(v+b[k])*.5),trailAlpha=alpha*(leaf?.55:.25)*(1-u)**1.6;
     put(heads+slot*steps+j,middle,[length*1.40,leaf?1.05:.70],Math.atan2(dy,dx),6,trailAlpha,age+phase,id);
    }
   }
   return {spirits:count};
  },
 };
}

export const woodlandVertex=`uniform sampler2D uFront;attribute vec2 aUv;attribute vec2 aSize;attribute float aAngle;attribute float aKind;attribute float aAlpha;attribute float aAge;
varying vec2 vUv;varying float vKind;varying float vAge;varying float vAlpha;
#ifdef WOODLAND_SPIRITS
uniform float uCarrierVisibility;
#endif
#if defined(GUARDIAN_PRESENCE) || defined(WOODLAND_SPIRITS)
varying vec2 vSceneUv;
#endif
void main(){
 vec3 p=position;p.y+=p.z*${DEER_GROUND_RATIO};vec2 offset=(aUv-.5)*aSize;float c=cos(aAngle),s=sin(aAngle);p.xy+=mat2(c,-s,s,c)*offset;
 vec4 clip=projectionMatrix*modelViewMatrix*vec4(p,1.);float f=texture2D(uFront,clip.xy/clip.w*.5+.5).r;
 float occlusion=f<.01?1.:exp(-max(0.,(f-.5)*256.-p.z-.25)*.48);
#ifdef WOODLAND_SPIRITS
 occlusion=mix(1.,occlusion,uCarrierVisibility);
#endif
 vAlpha=aAlpha*occlusion;vUv=aUv;vKind=aKind;vAge=aAge;gl_Position=clip;
#if defined(GUARDIAN_PRESENCE) || defined(WOODLAND_SPIRITS)
 vSceneUv=clip.xy/clip.w*.5+.5;
#endif
}`;
export const woodlandFragment=`varying vec2 vUv;varying float vKind;varying float vAge;varying float vAlpha;
#ifdef WOODLAND_SPIRITS
uniform float uCarrierVisibility;
#endif
#if defined(GUARDIAN_PRESENCE) || defined(WOODLAND_SPIRITS)
uniform sampler2D uFront;varying vec2 vSceneUv;
#endif
void main(){
#ifdef WOODLAND_SPIRITS
 if(uCarrierVisibility>.01&&texture2D(uFront,vSceneUv).r>.01)discard;
 if(vKind>5.5){
  vec2 q=vUv*2.-1.;float line=exp(-q.y*q.y*7.)*(1.-smoothstep(.75,1.,abs(q.x)));
  float a=line*vAlpha;if(a<.001)discard;
  gl_FragColor=vec4(vec3(.87,.85,.63)*a,a);return;
 }
#endif
#ifdef GUARDIAN_PRESENCE
 // These are air lights, not new bright markings on the deer. Per-fragment
 // coverage also keeps broad sprites from painting across a leg or muzzle.
 if(texture2D(uFront,vSceneUv).r>.01)discard;
 if(vKind>4.5){
  vec2 q=vUv*2.-1.;float curve=q.y+.22*sin(q.x*2.1+vAge*.2);
  float fleck=exp(-curve*curve*110.)*pow(max(0.,1.-q.x*q.x),1.8)*.38;
  float a=fleck*vAlpha;if(a<.001)discard;
  gl_FragColor=vec4(vec3(.94,.88,.70)*a,a);return;
 }
#endif
 vec2 p=vUv*2.-1.;float shape=0.;vec3 color=vec3(.77,.90,.96);
 if(vKind<.5){
  // A tapered, translucent leaf with one quiet vein; no opaque green sticker.
  float curve=p.y+.17*sin(p.x*2.8),width=.46*max(0.,1.-p.x*p.x);
  float mask=smoothstep(-.025,.07,width-abs(curve))*(1.-smoothstep(.9,1.,abs(p.x)));
  float vein=exp(-curve*curve*750.);shape=mask*(.38+.44*vein);
  color=mix(vec3(.48,.76,.64),vec3(.84,.96,.81),vein*.75);
#ifdef WOODLAND_SPIRITS
  float rim=exp(-abs(width-abs(curve))*55.)*.16;
  shape+=rim*(1.-smoothstep(.82,1.,abs(p.x)));
  color=vKind>.1?mix(vec3(.72,.80,.73),vec3(.96,.94,.79),vein*.65):mix(vec3(.49,.78,.60),vec3(.86,.98,.79),vein*.7);
#endif
 }else if(vKind<1.5){
  p.x/=max(.28,.69+.23*sin(vAge*4.4));
  float upper=exp(-pow((abs(p.x)-.37)*4.4,2.)-pow((p.y+.23)*4.7,2.));
  float lower=exp(-pow((abs(p.x)-.23)*5.2,2.)-pow((p.y-.24)*5.3,2.));
  shape=(upper+lower*.62)*.66+exp(-p.x*p.x*600.-p.y*p.y*11.)*.22;
  color=vec3(.83,.94,.77);
#ifdef WOODLAND_SPIRITS
  color=vec3(.99,.91,.70);
#endif
 }else{
  float r2=dot(p,p);float core=exp(-r2*100.),halo=exp(-r2*10.)*.13;
#ifdef GUARDIAN_PRESENCE
  halo=exp(-r2*6.)*.22;
#endif
  shape=(core+halo)*(1.-smoothstep(.7,1.,sqrt(r2)));
  if(vKind>3.5){
   float rays=(exp(-abs(p.x)*55.-abs(p.y)*6.)+exp(-abs(p.y)*55.-abs(p.x)*8.))*.32;
   shape+=rays*(1.-smoothstep(.5,.9,length(p)));
   vec2 q=p-vec2(-.52,.26),r=p-vec2(.39,-.48);
   shape+=(exp(-dot(q,q)*650.)+exp(-dot(r,r)*800.)*.65)*(.35+.15*sin(vAge*.8));
  }else if(vKind>2.5)color=vec3(.98,.87,.64);
 }
 float a=min(1.,shape)*vAlpha;if(a<.001)discard;gl_FragColor=vec4(color*a,a);
}`;
