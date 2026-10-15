import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DEFAULT_ROOM_LAYOUT, resolveRoomLayout } from '../../src/components/layout-gizmo/layoutStore';
import { DESK_SEATS, DESK_CHAIR_MEASUREMENTS, deskKeyboardInChairSpace } from '../../src/components/desk/chairGeometry';
import { deskHandTargets } from '../../src/components/desk/DeskSeatedCharacter';

test('both desks leave knee space and use their own computer; unreachable hands rest on the lap', () => {
  const { deskTop, deskThickness, seatTop } = DESK_CHAIR_MEASUREMENTS;
  assert.ok(seatTop / deskTop >= 0.6 && seatTop / deskTop <= 0.65);
  assert.ok(deskTop - deskThickness - seatTop >= 5.5);
  for (const seat of DESK_SEATS) {
    const keyboard = deskKeyboardInChairSpace(DEFAULT_ROOM_LAYOUT, seat.slot);
    assert.ok(Math.abs(keyboard.x) < 0.001);
    assert.ok(Math.abs(keyboard.y + 7) < 0.001);
    assert.equal(deskHandTargets(keyboard, true).mode, 'keyboard');
    assert.equal(deskHandTargets(keyboard, false).mode, 'lap');
  }
  const moved = resolveRoomLayout(DEFAULT_ROOM_LAYOUT);
  moved['desk-laptop-secondary'].screen.x += 60;
  assert.equal(deskHandTargets(deskKeyboardInChairSpace(moved, 'desk_workstation_secondary'), true).mode, 'lap');
  assert.equal(deskHandTargets(deskKeyboardInChairSpace(moved), true).mode, 'keyboard');
});
