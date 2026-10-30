import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const output = process.argv[2] ?? 'docs/visual-system/seedpod-cottage-2026-10-29/revision-timber-light';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1431, height: 1252 }, deviceScaleFactor: 2 });
const errors = [], materials = [];
page.on('pageerror', error => errors.push(error.message));
try {
  for (const time of (process.argv[3] ? [process.argv[3]] : ['day', 'dusk', 'night'])) {
    await page.goto(`http://127.0.0.1:3000/tests/fixtures/world.html?focusRoom=living_nook&theme=${time}`);
    await page.locator('#seedpod-reading-loft').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1600);
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    materials.push(await page.evaluate(() => {
      const ground = document.querySelector('#artisan-timber-flooring');
      const loft = document.querySelector('#seedpod-reading-loft');
      const stops = selector => Array.from(document.querySelectorAll(selector)).map(s => s.getAttribute('stop-color'));
      return { groundTime: ground.getAttribute('data-timber-time'), loftTime: loft.getAttribute('data-timber-time'),
        windowTime: document.querySelector('#isometric-bay-window')?.getAttribute('data-window-time'),
        deskLampTime: document.querySelector('#component-banker-lamp')?.getAttribute('data-lamp-time'),
        hangingLamps: document.querySelectorAll('#cottage-hanging-lamps > g').length,
        ground: stops('#hardwoodBaseWaxGrad stop'), loft: stops('#seedpod-reading-loft linearGradient[id$="-board-light"] stop') };
    }));
    await page.screenshot({ path: `${output}/${time}-review.png` });
    await page.screenshot({ path: `${output}/${time}-loft-detail.png`, clip: { x: 315, y: 265, width: 650, height: 340 } });
    await page.screenshot({ path: `${output}/${time}-interior-detail.png`, clip: { x: 180, y: 425, width: 1060, height: 545 } });
  }
  await fs.writeFile(`${output}/capture-report.json`, JSON.stringify({ errors, materials }, null, 2));
  console.log(JSON.stringify({ errors, materials }));
} finally { await browser.close(); }
