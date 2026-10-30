import { useId } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { Grass } from './MeadowVegetationAssets';
import { meadowPlantPaletteCss } from './meadowPalette';

/** Local coordinates retain the heritage tree's root at (0, 48). */
export function guardianTreePalette(theme: YorkshireSceneTheme) {
  return theme.isNight
    ? { deep: '#293d36', shade: '#354e3e', leaf: '#496349', light: '#6b8057', tip: '#839466', flower: '#b9af72', flowerLight: '#d7c88e', bark: '#51412c', barkLight: '#8c7854', barkShade: '#302c23', rope: '#a89c7d' }
    : theme.timeOfDay === 'dusk'
      ? { deep: '#3e5036', shade: '#52643c', leaf: '#72834a', light: '#96a15c', tip: '#b5ba75', flower: '#d6aa54', flowerLight: '#eed08a', bark: '#81502a', barkLight: '#c69351', barkShade: '#472e1d', rope: '#c2ac80' }
      : { deep: '#304b35', shade: '#45643c', leaf: '#618349', light: '#86a35c', tip: '#acbd79', flower: '#dbb156', flowerLight: '#f1d58b', bark: '#80542b', barkLight: '#c49a58', barkShade: '#493019', rope: '#baa17b' };
}

type Palette = ReturnType<typeof guardianTreePalette>;

const trunkContours = [
  'M-25,47 C-15,31 -17,16 -26,-2 C-34,-19 -28,-35 -15,-51 C-7,-63 -10,-77 -16,-91 L-7,-93 C3,-74 4,-61 -4,-46 C7,-51 23,-52 41,-51 C57,-50 72,-56 86,-66 L89,-61 C75,-47 60,-41 42,-41 C23,-42 9,-38 -4,-28 C-16,-16 -13,-8 -7,3 C1,20 0,35 13,46 L18,49 Q9,50 2,46 Q-3,48 -8,48 Q-17,51 -28,49 Z',
  'M-20,-7 C-29,-28 -45,-40 -59,-52 Q-70,-61 -74,-76 L-70,-78 Q-63,-63 -53,-57 C-39,-51 -29,-41 -21,-29 L-18,-21 Z',
  'M-17,-43 C-27,-52 -38,-66 -42,-83 L-37,-86 C-32,-67 -21,-59 -11,-55 Z M22,-47 C30,-62 39,-73 52,-80 L55,-77 C42,-66 36,-54 34,-46 Z',
];

export function OsmanthusWood({ palette: p }: { palette: Palette }) {
  const id = `osmanthus-bark-${useId().replace(/:/g, '')}`;
  return <g id="guardian-tree-trunk" strokeLinejoin="round">
    <defs>
      <linearGradient id={id} gradientUnits="userSpaceOnUse" x1="-40" y1="-65" x2="30" y2="30">
        <stop stopColor={p.barkLight} /><stop offset=".42" stopColor={p.bark} /><stop offset="1" stopColor={p.barkShade} />
      </linearGradient>
      <linearGradient id={`${id}-light`} x1="0" y1="0" x2="1" y2=".7">
        <stop stopColor={p.barkLight} /><stop offset="1" stopColor={p.bark} />
      </linearGradient>
      <clipPath id={`${id}-outline`}>{trunkContours.map((d,i) => <path key={i} d={d} />)}</clipPath>
    </defs>
    {trunkContours.map((d,i) => <path key={i} d={d} fill={`url(#${id})`} stroke={i === 0 ? p.barkShade : undefined} strokeWidth=".8" />)}
    <g clipPath={`url(#${id}-outline)`}>
      {/* Broken planes follow torsion and branch crotches; no continuous light ribbon. */}
      <path d="M-25,46 Q-15,34 -19,20 L-17,13 Q-10,31 -17,44 L-20,49 Z
        M-23,4 Q-33,-17 -23,-33 L-15,-43 Q-23,-25 -24,-16 L-21,-9 L-17,3 Z
        M-13,-51 Q-6,-69 -13,-87 L-8,-90 Q0,-71 -4,-61 L-9,-53 Z
        M-65,-62 Q-49,-48 -38,-40 L-31,-30 Q-48,-44 -61,-53 Z
        M4,-48 Q22,-52 41,-50 L49,-49 Q33,-46 22,-47 L13,-45 Z
        M58,-51 Q73,-55 85,-64 L86,-61 Q73,-49 62,-47 Z
        M-37,-79 Q-31,-65 -23,-59 L-19,-52 Q-31,-59 -37,-70 Z"
        fill={`url(#${id}-light)`} />
      <path d="M-7,3 Q1,20 0,35 L13,46 L18,49 L7,47 Q-6,34 -6,22 L-12,8 Z
        M-4,-46 Q8,-50 20,-50 L9,-44 Q-7,-35 -13,-21 L-16,-12 Q-20,-22 -14,-32 Z
        M33,-43 Q61,-42 83,-58 L89,-61 Q75,-47 60,-41 L42,-41 Z"
        fill={p.barkShade} opacity=".72" />
      <path d="M-20,38 Q-16,30 -20,19 M-23,-9 Q-27,-22 -20,-31 M-9,-58 Q-5,-68 -10,-80
        M-51,-49 L-42,-43 M25,-48 L35,-48 M65,-50 L73,-53"
        fill="none" stroke={p.barkShade} strokeWidth=".7" strokeLinecap="round" opacity=".7" />
      <path d="M-18,37 L-16,30 M-25,-15 Q-26,-22 -22,-28 M55,-48 L63,-50"
        fill="none" stroke={p.barkLight} strokeWidth=".65" strokeLinecap="round" opacity=".65" />
      <path d="M-19,4 Q-22,9 -17,14 Q-14,9 -19,4 Z" fill={p.barkShade} />
      <path d="M-20,3 Q-25,9 -19,16 M-18,7 L-17,11" fill="none" stroke={p.barkLight} strokeWidth=".65" opacity=".6" />
    </g>
  </g>;
}

