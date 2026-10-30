import React, { useId } from 'react';
import { timberColor, timberMaterial, timberPlankTones, timberSeam, timberJoint, TimberFinishGradient, SparseTimberGrain } from './TimberFloorMaterial';
import type { YorkshireSceneTheme } from '../scenery/yorkshire/landscapeTypes';

type Point = readonly [number, number];
type Curve = readonly [Point, Point, Point, Point];
type Props = { theme: YorkshireSceneTheme };

const FLOOR_SLOPE = .285;
// Wall thickness must not advance the wall/floor joint into the rooted posts.
const wallFoot = (x: number): Point => [x, 58 + Math.abs(x) * FLOOR_SLOPE];
const skirtingFace = (a: number, b: number) => polygon([
  wallFoot(a), wallFoot(b),
  [b, wallFoot(b)[1] - 4.5], [a, wallFoot(a)[1] - 4.5],
]);
const LOFT_LEVEL = -110;
const GALLERY_DROP = 48;
const stairRun = { start: 125, end: 157, near: 55, far: 30, steps: 4, roofInset: 9 };
const galleryEnd = 187;
const floorPoint = (u: number, v: number, drop = 0): Point => [u - v, LOFT_LEVEL + (u + v) * FLOOR_SLOPE + drop];
const stairRearPoint = (u: number, drop = 0): Point => {
  const easeRun = (stairRun.end-stairRun.start)*2/stairRun.steps;
  return floorPoint(u, stairRun.far + Math.max(0,1-(u-stairRun.start)/easeRun)*stairRun.roofInset, drop);
};
const polygon = (points: Point[]) => `M${points.join(' L')} Z`;

// All geometry uses the original cottage's local SVG coordinates. The floor,
// furniture and occupants retain their existing transforms and contact anchors.
const largeBack: Curve = [[-307, -12], [-222, -28], [-133, -254], [22, -185]];
const largeFront: Curve = [[-293, 6], [-195, 1], [-148, -137], [22, -167]];
const smallBack: Curve = [[22, -185], [117, -105], [245, -22], [294, -76]];
const smallFront: Curve = [[22, -167], [89, -88], [215, 4], [294, -47]];
const curvePath = (c: Curve) => `M${c[0]} C${c[1]} ${c[2]} ${c[3]}`;
const shellPath = (a: Curve, b: Curve) => `${curvePath(a)} Q${a[3][0] + 10},${b[3][1] - 7} ${b[3]}
  C${b[2]} ${b[1]} ${b[0]} Q${a[0][0] - 5},${b[0][1]} ${a[0]} Z`;
function curvePoint(c: Curve, t: number): Point {
  const s = 1 - t;
  const axis = (i: 0 | 1) => s ** 3 * c[0][i] + 3 * s * s * t * c[1][i]
    + 3 * s * t * t * c[2][i] + t ** 3 * c[3][i];
  return [axis(0), axis(1)];
}
function skinPoint(a: Curve, b: Curve, u: number, v: number): string {
  const p = curvePoint(a, u), q = curvePoint(b, u);
  return `${(p[0] + (q[0] - p[0]) * v).toFixed(2)},${(p[1] + (q[1] - p[1]) * v).toFixed(2)}`;
}

function palette(theme: YorkshireSceneTheme) {
  const time = theme.isNight ? 'night' : theme.timeOfDay ?? 'day';
  const wood = timberMaterial(time);
  // The existing floor and furniture establish amber / walnut wood. Upper
  // boards catch more light, but share their hue instead of introducing pale ash.
  if (theme.isNight) return { wall: '#b8a98f', wallShade: '#a49379', wallEnd: '#a6957b', wallEndShade: '#8e7c64', lining: '#876b49',
    liningLight: '#ac8b5c', time, ...wood,
    skin: '#526b45', skinLight: '#819264', skinShade: '#2e4836', skinEdge: '#8b8765',
    moss: '#485f3d', mossLight: '#7c8d61', rope: '#a5916b', ropeLight: '#c3b18b' };
  if (theme.timeOfDay === 'dusk') return { wall: '#c3aa8c', wallShade: '#a89077', wallEnd: '#b29a7b', wallEndShade: '#958167', lining: '#8b6642',
    liningLight: '#b28b59', time, ...wood,
    skin: '#7d8945', skinLight: '#c2b56a', skinShade: '#455c34', skinEdge: '#bda464',
    moss: '#607441', mossLight: '#9c9e63', rope: '#b89a67', ropeLight: '#d4bb88' };
  return { wall: '#d5c6aa', wallShade: '#c1b59b', wallEnd: '#bfae92', wallEndShade: '#a7977c', lining: '#94714b', liningLight: '#bda074',
    time, ...wood,
    skin: '#819d4e', skinLight: '#c1ce7c', skinShade: '#42653c', skinEdge: '#bda46b',
    moss: '#56723f', mossLight: '#96a46b', rope: '#b69c73', ropeLight: '#d4c29a' };
}
type Palette = ReturnType<typeof palette>;

/** Closed, individually drawn silhouettes carry the taper and fork junctions.
 * Broad wood facets and sparse lengthwise grain avoid dotted/tubular bark. */
