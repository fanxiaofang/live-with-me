import type { SceneLayout } from '../../../src/world/scene/sceneTypes';
import type { YorkshireSceneTheme } from '../../../src/components/scenery/yorkshire/landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../../../src/components/scenery/yorkshire/landscapeLayout';
import { Grass, Plant } from './GrassStudiesV2';

// Two deliberately small patches. This component is only mounted by the world fixture.
// Reuse the reviewed leaf geometry; placement/scale and environment color are the variables.
export function MeadowVegetationTrial({ sceneLayout, theme }: { sceneLayout: SceneLayout; theme: YorkshireSceneTheme }) {
  const house = sceneLayout.main_cottage;
  const tree = YORKSHIRE_LAYOUT.guardianTree;
  const light = theme.isNight ? 'night' : theme.isRainy ? 'rain' : 'day';
  const source = ['#526f3f', '#648449', '#829954', '#9eaf65', '#9aab70', '#dedcc6', '#c2a34f', '#c7ad51', '#9b8b3e', '#95677c', '#b08b9c', '#c4a6ad'];
  const target = light === 'night'
    ? ['#354d36', '#496140', '#65794c', '#7a8a58', '#70815c', '#9dada0', '#8e8950', '#9b9255', '#717341', '#6d596b', '#887382', '#9b8c95']
    : light === 'rain'
      ? ['#486342', '#597a49', '#758e57', '#8b9f66', '#86986d', '#c3cabb', '#aa9b56', '#b4a359', '#898445', '#896d7d', '#a18a99', '#b4a2a9']
      : source;
  return <g id="meadow-vegetation-trial" data-light={light} pointerEvents="none" aria-hidden="true">
    <style>{source.map((color, i) => `#meadow-vegetation-trial [fill="${color}"]{fill:${target[i]}}`).join('\n')}</style>
    <g data-vegetation-anchor="main_cottage"
      transform={`translate(${house.position.x} ${house.position.y}) scale(${house.scale})`}>
      {/* Right of the porch apron; entrance and open center are deliberately empty. */}
      <g data-planting-zone="cottage-side" transform="translate(225 270)">
        <Grass type="leaning" x={15} y={-8} scale={.33} />
        <g transform="translate(28 -7) scale(.55)"><Plant species="buttercup" /></g>
        <Grass type="short" x={-25} y={3} scale={.5} />
        <g transform="translate(-20 7) scale(.62)"><Plant species="daisy" /></g>
        <Grass type="woven" x={28} y={8} scale={.42} />
      </g>
    </g>
    <g data-vegetation-anchor="guardian-tree"
      transform={`translate(${tree.position.x} ${tree.position.y}) scale(${tree.scale})`}>
      {/* One loose patch west of the roots, not a planted ring around the trunk. */}
      <g data-planting-zone="tree-outside" transform={`translate(0 ${tree.root.y})`}>
        <Grass type="meadow" x={-88} y={5} scale={.48} />
        <g transform="translate(-94 8) scale(.75)"><Plant species="clover" /></g>
        <Grass type="woven" x={-68} y={12} scale={.65} />
        <g transform="translate(-64 16) scale(.58)"><Plant species="daisy" /></g>
        <Grass type="short" x={-102} y={19} scale={.5} />
      </g>
    </g>
  </g>;
}
