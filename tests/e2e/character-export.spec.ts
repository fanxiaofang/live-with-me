import fs from 'node:fs/promises';
import { test, expect } from '@playwright/test';
import { stableScene } from './helpers';

test('opposite tea sitters face their cups toward the table using the exported side body', async ({ page }, testInfo) => {
  await stableScene(page);
  await page.getByText('更换状态与装扮', { exact: true }).click();
  await page.locator('#status-picker-modal').getByRole('button', { name: /公共起居角/ }).click();
  await page.locator('#confirm-status-btn').click();
  const tea = page.locator('[data-scene-character="tea-seated"]');
  await expect(tea).toHaveCount(2);
  await expect(tea.locator('[data-seated-side-body]')).toHaveCount(2);
  await expect(tea.locator('[data-seated-cup]')).toHaveCount(2);
  const cupDirections = await tea.evaluateAll(actors => actors.map(actor => {
    const group = actor as SVGGElement;
    const cup = group.querySelector<SVGEllipseElement>('[data-seated-cup] ellipse')!;
    const point = new DOMPoint(cup.cx.baseVal.value, cup.cy.baseVal.value).matrixTransform(cup.getScreenCTM()!);
    const center = new DOMPoint(0, 0).matrixTransform(group.getScreenCTM()!);
    return { slot: group.closest('[id^="tea-slot-"]')!.id, direction: Math.sign(point.x - center.x) };
  }));
  expect(cupDirections).toEqual([
    { slot: 'tea-slot-tea_cushion_east', direction: -1 },
    { slot: 'tea-slot-tea_cushion_west', direction: 1 },
  ]);
  await page.getByRole('button', { name: '公共起居角', exact: true }).click();
  await page.screenshot({ path: testInfo.outputPath('tea-side-pair.png') });
  const cushion = await page.locator('#tea-slot-tea_cushion_east').boundingBox();
  await page.screenshot({ path: testInfo.outputPath('tea-cushion-closeup.png'),
    clip: { x: cushion!.x - 18, y: cushion!.y - 12, width: cushion!.width + 36, height: cushion!.height + 38 }, scale: 'css' });
});

test('tea robes rest centrally on a shared cushion plane with a continuous thickness and floor shadow', async ({ page }, testInfo) => {
  await stableScene(page);
  const measureContacts = () => page.locator('[id^="tea-slot-"]').evaluateAll(slots => slots.map(slot => {
    const parent = slot as SVGGElement;
    const inverse = parent.getScreenCTM()!.inverse();
    const top = parent.querySelector<SVGEllipseElement>('[data-cushion-top]')!;
    const hem = parent.querySelector<SVGEllipseElement>('[data-robe-hem]');
    const side = parent.querySelector<SVGPathElement>('[data-cushion-side]')!.getBBox();
    const shadow = parent.querySelector<SVGEllipseElement>('[data-cushion-ground-shadow]')!;
    const contact = parent.querySelector<SVGPathElement>('[data-cushion-ground-contact]')!.getBBox();
    const topY = top.cy.baseVal.value, radiusY = top.ry.baseVal.value;
    const bounds = hem?.getBBox();
    const matrix = hem ? inverse.multiply(hem.getScreenCTM()!) : undefined;
    const center = hem && matrix ? new DOMPoint(hem.cx.baseVal.value, hem.cy.baseVal.value).matrixTransform(matrix) : undefined;
    return { id: parent.id, topY, ratio: radiusY / top.rx.baseVal.value,
      sideBottom: side.y + side.height, contactBottom: contact.y + contact.height,
      shadowBottom: shadow.cy.baseVal.value + shadow.ry.baseVal.value,
      thickness: side.y + side.height - topY - radiusY,
      hem: center && bounds && matrix ? { x: center.x, y: center.y,
        rx: bounds.width / 2 * Math.hypot(matrix.a, matrix.b),
        ry: bounds.height / 2 * Math.hypot(matrix.c, matrix.d) } : undefined,
      topRx: top.rx.baseVal.value, topRy: radiusY };
  }));
  const check = (rows: Awaited<ReturnType<typeof measureContacts>>) => {
    expect(rows).toHaveLength(3);
    for (const row of rows) {
      expect(row.thickness, row.id).toBeCloseTo(2, 5);
      expect(row.contactBottom - row.sideBottom, row.id).toBeGreaterThan(0);
      expect(row.contactBottom - row.sideBottom, row.id).toBeLessThan(0.3);
      expect(row.shadowBottom - row.sideBottom, row.id).toBeGreaterThan(0);
      expect(row.shadowBottom - row.sideBottom, row.id).toBeLessThan(0.5);
      if (row.hem) {
        expect(row.hem.x, `${row.id}: centered horizontally`).toBeCloseTo(0, 5);
        expect(row.hem.y, `${row.id}: centered on seat`).toBeCloseTo(row.topY, 5);
        expect(row.hem.ry / row.hem.rx, `${row.id}: same viewing plane`).toBeCloseTo(row.ratio, 5);
        expect(row.hem.rx).toBeLessThan(row.topRx);
        expect(row.hem.ry).toBeLessThan(row.topRy);
      }
    }
  };
  const initial = await measureContacts();
  check(initial);
  expect(initial.filter(row => row.hem)).toHaveLength(1);
  await page.getByText('更换状态与装扮', { exact: true }).click();
  await page.locator('#status-picker-modal').getByRole('button', { name: /公共起居角/ }).click();
  await page.locator('#confirm-status-btn').click();
  const occupied = await measureContacts();
  check(occupied);
  expect(occupied.filter(row => row.hem)).toHaveLength(2);
  await page.getByRole('button', { name: '公共起居角', exact: true }).click();
  await page.screenshot({ path: testInfo.outputPath('tea-cushion-plane.png') });
});

