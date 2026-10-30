import { historicalSceneUrl } from './historicalScene.mjs';
import {chromium} from '@playwright/test';
import {createRequire} from 'node:module';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
const require=createRequire(import.meta.url);
const {PNG}=require(path.join(path.dirname(require.resolve('playwright-core/package.json')),'lib/utilsBundle.js'));
const base=process.env.F2_URL||'http://127.0.0.1:3012';
const output=path.resolve('docs/visual-system/f2-evidence');
await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const reuse=process.argv.includes('--reuse-captures');
const report=reuse?JSON.parse(await fs.readFile(path.join(output,'verification.json'),'utf8')):{base,started:new Date().toISOString(),scenarios:[],checks:[],pageErrors:[],consoleErrors:[],limitations:[]};
const check=(name,ok,detail)=>{report.checks=report.checks.filter(c=>c.name!==name);report.checks.push({name,passed:!!ok,detail});if(!ok)console.error('FAIL',name,JSON.stringify(detail));};
const hash=text=>crypto.createHash('sha256').update(text).digest('hex');
async function prepare(page,url,mode,freeze=true){
 await page.goto(historicalSceneUrl(url));
 await page.locator('[data-hills-mode="'+mode+'"]').waitFor({timeout:20000});
 if(freeze)await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
 else await page.addStyleTag({content:'*,*::before,*::after{animation:none!important}'});
 await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('svg').forEach(s=>{s.pauseAnimations();s.setCurrentTime(0);});});
 await page.waitForTimeout(600);
}
async function zoom(page,value){
 await page.locator('#panoramic-world-stage').evaluate((e,value)=>{
  e.closest('svg').dispatchEvent(new WheelEvent('wheel',{deltaY:(Number(e.dataset.zoom)-value)/.0012,bubbles:true,cancelable:true}));
 },value);
 await page.waitForTimeout(600);
}
async function pan(page,dx,dy){
 await page.mouse.move(100,100);await page.mouse.down();await page.mouse.move(115,105);
 await page.mouse.move(100+dx,100+dy,{steps:8});await page.mouse.up();await page.mouse.move(2,2);
 await page.waitForTimeout(600);
}
async function read(page){
 return page.evaluate(()=>{
  const selectors=['#panoramic-world-stage','#parallax-wheat-layer','#yorkshire-railway-viaduct'];
  const svg=document.querySelector('#panoramic-world-stage').closest('svg');
  const path=document.querySelector('#organic-rolling-wheat-fields > path');
  const matrix=path.getScreenCTM(),length=path.getTotalLength(),rect=svg.getBoundingClientRect();
  const points=Array.from({length:3001},(_,i)=>{const p=path.getPointAtLength(length*i/3000);return new DOMPoint(p.x,p.y).matrixTransform(matrix);});
  const edges=Array.from({length:31},(_,i)=>{
   const x=rect.left+rect.width*(i+.5)/31,ys=[];
   for(let j=1;j<points.length;j++){const a=points[j-1],b=points[j];if((a.x<=x&&b.x>x)||(b.x<=x&&a.x>x))ys.push(a.y+(b.y-a.y)*(x-a.x)/(b.x-a.x));}
   return{x:x-rect.left,y:Math.min(...ys)-rect.top-2};
  });
  const host=document.querySelector('[data-f2-hills]');
  return {protected:selectors.map(s=>document.querySelector(s)?.outerHTML),camera:document.querySelector('#panoramic-world-stage').getAttribute('style'),
   stats:host?.dataset.stats?JSON.parse(host.dataset.stats):null,canvas:host?.querySelector('canvas')?.toDataURL(),edges,
   canvases:document.querySelectorAll('[data-f2-hills] canvas').length,mode:document.querySelector('[data-hills-mode]').dataset.hillsMode};
 });
}
const cases=[
 {id:'overview-1600',w:1600,h:900},
 {id:'overview-1200',w:1200,h:800},
 {id:'overview-mobile',w:390,h:844},
 {id:'living-room',w:1600,h:900,room:'living_nook'},
 {id:'attic-room',w:1600,h:900,room:'my_room'},
 {id:'living-mobile',w:390,h:844,room:'living_nook'},
 {id:'overview-morning',w:1600,h:900,theme:'morning'},
 {id:'overview-dusk',w:1600,h:900,theme:'dusk'},
 {id:'overview-night',w:1600,h:900,theme:'night'},
 {id:'overview-rainy',w:1600,h:900,theme:'rainy'},
 {id:'room-night',w:1600,h:900,room:'living_nook',theme:'night'},
 {id:'room-rainy',w:1600,h:900,room:'living_nook',theme:'rainy'},
 {id:'minimum-zoom-pan',w:1600,h:900,zoom:.45,pan:[500,190]},
 {id:'zoom-pan',w:1200,h:800,zoom:1.6,pan:[-180,-80]},
 {id:'maximum-zoom',w:1600,h:900,zoom:2.5},
 {id:'mobile-dpr2',w:390,h:844,dpr:2},
];
for(const c of reuse?[]:cases){
 const context=await browser.newContext({viewport:{width:c.w,height:c.h},deviceScaleFactor:c.dpr||1});
 const page=await context.newPage();
 page.on('pageerror',e=>report.pageErrors.push({case:c.id,error:e.message}));
 page.on('console',m=>{if(m.type()==='error')report.consoleErrors.push({case:c.id,error:m.text()});});
 const entry={...c,modes:{}};
 for(const mode of ['legacy','f2']){
  const q=new URLSearchParams({hills:mode,theme:c.theme||'afternoon'});
  if(c.room)q.set('focusRoom',c.room);
  await prepare(page,base+'/tests/fixtures/world.html?'+q,mode);
  if(c.zoom)await zoom(page,c.zoom);
  if(c.pan)await pan(page,...c.pan);
  const data=await read(page);
  const img=c.id+'-'+mode+'.png';
  await page.screenshot({path:path.join(output,img)});
  const {protected:html,canvas,edges,...rest}=data;
  entry.modes[mode]={...rest,image:img,protectedHashes:html.map(hash)};
  if(mode==='f2'){
   const png=PNG.sync.read(Buffer.from(canvas.split(',')[1],'base64'));
   const uncovered=edges.filter(p=>{
    const x=Math.floor(p.x*(c.dpr?Math.min(c.dpr,1.5):1)),y=Math.floor(p.y*(c.dpr?Math.min(c.dpr,1.5):1));
    return x>=0&&x<png.width&&y>=0&&y<png.height&&png.data[(y*png.width+x)*4+3]!==255;
   });
   check(c.id+' wheat-back coverage',!uncovered.length,uncovered);
   check(c.id+' one renderer / B material',data.canvases===1&&data.stats.mode==='B'&&data.stats.drawCalls===3&&data.stats.programs===2,data.stats);
  }
 }
 check(c.id+' foreground, wheat and railway unchanged',JSON.stringify(entry.modes.legacy.protectedHashes)===JSON.stringify(entry.modes.f2.protectedHashes),{legacy:entry.modes.legacy.protectedHashes,f2:entry.modes.f2.protectedHashes});
 check(c.id+' identical camera',entry.modes.legacy.camera===entry.modes.f2.camera);
 report.scenarios.push(entry);
 await context.close();
 console.log('Captured',c.id);
}
// Exact legacy baseline and unchanged foreground pixels.
const before=await fs.readFile(path.join(output,'baseline-overview.png'));
const after=await fs.readFile(path.join(output,'overview-1600-legacy.png'));
check('Legacy baseline byte equality',before.equals(after),{before:hash(before),after:hash(after)});
const legacyPNG=PNG.sync.read(after),f2PNG=PNG.sync.read(await fs.readFile(path.join(output,'overview-1600-f2.png')));
let foregroundPixels=0, maxForegroundDelta=0;
for(let y=440;y<900;y++)for(let x=0;x<1600;x++){const i=(y*1600+x)*4; if(!legacyPNG.data.subarray(i,i+4).equals(f2PNG.data.subarray(i,i+4))){foregroundPixels++; for(let c=0;c<4;c++)maxForegroundDelta=Math.max(maxForegroundDelta,Math.abs(legacyPNG.data[i+c]-f2PNG.data[i+c]));}}
check('Overview foreground raster differs only by <=1 channel step',foregroundPixels<10&&maxForegroundDelta<=1,{changedPixels:foregroundPixels,maxChannelDelta:maxForegroundDelta,pixelCount:1600*460});
// Use real event handlers and CSS timing. Observe a focus transition, then interrupt it.
{
 const context=await browser.newContext({viewport:{width:1600,height:900},recordVideo:{dir:path.join(output,'video'),size:{width:1600,height:900}}});
 const page=await context.newPage();
 await prepare(page,base+'/tests/fixtures/world.html?hills=f2','f2',false);
 await page.addStyleTag({content:'.cloud-drift-cumulus{animation:none!important}'});
 await page.evaluate(()=>{
  window.__f2Samples=[];window.__f2SampleStop=false;
  function sample(t){setTimeout(()=>{
   const host=document.querySelector('[data-f2-hills]'),s=host?.dataset.stats?JSON.parse(host.dataset.stats):null;
   const m=new DOMMatrixReadOnly(getComputedStyle(document.querySelector('#panoramic-world-stage')).transform);
   if(s)window.__f2Samples.push({t,actual:{x:m.e,y:m.f,zoom:m.a},sampled:s.sampledCamera});
   if(!window.__f2SampleStop)requestAnimationFrame(sample);
  },0);}requestAnimationFrame(sample);
 });
 await page.locator('#room-living_nook').dispatchEvent('click');
 await page.waitForTimeout(110);
 await page.screenshot({path:path.join(output,'focus-midpoint-f2.png')});
 await page.getByTitle('重置为田园全景').click();
 await page.waitForTimeout(650);
 await page.screenshot({path:path.join(output,'return-overview-f2.png')});
 const samples=await page.evaluate(()=>{window.__f2SampleStop=true;return window.__f2Samples;});
 const errors=samples.slice(2,-1).map(s=>Math.max(Math.abs(s.actual.x-s.sampled.x),Math.abs(s.actual.y-s.sampled.y),Math.abs(s.actual.zoom-s.sampled.zoom)*400));
 report.motion={samples,maximumSourceUnitError:Math.max(...errors)};
 check('Interrupted focus/return follows sampled CSS matrix',Math.max(...errors)<1,{max:Math.max(...errors)});
 await page.getByTitle('放大画面').click();await page.waitForTimeout(600);
 check('Zoom button works through canvas',Number(await page.locator('#panoramic-world-stage').getAttribute('data-zoom'))>.66);
 await page.mouse.move(500,100);await page.mouse.wheel(0,80);await page.waitForTimeout(600);
 const prePan=await page.locator('#panoramic-world-stage').getAttribute('style');
 await pan(page,-180,-80);
 check('Pointer pan works through canvas',prePan!==await page.locator('#panoramic-world-stage').getAttribute('style'));
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.getByTitle('重置为田园全景').click();await page.waitForTimeout(600);
 check('Reduced motion respects root transition',await page.locator('#parallax-mountains-layer').evaluate(e=>getComputedStyle(e).transitionDuration)==='0s');
 const idleA=JSON.parse(await page.locator('[data-f2-hills]').getAttribute('data-stats')).renderSamples;
 await page.waitForTimeout(700);
 const idleB=JSON.parse(await page.locator('[data-f2-hills]').getAttribute('data-stats')).renderSamples;
 check('Settled background does not keep rendering',idleA===idleB,{idleA,idleB});
 await context.close();
 await fs.copyFile(await page.video().path(),path.join(output,'camera-motion.webm'));
}
// Compare animation midpoint with legacy at a deterministic point in CSS transition.
report.midpoint=[];
for(const mode of ['legacy','f2']){
 const context=await browser.newContext({viewport:{width:1600,height:900}});
 const page=await context.newPage();
 await prepare(page,base+'/tests/fixtures/world.html?hills='+mode,mode,false);
 await page.locator('#room-living_nook').dispatchEvent('click');
 await page.waitForTimeout(60);
 await page.evaluate(()=>{
  for(const animation of document.getAnimations()){
   if(animation instanceof CSSTransition&&animation.transitionProperty==='transform'){
    animation.pause();animation.currentTime=150;
   }
  }
  const layer=document.querySelector('#parallax-mountains-layer');
  // Let the F2 sampler render the paused CSS frame on its next scheduled tick.
 });
 await page.waitForTimeout(100);
 await page.screenshot({path:path.join(output,'focus-midpoint-'+mode+'.png')});
 report.midpoint.push({mode,matrices:await page.evaluate(()=>['#panoramic-world-stage','#parallax-mountains-layer','#parallax-wheat-layer'].map(s=>getComputedStyle(document.querySelector(s)).transform))});
 await context.close();
}
check('Paused camera midpoint A/B matrices match',JSON.stringify(report.midpoint[0].matrices)===JSON.stringify(report.midpoint[1].matrices),report.midpoint);
// Initial WebGL failure and context loss restore the original scene.
for(const kind of ['initialization','context-loss','shader-compilation']){
 const context=await browser.newContext({viewport:{width:1200,height:800}});
 if(kind==='initialization')await context.addInitScript(()=>{
  const original=HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext=function(type,...args){return String(type).includes('webgl')?null:original.call(this,type,...args);};
 });
 if(kind==='shader-compilation')await context.addInitScript(()=>{
 const original=WebGL2RenderingContext.prototype.shaderSource;
 WebGL2RenderingContext.prototype.shaderSource=function(shader,source){original.call(this,shader,source+'\nF2_FORCED_SHADER_ERROR');};
 });
 const page=await context.newPage();
 await page.goto(historicalSceneUrl(base+'/tests/fixtures/world.html?hills=f2'));
 await page.locator('#panoramic-world-stage').waitFor();
 if(kind==='context-loss'){
  await page.locator('[data-hills-mode="f2"]').waitFor();
  await page.locator('[data-f2-hills] canvas').evaluate(canvas=>canvas.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
 }
 await page.locator('[data-hills-failure]').waitFor();
 check(kind+' falls back to complete legacy',await page.locator('[data-hills-mode="legacy"]').count()===1&&await page.locator('#yorkshire-mountain-silhouette').count()===1&&await page.locator('[data-f2-hills] canvas').count()===0);
 await page.screenshot({path:path.join(output,'fallback-'+kind+'.png')});
 await context.close();
}
// Application StrictMode, environment switching and genuine touch pinch.
{
 const context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true});
 const page=await context.newPage();
 await prepare(page,base+'/?hills=f2','f2');
 check('Real application StrictMode leaves one renderer',await page.locator('[data-f2-hills] canvas').count()===1);
 await page.screenshot({path:path.join(output,'main-app-mobile-f2.png')});
 const cdp=await context.newCDPSession(page);
 const root=page.locator('#panoramic-world-stage');
 const before=Number(await root.getAttribute('data-zoom'));
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:150,y:650,id:1},{x:230,y:650,id:2}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:120,y:650,id:1},{x:260,y:650,id:2}]});
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
 await page.waitForTimeout(600);
 const after=Number(await root.getAttribute('data-zoom'));
 check('Touch pinch remains functional',after>before,{before,after});
 await context.close();
}
check('No page exceptions',report.pageErrors.length===0,report.pageErrors);
report.passed=report.checks.every(c=>c.passed);
report.finished=new Date().toISOString();
await fs.writeFile(path.join(output,'verification.json'),JSON.stringify(report,null,2));
await browser.close();
console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,failures:report.checks.filter(c=>!c.passed)},null,2));
process.exitCode=report.passed?0:1;
