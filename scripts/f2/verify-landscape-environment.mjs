import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
const base = process.env.F2_URL || 'http://127.0.0.1:3012';
const output = path.resolve('docs/visual-system/f2-baseline-audit-2026-10-24');
if (process.argv.includes('--baseline')) throw new Error('Before images are frozen from b059738; never regenerate them from current code.');
const baseline = false;
const cases = [
  { id: 'day', theme: 'day' },
  { id: 'dusk', theme: 'dusk' }, { id: 'night', theme: 'night' },
  { id: 'mobile', theme: 'day', width: 390, height: 844 },
  { id: 'living', theme: 'day', room: 'living_nook' },
  { id: 'zoom105', theme: 'day', zoom: 1.05 },
  { id: 'zoom160', theme: 'day', zoom: 1.6 },
];
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const report = { baseline, cases: [], errors: [], checks: [] };
const check = (name, passed, detail) => { report.checks.push({ name, passed, detail }); if (!passed) console.error('FAIL', name, JSON.stringify(detail)); };
try {
  for (const c of cases) {
    const page = await browser.newPage({ viewport: { width: c.width || 1600, height: c.height || 900 }, reducedMotion: 'reduce' });
    page.on('pageerror', e => report.errors.push({ id: c.id, message: e.message }));
    const query = new URLSearchParams({ theme: c.theme });
    if (c.room) query.set('focusRoom', c.room);
    await page.goto(`${base}/tests/fixtures/world.html?${query}`);
    await page.locator('[data-hills-mode="f2"]').waitFor();
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    await page.evaluate(async () => { await document.fonts.ready; document.querySelectorAll('svg').forEach(svg => { svg.pauseAnimations(); svg.setCurrentTime(0); }); });
    if (c.zoom) await page.locator('#panoramic-world-stage').evaluate((e, zoom) => e.closest('svg').dispatchEvent(new WheelEvent('wheel', { deltaY: (Number(e.dataset.zoom) - zoom) / .0012, bubbles: true, cancelable: true })), c.zoom);
    await page.waitForTimeout(150);
    const data = await page.evaluate(() => {
      const $ = s => document.querySelector(s);
      const stats = JSON.parse($('[data-f2-hills]').dataset.stats);
      const matrix = id => getComputedStyle($(id)).transform;
      const projection = id => {
        const { a,b,c,d,e,f } = $(id).getScreenCTM();
        return [a,b,c,d,e,f].join(',');
      };
      const meadow = $('#master-axonometric-ground-plane > path:nth-of-type(2)');
      const wheel = new DOMPoint(22, 46).matrixTransform($('#tractor-in-field').getScreenCTM());
      const localWheel = wheel.matrixTransform(meadow.getScreenCTM().inverse());
      const feather = [...document.querySelectorAll('#homestead-organic-meadow-grounds > path')].map(e => Number(e.getAttribute('opacity')));
      const legacyPlants = ['lawn-natural-grass-tufts','clover-turf-patches','meadow-field-blossoms','beehive-meadow-grass','beehive-meadow-wildflowers','beehive-lavender-flowers']
        .map(id => ({id, display:getComputedStyle(document.getElementById(id)).display}));
      return { stats, feather, legacyPlants, wheelOccluded: meadow.isPointInFill(localWheel),
        matrices: { ground: matrix('#panoramic-world-stage'), mountains: projection('#parallax-mountains-layer'), wheat: matrix('#parallax-wheat-layer'), foothill: projection('#parallax-foothill-layer'), trees: projection('#parallax-foothill-trees-layer'), railway: $('#parallax-railway-layer') ? projection('#parallax-railway-layer') : null },
        treeSpecies: [...new Set([...document.querySelectorAll('[data-tree-species]')].map(e => e.dataset.treeSpecies))],
        farmRoots: [...document.querySelectorAll('[data-farmstead-root]')].map(e => e.dataset.farmsteadRoot),
        groundTop: $('#isoGroundPastureGrad stop').getAttribute('stop-color'), wheatTop: $('#pastoralRollingWheatGrad stop').getAttribute('stop-color'),
        supportFill: $('[data-foothill-surface]').getAttribute('fill'), grassUsesStage: !!meadow.closest('#panoramic-world-stage') && projection('#master-axonometric-ground-plane') === projection('#panoramic-world-stage'), cropLockedClip: !!$('#field-meadow-contact-clip'), skyFallback: !!$('#f2-existing-sky'), entrance: !!$('[data-meadow-entrance]') };
    });
    if (!baseline) {
      const parse=m=>{const v=m.slice(7,-1).split(',').map(Number);return {a:v[0],e:v[4],f:v[5]};};
      const ground=parse(data.matrices.ground),field=parse(data.matrices.wheat);
      check(c.id + ': original independent crop damping', Math.abs(field.a-(.66+(ground.a-.66)*.7))<.0002 && Math.abs(field.e-ground.e*.65)<.01 && Math.abs(field.f-(135+(ground.f-135)*.55))<.01, data.matrices);
      check(c.id + ': foothill and roots belong to mountains', data.matrices.mountains === data.matrices.foothill && data.matrices.foothill === data.matrices.trees && data.matrices.railway === data.matrices.foothill, data.matrices);
      check(c.id + ': source mountain is not covered by an opaque foothill', data.supportFill === 'transparent');
      check(c.id + ': real grass contour retains foreground projection', data.grassUsesStage && !data.cropLockedClip);
      check(c.id + ': source sky and B retained', data.stats.skyVisible && data.stats.mode === 'B' && data.stats.drawCalls === 4 && !data.skyFallback, data.stats);
      check(c.id + ': flat meadow and entrance retained', data.feather.every(x => x === 0) && data.entrance, data.feather);
      check(c.id + ': superseded plants stay hidden', data.legacyPlants.every(p=>p.display==='none'), data.legacyPlants);
      if (['day','dusk','night','mobile'].includes(c.id)) check(c.id + ': overview wheel clearance retained', !data.wheelOccluded);
      check(c.id + ': rooted mixed woodland', data.treeSpecies.length === 3 && data.farmRoots.length === 2, { species: data.treeSpecies, farms: data.farmRoots });
    }
    await page.screenshot({ path: path.join(output, `${baseline ? 'before' : 'after'}-${c.id}.png`) });
    report.cases.push({ ...c, ...data });
    await page.close();
  }
} finally { await browser.close(); }
report.passed = !report.errors.length && report.checks.every(c => c.passed);
await fs.writeFile(path.join(output, baseline ? 'baseline.json' : 'verification.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ baseline, passed: report.passed, cases: report.cases.length, checks: report.checks.length, errors: report.errors }));
if (!report.passed) process.exitCode = 1;
