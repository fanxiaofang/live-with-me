import { memo } from 'react';
import type { YorkshireSceneTheme } from '../../../components/scenery/yorkshire/landscapeTypes';
import { FOOTHILL_WOODLAND, foothillSurfaceY } from '../../scene/foothillGeometry';
import { LandscapeTreeShape } from '../../../components/scenery/yorkshire/vegetation/LandscapeTreeShape';
import { requestedMeadowFoothill } from '../../scene/currentScene';
import { MEADOW_HILL_TREES } from '../../scene/meadowFoothill';
import { SUMMER_MEADOW_VEGETATION } from '../../scene/meadowVegetation';
import { meadowFoothillMaterial } from './meadowFoothillMaterial';

export const F2FoothillWoodland = memo(function F2FoothillWoodland({ theme }: { theme: YorkshireSceneTheme }) {
  const colors = theme.landscapeEnvironment;
  const leaf = colors?.woodland || theme.hillGreenFar;
  const shade = colors?.woodlandShade || theme.hillGreenNear;
  const light = colors?.woodlandLight || theme.hillGreenMid;
  const meadow=requestedMeadowFoothill();
  const vegetationMaterial=meadow ? meadowFoothillMaterial(theme.timeOfDay || 'day') : undefined;
  const trees=meadow ? [...MEADOW_HILL_TREES,...FOOTHILL_WOODLAND.filter(t=>t.group==='east')] : FOOTHILL_WOODLAND;
  return <g data-foothill-trees="mixed" pointerEvents="none" aria-hidden="true">
    {[...trees].sort((a,b) => foothillSurfaceY(a.x,a.depth) - foothillSurfaceY(b.x,b.depth)).map(tree => {
      const y = foothillSurfaceY(tree.x, tree.depth);
      const onHill = meadow && tree.group !== 'east';
      const palette=onHill && vegetationMaterial ? SUMMER_MEADOW_VEGETATION.trees[tree.species] : undefined;
      const litSide=vegetationMaterial && vegetationMaterial.sun[0]<0 ? -.65 : .65;
      const shape = <LandscapeTreeShape species={tree.species}
        leaf={palette ? vegetationMaterial!.landmarkColor(palette.leaf,[0,1,0]) : leaf}
        shade={palette ? vegetationMaterial!.landmarkColor(palette.shade,[-litSide,.5,.57]) : shade}
        light={palette ? vegetationMaterial!.landmarkColor(palette.light,[litSide,.5,.57]) : light}
        trunk={palette ? vegetationMaterial!.landmarkColor(palette.trunk,[0,1,0]) : undefined}
        birchTrunk={palette ? vegetationMaterial!.landmarkColor(palette.trunk,[0,1,0]) : colors?.birchTrunk || '#c1c4a8'} />;
      return <g key={tree.id} data-transition-tree="" data-tree-group={tree.group} data-tree-species={tree.species}
        data-vegetation-palette={palette ? tree.species : undefined}
        data-surface-root={tree.x + ',' + y} data-surface-depth={tree.depth}
        transform={`translate(${tree.x},${y}) scale(${tree.scale})`}>
        {meadow && onHill && theme.timeOfDay==='dusk' ? <g transform="scale(-1,1)">{shape}</g> : shape}
      </g>;
    })}
  </g>;
});
