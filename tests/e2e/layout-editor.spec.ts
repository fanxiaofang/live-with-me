import { expect, test } from '@playwright/test';
import { DEFAULT_ROOM_LAYOUT } from '../../src/components/layout-gizmo/layoutStore';
import { stableScene } from './helpers';

for (const editing of [false, true]) {
  for (const [id, selector] of [['coffee-beans', '#cabinet-coffee-beans'], ['ceramic-cups', '#cabinet-ceramic-cups']] as const) {
    test(`cabinet ${id} hover and click with editor=${editing} preserve the world`, async ({ page }) => {
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      await stableScene(page);
      if (editing) await page.getByRole('button', { name: '全屋 2.5D 布局校准器', exact: true }).click();
      // Enter the actual cabinet child, rather than selecting it through the panel.
      const part = page.locator(selector);
      await part.dispatchEvent('mouseover');
      await expect(page.getByRole('tooltip')).toContainText(DEFAULT_ROOM_LAYOUT[id].name);
      await part.dispatchEvent('click');
      await expect(page.locator('#iso-interactive-gizmo')).toHaveCount(editing ? 1 : 0);
      await expect(page.locator('#panoramic-world-stage')).toBeVisible();
      await expect(page.getByRole('alert', { name: '页面运行错误' })).toHaveCount(0);
      expect(errors).toEqual([]);
      if (editing) {
        await page.getByRole('complementary', { name: '2.5D 室内全屋布局校准面板' }).getByRole('button', { name: '→', exact: true }).click();
        const saved = await page.evaluate(id => JSON.parse(localStorage.getItem('live_with_me_room_layout_v6')!)[id].screen.x, id);
        expect(saved).toBe(Number((DEFAULT_ROOM_LAYOUT[id].screen.x + 1).toFixed(1)));
      }
    });
  }
}

test('layout editor opens, selects and nudges every v6 item without unmounting the world', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await stableScene(page);
  const toggle = page.getByRole('button', { name: '全屋 2.5D 布局校准器', exact: true });
  const panel = page.getByRole('complementary', { name: '2.5D 室内全屋布局校准面板' });
  for (let i = 0; i < 3; i++) {
    await toggle.click();
    await expect(panel).toBeVisible();
    await expect(page.locator('#panoramic-world-stage')).toBeVisible();
    await panel.getByRole('button', { name: '关闭', exact: true }).click();
  }
  await toggle.click();
  for (const [id, item] of Object.entries(DEFAULT_ROOM_LAYOUT)) {
    await panel.getByText(item.name, { exact: true }).click();
    await panel.getByRole('button', { name: '→', exact: true }).click();
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_room_layout_v6')!));
    expect(saved[id].screen.x).toBe(item.screen.x + 1);
    await expect(page.locator('#panoramic-world-stage')).toBeVisible();
    expect(errors, `runtime errors after selecting ${id}`).toEqual([]);
  }
  await panel.getByRole('button', { name: '恢复默认', exact: true }).click();
  await expect(page.locator('#panoramic-world-stage')).toBeVisible();
  expect(errors).toEqual([]);
});

test('layout editor works inside a cross-origin sandboxed preview iframe', async ({ page }) => {
  test.skip(Boolean(test.info().config.metadata.productionPreview), 'The sandbox host is a development-only fixture');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/tests/fixtures/preview-host.html');
  const preview = page.frameLocator('#preview');
  await expect(preview.locator('#panoramic-world-stage')).toBeVisible();
  await preview.getByRole('button', { name: '全屋 2.5D 布局校准器', exact: true }).click();
  const panel = preview.getByRole('complementary', { name: '2.5D 室内全屋布局校准面板' });
  await expect(panel).toBeVisible();
  await panel.getByText(DEFAULT_ROOM_LAYOUT['cabinet-group'].name, { exact: true }).click();
  await panel.getByRole('button', { name: '→', exact: true }).click();
  await expect(preview.locator('#iso-interactive-gizmo')).toBeVisible();
  const handle = preview.locator('[data-gizmo-axis="free"]');
  const start = await handle.evaluate(element => {
    const point = new DOMPoint(0, 0).matrixTransform((element as SVGGraphicsElement).getScreenCTM()!);
    return { x: point.x, y: point.y };
  });
  await page.mouse.move(start.x, start.y); await page.mouse.down();
  await page.mouse.move(start.x + 20, start.y + 12); await page.mouse.up();
  const saved = await preview.locator('body').evaluate(() => JSON.parse(localStorage.getItem('live_with_me_room_layout_v6')!)['cabinet-group'].screen);
  expect(saved.x).not.toBe(-71);
  await expect(preview.locator('#panoramic-world-stage')).toBeVisible();
  expect(errors).toEqual([]);
});

