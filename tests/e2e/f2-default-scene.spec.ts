import { expect, test, type Page } from '@playwright/test';
import { CURRENT_F2_SCENE } from '../../src/world/scene/currentScene';
import { stableScene } from './helpers';

async function expectCurrentDefaultScene(page: Page) {
  await expect(page.locator('[data-field-edges]')).toHaveAttribute('data-field-edges', 'both');
  await expect(page.locator('[data-meadow-study]')).toHaveAttribute('data-meadow-study', 'complete');
  await expect(page.locator('[data-meadow-foreground]')).toHaveAttribute('data-meadow-foreground', 'entrance');
  await expect(page.locator('[data-region-clump]')).toHaveCount(6);
  await expect(page.locator('[data-meadow-entrance]')).toHaveCount(1);
  await expect(page.locator('#panoramic-world-stage > #homestead-meadow-base')).toHaveCount(1);
  await expect(page.locator('#field-meadow-contact-clip')).toHaveCount(0);
  // Duplicate root decoration was removed in 2f9289d, not merely hidden.
  await expect(page.locator('#guardian-tree-root-flora')).toHaveCount(0);
  await expect(page.locator('#seedpod-cottage-shell')).toHaveCount(1);
  await expect(page.locator('#seedpod-reading-loft')).toHaveCount(1);
  await expect(page.locator('#seedpod-gallery-ladder')).toHaveCount(1);
  await expect(page.locator('#seedpod-pumpkin-lantern')).toHaveCount(1);
  await expect(page.locator('#cottage-hanging-lamps')).toHaveCount(0);
  // These assets still exist for explicit historical views. In the current
  // composition their actual computed visibility must remain suppressed.
  for (const id of ['lawn-natural-grass-tufts', 'clover-turf-patches', 'meadow-field-blossoms',
    'pasture-wildflowers', 'pasture-chamomile-dots',
    'beehive-meadow-grass', 'beehive-meadow-wildflowers', 'beehive-lavender-flowers', 'gravel-verge-grass']) {
    await expect(page.locator('#' + id)).toHaveCSS('display', 'none');
  }
  const ground = await page.locator('#homestead-organic-meadow-grounds').evaluate(element => ({
    opacities: [...element.querySelectorAll(':scope > path')].map(path => Number(path.getAttribute('opacity'))),
    fill: element.querySelector(':scope > g[mask] > path')!.getAttribute('fill'),
  }));
  expect(ground.opacities).toEqual([0, 0]);
  expect(ground.fill).not.toContain('isoTerraceTurfGrad');
  await expect(page.locator('[data-region-clump="left-middle"]')).toHaveAttribute('data-world-root', '105,615.84');
}

for (const width of [1600, 390]) {
  test(`no-parameter homepage includes the complete committed F2 scene at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await stableScene(page, '/');
    await expect(page.locator('[data-hills-mode]')).toHaveAttribute('data-hills-mode', 'f2');
    await expectCurrentDefaultScene(page);
    await expect(page.locator('[data-foothill-transition]')).toHaveCount(1);
    await expect(page.locator('[data-foothill-transition]')).toHaveAttribute('data-foothill-transition','meadow-hill');
    await expect(page.locator('[data-foothill-material]')).toHaveAttribute('data-foothill-material','blended-vegetation');
    await expect(page.locator('[data-review-status="accepted"]')).toHaveCount(1);
    await expect(page.locator('[data-rear-foothill], [data-meadow-patch]')).toHaveCount(0);
    await expect(page.locator('[data-transition-tree]')).toHaveCount(31);
    const stats = await page.locator('[data-f2-hills]').evaluate(element => JSON.parse((element as HTMLElement).dataset.stats!));
    expect(stats.calibration).toBe('refined');
    expect(stats.mode).toBe('B');
    expect(stats.drawCalls).toBe(4);
    expect(stats.skyVisible).toBe(true);
    expect(stats.skyDither).toBe(true);
    await test.info().attach(`current-default-${width}`, { body: await page.screenshot(), contentType: 'image/png' });
  });
}

test('omitted scene parameters match the full explicit current combination in fixtures', async ({ page }) => {
  const snapshot = () => page.locator('#panoramic-world-stage, #parallax-wheat-layer, #parallax-mountains-layer, #parallax-foothill-layer, #parallax-foothill-trees-layer')
    .evaluateAll(elements => elements.map(element => element.outerHTML));
  await stableScene(page, '/tests/fixtures/world.html');
  await expectCurrentDefaultScene(page);
  const implicit = await snapshot();
  await stableScene(page, '/tests/fixtures/world.html?' + new URLSearchParams(CURRENT_F2_SCENE));
  expect(await snapshot()).toEqual(implicit);
});

test('old scene and individual alternatives require explicit selection', async ({ page }) => {
  await stableScene(page, '/tests/fixtures/world.html?hills=legacy');
  await expect(page.locator('[data-hills-mode]')).toHaveAttribute('data-hills-mode', 'legacy');
  await expect(page.locator('[data-f2-hills]')).toHaveCount(0);
  await expect(page.locator('[data-meadow-study]')).toHaveAttribute('data-meadow-study', 'original');
  await stableScene(page, '/tests/fixtures/world.html?hillsTransition=off&hillsTrees=off&fieldEdges=original&meadowStudy=original&meadowForeground=points');
  await expect(page.locator('[data-hills-mode]')).toHaveAttribute('data-hills-mode', 'f2');
  await expect(page.locator('[data-foothill-transition], [data-transition-tree], [data-meadow-entrance]')).toHaveCount(0);
  await expect(page.locator('[data-field-edges]')).toHaveAttribute('data-field-edges', 'original');
  await stableScene(page, '/tests/fixtures/world.html?meadowForeground=regions');
  await expect(page.locator('[data-region-clump]')).toHaveCount(6);
  await expect(page.locator('[data-meadow-entrance]')).toHaveCount(0);
  await expect(page.locator('[data-meadow-study]')).toHaveAttribute('data-meadow-study', 'complete');
});

test('mountain loading and WebGL context loss never restore the superseded terrace', async ({ page }) => {
  let release: () => void;
  const loading = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/src/world/render/f2/F2DistantHills.tsx*', async route => { await loading; await route.continue(); });
  await page.goto('/tests/fixtures/world.html', { waitUntil: 'domcontentloaded' });
  await expectCurrentDefaultScene(page);
  await expect(page.locator('[data-hills-mode]')).toHaveAttribute('data-hills-mode', 'legacy');
  release!();
  await page.locator('[data-hills-mode="f2"]').waitFor();
  await page.locator('[data-f2-hills] canvas').evaluate(canvas => (canvas as HTMLCanvasElement).getContext('webgl2')!.getExtension('WEBGL_lose_context')!.loseContext());
  await expect(page.locator('[data-hills-failure]')).toHaveCount(1);
  await expect(page.locator('[data-hills-mode]')).toHaveAttribute('data-hills-mode', 'legacy');
  await expect(page.locator('[data-f2-hills]')).toHaveCount(0);
  await expectCurrentDefaultScene(page);
});