function Timber({ d, facet, shade, grain, p: base, postSide }: {
  d: string; facet?: string; shade?: string; grain?: string; p: Palette; postSide?: 'left' | 'right';
}) {
  // Keep the approved old-wall oak base, with the same daylight response as floors.
  const p = postSide ? { ...base, ...timberMaterial(base.time, postSide) } : base;
  const id = `branch-${useId().replace(/:/g, '')}`;
  return <g strokeLinejoin="round">
    <defs>
      <linearGradient id={id} x1="0" y1=".15" x2="1" y2=".65">
        <stop stopColor={postSide ? p.wood : p.endGrain} /><stop offset=".35" stopColor={p.wood} /><stop offset=".7" stopColor={p.wood} /><stop offset="1" stopColor={p.woodShade} />
      </linearGradient>
      <linearGradient id={`${id}-light`} x1="0" y1="0" x2=".65" y2="1">
        <stop stopColor={p.endGrain} stopOpacity=".1" /><stop offset=".35" stopColor={p.woodLight} stopOpacity=".75" /><stop offset=".7" stopColor={p.endGrain} stopOpacity=".4" /><stop offset="1" stopColor={p.wood} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path d={d} fill={`url(#${id})`} stroke={p.dark} strokeWidth=".55" />
    {facet && <path d={facet} fill={`url(#${id}-light)`} opacity=".42" />}
    {shade && <path d={shade} fill={p.woodShade} opacity=".5" />}
    {grain && <path d={grain} fill="none" stroke={p.dark} strokeWidth=".5" opacity=".25" />}
  </g>;
}

/** One outline supplies the rear tree and both foreground crossings of the deck. */
const centralTree = {
  d: 'M-40,71 Q-31,55 -36,32 L-44,10 Q-49,-8 -45,-28 L-35,-71 L-35,-103 Q-39,-115 -55,-119 Q-74,-122 -94,-126 L-96,-131 Q-72,-129 -53,-124 Q-43,-122 -37,-116 Q-39,-136 -28,-147 Q-12,-163 7,-173 L14,-169 Q-7,-155 -21,-143 Q-32,-131 -30,-112 L-25,-81 Q-30,-52 -36,-28 Q-42,-10 -38,2 C-35,-11 -29,-20 -28,-31 Q-28,-41 -26.8,-49.5 Q-25.5,-51 -24,-49.8 Q-22.8,-39 -23,-30 C-22,-17 -28,-5 -29,5 Q-32,18 -27,33 Q-27,55 -20,70 Q-28,75 -40,71 Z',
  facet: 'M-36,70 Q-28,52 -34,32 L-36,27 Q-31,48 -33,60 L-31,72 Z M-41,8 Q-46,-9 -41,-31 L-35,-50 Q-39,-28 -41,-12 L-39,4 Z M-33,-73 Q-29,-95 -33,-112 L-30,-106 L-28,-92 L-30,-77 Z M-34,-119 Q-35,-135 -24,-145 L7,-168 L9,-169 Q-13,-155 -26,-139 Q-31,-130 -31,-118 Z M-88,-127 Q-67,-125 -53,-121 L-46,-117 Q-66,-122 -83,-124 Z M-26.5,-49 Q-26,-37 -26.5,-29 L-30,-17 Q-28,-34 -26.5,-49 Z',
  shade: 'M-24,-49.8 Q-22.8,-39 -23,-30 C-22,-17 -28,-5 -29,5 Q-32,18 -27,33 Q-27,55 -20,70 L-27,72 Q-32,54 -32,35 Q-38,18 -34,4 C-31,-10 -25,-20 -25,-30 Z',
  grain: 'M-35,69 Q-29,51 -34,30 M-39,5 Q-44,-10 -40,-26 M-31,-95 Q-32,-102 -32,-110 M-28,-133 L-22,-142 M-32,-7 Q-26,-21 -26,-35',
};
function CentralTree({ p }: { p: Palette }) {
  return <Timber {...centralTree} p={p} postSide="left" />;
}

/** The rack pumpkin's orange/gold lobes, hollowed into a small hanging light. */
function PumpkinBranchLantern({ theme }: Props) {
  const id = `pumpkin-lantern-${useId().replace(/:/g, '')}`;
  const night = theme.isNight;
  const glow = night ? .48 : theme.timeOfDay === 'dusk' ? .28 : .08;
  return <g id="seedpod-pumpkin-lantern" transform="translate(-61 -108)">
    <defs>
      <radialGradient id={`${id}-glow`}>
        <stop stopColor="#ffd372" stopOpacity={glow} />
        <stop offset="1" stopColor="#edac42" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse cy="1" rx="20" ry="17" fill={`url(#${id}-glow)`} />
    {/* The rope loops around the fork; its drop ends at a separate metal bail. */}
    <path d="M-1,-14 Q-4,-18 -1,-18 Q2,-18 1,-15 L0,-11"
      fill="none" stroke="#8a6940" strokeWidth="1" />
    <path d="M-4,-5 Q-5,-11 0,-11 Q5,-11 4,-5" fill="none" stroke="#694829" strokeWidth=".85" />
    {/* Same solid-colour lobe layering as the pumpkin rack; no gray/brown glaze. */}
    <g transform="translate(0 -1.4) scale(.78)">
      <ellipse cx="0" cy="3" rx="10.5" ry="8.5" fill="#c25e00" />
      <ellipse cx="-4.5" cy="3" rx="6.5" ry="8" fill="#ea580c" />
      <ellipse cx="4.5" cy="3" rx="6.5" ry="8" fill="#ea580c" />
      <ellipse cx="-1.8" cy="2.5" rx="4.5" ry="8.2" fill="#f59e0b" />
      <ellipse cx="1.8" cy="2.5" rx="4.5" ry="8.2" fill="#f59e0b" />
      <ellipse cx="0" cy="2" rx="2.5" ry="8.2" fill="#fbbf24" opacity=".9" />
      <path d="M0,-3 Q1,-8 -2,-11 Q-3,-13 -1,-14" stroke="#4d3a1a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <polygon points="-2,10 0,8 2,10 1,12 -1,12" fill="#ca8a04" opacity=".7" />
      <ellipse cx="7" cy="-2" rx="4.2" ry="2.6" fill="#3f6212" transform="rotate(-15 7 -2)" />
      <ellipse cx="7" cy="-2" rx="3.2" ry="1.8" fill="#65a30d" transform="rotate(-15 7 -2)" opacity=".8" />
    </g>
    <path d="M-5,-1 Q-3,-3 -3,0 Q-4,2 -5,-1 Z M3,-1 Q5,-3 5,0 Q4,2 3,-1 Z M-1,1 Q1,0 1,3 Q0,5 -1,3 Z"
      fill={night ? '#ffdf8c' : '#ffe0a0'} stroke="#a55a23" strokeWidth=".35" />
  </g>;
}

