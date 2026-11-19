import { test, expect } from '@playwright/test';

const storage = 'live_with_me_yard_layout_v1';

test('同朝向土地可重复添加，保留旧布局并支持收回、历史和刷新', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    if (!localStorage.getItem('live_with_me_yard_layout_v1')) localStorage.setItem('live_with_me_yard_layout_v1', JSON.stringify({version: 1, objects: {
      tilled_plot: { dx: 25, dy: 10, angle: 20, length: 125, width: 150, crop: 'carrot' },
    }}));
  });
  await page.goto('/');
  const plots = page.locator('[data-material="turned-soil"]');
  await expect(plots).toHaveCount(3, { timeout: 60000 });
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  const panel = page.getByRole('complementary', { name: '庭院布置', exact: true });
  const add = panel.getByRole('button', { name: /添加东西向土地/ });
  await add.click();
  await expect(plots).toHaveCount(4);
  await expect(panel.getByLabel('选择庭院物件')).toHaveValue('tilled_plot_2');
  await panel.getByLabel('土地长度', { exact: true }).fill('145');
  await panel.getByRole('button', { name: '向右移动', exact: true }).click();
  await add.click();
  await expect(plots).toHaveCount(5);
  await panel.getByRole('button', { name: '撤销庭院调整', exact: true }).click();
  await expect(plots).toHaveCount(4);
  await panel.getByRole('button', { name: '重做庭院调整', exact: true }).click();
  await expect(plots).toHaveCount(5);
  await panel.getByRole('button', { name: '收回这块土地', exact: true }).click();
  await expect(plots).toHaveCount(4);
  await page.reload();
  await expect(plots).toHaveCount(4, { timeout: 60000 });
  const objects = await page.evaluate(key => JSON.parse(localStorage.getItem(key)!).objects, storage);
  expect(objects.tilled_plot).toMatchObject({ dx: 25, dy: 10, angle: 20, length: 125, width: 150, crop: 'carrot' });
  expect(objects.tilled_plot_2).toMatchObject({ length: 145, dx: 75, dy: 40 });
  expect(objects.tilled_plot_3.removed).toBe(true);
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  await expect(add).toContainText('2/8');
  expect(await page.locator('[id^="tilled-garden-plot"]').evaluateAll(nodes => new Set(nodes.map(n => n.id)).size)).toBe(4);
  await page.screenshot({ path: 'test-results/yard-materials/land-editor.png', animations: 'disabled' });
  expect(errors).toEqual([]);
});

test('铺装素材状态明确，可覆盖命中区连续添加、结束后拖动及保存', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  // This interaction case starts with empty paving, independent of the scene preset.
  await page.addInitScript(() => {
    if (!localStorage.getItem('live_with_me_yard_layout_v1')) localStorage.setItem('live_with_me_yard_layout_v1', JSON.stringify({ version: 1, objects: {}, wearStrokes: [] }));
  });
  await page.goto('/');
  const original = page.locator('[data-yard-object="tilled_plot"]');
  await expect(original).toBeVisible({ timeout: 60000 });
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  const panel = page.getByRole('complementary', { name: '庭院布置', exact: true });
  const area = panel.locator('[aria-label="道路铺装素材"]');
  const stone = area.getByRole('button', { name: '不规则田野石', exact: true });
  const brick = area.getByRole('button', { name: '红褐旧砖', exact: true });
  await stone.click();
  await panel.getByRole('button', { name: '收起', exact: true }).click();
  // Hit the existing land's interior, then the newly placed paving itself.
  const b = (await original.boundingBox())!;
  const point = { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  await page.mouse.click(point.x, point.y);
  await page.mouse.click(point.x, point.y);
  await expect(page.locator('[data-paving-piece="fieldstone"]')).toHaveCount(2);
  await panel.getByRole('button', { name: '展开', exact: true }).click();
  await brick.click();
  await expect(stone).toHaveAttribute('aria-pressed', 'false');
  await expect(brick).toHaveAttribute('aria-pressed', 'true');
  await panel.getByRole('button', { name: '收起', exact: true }).click();
  await page.mouse.click(point.x + 80, point.y + 25);
  await page.keyboard.press('Escape');
  await expect(page.locator('[data-paving-placement-surface]')).toHaveCount(0);
  await expect(panel).toBeVisible();
  const piece = page.locator('[data-yard-object="paving_3"]');
  const pb = (await piece.boundingBox())!;
  await page.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2);
  await page.mouse.down();
  await page.mouse.move(pb.x + pb.width / 2 + 40, pb.y + pb.height / 2 + 15, { steps: 4 });
  await page.mouse.up();
  await panel.getByRole('button', { name: '展开', exact: true }).click();
  await expect(panel.getByLabel('选择庭院物件')).toHaveValue('paving_3');
  const before = await piece.getAttribute('transform');
  await panel.getByLabel('此块道路尺寸').selectOption('large');
  await panel.getByRole('button', { name: '还原尺寸与朝向', exact: true }).click();
  await expect(piece).toHaveAttribute('transform', before!);
  await expect(piece.locator('[data-paving-piece]')).toHaveAttribute('data-paving-piece', 'brick');
  await expect(panel.getByLabel('此块道路尺寸')).toHaveValue('medium');
  await page.screenshot({ path: 'test-results/yard-materials/paving-editor.png', animations: 'disabled' });
  await page.reload();
  await expect(page.locator('[data-paving-piece]')).toHaveCount(3, { timeout: 60000 });
  await expect(piece).toHaveAttribute('transform', before!, { timeout: 60000 });
  expect(errors).toEqual([]);
});

