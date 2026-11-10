import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sceneToViewBox, viewBoxToScene } from '../../src/world/camera/cameraMath';
import { visibleViewBox } from '../../src/world/coordinates/viewport';
import { ROOM_FOCUS, resolveRoomCamera } from '../../src/world/scene/roomTargets';
import { DEFAULT_SCENE_LAYOUT, entityPointToScene } from '../../src/world/scene/sceneLayout';
import { localPoint, scenePoint } from '../../src/world/scene/sceneTypes';

test('room focuses center their activity with context while the overview adapts to the visible crop', () => {
  for (const [width, height] of [[1200,800],[1600,900],[390,844]]) {
    const viewport = visibleViewBox(width, height);
    const overview = resolveRoomCamera('overview', DEFAULT_SCENE_LAYOUT, viewport);
    assert.ok(overview.zoom >= .45 && overview.zoom <= .54);
    for (const room of Object.keys(ROOM_FOCUS) as (keyof typeof ROOM_FOCUS)[]) {
      const target = ROOM_FOCUS[room];
      const camera = resolveRoomCamera(room, DEFAULT_SCENE_LAYOUT, viewport);
      const point = sceneToViewBox(entityPointToScene(target.localAnchor), camera);
      assert.ok(Math.abs(point.x - 600) < 1e-8);
      assert.ok(point.y > viewport.minY + 80 && point.y < viewport.maxY - 80);
      const scale = DEFAULT_SCENE_LAYOUT[target.targetEntity].scale;
      assert.ok(target.contextSize.width * scale * camera.zoom <= (viewport.maxX-viewport.minX)*(target.frameToViewport ? 1 : .86) + 0.03);
      assert.ok(target.contextSize.height * scale * camera.zoom <= (viewport.maxY-viewport.minY)*(target.frameToViewport ? 1 : .76) + 0.03);
      assert.ok(camera.zoom <= target.zoom);
    }
  }
  assert.ok(resolveRoomCamera('my_room').zoom <= 1.2);
  assert.ok(resolveRoomCamera('living_nook').zoom > 1.3);
});
test('living view meets the pumpkin and entrance-step crop on laptop screens', () => {
  for (const [width, height] of [[1366,768], [1440,900], [2444,1349]]) {
    const viewport = visibleViewBox(width, height);
    for (const scale of [.8, 1, 1.2]) {
      const layout = { ...DEFAULT_SCENE_LAYOUT, main_cottage: { position: scenePoint(580, 240), scale } };
      const camera = resolveRoomCamera('living_nook', layout, viewport);
      // A smaller entity may reach the existing maximum zoom before filling the screen.
      const inset = Math.max(0, (viewport.maxY - viewport.minY - 366 * scale * 2.5) / 2);
      for (const [localY, edge] of [[-128, viewport.minY + inset], [238, viewport.maxY - inset]]) {
        const point = sceneToViewBox(entityPointToScene(localPoint('main_cottage', 0, localY), layout), camera);
        assert.ok(Math.abs(point.y - edge) < .02, `${width}x${height}, scale=${scale}: edge drift`);
      }
    }
  }
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
