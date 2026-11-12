import { useId } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { Grass } from './MeadowVegetationAssets';
import { meadowPlantPaletteCss } from './meadowPalette';

/** Local coordinates retain the heritage tree's root at (0, 48). */
export function guardianTreePalette(theme: YorkshireSceneTheme) {
  return theme.isNight
    ? { deep: '#293e30', shade: '#375237', leaf: '#4e6b3d', light: '#70874d', tip: '#94a767', flower: '#bba354', flowerLight: '#d2bc78', bark: '#4a4b40', barkFace: '#666653', barkLight: '#85826a', barkShade: '#363e34', barkPatch: '#575c4c', barkCool: '#566451', barkRecess: '#2d382e', timber: '#51412c', timberLight: '#8c7854', rope: '#a89c7d' }
    : theme.timeOfDay === 'dusk'
      ? { deep: '#394d2d', shade: '#506638', leaf: '#738947', light: '#9ba655', tip: '#bdc577', flower: '#e2a13a', flowerLight: '#f3c565', bark: '#82705d', barkFace: '#a68f72', barkLight: '#beaa8d', barkShade: '#605345', barkPatch: '#95836d', barkCool: '#89836e', barkRecess: '#484a3b', timber: '#81502a', timberLight: '#c69351', rope: '#c2ac80' }
      : { deep: '#2f4c30', shade: '#456737', leaf: '#638942', light: '#8ca850', tip: '#b1c571', flower: '#eda82d', flowerLight: '#ffd16a', bark: '#81735f', barkFace: '#a29479', barkLight: '#c0b49a', barkShade: '#615b4c', barkPatch: '#918772', barkCool: '#858775', barkRecess: '#4b5040', timber: '#80542b', timberLight: '#c49a58', rope: '#baa17b' };
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
      <clipPath id={`${id}-outline`}>{trunkContours.map((d,i) => <path key={i} d={d} />)}</clipPath>
    </defs>
    {trunkContours.map((d,i) => <path key={i} d={d} fill={p.bark} />)}
    <g clipPath={`url(#${id}-outline)`}>
      {/* Matte grey-brown bark: broad irregular shoulders and recessed sides. */}
      <path d="M-20,-7 C-29,-28 -45,-40 -59,-52 Q-70,-61 -74,-76 L-70,-78 Q-63,-63 -53,-57 C-39,-51 -29,-41 -21,-29 L-18,-21Z" fill={p.barkPatch} />
      <path d="M-68,-66 Q-59,-56 -49,-50 L-43,-44 Q-38,-42 -33,-35 L-30,-32 C-41,-40 -53,-47 -63,-56Z" fill={p.barkFace} />
      <path d="M-64,-57 C-51,-47 -36,-37 -26,-23 L-20,-7 C-29,-28 -45,-40 -59,-52Z" fill={p.barkShade} />
      <path d="M-17,-43 C-27,-52 -38,-66 -42,-83 L-37,-86 C-32,-67 -21,-59 -11,-55Z" fill={p.barkPatch} />
      <path d="M-39,-81 Q-34,-64 -23,-56 L-18,-50 L-21,-49 Q-34,-60 -40,-75Z" fill={p.barkFace} />

      {/* The leader has a broken lit shoulder, with a real side plane. */}
      <path d="M-16,-92 L-11,-93 Q-4,-76 -6,-65 L-8,-61 Q-10,-52 -17,-43 L-22,-35 L-20,-43 Q-11,-56 -11,-65 L-12,-69 L-12,-78Z" fill={p.barkFace} />
      <path d="M-7,-93 C3,-74 4,-61 -4,-46 L-10,-37 L-8,-46 Q-1,-60 -2,-69 L-4,-74 L-4,-81Z" fill={p.barkShade} />
      <path d="M-13,-77 L-12,-73 Q-11,-67 -14,-60 L-14,-56 L-17,-52 L-16,-60 Q-14,-67 -16,-73Z" fill={p.barkPatch} />

      {/* This rear branch passes behind the shoulder of the swing-bearing limb. */}
      <path d="M22,-47 C30,-62 39,-73 52,-80 L55,-77 C42,-66 36,-54 34,-46Z" fill={p.barkPatch} />
      <path d="M22,-47 C30,-62 39,-73 52,-80 L53,-79 Q40,-68 35,-59 L32,-56 L29,-48Z" fill={p.barkFace} />
      <path d="M34,-46 C36,-54 42,-66 55,-77 L53,-78 Q43,-69 38,-59 L36,-52 L33,-49Z" fill={p.barkShade} />
      <path d="M-6,-45 C8,-51 22,-51 40,-50 Q62,-49 86,-65 L87,-62 Q68,-49 47,-47 L35,-47 L29,-45 L17,-45 Q3,-41 -6,-36 L-13,-27 Q-12,-37 -6,-45Z" fill={p.barkFace} />
      <path d="M1,-37 C13,-44 27,-45 42,-44 C61,-44 75,-50 87,-62 L89,-61 C75,-47 60,-41 42,-41 C23,-42 9,-38 -4,-28Z" fill={p.barkShade} />
      <path d="M12,-46 L24,-48 L30,-47 L39,-48 L45,-46 L37,-45 L30,-45 L25,-44 L17,-44Z M58,-50 L68,-54 L75,-56 L72,-53 L64,-50 L60,-49Z" fill={p.barkPatch} />

      {/* Main stem shoulders vary in width and break at shallow bark ridges. */}
      <path d="M-25,47 C-18,35 -20,21 -25,8 L-27,-1 C-32,-12 -29,-26 -24,-35 L-18,-44 Q-24,-31 -24,-21 L-22,-12 L-19,-5 C-11,12 -9,27 -14,39 L-13,43 L-17,48Z" fill={p.barkFace} />
      <path d="M-13,-12 C-15,-5 -9,2 -6,9 C0,23 -1,36 13,46 L18,49 L8,48 C-2,44 -6,34 -8,23 L-13,13 L-16,6 C-20,-3 -20,-8 -17,-13Z" fill={p.barkShade} />
      <path d="M-23,-14 Q-25,-24 -21,-31 L-19,-33 L-21,-24 L-20,-21 L-21,-16 L-18,-9 L-17,-4 L-19,-5Z
        M-21,1 L-18,5 L-18,10 L-15,16 L-14,23 L-16,21 L-18,16 L-20,13 L-20,8 L-23,3Z
        M-19,26 L-17,30 L-18,36 L-21,41 L-23,44 L-21,37 L-21,34Z" fill={p.barkPatch} />
      <path d="M-11,17 L-8,22 L-7,29 L-5,34 L-7,32 L-10,26 L-10,22Z M-2,40 L2,44 L7,47 L2,47 L-3,43Z" fill={p.barkCool} />

      {/* Short branch collars and canopy occlusion locate the sheltered recesses. */}
      <path d="M-24,-31 Q-19,-38 -13,-41 Q-19,-33 -20,-26 L-20,-22 Q-23,-25 -24,-28Z" fill={p.barkShade} />
      <path d="M-75,-78 L-69,-79 Q-66,-71 -61,-66 L-56,-62 Q-63,-61 -68,-66Z
        M-17,-94 L-6,-95 Q-2,-87 -2,-80 L-7,-82 L-12,-84Z
        M48,-83 L57,-80 L53,-73 Q48,-73 44,-76Z
        M81,-66 L89,-70 L93,-63 L84,-58 L79,-58Z" fill={p.barkRecess} opacity=".42" />
      <path d="M-9,-40 Q-6,-43 -1,-44 M-10,-35 Q-6,-39 -2,-40 M-29,-27 Q-25,-24 -23,-19" fill="none" stroke={p.barkRecess} strokeWidth=".7" strokeLinecap="round" opacity=".65" />

      {/* Shallow, interrupted longitudinal fissures follow the growth of each limb. */}
      <path d="M-20,39 Q-18,34 -19,30 L-20,28 M-15,26 Q-14,22 -16,17
        M-22,15 Q-20,10 -23,5 M-25,-1 L-26,-5 Q-27,-11 -25,-14
        M-21,-21 Q-21,-25 -18,-29 M-12,-1 Q-9,3 -9,7 M-4,29 L-2,34
        M-10,-59 Q-7,-67 -10,-75 L-10.4,-79 M-14,-66 L-15,-72 Q-15,-76 -17,-80
        M-6,-78 L-6.7,-83 M-32,-66 Q-28,-58 -25,-56
        M-62,-59 Q-58,-54 -52,-50 M-48,-49 L-44,-46 L-43,-44 M-37,-38 L-33,-33
        M9,-45 Q15,-47 20,-46 L23,-46.3 M28,-47 L34,-47.5 L37,-46.9
        M42,-47 L45.5,-46 M53,-48 Q59,-49 62,-50
        M39,-64 L41,-68 L44,-70 M47,-73 L49,-75"
        fill="none" stroke={p.barkShade} strokeWidth=".58" strokeLinecap="round" opacity=".8" />
      <path d="M-20.8,38 L-20.1,34 M-23.3,13 L-23.8,9 M-26,-8 L-25.9,-11
        M-11.1,-68 Q-11.2,-72 -12.1,-74 M-58.5,-55.5 L-55,-52.8
        M12,-45.7 L17,-46 M31,-48.2 L34,-48.4 M40,-65 L41.5,-67.5"
        fill="none" stroke={p.barkLight} strokeWidth=".48" strokeLinecap="round" opacity=".55" />
      {/* Sparse, elongated lenticels and two worn lichen patches stay subordinate. */}
      <path d="M-18.7,23 L-18,21 L-17.2,22.4 L-17.9,24.2Z M-22.5,-16 L-22,-18.3 L-21.2,-17.8 L-21.6,-15.6Z
        M-8,-54 L-7.1,-56 L-6.6,-54.5 L-7.3,-53Z M-12,-83 L-11.5,-85 L-10.6,-83.5Z
        M-51,-50.5 L-48.8,-49.5 L-49.4,-48.8 L-51.6,-50Z M20,-44.3 L23,-44.8 L22.6,-44 L20.4,-43.6Z
        M42,-67 L43.5,-69 L43.9,-68.1 L42.6,-66.5Z" fill={p.barkCool} opacity=".7" />
      <path d="M-22,29 L-20.8,28 L-20,28.8 L-20.2,30 L-19.5,30.7 L-20.1,32.2 L-21.3,31.7 L-21.7,32.6 L-22.5,31.5Z
        M-14,-50 L-12.4,-51 L-11.7,-50.1 L-12.3,-49.3 L-11.8,-48.5 L-13,-47.7 L-14,-48.3 L-14.6,-49Z" fill={p.barkLight} opacity=".36" />
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
  { x:-61,y:-90, flowers:[[0,0,1],[-4,3,.8],[3,4,.9],[-1,7,.7],[6,1,.6],[5,7,.65]] },
  { x:-31,y:-81, flowers:[[0,0,.8],[4,2,.65]] },
  { x:-14,y:-118, flowers:[[0,0,.9],[-4,2,.65],[3,4,.85],[0,7,.65],[5,-2,.6]] },
  { x:35,y:-99, flowers:[[0,0,1],[4,-2,.75],[-3,4,.8],[3,5,.65],[7,2,.6],[-5,0,.6]] },
  { x:56,y:-88, flowers:[[0,0,.7],[4,2,.6]] },
  { x:86,y:-73, flowers:[[0,0,.9],[-4,2,.75],[3,4,.8],[-1,6,.6]] },
  { x:-44,y:-77, flowers:[[0,0,.7],[-3,2,.55],[2,3,.6]] },
  { x:4,y:-111, flowers:[[0,0,.65],[3,2,.55]] },
  { x:96,y:-66, flowers:[[0,0,.6],[-3,2,.55]] },
] as const;

