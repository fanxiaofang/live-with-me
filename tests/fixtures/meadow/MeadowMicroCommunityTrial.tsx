import type { SceneLayout } from '../../../src/world/scene/sceneTypes';
import type { YorkshireSceneTheme } from '../../../src/components/scenery/yorkshire/landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../../../src/components/scenery/yorkshire/landscapeLayout';
import { Grass } from './GrassStudiesV2';
import type { ReactNode } from 'react';

// Round 3 is a placement revision, using exactly the same leaf geometry.
// Seven short-grass sites: three singles, three pairs, one asymmetric triplet.
// Companion plants are smaller/fainter; the entrance stays empty.
export function MeadowMicroCommunityTrial({ sceneLayout, theme, children }: { sceneLayout: SceneLayout; theme: YorkshireSceneTheme; children?: ReactNode }) {
  const house = sceneLayout.main_cottage, cabin = sceneLayout.wooden_cabin;
  const pod = sceneLayout.capsule_pod, tree = YORKSHIRE_LAYOUT.guardianTree;
  const light = theme.isNight ? 'night' : theme.isRainy ? 'rain' : 'day';
  const source = ['#526f3f', '#648449', '#829954', '#9eaf65'];
  const target = light === 'night' ? ['#354d36', '#496140', '#65794c', '#7a8a58']
    : light === 'rain' ? ['#486342', '#597a49', '#758e57', '#8b9f66'] : source;
  return <g id="meadow-vegetation-trial" data-revision="3" data-active="true" data-light={light}
    pointerEvents="none" aria-hidden="true">
    <style>{`
      #panoramic-world-stage:has(#meadow-vegetation-trial[data-revision="3"][data-active="true"]) :is(
        #lawn-natural-grass-tufts, #clover-turf-patches, #meadow-field-blossoms,
        #pasture-wildflowers, #pasture-chamomile-dots, #guardian-tree-root-flora) { display:none; }
      ${source.map((color, i) => `#meadow-vegetation-trial [fill="${color}"]{fill:${target[i]}}`).join('\n')}
    `}</style>
    <g data-vegetation-anchor="wooden_cabin"
      transform={`translate(${cabin.position.x} ${cabin.position.y}) scale(${cabin.scale})`}>
      {/* Retain the weak transition on the right, delete the isolated left-front dot. */}
      <g data-planting-zone="cabin-transition" data-short-site="cabin-pair" data-grass-type="short">
        <Grass type="woven" x={80} y={120} scale={.28} flip />
        <g opacity=".55"><Grass type="short" x={101} y={126} scale={.18} /></g>
      </g>
    </g>
    <g data-vegetation-anchor="main_cottage"
      transform={`translate(${house.position.x} ${house.position.y}) scale(${house.scale})`}>
      <g data-planting-zone="front-left" data-short-site="front-pair" data-grass-type="short">
        <Grass type="woven" x={-135} y={310} scale={.36} />
        <g opacity=".65"><Grass type="short" x={-112} y={319} scale={.22} flip /></g>
      </g>
      {/* One established tuft, two receding traces. No new roots in front of the steps. */}
      <g data-planting-zone="front-right" data-short-site="front-triplet" data-grass-type="short">
        <Grass type="short" x={90} y={305} scale={.34} />
        <g opacity=".65"><Grass type="woven" x={110} y={311} scale={.19} flip /></g>
        <g opacity=".45"><Grass type="short" x={133} y={319} scale={.16} /></g>
      </g>
      <g data-planting-zone="right-main">
        <g data-grass-type="wild"><Grass type="meadow" x={275} y={245} scale={.3} /></g>
        <g data-short-site="meadow-companion" data-grass-type="short" opacity=".75">
          <Grass type="woven" x={298} y={253} scale={.22} flip />
        </g>
        <g data-short-site="meadow-trace" data-grass-type="short" opacity=".45">
          <Grass type="short" x={325} y={265} scale={.15} />
        </g>
      </g>
    </g>
    <g data-vegetation-anchor="guardian-tree"
      transform={`translate(${tree.position.x} ${tree.position.y}) scale(${tree.scale})`}>
      {/* Delete the eastern root-side dot and all tall grass near the tree. */}
      <g data-planting-zone="tree-outside" data-short-site="tree-traces" data-grass-type="short"
        transform={`translate(0 ${tree.root.y})`}>
        <g opacity=".8"><Grass type="short" x={-114} y={18} scale={.23} flip /></g>
        <g opacity=".4"><Grass type="woven" x={-94} y={25} scale={.13} /></g>
      </g>
    </g>
    <g data-vegetation-anchor="capsule_pod"
      transform={`translate(${pod.position.x} ${pod.position.y}) scale(${pod.scale})`}>
      {/* The old lower-right tuft was close to the pen's conservative envelope.
          Move its rhythm to the pod's outer side, away from its western entrance. */}
      <g data-planting-zone="pod-outer">
        <g data-grass-type="wild"><Grass type="leaning" x={110} y={60} scale={.25} flip /></g>
        <g data-short-site="pod-companion" data-grass-type="short" opacity=".55">
          <Grass type="short" x={93} y={74} scale={.18} />
        </g>
        <g data-grass-type="wild" opacity=".7"><Grass type="leaning" x={190} y={45} scale={.2} /></g>
      </g>
    </g>
    {children}
  </g>;
}