test('scene poses share head size while retaining furniture contacts and standing scale', async ({ page }, testInfo) => {
  await stableScene(page);
  const measure = () => page.evaluate(() => {
    const stage = document.querySelector<SVGGElement>('#panoramic-world-stage')!;
    const inverse = stage.getScreenCTM()!.inverse();
    return [...document.querySelectorAll<SVGGElement>('[data-scene-character], [data-character-pose="standing"]')].map(pose => {
      const head = pose.querySelector<SVGGElement>('[id$="character-head-front"], [id$="character-head-back"], [id$="character-head-side"]')!;
      const matrix = inverse.multiply(head.getScreenCTM()!);
      const center = new DOMPoint(0, -14).matrixTransform(matrix);
      const actorMatrix = inverse.multiply(pose.getScreenCTM()!);
      return { pose: pose.getAttribute('data-scene-character') ?? 'standing',
        diameter: 14 * Math.hypot(matrix.a, matrix.b),
        center: { x: center.x, y: center.y },
        floor: new DOMPoint(0, pose.id === 'seated-character-body' ? 20 : 0).matrixTransform(actorMatrix).y,
        // Measure the actual robe footprint rather than an obsolete scale pivot.
        seatY: pose.getAttribute('data-scene-character') === 'tea-seated'
          ? (() => {
            const hem = pose.querySelector<SVGEllipseElement>('[data-robe-hem]')!;
            const seat = pose.closest<SVGGElement>('[id^="tea-slot-"]')!;
            return new DOMPoint(hem.cx.baseVal.value, hem.cy.baseVal.value)
              .matrixTransform(seat.getScreenCTM()!.inverse().multiply(hem.getScreenCTM()!)).y;
          })()
          : new DOMPoint(0, 4).matrixTransform(pose.transform.baseVal.consolidate()?.matrix ?? new DOMMatrix()).y };
    });
  });
  const poses = await measure();
  expect(poses.map(pose => pose.pose).sort()).toEqual(['chair-seated', 'sofa-seated', 'tea-seated']);
  for (const pose of poses) expect(pose.diameter, pose.pose).toBeCloseTo(14 * 48 / 45, 3);
  expect(poses.find(pose => pose.pose === 'tea-seated')!.seatY).toBeCloseTo(3.5, 4);
  expect(poses.find(pose => pose.pose === 'sofa-seated')!.seatY).toBeCloseTo(4, 4);
  const chair = poses.find(pose => pose.pose === 'chair-seated')!;
  expect(chair.floor - chair.center.y + 11 * 48 / 45).toBeCloseTo(43.93, 2);
  await expect(page.locator('#seated-character-legs')).toHaveCount(0);
  await expect(page.locator('#seated-character-body [data-desk-robe]')).toHaveCount(1);
  await page.getByText('更换状态与装扮', { exact: true }).click();
  await page.locator('#status-picker-modal').getByRole('button', { name: /山巅外星电波监听站/ }).click();
  await page.locator('#confirm-status-btn').click();
  await expect(page.locator('[data-character-pose="standing"]')).toHaveCount(1);
  const standing = (await measure()).find(pose => pose.pose === 'standing')!;
  expect(standing.diameter).toBeCloseTo(14 * 48 / 45, 3);
  expect(standing.floor - standing.center.y + 11 * 48 / 45).toBeCloseTo(48, 3);
  const onMat = await page.locator('#observatory-operation-mat').evaluate(node => {
    const mat = node as SVGGeometryElement;
    const actor = document.querySelector<SVGGElement>('[id^="person-in-observatory-"]')!;
    const point = new DOMPoint(0, 0).matrixTransform(mat.getScreenCTM()!.inverse().multiply(actor.getScreenCTM()!));
    return mat.isPointInFill(point);
  });
  expect(onMat, 'standing floor anchor is inside the operation mat').toBe(true);
  await page.getByRole('button', { name: '山巅外星电波监听站', exact: true }).click();
  await page.screenshot({ path: testInfo.outputPath('observatory-standing.png') });
});

