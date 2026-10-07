import type { BookItemConfig, TierConfig } from '../../components/bookshelf/bookshelfTypes';
import type { EditableObjectId } from '../../components/layout-gizmo/layoutStore';
import type { PosterId } from '../../components/wall-posters/posterTypes';
import type { Person, RoomId } from '../../types';
import type { InteractionTarget } from './interactionTypes';
export interface InteractionCommands {
  focusRoom: (id: RoomId | 'overview') => void;
  selectPerson: (person: Person) => void;
  openMailbox: () => void;
  openBookshelf?: () => void;
  selectBook?: (book: BookItemConfig, tierIndex: number) => void;
  selectPoster: (id: PosterId) => void;
  captureSignal: () => void;
  selectFurniture?: (id: EditableObjectId | null) => void;
  fireplace?: () => void;
}
export function createInteractionDispatcher(commands: InteractionCommands, context: { people: readonly Person[]; tiers: readonly TierConfig[]; editing: boolean; activeFurniture?: EditableObjectId | null }) {
  return (target: InteractionTarget) => {
    if (context.editing) {
      if (target.kind === 'furniture-part') commands.selectFurniture?.(target.id === context.activeFurniture ? null : target.id);
      return;
    }
    switch (target.kind) {
      case 'room': commands.focusRoom(target.id); break;
      case 'person': { const person = context.people.find(p => p.id === target.id); if (person) commands.selectPerson(person); break; }
      case 'poster': commands.selectPoster(target.id); break;
      case 'book': { const book = context.tiers.find(t => t.index === target.tierIndex)?.books?.find(b => b.id === target.id); if (book) { commands.selectBook?.(book, target.tierIndex); commands.openBookshelf?.(); } break; }
      case 'entity': if (target.id === 'mailbox') commands.openMailbox(); else if (target.id === 'alien-receiver') commands.captureSignal(); break;
      case 'furniture-part': if (target.id === 'bookshelf-group') commands.openBookshelf?.(); else if (target.id === 'wood-stove') commands.fireplace?.(); break;
    }
  };
}
