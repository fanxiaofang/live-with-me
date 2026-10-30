export const SCHEMA_VERSION=2;
export const TIMES=['day','dusk','night'];
export const SURFACE_STYLES=['legacy','silhouette','slope'];
export const SEASONS=['spring','summer','autumn','winter'];
export const WEATHERS=['clear','lightRain','snow','lightFog'];
export const COMPOSITIONS=['open','shoulders','saddle'];
export const LABELS={open:'开阔低脊',shoulders:'错位圆肩',saddle:'中央缓口'};
export const PALETTES={
 spring:{skyTop:'#b2cfd8',air:'#dce3d4',colors:['#b6cbbb','#9bb29a','#829b72','#788f69']},
 summer:{skyTop:'#a8c9d7',air:'#d4ddd1',colors:['#b6c5ba','#9eae9b','#829276','#768567']},
 autumn:{skyTop:'#adc7ce',air:'#ddd9c3',colors:['#bcc2ae','#a7ac87','#8d9467','#83845f']},
 winter:{skyTop:'#b9c8d8',air:'#e1e2e4',colors:['#cdd2db','#b6c1cf','#a0afbe','#92a3b6']}
};
export const WEATHER_LOOKS={
 clear:{sky:'#c9d7d9',skyMix:0,airBoost:0,footBoost:0,lightScale:1},
 lightRain:{sky:'#bcc8cc',skyMix:.72,airBoost:.13,footBoost:.06,lightScale:.32},
 snow:{sky:'#d1d9df',skyMix:.64,airBoost:.19,footBoost:.09,lightScale:.25},
 lightFog:{sky:'#d5ddd7',skyMix:.18,airBoost:.06,footBoost:.29,lightScale:.65}
};
const xs=[-4,-3.25,-2.55,-1.9,-1.3,-.75,-.22,.38,.98,1.55,2.25,3.1,4];
// Hand authored heights in fixed vertical design units. No photograph tracing.
const profiles={
 open:[
 [.29,.33,.28,.30,.32,.28,.25,.27,.31,.28,.26,.30,.28],
 [.12,.17,.14,.18,.20,.15,.14,.19,.22,.17,.14,.18,.15],
 [-.04,.02,-.02,.06,.08,.02,-.01,.01,.10,.06,.01,.05,0]],
 shoulders:[
 [.31,.26,.30,.34,.28,.25,.27,.32,.29,.25,.30,.33,.29],
 [.14,.17,.12,.17,.23,.19,.12,.13,.18,.23,.18,.13,.17],
 [-.02,.01,.07,.03,-.01,.01,.07,.03,-.02,.04,.09,.03,0]],
 saddle:[
 [.30,.29,.32,.35,.31,.28,.26,.27,.32,.34,.30,.28,.31],
 [.16,.18,.14,.20,.24,.19,.13,.14,.20,.26,.21,.15,.18],
 [.02,0,.03,.09,.12,.05,-.01,-.02,.03,.10,.06,.01,.03]]
};
// Only the recommended saddle is revised. Different x spacing and shoulder locations per layer.
const saddleV2=[
 [[-4,.28],[-3.2,.31],[-2.55,.26],[-1.75,.32],[-.95,.29],[-.3,.25],[.25,.27],[.83,.34],[1.4,.30],[2.05,.26],[2.8,.28],[3.4,.31],[4,.27]],
 [[-4,.14],[-3.15,.17],[-2.45,.15],[-1.95,.20],[-1.22,.24],[-.58,.23],[.05,.195],[.62,.165],[1.15,.14],[1.82,.125],[2.5,.16],[3.2,.19],[4,.16]],
 [[-4,-.04],[-3.2,.01],[-2.5,-.02],[-1.9,.02],[-1.3,.07],[-.82,.09],[-.22,.04],[.43,-.03],[1.07,.01],[1.7,.095],[2.45,.04],[3.2,.02],[4,0]]
].map(row=>row.map(([x,y])=>({x,y})));
const fourthPoints=[[-4,-.15],[-3.1,-.12],[-2.35,-.18],[-1.7,-.08],[-1.12,-.09],[-.42,-.16],[.18,-.12],[.72,-.08],[1.32,-.14],[2,-.10],[2.7,-.17],[3.4,-.14],[4,-.12]].map(([x,y])=>({x,y}));
export function layerDesign(index,points){
 const nearest=x=>points.reduce((best,p,i)=>Math.abs(p.x-x)<Math.abs(points[best].x-x)?i:best,0);
 const face=(x,span,depth,lean,strength,role)=>({anchor:nearest(x),span,depth,lean,strength,role});
 const faces=index===0?[]:index===1?
  [face(-1.22,1.28,.22,.45,.72,'light'),face(-.05,1.12,.27,-.50,.60,'shadow'),face(2.5,1.0,.20,.3,.40,'light')]:
  [face(-.82,1.45,.35,.55,.80,'light'),face(.55,1.48,.38,-.60,.72,'shadow'),face(1.7,.95,.28,.3,.55,'light')];
 const fogs=[
  {center:-.55,span:1.35,rise:.12,strength:.35},
  {center:.48,span:1.08,rise:.17,strength:.46},
  {center:-.15,span:1.25,rise:.20,strength:.52},
  {center:1.15,span:1.1,rise:.12,strength:.35}];
 return{faces,fog:{...fogs[index]}};
}
export const clone=v=>structuredClone(v);
export function makeConfig(composition='saddle',count=3){
 if(!COMPOSITIONS.includes(composition)||![2,3,4].includes(count))throw Error('不支持的构图或层数');
 const points=composition==='saddle'?clone(saddleV2):profiles[composition].map(row=>xs.map((x,j)=>({x,y:row[j]})));
 if(count===2)points.splice(1,1);
 if(count===4)points.push(clone(fourthPoints));
 return {schemaVersion:2,seed:20261021,composition,material:'shader',surfaceStyle:'slope',timeOfDay:'day',season:'summer',weather:'clear',
  palette:{skyTop:PALETTES.summer.skyTop,air:PALETTES.summer.air},
  horizon:.04,lightDirection:-1,broadVariation:true,
  layers:points.map((ps,i)=>({id:`ridge-${i+1}`,color:PALETTES.summer.colors[count===2?i*2:i],air:[.62,.40,.20,.15][i],footAir:[.08,.11,.14,.12][i],footY:[.10,.01,-.10,-.19][i],footWidth:.27,...layerDesign(i,ps),
   response:{pan:[0,.015,.035,.045][i],zoom:[0,.025,.065,.08][i]},
   points:ps})),
  camera:{x:0,y:135,zoom:.66},
  placeholders:{show:true,neutral:false,mainX:540,mainY:355,width:340,height:170,roof:60,tree:true,treeScale:1,cabinScale:1,realSvg:false},
  diagnostics:{solid:false,grayscale:false,layerIds:false,outlines:false,edit:false}};
}
const obj=(v)=>v&&typeof v==='object'&&!Array.isArray(v);
const finite=(v,a,b)=>typeof v==='number'&&Number.isFinite(v)&&v>=a&&v<=b;
const hex=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v);
function demand(ok,message){if(!ok)throw new Error(message);}
export function validateConfig(value){
 demand(obj(value),'配置必须是JSON对象');
 demand(value.schemaVersion===1||value.schemaVersion===2,'不支持的schemaVersion，只接受1或2');
 // Reject non-finite numbers even in unknown fields; JSON serialization must not silently convert them.
 function walk(v,depth=0){demand(depth<20,'配置嵌套过深');if(typeof v==='number')demand(Number.isFinite(v),'拒绝NaN/Infinity');if(v&&typeof v==='object')for(const x of Object.values(v))walk(x,depth+1);}
 walk(value);
 // v1 keeps its exact contours, colors and legacy look. Missing time in either version means day.
 value=clone(value);
 if(value.schemaVersion===1){value.schemaVersion=2;if(value.surfaceStyle===undefined)value.surfaceStyle='legacy';value.placeholders={neutral:false,...value.placeholders};if(Array.isArray(value.layers))value.layers.forEach((l,i)=>{if(Array.isArray(l.points)){const d=layerDesign(i,l.points);l.faces??=d.faces;l.fog??=d.fog;}});}
 if(value.timeOfDay===undefined)value.timeOfDay='day';
 demand(Number.isSafeInteger(value.seed)&&value.seed>=0,'非法seed');
 demand(COMPOSITIONS.includes(value.composition),'非法构图');
 demand(['basic','shader'].includes(value.material),'非法材质');
 demand(TIMES.includes(value.timeOfDay)&&SURFACE_STYLES.includes(value.surfaceStyle),'非法时段/风格');
 demand(SEASONS.includes(value.season)&&WEATHERS.includes(value.weather),'不支持的季节/天气');
 demand(obj(value.palette)&&hex(value.palette.skyTop)&&hex(value.palette.air),'非法天空/空气色');
 demand(finite(value.horizon,-.30,.30)&&[-1,1].includes(value.lightDirection)&&typeof value.broadVariation==='boolean','非法地平线/光向');
 demand(Array.isArray(value.layers)&&value.layers.length>=2&&value.layers.length<=4,'层数必须为2–4');
 const ids=new Set();
 for(const [i,l] of value.layers.entries()){
  demand(obj(l)&&typeof l.id==='string'&&/^ridge-[1-4]$/.test(l.id)&&!ids.has(l.id),'非法/重复层ID');ids.add(l.id);
  demand(hex(l.color)&&finite(l.air,0,.9)&&finite(l.footAir,0,.6)&&finite(l.footY,-.7,.5)&&finite(l.footWidth,.1,.6),'非法层色/空气参数');
  demand(obj(l.response)&&finite(l.response.pan,0,.08)&&finite(l.response.zoom,0,.12),'非法镜头响应');
  demand(Array.isArray(l.points)&&l.points.length>=8&&l.points.length<=20,'每层控制点必须8–20个');
  demand(l.points[0].x===-4&&l.points.at(-1).x===4,'两侧覆盖端点必须为±4');
  let prev=-Infinity;
  for(const p of l.points){demand(obj(p)&&finite(p.x,-4,4)&&finite(p.y,-.45,.6)&&p.x-prev>=.08,'控制点必须有限、有界且x严格有序(间距≥.08)');prev=p.x;}
  demand(Array.isArray(l.faces)&&l.faces.length<=3,'每层最多3个宽色面');
  for(const f of l.faces)demand(obj(f)&&Number.isInteger(f.anchor)&&f.anchor>=0&&f.anchor<l.points.length&&finite(f.span,.3,3)&&finite(f.depth,.08,.8)&&finite(f.lean,-1,1)&&finite(f.strength,0,1)&&['light','shadow'].includes(f.role),'非法坡面锚点/参数');
  demand(obj(l.fog)&&finite(l.fog.center,-3,3)&&finite(l.fog.span,.3,3)&&finite(l.fog.rise,0,.4)&&finite(l.fog.strength,0,.8),'非法局部谷雾');
 }
 demand(obj(value.camera)&&finite(value.camera.x,-5000,5000)&&finite(value.camera.y,-5000,5000)&&finite(value.camera.zoom,.45,2.5),'非法源Camera');
 const p=value.placeholders;
 demand(obj(p)&&finite(p.mainX,100,1100)&&finite(p.mainY,200,650)&&finite(p.width,180,500)&&finite(p.height,80,280)&&finite(p.roof,0,150)&&finite(p.treeScale,.4,2)&&finite(p.cabinScale,.4,2),'非法占位参数');
 for(const k of ['show','tree','realSvg','neutral'])demand(typeof p[k]==='boolean','非法占位开关');
 demand(obj(value.diagnostics),'缺少诊断配置');
 for(const k of ['solid','grayscale','layerIds','outlines','edit'])demand(typeof value.diagnostics[k]==='boolean','非法诊断开关');
 return clone(value);
}
export function changeSeason(config,season){
 const c=clone(config);if(!SEASONS.includes(season))throw Error('非法季节');
 c.season=season;c.palette={skyTop:PALETTES[season].skyTop,air:PALETTES[season].air};
 c.layers.forEach((l,i)=>l.color=PALETTES[season].colors[c.layers.length===2?i*2:i]);return c;
}
