import {chromium} from '@playwright/test';import fs from 'node:fs/promises';import os from 'node:os';import {gzipSync} from 'node:zlib';
const browser=await chromium.launch({channel:'msedge',headless:true});
const report={browser:browser.version(),cpu:os.cpus()[0].model,logicalCpus:os.cpus().length,platform:os.platform(),headless:true,viewport:{width:1600,height:900},dpr:1};
const percentile=(values,q)=>{const a=[...values].sort((a,b)=>a-b);return a[Math.floor((a.length-1)*q)]||0;};
for(const mode of ['legacy','f2']){
 const page=await browser.newPage({viewport:report.viewport,deviceScaleFactor:1});
 const requested=[];page.on('request',r=>requested.push(r.url()));
 await page.goto('http://127.0.0.1:3013/?hills='+mode);
 await page.locator('[data-hills-mode="'+mode+'"]').waitFor();
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important}'});
 await page.waitForTimeout(800);
 const started=performance.now();
 const samples=await page.evaluate(async(mode)=>{
  const samples=[],svg=document.querySelector('#panoramic-world-stage').closest('svg');
  let last=0;
  for(let step=0;step<12;step++){
   const target=.66+(step%2?0:.24);
   const current=Number(document.querySelector('#panoramic-world-stage').dataset.zoom);
   svg.dispatchEvent(new WheelEvent('wheel',{deltaY:(current-target)/.0012,bubbles:true,cancelable:true}));
   for(let i=0;i<7;i++){
    await new Promise(r=>requestAnimationFrame(()=>setTimeout(r,0)));
    const time=performance.now(),stats=document.querySelector('[data-f2-hills]')?.dataset.stats;
    samples.push({interval:last?time-last:0,stats:stats?JSON.parse(stats):null});last=time;
   }
  }
  return samples;
 },mode);
 const stats=samples.at(-1).stats;
 report[mode]={wallMs:performance.now()-started,samples:samples.length,rafIntervalMedianMs:percentile(samples.map(s=>s.interval).filter(Boolean),.5),rafIntervalP95Ms:percentile(samples.map(s=>s.interval).filter(Boolean),.95),loadedF2Chunk:requested.some(u=>u.includes('/assets/F2DistantHills-')),stats};
 if(mode==='f2'){
  const fresh=samples.filter((s,i)=>i===0||s.stats.renderSamples!==samples[i-1].stats.renderSamples).map(s=>s.stats.renderSubmitMs);
  report[mode].renderSubmitMedianMs=percentile(fresh,.5);report[mode].renderSubmitP95Ms=percentile(fresh,.95);
  report.gpu=await page.locator('[data-f2-hills] canvas').evaluate(canvas=>{const gl=canvas.getContext('webgl2'),ext=gl.getExtension('WEBGL_debug_renderer_info');return ext?gl.getParameter(ext.UNMASKED_RENDERER_WEBGL):'unavailable';});
  report.canvasBuffer=await page.locator('[data-f2-hills] canvas').evaluate(c=>({width:c.width,height:c.height}));
 }
 await page.close();
}
const files=await fs.readdir('dist/assets'),chunk=files.find(f=>f.startsWith('F2DistantHills-'));
const bytes=await fs.readFile('dist/assets/'+chunk);report.chunk={file:chunk,bytes:bytes.length,gzipBytes:gzipSync(bytes).length};
report.notes=['CPU render submission, not GPU execution time.','rAF intervals measured during repeated CSS camera transitions in headless Edge; not a mobile FPS guarantee.','No concurrent verification browsers were running during this sample.'];
await fs.writeFile('docs/visual-system/f2-evidence/performance.json',JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));await browser.close();