/** Small split saplings for the balustrade and ladder, tapering toward b. */
function Sapling({ a, b, width = 3, p }: { a: Point; b: Point; width?: number; p: Palette }) {
  const dx = b[0] - a[0], dy = b[1] - a[1], length = Math.hypot(dx, dy);
  const nx = -dy / length, ny = dx / length;
  const at = (t: number, w: number) => `${a[0] + dx * t + nx * w},${a[1] + dy * t + ny * w}`;
  // The lit side follows the scene's upper-left light, not path direction.
  const lit = nx * -.65 + ny * -.76 > 0 ? 1 : -1;
  return <g strokeLinejoin="round">
    <Timber p={p}
      d={`M${at(0, -width / 2)} Q${at(.32, -width * .6)} ${at(.57, -width * .39)} L${at(1, -width * .3)} L${at(1, width * .3)} Q${at(.63, width * .57)} ${at(.4, width * .39)} L${at(0, width / 2)} Z`}
      facet={`M${at(.04,lit*width*.39)} Q${at(.25,lit*width*.48)} ${at(.48,lit*width*.3)} L${at(.43,lit*width*.08)} Q${at(.23,lit*width*.25)} ${at(.04,lit*width*.22)} Z M${at(.59,lit*width*.33)} L${at(.96,lit*width*.25)} L${at(.9,lit*width*.05)} Z`}
      shade={`M${at(0,-lit*width*.46)} L${at(.4,-lit*width*.34)} L${at(1,-lit*width*.28)} L${at(.66,-lit*width*.13)} Q${at(.3,-lit*width*.24)} ${at(0,-lit*width*.27)} Z`} />
    <path d={`M${at(1,-width*.3)} L${at(1,width*.3)}`} stroke={p.endGrain} strokeWidth=".5" opacity=".6" />
  </g>;
}

/** Fallen pine follows the surface tangent. */
function RoofPine({ back, front, p, small }: { back: Curve; front: Curve; p: Palette; small: boolean }) {
  // Wind gathers needles at two pockets instead of spacing identical ornaments.
  const locations = small
    ? [{ u: .86, v: .56, size: .7, turn: -19 }, { u: .92, v: .29, size: .43, turn: 17 }]
    : [{ u: .18, v: .55, size: .76, turn: 9 }];
  return <g>
    {locations.map(({u,v,size,turn}) => {
      const a = curvePoint(front, u - .015), b = curvePoint(front, u + .015);
      const angle = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
      return <g key={u} transform={`translate(${skinPoint(back, front, u, v).replace(',', ' ')}) rotate(${angle+turn}) scale(${size})`}>
        <g transform="translate(3,-2) rotate(-12)">
          <path d="M-15,2 Q-2,0 16,-2" fill="none" stroke={p.wood} strokeWidth="1.1" />
          {Array.from({ length: 7 }, (_, j) => {
            const x = -10 + j * 3.6, y = .7 - j * .35, n = 6 - j * .4;
            return <g key={j} fill="none" strokeLinecap="round">
              <path d={`M${x},${y} l${-n},${-n * .8} M${x},${y} l${-n + 1},${n * .7} M${x+1},${y} l${-n*.5},${-n}`}
                stroke={p.moss} strokeWidth="1.2" />
              <path d={`M${x},${y} l${-n*.5},${n * .65}`} stroke={p.mossLight} strokeWidth=".65" />
            </g>;
          })}
        </g>
      </g>;
    })}
  </g>;
}

