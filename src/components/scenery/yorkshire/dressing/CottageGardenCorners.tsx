import { useId, type ReactNode } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { YardObject } from '../../../../features/yard-editor/YardWorld';
import { YARD_OBJECTS } from '../../../../features/yard-editor/yardLayout';
import { timberColor } from '../../../architecture/TimberFloorMaterial';
import { Grass, Plant } from '../vegetation/MeadowVegetationAssets';
import { meadowPlantPaletteCss } from '../vegetation/meadowPalette';
import { BirdbathGarden } from './BirdbathGarden';
import { CottageFlowerBorder } from './CottageFlowerBorder';
import { SeedpodGardenLights } from './SeedpodGardenLights';

type Palette = ReturnType<typeof gardenPalette>;
type CornerId = 'cottage_potting_corner' | 'cottage_firewood';

function gardenPalette(theme: YorkshireSceneTheme) {
  const time = theme.isNight ? 'night' : theme.timeOfDay ?? 'day';
  const wood = (hex: string) => timberColor(hex, time);
  const colours = theme.isNight
    ? { clay: '#88644f', clayShade: '#604d40', clayLight: '#aa8565', soil: '#30352d', teal: '#4d7270', tealShade: '#385658', tealLight: '#73968a', linen: '#a5aa92', leaf: '#587049', leafDeep: '#344d39', flower: '#8b659c', flowerLight: '#bba4c5', stone: '#788174', stoneLight: '#a1a596', stoneShade: '#535f59', water: '#527b83', waterShade: '#365360', waterLight: '#9bb6b7', enamel: '#a8b3a8', enamelLight: '#c4ccba', enamelShade: '#778d85', enamelRim: '#3b535e', bloomLeaf: '#587c4e', bloomLeafLight: '#829b66' }
    : theme.timeOfDay === 'dusk'
      ? { clay: '#b47a55', clayShade: '#88543d', clayLight: '#d49e71', soil: '#47382a', teal: '#71958a', tealShade: '#4c706b', tealLight: '#a6b7a0', linen: '#d5c49e', leaf: '#7c8e49', leafDeep: '#526341', flower: '#a269ae', flowerLight: '#d4b0d0', stone: '#9f9d82', stoneLight: '#c7bea1', stoneShade: '#787e6c', water: '#88aaa9', waterShade: '#5c8288', waterLight: '#c7d9cb', enamel: '#d6d8bd', enamelLight: '#ece6ca', enamelShade: '#a4b5a0', enamelRim: '#566d72', bloomLeaf: '#7b9c4e', bloomLeafLight: '#b3c777' }
      : { clay: '#bc815b', clayShade: '#8e5a43', clayLight: '#dca577', soil: '#493a2a', teal: '#6e9e98', tealShade: '#4b7676', tealLight: '#aac5b4', linen: '#ded1ae', leaf: '#7a9852', leafDeep: '#486b43', flower: '#9861b3', flowerLight: '#d2aede', stone: '#a3a58f', stoneLight: '#cdcbb5', stoneShade: '#788476', water: '#86b3ba', waterShade: '#548795', waterLight: '#d5e7df', enamel: '#dbe2cc', enamelLight: '#f0f0d9', enamelShade: '#a4b8aa', enamelRim: '#486976', bloomLeaf: '#699c4c', bloomLeafLight: '#a6c96c' };
  return { ...colours, top: wood('#bc955e'), face: wood('#9b7246'), end: wood('#755236'), edge: wood('#d2ad73'), dark: wood('#513e2c'), bark: wood('#67513a'), cut: wood('#c5a26e') };
}

const point = (u: number, v: number, h: number) => `${u - v},${.285 * (u + v) - h}`;

