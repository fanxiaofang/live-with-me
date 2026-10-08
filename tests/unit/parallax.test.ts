import assert from 'node:assert/strict';
import { test } from 'node:test';
import { OVERVIEW_CAMERA } from '../../src/world/camera/cameraMath';
import {
  PARALLAX_PRESETS,
  getParallaxTransformStyle,
  resolveParallaxCamera,
} from '../../src/world/camera/parallaxMath';

test('parallax camera at overview matches base camera exactly', () => {
  for (const preset of Object.values(PARALLAX_PRESETS)) {
    const resolved = resolveParallaxCamera(OVERVIEW_CAMERA, preset);
    assert.equal(resolved.x, OVERVIEW_CAMERA.x);
    assert.equal(resolved.y, OVERVIEW_CAMERA.y);
    assert.equal(resolved.zoom, OVERVIEW_CAMERA.zoom);
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
  assert.equal(idleStyle.transition, 'transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1)');
  assert.equal(idleStyle.willChange, undefined);
});
