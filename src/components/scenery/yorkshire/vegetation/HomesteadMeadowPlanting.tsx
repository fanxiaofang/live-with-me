import type { SceneLayout } from '../../../../world/scene/sceneTypes';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { Grass } from './MeadowVegetationAssets';
import { HOMESTEAD_MEADOW_PLANTS, meadowAnchorTransform } from './meadowPlantingLayout';
import { REFINED_MEADOW_PLANTS } from './meadowStudy';
import { meadowGrassOpacity, meadowPlantPaletteCss } from './meadowPalette';

// Only extend existing functional wear at the end of the stair approaches.
// Grass remains between these shallow, uneven exposed fragments.
const WEAR = [
  { id: 'porch-landing', anchor: 'main_cottage', x: -5, y: 295,
    d: 'M-13 0q5 -2 9 -1l4 -1 5 1 -3 2 -6 0 -5 1z M7 2l5 -1 5 1 -4 1 -5 0z M-4 7l5 -1 4 1 -2 1 -6 0z' },
  { id: 'cabin-landing', anchor: 'wooden_cabin', x: 26, y: 108,
    d: 'M-9 0l4 -2 5 1 3 -1 4 1 -5 2 -5 0z M5 4l4 -1 4 1 -4 1 -3 0z' },
] as const;

export function HomesteadMeadowPlanting({ sceneLayout, theme, treeRefined = false }: { sceneLayout: SceneLayout; theme: YorkshireSceneTheme; treeRefined?: boolean }) {
  const wear = theme.isNight ? '#777650' : theme.isRainy ? '#858554' : '#a69b63';
  const strength = theme.isNight ? .7 : theme.isRainy ? .85 : 1;
  return <>
    <g id="homestead-meadow-wear" pointerEvents="none" aria-hidden="true" fill={wear} opacity={.12 * strength}>
      {WEAR.map(patch => <g key={patch.id} data-use-wear={patch.id} data-wear-anchor={patch.anchor}
        transform={meadowAnchorTransform(patch.anchor, sceneLayout)}>
        <path transform={`translate(${patch.x} ${patch.y})`} d={patch.d} />
      </g>)}
    </g>
    <g id="homestead-meadow-plants" data-composition="accepted-v9" pointerEvents="none" aria-hidden="true">
      <style>{`
        #panoramic-world-stage:has(#homestead-meadow-plants) :is(
          #lawn-natural-grass-tufts,#clover-turf-patches,#meadow-field-blossoms,
          #pasture-wildflowers,#pasture-chamomile-dots,#guardian-tree-root-flora){display:none}
        ${meadowPlantPaletteCss(theme, '#homestead-meadow-plants')}
      `}</style>
      {(treeRefined ? REFINED_MEADOW_PLANTS : HOMESTEAD_MEADOW_PLANTS).map((plant, i) => <g key={i} data-meadow-zone={plant.zone} data-meadow-anchor={plant.anchor}
        transform={meadowAnchorTransform(plant.anchor, sceneLayout)} opacity={meadowGrassOpacity(theme, plant.opacity, plant.scale)}>
        <Grass type={plant.type} x={plant.x} y={plant.y} scale={plant.scale} flip={plant.flip} />
      </g>)}
    </g>
  </>;
}