function ShellSkin({ back, front, id, p, small = false }: {
  back: Curve; front: Curve; id: string; p: Palette; small?: boolean;
}) {
  const outline = shellPath(back, front);
  // Broad matte colour variation and interrupted fibres, with no concentric ribs.
  const patina: Point[][] = small ? [
    [[.12,.09],[.19,.04],[.23,.14],[.2,.23],[.17,.19],[.13,.28],[.1,.2]],
    [[.53,.38],[.59,.29],[.63,.35],[.7,.3],[.74,.42],[.67,.49],[.62,.44],[.55,.52]],
    [[.85,.1],[.9,.04],[.96,.18],[.92,.3],[.89,.22],[.85,.28]],
  ] : [
    [[.09,.5],[.15,.39],[.19,.44],[.25,.38],[.28,.51],[.2,.6],[.16,.54],[.12,.64]],
    [[.35,.16],[.41,.06],[.47,.11],[.5,.23],[.46,.29],[.41,.22],[.36,.3]],
    [[.65,.56],[.69,.42],[.76,.48],[.81,.41],[.84,.5],[.79,.62],[.72,.59],[.68,.68]],
    [[.81,.08],[.87,.02],[.94,.12],[.91,.22],[.86,.17],[.82,.25]],
  ];
  const surfaceLoop = (points: Point[]) => {
    const mid = (a: Point, b: Point) => skinPoint(back, front, (a[0]+b[0])/2, (a[1]+b[1])/2);
    return `M${mid(points[points.length-1],points[0])} ${points.map((pt,i) =>
      `Q${skinPoint(back,front,pt[0],pt[1])} ${mid(pt,points[(i+1)%points.length])}`).join(' ')} Z`;
  };
  // One broad sun-facing shoulder; this is a change of plane, not repeated spots.
  const shoulder: Point[] = [[.2,.15],[.32,.09],[.45,.15],[.61,.1],[.73,.23],
    [.66,.34],[.53,.3],[.42,.42],[.3,.31],[.23,.37]];
  const turnedEdge: Point[] = [[.03,.88],[.25,.8],[.44,.85],[.67,.74],[.88,.83],
    [1,.72],[1,1.1],[.66,1.08],[.3,1.07],[0,1.1]];
  const fibres: Point[][] = small ? [
    [[.13,.62],[.16,.53],[.2,.57]], [[.37,.3],[.4,.37],[.44,.34]],
    [[.58,.75],[.61,.61],[.64,.64]], [[.77,.31],[.79,.4],[.83,.36]],
  ] : [
    [[.1,.28],[.13,.36],[.17,.31]], [[.28,.75],[.31,.63],[.35,.67]],
    [[.42,.29],[.46,.37],[.49,.3]], [[.56,.6],[.59,.53],[.63,.62]],
    [[.72,.28],[.75,.37],[.78,.3]], [[.83,.76],[.85,.63],[.89,.67]],
  ];
  return <g>
    <defs>
      <clipPath id={`${id}-clip`}><path d={outline} /></clipPath>
      <linearGradient id={`${id}-skin`} gradientUnits="userSpaceOnUse" x1="-160" y1="-195" x2="140" y2="60">
        <stop stopColor={p.skinLight} /><stop offset=".46" stopColor={p.skin} /><stop offset="1" stopColor={p.skinShade} />
      </linearGradient>
      <linearGradient id={`${id}-shoulder`} x1="0" y1="0" x2=".8" y2="1">
        <stop stopColor={p.skinLight} stopOpacity=".35" />
        <stop offset="1" stopColor={p.skinLight} stopOpacity=".04" />
      </linearGradient>
      <radialGradient id={`${id}-patina`} cx=".48" cy=".52" r=".6">
        <stop stopColor={p.moss} stopOpacity=".28" />
        <stop offset=".55" stopColor={p.moss} stopOpacity=".17" />
        <stop offset="1" stopColor={p.moss} stopOpacity="0" />
      </radialGradient>
    </defs>
    <path d={outline} fill={`url(#${id}-skin)`} stroke={p.skinShade} strokeWidth="1.2" />
    <g clipPath={`url(#${id}-clip)`}>
      <path d={surfaceLoop(shoulder)} fill={`url(#${id}-shoulder)`} />
      <path d={surfaceLoop(turnedEdge)} fill={p.skinShade} opacity={small ? '.27' : '.18'} />
      {patina.map((points,i) => <path key={i} d={surfaceLoop(points)} fill={`url(#${id}-patina)`} opacity={i%2 ? .7 : 1} />)}
      {fibres.map(([a,b,c],i) => <path key={i}
        d={`M${skinPoint(back,front,...a)} Q${skinPoint(back,front,...b)} ${skinPoint(back,front,...c)}`}
        fill="none" stroke={i%2 ? p.skinLight : p.skinShade} strokeWidth={i%2 ? '.8' : '.55'} strokeLinecap="round" opacity=".32" />)}
      {/* Sparse tapered fibres follow the husk, with a few fine splits at the lip. */}
      {Array.from({length: small ? 6 : 9}, (_,i) => {
        const u = .06+((i*.6180339+(small ? .19 : .07))%1)*.86;
        const v = .18+((i*.4142135+.21)%1)*.61;
        return <path key={i} d={`M${skinPoint(back,front,u,v)} Q${skinPoint(back,front,u+.012,v-.01)} ${skinPoint(back,front,u+.028,v+.01)} Q${skinPoint(back,front,u+.012,v+.02)} ${skinPoint(back,front,u,v)} Z`}
          fill={i%3 ? p.skinLight : p.skinShade} opacity={i%3 ? .2 : .16} />;
      })}
      <RoofPine back={back} front={front} p={p} small={small} />
    </g>
    <path d={curvePath(front)} fill="none" stroke={p.skinShade} strokeWidth="3.2" strokeLinecap="round" />
    <path d={curvePath(front)} fill="none" stroke={p.skinEdge} strokeWidth="1.5" strokeLinecap="round" />
    <path d={curvePath(back)} fill="none" stroke={p.skinLight} strokeWidth=".9" opacity=".7" />
  </g>;
}

