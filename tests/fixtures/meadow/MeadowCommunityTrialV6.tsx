import type { SceneLayout } from '../../../src/world/scene/sceneTypes';
import type { YorkshireSceneTheme } from '../../../src/components/scenery/yorkshire/landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../../../src/components/scenery/yorkshire/landscapeLayout';
import { Grass } from './GrassStudiesV2';
import { MeadowMicroCommunityTrial } from './MeadowMicroCommunityTrial';
import { meadowSurfacePalette } from './meadowSurfacePalette';

type Anchor = 'main_cottage' | 'wooden_cabin' | 'guardian-tree' | 'capsule_pod';
type Brush = { x: number; y: number; d: string; leaf?: string; opacity: number };
type Zone = { id: string; anchor: Anchor; brushes: Brush[] };

// Each passage sits outside the nearby clump silhouette, with unequal gaps.
// Longer southeast passages end before the pen and fade toward the pasture.
const ZONES: Zone[] = [
  { id: 'cabin-transition', anchor: 'wooden_cabin', brushes: [
    { x: 49, y: 133, d: 'M0 0q5 -3 12 -3 M7 4q5 -2 10 -2 M17 1l5 -1', leaf: 'M0 0q6 -5 12 -4q-5 2 -12 5z', opacity: .72 },
    { x: 77, y: 145, d: 'M0 0q5 -2 11 -1 M8 4q4 -2 9 -1 M21 1l4 -1', opacity: .57 },
    { x: 108, y: 110, d: 'M0 0q4 -3 9 -4 M7 4q6 -3 12 -3 M19 1l4 -1', opacity: .58 },
    { x: 139, y: 155, d: 'M0 0q5 -1 11 0 M10 4q4 -1 9 0', leaf: 'M1 0q5 -3 11 -1q-6 0 -11 2z', opacity: .62 },
    { x: 55, y: 170, d: 'M0 0q6 -2 13 -2 M12 5q4 -2 9 -2 M25 1l4 -1', opacity: .43 },
  ] },
  { id: 'tree-outside', anchor: 'guardian-tree', brushes: [
    { x: -188, y: 14, d: 'M0 0q5 -1 11 1 M9 5q6 0 13 1 M24 2l5 1', opacity: .61 },
    { x: -183, y: 37, d: 'M0 0q5 -3 12 -3 M7 5q5 -2 10 -2', leaf: 'M0 0q6 -4 12 -3q-5 1 -12 4z', opacity: .7 },
    { x: -126, y: 47, d: 'M0 0q6 -2 13 -1 M13 5q5 -1 10 0 M26 1l4 0', opacity: .6 },
    { x: -103, y: 66, d: 'M0 0q5 -3 11 -3 M9 4q6 -1 12 -2', opacity: .42 },
    { x: -178, y: 71, d: 'M0 0q8 -2 16 -1 M14 5q6 -1 11 0 M29 1l5 0', opacity: .35 },
  ] },
  { id: 'front-left', anchor: 'main_cottage', brushes: [
    { x: -174, y: 294, d: 'M0 0q6 -3 13 -2 M11 5q5 -2 11 -1 M25 1l4 -1', opacity: .57 },
    { x: -159, y: 321, d: 'M0 0q4 -2 9 -2 M5 5q6 -2 13 -2', leaf: 'M1 0q4 -4 10 -3q-5 1 -10 4z', opacity: .82 },
    { x: -127, y: 335, d: 'M0 0q6 -1 14 0 M10 5q4 -1 10 0 M25 1l4 1', opacity: .66 },
    { x: -196, y: 350, d: 'M0 0q6 -3 13 -3 M8 5q6 -2 12 -2 M25 1l5 -1', leaf: 'M0 0q6 -5 13 -4q-6 2 -13 5z', opacity: .7 },
    { x: -160, y: 371, d: 'M0 0q6 -2 12 -1 M13 4q4 -1 9 0', opacity: .4 },
    { x: -104, y: 354, d: 'M0 0q5 -2 11 -3 M8 5q5 -2 12 -2 M24 0l3 -1', opacity: .43 },
  ] },
  { id: 'front-right', anchor: 'main_cottage', brushes: [
    { x: 58, y: 320, d: 'M0 0q6 -2 13 -1 M11 5q4 -1 9 0', opacity: .66 },
    { x: 95, y: 333, d: 'M0 0q6 -3 14 -3 M12 5q5 -2 10 -2 M26 1l4 -1', leaf: 'M0 0q6 -5 13 -4q-6 2 -13 5z', opacity: .78 },
    { x: 144, y: 299, d: 'M0 0q4 -3 10 -3 M8 5q5 -3 11 -3', opacity: .56 },
    { x: 146, y: 350, d: 'M0 0q5 -1 12 1 M12 5q5 0 11 1 M26 1l4 1', leaf: 'M0 0q5 -2 12 1q-5 -1 -12 0z', opacity: .74 },
    { x: 186, y: 322, d: 'M0 0q6 -3 13 -3 M9 5q6 -2 12 -2 M25 1l4 -1', opacity: .59 },
    { x: 198, y: 345, d: 'M0 0q5 -2 12 -1 M12 4q4 -1 9 0', opacity: .4 },
  ] },
  { id: 'right-shoulder', anchor: 'main_cottage', brushes: [
    { x: 237, y: 255, d: 'M0 0q5 -3 12 -3 M9 5q5 -2 11 -2 M24 1l5 -1', opacity: .65 },
    { x: 253, y: 278, d: 'M0 0q6 -2 14 -1 M12 5q5 -1 11 0', opacity: .62 },
    { x: 299, y: 231, d: 'M0 0q5 -3 12 -3 M9 5q5 -2 11 -2', leaf: 'M0 0q6 -5 12 -4q-5 2 -12 5z', opacity: .58 },
    { x: 338, y: 243, d: 'M0 0q6 -2 13 -2 M12 5q5 -1 10 -1', opacity: .43 },
    { x: 280, y: 293, d: 'M0 0q7 -2 15 -1 M13 5q5 -1 11 0 M29 1l4 0', opacity: .35 },
  ] },
  { id: 'pod-outer', anchor: 'capsule_pod', brushes: [
    { x: 62, y: 57, d: 'M0 0q6 -3 13 -3 M9 5q5 -2 11 -2 M24 0l5 -1', opacity: .66 },
    { x: 79, y: 83, d: 'M0 0q6 -2 14 -1 M13 5q5 -1 10 0', leaf: 'M0 0q7 -4 14 -2q-6 1 -14 3z', opacity: .62 },
    { x: 126, y: 81, d: 'M0 0q5 -3 12 -3 M9 5q6 -2 13 -2 M26 1l4 -1', opacity: .64 },
    { x: 156, y: 59, d: 'M0 0q6 -2 13 -2 M11 5q5 -1 11 -1', opacity: .47 },
    { x: 208, y: 68, d: 'M0 0q7 -3 15 -3 M13 5q6 -2 12 -2 M29 1l5 -1', opacity: .36 },
  ] },
  { id: 'southeast-transition', anchor: 'main_cottage', brushes: [
    { x: 195, y: 375, d: 'M0 0q8 -4 18 -4 M12 6q6 -3 15 -3 M31 1l5 -1', leaf: 'M0 0q8 -6 18 -5q-9 2 -18 6z', opacity: .63 },
    { x: 245, y: 382, d: 'M0 0q9 -3 20 -2 M15 6q7 -2 16 -1 M35 2l5 0', opacity: .52 },
    { x: 269, y: 353, d: 'M0 0q7 -4 17 -4 M13 6q7 -2 16 -2', opacity: .48 },
    { x: 224, y: 408, d: 'M0 0q9 -3 20 -2 M17 6q6 -2 14 -1', opacity: .31 },
    { x: 273, y: 402, d: 'M0 0q8 -4 19 -4 M15 6q7 -2 16 -2 M35 1l5 -1', opacity: .23 },
  ] },
];

