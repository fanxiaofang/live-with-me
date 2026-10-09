import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sceneToViewBox, viewBoxToScene } from '../../src/world/camera/cameraMath';
import { visibleViewBox } from '../../src/world/coordinates/viewport';
import { ROOM_FOCUS, resolveRoomCamera } from '../../src/world/scene/roomTargets';
import { DEFAULT_SCENE_LAYOUT, entityPointToScene } from '../../src/world/scene/sceneLayout';
import { scenePoint } from '../../src/world/scene/sceneTypes';

test('room focuses center their activity with context while preserving the accepted overview', () => {
  for (const [width, height] of [[1200,800],[1600,900],[390,844]]) {
    const viewport = visibleViewBox(width, height);
    assert.deepEqual(resolveRoomCamera('overview', DEFAULT_SCENE_LAYOUT, viewport), { x:0, y:135, zoom:0.66 });
    for (const room of Object.keys(ROOM_FOCUS) as (keyof typeof ROOM_FOCUS)[]) {
      const target = ROOM_FOCUS[room];
      const camera = resolveRoomCamera(room, DEFAULT_SCENE_LAYOUT, viewport);
      const point = sceneToViewBox(entityPointToScene(target.localAnchor), camera);
      assert.ok(Math.abs(point.x - 600) < 1e-8);
      assert.ok(point.y > viewport.minY + 80 && point.y < viewport.maxY - 80);
      const scale = DEFAULT_SCENE_LAYOUT[target.targetEntity].scale;
      assert.ok(target.contextSize.width * scale * camera.zoom <= (viewport.maxX-viewport.minX)*0.86 + 0.03);
      assert.ok(target.contextSize.height * scale * camera.zoom <= (viewport.maxY-viewport.minY)*0.76 + 0.03);
      assert.ok(camera.zoom <= target.zoom);
    }
  }
  for (const room of ['my_room','living_nook','friend_room'] as const) assert.ok(resolveRoomCamera(room).zoom <= 1.3);
});
test('station placement, local anchor and camera follow the same transform', () => {
  const moved = { ...DEFAULT_SCENE_LAYOUT, observatory: { position: scenePoint(DEFAULT_SCENE_LAYOUT.observatory.position.x + 200, DEFAULT_SCENE_LAYOUT.observatory.position.y), scale:0.8 } };
  const baseCamera = resolveRoomCamera('observatory');
  const camera = resolveRoomCamera('observatory',moved);
  assert.equal(camera.x, baseCamera.x-200*camera.zoom);
  assert.deepEqual(sceneToViewBox(entityPointToScene(ROOM_FOCUS.observatory.localAnchor,moved),camera), ROOM_FOCUS.observatory.compositionPoint);
});
test('camera transforms round-trip points at minimum and maximum zoom', () => {
  for (const zoom of [0.45,0.66,1.6,2.5]) {
    const p=scenePoint(1200,460);
    assert.deepEqual(viewBoxToScene(sceneToViewBox(p,{x:-700,y:30,zoom}),{x:-700,y:30,zoom}),p);
  }
});
