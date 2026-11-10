import assert from 'node:assert/strict';
import { test } from 'node:test';
import { clampPan } from '../../src/world/camera/cameraBounds';
import { OVERVIEW_CAMERA, sceneToViewBox } from '../../src/world/camera/cameraMath';
import { panoramaBottomMargin } from '../../src/world/camera/overviewFraming';
import { visibleViewBox } from '../../src/world/coordinates/viewport';
import { sceneExplorationBounds } from '../../src/world/scene/explorationBounds';
import { resolveRoomCamera } from '../../src/world/scene/roomTargets';
import { DEFAULT_SCENE_LAYOUT, entityPointToScene } from '../../src/world/scene/sceneLayout';
import { localPoint, scenePoint } from '../../src/world/scene/sceneTypes';

test('overview keeps the whole roof and cottage in the actual desktop, portrait and ultrawide crop', () => {
  for (const [width, height] of [[1200, 800], [1600, 900], [2560, 1080], [390, 844]]) {
    const viewport = visibleViewBox(width, height);
    const camera = resolveRoomCamera('overview', DEFAULT_SCENE_LAYOUT, viewport);
    for (const x of [-320, 320]) for (const y of [-243, 310]) {
      const p = sceneToViewBox(entityPointToScene(localPoint('main_cottage', x, y)), camera);
      assert.ok(p.x > viewport.minX && p.x < viewport.maxX, `${width}: cottage width`);
      assert.ok(p.y > viewport.minY && p.y < viewport.maxY, `${width}: roof and ground floor`);
    }
    const bounded = clampPan(camera, camera, viewport, undefined, true);
    assert.ok(Math.hypot(camera.x - bounded.x, camera.y - bounded.y) < .001, `${width}: initial pan must not jump`);
  }
  // The background's authored reference is deliberately independent of visitor framing.
  assert.deepEqual(OVERVIEW_CAMERA, { x: 0, y: 135, zoom: .66 });
});

test('farthest panorama limits empty foreground upwards and permits downward hill exploration', () => {
  const content = sceneExplorationBounds(DEFAULT_SCENE_LAYOUT);
  for (const [width, height] of [[1200, 800], [1600, 900], [390, 844], [2560, 1080]]) {
    const viewport = visibleViewBox(width, height), h = viewport.maxY - viewport.minY;
    const focus = resolveRoomCamera('overview', DEFAULT_SCENE_LAYOUT, viewport);
    for (const y of [-10000, 10000]) {
      const camera = clampPan({ x: focus.x, y, zoom: .45 }, focus, viewport, content, true);
      const bottom = sceneToViewBox(scenePoint(600, content.maxY), camera).y;
      const top = sceneToViewBox(scenePoint(600, content.minY), camera).y;
      if (y < 0) {
        assert.ok(bottom >= viewport.maxY - h * .16 - .001, `${width}: excess empty grass`);
        assert.ok(bottom <= viewport.maxY - h * .06 + .001, `${width}: lower navigation clearance`);
        assert.ok(top > viewport.minY, `${width}: roof clearance`);
      } else {
        assert.ok(top >= viewport.minY + h * .65 - .001, `${width}: hills remain reachable`);
      }
    }
  }
  assert.equal(panoramaBottomMargin(.45), .06);
  assert.equal(panoramaBottomMargin(2.5), .12);
});

test('overview responds to moved and scaled architecture without changing scene placement', () => {
  const layout = { ...DEFAULT_SCENE_LAYOUT, main_cottage: { position: scenePoint(650, 250), scale: 1.15 } };
  const viewport = visibleViewBox(390, 844);
  const camera = resolveRoomCamera('overview', layout, viewport);
  const center = sceneToViewBox(layout.main_cottage.position, camera);
  assert.ok(Math.abs(center.x - 600) < .001);
  assert.notDeepEqual(camera, resolveRoomCamera('overview', DEFAULT_SCENE_LAYOUT, viewport));
});
