import { historicalSceneUrl } from './historicalScene.mjs';
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const base=process.env.F2_URL||'http://127.0.0.1:3014',out='docs/visual-system/meadow-depth';
const query=mode=>'hills=f2&hillsTransition=foothill&hillsTrees=sparse&fieldEdges=both&meadowStudy='+mode;
const browser=await chromium.launch({channel:'msedge',headless:true}),report={checks:[],midpoints:[],errors:[]};
const check=(name,passed,detail)=>{report.checks.push({name,passed,detail});if(!passed)console.error('FAIL',name,detail)};
async function ready(p,url){
 p.on('pageerror',e=>report.errors.push(e.message));
 await p.goto(historicalSceneUrl(url));await p.locator('[data-hills-mode=f2]').waitFor();
 await p.addStyleTag({content:'*,*::before,*::after{animation:none!important}'});
 await p.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('svg').forEach(s=>{s.pauseAnimations();s.setCurrentTime(0)})});await p.waitForTimeout(650);
}
function rootData(){
 const stage=document.querySelector('#panoramic-world-stage'),m=stage.getScreenCTM();
 return [...document.querySelectorAll('[data-near-clump]')].map(e=>{
  const world=e.dataset.worldRoot.split(',').map(Number),wanted=new DOMPoint(...world).matrixTransform(m);
  const actual=new DOMPoint(0,0).matrixTransform(e.getScreenCTM());
  return{world,screen:{x:actual.x,y:actual.y},error:Math.hypot(actual.x-wanted.x,actual.y-wanted.y)};
 });
}
function installMonitor(){
 window.nearMotion={stop:false,frames:[]};
 function tick(){
  const stage=document.querySelector('#panoramic-world-stage'),m=stage.getScreenCTM();
  const roots=[...document.querySelectorAll('[data-near-clump]')].map(e=>{
   const world=e.dataset.worldRoot.split(',').map(Number),a=new DOMPoint(...world).matrixTransform(m),b=new DOMPoint(0,0).matrixTransform(e.getScreenCTM());
   return{world,error:Math.hypot(a.x-b.x,a.y-b.y)};
  });
  window.nearMotion.frames.push(roots);if(!window.nearMotion.stop)requestAnimationFrame(tick);
 }requestAnimationFrame(tick);
}
for(const mode of ['original','complete']){
 const p=await browser.newPage({viewport:{width:1600,height:900}});await ready(p,base+'/tests/fixtures/world.html?'+query(mode));
 await p.locator('#room-living_nook').dispatchEvent('click');await p.waitForTimeout(60);
 await p.evaluate(()=>{for(const a of document.getAnimations())if(a instanceof CSSTransition&&a.transitionProperty==='transform'){a.pause();a.currentTime=150}});
 await p.waitForTimeout(100);await p.screenshot({path:out+'/midpoint-'+mode+'.png'});
 report.midpoints.push({mode,matrices:await p.evaluate(()=>['#panoramic-world-stage','#parallax-wheat-layer','#parallax-mountains-layer'].map(s=>getComputedStyle(document.querySelector(s)).transform))});await p.close();
}
check('150ms camera midpoint unchanged',JSON.stringify(report.midpoints[0].matrices)===JSON.stringify(report.midpoints[1].matrices));
const context=await browser.newContext({viewport:{width:1600,height:900},recordVideo:{dir:out+'/video',size:{width:1600,height:900}}});
const p=await context.newPage();await ready(p,base+'/tests/fixtures/world.html?'+query('complete'));const originalRoots=await p.evaluate(rootData);await p.evaluate(installMonitor);
await p.locator('#room-living_nook').dispatchEvent('click');await p.waitForTimeout(160);
await p.getByTitle('重置为田园全景').click();await p.waitForTimeout(650);
await p.getByTitle('放大画面').click();await p.waitForTimeout(550);
// Drag through the decorative corner: plants must not steal input.
const before=await p.locator('#panoramic-world-stage').getAttribute('style');
await p.mouse.move(38,875);await p.mouse.down();await p.mouse.move(130,795,{steps:8});await p.mouse.up();await p.waitForTimeout(500);
check('Dragging through near plants still pans the world',before!==await p.locator('#panoramic-world-stage').getAttribute('style'));
const afterRoots=await p.evaluate(rootData);
check('Camera gestures never re-pin roots to corners',JSON.stringify(originalRoots.map(p=>p.world))===JSON.stringify(afterRoots.map(p=>p.world))&&afterRoots.every(p=>p.error<.001),afterRoots);
await p.getByTitle('重置为田园全景').click();await p.waitForTimeout(650);
report.motion=await p.evaluate(()=>{window.nearMotion.stop=true;return window.nearMotion.frames});
check('Near roots remain attached through every sampled animation frame',report.motion.length>5&&report.motion.every(f=>f.length===2&&f.every(p=>p.error<.001)),{frames:report.motion.length,maxError:Math.max(...report.motion.flat().map(p=>p.error))});
await p.emulateMedia({reducedMotion:'reduce'});check('Reduced motion still disables camera easing',await p.locator('#panoramic-world-stage').evaluate(e=>getComputedStyle(e).transitionDuration==='0s'));
await context.close();const video=await p.video().path();await fs.copyFile(video,out+'/camera-motion.webm');await fs.unlink(video);await fs.rmdir(out+'/video');

