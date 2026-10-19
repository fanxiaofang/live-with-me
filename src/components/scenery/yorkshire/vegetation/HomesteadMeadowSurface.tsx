import { useId } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { meadowSurfacePalette } from './meadowPalette';

/** Accepted flat turf surface: three broad colour washes, with no grass brushes. */
export function HomesteadMeadowSurface({ theme }: { theme: YorkshireSceneTheme }) {
  const id = useId().replace(/:/g, '');
  const light = theme.isNight ? 'night' : theme.isRainy ? 'rain' : 'day';
  const colors = meadowSurfacePalette(theme);
  return <g id="homestead-meadow-surface" data-composition="accepted-v9" data-light={light} pointerEvents="none" aria-hidden="true">
    {/* The parent supplies the existing feather mask. No new filters or contours. */}
    <defs>
      {[
        { key: 'warm', color: colors.warm, cx: 390, cy: 472, rx: 560, ry: 300, opacity: .19 },
        { key: 'cool', color: colors.cool, cx: 73, cy: 510, rx: 440, ry: 320, opacity: .16 },
        { key: 'deep', color: colors.deep, cx: 1000, cy: 370, rx: 570, ry: 380, opacity: .13 },
      ].map(wash => <radialGradient key={wash.key} id={`${id}-${wash.key}`} gradientUnits="userSpaceOnUse"
        cx="0" cy="0" r="1" gradientTransform={`translate(${wash.cx} ${wash.cy}) scale(${wash.rx} ${wash.ry})`}>
        <stop stopColor={wash.color} stopOpacity={wash.opacity * colors.strength} />
        <stop offset=".38" stopColor={wash.color} stopOpacity={wash.opacity * .65 * colors.strength} />
        <stop offset=".72" stopColor={wash.color} stopOpacity={wash.opacity * .2 * colors.strength} />
        <stop offset="1" stopColor={wash.color} stopOpacity="0" />
      </radialGradient>)}
    </defs>
    {/* Broad overlapping fields cover the fixed terrace, independent of building movement. */}
    <g id="meadow-surface-color" opacity={.8}>
      {['warm', 'cool', 'deep'].map(key => <rect key={key} x="-160" y="180" width="1320" height="500" fill={`url(#${id}-${key})`} />)}
    </g>
  </g>;
}