export function SeedpodCottageShell({ theme }: Props) {
  const id = `seedpod-${useId().replace(/:/g, '')}`;
  const p = palette(theme);
  return <g id="seedpod-cottage-shell" data-cottage-style="seedpod" pointerEvents="none" aria-hidden="true">
    <defs>
      <linearGradient id={`${id}-plaster`} x1="0" y1="0" x2="0" y2="1">
        <stop stopColor={p.liningLight} /><stop offset=".48" stopColor={p.wall} /><stop offset="1" stopColor={p.wall} />
      </linearGradient>
      <linearGradient id={`${id}-lining`} x1="0" y1="0" x2="0" y2="1">
        <stop stopColor={p.dark} /><stop offset=".5" stopColor={p.lining} /><stop offset="1" stopColor={p.liningLight} />
      </linearGradient>
    </defs>
    {/* Wall returns retain their visible thickness; the inner wall and skirting
        terminate on the original floor axes, behind the rooted posts. */}
    <path d={`M-270,-2 L-262,.28 L${wallFoot(-262)} L-270,135 Z`} fill={p.wallEnd} />
    <path d={`M262,-19.72 L270,-22 L270,135 L${wallFoot(262)} Z`} fill={p.wallEndShade} />
    <path d={`M${wallFoot(-262)} L-262,.28 C-196,-24 -129,-113 0,-145.44 L${wallFoot(0)} Z`} fill={`url(#${id}-plaster)`} />
    <path d={`M${wallFoot(0)} L0,-145.44 C89,-116 177,-40 262,-19.72 L${wallFoot(262)} Z`} fill={p.wallShade} />
    <path d="M-270,30 V134 M270,0 V134" fill="none" stroke={p.lining} strokeWidth=".65" opacity=".45" />
    <path d="M-293,6 C-195,1 -148,-137 22,-167 C89,-88 215,4 294,-47 L277,-5 C190,-4 83,-91 0,-111 C-127,-83 -201,13 -273,27 Z"
      fill={`url(#${id}-lining)`} />
    <path d="M-273,27 C-201,13 -127,-83 0,-111 C83,-91 190,-4 277,-5"
      fill="none" stroke={p.wood} strokeWidth=".55" opacity=".18" />
    {[-1, 0, 1].map(i => <path key={i}
      d={`M${-255 + i * 11},${9 + i * 3} Q-151,${-76 + i * 8} -15,${-135 + i * 7} M42,${-139 + i * 6} Q151,${-43 + i * 8} 270,${-20 + i * 5}`}
      fill="none" stroke={p.dark} strokeWidth=".75" opacity=".22" />)}
    <path d={skirtingFace(-262, 0)} fill={p.wood} />
    <path d={skirtingFace(0, 262)} fill={p.dark} />
    <path d={`M-262,${wallFoot(-262)[1]-4.5} L0,53.5 L262,${wallFoot(262)[1]-4.5}`}
      fill="none" stroke={p.woodLight} strokeWidth=".65" opacity=".65" />
    <path d="M-5,57 L0,-145.44 L5,57 Z" fill={p.dark} opacity=".12" />
    <g id="seedpod-rooted-roof-supports">
      {([[-256,136], [256,136], [-29,72]] as Point[]).map(([x,y]) =>
        <ellipse key={x} cx={x + 1} cy={y} rx="12" ry="2.2" fill={p.dark} opacity=".22" />)}
      {/* Side trunks grow continuously from the wall feet into the roof rim. */}
      <g transform="translate(9,0)">
      <Timber p={p} postSide="left" d="M-275,135 Q-267,122 -270,99 L-268,70 Q-271,49 -272,34 C-275,18 -281,9 -288,0 L-284,-3 Q-273,8 -269,24 L-265,39 C-257,25 -254,14 -251,1 Q-248,-13 -240,-27 L-236,-28 Q-246,-9 -247,12 C-249,29 -255,40 -262,49 L-260,72 L-263,101 Q-263,122 -255,135 Q-264,139 -275,135 Z"
        facet="M-272,134 Q-265,116 -267,97 L-265,89 Q-264,111 -267,123 L-265,136 Z M-266,78 L-265,64 L-267,44 Q-255,27 -252,9 Q-248,-14 -239,-26 Q-247,-7 -249,13 Q-252,36 -263,51 L-262,68 Z M-271,28 Q-277,9 -285,-1 Q-276,6 -271,20 Z"
        shade="M-262,49 L-260,72 L-263,101 Q-263,122 -255,135 L-261,136 Q-266,121 -265,108 L-263,79 Z"
        grain="M-270,133 Q-265,119 -267,106 M-266,91 Q-264,73 -266,57 M-270,33 L-273,23 M-260,38 L-254,27" />
      </g>
      <g transform="translate(-9,0)">
      <Timber p={p} postSide="right" d="M255,135 Q263,118 260,94 L262,65 Q260,47 252,32 C242,16 226,2 217,-14 Q209,-29 208,-44 L212,-46 Q215,-29 224,-16 C232,-2 247,11 257,26 L264,39 Q268,16 269,-4 Q268,-25 276,-45 L281,-47 Q274,-26 275,-7 Q276,20 269,51 Q268,69 270,87 Q266,116 275,135 Q266,139 255,135 Z"
        facet="M258,134 Q266,115 263,94 L265,85 Q268,106 263,125 L264,136 Z M265,75 L265,64 Q266,46 258,31 L250,20 Q263,29 267,43 L269,55 Z M242,10 Q223,-5 215,-27 L210,-43 Q213,-23 224,-10 L246,14 Z M270,25 Q273,7 272,-6 Q271,-27 278,-44 Q274,-24 274,-5 L273,19 Z"
        shade="M269,51 Q268,69 270,87 Q266,116 275,135 L269,136 Q264,117 266,97 L266,65 Z"
        grain="M261,133 Q265,120 265,106 M265,90 Q267,72 265,61 M263,45 Q256,27 248,22 M271,16 L272,1" />
      </g>
      {/* Rear fork bears the loft and the crown; its feet are behind the cabinet. */}
      <CentralTree p={p} />
    </g>
    <PumpkinBranchLantern theme={theme} />

  </g>;
}

/** Front pass occludes a short section of flue. Decorative geometry does not
 * intercept existing furniture, room or character pointer/keyboard targets. */
