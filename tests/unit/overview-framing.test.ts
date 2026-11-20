import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveOverviewCamera } from '../../src/world/camera/overviewFraming';
import { visibleViewBox } from '../../src/world/coordinates/viewport';
import { DEFAULT_SCENE_LAYOUT } from '../../src/world/scene/sceneLayout';
import { emptyYardLayout, yardExplorationBounds } from '../../src/features/yard-editor/yardLayout';
import { scenePoint } from '../../src/world/scene/sceneTypes';

test('opening view preserves the pre-guardian estate composition despite expanded exploration bounds', () => {
  const viewport = visibleViewBox(1810, 970);
  const bounds = yardExplorationBounds(emptyYardLayout(), DEFAULT_SCENE_LAYOUT);
  assert.ok(bounds.maxY >= 1027, 'guardian remains reachable beyond the gate');
  assert.deepEqual(resolveOverviewCamera(DEFAULT_SCENE_LAYOUT, viewport, bounds),
    { x: 0, y: 139.7942, zoom: .54 });
});

test('moving the wheat-layer tower does not reframe the foreground estate', () => {
  const moved = { ...DEFAULT_SCENE_LAYOUT, observatory: {
    ...DEFAULT_SCENE_LAYOUT.observatory, position: scenePoint(1500, -200),
  } };
  for (const [width, height] of [[1810, 970], [390, 844]]) {
    const viewport = visibleViewBox(width, height);
    assert.deepEqual(resolveOverviewCamera(moved, viewport), resolveOverviewCamera(DEFAULT_SCENE_LAYOUT, viewport));
  }
});
