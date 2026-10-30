import type { EntityId, SceneLayout } from './sceneTypes';
import { YORKSHIRE_LAYOUT } from '../../components/scenery/yorkshire/landscapeLayout';

export interface SceneBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

// Solid architecture envelopes in entity-local space. Steam and thought bubbles
// are excluded so ambient animation cannot change the camera's travel range.
const BUILDING_ENVELOPES: Record<EntityId, SceneBounds> = {
  main_cottage: { minX: -320, maxX: 320, minY: -243, maxY: 310 },
  capsule_pod: { minX: -70, maxX: 80, minY: -72, maxY: 78 },
  wooden_cabin: { minX: -88, maxX: 98, minY: -62, maxY: 95 },
  observatory: { minX: -78, maxX: 79, minY: -66, maxY: 72 },
};

export function sceneExplorationBounds(layout: SceneLayout): SceneBounds {
  const bounds = Object.entries(BUILDING_ENVELOPES).map(([id, envelope]) => {
    const { position, scale } = layout[id as EntityId];
    return {
      minX: position.x + envelope.minX * scale,
      maxX: position.x + envelope.maxX * scale,
      minY: position.y + envelope.minY * scale,
      maxY: position.y + envelope.maxY * scale,
    };
  });
  const pen = YORKSHIRE_LAYOUT.sheepPen;
  bounds.push({
    minX: pen.anchor.x + pen.bounds.minX,
    maxX: pen.anchor.x + pen.bounds.maxX,
    minY: pen.anchor.y + pen.bounds.minY,
    maxY: pen.anchor.y + pen.bounds.maxY,
  });
  return {
    minX: Math.min(...bounds.map(b => b.minX)),
    maxX: Math.max(...bounds.map(b => b.maxX)),
    minY: Math.min(...bounds.map(b => b.minY)),
    maxY: Math.max(...bounds.map(b => b.maxY)),
  };
}