test('every rendered furniture handle can drag and then keyboard-nudge without crashing', async ({ page }) => {
  test.setTimeout(180000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await stableScene(page);
  await page.getByRole('button', { name: '全屋 2.5D 布局校准器', exact: true }).click();
  const panel = page.getByRole('complementary', { name: '2.5D 室内全屋布局校准面板' });
  const camera = await page.locator('#panoramic-world-stage').getAttribute('style');
  for (const [id, item] of Object.entries(DEFAULT_ROOM_LAYOUT)) {
    await panel.getByText(item.name, { exact: true }).click();
    if (!(await page.locator('#iso-interactive-gizmo').count())) {
      expect(id).toBe('left-wall-poster');
      continue;
    }
    for (const [axis, x, y] of [['free', 0, 0], ['u', 14, -3.9928], ['v', 11.2, 3.192], ['w', 0, -14]] as const) {
      const handle = page.locator(`[data-gizmo-axis="${axis}"]`);
      const start = await handle.evaluate((element, point) => {
        const transformed = new DOMPoint(point.x, point.y).matrixTransform((element as SVGGraphicsElement).getScreenCTM()!);
        return { x: transformed.x, y: transformed.y };
      }, { x, y });
      await page.mouse.move(start.x, start.y);
      await page.mouse.down();
      // Keep the original occlusion: explicitly start capture for handles covered
      // by another asset, using the active native mouse pointer.
      await handle.dispatchEvent('pointerdown', { pointerId: 1, button: 0, buttons: 1, clientX: start.x, clientY: start.y });
      await page.mouse.move(start.x + 10, start.y + 8, { steps: 3 });
      await page.mouse.up();
      await expect(page.locator('#panoramic-world-stage')).toBeVisible();
      expect(errors, `${id} ${axis} drag`).toEqual([]);
      await expect(page.locator('#panoramic-world-stage')).toHaveAttribute('style', camera!);
    }
    const before = await page.evaluate(id => JSON.parse(localStorage.getItem('live_with_me_room_layout_v6')!)[id].screen.x, id);
    await page.keyboard.press('ArrowRight');
    const after = await page.evaluate(id => JSON.parse(localStorage.getItem('live_with_me_room_layout_v6')!)[id].screen.x, id);
    expect(after, `${id} keyboard nudge`).toBe(Number((before + 1).toFixed(1)));
    expect(errors, `${id} keyboard nudge`).toEqual([]);
  }
});

test('a native coffee cabinet drag commits its new position and survives reload', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await stableScene(page);
  await page.getByRole('button', { name: '全屋 2.5D 布局校准器', exact: true }).click();
  await page.getByRole('complementary', { name: '2.5D 室内全屋布局校准面板' }).getByText(DEFAULT_ROOM_LAYOUT['cabinet-group'].name, { exact: true }).click();
  const handle = page.locator('[data-gizmo-axis="free"]');
  const start = await handle.evaluate(element => {
    const point = new DOMPoint(0, 0).matrixTransform((element as SVGGraphicsElement).getScreenCTM()!);
    return { x: point.x, y: point.y };
  });
  await page.mouse.move(start.x, start.y); await page.mouse.down();
  await page.mouse.move(start.x + 20, start.y + 12, { steps: 4 }); await page.mouse.up();
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('live_with_me_room_layout_v6')!)['cabinet-group'].screen);
  expect(saved.x).toBeCloseTo(-72 + 20 / 0.66, 3);
  expect(saved.y).toBeCloseTo(75 + 12 / 0.66, 3);
  await page.reload();
  await expect(page.locator('#panoramic-world-stage')).toBeVisible();
  const transform = await page.locator('#isometric-turntable-console').getAttribute('transform');
  expect(transform).toBe(`translate(${saved.x}, ${saved.y})`);
  expect(errors).toEqual([]);
});