/** Blocks follow the cottage's ground axes; height stays upright. */
function Timber({ u, v, width, depth, height, lift = 0, p }: {
  u: number; v: number; width: number; depth: number; height: number; lift?: number; p: Palette;
}) {
  const a = point(u, v, lift + height), b = point(u + width, v, lift + height);
  const c = point(u + width, v + depth, lift + height), d = point(u, v + depth, lift + height);
  return <g strokeLinejoin="round">
    <path d={`M${d} L${c} ${point(u + width, v + depth, lift)} ${point(u, v + depth, lift)}Z`} fill={p.face} />
    <path d={`M${b} L${c} ${point(u + width, v + depth, lift)} ${point(u + width, v, lift)}Z`} fill={p.end} />
    <path d={`M${a} L${b} ${c} ${d}Z`} fill={p.top} />
    <path d={`M${d} L${c} ${b}`} fill="none" stroke={p.edge} strokeWidth=".65" opacity=".65" />
  </g>;
}

function PottedBlooms({ p, kind }: { p: Palette; kind: 'daisy' | 'viola' }) {
  if (kind === 'daisy') return <g transform="translate(0 -14) scale(.53)"><Plant species="daisy" /></g>;
  return <g transform="translate(0 -10)">
    <path d="M0,1 Q-3,-6 -6,-11 M0,1 Q2,-9 5,-14 M0,1 Q6,-3 9,-7" stroke={p.leafDeep} strokeWidth=".85" fill="none" />
    <path d="M-1,-1 Q-10,-2 -9,-7 Q-3,-8 -1,-1 M1,-2 Q4,-9 8,-8 Q9,-3 1,-2 M0,1 Q-6,4 -8,0 Q-5,-3 0,1Z" fill={p.bloomLeaf} />
    <path d="M-6,-6 Q-3,-5 -1,-1 M3,-3 Q4,-6 6,-7 M-5,0 Q-2,0 0,1" stroke={p.bloomLeafLight} strokeWidth=".55" fill="none" />
    {[[-6,-11,.87],[5,-14,1],[9,-7,.68]].map(([x,y,scale], i) => <g key={i} transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M0,1 C-5,1 -5,-3 -3,-4 Q-1,-5 0,-2 Q1,-6 4,-4 Q7,-1 2,1 Q5,4 1,5 Q-2,6 -2,3 Q-6,4 -5,1Z" fill={p.flower} />
      <path d="M-3,-3 Q-1,-4 0,0 Q1,-3 3,-3 M-1,2 Q0,4 2,3" stroke={p.flowerLight} strokeWidth=".8" fill="none" />
      <ellipse cy=".6" rx="1.05" ry=".75" fill={p.edge} />
    </g>)}
  </g>;
}

function EnamelPlanter({ p }: { p: Palette }) {
  const id = 'viola-enamel-' + useId().replace(/:/g, '');
  return <g data-garden-planter="enamel">
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2=".15">
      <stop stopColor={p.enamelLight} /><stop offset=".3" stopColor={p.enamel} />
      <stop offset=".75" stopColor={p.enamel} /><stop offset="1" stopColor={p.enamelShade} />
    </linearGradient></defs>
    <ellipse cy=".8" rx="9.5" ry="2.1" fill={p.dark} opacity=".18" />
    {/* Repurposed enamel pan: two loop handles, rolled blue rim and a rounded base. */}
    <path d="M-9,-10.2 Q-17,-12 -16,-7 Q-15,-4 -10,-5.7 M9.5,-10 Q17,-12 16.2,-7.1 Q15,-4.5 10,-5.6" stroke={p.enamelRim} strokeWidth="1.6" fill="none" />
    <path d="M-10.7,-12.1 C-11,-8.5 -10.8,-3.6 -7,-1 Q-.5,1.5 6.8,-.7 C10.4,-3 11.1,-7.4 10.8,-12Z" fill={`url(#${id})`} />
    <path d="M-6.7,-.8 Q-.2,.6 6.4,-.6 L6.1,.5 Q0,2 -6.2,.4Z" fill={p.enamelShade} />
    <ellipse cy="-12" rx="11.2" ry="3" fill={p.enamelRim} />
    <ellipse cy="-12.2" rx="9.8" ry="2.2" fill={p.enamelLight} />
    <ellipse cy="-12" rx="8.7" ry="1.65" fill={p.soil} />
    <g transform="translate(0 -2)"><PottedBlooms p={p} kind="viola" /></g>
    <path d="M-11,-11.9 Q-7.5,-9 0,-9 Q8,-9.1 11,-12" stroke={p.enamelRim} strokeWidth="1.15" fill="none" />
    <path d="M-7.8,-6.2 Q-8,-4.6 -6.8,-3.6 M-4,-1.8 l2,.4" stroke={p.enamelLight} strokeWidth=".7" fill="none" />
    <path d="M4,-2.4 l1.8,-.1 M8,-8 l.7,-.3" stroke={p.enamelRim} strokeWidth=".55" opacity=".55" />
  </g>;
}

