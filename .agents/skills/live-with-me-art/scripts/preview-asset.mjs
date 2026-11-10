import { chromium } from '@playwright/test';
import { parseArgs } from 'node:util';
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const { values } = parseArgs({ options: {
  selector:{type:'string'}, out:{type:'string',default:'test-results/art-review'},
  url:{type:'string',default:'http://127.0.0.1:3000/'}, themes:{type:'string'},
  width:{type:'string',default:'1440'}, height:{type:'string',default:'1000'},
  timeout:{type:'string',default:'60000'}, help:{type:'boolean'},
} });
if (values.help) {
  console.log('preview-asset.mjs --selector "#asset-id" [--out test-results/art-review] [--themes "白天,夜晚"] [--url http://127.0.0.1:3000/] [--width 1440 --height 1000 --timeout 60000]');
  process.exit(0);
}
if (!values.selector?.trim()) throw new Error('Provide one unique --selector for the rendered asset.');
const width=Number(values.width), height=Number(values.height), timeout=Number(values.timeout);
if (![width,height,timeout].every(n=>Number.isInteger(n)&&n>0) || width<320 || height<240) throw new Error('Invalid viewport / timeout. Minimum viewport: 320 × 240.');
const out=resolve(values.out);
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const report={url:values.url,selector:values.selector,viewport:{width,height},captures:[],pageErrors:[]};
try {
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  page.setDefaultTimeout(timeout);
  page.on('pageerror',e=>report.pageErrors.push(e.message));
  await page.goto(values.url,{waitUntil:'domcontentloaded'});
  const target=page.locator(values.selector);
  await target.waitFor({state:'visible'});
  if(await target.count()!==1) throw new Error('The selector must identify exactly one asset.');
  await page.evaluate(()=>document.fonts.ready);
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
  const settle=()=>page.evaluate(async({selector,timeout})=>{
    const el=document.querySelector(selector);
    const start=performance.now(); let last='',still=0;
    while(performance.now()-start<timeout){
      const b=el.getBoundingClientRect();
      const shape=[b.x,b.y,b.width,b.height].map(n=>n.toFixed(2)).join(',');
      still=shape===last&&b.width>0&&b.height>0?still+1:0; last=shape;
      if(still>=12) return;
      await new Promise(requestAnimationFrame);
    }
    throw new Error('Asset geometry did not settle before capture.');
  },{selector:values.selector,timeout});
  const themes=values.themes?values.themes.split(',').map(s=>s.trim()).filter(Boolean):[null];
  if(!themes.length) throw new Error('--themes must contain at least one button label.');
  for(const [index,theme] of themes.entries()){
    if(theme) await page.getByRole('button',{name:theme,exact:true}).click();
    await settle();
    const name=`${index+1}-${theme?theme.replace(/[^\p{L}\p{N}_-]/gu,'_'):'current'}`;
    const scene=`scene-${name}.png`, detail=`detail-${name}.png`;
    await page.screenshot({path:resolve(out,scene),animations:'disabled'});
    const original=await page.evaluate(({selector,width,height})=>{
      const el=document.querySelector(selector),stage=document.querySelector('#panoramic-world-stage');
      if(!stage?.getScreenCTM) throw new Error('This helper expects #panoramic-world-stage. Use the page’s own framing for other views.');
      if(!stage.contains(el)) throw new Error('The target is outside the world stage.');
      const b=el.getBoundingClientRect();
      if(!b.width||!b.height) throw new Error('The asset has no visible geometry.');
      const parent=stage.parentElement.getScreenCTM(),m=stage.getScreenCTM();
      if(!parent||!m) throw new Error('The stage has no usable screen matrix.');
      const previous={transform:stage.style.transform,origin:stage.style.transformOrigin};
      const scale=Math.min((width-64)/b.width,(height-64)/b.height,4);
      const screen=new DOMMatrix().translate(width/2,height/2).scale(scale).translate(-b.x-b.width/2,-b.y-b.height/2).multiply(m);
      stage.style.transformOrigin='0px 0px';
      stage.style.transform=DOMMatrix.fromMatrix(parent).inverse().multiply(screen).toString();
      return previous;
    },{selector:values.selector,width,height});
    try {
      await settle();
      const b=await target.boundingBox();
      if(!b || b.x<8 || b.y<8 || b.x+b.width>width-8 || b.y+b.height>height-8 || Math.abs(b.x+b.width/2-width/2)>3 || Math.abs(b.y+b.height/2-height/2)>3)
        throw new Error('Review framing was reset or clipped. No detail screenshot accepted.');
      const clip={x:Math.max(0,Math.floor(b.x-20)),y:Math.max(0,Math.floor(b.y-20))};
      clip.width=Math.min(width-clip.x,Math.ceil(b.width+40));
      clip.height=Math.min(height-clip.y,Math.ceil(b.height+40));
      await page.screenshot({path:resolve(out,detail),clip,animations:'disabled'});
      report.captures.push({theme:theme??'current',scene,detail,bounds:b});
    } finally {
      await page.evaluate(previous=>{
        const stage=document.querySelector('#panoramic-world-stage');
        stage.style.transform=previous.transform; stage.style.transformOrigin=previous.origin;
      },original);
    }
  }
  if(report.pageErrors.length) throw new Error('The page reported errors; inspect review.json.');
  console.log(JSON.stringify({out,captures:report.captures.length,selector:values.selector}));
} catch(error) {
  report.failure=String(error);
  throw error;
} finally {
  await writeFile(resolve(out,'review.json'),JSON.stringify(report,null,2),'utf8');
  await browser.close();
}
