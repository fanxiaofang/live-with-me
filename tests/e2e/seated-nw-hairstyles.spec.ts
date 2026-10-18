import fs from 'node:fs/promises';
import { test, expect } from '@playwright/test';
import { stableScene } from './helpers';
import { NW_SEATED_HEAD_ASSETS } from '../../src/components/desk/nwSeatedHeadAssets';

const hairstyles = [['经典短发', 'shorthair'], ['层叠长卷发', 'curly'], ['偏分低束发', 'sidepart'], ['双色蓬松碎发', 'shaggy']] as const;
for (const width of [1200, 390]) test(`all seated NW hairstyles preview, copy and download at ${width}`, async ({ page }, testInfo) => {
    const evidence = testInfo.outputPath('evidence');
  test.setTimeout(60000);
  await page.setViewportSize({ width, height: 900 });
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { configurable: true,
    value: { writeText: async (text: string) => { (window as any).copiedSvg = text; } } }));
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await stableScene(page);
  const saved = await page.evaluate(() => localStorage.getItem('live_with_me_room_layout_v6'));
  await page.getByRole('button', { name: '人物 5 视图 SVG', exact: true }).click();
  const modal = page.getByRole('dialog', { name: '人物五视图 · 查看与导出' });
  await modal.getByRole('button', { name: '坐姿四视图 + NW', exact: true }).click();
  for (const [label, id] of hairstyles) {
    await modal.getByRole('button', { name: label, exact: true }).click();
    const sheet = `character-${id}-seated-5views-study.svg`, nw = `character-${id}-seated-nw-floor-study.svg`;
    await expect(modal.locator(`img[src="/${sheet}"]`)).toBeVisible();
    await expect(modal.locator(`a[href="/${nw}"]`)).toHaveCount(1);
    await expect.poll(() => modal.locator('img').evaluateAll(nodes => nodes.every(n => (n as HTMLImageElement).complete && (n as HTMLImageElement).naturalWidth > 0))).toBe(true);
    const info = await page.evaluate(async name => {
      const doc = new DOMParser().parseFromString(await (await fetch('/' + name)).text(), 'image/svg+xml');
      const ids = [...doc.querySelectorAll('[id]')].map(n => n.id);
      return { views: [...doc.querySelectorAll('[data-view]')].map(n => n.getAttribute('data-view')),
        head: doc.querySelector('[data-nw-hairstyle]')?.getAttribute('data-nw-hairstyle'),
        source: doc.querySelector('[data-nw-head-source]')?.getAttribute('data-nw-head-source'),
        duplicate: ids.length - new Set(ids).size, invalid: doc.querySelectorAll('image,foreignObject,script,parsererror').length,
        missing: [...doc.querySelectorAll('*')].flatMap(n => [...n.attributes].flatMap(a => [...a.value.matchAll(/url\(#([^)]*)\)/g)].filter(m => !ids.includes(m[1])).map(m => m[1]))) };
    }, sheet);
    expect(info.views).toHaveLength(5);
    expect(info.head).toBe(id); expect(info.source).toBe(NW_SEATED_HEAD_ASSETS[id].sourceSha256);
    expect(info.duplicate).toBe(0); expect(info.invalid).toBe(0); expect(info.missing).toEqual([]);
    await modal.getByRole('button', { name: /复制.*05 · NW 斜侧坐姿.* SVG/ }).click();
    await expect.poll(() => page.evaluate(() => (window as any).copiedSvg)).toBe(await fs.readFile(`public/${nw}`, 'utf8'));
    const pending = page.waitForEvent('download');
    await modal.getByRole('button', { name: /下载.*05 · NW 斜侧坐姿.* SVG/ }).click();
    const download = await pending;
    expect(download.suggestedFilename()).toBe(nw);
    expect(await fs.readFile((await download.path())!, 'utf8')).toBe(await fs.readFile(`public/${nw}`, 'utf8'));
  }
  await modal.screenshot({ path: `${evidence}/export-${width}.png` });
  expect(await modal.evaluate(n => n.scrollWidth > n.clientWidth)).toBe(false);
  await modal.getByRole('button', { name: '关闭导出窗口', exact: true }).press('Escape');
  expect(await page.evaluate(() => localStorage.getItem('live_with_me_room_layout_v6'))).toBe(saved);
  expect(errors).toEqual([]);
});