function Pot({ p, kind }: { p: Palette; kind: 'glazed' | 'enamel' }) {
  const id = 'garden-pot-' + useId().replace(/:/g, '');
  const glazed = kind === 'glazed';
  if (!glazed) return <EnamelPlanter p={p} />;
  return <g data-garden-planter={kind}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2=".2">
      <stop stopColor={glazed ? p.tealLight : p.clayLight} /><stop offset=".32" stopColor={glazed ? p.teal : p.clay} />
      <stop offset=".75" stopColor={glazed ? p.teal : p.clay} /><stop offset="1" stopColor={glazed ? p.tealShade : p.clayShade} />
    </linearGradient></defs>
    <ellipse cy=".8" rx={glazed ? 7 : 10} ry="1.9" fill={p.dark} opacity=".19" />
    <path d={glazed ? 'M-7.5,-14 C-8.2,-10 -8.5,-4 -5.8,-1.1 Q-.3,1.8 5.5,-.8 C8.4,-4 8.9,-10 7.6,-14Z' : 'M-11,-10 C-10.8,-6.5 -9.2,-2.1 -5.7,-.7 Q.7,1.5 6.4,-.9 C9.5,-3 11,-6.9 11.1,-10Z'} fill={`url(#${id})`} />
    <path d={glazed ? 'M-4.7,-1.1 Q0,.3 4.5,-.9 L4.3,.4 Q0,1.9 -4.4,.4Z' : 'M-5.5,-.7 Q0,.8 5.5,-.7 L5.1,.5 Q0,2 -5.2,.5Z'} fill={glazed ? p.tealShade : p.clayShade} />
    <ellipse cy={glazed ? -14 : -10} rx={glazed ? 8.2 : 11.5} ry={glazed ? 2.7 : 3.4} fill={glazed ? p.tealLight : p.clayLight} />
    <ellipse cy={glazed ? -14 : -10} rx={glazed ? 6.7 : 9.8} ry={glazed ? 1.8 : 2.35} fill={p.soil} />
    <PottedBlooms p={p} kind={glazed ? 'daisy' : 'viola'} />
    <path d={glazed ? 'M-8,-14 Q-5.5,-11.5 0,-11.3 Q5,-11.4 8,-14 M-5.5,-9 Q-6,-6 -4.9,-4' : 'M-11.3,-10 Q-8,-6.7 0,-6.6 Q8,-6.8 11.3,-10 M-7.5,-4.8 Q-3,-3.2 1,-3.6'} stroke={glazed ? p.tealLight : p.clayLight} strokeWidth={glazed ? .65 : .55} fill="none" opacity=".75" />
    {!glazed && <path d="M-6,-5 l2,.4 M3,-3.8 l1.5,-.3" stroke={p.clayShade} strokeWidth=".55" fill="none" opacity=".5" />}
  </g>;
}

function Flowers({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${flip ? -.65 : .65} .65)`}>
    <Grass type="woven" scale={.48} />
    <g transform="translate(-11 1) scale(.68)"><Plant species="daisy" /></g>
    <g transform="translate(13 3) scale(.48)"><Plant species="clover" /></g>
    <Grass type="short" x={16} y={4} scale={.31} flip />
  </g>;
}

function Corner({ id, theme, children }: { id: CornerId; theme: YorkshireSceneTheme; children: ReactNode }) {
  const scope = 'cottage-garden-' + useId().replace(/:/g, '');
  const anchor = YARD_OBJECTS[id];
  return <YardObject id={id}>
    <g id={scope} data-cottage-garden={id} transform={`translate(${anchor.x} ${anchor.y})`} pointerEvents="none" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
      <style>{meadowPlantPaletteCss(theme, `#${scope}`)}</style>
      {children}
    </g>
  </YardObject>;
}

