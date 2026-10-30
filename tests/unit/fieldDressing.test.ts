import assert from 'node:assert/strict';
import { test } from 'node:test';
import { FIELD_HAY_BALES, FIELD_SCARECROWS, fieldDressingDepth } from '../../src/world/scene/fieldDressing';
import { frontEdgeY } from '../../src/world/scene/fieldEdges';
import { LANDSCAPE_SURFACES, wheatRearY } from '../../src/world/scene/landscapeGeometry';

test('field depth keeps scale and ground roots in the same order, with separate depth bands', () => {
  const sorted = [...FIELD_HAY_BALES, ...FIELD_SCARECROWS].sort((a, b) => a.depth - b.depth);
  assert.equal(new Set(FIELD_HAY_BALES.map(b => b.id)).size, FIELD_HAY_BALES.length);
  for (let i = 1; i < sorted.length; i++) {
    const before = fieldDressingDepth(sorted[i - 1].depth), after = fieldDressingDepth(sorted[i].depth);
    assert.ok(after.y >= before.y && after.scale >= before.scale && after.opacity >= before.opacity);
  }
  const bands = [FIELD_HAY_BALES.filter(b => b.depth < .3), FIELD_HAY_BALES.filter(b => b.depth >= .3 && b.depth < .7), FIELD_HAY_BALES.filter(b => b.depth >= .7)];
  for (let i = 1; i < bands.length; i++) {
    const backmost = Math.min(...bands[i].map(b => fieldDressingDepth(b.depth).y));
    const preceding = Math.max(...bands[i - 1].map(b => fieldDressingDepth(b.depth).y));
    assert.ok(backmost - preceding > 15, 'middle and near bales must not share a ground row');
  }
});

test('field footprints stay inside the crop and clear of the meadow in the overview', () => {
  // Overview wheat and meadow transforms coincide; only the crop Y offset differs.
  // This does not assert that foreground occlusion disappears in room closeups.
  for (const item of [...FIELD_HAY_BALES, ...FIELD_SCARECROWS]) {
    const { y, scale } = fieldDressingDepth(item.depth);
    for (const dx of [-19 * scale, 0, 19 * scale]) {
      assert.ok(y > wheatRearY(item.x + dx, true) + 7, `${item.id} is beyond the rear fence`);
      assert.ok(y + LANDSCAPE_SURFACES.backgroundOffsetY < frontEdgeY(item.x + dx) - 5, `${item.id} is swallowed by the meadow`);
    }
  }
  for (let i = 0; i < FIELD_HAY_BALES.length; i++) for (let j = i + 1; j < FIELD_HAY_BALES.length; j++) {
    const a = FIELD_HAY_BALES[i], b = FIELD_HAY_BALES[j];
    const pa = fieldDressingDepth(a.depth), pb = fieldDressingDepth(b.depth);
    const clearHorizontally = Math.abs(a.x - b.x) > 19 * (pa.scale + pb.scale) + 8;
    const clearVertically = Math.abs(pa.y - pb.y) > 24 * Math.max(pa.scale, pb.scale) + 4;
    assert.ok(clearHorizontally || clearVertically, `${a.id} and ${b.id} overlap`);
  }
});
