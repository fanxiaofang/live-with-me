import assert from 'node:assert/strict';
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const output = 'docs/visual-system/f2-default-cottage-2026-10-30';
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const page = await browser.newPage({ viewport: { width: 1431, height: 1252 }, deviceScaleFactor: 1 });
const errors = [], captures = [];
page.on('pageerror', error => errors.push(error.message));
try {
  for (const [name, path, time, classic] of [
    ['homepage', '/', 'day', false],
    ['day', '/tests/fixtures/world.html?focusRoom=living_nook', 'day', false],
    ['dusk', '/tests/fixtures/world.html?focusRoom=living_nook&theme=dusk', 'dusk', false],
    ['night', '/tests/fixtures/world.html?focusRoom=living_nook&theme=night', 'night', false],
    ['classic-comparison', '/tests/fixtures/world.html?cottage=classic', 'day', true],
  ]) {
    await page.goto('http://127.0.0.1:3000' + path);
    await page.locator('[data-hills-mode="f2"]').waitFor({ timeout: 30000 });
    await page.locator('#isometric-bay-window').waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1600);
    const state = await page.evaluate(() => {
      const exists = id => !!document.getElementById(id);
      return {
        hills: document.querySelector('[data-hills-mode]')?.getAttribute('data-hills-mode'),
        seedpod: exists('seedpod-cottage-shell'), loft: exists('seedpod-reading-loft'),
        ladder: exists('seedpod-gallery-ladder'), pumpkin: exists('seedpod-pumpkin-lantern'),
        removedLamps: exists('cottage-hanging-lamps'),
        windowTime: document.querySelector('#isometric-bay-window')?.getAttribute('data-window-time'),
        deskTime: document.querySelector('#component-banker-lamp')?.getAttribute('data-lamp-time'),
      };
    });
    assert.equal(state.hills, 'f2');
    for (const key of ['seedpod', 'loft', 'ladder', 'pumpkin']) assert.equal(state[key], !classic, `${name}: ${key}`);
    assert.equal(state.removedLamps, false);
    assert.equal(state.windowTime, time);
    assert.equal(state.deskTime, time);
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    await page.screenshot({ path: `${output}/${name}.png` });
    captures.push({ name, path, ...state });
  }
  assert.deepEqual(errors, []);
  await fs.writeFile(`${output}/capture-report.json`, JSON.stringify({ errors, captures }, null, 2));
  console.log(JSON.stringify({ errors, captures }));
} finally { await browser.close(); }
