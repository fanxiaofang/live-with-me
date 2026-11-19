import { test, expect } from '@playwright/test';

test('左墙风铃替换为柱上铜铃，旧默认位置迁移且校准可保存', async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.addInitScript(() => {
    if (!localStorage.getItem('live_with_me_room_layout_v6')) localStorage.setItem('live_with_me_room_layout_v6', JSON.stringify({
      'craft-wind-chime': { screen: { x: -72, y: -36 } },
    }));
  });
  await page.goto('/');
  const bell = page.locator('[data-cottage-copper-bell]');
  await expect(bell).toHaveAttribute('transform', 'translate(-266 45)', { timeout: 60000 });
  await expect(page.locator('#left-wall-craft-board #craft-wind-chime')).toHaveCount(0);
  await expect(page.locator('#chimeEmeraldGrad')).toHaveCount(0);
  await page.getByRole('button', { name: '全屋 2.5D 布局校准器', exact: true }).click();
  const panel = page.getByRole('complementary', { name: '2.5D 室内全屋布局校准面板', exact: true });
  await panel.getByText('左侧支撑柱小铜铃', { exact: true }).click();
  await expect(bell.locator('#iso-interactive-gizmo')).toHaveCount(1);
  await panel.getByRole('button', { name: '→', exact: true }).click();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_room_layout_v6')!)['craft-wind-chime'].screen);
  expect(saved.x).toBeGreaterThan(-266);
  await page.reload();
  await expect(bell).toHaveAttribute('transform', `translate(${saved.x} ${saved.y})`, { timeout: 60000 });
  expect(errors).toEqual([]);
});
