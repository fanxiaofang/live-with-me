import assert from 'node:assert/strict';
import { test } from 'node:test';
import { emptyYardLayout, resolveYardLayout, constrainPlacement, yardSceneLayout, yardExplorationBounds, rotateGroundPoint, yardDepth, YARD_IDS, isGrass } from '../../src/features/yard-editor/yardLayout';
import { DEFAULT_SCENE_LAYOUT, entityPointToScene } from '../../src/world/scene/sceneLayout';
import { sceneExplorationBounds } from '../../src/world/scene/explorationBounds';
import { resolveRoomCamera, ROOM_FOCUS } from '../../src/world/scene/roomTargets';
import { sceneToViewBox } from '../../src/world/camera/cameraMath';

test('土地尺寸兼容旧布局，限制无效值并拓展放大后的探索范围', () => {
  const layout = resolveYardLayout({ tilled_plot: { dx: 10, dy: 20, angle: 120 } });
  assert.deepEqual(layout.tilled_plot, { dx: 10, dy: 20, angle: 120, length: 100, width: 100 });
  assert.deepEqual(constrainPlacement('tilled_plot', { dx: 0, dy: 0, angle: 300, length: NaN, width: 999 }),
    { dx: 0, dy: 0, angle: 180, length: 100, width: 250 });
  const original = emptyYardLayout();
  original.tilled_plot = { dx: -600, dy: 250, angle: 0, length: 100, width: 100 };
  const before = yardExplorationBounds(original);
  original.tilled_plot.length = 250; original.tilled_plot.width = 250;
  const after = yardExplorationBounds(original);
  assert.ok(after.minX < before.minX && after.maxY > before.maxY);
  assert.deepEqual(resolveYardLayout(original), original);
});

test('saved yard edits reject invalid values and keep the central cottage locked', () => {
  const layout = resolveYardLayout({ main_cottage: { dx: 300, dy: 100, angle: 0 }, pumpkin: { dx: NaN, dy: 2, angle: 0 },
    fence_west: { dx: 0, dy: 0, angle: 120 }, sheep_2: { dx: 1e7, dy: 1e7, angle: 30 } });
  assert.deepEqual(layout.main_cottage, { dx: 0, dy: 0, angle: 0 });
  assert.deepEqual(layout.pumpkin, { dx: 0, dy: 0, angle: 0 });
  assert.equal(layout.fence_west.angle, 75);
  assert.equal(layout.sheep_2.angle, 0);
  assert.equal(layout.sheep_2.dy + 624, 840);
  assert.deepEqual(resolveYardLayout(null), emptyYardLayout());
});
test('moving the cabin keeps its scale and room camera targets attached, independently of garden objects', () => {
  const yard = emptyYardLayout(); yard.wooden_cabin = { dx: 140, dy: 65, angle: 0 };
  const scene = yardSceneLayout(yard), initial = DEFAULT_SCENE_LAYOUT.wooden_cabin;
  assert.equal(scene.wooden_cabin.scale, initial.scale);
  assert.equal(scene.wooden_cabin.position.x, initial.position.x + 140);
  assert.deepEqual(yard.pumpkin, { dx: 0, dy: 0, angle: 0 });
  const camera = resolveRoomCamera('corn_lounge', scene);
  const anchor = entityPointToScene(ROOM_FOCUS.corn_lounge.localAnchor, scene);
  const projected = sceneToViewBox(anchor, camera);
  assert.ok(Math.abs(projected.x - 600) < 1e-7 && Math.abs(projected.y - 400) < 1e-7);
});
test('fence ground rotation preserves pivot and compressed ground distance', () => {
  const pivot = { x: 10, y: 30 }, p = { x: 110, y: 58.5 };
  assert.deepEqual(rotateGroundPoint(pivot, pivot, 65), pivot);
  assert.deepEqual(rotateGroundPoint(p, pivot, 0), p);
  const q = rotateGroundPoint(p, pivot, 50);
  assert.ok(Math.abs(Math.hypot(p.x - pivot.x, (p.y - pivot.y) / .285) - Math.hypot(q.x - pivot.x, (q.y - pivot.y) / .285)) < 1e-8);
});
test('default framing stays unchanged, moved objects extend exploration and change depth order', () => {
  const yard = emptyYardLayout();
  assert.deepEqual(yardExplorationBounds(yard), sceneExplorationBounds(DEFAULT_SCENE_LAYOUT));
  assert.ok(yardDepth('osmanthus', yard) > yardDepth('capsule_pod', yard));
  yard.osmanthus.dy = -300;
  assert.ok(yardDepth('osmanthus', yard) < yardDepth('capsule_pod', yard));
  yard.sheep_pen.dy = 200;
  assert.ok(yardExplorationBounds(yard).maxY > sceneExplorationBounds(DEFAULT_SCENE_LAYOUT).maxY);
});

test('old saved layouts acquire independent grass groups at zero without shifting their original roots', () => {
  const layout = resolveYardLayout({ pumpkin: { dx: 50, dy: 10, angle: 0 } });
  const grass = YARD_IDS.filter(isGrass);
  assert.equal(grass.length, 21);
  for (const id of grass) assert.deepEqual(layout[id], { dx: 0, dy: 0, angle: 0 });
  assert.equal(layout.pumpkin.dx, 50);
  assert.deepEqual(resolveYardLayout(layout), layout);
  layout['grass_perimeter_cabin-side'].dy = 20;
  const before = yardDepth('grass_perimeter_cabin-side', layout);
  layout.wooden_cabin.dy = 50;
  assert.equal(yardDepth('grass_perimeter_cabin-side', layout), before + 50);
  assert.deepEqual(layout['grass_perimeter_cabin-outer'], { dx: 0, dy: 0, angle: 0 });
});

test('newly detached building grass keeps the saved starting position and then moves independently', () => {
  const saved = { wooden_cabin: { dx: 130, dy: 25, angle: 0 }, capsule_pod: { dx: -45, dy: 15, angle: 0 } };
  const layout = resolveYardLayout(saved);
  assert.deepEqual(layout['grass_detached_cabin-front'], saved.wooden_cabin);
  assert.deepEqual(layout['grass_detached_pod-rear'], saved.capsule_pod);
  layout.wooden_cabin.dx = 200;
  layout.capsule_pod.dy = 60;
  const reloaded = resolveYardLayout(layout);
  assert.equal(reloaded['grass_detached_cabin-front'].dx, 130);
  assert.equal(reloaded['grass_detached_pod-rear'].dy, 15);
});
