import { test, expect } from '@playwright/test';
import { stableScene } from './helpers';
test('deferred mailbox preserves an unsent draft; SVG export still downloads the original vector asset', async ({ page }) => {
  await stableScene(page);
  await page.locator('#mailbox-group').focus(); await page.locator('#mailbox-group').press('Enter');
  await page.locator('#mailbox-tab-compose').click(); await page.locator('#compose-letter-textarea').fill('未投递的草稿');
  await page.getByRole('button', { name: '关闭信箱', exact: true }).click();
  await page.locator('#mailbox-group').focus(); await page.locator('#mailbox-group').press('Enter');
  await expect(page.locator('#compose-letter-textarea')).toHaveValue('未投递的草稿');
  await page.getByRole('button', { name: '关闭信箱', exact: true }).click();
  await page.getByRole('button', { name: '导出 短发 4 视图 SVG', exact: true }).click();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载总表 SVG', exact: true }).click();
  expect((await download).suggestedFilename()).toBe('character-shorthair-4views.svg');
  await page.getByRole('button', { name: '关闭导出窗口', exact: true }).click();
});
