import type { RoomId } from '../../types';
import { CAMERA_ORIGIN, OVERVIEW_CAMERA, focusCamera } from '../camera/cameraMath';
import { FULL_VIEWBOX, type ViewBoxBounds } from '../coordinates/viewport';
import { DEFAULT_SCENE_LAYOUT, entityPointToScene } from './sceneLayout';
import { localPoint, viewBoxPoint, type EntityId, type LocalPoint, type SceneLayout } from './sceneTypes';

export interface RoomFocus {
  targetEntity: EntityId;
  localAnchor: LocalPoint<EntityId>;
  zoom: number;
  compositionPoint: typeof CAMERA_ORIGIN;
  contextSize: { width: number; height: number };
}

// Authored around the activity or facility, with enough surrounding architecture
// to orient the visitor. Context is in entity-local units, including placement scale.
const focus = (entity: EntityId, x: number, y: number, zoom: number,
  width: number, height: number, compositionY = 400): RoomFocus => ({
  targetEntity: entity, localAnchor: localPoint(entity, x, y), zoom,
  contextSize: { width, height }, compositionPoint: viewBoxPoint(600, compositionY),
});
export const ROOM_FOCUS: Record<RoomId, RoomFocus> = {
  // Include the seedpod crown and reading loft above the ground-floor activities.
  my_room: focus('main_cottage', -120, 15, 1.2, 500, 530),
  living_nook: focus('main_cottage', 0, 15, 1.18, 640, 530),
  friend_room: focus('main_cottage', 125, 25, 1.2, 500, 530),
  porch_mailbox: focus('main_cottage', 52, 218, 1.08, 440, 400, 450),
  capsule_pod: focus('capsule_pod', 0, 8, 1.45, 260, 250),
  corn_lounge: focus('wooden_cabin', 9, 18, 1.4, 280, 260),
  observatory: focus('observatory', 0, -5, 1.55, 280, 250),
};
export function resolveRoomCamera(room: RoomId | 'overview', layout: SceneLayout = DEFAULT_SCENE_LAYOUT,
  viewport: ViewBoxBounds = FULL_VIEWBOX) {
  if (room === 'overview') return OVERVIEW_CAMERA;
  const target = ROOM_FOCUS[room];
  const width = viewport.maxX - viewport.minX, height = viewport.maxY - viewport.minY;
  const scale = layout[target.targetEntity].scale;
  const zoom = Math.max(0.45, Math.min(target.zoom,
    width * 0.86 / (target.contextSize.width * scale),
    height * 0.76 / (target.contextSize.height * scale)));
  const composition = viewBoxPoint(600, 400 + (target.compositionPoint.y - 400) * height / 800);
  return focusCamera(entityPointToScene(target.localAnchor, layout), Number(zoom.toFixed(4)), composition);
}
