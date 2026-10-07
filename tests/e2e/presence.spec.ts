import { expect, test } from '@playwright/test';
import { stableScene } from './helpers';
test('status preview and real placement agree; overflow stays visible in the panel', async ({ page }) => {
  await stableScene(page);
  await page.getByText('更换状态与装扮', { exact: true }).click();
  await page.getByRole('button', { name: /林木的书房.*Lin's Reading Room/i }).click();
  await expect(page.getByTestId('presence-preview')).toContainText('懒人沙发 · 阅卷席');
  await page.locator('#confirm-status-btn').click();
  await expect(page.getByRole('status').filter({ hasText: '该房间席位已满，状态已保留' })).toHaveCount(1);
  await expect(page.getByRole('status').filter({ hasText: '该房间席位已满，状态已保留' })).toBeVisible();
  await page.getByText('更换状态与装扮', { exact: true }).click();
  await expect(page.getByTestId('presence-preview')).toContainText('懒人沙发 · 阅卷席');
  await page.getByRole('button', { name: /前廊.*Front Porch/ }).click();
  await expect(page.getByTestId('presence-preview')).toHaveText('前廊：保留室外状态');
  await page.locator('#confirm-status-btn').click();
  await expect(page.getByRole('status').filter({ hasText: '该房间席位已满，状态已保留' })).toHaveCount(0);
});
