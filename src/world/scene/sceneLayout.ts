import { scenePoint, type SceneLayout, type EntityId, type LocalPoint } from './sceneTypes';

export const DEFAULT_SCENE_LAYOUT: SceneLayout = {
  main_cottage: { position: scenePoint(540, 210), scale: 1 },
  capsule_pod: { position: scenePoint(894, 320), scale: 1 },
  wooden_cabin: { position: scenePoint(220, 340), scale: 1 },
  observatory: { position: scenePoint(1000, 460), scale: 0.8 },
};

export function entityPointToScene<P extends EntityId>(point: LocalPoint<P>, layout = DEFAULT_SCENE_LAYOUT) {
  const { position, scale } = layout[point.parent];
  return scenePoint(position.x + point.x * scale, position.y + point.y * scale);
}