export function SeedpodReadingLoft({ theme }: Props) {
  const p = palette(theme);
  const c = (hex: string) => timberColor(hex, p.time);
  const id = `seedpod-deck-${useId().replace(/:/g, '')}`;
  const deckEnd = floorPoint(stairRun.start, 0);
  const deckThickness = 5;
  // The rear edge follows both wall axes; the front edges keep the floor's ±.285 slope.
  // The rear scribed edge slightly enters the wall, with the actual boards
  // extending to it. No bright backing strip is left between planks and wall.
  const deck = `M-150,-67.25 L-116,-78.1 L-88,-86.2 L-54,-96.8 L-27,-104.1 L0,-112 L28,-104.1 L54,-96 L90,-85.8 L${deckEnd} L-25,-31.625 Z`;
  return <g id="seedpod-reading-loft" data-timber-time={p.time} pointerEvents="none" aria-hidden="true">
    <defs>
      <radialGradient id={`${id}-lamplight`} gradientUnits="userSpaceOnUse" cx="-61" cy="-76" r="45" gradientTransform="translate(0 -38) scale(1 .5)">
        <stop stopColor="#edac54" stopOpacity={p.time === 'night' ? .2 : p.time === 'dusk' ? .09 : 0} />
        <stop offset="1" stopColor="#edac54" stopOpacity="0" />
      </radialGradient>
      <clipPath id={`${id}-outline`}><path d={deck} /></clipPath>
      <TimberFinishGradient time={p.time} id={`${id}-board-light`} face="loftSurface" />
      <linearGradient id={`${id}-eave-shade`} gradientUnits="userSpaceOnUse" x1="0" y1="-112" x2="0" y2="-72">
        <stop stopColor={c("#2a1609")} stopOpacity=".18" /><stop offset="1" stopColor={c("#2a1609")} stopOpacity="0" />
      </linearGradient>
      <TimberFinishGradient time={p.time} id={`${id}-endgrain`} face="left" />
      <TimberFinishGradient time={p.time} id={`${id}-endgrain-right`} face="right" />
      <clipPath id={`${id}-tree-above-deck`}>
        <path d="M-29,-53 H-20 V-19 H-30 Q-26,-27 -29,-35 Z M-90,-180 H25 V-94 L-25.5,-94 Q-29.5,-90.5 -35.8,-93.4 H-90 Z" />
      </clipPath>
      <mask id={`${id}-penetrations`} maskUnits="userSpaceOnUse" x="-180" y="-200" width="380" height="240">
        <rect x="-180" y="-200" width="380" height="240" fill="white" />
        {/* The original flue stays visible through its narrow floor opening. */}
        <path d="M-2.4,-200 H2.4 V-102 Q0,-100 -2.4,-102 Z" fill="black" />
      </mask>
    </defs>
    <path d="M-150,-60 L-25,-23 L86,-55 L86,-62 L-25,-30 L-150,-67 Z" fill={p.dark} opacity=".12" />
    {/* Each wall corbel is a single bent fork, tucked behind the deck fascia. */}
    <g id="seedpod-loft-wall-brackets">
      <path d="M-116,-63 Q-111,-58 -111,-47 L-109,-39 Q-111,-36 -117,-37 L-120,-43 Z M70,-54 Q76,-45 75,-32 L70,-30 L67,-41 Z"
        fill={p.dark} opacity=".14" />
      <Timber p={p} d="M-120,-40 C-122,-48 -126,-55 -135,-60 L-148,-64 L-147,-68 Q-132,-65 -125,-57 Q-120,-53 -117,-47 Q-118,-59 -116,-68 L-112,-69 Q-114,-55 -113,-46 L-112,-39 Q-115,-36 -120,-40 Z"
        facet="M-118,-41 Q-120,-53 -136,-61 Q-125,-57 -120,-50 Q-116,-46 -116,-40 Z"
        shade="M-113,-46 L-112,-39 L-115,-38.5 Q-116,-52 -114,-64 Z"
        grain="M-117,-42 Q-119,-50 -124,-54" />
      <Timber p={p} d="M68,-32 Q63,-42 51,-47 L45,-49 L47,-53 Q60,-50 67,-41 Q66,-49 68,-58 L72,-59 Q70,-46 72,-39 L73,-32 Q71,-30 68,-32 Z"
        facet="M69,-33 Q65,-43 53,-49 Q66,-45 70,-35 Z"
        shade="M71,-48 Q71,-38 73,-32 L70.5,-31.6 Z" />

    </g>
    <g mask={`url(#${id}-penetrations)`}>
      <path d={deck} fill={`url(#${id}-board-light)`} stroke={p.dark} strokeWidth=".7" />
      <g clipPath={`url(#${id}-outline)`}>
        {[-4, 13, 29, 46, 61, 79, 96, 115, 132].map((v, i, starts) => {
          const end = starts[i + 1] ?? 150;
          const a = floorPoint(-4, v), b = floorPoint(125, v);
          const tone = timberPlankTones[i % timberPlankTones.length];
          const joint = 25 + (i * 31) % 79;
          return <g key={i}>
            <path d={polygon([a, b, floorPoint(125, end), floorPoint(-4, end)])} fill={c(tone.fill)} opacity={tone.opacity} />
            <path d={`M${a} L${b}`} {...timberSeam} stroke={c(timberSeam.stroke)} />
            <path d={`M${floorPoint(joint,v+.4)} L${floorPoint(joint,end-.5)}`} {...timberJoint} stroke={c(timberJoint.stroke)} />
          </g>;
        })}
        <SparseTimberGrain time={p.time} paths={[
          'M-126,-66 Q-88,-57 -47,-44 T-15,-35',
          'M-73,-85 Q-23,-74 25,-58 T68,-45',
        ]} />
      </g>
      <path d={deck} fill={`url(#${id}-eave-shade)`} />
      <path d={deck} fill={`url(#${id}-lamplight)`} />
    </g>
    {/* A recessed cut in the board surrounds the shared tree contour. */}
    <path d="M-36,-93.5 Q-31,-94.5 -26.2,-94.1 Q-25.1,-92.6 -30.5,-91.4 Q-35.2,-91.5 -36,-93.5 Z" fill={p.dark} opacity=".3" />
    <path d="M-3,-102 Q0,-100 3,-102" fill="none" stroke={p.dark} strokeWidth=".8" />
    <path d={`M-150,-67.25 L-25,-31.625 l0,${deckThickness} L-150,${-67.25+deckThickness} Z`}
      fill={`url(#${id}-endgrain)`} stroke={c("#381f0d")} strokeWidth=".7" />
    <path d={`M-25,-31.625 L${deckEnd} l0,${deckThickness} L-25,${-31.625+deckThickness} Z`}
      fill={`url(#${id}-endgrain-right)`} stroke={c("#2d1609")} strokeWidth=".7" />
    <path d={`M-150,${-67.25+deckThickness} L-25,${-31.625+deckThickness} L${deckEnd[0]},${deckEnd[1]+deckThickness}`} fill="none" stroke={c("#200e05")} strokeWidth=".8" />
    <path d="M-150,-67.25 L-25,-31.625" fill="none" stroke={c("#9e693b")} strokeWidth=".75" opacity=".65" />
    <path d={`M-25,-31.625 L${deckEnd}`} fill="none" stroke={c("#82522a")} strokeWidth=".7" opacity=".55" />
    <path d="M-136,-60.7 Q-86,-48 -39,-32.8" fill="none" stroke={p.dark} strokeWidth=".45" opacity=".35" />
    {[13,29,46,61,79,96,115,132].map(v => {
      const [x,y] = floorPoint(125,v);
      return <path key={v} d={`M${x},${y+.6} l0,3.3`} stroke={p.dark} strokeWidth=".45" opacity=".4" />;
    })}
    <LowerGallery p={p} />
    {/* Low open railing follows the deck; the gallery's end stays open. */}
    {([[-148,-65],[-107,-53.5],[-66,-41.75],[17,-42]] as Point[]).map(([x,y], i) =>
      <Sapling key={i} a={[x,y]} b={[x + (i % 2 ? 1 : -1),y-20]} width={3.2} p={p} />)}
    <g clipPath={`url(#${id}-tree-above-deck)`}><CentralTree p={p} /></g>
    <Sapling a={[-150,-85.6]} b={[-25,-50]} width={3.4} p={p} />
    <Sapling a={[-25,-50]} b={[70,-77]} width={3} p={p} />

  </g>;
}