function WorkLeg({ u, v, p }: { u: number; v: number; p: Palette }) {
  return <g transform={`translate(${u - v} ${.285 * (u + v)})`}>
    <ellipse cy="1" rx="4.5" ry="1.5" fill={p.dark} opacity=".16" />
    <path d="M-2.7,-41.8 L2.1,-40.4 1.5,.5 Q0,1.2 -2,.2Z" fill={p.face} />
    <path d="M2.1,-40.4 L4,-41 3.2,-.2 1.5,.5Z" fill={p.end} />
    <path d="M-1.7,-37.5 Q-1.8,-25 -1,-16 M-.5,-8 l.1,6" stroke={p.edge} strokeWidth=".5" opacity=".4" fill="none" />
  </g>;
}

function PottingCorner({ theme }: { theme: YorkshireSceneTheme }) {
  const p = gardenPalette(theme);
  const id = 'potting-timber-' + useId().replace(/:/g, '');
  return <Corner id="cottage_potting_corner" theme={theme}>
    <title>园艺换盆台、雏菊釉盆与堇花搪瓷小盆</title>
    {/* Sheltered plants grow behind the workbench; its standing side stays clear. */}
    <Flowers x={4} y={-26} />
    <Flowers x={38} y={-16} flip />
    <ellipse cy="4" rx="48" ry="8" fill={p.dark} opacity=".08" />
    <defs><linearGradient id={id} x1="0" y1="0" x2=".3" y2="1">
      <stop stopColor={p.top} /><stop offset=".58" stopColor={p.top} /><stop offset="1" stopColor={p.face} />
    </linearGradient></defs>
    {[-28, 25].map(u => <WorkLeg key={u} u={u} v={-13} p={p} />)}
    <Timber u={-30} v={-10} width={61} depth={21} height={2.5} lift={9} p={p} />
    <g transform="translate(-10 -15)" data-potting-soil-bag="supported">
      <ellipse cy="1" rx="10" ry="2.5" fill={p.dark} opacity=".24" />
      <path d="M-8.5,-1 C-10,-5 -9,-11 -6,-17 L-5,-21 5,-20 5.5,-16 Q10,-8 9.1,-1 Q2,3 -8.5,-1Z" fill={p.linen} />
      <path d="M5,-20 L5.5,-16 Q10,-8 9.1,-1 L4.4,.7 Q6,-7 2,-16Z" fill={p.face} opacity=".28" />
      <path d="M-5,-21 Q0,-19 5,-20 M-7,-4 Q-3,-5 -1,-3 M5,-2 l2,-1" stroke={p.dark} opacity=".55" strokeWidth=".65" fill="none" />
      <path d="M-1,-7 Q-7,-9 -5,-12 Q-1,-14 0,-8 Q2,-14 5,-12 Q7,-8 -1,-7Z" fill={p.leafDeep} />
    </g>
    {/* The trowel is stored flat on the lower shelf, beside the soil sack. */}
    <g data-potting-trowel="lower-shelf" transform="translate(10 37.5)">
      <path d="M-5,-48.9 L7,-45.5 Q13,-43 19,-42.5" stroke={p.dark} strokeWidth="2.8" opacity=".18" fill="none" />
      <path d="M-6,-50 L5,-46.9" stroke={p.end} strokeWidth="2.8" />
      <path d="M-5.6,-50.5 L3.8,-47.8" stroke={p.edge} strokeWidth=".8" />
      <path d="M4,-47.3 L8,-46.2" stroke={p.stoneShade} strokeWidth="1.1" />
      <path d="M7,-47.1 Q12,-48 18.5,-43.6 Q14.3,-40.9 8,-44.4Z" fill={p.stoneShade} />
      <path d="M8,-46.8 Q12,-46.9 17,-43.7 L10,-44.4Z" fill={p.stoneLight} />
    </g>
    {[-28, 25].map(u => <WorkLeg key={u} u={u} v={9} p={p} />)}
    <Timber u={-29} v={10} width={60} depth={3} height={5} lift={35} p={p} />
    {/* Slightly worn edges, plank colour and quiet grain carry the handmade wood. */}
    <path d="M-50,-50.7 Q-14,-40.5 22,-30.4 L22,-26.9 Q-14,-36.7 -50,-47.2Z" fill={p.face} />
    <path d="M22,-30.4 L53,-39.1 52.8,-35.6 22,-26.9Z" fill={p.end} />
    <path d="M-19,-59.6 Q17,-50 53,-39.1 Q38,-34.7 22,-30.4 Q-14,-40.3 -50,-50.7 Q-35,-55 -19,-59.6Z" fill={`url(#${id})`} />
    <path d="M-29,-57.2 Q7,-47.2 43,-36.7 M-39,-54.3 Q-3,-44 33,-33.8" stroke={p.dark} strokeWidth=".65" opacity=".48" fill="none" />
    <path d="M-49,-50.5 Q-13,-40.2 22,-30.6 L51,-38.8" stroke={p.edge} strokeWidth=".75" fill="none" opacity=".72" />
    <path d="M-40,-50 l10,2.8 M-18,-51 q9,1.1 15,4.1 M10,-38 l8,2.3 M30,-41 l8,2.2" stroke={p.dark} opacity=".4" strokeWidth=".48" fill="none" />
    <path d="M-17,-42 Q-13,-43 -10,-40.3 Q-12,-39 -17,-42Z" stroke={p.face} strokeWidth=".55" fill="none" />
    <g transform="translate(-22 -51)"><Pot p={p} kind="glazed" /></g>
    <g transform="translate(23 -38)"><Pot p={p} kind="enamel" /></g>

  </Corner>;
}

