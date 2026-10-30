// Virtual X/right, Y/height, Z/toward viewer. All lengths use background design units.
// The rendered ridge stays a flat strip. This model supplies height derivatives only.
export const BASELINE_ID='v2-ec16dc5';
export const MODES=['A','B','C'],VIEWS=['beauty','height','normal','light'];
// Direction-only illustration; fixed palette/air/intensities, no astronomical time model.
export const DAYLIGHT_DIRECTIONS=[
 {key:'morning',label:'上午 · 左侧 / 高度25°',sunAzimuth:-65,sunElevation:25},
 {key:'noon',label:'正午 · 前方 / 高度70°',sunAzimuth:0,sunElevation:70},
 {key:'dusk',label:'黄昏 · 右侧 / 高度15°',sunAzimuth:65,sunElevation:15},
];
export const clone=v=>structuredClone(v);
export function defaultStudy(){return {schemaVersion:1,baselineId:BASELINE_ID,mode:'B',view:'beauty',
 model:{heightScale:1,depth:1.6,screenDrop:.68,main:{height:.40,ridgeGain:1.7,length:1.25},
  shoulder:{anchor:5,offset:0,z:.65,width:1.15,length:1.25,height:.23,lean:.38},
  valley:{anchor:7,offset:.05,z:.85,width:.95,length:1.35,depth:.14,lean:-.18}},
 lighting:{sunAzimuth:-65,sunElevation:35,sunIntensity:.85,ambientIntensity:.48,reliefStrength:1},manualMix:.16,
 camera:{x:0,y:135,zoom:.66},foreground:'none',roof:60,tree:true,treeScale:1,cabinScale:1};}
export function validateStudy(input,points){
 const c=clone(input),ok=(b,m)=>{if(!b)throw Error(m);},range=(v,a,b)=>Number.isFinite(v)&&typeof v==='number'&&v>=a&&v<=b;
 ok(c?.schemaVersion===1&&c.baselineId===BASELINE_ID,'不支持的F2配置/基线');ok(MODES.includes(c.mode)&&VIEWS.includes(c.view),'非法模式/诊断');
 const m=c.model,l=c.lighting;ok(m&&l,'缺少模型/光照');
 ok(range(m.heightScale,0,2)&&range(m.depth,.8,3)&&range(m.screenDrop,.4,1.2),'非法虚拟坐标/高度');
 ok(m.main&&range(m.main.height,0,.8)&&range(m.main.ridgeGain,0,3)&&range(m.main.length,.6,3),'非法主坡');
 for(const [key,amplitude]of [['shoulder','height'],['valley','depth']]){const f=m[key];ok(f&&Number.isInteger(f.anchor)&&f.anchor>=0&&f.anchor<points.length&&range(f.offset,-.5,.5)&&range(f.z,.2,2.5)&&range(f.width,.4,2.5)&&range(f.length,.5,2.8)&&range(f[amplitude],0,.4)&&range(f.lean,-.7,.7),'非法山肩/浅谷');}
 ok(range(l.sunAzimuth,-180,180)&&range(l.sunElevation,5,85)&&range(l.sunIntensity,0,2)&&range(l.ambientIntensity,0,1.2)&&range(l.reliefStrength,0,2),'非法光照');ok(range(c.manualMix,0,.3),'人工色面混入量必须0–.3');
 ok(c.camera&&range(c.camera.x,-5000,5000)&&range(c.camera.y,-5000,5000)&&range(c.camera.zoom,.45,2.5),'非法相机');ok(['none','neutral','source'].includes(c.foreground),'非法前景');
 ok(range(c.roof,0,150)&&typeof c.tree==='boolean'&&range(c.treeScale,.4,2)&&range(c.cabinScale,.4,2),'非法占位参数');return c;
}
// Same shape-preserving Hermite curve as v2, with its exact analytic first derivative.
export function ridgeSample(points,x){
 let i=0;while(i<points.length-2&&x>points[i+1].x)i++;
 const slope=j=>(points[j+1].y-points[j].y)/(points[j+1].x-points[j].x);
 const tangent=j=>{if(j===0||j===points.length-1)return 0;const d0=slope(j-1),d1=slope(j);if(d0*d1<=0)return 0;const h0=points[j].x-points[j-1].x,h1=points[j+1].x-points[j].x,w1=2*h1+h0,w2=h1+2*h0;return(w1+w2)/(w1/d0+w2/d1);};
 const a=points[i],b=points[i+1],h=b.x-a.x,t=Math.max(0,Math.min(1,(x-a.x)/h)),t2=t*t,t3=t2*t,ma=tangent(i),mb=tangent(i+1);
 return {height:(2*t3-3*t2+1)*a.y+(t3-2*t2+t)*h*ma+(-2*t3+3*t2)*b.y+(t3-t2)*h*mb,
  dx:((6*t2-6*t)*a.y+(-6*t2+6*t)*b.y)/h+(3*t2-4*t+1)*ma+(3*t2-2*t)*mb};
}
// Elliptical polynomial bump: C2 at the support boundary, positive shoulder or negative valley.
function featureSample(points,x,z,f,amplitude){
 const dx=x-points[f.anchor].x-f.offset-f.lean*z,dz=z-f.z,sx=dx/f.width,sz=dz/f.length,t=1-sx*sx-sz*sz;
 if(t<=0)return {height:0,dx:0,dz:0};
 const e=Math.exp(-((z/.32)**2)),gate=1-e,gateD=2*z/(.32**2)*e,b=t**3,bx=-6*t*t*dx/f.width**2,bz=6*t*t*(dx*f.lean/f.width**2-dz/f.length**2);
 return {height:amplitude*gate*b,dx:amplitude*gate*bx,dz:amplitude*(gateD*b+gate*bz)};
}
export function heightSample(points,model,x,z){
 const r=ridgeSample(points,x),crest=model.main.height+model.main.ridgeGain*(r.height+.04),decay=Math.exp(-z/model.main.length);
 const a=featureSample(points,x,z,model.shoulder,model.shoulder.height),b=featureSample(points,x,z,model.valley,-model.valley.depth),scale=model.heightScale;
 return {height:scale*(crest*decay+a.height+b.height),dx:scale*(model.main.ridgeGain*r.dx*decay+a.dx+b.dx),dz:scale*(-crest/model.main.length*decay+a.dz+b.dz)};
}
export function surfaceNormal(sample,reliefStrength=1){const v=[-sample.dx*reliefStrength,1,-sample.dz*reliefStrength],len=Math.hypot(...v);return v.map(n=>n/len);}
export function sunVector({sunAzimuth,sunElevation}){const a=sunAzimuth*Math.PI/180,e=sunElevation*Math.PI/180;return [Math.sin(a)*Math.cos(e),Math.sin(e),Math.cos(a)*Math.cos(e)];}
export function diffuseAt(normal,light){return Math.max(0,normal.reduce((s,n,i)=>s+n*light[i],0));}
export function screenToVirtual(model,x,y,ridge){return {x,z:Math.max(0,ridge-y)*model.depth/model.screenDrop};}
