import type { SceneLayout } from '../../../src/world/scene/sceneTypes';
import type { YorkshireSceneTheme } from '../../../src/components/scenery/yorkshire/landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../../../src/components/scenery/yorkshire/landscapeLayout';
import { Grass } from './GrassStudiesV2';

// Round 2: eight very small short-grass groups and three taller grass groups.
// All positions belong to the nearby house/cabin/tree ground planes, never the camera.
// Keep stairs/mailbox/pod approach clear; foliage is deliberately not a perimeter ring.
export function MeadowGrassOnlyTrial({ sceneLayout, theme }: { sceneLayout: SceneLayout; theme: YorkshireSceneTheme }) {
  const house = sceneLayout.main_cottage;
  const cabin = sceneLayout.wooden_cabin;
  const tree = YORKSHIRE_LAYOUT.guardianTree;
  const light = theme.isNight ? 'night' : theme.isRainy ? 'rain' : 'day';
  const source = ['#526f3f', '#648449', '#829954', '#9eaf65'];
  const target = light === 'night' ? ['#354d36', '#496140', '#65794c', '#7a8a58']
    : light === 'rain' ? ['#486342', '#597a49', '#758e57', '#8b9f66'] : source;
  return <g id="meadow-vegetation-trial" data-revision="2" data-active="true" data-light={light}
    pointerEvents="none" aria-hidden="true">
    <style>{`
      /* Only while the grass-only trial is active. Switching it off restores the
         original decorations, including in an already-panned live comparison. */
      #panoramic-world-stage:has(#meadow-vegetation-trial[data-revision="2"][data-active="true"]) :is(
        #lawn-natural-grass-tufts, #clover-turf-patches, #meadow-field-blossoms,
        #pasture-wildflowers, #pasture-chamomile-dots, #guardian-tree-root-flora) { display:none; }
      ${source.map((color, i) => `#meadow-vegetation-trial [fill="${color}"]{fill:${target[i]}}`).join('\n')}
    `}</style>
    <g data-vegetation-anchor="wooden_cabin"
      transform={`translate(${cabin.position.x} ${cabin.position.y}) scale(${cabin.scale})`}>
      <g data-planting-zone="cabin-short" data-grass-type="short">
        <Grass type="short" x={-35} y={135} scale={.38} />
        <Grass type="woven" x={80} y={120} scale={.32} flip />
      </g>
    </g>
    <g data-vegetation-anchor="main_cottage"
      transform={`translate(${house.position.x} ${house.position.y}) scale(${house.scale})`}>
      {/* A few isolated low roots across the apron, not a line parallel to its edge. */}
      <g data-planting-zone="front-short" data-grass-type="short">
        <Grass type="woven" x={-135} y={310} scale={.36} />
        <Grass type="short" x={-92} y={324} scale={.3} flip />
        <Grass type="short" x={90} y={305} scale={.34} />
        <Grass type="woven" x={153} y={326} scale={.32} />
      </g>
      <g data-planting-zone="right-outer" data-grass-type="wild">
        <Grass type="meadow" x={275} y={245} scale={.3} />
        <Grass type="leaning" x={345} y={300} scale={.32} flip />
      </g>
    </g>
    <g data-vegetation-anchor="guardian-tree"
      transform={`translate(${tree.position.x} ${tree.position.y}) scale(${tree.scale})`}>
      <g data-planting-zone="tree-outside" transform={`translate(0 ${tree.root.y})`}>
        <g data-grass-type="short">
          <Grass type="short" x={-92} y={20} scale={.38} flip />
          <Grass type="woven" x={74} y={17} scale={.28} />
        </g>
        <g data-grass-type="wild"><Grass type="leaning" x={-127} y={11} scale={.28} /></g>
      </g>
    </g>
  </g>;
}