for (const width of [1200, 390]) {
  test(`seated and standing character exports keep their assets separate at ${width}`, async ({ page }) => {
    test.setTimeout(90000);
    await page.setViewportSize({ width, height: width === 390 ? 844 : 800 });
    // Capture this browser's copy output without touching the user's system clipboard.
    await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: {
      writeText: async (text: string) => { (window as Window & { copiedSvg?: string }).copiedSvg = text; },
    } }));
    await stableScene(page);
    const opener = page.getByRole('button', { name: '人物 4 视图 SVG', exact: true });
    const camera = await page.locator('#panoramic-world-stage').getAttribute('style');
    const layout = await page.evaluate(() => localStorage.getItem('live_with_me_room_layout_v6'));
    await opener.click();
    const dialog = page.getByRole('dialog', { name: '人物四视图 · 查看与导出' });
    const box = (await dialog.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);

    const downloadAsset = async (button: ReturnType<typeof page.getByRole>, filename: string) => {
      const pending = page.waitForEvent('download');
      await button.click();
      const download = await pending;
      expect(download.suggestedFilename()).toBe(filename);
      const file = await download.path();
      expect(await fs.readFile(file!, 'utf8')).toBe(await fs.readFile(`public/${filename}`, 'utf8'));
    };
    await expect(dialog.getByRole('img', { name: '标准坐姿四视图总表预览', exact: true }))
      .toHaveAttribute('src', '/character-shorthair-4views.svg');
    await downloadAsset(dialog.getByRole('button', { name: '下载总表 SVG', exact: true }), 'character-shorthair-4views.svg');
    await dialog.getByRole('button', { name: '站姿四视图', exact: true }).click();
    await expect(dialog.getByRole('button', { name: '站姿四视图', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(dialog.getByRole('img', { name: '长袍站姿四视图总表预览', exact: true }))
      .toHaveAttribute('src', '/character-shorthair-standing-4views.svg');
    await expect.poll(() => dialog.locator('img').evaluateAll(images => images.every(image => {
      const img = image as HTMLImageElement; return img.complete && img.naturalWidth > 0;
    }))).toBe(true);
    await dialog.getByRole('button', { name: '复制代码', exact: true }).click();
    await expect(dialog.getByText('已复制', { exact: true })).toBeVisible();
    expect(await page.evaluate(() => (window as Window & { copiedSvg?: string }).copiedSvg))
      .toBe(await fs.readFile('public/character-shorthair-standing-4views.svg', 'utf8'));
    await downloadAsset(dialog.getByRole('button', { name: '下载总表 SVG', exact: true }), 'character-shorthair-standing-4views.svg');
    for (const [value, filename, label] of [
      ['comparison', 'character-shorthair-proportion-comparison.svg', '坐站同头大小对照预览'],
      ['ground', 'character-shorthair-standing-ground-4views.svg', '浅轴测地面参照预览'],
      ['surfaces', 'character-shorthair-standing-surfaces.svg', '木地板与草地接地对照预览'],
    ]) {
      await dialog.getByLabel('站姿查看内容', { exact: true }).selectOption(value);
      await expect(dialog.getByRole('img', { name: label, exact: true })).toHaveAttribute('src', `/${filename}`);
      await downloadAsset(dialog.getByRole('button', { name: '下载总表 SVG', exact: true }), filename);
    }
    for (const view of ['front', 'left', 'back', 'right']) {
      const link = dialog.locator(`a[href="/character-shorthair-standing-${view}.svg"]`);
      const card = link.locator('..');
      await downloadAsset(card.getByRole('button', { name: /^下载长袍站姿/ }), `character-shorthair-standing-${view}.svg`);
    }
    await dialog.getByRole('button', { name: '坐姿四视图', exact: true }).click();
    await expect(dialog.getByRole('img', { name: '标准坐姿四视图总表预览', exact: true }))
      .toHaveAttribute('src', '/character-shorthair-4views.svg');
    await dialog.getByRole('button', { name: '层叠长卷发', exact: true }).click();
    await expect(dialog.getByRole('button', { name: '层叠长卷发', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(dialog.getByRole('img', { name: '层叠长卷发四视图总表预览', exact: true }))
      .toHaveAttribute('src', '/character-curly-4views.svg');
    await expect(dialog.getByRole('group', { name: '人物姿态', exact: true })).toHaveCount(1);
    await expect.poll(() => dialog.locator('img').evaluateAll(images => images.every(image => {
      const img = image as HTMLImageElement; return img.complete && img.naturalWidth > 0;
    }))).toBe(true);
    const overflow = await dialog.locator('.overflow-y-auto').evaluate(node => node.scrollWidth - node.clientWidth);
    expect(overflow, 'curly export controls fit on a phone').toBeLessThanOrEqual(1);
    await dialog.getByRole('button', { name: '复制代码', exact: true }).click();
    await expect.poll(() => page.evaluate(() => (window as Window & { copiedSvg?: string }).copiedSvg))
      .toBe(await fs.readFile('public/character-curly-4views.svg', 'utf8'));
    await downloadAsset(dialog.getByRole('button', { name: '下载总表 SVG', exact: true }), 'character-curly-4views.svg');
    const opening = page.waitForEvent('popup');
    await dialog.getByRole('link', { name: '打开完整四视图', exact: true }).click();
    const opened = await opening;
    await expect(opened.locator('[data-character-pose="seated"]')).toHaveCount(4);
    await opened.close();
    for (const view of ['front', 'left', 'back', 'right']) {
      const link = dialog.locator(`a[href="/character-curly-${view}.svg"]`);
      await downloadAsset(link.locator('..').getByRole('button', { name: /^下载长卷发坐姿/ }), `character-curly-${view}.svg`);
    }
    await dialog.getByRole('button', { name: '站姿四视图', exact: true }).click();
    await expect(dialog.getByRole('img', { name: '层叠长卷发站姿四视图总表预览', exact: true }))
      .toHaveAttribute('src', '/character-curly-standing-4views.svg');
    await expect(dialog.getByLabel('站姿查看内容', { exact: true })).toHaveCount(0);
    await expect.poll(() => dialog.locator('img').evaluateAll(images => images.every(image => {
      const img = image as HTMLImageElement; return img.complete && img.naturalWidth > 0;
    }))).toBe(true);
    await dialog.getByRole('button', { name: '复制代码', exact: true }).click();
    await expect.poll(() => page.evaluate(() => (window as Window & { copiedSvg?: string }).copiedSvg))
      .toBe(await fs.readFile('public/character-curly-standing-4views.svg', 'utf8'));
    await downloadAsset(dialog.getByRole('button', { name: '下载总表 SVG', exact: true }), 'character-curly-standing-4views.svg');
    const openingStanding = page.waitForEvent('popup');
    await dialog.getByRole('link', { name: '打开完整四视图', exact: true }).click();
    const openedStanding = await openingStanding;
    await expect(openedStanding.locator('[data-character-pose="standing"]')).toHaveCount(4);
    await openedStanding.close();
    for (const view of ['front', 'left', 'back', 'right']) {
      const link = dialog.locator(`a[href="/character-curly-standing-${view}.svg"]`);
      await downloadAsset(link.locator('..').getByRole('button', { name: /^下载长卷发站姿/ }), `character-curly-standing-${view}.svg`);
    }
    await dialog.getByRole('button', { name: '坐姿四视图', exact: true }).click();
    await expect(dialog.getByRole('img', { name: '层叠长卷发四视图总表预览', exact: true }))
      .toHaveAttribute('src', '/character-curly-4views.svg');
    await dialog.getByRole('button', { name: '偏分低束发', exact: true }).click();
    for (const newPose of ['seated', 'standing'] as const) {
      await dialog.getByRole('button', { name: newPose === 'seated' ? '坐姿四视图' : '站姿四视图', exact: true }).click();
      const prefix = `character-sidepart${newPose === 'standing' ? '-standing' : ''}`;
      await expect(dialog.locator(`img[src="/${prefix}-4views.svg"]`)).toBeVisible();
      await downloadAsset(dialog.getByRole('button', { name: '下载总表 SVG', exact: true }), `${prefix}-4views.svg`);
      await dialog.getByRole('button', { name: '复制代码', exact: true }).click();
      await expect.poll(() => page.evaluate(() => (window as Window & { copiedSvg?: string }).copiedSvg))
        .toBe(await fs.readFile(`public/${prefix}-4views.svg`, 'utf8'));
      for (const view of ['front', 'left', 'back', 'right']) {
        const link = dialog.locator(`a[href="/${prefix}-${view}.svg"]`);
        await downloadAsset(link.locator('..').getByRole('button', { name: /^下载偏分低束发/ }), `${prefix}-${view}.svg`);
      }
    }
    await dialog.getByRole('button', { name: '双色蓬松碎发', exact: true }).click();
    for (const newPose of ['seated', 'standing'] as const) {
      await dialog.getByRole('button', { name: newPose === 'seated' ? '坐姿四视图' : '站姿四视图', exact: true }).click();
      const prefix = `character-shaggy${newPose === 'standing' ? '-standing' : ''}`;
      await expect(dialog.locator(`img[src="/${prefix}-4views.svg"]`)).toBeVisible();
      await expect.poll(() => dialog.locator('img').evaluateAll(images => images.every(image => {
        const img = image as HTMLImageElement; return img.complete && img.naturalWidth > 0;
      }))).toBe(true);
      expect(await dialog.locator('.overflow-y-auto').evaluate(node => node.scrollWidth - node.clientWidth)).toBeLessThanOrEqual(1);
      await downloadAsset(dialog.getByRole('button', { name: '下载总表 SVG', exact: true }), `${prefix}-4views.svg`);
      await dialog.getByRole('button', { name: '复制代码', exact: true }).click();
      await expect.poll(() => page.evaluate(() => (window as Window & { copiedSvg?: string }).copiedSvg))
        .toBe(await fs.readFile(`public/${prefix}-4views.svg`, 'utf8'));
      const openingShaggy = page.waitForEvent('popup');
      await dialog.getByRole('link', { name: '打开完整四视图', exact: true }).click();
      const openedShaggy = await openingShaggy;
      await expect(openedShaggy.locator(`[data-character-pose="${newPose}"] [data-shaggy-hair]`)).toHaveCount(4);
      await openedShaggy.close();
      for (const view of ['front', 'left', 'back', 'right']) {
        const link = dialog.locator(`a[href="/${prefix}-${view}.svg"]`);
        await downloadAsset(link.locator('..').getByRole('button', { name: /^下载双色蓬松碎发/ }), `${prefix}-${view}.svg`);
      }
    }
    await dialog.getByRole('button', { name: '坐姿四视图', exact: true }).click();
    await dialog.getByRole('button', { name: '经典短发', exact: true }).click();
    await expect(dialog.getByRole('img', { name: '标准坐姿四视图总表预览', exact: true }))
      .toHaveAttribute('src', '/character-shorthair-4views.svg');
    expect(await page.locator('#panoramic-world-stage').getAttribute('style')).toBe(camera);
    expect(await page.evaluate(() => localStorage.getItem('live_with_me_room_layout_v6'))).toBe(layout);
    await dialog.getByRole('button', { name: '关闭导出窗口', exact: true }).press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(opener).toBeFocused();
  });
}

for (const width of [1200, 390]) {
  test(`appearance picker expands inline standing views and preserves edits at ${width}`, async ({ page }, testInfo) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: width === 390 ? 844 : 800 });
    await stableScene(page);
    const openAppearance = async () => {
      await page.getByText('更换状态与装扮', { exact: true }).click();
      await page.getByRole('button', { name: '人物装扮', exact: true }).click();
    };
    await openAppearance();
    const picker = page.getByRole('dialog', { name: '状态与小人特征配置', exact: true });
    const preview = picker.getByTestId('appearance-preview');
    const box = (await picker.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect((await preview.boundingBox())!.width).toBeLessThanOrEqual(80);
    expect((await preview.boundingBox())!.height).toBeLessThanOrEqual(96);
    expect((await picker.getByTestId('appearance-summary').boundingBox())!.height).toBeLessThanOrEqual(130);
    expect((await picker.getByTestId('status-picker-content').boundingBox())!.height).toBeGreaterThan(300);
    const detail = page.getByRole('dialog', { name: '装扮预览', exact: true });
    await expect(detail).toHaveCount(0);
    await expect(picker.getByText('2:1 菱形轴测对齐', { exact: true })).toHaveCount(0);
    await expect(picker.getByRole('button', { name: /导出.*SVG/ })).toHaveCount(0);
    const content = picker.getByTestId('status-picker-content');
    const views = picker.getByRole('region', { name: '完整装扮四视图', exact: true });
    const avatar = picker.getByRole('button', { name: '查看完整装扮四视图', exact: true });
    const toggle = picker.getByRole('button', { name: '查看完整装扮', exact: true });
    await expect(views).toHaveCount(0);
    await expect(avatar).toHaveAttribute('aria-expanded', 'false');
    await page.screenshot({ path: testInfo.outputPath(`appearance-collapsed-${width}.png`) });
    await avatar.click();
    await expect(views).toBeVisible();
    await expect(avatar).toHaveAttribute('aria-expanded', 'true');
    await expect(detail).toHaveCount(0);
    await expect(picker.locator('[data-character-pose="standing"]')).toHaveCount(4);
    const boxes = await views.getByTestId('appearance-four-view').evaluateAll(nodes => nodes.map(node => {
      const box = node.getBoundingClientRect();
      return { x: box.x, y: box.y, width: box.width };
    }));
    expect(boxes).toHaveLength(4);
    expect(boxes[1].x).toBeGreaterThan(boxes[0].x);
    expect(Math.abs(boxes[1].y - boxes[0].y)).toBeLessThan(1);
    if (width === 390) expect(boxes[2].y).toBeGreaterThan(boxes[0].y);
    else expect(Math.abs(boxes[3].y - boxes[0].y)).toBeLessThan(1);
    for (const [name, selector] of [
      ['经典利落短发', '#bangs-classic-crescent-curtain'],
      ['层叠长卷发', '[data-curly-hair="lengths"]'],
      ['双色蓬松碎发', '[data-shaggy-underlayer]'],
      ['偏分低束发', '[data-sidepart-hair]'],
    ]) {
      await picker.getByRole('button', { name: new RegExp(name) }).click();
      await expect(views.locator(selector)).toHaveCount(name === '经典利落短发' ? 1 : 4);
    }
    for (const [label, direction, profile] of [
      ['正面', 'SE', 'front'], ['左侧', 'SW', 'tucked-profile'],
      ['背面', 'NW', 'back'], ['右侧', 'NE', 'long-lock-profile'],
    ]) {
      const view = views.getByRole('img', { name: `站立装扮：${label}`, exact: true });
      await expect(view.locator('[data-character-pose="standing"]')).toHaveAttribute('data-facing', direction);
      await expect(view.locator(`[data-sidepart-hair="${profile}"]`)).toHaveCount(1);
    }
    await picker.getByRole('button', { name: '银灰', exact: true }).click();
    await picker.getByRole('button', { name: '暖柿红', exact: true }).click();
    await picker.getByRole('button', { name: '健康暖棕', exact: true }).click();
    await picker.getByRole('button', { name: '牛仔灰蓝', exact: true }).click();
    for (const view of await views.getByTestId('appearance-four-view').all()) {
      for (const colour of ['#b8afa0', '#e07a5f', '#d4a373', '#4f6d85']) {
        expect(await view.locator(`[fill="${colour}"]`).count()).toBeGreaterThan(0);
      }
    }
    // Opening from the fixed summary brings the preview back into view after choosing colours.
    await picker.getByRole('button', { name: '收起完整装扮', exact: true }).click();
    await toggle.click();
    expect(await content.evaluate(node => node.scrollTop)).toBe(0);
    await page.screenshot({ path: testInfo.outputPath(`appearance-four-views-${width}.png`) });
    await picker.getByRole('button', { name: '关闭配置', exact: true }).press('Shift+Tab');
    await expect(picker.locator('#confirm-status-btn')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(picker.getByRole('button', { name: '关闭配置', exact: true })).toBeFocused();
    await views.getByRole('button', { name: '收起四视图', exact: true }).click();
    await expect(views).toHaveCount(0);
    await expect(toggle).toBeFocused();
    await expect(picker.getByRole('button', { name: '银灰', exact: true })).toHaveAttribute('aria-pressed', 'true');
    expect(await content.evaluate(node => node.scrollWidth - node.clientWidth)).toBeLessThanOrEqual(1);
    await picker.getByRole('button', { name: '帽顶毛球：有', exact: true }).click();
    await expect(preview.locator('[id^="beanie-pompom"]')).toHaveCount(0);
    await toggle.click();
    await expect(views.locator('[id^="beanie-pompom"]')).toHaveCount(0);
    await picker.locator('#confirm-status-btn').click();
    const sceneHead = page.locator('#isometric-chair-container #seated-character-body');
    await expect(sceneHead.locator('[data-sidepart-hair="back"]')).toHaveCount(1);
    expect(await sceneHead.locator('[fill="#b8afa0"]').count()).toBeGreaterThan(0);
    await expect(sceneHead.locator('#beanie-pompom-back')).toHaveCount(0);
    await openAppearance();
    await expect(picker.getByRole('button', { name: '银灰', exact: true })).toHaveAttribute('aria-pressed', 'true');
    await expect(picker.getByRole('button', { name: '帽顶毛球：无', exact: true })).toHaveAttribute('aria-pressed', 'false');
    // An unsaved change and Escape must leave the stored appearance intact.
    await picker.getByRole('button', { name: /层叠长卷发/ }).click();
    await avatar.click();
    await picker.getByRole('button', { name: '关闭配置', exact: true }).press('Escape');
    await expect(picker).toHaveCount(0);
    await openAppearance();
    await expect(picker.getByRole('button', { name: /偏分低束发/ })).toHaveAttribute('aria-pressed', 'true');
    await picker.getByRole('button', { name: /双色蓬松碎发/ }).click();
    await picker.getByRole('button', { name: '取消', exact: true }).click();
    await openAppearance();
    await expect(picker.getByRole('button', { name: /偏分低束发/ })).toHaveAttribute('aria-pressed', 'true');
    await picker.getByRole('button', { name: '关闭配置', exact: true }).click();
    await page.getByRole('button', { name: '人物 4 视图 SVG', exact: true }).click();
    await expect(page.getByRole('dialog', { name: '人物四视图 · 查看与导出' })).toBeVisible();
  });
}

test('layered curly hair uses its own wisps in the picker, tea scene and standing pose', async ({ page }, testInfo) => {
  await stableScene(page);
  await page.getByText('更换状态与装扮', { exact: true }).click();
  const picker = page.locator('#status-picker-modal');
  await picker.getByRole('button', { name: '人物装扮', exact: true }).click();
  await picker.getByRole('button', { name: /层叠长卷发/ }).click();
  await picker.getByRole('button', { name: '生活切片与房间', exact: true }).click();
  await picker.getByRole('button', { name: /公共起居角/ }).click();
  await page.locator('#confirm-status-btn').click();
  const tea = page.locator('[data-scene-character="tea-seated"]');
  await expect(tea.locator('[data-curly-hair="lengths"]')).toHaveCount(2);
  await expect(tea.locator('[data-curly-hair="fringe"]')).toHaveCount(2);
  const hasShortFringe = () => page.locator('[data-scene-character="tea-seated"], [data-character-pose="standing"]')
    .evaluateAll(poses => poses.some(pose => pose.querySelector('[id$="bangs-classic-crescent-curtain"]') ||
      [...pose.querySelectorAll('path')].some(path => path.getAttribute('d')?.trim().startsWith('M -6.873 -13.063'))));
  expect(await hasShortFringe()).toBe(false);
  await page.getByRole('button', { name: '公共起居角', exact: true }).click();
  await page.screenshot({ path: testInfo.outputPath('curly-tea-scene.png') });
  await page.getByText('更换状态与装扮', { exact: true }).click();
  await picker.getByRole('button', { name: /山巅外星电波监听站/ }).click();
  await page.locator('#confirm-status-btn').click();
  await expect(page.locator('[data-character-pose="standing"] [data-curly-hair="lengths"]')).toHaveCount(1);
  expect(await hasShortFringe()).toBe(false);
});

test('the old shoulder hair is replaced in the picker, scene and sleeping pose', async ({ page }, testInfo) => {
  await stableScene(page);
  await page.getByText('更换状态与装扮', { exact: true }).click();
  const picker = page.locator('#status-picker-modal');
  await picker.getByRole('button', { name: '人物装扮', exact: true }).click();
  await expect(picker.getByRole('button', { name: /随性披肩长发/ })).toHaveCount(0);
  await picker.getByRole('button', { name: /偏分低束发/ }).click();
  await picker.getByRole('button', { name: '生活切片与房间', exact: true }).click();
  await picker.getByRole('button', { name: /公共起居角/ }).click();
  await page.locator('#confirm-status-btn').click();
  // Allocation follows person order: after moving, self takes the east seat.
  const east = page.locator('#tea-slot-tea_cushion_east');
  await expect(east.locator('[data-sidepart-hair="tucked-profile"]')).toHaveCount(1);
  await expect(east.locator('[data-long-front-lock]')).toHaveCount(0);
  await expect(east.locator('[data-far-front-lock]')).toHaveCount(1);
  const hasOldFringe = await east.locator('path').evaluateAll(paths =>
    paths.some(path => path.getAttribute('d')?.trim().startsWith('M -6.873 -13.063')));
  expect(hasOldFringe).toBe(false);
  await page.getByRole('button', { name: '公共起居角', exact: true }).click();
  await page.screenshot({ path: testInfo.outputPath('sidepart-tea-scene.png') });
  await page.getByText('更换状态与装扮', { exact: true }).click();
  await picker.getByRole('button', { name: /旧胶囊仓/ }).click();
  await page.locator('#confirm-status-btn').click();
  await expect(page.locator('[data-sidepart-hair="sleeping"]')).toHaveCount(1);
  await expect(page.locator('#character-head-sleeping [id="bangs-sleeping-crescent"]')).toHaveCount(0);
  const visibleEye = await page.locator('#character-head-sleeping path[stroke="#5c432d"]').evaluate(node =>
    (node as SVGGraphicsElement).getBBox().x);
  expect(visibleEye, 'the long front lock hides the left eye').toBeGreaterThan(0);
  await expect(page.locator('#character-head-sleeping circle[cx="-3.2"][cy="2.4"]')).toHaveCount(0);
});

test('two-tone shaggy hair replaces shoulder hair and keeps selectable top colour above a dark nape', async ({ page }, testInfo) => {
  await stableScene(page);
  await page.getByText('更换状态与装扮', { exact: true }).click();
  const picker = page.locator('#status-picker-modal');
  await picker.getByRole('button', { name: '人物装扮', exact: true }).click();
  await expect(picker.getByRole('button', { name: /利落及肩直发/ })).toHaveCount(0);
  await picker.getByRole('button', { name: /双色蓬松碎发/ }).click();
  await picker.getByRole('button', { name: '生活切片与房间', exact: true }).click();
  await picker.getByRole('button', { name: /公共起居角/ }).click();
  await page.locator('#confirm-status-btn').click();
  const east = page.locator('#tea-slot-tea_cushion_east');
  await expect(east.locator('[data-shaggy-hair="side"]')).toHaveCount(1);
  await expect(east.locator('[data-shaggy-top]')).toHaveAttribute('fill', '#e4c983');
  await expect(east.locator('[data-shaggy-underlayer]')).toHaveAttribute('fill', '#25221f');
  expect(await east.locator('path').evaluateAll(paths => paths.some(path =>
    path.getAttribute('d')?.trim().startsWith('M -6.873 -13.063')))).toBe(false);
  await expect(east.locator('[id*="medium-straight"]')).toHaveCount(0);
  await page.getByRole('button', { name: '公共起居角', exact: true }).click();
  await page.screenshot({ path: testInfo.outputPath('shaggy-tea-scene.png') });
  await page.getByText('更换状态与装扮', { exact: true }).click();
  await picker.getByRole('button', { name: '人物装扮', exact: true }).click();
  await picker.getByRole('button', { name: '暖栗红棕', exact: true }).click();
  await picker.getByRole('button', { name: '生活切片与房间', exact: true }).click();
  await picker.getByRole('button', { name: /山巅外星电波监听站/ }).click();
  await page.locator('#confirm-status-btn').click();
  const standing = page.locator('[data-character-pose="standing"]');
  await expect(standing.locator('[data-shaggy-top]')).toHaveAttribute('fill', '#4a3020');
  await expect(standing.locator('[data-shaggy-underlayer]')).toHaveAttribute('fill', '#25221f');
  await page.getByText('更换状态与装扮', { exact: true }).click();
  await picker.getByRole('button', { name: /旧胶囊仓/ }).click();
  await page.locator('#confirm-status-btn').click();
  await expect(page.locator('[data-shaggy-hair="sleeping"]')).toHaveCount(1);
  await expect(page.locator('#bangs-sleeping-crescent, [id*="hair-sleeping-medium-straight"]')).toHaveCount(0);
  await page.locator('#character-head-sleeping').screenshot({ path: testInfo.outputPath('shaggy-sleeping.png') });
});

test('the character sheets have valid resources, matching heads and the actual ground slope', async ({ page }) => {
  for (const view of ['4views', 'front', 'left', 'back', 'right', 'ground-4views', 'comparison', 'surfaces',
    'seated-4views', 'seated-front', 'seated-left', 'seated-back', 'seated-right', 'relaxation-v10', 'contact-v11', 'curly-v13',
    'curly-front', 'curly-left', 'curly-back', 'curly-right', 'curly-standing-4views',
    'curly-standing-front', 'curly-standing-left', 'curly-standing-back', 'curly-standing-right',
    'sidepart-4views', 'sidepart-front', 'sidepart-left', 'sidepart-back', 'sidepart-right',
    'sidepart-standing-4views', 'sidepart-standing-front', 'sidepart-standing-left', 'sidepart-standing-back', 'sidepart-standing-right',
    'shaggy-4views', 'shaggy-front', 'shaggy-left', 'shaggy-back', 'shaggy-right',
    'shaggy-standing-4views', 'shaggy-standing-front', 'shaggy-standing-left', 'shaggy-standing-back', 'shaggy-standing-right']) {
    await page.goto(view === 'comparison' ? '/character-shorthair-proportion-comparison.svg'
      : view === 'relaxation-v10' ? '/character-seated-side-relaxation-v10.svg'
      : view === 'contact-v11' ? '/character-seated-side-contact-v11.svg'
      : view === 'curly-v13' ? '/character-curly-4views.svg'
      : view.startsWith('curly-') ? `/character-${view}.svg`
      : view.startsWith('sidepart-') ? `/character-${view}.svg`
      : view.startsWith('shaggy-') ? `/character-${view}.svg`
      : view.startsWith('seated-') ? `/character-shorthair-${view.replace('seated-', '')}.svg` : `/character-shorthair-standing-${view}.svg`);
    const result = await page.locator('svg').evaluate(svgElement => {
      const svg = svgElement as SVGSVGElement;
      const box = svg.viewBox.baseVal;
      const outside: string[] = [], ids = new Set<string>(), duplicates: string[] = [], broken: string[] = [];
      for (const node of svg.querySelectorAll('[id]')) {
        if (ids.has(node.id)) duplicates.push(node.id);
        ids.add(node.id);
      }
      for (const node of svg.querySelectorAll('*')) for (const attr of node.attributes)
        for (const match of attr.value.matchAll(/url\(#([^)]*)\)/g)) if (!ids.has(match[1])) broken.push(match[1]);
      const rootMatrix = svg.getCTM()!;
      for (const node of svg.querySelectorAll<SVGGraphicsElement>('text, [data-character-pose]')) {
        const bounds = node.getBBox(), matrix = rootMatrix.inverse().multiply(node.getCTM()!);
        const points = [[bounds.x, bounds.y], [bounds.x + bounds.width, bounds.y + bounds.height]]
          .map(([x, y]) => new DOMPoint(x, y).matrixTransform(matrix));
        if (points.some(point => point.x < box.x || point.y < box.y || point.x > box.x + box.width || point.y > box.y + box.height))
          outside.push(node.getAttribute('data-facing') ?? node.textContent ?? 'unknown');
      }
      const poses = [...svg.querySelectorAll('[data-character-pose]')].filter(node => !node.closest('[data-size-preview]'));
      const headWidths = poses.map(node => ({ pose: node.getAttribute('data-character-pose'), direction: node.getAttribute('data-facing'),
        width: node.querySelector('[id$="character-head-front"] circle, [id$="character-head-back"] circle, [id$="character-head-side"] circle')!.getBoundingClientRect().width }));
      const hemContacts = poses.flatMap(node => {
        const hem = node.querySelector<SVGEllipseElement>('[data-robe-hem]');
        if (!hem) return [];
        const pose = node as SVGGElement;
        const parent = pose.parentElement as unknown as SVGGraphicsElement;
        const matrix = parent.getCTM()!.inverse().multiply(hem.getCTM()!);
        const point = new DOMPoint(hem.cx.baseVal.value, hem.cy.baseVal.value + hem.ry.baseVal.value).matrixTransform(matrix);
        return [{ direction: node.getAttribute('data-facing'), floorY: point.y,
          handX: node.querySelector('[data-round-hand]')!.getBoundingClientRect().x + node.querySelector('[data-round-hand]')!.getBoundingClientRect().width / 2,
          headX: node.querySelector('[id$="character-head-side"] circle')!.getBoundingClientRect().x + node.querySelector('[id$="character-head-side"] circle')!.getBoundingClientRect().width / 2 }];
      });
      const groundSlopes = [...svg.querySelectorAll<SVGPolygonElement>('[data-ground-reference] polygon')].flatMap(polygon => {
        return Array.from({ length: polygon.points.numberOfItems }, (_, index) => {
          const a = polygon.points.getItem(index), b = polygon.points.getItem((index + 1) % polygon.points.numberOfItems);
          return Math.abs((b.y - a.y) / (b.x - a.x));
        });
      });
      return { outside, duplicates, broken, external: svg.querySelectorAll('script, image, foreignObject').length,
        directions: poses.map(node => node.getAttribute('data-facing')), headWidths, groundSlopes, hemContacts };
    });
    expect(result.outside, view).toEqual([]);
    expect(result.duplicates, view).toEqual([]);
    expect(result.broken, view).toEqual([]);
    expect(result.external, view).toBe(0);
    expect(result.directions).toHaveLength(view === 'relaxation-v10' || view === 'contact-v11' ? 2 : view === 'comparison' || view === 'surfaces' ? 8 : view === '4views' || view === 'ground-4views' || view === 'seated-4views' || view === 'curly-v13' || view.endsWith('-4views') ? 4 : 1);
    if (view === 'shaggy-4views' || view === 'shaggy-standing-4views') {
      expect(result.directions).toEqual(['SE', 'SW', 'NW', 'NE']);
      await expect(page.locator('[data-shaggy-hair]')).toHaveCount(4);
      await expect(page.locator('[data-shaggy-underlayer][fill="#25221f"]')).toHaveCount(4);
      await expect(page.locator('[data-shaggy-top][fill="#e4c983"]')).toHaveCount(4);
      await expect(page.locator('[id$="bangs-classic-crescent-curtain"], [id*="medium-straight"]')).toHaveCount(0);
      const rearLayerVisible = await page.locator('[data-facing="NW"] [data-shaggy-top]').evaluate(node => {
        const top = node as SVGPathElement;
        const head = top.closest('[id$="character-head-back"]') as SVGGElement;
        const matrix = head.getScreenCTM()!.inverse().multiply(top.getScreenCTM()!);
        // The central rear cuff's low point is near y=-9. At y=-8 the pale
        // layer must still exist above the dark nape, rather than hiding under it.
        const inTop = new DOMPoint(0.4, -8).matrixTransform(matrix.inverse());
        const underlayer = head.querySelector<SVGPathElement>('[data-shaggy-underlayer]')!;
        return top.isPointInFill(inTop) && underlayer.isPointInFill(new DOMPoint(0.4, -6.1));
      });
      expect(rearLayerVisible, 'both layers remain visible below the lower rear cuff').toBe(true);
    }
    if (view === 'sidepart-4views' || view === 'sidepart-standing-4views') {
      expect(result.directions).toEqual(['SE', 'SW', 'NW', 'NE']);
      await expect(page.locator('[data-sidepart-hair="long-lock-profile"]')).toHaveCount(1);
      await expect(page.locator('[data-sidepart-hair="tucked-profile"]')).toHaveCount(1);
      await expect(page.locator('[data-sidepart-hair="tucked-profile"] [data-long-front-lock]')).toHaveCount(0);
      // Front's screen-left lock belongs to the character's right. A profile
      // count alone cannot catch the two anatomical sides being assigned backwards.
      await expect(page.locator('[data-facing="SW"] [data-sidepart-hair="tucked-profile"]')).toHaveCount(1);
      await expect(page.locator('[data-facing="NE"] [data-sidepart-hair="long-lock-profile"]')).toHaveCount(1);
      await expect(page.locator('[data-facing="SW"] [data-far-front-lock]')).toHaveCount(1);
      const profileCoverage = await page.locator('[data-sidepart-hair$="profile"]').evaluateAll(groups => groups.map(group => {
        const rear = group.querySelector<SVGPathElement>('[data-gathered-side-hair]')!;
        const lock = group.querySelector<SVGPathElement>('[data-long-front-lock]');
        return { rearCovered: [[2.5, -12], [4, -10], [5, -7]].every(([x, y]) => rear.isPointInFill(new DOMPoint(x, y))),
          foreheadClear: !lock || !lock.isPointInFill(new DOMPoint(-6, -12)),
          templeLock: !lock || lock.isPointInFill(new DOMPoint(-2.7, -10)) };
      }));
      for (const coverage of profileCoverage) {
        expect(coverage.rearCovered, 'hair covers the rear quadrant rather than a bare skin gap').toBe(true);
        expect(coverage.foreheadClear, 'the near lock leaves the forward forehead edge clear').toBe(true);
        expect(coverage.templeLock, 'the near lock falls from the temple plane').toBe(true);
      }
      await expect(page.locator('[data-low-hair-tie]')).toHaveCount(3);
      await expect(page.locator('[id$="bangs-classic-crescent-curtain"]')).toHaveCount(0);
    }
    if (view === 'curly-v13' || view === 'curly-standing-4views') {
      expect(result.directions).toEqual(['SE', 'SW', 'NW', 'NE']);
      await expect(page.locator('[data-curly-hair="lengths"]')).toHaveCount(4);
      await expect(page.locator('[data-curly-hair="fringe"]')).toHaveCount(3);
      await expect(page.locator('[id$="bangs-classic-crescent-curtain"]')).toHaveCount(0);
      const fringePlacement = await page.locator('[data-curly-hair="fringe"]').evaluateAll(groups => groups.every(group => {
        const head = group.parentElement!;
        const hat = head.querySelector('[id$="knit-beanie-with-curtain-bangs"], [id$="knit-beanie-side-view"]')!;
        return Boolean(group.compareDocumentPosition(hat) & Node.DOCUMENT_POSITION_FOLLOWING);
      }));
      expect(fringePlacement, 'the beanie masks the roots of curly wisps').toBe(true);
    }
    if (view === 'contact-v11' || view === 'seated-left' || view === 'seated-right') {
      expect(result.hemContacts).toHaveLength(view === 'contact-v11' ? 2 : 1);
      for (const contact of result.hemContacts) {
        expect(contact.floorY, `${view}: robe touches its floor anchor`).toBeCloseTo(0, 5);
        expect(Math.sign(contact.handX - contact.headX)).toBe(contact.direction === 'SW' ? -1 : 1);
      }
      if (view === 'contact-v11') {
        expect(result.directions).toEqual(['SW', 'NE']);
        expect(result.headWidths[0].width).toBeCloseTo(result.headWidths[1].width, 2);
      }
    }
    if (view === 'relaxation-v10') {
      expect(result.directions).toEqual(['SW', 'SW']);
      expect(result.headWidths[0].width).toBeCloseTo(result.headWidths[1].width, 2);
    }
    if (view === '4views' || view === 'ground-4views' || view === 'seated-4views') expect(result.directions).toEqual(['SE', 'SW', 'NW', 'NE']);
    if (view === 'comparison') for (const direction of ['SE', 'SW', 'NW', 'NE']) {
      const pair = result.headWidths.filter(head => head.direction === direction);
      expect(pair).toHaveLength(2);
      expect(pair[0].width).toBeCloseTo(pair[1].width, 2);
    }
    if (view === 'ground-4views') {
      expect(result.groundSlopes).toHaveLength(16);
      result.groundSlopes.forEach(slope => expect(slope).toBeCloseTo(77 / 272, 5));
    }
  }
});
