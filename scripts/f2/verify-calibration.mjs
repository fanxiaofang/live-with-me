import { historicalSceneUrl } from './historicalScene.mjs';
import {chromium} from '@playwright/test';
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import baseline from '../../src/world/render/f2/config/baseline.json' with {type:'json'};
import {F2_STUDIES} from '../../src/world/render/f2/f2Config.ts';
import {resolveHostHillsLook,sampleWorldSky} from '../../src/world/render/f2/F2Atmosphere.ts';
import {COUNTRYSIDE_THEMES} from '../../src/world/theme/worldTheme.ts';
import {ridgeAt} from '../../src/world/render/f2/vendor/backdrop/ridgeGeometry.js';
import {evaluateColor} from '../../src/world/render/f2/vendor/backdrop/ridgeMaterial.js';
const require=createRequire(import.meta.url);
const {PNG}=require(path.join(path.dirname(require.resolve('playwright-core/package.json')),'lib/utilsBundle.js'));
const base=process.env.F2_URL||'http://127.0.0.1:3012',out='docs/visual-system/f2-calibration';
const browser=await chromium.launch({channel:'msedge',headless:true});
const report={scenarios:[],checks:[],pageErrors:[],contrast:[]};
const check=(name,passed,detail)=>{report.checks.push({name,passed,detail});if(!passed)console.error('FAIL',name,detail);};
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const cases=[
 {id:'overview',label:'世界总览 · 1600×900',width:1600,height:900},
 {id:'desktop1200',label:'世界总览 · 1200×800',width:1200,height:800},
 {id:'mobile',label:'世界总览 · 390×844',width:390,height:844},
 {id:'living',label:'公共起居角',width:1600,height:900,room:'living_nook'},
 {id:'living-mobile',label:'窄屏房间聚焦',width:390,height:844,room:'living_nook'},
 {id:'morning',label:'清晨总览',width:1600,height:900,theme:'morning'},
 {id:'dusk',label:'黄昏总览',width:1600,height:900,theme:'dusk'},
 {id:'night',label:'深夜总览',width:1600,height:900,theme:'night'},
 {id:'rainy',label:'静雨总览',width:1600,height:900,theme:'rainy'},
 {id:'mobile-dpr2',label:'390px · DPR2',width:390,height:844,dpr:2},
];
async function ready(page,url){
 await page.goto(historicalSceneUrl(url));
 await page.locator('[data-hills-mode="f2"]').waitFor();
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
 await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('svg').forEach(svg=>{svg.pauseAnimations();svg.setCurrentTime(0);});});
 await page.waitForTimeout(650);
}
async function read(page){
 return page.evaluate(()=>{
  const host=document.querySelector('[data-f2-hills]'),canvas=host.querySelector('canvas'),svg=document.querySelector('#panoramic-world-stage').closest('svg');
  const rect=canvas.getBoundingClientRect(),path=document.querySelector('#organic-rolling-wheat-fields > path'),m=path.getScreenCTM(),len=path.getTotalLength();
  const points=Array.from({length:2501},(_,i)=>{const p=path.getPointAtLength(len*i/2500);return new DOMPoint(p.x,p.y).matrixTransform(m);});
  const edges=Array.from({length:21},(_,i)=>{const x=rect.left+rect.width*(i+.5)/21,ys=[];for(let j=1;j<points.length;j++){const a=points[j-1],b=points[j];if((a.x<=x&&b.x>x)||(b.x<=x&&a.x>x))ys.push(a.y+(b.y-a.y)*(x-a.x)/(b.x-a.x));}return{x:x-rect.left,y:Math.min(...ys)-rect.top-2};});
  const farms=[['translate(740, 158)',8,18],['translate(1120, 142)',7,15]].map(([transform,x,y])=>{const g=document.querySelector('[transform="'+transform+'"]');const p=new DOMPoint(x,y+1).matrixTransform(g.getScreenCTM());const intersections=[];for(let j=1;j<points.length;j++){const a=points[j-1],b=points[j];if((a.x<=p.x&&b.x>p.x)||(b.x<=p.x&&a.x>p.x))intersections.push(a.y+(b.y-a.y)*(p.x-a.x)/(b.x-a.x));}
    return{x:p.x-rect.left,y:p.y-rect.top,occludedByWheat:p.y>=Math.min(...intersections)};});
  return{protected:['#panoramic-world-stage','#parallax-wheat-layer','#yorkshire-railway-viaduct'].map(s=>document.querySelector(s).outerHTML),
   cloudCount:document.querySelectorAll('#cumulus-whale-west').length,
   stats:JSON.parse(host.dataset.stats),canvas:canvas.toDataURL(),edges,farms,
   width:rect.width,height:rect.height};
 });
}
for(const c of cases){
 const context=await browser.newContext({viewport:{width:c.width,height:c.height},deviceScaleFactor:c.dpr||1});
 const page=await context.newPage();page.on('pageerror',e=>report.pageErrors.push(e.message));
 const entry={...c,views:{}};
 for(const study of ['baseline','refined']){
  const q=new URLSearchParams({hills:'f2',hillsStudy:study,theme:c.theme||'afternoon'});
  if(c.room)q.set('focusRoom',c.room);
  await ready(page,base+'/tests/fixtures/world.html?'+q);
  const data=await read(page),image=c.id==='overview'?study+'.png':c.id+'-'+study+'.png';
  await page.screenshot({path:out+'/'+image});
  const png=PNG.sync.read(Buffer.from(data.canvas.split(',')[1],'base64'));
  const visible=p=>p.x>=0&&p.x<data.width&&p.y>=0&&p.y<data.height;
  const alpha=p=>png.data[(Math.floor(p.y*png.height/data.height)*png.width+Math.floor(p.x*png.width/data.width))*4+3];
  check(c.id+' '+study+' whale removed',data.cloudCount===0);
  check(c.id+' '+study+' one original B renderer',data.stats.drawCalls===3&&data.stats.programs===2&&data.stats.mode==='B',data.stats.mode);
  check(c.id+' '+study+' wheat rear covered',data.edges.filter(visible).every(p=>alpha(p)===255));
  const visibleFarms=data.farms.filter(p=>visible(p)&&!p.occludedByWheat);
  check(c.id+' '+study+' visible farmstead background present',visibleFarms.every(p=>alpha(p)===255),{checked:visibleFarms.length,occludedByWheat:data.farms.filter(p=>visible(p)&&p.occludedByWheat).length});
  entry.views[study]={image,stats:data.stats,protectedHashes:data.protected.map(hash)};
 }
 check(c.id+' foreground / railway / wheat identical',JSON.stringify(entry.views.baseline.protectedHashes)===JSON.stringify(entry.views.refined.protectedHashes));
 report.scenarios.push(entry);await context.close();console.log('Checked',c.id);
}
const old=JSON.parse(await fs.readFile('docs/visual-system/f2-evidence/verification.json','utf8')).scenarios.find(s=>s.id==='overview-1600').modes.f2.protectedHashes;
check('Original integrated foreground geometry unchanged',JSON.stringify(old)===JSON.stringify(report.scenarios[0].views.refined.protectedHashes));
const a=PNG.sync.read(await fs.readFile(out+'/baseline.png')),b=PNG.sync.read(await fs.readFile(out+'/refined.png'));let changed=0,maxDelta=0;
for(let y=440;y<900;y++)for(let x=0;x<1600;x++){const i=(y*1600+x)*4;if(!a.data.subarray(i,i+4).equals(b.data.subarray(i,i+4))){changed++;for(let j=0;j<4;j++)maxDelta=Math.max(maxDelta,Math.abs(a.data[i+j]-b.data[i+j]));}}
check('Foreground raster remains stable',changed<10&&maxDelta<=1,{changedPixels:changed,maxDelta});
// Contrast estimates are calculated from the same colour functions and authored ridge.
const lum=c=>.2126*c.r+.7152*c.g+.0722*c.b;
for(const id of ['baseline','refined']){
 const theme=COUNTRYSIDE_THEMES.afternoon,cal=F2_STUDIES[id],l=resolveHostHillsLook(baseline,0,theme,cal),p=cal.placement;
 for(const x of [-1.5,0,1.5]){
  const ridge=ridgeAt(baseline.layers[0].points,x),hill=evaluateColor(x,ridge-.005,ridge,l);
  const viewY=400+.66*(p.horizonY+p.offsetY+p.layerOffsetY[0]-ridge*400-400)+135;
  const sky=sampleWorldSky(theme,viewY),ratio=(Math.max(lum(hill),lum(sky))+.05)/(Math.min(lum(hill),lum(sky))+.05);
  report.contrast.push({study:id,x,hill:'#'+hill.getHexString(),sky:'#'+sky.getHexString(),ratio});
 }
}
check('Far-ridge contrast reduced',report.contrast.filter(v=>v.study==='refined').reduce((s,v)=>s+v.ratio,0)<report.contrast.filter(v=>v.study==='baseline').reduce((s,v)=>s+v.ratio,0));
// Exercise real camera handlers and compare displayed matrices after each animation batch.
{
 const page=await browser.newPage({viewport:{width:1600,height:900}});
 await page.goto(historicalSceneUrl(base+'/tests/fixtures/world.html?hills=f2'));await page.locator('[data-hills-mode="f2"]').waitFor();
 await page.evaluate(()=>{window.samples=[];window.stopSampling=false;function sample(){setTimeout(()=>{const host=document.querySelector('[data-f2-hills]');if(host?.dataset.stats){const s=JSON.parse(host.dataset.stats).sampledCamera,m=new DOMMatrixReadOnly(getComputedStyle(document.querySelector('#panoramic-world-stage')).transform);window.samples.push(Math.max(Math.abs(m.e-s.x),Math.abs(m.f-s.y),400*Math.abs(m.a-s.zoom)));}if(!window.stopSampling)requestAnimationFrame(sample);},0);}requestAnimationFrame(sample);});
 await page.locator('#room-living_nook').dispatchEvent('click');await page.waitForTimeout(120);
 await page.getByTitle('重置为田园全景').click();await page.waitForTimeout(650);
 const errors=await page.evaluate(()=>{window.stopSampling=true;return window.samples;});
 check('Focus reversal remains synchronized',Math.max(...errors.slice(2))<1,{maxError:Math.max(...errors.slice(2))});
 await page.emulateMedia({reducedMotion:'reduce'});await page.getByTitle('放大画面').click();await page.waitForTimeout(600);
 check('Reduced motion respected',await page.locator('#parallax-mountains-layer').evaluate(e=>getComputedStyle(e).transitionDuration)==='0s');
 await page.close();
}
{
 const page=await browser.newPage({viewport:{width:1600,height:900}});
 await page.goto(historicalSceneUrl(base+'/tests/fixtures/world.html?theme=afternoon'));
 await page.locator('[data-hills-mode="legacy"]').waitFor();
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
 await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('svg').forEach(svg=>{svg.pauseAnimations();svg.setCurrentTime(0);});});
 await page.waitForTimeout(650);
 check('Legacy stays default',await page.locator('[data-hills-mode="legacy"]').count()===1);
 check('Legacy whale removed',await page.locator('#cumulus-whale-west').count()===0);
 check('Legacy loads no F2 renderer',await page.locator('[data-f2-hills]').count()===0);
 const hashes=await page.evaluate(()=>['#panoramic-world-stage','#parallax-wheat-layer','#yorkshire-railway-viaduct'].map(s=>document.querySelector(s).outerHTML));
 check('Legacy protected foreground unchanged',JSON.stringify(hashes.map(hash))===JSON.stringify(report.scenarios[0].views.refined.protectedHashes));
 await page.screenshot({path:out+'/legacy.png'});await page.close();
}
check('No page exceptions',report.pageErrors.length===0,report.pageErrors);
report.passed=report.checks.every(c=>c.passed);
await fs.writeFile(out+'/verification.json',JSON.stringify(report,null,2));
await browser.close();console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,failures:report.checks.filter(c=>!c.passed)},null,2));process.exitCode=report.passed?0:1;
