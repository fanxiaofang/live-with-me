import { historicalSceneUrl } from './historicalScene.mjs';
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const base=process.env.F2_URL||'http://127.0.0.1:3014',out='docs/visual-system/field-edges';
const browser=await chromium.launch({channel:'msedge',headless:true}),report={midpoints:[],checks:[],errors:[]};
const check=(name,passed,detail)=>{report.checks.push({name,passed,detail});if(!passed)console.error('FAIL',name,detail)};
const query=mode=>'hills=f2&hillsTransition=foothill&hillsTrees=sparse&fieldEdges='+mode;
async function ready(page,url){
 page.on('pageerror',e=>report.errors.push(e.message));
 await page.goto(historicalSceneUrl(url));await page.locator('[data-hills-mode=f2]').waitFor();
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important}'});
 await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('svg').forEach(s=>{s.pauseAnimations();s.setCurrentTime(0)})});
 await page.waitForTimeout(650);
}
function installMonitor(){
 const $=s=>document.querySelector(s),sources=new Map();
 const sample=selector=>{
  const e=$(selector),d=e.getAttribute('d');let p=sources.get(d);
  if(!p){const len=e.getTotalLength();p=Array.from({length:1501},(_,i)=>e.getPointAtLength(len*i/1500));sources.set(d,p);}
  const m=e.getScreenCTM();return p.map(v=>new DOMPoint(v.x,v.y).matrixTransform(m));
 };
 const edges=(p,x)=>{const ys=[];for(let i=1;i<p.length;i++){const a=p[i-1],b=p[i];if((a.x<=x&&b.x>x)||(b.x<=x&&a.x>x))ys.push(a.y+(b.y-a.y)*(x-a.x)/(b.x-a.x))}return{top:Math.min(...ys),bottom:Math.max(...ys)}};
 window.edgeMotion={frames:[],stop:false};
 function tick(){
  const crop=sample('#organic-rolling-wheat-fields > path:first-child'),grass=sample('#master-axonometric-ground-plane > path:nth-of-type(2)');
  const gaps=Array.from({length:9},(_,i)=>{const x=innerWidth*(i+.5)/9;return edges(grass,x).top-edges(crop,x).bottom});
  const projection=getComputedStyle($('#parallax-wheat-layer')).transform;
  window.edgeMotion.frames.push({maxGap:Math.max(...gaps),attached:['#parallax-foothill-layer','#parallax-foothill-trees-layer'].every(s=>getComputedStyle($(s)).transform===projection)});
  if(!window.edgeMotion.stop)requestAnimationFrame(tick);
 }
 requestAnimationFrame(tick);
}
for(const mode of ['original','both']){
 const p=await browser.newPage({viewport:{width:1600,height:900}});
 await ready(p,base+'/tests/fixtures/world.html?'+query(mode));
 await p.locator('#room-living_nook').dispatchEvent('click');await p.waitForTimeout(60);
 await p.evaluate(()=>{for(const a of document.getAnimations())if(a instanceof CSSTransition&&a.transitionProperty==='transform'){a.pause();a.currentTime=150}});
 await p.waitForTimeout(100);
 await p.screenshot({path:out+'/midpoint-'+mode+'.png'});
 report.midpoints.push({mode,matrices:await p.evaluate(()=>['#panoramic-world-stage','#parallax-wheat-layer','#parallax-mountains-layer'].map(s=>getComputedStyle(document.querySelector(s)).transform))});
 await p.close();
}
check('Deterministic 150ms camera midpoint unchanged',JSON.stringify(report.midpoints[0].matrices)===JSON.stringify(report.midpoints[1].matrices));
const context=await browser.newContext({viewport:{width:1600,height:900},recordVideo:{dir:out+'/video',size:{width:1600,height:900}}});
const p=await context.newPage();await ready(p,base+'/tests/fixtures/world.html?'+query('both'));await p.evaluate(installMonitor);
await p.locator('#room-living_nook').dispatchEvent('click');await p.waitForTimeout(160);
await p.getByTitle('重置为田园全景').click();await p.waitForTimeout(700);
await p.getByTitle('放大画面').click();await p.waitForTimeout(550);
await p.mouse.move(60,160);await p.mouse.down();await p.mouse.move(160,190,{steps:8});await p.mouse.up();await p.waitForTimeout(550);
await p.getByTitle('重置为田园全景').click();await p.waitForTimeout(650);
report.motion=await p.evaluate(()=>{window.edgeMotion.stop=true;return window.edgeMotion.frames});
check('Motion, reversal, zoom and drag keep A/B attached and grass covered',report.motion.length>10&&report.motion.every(f=>f.attached&&f.maxGap<-1),{frames:report.motion.length,worstGap:Math.max(...report.motion.map(f=>f.maxGap))});
await p.emulateMedia({reducedMotion:'reduce'});check('Reduced motion still disables camera easing',await p.locator('#parallax-wheat-layer').evaluate(e=>getComputedStyle(e).transitionDuration==='0s'));
await context.close();const video=await p.video().path();await fs.copyFile(video,out+'/camera-motion.webm');await fs.unlink(video);await fs.rmdir(out+'/video');
const app=await browser.newPage({viewport:{width:1600,height:900}});
await ready(app,base+'/?'+query('original'));
const originalNodes=await app.locator('#panoramic-world-stage').evaluate(e=>e.closest('svg').querySelectorAll('*').length);
await ready(app,base+'/?'+query('both'));await app.screenshot({path:out+'/main-app-both.png'});
check('Actual app uses both edges and one pointer-transparent renderer',await app.locator('[data-field-edges=both]').count()===1&&await app.locator('[data-f2-hills] canvas').count()===1&&await app.locator('[data-f2-hills]').evaluate(e=>getComputedStyle(e).pointerEvents==='none'));
report.stats=JSON.parse(await app.locator('[data-f2-hills]').getAttribute('data-stats'));
report.svg=await app.evaluate(()=>({nodes:document.querySelector('#panoramic-world-stage').closest('svg').querySelectorAll('*').length,fringeNodes:document.querySelector('[data-field-contact-fringe]').querySelectorAll('*').length,rearPathBytes:new TextEncoder().encode(document.querySelector('#organic-rolling-wheat-fields > path').getAttribute('d')).length}));
report.svg.originalNodes=originalNodes;report.svg.additionalNodes=report.svg.nodes-originalNodes;
for(const [label,id] of [['黄昏','dusk'],['深夜','night'],['静雨','rainy'],['午后','afternoon']]){
 await app.getByRole('button',{name:label,exact:true}).click();await app.waitForTimeout(1650);
 const s=JSON.parse(await app.locator('[data-f2-hills]').getAttribute('data-stats'));
 check('Actual app '+id+' preserves B material',s.environment===id&&s.environmentProgress===1&&s.mode==='B'&&s.drawCalls===3);
}
await app.locator('[data-f2-hills] canvas').evaluate(canvas=>canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true})));
await app.locator('[data-hills-mode=legacy]').waitFor();
check('WebGL fallback restores original Legacy field edges',await app.locator('[data-field-edges=original]').count()===1&&await app.locator('[data-field-contact-fringe]').count()===0&&await app.locator('#yorkshire-mountain-silhouette').count()===1);
await app.close();
const review=await browser.newPage({viewport:{width:1200,height:900}});
await review.goto(historicalSceneUrl(base+'/docs/visual-system/field-edges/index.html'));await review.locator('#scenario option').first().waitFor({state:'attached'});
await review.locator('#variant').selectOption('front');await review.locator('#new').evaluate(img=>img.decode());
check('Review exposes independent front variant',await review.locator('#new').getAttribute('src')==='overview-front.png');
await review.locator('#scenario').selectOption('mobile');await review.locator('#new').evaluate(img=>img.decode());
check('Review mobile image and variant state',await review.locator('#new').evaluate(img=>img.naturalWidth===390)&&await review.locator('#variant').isDisabled());
await review.locator('#split').fill('0');await review.locator('#split').dispatchEvent('input');
check('Review split responds',await review.locator('#new').evaluate(img=>img.style.clipPath.includes('100%')));
await review.setViewportSize({width:390,height:844});
check('Review has no narrow overflow',await review.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
check('Review loads its record',await review.locator('#error').isHidden());await review.close();
check('No page errors',report.errors.length===0,report.errors);
report.passed=report.checks.every(c=>c.passed);await fs.writeFile(out+'/motion.json',JSON.stringify(report,null,2));await browser.close();
console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,failures:report.checks.filter(c=>!c.passed)},null,2));process.exitCode=report.passed?0:1;