function HempRope({ d, p, width = 1.1 }: { d: string; p: Palette; width?: number }) {
  return <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke={p.dark} strokeWidth={width+.55} opacity=".7" />
    <path d={d} stroke={p.rope} strokeWidth={width} />
    <path d={d} stroke={p.ropeLight} strokeWidth={width*.4} strokeDasharray=".8 1.8" />
  </g>;
}

/** Open timber treads are tied by hemp, with daylight between the boards. */
function LowerGallery({ p }: { p: Palette }) {
  const id = `gallery-wood-${useId().replace(/:/g, '')}`;
  const { start, end, near, far, steps } = stairRun;
  const nearStart = floorPoint(end, near, GALLERY_DROP);
  const nearEnd = floorPoint(galleryEnd, near, GALLERY_DROP);
  const farEnd = floorPoint(galleryEnd, far, GALLERY_DROP);
  const farStart = floorPoint(end, far, GALLERY_DROP);
  const rail = (pt: Point): Point => [pt[0], pt[1] - 18];
  const lower = (pt: Point, depth: number): Point => [pt[0],pt[1]+depth];
  const thickness = 2.8;
  const treads = Array.from({ length: steps }, (_, i) => {
    const u0 = start+(end-start)*i/steps, u1 = start+(end-start)*(i+1)/steps;
    const drop = GALLERY_DROP*i/steps;
    return { u0, drop, a: floorPoint(u0,near,drop), b: stairRearPoint(u0,drop),
      c: stairRearPoint(u1,drop), d: floorPoint(u1,near,drop) };
  });
  // Upper tread's front edge and the next tread's rear edge share x exactly.
  // Each drop is a vertical rope, not a diagonal drawn between two front edges.
  const ties = treads.map((t,i) => ({
    near: [lower(t.d,thickness), treads[i+1]?.a ?? nearStart],
    far: [lower(t.c,thickness), treads[i+1]?.b ?? farStart],
  }));
  return <g id="seedpod-gallery" strokeLinejoin="round" strokeLinecap="round">
    <defs>
      <TimberFinishGradient id={id} face="loftSurface" time={p.time} />
    </defs>
    {/* A single wall corbel under the lower passage, clear of the ladder. */}
    <Timber p={p} d="M124,25 Q120,13 106,4 L104,1 L108,-2 Q121,7 125,16 L125,-8 L129,-7 L129,25 Z"
      facet="M126,22 Q121,10 108,3 Q122,8 127,18 Z" />
    <path d={polygon([nearStart, nearEnd, farEnd, farStart])} fill={`url(#${id})`} stroke={p.dark} strokeWidth=".8" />
    {[164,174,184].map(u => <path key={u} d={`M${floorPoint(u, far, GALLERY_DROP)} L${floorPoint(u, near, GALLERY_DROP)}`}
      fill="none" stroke={p.dark} strokeWidth=".65" opacity=".4" />)}
    <path d={polygon([nearStart, nearEnd, lower(nearEnd,4), lower(nearStart,4)])}
      fill={p.wood} stroke={p.dark} strokeWidth=".8" />
    <path d={polygon([nearEnd, farEnd, lower(farEnd,4), lower(nearEnd,4)])}
      fill={p.woodShade} stroke={p.dark} strokeWidth=".8" />
    <path d={`M${nearStart[0]},${nearStart[1]+1.5} L${nearEnd[0]},${nearEnd[1]+1.5}`} stroke={p.endGrain} fill="none" strokeWidth=".55" opacity=".45" />
    {ties.map(({far:[a,b]},i) => <HempRope key={i} d={`M${a} L${b}`} p={p} width={1.2} />)}
    {treads.map(({u0,drop,a,b,c,d}, i) => {
      return <g key={i}>
        <path d={polygon([a,b,c,d])} fill={`url(#${id})`} stroke={p.dark} strokeWidth=".65" />
        <path d={polygon([a,d,lower(d,thickness),lower(a,thickness)])} fill={p.wood} stroke={p.dark} strokeWidth=".6" />
        <path d={polygon([d,c,lower(c,thickness),lower(d,thickness)])} fill={p.woodShade} stroke={p.dark} strokeWidth=".6" />
        <path d={`M${floorPoint(u0+3,far+12,drop)} Q${floorPoint(u0+4,(near+far)/2+3,drop)} ${floorPoint(u0+3,near-3,drop)}`}
          fill="none" stroke={p.wood} strokeWidth=".45" opacity=".4" />
        <path d={`M${lower(d,.5)} L${lower(c,.5)}`} fill="none" stroke={p.endGrain} strokeWidth=".45" opacity=".45" />
        {[c,d,...(i ? [a,b] : [])].map(([x,y],j) => <path key={j} d={`M${x-1.1},${y-.3} q1.6,1.5 1.1,3.1 M${x},${y-.5} q1.6,1.5 1.1,3.1`}
          fill="none" stroke={p.rope} strokeWidth=".65" />)}
      </g>;
    })}
    {ties.map(({near:[a,b]},i) => <HempRope key={i} d={`M${a} L${b}`} p={p} width={1.2} />)}
    {[nearStart,farStart].map(([x,y],i) => <path key={i} d={`M${x-1.1},${y-.3} q1.6,1.5 1.1,3.1 M${x},${y-.5} q1.6,1.5 1.1,3.1`}
      fill="none" stroke={p.rope} strokeWidth=".65" />)}
    {[floorPoint(start,near), nearStart, nearEnd].map((pt,i) => <Sapling key={i} a={pt} b={rail(pt)} width={3} p={p} />)}
    <HempRope d={`M${rail(floorPoint(start,near))} Q89,-43 ${rail(nearStart)}`} p={p} width={1.5} />
    <Sapling a={rail(nearStart)} b={rail(nearEnd)} width={3} p={p} />
  </g>;
}

