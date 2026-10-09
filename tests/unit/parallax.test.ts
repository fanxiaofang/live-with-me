import assert from 'node:assert/strict';
import { test } from 'node:test';
import { OVERVIEW_CAMERA, sceneToViewBox } from '../../src/world/camera/cameraMath';
import { scenePoint } from '../../src/world/scene/sceneTypes';
import {
  PARALLAX_PRESETS,
  getParallaxTransformStyle,
  resolveParallaxCamera,
  resolveLandscapeCoverage,
} from '../../src/world/camera/parallaxMath';

test('parallax camera at overview matches base camera exactly', () => {
  for (const preset of Object.values(PARALLAX_PRESETS)) {
    const resolved = resolveParallaxCamera(OVERVIEW_CAMERA, preset);
    assert.equal(resolved.x, OVERVIEW_CAMERA.x);
    assert.equal(resolved.y, OVERVIEW_CAMERA.y);
    assert.equal(resolved.zoom, OVERVIEW_CAMERA.zoom);
  }
});

test('terrain skirts cover both seams across the original failing pan/zoom domain', () => {
  assert.deepEqual(resolveLandscapeCoverage(OVERVIEW_CAMERA), { mountainFrontExtension: 0, wheatFrontExtension: 0 });
  for (const zoom of [0.45, 0.66, 0.95, 1.6, 2.5]) {
    for (let y = -120; y <= 330; y += 15) {
      const camera = { x: 0, y, zoom };
      const coverage = resolveLandscapeCoverage(camera);
      const mountains = resolveParallaxCamera(camera, PARALLAX_PRESETS.mountains);
      const wheat = resolveParallaxCamera(camera, PARALLAX_PRESETS.wheat);
      const project = (localY: number, layer: typeof camera, offset: number = -115) =>
        sceneToViewBox(scenePoint(0, localY + offset), layer).y;
      assert.ok(project(238 + coverage.mountainFrontExtension, mountains) >= project(225, wheat) + 7.9999);
      assert.ok(project(355 + coverage.wheatFrontExtension, wheat) >= project(190, camera, 0) + 7.9999);
    }
  }
});

test('parallax damping applies fractional translation and zoom when panned', () => {
  const pannedCamera = { x: 200, y: 135, zoom: 1.66 };
  const skyCamera = resolveParallaxCamera(pannedCamera, PARALLAX_PRESETS.sky);
  assert.equal(skyCamera.x, 16); // 200 * 0.08
  assert.equal(skyCamera.y, 135); // 135 + 0
  assert.equal(skyCamera.zoom, 0.81); // 0.66 + 1.0 * 0.15

  const mountainCamera = resolveParallaxCamera(pannedCamera, PARALLAX_PRESETS.mountains);
  assert.equal(mountainCamera.x, 56); // 200 * 0.28
  assert.equal(mountainCamera.zoom, 1.06); // 0.66 + 1.0 * 0.40

  const wheatCamera = resolveParallaxCamera(pannedCamera, PARALLAX_PRESETS.wheat);
  assert.equal(wheatCamera.x, 130); // 200 * 0.65
  assert.equal(wheatCamera.zoom, 1.36); // 0.66 + 1.0 * 0.70

  const stageCamera = resolveParallaxCamera(pannedCamera, PARALLAX_PRESETS.stage);
  assert.equal(stageCamera.x, 200);
  assert.equal(stageCamera.zoom, 1.66);
});

test('parallax style reflects dragging state with transition suppression', () => {
  const draggingStyle = getParallaxTransformStyle(OVERVIEW_CAMERA, PARALLAX_PRESETS.sky, true);
  assert.equal(draggingStyle.transition, 'none');
  assert.equal(draggingStyle.willChange, 'transform');

  const idleStyle = getParallaxTransformStyle(OVERVIEW_CAMERA, PARALLAX_PRESETS.sky, false);
  assert.equal(idleStyle.transition, 'transform 400ms cubic-bezier(0.2, 0.8, 0.2, 1)');
  assert.equal(idleStyle.willChange, undefined);
});
