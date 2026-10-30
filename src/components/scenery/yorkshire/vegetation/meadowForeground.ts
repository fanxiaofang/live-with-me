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

/** Short, turning boundaries frame the retained gate without a long diagonal
 * running off the bottom of the wide view. All post roots remain on the lawn. */
export const MEADOW_ENTRANCE = {
  hinge: { x: 0, y: 680 },
  openEnd: { x: 75, y: 661 },
  latch: { x: 125, y: 680 + 125 * .283088 },
  westPosts: [{ x: -320, y: 620 }, { x: -210, y: 633 }, { x: -95, y: 653 }, { x: 0, y: 680 }],
  eastPosts: [{ x: 125, y: 680 + 125 * .283088 }, { x: 235, y: 721 }, { x: 330, y: 710 }, { x: 380, y: 681 }],
  postHeight: 31,
  // Lift the middle clump into the pasture, above the open leaf and passage.
  leftMiddlePlantOffset: { x: 80, y: -50 },
} as const;
