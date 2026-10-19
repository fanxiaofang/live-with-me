import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const output='docs/architecture/metrics/MEADOW-SCENE-TRIAL-2026-10-19/integration';
await mkdir(output,{recursive:true});
const browser=await chromium.launch();
try{
  const context=await browser.newContext({viewport:{width:1200,height:800},deviceScaleFactor:1,locale:'zh-CN',timezoneId:'Asia/Shanghai'});
  await context.addInitScript(()=>{let seed=731;Math.random=()=>((seed=(seed*16807)%2147483647)-1)/2147483646});
  const page=await context.newPage(),errors=[],results=[];page.on('pageerror',error=>errors.push(error.message));
  async function freeze(){await page.locator('#panoramic-world-stage').waitFor();await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}'});await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('svg').forEach(s=>{s.pauseAnimations();s.setCurrentTime(0)});await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)))});}
  async function composition(current){return page.evaluate(current=>{
    const stage=document.getElementById('panoramic-world-stage'),inverse=stage.getScreenCTM().inverse();
    const roots=current?['homestead-meadow-plants','homestead-meadow-root-contacts','homestead-meadow-wear','beehive-meadow-planting','cottage-verge-meadow']
      :['meadow-vegetation-trial','meadow-root-contacts-v8','meadow-use-wear-v8','beehive-planting-v9','cottage-verge-v9'];
    const round=x=>Math.round(x*1e6)/1e6;
    const geometry=roots.map(id=>[...document.querySelectorAll(`#${id} path,#${id} ellipse`)].map(el=>{
      const matrix=inverse.multiply(el.getScreenCTM()),style=getComputedStyle(el);let opacity=1;
      for(let parent=el;parent&&parent!==stage;parent=parent.parentElement)opacity*=Number(getComputedStyle(parent).opacity);
      return {tag:el.tagName,d:el.getAttribute('d'),cx:el.getAttribute('cx'),cy:el.getAttribute('cy'),rx:el.getAttribute('rx'),ry:el.getAttribute('ry'),
        matrix:[matrix.a,matrix.b,matrix.c,matrix.d,matrix.e,matrix.f].map(round),fill:style.fill,stroke:style.stroke,opacity:round(opacity)};
    }));
    const surface=document.getElementById(current?'homestead-meadow-surface':'meadow-surface-trial');
    const gradients=[...surface.querySelectorAll('radialGradient')].map(el=>({attributes:[...el.attributes].filter(a=>a.name!=='id').map(a=>[a.name,a.value]),stops:el.innerHTML}));
    const buildings=['living-cottage-haven','wooden-cabin-cluster','capsule-pod-cluster','storybook-wooden-beehive','cottage-ground-planting','foundation-greenery','cottage-pumpkin-patch'].map(id=>{
      const copy=document.getElementById(id).cloneNode(true);copy.querySelector('#cottage-verge-v9,#cottage-verge-meadow')?.remove();return {id,html:copy.outerHTML};
    });
    return {geometry,gradients,washOpacity:surface.querySelector('#meadow-surface-color').getAttribute('opacity'),buildings};
  },current)}
  for(const theme of ['afternoon','night','rainy'])for(const focus of ['overview','porch','cabin']){
    const suffix=focus==='porch'?'&focusRoom=porch_mailbox':focus==='cabin'?'&focusRoom=corn_lounge':'';
    await page.goto(`http://127.0.0.1:3000/tests/fixtures/world.html?vegetationTrial=9&theme=${theme}${suffix}`);await freeze();
    const accepted=await composition(false),reference=await page.screenshot({path:`${output}/${theme}-${focus}-accepted.png`});
    await expect(page.locator('#homestead-meadow-plants')).toHaveCount(0);
    await page.goto(`http://127.0.0.1:3000/tests/fixtures/world.html?theme=${theme}${suffix}`);await freeze();
    const integrated=await composition(true),differences=[];let maximumMatrixDifference=0;
    function diff(a,b,path=''){
      if(Object.is(a,b))return;
      if(path.includes('.matrix.')&&typeof a==='number'&&typeof b==='number'){
        maximumMatrixDifference=Math.max(maximumMatrixDifference,Math.abs(a-b));
        if(Math.abs(a-b)<=.0001)return;
      }
      if(a&&b&&typeof a==='object'&&typeof b==='object'){
        for(const key of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[key],b[key],`${path}.${key}`);
      }else if(differences.length<12){
        if(typeof a==='string'&&typeof b==='string'&&(a.length>250||b.length>250)){
          let i=0;while(i<Math.min(a.length,b.length)&&a[i]===b[i])i++;
          differences.push({path,index:i,actual:a.slice(Math.max(0,i-45),i+110),expected:b.slice(Math.max(0,i-45),i+110)});
        }else differences.push({path,actual:a,expected:b});
      }
    }
    diff(integrated,accepted);
    if(differences.length)await writeFile(`${output}/comparison-mismatch.json`,JSON.stringify({theme,focus,differences},null,2));
    assert.deepEqual(differences,[],'Integrated composition must match accepted v9');
    await expect(page.locator('#homestead-meadow-plants [data-clump]')).toHaveCount(36);
    await expect(page.locator('#beehive-meadow-planting [data-mixed-colony]')).toHaveCount(2);
    await expect(page.locator('#cottage-verge-meadow [data-clump]')).toHaveCount(4);
    await expect(page.locator('#meadow-vegetation-trial,#meadow-surface-trial,#beehive-planting-v9')).toHaveCount(0);
    for(const id of ['beehive-meadow-grass','beehive-meadow-wildflowers','beehive-lavender-flowers','gravel-verge-grass','lawn-natural-grass-tufts','guardian-tree-root-flora'])await expect(page.locator(`#${id}`)).toBeHidden();
    await expect(page.locator('#homestead-meadow-plants path').first()).toHaveCSS('pointer-events','none');
    await expect(page.locator('#beehive-meadow-planting path').first()).toHaveCSS('pointer-events','none');
    const production=await page.screenshot({path:`${output}/${theme}-${focus}-production.png`});
    results.push({theme,focus,geometryAndPaintMatch:true,matrixTolerance:.0001,maximumMatrixDifference,architectureAndShrubsIdentical:true,clumps:36,pngIdentical:production.equals(reference)});
  }
  await page.goto('http://127.0.0.1:3000/tests/fixtures/world.html?entity=main_cottage&x=660&scale=1.15');
  for(const el of await page.locator('#homestead-meadow-plants [data-meadow-anchor="main_cottage"]').all())await expect(el).toHaveAttribute('transform','translate(660 210) scale(1.15)');
  assert.equal(await page.locator('#cottage-verge-meadow').evaluate(el=>el.closest('#living-cottage-haven')?.getAttribute('transform')),'translate(660, 210) scale(1.15)');
  await page.goto('http://127.0.0.1:3000/tests/fixtures/world.html?entity=wooden_cabin&x=250&scale=1.15');
  await expect(page.locator('#beehive-meadow-planting')).toBeVisible();
  await expect(page.locator('#west-cottage-grounds')).toHaveAttribute('transform','translate(250, 300) scale(1.15) translate(-175, -45)');
  await page.locator('#guardian-tree-trunk').click();await expect(page.locator('#guardian-tree-canopy')).toHaveAttribute('class',/scale-\[1\.03\]/);
  await page.getByRole('button',{name:'暖炉起居角',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.locator('#panoramic-world-stage')).toHaveAttribute('data-room','living_nook');
  await page.goto('http://127.0.0.1:3000/');await freeze();
  await expect(page.locator('#homestead-meadow-plants')).toBeVisible();await expect(page.locator('#beehive-meadow-planting')).toBeVisible();
  await page.screenshot({path:`${output}/main-app.png`});
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await expect(page.locator('#cottage-verge-meadow')).toBeVisible();await page.screenshot({path:`${output}/main-app-mobile.png`});
  // The historical review still isolates its own composition and controls.
  await page.setViewportSize({width:1200,height:800});await page.goto('http://127.0.0.1:3000/docs/architecture/metrics/MEADOW-SCENE-TRIAL-2026-10-19/round-9/index.html');
  const scene=page.frameLocator('#scene');await expect(scene.locator('#beehive-planting-v9')).toBeVisible();await expect(scene.locator('#homestead-meadow-plants')).toHaveCount(0);
  await page.getByRole('button',{name:'查看第八轮',exact:true}).click();await expect(scene.locator('#beehive-lavender-flowers')).toBeVisible();
  const manifest=JSON.parse(await readFile('docs/architecture/metrics/MEADOW-VEGETATION-B-2026-10-19/v2/approved/manifest.json','utf8'));
  assert.equal(createHash('sha256').update(await readFile(manifest.source)).digest('hex'),manifest.sourceSha256);
  for(const asset of manifest.assets)assert.equal(createHash('sha256').update(await readFile(asset.svg)).digest('hex'),asset.sha256);
  assert.deepEqual(errors,[]);
  await writeFile(`${output}/verification.json`,JSON.stringify({errors,results,checks:['formal app defaults to accepted v9','world-space paths, colours, opacity and gradients match all nine reference views','protected architecture and shrubs unchanged','layout anchors and pointer / keyboard interaction','390px app without overflow','historical review remains isolated','retained asset hashes unchanged']},null,2)+'\n');
  console.log(JSON.stringify({errors,views:results.length,geometryAndPaintMatch:true,pngIdentical:results.filter(r=>r.pngIdentical).length}));
}finally{await browser.close()}