function TeaService({ p }: { p: Palette }) {
  return <g data-side-table-tea="">
    <g transform="translate(-4 -16) scale(.72)">
      <path d="M-4,-5 Q-11,-9 -11,-4 Q-11,0 -5,-1" fill="none" stroke={p.tealShade} strokeWidth="2.2" />
      <path d="M-6,-5 Q-7,2 0,2 Q7,2 6,-5 L10,-8 9,-10 4,-7Z" fill={p.teal} />
      <ellipse cy="-5.5" rx="5.7" ry="1.6" fill={p.tealLight} />
      <ellipse cy="-6.2" rx="3" ry="1.2" fill={p.teal} />
      <circle cy="-7.6" r="1" fill={p.tealShade} />
      <path d="M-4,-3 Q-5,-1 -3,0" stroke={p.tealLight} strokeWidth=".7" fill="none" />
    </g>
    <g transform="translate(7 -13.6) scale(.8)">
      <path d="M3,-4 Q7,-5 6,-2 Q5,0 3,-1" fill="none" stroke={p.linen} strokeWidth="1.2" />
      <path d="M-3,-4 L-2,0 Q0,1 2,0 L3,-4Z" fill={p.linen} />
      <ellipse cy="-4" rx="3" ry="1.1" fill={p.clayShade} />
    </g>
  </g>;
}

