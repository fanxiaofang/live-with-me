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
      const sitters = page.locator('[data-desk-seat] [data-sofa-upper-body]');
      await expect(sitters).toHaveCount(Math.min(count, 2));
      await expect(page.locator('[data-chair-kind="club"]')).toHaveCount(1);
      await expect(page.locator('[data-chair-kind="recliner"]')).toHaveCount(1);
      for (const seat of await page.locator('[data-desk-seat]').all()) {
        for (const arms of await seat.locator('[data-sofa-arms]').all()) await expect(arms).toHaveAttribute('data-hand-mode', 'desk');
      }
      if (count >= 2) {
        await expect(page.locator('#isometric-chair-container [data-sofa-upper-body]')).toHaveAttribute('data-person-id', 'self');
        await expect(page.locator('#isometric-chair-secondary-container [data-sofa-upper-body]')).toHaveAttribute('data-person-id', 'lin');
      }
      if (count === 2) await page.screenshot({ path: info.outputPath(`desk-two-live-${width}.png`) });
    }
    expect(errors).toEqual([]);
  });
}

test('all four hairstyles use their finalized NW head in both desk seats', async ({ page }) => {
  test.setTimeout(60000);
  for (const [style, hair] of [['curtain_crescent', 'shorthair'], ['wavy_curly', 'curly'], ['long_wavy', 'sidepart'], ['medium_straight', 'shaggy']]) {
    await stableScene(page, `/tests/fixtures/world.html?deskCount=2&deskHair=${style}&focusRoom=my_room`);
    const heads = page.locator('[data-desk-seat] [data-windsor-head]');
    await expect(heads).toHaveCount(2);
    for (const head of await heads.all()) {
      await expect(head).toHaveAttribute('data-nw-hairstyle', hair);
      await expect(head).toHaveAttribute('data-nw-head-source', /[a-f0-9]{64}/);
    }
  }
});

test('an unreachable computer returns only its sitter hands to the armrests', async ({ page }) => {
  const layout = structuredClone(DEFAULT_ROOM_LAYOUT);
  layout['desk-laptop-secondary'].screen.x += 60;
  await page.addInitScript(layout => localStorage.setItem('live_with_me_room_layout_v6', JSON.stringify(layout)), layout);
  await stableScene(page, '/tests/fixtures/world.html?deskCount=2&focusRoom=my_room');
  for (const arm of await page.locator('#isometric-chair-secondary-container [data-sofa-arms]').all()) await expect(arm).toHaveAttribute('data-hand-mode', 'armrest');
  for (const arm of await page.locator('#isometric-chair-container [data-sofa-arms]').all()) await expect(arm).toHaveAttribute('data-hand-mode', 'desk');
});
