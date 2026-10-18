import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const out = 'test-results/shadow-audit';
await fs.mkdir(out, {recursive:true});
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1440,height:1000}, deviceScaleFactor:1, reducedMotion:'reduce'});
await page.goto('http://127.0.0.1:3011/');
await page.locator('#panoramic-world-stage').waitFor();
await page.addStyleTag({content:'*,*::before,*::after {animation:none!important;transition:none!important}'});
await page.evaluate(()=>{document.querySelectorAll('svg').forEach(s=>{s.pauseAnimations();s.setCurrentTime(0);});});
await page.screenshot({path:`${out}/overview.png`});
const filters = await page.evaluate(()=>{
  const nodes = [...document.querySelectorAll('[filter="url(#softShadow)"]')];
  return nodes.map(n=>{const b=n.getBBox();const m=n.getScreenCTM();const r=n.getBoundingClientRect();return {tag:n.tagName,inDefs:!!n.closest('defs'),ancestor:n.closest('[id]')?.id,parent:n.parentElement?.id,bbox:{x:b.x,y:b.y,w:b.width,h:b.height},screen:{x:r.x,y:r.y,w:r.width,h:r.height},scale:m?Math.hypot(m.a,m.b):0,opacity:n.getAttribute('opacity'),fill:n.getAttribute('fill')};});
});
await fs.writeFile(`${out}/inventory.json`,JSON.stringify(filters,null,2));
console.log(JSON.stringify({softShadowInstances:filters.length, tinyBounds:filters.filter(f=>f.bbox.h<10).length}));
await page.getByTitle('收起面板（查看完整约克郡风光）',{exact:true}).click();
for(const [id,label] of [['attic','我的阁楼房间'],['living','公共起居角'],['study','林木的书房'],['pod','旧胶囊仓']]) {
  await page.getByRole('button',{name:label,exact:true}).click();
  await page.mouse.move(4,500);
  await page.screenshot({path:`${out}/${id}-afternoon.png`});
}
await page.getByRole('button',{name:'公共起居角',exact:true}).click();
for(const [id,label] of [['night','深夜'],['rainy','静雨']]) {
 await page.getByRole('button',{name:label,exact:true}).click();
 await page.screenshot({path:`${out}/living-${id}.png`});
}
await page.getByRole('button',{name:'午后',exact:true}).click();
await page.setViewportSize({width:390,height:844});
await page.screenshot({path:`${out}/living-mobile.png`});
await page.setViewportSize({width:1440,height:1000});
await page.locator('#top-mailbox-btn').click();
await page.locator('#mailbox-modal-container').waitFor();
await page.screenshot({path:`${out}/mailbox.png`});
const ui=await page.evaluate(()=>[...document.querySelectorAll('body *')].filter(e=>e instanceof HTMLElement && e.getBoundingClientRect().width && getComputedStyle(e).boxShadow!=='none').map(e=>({tag:e.tagName,classes:e.className,shadow:getComputedStyle(e).boxShadow,backdrop:getComputedStyle(e).backdropFilter,border:getComputedStyle(e).borderTop})));
await fs.writeFile(`${out}/ui-shadows.json`,JSON.stringify(ui,null,2));
await browser.close();
