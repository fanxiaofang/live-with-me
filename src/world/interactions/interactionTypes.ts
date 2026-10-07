import type { RoomId } from '../../types';
import type { EditableObjectId } from '../../components/layout-gizmo/layoutStore';
import type { PosterId } from '../../components/wall-posters/posterTypes';
export type InteractionTarget =
  | { kind: 'entity'; id: string }
  | { kind: 'room'; id: RoomId | 'overview' }
  | { kind: 'person'; id: string }
  | { kind: 'book'; id: string; tierIndex: number }
  | { kind: 'poster'; id: PosterId }
  | { kind: 'furniture-part'; id: EditableObjectId };
export type HoverTarget = (target: InteractionTarget | null) => void;
