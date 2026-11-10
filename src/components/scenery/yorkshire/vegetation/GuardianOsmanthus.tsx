import { useId } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { Grass } from './MeadowVegetationAssets';
import { meadowPlantPaletteCss } from './meadowPalette';

/** Local coordinates retain the heritage tree's root at (0, 48). */
export function guardianTreePalette(theme: YorkshireSceneTheme) {
  return theme.isNight
    ? { deep: '#293e30', shade: '#375237', leaf: '#4e6b3d', light: '#70874d', tip: '#94a767', flower: '#b5a264', flowerLight: '#d1ba7c', bark: '#51412c', barkLight: '#8c7854', barkShade: '#302c23', rope: '#a89c7d' }
    : theme.timeOfDay === 'dusk'
      ? { deep: '#394d2d', shade: '#506638', leaf: '#738947', light: '#9ba655', tip: '#bdc577', flower: '#d6a448', flowerLight: '#ebc36d', bark: '#81502a', barkLight: '#c69351', barkShade: '#472e1d', rope: '#c2ac80' }
      : { deep: '#2f4c30', shade: '#456737', leaf: '#638942', light: '#8ca850', tip: '#b1c571', flower: '#dba83f', flowerLight: '#f1cb70', bark: '#80542b', barkLight: '#c49a58', barkShade: '#493019', rope: '#baa17b' };
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

// Four uneven crown volumes follow the existing branches. Dark undersides stay
// visible between overlapping shoulders, while the lit patches occupy less area.
const crowns = [
  { d: 'M-80,-64 Q-86,-70 -81,-77 Q-87,-85 -79,-91 L-74,-92 Q-75,-106 -61,-109 L-58,-115 Q-51,-123 -42,-117 L-37,-119 Q-23,-116 -22,-106 L-16,-103 Q-9,-96 -16,-87 Q-12,-77 -23,-73 Q-25,-65 -39,-64 L-45,-68 Q-55,-56 -64,-63 Q-73,-58 -80,-64Z', tone: 'shade' },
  { d: 'M-39,-103 Q-50,-110 -45,-121 L-39,-126 Q-43,-136 -29,-138 L-23,-143 -16,-140 Q-6,-146 1,-137 L9,-138 Q23,-134 25,-123 L29,-116 Q34,-103 23,-98 L20,-91 -1,-91 -12,-97 -22,-93Z', tone: 'shade' },
  { d: 'M10,-94 Q5,-103 15,-110 L18,-119 29,-121 Q38,-132 47,-122 L56,-123 Q66,-121 66,-111 L73,-107 Q79,-100 73,-91 Q77,-83 65,-78 Q59,-72 49,-78 Q40,-73 34,-80 Q22,-76 18,-85 Q10,-84 10,-94Z', tone: 'shade' },
  { d: 'M65,-68 L62,-77 70,-84 Q69,-95 82,-93 L87,-96 96,-91 Q105,-93 107,-83 L113,-78 109,-71 Q117,-64 108,-57 L101,-56 Q97,-45 87,-51 L81,-48 72,-53 68,-60 61,-62Z', tone: 'shade' },
  { d: 'M-79,-85 Q-81,-94 -70,-98 Q-73,-104 -60,-107 Q-54,-116 -44,-111 L-38,-112 Q-29,-107 -31,-99 Q-20,-94 -26,-86 Q-32,-77 -44,-81 Q-49,-74 -60,-80 Q-68,-72 -74,-79Z', tone: 'leaf' },
  { d: 'M-39,-119 Q-41,-127 -28,-129 Q-23,-140 -14,-134 L-7,-137 Q2,-135 5,-127 L13,-126 Q24,-117 15,-110 Q10,-102 -2,-109 Q-8,-102 -20,-110 Q-28,-104 -36,-112Z', tone: 'leaf' },
  { d: 'M14,-99 Q14,-110 26,-112 Q29,-121 40,-117 Q48,-124 56,-113 L62,-111 Q70,-102 61,-95 Q64,-87 49,-86 L42,-90 Q33,-81 24,-89 Q17,-85 14,-99Z', tone: 'leaf' },
  { d: 'M72,-75 Q70,-83 79,-85 L84,-89 90,-87 Q99,-89 102,-80 L107,-77 103,-70 96,-69 92,-64 83,-68 77,-65 73,-69Z', tone: 'leaf' },
  { d: 'M-69,-97 Q-68,-105 -58,-106 Q-55,-113 -46,-108 L-41,-109 Q-35,-106 -35,-103 Q-38,-97 -47,-101 Q-52,-94 -59,-99 Q-63,-93 -69,-97Z', tone: 'light' },
  { d: 'M-30,-128 Q-28,-132 -25,-131 Q-23,-138 -15,-132 Q-9,-137 -4,-129 Q3,-130 4,-123 Q1,-119 -4,-121 L-10,-124 Q-17,-117 -22,-124 Q-27,-119 -30,-128Z', tone: 'light' },
  { d: 'M24,-111 Q30,-118 36,-113 Q41,-119 48,-111 Q55,-114 56,-105 Q51,-100 44,-106 Q38,-99 33,-106 Q28,-101 24,-111Z', tone: 'light' },
  { d: 'M77,-83 Q80,-89 87,-84 Q94,-88 98,-79 Q96,-72 88,-78 Q81,-72 77,-83Z', tone: 'light' },
  // A small forward-facing spray overlaps the central leader's flat end,
  // including enough margin for the canopy's gentle rustling rotation.
  { d: 'M-25,-100 Q-19,-105 -14,-100 Q-8,-103 -4,-98 Q3,-100 6,-93 Q2,-87 -4,-89 Q-11,-82 -17,-88 Q-24,-85 -26,-92Z', tone: 'shade' },
  { d: 'M-22,-98 Q-18,-102 -14,-98 Q-9,-101 -6,-96 Q-1,-98 1,-94 Q-4,-91 -9,-94 Q-15,-90 -18,-94Z', tone: 'leaf' },
] as const;

// Leaf sprays follow the ends of four branch fans; most of the crown remains
// quiet mass. Blooms are placed separately at leaf axils, not on every spray.
const sprigs = [
  [-76,-87,-68,.58],[-65,-101,-48,.66],[-51,-106,-25,.64],[-36,-98,12,.58],
  [-70,-72,-80,.55],[-57,-85,-37,.7],[-40,-76,25,.62],[-24,-90,44,.56],
  [-29,-126,-36,.6],[-15,-132,-8,.64],[-2,-124,19,.6],[14,-115,49,.61],[-12,-110,-21,.68],
  [23,-107,-30,.63],[37,-115,4,.62],[52,-106,32,.67],[61,-91,65,.56],[34,-91,26,.6],
  [76,-83,-23,.59],[90,-83,18,.58],[103,-72,57,.53],[85,-62,65,.57],
  [-73,-81,-55,.56],[-49,-88,-12,.7],[-34,-83,43,.54],[-25,-111,-32,.66],
  [4,-111,36,.62],[26,-94,-23,.6],[53,-92,53,.54],[91,-68,42,.55],
  [-12,-91,-14,.46],
] as const;

const blossomClusters = [
  { x:-61,y:-90, flowers:[[0,0,1],[-4,3,.8],[3,4,.9],[-1,7,.7],[6,1,.6]] },
  { x:-31,y:-81, flowers:[[0,0,.8],[4,2,.65]] },
  { x:-14,y:-118, flowers:[[0,0,.9],[-4,2,.65],[3,4,.85],[0,7,.65]] },
  { x:35,y:-99, flowers:[[0,0,1],[4,-2,.75],[-3,4,.8],[3,5,.65],[7,2,.6]] },
  { x:56,y:-88, flowers:[[0,0,.7],[4,2,.6]] },
  { x:86,y:-73, flowers:[[0,0,.9],[-4,2,.75],[3,4,.8],[-1,6,.6]] },
] as const;

export function OsmanthusCanopy({ palette: p, rustling }: { palette: Palette; rustling: boolean }) {
  return <g id="guardian-tree-canopy" className="guardian-osmanthus-canopy" data-rustling={rustling}>
    {crowns.map(({ d, tone }, i) => <path key={i} d={d} fill={p[tone]} />)}
    <path d="M-77,-72 Q-70,-65 -64,-69 L-58,-66 Q-50,-66 -47,-71 Q-43,-65 -34,-68 L-31,-73 Q-37,-71 -41,-74 Q-47,-70 -53,-74 Q-60,-69 -66,-74Z
      M22,-87 Q29,-80 36,-85 Q42,-79 49,-83 Q58,-78 64,-86 L60,-89 Q54,-84 49,-88 Q41,-84 36,-89 Q29,-84 22,-90Z"
      fill={p.deep} opacity=".62" />
    {/* Short glimpses of branch forks connect the foliage to its supporting limbs. */}
    <path d="M-71,-71 L-65,-79 -62,-86 M-65,-79 L-72,-83 M-23,-98 L-18,-107 -20,-115 M-18,-107 L-10,-111 M44,-81 L43,-89 48,-96 M43,-89 L37,-93 M83,-54 L89,-62 89,-70"
      stroke={p.bark} strokeWidth="1.1" fill="none" strokeLinecap="round" />
    {sprigs.map(([x,y,angle,size], i) => <g key={i} transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}>
      <path d="M0,5 Q1,-2 3,-12" fill="none" stroke={p.shade} strokeWidth=".8" />
      <path d="M1,1 Q-8,0 -9,-7 Q-2,-8 1,1 M2,-4 Q6,-12 12,-9 Q11,-2 2,-4 M3,-10 Q0,-17 5,-20 Q9,-15 3,-10Z"
        fill={i%7===0?p.tip:i%4===0?p.leaf:p.light} />
      {i%2===0 && <path d="M1,1 L-7,-6 M2,-4 L9,-8" stroke={p.leaf} strokeWidth=".6" fill="none" />}
    </g>)}
    {blossomClusters.map(({x,y,flowers},i) => <g key={i} transform={`translate(${x} ${y})`} data-osmanthus-blossoms="">
      <path d="M-3,4 L0,1 4,2 M0,1 L0,-2" fill="none" stroke={p.shade} strokeWidth=".65" />
      {flowers.map(([fx,fy,size],j) => <g key={j} transform={`translate(${fx} ${fy}) rotate(${j*23}) scale(${size})`}>
        <path d="M0,-.8 C-3,-4 -4,0 -.9,.2 C-4,3 0,5 .5,1.2 C3,4 5,0 1.3,-.2 C4,-3 0,-5 0,-.8Z" fill={j%3===0?p.flowerLight:p.flower} />
        <circle r=".55" fill={p.flower} />
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