// Each crown is authored separately: a high left crown and a smaller outward right crown.
const crowns = [
  { d: 'M-80,-62 Q-90,-70 -79,-80 Q-86,-91 -72,-95 Q-76,-108 -59,-110 Q-52,-125 -39,-116 Q-28,-121 -21,-107 Q-9,-103 -17,-89 Q-10,-76 -25,-72 Q-32,-61 -44,-66 Q-55,-53 -65,-62 Q-73,-57 -80,-62Z', tone: 'shade' },
  { d: 'M-40,-104 Q-52,-115 -40,-125 Q-42,-136 -27,-137 Q-19,-147 -7,-138 Q4,-144 12,-132 Q26,-132 25,-117 Q38,-106 25,-94 Q12,-83 -1,-94 Q-17,-83 -25,-98 Q-34,-94 -40,-104Z', tone: 'leaf' },
  { d: 'M10,-91 Q3,-102 15,-110 Q14,-121 29,-121 Q37,-132 49,-121 Q62,-125 65,-112 Q80,-108 73,-96 Q82,-86 67,-80 Q57,-67 46,-77 Q32,-69 25,-80 Q15,-77 10,-91Z', tone: 'shade' },
  { d: 'M65,-68 Q57,-80 71,-87 Q73,-98 86,-92 Q99,-98 103,-85 Q116,-81 108,-71 Q118,-60 105,-54 Q96,-42 85,-51 Q71,-44 68,-57 Q60,-58 65,-68Z', tone: 'leaf' },
  { d: 'M-81,-82 Q-84,-92 -71,-97 Q-73,-108 -58,-109 Q-48,-122 -36,-112 Q-25,-113 -24,-101 Q-12,-94 -23,-85 Q-33,-78 -45,-85 Q-56,-74 -66,-81 Q-75,-76 -81,-82Z', tone: 'leaf' },
  { d: 'M-41,-117 Q-43,-128 -28,-129 Q-24,-141 -12,-134 Q0,-139 5,-128 Q18,-127 15,-115 Q5,-105 -5,-111 Q-15,-101 -25,-111 Q-36,-106 -41,-117Z', tone: 'light' },
  { d: 'M-58,-102 Q-67,-111 -54,-116 Q-45,-125 -36,-116 Q-23,-117 -24,-107 Q-27,-97 -39,-101 Q-48,-92 -58,-102Z', tone: 'light' },
  { d: 'M20,-101 Q15,-111 29,-113 Q36,-124 47,-115 Q60,-118 60,-106 Q71,-100 60,-91 Q48,-83 40,-93 Q29,-86 20,-101Z', tone: 'leaf' },
  { d: 'M70,-80 Q68,-88 80,-88 Q87,-98 95,-88 Q107,-87 103,-77 Q94,-67 85,-74 Q75,-69 70,-80Z', tone: 'light' },
] as const;

