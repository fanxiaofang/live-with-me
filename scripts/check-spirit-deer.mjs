import {chromium} from '@playwright/test';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';

// Local release check. Artifacts stay in ignored build/, never in the bundle.
const record=process.argv.includes('--record');
const origin=process.env.DEER_CHECK_URL??'http://localhost:3000';
const out='build/deer-closeout',baseline=`${out}/baseline.json`;
await mkdir(out,{recursive:true});
const browser=await chromium.launch({channel:'msedge',headless:true});
const errors=[];
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',m=>{if(m.text().includes('Spirit deer')||m.text().includes('THREE.WebGLProgram'))errors.push(m.text());});
 await page.routeWebSocket(/localhost/,socket=>{const server=socket.connectToServer();server.onMessage(message=>{if(typeof message==='string'){try{if(['update','full-reload'].includes(JSON.parse(message).type))return;}catch{}}socket.send(message);});});
 await page.route('**/__deer_check__',r=>r.fulfill({contentType:'text/html',body:'<body style="margin:0;background:#1b2925"></body>'}));
 await page.goto(`${origin}/__deer_check__`);
 const frames=await page.evaluate(async()=>{
  const {createSpiritDeerRenderer}=await import('/src/components/scenery/yorkshire/dressing/spiritDeerMeshRenderer.ts');
  const canvas=document.createElement('canvas');document.body.append(canvas);
  const renderer=createSpiritDeerRenderer(canvas,{});
  const patrol=renderer.createPatrol(),frames=[];
  for(const time of [0,1.5,9,24,39,40.5,42.8,44.5,45.8,47.5,52,68,71.8,73.5,74.8,76.5,80]){
   renderer.draw(time,2,patrol.sample(time),1,2);
   frames.push({time,png:canvas.toDataURL()});
  }
  renderer.dispose();return frames;
 });
 const hashes=frames.map(({time,png})=>({time,sha256:createHash('sha256').update(png).digest('hex')}));
 for(const {time,png} of frames)await writeFile(`${out}/${record?'before':'after'}-${time}.png`,Buffer.from(png.split(',')[1],'base64'));
 if(record)await writeFile(baseline,JSON.stringify(hashes,null,2));
 else if(JSON.stringify(hashes)!==JSON.stringify(JSON.parse(await readFile(baseline,'utf8'))))throw new Error('Default renderer differs from the pre-cleanup baseline');
 await page.goto(`${origin}/?wearTime=night`,{waitUntil:'domcontentloaded'});
 const actor=page.locator('[data-deer-apparition][data-spirit-renderer="webgl"]');await actor.waitFor({state:'attached',timeout:60000});
 const storage=await page.evaluate(()=>localStorage.getItem('live_with_me_yard_layout_v1'));
 const state=await actor.evaluate(el=>({model:el.dataset.deerModel,palette:el.dataset.deerPalette,aura:el.dataset.deerAura,timing:el.dataset.deerAuraTiming,patrol:el.dataset.deerPatrol,canvases:el.querySelectorAll('canvas').length}));
 if(state.model!=='original'||state.palette!=='moon'||state.aura!=='woodland'||state.timing!=='transitions'||state.patrol!=='watch'||state.canvases!==1)throw new Error(JSON.stringify(state));
 await page.screenshot({path:`${out}/${record?'before':'after'}-scene.png`});
 await page.evaluate(()=>{const actor=document.querySelector('[data-deer-apparition]'),stage=document.querySelector('#panoramic-world-stage'),b=actor.getBoundingClientRect(),parent=stage.parentElement.getScreenCTM(),m=stage.getScreenCTM();stage.style.transition='none';stage.style.transformOrigin='0 0';stage.style.transform=DOMMatrix.fromMatrix(parent).inverse().multiply(new DOMMatrix().translate(720,510).scale(620/b.height).translate(-b.x-b.width/2,-b.y-b.height/2).multiply(m)).toString();});
 await actor.screenshot({path:`${out}/${record?'before':'after'}-detail.png`});
 if(await page.evaluate(()=>localStorage.getItem('live_with_me_yard_layout_v1'))!==storage)throw new Error('Rendering changed saved layout');
 if(errors.length)throw new Error(errors.join('\n'));
 const report={mode:record?'record':'verify',frames:hashes.length,state,storageUnchanged:true,errors};
 await writeFile(`${out}/${record?'before':'after'}-report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close();}
