import { expect, test, type Page } from '@playwright/test';
import { stableScene } from './helpers';

async function sampleTerrain(page: Page) {
  return page.evaluate(() => {
    const stage = document.querySelector('#panoramic-world-stage') as SVGGraphicsElement;
    const svg = stage.closest('svg')!;
    const inverse = svg.getScreenCTM()!.inverse();
    const rectangle = svg.getBoundingClientRect();
    const start = new DOMPoint(rectangle.left, rectangle.top).matrixTransform(inverse);
    const end = new DOMPoint(rectangle.right, rectangle.bottom).matrixTransform(inverse);
    const paths = {
      apron: '#foothill-mountain-wheat-apron > path:first-child',
      wheat: '#organic-rolling-wheat-fields > path:first-child',
      blend: '#master-axonometric-ground-plane > path:first-child',
      meadow: '#master-axonometric-ground-plane > path:nth-of-type(2)',
    };
    const points = Object.fromEntries(Object.entries(paths).map(([key, selector]) => {
      const element = document.querySelector(selector) as SVGPathElement;
      const matrix = inverse.multiply(element.getScreenCTM()!);
      const length = element.getTotalLength();
      return [key, Array.from({ length: 2001 }, (_, i) => {
        const point = element.getPointAtLength(length * i / 2000);
        return new DOMPoint(point.x, point.y).matrixTransform(matrix);
      })];
    }));
    const edges = (key: keyof typeof paths, x: number) => {
      const ys: number[] = [];
      for (let i = 1; i < points[key].length; i++) {
        const a = points[key][i - 1], b = points[key][i];
        if ((a.x <= x && b.x > x) || (b.x <= x && a.x > x)) {
          ys.push(a.y + (b.y - a.y) * (x - a.x) / (b.x - a.x));
        }
      }
      return { top: Math.min(...ys), bottom: Math.max(...ys) };
    };
    const point = (selector: string, x: number, y: number) =>
      new DOMPoint(x, y).matrixTransform(inverse.multiply((document.querySelector(selector) as SVGGraphicsElement).getScreenCTM()!));
    const wheel = point('#tractor-in-field', 22, 46);
    const arch = point('#yorkshire-railway-viaduct', -160, 205);
    const samples = Array.from({ length: 9 }, (_, i) => {
      const x = start.x + (end.x - start.x) * (i + 0.5) / 9;
      return { x, mountainGap: edges('wheat', x).top - edges('apron', x).bottom,
        pastureGap: edges('blend', x).top - edges('wheat', x).bottom };
    });
    return { samples, tractorClearance: edges('meadow', wheel.x).top - wheel.y,
      archClearance: edges('wheat', arch.x).top - arch.y,
      camera: stage.getAttribute('style') };
  });
}

async function zoomTo(page: Page, zoom: number) {
  await page.locator('#panoramic-world-stage').evaluate((element, target) => {
    const current = Number(element.getAttribute('data-zoom'));
    element.closest('svg')!.dispatchEvent(new WheelEvent('wheel', {
      deltaY: (current - target) / 0.0012, bubbles: true, cancelable: true,
    }));
  }, zoom);
  await expect(page.locator('#panoramic-world-stage')).toHaveAttribute('data-zoom', String(zoom));
}

async function panToCorner(page: Page, x: number, y: number) {
  const viewport = page.viewportSize()!;
  const start = { x: viewport.width / 2, y: viewport.height * 0.15 };
  await page.mouse.move(start.x, start.y);
  await page.mouse.down();
  await page.mouse.move(start.x + x * 12, start.y + y * 12);
  await page.mouse.move(start.x + x * 5000, start.y + y * 5000);
  await page.mouse.up();
}

function expectContinuous(terrain: Awaited<ReturnType<typeof sampleTerrain>>) {
  for (const sample of terrain.samples) {
    expect(sample.mountainGap, `${terrain.camera} at x=${sample.x}`).toBeLessThan(-1);
    expect(sample.pastureGap, `${terrain.camera} at x=${sample.x}`).toBeLessThan(-1);
  }
}

test('default panorama exposes the tractor wheels and the viaduct arches', async ({ page }) => {
  await stableScene(page, '/tests/fixtures/world.html');
  const terrain = await sampleTerrain(page);
  expect(terrain.tractorClearance).toBeGreaterThan(5);
  expect(terrain.archClearance).toBeGreaterThan(7);
  expectContinuous(terrain);
});

for (const viewport of [{ width: 1200, height: 800 }, { width: 1600, height: 900 }, { width: 390, height: 844 }]) {
  test(`terrain joins cover every pan corner at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize(viewport);
    await stableScene(page, '/tests/fixtures/world.html');
    for (const zoom of [0.45, 0.66, 1.6, 2.5]) {
      await zoomTo(page, zoom);
      for (const [x, y] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        await panToCorner(page, x, y);
        expectContinuous(await sampleTerrain(page));
      }
    }
    await zoomTo(page, 0.45);
    await panToCorner(page, 1, 1);
    await test.info().attach('minimum-zoom-corner', { body: await page.screenshot(), contentType: 'image/png' });
  });
}

for (const theme of ['morning', 'afternoon', 'dusk', 'night', 'rainy']) {
  test(`minimum zoom keeps the terrain continuous in ${theme}`, async ({ page }) => {
    await stableScene(page, `/tests/fixtures/world.html?theme=${theme}`);
    await zoomTo(page, 0.45);
    await panToCorner(page, -1, 1);
    expectContinuous(await sampleTerrain(page));
    await test.info().attach(theme, { body: await page.screenshot(), contentType: 'image/png' });
  });
}

test('wheel and zoom buttons reapply boundaries, including after a viewport resize', async ({ page }) => {
  await stableScene(page, '/tests/fixtures/world.html?focusRoom=observatory&stationX=1200');
  await panToCorner(page, -1, 1);
  await zoomTo(page, 0.45);
  expectContinuous(await sampleTerrain(page));
  await expect(page.locator('#panoramic-world-stage')).not.toHaveAttribute('style', /translate\(-700px/);
  await page.getByTitle('放大画面', { exact: true }).click();
  await expect(page.locator('#panoramic-world-stage')).toHaveAttribute('data-zoom', '0.7');
  await page.getByTitle('缩小镜头（查看全景）', { exact: true }).click();
  await expect(page.locator('#panoramic-world-stage')).toHaveAttribute('data-zoom', '0.45');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(50);
  await panToCorner(page, 1, -1);
  expectContinuous(await sampleTerrain(page));
  await page.getByTitle('重置为田园全景', { exact: true }).click();
  await expect(page.locator('#panoramic-world-stage')).toHaveAttribute('style', /translate\(0px, 135px\) scale\(0.66\)/);
});

test('terrain coverage also survives animated zoom reversals and reduced motion', async ({ page }) => {
  await page.goto('/tests/fixtures/world.html');
  await page.locator('#panoramic-world-stage').waitFor();
  await panToCorner(page, 1, 1);
  await zoomTo(page, 0.45);
  await page.waitForTimeout(150);
  expectContinuous(await sampleTerrain(page));
  await zoomTo(page, 1.6);
  for (const wait of [100, 250, 500]) {
    await page.waitForTimeout(wait);
    expectContinuous(await sampleTerrain(page));
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await zoomTo(page, 0.45);
  expectContinuous(await sampleTerrain(page));
  const transition = await page.locator('#panoramic-world-stage').evaluate(e => getComputedStyle(e).transitionDuration);
  expect(transition).toBe('0s');
});
