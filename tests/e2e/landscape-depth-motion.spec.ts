import { frontEdgeY } from '../../src/world/scene/fieldEdges';
import { expect, test } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';

type Sample = { grass: number[]; tractor: number[]; grassUsesStage: boolean; legacyHidden: boolean; noCropClip: boolean };
type Audit = { snapshot: () => Sample; frames: Sample[]; active: boolean };
const output = path.resolve('docs/visual-system/f2-baseline-audit-2026-10-24');
test.use({ viewport: { width: 1600, height: 900 }, video: { mode: 'on', size: { width: 960, height: 540 } } });

test('the real grass contour and field tractor move independently without reviving legacy planting', async ({ page }) => {
  test.setTimeout(90000);
  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  await fs.mkdir(output, { recursive: true });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/');
  await page.locator('[data-hills-mode="f2"]').waitFor();
  await page.getByRole('button', { name: '白天', exact: true }).click();
  await page.getByRole('button', { name: '收起面板（查看完整约克郡风光）', exact: true }).click();
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important}' });
  await page.evaluate(() => document.querySelectorAll('svg').forEach(e => e.pauseAnimations()));
  await page.evaluate(y => {
    const $ = (s: string) => document.querySelector(s) as SVGGraphicsElement;
    const snapshot = (): Sample => {
      const grass = $('#master-axonometric-ground-plane > path:nth-of-type(2)');
      const m = grass.getScreenCTM()!, stage = $('#panoramic-world-stage').getScreenCTM()!;
      const edge = new DOMPoint(200, y).matrixTransform(m);
      const tractor = new DOMPoint(22, 46).matrixTransform($('#tractor-in-field').getScreenCTM()!);
      return {
        grass: [edge.x, edge.y], tractor: [tractor.x, tractor.y],
        grassUsesStage: ['a', 'b', 'c', 'd', 'e', 'f'].every(k => Math.abs(m[k as keyof SVGMatrix] as number - (stage[k as keyof SVGMatrix] as number)) < 1e-6),
        legacyHidden: ['lawn-natural-grass-tufts', 'clover-turf-patches', 'meadow-field-blossoms', 'beehive-meadow-grass', 'beehive-meadow-wildflowers', 'beehive-lavender-flowers']
          .every(id => getComputedStyle(document.getElementById(id)!).display === 'none'),
        noCropClip: !document.querySelector('#field-meadow-contact-clip') && !!grass.closest('#panoramic-world-stage'),
      };
    };
    (window as unknown as { landscapeAudit: Audit }).landscapeAudit = { snapshot, frames: [], active: false };
  }, frontEdgeY(200));
  const read = () => page.evaluate(() => (window as unknown as { landscapeAudit: Audit }).landscapeAudit.snapshot());
  const settled = () => expect.poll(() => page.evaluate(() => ['parallax-wheat-layer','panoramic-world-stage'].every(id => {
    const element = document.getElementById(id) as unknown as SVGElement;
    const shown = new DOMMatrix(getComputedStyle(element).transform), target = new DOMMatrix(element.style.transform);
    return Math.abs(shown.a-target.a)<.0001 && Math.abs(shown.e-target.e)<.001 && Math.abs(shown.f-target.f)<.001;
  }))).toBe(true);
  const assertComposition = (s: Sample) => {
    expect(s.grassUsesStage).toBe(true);
    expect(s.legacyHidden).toBe(true);
    expect(s.noCropClip).toBe(true);
  };
  const before = await read();
  assertComposition(before);
  await page.screenshot({ path: path.join(output, 'main-overview.png') });
  // Overview panning is intentionally bounded. Use a room view whose existing
  // exploration bounds admit the full drag, without changing camera controls.
  await page.getByRole('button', { name: '公共起居角', exact: true }).click();
  await settled();
  const panStart = await read();
  await page.screenshot({ path: path.join(output, 'main-pan-start.png') });
  await page.mouse.move(900, 200); await page.mouse.down();
  await page.mouse.move(1020, 260, { steps: 8 }); await page.mouse.up();
  await settled();
  const after = await read();
  assertComposition(after);
  const grassDelta = after.grass.map((v, i) => v - panStart.grass[i]);
  const tractorDelta = after.tractor.map((v, i) => v - panStart.tractor[i]);
  expect(grassDelta[0], JSON.stringify({panStart,after})).toBeCloseTo(120, 1); expect(grassDelta[1]).toBeCloseTo(60, 1);
  expect(tractorDelta[0]).toBeCloseTo(78, 1); expect(tractorDelta[1]).toBeCloseTo(33, 1);
  await page.screenshot({ path: path.join(output, 'main-panned.png') });
  const actions: { name: string; frames: number; grassTravel: number; tractorTravel: number }[] = [];
  for (const action of ['focus', 'reverse', 'reset']) {
    await page.evaluate(() => {
      const a = (window as unknown as { landscapeAudit: Audit }).landscapeAudit;
      a.frames = []; a.active = true;
      const sample = () => { if (!a.active) return; a.frames.push(a.snapshot()); requestAnimationFrame(sample); };
      requestAnimationFrame(sample);
    });
    await page.getByRole('button', { name: action === 'focus' ? '公共起居角' : '整栋小屋', exact: true }).click();
    if (action === 'reverse') {
      await page.waitForTimeout(90);
      await page.getByRole('button', { name: '公共起居角', exact: true }).click();
    }
    await page.waitForTimeout(550);
    const frames = await page.evaluate(() => {
      const a = (window as unknown as { landscapeAudit: Audit }).landscapeAudit;
      a.active = false; return a.frames;
    });
    expect(frames.length).toBeGreaterThan(2);
    frames.forEach(assertComposition);
    const travel = (key: 'grass' | 'tractor') => Math.max(...frames.map(f => f[key][0])) - Math.min(...frames.map(f => f[key][0]));
    actions.push({ name: action, frames: frames.length, grassTravel: travel('grass'), tractorTravel: travel('tractor') });
    if (action === 'focus') {
      expect(travel('grass')).toBeGreaterThan(10); expect(travel('tractor')).toBeGreaterThan(10);
      await page.screenshot({ path: path.join(output, 'main-focus.png') });
    }
  }
  expect(errors).toEqual([]);
  const video = page.video(); await page.close();
  await video!.saveAs(path.join(output, 'motion.webm'));
  await fs.writeFile(path.join(output, 'motion.json'), JSON.stringify({ passed: true, grassDelta, tractorDelta, actions, errors }, null, 2) + '\n');
});
