import type { RoomId } from '../../types';
import { localPoint, type EntityId, type LocalPoint, type SceneLayout } from './sceneTypes';
import { DEFAULT_SCENE_LAYOUT, entityPointToScene } from './sceneLayout';
import { CAMERA_ORIGIN, OVERVIEW_CAMERA, focusCamera } from '../camera/cameraMath';

export interface RoomFocus {
  targetEntity: EntityId;
  localAnchor: LocalPoint<EntityId>;
  zoom: number;
  compositionPoint: typeof CAMERA_ORIGIN;
}

// Reverse-derived anchors retain the existing framing, including off-building anchors.
const focus = (entity: EntityId, x: number, y: number, zoom: number): RoomFocus => ({
  targetEntity: entity, localAnchor: localPoint(entity, x, y), zoom, compositionPoint: CAMERA_ORIGIN,
});
export const ROOM_FOCUS: Record<RoomId, RoomFocus> = {
  my_room: focus('main_cottage', 600 - 220 / 1.55 - 540, 400 - 150 / 1.55 - 210, 1.55),
  living_nook: focus('main_cottage', 600 - 20 / 1.55 - 540, 400 - 130 / 1.55 - 210, 1.55),
  friend_room: focus('main_cottage', 600 + 180 / 1.55 - 540, 400 - 140 / 1.55 - 210, 1.55),
  porch_mailbox: focus('main_cottage', 600 - 40 / 1.5 - 540, 400 + 80 / 1.5 - 210, 1.5),
  capsule_pod: focus('capsule_pod', 600 + 280 / 1.6 - 894, 400 - 60 / 1.6 - 320, 1.6),
  corn_lounge: focus('wooden_cabin', 600 - 210 / 1.6 - 220, 400 + 30 / 1.6 - 340, 1.6),
  observatory: focus('observatory', -203.125, -98.4375, 1.6),
};
export function resolveRoomCamera(room: RoomId | 'overview', layout: SceneLayout = DEFAULT_SCENE_LAYOUT) {
  if (room === 'overview') return OVERVIEW_CAMERA;
  const target = ROOM_FOCUS[room];
  return focusCamera(entityPointToScene(target.localAnchor, layout), target.zoom, target.compositionPoint);
}
