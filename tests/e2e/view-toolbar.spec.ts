import { expect, test } from '@playwright/test';
import { selectView, stableScene } from './helpers';

test('right toolbar prioritizes three views, groups other destinations and hides redundant entries', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await stableScene(page);
  const nav = page.getByRole('navigation', { name: '房间视角' });
  const box = (await nav.boundingBox())!;
  expect(box.x).toBeGreaterThan(1600 - 220);
  expect(box.y).toBeGreaterThan(70);
  expect(box.y + box.height).toBeLessThan(830);
  for (const label of ['整栋小屋', '阁楼', '公共起居角']) await expect(nav.getByRole('button', { name: label, exact: true })).toBeVisible();
  for (const label of ['林木的书房', '我的阁楼房间', '前廊']) await expect(nav.getByRole('button', { name: label, exact: true })).toHaveCount(0);
  await expect(nav.getByRole('button', { name: '工作区', exact: true })).toHaveCount(0);
  await nav.getByText('更多去处', { exact: true }).click();
  for (const label of ['旧胶囊仓', '林间小木屋', '外星电波观测台']) await expect(nav.getByRole('button', { name: label, exact: true })).toBeVisible();
  await expect(nav.getByRole('button', { name: '工作区', exact: true })).toHaveCount(0);
  await nav.getByRole('button', { name: '阁楼', exact: true }).focus();
  await page.keyboard.press('Escape');
  const toggle = nav.getByRole('button', { name: '展开视角工具栏', exact: true });
  await expect(toggle).toBeFocused();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('#world-view-options')).toBeHidden();
  expect((await nav.boundingBox())!.width).toBeLessThanOrEqual(54);
});

test('loft targets the real upper deck and remains distinct from the ground-floor workspace', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await stableScene(page);
  await page.locator('#room-my_room').press('Enter');
  const stage = page.locator('#panoramic-world-stage');
  const workspace = await stage.getAttribute('style');
  await selectView(page, '阁楼');
  await expect(stage).toHaveAttribute('data-room', 'loft');
  expect(await stage.getAttribute('style')).not.toBe(workspace);
  const deck = (await page.locator('#seedpod-reading-loft').boundingBox())!;
  expect(deck.x).toBeGreaterThan(100);
  expect(deck.y).toBeGreaterThan(60);
  expect(deck.x + deck.width).toBeLessThan(1400);
  expect(deck.y + deck.height).toBeLessThan(840);
  await selectView(page, '整栋小屋');
  await page.locator('#room-loft').focus(); await page.keyboard.press('Enter');
  await expect(stage).toHaveAttribute('data-room', 'loft');
});

test('living view magnifies shared activities and an existing sofa selection highlights the same view', async ({ page }) => {
  await page.setViewportSize({ width: 1600, height: 900 });
  await stableScene(page);
  const overviewTable = (await page.locator('#isometric-tea-table').boundingBox())!;
  await selectView(page, '公共起居角');
  expect(Number(await page.locator('#panoramic-world-stage').getAttribute('data-zoom'))).toBeGreaterThan(1.3);
  const table = (await page.locator('#isometric-tea-table').boundingBox())!;
  expect(table.width).toBeGreaterThan(overviewTable.width * 2.5);
  expect(table.y + table.height).toBeLessThan(830);
  await page.locator('#room-friend_room').focus(); await page.keyboard.press('Enter');
  await expect(page.getByRole('navigation', { name: '房间视角' }).getByRole('button', { name: '公共起居角', exact: true })).toHaveAttribute('aria-current', 'page');
});

test('phone starts folded and choosing a view clears the scene again', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await stableScene(page);
  const toggle = page.getByRole('button', { name: '展开视角工具栏', exact: true });
  await expect(toggle).toBeVisible();
  const box = (await toggle.boundingBox())!;
  expect(box.width).toBeGreaterThanOrEqual(44);
  expect(box.height).toBeGreaterThanOrEqual(44);
  await selectView(page, '阁楼');
  await expect(page.locator('#panoramic-world-stage')).toHaveAttribute('data-room', 'loft');
  await expect(toggle).toBeVisible();
  await expect(page.locator('#world-view-options')).toBeHidden();
  await selectView(page, '公共起居角');
  await expect(page.locator('#panoramic-world-stage')).toHaveAttribute('data-room', 'living_nook');
  await expect(toggle).toBeVisible();
});

test('short screens can scroll every destination without pushing the toolbar out of view', async ({ page }) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await stableScene(page);
  await selectView(page, '外星电波观测台');
  const nav = page.getByRole('navigation', { name: '房间视角' });
  const box = (await nav.boundingBox())!;
  expect(box.y).toBeGreaterThan(40);
  expect(box.y + box.height).toBeLessThan(350);
  await expect(page.locator('#panoramic-world-stage')).toHaveAttribute('data-room', 'observatory');
});