test('木屋和桂花树范围内的景石与砖块可直接选中、拖动及收回', async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    if (!localStorage.getItem('live_with_me_yard_layout_v1')) localStorage.setItem('live_with_me_yard_layout_v1', JSON.stringify({
      version: 1, objects: {
        paving_1: { dx: 540, dy: 450, angle: 30, material: 'rawGranite', pavingSize: 'large' },
        paving_2: { dx: 295, dy: 560, angle: 0, material: 'brick' },
      },
    }));
  });
  await page.goto('/');
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  const panel = page.getByRole('complementary', { name: '庭院布置', exact: true });
  for (const [id, blocker] of [['paving_1', 'main_cottage'], ['paving_2', 'osmanthus']]) {
    await panel.getByRole('button', { name: '收起', exact: true }).click();
    const hit = page.locator(`[data-paving-hit="${id}"]`);
    await expect(hit).toBeVisible({ timeout: 60000 });
    const box = (await hit.locator('rect').first().boundingBox())!;
    const point = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    const obstruction = (await page.locator(`[data-yard-object="${blocker}"]`).boundingBox())!;
    expect(point.x).toBeGreaterThan(obstruction.x);
    expect(point.x).toBeLessThan(obstruction.x + obstruction.width);
    expect(point.y).toBeGreaterThan(obstruction.y);
    expect(point.y).toBeLessThan(obstruction.y + obstruction.height);
    await page.mouse.move(point.x, point.y); await page.mouse.down();
    await page.mouse.move(point.x + 20, point.y + 8, { steps: 3 }); await page.mouse.up();
    const moved = (await hit.locator('rect').first().boundingBox())!;
    expect(moved.x).toBeCloseTo(box.x + 20, 0);
    await panel.getByRole('button', { name: '展开', exact: true }).click();
    await expect(panel.getByLabel('选择庭院物件')).toHaveValue(id);
    await panel.getByRole('button', { name: '收回这块铺装', exact: true }).click();
    await expect(page.locator(`[data-yard-object="${id}"]`)).toHaveCount(0);
    await expect(hit).toHaveCount(0);
  }
  await panel.getByRole('button', { name: '撤销庭院调整', exact: true }).click();
  await expect(page.locator('[data-paving-hit="paving_2"]')).toHaveCount(1);
  await page.reload();
  await expect(page.locator('[data-yard-object="paving_2"]')).toBeVisible({ timeout: 60000 });
  await expect(page.locator('[data-yard-object="paving_1"]')).toHaveCount(0);
  await expect(page.locator('[data-paving-hit]')).toHaveCount(0);
  expect(errors).toEqual([]);
});
