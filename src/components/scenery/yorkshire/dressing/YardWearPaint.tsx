import { memo, useId, type ReactNode } from 'react';
import { useYardWearStrokes, useYardNightPathTone } from '../../../../features/yard-editor/YardWorld';
import type { WearStroke } from '../../../../features/yard-editor/yardWear';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { MeadowWearPatch } from './MeadowWearPatch';
import { WearMaterialSurface } from './WearBrushSurface';
import { isWearDab, wearPalette } from '../../../../features/yard-editor/wearMaterial';

/** Shares the cottage entrance's exposed soil and remaining grass, below yard objects. */
export function YardWearPaint({ theme }: { theme: YorkshireSceneTheme }) {
  const strokes = useYardWearStrokes();
  const nightPathTone = useYardNightPathTone();
  const trailColor = wearPalette(theme).soil;
  let layers: ReactNode[] = [];
  // A cut masks only earlier paint. Later paint remains free to cover the same
  // ground, and the mask never touches the scene's built-in paths or entrance wear.
  strokes.forEach((stroke, i) => {
    if (stroke.strength === 'erase' && layers.length) layers = [<ErasedWear key={`erase-${i}`} stroke={stroke}>{layers}</ErasedWear>];
    else if (stroke.strength !== 'erase' && isWearDab(stroke)) layers.push(<PaintedStroke key={`paint-${i}`} stroke={stroke} roadColor={stroke.strength === 'trail' ? trailColor : theme.roadColor}
      hillGreenFar={theme.isNight && stroke.strength === 'trail' ? '#5f6e50' : theme.hillGreenFar} />);
  });
  return <g id="yard-painted-wear" pointerEvents="none" aria-hidden="true">
    <WearMaterialSurface strokes={strokes} theme={theme} nightPathTone={nightPathTone} />
    {layers}
  </g>;
}

// Work on the uncompressed ground plane so both brush and eraser follow the
// same elliptical footprint at every direction and mouse speed.
const groundPath = (stroke: WearStroke) => stroke.points.map((p, i) => `${i ? 'L' : 'M'}${p.x},${p.y / .285}`).join(' ');

function ErasedWear({ stroke, children }: { stroke: WearStroke; children: ReactNode }) {
  const id = 'wear-cut-' + useId().replace(/:/g, '');
  const first = stroke.points[0];
  return <g data-wear-erase="">
    <defs><mask id={id} maskUnits="userSpaceOnUse" x="-900" y="0" width="3000" height="1100" style={{maskType:'luminance'}}>
      <rect x="-900" y="0" width="3000" height="1100" fill="white" />
      <g transform="scale(1 .285)" fill="black" stroke="black" strokeWidth={stroke.size} strokeLinecap="round" strokeLinejoin="round">
        {stroke.points.length === 1 ? <circle cx={first.x} cy={first.y / .285} r={stroke.size / 2} stroke="none" /> : <path d={groundPath(stroke)} fill="none" />}
      </g>
    </mask></defs>
    <g mask={`url(#${id})`}>{children}</g>
  </g>;
}

const PaintedStroke = memo(function PaintedStroke({ stroke, roadColor, hillGreenFar }: {
  stroke: WearStroke; roadColor: string; hillGreenFar: string;
}) {
  const prefix = useId().replace(/:/g, '');
  const heavy = stroke.strength === 'heavy' || stroke.strength === 'trail';
  const opacity = stroke.strength === 'trail' ? .85 : heavy ? 1 : stroke.strength === 'medium' ? .62 : .28;
  const scaleX = stroke.size / 80, scaleY = stroke.size * .285 / (heavy ? 50 : 24);
  const stampId = `yard-wear-${prefix}`;
  return <g data-wear-strength={stroke.strength}>
    <defs><MeadowWearPatch id={stampId}
      theme={{ roadColor, hillGreenFar }} variant={heavy ? 'entry' : 'scuff'} opacity={opacity}
      transform={`scale(${scaleX} ${scaleY}) translate(${heavy ? '3 -22' : '0 0'})`} /></defs>
    <use href={`#${stampId}`} x={stroke.points[0].x} y={stroke.points[0].y} />
  </g>;
});
