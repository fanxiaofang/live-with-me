import { historicalSceneUrl } from './historicalScene.mjs';
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const base=process.env.F2_URL||'http://127.0.0.1:3012',out='docs/visual-system/f2-calibration';
const browser=await chromium.launch({channel:'msedge',headless:true}),report={midpoints:[],checks:[]};
const check=(name,passed,detail)=>report.checks.push({name,passed,detail});
async function ready(page,url){
 await page.goto(historicalSceneUrl(url));await page.locator('[data-hills-mode="f2"]').waitFor();
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important}'});
 await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('svg').forEach(svg=>{svg.pauseAnimations();svg.setCurrentTime(0);});});
 await page.waitForTimeout(650);
}
for(const study of ['baseline','refined']){
 const page=await browser.newPage({viewport:{width:1600,height:900}});
 await ready(page,base+'/tests/fixtures/world.html?hills=f2&hillsStudy='+study);
 await page.locator('#room-living_nook').dispatchEvent('click');await page.waitForTimeout(60);
 await page.evaluate(()=>{for(const a of document.getAnimations())if(a instanceof CSSTransition&&a.transitionProperty==='transform'){a.pause();a.currentTime=150;}});
 await page.waitForTimeout(100);
 await page.screenshot({path:out+'/focus-midpoint-'+study+'.png'});
 report.midpoints.push({study,matrices:await page.evaluate(()=>['#panoramic-world-stage','#parallax-mountains-layer','#parallax-wheat-layer'].map(s=>getComputedStyle(document.querySelector(s)).transform))});
 await page.close();
}
check('150ms camera midpoint matrices equal',JSON.stringify(report.midpoints[0].matrices)===JSON.stringify(report.midpoints[1].matrices));
const context=await browser.newContext({viewport:{width:1600,height:900},recordVideo:{dir:out+'/video',size:{width:1600,height:900}}});
const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
await ready(page,base+'/tests/fixtures/world.html?hills=f2');

check('Motion fixture cloud removed and one renderer',await page.locator('#cumulus-whale-west').count()===0&&await page.locator('[data-f2-hills] canvas').count()===1);
await page.locator('#room-living_nook').dispatchEvent('click');await page.waitForTimeout(160);
await page.getByTitle('重置为田园全景').click();await page.waitForTimeout(700);
await page.getByTitle('放大画面').click();await page.waitForTimeout(550);
await page.mouse.move(60,160);await page.mouse.down();await page.mouse.move(160,190,{steps:8});await page.mouse.up();await page.waitForTimeout(550);
await page.getByTitle('重置为田园全景').click();await page.waitForTimeout(650);
await context.close();
const video=await page.video().path();await fs.copyFile(video,out+'/camera-motion.webm');
for(const name of await fs.readdir(out+'/video'))if(/^[a-f0-9]+\.webm$/.test(name))await fs.unlink(out+'/video/'+name);
await fs.rmdir(out+'/video');
const app=await browser.newPage({viewport:{width:1600,height:900}});app.on('pageerror',e=>errors.push(e.message));
await ready(app,base+'/?hills=f2');
await app.screenshot({path:out+'/main-app-refined.png'});
check('Actual app cloud removed and one renderer',await app.locator('#cumulus-whale-west').count()===0&&await app.locator('[data-f2-hills] canvas').count()===1);

for(const [label,id] of [['深夜','night'],['静雨','rainy'],['午后','afternoon']]){
 await app.getByRole('button',{name:label,exact:true}).click();await app.waitForTimeout(1650);
 const stats=JSON.parse(await app.locator('[data-f2-hills]').getAttribute('data-stats'));
 check('Actual app '+id+' final environment',stats.environment===id&&stats.environmentProgress===1&&stats.mode==='B'&&stats.drawCalls===3);
}
check('Actual app no page errors',errors.length===0,errors);
await app.close();
const review=await browser.newPage({viewport:{width:1200,height:900}}),pageErrors=[];review.on('pageerror',e=>pageErrors.push(e.message));
await review.goto(historicalSceneUrl(base+'/docs/visual-system/f2-calibration/index.html'));
await review.locator('#scenario option').first().waitFor({state:'attached'});
await review.locator('#scenario').selectOption('mobile');await review.locator('#new').evaluate(img=>img.decode());
check('Review page mobile shows correct image',await review.locator('#new').evaluate(img=>img.naturalWidth===390));
await review.locator('#split').fill('0');await review.locator('#split').dispatchEvent('input');
check('Review slider responds',await review.locator('#new').evaluate(img=>img.style.clipPath.includes('100%')));
await review.setViewportSize({width:390,height:844});
check('Review page no narrow overflow',await review.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
check('Review page no errors',pageErrors.length===0&&await review.locator('#error').isHidden(),pageErrors);
await review.close();await browser.close();
report.passed=report.checks.every(c=>c.passed);await fs.writeFile(out+'/motion.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));process.exitCode=report.passed?0:1;
