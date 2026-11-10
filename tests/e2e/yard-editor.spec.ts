import { test, expect } from '@playwright/test';

test('土地长宽与旋转可编辑，撤销后可恢复且拖动刷新保留尺寸', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const plot = page.locator('[data-yard-object="tilled_plot"]');
  const surface = plot.locator('[data-soil-surface]');
  await expect(surface).toHaveCount(1, { timeout: 60000 });
  const initialPath = await surface.getAttribute('d');
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  const panel = page.getByRole('complementary', { name: '庭院布置', exact: true });
  await panel.getByLabel('选择庭院物件').selectOption('tilled_plot');
  await panel.getByLabel('土地长度', { exact: true }).fill('150');
  await panel.getByLabel('土地宽度', { exact: true }).fill('175');
  const resizedPath = await surface.getAttribute('d');
  expect(resizedPath).not.toBe(initialPath);
  await panel.getByLabel('土地旋转', { exact: true }).fill('40');
  await expect(surface).not.toHaveAttribute('d', resizedPath!);
  await panel.getByRole('button', { name: '撤销庭院调整', exact: true }).click();
  await expect(surface).toHaveAttribute('d', resizedPath!);
  await panel.getByRole('button', { name: '重做庭院调整', exact: true }).click();
  await panel.getByRole('button', { name: '收起', exact: true }).click();
  const b = (await plot.boundingBox())!, x = b.x + b.width / 2, y = b.y + b.height / 2;
  await page.mouse.move(x, y); await page.mouse.down();
  await page.mouse.move(x + 40, y + 15, { steps: 5 }); await page.mouse.up();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_yard_layout_v1')!).objects.tilled_plot);
  expect(saved).toMatchObject({ length: 150, width: 175, angle: 40 });
  expect(saved.dx).toBeGreaterThan(0);
  expect(saved.dy).toBeGreaterThan(0);
  const finalPath = await surface.getAttribute('d');
  await page.reload();
  await expect(surface).toHaveAttribute('d', finalPath!, { timeout: 60000 });
  await expect(plot).toHaveAttribute('transform', `translate(${saved.dx} ${saved.dy})`);
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  await panel.getByLabel('选择庭院物件').selectOption('tilled_plot');
  await expect(panel.getByLabel('土地长度', { exact: true })).toHaveValue('150');
  await expect(panel.getByLabel('土地宽度', { exact: true })).toHaveValue('175');
  await expect(panel.getByLabel('土地旋转', { exact: true })).toHaveValue('40');
  await page.screenshot({ path: 'test-results/f3-tilled-plot/resize-controls.png', animations: 'disabled' });
  await panel.getByRole('button', { name: '还原此物件', exact: true }).click();
  await expect(surface).toHaveAttribute('d', initialPath!);
  await expect(panel.getByLabel('土地长度', { exact: true })).toHaveValue('100');
  await expect(panel.getByLabel('土地旋转', { exact: true })).toHaveValue('0');
});

test('开垦土地贴地显示，支持独立拖动并保存旧布局', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    if (!localStorage.getItem('live_with_me_yard_layout_v1')) localStorage.setItem('live_with_me_yard_layout_v1', JSON.stringify({
      version: 1, objects: { pumpkin: { dx: 12, dy: 0, angle: 0 } },
    }));
  });
  await page.goto('/');
  const plot = page.locator('[data-yard-object="tilled_plot"]');
  await expect(plot.locator('[data-soil-row]')).toHaveCount(5, { timeout: 60000 });
  await expect(plot).toHaveAttribute('pointer-events', 'none');
  expect(await page.locator('#yard-depth-layer > g').first().getAttribute('data-yard-slot')).toBe('tilled_plot');
  await page.getByRole('button', { name: '白天', exact: true }).click();
  await page.screenshot({ path: 'test-results/f3-tilled-plot/overview.png' });
  await plot.screenshot({ path: 'test-results/f3-tilled-plot/detail.png' });
  const dayColor = await plot.locator('[data-soil-surface]').getAttribute('fill');
  await page.getByRole('button', { name: '黄昏', exact: true }).click();
  await expect(plot.locator('[data-soil-surface]')).not.toHaveAttribute('fill', dayColor!);
  await plot.screenshot({ path: 'test-results/f3-tilled-plot/dusk.png' });
  await page.getByRole('button', { name: '夜晚', exact: true }).click();
  await plot.screenshot({ path: 'test-results/f3-tilled-plot/night.png' });
  await page.getByRole('button', { name: '白天', exact: true }).click();
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  const panel = page.getByRole('complementary', { name: '庭院布置', exact: true });
  await panel.getByLabel('选择庭院物件').selectOption('tilled_plot');
  await panel.getByRole('button', { name: '收起', exact: true }).click();
  const b = (await plot.boundingBox())!, x = b.x + b.width / 2, y = b.y + b.height / 2;
  const scale = await page.locator('#yard-depth-layer').evaluate(el => (el as SVGGraphicsElement).getScreenCTM()!.a);
  await page.mouse.move(x, y); await page.mouse.down();
  await page.mouse.move(x + 45, y + 25, { steps: 6 }); await page.mouse.up();
  const placement = await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_yard_layout_v1')!).objects.tilled_plot);
  expect(placement.dx).toBeCloseTo(45 / scale, 0);
  expect(placement.dy).toBeCloseTo(25 / scale, 0);
  await page.keyboard.press('Control+z'); await expect(plot).toHaveAttribute('transform', 'translate(0 0)');
  await page.keyboard.press('Control+Shift+z');
  await page.reload();
  await expect(plot).toHaveAttribute('transform', `translate(${placement.dx} ${placement.dy})`, { timeout: 60000 });
  await expect(page.locator('[data-yard-object="pumpkin"]')).toHaveAttribute('transform', 'translate(12 0)');
  expect(await page.locator('#yard-depth-layer > g').first().getAttribute('data-yard-slot')).toBe('tilled_plot');
});

