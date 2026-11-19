import { memo, useId } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { MeadowWearPatch } from '../dressing/MeadowWearPatch';
import { Grass } from '../vegetation/MeadowVegetationAssets';
import { MEADOW_ENTRANCE as entry } from '../vegetation/meadowForeground';
import { YardObject, useYardPlacement } from '../../../../features/yard-editor/YardWorld';
import { rotateGroundPoint, YARD_OBJECTS } from '../../../../features/yard-editor/yardLayout';
import { meadowPlantPaletteCss } from '../vegetation/meadowPalette';

/** The two fence sections keep upright posts while their ground footprints turn. */
function FenceSection({ theme, side }: { theme: YorkshireSceneTheme; side: 'west' | 'east' }) {
  const id = 'meadow-entry-' + useId().replace(/:/g, '');
  const objectId = side === 'west' ? 'fence_west' : 'fence_east';
  const placement = useYardPlacement(objectId);
  const oppositeId = side === 'west' ? 'fence_east' : 'fence_west';
  const oppositePlacement = useYardPlacement(oppositeId);
  const pivot = YARD_OBJECTS[objectId];
  const point = (p: { x: number; y: number }) => rotateGroundPoint(p, pivot, placement.angle);
  const posts = (side === 'west' ? entry.westPosts : entry.eastPosts).map(point);
  const hinge = point(side === 'west' ? entry.hinge : entry.latch);
  const oppositeHinge = rotateGroundPoint(side === 'west' ? entry.latch : entry.hinge,
    YARD_OBJECTS[oppositeId], oppositePlacement.angle);
  // Both leaves reach the same closed midpoint, including saved fence offsets.
  // Work in this YardObject's coordinates; its outer group adds our translation.
  const closedEnd = {
    x: (hinge.x + oppositeHinge.x + oppositePlacement.dx - placement.dx) / 2,
    y: (hinge.y + oppositeHinge.y + oppositePlacement.dy - placement.dy) / 2,
  };
  // Calibrate the visible faces in the shared ground plane. Applying a fixed
  // +/- angle to a sloping saved entrance can turn one leaf almost edge-on.
  const closedDirection = Math.atan2((closedEnd.y - hinge.y) / .285, closedEnd.x - hinge.x) * 180 / Math.PI;
  const openDirection = side === 'west' ? -entry.gateOpenAngle : 180 + entry.gateOpenAngle;
  const openEnd = rotateGroundPoint(closedEnd, hinge, openDirection - closedDirection);
  const inward = openEnd.x >= hinge.x ? 1 : -1;
  const wood = theme.isNight ? '#4c4936' : theme.isRainy ? '#6a6045' : '#7a603d';
  const light = theme.isNight ? '#68644b' : theme.isRainy ? '#8b7e59' : '#a3895c';
  const dark = theme.isNight ? '#35392d' : '#504430';
  const { postHeight } = entry;
  const rail = (a: { x: number; y: number }, b: { x: number; y: number }, offset: number, key: string, width = 2.6) =>
    <g key={key}>
      <line x1={a.x} y1={a.y + offset} x2={b.x} y2={b.y + offset} stroke={wood} strokeWidth={width} />
      <line x1={a.x} y1={a.y + offset - .6} x2={b.x} y2={b.y + offset - .6} stroke={light} strokeWidth={.7} opacity=".65" />
    </g>;
  const post = (x: number, y: number, key: string, entrance: boolean) => {
    const halfWidth = entrance ? 4.6 : 3.5;
    const height = entrance ? postHeight + 7 : postHeight;
    return <g key={key} transform={`translate(${x} ${y})`}>
      <ellipse cy="1" rx={entrance ? 7 : 6} ry="2" fill={theme.isNight ? '#16251e' : '#34472a'} opacity=".18" />
      <rect x={-halfWidth} y={-height} width={halfWidth * 2} height={height + 1} rx=".6" fill={wood} stroke={dark} strokeWidth=".7" />
      {entrance ? <>
        <path d={`M${halfWidth - 1.8},${-height + 1} h1.8 V0 h-1.8Z`} fill={dark} opacity=".45" />
        <path d={`M-6.4,${-height - 1} L-4.6,${-height - 4} H4.6 L6.4,${-height - 1} v2 H-6.4Z`}
          fill={wood} stroke={dark} strokeWidth=".65" strokeLinejoin="round" />
        <path d={`M-6.4,${-height - 1} L-4.6,${-height - 4} H4.6 L6.4,${-height - 1}Z`} fill={light} />
      </> : <path d={`M${-halfWidth},${-height} L0,${-height - 3} L${halfWidth},${-height}Z`} fill={light} />}
      <path d={`M${-halfWidth + 1.5},${-height + 2} V-1`} stroke={light} strokeWidth=".9" opacity=".6" />
      <Grass type="short" x={3} y={3} scale={.23} />
    </g>;
  };
  const plant = posts[side === 'west' ? 0 : 3];
  const wear = { x: hinge.x + (openEnd.x - hinge.x) * .4, y: hinge.y + (openEnd.y - hinge.y) * .4 + 3 };
  return <YardObject id={objectId}><g id={id} data-meadow-fence={side}>
    <style>{meadowPlantPaletteCss(theme, '#' + id)}</style>
    <MeadowWearPatch id={id + '-wear'} theme={theme} variant="scuff"
      transform={`translate(${wear.x} ${wear.y}) rotate(16) scale(${side === 'west' ? '.9 .7' : '.56 .6'})`} opacity={side === 'west' ? .22 : .14} />
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <g data-entrance-rail={side} opacity=".82">
        {posts.slice(1).flatMap((p, i) => [-25, -14, -3].map(offset => rail(posts[i], p, offset, `${i}-${offset}`)))}
      </g>
      <g data-meadow-gate={side}>
        <path d={`M${hinge.x},${hinge.y + 2} L${openEnd.x},${openEnd.y + 2}`} stroke={dark} strokeWidth="4" opacity=".14" />
        {[-25, -19, -13, -7, -1].map((offset, i) => rail(hinge, openEnd, offset, 'leaf-' + offset, i === 0 ? 3.3 : 2.2))}
        <line x1={hinge.x + inward * 3} y1={hinge.y - 1} x2={openEnd.x - inward * 2} y2={openEnd.y - 25} stroke={dark} strokeWidth="2.2" />
        <line x1={openEnd.x - inward} y1={openEnd.y - 26} x2={openEnd.x - inward} y2={openEnd.y} stroke={wood} strokeWidth="3" />
      </g>
    </g>
    {posts.map((p, i) => post(p.x, p.y, 'post-' + i, i === (side === 'west' ? posts.length - 1 : 0)))}
    <g data-fence-end-planting="" transform={`translate(${plant.x + (side === 'west' ? -12 : 8)} ${plant.y + 4})`}>
      <Grass type="leaning" scale={.5} flip={side === 'west'} />
      <Grass type="woven" x={side === 'west' ? -26 : 26} y={7} scale={.38} />
    </g>
    <g fill={theme.isNight ? '#353f3a' : '#4c5146'}>
      <rect x={hinge.x - 4} y={hinge.y - 24} width="9" height="2.4" rx=".4" />
      <rect x={hinge.x - 4} y={hinge.y - 8} width="9" height="2.4" rx=".4" />
      <g transform={`translate(${openEnd.x - inward} ${openEnd.y - 20}) scale(${inward} 1)`}>
        {side === 'west'
          ? <rect x="-7" width="9" height="2.4" rx=".4" />
          : <path d="M-5,-1 h5 v5 h-2 v-3 h-3Z" />}
      </g>
    </g>
  </g></YardObject>;
}

export const MeadowEntrance = memo(function MeadowEntrance({ theme }: { theme: YorkshireSceneTheme }) {
  return <g data-meadow-entrance="" pointerEvents="none" aria-hidden="true">
    <FenceSection theme={theme} side="west" />
    <FenceSection theme={theme} side="east" />
  </g>;
});
