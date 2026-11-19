import { useId } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { YardObject } from '../../../../features/yard-editor/YardWorld';
import { YARD_OBJECTS } from '../../../../features/yard-editor/yardLayout';

// Roots follow the platform's ground axis; stems and flower heads stay upright.
function borderPalette(theme: YorkshireSceneTheme) {
  if (theme.isNight) return {
    soil: '#454739', soilShade: '#363c31', leaf: '#577955', leafLight: '#829370', leafShade: '#385643',
    yellow: ['#b9aa78', '#d5c69a', '#897955'], pink: ['#a46e88', '#c298a5', '#75516d'],
    poppy: '#ac7164', poppyLight: '#c9917b', heart: '#494943',
  };
  if (theme.timeOfDay === 'dusk') return {
    soil: '#777052', soilShade: '#5d6043', leaf: '#6b8a49', leafLight: '#a2b36b', leafShade: '#476840',
    yellow: ['#e7bd77', '#f4d79f', '#b68b52'], pink: ['#c67f95', '#e4abb4', '#965a75'],
    poppy: '#d67b60', poppyLight: '#efac82', heart: '#63523d',
  };
  return {
    soil: '#817858', soilShade: '#626848', leaf: '#63934f', leafLight: '#a0bb70', leafShade: '#3f7047',
    yellow: ['#edc57e', '#ffe1a2', '#c69859'], pink: ['#d48ba8', '#efb8c6', '#a65e83'],
    poppy: '#df7a65', poppyLight: '#f7b094', heart: '#5d5540',
  };
}
type Palette = ReturnType<typeof borderPalette>;

function LeafFan({ p, lean = 1 }: { p: Palette; lean?: number }) {
  return <g transform={`scale(${lean} 1)`}>
    <path d="M0,1 C-9,-1 -17,-10 -15,-20 Q-6,-17 0,-3Z" fill={p.leafShade} />
    <path d="M-1,1 C-3,-8 1,-22 7,-27 Q10,-16 3,0Z" fill={p.leaf} />
    <path d="M1,1 Q10,-18 19,-17 C18,-7 9,0 1,1Z" fill={p.leaf} />
    <path d="M1,0 Q6,-9 15,-14 Q9,-5 1,0 M0,-3 Q1,-15 5,-22" fill={p.leafLight} />
  </g>;
}

function GroundLeaves({ p, lean }: { p: Palette; lean: number }) {
  return <g transform={`scale(${lean} 1)`}>
    <path d="M-13,-1 Q-10,-6 -2,-4 M0,0 Q3,-8 9,-9 M1,0 L13,-3" fill="none" stroke={p.leafShade} strokeWidth="1.3" />
    <path d="M-2,-3 C-15,0 -21,-8 -14,-11 Q-7,-13 -2,-3Z" fill={p.leafShade} />
    <path d="M0,-1 C-6,-8 -5,-16 1,-16 Q9,-14 0,-1Z M5,-6 C6,-16 18,-19 18,-12 Q18,-7 5,-6Z" fill={p.leaf} />
    <path d="M7,-2 C13,-10 24,-6 20,-2 Q16,2 7,-2Z M-4,-5 Q-12,-5 -14,-9 Q-8,-10 -4,-5Z" fill={p.leafLight} />
  </g>;
}

function Tulip({ x, y, scale = 1, pink = false, lean = 0, p }: {
  x: number; y: number; scale?: number; pink?: boolean; lean?: number; p: Palette;
}) {
  const [body, light, shade] = pink ? p.pink : p.yellow;
  return <g transform={`translate(${x} ${y}) scale(${scale})`} data-border-flower="tulip">
    <path d={`M0,0 Q${lean - 2},-14 ${lean},-31`} fill="none" stroke={p.leafShade} strokeWidth="1.7" />
    <LeafFan p={p} lean={lean < 0 ? -1 : 1} />
    <g transform={`translate(${lean} -31)`}>
      <path d="M-7,-8 Q-4,-13 -1,-9 Q3,-14 6,-9 L7,-2 Q4,5 0,5 Q-6,4 -7,-3Z" fill={shade} />
      <path d="M-8,-8 Q-3,-6 0,-9 Q4,-7 8,-9 L6,0 Q3,6 -1,4 Q-7,2 -8,-8Z" fill={body} />
      <path d="M-6,-7 Q-3,-5 -1,-7 L0,3 Q-4,2 -5,-1Z" fill={light} />
      <path d="M2,-7 Q4,-6 6,-8 L5,-1 Q4,2 1,3Z" fill={shade} opacity=".4" />
    </g>
  </g>;
}

