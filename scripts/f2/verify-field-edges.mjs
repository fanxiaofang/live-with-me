import { historicalSceneUrl } from './historicalScene.mjs';
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { PNG } = require(path.join(path.dirname(require.resolve('playwright-core/package.json')), 'lib/utilsBundle.js'));
const base = process.env.F2_URL || 'http://127.0.0.1:3014';
const out = 'docs/visual-system/field-edges';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const report = { scenarios: [], checks: [], coverage: [], pageErrors: [] };
const check = (name, passed, detail) => {
  report.checks.push({ name, passed, ...(detail === undefined ? {} : { detail }) });
  if (!passed) console.error('FAIL', name, detail);
};
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const query = mode => 'hills=f2&hillsTransition=foothill&hillsTrees=sparse&fieldEdges=' + mode;
async function ready(page, url, freeze = true) {
  await page.goto(historicalSceneUrl(url));
  await page.locator('[data-hills-mode=f2]').waitFor();
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;' + (freeze ? 'transition:none!important' : '') + '}' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.querySelectorAll('svg').forEach(s => { s.pauseAnimations(); s.setCurrentTime(0); });
  });
  await page.waitForTimeout(650);
}
function sceneData() {
  const $ = s => document.querySelector(s);
  const stage = $('#panoramic-world-stage').cloneNode(true);
  stage.querySelector('#master-axonometric-ground-plane').remove();
  stage.querySelectorAll('linearGradient[id^="field-contact-"]').forEach(e => e.remove());
  const protectedSelectors = ['#tractor-in-field', '#perspective-hay-bales', '#wheat-margin-trees',
    '#flat-wheat-field-margins', '#yorkshire-railway-viaduct', '#pastoral-boundary-dressing',
    '#homestead-organic-meadow-grounds'];
  const matrix = $('#panoramic-world-stage').getScreenCTM();
  const frontBand = [new DOMPoint(0, 166), new DOMPoint(0, 204)].map(p => p.matrixTransform(matrix).y);
  const plants = $('[data-foothill-trees]').getBoundingClientRect();
  const rear = $('[data-foothill-transition]').getBoundingClientRect();
  const fence = $('#wheat-margin-fences').getBoundingClientRect();
  const wheat = $('#parallax-wheat-layer').getScreenCTM();
  const rearBand = [Math.min(rear.top, plants.top, fence.top) - 3, Math.max(rear.bottom, fence.bottom, new DOMPoint(0, 235).matrixTransform(wheat).y) + 3];
  return {
    protected: [stage.outerHTML, ...protectedSelectors.map(s => $(s).outerHTML)],
    matrices: ['#panoramic-world-stage', '#parallax-wheat-layer', '#parallax-mountains-layer'].map(s => getComputedStyle($(s)).transform),
    stats: JSON.parse($('[data-f2-hills]').dataset.stats),
    fringe: document.querySelectorAll('[data-field-contact-fringe]').length,
    mode: $('[data-field-edges]').dataset.fieldEdges,
    bands: { front: frontBand, rear: rearBand },
    tramlines: [...$('#flat-wheat-tramlines').children].map(l => ['x1','y1','x2','y2'].map(a => Number(l.getAttribute(a)))),
    bales: $('#perspective-hay-bales').children.length
  };
}
// Real path / CTM sampling checks both seams, plus actual foreground occlusion.
function terrainSample() {
  const $ = s => document.querySelector(s);
  const svg = $('#panoramic-world-stage').closest('svg'), rect = svg.getBoundingClientRect();
  function points(selector) {
    const e = $(selector), m = e.getScreenCTM(), length = e.getTotalLength();
    return Array.from({ length: 3001 }, (_, i) => {
      const p = e.getPointAtLength(length * i / 3000);
      return new DOMPoint(p.x, p.y).matrixTransform(m);
    });
  }
  const wheat = points('#organic-rolling-wheat-fields > path:first-child');
  const grass = points('#master-axonometric-ground-plane > path:nth-of-type(2)');
  function edges(points, x) {
    const ys = [];
    for (let i = 1; i < points.length; i++) {
      const a = points[i-1], b = points[i];
      if ((a.x <= x && b.x > x) || (b.x <= x && a.x > x)) ys.push(a.y + (b.y-a.y)*(x-a.x)/(b.x-a.x));
    }
    return { top: Math.min(...ys), bottom: Math.max(...ys) };
  }
  const host = $('[data-f2-hills]'), canvas = host.querySelector('canvas'), gl = canvas.getContext('webgl2');
  const samples = [];
  for (let i=0; i<31; i++) {
    const x = rect.left + rect.width*(i+.5)/31, crop = edges(wheat,x), lawn = edges(grass,x);
    const y = crop.top-rect.top-2;
    let alpha = null;
    if (y >= 0 && y < rect.height) {
      const pixel = new Uint8Array(4);
      gl.readPixels(Math.floor((x-rect.left)*canvas.width/rect.width), canvas.height-1-Math.floor(y*canvas.height/rect.height),1,1,gl.RGBA,gl.UNSIGNED_BYTE,pixel);
      alpha = pixel[3];
    }
    samples.push({ x, gap: lawn.top-crop.bottom, alpha });
  }
  const clearances = [...$('#perspective-hay-bales').children].map((b,index) => {
    const box = b.getBBox(), p = new DOMPoint(box.x+box.width/2,box.y+box.height).matrixTransform(b.getScreenCTM());
    return {index, x:p.x, bottom:p.y, clearance:edges(grass,p.x).top-p.y, visible:p.x>=0 && p.x<=rect.width && p.y>=0 && p.y<=rect.height};
  });
  const wheel = new DOMPoint(22,48.5).matrixTransform($('#tractor-in-field').getScreenCTM());
  return { samples, clearances, tractor:edges(grass,wheel.x).top-wheel.y };
}
function pixels(a,b,bands) {
  a=PNG.sync.read(a);b=PNG.sync.read(b);
  let changed=0,outside=0, foreground=0;
  for(let y=0;y<a.height;y++)for(let x=0;x<a.width;x++){
    const i=(y*a.width+x)*4,d=Math.max(...[0,1,2].map(k=>Math.abs(a.data[i+k]-b.data[i+k])));
    if(d>2){changed++;if(!bands.some(([lo,hi])=>y>=lo&&y<=hi))outside++;if(y>=500)foreground++;}
  }
  return {changed,outsideBands:outside,foreground};
}
const cases = [
  {id:'overview',label:'世界总览 · 1600×900',width:1600,height:900},
  {id:'desktop1200',label:'世界总览 · 1200×800',width:1200,height:800},
  {id:'mobile',label:'窄屏总览 · 390×844',width:390,height:844},
  {id:'living',label:'公共起居角聚焦',width:1600,height:900,room:'living_nook'},
  {id:'dusk',label:'黄昏总览',width:1600,height:900,theme:'dusk'},
  {id:'night',label:'深夜总览',width:1600,height:900,theme:'night'},
  {id:'rainy',label:'静雨总览',width:1600,height:900,theme:'rainy'}
];
for (const c of cases) {
  const page = await browser.newPage({viewport:{width:c.width,height:c.height},deviceScaleFactor:1});
  page.on('pageerror',e=>report.pageErrors.push(e.message));
  const entry={...c,views:{}};
  const modes = c.id==='overview' ? ['original','rear','front','both'] : ['original','both'];
  for (const mode of modes) {
    let url=base+'/tests/fixtures/world.html?'+query(mode)+'&theme='+(c.theme||'afternoon');
    if(c.room)url+='&focusRoom='+c.room;
    await ready(page,url);
    const data=await page.evaluate(sceneData),terrain=await page.evaluate(terrainSample);
    const image=c.id+'-'+mode+'.png';
    await page.screenshot({path:out+'/'+image});
    if(c.id==='overview'){
      await page.screenshot({path:out+'/rear-'+mode+'.png',clip:{x:360,y:308,width:1000,height:70}});
      await page.screenshot({path:out+'/front-'+mode+'.png',clip:{x:0,y:402,width:500,height:70}});
    }
    entry.views[mode]={image,stats:data.stats,protectedHashes:data.protected.map(hash),matrices:data.matrices,
      bands:data.bands,clearances:terrain.clearances,tractorClearance:terrain.tractor};
    check(c.id+' '+mode+' requested mode',data.mode===mode);
    check(c.id+' '+mode+' one continuous field / 17 original bales',data.bales===17&&await page.locator('#organic-rolling-wheat-fields > path').count()===2);
    check(c.id+' '+mode+' original F2-B GPU rendering',data.stats.mode==='B'&&data.stats.drawCalls===3&&data.stats.programs===2);
    check(c.id+' '+mode+' both seams covered',terrain.samples.every(s=>s.gap<-1&&(s.alpha===null||s.alpha===255)),terrain.samples.filter(s=>s.gap>=-1||(s.alpha!==null&&s.alpha!==255)));
    check(c.id+' '+mode+' fringe only for front mode',data.fringe===(['front','both'].includes(mode)?1:0));
    if(mode==='original')entry.originalTramlines=data.tramlines;
    else{
      check(c.id+' '+mode+' protected assets unchanged',JSON.stringify(entry.views.original.protectedHashes)===JSON.stringify(entry.views[mode].protectedHashes));
      check(c.id+' '+mode+' camera unchanged',JSON.stringify(entry.views.original.matrices)===JSON.stringify(data.matrices));
      check(c.id+' '+mode+' original tramline directions',data.tramlines.every((l,i)=>{
        const a=entry.originalTramlines[i],cross=(l[2]-l[0])*(a[3]-a[1])-(l[3]-l[1])*(a[2]-a[0]);
        return Math.abs(cross)<.00001&&l[2]===a[2]&&l[3]===a[3];
      }));
      const before=entry.views.original.clearances;
      const newOcclusion=terrain.clearances.filter((b,i)=>b.visible&&before[i].clearance>1&&b.clearance<=1);
      check(c.id+' '+mode+' no newly hidden visible bale',newOcclusion.length===0,newOcclusion);
      const bands=[...Object.values(data.bands),...Object.values(entry.views.original.bands)];
      const diff=pixels(await fs.readFile(out+'/'+c.id+'-original.png'),await fs.readFile(out+'/'+image),bands);
      entry.views[mode].pixelDifference=diff;
      check(c.id+' '+mode+' colour changes confined to contact bands',diff.outsideBands===0,diff);
    }
  }
  if(c.id==='overview'){
    check('Overview tractor and near bales remain fully exposed',entry.views.both.tractorClearance>5&&entry.views.both.clearances.filter(b=>[13,14,15,16].includes(b.index)&&b.visible).every(b=>b.clearance>5));
    const prev=await fs.readFile('docs/visual-system/f2-trees/overview-ab.png');
    const current=await fs.readFile(out+'/overview-original.png');
    const diff=pixels(prev,current,[]);
    check('Existing A+B default retains prior delivered pixels',diff.changed===0,diff);
  }
  report.scenarios.push(entry);await page.close();console.log('Captured',c.id);
}
// Explicit Legacy ignores the trial query.
{
 const page=await browser.newPage({viewport:{width:1600,height:900}});
 const hashes=[];
 for(const suffix of ['', '&fieldEdges=both']){
  await page.goto(historicalSceneUrl(base+'/tests/fixtures/world.html?hills=legacy'+suffix));
  await page.locator('#panoramic-world-stage').waitFor();await page.waitForTimeout(450);
  check('Legacy ignores trial '+suffix,await page.locator('[data-field-edges=original]').count()===1&&await page.locator('[data-field-contact-fringe]').count()===0);
  hashes.push(await page.locator('#panoramic-world-stage').evaluate(e=>e.outerHTML));
 }
 check('Legacy trial query makes no asset change',hash(hashes[0])===hash(hashes[1]));
 await page.close();
}
// Corner domain: real geometry and GPU alpha, not only parameter assertions.
for(const viewport of [{width:1600,height:900},{width:1200,height:800},{width:390,height:844}]){
 const page=await browser.newPage({viewport,deviceScaleFactor:1});await ready(page,base+'/tests/fixtures/world.html?'+query('both'));
 for(const zoom of [.45,.66,1.6,2.5]){
  await page.locator('#panoramic-world-stage').evaluate((e,z)=>e.closest('svg').dispatchEvent(new WheelEvent('wheel',{deltaY:(Number(e.dataset.zoom)-z)/.0012,bubbles:true,cancelable:true})),zoom);
  for(const [dx,dy] of [[-1,-1],[1,-1],[1,1],[-1,1]]){
   await page.mouse.move(50,65);await page.mouse.down();await page.mouse.move(50+dx*12,65+dy*12);await page.mouse.move(50+dx*5000,65+dy*5000);await page.mouse.up();
   await page.waitForTimeout(90);
   await page.waitForFunction(()=>{
    const host=document.querySelector('[data-f2-hills]');if(!host?.dataset.stats)return false;
    const s=JSON.parse(host.dataset.stats).sampledCamera,m=new DOMMatrixReadOnly(getComputedStyle(document.querySelector('#panoramic-world-stage')).transform);
    return Math.abs(s.x-m.e)<.00001&&Math.abs(s.y-m.f)<.00001&&Math.abs(s.zoom-m.a)<.00001;
   });
   const terrain=await page.evaluate(terrainSample);
   const failures=terrain.samples.filter(s=>s.gap>=-1||(s.alpha!==null&&s.alpha!==255));
   report.coverage.push({viewport,zoom,corner:[dx,dy],failures,maxGap:Math.max(...terrain.samples.map(s=>s.gap))});
   if(failures.length)await page.screenshot({path:out+'/failure-'+viewport.width+'-'+zoom+'-'+dx+'-'+dy+'.png'});
  }
 }
 await page.close();console.log('Coverage',viewport.width);
}
check('48 pan/zoom states have both seams covered',report.coverage.length===48&&report.coverage.every(s=>s.failures.length===0),report.coverage.filter(s=>s.failures.length));
check('No page errors',report.pageErrors.length===0,report.pageErrors);
report.passed=report.checks.every(c=>c.passed);
await fs.writeFile(out+'/verification.json',JSON.stringify(report,null,2));
await browser.close();
console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,failures:report.checks.filter(c=>!c.passed)},null,2));
process.exitCode=report.passed?0:1;
