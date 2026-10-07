import { expect, test } from '@playwright/test';
import { stableScene } from './helpers';

test('an uncaught calibration render error displays a report and reload preserves saved layout', async ({ page }) => {
  await stableScene(page);
  await page.evaluate(() => {
    localStorage.setItem('live_with_me_room_layout_v6', JSON.stringify({ 'cabinet-group': { screen: { x: -71, y: 75 } } }));
    // Inject a real render failure in the numeric calibration display.
    Number.prototype.toFixed = () => { throw new Error('CalibrationRenderError: diagnostic regression'); };
  });
  await page.getByRole('button', { name: '全屋 2.5D 布局校准器', exact: true }).click();
  const failure = page.getByRole('alert', { name: '页面运行错误' });
  await expect(failure).toBeVisible();
  await expect(failure.getByRole('textbox', { name: '前端错误详情' })).toHaveValue(/CalibrationRenderError: diagnostic regression/);
  // Preview iframes can deny clipboard access; the selected text remains usable.
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('clipboard denied')) } }); });
  await failure.getByRole('button', { name: '复制错误信息' }).click();
  await expect(failure.getByRole('button', { name: '请手动复制已选中的文字' })).toBeVisible();
  await failure.getByRole('button', { name: '重新加载页面' }).click();
  await expect(page.locator('#panoramic-world-stage')).toBeVisible();
  await expect(failure).toHaveCount(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_room_layout_v6')!)['cabinet-group'].screen.x)).toBe(-71);
});

for (const kind of ['event', 'promise'] as const) {
  test(`uncaught ${kind} failures display the first error without recursively reporting it`, async ({ page }) => {
    await stableScene(page);
    await page.evaluate(kind => {
      if (kind === 'event') setTimeout(() => { throw new Error('CabinetPointerError: diagnostic regression'); }, 0);
      else void Promise.reject(new Error('CabinetPointerError: diagnostic regression'));
    }, kind);
    const failure = page.getByRole('alert', { name: '页面运行错误' });
    await expect(failure).toHaveCount(1);
    await expect(failure.getByRole('textbox', { name: '前端错误详情' })).toHaveValue(/CabinetPointerError: diagnostic regression/);
    // The listener reports the first exception; it does not replace it or emit a new error.
    await page.evaluate(() => { window.dispatchEvent(new ErrorEvent('error', { error: new Error('secondary error') })); });
    await expect(failure.getByRole('textbox', { name: '前端错误详情' })).not.toHaveValue(/secondary error/);
    await expect(page.locator('#panoramic-world-stage')).toHaveCount(1);
  });
}
