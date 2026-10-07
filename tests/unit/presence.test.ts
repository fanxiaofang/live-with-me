import { test } from 'node:test';
import assert from 'node:assert/strict';
import { INITIAL_PEOPLE } from '../../src/data/initialData';
import { resolvePresenceSlots, previewPresence, isRoomFull } from '../../src/features/presence/presenceAllocation';
import type { Person, RoomId } from '../../src/types';
const peopleIn = (room: RoomId, count: number): Person[] => Array.from({ length: count }, (_, i) => ({ ...INITIAL_PEOPLE[0], id: `p${i}`, currentRoom: room }));

test('same-bed conflicts retain input order and never overwrite or cross rooms', () => {
  for (const room of ['capsule_pod', 'corn_lounge', 'observatory', 'my_room', 'friend_room'] as RoomId[]) {
    const people = peopleIn(room, 2);
    const before = structuredClone(people);
    const allocation = resolvePresenceSlots(people);
    assert.equal(Object.keys(allocation.personToSlot).length, 1);
    assert.equal(Object.values(allocation.slots).filter(s => s.occupant).length, 1);
    assert.equal(Object.values(allocation.slots).find(s => s.occupant)?.occupant?.id, 'p0');
    assert.deepEqual(allocation.unplaced, [{ personId: 'p1', reason: 'room_full' }]);
    assert.deepEqual(people, before);
  }
});
test('four-person tea room uses east, west, south then reports overflow', () => {
  const people = peopleIn('living_nook', 4);
  const allocation = resolvePresenceSlots(people);
  assert.deepEqual(Object.values(allocation.personToSlot).map(s => s.slotId), ['tea_cushion_east', 'tea_cushion_west', 'tea_cushion_south']);
  assert.equal(isRoomFull(allocation, 'p3'), true);
  assert.equal(Object.keys(allocation.personToSlot).length + allocation.unplaced.length, people.length);
});
test('room wins over life state; porch is tracked without a full-room warning', () => {
  const people = peopleIn('my_room', 1);
  people[0].currentState = 'tea_time';
  assert.equal(resolvePresenceSlots(people).personToSlot.p0.slotId, 'desk_workstation');
  people[0].currentRoom = 'porch_mailbox'; people[0].currentState = 'sleeping';
  const allocation = resolvePresenceSlots(people);
  assert.deepEqual(allocation.unplaced, [{ personId: 'p0', reason: 'no_indoor_slot' }]);
  assert.equal(isRoomFull(allocation, 'p0'), false);
});
test('preview and saved allocation agree including conflicts', () => {
  const people = peopleIn('capsule_pod', 2);
  people[1].currentRoom = 'living_nook';
  assert.deepEqual(previewPresence(people, 'p1', 'capsule_pod', 'reading'), resolvePresenceSlots(people.map(p => p.id === 'p1' ? { ...p, currentRoom: 'capsule_pod', currentState: 'reading' } : p)));
});
