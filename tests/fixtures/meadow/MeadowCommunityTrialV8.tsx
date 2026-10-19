import type { SceneLayout } from '../../../src/world/scene/sceneTypes';
import type { YorkshireSceneTheme } from '../../../src/components/scenery/yorkshire/landscapeTypes';
import { Grass } from './GrassStudiesV2';
import { meadowV6Anchor } from './MeadowCommunityTrialV6';
import { MeadowCommunityTrialV7 } from './MeadowCommunityTrialV7';

// Two unequal companions per existing colony. Central circulation stays open.
const COMPANIONS = [
  { zone: 'front-left', anchor: 'main_cottage', type: 'short', x: -126, y: 334, scale: .26, opacity: .8, flip: true },
  { zone: 'front-left', anchor: 'main_cottage', type: 'woven', x: -166, y: 350, scale: .19, opacity: .55, flip: false },
  { zone: 'front-right', anchor: 'main_cottage', type: 'woven', x: 145, y: 326, scale: .27, opacity: .82, flip: true },
  { zone: 'front-right', anchor: 'main_cottage', type: 'short', x: 157, y: 343, scale: .19, opacity: .57, flip: false },
  { zone: 'tree-outside', anchor: 'guardian-tree', type: 'short', x: -154, y: 30, scale: .24, opacity: .7, flip: false },
  { zone: 'tree-outside', anchor: 'guardian-tree', type: 'woven', x: -126, y: 47, scale: .17, opacity: .5, flip: true },
] as const;

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

export function MeadowCommunityTrialV8({ sceneLayout, theme }: { sceneLayout: SceneLayout; theme: YorkshireSceneTheme }) {
  const contact = theme.isNight ? '#354f32' : theme.isRainy ? '#42633a' : '#486732';
  const wear = theme.isNight ? '#777650' : theme.isRainy ? '#858554' : '#a69b63';
  const strength = theme.isNight ? .7 : theme.isRainy ? .85 : 1;
  return <>
    <g id="meadow-root-contacts-v8" pointerEvents="none" aria-hidden="true" fill={contact} opacity={.17 * strength}>
      {CONTACTS.map(root => <g key={root.id} data-root-contact={root.id} data-contact-anchor={root.anchor}
        transform={meadowV6Anchor(root.anchor, sceneLayout)}>
        <path transform={`translate(${root.x} ${root.y})`} d={root.d} />
      </g>)}
    </g>
    <g id="meadow-use-wear-v8" pointerEvents="none" aria-hidden="true" fill={wear} opacity={.12 * strength}>
      {WEAR.map(patch => <g key={patch.id} data-use-wear={patch.id} data-wear-anchor={patch.anchor}
        transform={meadowV6Anchor(patch.anchor, sceneLayout)}>
        <path transform={`translate(${patch.x} ${patch.y})`} d={patch.d} />
      </g>)}
    </g>
    <MeadowCommunityTrialV7 sceneLayout={sceneLayout} theme={theme}>
      <g id="meadow-clumps-v8-additions" data-revision="8">
        {COMPANIONS.map((plant, i) => <g key={i} data-final-zone={plant.zone} data-final-anchor={plant.anchor}
          transform={meadowV6Anchor(plant.anchor, sceneLayout)} opacity={plant.opacity}>
          <Grass type={plant.type} x={plant.x} y={plant.y} scale={plant.scale} flip={plant.flip} />
        </g>)}
      </g>
    </MeadowCommunityTrialV7>
  </>;
}
