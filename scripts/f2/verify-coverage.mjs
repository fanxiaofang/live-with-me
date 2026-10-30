import { historicalSceneUrl } from './historicalScene.mjs';
import {chromium} from '@playwright/test';import fs from 'node:fs/promises';
const output=process.env.F2_OUTPUT||'docs/visual-system/f2-evidence'; await fs.mkdir(output,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true}),report={samples:[],failures:[]};
for(const viewport of [{width:1600,height:900},{width:1200,height:800},{width:390,height:844}]){
 const page=await browser.newPage({viewport,deviceScaleFactor:1});
 await page.goto(historicalSceneUrl((process.env.F2_URL||'http://127.0.0.1:3012')+'/tests/fixtures/world.html?hills=f2'));
 await page.locator('[data-hills-mode=f2]').waitFor();
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
 for(const zoom of [.45,.66,1.6,2.5]){
  await page.locator('#panoramic-world-stage').evaluate((e,z)=>e.closest('svg').dispatchEvent(new WheelEvent('wheel',{deltaY:(Number(e.dataset.zoom)-z)/.0012,bubbles:true,cancelable:true})),zoom);
  for(const [dx,dy] of [[-1,-1],[1,-1],[1,1],[-1,1]]){
   await page.mouse.move(50,65);await page.mouse.down();await page.mouse.move(50+dx*12,65+dy*12);await page.mouse.move(50+dx*5000,65+dy*5000);await page.mouse.up();
   await page.waitForTimeout(60);
   await page.waitForFunction(()=>{
    const host=document.querySelector('[data-f2-hills]');
    if(!host){const failure=document.querySelector('[data-hills-failure]');if(failure)throw Error(failure.dataset.hillsFailure);return false;}
    if(!host.dataset.stats)return false;
    const s=JSON.parse(host.dataset.stats).sampledCamera,m=new DOMMatrixReadOnly(getComputedStyle(document.querySelector('#panoramic-world-stage')).transform);
    return Math.abs(s.x-m.e)<.00001&&Math.abs(s.y-m.f)<.00001&&Math.abs(s.zoom-m.a)<.00001;
   });
   const result=await page.evaluate(()=>{
    const host=document.querySelector('[data-f2-hills]'),canvas=host.querySelector('canvas'),gl=canvas.getContext('webgl2');
    const path=document.querySelector('#organic-rolling-wheat-fields > path'),rect=host.getBoundingClientRect(),matrix=path.getScreenCTM(),length=path.getTotalLength();
    const points=Array.from({length:3001},(_,i)=>{const p=path.getPointAtLength(length*i/3000);return new DOMPoint(p.x,p.y).matrixTransform(matrix);});
    const failures=[];let checked=0;
    for(let i=0;i<31;i++){const x=rect.left+rect.width*(i+.5)/31,ys=[];
     for(let j=1;j<points.length;j++){const a=points[j-1],b=points[j];if((a.x<=x&&b.x>x)||(b.x<=x&&a.x>x))ys.push(a.y+(b.y-a.y)*(x-a.x)/(b.x-a.x));}
     const y=Math.min(...ys)-rect.top-2;
     if(y<0||y>=rect.height)continue;
     const pixel=new Uint8Array(4);gl.readPixels(Math.floor((x-rect.left)*canvas.width/rect.width),canvas.height-1-Math.floor(y*canvas.height/rect.height),1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
     checked++;if(pixel[3]!==255)failures.push({x,y,alpha:pixel[3]});
    }return{checked,failures,camera:document.querySelector('#panoramic-world-stage').getAttribute('style')};
   });
   const entry={viewport,zoom,corner:[dx,dy],...result};report.samples.push(entry);
   if(result.failures.length){report.failures.push(entry);await page.screenshot({path:output+'/coverage-failure-'+viewport.width+'-'+zoom+'-'+dx+'-'+dy+'.png'});}
  }
 }await page.close();console.log('Coverage',viewport.width);
}
report.passed=report.failures.length===0;
await fs.writeFile(output+'/coverage.json',JSON.stringify(report,null,2));await browser.close();
console.log(JSON.stringify({passed:report.passed,states:report.samples.length,failures:report.failures},null,2));process.exitCode=report.passed?0:1;
