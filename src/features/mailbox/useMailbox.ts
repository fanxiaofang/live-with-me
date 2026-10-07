import { useState } from 'react';
import { INITIAL_LETTERS } from '../../data/initialData';
import type { Person, MailLetter, LivingMemory } from '../../types';
export function useMailbox(people: readonly Person[], recordMemory: (memory: LivingMemory) => void, notify: (message: string) => void) {
  const [letters, setLetters] = useState<MailLetter[]>(INITIAL_LETTERS);
  const unreadCount = letters.filter(l => l.toId === 'self' && !l.read).length;
  const sendLetter = (draft: Omit<MailLetter, 'id' | 'date' | 'read'>) => {
    const timestamp = Date.now();
    setLetters(previous => [{ ...draft, id: `m-${timestamp}`, date: '刚刚', read: false }, ...previous]);
    const recipient = people.find(p => p.id === draft.toId);
    if (recipient) recordMemory({ id: `mem-${timestamp}`, title: `给${recipient.name}门前留下的心意`, desc: `在信箱里悄悄放入了便笺，附带着${draft.gift ? '一份小礼物' : '几句安静的话'}。没有催促，只有挂念。`, timestamp: '刚才', participants: ['我', recipient.name], icon: draft.gift === 'coffee' ? '☕' : draft.gift === 'plant' ? '🪴' : '✉️' });
    notify(`便笺与心意已投递至 ${recipient?.name || '朋友'} 的信箱`);
  };
  const markRead = (id: string) => setLetters(previous => previous.map(l => l.id === id ? { ...l, read: true } : l));
  return { letters, unreadCount, sendLetter, markRead };
}
