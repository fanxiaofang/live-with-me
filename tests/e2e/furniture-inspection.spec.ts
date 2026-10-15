import { expect, test, type Locator } from '@playwright/test';
import { DEFAULT_ROOM_LAYOUT } from '../../src/components/layout-gizmo/layoutStore';
import { stableScene } from './helpers';

test.use({ trace: 'off' });
const shelfDialog = (page: import('@playwright/test').Page) => page.getByRole('dialog', { name: '手作做旧粗原木书架 · 藏书插槽' });
const cabinetDialog = (page: import('@playwright/test').Page) => page.getByRole('dialog', { name: '咖啡与黑胶角' });

async function expectLocalIds(view: Locator) {
  expect(await view.evaluate(root => {
    const ids = [...root.querySelectorAll('[id]')].map(node => node.id);
    const collisions = ids.filter(id => document.querySelectorAll(`[id="${id}"]`).length !== 1);
    const broken: string[] = [];
    for (const node of root.querySelectorAll('*')) for (const attr of node.attributes) {
      for (const match of attr.value.matchAll(/url\(#([^)]*)\)/g)) {
        if (!root.querySelector(`[id="${match[1]}"]`)) broken.push(match[1]);
      }
    }
    return { collisions, broken };
  })).toEqual({ collisions: [], broken: [] });
}

test('bookshelf preview follows saved slot positions and presence borrowing without changing the world', async ({ page }) => {
  const layout = structuredClone(DEFAULT_ROOM_LAYOUT);
  layout['shelf-vase'].screen.x += 7;
  layout['shelf-tier2-books'].screen.x += 3;
  await page.addInitScript(layout => localStorage.setItem('live_with_me_room_layout_v6', JSON.stringify(layout)), layout);
  await stableScene(page);
  const world = page.locator('#living-cottage-haven');
  const before = await world.locator('[data-preview-item="tier5-vase-flowers"]').getAttribute('transform');
  const stored = await page.evaluate(() => localStorage.getItem('live_with_me_room_layout_v6'));
  const camera = await page.locator('#panoramic-world-stage').getAttribute('style');
  await page.getByRole('button', { name: '原木书架', exact: true }).click();
  const dialog = shelfDialog(page);
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-preview-item="tier5-vase-flowers"]')).toHaveAttribute('transform', before!);
  await expect(dialog.locator('[data-asset-id="shelf-tier-2-books-group"]')).toHaveAttribute('transform', 'translate(3, 0)');
  await expect(dialog.locator('[data-asset-id="book-slot-pulled-b-borges"]')).toHaveCount(1);
  await dialog.locator('[data-preview-item="b-borges"]').getByRole('button').press('Enter');
  await expect(dialog.getByRole('button', { name: '林木读完后归位' })).toBeDisabled();
  await expectLocalIds(dialog.locator('svg').first());
  await dialog.getByRole('button', { name: '书架细节视图恢复完整视图' }).click();
  await dialog.getByRole('button', { name: '书架细节视图放大' }).click();
  expect(await page.locator('#panoramic-world-stage').getAttribute('style')).toBe(camera);
  expect(await page.evaluate(() => localStorage.getItem('live_with_me_room_layout_v6'))).toBe(stored);
  await dialog.press('Escape');
  await expect(dialog).toHaveCount(0);
});

test('book selection refreshes borrowed details and SVG identifiers after returning a book', async ({ page }) => {
  await stableScene(page);
  await page.getByRole('button', { name: '原木书架', exact: true }).click();
  const dialog = shelfDialog(page);
  await dialog.locator('[data-preview-item="b-walden"]').getByRole('button').press('Enter');
  await dialog.getByRole('button', { name: '📖 抽出来在沙发翻读', exact: true }).click();
  await expect(dialog.getByRole('button', { name: '📥 放回书架插槽', exact: true })).toBeVisible();
  await expect(dialog.locator('[data-asset-id="book-slot-pulled-b-walden"]')).toHaveCount(1);
  await expect(page.locator('#living-cottage-haven #book-slot-pulled-b-walden')).toHaveCount(1);
  await expectLocalIds(dialog.locator('svg').first());
  await dialog.getByRole('button', { name: '📥 放回书架插槽', exact: true }).click();
  await expect(dialog.locator('[data-asset-id="book-item-b-walden"]')).toHaveCount(1);
  await expect(page.locator('#living-cottage-haven #book-item-b-walden')).toHaveCount(1);
  await dialog.getByRole('button', { name: /场景预设一键切换/ }).click();
  await dialog.getByRole('heading', { name: '新居初搬入', level: 3 }).click();
  await expect(dialog.getByLabel('书架细节视图倍率')).toHaveText('1.0×');
  await expectLocalIds(dialog.locator('svg').first());
  await dialog.getByRole('button', { name: '关闭书架' }).click();
});

test('cabinet inspection shares current part positions, supports focus, zoom and drag, and preserves editing', async ({ page }) => {
  const layout = structuredClone(DEFAULT_ROOM_LAYOUT);
  layout['honey-jar'].screen.x += 10;
  await page.addInitScript(layout => localStorage.setItem('live_with_me_room_layout_v6', JSON.stringify(layout)), layout);
  await stableScene(page);
  const world = page.locator('#living-cottage-haven');
  const expected = await world.locator('#cabinet-honey-jar').getAttribute('transform');
  const stored = await page.evaluate(() => localStorage.getItem('live_with_me_room_layout_v6'));
  await page.locator('#isometric-turntable-console').focus();
  await page.locator('#isometric-turntable-console').press('Enter');
  const dialog = cabinetDialog(page);
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('[data-preview-item="honey-jar"]')).toHaveAttribute('transform', expected!);
  await expectLocalIds(dialog.locator('svg').first());
  await dialog.getByRole('button', { name: '野花蜂蜜罐', exact: true }).click();
  const canvas = dialog.getByRole('region', { name: '柜子细节视图画布' });
  const before = await canvas.locator('svg').getAttribute('viewBox');
  await canvas.focus(); await canvas.press('ArrowRight');
  expect(await canvas.locator('svg').getAttribute('viewBox')).not.toBe(before);
  await dialog.getByRole('button', { name: '柜子细节视图恢复完整视图' }).click();
  await expect(dialog.getByLabel('柜子细节视图倍率')).toHaveText('1.0×');
  const bounds = (await canvas.boundingBox())!;
  const center = { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height / 2 };
  await page.mouse.move(center.x, center.y); await page.mouse.wheel(0, -150);
  await expect(dialog.getByLabel('柜子细节视图倍率')).not.toHaveText('1.0×');
  await page.mouse.move(center.x, center.y); await page.mouse.down();
  await page.mouse.move(center.x + 50, center.y + 20, { steps: 5 }); await page.mouse.up();
  await expect(dialog.getByRole('button', { name: '野花蜂蜜罐', exact: true })).toHaveAttribute('aria-pressed', 'true');
  expect(await page.evaluate(() => localStorage.getItem('live_with_me_room_layout_v6'))).toBe(stored);
  await dialog.press('Escape');
  await expect(page.locator('#isometric-turntable-console')).toBeFocused();
  await page.getByRole('button', { name: '全屋 2.5D 布局校准器', exact: true }).click();
  await page.locator('#cabinet-honey-jar').focus(); await page.locator('#cabinet-honey-jar').press('Enter');
  await expect(cabinetDialog(page)).toHaveCount(0);
  await expect(page.locator('#iso-interactive-gizmo')).toHaveCount(1);
});

