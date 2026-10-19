import type { SceneLayout } from '../../../src/world/scene/sceneTypes';
import type { ReactNode } from 'react';
import type { YorkshireSceneTheme } from '../../../src/components/scenery/yorkshire/landscapeTypes';
import { Grass } from './GrassStudiesV2';
import { MeadowMicroCommunityTrial } from './MeadowMicroCommunityTrial';
import { MeadowClumpAdditionsV6, meadowV6Anchor } from './MeadowCommunityTrialV6';

// Small companions, authored around existing roots. Unequal gaps leave open
// ground between colonies; no additional tall grass or entrance planting.
const COMPANIONS = [
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
] as const;

export function MeadowCommunityTrialV7({ sceneLayout, theme, children }: { sceneLayout: SceneLayout; theme: YorkshireSceneTheme; children?: ReactNode }) {
  return <MeadowMicroCommunityTrial sceneLayout={sceneLayout} theme={theme}>
    <MeadowClumpAdditionsV6 sceneLayout={sceneLayout} />
    <g id="meadow-clumps-v7-additions" data-revision="7">
      {COMPANIONS.map((plant, i) => <g key={i} data-density-zone={plant.zone} data-density-anchor={plant.anchor}
        transform={meadowV6Anchor(plant.anchor, sceneLayout)} opacity={plant.opacity}>
        <Grass type={plant.type} x={plant.x} y={plant.y} scale={plant.scale} flip={plant.flip} />
      </g>)}
    </g>
    {children}
  </MeadowMicroCommunityTrial>;
}
