import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_SCENE_LAYOUT, entityPointToScene } from '../../src/world/scene/sceneLayout';
import { ROOM_FOCUS, resolveRoomCamera } from '../../src/world/scene/roomTargets';
import { sceneToViewBox, viewBoxToScene } from '../../src/world/camera/cameraMath';
import { scenePoint } from '../../src/world/scene/sceneTypes';

test('all compatibility anchors reproduce the original camera framing', () => {
  const expected = { overview: [0,135,0.66], my_room:[220,150,1.55], living_nook:[20,130,1.55], friend_room:[-180,140,1.55],
    porch_mailbox:[40,-80,1.5], capsule_pod:[-280,60,1.6], corn_lounge:[210,-30,1.6], observatory:[-380,30,1.6] };
  for (const [room, values] of Object.entries(expected)) {
    const camera = resolveRoomCamera(room as keyof typeof expected);
    [camera.x, camera.y, camera.zoom].forEach((v, i) => assert.ok(Math.abs(v-values[i]) < 1e-9));
  }
});
test('station placement, local anchor and camera follow the same transform', () => {
  const moved = { ...DEFAULT_SCENE_LAYOUT, observatory: { position: scenePoint(1200,460), scale:0.8 } };
  const baseCamera = resolveRoomCamera('observatory');
  const camera = resolveRoomCamera('observatory',moved);
  assert.equal(camera.x, baseCamera.x-320);
  assert.deepEqual(sceneToViewBox(entityPointToScene(ROOM_FOCUS.observatory.localAnchor,moved),camera), ROOM_FOCUS.observatory.compositionPoint);
});
test('camera transforms round-trip points at minimum and maximum zoom', () => {
  for (const zoom of [0.45,0.66,1.6,2.5]) {
    const p=scenePoint(1200,460);
    assert.deepEqual(viewBoxToScene(sceneToViewBox(p,{x:-700,y:30,zoom}),{x:-700,y:30,zoom}),p);
  }
});
