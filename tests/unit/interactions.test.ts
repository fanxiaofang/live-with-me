import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { TierConfig } from '../../src/components/bookshelf/bookshelfTypes';
import { INITIAL_PEOPLE } from '../../src/data/initialData';
import { createInteractionDispatcher } from '../../src/world/interactions/dispatcher';
import { describeInteraction } from '../../src/world/interactions/registry';
import type { InteractionTarget } from '../../src/world/interactions/interactionTypes';
import { DEFAULT_ROOM_LAYOUT } from '../../src/components/layout-gizmo/layoutStore';
const tiers: TierConfig[] = [{ index: 1, books: [{ id: 'stable-book', title: '题名:可变', thickness: 2, height: 8, color: '#fff' }] }];

test('all registered furniture descriptions resolve; stale runtime IDs cannot crash hover rendering', () => {
  for (const editing of [false, true]) {
    const context = { people: INITIAL_PEOPLE, tiers, editing };
    for (const item of Object.values(DEFAULT_ROOM_LAYOUT)) {
      assert.equal(describeInteraction({ kind: 'furniture-part', id: item.id }, context), item.name + (editing ? ' (点击可调优坐标)' : ''));
    }
    for (const id of ['cabinet-beans', 'cabinet-cups', 'missing-part', 'constructor', '__proto__']) {
      const legacy = { kind: 'furniture-part', id } as unknown as InteractionTarget;
      assert.equal(describeInteraction(legacy, context), '家具部件');
    }
  }
});
test('stable typed IDs dispatch runtime commands and resolve current display text', () => {
  const calls: string[] = [];
  const dispatch = createInteractionDispatcher({ focusRoom: id => calls.push(id), selectPerson: p => calls.push(p.id), openMailbox: () => calls.push('mail'), selectPoster: id => calls.push(id), captureSignal: () => calls.push('signal'), openBookshelf: () => calls.push('shelf'), selectBook: b => calls.push(b.id), fireplace: () => calls.push('fire') }, { people: INITIAL_PEOPLE, tiers, editing: false });
  dispatch({ kind: 'room', id: 'corn_lounge' }); dispatch({ kind: 'person', id: 'lin' });
  dispatch({ kind: 'entity', id: 'mailbox' }); dispatch({ kind: 'entity', id: 'alien-receiver' });
  dispatch({ kind: 'poster', id: 'paprika' }); dispatch({ kind: 'book', id: 'stable-book', tierIndex: 1 });
  dispatch({ kind: 'furniture-part', id: 'wood-stove' }); dispatch({ kind: 'person', id: 'missing' });
  assert.deepEqual(calls, ['corn_lounge', 'lin', 'mail', 'signal', 'paprika', 'stable-book', 'shelf', 'fire']);
  tiers[0].books![0].title = '新题名';
  assert.match(describeInteraction({ kind: 'book', id: 'stable-book', tierIndex: 1 }, { people: INITIAL_PEOPLE, tiers, editing: false }), /新题名/);
});
test('editing accepts furniture commands and suppresses navigation or business actions', () => {
  const calls: (string | null)[] = [];
  const dispatch = createInteractionDispatcher({ focusRoom: id => calls.push(id), selectPerson: p => calls.push(p.id), openMailbox: () => calls.push('mail'), selectPoster: id => calls.push(id), captureSignal: () => calls.push('signal'), selectFurniture: id => calls.push(id) }, { people: INITIAL_PEOPLE, tiers, editing: true, activeFurniture: 'desk-group' });
  dispatch({ kind: 'room', id: 'my_room' }); dispatch({ kind: 'entity', id: 'mailbox' });
  dispatch({ kind: 'furniture-part', id: 'desk-group' }); dispatch({ kind: 'furniture-part', id: 'desk-cup' });
  assert.deepEqual(calls, [null, 'desk-cup']);
});
