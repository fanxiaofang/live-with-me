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

test('capsule and cabin retain the full local bed and occupant chain under placement scale', async ({ page }) => {
  for (const [room,entity,person,expected] of [
    ['capsule_pod','capsule_pod','#person-in-pod-self',{x:896,y:331}],
    ['corn_lounge','wooden_cabin','#person-in-cabin-self',{x:220,y:366}],
  ] as const) {
    const sample=async (extra='') => {
      await stableScene(page, `/tests/fixtures/world.html?occupantRoom=${room}${extra}`);
      return page.locator(person).evaluate(e => {
        const stage=document.querySelector('#panoramic-world-stage') as SVGGraphicsElement;
        const matrix=stage.getCTM()!.inverse().multiply((e as SVGGraphicsElement).getCTM()!);
        return {x:matrix.e,y:matrix.f};
      });
    };
    const original=await sample();
    expect(original.x).toBeCloseTo(expected.x,3);
    expect(original.y).toBeCloseTo(expected.y,3);
    const moved=await sample(`&entity=${entity}&x=1200&scale=0.8`);
    expect(moved.x).toBeCloseTo(1200+(expected.x-(entity==='capsule_pod'?894:220))*0.8,3);
    expect(moved.y).toBeCloseTo((entity==='capsule_pod'?320:340)+(expected.y-(entity==='capsule_pod'?320:340))*0.8,3);
  }
});
