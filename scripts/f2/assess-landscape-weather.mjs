// Isolated migration probe. It never changes the production renderer or stored settings.
import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { CURRENT_F2_SCENE } from '../../src/world/scene/currentScene.ts';

const base = process.env.F2_URL || 'http://127.0.0.1:3012';
const output = path.resolve('docs/visual-system/f2-priority-review-2026-10-23');
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'msedge', headless: true });
const report = {
  date: '2026-10-23', base, kind: 'isolated-compositing-probe',
  baseline: CURRENT_F2_SCENE,
  baselineCorrection: 'The current scene includes all committed F2 work, including the entrance and its plant clearance. Scene options are shared with the app rather than copied into capture URLs.',
  productionImplementationChangedByProbe: false, cases: [], errors: [],
  limitations: [
    'Temporary renderer replaces the visible background only inside this browser run.',
    'No production lifecycle, fallback, environment transition or device performance acceptance.',
    'The source sky keeps its screen-space projection; its horizon still needs art calibration.',
    'Fog and snow are probe inputs, not new user-facing weather options.',
  ],
};
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const cases = [
  { id: 'day', host: 'afternoon', time: 'day', weather: 'clear' },
  { id: 'dusk', host: 'dusk', time: 'dusk', weather: 'clear' },
  { id: 'night', host: 'night', time: 'night', weather: 'clear' },
  { id: 'rain', host: 'rainy', time: 'day', weather: 'lightRain' },
  { id: 'fog-night', host: 'night', time: 'night', weather: 'lightFog' },
  { id: 'mobile-day', host: 'afternoon', time: 'day', weather: 'clear', width: 390, height: 844 },
  { id: 'living-day', host: 'afternoon', time: 'day', weather: 'clear', room: 'living_nook' },
];

