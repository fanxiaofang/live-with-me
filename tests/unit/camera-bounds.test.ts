import assert from 'node:assert/strict';
import { test } from 'node:test';
import { clampPan, panBounds } from '../../src/world/camera/cameraBounds';
import { OVERVIEW_CAMERA, sceneToViewBox } from '../../src/world/camera/cameraMath';
import { FULL_VIEWBOX, visibleViewBox } from '../../src/world/coordinates/viewport';
import { sceneExplorationBounds } from '../../src/world/scene/explorationBounds';
import { resolveRoomCamera } from '../../src/world/scene/roomTargets';
import { DEFAULT_SCENE_LAYOUT } from '../../src/world/scene/sceneLayout';
import { scenePoint } from '../../src/world/scene/sceneTypes';
import { YORKSHIRE_LAYOUT } from '../../src/components/scenery/yorkshire/landscapeLayout';

test('visible slice rectangle follows wide and portrait screen crops', () => {
  assert.deepEqual(visibleViewBox(1200, 800), FULL_VIEWBOX);
  assert.deepEqual(visibleViewBox(1600, 900), { minX: 0, maxX: 1200, minY: 62.5, maxY: 737.5 });
  const phone = visibleViewBox(390, 844);
  assert.equal(phone.minY, 0);
  assert.equal(phone.maxY, 800);
  assert.ok(Math.abs(phone.maxX - phone.minX - 390 * 800 / 844) < 1e-9);
});

test('overview travel limits empty foreground upwards and allows hill exploration downwards', () => {
  const content = sceneExplorationBounds(DEFAULT_SCENE_LAYOUT);
  for (const [width, height] of [[1200, 800], [1600, 900], [390, 844]]) {
    const viewport = visibleViewBox(width, height);
    for (const zoom of [0.45, 0.66]) {
      for (const y of [-10000, 10000]) {
        const camera = clampPan({ x: 0, y, zoom }, OVERVIEW_CAMERA, viewport, content);
        const top = sceneToViewBox(scenePoint(600, content.minY), camera).y;
        const bottom = sceneToViewBox(scenePoint(600, content.maxY), camera).y;
        if (y < 0) {
          assert.ok(top >= viewport.minY + (viewport.maxY - viewport.minY) * 0.18 - 1e-8);
          assert.ok(bottom <= viewport.maxY - (viewport.maxY - viewport.minY) * (zoom === .45 ? .06 : .12) + 1e-8);
        } else {
          assert.ok(top >= viewport.minY + (viewport.maxY - viewport.minY) * .65 - 1e-8);
        }
      }
    }
  }
});

test('overview can drag the roof down far enough to reveal the hills at modest zoom', () => {
  for (const [width, height] of [[1366,768], [1440,900]]) {
    const viewport = visibleViewBox(width, height);
    const focus = resolveRoomCamera('overview', DEFAULT_SCENE_LAYOUT, viewport);
    const content = sceneExplorationBounds(DEFAULT_SCENE_LAYOUT);
    for (const zoom of [.54, .66, .78, .9, 1.1]) {
      const camera = clampPan({ ...focus, zoom, y: 10000 }, focus, viewport, content, true);
      const roofTop = sceneToViewBox(scenePoint(540, content.minY), camera).y;
      assert.ok(roofTop >= viewport.minY + (viewport.maxY - viewport.minY) * .65 - 1e-8);
      assert.ok(camera.y - focus.y > (viewport.maxY - viewport.minY) * .2);
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
  assert.ok(movedBounds.maxX > sceneExplorationBounds(DEFAULT_SCENE_LAYOUT).maxX);
  assert.ok(movedBounds.maxX >= moved.observatory.position.x);
  assert.notDeepEqual(panBounds(camera, OVERVIEW_CAMERA, FULL_VIEWBOX, movedBounds), desktop);
});

test('overview lets both estate edges enter the central view without a horizontal zoom dead zone', () => {
  const content = sceneExplorationBounds(DEFAULT_SCENE_LAYOUT);
  for (const [width, height] of [[1366,768], [1440,900], [390,844]]) {
    const viewport = visibleViewBox(width, height);
    const focus = resolveRoomCamera('overview', DEFAULT_SCENE_LAYOUT, viewport);
    const visibleWidth = viewport.maxX - viewport.minX;
    for (const zoom of [.54, .66, .74, .77, .78, .82, .9]) {
      const left = clampPan({ ...focus, zoom, x: 10000 }, focus, viewport, content, true);
      const right = clampPan({ ...focus, zoom, x: -10000 }, focus, viewport, content, true);
      const leftEdge = sceneToViewBox(scenePoint(content.minX, 0), left).x;
      const rightEdge = sceneToViewBox(scenePoint(content.maxX, 0), right).x;
      assert.ok(leftEdge >= viewport.minX + visibleWidth * .35 - 1e-8);
      assert.ok(rightEdge <= viewport.maxX - visibleWidth * .35 + 1e-8);
      assert.ok(left.x - right.x >= visibleWidth * .25);
      // The opposite screen edge still contains estate content: no all-empty pan.
      assert.ok(leftEdge < viewport.maxX);
      assert.ok(rightEdge > viewport.minX);
    }
  }
});

test('zooming beyond the overview keeps vertical travel through the fit-to-crop crossover', () => {
  for (const [width, height] of [[1366,768], [1440,900]]) {
    const viewport = visibleViewBox(width, height);
    const focus = resolveRoomCamera('overview', DEFAULT_SCENE_LAYOUT, viewport);
    const visibleHeight = viewport.maxY - viewport.minY;
    for (let zoom = .66; zoom <= .94; zoom += .01) {
      const camera = { ...focus, zoom };
      const bounds = panBounds(camera, focus, viewport, undefined, true);
      assert.ok(bounds.maxY - bounds.minY >= visibleHeight * .12 - 1e-8);
      const center = { ...camera, y: (bounds.minY + bounds.maxY) / 2 };
      assert.equal(clampPan({ ...center, y: center.y - 20 }, focus, viewport, undefined, true).y, center.y - 20);
      assert.equal(clampPan({ ...center, y: center.y + 20 }, focus, viewport, undefined, true).y, center.y + 20);
    }
    const initial = clampPan(focus, focus, viewport, undefined, true);
    assert.equal(initial.zoom, focus.zoom);
    assert.ok(Math.abs(initial.x - focus.x) < .0001 && Math.abs(initial.y - focus.y) < .0001);
  }
});

test('exploration includes the entire sheep pen, including its open gate and contact shadow', () => {
  const content = sceneExplorationBounds(DEFAULT_SCENE_LAYOUT);
  const { anchor, bounds } = YORKSHIRE_LAYOUT.sheepPen;
  assert.ok(content.minX <= anchor.x + bounds.minX);
  assert.ok(content.maxX >= anchor.x + bounds.maxX);
  assert.ok(content.minY <= anchor.y + bounds.minY);
  assert.ok(content.maxY >= anchor.y + bounds.maxY);
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
