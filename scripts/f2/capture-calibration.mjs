import { historicalSceneUrl } from './historicalScene.mjs';
import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1600,height:900},deviceScaleFactor:1});
const captures=[];
for(const study of ['baseline','position20','position35','refined']){
 await page.goto(historicalSceneUrl('http://127.0.0.1:3012/tests/fixtures/world.html?hills=f2&hillsStudy='+study));
 await page.locator('[data-hills-mode="f2"]').waitFor();
 await page.locator('[data-f2-study="'+study+'"]').waitFor();
 await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important}'});
 await page.evaluate(async()=>{await document.fonts.ready;document.querySelectorAll('svg').forEach(s=>{s.pauseAnimations();s.setCurrentTime(0);});});
 await page.waitForTimeout(650);
 await page.screenshot({path:'docs/visual-system/f2-calibration/'+study+'.png'});
 captures.push({study,cloudCount:await page.locator('#cumulus-whale-west').count(),stats:JSON.parse(await page.locator('[data-f2-hills]').getAttribute('data-stats'))});
 console.log('Captured',study);
}
await fs.writeFile('docs/visual-system/f2-calibration/positions.json',JSON.stringify(captures,null,2));
await browser.close();