const sprigs = [
  [-75,-91,-24,.9], [-63,-103,18,1], [-49,-113,-12,.85], [-34,-104,26,1],
  [-68,-77,-30,.8], [-48,-86,10,1], [-26,-86,36,.8], [-30,-123,-25,.85],
  [-13,-132,16,.9], [3,-119,-18,.9], [-10,-108,35,1], [19,-103,-28,.8],
  [35,-113,18,.95], [51,-105,-15,.85], [37,-91,28,1], [61,-91,35,.75],
  [77,-84,-24,.8], [92,-82,28,.85], [101,-66,48,.7], [82,-62,15,.8],
] as const;

export function OsmanthusCanopy({ palette: p, rustling }: { palette: Palette; rustling: boolean }) {
  return <g id="guardian-tree-canopy" className="guardian-osmanthus-canopy" data-rustling={rustling}>
    {crowns.map(({ d, tone }, i) => <path key={i} d={d} fill={p[tone]} />)}
    {/* Opposite, pointed evergreen leaves and small four-petalled flowers. */}
    {sprigs.map(([x,y,angle,size], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}>
      <path d="M-9,4 Q-4,0 10,-6" fill="none" stroke={p.shade} strokeWidth=".7" />
      <path d="M-3,1 Q-14,1 -15,-6 Q-5,-8 -3,1 M1,-1 Q-3,-11 3,-14 Q9,-6 1,-1 M5,-3 Q8,-13 15,-11 Q14,-4 5,-3" fill={i % 3 === 0 ? p.tip : p.light} />
      <path d="M-3,1 L-12,-5 M1,-1 L3,-11" stroke={p.leaf} strokeWidth=".55" fill="none" />
      {[[0,3],[5,1],[-4,6]].map(([fx,fy], j) => <g key={j} transform={`translate(${fx} ${fy}) scale(${j === 0 ? 1 : .72})`}>
        <path d="M0,0 C-5,-1 -3,-5 0,-2 C2,-6 5,-2 2,0 C6,2 2,5 0,2 C-3,5 -5,1 0,0Z" fill={i % 2 ? p.flower : p.flowerLight} />
        <circle r=".65" fill={p.flower} />
      </g>)}
    </g>)}
  </g>;
}

export function OsmanthusSwing({ palette: p }: { palette: Palette }) {
  return <g id="guardian-tree-swing" pointerEvents="none">
    {/* Rope eyes sit on the exposed limb; seat stays above the original root plane. */}
    <path d="M31,-48 C29,-53 34,-54 34,-48 L33,26 M59,-48 C57,-53 62,-54 62,-48 L63,22" fill="none" stroke={p.rope} strokeWidth="1.45" strokeLinecap="round" />
    <path d="M27,25 L61,20 L69,24 L34,30Z" fill={p.barkLight} stroke={p.bark} strokeWidth=".8" />
    <path d="M34,30 L69,24 L69,27 L34,33Z M27,25 L34,30 L34,33 L27,28Z" fill={p.bark} />
    <path d="M35,27 L60,23" stroke={p.rope} strokeWidth=".7" opacity=".7" />
    <path d="M33,26 L33,29 M63,22 L63,25" stroke={p.rope} strokeWidth="1.6" />
  </g>;
}

/** Short turf overlaps the tapered root ends, without a raised ring or a soil pad. */
export function OsmanthusRootGrass({ theme }: { theme: YorkshireSceneTheme }) {
  return <g id="guardian-root-grass" pointerEvents="none" aria-hidden="true">
    <style>{meadowPlantPaletteCss(theme, '#guardian-root-grass')}</style>
    <Grass type="woven" x={-25} y={49} scale={.23} />
    <Grass type="short" x={13} y={49.5} scale={.19} flip />
    <Grass type="short" x={-7} y={51} scale={.12} />
  </g>;
}