/** Draw after wall art and before the foreground bookcase/occupant. */
export function SeedpodGalleryLadder({ theme }: Props) {
  const p = palette(theme);
  const near = floorPoint(galleryEnd, stairRun.near, GALLERY_DROP);
  const far = floorPoint(galleryEnd, stairRun.far, GALLERY_DROP);
  const footA: Point = [near[0]+9,110], footB: Point = [far[0]+9,110 + far[1]-near[1]];
  const topA: Point = [near[0],near[1]-12], topB: Point = [far[0],far[1]-12];
  const lerp = (a: Point,b: Point,t: number): Point => [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
  return <g id="seedpod-gallery-ladder" pointerEvents="none" aria-hidden="true">
    {[footA,footB].map(([x,y]) => <ellipse key={x} cx={x} cy={y} rx="4" ry="1.2" fill={p.dark} opacity=".2" />)}
    <Sapling a={footA} b={topA} width={4.2} p={p} />
    <Sapling a={footB} b={topB} width={4.2} p={p} />
    {Array.from({ length: 5 }, (_, i) => {
      const t = (i + .65) / 5.3;
      return <Sapling key={i} a={lerp(footA,near,t)} b={lerp(footB,far,t)} width={3.1} p={p} />;
    })}
  </g>;
}

/** Foreground shell hides interior rail corners and the upper flue at the eave. */
export function SeedpodRoofCover({ theme }: Props) {
  const id = `seedpod-cover-${useId().replace(/:/g, '')}`;
  const p = palette(theme);
  // Restore MainCottageHaven's original red clay, including the darker left
  // face and cap. Keep the seedpod chimney geometry and roof penetration.
  const brick = { face: '#ab5438', shade: '#8c3f25', line: '#6d2e1b', light: '#d4795b',
    collar: '#7a341f', collarEdge: '#522012', capEdge: '#5c2615', opening: '#522010' };
  const chimneyShaft = 'M-9,-236 L4,-232.5 L12,-235 L12,-187.5 L4,-185 L-9,-188.5 Z';
  return <g id="seedpod-roof-cover" pointerEvents="none" aria-hidden="true">
    <defs><clipPath id={`${id}-brickwork`}><path d={chimneyShaft} /></clipPath></defs>
    <ShellSkin back={smallBack} front={smallFront} id={`${id}-small`} p={p} small />
    <ShellSkin back={largeBack} front={largeFront} id={`${id}-large`} p={p} />
    <g id="seedpod-brick-chimney" strokeLinejoin="round" strokeLinecap="round">
      {/* A thin, warm mortar fillet seats the shaft on the curved pod surface. */}
      <path d="M-11.5,-189.4 Q-4.2,-188.3 4,-186.4 L12.8,-189.1 L14.2,-187 Q8.8,-184.9 4.1,-184 Q-3.5,-186.1 -11.8,-187.4 Z"
        fill={brick.collar} stroke={brick.collarEdge} strokeWidth=".55" />
      {/* Shaft, cap sides and opening share the same projected axes. */}
      <path d={chimneyShaft} fill={brick.shade} stroke={brick.line} strokeWidth=".85" />
      <path d="M4,-232.5 L12,-235 L12,-187.5 L4,-185 Z" fill={brick.face} />
      <g clipPath={`url(#${id}-brickwork)`}>
      {[-224,-214,-204,-194].map((y,i) => <g key={y} fill="none" stroke={brick.line} strokeWidth=".65">
        <path d={`M-9,${y} L4,${y+3.5} L12,${y+1}`} />
        <path d={`M${i%2?-1:-5},${y+(i%2?2.15:1.08)} v9.5`} />
      </g>)}
      </g>
      <path d="M4,-231 L4,-186" fill="none" stroke={brick.light} strokeWidth=".65" opacity=".7" />
      <path d="M-12,-240 L4,-235.5 L15,-239 L15,-235 L4,-231.5 L-12,-236 Z" fill={brick.shade} stroke={brick.capEdge} strokeWidth=".8" />
      <path d="M4,-235.5 L15,-239 L15,-235 L4,-231.5 Z" fill={brick.collar} />
      <path d="M-12,-240 L-1,-243 L15,-239 L4,-235.5 Z" fill={brick.shade} stroke={brick.capEdge} strokeWidth=".8" />
      <path d="M-7,-239.7 L-1,-241.5 L10,-238.8 L4,-236.9 Z" fill={brick.opening} stroke="#3b160b" strokeWidth=".6" />
      <path d="M-7,-239.7 L4,-236.9 L10,-238.8" fill="none" stroke={brick.face} strokeWidth=".7" />
      <g fill={theme.isNight ? '#afb8b9' : '#e6e7d8'} opacity=".55">
        <ellipse cx="0" cy="-248" rx="4" ry="5" /><ellipse cx="-5" cy="-260" rx="6" ry="7" opacity=".7" />
        <ellipse cx="-4" cy="-275" rx="9" ry="8" opacity=".4" />
      </g>
    </g>
  </g>;
}
