import type { SceneLayout } from '../../../../world/scene/sceneTypes';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { Grass } from './MeadowVegetationAssets';
import { HOMESTEAD_MEADOW_PLANTS, meadowAnchorTransform } from './meadowPlantingLayout';
import { meadowPlantPaletteCss } from './meadowPalette';

// Narrow, broken root contacts, never oval projections or soil pedestals.
const CONTACTS = [
  { id: 'cabin', anchor: 'wooden_cabin', x: 80, y: 121, d: 'M-10 0q3 -1 6 0l3 -1 4 1 -2 1 -7 1z M5 0l4 1 -2 1 -4 -1z' },
  { id: 'front-left', anchor: 'main_cottage', x: -135, y: 311, d: 'M-13 0l5 -1 4 1 4 -1 5 1 -2 2 -7 0 -5 1z M7 1l5 -1 2 1 -5 1z' },
  { id: 'front-right', anchor: 'main_cottage', x: 90, y: 306, d: 'M-11 0l4 -1 5 1 3 -1 4 1 -4 2 -7 -1z M6 1l6 -1 -1 2 -5 0z' },
  { id: 'right-shoulder', anchor: 'main_cottage', x: 275, y: 246, d: 'M-10 0l4 -1 4 1 5 -1 5 1 -3 1 -7 1 -6 -1z M10 1l4 0 -2 1 -3 0z' },
  { id: 'pod-outer', anchor: 'capsule_pod', x: 110, y: 61, d: 'M-9 0l4 -1 4 1 5 -1 4 2 -7 1 -5 -1z M-13 1l3 0 -1 1 -3 0z' },
] as const;

// Only extend existing functional wear at the end of the stair approaches.
// Grass remains between these shallow, uneven exposed fragments.
const WEAR = [
  { id: 'porch-landing', anchor: 'main_cottage', x: -5, y: 295,
    d: 'M-13 0q5 -2 9 -1l4 -1 5 1 -3 2 -6 0 -5 1z M7 2l5 -1 5 1 -4 1 -5 0z M-4 7l5 -1 4 1 -2 1 -6 0z' },
  { id: 'cabin-landing', anchor: 'wooden_cabin', x: 26, y: 108,
    d: 'M-9 0l4 -2 5 1 3 -1 4 1 -5 2 -5 0z M5 4l4 -1 4 1 -4 1 -3 0z' },
] as const;

export function HomesteadMeadowPlanting({ sceneLayout, theme }: { sceneLayout: SceneLayout; theme: YorkshireSceneTheme }) {
  const contact = theme.isNight ? '#354f32' : theme.isRainy ? '#42633a' : '#486732';
  const wear = theme.isNight ? '#777650' : theme.isRainy ? '#858554' : '#a69b63';
  const strength = theme.isNight ? .7 : theme.isRainy ? .85 : 1;
  return <>
    <g id="homestead-meadow-root-contacts" pointerEvents="none" aria-hidden="true" fill={contact} opacity={.17 * strength}>
      {CONTACTS.map(root => <g key={root.id} data-root-contact={root.id} data-contact-anchor={root.anchor}
        transform={meadowAnchorTransform(root.anchor, sceneLayout)}>
        <path transform={`translate(${root.x} ${root.y})`} d={root.d} />
      </g>)}
    </g>
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
      {HOMESTEAD_MEADOW_PLANTS.map((plant, i) => <g key={i} data-meadow-zone={plant.zone} data-meadow-anchor={plant.anchor}
        transform={meadowAnchorTransform(plant.anchor, sceneLayout)} opacity={plant.opacity}>
        <Grass type={plant.type} x={plant.x} y={plant.y} scale={plant.scale} flip={plant.flip} />
      </g>)}
    </g>
  </>;
}
