import type { WorldViewId } from '../../types';
import { CAMERA_ORIGIN, focusCamera } from '../camera/cameraMath';
import { resolveOverviewCamera } from '../camera/overviewFraming';
import { FULL_VIEWBOX, type ViewBoxBounds } from '../coordinates/viewport';
import { DEFAULT_SCENE_LAYOUT, entityPointToScene } from './sceneLayout';
import type { SceneBounds } from './explorationBounds';
import { localPoint, viewBoxPoint, type EntityId, type LocalPoint, type SceneLayout } from './sceneTypes';

export interface RoomFocus {
  targetEntity: EntityId;
  localAnchor: LocalPoint<EntityId>;
  zoom: number;
  compositionPoint: typeof CAMERA_ORIGIN;
  contextSize: { width: number; height: number };
  /** Fit an authored screen-edge crop instead of adding activity-view margins. */
  frameToViewport?: boolean;
}

// Authored around the activity or facility, with enough surrounding architecture
// to orient the visitor. Context is in entity-local units, including placement scale.
const focus = (entity: EntityId, x: number, y: number, zoom: number,
  width: number, height: number, compositionY = 400): RoomFocus => ({
  targetEntity: entity, localAnchor: localPoint(entity, x, y), zoom,
  contextSize: { width, height }, compositionPoint: viewBoxPoint(600, compositionY),
});
// Local y=-128 sits above the loft pumpkin; y=238 meets the entrance steps.
// Keep the ground floor centered horizontally, with a little space past its posts.
const livingFocus: RoomFocus = {
  ...focus('main_cottage', 0, 55, 2.5, 560, 366),
  frameToViewport: true,
};
export const ROOM_FOCUS: Record<Exclude<WorldViewId, 'overview'>, RoomFocus> = {
  // The upstairs deck is distinct from the original ground-floor workstations.
  loft: focus('main_cottage', -25, -70, 2.1, 360, 260),
  my_room: focus('main_cottage', -120, 15, 1.2, 500, 530),
  living_nook: livingFocus,
  // Retain saved presence/seating IDs while removing the duplicate camera.
  friend_room: livingFocus,
  porch_mailbox: focus('main_cottage', 52, 218, 1.08, 440, 400, 450),
  capsule_pod: focus('capsule_pod', 0, 8, 1.45, 260, 250),
  corn_lounge: focus('wooden_cabin', 9, 18, 1.4, 280, 260),
  observatory: focus('observatory', 0, -5, 1.55, 280, 250),
};
export function resolveRoomCamera(room: WorldViewId, layout: SceneLayout = DEFAULT_SCENE_LAYOUT,
  viewport: ViewBoxBounds = FULL_VIEWBOX, bounds?: SceneBounds) {
  if (room === 'overview') return resolveOverviewCamera(layout, viewport, bounds);
  const target = ROOM_FOCUS[room];
  const width = viewport.maxX - viewport.minX, height = viewport.maxY - viewport.minY;
  const scale = layout[target.targetEntity].scale;
  const zoom = Math.max(0.45, Math.min(target.zoom,
    width * (target.frameToViewport ? 1 : 0.86) / (target.contextSize.width * scale),
    height * (target.frameToViewport ? 1 : 0.76) / (target.contextSize.height * scale)));
  const composition = viewBoxPoint(600, 400 + (target.compositionPoint.y - 400) * height / 800);
  return focusCamera(entityPointToScene(target.localAnchor, layout), Number(zoom.toFixed(4)), composition);
}