/** A tiny piece of rootwood furniture: forked boughs cradle a honey-coloured slab. */
export function CottageTeaSideTable({ theme }: { theme: YorkshireSceneTheme }) {
  const p = gardenPalette(theme);
  const time = theme.isNight ? 'night' : theme.timeOfDay ?? 'day';
  const c = (hex: string) => timberColor(hex, time);
  const root = c('#906247'), shadow = c('#61443b'), light = c('#bb8c55');
  const id = 'budwood-table-' + useId().replace(/:/g, '');
  return <g data-cottage-side-table="budwood" strokeLinecap="round" strokeLinejoin="round">
    <defs><linearGradient id={id} x1="0" y1="0" x2=".4" y2="1">
      <stop stopColor={c('#e0b56b')} /><stop offset=".55" stopColor={c('#d1a05b')} /><stop offset="1" stopColor={c('#bb824d')} />
    </linearGradient></defs>
    <ellipse cy="1.8" rx="13" ry="3" fill={p.dark} opacity=".17" />
    <path d="M2,-7 Q6,-4 9,-4 Q13,-3 10,-.8 Q4,1 -1,-1Z" fill={shadow} />
    <path d="M-2,-12 Q-5,-13 -8,-11 Q-10,-12 -10,-15 L-7,-16 Q-6,-12 -2,-14 Q1,-16 5,-14 Q8,-12 10,-15 L12,-13 Q10,-8 4,-9 C2,-4 5,-1 10,.4 Q12,2.1 8,2.3 Q3,2.6 0,-.1 Q-3,2.9 -9,3 Q-13,3 -11,.7 Q-5,-1 -4,-4 Q-2,-7 -2,-12Z" fill={root} />
    <path d="M2,-13 Q5,-11 4,-9 C2,-4 5,-1 10,.4 Q12,2.1 8,2.3 Q2,2 -1,-1 Q1,-5 0,-8Z" fill={shadow} />
    <path d="M-8,1 Q-2,-1 -1,-5 Q1,-9 -2,-12 M-7,-14 Q-6,-11 -3,-11 M5,-12 l3,-1" fill="none" stroke={light} strokeWidth=".8" />
    <path d="M-.8,-9 Q-3.8,-6.2 -8.4,-9 L-9,-8 Q-4.5,-4.6 .1,-7.5Z" fill={root} />
    <path d="M-1.4,-8.7 Q-4,-6.5 -7.5,-8.4" stroke={light} strokeWidth=".45" opacity=".5" fill="none" />
    <path d="M-8,-8.4 Q-14,-8 -13,-12 Q-8,-12 -8,-8.4Z" fill={theme.isNight ? '#5f8a60' : '#83af62'} />
    <path d="M-8,-8.5 Q-9,-13 -5,-13 Q-3,-10 -8,-8.5Z" fill={theme.isNight ? '#87a46b' : '#b8cf75'} />
    <path d="M-14,-15.2 Q-14.7,-11.4 -6,-9.6 Q3,-7.7 12.9,-11.6 L14.4,-15.2Z" fill={c('#ad7448')} />
    <path d="M-14,-15.9 Q-12.8,-20.4 -5,-20.1 Q1,-22.5 6,-20 Q13,-20 14.5,-16.9 C17,-13.7 10,-10.6 2,-10.6 Q-9,-10.1 -14,-14.6Z" fill={`url(#${id})`} />
    <path d="M-13.5,-14.8 Q-8,-10.2 2,-10.9 Q10,-11 14,-14.9" fill="none" stroke={c('#edca8d')} strokeWidth=".65" />
    <path d="M-10,-16.2 Q-7,-18.6 -3,-17.4 M3,-18.9 Q8,-19.1 10,-17 M-6,-14.6 Q-3,-13 1,-13.3" stroke={c('#98633d')} strokeWidth=".48" opacity=".58" fill="none" />
    <path d="M3,-11.2 Q4,-12.2 5.2,-11.7 Q4,-11.1 5,-10.5 Q3.9,-10 3,-11.2Z" fill={c('#f0cf85')} />
    <TeaService p={p} />
  </g>;
}

function Log({ u, height, p, variant }: { u: number; height: number; p: Palette; variant: number }) {
  const x = u - 11, y = .285 * (u + 11) - height;
  // Tangent supports of the SAME elliptical section at both ends of a full round log.
  const angle = 16 * Math.PI / 180, a = 6.3, b = 4.8, dx = 25, dy = -7;
  const c = Math.cos(angle), s = Math.sin(angle);
  const xx = a*a*c*c + b*b*s*s, xy = (a*a-b*b)*s*c, yy = a*a*s*s + b*b*c*c;
  const nx = -dy, ny = dx, length = Math.sqrt(nx*(xx*nx+xy*ny) + ny*(xy*nx+yy*ny));
  const tx = (xx*nx + xy*ny)/length, ty = (xy*nx + yy*ny)/length;
  return <g transform={`translate(${x} ${y})`} data-round-firewood="full-cylinder">
    <path d={`M${-tx},${-ty} L${dx-tx},${dy-ty} A${a},${b} 16 0 1 ${dx+tx},${dy+ty} L${tx},${ty}Z`} fill={variant % 2 ? p.end : p.bark} />
    <path d={`M${-tx*.72},${-ty*.72} Q11,-7.4 ${dx-tx*.72},${dy-ty*.72}`} stroke={p.face} strokeWidth="1.6" fill="none" opacity=".7" />
    <path d="M6,-1.8 Q14,-3.2 25,-7 M9,1 Q18,-1 27,-4" stroke={p.dark} strokeWidth=".65" opacity=".7" fill="none" />
    <ellipse rx={a} ry={b} transform="rotate(16)" fill={p.cut} stroke={p.bark} strokeWidth="1.25" />
    <path d={variant % 2 ? 'M-3,-2 Q2,-4 3,0 Q3,2 -1,2 M-1,0 l-3,3' : 'M-3,1 Q-3,-2 0,-2 Q3,-1 2,1 M2,1 l3,1'} stroke={p.face} strokeWidth=".6" fill="none" />
  </g>;
}

