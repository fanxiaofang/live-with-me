import assert from 'node:assert/strict';
import { test } from 'node:test';
import { FIELD_ACCESS, FIELD_ACCESS_BANK_SAMPLES, fieldAccessPoint } from '../../src/world/scene/fieldAccess';
import { frontEdgeY } from '../../src/world/scene/fieldEdges';
import { MEADOW_ENTRANCE } from '../../src/components/scenery/yorkshire/vegetation/meadowForeground';
import { meadowPerimeterGroups } from '../../src/components/scenery/yorkshire/vegetation/MeadowPerimeterPlanting';
import { REFINED_MEADOW_PLANTS } from '../../src/components/scenery/yorkshire/vegetation/meadowStudy';
import { DEFAULT_SCENE_LAYOUT } from '../../src/world/scene/sceneLayout';
import { YORKSHIRE_LAYOUT } from '../../src/components/scenery/yorkshire/landscapeLayout';

test('the worn approach clears the existing structures and ends inside the small field-edge opening', () => {
  // Current ground footprints, including a little room for the edges of the path.
  const obstacles = [
    { name: 'capsule', left: 855, right: 1045, top: 355, bottom: 465 },
    { name: 'observatory', left: 1005, right: 1195, top: 215, bottom: 290 },
    { name: 'sheep pen', left: 860, right: 1350, top: 480, bottom: 652 },
    { name: 'east wall', left: 1230, right: 1370, top: 196, bottom: 212 },
  ];
  for (let i = 0; i <= 200; i++) {
    const p = fieldAccessPoint(i / 200);
    assert.ok(Number.isFinite(p.nx) && Number.isFinite(p.ny));
    for (const box of obstacles) {
      const dx = Math.max(box.left - p.x, 0, p.x - box.right);
      const dy = Math.max(box.top - p.y, 0, p.y - box.bottom);
      assert.ok(Math.hypot(dx, dy) > p.halfWidth, `road intersects ${box.name}`);
    }
  }
  const foot = fieldAccessPoint(1);
  const bankBreadth = Math.sin(Math.PI * (foot.x - FIELD_ACCESS.bankStart) / (FIELD_ACCESS.bankEnd - FIELD_ACCESS.bankStart)) ** 1.35;
  assert.ok(foot.y >= frontEdgeY(foot.x) - FIELD_ACCESS.reach * bankBreadth);
  assert.ok(foot.y < frontEdgeY(foot.x), 'the approach reaches the soil foot');
});

test('the small worn opening follows the existing edge and tapers at both ends', () => {
  for (const p of FIELD_ACCESS_BANK_SAMPLES) {
    assert.ok(Math.abs(p.edge - frontEdgeY(p.x)) < 1e-8);
    assert.ok(p.edge - p.far <= 6.001 && p.near - p.edge <= 4.001);
    assert.ok(p.far <= p.edge && p.edge <= p.near);
  }
  for (const p of [FIELD_ACCESS_BANK_SAMPLES[0], FIELD_ACCESS_BANK_SAMPLES.at(-1)!]) {
    assert.ok(Math.abs(p.far - p.near) < 1e-8, 'a square soil end would look like a pasted strip');
  }
});

test('the relocated path clears actual accepted grass and perimeter planting footprints', () => {
  const grassBounds = {
    short: [-45, -19, 41, 7], woven: [-40, -19, 44, 6],
    meadow: [-47, -62, 53, 7], leaning: [-48, -43, 49, 7],
  };
  const footprints = REFINED_MEADOW_PLANTS.map(plant => {
    const anchor = plant.anchor === 'guardian-tree' ? YORKSHIRE_LAYOUT.guardianTree : DEFAULT_SCENE_LAYOUT[plant.anchor];
    const [left, top, right, bottom] = grassBounds[plant.type];
    const x = anchor.position.x + plant.x * anchor.scale;
    const y = anchor.position.y + (plant.y + (plant.anchor === 'guardian-tree' ? YORKSHIRE_LAYOUT.guardianTree.root.y : 0)) * anchor.scale;
    const scale = plant.scale * anchor.scale;
    return { name: plant.zone, left: x + (plant.flip ? -right : left) * scale, right: x + (plant.flip ? -left : right) * scale,
      top: y + top * scale, bottom: y + bottom * scale };
  });
  footprints.push(...meadowPerimeterGroups(DEFAULT_SCENE_LAYOUT).map(group => ({
    name: group.id, left: group.x - 65 * group.scale, right: group.x + 65 * group.scale,
    top: group.y - 26 * group.scale, bottom: group.y + 15 * group.scale,
  })));
  for (let i = 0; i <= 200; i++) {
    const p = fieldAccessPoint(i / 200);
    for (const box of footprints) {
      const dx = Math.max(box.left - p.x, 0, p.x - box.right);
      const dy = Math.max(box.top - p.y, 0, p.y - box.bottom);
      assert.ok(Math.hypot(dx, dy) > p.halfWidth + 5, `road enters planting ${box.name}`);
    }
  }
});

test('the shorter fence keeps the gate passage and turns back instead of descending across the frame', () => {
  const { westPosts, eastPosts, hinge, latch, openEnd } = MEADOW_ENTRANCE;
  assert.deepEqual(westPosts.at(-1), hinge);
  assert.deepEqual(eastPosts[0], latch);
  assert.ok(latch.x - openEnd.x >= 50, 'keep the open gate passage');
  for (const posts of [westPosts, eastPosts]) for (let i = 1; i < posts.length; i++) {
    assert.ok(Math.hypot(posts[i].x - posts[i - 1].x, posts[i].y - posts[i - 1].y) < 120);
  }
  assert.ok(eastPosts.at(-1)!.y < eastPosts[0].y, 'the east end should turn into the lawn');
  assert.ok(Math.max(...[...westPosts, ...eastPosts].map(p => p.y)) < 730);
});
