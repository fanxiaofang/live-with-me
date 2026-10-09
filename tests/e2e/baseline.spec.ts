import { expect, test } from '@playwright/test';
import { ROOM_VIEWS, stableScene } from './helpers';

test('all eight navigation entries and the v6 editor remain usable', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await stableScene(page);
  for (const [, label] of ROOM_VIEWS) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await expect(page.locator('#panoramic-world-stage')).toBeVisible();
  }
  await page.getByRole('button', { name: '全屋 2.5D 布局校准器', exact: true }).click();
  await page.getByText('北欧轻量咖啡黑胶柜 (整体)', { exact: true }).click();
  await page.getByRole('button', { name: '→', exact: true }).click();
  await page.reload();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_room_layout_v6')!));
  expect(saved['cabinet-group'].screen).toEqual({ x: -71, y: 75 });
  await page.getByRole('button', { name: '全屋 2.5D 布局校准器', exact: true }).click();
  await page.getByRole('button', { name: '恢复默认', exact: true }).click();
  await page.reload();
  const reset = await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_room_layout_v6')!));
  expect(reset['cabinet-group'].screen).toEqual({ x: -72, y: 75 });
  expect(errors).toEqual([]);
});

for (const [id, label] of ROOM_VIEWS) {
  test(`@visual afternoon ${id}`, async ({ page }) => {
    test.skip(process.platform !== 'win32', 'Visual baselines use Windows/Chromium/DPR=1');
    await stableScene(page);
    await page.getByRole('button', { name: label, exact: true }).click();
    await expect(page).toHaveScreenshot(`${id}.png`);
    const first = await page.screenshot({ animations: 'disabled' });
    expect((await page.screenshot({ animations: 'disabled' })).equals(first),
      'Consecutive screenshots must have identical PNG bytes').toBe(true);
  });
}

for (const [theme, label] of [['night', '深夜'], ['rainy', '静雨']] as const) {
  test(`@visual overview ${theme}`, async ({ page }) => {
    test.skip(process.platform !== 'win32', 'Visual baselines use Windows/Chromium/DPR=1');
    await stableScene(page);
    await page.getByRole('button', { name: label, exact: true }).click();
    await expect(page).toHaveScreenshot(`${theme}.png`);
  });
}

test('@visual empty seats', async ({ page }) => {
  test.skip(process.platform !== 'win32', 'Visual baselines use Windows/Chromium/DPR=1');
  await stableScene(page, '/tests/fixtures/world.html?empty=1');
  await expect(page).toHaveScreenshot('empty-seats.png');
});
