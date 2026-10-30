import { historicalSceneUrl } from './historicalScene.mjs';
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { PNG } = require(path.join(path.dirname(require.resolve('playwright-core/package.json')), 'lib/utilsBundle.js'));
const base = process.env.F2_URL || 'http://127.0.0.1:3014';
const out = 'docs/visual-system/meadow-regions';
await fs.mkdir(out, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const report = { scenarios: [], gestures: [], checks: [], errors: [] };
const hash = s => crypto.createHash('sha256').update(s).digest('hex');
const check = (name, passed, detail) => {
  report.checks.push({ name, passed, ...(detail === undefined ? {} : { detail }) });
  if (!passed) console.error('FAIL', name, detail);
};
const query = mode => 'hills=f2&hillsTransition=foothill&hillsTrees=sparse&fieldEdges=both&meadowStudy=complete&meadowForeground=' + mode;
const modes = ['points', 'regions', 'entrance'];
async function ready(p, url, motion = false) {
  p.on('pageerror', e => report.errors.push(e.message));
  await p.goto(historicalSceneUrl(url)); await p.locator('[data-hills-mode=f2]').waitFor();
  await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;' + (motion ? '' : 'transition:none!important;') + '}' });
  await p.evaluate(async () => { await document.fonts.ready; document.querySelectorAll('svg').forEach(s => { s.pauseAnimations(); s.setCurrentTime(0); }); });
  await p.waitForTimeout(650);
}
function snapshot() {
  const $ = s => document.querySelector(s), stage = $('#panoramic-world-stage'), clone = stage.cloneNode(true);
  clone.querySelectorAll('[data-near-meadow-plants],[data-meadow-regions]').forEach(e => e.remove());
  const foreground = $('[data-meadow-regions]') || $('[data-near-meadow-plants]');
  const m = stage.getScreenCTM();
  // Visible footprint outside HTML overlays. This samples bounding boxes, not painted-pixel coverage.
  const roots = [...document.querySelectorAll('[data-region-clump],[data-near-clump]')].map(e => {
    const world = e.dataset.worldRoot.split(',').map(Number), actual = new DOMPoint(0, 0).matrixTransform(e.getScreenCTM());
    const wanted = new DOMPoint(...world).matrixTransform(m), b = e.getBoundingClientRect();
    let inViewport = 0, unobscured = 0;
    for (let iy = 0; iy < 7; iy++) for (let ix = 0; ix < 9; ix++) {
      const x = b.x + b.width * (ix + .5) / 9, y = b.y + b.height * (iy + .5) / 7;
      if (x < 0 || x >= innerWidth || y < 0 || y >= innerHeight) continue;
      inViewport++;
      const target = document.elementFromPoint(x, y);
      if (target?.closest('svg') === stage.closest('svg')) unobscured++;
    }
    return { id: e.dataset.regionClump || e.dataset.nearClump, world, screen: { x: actual.x, y: actual.y },
      error: Math.hypot(actual.x - wanted.x, actual.y - wanted.y), box: b.toJSON(), inViewport, unobscured };
  });
  return {
    protected: [clone.outerHTML, $('#parallax-wheat-layer').outerHTML, $('#parallax-mountains-layer').outerHTML],
    matrices: ['#panoramic-world-stage', '#parallax-wheat-layer', '#parallax-mountains-layer'].map(s => getComputedStyle($(s)).transform),
    mode: $('[data-meadow-foreground]').dataset.meadowForeground,
    stats: JSON.parse($('[data-f2-hills]').dataset.stats), nodes: stage.closest('svg').querySelectorAll('*').length,
    pointer: getComputedStyle(foreground).pointerEvents,
    entrance: $('[data-meadow-entrance]') !== null, roots,
    visible: roots.filter(r => r.inViewport >= 3).length, unobscured: roots.filter(r => r.unobscured >= 3).length,
  };
}
function saved(d, image) {
  const { protected: protectedScene, ...rest } = d;
  return { ...rest, image, protectedHashes: protectedScene.map(hash) };
}
const cases = [
  { id: 'overview', label: '总览 · 1600×900', width: 1600, height: 900 },
  { id: 'desktop1200', label: '总览 · 1200×800', width: 1200, height: 800 },
  { id: 'mobile', label: '窄屏 · 390×844', width: 390, height: 844 },
  { id: 'living', label: '公共起居角聚焦', width: 1600, height: 900, room: 'living_nook' },
  { id: 'dusk', label: '黄昏总览', width: 1600, height: 900, theme: 'dusk' },
  { id: 'night', label: '深夜总览', width: 1600, height: 900, theme: 'night' },
  { id: 'rainy', label: '静雨总览', width: 1600, height: 900, theme: 'rainy' },
];
// Reuse immutable-camera evidence only when recapturing gesture tests, never by default.
const reuseFixed = process.env.F2_REUSE_FIXED_EVIDENCE === '1';
if (reuseFixed) {
  const previous = JSON.parse(await fs.readFile(out + '/verification.json', 'utf8'));
  report.scenarios = previous.scenarios; report.baselineDifference = previous.baselineDifference;
  report.checks = previous.checks.filter(c => cases.some(s => c.name.startsWith(s.id + ' ')) || c.name.startsWith('Previous complete scene'));
}
for (const c of reuseFixed ? [] : cases) {
  const p = await browser.newPage({ viewport: { width: c.width, height: c.height }, deviceScaleFactor: 1 });
  const row = { ...c, views: {} };
  for (const mode of modes) {
    await ready(p, base + '/tests/fixtures/world.html?' + query(mode) + '&theme=' + (c.theme || 'afternoon') + (c.room ? '&focusRoom=' + c.room : ''));
    const d = await p.evaluate(snapshot), image = c.id + '-' + mode + '.png';
    await p.screenshot({ path: out + '/' + image }); row.views[mode] = saved(d, image);
    check(c.id + ' ' + mode + ' composition and decorative input', d.mode === mode && d.pointer === 'none' && d.entrance === (mode === 'entrance') && d.roots.length === (mode === 'points' ? 2 : 6));
    check(c.id + ' ' + mode + ' F2 B retained', d.stats.mode === 'B' && d.stats.drawCalls === 3 && d.stats.programs === 2);
    if (mode !== 'points') check(c.id + ' ' + mode + ' all other scene content and cameras preserved',
      JSON.stringify(row.views.points.protectedHashes) === JSON.stringify(row.views[mode].protectedHashes) &&
      JSON.stringify(row.views.points.matrices) === JSON.stringify(d.matrices));
  }
  if (c.id === 'overview') {
    const a = PNG.sync.read(await fs.readFile('docs/visual-system/meadow-depth/overview-complete.png'));
    const b = PNG.sync.read(await fs.readFile(out + '/overview-points.png')); let changed = 0, max = 0;
    for (let i = 0; i < a.data.length; i += 4) { const d = Math.max(...[0,1,2].map(k => Math.abs(a.data[i+k] - b.data[i+k]))); max = Math.max(max, d); if (d > 1) changed++; }
    report.baselineDifference = { changed, max };
    check('Previous complete scene remains visually identical with default points', changed === 0, report.baselineDifference);
  }
  report.scenarios.push(row); await p.close(); console.log('Captured', c.id);
}
async function drag(p, dx) {
  await p.mouse.move(780, 710); await p.mouse.down(); await p.mouse.move(780 + dx, 710, { steps: 8 }); await p.mouse.up(); await p.waitForTimeout(500);
}
for (const mode of modes) {
  const p = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await ready(p, base + '/?' + query(mode));
  const row = { mode, views: {} };
  for (const state of ['overview', 'zoom', 'pan-left', 'pan-right']) {
    if (state !== 'overview') {
      if (state !== 'pan-right') {
        // Existing top-right controls overlap the app toolbar. Use accessible
        // bottom navigation and the real wheel handler, keeping the original UI.
        await p.getByRole('button', { name: '整栋小屋', exact: true }).click(); await p.waitForTimeout(500);
        await p.mouse.move(800, 700); await p.mouse.wheel(0, -.25 / .0012); await p.waitForTimeout(500);
      }
      // Reverse partway from the left pan. A right pan directly from zoom is
      // clamped by existing exploration bounds and would not exercise movement.
      if (state.startsWith('pan-')) await drag(p, state === 'pan-left' ? -120 : 60);
    }
    const d = await p.evaluate(snapshot), image = 'app-' + state + '-' + mode + '.png';
    await p.screenshot({ path: out + '/' + image }); row.views[state] = saved(d, image);
    if (state.startsWith('pan-')) check(mode + ' ' + state + ' actually moves within camera bounds',
      d.matrices[0] !== row.views[state === 'pan-left' ? 'zoom' : 'pan-left'].matrices[0]);
    check('Actual app ' + mode + ' ' + state + ' fixed roots and ground transform', d.roots.every(r => r.error < .001) &&
      JSON.stringify(d.roots.map(r => r.world)) === JSON.stringify(row.views.overview.roots.map(r => r.world)));
    if (mode !== 'points') {
      const previous = report.gestures[0].views[state];
      check('Actual app ' + mode + ' ' + state + ' improves visible foreground retention', d.unobscured > previous.unobscured,
        { points: previous.unobscured, new: d.unobscured });
      check('Actual app ' + mode + ' ' + state + ' same scene and camera',
        JSON.stringify(previous.protectedHashes) === JSON.stringify(row.views[state].protectedHashes) &&
        JSON.stringify(previous.matrices) === JSON.stringify(d.matrices));
    }
  }
  report.gestures.push(row); await p.close(); console.log('Gestures', mode);
}
// One short motion recording: focus reversal, zoom and drag across the new gate.
const ctx = await browser.newContext({ viewport: { width: 1600, height: 900 }, recordVideo: { dir: out + '/video', size: { width: 1600, height: 900 } } });
const p = await ctx.newPage(); await ready(p, base + '/tests/fixtures/world.html?' + query('entrance'), true);
await p.evaluate(() => {
  window.regionMotion = { stop: false, samples: 0, maxError: 0 };
  function tick() {
    const s = document.querySelector('#panoramic-world-stage'), m = s.getScreenCTM();
    for (const e of document.querySelectorAll('[data-region-clump]')) {
      const w = e.dataset.worldRoot.split(',').map(Number), a = new DOMPoint(...w).matrixTransform(m), b = new DOMPoint(0,0).matrixTransform(e.getScreenCTM());
      window.regionMotion.maxError = Math.max(window.regionMotion.maxError, Math.hypot(a.x-b.x, a.y-b.y));
    }
    window.regionMotion.samples++; if (!window.regionMotion.stop) requestAnimationFrame(tick);
  } requestAnimationFrame(tick);
});
await p.locator('#room-living_nook').dispatchEvent('click'); await p.waitForTimeout(60);
await p.evaluate(() => { for (const a of document.getAnimations()) if (a instanceof CSSTransition && a.transitionProperty === 'transform') { a.pause(); a.currentTime = 150; } });
await p.screenshot({ path: out + '/midpoint-entrance.png' });
await p.evaluate(() => { for (const a of document.getAnimations()) if (a instanceof CSSTransition) a.play(); });
await p.getByTitle('重置为田园全景').click(); await p.waitForTimeout(650);
const before = await p.locator('#panoramic-world-stage').getAttribute('style');
await p.mouse.move(275, 850); await p.mouse.down(); await p.mouse.move(375, 790, { steps: 10 }); await p.mouse.up(); await p.waitForTimeout(500);
check('Dragging through entrance does not steal ground gestures', before !== await p.locator('#panoramic-world-stage').getAttribute('style'));
await p.getByTitle('放大画面').click(); await p.waitForTimeout(550);
report.motion = await p.evaluate(() => { window.regionMotion.stop = true; return window.regionMotion; });
check('All animated samples retain ground attachment', report.motion.samples > 5 && report.motion.maxError < .001, report.motion);
await p.emulateMedia({ reducedMotion: 'reduce' });
check('Reduced motion preserves disabled camera easing', await p.locator('#panoramic-world-stage').evaluate(e => getComputedStyle(e).transitionDuration === '0s'));
await ctx.close(); const video = await p.video().path(); await fs.copyFile(video, out + '/camera-motion.webm'); await fs.unlink(video); await fs.rmdir(out + '/video');

