import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const phase=process.argv[2];
if(!['before','after'].includes(phase))throw new Error('Expected before or after');
const out='test-results/observatory-shadow-quieter';
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3011/');
 await page.locator('#panoramic-world-stage').waitFor();
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
 await page.evaluate(()=>document.querySelectorAll('svg').forEach(s=>{s.pauseAnimations();s.setCurrentTime(0);}));
 await page.getByTitle('收起面板（查看完整约克郡风光）',{exact:true}).click();
 await page.getByRole('button',{name:'山巅外星电波监听站',exact:true}).click();
 const clip=await page.locator('[data-entity="observatory"]').evaluate(n=>{
   const m=n.getScreenCTM();const a=new DOMPoint(-105,-100).matrixTransform(m);const b=new DOMPoint(105,92).matrixTransform(m);
   return {x:a.x,y:a.y,width:b.x-a.x,height:b.y-a.y};
 });
 await page.screenshot({path:`${out}/${phase}-detail.png`,clip});
 await page.screenshot({path:`${out}/${phase}-desktop.png`});
 const shots=[['night','深夜'],['rainy','静雨']];
 for(const [key,label] of shots){await page.getByRole('button',{name:label,exact:true}).click();await page.screenshot({path:`${out}/${phase}-${key}.png`});}
 await page.getByRole('button',{name:'午后',exact:true}).click();
 await page.getByRole('button',{name:'整栋小屋',exact:true}).click();
 await page.screenshot({path:`${out}/${phase}-overview.png`});
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'山巅外星电波监听站',exact:true}).click();
 await page.screenshot({path:`${out}/${phase}-mobile.png`});
 const structure=await page.evaluate(()=>({
   contactEllipses:document.querySelector('#observatory-ground-shadows')?.children.length,
   terrainAO:document.querySelector('[data-ground-shadow="observatory"]')?.outerHTML,
   observatory:document.querySelector('[data-entity="observatory"]')?.getAttribute('transform'),
   footings:document.querySelector('#observatory-stone-footings')?.outerHTML,
   contact:document.querySelector('#observatory-ground-shadows')?.outerHTML,
 }));
 await fs.writeFile(`${out}/${phase}-structure.json`,JSON.stringify({structure,errors},null,2));
 if(phase==='after'){
  const before=JSON.parse(await fs.readFile(`${out}/before-structure.json`,'utf8'));
  if(structure.contactEllipses!==4)throw new Error('Expected four contact shadows');
  for(const key of ['terrainAO','observatory','footings'])if(before.structure[key]!==structure[key])throw new Error(`Unexpected change: ${key}`);
  if(errors.length)throw new Error(errors.join('\n'));
  await page.setViewportSize({width:1440,height:1000});
  await page.locator('#alien-receiver-assembly').click();
  await page.getByText('DEEP SPACE SETI · 1420.405 MHz',{exact:true}).waitFor();
 }
 console.log(JSON.stringify({phase,contactEllipses:structure.contactEllipses,errors,interactionChecked:phase==='after'}));
}finally{await browser.close();}
