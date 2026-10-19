import { chromium } from 'playwright';
import fs from 'node:fs/promises';
const phase=process.argv[2];
if(!['before','after'].includes(phase))throw new Error('Expected before or after');
const out='test-results/ui-shadow-quieter';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
try {
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:3011/');await page.locator('#panoramic-world-stage').waitFor();
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
 await page.evaluate(()=>document.querySelectorAll('svg').forEach(s=>{s.pauseAnimations();s.setCurrentTime(0);}));
 const controls={
  nav:'nav[aria-label="房间视角"] > div',
  presence:'aside[aria-label="同住人状态"] > div',
  editorToggle:'button[title="打开 2.5D 轴测室内全屋校准器"]',
  zoom:'button[title="放大画面"]',
 };
 const read=async(selector,parent=false)=>page.locator(selector).evaluate((el,parent)=>{
  const n=parent?el.parentElement:el;const s=getComputedStyle(n),b=n.getBoundingClientRect();
  return {shadow:s.boxShadow,border:s.borderTop,background:s.backgroundColor,backdrop:s.backdropFilter,text:n.textContent,bounds:{x:b.x,y:b.y,w:b.width,h:b.height}};
 },parent);
 const records={};for(const [key,sel] of Object.entries(controls))records[key]=await read(sel,key==='zoom');
 const region=async(selector,name,pad=48)=>{const b=await page.locator(selector).boundingBox();const x=Math.max(0,b.x-pad),y=Math.max(0,b.y-pad);await page.screenshot({path:`${out}/${phase}-${name}.png`,clip:{x,y,width:Math.min(1440,x+b.width+pad*2)-x,height:Math.min(1000,y+b.height+pad*2)-y}});};
 await page.screenshot({path:`${out}/${phase}-overview.png`});
 await region(controls.nav,'navigation');await region('aside[aria-label="同住人状态"]','presence');
 await page.getByTitle('收起面板（查看完整约克郡风光）',{exact:true}).click();
 records.presenceCollapsed=await read('button[title="展开同住人面板"]');
 await page.getByRole('button',{name:'我的阁楼房间',exact:true}).click();
 if(await page.locator('#panoramic-world-stage').getAttribute('data-room')!=='my_room')throw new Error('Room navigation failed');
 await page.getByRole('button',{name:'整栋小屋',exact:true}).click();
 await page.getByRole('button',{name:'全屋 2.5D 布局校准器',exact:true}).click();
 records.editorPanel=await read('aside[aria-label="2.5D 室内全屋布局校准面板"]');
 await region('aside[aria-label="2.5D 室内全屋布局校准面板"]','editor');
 await page.getByRole('complementary',{name:'2.5D 室内全屋布局校准面板'}).getByRole('button',{name:'关闭',exact:true}).click();
 await page.locator('#ambient-sound-btn').click();await page.getByTitle('调节各轨道音量',{exact:true}).click();
 const mixer=page.getByText('治愈白噪音混音台',{exact:true});await mixer.waitFor();
 records.mixer=await mixer.evaluate(n=>{const p=n.parentElement,s=getComputedStyle(p);return{shadow:s.boxShadow,border:s.borderTop,background:s.backgroundColor};});
 await page.locator('#ambient-sound-btn').click();
 await page.locator('#top-mailbox-btn').focus();await page.locator('#top-mailbox-btn').press('Enter');
 await page.locator('#mailbox-modal-container').waitFor();
 records.modal=await read('#mailbox-modal-container');
 records.unread=await page.locator('#mailbox-modal-container div.cursor-pointer').evaluateAll(ns=>ns.map(n=>{const s=getComputedStyle(n);return{shadow:s.boxShadow,border:s.borderTop,background:s.backgroundColor,text:n.textContent};}));
 await page.screenshot({path:`${out}/${phase}-mailbox.png`});
 await page.locator('#mailbox-modal-container').screenshot({path:`${out}/${phase}-mailbox-detail.png`});
 await page.locator('#mailbox-modal-container div.cursor-pointer').first().click();
 if(await page.getByText('未启封',{exact:true}).count()!==1)throw new Error('Opening letter did not update unread state');
 await page.locator('#mailbox-tab-compose').click();
 await page.locator('#compose-letter-textarea').fill('浮层阴影核对草稿');
 await page.getByRole('button',{name:'关闭信箱',exact:true}).click();
 await page.locator('#top-mailbox-btn').click();
 if(await page.locator('#compose-letter-textarea').inputValue()!=='浮层阴影核对草稿')throw new Error('Draft was not preserved');
 await page.getByRole('button',{name:'关闭信箱',exact:true}).click();
 await page.setViewportSize({width:390,height:844});
 await page.screenshot({path:`${out}/${phase}-mobile.png`});
 await page.locator('#top-mailbox-btn').click();await page.locator('#mailbox-tab-inbox').click();
 await page.screenshot({path:`${out}/${phase}-mobile-mailbox.png`});
 const close=await page.getByRole('button',{name:'关闭信箱',exact:true}).boundingBox();
 if(!close||close.x<0||close.y<0||close.x+close.width>390||close.y+close.height>844)throw new Error('Mobile close control offscreen');
 await page.getByRole('button',{name:'关闭信箱',exact:true}).click();
 if(phase==='after'){
  const before=JSON.parse(await fs.readFile(`${out}/before.json`,'utf8')).records;
  for(const key of ['nav','presence','editorToggle','zoom','presenceCollapsed','editorPanel','mixer','modal']){
   const a={...before[key]},b={...records[key]};delete a.shadow;delete b.shadow;
   if(JSON.stringify(a)!==JSON.stringify(b))throw new Error(`Unintended geometry/material/content change: ${key}`);
  }
  if(before.modal.shadow!==records.modal.shadow)throw new Error('Modal shadow changed');
  if(records.unread.some(n=>n.shadow!=='none'))throw new Error('Unread letter still has decorative shadow/ring');
  for(let i=0;i<records.unread.length;i++)for(const key of ['border','background','text'])if(before.unread[i][key]!==records.unread[i][key])throw new Error(`Unread status cue changed: ${key}`);
 }
 if(errors.length)throw new Error(errors.join('\n'));
 await fs.writeFile(`${out}/${phase}.json`,JSON.stringify({records,errors,checks:{navigation:true,editor:true,mixer:true,readLetter:true,draftPreserved:true,mobileClose:true}},null,2));
 console.log(JSON.stringify({phase,errors,unreadLetters:records.unread.length}));
}finally{await browser.close();}
