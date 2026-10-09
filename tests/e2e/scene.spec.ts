import { expect, test } from '@playwright/test';
import { stableScene } from './helpers';
import { DEFAULT_SCENE_LAYOUT } from '../../src/world/scene/sceneLayout';

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
        dish:point('#alien-receiver-assembly'),shadow:point('[data-ground-shadow="observatory"]'),pines:point('#lowpoly-crest-pines'),
        camera:document.querySelector('#panoramic-world-stage')!.getAttribute('style') };
    });
  };
  const original=await sample('stationX=1000');
  const moved=await sample('stationX=1200');
  expect(moved.count).toBe(1);
  expect(original.transform).toContain('scale(0.8)');
  for (const key of ['station','person','dish','shadow'] as const) {
    expect(Math.abs(moved[key].x-original[key].x-132)).toBeLessThan(0.001);
    expect(Math.abs(moved[key].y-original[key].y)).toBeLessThan(0.001);
  }
  expect(moved.pines).toEqual(original.pines);
  const focused=await sample('stationX=1200&focusStation=1');
  expect(focused.station.x).toBeCloseTo(600,3);
  expect(focused.station.y).toBeCloseTo(406.2,3);
  await page.locator('#alien-receiver-assembly').click({ force:true });
  await expect(page.getByText(/正在捕获来自猎户座/)).toBeVisible();
});

test('capsule and cabin retain the full local bed and occupant chain under placement scale', async ({ page }) => {
  for (const [room,entity,person,expected] of [
    ['capsule_pod','capsule_pod','#person-in-pod-self',{x:1002,y:361}],
    ['corn_lounge','wooden_cabin','#person-in-cabin-self',{x:118.36,y:381.2}],
  ] as const) {
    const sample=async (extra='') => {
      await stableScene(page, `/tests/fixtures/world.html?occupantRoom=${room}${extra}`);
      return page.locator(person).evaluate((e, entity) => {
        const stage=document.querySelector('#panoramic-world-stage') as SVGGraphicsElement;
        const matrix=stage.getCTM()!.inverse().multiply((e as SVGGraphicsElement).getCTM()!);
        const building=document.querySelector(`[data-entity="${entity}"]`) as SVGGraphicsElement;
        const shadow=document.querySelector(`[data-ground-shadow="${entity}"]`) as SVGGraphicsElement;
        const shadowRelative = building.getCTM()!.inverse().multiply(shadow.getCTM()!);
        // Chromium can expose an SVGMatrix without DOMMatrix.isIdentity.
        const shadowError = Math.max(Math.abs(shadowRelative.a - 1), Math.abs(shadowRelative.b),
          Math.abs(shadowRelative.c), Math.abs(shadowRelative.d - 1), Math.abs(shadowRelative.e), Math.abs(shadowRelative.f));
        if (shadowError > 0.000001) throw new Error('Ground shadow detached from building placement');
        return {x:matrix.e,y:matrix.f};
      }, entity);
    };
    const original=await sample();
    expect(original.x).toBeCloseTo(expected.x,3);
    expect(original.y).toBeCloseTo(expected.y,3);
    const moved=await sample(`&entity=${entity}&x=1200&scale=0.8`);
    const { position } = DEFAULT_SCENE_LAYOUT[entity];
    expect(moved.x).toBeCloseTo(1200+(expected.x-position.x)*0.8,3);
    expect(moved.y).toBeCloseTo(position.y+(expected.y-position.y)*0.8,3);
  }
});