try {
  for (const item of cases) {
    const page = await browser.newPage({ viewport: { width: item.width || 1600, height: item.height || 900 }, reducedMotion: 'reduce' });
    page.on('pageerror', error => report.errors.push({ case: item.id, message: error.message }));
    // Exercise the real default; only the theme and camera vary between cases.
    const query = new URLSearchParams({ theme: item.host });
    if (item.room) query.set('focusRoom', item.room);
    await page.goto(`${base}/tests/fixtures/world.html?${query}`);
    await page.locator('[data-hills-mode="f2"]').waitFor();
    if (await page.locator('#f2-existing-sky').count() === 0) {
      throw new Error('This historical probe targets pre-migration F2 (c9b989b). Current source-sky verification: node scripts/f2/verify-landscape-environment.mjs');
    }
    await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      document.querySelectorAll('svg').forEach(svg => { svg.pauseAnimations(); svg.setCurrentTime(0); });
    });
    await page.waitForTimeout(250);
    const before = await page.evaluate(() => ({
      protected: ['#panoramic-world-stage', '#parallax-wheat-layer', '#parallax-mountains-layer', '#parallax-foothill-layer', '#parallax-foothill-trees-layer'].map(id => document.querySelector(id).outerHTML),
      hostSky: document.querySelector('#f2-existing-sky').outerHTML,
      stats: JSON.parse(document.querySelector('[data-f2-hills]').dataset.stats),
      meadow: {
        study: document.querySelector('[data-meadow-study]').dataset.meadowStudy,
        foreground: document.querySelector('[data-meadow-foreground]').dataset.meadowForeground,
        featherOpacities: Array.from(document.querySelectorAll('#homestead-organic-meadow-grounds > path')).map(p => Number(p.getAttribute('opacity'))),
        coreFill: document.querySelector('#homestead-organic-meadow-grounds > g[mask] > path').getAttribute('fill'),
        regionsPresent: !!document.querySelector('[data-meadow-regions]'),
        entrancePresent: !!document.querySelector('[data-meadow-entrance]'),
      },
    }));
    const correctMeadow = before.meadow.study === report.baseline.meadowStudy && before.meadow.foreground === report.baseline.meadowForeground
      && before.meadow.regionsPresent && before.meadow.entrancePresent && before.meadow.featherOpacities.length === 2
      && before.meadow.featherOpacities.every(opacity => opacity === 0)
      && !before.meadow.coreFill.includes('isoTerraceTurfGrad');
    if (!correctMeadow) throw new Error(`Incorrect meadow baseline: ${JSON.stringify(before.meadow)}`);
    await page.screenshot({ path: path.join(output, `${item.id}-current.png`) });
    const probe = await page.evaluate(async item => {
      const [{ createF2Backdrop }, { resolveLook, updateRidgeMaterial }, { updateReliefMaterial }, { f2Projection, sampleWorldView }, { F2_PLACEMENT }, { default: baseline }, { default: study }] = await Promise.all([
        import('/src/world/render/f2/vendor/f2/createF2Backdrop.js'),
        import('/src/world/render/f2/vendor/backdrop/ridgeMaterial.js'),
        import('/src/world/render/f2/vendor/f2/reliefMaterial.js'),
        import('/src/world/render/f2/F2CameraAdapter.ts'),
        import('/src/world/render/f2/f2Config.ts'),
        import('/src/world/render/f2/config/baseline.json'),
        import('/src/world/render/f2/config/study.json'),
      ]);
      const original = document.querySelector('[data-f2-hills]');
      const originalSky = document.querySelector('#f2-existing-sky').closest('svg');
      const container = document.createElement('div');
      container.dataset.weatherProbe = 'true';
      Object.assign(container.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
      original.parentElement.insertBefore(container, original);
      const f2 = createF2Backdrop(container, baseline, study, { observeResize: false, transparentBackground: false, pixelRatio: 1 });
      Object.assign(f2.canvas.style, { width: '100%', height: '100%' });
      const meshes = f2.core.scene.children.filter(child => child.isMesh && child.renderOrder >= 0 && child.renderOrder <= 4);
      const sky = f2.core.scene.children.find(child => child.renderOrder === -100);
      const view = sampleWorldView(document.querySelector('#panoramic-world-stage').closest('svg'));
      f2.resize(view.width, view.height, 1);
      meshes.forEach((mesh, index) => {
        const position = mesh.geometry.getAttribute('position');
        for (let i = 12; i < position.count; i += 13) position.setY(i, F2_PLACEMENT.hiddenBottom);
        position.needsUpdate = true;
        const p = f2Projection(view, index);
        mesh.position.set(p.x, p.y, 0);
        mesh.scale.set(p.scale, p.scale, 1);
      });
      const identity = meshes.map(mesh => ({ mesh: mesh.uuid, geometry: mesh.geometry.uuid, material: mesh.material.uuid }));
      function environment(time, weather) {
        const config = structuredClone(baseline);
        Object.assign(config, { timeOfDay: time, weather });
        meshes.forEach((mesh, i) => updateRidgeMaterial(mesh, resolveLook(config, config.layers[i], i)));
        const look = resolveLook(config, config.layers[0], 0);
        for (const [uniform, key] of [['uTop', 'top'], ['uAir', 'air'], ['uHorizon', 'horizon']]) sky.material.uniforms[uniform].value.copy(look[key]);
        const lighting = structuredClone(study);
        if (time === 'dusk') Object.assign(lighting.lighting, { sunAzimuth: 65, sunElevation: 15 });
        if (time === 'night') lighting.lighting.sunIntensity = 0;
        updateReliefMaterial(f2.getReliefMaterial(), lighting, baseline.layers[2].points);
        // Full sky pass: production's wheat scissor cannot be applied to this pass.
        f2.core.renderer.setScissorTest(false);
        f2.render();
        return { top: look.top.getHexString(), air: look.air.getHexString(), horizon: look.horizon.getHexString(), light: look.light };
      }
      const sequence = [];
      for (const [time, weather] of [['day', 'clear'], ['dusk', 'clear'], ['night', 'clear'], ['day', 'lightRain'], ['night', 'lightFog']]) {
        const look = environment(time, weather);
        sequence.push({ time, weather, look, identityStable: meshes.every((mesh, i) => mesh.uuid === identity[i].mesh && mesh.geometry.uuid === identity[i].geometry && mesh.material.uuid === identity[i].material) });
      }
      const look = environment(item.time, item.weather);
      const firstFrame = f2.canvas.toDataURL();
      f2.render();
      const repeatFrameIdentical = firstFrame === f2.canvas.toDataURL();
      original.style.visibility = 'hidden';
      originalSky.style.visibility = 'hidden';
      window.__weatherProbe = { f2, container, original, originalSky };
      const gl = f2.core.renderer.getContext();
      const samples = [[0, 0], [gl.drawingBufferWidth - 1, 0], [0, gl.drawingBufferHeight - 1], [gl.drawingBufferWidth - 1, gl.drawingBufferHeight - 1]].map(([x, y]) => {
        const rgba = new Uint8Array(4);
        gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
        return { x, y, rgba: Array.from(rgba) };
      });
      return { look, sequence, stats: f2.getStats(), repeatFrameIdentical, opaqueCorners: samples.every(sample => sample.rgba[3] === 255), cornerSamples: samples, skyVisible: sky.visible, skyDitherEnabled: sky.material.dithering, reliefRetained: meshes[2].material === f2.getReliefMaterial(), protected: ['#panoramic-world-stage', '#parallax-wheat-layer', '#parallax-mountains-layer', '#parallax-foothill-layer', '#parallax-foothill-trees-layer'].map(id => document.querySelector(id).outerHTML) };
    }, item);
    await page.screenshot({ path: path.join(output, `${item.id}-probe.png`) });
    const protectedIdentical = before.protected.every((value, i) => value === probe.protected[i]);
    const protectedHashes = before.protected.map((value, i) => ({ before: digest(value), after: digest(probe.protected[i]) }));
    delete before.protected;
    delete probe.protected;
    const cleanup = await page.evaluate(() => {
      const p = window.__weatherProbe;
      p.f2.dispose();
      p.container.remove();
      p.original.style.visibility = '';
      p.originalSky.style.visibility = '';
      return { removed: !document.querySelector('[data-weather-probe]'), hostRestored: getComputedStyle(p.original).visibility === 'visible', disposed: p.f2.getStats().disposed };
    });
    report.cases.push({ ...item, url: page.url(), correctMeadow, current: before, probe, protectedIdentical, protectedHashes, cleanup });
    await page.close();
  }
} finally {
  await browser.close();
}
report.passed = !report.errors.length && report.cases.length === cases.length && report.cases.every(item => item.correctMeadow && item.protectedIdentical && item.probe.repeatFrameIdentical && item.probe.opaqueCorners && item.probe.skyVisible && item.probe.skyDitherEnabled && item.probe.reliefRetained && item.probe.sequence.every(step => step.identityStable) && item.cleanup.removed && item.cleanup.hostRestored && item.cleanup.disposed);
await fs.writeFile(path.join(output, 'probe.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ passed: report.passed, cases: report.cases.length, errors: report.errors, output }));
if (!report.passed) process.exitCode = 1;
