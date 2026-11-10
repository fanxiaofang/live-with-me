import { useId } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { YardObject } from '../../../../features/yard-editor/YardWorld';
import type { YardGrassId } from '../../../../features/yard-editor/yardGrassObjects';
import { meadowPlantPaletteCss } from './meadowPalette';
import { OUTER_MEADOW_ISLANDS } from './meadowOuterLayout';
export { OUTER_MEADOW_ISLANDS } from './meadowOuterLayout';
import { Grass, Plant } from './MeadowVegetationAssets';

/** Inside MeadowPerimeterPlanting's scoped, time-aware palette. */
export function MeadowOuterPlanting({ theme }: { theme: YorkshireSceneTheme }) {
  const id = 'meadow-outer-' + useId().replace(/:/g, '');
  return <g data-meadow-outer-planting="" pointerEvents="none" aria-hidden="true">
    {OUTER_MEADOW_ISLANDS.map(island => <YardObject key={island.id} id={`grass_outer_${island.id}` as YardGrassId}><g id={`${id}-${island.id}`} data-outer-island={island.id}
      data-world-root={`${island.x},${island.y}`} transform={`translate(${island.x} ${island.y})`}>
      <style>{meadowPlantPaletteCss(theme, '#' + id + '-' + island.id)}</style>
      {island.grasses.map((grass, i) => <Grass key={i} {...grass} />)}
      {island.flowers.map((flower, i) => <g key={i} transform={`translate(${flower.x} ${flower.y}) scale(${flower.scale})`}>
        <Plant species={flower.species} />
      </g>)}
    </g></YardObject>)}
  </g>;
}
