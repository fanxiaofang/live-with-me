import { historicalSceneUrl } from './historicalScene.mjs';
import {chromium} from '@playwright/test';import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
const context=await browser.newContext({viewport:{width:1200,height:800}});
await context.addInitScript(()=>{
 const original=HTMLCanvasElement.prototype.getContext;
 window.__webglContexts=[];
 HTMLCanvasElement.prototype.getContext=function(type,...args){
  const result=original.call(this,type,...args);
  if(result&&String(type).includes('webgl')&&!window.__webglContexts.includes(result))window.__webglContexts.push(result);
  return result;
 };
});
const page=await context.newPage(),report={checks:[]};
const check=(name,passed,detail)=>{report.checks.push({name,passed,detail});console.log(name,passed,detail||'');};
await page.goto(historicalSceneUrl('http://127.0.0.1:3012/tests/fixtures/f2-lifecycle.html?hills=f2'));
for(let i=0;i<4;i++){
 await page.locator('[data-hills-mode="f2"]').waitFor();
 await page.waitForTimeout(700);
 check('one active renderer after mount '+i,await page.locator('[data-f2-hills] canvas').count()===1);
 await page.getByRole('button',{name:'切换世界挂载'}).click();await page.waitForTimeout(80);
 const lost=await page.evaluate(()=>({total:window.__webglContexts.length,live:window.__webglContexts.filter(c=>!c.isContextLost()).length}));
 check('all owned contexts released after unmount '+i,lost.live===0,lost);
 await page.getByRole('button',{name:'切换世界挂载'}).click();
}
await page.goto(historicalSceneUrl('http://127.0.0.1:3012/?hills=f2'));
await page.locator('[data-hills-mode="f2"]').waitFor();
for(const label of ['清晨','黄昏','深夜','静雨','午后']){
 await page.getByRole('button',{name:label,exact:true}).click();
 await page.waitForTimeout(1600);
 const stats=JSON.parse(await page.locator('[data-f2-hills]').getAttribute('data-stats'));
 check(label+' environment keeps B relief and one renderer',stats.mode==='B'&&stats.environmentProgress===1&&stats.programs===2&&stats.drawCalls===3&&await page.locator('[data-f2-hills] canvas').count()===1);
}
await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});document.dispatchEvent(new Event('visibilitychange'));});
const before=JSON.parse(await page.locator('[data-f2-hills]').getAttribute('data-stats')).renderSamples;
await page.getByRole('button',{name:'黄昏',exact:true}).click();await page.waitForTimeout(400);
const hidden=JSON.parse(await page.locator('[data-f2-hills]').getAttribute('data-stats')).renderSamples;
check('visibility handler suspends rendering',hidden===before,{before,hidden,method:'simulated document visibility event'});
await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});
await page.waitForTimeout(1600);
const visible=JSON.parse(await page.locator('[data-f2-hills]').getAttribute('data-stats')).renderSamples;
check('visibility handler resumes and applies pending environment',visible>hidden,{hidden,visible});
report.passed=report.checks.every(x=>x.passed);
await fs.writeFile('docs/visual-system/f2-evidence/lifecycle.json',JSON.stringify(report,null,2));
await context.close();await browser.close();process.exitCode=report.passed?0:1;