const app=await browser.newPage({viewport:{width:1600,height:900}});
await app.addInitScript(()=>{
 const Native=window.ResizeObserver;window.roStudy={created:0,active:0};
 window.ResizeObserver=class extends Native{
  constructor(cb){super(cb);window.roStudy.created++;this.tracked=false}
  observe(...args){if(!this.tracked){this.tracked=true;window.roStudy.active++}return super.observe(...args)}
  disconnect(){if(this.tracked){this.tracked=false;window.roStudy.active--}return super.disconnect()}
 };
});
await ready(app,base+'/?'+query('complete'));await app.screenshot({path:out+'/main-app-complete.png'});
const observers=await app.evaluate(()=>window.roStudy.created);
report.observers={initial:await app.evaluate(()=>({...window.roStudy}))};
check('Camera, F2 and near plants each retain one resize observer',await app.evaluate(()=>window.roStudy.active===3),report.observers.initial);
for(const[label,id]of[['黄昏','dusk'],['深夜','night'],['静雨','rainy'],['午后','afternoon']]){
 await app.getByRole('button',{name:label,exact:true}).click();await app.waitForTimeout(1650);
 const s=JSON.parse(await app.locator('[data-f2-hills]').getAttribute('data-stats'));
 check('Actual app '+id+' retains F2-B and one renderer',s.environment===id&&s.environmentProgress===1&&s.mode==='B'&&s.drawCalls===3&&await app.locator('[data-f2-hills] canvas').count()===1);
}
check('Theme updates do not recreate the observers',observers===await app.evaluate(()=>window.roStudy.created));
report.stats=JSON.parse(await app.locator('[data-f2-hills]').getAttribute('data-stats'));
await app.setViewportSize({width:390,height:844});await app.waitForTimeout(650);
const roots=await app.evaluate(rootData);
check('Responsive overview has cropped rooted plants',roots.every(p=>p.screen.y>844&&p.screen.y<864&&p.error<.001),roots);
await app.screenshot({path:out+'/main-app-mobile.png'});
check('Near plants never intercept input',await app.locator('[data-near-meadow-plants]').evaluate(e=>getComputedStyle(e).pointerEvents==='none'));
await app.locator('[data-f2-hills] canvas').evaluate(e=>e.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));await app.locator('[data-hills-mode=legacy]').waitFor();
check('Context loss restores original meadow and releases study observers',await app.locator('[data-meadow-study=original]').count()===1&&await app.locator('[data-near-meadow-plants]').count()===0&&await app.evaluate(()=>window.roStudy.active===1));
report.observers.afterFallback=await app.evaluate(()=>({...window.roStudy}));
await app.close();

const legacy=await browser.newPage();
for(const url of [base+'/tests/fixtures/world.html?hills=legacy&meadowStudy=complete',base+'/tests/fixtures/world.html?'+query('complete')+'&meadow=legacy']){
 await legacy.goto(historicalSceneUrl(url));await legacy.locator('#panoramic-world-stage').waitFor();await legacy.waitForTimeout(650);
 check('Legacy composition ignores trial '+url.split('?')[1],await legacy.locator('[data-meadow-study=original]').count()===1&&await legacy.locator('[data-near-meadow-plants]').count()===0);
}await legacy.close();

const review=await browser.newPage({viewport:{width:1200,height:900}});
await review.goto(historicalSceneUrl(base+'/docs/visual-system/meadow-depth/index.html'));await review.locator('#scenario option').first().waitFor({state:'attached'});
for(const mode of ['surface','foreground','complete']){
 await review.locator('#variant').selectOption(mode);await review.locator('#new').evaluate(img=>img.decode());
 check('Review exposes '+mode,await review.locator('#new').getAttribute('src')==='overview-'+mode+'.png');
}
await review.locator('#scenario').selectOption('mobile');await review.locator('#new').evaluate(img=>img.decode());
check('Review shows mobile original-size image',await review.locator('#new').evaluate(img=>img.naturalWidth===390));
await review.locator('#scenario').selectOption('night');check('Two-image environment pair disables absent variants',await review.locator('#variant').isDisabled());
await review.locator('#split').fill('0');await review.locator('#split').dispatchEvent('input');check('Review slider works',await review.locator('#new').evaluate(img=>img.style.clipPath.includes('100%')));
await review.setViewportSize({width:390,height:844});check('Review no narrow overflow',await review.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
check('Review record loaded',await review.locator('#error').isHidden());await review.close();
check('No page errors',report.errors.length===0,report.errors);report.passed=report.checks.every(c=>c.passed);
await fs.writeFile(out+'/motion.json',JSON.stringify(report,null,2));await browser.close();
console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,failures:report.checks.filter(c=>!c.passed)},null,2));process.exitCode=report.passed?0:1;
