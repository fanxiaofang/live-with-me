import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';

const output='docs/architecture/metrics/MEADOW-SCENE-TRIAL-2026-10-19/round-9';
await mkdir(output,{recursive:true});
const browser=await chromium.launch();
try {
  const context=await browser.newContext({viewport:{width:1200,height:800},deviceScaleFactor:1,locale:'zh-CN',timezoneId:'Asia/Shanghai'});
  await context.addInitScript(()=>{let seed=731;Math.random=()=>((seed=(seed*16807)%2147483647)-1)/2147483646});
  const page=await context.newPage(),errors=[],results=[];
  page.on('pageerror',e=>errors.push(e.message));
  async function freeze(){
    await page.locator('#panoramic-world-stage').waitFor();
    await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});
    await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('svg').forEach(s=>{s.pauseAnimations();s.setCurrentTime(0)});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});
  }
  async function protectedAssets(){return page.evaluate(()=>{
    const selectors=['#meadow-surface-trial','#meadow-vegetation-trial','#meadow-root-contacts-v8','#meadow-use-wear-v8',
      '#storybook-wooden-beehive','#cottage-ground-planting','#foundation-greenery','#cottage-pumpkin-patch',
      '#living-cottage-haven','#wooden-cabin-cluster','#capsule-pod-cluster'];
    return selectors.map(selector=>{const copy=document.querySelector(selector).cloneNode(true);copy.querySelector('#cottage-verge-v9')?.remove();return {selector,html:copy.outerHTML}});
  })}
  for(const theme of ['afternoon','night','rainy'])for(const focus of ['overview','cabin',...(theme==='afternoon'?['porch']:[])]){
    const suffix=focus==='cabin'?'&focusRoom=corn_lounge':focus==='porch'?'&focusRoom=porch_mailbox':'';
    await page.goto(`http://127.0.0.1:3000/tests/fixtures/world.html?vegetationTrial=8&theme=${theme}${suffix}`);await freeze();
    const prior=await protectedAssets();
    await page.goto(`http://127.0.0.1:3000/tests/fixtures/world.html?vegetationTrial=9&theme=${theme}${suffix}`);await freeze();
    assert.deepEqual(await protectedAssets(),prior,'Round 8 meadow, shrubs, hive hardware and architecture preserved');
    await expect(page.locator('#beehive-planting-v9 [data-mixed-colony]')).toHaveCount(2);
    await expect(page.locator('#beehive-planting-v9 [data-hive-short-site]')).toHaveCount(2);
    await expect(page.locator('#beehive-planting-v9 [data-clump]')).toHaveCount(5);
    await expect(page.locator('#beehive-planting-v9 [data-species]')).toHaveCount(4);
    await expect(page.locator('#cottage-verge-v9 [data-clump]')).toHaveCount(4);
    await expect(page.locator('#meadow-vegetation-trial [data-clump]')).toHaveCount(36);
    for(const id of ['beehive-meadow-grass','beehive-meadow-wildflowers','beehive-lavender-flowers','gravel-verge-grass'])await expect(page.locator(`#${id}`)).toBeHidden();
    for(const id of ['cottage-ground-planting','cottage-corner-greenery-bush','cottage-corner-hydrangea','step-verge-accents','sparse-foundation-verge-grass'])await expect(page.locator(`#${id}`)).toBeVisible();
    await expect(page.locator('#beehive-planting-v9 path').first()).toHaveCSS('pointer-events','none');
    await expect(page.locator('#cottage-verge-v9 path').first()).toHaveCSS('pointer-events','none');
    await expect(page.locator('#beehive-planting-v9 :is(filter,pattern,animate),#cottage-verge-v9 :is(filter,pattern,animate)')).toHaveCount(0);
    const collisions=await page.evaluate(()=>{
      const stage=document.getElementById('panoramic-world-stage').getScreenCTM().inverse();
      const hive=document.getElementById('west-cottage-grounds').getScreenCTM().inverse(),hits=[];
      function bounds(el,inverse){const r=el.getBoundingClientRect(),a=new DOMPoint(r.left,r.top).matrixTransform(inverse),b=new DOMPoint(r.right,r.bottom).matrixTransform(inverse);return {x:a.x,y:a.y,r:b.x,b:b.y}}
      function overlaps(a,b){return a.x<b.r&&a.r>b.x&&a.y<b.b&&a.b>b.y}
      for(const el of document.querySelectorAll('#beehive-planting-v9 [data-clump],#beehive-planting-v9 [data-species]')){
        const box=bounds(el,hive);
        if(overlaps(box,{x:22,y:-10,r:52,b:25}))hits.push({where:'hive',plant:el.outerHTML.slice(0,100)});
        if(overlaps(box,{x:54,y:10,r:73,b:35}))hits.push({where:'flight/access gap',plant:el.outerHTML.slice(0,100)});
      }
      for(const el of document.querySelectorAll('#cottage-verge-v9 [data-clump]'))if(overlaps(bounds(el,stage),{x:500,y:440,r:590,b:580}))hits.push({where:'central entrance'});
      return hits;
    });assert.deepEqual(collisions,[],'Plants stay clear of hive body, access gap and main entrance');
    const camera=await page.locator('#panoramic-world-stage').getAttribute('style');
    await page.screenshot({path:`${output}/${theme}-${focus}-trial.png`});
    await page.evaluate(()=>{for(const id of ['beehive-planting-v9','cottage-verge-v9']){const e=document.getElementById(id);e.dataset.active='false';e.style.display='none'}});
    for(const id of ['beehive-meadow-grass','beehive-meadow-wildflowers','beehive-lavender-flowers','gravel-verge-grass'])await expect(page.locator(`#${id}`)).toBeVisible();
    await page.screenshot({path:`${output}/${theme}-${focus}-before.png`});
    assert.equal(await page.locator('#panoramic-world-stage').getAttribute('style'),camera);
    results.push({theme,focus,protectedAssetDOMIdentical:true,mixedColonies:2,hiveShortSites:2,flowerPlants:4,vergeReplacements:4,collisions,camera});
  }
  await page.goto('http://127.0.0.1:3000/tests/fixtures/world.html?vegetationTrial=9&entity=wooden_cabin&x=250&scale=1.15');
  await expect(page.locator('#west-cottage-grounds')).toHaveAttribute('transform','translate(250, 300) scale(1.15) translate(-175, -45)');
  await page.goto('http://127.0.0.1:3000/tests/fixtures/world.html?vegetationTrial=9&entity=main_cottage&x=660&scale=1.15');
  assert.equal(await page.locator('#cottage-verge-v9').evaluate(el=>el.closest('#living-cottage-haven')?.getAttribute('transform')),'translate(660, 210) scale(1.15)');
  await page.getByRole('button',{name:'暖炉起居角',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('#panoramic-world-stage')).toHaveAttribute('data-room','living_nook');
  await page.goto('http://127.0.0.1:3000/');await page.locator('#panoramic-world-stage').waitFor();await expect(page.locator('#beehive-planting-v9,#cottage-verge-v9')).toHaveCount(0);
  await expect(page.locator('#beehive-lavender-flowers')).toBeHidden();
  await expect(page.locator('#beehive-meadow-planting')).toBeVisible();
  await page.goto(`http://127.0.0.1:3000/${output}/index.html`);
  const scene=page.frameLocator('#scene');await expect(scene.locator('#beehive-planting-v9')).toBeVisible();
  const camera=await scene.locator('#panoramic-world-stage').getAttribute('style');
  await page.getByRole('button',{name:'查看第八轮',exact:true}).click();
  await expect(scene.locator('#beehive-lavender-flowers')).toBeVisible();await expect(scene.locator('#gravel-verge-grass')).toBeVisible();
  assert.equal(await scene.locator('#panoramic-world-stage').getAttribute('style'),camera);
  await page.locator('#theme').selectOption('night');await expect(scene.locator('#meadow-surface-trial')).toHaveAttribute('data-light','night');await expect(scene.locator('#beehive-planting-v9')).toBeHidden();
  await page.getByRole('button',{name:'查看花草重组',exact:true}).click();
  await page.getByLabel('蜂箱混生花草',{exact:true}).uncheck();await expect(scene.locator('#beehive-lavender-flowers')).toBeVisible();await expect(scene.locator('#cottage-verge-v9')).toBeVisible();
  await page.getByLabel('蜂箱混生花草',{exact:true}).check();await page.getByLabel('四处石缝短草',{exact:true}).uncheck();await expect(scene.locator('#gravel-verge-grass')).toBeVisible();await expect(scene.locator('#beehive-lavender-flowers')).toBeHidden();
  await page.getByLabel('四处石缝短草',{exact:true}).check();await page.locator('#theme').selectOption('afternoon');await expect(scene.locator('#meadow-surface-trial')).toHaveAttribute('data-light','day');
  await page.screenshot({path:`${output}/review-page.png`,fullPage:true});
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.screenshot({path:`${output}/mobile-review.png`,fullPage:true});
  assert.deepEqual(errors,[]);
  await writeFile(`${output}/verification.json`,JSON.stringify({errors,results,checks:['native hive and house anchor inheritance','same-camera round 8 restoration','independent flower and verge toggles','weather preserves comparison state','house keyboard interaction','default production uses accepted planting; historical fixture stays isolated','390px review without horizontal overflow'],scope:'Targeted DOM, interaction and screenshot inspection. No exact PNG regression claim.'},null,2));
  console.log(JSON.stringify({errors,views:results.length,mixedColonies:2,hiveShortSites:2,flowerPlants:4,vergeReplacements:4}));
} finally {await browser.close()}
