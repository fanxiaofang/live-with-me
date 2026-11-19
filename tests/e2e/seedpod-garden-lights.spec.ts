import { test, expect } from '@playwright/test';

test('种荚灯与地面柔光一起移动并恢复，旧布局自动补齐灯具', async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.addInitScript(() => {
    if (!localStorage.getItem('live_with_me_yard_layout_v1')) {
      localStorage.setItem('live_with_me_yard_layout_v1', JSON.stringify({ version: 1,
        objects: { cottage_bird_garden: { dx: 12, dy: 8, angle: 0 } }, wearStrokes: [] }));
    }
  });
  await page.goto('/');
  await expect(page.locator('[data-garden-lamp]')).toHaveCount(5, { timeout: 60000 });
  await page.getByRole('button', { name: '夜晚', exact: true }).click();
  const lamp = page.locator('[data-yard-object="lamp_path_bend"]');
  const light = page.locator('[data-yard-attachment="lamp_path_bend"]');
  await expect(light.locator('ellipse')).toHaveCount(1);
  await expect(page.locator('[data-yard-object="cottage_bird_garden"]')).toHaveAttribute('transform', 'translate(12 8)');
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  const panel = page.getByRole('complementary', { name: '庭院布置', exact: true });
  await panel.getByLabel('选择庭院物件').selectOption('lamp_path_bend');
  await expect(lamp).toHaveAttribute('data-selected', 'true');
  await panel.getByRole('button', { name: '收起', exact: true }).click();
  const b = (await lamp.boundingBox())!;
  const point = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  await page.mouse.move(point.x, point.y);
  await page.mouse.down();
  await page.mouse.move(point.x + 18, point.y + 10, { steps: 3 });
  await page.mouse.up();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_yard_layout_v1')!).objects.lamp_path_bend);
  expect(saved.dx).toBeGreaterThan(0);
  expect(saved.dy).toBeGreaterThan(0);
  const transform = `translate(${saved.dx} ${saved.dy})`;
  await expect(lamp).toHaveAttribute('transform', transform);
  await expect(light).toHaveAttribute('transform', transform);
  await page.reload();
  await expect(lamp).toHaveAttribute('transform', transform, { timeout: 60000 });
  await expect(light).toHaveAttribute('transform', transform);
  await expect(page.locator('[data-yard-object="cottage_bird_garden"]')).toHaveAttribute('transform', 'translate(12 8)');
  expect(errors).toEqual([]);
});
