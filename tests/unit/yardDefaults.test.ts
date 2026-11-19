import assert from 'node:assert/strict';
import { test } from 'node:test';
import preset from '../../src/features/yard-editor/defaultYardLayout.json';
import { defaultYardSnapshot, resolveSavedYardSnapshot } from '../../src/features/yard-editor/yardDefaults';
import { YARD_IDS, yardSceneLayout } from '../../src/features/yard-editor/yardLayout';
import { DEFAULT_SCENE_LAYOUT } from '../../src/world/scene/sceneLayout';

test('默认预设完整保留导出的物件、铺装、作物与手绘痕迹', () => {
  const snapshot = defaultYardSnapshot();
  assert.equal(Object.values(snapshot.layout).filter(p => p.material).length, 41);
  assert.deepEqual(snapshot.layout, preset.objects);
  assert.deepEqual(snapshot.wearStrokes, preset.wearStrokes);
  assert.equal(snapshot.nightPathTone, preset.nightPathTone);
  assert.deepEqual(Object.keys(snapshot.layout).sort(), [...YARD_IDS].sort());
  assert.equal(snapshot.wearStrokes.length, 40);
  const scene = yardSceneLayout(snapshot.layout);
  assert.equal(scene.capsule_pod.position.x, DEFAULT_SCENE_LAYOUT.capsule_pod.position.x + 65.9);
  assert.equal(scene.capsule_pod.scale, DEFAULT_SCENE_LAYOUT.capsule_pod.scale);
});

test('无本地存档时使用预设，已有存档的改动与清空操作优先', () => {
  assert.deepEqual(resolveSavedYardSnapshot(null), defaultYardSnapshot());
  assert.deepEqual(resolveSavedYardSnapshot({}), defaultYardSnapshot());
  const saved = resolveSavedYardSnapshot({ objects: { wooden_cabin: { dx: 20, dy: 30, angle: 0 } }, wearStrokes: [], nightPathTone: 'grassTaupe' });
  assert.deepEqual(saved.layout.wooden_cabin, { dx: 20, dy: 30, angle: 0 });
  assert.equal(saved.layout.paving_1.material, undefined);
  assert.deepEqual(saved.wearStrokes, []);
  assert.equal(saved.nightPathTone, 'grassTaupe');
});

test('默认布局每次生成独立副本', () => {
  const snapshot = defaultYardSnapshot();
  snapshot.layout.wooden_cabin.dx = 999;
  snapshot.wearStrokes[0].points[0].x = 999;
  assert.deepEqual(defaultYardSnapshot().layout, preset.objects);
  assert.deepEqual(defaultYardSnapshot().wearStrokes, preset.wearStrokes);
});