test('庭院布置支持独立移动、缩放拖动、取消、历史、保存与房间导航', async ({ page }) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const stage = page.locator('#panoramic-world-stage');
  await expect(page.locator('[data-yard-object]')).toHaveCount(40, { timeout: 60000 });
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  const panel = page.getByRole('complementary', { name: '庭院布置', exact: true });
  const object = (id: string) => page.locator(`[data-yard-object="${id}"]`);
  const choose = async (id: string) => panel.getByLabel('选择庭院物件').selectOption(id);
  const saved = () => page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_yard_layout_v1') || '{}').objects);

  // Every editable family has its own placement; buildings retain their complete local group.
  for (const id of ['wooden_cabin', 'capsule_pod', 'observatory', 'pumpkin', 'beehive', 'sheep_pen', 'osmanthus', 'fence_west', 'fence_east', 'sheep_1', 'sheep_2', 'sheep_3', 'sheep_4', 'sheep_5']) {
    await choose(id); await panel.getByRole('button', { name: '向右移动', exact: true }).click();
    expect((await saved())[id].dx).toBe(5);
  }
  await choose('main_cottage');
  await expect(panel.getByText('大木屋作为庭院中心，位置已锁定。')).toBeVisible();
  expect((await saved()).main_cottage.dx).toBe(0);
  await choose('fence_west');
  const post = object('fence_west').locator('rect[height="32"]').first();
  const oldPost = await post.locator('..').getAttribute('transform');
  await panel.getByLabel('栅栏转向').fill('30');
  expect((await saved()).fence_west.angle).toBe(30);
  expect(await post.locator('..').getAttribute('transform')).not.toBe(oldPost);
  expect(await post.getAttribute('transform')).toBeNull();
  await panel.getByRole('button', { name: '恢复庭院默认布局', exact: true }).click();
  await panel.getByRole('button', { name: '恢复默认', exact: true }).click();
  await panel.getByRole('button', { name: '收起', exact: true }).click();

  const drag = async (id: string, dx: number, dy: number, cancel = false) => {
    const b = (await object(id).boundingBox())!;
    const x = b.x + b.width * .65, y = b.y + b.height * .6;
    const factor = await page.locator('#yard-depth-layer').evaluate(el => (el as SVGGraphicsElement).getScreenCTM()!.a);
    await page.mouse.move(x, y); await page.mouse.down();
    await page.mouse.move(x + dx, y + dy, { steps: 6 });
    if (cancel) await page.keyboard.press('Escape');
    await page.mouse.up();
    return factor;
  };
  const initialCamera = await stage.getAttribute('style');
  const scale = await drag('pumpkin', 65, 32);
  const pumpkin = (await saved()).pumpkin;
  expect(pumpkin.dx).toBeCloseTo(65 / scale, 0);
  expect(pumpkin.dy).toBeCloseTo(32 / scale, 0);
  expect(await stage.getAttribute('style')).toBe(initialCamera);
  expect((await saved()).wooden_cabin.dx).toBe(0);
  await drag('sheep_3', 25, -25, true);
  expect((await saved()).sheep_3.dx).toBe(0);
  await expect(panel).toBeVisible();
  await page.keyboard.press('Control+z');
  expect((await saved()).pumpkin.dx).toBe(0);
  await page.keyboard.press('Control+Shift+z');
  expect((await saved()).pumpkin.dx).toBe(pumpkin.dx);

  await panel.getByRole('button', { name: '展开', exact: true }).click();
  await choose('wooden_cabin'); await panel.getByRole('button', { name: '向右移动', exact: true }).click();
  await choose('osmanthus'); await panel.getByRole('button', { name: '向上移动', exact: true }).click();
  await expect(page.locator('[data-yard-attachment="osmanthus"]')).toHaveAttribute('transform', 'translate(0 -5)');
  await panel.getByRole('checkbox', { name: '显示通行参考线' }).check();
  await expect(page.locator('#yard-route-guide path')).toHaveCount(4);
  const downloadEvent = page.waitForEvent('download');
  await panel.getByRole('button', { name: '导出布局', exact: true }).click();
  expect((await downloadEvent).suggestedFilename()).toBe('live-with-me-yard-layout.json');
  await panel.getByRole('button', { name: '完成布置', exact: true }).click();
  await expect(page.locator('#yard-route-guide')).toHaveCount(0);
  const nav = page.getByRole('navigation', { name: '房间视角' });
  await nav.getByText('更多去处', { exact: true }).click();
  await nav.getByRole('button', { name: '林间小木屋', exact: true }).click();
  await expect(stage).toHaveAttribute('data-room', 'corn_lounge');
  await nav.getByRole('button', { name: '整栋小屋', exact: true }).click();

  // A second magnification exercises conversion through the live camera matrix.
  await page.mouse.move(700, 650); await page.mouse.wheel(0, -240);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  await panel.getByRole('button', { name: '收起', exact: true }).click();
  const previous = (await saved()).capsule_pod;
  const zoomScale = await drag('capsule_pod', 30, 15);
  const changed = (await saved()).capsule_pod;
  expect(changed.dx - previous.dx).toBeCloseTo(30 / zoomScale, 0);
  expect(changed.dy - previous.dy).toBeCloseTo(15 / zoomScale, 0);
  await page.reload();
  await expect(object('pumpkin')).toHaveAttribute('transform', `translate(${pumpkin.dx} ${pumpkin.dy})`, { timeout: 60000 });
  expect((await saved()).capsule_pod).toEqual(changed);
  expect(errors).toEqual([]);
});