export function OsmanthusCanopy({ palette: p, rustling }: { palette: Palette; rustling: boolean }) {
  return <g id="guardian-tree-canopy" className="guardian-osmanthus-canopy" data-rustling={rustling}>
    {crowns.map(({ d, tone }, i) => <path key={i} d={d} fill={p[tone]} />)}
    <path d="M-77,-72 Q-70,-65 -64,-69 L-58,-66 Q-50,-66 -47,-71 Q-43,-65 -34,-68 L-31,-73 Q-37,-71 -41,-74 Q-47,-70 -53,-74 Q-60,-69 -66,-74Z
      M22,-87 Q29,-80 36,-85 Q42,-79 49,-83 Q58,-78 64,-86 L60,-89 Q54,-84 49,-88 Q41,-84 36,-89 Q29,-84 22,-90Z"
      fill={p.deep} opacity=".62" />
    {/* Short glimpses of branch forks connect the foliage to its supporting limbs. */}
    <path d="M-65,-80 Q-63,-85 -61,-88 M-65,-80 L-68,-82 M-18,-109 L-20,-115 M-18,-109 L-13,-112 M43,-90 L45,-94 M43,-90 L38,-94 M89,-63 L89,-70"
      stroke={p.bark} strokeWidth=".8" fill="none" strokeLinecap="round" />
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
    {/* A few existing leaf axils sit in front of the lower blooms. */}
    <g fill={p.light}>
      <path d="M-60,-81 C-58,-84 -55,-85 -53,-84 C-53,-81 -57,-80 -60,-81Z" />
      <path d="M-14,-110 C-18,-110 -20,-113 -19,-115 C-15,-116 -12,-112 -14,-110Z" />
      <path d="M86,-65 C84,-68 83,-70 85,-71 C88,-71 89,-67 86,-65Z" />
    </g>
  </g>;
}

export function OsmanthusSwing({ palette: p }: { palette: Palette }) {
  return <g id="guardian-tree-swing" pointerEvents="none">
    {/* Rope eyes sit on the exposed limb; seat stays above the original root plane. */}
    <path d="M31,-48 C29,-53 34,-54 34,-48 L33,26 M59,-48 C57,-53 62,-54 62,-48 L63,22" fill="none" stroke={p.rope} strokeWidth="1.45" strokeLinecap="round" />
    <path d="M27,25 L61,20 L69,24 L34,30Z" fill={p.timberLight} stroke={p.timber} strokeWidth=".8" />
    <path d="M34,30 L69,24 L69,27 L34,33Z M27,25 L34,30 L34,33 L27,28Z" fill={p.timber} />
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
