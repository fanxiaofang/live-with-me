import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const output = process.argv[2] || 'docs/visual-system/seedpod-cottage-2026-10-29';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const captures = [];
try {
  for (const [name, query] of [
    ['classic-day', 'cottage=classic'], ['day-overview', ''],
    ['day-close', 'focusRoom=living_nook'],
    ['dusk-close', 'focusRoom=living_nook&theme=dusk'],
    ['night-close', 'focusRoom=living_nook&theme=night'],
    ['desk-occupied', 'focusRoom=my_room&deskCount=2'],
  ]) {
    await page.goto(`http://127.0.0.1:3000/tests/fixtures/world.html?${query}`);
    await page.locator('[data-entity="main_cottage"]').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000);
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    await page.screenshot({ path: `${output}/${name}.png` });
    captures.push({ name, roof: await page.locator('#seedpod-cottage-shell').count(),
      loft: await page.locator('#seedpod-reading-loft').count(),
      bounds: await page.locator('[data-entity="main_cottage"]').boundingBox() });
  }
  await page.goto('http://127.0.0.1:3000/');
  await page.locator('#seedpod-cottage-shell').waitFor();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${output}/main.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:3000/tests/fixtures/world.html?focusRoom=living_nook');
  await page.locator('#seedpod-cottage-shell').waitFor();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${output}/mobile-close.png` });
  await page.setViewportSize({ width: 1431, height: 1252 });
  await page.goto('http://127.0.0.1:3000/tests/fixtures/world.html?focusRoom=living_nook');
  await page.locator('#seedpod-cottage-shell').waitFor();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${output}/review-viewport.png` });
  // Higher-resolution detail of the actual scene, without changing its camera.
  const detailPage = await browser.newPage({ viewport: { width: 1431, height: 1252 }, deviceScaleFactor: 2 });
  detailPage.on('pageerror', error => errors.push(error.message));
  await detailPage.goto('http://127.0.0.1:3000/tests/fixtures/world.html?focusRoom=living_nook');
  await detailPage.locator('#seedpod-cottage-shell').waitFor();
  await detailPage.evaluate(() => document.fonts.ready);
  await detailPage.waitForTimeout(1000);
  await detailPage.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  await detailPage.screenshot({ path: `${output}/joinery-detail.png`, clip: { x: 175, y: 155, width: 1080, height: 590 } });
  for (const theme of ['day', 'night']) {
    await detailPage.goto(`http://127.0.0.1:3000/tests/fixtures/world.html?theme=${theme}`);
    await detailPage.locator('#guardian-tree-trunk').waitFor();
    await detailPage.waitForTimeout(1000);
    const trunk = await detailPage.locator('#guardian-tree-trunk').boundingBox();
    if (!trunk) throw new Error('Guardian trunk is not visible');
    await detailPage.screenshot({ path: `${output}/guardian-${theme}-detail.png`,
      clip: { x: trunk.x-30, y: trunk.y-55, width: trunk.width+60, height: trunk.height+80 } });
  }
  await detailPage.close();
  await fs.writeFile(`${output}/capture-report.json`, JSON.stringify({ errors, captures }, null, 2));
  console.log(JSON.stringify({ errors, captures }, null, 2));
} finally { await browser.close(); }