function FirewoodCorner({ theme }: { theme: YorkshireSceneTheme }) {
  const p = gardenPalette(theme);
  return <Corner id="cottage_firewood" theme={theme}>
    <title>矮木柴架、劈柴墩与花草</title>
    <Flowers x={33} y={-3} />
    <ellipse cy="6" rx="48" ry="8" fill={p.dark} opacity=".1" />
    {[-29, 30].map(u => <Timber key={u} u={u} v={-15} width={4} depth={4} height={36} p={p} />)}
    <Timber u={-31} v={-15} width={67} depth={29} height={3} lift={5} p={p} />
    {[-21, -7, 7, 21].map((u, i) => <Log key={u} u={u} height={12} p={p} variant={i} />)}
    {[-14, 0, 14].map((u, i) => <Log key={u} u={u} height={21} p={p} variant={i + 1} />)}
    {[-6, 8].map((u, i) => <Log key={u} u={u} height={30} p={p} variant={i} />)}
    {[-29, 30].map(u => <Timber key={u} u={u} v={11} width={4} depth={4} height={27} p={p} />)}
    <Timber u={-30} v={12} width={64} depth={3} height={4} lift={4} p={p} />
    <g transform="translate(-47 16)">
      <ellipse cy="1" rx="12" ry="3" fill={p.dark} opacity=".14" />
      <path d="M-11,-13 L-10,0 Q0,5 10,0 L11,-13Z" fill={p.bark} />
      <path d="M-7,-11 l1,10 M5,-11 l1,11" stroke={p.dark} strokeWidth="1.1" />
      <ellipse cy="-13" rx="11" ry="3.7" fill={p.cut} />
      <path d="M-6,-13 Q0,-16 6,-13 Q2,-11 -3,-12 M0,-12 l3,2" stroke={p.face} strokeWidth=".65" fill="none" />
      {/* The axe leans against the stump: a wide steel head, clear eye and a full handle. */}
      <g data-firewood-axe="leaning" transform="translate(-12 1)">
        <ellipse cx="-2" cy=".5" rx="5" ry="1" fill={p.dark} opacity=".2" />
        <path d="M-2,-3 Q2,-13 9,-28" stroke={p.end} strokeWidth="2.8" fill="none" />
        <path d="M-2,-4 Q2,-13 8.6,-27.8" stroke={p.edge} strokeWidth=".8" fill="none" />
        <path d="M-8,-7 Q-8,-3 -6,.3 L1,-1 3,-4 1,-6Z" fill={p.stoneShade} />
        <path d="M-8,-7 Q-8,-3 -6,.3 L-4.8,-.2 Q-6,-3 -6.1,-6.3Z" fill={p.stoneLight} />
        <path d="M-1.4,-5.7 L1,-6 2.5,-4 -1,-3Z" fill={p.dark} />
        <path d="M-1,-5.3 L.6,-5.5 1.4,-4.1 -.7,-3.8Z" fill={p.face} />
      </g>
    </g>
    <Flowers x={-22} y={22} flip />
  </Corner>;
}

/** Each complete corner keeps its own stable placement and local companions. */
export function CottageGardenCorners({ theme }: { theme: YorkshireSceneTheme }) {
  return <><PottingCorner theme={theme} /><FirewoodCorner theme={theme} /><CottageFlowerBorder theme={theme} /><BirdbathGarden theme={theme} /><SeedpodGardenLights theme={theme} /></>;
}
