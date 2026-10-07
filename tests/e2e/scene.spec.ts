import { test, expect } from '@playwright/test';
import { stableScene } from './helpers';

test('one station: facility, occupant, hit area and focus follow placement; distant pines stay put', async ({ page }) => {
  const sample = async (query: string) => {
    await stableScene(page, `/tests/fixtures/world.html?observer=1&${query}`);
    return page.evaluate(() => {
      const point = (selector: string) => {
        const e=document.querySelector(selector) as SVGGraphicsElement;
        const m=e.getCTM()!;
        return { x:m.e,y:m.f };
      };
      return { count:document.querySelectorAll('#room-observatory').length,
        transform:document.querySelector('#room-observatory')!.getAttribute('transform'),
        station:point('#room-observatory'),person:point('#person-in-observatory-self'),
        dish:point('#alien-receiver-assembly'),pines:point('#mountain-ridge-pines'),
        camera:document.querySelector('#panoramic-world-stage')!.getAttribute('style') };
    });
  };
  const original=await sample('stationX=1000');
  const moved=await sample('stationX=1200');
  expect(moved.count).toBe(1);
  expect(original.transform).toContain('scale(0.8)');
  for (const key of ['station','person','dish'] as const) {
    expect(Math.abs(moved[key].x-original[key].x-132)).toBeLessThan(0.001);
    expect(Math.abs(moved[key].y-original[key].y)).toBeLessThan(0.001);
  }
  expect(moved.pines).toEqual(original.pines);
  const focused=await sample('stationX=1200&focusStation=1');
  expect(focused.camera).toContain('translate(-700px, 30px)');
  await page.locator('#alien-receiver-assembly').click({ force:true });
  await expect(page.getByText(/正在捕获来自猎户座/)).toBeVisible();
});
