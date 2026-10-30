import type { ComponentProps } from 'react';
import { Grass, Plant } from './MeadowVegetationAssets';

type OuterIsland = {
  id: string; x: number; y: number;
  grasses: readonly ComponentProps<typeof Grass>[];
  flowers: readonly { x: number; y: number; scale: number; species: ComponentProps<typeof Plant>['species'] }[];
};

/** Separately authored habitats: a loose western sweep and a lower eastern
 * clover/buttercup patch farther forward. No mirrored shared template. */
export const OUTER_MEADOW_ISLANDS: readonly OuterIsland[] = [
  {
    id: 'west', x: -405, y: 325,
    grasses: [
      { type: 'short', x: -123, y: 24, scale: .32 },
      { type: 'meadow', x: -77, y: 8, scale: .66, flip: true },
      { type: 'woven', x: -57, y: 20, scale: .58 },
      { type: 'meadow', x: -28, y: -9, scale: .85 },
      { type: 'leaning', x: 13, y: -4, scale: .68 },
      { type: 'short', x: 34, y: 20, scale: .6, flip: true },
      { type: 'leaning', x: 82, y: 29, scale: .51 },
      { type: 'woven', x: 112, y: 44, scale: .42 },
      { type: 'short', x: 165, y: 59, scale: .25, flip: true },
    ],
    flowers: [
      { species: 'daisy', x: -108, y: 31, scale: .8 },
      { species: 'daisy', x: 66, y: 43, scale: .65 },
    ],
  },
  {
    id: 'east', x: 1665, y: 475,
    grasses: [
      { type: 'short', x: -101, y: -3, scale: .43 },
      { type: 'woven', x: -53, y: 16, scale: .61, flip: true },
      { type: 'short', x: -9, y: 29, scale: .7 },
      { type: 'woven', x: 28, y: 4, scale: .48 },
      { type: 'short', x: 58, y: 21, scale: .58, flip: true },
      { type: 'short', x: 106, y: -40, scale: .3 },
    ],
    flowers: [
      { species: 'clover', x: -74, y: 8, scale: 1 },
      { species: 'clover', x: -28, y: 27, scale: 1.05 },
      { species: 'clover', x: 15, y: 35, scale: .9 },
      { species: 'buttercup', x: -34, y: -4, scale: .95 },
      { species: 'buttercup', x: 14, y: 4, scale: 1.05 },
      { species: 'buttercup', x: 49, y: 32, scale: .75 },
      { species: 'clover', x: 91, y: -28, scale: .75 },
      { species: 'buttercup', x: 118, y: -43, scale: .6 },
    ],
  },
];

/** Inside MeadowPerimeterPlanting's scoped, time-aware palette. */
export function MeadowOuterPlanting() {
  return <g data-meadow-outer-planting="" pointerEvents="none" aria-hidden="true">
    {OUTER_MEADOW_ISLANDS.map(island => <g key={island.id} data-outer-island={island.id}
      data-world-root={`${island.x},${island.y}`} transform={`translate(${island.x} ${island.y})`}>
      {island.grasses.map((grass, i) => <Grass key={i} {...grass} />)}
      {island.flowers.map((flower, i) => <g key={i} transform={`translate(${flower.x} ${flower.y}) scale(${flower.scale})`}>
        <Plant species={flower.species} />
      </g>)}
    </g>)}
  </g>;
}
