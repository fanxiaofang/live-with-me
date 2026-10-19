import type { ComponentProps } from 'react';
import type { SceneLayout } from '../../../../world/scene/sceneTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';
import type { Grass } from './MeadowVegetationAssets';

export type MeadowAnchor = 'main_cottage' | 'wooden_cabin' | 'guardian-tree' | 'capsule_pod';
export type MeadowPlacement = {
  zone: string; anchor: MeadowAnchor; type: ComponentProps<typeof Grass>['type'];
  x: number; y: number; scale: number; opacity: number; flip?: boolean;
};

/** Static accepted planting. Entry paths stay clear; companions have unequal strength. */
export const HOMESTEAD_MEADOW_PLANTS: readonly MeadowPlacement[] = [
  { zone: 'cabin-transition', anchor: 'wooden_cabin', type: 'woven', x: 80, y: 120, scale: .28, opacity: 1, flip: true },
  { zone: 'cabin-transition', anchor: 'wooden_cabin', type: 'short', x: 101, y: 126, scale: .18, opacity: .55 },
  { zone: 'front-left', anchor: 'main_cottage', type: 'woven', x: -135, y: 310, scale: .36, opacity: 1 },
  { zone: 'front-left', anchor: 'main_cottage', type: 'short', x: -112, y: 319, scale: .22, opacity: .65, flip: true },
  { zone: 'front-right', anchor: 'main_cottage', type: 'short', x: 90, y: 305, scale: .34, opacity: 1 },
  { zone: 'front-right', anchor: 'main_cottage', type: 'woven', x: 110, y: 311, scale: .19, opacity: .65, flip: true },
  { zone: 'front-right', anchor: 'main_cottage', type: 'short', x: 133, y: 319, scale: .16, opacity: .45 },
  { zone: 'right-main', anchor: 'main_cottage', type: 'meadow', x: 275, y: 245, scale: .3, opacity: 1 },
  { zone: 'right-main', anchor: 'main_cottage', type: 'woven', x: 298, y: 253, scale: .22, opacity: .75, flip: true },
  { zone: 'right-main', anchor: 'main_cottage', type: 'short', x: 325, y: 265, scale: .15, opacity: .45 },
  { zone: 'tree-outside', anchor: 'guardian-tree', type: 'short', x: -114, y: 18, scale: .23, opacity: .8, flip: true },
  { zone: 'tree-outside', anchor: 'guardian-tree', type: 'woven', x: -94, y: 25, scale: .13, opacity: .4 },
  { zone: 'pod-outer', anchor: 'capsule_pod', type: 'leaning', x: 110, y: 60, scale: .25, opacity: 1, flip: true },
  { zone: 'pod-outer', anchor: 'capsule_pod', type: 'short', x: 93, y: 74, scale: .18, opacity: .55 },
  { zone: 'pod-outer', anchor: 'capsule_pod', type: 'leaning', x: 190, y: 45, scale: .2, opacity: .7 },
  { zone: 'cabin-transition', anchor: 'wooden_cabin', type: 'short', x: 123, y: 145, scale: .23, opacity: .65 },
  { zone: 'front-left', anchor: 'main_cottage', type: 'woven', x: -179, y: 333, scale: .25, opacity: .7, flip: true },
  { zone: 'front-right', anchor: 'main_cottage', type: 'short', x: 166, y: 333, scale: .24, opacity: .65 },
  { zone: 'tree-outside', anchor: 'guardian-tree', type: 'short', x: -146, y: 44, scale: .2, opacity: .58, flip: true },
  { zone: 'southeast-transition', anchor: 'main_cottage', type: 'woven', x: 232, y: 359, scale: .21, opacity: .55 },

  { zone: 'cabin-transition', anchor: 'wooden_cabin', type: 'short', x: 62, y: 133, scale: .20, opacity: .62, flip: false },
  { zone: 'cabin-transition', anchor: 'wooden_cabin', type: 'woven', x: 105, y: 153, scale: .16, opacity: .44, flip: true },
  { zone: 'front-left', anchor: 'main_cottage', type: 'short', x: -154, y: 323, scale: .23, opacity: .72, flip: true },
  { zone: 'front-left', anchor: 'main_cottage', type: 'woven', x: -190, y: 344, scale: .15, opacity: .46, flip: false },
  { zone: 'front-right', anchor: 'main_cottage', type: 'woven', x: 119, y: 329, scale: .22, opacity: .67, flip: false },
  { zone: 'front-right', anchor: 'main_cottage', type: 'short', x: 180, y: 344, scale: .16, opacity: .43, flip: true },
  { zone: 'tree-outside', anchor: 'guardian-tree', type: 'woven', x: -131, y: 29, scale: .17, opacity: .46, flip: false },
  { zone: 'pod-outer', anchor: 'capsule_pod', type: 'woven', x: 130, y: 72, scale: .20, opacity: .58, flip: true },
  { zone: 'southeast-transition', anchor: 'main_cottage', type: 'short', x: 214, y: 369, scale: .23, opacity: .65, flip: true },
  { zone: 'southeast-transition', anchor: 'main_cottage', type: 'short', x: 251, y: 374, scale: .15, opacity: .4, flip: false },

  { zone: 'front-left', anchor: 'main_cottage', type: 'short', x: -126, y: 334, scale: .26, opacity: .8, flip: true },
  { zone: 'front-left', anchor: 'main_cottage', type: 'woven', x: -166, y: 350, scale: .19, opacity: .55, flip: false },
  { zone: 'front-right', anchor: 'main_cottage', type: 'woven', x: 145, y: 326, scale: .27, opacity: .82, flip: true },
  { zone: 'front-right', anchor: 'main_cottage', type: 'short', x: 157, y: 343, scale: .19, opacity: .57, flip: false },
  { zone: 'tree-outside', anchor: 'guardian-tree', type: 'short', x: -154, y: 30, scale: .24, opacity: .7, flip: false },
  { zone: 'tree-outside', anchor: 'guardian-tree', type: 'woven', x: -126, y: 47, scale: .17, opacity: .5, flip: true },
];

export function meadowAnchorTransform(anchor: MeadowAnchor, layout: SceneLayout) {
  const entity = anchor === 'guardian-tree' ? YORKSHIRE_LAYOUT.guardianTree : layout[anchor];
  return `translate(${entity.position.x} ${entity.position.y}) scale(${entity.scale})${anchor === 'guardian-tree' ? ` translate(0 ${YORKSHIRE_LAYOUT.guardianTree.root.y})` : ''}`;
}
