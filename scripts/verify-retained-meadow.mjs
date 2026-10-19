import { chromium, expect } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const directory='docs/architecture/metrics/MEADOW-VEGETATION-B-2026-10-19/v2/approved';
const manifest=JSON.parse(await readFile(`${directory}/manifest.json`,'utf8'));
const hash=data=>createHash('sha256').update(data).digest('hex');
assert.equal(hash(await readFile(manifest.source)),manifest.sourceSha256);
for(const asset of manifest.assets){
  assert.equal(hash(await readFile(asset.svg)),asset.sha256);
  assert.equal(hash(await readFile(asset.reviewedSample)),asset.reviewedSampleSha256);
  assert.equal(hash(await readFile(`docs/architecture/metrics/MEADOW-VEGETATION-B-2026-10-19/v2/${asset.id}.svg`)),asset.reviewedSampleSha256);
}
const browser=await chromium.launch();
try{
  const page=await browser.newPage({viewport:{width:1200,height:900}}),errors=[],results=[];
  page.on('pageerror',error=>errors.push(error.message));
  for(const asset of manifest.assets){
    const response=await page.goto(`http://127.0.0.1:3000/${asset.svg}`);assert.equal(response.status(),200);
    const shape=await page.locator('svg').evaluate(svg=>{
      const box=svg.getBBox(),view=svg.viewBox.baseVal;
      return {paths:svg.querySelectorAll('path').length,backgrounds:svg.querySelectorAll('rect,image,filter,pattern').length,
        inside:box.x>=view.x&&box.y>=view.y&&box.x+box.width<=view.x+view.width&&box.y+box.height<=view.y+view.height};
    });
    assert.equal(shape.paths,asset.paths);assert.equal(shape.backgrounds,0);assert.equal(shape.inside,true);
    results.push({asset:asset.id,...shape,sha256Verified:true});
  }
  await page.goto('http://127.0.0.1:3000/docs/architecture/metrics/MEADOW-VEGETATION-B-2026-10-19/v2/index.html');
  await expect(page.locator('.status')).toContainText('已验收保留三组资产');
  await expect(page.getByRole('link',{name:'下载透明资产',exact:true})).toHaveCount(3);
  await page.getByRole('button',{name:'只看剪影',exact:true}).click();await expect(page.locator('body')).toHaveAttribute('data-mode','silhouette');
  await page.getByRole('button',{name:'隐藏花朵',exact:true}).click();await expect(page.locator('body')).toHaveAttribute('data-mode','flowerless');
  await page.getByRole('button',{name:'完整造型',exact:true}).click();
  await page.screenshot({path:`${directory}/retained-assets-review.png`,fullPage:true});
  await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await page.goto('http://127.0.0.1:3000/tests/fixtures/world.html?vegetationTrial=9&theme=afternoon&focusRoom=corn_lounge');
  await expect(page.locator('#beehive-planting-v9')).toBeVisible();
  await expect(page.locator('#meadow-vegetation-trial [data-clump]')).toHaveCount(36);
  await expect(page.locator('#cottage-ground-planting')).toBeVisible();
  assert.deepEqual(errors,[]);
  await writeFile(`${directory}/verification.json`,JSON.stringify({errors,assets:results,checks:['retained source and SVG SHA-256','original reviewed SVG bytes unchanged','transparent exports have no backgrounds and no clipped geometry','three download links','full/silhouette/flowerless controls','390px no overflow','round 9 fixture shares retained source without runtime errors']},null,2)+'\n');
  console.log(JSON.stringify({errors,retainedAssets:results.length,sha256Verified:true,reviewedSamplesUnchanged:true}));
}finally{await browser.close()}
