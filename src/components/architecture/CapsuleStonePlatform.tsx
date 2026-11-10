import { useId } from 'react';
import type { YorkshireSceneTheme } from '../scenery/yorkshire/landscapeTypes';
import { Grass } from '../scenery/yorkshire/vegetation/MeadowVegetationAssets';
import { meadowPlantPaletteCss } from '../scenery/yorkshire/vegetation/meadowPalette';

type PlatformTheme = Partial<Pick<YorkshireSceneTheme, 'isNight' | 'isRainy' | 'timeOfDay'>> & { design?: 'original' | 'rustic' | 'retro' };

function stonePalette(theme: PlatformTheme) {
  if (theme.isNight && theme.design === 'rustic') return { base: '#65604b', left: '#77705a', light: '#908067', right: '#625c49', front: '#423d32', joint: '#39362b', edge: '#a48a62', grain: '#5f523d', soil: '#252d20', moss: '#51553a' };
  if (theme.isNight && theme.design === 'retro') return { base: '#566b65', left: '#637a70', light: '#82958a', right: '#50665e', front: '#394e48', joint: '#35443e', edge: '#a5b8a4', grain: '#64756a', soil: '#27372d', moss: '#576845' };
  if (theme.isNight) return { base: '#777b68', left: '#7d806b', light: '#8c8c75', right: '#686f5f', front: '#545e4e',
    joint: '#4b5748', edge: '#a0a18a', grain: '#626957', soil: '#253c28', moss: '#4a6040' };
  if (theme.timeOfDay === 'dusk' && theme.design === 'rustic') return { base: '#9a8059', left: '#a58b63', light: '#c0a16b', right: '#89744f', front: '#66513a', joint: '#594833', edge: '#d2b17a', grain: '#806749', soil: '#493d2c', moss: '#687043' };
  if (theme.timeOfDay === 'dusk' && theme.design === 'retro') return { base: '#a6b59c', left: '#b7c3a7', light: '#d6d6b7', right: '#91a395', front: '#667e70', joint: '#52695e', edge: '#e4ddbd', grain: '#84947d', soil: '#434a32', moss: '#687441' };
  if (theme.timeOfDay === 'dusk') return { base: '#a09271', left: '#a99a76', light: '#b7a581', right: '#928568', front: '#796d51',
    joint: '#72664b', edge: '#ceba90', grain: '#8b7b5b', soil: '#495232', moss: '#67733f' };
  if (theme.design === 'rustic') return { base: '#877552', left: '#9a865f', light: '#b39a69', right: '#786a4d', front: '#594a35', joint: '#51442f', edge: '#c5a571', grain: '#746346', soil: '#3c422d', moss: '#667344' };
  if (theme.design === 'retro') return { base: '#c0c7ad', left: '#d0d4b5', light: '#e6dfc1', right: '#aab8a7', front: '#748a79', joint: '#627566', edge: '#f1e6c7', grain: '#95a18b', soil: '#4b5234', moss: '#70804b' };
  return { base: '#ad9f81', left: '#b3a588', light: '#bfb296', right: '#a19377', front: '#897c61',
    joint: '#7b7059', edge: '#d3c5a8', grain: '#97896d', soil: '#4a5c34', moss: '#6b7d45' };
}

/** Local ground plane shared with the existing feet and entry stairs.
 * The top stays at their current contact level; only a thin, grass-buried lip is visible. */
export function CapsuleStonePlatform({ theme }: { theme: PlatformTheme }) {
  const id = 'pod-stone-' + useId().replace(/:/g, '');
  const p = stonePalette(theme);
  const top = 'M-77,45 L-36,38 L42,39 L76,44 L83,55 L75,69 L44,75 L-26,76 L-76,72 L-85,61Z';
  return <g id="capsule-stone-platform" data-material={theme.design === 'rustic' ? 'weathered-fieldstone' : theme.design === 'retro' ? 'sage-painted-stone' : 'sandstone'} pointerEvents="none" aria-hidden="true" strokeLinejoin="round">
    <defs><clipPath id={`${id}-top`}><path d={top} /></clipPath></defs>
    {/* Broken, close contact shadows sit below the buried stone edge. */}
    <path d="M-82,67 Q-69,76 -48,76 L-31,78 L-60,78 Q-79,75 -84,69Z M17,77 L44,76 L72,71 L79,70 L74,74 L47,79 L19,79Z"
      fill={p.soil} opacity=".22" />
    <path d="M-85,61 L-76,72 L-26,76 L44,75 L75,69 L83,55 L83,57 L76,71 L45,77 L-27,78 L-77,74 L-85,63Z"
      fill={p.front} />
    <path data-platform-top="" d={top} fill={p.base} />
    <g clipPath={`url(#${id}-top)`}>
      <path data-platform-slab="west" d="M-86,43 L-36,38 L-24,57 L-33,76 L-77,74 L-87,61Z" fill={p.left} />
      <path data-platform-slab="rear" d="M-36,38 L42,39 L32,57 L-24,57Z" fill={p.light} />
      <path data-platform-slab="east" d="M42,39 L77,43 L85,55 L75,70 L44,76 L32,57Z" fill={p.right} />
      <path data-platform-slab="front" d="M-24,57 L32,57 L44,76 L-33,78Z" fill={p.base} />
      {/* Wide flags with a few narrow, slightly irregular joints. */}
      <path d="M-36,38 L-31,46 L-24,57 L-29,67 L-33,76 M-24,57 L5,56.4 L32,57 M42,39 L38,46 L32,57 L37,64 L44,75"
        fill="none" stroke={p.joint} strokeWidth=".65" opacity=".65" />
      <path d="M-74,46 L-55,43 M-15,41 L11,41.4 M-73,71 L-51,73 M49,73 L63,70"
        fill="none" stroke={p.edge} strokeWidth=".55" opacity=".65" />
      <path d="M-72,59 l8,-1.3 m4,8 l5,.6 M-6,47 l11,.5 M49,49 l7,1.2 m4,9 l4,-.6 M-8,69 l8,.7 m12,-5 l5,-.5"
        fill="none" stroke={p.grain} strokeWidth=".5" opacity=".5" strokeLinecap="round" />
      <path d="M-31,69 l-1.4,4 M35.6,61.5 l1.2,2.6 M47,74.4 l4,-.8"
        fill="none" stroke={p.moss} strokeWidth="1" opacity=".65" />
      {/* Small broken corners expose the same material rather than black chips. */}
      <path d="M-81,64 L-78,65 L-80,66.5Z M64,71 L67,69.8 L65,72Z" fill={p.front} opacity=".6" />
    </g>
    {/* Three unequal turf pockets cover the lip; most of the stone surface stays clear. */}
    <g id={`${id}-grass`}>
      <style>{meadowPlantPaletteCss(theme as YorkshireSceneTheme, '#' + id + '-grass')}</style>
      <Grass type="short" x={-73} y={74} scale={.19} flip />
      <Grass type="woven" x={62} y={73} scale={.19} />
      <Grass type="short" x={10} y={78} scale={.13} />
    </g>
  </g>;
}