export function meadowV6Anchor(anchor: Anchor, layout: SceneLayout) {
  const entity = anchor === 'guardian-tree' ? YORKSHIRE_LAYOUT.guardianTree : layout[anchor];
  return `translate(${entity.position.x} ${entity.position.y}) scale(${entity.scale})${anchor === 'guardian-tree' ? ` translate(0 ${YORKSHIRE_LAYOUT.guardianTree.root.y})` : ''}`;
}

export function MeadowCommunityTrialV6({ sceneLayout, theme }: { sceneLayout: SceneLayout; theme: YorkshireSceneTheme }) {
  const colors = meadowSurfacePalette(theme);
  return <>
    {/* Outside the terrace mask, so tree and pasture transitions are visible.
        Brush positions stay clear of structures, contacts, paths and clump bodies. */}
    <g id="meadow-brushes-v6" data-revision="6" pointerEvents="none" aria-hidden="true"
      fill="none" strokeLinecap="round" opacity={colors.strength}>
      {ZONES.map(zone => <g key={zone.id} data-brush-zone={zone.id} data-brush-anchor={zone.anchor}
        transform={meadowV6Anchor(zone.anchor, sceneLayout)}>
        {zone.brushes.map((brush, index) => <g key={index} data-brush-passage={`${zone.id}-${index}`}
          transform={`translate(${brush.x} ${brush.y})`} opacity={brush.opacity}>
          {brush.leaf && <path d={brush.leaf} fill={colors.trace} stroke="none" opacity=".14" />}
          <path d={brush.d} stroke={colors.trace} strokeWidth="1.15" opacity=".32" />
        </g>)}
      </g>)}
    </g>
    <MeadowMicroCommunityTrial sceneLayout={sceneLayout} theme={theme}>
      <MeadowClumpAdditionsV6 sceneLayout={sceneLayout} />
    </MeadowMicroCommunityTrial>
  </>;
}

/** Shared unchanged plants; round 7 deliberately omits the brush layer. */
export function MeadowClumpAdditionsV6({ sceneLayout }: { sceneLayout: SceneLayout }) {
  return (
      <g id="meadow-clumps-v6-additions" data-revision="6">
        <g data-new-clump="cabin" data-grass-type="short" transform={meadowV6Anchor('wooden_cabin', sceneLayout)} opacity=".65"><Grass type="short" x={123} y={145} scale={.23} /></g>
        <g data-new-clump="front-left" data-grass-type="short" transform={meadowV6Anchor('main_cottage', sceneLayout)} opacity=".7"><Grass type="woven" x={-179} y={333} scale={.25} flip /></g>
        <g data-new-clump="front-right" data-grass-type="short" transform={meadowV6Anchor('main_cottage', sceneLayout)} opacity=".65"><Grass type="short" x={166} y={333} scale={.24} /></g>
        <g data-new-clump="tree-outside" data-grass-type="short" transform={meadowV6Anchor('guardian-tree', sceneLayout)} opacity=".58"><Grass type="short" x={-146} y={44} scale={.2} flip /></g>
        <g data-new-clump="southeast" data-grass-type="short" transform={meadowV6Anchor('main_cottage', sceneLayout)} opacity=".55"><Grass type="woven" x={232} y={359} scale={.21} /></g>
      </g>
  );
}
