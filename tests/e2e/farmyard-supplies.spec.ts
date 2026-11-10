import { test, expect } from '@playwright/test';

test('农务角落兼容旧布局，三组物件可独立布置、撤销并刷新恢复', async ({ page }) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({ width: 1600, height: 1100 });
  await page.addInitScript(() => {
    if (!localStorage.getItem('live_with_me_yard_layout_v1')) localStorage.setItem('live_with_me_yard_layout_v1', JSON.stringify({
      version: 1, objects: { sheep_pen: { dx: 10, dy: 0, angle: 0 } },
    }));
  });
  await page.goto('/');
  const object = (id: string) => page.locator(`[data-yard-object="${id}"]`);
  await expect(object('supply_shed').locator('[data-feed-sack]')).toHaveCount(3, { timeout: 60000 });
  await expect(object('hand_pump').locator('[data-water-bucket]')).toHaveCount(3);
  await expect(object('wild_sunflowers').locator('[data-wild-sunflower]')).toHaveCount(6);
  await expect(object('sheep_pen')).toHaveAttribute('transform', 'translate(10 0)');
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  const panel = page.getByRole('complementary', { name: '庭院布置', exact: true });
  for (const id of ['supply_shed', 'hand_pump', 'wild_sunflowers']) {
    await panel.getByLabel('选择庭院物件').selectOption(id);
    await panel.getByRole('button', { name: '向右移动', exact: true }).click();
    await expect(object(id)).toHaveAttribute('transform', 'translate(5 0)');
  }
  await panel.getByRole('button', { name: '撤销庭院调整', exact: true }).click();
  await expect(object('wild_sunflowers')).toHaveAttribute('transform', 'translate(0 0)');
  await panel.getByRole('button', { name: '重做庭院调整', exact: true }).click();
  await panel.getByRole('button', { name: '收起', exact: true }).click();
  const shed = object('supply_shed');
  const b = (await shed.boundingBox())!;
  const x = b.x + b.width * .5, y = b.y + b.height * .18;
  expect(await page.evaluate(({x,y}) => document.elementFromPoint(x,y)?.closest('[data-yard-object]')?.getAttribute('data-yard-object'), {x,y})).toBe('supply_shed');
  await page.mouse.move(x, y); await page.mouse.down();
  await page.mouse.move(x + 28, y + 12, { steps: 5 }); await page.mouse.up();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_yard_layout_v1')!).objects);
  expect(saved.supply_shed.dx).toBeGreaterThan(5);
  expect(saved.supply_shed.dy).toBeGreaterThan(0);
  expect(saved.hand_pump).toMatchObject({ dx: 5, dy: 0 });
  expect(saved.wild_sunflowers).toMatchObject({ dx: 5, dy: 0 });
  await page.reload();
  await expect(shed).toHaveAttribute('transform', `translate(${saved.supply_shed.dx} ${saved.supply_shed.dy})`, { timeout: 60000 });
  for (const id of ['hand_pump', 'wild_sunflowers']) await expect(object(id)).toHaveAttribute('transform', 'translate(5 0)');
  await expect(object('sheep_pen')).toHaveAttribute('transform', 'translate(10 0)');
  expect(errors).toEqual([]);
});
