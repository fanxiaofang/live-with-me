import { test, expect } from '@playwright/test';

test('木屋两侧花草与生活摆设独立注册、拖动并恢复保存', async ({ page }) => {
  // Aggregate budget includes four local art captures after both save checks.
  test.setTimeout(240000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await expect(page.locator('[data-cottage-garden]')).toHaveCount(3, { timeout: 60000 });
  await page.getByRole('button', { name: '白天', exact: true }).click();
  await page.screenshot({ path: 'test-results/cottage-garden/scene.png', animations: 'disabled' });
  await page.getByRole('button', { name: '布置庭院', exact: true }).click();
  const panel = page.getByRole('complementary', { name: '庭院布置', exact: true });
  const choose = panel.getByLabel('选择庭院物件');
  for (const id of ['cottage_potting_corner', 'cottage_bird_garden', 'cottage_firewood']) {
    await choose.selectOption(id);
    await expect(page.locator(`[data-yard-object="${id}"]`)).toHaveAttribute('data-selected', 'true');
  }
  await choose.selectOption('cottage_bird_garden');
  await panel.getByRole('button', { name: '收起', exact: true }).click();
  const bench = page.locator('[data-yard-object="cottage_bird_garden"]');
  const origin = (await bench.getAttribute('transform'))!.match(/-?\d+(?:\.\d+)?/g)!.map(Number);
  const before = (await bench.boundingBox())!;
  const point = { x: before.x + before.width / 2, y: before.y + before.height / 2 };
  await page.mouse.move(point.x, point.y); await page.mouse.down();
  await page.mouse.move(point.x + 25, point.y + 12, { steps: 3 }); await page.mouse.up();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_yard_layout_v1')!).objects.cottage_bird_garden);
  expect(saved.dx).toBeGreaterThan(origin[0]);
  expect(saved.dy).toBeGreaterThan(origin[1]);
  await page.getByRole('button', { name: '全屋 2.5D 布局校准器', exact: true }).click();
  const indoor = page.getByRole('complementary', { name: '2.5D 室内全屋布局校准面板', exact: true });
  await indoor.getByText('沙发旁原木小圆边几（含茶具）', { exact: true }).click();
  await expect(page.locator('#cottage-sofa-side-table #iso-interactive-gizmo')).toHaveCount(1);
  await indoor.getByRole('button', { name: '→', exact: true }).click();
  const roomSaved = await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_room_layout_v6')!)['sofa-side-table'].screen);
  expect(roomSaved.x).toBe(111);
  await indoor.getByRole('button', { name: '关闭', exact: true }).click();
  await page.reload();
  await expect(page.locator('#cottage-sofa-side-table')).toHaveAttribute('transform', `translate(${roomSaved.x}, ${roomSaved.y})`, { timeout: 60000 });
  await expect(page.locator('[data-yard-object="cottage_tea_bench"]')).toHaveCount(0);
  await expect(bench).toHaveAttribute('transform', `translate(${saved.dx} ${saved.dy})`, { timeout: 60000 });
  await page.addStyleTag({ content: '*{animation:none!important;transition:none!important}' });
  // One browser session supplies actual-size and local material reviews for all affected assets.
  for (const [name, selector] of [
    ['potting', '[data-cottage-garden="cottage_potting_corner"]'],
    ['firewood', '[data-cottage-garden="cottage_firewood"]'],
    ['bird-garden', '[data-cottage-garden="cottage_bird_garden"]'],
    ['side-table', '#cottage-sofa-side-table'],
  ]) {
    const original = await page.evaluate(selector => {
      const target = document.querySelector(selector) as SVGGraphicsElement;
      const b = target.getBoundingClientRect();
      const stage = document.querySelector('#panoramic-world-stage') as SVGGraphicsElement;
      const parent = DOMMatrix.fromMatrix((stage.parentElement as unknown as SVGGraphicsElement).getScreenCTM()!);
      const matrix = DOMMatrix.fromMatrix(stage.getScreenCTM()!);
      const previous = { transform: stage.style.transform, origin: stage.style.transformOrigin };
      const scale = Math.min(4, (innerWidth - 120) / b.width, (innerHeight - 160) / b.height);
      stage.style.transformOrigin = '0px 0px';
      stage.style.transform = parent.inverse().multiply(new DOMMatrix().translate(innerWidth / 2, innerHeight * .56).scale(scale).translate(-b.x - b.width / 2, -b.y - b.height / 2).multiply(matrix)).toString();
      return previous;
    }, selector);
    await page.screenshot({ path: `test-results/cottage-garden/review-${name}.png`, animations: 'disabled' });
    await page.evaluate(previous => {
      const stage = document.querySelector('#panoramic-world-stage') as SVGGraphicsElement;
      stage.style.transform = previous.transform;
      stage.style.transformOrigin = previous.origin;
    }, original);
  }
  await page.getByRole('button', { name: '夜晚', exact: true }).click();
  await page.screenshot({ path: 'test-results/cottage-garden/scene-night.png', animations: 'disabled' });
  expect(errors).toEqual([]);
});
