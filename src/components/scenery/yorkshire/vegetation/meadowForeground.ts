import { YORKSHIRE_LAYOUT } from '../landscapeLayout';
import { resolveSceneOptions } from '../../../../world/scene/currentScene';

export type MeadowForegroundMode = 'points' | 'regions' | 'entrance';
export function requestedMeadowForeground(search = typeof window === 'undefined' ? '' : window.location.search): MeadowForegroundMode {
  return resolveSceneOptions(search).meadowForeground;
}

const tree = YORKSHIRE_LAYOUT.guardianTree;
const treeRoot = { x: tree.position.x, y: tree.position.y + tree.root.y * tree.scale };
const pen = YORKSHIRE_LAYOUT.sheepPen.anchor;

/** Fixed world planting. Inward satellites cover the portrait crop; outer clumps
 * are larger and can be cropped. Neither the viewport nor the live camera moves roots. */
export const MEADOW_FOREGROUND_CLUSTERS = [
  { id: 'left-inner', side: 'left', x: treeRoot.x + 100, y: treeRoot.y + 19, scale: .57, kind: 'low' },
  { id: 'right-inner', side: 'right', x: pen.x - 157, y: pen.y + 81, scale: .57, kind: 'low' },
  { id: 'left-middle', side: 'left', x: treeRoot.x - 270, y: treeRoot.y + 46, scale: .86, kind: 'plume' },
  { id: 'right-middle', side: 'right', x: pen.x + 235, y: pen.y + 129, scale: .8, kind: 'mixed' },
  { id: 'right-outer', side: 'right', x: pen.x + 425, y: pen.y + 156, scale: 1, kind: 'plume' },
  { id: 'left-outer', side: 'left', x: treeRoot.x - 437, y: treeRoot.y + 104, scale: 1.08, kind: 'plume' },
] as const;

/** Matching shallow turns retain the original east wing's dipped middle and
 * returning outer bay. Roots include the different saved offsets of each wing. */
export const MEADOW_ENTRANCE = {
  hinge: { x: 57.8, y: 701 },
  latch: { x: 97.3, y: 748 },
  gateOpenAngle: 55,
  westPosts: [{ x: -262.2, y: 661 }, { x: -162.2, y: 695 }, { x: -52.2, y: 709 }, { x: 57.8, y: 701 }],
  eastPosts: [{ x: 97.3, y: 748 }, { x: 207.3, y: 756 }, { x: 317.3, y: 742 }, { x: 417.3, y: 708 }],
  postHeight: 31,
  // Lift the middle clump into the pasture, above the open leaf and passage.
  leftMiddlePlantOffset: { x: 80, y: -50 },
} as const;