test('草簇按群落拖动并保存，原有庭院布局可继续使用', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    if (!localStorage.getItem('live_with_me_yard_layout_v1')) localStorage.setItem('live_with_me_yard_layout_v1', JSON.stringify({
      version: 1, objects: { pumpkin: { dx: 12, dy: 0, angle: 0 } },
    }));
  });
  await page.goto('/');
  const grasses = page.locator('[data-yard-object^="grass_"]');
  await expect(grasses).toHaveCount(20, { timeout: 60000 });
  await expect(page.locator('[data-yard-object="pumpkin"]')).toHaveAttribute('transform', 'translate(12 0)');
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  const panel = page.getByRole('complementary', { name: '庭院布置', exact: true });
  for (const id of ['grass_perimeter_cabin-side', 'grass_outer_west']) {
    await panel.getByLabel('选择庭院物件').selectOption(id);
    await panel.getByRole('button', { name: '向右移动', exact: true }).click();
    await expect(page.locator(`[data-yard-object="${id}"]`)).toHaveAttribute('transform', 'translate(5 0)');
  }
  await panel.getByRole('button', { name: '收起', exact: true }).click();
  const target = page.locator('[data-yard-object="grass_foreground_right-inner"]');
  const b = (await target.boundingBox())!;
  const scale = await page.locator('#yard-depth-layer').evaluate(el => (el as SVGGraphicsElement).getScreenCTM()!.a);
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  await page.mouse.move(x, y); await page.mouse.down();
  await page.mouse.move(x - 30, y - 20, { steps: 5 }); await page.mouse.up();
  const offset = await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_yard_layout_v1')!).objects['grass_foreground_right-inner']);
  expect(offset.dx).toBeCloseTo(-30 / scale, 0);
  expect(offset.dy).toBeCloseTo(-20 / scale, 0);
  await expect(page.locator('[data-yard-object="grass_foreground_left-inner"]')).toHaveAttribute('transform', 'translate(0 0)');
  await page.keyboard.press('Control+z'); await expect(target).toHaveAttribute('transform', 'translate(0 0)');
  await page.keyboard.press('Control+Shift+z'); await expect(target).toHaveAttribute('transform', `translate(${offset.dx} ${offset.dy})`);
  await page.reload();
  await expect(target).toHaveAttribute('transform', `translate(${offset.dx} ${offset.dy})`, { timeout: 60000 });
  await expect(target).toHaveAttribute('pointer-events', 'none');
  await expect(page.locator('[data-yard-object="pumpkin"]')).toHaveAttribute('transform', 'translate(12 0)');
});

