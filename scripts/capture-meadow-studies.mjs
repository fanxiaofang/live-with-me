import { chromium, expect } from '@playwright/test';
import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';

const output = 'docs/architecture/metrics/MEADOW-VEGETATION-B-2026-10-19/v2';
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1200, height: 1120 }, deviceScaleFactor: 1,
  locale: 'zh-CN', timezoneId: 'Asia/Shanghai' });
await context.addInitScript(() => {
  let seed = 731;
  Math.random = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto(`http://127.0.0.1:3000/${output}/index.html`);
await page.evaluate(() => document.fonts.ready);
for (const [label, mode] of [['完整造型', 'full'], ['只看剪影', 'silhouette'], ['隐藏花朵', 'flowerless']]) {
  await page.getByRole('button', { name: label, exact: true }).click();
  await expect(page.locator('body')).toHaveAttribute('data-mode', mode);
  if (mode !== 'full') await expect(page.locator('[data-part="flowers"]').first()).toBeHidden();
  if (mode === 'silhouette') await expect(page.locator('[data-part="detail"]').first()).toBeHidden();
  await page.screenshot({ path: `${output}/${mode}.png`, fullPage: true });
}
await page.getByRole('button', { name: '完整造型', exact: true }).click();
const stats = await page.locator('figure.detail svg').evaluateAll(svgs => svgs.map(svg => ({
  name: svg.getAttribute('aria-label'), paths: svg.querySelectorAll('path').length,
  clumps: svg.querySelectorAll('[data-clump]').length, filters: svg.querySelectorAll('filter').length,
  patterns: svg.querySelectorAll('pattern').length,
})));
for (const width of [390, 768]) {
  await page.setViewportSize({ width, height: 844 });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  assert.equal(await page.locator('.overview svg').first().evaluate(svg => svg.getBoundingClientRect().width), 300);
  await page.screenshot({ path: `${output}/sample-${width}.png`, fullPage: true });
}
for (const name of ['soft', 'wild', 'flower', 'daisy', 'buttercup', 'clover']) {
  const response = await page.request.get(`http://127.0.0.1:3000/${output}/${name}.svg`);
  assert.equal(response.status(), 200);
  assert.match(await response.text(), /xmlns="http:\/\/www.w3.org\/2000\/svg"/);
}
// The production scene is unchanged this round. Keep the earlier rollback evidence;
// do not overwrite it or rerun unrelated weather captures for isolated SVG changes.
assert.deepEqual(errors, []);
await writeFile(`${output}/verification.json`, JSON.stringify({ errors, stats,
  checks: ['three display modes', 'flower and detail suppression', '390px and 768px without horizontal overflow',
    'overview SVG stays 300px wide at responsive sizes', 'six standalone SVG URLs'],
}, null, 2));
await browser.close();
console.log(JSON.stringify({ errors, stats }, null, 2));
