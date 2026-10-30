import { historicalSceneUrl } from './historicalScene.mjs';
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{PNG}=require(path.join(path.dirname(require.resolve('playwright-core/package.json')),'lib/utilsBundle.js'));
const base=process.env.F2_URL||'http://127.0.0.1:3014',out='docs/visual-system/meadow-depth';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const report={scenarios:[],checks:[],errors:[]};
const hash=s=>crypto.createHash('sha256').update(s).digest('hex');
const check=(name,passed,detail)=>{report.checks.push({name,passed,detail});if(!passed)console.error('FAIL',name,detail)};
const query=mode=>'hills=f2&hillsTransition=foothill&hillsTrees=sparse&fieldEdges=both&meadowStudy='+mode;
async function ready(page,url,freeze=true){
 await page.goto(historicalSceneUrl(url));await page.locator('[data-hills-mode=f2]').waitFor();
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;'+(freeze?'transition:none!important':'')+'}'});
 await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('svg').forEach(s=>{s.pauseAnimations();s.setCurrentTime(0)})});await page.waitForTimeout(650);
}
function data(){
 const $=s=>document.querySelector(s),stage=$('#panoramic-world-stage').cloneNode(true);
 stage.querySelector('#yorkshire-terrain-mass').remove();
 stage.querySelector('#homestead-meadow-plants').remove();
 stage.querySelectorAll('[data-near-meadow-plants]').forEach(e=>e.remove());
 const near=$('[data-near-meadow-plants]'),scene=$('#panoramic-world-stage');
 const selectors=['#parallax-wheat-layer','#parallax-mountains-layer','#homestead-meadow-surface','#guardian-heritage-tree','#homestead-meadow-root-contacts','#homestead-meadow-wear'];
 return{
  mode:$('[data-meadow-study]').dataset.meadowStudy,
  protected:[stage.outerHTML,...selectors.map(s=>$(s).outerHTML),
   ...[...document.querySelectorAll('[data-ground-shadow]')].map(e=>e.outerHTML),
   ...[...document.querySelectorAll('[data-meadow-zone]:not([data-meadow-zone="tree-outside"])')].map(e=>e.outerHTML)],
  tree:[...document.querySelectorAll('[data-meadow-zone="tree-outside"]')].map(e=>e.outerHTML),
  matrices:['#panoramic-world-stage','#parallax-wheat-layer','#parallax-mountains-layer'].map(s=>getComputedStyle($(s)).transform),
  stats:JSON.parse($('[data-f2-hills]').dataset.stats),
  nodes:scene.closest('svg').querySelectorAll('*').length,
  near:near?{pointer:getComputedStyle(near).pointerEvents,roots:[...near.querySelectorAll('[data-near-clump]')].map(e=>{
   const p=e.dataset.worldRoot.split(',').map(Number),m=scene.getScreenCTM(),screen=new DOMPoint(...p).matrixTransform(m),b=e.getBoundingClientRect();
   return{id:e.dataset.nearClump,world:p,screen:{x:screen.x,y:screen.y},box:b.toJSON()};
  })}:null,
 };
}
function pixelDiff(a,b){
 a=PNG.sync.read(a);b=PNG.sync.read(b);let changed=0,max=0;
 for(let i=0;i<a.data.length;i+=4){const d=Math.max(...[0,1,2].map(k=>Math.abs(a.data[i+k]-b.data[i+k])));max=Math.max(max,d);if(d>1)changed++;}
 return{changed,max};
}
const cases=[
 {id:'overview',label:'世界总览 · 1600×900',width:1600,height:900},
 {id:'desktop1200',label:'世界总览 · 1200×800',width:1200,height:800},
 {id:'mobile',label:'窄屏总览 · 390×844',width:390,height:844},
 {id:'living',label:'公共起居角聚焦',width:1600,height:900,room:'living_nook'},
 {id:'dusk',label:'黄昏总览',width:1600,height:900,theme:'dusk'},
 {id:'night',label:'深夜总览',width:1600,height:900,theme:'night'},
 {id:'rainy',label:'静雨总览',width:1600,height:900,theme:'rainy'},
];
for(const c of cases){
 const page=await browser.newPage({viewport:{width:c.width,height:c.height},deviceScaleFactor:1});
 page.on('pageerror',e=>report.errors.push(e.message));
 const entry={...c,views:{}};
 for(const mode of ['original',...(!c.room&&!c.theme?['surface','foreground']:[]),'complete']){
  await ready(page,base+'/tests/fixtures/world.html?'+query(mode)+'&theme='+(c.theme||'afternoon')+(c.room?'&focusRoom='+c.room:''));
  const d=await page.evaluate(data),image=c.id+'-'+mode+'.png';await page.screenshot({path:out+'/'+image});
  if(c.id==='overview'){
   await page.screenshot({path:out+'/edge-'+mode+'.png',clip:{x:320,y:675,width:750,height:200}});
   await page.screenshot({path:out+'/near-'+mode+'.png',clip:{x:0,y:800,width:220,height:100}});
  }
  entry.views[mode]={image,stats:d.stats,protectedHashes:d.protected.map(hash),treeHash:hash(JSON.stringify(d.tree)),matrices:d.matrices,nodes:d.nodes,near:d.near};
  check(c.id+' '+mode+' requested study',d.mode===mode);
  check(c.id+' '+mode+' F2-B retained',d.stats.mode==='B'&&d.stats.drawCalls===3&&d.stats.programs===2);
  check(c.id+' '+mode+' two decorative clumps only in last two modes',d.near?['foreground','complete'].includes(mode)&&d.near.roots.length===2&&d.near.pointer==='none':!['foreground','complete'].includes(mode));
  if(d.near&&!c.room){
   check(c.id+' '+mode+' overview plants are cropped at real bottom edge',d.near.roots.every(p=>p.screen.y>c.height&&p.box.y<c.height&&p.box.bottom>c.height),d.near.roots);
   check(c.id+' '+mode+' centre remains clear',d.near.roots.every(p=>p.box.right<c.width*.28||p.box.x>c.width*.72));
  }
  if(mode!=='original'){
   check(c.id+' '+mode+' all protected scene assets unchanged',JSON.stringify(entry.views.original.protectedHashes)===JSON.stringify(entry.views[mode].protectedHashes));
   check(c.id+' '+mode+' camera unchanged',JSON.stringify(entry.views.original.matrices)===JSON.stringify(d.matrices));
   check(c.id+' '+mode+' tree plants change only in complete mode',(entry.views.original.treeHash===entry.views[mode].treeHash)===(mode!=='complete'));
  }
 }
 if(c.id==='overview'){
  const diff=pixelDiff(await fs.readFile('docs/visual-system/field-edges/overview-both.png'),await fs.readFile(out+'/overview-original.png'));
  check('Previous delivered scene retained with no study',diff.changed===0,diff);entry.baselineDifference=diff;
 }
 report.scenarios.push(entry);await page.close();console.log('Captured',c.id);
}
check('No page errors',report.errors.length===0,report.errors);
report.passed=report.checks.every(c=>c.passed);
await fs.writeFile(out+'/verification.json',JSON.stringify(report,null,2));await browser.close();
console.log(JSON.stringify({passed:report.passed,checks:report.checks.length,failures:report.checks.filter(c=>!c.passed)},null,2));process.exitCode=report.passed?0:1;