const app = await browser.newPage({ viewport: { width: 1600, height: 900 } });
await app.addInitScript(() => {
  const Native = window.ResizeObserver; window.regionObservers = { created: 0, active: 0 };
  window.ResizeObserver = class extends Native {
    constructor(cb) { super(cb); window.regionObservers.created++; this.tracked = false; }
    observe(...args) { if (!this.tracked) { this.tracked = true; window.regionObservers.active++; } return super.observe(...args); }
    disconnect() { if (this.tracked) { this.tracked = false; window.regionObservers.active--; } return super.disconnect(); }
  };
});
await ready(app, base + '/?' + query('entrance')); const roots = (await app.evaluate(snapshot)).roots.map(r => r.world);
const created = await app.evaluate(() => window.regionObservers.created);
report.observers = { initial: await app.evaluate(() => window.regionObservers) };
check('Regions need no resize observer or independent loop', report.observers.initial.active === 2, report.observers.initial);
for (const [label, id] of [['黄昏','dusk'],['深夜','night'],['静雨','rainy'],['午后','afternoon']]) {
  await app.getByRole('button', { name: label, exact: true }).click(); await app.waitForTimeout(1650);
  const d = await app.evaluate(snapshot);
  check('Actual ' + id + ' theme uses one F2 B renderer and fixed roots', d.stats.mode === 'B' && d.stats.environment === id &&
    d.stats.environmentProgress === 1 && await app.locator('[data-f2-hills] canvas').count() === 1 &&
    JSON.stringify(roots) === JSON.stringify(d.roots.map(r => r.world)));
}
check('Themes do not recreate observers', created === await app.evaluate(() => window.regionObservers.created));
await app.setViewportSize({ width: 390, height: 844 }); await app.waitForTimeout(650);
const narrow = await app.evaluate(snapshot); await app.screenshot({ path: out + '/app-mobile-entrance.png' });
check('Resize retains same world roots and inward satellites', JSON.stringify(roots) === JSON.stringify(narrow.roots.map(r => r.world)) && narrow.unobscured >= 1, narrow.roots);
await app.locator('[data-f2-hills] canvas').evaluate(e => e.dispatchEvent(new Event('webglcontextlost', { cancelable: true })));
await app.locator('[data-hills-mode=legacy]').waitFor();
report.observers.afterFallback = await app.evaluate(() => window.regionObservers);
check('WebGL fallback removes experiments and releases F2 observer', await app.locator('[data-meadow-study=original][data-meadow-foreground=points]').count() === 1 &&
  await app.locator('[data-meadow-regions]').count() === 0 && report.observers.afterFallback.active === 1);
await app.close();
const legacy = await browser.newPage();
for (const q of ['hills=legacy&meadowStudy=complete&meadowForeground=entrance', query('entrance') + '&meadow=legacy',
  'hills=f2&meadowStudy=surface&meadowForeground=regions']) {
  await legacy.goto(historicalSceneUrl(base + '/tests/fixtures/world.html?' + q)); await legacy.locator('#panoramic-world-stage').waitFor(); await legacy.waitForTimeout(700);
  check('Other compositions ignore foreground trial: ' + q, await legacy.locator('[data-meadow-foreground=points]').count() === 1 && await legacy.locator('[data-meadow-regions]').count() === 0);
}
await legacy.close();
check('No page errors', report.errors.length === 0, report.errors);
report.passed = report.checks.every(c => c.passed);
await fs.writeFile(out + '/verification.json', JSON.stringify(report, null, 2));
await browser.close(); console.log(JSON.stringify({ passed: report.passed, checks: report.checks.length, failures: report.checks.filter(c => !c.passed) }, null, 2));
process.exitCode = report.passed ? 0 : 1;
