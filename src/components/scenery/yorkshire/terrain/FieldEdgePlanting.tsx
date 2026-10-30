import { frontEdgeY } from '../../../../world/scene/fieldEdges';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { LandscapeTreeShape, type LandscapeTreeSpecies } from '../vegetation/LandscapeTreeShape';

const TREES: { x: number; inset: number; scale: number; species: LandscapeTreeSpecies }[] = [
  { x: -42, inset: 14, scale: 1.8, species: 'birch' },
  { x: -8, inset: 20, scale: 2, species: 'broadleaf' },
  { x: 1230, inset: 13, scale: 2.05, species: 'pine' },
  { x: 1264, inset: 18, scale: 1.45, species: 'broadleaf' },
];
const COLORS = {
  birch: { leaf: '#76954e', shade: '#58753e', light: '#a6b66d' },
  broadleaf: { leaf: '#7d9148', shade: '#5b743d', light: '#a8ad60' },
  pine: { leaf: '#5c804a', shade: '#40623d', light: '#879b58' },
};

/** Roots, shadows and the sparse margin stay on the foreground ground. Only
 * crowns occlude the independently moving wheat; no endpoints connect layers. */
export function FieldEdgePlanting({ theme }: { theme: YorkshireSceneTheme }) {
  return <g id="meadow-field-edge-planting" pointerEvents="none" aria-hidden="true"
    style={theme.landscapeEnvironment ? { filter: 'url(#field-environment-tone)' } : undefined}>
    {TREES.map(tree => <g key={tree.x} data-meadow-edge-tree={tree.species}
      transform={`translate(${tree.x},${frontEdgeY(tree.x) + tree.inset}) scale(${tree.scale})`}>
      <ellipse cx="3" cy="1" rx="10" ry="2.2" fill="#4f6835" opacity=".16" />
      <LandscapeTreeShape species={tree.species} {...COLORS[tree.species]} trunk="#6a573c" birchTrunk="#e1dfc5" />
    </g>)}
    {[{ x: -83, width: 48 }, { x: 27, width: 32 }, { x: 1197, width: 35 }, { x: 1294, width: 44 }].map((patch, index) =>
      <g key={patch.x} data-edge-material="uncut-margin">
        {Array.from({ length: 8 }, (_, i) => {
          const x = patch.x + i * patch.width / 8;
          const y = frontEdgeY(x) + 2 + (i * 3 % 7);
          return <path key={i}
            d={`M${x},${y} q-2,-3 -3,-5 m3,5 q1,-5 3,-7 m-1,6 l4,-2`}
            fill="none" stroke={i % 3 === index % 3 ? '#b5b975' : '#85994b'}
            strokeWidth={i % 2 ? 1 : 1.3} strokeLinecap="round" opacity=".8" />;
        })}
      </g>)}
  </g>;
}
