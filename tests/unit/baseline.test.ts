import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projectIsoToScreen, unprojectScreenToIso } from '../../src/components/layout-gizmo/isoMath';
import { DEFAULT_ROOM_LAYOUT, loadSavedRoomLayout } from '../../src/components/layout-gizmo/layoutStore';
import { INITIAL_PEOPLE } from '../../src/data/initialData';
import { resolvePresenceSlots } from '../../src/utils/sceneViewMapping';

test('the existing furniture projection round-trips to its display precision', () => {
  for (const point of [{ u: -167.52, v: 119.4, w: 0 }, { u: 12.2, v: -9.4, w: 28.2 }]) {
    assert.deepEqual(unprojectScreenToIso(projectIsoToScreen(point), point.w), point);
  }
});

test('initial occupants keep the existing desk, sofa and east tea seats', () => {
  const { personToSlot } = resolvePresenceSlots(INITIAL_PEOPLE);
  assert.equal(personToSlot.self.slotId, 'desk_workstation');
  assert.equal(personToSlot.lin.slotId, 'sofa_lounge');
  assert.equal(personToSlot.yu.slotId, 'tea_cushion_east');
});

test('a v6 edited layout reloads without resetting other furniture', () => {
  const sample = { 'cabinet-group': { screen: { x: -91.2, y: 82.3 } } };
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem(key: string) { assert.equal(key, 'live_with_me_room_layout_v6'); return JSON.stringify(sample); },
  } });
  try {
    const loaded = loadSavedRoomLayout();
    assert.deepEqual(loaded['cabinet-group'].screen, sample['cabinet-group'].screen);
    assert.deepEqual(loaded['attic-chair'].screen, DEFAULT_ROOM_LAYOUT['attic-chair'].screen);
  } finally { delete globalThis.localStorage; }
});
