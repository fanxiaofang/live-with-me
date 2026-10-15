import { expect, test } from '@playwright/test';
import { DEFAULT_ROOM_LAYOUT } from '../../src/components/layout-gizmo/layoutStore';
import { stableScene } from './helpers';

for (const width of [1200, 390]) {
  test(`desk world supports zero, one and two actual occupants at ${width}`, async ({ page }, info) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width, height: width === 390 ? 844 : 800 });
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    for (const count of [0, 1, 2, 3]) {
      await stableScene(page, `/tests/fixtures/world.html?deskCount=${count}&focusRoom=my_room`);
      const sitters = page.locator('[data-desk-seat] [data-scene-character="chair-seated"]');
      await expect(sitters).toHaveCount(Math.min(count, 2));
      await expect(page.locator('[data-chair-kind="windsor"]')).toHaveCount(1);
      await expect(page.locator('[data-chair-kind="retro"]')).toHaveCount(1);
      await expect(page.locator('#seated-character-legs')).toHaveCount(0);
      for (const sitter of await sitters.all()) {
        await expect(sitter.locator('[data-desk-robe]')).toHaveCount(1);
        await expect(sitter).toHaveAttribute('data-hand-mode', 'keyboard');
        const robe = await sitter.locator('[data-desk-robe]').evaluate(node => {
          const box = (node as SVGGraphicsElement).getBBox(); return { bottom: box.y + box.height };
        });
        expect(robe.bottom).toBeGreaterThan(19);
        expect(robe.bottom).toBeLessThan(22);
      }
      if (count >= 2) {
        await expect(page.locator('#isometric-chair-container [data-person-id="self"]')).toHaveCount(1);
        await expect(page.locator('#isometric-chair-secondary-container [data-person-id="lin"]')).toHaveCount(1);
        const contacts = await page.evaluate(() => {
          return ['isometric-chair-container', 'isometric-chair-secondary-container'].map((id, index) => {
            const chair = document.getElementById(id)!;
            const laptop = document.getElementById(index === 0 ? 'component-isometric-laptop' : 'component-isometric-laptop-secondary')!;
            const keyboard = laptop.querySelector<SVGPolygonElement>('polygon[points="-11,-2.8 -1,-5.6 9,-2.8 -1,0"]')!;
            const inverse = keyboard.getScreenCTM()!.inverse();
            return [...chair.querySelectorAll<SVGEllipseElement>('[id^="volumetric-"] ellipse:last-child')].map(hand => {
              const point = new DOMPoint(hand.cx.baseVal.value, hand.cy.baseVal.value)
                .matrixTransform(hand.getScreenCTM()!).matrixTransform(inverse);
              return keyboard.isPointInFill(point);
            });
          });
        });
        expect(contacts).toEqual([[true, true], [true, true]]);
      }
      if (count === 2) await page.screenshot({ path: info.outputPath(`desk-two-live-${width}.png`) });
    }
    expect(errors).toEqual([]);
  });
}

test('all four hairstyles keep head-sized headphones and long robes in both real desk seats', async ({ page }, info) => {
  test.setTimeout(60000);
  for (const style of ['curtain_crescent', 'wavy_curly', 'long_wavy', 'medium_straight']) {
    await stableScene(page, `/tests/fixtures/world.html?deskCount=2&deskHair=${style}&focusRoom=my_room`);
    for (const sitter of await page.locator('[data-desk-seat] [data-scene-character="chair-seated"]').all()) {
      const head = sitter.locator('#character-head-back');
      await expect(sitter.locator('[data-desk-headphones="band"]')).toHaveAttribute('transform', (await head.getAttribute('transform'))!.replaceAll(', ', ','));
      const cups = await sitter.locator('[data-ear-cup]').evaluateAll(nodes => nodes.map(node => {
        const ellipse = node as SVGEllipseElement;
        return new DOMPoint(ellipse.cx.baseVal.value, ellipse.cy.baseVal.value).matrixTransform(ellipse.getScreenCTM()!).y;
      }));
      expect(Math.abs(cups[0] - cups[1])).toBeLessThan(0.01);
      if (style === 'wavy_curly') await expect(sitter.locator('[data-curly-hair="lengths"]')).toHaveCount(1);
      if (style === 'long_wavy') await expect(sitter.locator('[data-sidepart-hair="back"]')).toHaveCount(1);
      if (style === 'medium_straight') await expect(sitter.locator('[data-shaggy-underlayer]')).toHaveCount(1);
    }
    await page.screenshot({ path: info.outputPath(`desk-hair-${style}.png`) });
  }
});

test('moving one computer beyond reach leaves that sitter resting without affecting the other', async ({ page }) => {
  const layout = structuredClone(DEFAULT_ROOM_LAYOUT);
  layout['desk-laptop-secondary'].screen.x += 60;
  await page.addInitScript(layout => localStorage.setItem('live_with_me_room_layout_v6', JSON.stringify(layout)), layout);
  await stableScene(page, '/tests/fixtures/world.html?deskCount=2&focusRoom=my_room');
  await expect(page.locator('#seated-character-body-secondary')).toHaveAttribute('data-hand-mode', 'lap');
  await expect(page.locator('#seated-character-body')).toHaveAttribute('data-hand-mode', 'keyboard');
});
