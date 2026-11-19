import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveRoomCamera, ROOM_FOCUS } from '../../src/world/scene/roomTargets';
import { DEFAULT_SCENE_LAYOUT, entityPointToScene } from '../../src/world/scene/sceneLayout';
import { PARALLAX_PRESETS, resolveParallaxCamera } from '../../src/world/camera/parallaxMath';
import { sceneToViewBox } from '../../src/world/camera/cameraMath';
import { scenePoint } from '../../src/world/scene/sceneTypes';

test('麦田电波塔聚焦通过麦田相机居中，并跟随保存的位置', () => {
  for (const offset of [{x:0,y:0},{x:540,y:18},{x:-120,y:100}]) {
    const layout={...DEFAULT_SCENE_LAYOUT,observatory:{...DEFAULT_SCENE_LAYOUT.observatory,
      position:scenePoint(DEFAULT_SCENE_LAYOUT.observatory.position.x+offset.x,DEFAULT_SCENE_LAYOUT.observatory.position.y+offset.y)}};
    const master=resolveRoomCamera('observatory',layout);
    const wheat=resolveParallaxCamera(master,PARALLAX_PRESETS.wheat);
    const point=sceneToViewBox(entityPointToScene(ROOM_FOCUS.observatory.localAnchor,layout),wheat);
    assert.ok(Math.abs(point.x-600)<.1);
    assert.ok(Math.abs(point.y-400)<.1);
    assert.equal(wheat.zoom,1.45);
  }
});
