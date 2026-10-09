import assert from 'node:assert/strict';
import { test } from 'node:test';
import { clampPan, panBounds } from '../../src/world/camera/cameraBounds';
import { OVERVIEW_CAMERA, sceneToViewBox } from '../../src/world/camera/cameraMath';
import { FULL_VIEWBOX, visibleViewBox } from '../../src/world/coordinates/viewport';
import { sceneExplorationBounds } from '../../src/world/scene/explorationBounds';
import { resolveRoomCamera } from '../../src/world/scene/roomTargets';
import { DEFAULT_SCENE_LAYOUT } from '../../src/world/scene/sceneLayout';
import { scenePoint } from '../../src/world/scene/sceneTypes';

test('visible slice rectangle follows wide and portrait screen crops', () => {
  assert.deepEqual(visibleViewBox(1200, 800), FULL_VIEWBOX);
  assert.deepEqual(visibleViewBox(1600, 900), { minX: 0, maxX: 1200, minY: 62.5, maxY: 737.5 });
  const phone = visibleViewBox(390, 844);
  assert.equal(phone.minY, 0);
  assert.equal(phone.maxY, 800);
  assert.ok(Math.abs(phone.maxX - phone.minX - 390 * 800 / 844) < 1e-9);
});

test('overview travel keeps solid buildings inside the vertical composition at minimum zoom', () => {
  const content = sceneExplorationBounds(DEFAULT_SCENE_LAYOUT);
  for (const [width, height] of [[1200, 800], [1600, 900], [390, 844]]) {
    const viewport = visibleViewBox(width, height);
    for (const zoom of [0.45, 0.66]) {
      for (const y of [-10000, 10000]) {
        const camera = clampPan({ x: 0, y, zoom }, OVERVIEW_CAMERA, viewport, content);
        const top = sceneToViewBox(scenePoint(600, content.minY), camera).y;
        const bottom = sceneToViewBox(scenePoint(600, content.maxY), camera).y;
        assert.ok(top >= viewport.minY + (viewport.maxY - viewport.minY) * 0.18 - 1e-8);
        assert.ok(bottom <= viewport.maxY - (viewport.maxY - viewport.minY) * 0.12 + 1e-8);
        assert.ok(camera.y > -120 && camera.y < 300);
      }
    }
  }
});

test('bounds change with zoom, screen crop and moved scene placement', () => {
  const camera = { ...OVERVIEW_CAMERA, zoom: 0.45 };
  const desktop = panBounds(camera, OVERVIEW_CAMERA);
  const phone = panBounds(camera, OVERVIEW_CAMERA, visibleViewBox(390, 844));
  const closeUp = panBounds({ ...camera, zoom: 1.6 }, OVERVIEW_CAMERA);
  assert.notDeepEqual(desktop, phone);
  assert.notDeepEqual(desktop, closeUp);
  const moved = { ...DEFAULT_SCENE_LAYOUT, observatory: { position: scenePoint(DEFAULT_SCENE_LAYOUT.observatory.position.x + 500, 600), scale: 0.8 } };
  const movedBounds = sceneExplorationBounds(moved);
  assert.ok(movedBounds.maxX > sceneExplorationBounds(DEFAULT_SCENE_LAYOUT).maxX + 400);
  assert.notDeepEqual(panBounds(camera, OVERVIEW_CAMERA, FULL_VIEWBOX, movedBounds), desktop);
});

test('responsive room focuses and nearby travel remain reachable after placement changes', () => {
  const moved = { ...DEFAULT_SCENE_LAYOUT, observatory: { position: scenePoint(1200, 460), scale: 0.8 } };
  const content = sceneExplorationBounds(moved);
  for (const room of ['my_room', 'living_nook', 'friend_room', 'capsule_pod', 'corn_lounge', 'observatory', 'porch_mailbox'] as const) {
    for (const [width, height] of [[1200, 800], [1600, 900], [390, 844]]) {
      const viewport = visibleViewBox(width, height);
      const focus = resolveRoomCamera(room, moved, viewport);
      assert.deepEqual(clampPan(focus, focus, viewport, content), focus);
      const nearby = { ...focus, x: focus.x + 40, y: focus.y + 30 };
      assert.deepEqual(clampPan(nearby, focus, viewport, content), nearby);
    }
  }
});