test('mobile inspection keeps controls reachable and taps distinct from pinch gestures', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await stableScene(page);
  await page.getByRole('button', { name: '原木书架', exact: true }).click();
  const dialog = shelfDialog(page);
  const canvas = dialog.getByRole('region', { name: '书架细节视图画布' });
  const rect = (await canvas.boundingBox())!;
  expect(rect.width).toBeLessThan(390);
  await expect(dialog.getByRole('button', { name: '关闭书架' })).toBeInViewport();
  const client = await context.newCDPSession(page);
  await client.send('Emulation.setTouchEmulationEnabled', { enabled: true });
  const y = rect.y + rect.height / 2, x = rect.x + rect.width / 2;
  const touches = (spread: number) => [{ x: x - spread, y, id: 1 }, { x: x + spread, y, id: 2 }];
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: touches(20) });
  await client.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: touches(45) });
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(dialog.getByLabel('书架细节视图倍率')).not.toHaveText('1.0×');
  await dialog.getByRole('button', { name: '书架细节视图恢复完整视图' }).click();
  await expect(dialog.getByLabel('书架细节视图倍率')).toHaveText('1.0×');
  const target = dialog.locator('[data-preview-item="b-walden"]').getByRole('button');
  const book = (await target.boundingBox())!;
  await client.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: book.x + book.width / 2, y: book.y + book.height / 2, id: 3 }] });
  await client.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await expect(dialog.getByRole('heading', { name: '《瓦尔登湖手记》', level: 3 })).toBeVisible();
  await expectLocalIds(dialog.locator('svg').first());
});
