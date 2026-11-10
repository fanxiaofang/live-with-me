import { expect, test } from '@playwright/test';
import { expectOverviewCamera, stableScene } from './helpers';

for (const viewport of [{ width: 1200, height: 800 }, { width: 1600, height: 900 },
  { width: 2560, height: 1080 }, { width: 390, height: 844 }]) {
  test(`overview frames the complete cottage and exposes the unchanged hill at ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await stableScene(page);
    await expectOverviewCamera(page);
    const composition = await page.evaluate(() => {
      const cottage = document.querySelector('#living-cottage-haven') as SVGGraphicsElement;
      const m = cottage.getScreenCTM()!;
      const corners = [-320, 320].flatMap(x => [-243, 310].map(y => {
        const p = new DOMPoint(x, y).matrixTransform(m); return { x: p.x, y: p.y };
      }));
      const windmill = document.querySelector('[data-foothill-windmill]')!.getBoundingClientRect();
      const roof = new DOMPoint(0, -190).matrixTransform(m);
      return { corners, windmill: { x: windmill.x, right: windmill.right, bottom: windmill.bottom }, roofY: roof.y };
    });
    for (const p of composition.corners) {
      expect(p.x).toBeGreaterThan(0); expect(p.x).toBeLessThan(viewport.width);
      expect(p.y).toBeGreaterThan(60); expect(p.y).toBeLessThan(viewport.height - 60);
    }
    expect(composition.windmill.x).toBeGreaterThan(0);
    expect(composition.windmill.right).toBeLessThan(viewport.width);
    expect(composition.windmill.bottom).toBeLessThan(composition.roofY - 8);
    if (viewport.width === 390) {
      await expect(page.getByTitle('展开同住人面板')).toBeVisible();
      await page.getByTitle('展开同住人面板').click();
      await expect(page.getByTitle('收起面板（查看完整约克郡风光）')).toBeVisible();
    }
  });
}

test('zoom limits, panorama foreground, reset and resizing preserve camera framing', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({ width: 1600, height: 900 });
  await stableScene(page, '/tests/fixtures/world.html');
  const stage = page.locator('#panoramic-world-stage');
  await page.getByTitle('缩小镜头（查看全景）', { exact: true }).click();
  await expect(stage).toHaveAttribute('data-zoom', '0.45');
  const bottom = await page.locator('#yorkshire-sheep-pen-cluster').boundingBox();
  expect(bottom!.y + bottom!.height).toBeGreaterThan(900 * .9);
  expect(bottom!.y + bottom!.height).toBeLessThan(900 * .96);
  // An upward drag must not reveal an empty lower half of the lawn.
  await page.mouse.move(800, 180); await page.mouse.down();
  await page.mouse.move(800, 20, { steps: 6 }); await page.mouse.up();
  const panned = await page.locator('#yorkshire-sheep-pen-cluster').boundingBox();
  expect(panned!.y + panned!.height).toBeGreaterThan(900 * .83);
  await stage.evaluate(e => e.closest('svg')!.dispatchEvent(new WheelEvent('wheel', { deltaY: -5000, bubbles: true, cancelable: true })));
  await expect(stage).toHaveAttribute('data-zoom', '2.5');
  await page.getByTitle('重置为田园全景', { exact: true }).click();
  await expectOverviewCamera(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await expectOverviewCamera(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(stage).toHaveCSS('transition-duration', '0s');
  expect(errors).toEqual([]);
});
