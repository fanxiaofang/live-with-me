import { test, expect } from '@playwright/test';
import { DEFAULT_ROOM_LAYOUT } from '../../src/components/layout-gizmo/layoutStore';
import { stableScene } from './helpers';

for (const width of [1200, 390]) {
  test(`sofa NW study shares live hands, preserves layout and retains old chairs at ${width}`, async ({ page }, testInfo) => {
    const evidence = testInfo.outputPath('evidence');
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    const layout = structuredClone(DEFAULT_ROOM_LAYOUT);
    layout['desk-laptop'].screen.x += 2;
    await page.addInitScript(value => localStorage.setItem('live_with_me_room_layout_v6', JSON.stringify(value)), layout);
    await stableScene(page);
    const live = page.locator('#isometric-chair-container');
    await expect(live.locator('[data-chair-kind="club"]')).toHaveCount(1);
    await expect(page.locator('#isometric-chair-secondary-container [data-chair-kind="recliner"]')).toHaveCount(1);
    const source = await live.locator('[data-finalized-nw]').getAttribute('data-nw-source');
    const handX = await live.locator('[data-sofa-arm="near"] [data-round-hand]').getAttribute('cx');
    const handsOnDesk = await page.evaluate(() => {
      const tabletop = document.querySelector<SVGPolygonElement>('#minimal-craft-desk-frame polygon[points="-53,5.4 21,-15.7 53,-6.6 -21,14.5"]')!;
      const inverse = tabletop.getScreenCTM()!.inverse();
      const polygon = [...tabletop.points].map(p => ({ x: p.x, y: p.y }));
      return [...document.querySelectorAll<SVGEllipseElement>('#isometric-chair-container [data-sofa-arm] [data-round-hand]')].every(hand => {
        const p = new DOMPoint(hand.cx.baseVal.value, hand.cy.baseVal.value).matrixTransform(hand.getScreenCTM()!).matrixTransform(inverse);
        let inside = false;
        for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
          const a = polygon[i], b = polygon[j];
          if ((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
        }
        return inside;
      });
    });
    expect(handsOnDesk).toBe(true);
    const crossedSleeves = await live.locator('[data-sofa-sleeve]').evaluateAll(nodes => {
      const cross = (a: DOMPoint, b: DOMPoint, c: DOMPoint) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
      return nodes.filter(node => {
        const path = node as SVGPathElement, count = 120, length = path.getTotalLength();
        const pts = Array.from({ length: count + 1 }, (_, i) => path.getPointAtLength(length * i / count));
        for (let i = 0; i < count; i++) for (let j = i + 2; j < count; j++) {
          if (i === 0 && j === count - 1) continue;
          if (cross(pts[i], pts[i + 1], pts[j]) * cross(pts[i], pts[i + 1], pts[j + 1]) < -1e-7
            && cross(pts[j], pts[j + 1], pts[i]) * cross(pts[j], pts[j + 1], pts[i + 1]) < -1e-7) return true;
        }
        return false;
      }).length;
    });
    expect(crossedSleeves).toBe(0);
    const saved = await page.evaluate(() => localStorage.getItem('live_with_me_room_layout_v6'));
    const camera = await page.locator('#panoramic-world-stage').getAttribute('style');
    await page.getByRole('button', { name: '检视工位椅子 (空椅 / 组合态)', exact: true }).click();
    const dialog = page.getByRole('dialog', { name: '工位椅与桌前坐姿' });
    const occupied = dialog.getByRole('region', { name: 'NW 上身入椅画布', exact: true });
    await expect(occupied.locator('[data-finalized-nw]')).toHaveAttribute('data-nw-source', source!);
    await expect(occupied.locator('[data-sofa-arm="near"] [data-round-hand]')).toHaveAttribute('cx', handX!);
    for (const arms of await occupied.locator('[data-sofa-arms]').all()) await expect(arms).toHaveAttribute('data-hand-mode', 'desk');
    await occupied.scrollIntoViewIfNeeded();
    await occupied.screenshot({ path: `${evidence}/club-${width}.png` });
    await dialog.getByRole('button', { name: 'B · 高背电竞沙发椅', exact: true }).click();
    await expect(occupied.locator('[data-chair-kind="recliner"]')).toHaveCount(1);
    await occupied.scrollIntoViewIfNeeded();
    await occupied.screenshot({ path: `${evidence}/recliner-${width}.png` });
    await dialog.getByRole('button', { name: '原椅保留对比', exact: true }).click();
    await expect(dialog.locator('[data-chair-kind="retro"]')).toHaveCount(2);
    await dialog.getByRole('button', { name: '温莎椅工位', exact: true }).click();
    await expect(dialog.locator('[data-chair-kind="windsor"]')).toHaveCount(2);
    await dialog.getByRole('button', { name: '双人姿态样例', exact: true }).click();
    await expect(dialog.locator('[data-sofa-upper-body]')).toHaveCount(2);
    const references = await dialog.evaluate(root => {
      const allIds = [...document.querySelectorAll('[id]')].map(n => n.id);
      const duplicate = [...root.querySelectorAll('[id]')].filter(n => allIds.filter(id => id === n.id).length > 1).map(n => n.id);
      const broken: string[] = [];
      for (const svg of root.querySelectorAll('svg')) for (const node of svg.querySelectorAll('*')) for (const attr of node.attributes)
        for (const match of attr.value.matchAll(/url\(#([^)]*)\)/g)) if (!svg.querySelector(`[id="${match[1]}"]`)) broken.push(match[1]);
      return { duplicate, broken, overflow: root.scrollWidth > root.clientWidth };
    });
    expect(references).toEqual({ duplicate: [], broken: [], overflow: false });
    await dialog.getByRole('region', { name: '双人姿态样例画布', exact: true }).screenshot({ path: `${evidence}/desk-${width}.png` });
    await dialog.getByRole('button', { name: '查看桌椅关系', exact: true }).click();
    await dialog.getByRole('button', { name: '只看空椅', exact: true }).click();
    await expect(dialog.locator('[data-sofa-upper-body]')).toHaveCount(0);
    await expect(live.locator('[data-sofa-upper-body]')).toHaveCount(1);
    await dialog.getByRole('button', { name: '显示就坐人物', exact: true }).click();
    await expect(dialog.locator('[data-sofa-upper-body]')).toHaveCount(1);
    await dialog.getByRole('button', { name: '关闭工位椅查看', exact: true }).press('Escape');
    expect(await page.evaluate(() => localStorage.getItem('live_with_me_room_layout_v6'))).toBe(saved);
    expect(await page.locator('#panoramic-world-stage').getAttribute('style')).toBe(camera);
    expect(errors).toEqual([]);
  });
}
