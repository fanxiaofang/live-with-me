import { useId } from 'react';
import type { YorkshireSceneTheme } from '../../../src/components/scenery/yorkshire/landscapeTypes';
import type { SceneLayout } from '../../../src/world/scene/sceneTypes';
import { MeadowBaseTracesV5, MeadowSurfaceTracesV5 } from './MeadowSurfaceTracesV5';
import { meadowSurfacePalette } from './meadowSurfacePalette';

// Authored, shallow strokes lie along the turf, not upright from shared roots.
// Each passage is unique. Gaps and density are composed, never tiled/randomized.
const HOUSE_TRACES = [
  'M-169 274q4 -1 7 -3 M-155 277l3 -1 M-145 271q3 0 5 -2 M-129 281l4 -1',
  'M-182 295l4 -2 M-160 299q3 -1 5 -1 M-146 291l3 -2',
  'M-121 326q5 -1 8 -3 M-103 329l4 -1 M-89 321l3 -1',
  'M-202 347q3 0 6 -2 M-189 353l3 -1 M-168 343q4 -1 6 -2 M-157 356l4 -1',
  'M-109 369l4 -1 M-94 361q3 0 5 -2 M-71 374l3 -1',
  'M-42 335l3 -1 M-23 342q3 0 5 -1',
  'M22 382q5 0 8 -2 M44 374l4 -1 M56 383l3 -1 M73 368q3 0 5 -2',
  'M78 320q4 0 7 -2 M94 327l3 -1 M116 321q3 -1 5 -2 M143 333l3 -1',
  'M102 352l4 -1 M124 344q4 0 6 -2 M152 354l4 -2',
  'M181 289q5 -1 8 -3 M197 297l4 -1 M211 285l3 -1 M233 294q4 0 6 -2',
  'M239 266q4 0 7 -2 M254 274l3 -1 M272 263q4 -1 6 -3 M288 279l4 -1',
  'M300 255l4 -2 M315 271q4 0 7 -2 M333 266l3 -1 M349 281l4 -1',
  'M203 329q4 -1 6 -2 M219 320l3 -1 M245 325q3 -1 5 -2',
];
const CABIN_TRACES = [
  'M59 120q4 0 6 -2 M70 133l3 -1 M92 134q3 0 5 -2 M114 142l4 -1',
  'M21 167q3 0 6 -2 M38 159l3 -1 M51 173l4 -1 M73 164q4 0 6 -2',
  'M-73 174q4 -1 7 -2 M-54 182l3 -1 M-39 170l4 -1',
];
const PALE_TRACES = [
  'M-175 282l5 -1 M-140 287q4 0 6 -1 M-115 316l3 -1 M-94 334l5 -1',
  'M-186 357l5 -1 M-159 361l3 -1 M-99 377q4 0 7 -1',
  'M17 365l4 -1 M47 388l5 -1 M83 336l4 -1 M118 334l6 -1 M139 356l4 -1',
  'M193 302l4 -1 M221 280l5 -1 M258 281l3 -1 M284 269l4 -1 M324 279l5 -1',
];

/** Round 4: only surface colour and sparse turf traces. Round 3 plants are reused verbatim. */
export function MeadowSurfaceTrial({ sceneLayout, theme, revision = 4 }: { sceneLayout: SceneLayout; theme: YorkshireSceneTheme; revision?: 4 | 5 | 6 | 7 | 8 }) {
  const id = useId().replace(/:/g, '');
  const house = sceneLayout.main_cottage, cabin = sceneLayout.wooden_cabin;
  const light = theme.isNight ? 'night' : theme.isRainy ? 'rain' : 'day';
  const colors = meadowSurfacePalette(theme);
  const fourthTraces = <g id={revision >= 5 ? 'meadow-surface-traces-v4' : 'meadow-surface-traces'}
    style={revision >= 5 ? { display: 'none' } : undefined} fill="none" strokeLinecap="round" opacity={colors.strength}>
    {/* The fourth-round authoring stays intact for same-camera comparison. */}
    <g data-surface-anchor="main_cottage" transform={`translate(${house.position.x} ${house.position.y}) scale(${house.scale})`}>
      <g stroke={colors.trace} strokeWidth="1.15" opacity=".2">
        {HOUSE_TRACES.map((d, i) => <path key={d} d={d} opacity={[.8, .55, 1, .65][i % 4]} />)}
      </g>
      <g stroke={colors.pale} strokeWidth="1.35" opacity=".23">
        {PALE_TRACES.map(d => <path key={d} d={d} />)}
      </g>
    </g>
    <g data-surface-anchor="wooden_cabin" transform={`translate(${cabin.position.x} ${cabin.position.y}) scale(${cabin.scale})`}
      stroke={colors.trace} strokeWidth="1.1" opacity=".16">
      {CABIN_TRACES.map(d => <path key={d} d={d} />)}
    </g>
  </g>;
  return <g id="meadow-surface-trial" data-revision={revision} data-light={light} pointerEvents="none" aria-hidden="true">
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
    <g id="meadow-surface-color" opacity={revision === 8 ? .8 : undefined}>
      {['warm', 'cool', 'deep'].map(key => <rect key={key} x="-160" y="180" width="1320" height="500" fill={`url(#${id}-${key})`} />)}
    </g>
    {revision < 7 && fourthTraces}
    {revision === 5 && <MeadowSurfaceTracesV5 sceneLayout={sceneLayout} colors={colors} />}
    {revision === 6 && <>
      <g id="meadow-surface-baseline-v5" style={{ display: 'none' }}><MeadowSurfaceTracesV5 sceneLayout={sceneLayout} colors={colors} /></g>
      <g id="meadow-surface-base-v6" fill="none" strokeLinecap="round" opacity={colors.strength}>
        <MeadowBaseTracesV5 sceneLayout={sceneLayout} colors={colors} id="meadow-surface-veil-v6" />
      </g>
    </>}
  </g>;
}
