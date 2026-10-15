import { test, expect } from '@playwright/test';
import { DEFAULT_ROOM_LAYOUT } from '../../src/components/layout-gizmo/layoutStore';
import { stableScene } from './helpers';

for (const viewport of [{ width: 1200, height: 800 }, { width: 390, height: 844 }]) {
  test(`chair inspection preserves layout and uses the live desk at ${viewport.width}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    const layout = structuredClone(DEFAULT_ROOM_LAYOUT);
    layout['desk-laptop'].screen.x += 3;
    layout['desk-group'].screen.x += 2;
    await page.addInitScript(layout => localStorage.setItem('live_with_me_room_layout_v6', JSON.stringify(layout)), layout);
    await stableScene(page);
    const opener = page.getByRole('button', { name: '检视工位椅子 (空椅 / 组合态)', exact: true });
    const camera = await page.locator('#panoramic-world-stage').getAttribute('style');
    const stored = await page.evaluate(() => localStorage.getItem('live_with_me_room_layout_v6'));
    await opener.click();
    const dialog = page.getByRole('dialog', { name: '工位椅与桌前坐姿' });
    await expect(dialog).toBeVisible();
    const box = await dialog.boundingBox();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(viewport.width);
    const emptyBox = await dialog.getByRole('region', { name: '空椅画布', exact: true }).locator('svg').getAttribute('viewBox');
    const seatedBox = await dialog.getByRole('region', { name: '桌前坐姿画布', exact: true }).locator('svg').getAttribute('viewBox');
    expect(emptyBox).toBeTruthy();
    expect(emptyBox).toBe(seatedBox);
    const leftHand = page.locator('#isometric-chair-container #volumetric-left-hand');
    const actualPalm = await leftHand.locator('ellipse').nth(1).getAttribute('cx');
    const previewPalm = dialog.locator('[data-asset-id="volumetric-left-hand"] ellipse').nth(1);
    await expect(previewPalm).toHaveAttribute('cx', actualPalm!);
    await dialog.getByRole('button', { name: '查看桌椅关系', exact: true }).click();
    await dialog.getByRole('button', { name: '只看空椅', exact: true }).click();
    await expect(dialog.locator('[data-scene-character="chair-seated"]')).toHaveCount(0);
    await expect(page.locator('#isometric-chair-container #seated-character-body')).toHaveCount(1);
    await dialog.getByRole('button', { name: '显示就坐人物', exact: true }).click();
    await expect(page.locator('#isometric-chair-container #seated-character-body')).toHaveCount(1);
    await dialog.getByRole('button', { name: '查看桌椅关系', exact: true }).click();
    await expect(dialog.locator('[data-asset-id="attic-workdesk-container"]')).toHaveCount(1);
    const references = await dialog.evaluate(root => {
      const broken: string[] = [], duplicate: string[] = [];
      for (const node of root.querySelectorAll('[id]')) if (document.querySelectorAll(`[id="${node.id}"]`).length !== 1) duplicate.push(node.id);
      for (const svg of root.querySelectorAll('svg')) for (const node of svg.querySelectorAll('*')) for (const attr of node.attributes)
        for (const match of attr.value.matchAll(/url\(#([^)]*)\)/g)) if (!svg.querySelector(`[id="${match[1]}"]`)) broken.push(match[1]);
      return { broken, duplicate };
    });
    expect(references).toEqual({ broken: [], duplicate: [] });
    await dialog.getByRole('button', { name: '当前桌椅关系放大', exact: true }).click();
    await expect(dialog.getByLabel('当前桌椅关系倍率')).not.toHaveText('1.0×');
    expect(await page.locator('#panoramic-world-stage').getAttribute('style')).toBe(camera);
    expect(await page.evaluate(() => localStorage.getItem('live_with_me_room_layout_v6'))).toBe(stored);
    await dialog.getByRole('button', { name: '关闭工位椅查看', exact: true }).press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();
  });
}

test('an unoccupied workstation stays empty in the live desk preview', async ({ page }) => {
  await stableScene(page);
  await page.getByText('更换状态与装扮', { exact: true }).click();
  await page.getByRole('button', { name: /前廊.*Front Porch/ }).click();
  await page.locator('#confirm-status-btn').click();
  await page.getByRole('button', { name: '检视工位椅子 (空椅 / 组合态)', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: '工位椅与桌前坐姿' });
  await expect(dialog).toContainText('当前工位无人');
  await dialog.getByRole('button', { name: '查看桌椅关系', exact: true }).click();
  await expect(dialog.getByRole('button', { name: '只看空椅', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(dialog.getByRole('button', { name: '显示就坐人物', exact: true })).toBeDisabled();
  await dialog.getByRole('button', { name: '查看桌椅关系', exact: true }).click();
  await expect(dialog.locator('[data-asset-id="seated-character-body"]')).toHaveCount(0);
  await expect(page.locator('#isometric-chair-container #seated-character-body')).toHaveCount(0);
});

test('saved appearance is shared by the sitter and the chair inspection', async ({ page }) => {
  await stableScene(page);
  await page.getByText('更换状态与装扮', { exact: true }).click();
  const editor = page.locator('#status-picker-modal');
  await editor.getByRole('button', { name: '人物装扮', exact: true }).click();
  await editor.getByRole('button', { name: '健康暖棕', exact: true }).click();
  await editor.getByRole('button', { name: '复古赤陶', exact: true }).click();
  await editor.getByRole('button', { name: '鼠尾草绿', exact: true }).click();
  await editor.getByRole('button', { name: /偏分低束发/ }).click();
  await editor.getByRole('button', { name: '帽顶毛球：有', exact: true }).click();
  await page.locator('#confirm-status-btn').click();
  const body = page.locator('#isometric-chair-container #seated-character-body');
  await expect(body.locator('#volumetric-left-hand ellipse').nth(1)).toHaveAttribute('fill', '#d4a373');
  expect(await body.locator('[fill="#527c50"]').count()).toBeGreaterThan(0);
  expect(await body.locator('[fill="#9c5339"]').count()).toBeGreaterThan(0);
  await expect(body.locator('#beanie-pompom-back')).toHaveCount(0);
  await page.getByRole('button', { name: '检视工位椅子 (空椅 / 组合态)', exact: true }).click();
  const preview = page.getByRole('dialog', { name: '工位椅与桌前坐姿' }).locator('[data-asset-id="seated-character-body"]');
  await expect(preview.locator('[data-asset-id="volumetric-left-hand"] ellipse').nth(1)).toHaveAttribute('fill', '#d4a373');
  expect(await preview.locator('[fill="#527c50"]').count()).toBeGreaterThan(0);
  expect(await preview.locator('[fill="#9c5339"]').count()).toBeGreaterThan(0);
  await expect(preview.locator('[data-asset-id="beanie-pompom-back"]')).toHaveCount(0);
});

test('the second chair opens its own comparison and the two-person sample leaves real occupancy intact', async ({ page }, info) => {
  await stableScene(page);
  await page.locator('#retro-chair-root').dispatchEvent('click');
  const dialog = page.getByRole('dialog', { name: '工位椅与桌前坐姿' });
  await expect(dialog.getByRole('button', { name: '复古椅工位', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(dialog.locator('[data-chair-kind="retro"]')).toHaveCount(2);
  await expect(dialog).toContainText('当前工位无人');
  await dialog.getByRole('button', { name: '双人姿态样例', exact: true }).click();
  await expect(dialog.locator('[data-scene-character="chair-seated"]')).toHaveCount(2);
  await expect(page.locator('#panoramic-world-stage [data-scene-character="chair-seated"]')).toHaveCount(1);
  const references = await dialog.evaluate(root => {
    const broken: string[] = [], duplicate: string[] = [];
    for (const node of root.querySelectorAll('[id]')) if (document.querySelectorAll(`[id="${node.id}"]`).length !== 1) duplicate.push(node.id);
    for (const svg of root.querySelectorAll('svg')) for (const node of svg.querySelectorAll('*')) for (const attr of node.attributes)
      for (const match of attr.value.matchAll(/url\(#([^)]*)\)/g)) if (!svg.querySelector(`[id="${match[1]}"]`)) broken.push(match[1]);
    return { broken, duplicate };
  });
  expect(references).toEqual({ broken: [], duplicate: [] });
  await page.screenshot({ path: info.outputPath('desk-two-person-production-sample.png') });
  await dialog.getByRole('button', { name: '查看桌椅关系', exact: true }).click();
  await expect(dialog.locator('[data-scene-character="chair-seated"]')).toHaveCount(1);
  await dialog.getByRole('button', { name: '只看空椅', exact: true }).click();
  await expect(dialog.locator('[data-scene-character="chair-seated"]')).toHaveCount(0);
  await expect(page.locator('#panoramic-world-stage [data-scene-character="chair-seated"]')).toHaveCount(1);
});
