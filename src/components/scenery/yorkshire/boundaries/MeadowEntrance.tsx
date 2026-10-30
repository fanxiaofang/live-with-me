import { memo, useId } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { MeadowWearPatch } from '../dressing/MeadowWearPatch';
import { Grass } from '../vegetation/MeadowVegetationAssets';
import { MEADOW_ENTRANCE as entry } from '../vegetation/meadowForeground';

/** Decorative half-open entrance, rooted in the world. The existing sheep gate
 * keeps its own identity, interactions and geometry. This entry has no hit target. */
export const MeadowEntrance = memo(function MeadowEntrance({ theme }: { theme: YorkshireSceneTheme }) {
  const id = 'meadow-entry-' + useId().replace(/:/g, '');
  const wood = theme.isNight ? '#4c4936' : theme.isRainy ? '#6a6045' : '#7a603d';
  const light = theme.isNight ? '#68644b' : theme.isRainy ? '#8b7e59' : '#a3895c';
  const dark = theme.isNight ? '#35392d' : '#504430';
  const { hinge, openEnd, latch, postHeight } = entry;
  const rail = (a: { x: number; y: number }, b: { x: number; y: number }, offset: number, key: string, width = 2.6) =>
    <g key={key}>
      <line x1={a.x} y1={a.y + offset} x2={b.x} y2={b.y + offset} stroke={wood} strokeWidth={width} />
      <line x1={a.x} y1={a.y + offset - .6} x2={b.x} y2={b.y + offset - .6}
        stroke={light} strokeWidth={.7} opacity=".65" />
    </g>;
  const post = (x: number, y: number, key: string) => <g key={key} transform={'translate(' + x + ' ' + y + ')'}>
    <ellipse cy="1" rx="6" ry="2" fill={theme.isNight ? '#16251e' : '#34472a'} opacity=".18" />
    <rect x="-3.5" y={-postHeight} width="7" height={postHeight + 1} rx=".6" fill={wood} stroke={dark} strokeWidth=".7" />
    <path d={'M-3.5,' + (-postHeight) + ' L0,' + (-postHeight - 3) + ' L3.5,' + (-postHeight) + 'Z'} fill={light} />
    <path d={'M-2,' + (-postHeight + 2) + ' V-1'} stroke={light} strokeWidth=".9" opacity=".6" />
    <Grass type="short" x={3} y={3} scale={.23} />
  </g>;
  return <g data-meadow-entrance="" pointerEvents="none" aria-hidden="true">
    <MeadowWearPatch id={id + '-wear'} theme={theme} variant="scuff"
      transform="translate(53 697) rotate(16) scale(.9 .7)" opacity={.22} />
    <MeadowWearPatch id={id + '-wear-end'} theme={theme} variant="scuff"
      transform="translate(99 715) rotate(16) scale(.56 .6)" opacity={.14} />
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      {[entry.westPosts, entry.eastPosts].map((posts, side) => <g key={side} data-entrance-rail={side === 0 ? 'west' : 'east'} opacity=".82">
        {posts.slice(1).flatMap((p, i) => [-25, -14, -3].map(offset => rail(posts[i], p, offset, `${side}-${i}-${offset}`)))}
      </g>)}
      <path d={'M' + hinge.x + ',' + (hinge.y + 2) + ' L' + openEnd.x + ',' + (openEnd.y + 2)}
        stroke={dark} strokeWidth="4" opacity=".14" />
      {[-25, -19, -13, -7, -1].map((offset, i) => rail(hinge, openEnd, offset, 'leaf-' + offset, i === 0 ? 3.3 : 2.2))}
      <line x1={hinge.x + 3} y1={hinge.y - 1} x2={openEnd.x - 2} y2={openEnd.y - 25} stroke={dark} strokeWidth="2.2" />
      <line x1={openEnd.x - 1} y1={openEnd.y - 26} x2={openEnd.x - 1} y2={openEnd.y} stroke={wood} strokeWidth="3" />
    </g>
    {[...entry.westPosts, ...entry.eastPosts].map(p => post(p.x, p.y, 'post-' + p.x))}
    {[entry.westPosts[0], entry.eastPosts[3]].map((p, i) => <g key={i} data-fence-end-planting="" transform={`translate(${p.x + (i ? 8 : -12)} ${p.y + 4})`}>
      <Grass type="leaning" scale={.5} flip={i === 0} />
      <Grass type="woven" x={i ? 26 : -26} y={7} scale={.38} />
    </g>)}
    <g fill={theme.isNight ? '#353f3a' : '#4c5146'}>
      <rect x={hinge.x - 4} y={hinge.y - 24} width="9" height="2.4" rx=".4" />
      <rect x={hinge.x - 4} y={hinge.y - 8} width="9" height="2.4" rx=".4" />
      <path d={'M' + (latch.x - 4) + ',' + (latch.y - 22) + ' h5 v4 h-2 v-2 h-3Z'} />
    </g>
  </g>;
});
