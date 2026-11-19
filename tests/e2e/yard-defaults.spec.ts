import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const preset = JSON.parse(readFileSync(new URL('../../src/features/yard-editor/defaultYardLayout.json', import.meta.url), 'utf8'));
const pavingCount = Object.keys(preset.objects).filter(id => id.startsWith('paving_') && preset.objects[id].material && !preset.objects[id].removed).length;
const plotCount = Object.keys(preset.objects).filter(id => id.startsWith('tilled_plot') && !preset.objects[id].removed).length;

test('首次访问使用用户默认庭院，恢复默认和撤销保留完整布局', async ({ page }) => {
  test.setTimeout(150000);
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('[data-paving-piece]')).toHaveCount(pavingCount, { timeout: 60000 });
  await expect(page.locator('[data-material="turned-soil"]')).toHaveCount(plotCount);
  const firewood = preset.objects.cottage_firewood;
  await expect(page.locator('[data-yard-object="cottage_firewood"]')).toHaveAttribute('transform', `translate(${firewood.dx} ${firewood.dy})`);
  await expect(page.locator('#yard-painted-wear')).toBeAttached();
  await page.getByRole('button', { name: '白天', exact: true }).click();
  await page.screenshot({ path: 'test-results/yard-defaults/user-default.png', animations: 'disabled' });
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  const panel = page.getByRole('complementary', { name: '庭院布置', exact: true });
  await panel.getByLabel('选择庭院物件').selectOption('herb_nursery');
  await panel.getByRole('button', { name: '向右移动', exact: true }).click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_yard_layout_v1')!));
  expect(saved.objects.herb_nursery.dx).toBeCloseTo(preset.objects.herb_nursery.dx + 5, 1);
  expect(saved.wearStrokes).toEqual(preset.wearStrokes);
  await panel.getByRole('button', { name: '恢复庭院默认布局', exact: true }).click();
  await panel.getByRole('button', { name: '恢复默认', exact: true }).click();
  const restored = await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_yard_layout_v1')!));
  expect(restored.objects).toEqual(preset.objects);
  expect(restored.wearStrokes).toEqual(preset.wearStrokes);
  await panel.getByRole('button', { name: '撤销庭院调整', exact: true }).click();
  await page.reload();
  await expect(page.locator('[data-yard-object="herb_nursery"]')).toHaveAttribute('transform', `translate(${saved.objects.herb_nursery.dx} ${saved.objects.herb_nursery.dy})`, { timeout: 60000 });
  expect(errors).toEqual([]);
});
