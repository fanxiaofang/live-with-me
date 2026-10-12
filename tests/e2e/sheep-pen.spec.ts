import { expect, test, type Page } from '@playwright/test';
import { stableScene } from './helpers';

const penSelector = '#yorkshire-sheep-pen-cluster';

async function expectPenInViewport(page: Page) {
  const viewport = page.viewportSize()!;
  const pen = (await page.locator(penSelector).boundingBox())!;
  expect(pen.x).toBeGreaterThanOrEqual(0);
  expect(pen.x + pen.width).toBeLessThanOrEqual(viewport.width);
  expect(pen.y).toBeGreaterThan(45);
  expect(pen.y + pen.height).toBeLessThanOrEqual(viewport.height);
}

async function panToPen(page: Page) {
  const viewport = page.viewportSize()!;
  await page.mouse.move(viewport.width / 2, viewport.height * 0.15);
  await page.mouse.down();
  await page.mouse.move(viewport.width / 2 - 12, viewport.height * 0.15 - 12);
  await page.mouse.move(-5000, -5000);
  await page.mouse.up();
}

test('one sheep pen has unique SVG resources and a single working gate', async ({ page }) => {
  await stableScene(page);
  await page.getByTitle('收起面板（查看完整约克郡风光）', { exact: true }).click();
  const pen = page.locator(penSelector);
  await expect(pen).toHaveCount(1);
  const duplicateIds = await pen.evaluate(element => [...element.querySelectorAll('[id]')]
    .filter(child => element.ownerDocument.querySelectorAll(`[id="${child.id}"]`).length !== 1)
    .map(child => child.id));
  expect(duplicateIds).toEqual([]);
  expect(await pen.evaluate(e => !!e.closest('#panoramic-world-stage'))).toBe(true);
  await panToPen(page);
  const gate = page.getByRole('button', { name: '羊圈原木五杠门', exact: true });
  const rail = page.locator('#gate-leaf-geometry line').first();
  await expect(rail).toHaveAttribute('x2', '0');
  await gate.click();
  await expect(rail).toHaveAttribute('x2', '23');
  await gate.focus();
  await gate.press('Enter');
  await expect(rail).toHaveAttribute('x2', '0');
});

test('sheep pen ground and contact shadow stay outside the feathered terrace with a grass buffer', async ({ page }) => {
  await stableScene(page);
  const geometry = await page.locator(penSelector).evaluate(pen => {
    const terrace = document.querySelector('#homestead-organic-meadow-grounds > path:first-child') as SVGPathElement;
    const matrix = terrace.getScreenCTM()!.inverse().multiply((pen as SVGGraphicsElement).getScreenCTM()!);
    const polygons = [...pen.children].filter(e => e.tagName === 'polygon').slice(0, 2) as SVGPolygonElement[];
    const perimeter = polygons.flatMap(p => [...p.points].flatMap((v, i, vertices) => {
      const next = vertices[(i + 1) % vertices.length];
      return Array.from({ length: 101 }, (_, sample) => new DOMPoint(
        v.x + (next.x - v.x) * sample / 100, v.y + (next.y - v.y) * sample / 100,
      ).matrixTransform(matrix));
    }));
    const length = terrace.getTotalLength();
    const edge = Array.from({ length: 2001 }, (_, i) => terrace.getPointAtLength(length * i / 2000));
    return {
      polygonCount: polygons.length,
      intersections: perimeter.filter(p => terrace.isPointInFill(p)).length,
      clearance: Math.min(...perimeter.map(p => Math.min(...edge.map(q => Math.hypot(p.x - q.x, p.y - q.y))))),
    };
  });
  expect(geometry.polygonCount).toBe(2);
  expect(geometry.intersections).toBe(0);
  expect(geometry.clearance).toBeGreaterThan(15);
});

for (const viewport of [{ width: 1200, height: 800 }, { width: 1600, height: 900 }, { width: 1920, height: 800 }]) {
  test(`overview retains its camera and visible landscape at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await stableScene(page);
    await page.getByTitle('收起面板（查看完整约克郡风光）', { exact: true }).click();
    const stage = page.locator('#panoramic-world-stage');
    await expect(stage).toHaveAttribute('style', /translate\(0px, 135px\) scale\(0.66\)/);
    const camera = await stage.getAttribute('style');
    // Navigation is allowed to overlap the pen. Its dimensions must not change
    // the world camera or force the scenery back onto the terrace.
    const nav = page.getByRole('navigation', { name: '房间视角' });
    await nav.evaluate(async e => {
      e.style.paddingTop = '64px';
      await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
    });
    expect(await stage.getAttribute('style')).toBe(camera);
    await nav.evaluate(e => { e.style.paddingTop = ''; });
    const hiddenLandmarks = await page.evaluate(() => {
      const covered = (layer: string, subject: string, x: number, y: number) => {
        const surface = document.querySelector(layer) as SVGPathElement;
        const element = document.querySelector(subject) as SVGGraphicsElement;
        const point = new DOMPoint(x, y).matrixTransform(surface.getScreenCTM()!.inverse().multiply(element.getScreenCTM()!));
        return surface.isPointInFill(point);
      };
      return {
        tractor: covered('#master-axonometric-ground-plane > path:nth-of-type(2)', '#tractor-in-field', 22, 46),
        arches: covered('#organic-rolling-wheat-fields > path:first-child', '#yorkshire-railway-viaduct', -160, 205),
      };
    });
    expect(hiddenLandmarks).toEqual({ tractor: false, arches: false });
    await test.info().attach('overview', { body: await page.screenshot(), contentType: 'image/png' });
  });
}

test('portrait exploration reaches the full sheep pen and overview restores the original camera', async ({ page }) => {
  await stableScene(page);
  await page.getByTitle('收起面板（查看完整约克郡风光）', { exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  for (const zoom of [0.66, 0.45]) {
    await page.locator('#panoramic-world-stage').evaluate((element, target) => {
      const current = Number(element.getAttribute('data-zoom'));
      element.closest('svg')!.dispatchEvent(new WheelEvent('wheel', {
        deltaY: (current - target) / 0.0012, bubbles: true, cancelable: true,
      }));
    }, zoom);
    await expect(page.locator('#panoramic-world-stage')).toHaveAttribute('data-zoom', String(zoom));
    await panToPen(page);
    await expectPenInViewport(page);
  }
  await page.setViewportSize({ width: 1600, height: 900 });
  await page.getByRole('button', { name: '整栋小屋', exact: true }).click();
  await expect(page.locator('#panoramic-world-stage')).toHaveAttribute('style', /translate\(0px, 135px\) scale\(0.66\)/);
});
