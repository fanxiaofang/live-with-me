import { OVERVIEW_CAMERA, viewBoxToScene } from '../../../../world/camera/cameraMath';
import { visibleViewBox } from '../../../../world/coordinates/viewport';
import { viewBoxPoint } from '../../../../world/scene/sceneTypes';
import { HOMESTEAD_MEADOW_PLANTS } from './meadowPlantingLayout';
import { resolveSceneOptions } from '../../../../world/scene/currentScene';

export type MeadowStudyMode = 'original' | 'surface' | 'foreground' | 'complete';
export function requestedMeadowStudy(search = typeof window === 'undefined' ? '' : window.location.search): MeadowStudyMode {
  return resolveSceneOptions(search).meadowStudy;
}
export const hasNearPlants = (mode: MeadowStudyMode) => mode === 'foreground' || mode === 'complete';

export const MEADOW_STUDY = {
  // Remove the paired contour rings; keep the accepted colour washes and contact shadows.
  featherOpacity: 0,
  panicles: [
    { x: -24, height: 45, lean: -9 },
    { x: -7, height: 59, lean: 5 },
    { x: 14, height: 51, lean: 11 },
    { x: 33, height: 38, lean: 8 },
  ],
  treePlants: [
    { x: -51, y: 15, scale: .28 }, { x: -28, y: 26, scale: .18 },
    { x: 55, y: 28, scale: .29 }, { x: 36, y: 44, scale: .21 },
    { x: -78, y: 45, scale: .23 }, { x: 72, y: 49, scale: .18 },
  ],
} as const;

let treeIndex = 0;
export const REFINED_MEADOW_PLANTS = HOMESTEAD_MEADOW_PLANTS.map(plant =>
  plant.zone === 'tree-outside' ? { ...plant, ...MEADOW_STUDY.treePlants[treeIndex++] } : plant);

/** Responsive overview composition, converted once into world coordinates.
 * The current camera is deliberately not an input: pans/focus move these roots with the ground. */
export function nearPlantAnchors(width: number, height: number) {
  const safeWidth = width > 0 ? width : 1600, safeHeight = height > 0 ? height : 900;
  const bounds = visibleViewBox(safeWidth, safeHeight);
  const fit = Math.max(safeWidth / 1200, safeHeight / 800), compact = safeWidth < 600;
  const point = (fromLeft: number, belowBottom: number) => viewBoxToScene(
    viewBoxPoint(bounds.minX + fromLeft / fit, bounds.maxY + belowBottom / fit), OVERVIEW_CAMERA);
  return {
    left: point(compact ? 12 : 38, compact ? 7 : 13),
    right: point(safeWidth - (compact ? 8 : 24), compact ? 4 : 8),
    compact,
  };
}
