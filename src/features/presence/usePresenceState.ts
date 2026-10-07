import { useMemo, useState } from 'react';
import { INITIAL_PEOPLE, LIFE_STATES } from '../../data/initialData';
import type { LifeStateId, Person, RoomId } from '../../types';
import { resolvePresenceSlots } from './presenceAllocation';
export type PersonAppearance = Partial<Pick<Person, 'skinColor' | 'beanieColor' | 'hairColor' | 'hairStyle' | 'shirtColor' | 'hasPompom'>>;
export function usePresenceState(notify: (message: string) => void) {
  const [people, setPeople] = useState<Person[]>(INITIAL_PEOPLE);
  const presenceAllocation = useMemo(() => resolvePresenceSlots(people), [people]);
  const saveStatus = (stateId: LifeStateId, roomId: RoomId, note: string, appearance?: PersonAppearance) => {
    setPeople(previous => previous.map(p => p.isSelf ? { ...p, currentState: stateId, currentRoom: roomId, stateNote: note || p.stateNote, sinceTime: '刚刚更新状态', ...appearance } : p));
    const state = LIFE_STATES[stateId];
    notify(`状态与小人特征已更新：${state?.emoji} ${state?.label}`);
  };
  return { people, presenceAllocation, saveStatus };
}
