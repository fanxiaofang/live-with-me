import { scenePoint, type EntityId, type LocalPoint, type SceneLayout, type ScenePoint } from './sceneTypes';

// Scale the complete asset around its ground contact instead of its drawing origin.
const scaleAtGround = (position: ScenePoint, scale: number, ground: readonly [number, number]) => ({
  position: scenePoint(position.x + ground[0] * (1 - scale), position.y + ground[1] * (1 - scale)),
  scale,
});

export const DEFAULT_SCENE_LAYOUT: SceneLayout = {
  main_cottage: { position: scenePoint(540, 210), scale: 1 },
  capsule_pod: scaleAtGround(scenePoint(950, 390), 1.46718, [0, 63]),
  wooden_cabin: scaleAtGround(scenePoint(150, 300), 1.364, [9, 63]),
  // Preserve the original station's ground contact at y=268.4 while enlarging the whole structure.
  observatory: scaleAtGround(scenePoint(1100, 220.4), 1.04, [0, 48]),
};

// Garden groups are independent yard objects, not children of the cabin's scale.
export const DEFAULT_GARDEN_PLACEMENTS = {
  pumpkin: { position: scenePoint(-93.96, 377.88), scale: 1.24 },
  beehive: { position: scenePoint(-69.16, 229.08), scale: 1.24 },
};

export function entityPointToScene<P extends EntityId>(point: LocalPoint<P>, layout = DEFAULT_SCENE_LAYOUT) {
  const { position, scale } = layout[point.parent];
  return scenePoint(position.x + point.x * scale, position.y + point.y * scale);
}
