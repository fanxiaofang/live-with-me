import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { stableScene } from './helpers';
test('measure a fixed camera pan without rerendering unrelated landscape assets', async ({ page }) => {
  page.on('pageerror', error => console.log(error.stack));
  await stableScene(page, '/tests/fixtures/world.html?profile');
  await page.evaluate(() => { (window as unknown as { renderSamples: number[] }).renderSamples.length = 0; });
  await page.mouse.move(600, 70); await page.mouse.down();
  await page.mouse.move(720, 115, { steps: 12 }); await page.mouse.up();
  const samples = await page.evaluate(() => (window as unknown as { renderSamples: number[] }).renderSamples);
  expect(samples.length).toBeGreaterThan(0);
  const metrics = { environment: 'Windows / Chromium 141 / React development Profiler / DPR 1 / 1200×800', scenario: 'overview pan +120,+45 CSS pixels, 12 pointer steps', commits: samples.length, totalRenderMs: Number(samples.reduce((a, b) => a + b, 0).toFixed(2)), meanRenderMs: Number((samples.reduce((a, b) => a + b, 0) / samples.length).toFixed(2)), maxRenderMs: Number(Math.max(...samples).toFixed(2)) };
  console.log(JSON.stringify(metrics));
  const file = process.env.LWM_METRICS_FILE || test.info().outputPath('render-metrics.json');
  fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(metrics, null, 2) + '\n');
});