function Poppy({ x, y, lean, scale = 1, p }: { x: number; y: number; lean: number; scale?: number; p: Palette }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} data-border-flower="poppy">
    <path d={`M0,0 Q-4,-25 ${lean},-46 M-1,-12 Q15,-36 13,-39`} fill="none" stroke={p.leafShade} strokeWidth="1.2" />
    <path d="M-1,-3 Q-14,-7 -13,-14 L-8,-12 -9,-17 -3,-12Z M0,-10 Q7,-23 12,-22 L9,-17 12,-17 5,-12Z" fill={p.leaf} />
    <path d="M11,-38 Q8,-44 12,-45 Q17,-45 16,-40Z" fill={p.leaf} />
    <g transform={`translate(${lean} -46)`}>
      <path d="M0,1 Q-12,0 -10,-8 Q-6,-13 0,-6 Q5,-14 11,-9 Q15,-3 6,1Z" fill={p.poppy} />
      <path d="M-9,-7 Q-5,-8 0,-3 Q5,-8 11,-7 Q9,2 2,3 Q-5,4 -9,-7Z" fill={p.poppyLight} />
      <path d="M-3,-2 Q1,-5 5,-2 L3,1 -1,1Z" fill={p.heart} />
      <path d="M-7,-6 Q-5,-3 -3,-2 M7,-6 L5,-3" stroke={p.poppy} strokeWidth=".8" fill="none" />
    </g>
  </g>;
}

const tulips = [
  [-109, 28, .65, 0, -3], [-96, 24, .8, 0, 1],
  [-58, 19, .86, 1, -3], [-45, 9, 1, 1, 2], [-32, 16, .72, 1, 4],
  [-8, 6, .9, 0, -2], [6, -4, 1.04, 0, 1],
  [47, -8, .93, 1, -3], [61, -18, .83, 1, 3],
  [94, 2, .63, 0, -2], [113, 9, .5, 0, 2],
] as const;

/** A shallow, open-ended planting follows the foundation and loosens toward the birdbath. */
export function CottageFlowerBorder({ theme }: { theme: YorkshireSceneTheme }) {
  const p = borderPalette(theme);
  const uid = 'cottage-flower-border-' + useId().replace(/:/g, '');
  const anchor = YARD_OBJECTS.cottage_flower_border;
  return <YardObject id="cottage_flower_border">
    <g id={uid} data-cottage-flower-border="" transform={`translate(${anchor.x} ${anchor.y})`}
      pointerEvents="none" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
      <title>木屋沿阶花境：杏黄与玫粉郁金香、珊瑚色虞美人</title>
      <path d="M-129,32 Q-103,17 -78,17 Q-44,0 -13,0 Q25,-17 54,-21 Q79,-31 89,-21 Q106,-17 117,0 Q132,7 125,13 Q108,18 94,11 Q78,-3 62,-1 Q27,9 6,14 Q-26,19 -52,26 Q-88,31 -105,36Z"
        fill={p.soilShade} opacity=".55" />
      <path d="M-117,29 Q-85,18 -61,19 Q-29,5 0,6 L55,-12 Q79,-24 86,-17 Q89,-5 104,2 L115,9 Q97,10 83,0 Q62,-6 37,5 L-11,17 -65,28 -99,32Z"
        fill={p.soil} opacity=".7" />
      {/* Low foliage connects the roots without making an unbroken hedge. */}
      {[-119, -86, -63, -24, 13, 43, 75, 101, 121].map((x, i) => <g key={x}
        transform={`translate(${x} ${x > 80 ? (x - 80) * .35 : -x * .285 + 7}) scale(${i % 3 === 0 ? .48 : .61})`}>
        <GroundLeaves p={p} lean={i % 2 ? -1 : 1} />
      </g>)}
      <Poppy x={-26} y={4} lean={-8} scale={.83} p={p} />
      <Poppy x={36} y={-10} lean={5} scale={.93} p={p} />
      <Poppy x={81} y={-13} lean={9} scale={.76} p={p} />
      {tulips.map(([x, y, scale, pink, lean]) => <Tulip key={x} x={x} y={y} scale={scale} pink={!!pink} lean={lean} p={p} />)}
      {/* Small foreground leaves overlap the soil lip and the nearby setting stones. */}
      {[-101, -50, -3, 52, 91].map((x, i) => <g key={x} transform={`translate(${x} ${x > 80 ? 13 : -x * .285 + 17}) scale(.42)`}>
        <GroundLeaves p={p} lean={i % 2 ? -1 : 1} />
      </g>)}
    </g>
  </YardObject>;
}
