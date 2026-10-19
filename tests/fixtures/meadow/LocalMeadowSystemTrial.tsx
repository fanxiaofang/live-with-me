import type { YorkshireSceneTheme } from '../../../src/components/scenery/yorkshire/landscapeTypes';
import { Grass, Plant } from './GrassStudiesV2';

function paletteCss(theme: YorkshireSceneTheme, selector: string) {
  const source = ['#526f3f', '#648449', '#829954', '#9eaf65', '#9aab70', '#dedcc6', '#c2a34f', '#c7ad51', '#9b8b3e', '#95677c', '#b08b9c', '#c4a6ad'];
  const target = theme.isNight
    ? ['#354d36', '#496140', '#65794c', '#7a8a58', '#70815c', '#9dada0', '#8e8950', '#9b9255', '#717341', '#6d596b', '#887382', '#9b8c95']
    : theme.isRainy
      ? ['#486342', '#597a49', '#758e57', '#8b9f66', '#86986d', '#c3cabb', '#aa9b56', '#b4a359', '#898445', '#896d7d', '#a18a99', '#b4a2a9']
      : source;
  return source.map((color, i) => `${selector} [fill="${color}"]{fill:${target[i]}}`).join('\n');
}

/** Drawn in the existing hive ground plane, before the hive and its bees. */
export function BeehiveMeadowTrial({ theme }: { theme: YorkshireSceneTheme }) {
  return <g id="beehive-planting-v9" data-active="true" pointerEvents="none" aria-hidden="true">
    <style>{`
      #panoramic-world-stage:has(#beehive-planting-v9[data-active="true"]) :is(
        #beehive-meadow-grass,#beehive-meadow-wildflowers,#beehive-lavender-flowers){display:none}
      ${paletteCss(theme, '#beehive-planting-v9')}
    `}</style>
    {/* Low broad-leaf plants form the colony, with a little grass between roots.
        Never use tall grass as a stand for generic flower heads. */}
    <g data-mixed-colony="left" transform="translate(-10 24)">
      <Grass type="woven" x={-12} y={3} scale={.22} />
      <g transform="translate(-3 0) scale(.6)"><Plant species="clover" /></g>
      <g transform="translate(10 6) scale(.52)"><Plant species="daisy" /></g>
    </g>
    <g data-mixed-colony="rear-right" transform="translate(62 -9)">
      <g transform="translate(3 0) scale(.5)"><Plant species="buttercup" /></g>
      <Grass type="short" x={1} y={7} scale={.2} />
      <g transform="translate(16 6) scale(.44)"><Plant species="clover" /></g>
    </g>
    {/* Two short-grass sites. The right-front flight/access gap stays clear. */}
    <g data-hive-short-site="left" opacity=".8">
      <Grass type="short" x={-29} y={33} scale={.22} flip />
      <g opacity=".6"><Grass type="woven" x={-16} y={40} scale={.14} /></g>
    </g>
    <g data-hive-short-site="right" opacity=".65">
      <Grass type="woven" x={84} y={29} scale={.2} />
    </g>
  </g>;
}

/** First replacement batch: four gravel-verge tufts only. Shrubs, hydrangea,
 * foundation groundcover and step flowers retain their existing structures. */
export function CottageVergeMeadowTrial({ theme }: { theme: YorkshireSceneTheme }) {
  return <g id="cottage-verge-v9" data-active="true" pointerEvents="none" aria-hidden="true">
    <style>{`
      #panoramic-world-stage:has(#cottage-verge-v9[data-active="true"]) #gravel-verge-grass{display:none}
      ${paletteCss(theme, '#cottage-verge-v9')}
    `}</style>
    <g opacity=".65"><Grass type="short" x={-208} y={183} scale={.14} flip /></g>
    <g opacity=".7"><Grass type="woven" x={-79} y={223} scale={.16} /></g>
    <g opacity=".6"><Grass type="short" x={119} y={211} scale={.15} /></g>
    <g opacity=".55"><Grass type="woven" x={208} y={183} scale={.13} flip /></g>
  </g>;
}
