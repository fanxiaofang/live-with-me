import { memo, useId } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { MeadowEntrance } from '../boundaries/MeadowEntrance';
import { Grass, Plant } from './MeadowVegetationAssets';
import { meadowPlantPaletteCss, meadowSeedPalette } from './meadowPalette';
import { MEADOW_ENTRANCE, MEADOW_FOREGROUND_CLUSTERS } from './meadowForeground';
import { MEADOW_STUDY } from './meadowStudy';

export const MeadowForegroundRegions = memo(function MeadowForegroundRegions({ theme, entrance = false }: {
  theme: YorkshireSceneTheme; entrance?: boolean;
}) {
  const id = 'meadow-regions-' + useId().replace(/:/g, '');
  const clusters = entrance ? MEADOW_FOREGROUND_CLUSTERS.map(c => c.id === 'left-middle'
    ? { ...c, x: c.x + MEADOW_ENTRANCE.leftMiddlePlantOffset.x, y: c.y + MEADOW_ENTRANCE.leftMiddlePlantOffset.y }
    : c) : MEADOW_FOREGROUND_CLUSTERS;
  const { plume, stem } = meadowSeedPalette(theme);
  return <g id={id} data-meadow-regions="" pointerEvents="none" aria-hidden="true">
    <style>{meadowPlantPaletteCss(theme, '#' + id)}</style>
    {entrance && <MeadowEntrance theme={theme} />}
    {clusters.map(c => <g key={c.id} data-meadow-region={c.side} data-region-clump={c.id}
      data-world-root={c.x + ',' + c.y} transform={'translate(' + c.x + ' ' + c.y + ') scale(' + c.scale + ')'}>
      <Grass type={c.kind === 'low' ? 'leaning' : 'meadow'} x={-18} y={0} scale={c.kind === 'low' ? .66 : .74} flip={c.side === 'left'} />
      <Grass type="woven" x={29} y={5} scale={.68} flip={c.side === 'right'} />
      <Grass type="short" x={-53} y={7} scale={.48} />
      {c.kind === 'plume' && MEADOW_STUDY.panicles.slice(0, c.id === 'left-outer' ? 3 : 2).map(({ x, height, lean }, i) =>
        <g key={x} transform={'translate(' + x + ' 0)'}>
          <path d={'M0,3 Q' + (lean * .25) + ',' + (-height * .5) + ' ' + lean + ',' + (-height)}
            fill="none" stroke={stem} strokeWidth=".85" />
          <g transform={'translate(' + lean + ',' + (-height) + ') rotate(' + (lean * 1.2) + ')'}>
            <path d="M0,4 C-4,0 -3,-8 0,-12 C3,-8 4,-1 0,4Z" fill={plume} fillOpacity={.7 + i * .04} />
            <path d="M-1,1 l-3,-3 M0,-3 l-3,-3 M1,0 l3,-3 M1,-5 l2,-3"
              stroke={plume} strokeOpacity=".65" strokeWidth=".6" fill="none" />
          </g>
        </g>)}
      {c.kind === 'mixed' && <g transform="translate(6 -7) scale(.5)"><Plant species="daisy" /></g>}
      {c.id === 'left-middle' && <g transform="translate(47 0) scale(.38)"><Plant species="buttercup" /></g>}
    </g>)}
  </g>;
});
