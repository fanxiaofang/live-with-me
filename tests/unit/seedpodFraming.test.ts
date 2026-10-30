import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveRoomCamera } from '../../src/world/scene/roomTargets';
import { DEFAULT_SCENE_LAYOUT, entityPointToScene } from '../../src/world/scene/sceneLayout';
import { localPoint } from '../../src/world/scene/sceneTypes';
import { sceneToViewBox } from '../../src/world/camera/cameraMath';
import { visibleViewBox } from '../../src/world/coordinates/viewport';
import { sceneExplorationBounds } from '../../src/world/scene/explorationBounds';

test('cottage room focus keeps the new chimney and ground floor in frame', () => {
  for (const [width, height] of [[1600, 900], [1600, 1000], [2560, 1080], [390, 844]]) {
    const viewport = visibleViewBox(width, height);
    for (const room of ['my_room', 'living_nook', 'friend_room'] as const) {
      for (const scale of [1, .8, 1.2]) {
        const layout = { ...DEFAULT_SCENE_LAYOUT, main_cottage: { ...DEFAULT_SCENE_LAYOUT.main_cottage, scale } };
        const camera = resolveRoomCamera(room, layout, viewport);
        for (const y of [-243, 212]) {
          const p = sceneToViewBox(entityPointToScene(localPoint('main_cottage', 0, y), layout), camera);
          assert.ok(p.y >= viewport.minY + 10 && p.y <= viewport.maxY - 10,
            `${room} ${width}x${height} scale=${scale}: cottage y=${y} cropped at ${p.y}`);
        }
      }
    }
  }
});

test('exploration envelope contains the solid seedpod chimney after placement changes', () => {
  const layout = { ...DEFAULT_SCENE_LAYOUT, main_cottage: { ...DEFAULT_SCENE_LAYOUT.main_cottage,
    scale: 1.4, position: { ...DEFAULT_SCENE_LAYOUT.main_cottage.position, y: 80 } } };
  const bounds = sceneExplorationBounds(layout);
  const chimney = entityPointToScene(localPoint('main_cottage', 0, -243), layout);
  assert.ok(bounds.minY <= chimney.y);
});