test('拆出的木屋前与胶囊仓后草簇保留现有位置且独立保存', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addInitScript(() => {
    if (!localStorage.getItem('live_with_me_yard_layout_v1')) localStorage.setItem('live_with_me_yard_layout_v1', JSON.stringify({ version: 1,
      objects: { wooden_cabin: { dx: -40, dy: 20, angle: 0 }, capsule_pod: { dx: 30, dy: 10, angle: 0 } } }));
  });
  await page.goto('/');
  const cabinGrass = page.locator('[data-yard-object="grass_detached_cabin-front"]');
  const podGrass = page.locator('[data-yard-object="grass_detached_pod-rear"]');
  await expect(cabinGrass).toHaveAttribute('transform', 'translate(-40 20)', { timeout: 60000 });
  await expect(podGrass).toHaveAttribute('transform', 'translate(30 10)');
  await expect(page.locator('[data-meadow-zone="cabin-transition"]')).toHaveCount(5);
  await expect(page.locator('[data-meadow-zone="pod-outer"]')).toHaveCount(4);
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  const panel = page.getByRole('complementary', { name: '庭院布置', exact: true });
  await panel.getByLabel('选择庭院物件').selectOption('wooden_cabin');
  await panel.getByRole('button', { name: '向左移动', exact: true }).click();
  await expect(cabinGrass).toHaveAttribute('transform', 'translate(-40 20)');
  await panel.getByLabel('选择庭院物件').selectOption('grass_detached_cabin-front');
  await panel.getByRole('button', { name: '向左移动', exact: true }).click();
  await expect(cabinGrass).toHaveAttribute('transform', 'translate(-45 20)');
  await panel.getByLabel('选择庭院物件').selectOption('grass_detached_pod-rear');
  await panel.getByRole('button', { name: '向上移动', exact: true }).click();
  await expect(podGrass).toHaveAttribute('transform', 'translate(30 5)');
  await page.screenshot({ path: 'test-results/f3-detached-grass/selected.png' });
  await page.reload();
  await expect(cabinGrass).toHaveAttribute('transform', 'translate(-45 20)', { timeout: 60000 });
  await expect(podGrass).toHaveAttribute('transform', 'translate(30 5)');
});

test('野餐素材显示在前景并支持整组拖动与保存', async ({ page }) => {
  test.setTimeout(90000);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const object = page.locator('[data-yard-object="picnic"]');
  await expect(object.locator('use')).toHaveAttribute('href', '#asset-country-picnic-scene', { timeout: 60000 });
  const original = (await object.boundingBox())!;
  expect(original.width).toBeGreaterThan(70);
  expect(original.height).toBeGreaterThan(30);
  await page.screenshot({ path: 'test-results/f3-picnic/overview.png' });
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  const panel = page.getByRole('complementary', { name: '庭院布置', exact: true });
  await panel.getByRole('button', { name: '收起', exact: true }).click();
  const b = (await object.boundingBox())!, x = b.x + b.width / 2, y = b.y + b.height / 2;
  const scale = await page.locator('#yard-depth-layer').evaluate(el => (el as SVGGraphicsElement).getScreenCTM()!.a);
  await page.mouse.move(x, y); await page.mouse.down();
  await page.mouse.move(x + 50, y - 20, { steps: 6 }); await page.mouse.up();
  const placement = await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_yard_layout_v1')!).objects.picnic);
  expect(placement.dx).toBeCloseTo(50 / scale, 0);
  expect(placement.dy).toBeCloseTo(-20 / scale, 0);
  await page.keyboard.press('Control+z'); await expect(object).toHaveAttribute('transform', 'translate(0 0)');
  await page.keyboard.press('Control+Shift+z'); await expect(object).toHaveAttribute('transform', `translate(${placement.dx} ${placement.dy})`);
  await page.reload();
  await expect(object).toHaveAttribute('transform', `translate(${placement.dx} ${placement.dy})`, { timeout: 60000 });
  await page.getByRole('button', { name: '夜晚', exact: true }).click();
  await expect(page.locator('#country-picnic')).toHaveAttribute('filter', 'url(#field-environment-tone)');
});
