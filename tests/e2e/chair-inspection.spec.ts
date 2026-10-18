import { test, expect } from '@playwright/test';
import { DEFAULT_ROOM_LAYOUT } from '../../src/components/layout-gizmo/layoutStore';
import { stableScene } from './helpers';

for (const width of [1200, 390]) test(`chair inspector shares the live pose and preserves layout at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  const layout = structuredClone(DEFAULT_ROOM_LAYOUT);
  layout['desk-laptop'].screen.x += 3;
  await page.addInitScript(value => localStorage.setItem('live_with_me_room_layout_v6', JSON.stringify(value)), layout);
  await stableScene(page);
  const saved = await page.evaluate(() => localStorage.getItem('live_with_me_room_layout_v6'));
  const camera = await page.locator('#panoramic-world-stage').getAttribute('style');
  const opener = page.getByRole('button', { name: '检视工位椅子 (空椅 / 组合态)', exact: true });
  await opener.click();
  const dialog = page.getByRole('dialog', { name: '工位椅与桌前坐姿' });
  const empty = dialog.getByRole('region', { name: '沙发空椅画布', exact: true });
  const seated = dialog.getByRole('region', { name: 'NW 上身入椅画布', exact: true });
  expect(await empty.locator('svg').getAttribute('viewBox')).toBe(await seated.locator('svg').getAttribute('viewBox'));
  const palm = await page.locator('#isometric-chair-container [data-sofa-arm="near"] [data-round-hand]').getAttribute('cx');
  await expect(seated.locator('[data-sofa-arm="near"] [data-round-hand]')).toHaveAttribute('cx', palm!);
  await dialog.getByRole('button', { name: '查看桌椅关系', exact: true }).click();
  await dialog.getByRole('button', { name: '只看空椅', exact: true }).click();
  await expect(dialog.locator('[data-sofa-upper-body]')).toHaveCount(0);
  await expect(page.locator('#isometric-chair-container [data-sofa-upper-body]')).toHaveCount(1);
  await dialog.getByRole('button', { name: '显示就坐人物', exact: true }).click();
  await expect(dialog.locator('[data-sofa-upper-body]')).toHaveCount(1);
  await dialog.getByRole('button', { name: '当前桌椅关系放大', exact: true }).click();
  await expect(dialog.getByLabel('当前桌椅关系倍率')).not.toHaveText('1.0×');
  expect(await dialog.evaluate(n => n.scrollWidth > n.clientWidth)).toBe(false);
  expect(await page.locator('#panoramic-world-stage').getAttribute('style')).toBe(camera);
  expect(await page.evaluate(() => localStorage.getItem('live_with_me_room_layout_v6'))).toBe(saved);
  await dialog.getByRole('button', { name: '关闭工位椅查看', exact: true }).press('Escape');
  await expect(opener).toBeFocused();
});

test('an unoccupied workstation stays empty in the live desk preview', async ({ page }) => {
  await stableScene(page);
  await page.getByText('更换状态与装扮', { exact: true }).click();
  await page.getByRole('button', { name: /前廊.*Front Porch/ }).click();
  await page.locator('#confirm-status-btn').click();
  await page.getByRole('button', { name: '检视工位椅子 (空椅 / 组合态)', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '工位椅与桌前坐姿' });
  await expect(dialog).toContainText('当前工位无人');
  await dialog.getByRole('button', { name: '查看桌椅关系', exact: true }).click();
  await expect(dialog.getByRole('button', { name: '显示就坐人物', exact: true })).toBeDisabled();
  await expect(dialog.locator('[data-sofa-upper-body]')).toHaveCount(0);
  await expect(page.locator('#isometric-chair-container [data-sofa-upper-body]')).toHaveCount(0);
});

test('saved appearance is shared by the sitter and chair inspection', async ({ page }) => {
  await stableScene(page);
  await page.getByText('更换状态与装扮', { exact: true }).click();
  const editor = page.locator('#status-picker-modal');
  await editor.getByRole('button', { name: '人物装扮', exact: true }).click();
  for (const name of ['健康暖棕', '复古赤陶', '鼠尾草绿']) await editor.getByRole('button', { name, exact: true }).click();
  await editor.getByRole('button', { name: /偏分低束发/ }).click();
  await editor.getByRole('button', { name: '帽顶毛球：有', exact: true }).click();
  await page.locator('#confirm-status-btn').click();
  const liveHead = page.locator('#isometric-chair-container [data-windsor-head]');
  await expect(liveHead).toHaveAttribute('data-nw-hairstyle', 'sidepart');
  await expect(liveHead).toHaveAttribute('data-nw-pompom', 'false');
  const colors = await liveHead.evaluate(n => { const s = getComputedStyle(n); return ['--nw-skin', '--nw-hat', '--nw-hair'].map(k => s.getPropertyValue(k)); });
  await page.getByRole('button', { name: '检视工位椅子 (空椅 / 组合态)', exact: true }).click();
  const previewHead = page.getByRole('dialog').locator('[data-windsor-head]');
  await expect(previewHead).toHaveAttribute('data-nw-hairstyle', 'sidepart');
  await expect(previewHead).toHaveAttribute('data-nw-pompom', 'false');
  expect(await previewHead.evaluate(n => { const s = getComputedStyle(n); return ['--nw-skin', '--nw-hat', '--nw-hair'].map(k => s.getPropertyValue(k)); })).toEqual(colors);
});
