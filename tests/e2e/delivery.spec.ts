import { test, expect } from '@playwright/test';
import { stableScene } from './helpers';
test('bookshelf panel receives its preset and can add and inspect a book', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await stableScene(page);
  await page.locator('#isometric-bookshelf').focus();
  await page.locator('#isometric-bookshelf').press('Enter');
  const presets = page.getByRole('button', { name: /场景预设一键切换/ });
  await expect(presets).toContainText('经典温馨生活感');
  await presets.click();
  await page.getByRole('heading', { name: '林木借读状态', exact: true }).click();
  await expect(presets).toContainText('林木借读状态');
  await page.getByRole('button', { name: '插放新书/便笺' }).click();
  await page.getByPlaceholder('例如：《夏日晚风手记》或《给你的留言便笺》').fill('回归测试手记');
  await page.getByRole('button', { name: '安放到书架' }).click();
  await page.getByRole('heading', { name: '《回归测试手记》', exact: true }).click();
  await expect(page.getByText('书籍插槽检视', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: '收起', exact: true }).click();
  await expect(page.getByText('书籍插槽检视', { exact: true })).toHaveCount(0);
  await page.getByRole('button', { name: '关闭书架', exact: true }).click();
  await expect(page.locator('#panoramic-world-stage')).toBeVisible();
  expect(errors).toEqual([]);
});

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
