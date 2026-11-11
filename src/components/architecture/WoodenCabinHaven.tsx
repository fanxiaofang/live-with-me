import type { WorldViewId } from '../../types';
import React from 'react';
import type { PresenceAllocation } from '../../features/presence/presenceAllocation';
import type { Person, RoomId } from '../../types';
import type { InteractionTarget } from '../../world/interactions/interactionTypes';
import { svgAction } from '../../world/interactions/svgAction';
import { CharacterHead } from '../CharacterAvatar';
import { RoofRuneEngravings } from './RoofRuneEngravings';
import { EaveSleepButterfly } from './EaveSleepButterfly';
import { MeadowWearPatch } from '../scenery/yorkshire/dressing/MeadowWearPatch';
import type { YorkshireSceneTheme } from '../scenery/yorkshire/landscapeTypes';

export interface WoodenCabinHavenProps {
  onSelectRoom: (roomId: WorldViewId) => void;
  presenceSlots: PresenceAllocation['slots'];
  onSelectPerson: (person: Person) => void;
  setHoveredObject: (target: InteractionTarget | null) => void;
  hasMovedRef: React.MutableRefObject<boolean> | React.RefObject<boolean>;
  theme: Pick<YorkshireSceneTheme, 'roadColor' | 'hillGreenFar'> & {
    cottageGlow: string;
    isNight?: boolean;
    roofColor?: string;
    timeOfDay?: YorkshireSceneTheme['timeOfDay'];
  };
}

// The front opens toward the lower right (south-east); depth recedes to the
// upper left. The footprint stays centred while walls and characters stay upright.
const cabinPoint = (u: number, v: number, height = 0) => ({
  x: Number((-44 + u - 0.62 * v).toFixed(3)),
  y: Number((69.2 - 0.2 * u - 0.4 * v - height).toFixed(3)),
});
const cabinFace = (...vertices: [number, number, number?][]) => vertices.map(([u, v, height]) => {
  const { x, y } = cabinPoint(u, v, height);
  return `${x},${y}`;
}).join(' ');
const frontWall = (u: number, height: number) => {
  const point = cabinPoint(u, 0, height);
  return `matrix(1 -0.2 0 1 ${point.x} ${point.y})`;
};

// The upper crown bends as a rounded volume. Its cross-section turns with the
// neck, so the hanging end has a soft cap and enough substance for a tied ornament.
const hatNeckStart = .68;
const hatNeckU = 63 - 7 * hatNeckStart ** 2 - 24 * hatNeckStart ** 5;
const hatNeckHeight = 51 + 90 * hatNeckStart ** 1.7 - 18 * hatNeckStart ** 9;
const hatNeckControlU = hatNeckU + (-14 * hatNeckStart - 120 * hatNeckStart ** 4) * (1 - hatNeckStart) / 3;
const hatNeckControlHeight = hatNeckHeight
  + (153 * hatNeckStart ** .7 - 162 * hatNeckStart ** 8) * (1 - hatNeckStart) / 3;

const hatPoint = (angle: number, t: number, drop = 0, inset = 1) => {
  const cosine = Math.cos(angle), sine = Math.sin(angle);
  const power = .42 + .58 * t;
  let radius = 1 - t;
  let centerU = 63 - 7 * t * t - 24 * t ** 5;
  let centerHeight = 51 + 90 * Math.pow(t, 1.7) - 18 * t ** 9;
  let sectionAngle = 0;
  if (t > hatNeckStart) {
    const s = (t - hatNeckStart) / (1 - hatNeckStart);
    const back = 1 - s;
    centerU = back ** 3 * hatNeckU + 3 * back ** 2 * s * hatNeckControlU
      + 3 * back * s * s * 36 + s ** 3 * 26;
    centerHeight = back ** 3 * hatNeckHeight + 3 * back ** 2 * s * hatNeckControlHeight
      + 3 * back * s * s * 130 + s ** 3 * 119;
    const tangentU = back ** 2 * (hatNeckControlU - hatNeckU)
      + 2 * back * s * (36 - hatNeckControlU) + s * s * (26 - 36);
    const tangentHeight = back ** 2 * (hatNeckControlHeight - hatNeckHeight)
      + 2 * back * s * (130 - hatNeckControlHeight) + s * s * (119 - 130);
    sectionAngle = Math.atan2(-tangentU, tangentHeight) * s * s * (3 - 2 * s);
    radius = (1 - hatNeckStart) * Math.sqrt(back) * (1 - .5 * s);
  }
  const brimSpread = 1 + (.025 * Math.cos(angle - .35) + .035 * Math.sin(2 * angle + .4)) * (1 - t) ** 3;
  const brimLift = (2.1 * Math.sin(angle - .4) + 1.3 * Math.sin(2 * angle + .7)) * (1 - t) ** 5;
  const across = 77 * radius * brimSpread * Math.sign(cosine) * Math.pow(Math.abs(cosine), power) * inset;
  const u = centerU + across * Math.cos(sectionAngle);
  const v = 21 + 3 * t * t - 2 * t ** 4
    + 32 * radius * brimSpread * Math.sign(sine) * Math.pow(Math.abs(sine), power) * inset;
  const height = centerHeight + across * Math.sin(sectionAngle) + brimLift;
  return cabinPoint(u, v, height - drop);
};
const hatPoints = (points: { x: number; y: number }[]) => points.map(p => `${p.x},${p.y}`).join(' ');
const hatArc = (from: number, to: number, t: number, drop = 0, inset = 1) =>
  Array.from({ length: 33 }, (_, i) => hatPoint(from + (to - from) * i / 32, t, drop, inset));
const hatRadial = (angle: number, from: number, to: number) =>
  Array.from({ length: 33 }, (_, i) => hatPoint(angle, from + (to - from) * (1 - Math.cos(Math.PI * i / 32)) / 2));
const hatSides = [
  { id: 'back', from: Math.PI / 4, to: Math.PI * 3 / 4, material: 'cabinTerracottaRight' },
  { id: 'right', from: -Math.PI / 4, to: Math.PI / 4, material: 'cabinTerracottaRight' },
  { id: 'left', from: Math.PI * 3 / 4, to: Math.PI * 5 / 4, material: 'cabinTerracottaEaveLip' },
  { id: 'front', from: Math.PI * 5 / 4, to: Math.PI * 7 / 4, material: 'cabinTerracottaLeft' },
] as const;
const hatCourses = [0, .2, .43, .66];
const hatTile = (from: number, to: number, lower: number, upper: number) => hatPoints([
  ...hatArc(from, to, lower), ...hatRadial(to, lower, upper),
  ...hatArc(to, from, upper), ...hatRadial(from, upper, lower),
]);
// The flight sweeps along the front brim, rises over the right shoulder, then
// makes a broader S-shaped climb across the front crown before returning left.
// Roof-relative waypoints lift into open air, with a short sweep outside the brim.
const butterflyRoute = [
  { turns: 1.07, height: .06, lift: 12, spread: 1.08 },
  { turns: 1.32, height: .035, lift: 13, spread: 1.08 },
  { turns: 1.62, height: .035, lift: 14, spread: 1.08 },
  { turns: 1.94, height: .06, lift: 13, spread: 1.08 },
  { turns: 1.83, height: .36, lift: 12, spread: 1.04 },
  { turns: 1.57, height: .27, lift: 9, spread: 1.08 },
  { turns: 1.38, height: .59, lift: 12, spread: 1.04 },
  { turns: 1.15, height: .34, lift: 11, spread: 1.06 },
].map(({ turns, height, lift, spread }) => {
  const p = hatPoint(Math.PI * turns, height, 0, spread);
  return { x: p.x, y: p.y - lift };
});
const butterflyOrbitRadius = 6.5;
// Match the central moon's roof anchor, then leave room below its engraved band.
const tripleMoonAnchor = hatPoint(Math.PI * 1.49, .49);
const butterflyOrbitCenter = { x: tripleMoonAnchor.x, y: tripleMoonAnchor.y + 21 };
const orbitTangentX = butterflyRoute[2].x - butterflyRoute[0].x;
const orbitTangentY = butterflyRoute[2].y - butterflyRoute[0].y;
const orbitTangentLength = Math.hypot(orbitTangentX, orbitTangentY);
butterflyRoute[1] = {
  x: butterflyOrbitCenter.x - orbitTangentY / orbitTangentLength * butterflyOrbitRadius,
  y: butterflyOrbitCenter.y + orbitTangentX / orbitTangentLength * butterflyOrbitRadius,
};
const butterflyFlightSegments = butterflyRoute.map((point, i, points) => {
  const previous = points[(i + points.length - 1) % points.length];
  const next = points[(i + 1) % points.length];
  const after = points[(i + 2) % points.length];
  // Chord-weighted handles keep short transitions from pulling a long sweep into a hook.
  const beforeLength = Math.sqrt(Math.hypot(point.x - previous.x, point.y - previous.y));
  const segmentLength = Math.sqrt(Math.hypot(next.x - point.x, next.y - point.y));
  const afterLength = Math.sqrt(Math.hypot(after.x - next.x, after.y - next.y));
  const fromWeight = segmentLength / (3 * (beforeLength + segmentLength));
  const toWeight = segmentLength / (3 * (segmentLength + afterLength));
  const controlFrom = {
    x: point.x + (next.x - previous.x) * fromWeight,
    y: point.y + (next.y - previous.y) * fromWeight,
  };
  const controlTo = {
    x: next.x - (after.x - point.x) * toWeight,
    y: next.y - (after.y - point.y) * toWeight,
  };
  // Pause forward travel with one small orbit directly below the triple moon.
  // Both arc ends share the route's tangent, keeping the entry and exit continuous.
  let orbit = '';
  if (i === 1) {
    const opposite = {
      x: butterflyOrbitCenter.x * 2 - point.x,
      y: butterflyOrbitCenter.y * 2 - point.y,
    };
    orbit = `A${butterflyOrbitRadius},${butterflyOrbitRadius} 0 1 0 ${opposite.x},${opposite.y} A${butterflyOrbitRadius},${butterflyOrbitRadius} 0 1 0 ${point.x},${point.y} `;
  }
  return `${orbit}C${controlFrom.x},${controlFrom.y} ${controlTo.x},${controlTo.y} ${next.x},${next.y}`;
});
const butterflyFlightPath = `M${butterflyRoute[0].x},${butterflyRoute[0].y} ${butterflyFlightSegments.join(' ')} Z`;
/** A detached sleeping cabin, with a courtyard-facing cutaway and flower window. */
export const WoodenCabinHaven: React.FC<WoodenCabinHavenProps> = React.memo(({
  onSelectRoom, presenceSlots, onSelectPerson, setHoveredObject, hasMovedRef, theme,
}) => {
  const cabinOccupant = presenceSlots.tatami_corn?.occupant;
  const slotCfg = presenceSlots.tatami_corn?.config;
  // Keep the lamp near the front of the recessed cabinet so its shade stays visible.
  const lamp = cabinPoint(66, 26.5, 18);
  // Change the whole clay material together; one near-black stop creates a dirty patch.
  const clay = theme.isNight
    ? { light: '#a65d38', body: '#87412c', shade: '#663326', edge: '#ad7043' }
    : theme.timeOfDay === 'dusk'
      ? { light: '#cf693a', body: '#b74b2b', shade: '#8d3c28', edge: '#d18449' }
      : { light: '#d96e3c', body: '#bf512e', shade: '#a14329', edge: '#dd8046' };
  const roofDetailUid = React.useId().replace(/:/g, '');
  const runeClipId = `cabin-roof-rune-surface-${roofDetailUid}`;
  const binding = theme.isNight
    ? { light: '#718266', body: '#465e43', shade: '#314535', brass: '#ad8952', brassLight: '#c6aa70' }
    : theme.timeOfDay === 'dusk'
      ? { light: '#93a076', body: '#59734d', shade: '#3c533b', brass: '#ba9253', brassLight: '#dec18a' }
      : { light: '#a0b18a', body: '#5e7b53', shade: '#405c42', brass: '#bb9458', brassLight: '#e4ca90' };
  const bindingId = `cabin-moss-binding-${roofDetailUid}`;
  const clasp = hatPoint(Math.PI * 1.72, 0, .15, .987);
  const claspBefore = hatPoint(Math.PI * 1.71, 0);
  const claspAfter = hatPoint(Math.PI * 1.73, 0);
  const claspLength = Math.hypot(claspAfter.x - claspBefore.x, claspAfter.y - claspBefore.y);
  const claspTransform = `matrix(${(claspAfter.x - claspBefore.x) / claspLength} ${(claspAfter.y - claspBefore.y) / claspLength} 0 1 ${clasp.x} ${clasp.y})`;
  const potionAnchor = hatPoint(Math.PI * 1.12, .975);
  const strawHatHook = cabinPoint(0, 21, 35);
  const potionId = `cabin-potion-${roofDetailUid}`;
  const potionFlameClass = `${potionId}-flame`;
  const potionCoreClass = `${potionId}-core`;
  const potionGlowClass = `${potionId}-glow`;
  const strawId = `cabin-straw-${roofDetailUid}`;


  return (
    <g id="wooden-cabin-haven">
      <defs>
        <linearGradient id="cabinFloorIsoGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a27343" />
          <stop offset="100%" stopColor="#684122" />
        </linearGradient>
        <linearGradient id="cabinSideWallGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#674124" />
          <stop offset="100%" stopColor="#422a19" />
        </linearGradient>
        {/* 2.5D 童话暖红陶瓦屋顶质感体系 (Artisan Terracotta Roof Palette - 同频大木屋红陶屋檐) */}
        <linearGradient id="cabinTerracottaLeft" x1="0%" y1="0%" x2="55%" y2="100%">
          <stop offset="0%" stopColor={clay.light} />
          <stop offset="28%" stopColor={clay.body} />
          <stop offset="68%" stopColor={clay.body} />
          <stop offset="100%" stopColor={clay.shade} />
        </linearGradient>
        <linearGradient id="cabinTerracottaRight" x1="0%" y1="0%" x2="65%" y2="100%">
          <stop offset="0%" stopColor={clay.body} />
          <stop offset="55%" stopColor={clay.shade} />
          <stop offset="100%" stopColor={clay.shade} />
        </linearGradient>
        <linearGradient id="cabinTerracottaEaveLip" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={clay.edge} />
          <stop offset="45%" stopColor={clay.body} />
          <stop offset="100%" stopColor={clay.shade} />
        </linearGradient>
        <linearGradient id={bindingId} x1="0%" y1="0%" x2="25%" y2="100%">
          <stop stopColor={binding.light} />
          <stop offset=".35" stopColor={binding.body} />
          <stop offset="1" stopColor={binding.shade} />
        </linearGradient>
        <linearGradient id={potionId} x1="0%" y1="0%" x2="85%" y2="100%">
          <stop stopColor={theme.isNight ? '#a6d7b4' : '#c0e0c5'} />
          <stop offset=".4" stopColor={theme.isNight ? '#6dbba4' : '#7fb7a2'} />
          <stop offset="1" stopColor={theme.isNight ? '#438d7e' : '#397c70'} />
        </linearGradient>
        <linearGradient id={`cabin-potion-flame-${roofDetailUid}`} x1="0%" y1="0%" x2="20%" y2="100%">
          <stop stopColor="#f5a7ff" />
          <stop offset=".34" stopColor="#d64dff" />
          <stop offset=".72" stopColor="#982fe4" />
          <stop offset="1" stopColor="#612cbb" />
        </linearGradient>
        <radialGradient id={`${potionId}-flame-glow`}>
          <stop stopColor="#f2c6ff" stopOpacity=".8" />
          <stop offset=".42" stopColor="#b15ce9" stopOpacity=".32" />
          <stop offset="1" stopColor="#963bd3" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`cabin-potion-cord-${roofDetailUid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop stopColor="#552e91" />
          <stop offset=".5" stopColor="#ae67df" />
          <stop offset="1" stopColor="#643a9e" />
        </linearGradient>
        <linearGradient id={strawId} x1="0%" y1="0%" x2="85%" y2="100%">
          <stop stopColor={theme.isNight ? '#e1c85c' : '#ffe34f'} />
          <stop offset=".48" stopColor={theme.isNight ? '#d2a92e' : '#edbb19'} />
          <stop offset="1" stopColor={theme.isNight ? '#9e7428' : '#bd8112'} />
        </linearGradient>
        <clipPath id={runeClipId}>
          {hatSides.map(({ id, from, to }) => <polygon key={id}
            points={hatPoints([...hatArc(from, to, 0), ...hatRadial(to, 0, 1), ...hatRadial(from, 1, 0)])} />)}
        </clipPath>
        {hatSides.map(({ id, from, to }) => <clipPath key={id} id={`cabin-roof-face-${id}-${roofDetailUid}`}>
          <polygon points={hatPoints([...hatArc(from, to, 0), ...hatRadial(to, 0, 1), ...hatRadial(from, 1, 0)])} />
        </clipPath>)}
        <linearGradient id="cabinRidgeCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c85f41" />
          <stop offset="42%" stopColor="#a3442c" />
          <stop offset="78%" stopColor="#a04c33" />
          <stop offset="100%" stopColor="#8e402d" />
        </linearGradient>
        {/* 床头灯柔和漫反射微光（消除眩光聚光灯感，还原安睡夜读温润柔光） */}
        <radialGradient id="cabinLanternGlow">
          <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.45" />
          <stop offset="45%" stopColor="#fde68a" stopOpacity="0.18" />
          <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.04" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </radialGradient>
        <clipPath id="cabin-interior-clip">
          <polygon points={cabinFace([6, 0, 45], [74, 0, 45], [74, 0], [6, 0])} />
        </clipPath>
      </defs>
      <style>{`
        @keyframes ${potionId}-sway {
          0%,100% { transform:translateX(0px) skewX(-2deg) scale(.98,.96) }
          23% { transform:translateX(.1px) skewX(4deg) scale(1.02,1.08) }
          51% { transform:translateX(-.08px) skewX(-3deg) scale(.97,1.02) }
          76% { transform:translateX(.06px) skewX(1deg) scale(1.01,.98) }
        }
        @keyframes ${potionId}-flicker {
          0%,100% { opacity:.85; transform:scale(.98,.94) }
          31% { opacity:1; transform:translate(.08px,-.06px) scale(1.02,1.1) }
          58% { opacity:.78; transform:translateX(-.06px) scale(.96,.98) }
          82% { opacity:.94; transform:scale(1,1.04) }
        }
        @keyframes ${potionId}-breathe {
          0%,100% { opacity:.65 }
          46% { opacity:1 }
          73% { opacity:.8 }
        }
        .${potionGlowClass} { opacity:.8 }
        @media (prefers-reduced-motion:no-preference) {
          .${potionFlameClass} { transform-origin:0px 11.1px; animation:${potionId}-sway 3.8s ease-in-out infinite }
          .${potionCoreClass} { transform-origin:0px 10.9px; animation:${potionId}-flicker 2.9s ease-in-out -.7s infinite }
          .${potionGlowClass} { animation:${potionId}-breathe 4.6s ease-in-out -.8s infinite }
        }
      `}</style>

      {/* The worn grass follows the cabin's south-east facing stair approach. */}
      <MeadowWearPatch id="cabin-entry-grass-wear" theme={theme}
        transform="matrix(0.52 -0.104 0.4 0.258 9 92)" />

      <g {...svgAction('进入林间小木屋')} id="room-corn_lounge"
        onClick={() => { if (!hasMovedRef.current) onSelectRoom('corn_lounge'); }}
        onMouseEnter={() => setHoveredObject({ kind: 'room', id: 'corn_lounge' })}
        onMouseLeave={() => setHoveredObject(null)} className="cursor-pointer group/cabin">
        <ellipse cx="9" cy="63" rx="88" ry="17" fill="#1b2518" opacity="0.26" />

        {/* Stone footing and sill follow the same footprint as the room. */}
        <g id="cabin-foundation">
          <polygon points={cabinFace([-2.5, -6.5, -2], [127, -6.5, -2], [127, 42, -2], [-2.5, 42, -2])}
            fill="#8b7e68" stroke="#493f32" strokeWidth="0.8" strokeLinejoin="round" />
          <polygon points={cabinFace([-2.5, -6.5, -2], [127, -6.5, -2], [127, -6.5, -10], [-2.5, -6.5, -10])}
            fill="url(#cabinStoneGrad)" stroke="#3b3026" strokeWidth="0.9" strokeLinejoin="round" />
          <polygon points={cabinFace([-2.5, -6.5, -2], [-2.5, 42, -2], [-2.5, 42, -10], [-2.5, -6.5, -10])}
            fill="#4f473b" stroke="#3b3026" strokeWidth="0.8" strokeLinejoin="round" />
          <polygon points={cabinFace([127, -6.5, -2], [127, 42, -2], [127, 42, -10], [127, -6.5, -10])}
            fill="#3e362c" stroke="#332a20" strokeWidth="0.7" strokeLinejoin="round" />
          {[25, 51, 77, 102].map(u => <polyline key={u}
            points={cabinFace([u, -6.5, -2], [u, -6.5, -10])} fill="none" stroke="#352b22" strokeWidth="0.8" strokeLinecap="round" />)}
          <g transform={`matrix(1 -0.2 0 1 ${cabinPoint(-2.5, -6.5, -2).x} ${cabinPoint(-2.5, -6.5, -2).y})`}>
            {[1.5, 27, 53, 79, 104].map((x, index) => <rect key={x} x={x} y="1.7" width={index === 4 ? 22 : 23}
              height="5.4" rx="1.1" fill={index % 2 ? '#52483d' : '#6d6252'} stroke="#3d3327" strokeWidth="0.65" />)}
          </g>
          {/* Solid 3D timber sill with top walking surface and left end-grain closure */}
          <polygon points={cabinFace([-1, -3.5, 2.5], [126.5, -3.5, 2.5], [126.5, 0, 2.5], [-1, 0, 2.5])}
            fill="#9c6d3d" stroke="#4a2e16" strokeWidth="0.7" strokeLinejoin="round" />
          <polygon points={cabinFace([-1, -3.5, 2.5], [126.5, -3.5, 2.5], [126.5, -3.5, -2], [-1, -3.5, -2])}
            fill="#81552e" stroke="#392411" strokeWidth="0.8" strokeLinejoin="round" />
          <polygon points={cabinFace([-1, -3.5, 2.5], [-1, 0, 2.5], [-1, 0, -2], [-1, -3.5, -2])}
            fill="#6d4422" stroke="#392411" strokeWidth="0.7" strokeLinejoin="round" />
          <polyline points={cabinFace([-1, -3.5, 2.5], [126.5, -3.5, 2.5])}
            fill="none" stroke="#ba8957" strokeWidth="0.65" strokeLinecap="round" opacity="0.8" />
        </g>

        {/* A visible return wall establishes depth before the front cutaway. */}
        <g id="cabin-log-walls">
          <polygon points={cabinFace([0, 0], [0, 42], [0, 42, 48], [0, 0, 48])}
            fill="url(#cabinSideWallGrad)" stroke="#392411" strokeWidth="1.2" />
          {[4, 12, 20, 28, 36, 44].map(height => <g key={height}>
            <polyline points={cabinFace([0, 0, height], [0, 42, height])}
              stroke="#3a230f" strokeWidth="7.2" strokeLinecap="round" fill="none" />
            <polyline points={cabinFace([0, 0, height + 0.5], [0, 42, height + 0.5])}
              stroke="#80512c" strokeWidth="5.7" strokeLinecap="round" fill="none" />
            <polyline points={cabinFace([0, 0, height + 2], [0, 42, height + 2])}
              stroke="#ba8957" strokeWidth="0.8" opacity="0.6" fill="none" />
          </g>)}
          <polygon points={cabinFace([74, 0], [126, 0], [126, 0, 48], [74, 0, 48])}
            fill="url(#cabinLogGrad)" stroke="#392411" strokeWidth="1.2" />
          {[4, 12, 20, 28, 36, 44].map(height => <g key={height} transform={frontWall(73, height + 3.5)}>
            <rect width="55" height="7" rx="3.2" fill="url(#cabinLogGrad)" stroke="#49301a" strokeWidth="0.7" />
            <path d="M3,1.4 H51 M9,4.4 Q20,3.5 32,4.6" stroke="#c49362" strokeWidth="0.6" opacity="0.55" fill="none" />
          </g>)}
        </g>

        {/* A wall peg passes through the hat's hanging loop, on the visible return wall. */}
        <g data-cabin-straw-hat="wall-hook" pointerEvents="none"
          transform={`translate(${strawHatHook.x} ${strawHatHook.y})`}>
          <path d="M-.7,0 L1.2,-.5 L1.5,3.1 L-.5,3.7 Z" fill="#583b28" />
          <path d="M.4,1.3 Q3,1.4 2.2,3.2" fill="none" stroke="#b48b56" strokeWidth="1.1" strokeLinecap="round" />
          <g transform="translate(.5 3.2) rotate(-16)">
            <path d="M0,0 Q-2.7,1.2 -2.2,4.1 M0,0 Q1.9,1 1.6,3.6"
              stroke="#9b783f" strokeWidth=".55" fill="none" />
            <ellipse cx=".6" cy="10.3" rx="5.8" ry="7.6" fill="#251d13" opacity=".22" />
            <path d="M-5.3,6.2 C-6.9,9.6 -6,15.5 -2.9,17 C.9,18.8 5.8,15.8 6,11.1 C6.4,7.4 4.5,3.4 1.5,3.2 C-1.6,2.9 -4,3.8 -5.3,6.2 Z"
              fill={`url(#${strawId})`} stroke="#96723a" strokeWidth=".45" />
            <path d="M-4,6.8 C-5.4,10 -4.5,14.6 -2,15.9 M2.2,4.5 C5.8,6.4 5.8,12.9 3.2,15.3"
              fill="none" stroke="#fff09a" strokeWidth=".4" opacity=".78" strokeLinecap="round" />
            <path d="M-3.3,8.6 C-3.4,5.1 -1.7,3.5 .7,3.8 C3.3,4.3 3.8,7.4 3.3,10.5 C2.9,13.3 -3.5,12.6 -3.3,8.6 Z"
              fill={`url(#${strawId})`} stroke="#a07c3e" strokeWidth=".4" />
            <path d="M-3.3,9 Q-.3,10.8 3.4,9.7 L3.1,11.3 Q-.4,12.5 -3.2,10.6 Z" fill={binding.body} />
            <path d="M-1.6,5.2 Q-.5,4.7 .5,5 M-2,6.7 Q-.6,6.2 .9,6.6 M-2.2,8 Q-.6,7.6 1.3,8"
              fill="none" stroke="#9b6812" strokeWidth=".34" opacity=".72" strokeLinecap="round" />
            <path d="M2.7,10.3 Q4,11.6 3.1,13.2 L2.1,12.7 L2.5,10.6" fill={binding.shade} />
          </g>
        </g>

        <g id="cabin-sleeping-interior" clipPath="url(#cabin-interior-clip)">
          <polygon points={cabinFace([6, 0], [74, 0], [74, 0, 45], [6, 0, 45])} fill="#3b2414" />
          {/* The sleeping area and the space behind the flower window share
              one back wall and floor; the front window wall is not a partition. */}
          <polygon points={cabinFace([6, 40], [126, 40], [126, 40, 43], [6, 40, 43])} fill="#a77a49" />
          {[9, 17, 25, 33, 41].map(height => <polyline key={height}
            points={cabinFace([6, 40, height], [126, 40, height])} stroke="#6f4a29" strokeWidth="1.1" fill="none" />)}
          <polygon points={cabinFace([6, 0], [6, 40], [6, 40, 43], [6, 0, 45])} fill="#755033" />
          <polygon id="cabin-timber-floor" points={cabinFace([6, 0], [126, 0], [126, 40], [6, 40])}
            fill="url(#cabinFloorIsoGrad)" stroke="#503018" strokeWidth="0.8" />
          {[8, 16, 24, 32].map(v => <polyline key={v} points={cabinFace([6, v], [126, v])}
            stroke="#59371b" strokeWidth="0.7" opacity="0.75" fill="none" />)}
          {[20, 43, 65, 87, 109].map(u => <polyline key={u} points={cabinFace([u, 0], [u, 40])}
            stroke="#59371b" strokeWidth="0.5" opacity="0.5" fill="none" />)}
          <polyline points={cabinFace([6, 40, 2], [126, 40, 2])}
            stroke="#694222" strokeWidth="2" fill="none" />
          <polygon points={cabinFace([6, 0, 45], [126, 0, 45], [126, 40, 43], [6, 40, 43])}
            fill="#24160d" opacity="0.35" />

          {/* Leave a little space beyond the headboard and bring the complete cabinet toward the doorway. */}
          <g id="cabin-nightstand-3d" transform="translate(14.38 -3.4)">
            <polygon points={cabinFace([59.6, 24.6], [71.4, 24.6], [71.4, 37.4], [59.6, 37.4])}
              fill="#23170d" opacity=".32" />
            {/* A shallow plinth closes the carcass all the way down to the floor. */}
            <polygon points={cabinFace([59.8, 24.8, 1.4], [59.8, 37.2, 1.4], [59.8, 37.2, .2], [59.8, 24.8, .2])}
              fill="#54371f" stroke="#4e321c" strokeWidth=".4" />
            <polygon points={cabinFace([59.8, 24.8, 1.4], [71.2, 24.8, 1.4], [71.2, 24.8, .2], [59.8, 24.8, .2])}
              fill="#674526" stroke="#4e321c" strokeWidth=".4" />
            <polygon points={cabinFace([59.8, 24.8, 1.4], [71.2, 24.8, 1.4], [71.2, 37.2, 1.4], [59.8, 37.2, 1.4])}
              fill="#805b35" />
            <polygon points={cabinFace([60, 25, 9], [60, 37, 9], [60, 37, 1.4], [60, 25, 1.4])}
              fill="#624024" stroke="#4e321c" strokeWidth=".5" />
            <polygon points={cabinFace([60, 25, 9], [71, 25, 9], [71, 25, 1.4], [60, 25, 1.4])}
              fill="#855b34" stroke="#4e321c" strokeWidth=".5" />
            {/* The drawer has a closed inset front, with its pull centred inside it. */}
            <polygon points={cabinFace([60.9, 24.94, 8.1], [70.1, 24.94, 8.1], [70.1, 24.94, 3.1], [60.9, 24.94, 3.1])}
              fill="#9b7047" stroke="#51351f" strokeWidth=".45" strokeLinejoin="round" />
            <polyline points={cabinFace([61.3, 24.9, 7.65], [69.7, 24.9, 7.65])}
              fill="none" stroke="#c39a68" strokeWidth=".25" opacity=".55" />
            <circle cx={cabinPoint(65.5, 24.88, 5.6).x} cy={cabinPoint(65.5, 24.88, 5.6).y}
              r=".44" fill="#c5a367" stroke="#75512c" strokeWidth=".18" />
            {/* The cap's front and return edges meet the carcass at height 9. */}
            <polygon points={cabinFace([59.4, 24.4, 10], [59.4, 37.6, 10], [59.4, 37.6, 9], [59.4, 24.4, 9])}
              fill="#7f5731" stroke="#624024" strokeWidth=".45" />
            <polygon points={cabinFace([59.4, 24.4, 10], [71.6, 24.4, 10], [71.6, 24.4, 9], [59.4, 24.4, 9])}
              fill="#9a6d42" stroke="#624024" strokeWidth=".45" />
            <polygon points={cabinFace([59.4, 24.4, 10], [71.6, 24.4, 10], [71.6, 37.6, 10], [59.4, 37.6, 10])}
              fill="#b18758" stroke="#624024" strokeWidth=".5" />
            <polyline points={cabinFace([59.8, 24.4, 9.9], [71.2, 24.4, 9.9])}
              fill="none" stroke="#d0a576" strokeWidth=".3" opacity=".65" />
            <g id="bedside-table-lamp" transform={`translate(${lamp.x}, ${lamp.y})`}>
              <ellipse cy="8" rx="2.8" ry="1.1" fill="#926127" />
              <path d="M0,8 V0" stroke="#ae7d39" strokeWidth="1.2" fill="none" />
              <path d="M-4,2 L-2.4,-4 H2.4 L4,2 Z" fill="#f6e4b8" stroke="#b78b50" strokeWidth="0.7" />
              <path d="M-1.3,-3.5 L-2,1.5 M1.3,-3.5 L2,1.5" stroke="#d5b57c" strokeWidth="0.5" />
              <circle cy="1" r="10" fill="url(#cabinLanternGlow)" opacity={theme.isNight ? 0.5 : 0.15} className="pointer-events-none" />
            </g>
          </g>

          {/* Recess the complete bed, pillow and occupant by 4 depth units,
              leaving a 12-unit strip of floor in front of the bed. */}
          <g id="cabin-pine-bed-isometric" transform="translate(-2.48 -1.6)">
            <polygon points={cabinFace([12, 6, 0], [72, 6, 0], [72, 35, 0], [12, 35, 0])} fill="#2a1a0e" opacity="0.5" />
            <polygon points={cabinFace([14, 8, 9], [70, 8, 9], [70, 8, 4], [14, 8, 4])}
              fill="#704827" stroke="#3d2512" strokeWidth="0.8" />
            <polygon points={cabinFace([14, 8, 9], [14, 34, 9], [14, 34, 4], [14, 8, 4])}
              fill="#51331c" stroke="#3d2512" strokeWidth="0.7" />
            <polygon points={cabinFace([14, 8, 10], [70, 8, 10], [70, 34, 10], [14, 34, 10])}
              fill="#f5ebdc" stroke="#c8b89f" strokeWidth="0.7" />
            <g id="cabin-bed-headboard">
              <path d={`M${cabinFace([70, 8, 19])} Q${cabinFace([70, 14, 23])} ${cabinFace([70, 21, 21])}
                Q${cabinFace([70, 28, 23])} ${cabinFace([70, 34, 19])} L${cabinFace([70, 34, 8])}
                L${cabinFace([70, 8, 8])} Z`} fill="#754b28" stroke="#3b2311" strokeWidth="0.8" />
              {[11, 15, 18].map(height => <polyline key={height}
                points={cabinFace([70, 10, height], [70, 32, height])} stroke="#492b14" strokeWidth="0.8" fill="none" />)}
              {[8, 34].map(v => {
                const top = cabinPoint(70, v, 24), bottom = cabinPoint(70, v, 2);
                return <g key={v}>
                  <path d={`M${top.x},${top.y} V${bottom.y}`} stroke="#513017" strokeWidth="2.8" strokeLinecap="round" />
                  <path d={`M${top.x - 0.5},${top.y + 1} V${bottom.y - 1}`} stroke="#9b693e" strokeWidth="0.7" />
                  <circle cx={top.x} cy={top.y - 1.2} r="1.7" fill="#a47242" stroke="#513017" strokeWidth="0.6" />
                </g>;
              })}
            </g>
            <path id="cabin-soft-pillow" d={`M${cabinFace([59, 10, 12])} Q${cabinFace([67, 8, 12])} ${cabinFace([68, 14, 12])}
              L${cabinFace([68, 28, 12])} Q${cabinFace([68, 34, 12])} ${cabinFace([62, 33, 12])}
              L${cabinFace([58, 31, 12])} Q${cabinFace([55, 22, 12])} ${cabinFace([59, 10, 12])} Z`}
              fill="#fffdfa" stroke="#d5cbba" strokeWidth="0.8" />
            <polyline points={cabinFace([61, 14, 12.4], [60, 22, 12.4], [61, 30, 12.4])}
              fill="none" stroke="#ded1bd" strokeWidth="0.7" strokeLinejoin="round" />
            <polygon points={cabinFace([14, 8, 11], [56, 8, 11], [56, 34, 11], [14, 34, 11])}
              fill="#b94e32" stroke="#882e16" strokeWidth="0.8" />
            <polygon points={cabinFace([14, 8, 11], [56, 8, 11], [56, 8, 5], [14, 8, 5])} fill="#942a12" />
            {[17, 27, 37, 47].map(u => <polyline key={u} points={cabinFace([u, 8, 11.4], [u + 7, 21, 11.4], [u, 34, 11.4])}
              stroke="#8e321d" strokeWidth="0.7" strokeDasharray="2 1.3" fill="none" />)}
            {[15, 27].map(v => <polyline key={v} points={cabinFace([14, v, 11.4], [35, v - 4, 11.4], [56, v, 11.4])}
              stroke="#d87550" strokeWidth="0.6" fill="none" />)}
            <polygon points={cabinFace([52, 8, 11.5], [56, 8, 11.5], [56, 34, 11.5], [52, 34, 11.5])}
              fill="#3a5a40" stroke="#29402e" strokeWidth="0.5" />
            <polyline points={cabinFace([56, 8, 12], [55, 17, 12], [56, 26, 12], [55, 34, 12])}
              fill="none" stroke="#fff7e9" strokeWidth="1.7" strokeLinejoin="round" />
            <g id="cabin-bed-footboard">
              <polygon points={cabinFace([14, 8, 13], [14, 34, 13], [14, 34, 5], [14, 8, 5])}
                fill="#673f20" stroke="#38200f" strokeWidth="0.8" />
              {[8, 34].map(v => {
                const top = cabinPoint(14, v, 16), bottom = cabinPoint(14, v, 2);
                return <g key={v}>
                  <path d={`M${top.x},${top.y} V${bottom.y}`} stroke="#583416" strokeWidth="2.4" strokeLinecap="round" />
                  <circle cx={top.x} cy={top.y - 0.8} r="1.3" fill="#a47242" stroke="#513017" strokeWidth="0.5" />
                </g>;
              })}
            </g>
            {cabinOccupant && slotCfg && <g {...svgAction('查看人物状态')} id={`person-in-cabin-${cabinOccupant.id}`}
              transform={`translate(${slotCfg.offset.dx}, ${slotCfg.offset.dy})`}
              onClick={e => { e.stopPropagation(); onSelectPerson(cabinOccupant); }}
              onMouseEnter={e => { e.stopPropagation(); setHoveredObject({ kind: 'person', id: cabinOccupant.id }); }}
              onMouseLeave={() => setHoveredObject(null)} className="cursor-pointer group/char">
              <CharacterHead cx={0} cy={0} r={5.5} skinColor={cabinOccupant.skinColor || '#fad4c0'}
                hairColor={cabinOccupant.hairColor || '#1a1a1a'} hairStyle={cabinOccupant.hairStyle || 'curtain_crescent'}
                beanieColor={cabinOccupant.beanieColor || '#425b6e'} hasPompom={cabinOccupant.hasPompom ?? true}
                isSleeping={true} facing={slotCfg.facing} />
            </g>}
          </g>
        </g>

        <g id="cabin-log-corner-ends">
          {[4, 12, 20, 28, 36, 44].map(height => {
            const end = cabinPoint(0, 0, height);
            return <g key={height}>
              <ellipse cx={end.x - 1.2} cy={end.y} rx="3.7" ry="3.1" fill="#be8d59" stroke="#523119" strokeWidth="0.8" />
              <ellipse cx={end.x - 1.2} cy={end.y} rx="2" ry="1.6" fill="none" stroke="#895b31" strokeWidth="0.5" />
            </g>;
          })}
        </g>

        {/* Upright front jambs frame the cutaway without a second indoor light. */}
        <polyline points={cabinFace([4, 0], [4, 0, 47], [74, 0, 47], [74, 0])}
          stroke="#4b2f19" strokeWidth="3.4" fill="none" strokeLinejoin="round" />
        <polyline points={cabinFace([5, 0, 1], [5, 0, 46], [73, 0, 46])}
          stroke="#b58351" strokeWidth="0.8" fill="none" />

        {/* Courtyard-facing flower window. Warm soft lighting with muted pastoral flowers. */}
        <g id="cabin-window" transform={frontWall(88, 42)}>
          <rect width="27" height="25" rx="1.3" fill="#4d2f17" stroke="#2c1a0c" strokeWidth="1.2" />
          <rect x="2" y="2" width="23" height="21" rx="0.5" fill={theme.cottageGlow} opacity="0.82" />
          <path d="M2,2 H8 Q7,10 2,15 Z M25,2 H19 Q20,10 25,15 Z" fill="#fff6e5" opacity="0.75" />
          <path d="M13.5,2 V23 M2,12 H25" stroke="#644022" strokeWidth="1.4" fill="none" />
          <path d="M4,4 L10,9 M16,4 L22,9" stroke="#fffdf7" strokeWidth="1" opacity="0.35" fill="none" />
          <g id="window-planter" transform="translate(-1, 24)">
            <path d="M0,0 H29 L27,7 H2 Z" fill="#774a28" stroke="#392310" strokeWidth="0.9" />
            <path d="M0,0 L3,-2 H30 L29,0 Z" fill="#ad7a4c" stroke="#624021" strokeWidth="0.5" />
            <path d="M3,2 H26" stroke="#bb8756" strokeWidth="0.7" fill="none" />
            <ellipse cx="5" cy="-1" rx="4" ry="2.5" fill="#365c27" />
            <ellipse cx="14" cy="-2" rx="5" ry="3" fill="#446e32" />
            <ellipse cx="23" cy="-1" rx="4" ry="2.5" fill="#365c27" />
            {[{x:4,y:-2,c:'#ec4899'}, {x:10,y:-3,c:'#f59e0b'}, {x:16,y:-2,c:'#ffffff'},
              {x:22,y:-3,c:'#f43f5e'}, {x:26,y:-1,c:'#8b5cf6'}].map(flower => <g key={flower.x}>
              <circle cx={flower.x} cy={flower.y} r="2.1" fill={flower.c} />
              <circle cx={flower.x} cy={flower.y} r="0.75" fill="#f8dc79" />
            </g>)}
            <path d="M6,6 Q7,10 9,13 M22,6 Q23,10 25,12" stroke="#446e32" strokeWidth="1" fill="none" />
            <circle cx="9" cy="13" r="1.2" fill="#446e32" />
            <circle cx="25" cy="12" r="1.2" fill="#446e32" />
          </g>
        </g>

        {/* A continuous four-slope terracotta hat roof, seated on the original walls. */}
        <g id="cabin-main-roof" data-cabin-roof="four-slope-hat">
          {/* Timber and clay thickness precede the roof, so far edges cannot cover its surface. */}
          <g id="cabin-solid-eaves">
            {hatSides.map(({ id, from, to }) => <g key={id}>
              <polygon points={hatPoints([...hatArc(from, to, 0, 1.5, .985),
                ...hatArc(to, from, 0, 4.7, .985)])}
                fill={id === 'left' ? '#8a5e38' : '#795032'} stroke="#68472f" strokeWidth=".5" strokeLinejoin="round" />
              <polygon points={hatPoints([...hatArc(from, to, 0), ...hatArc(to, from, 0, 1.6)])}
                fill={binding.shade} stroke={binding.shade} strokeWidth=".35" strokeLinejoin="round" />
            </g>)}
          </g>
          {hatSides.map(({ id, from, to, material }) => <g key={id} data-hat-roof-slope={id}
            clipPath={`url(#cabin-roof-face-${id}-${roofDetailUid})`}>
            <polygon points={hatPoints([...hatArc(from, to, 0), ...hatRadial(to, 0, 1), ...hatRadial(from, 1, 0)])}
              fill={`url(#${material})`} stroke="#994d35" strokeWidth=".35" strokeLinejoin="round" />
            {/* The brim is a quieter clay plane; short seams describe tiles without a wireframe. */}
            <polygon points={hatTile(from, to, 0, .1)} fill="#934026" opacity=".12" />
            <polygon data-cabin-roof-binding={id}
              points={hatPoints([...hatArc(from, to, 0), ...hatArc(to, from, 0, -.2, .965)])}
              fill={`url(#${bindingId})`} />
            {hatCourses.slice(1).map(t => <g key={t}>
              <polyline points={hatPoints(hatArc(from, to, t))} fill="none"
                stroke="#7f371f" strokeWidth=".6" opacity=".28" strokeLinejoin="round" />
              <polyline points={hatPoints(hatArc(from + .05, to - .1, t + .005))} fill="none"
                stroke="#e79a59" strokeWidth=".4" opacity=".25" />
            </g>)}
            {hatCourses.slice(1, -1).map((t, row) => {
              const angle = from + (to - from) * (row % 2 ? .62 : .32);
              return <polyline key={t}
                points={hatPoints(hatRadial(angle, t + .025, hatCourses[row + 2] - .025))}
                fill="none" stroke="#873b24" strokeWidth=".5" opacity=".2" strokeLinecap="round" />;
            })}
          </g>)}
          {/* Short worn catches describe the binding's curved upper edge. */}
          {[{ a: 1.23, b: 1.39 }, { a: 1.57, b: 1.71 }].map(({ a, b }) =>
            <polyline key={a} points={hatPoints(hatArc(Math.PI * a, Math.PI * b, 0))}
              stroke={binding.light} strokeWidth=".45" opacity=".65" fill="none" strokeLinecap="round" />)}
          <g data-cabin-roof-clasp="moonleaf-cabochon" transform={claspTransform}>
            <path d="M-3.7,0 Q-2.1,-1.55 -.7,-1.22 Q0,-1.95 .75,-1.18 Q2.25,-1.52 3.7,-.05
              Q2.05,.25 3.25,.85 Q1.55,1.68 .35,1.12 Q-.35,1.86 -1.05,1.13 Q-2.65,1.52 -3.7,0 Z"
              fill="#27382d" opacity=".62" transform="translate(0 .32)" />
            <path d="M-3.7,0 Q-2.1,-1.55 -.7,-1.22 Q0,-1.95 .75,-1.18 Q2.25,-1.52 3.7,-.05
              Q2.05,.25 3.25,.85 Q1.55,1.68 .35,1.12 Q-.35,1.86 -1.05,1.13 Q-2.65,1.52 -3.7,0 Z"
              fill={binding.brass} stroke="#745a35" strokeWidth=".32" strokeLinejoin="round" />
            <path d="M-2.85,-.02 Q-1.45,-1.1 -.5,-.8 Q.15,-1.35 .7,-.78 Q1.95,-1.1 2.85,-.02
              Q1.35,.1 2.45,.74 Q1.1,1.23 .32,.77 Q-.35,1.3 -.92,.76 Q-2.13,1.1 -2.85,-.02 Z"
              fill="none" stroke={binding.brassLight} strokeWidth=".3" strokeLinejoin="round" />
            <path d="M-1.55,.48 Q-.62,-.65 .1,-.56 Q.85,-.45 .95,.36 Q.04,1.08 -.86,.68"
              fill="none" stroke="#405e4a" strokeWidth=".72" strokeLinecap="round" />
            <path d="M-1.38,.36 Q-.5,-.63 .14,-.49 Q.73,-.39 .8,.3"
              fill="none" stroke={binding.brassLight} strokeWidth=".3" strokeLinecap="round" />
            <ellipse cx="1.45" cy="-.28" rx=".62" ry=".45" fill="#558c70" stroke="#d0b677" strokeWidth=".28" />
            <ellipse cx="1.28" cy="-.42" rx=".17" ry=".1" fill="#eff0bb" opacity=".9" />
            <circle cx="-2.45" cy="-.08" r=".24" fill="#e2c987" />
            <circle cx="2.5" cy=".55" r=".2" fill="#e2c987" />
          </g>
          <RoofRuneEngravings project={hatPoint} clipId={runeClipId}
            night={!!theme.isNight} dusk={theme.timeOfDay === 'dusk'} />
          <g data-cabin-potion="moon-jade" pointerEvents="none"
            transform={`translate(${potionAnchor.x} ${potionAnchor.y})`}>
            <path d="M-2.2,-.8 Q-1.5,1.2 .5,1.5 Q2.3,1.5 2.5,-.6"
              fill="none" stroke="#49326c" strokeWidth="1.25" strokeLinecap="round" />
            <path d="M-2,-.9 Q-1.5,1 .4,1.2 Q2.1,1.2 2.2,-.7"
              fill="none" stroke="#ad73d8" strokeWidth=".6" strokeLinecap="round" />
            <path d="M-1.5,-1 M-1.4,1.1 Q-2.5,2.9 -1.3,4.5 M1.4,1.1 Q2.7,2.8 1.5,4.5"
              fill="none" stroke="#d6ad68" strokeWidth=".65" strokeLinecap="round" />
            <path d="M-2.3,2.1 Q-.7,2.8 .9,2.1 M-2,3.3 Q-.5,4 1.7,3.1"
              fill="none" stroke="#764eaf" strokeWidth=".65" strokeLinecap="round" />
            <circle cx="-1.9" cy="2.1" r=".38" fill="#e6c577" />
            <circle cx="1.3" cy="3.3" r=".32" fill="#f0d18b" />
            <g transform="translate(.6 5)">
              <path d="M-1.35,1 L-1.35,3.3 C-1.4,4.4 -3.8,5.1 -3.8,7.6 C-3.9,10.4 -2.2,12 0,12.1 C2.6,12.2 4,10.4 3.8,7.7 C3.6,5.3 1.4,4.3 1.35,3.3 L1.35,1 Z"
                fill="#b8d7bd" fillOpacity=".24" stroke="#94b8a0" strokeWidth=".45" />
              <path d="M-3.1,7 Q-.3,7.9 3.1,7 C3.8,9.5 2.4,11.4 .1,11.5 C-2.3,11.4 -3.6,9.6 -3.1,7 Z"
                fill={`url(#${potionId})`} />
              <ellipse cy="7" rx="3.1" ry=".6" fill="#c2e3c5" opacity={theme.isNight ? '.8' : '.65'} />
              <g opacity={theme.isNight ? .72 : theme.timeOfDay === 'dusk' ? .5 : .34}>
                <ellipse className={potionGlowClass} data-potion-flame-glow="breathing"
                  cx="-.1" cy="8.9" rx="3.3" ry="3" fill={`url(#${potionId}-flame-glow)`} />
              </g>
              <g className={potionFlameClass} data-potion-flame="gentle-sway">
                <path d="M-1.45,10.8 Q-2.6,9.4 -1.55,8.1 Q-1.2,7.5 -.85,6.5 Q.05,7.2 -.25,8.2 Q.65,7.8 .85,7 Q2.05,8.6 1.15,9.4 Q1.75,9.25 2,8.8 Q2.75,10.3 1.3,11.1 Q-.1,11.65 -1.45,10.8 Z"
                  fill={`url(#cabin-potion-flame-${roofDetailUid})`} stroke="#842fbe" strokeWidth=".26" />
                <g className={potionCoreClass} data-potion-flame-core="soft-flicker">
                  <path d="M-.65,10.8 Q-1.65,9.8 -.85,9 Q-.45,8.55 -.35,7.9 Q.45,8.65 .05,9.4 Q.75,9.05 .8,8.75 Q1.55,10.1 .55,10.85 Q-.05,11.2 -.65,10.8 Z"
                    fill="#ee8cff" />
                  <path d="M-.15,10.8 Q-.7,10.1 -.2,9.65 Q.25,9.25 .2,8.8 Q.95,9.65 .45,10.25 Q.3,10.6 -.15,10.8 Z"
                    fill="#fff0bd" />
                </g>
              </g>
              <path d="M-2.7,6.2 Q-3.7,8 -2.7,9.8 M-1.9,10.8 Q0,11.8 1.7,10.9"
                fill="none" stroke="#edf2d5" strokeWidth=".5" strokeLinecap="round" opacity=".8" />
              <path d="M2.5,5.9 Q3.5,7.6 2.9,9.1" fill="none" stroke="#d6e8ce" strokeWidth=".3" opacity=".5" />
              <path d="M-1.1,1.1 L-1.35,-.6 Q0,-1.2 1.35,-.6 L1.1,1.1 Z" fill="#a9774f" stroke="#674529" strokeWidth=".3" />
              <ellipse cy="-.6" rx="1.35" ry=".42" fill="#c9a5e4" stroke="#70499d" strokeWidth=".4" />
              <path d="M-.8,-.65 Q0,-1.1 .7,-.65" fill="none" stroke="#fff1ff" strokeWidth=".35" />
              <path d="M-1.5,1.1 Q0,1.7 1.5,1.1 L1.5,2.1 Q0,2.6 -1.5,2.1 Z" fill="#b67ad8" stroke="#70499d" strokeWidth=".28" />
              <path d="M-1.25,1.35 Q0,1.85 1.25,1.35 M-1.25,1.9 Q0,2.4 1.25,1.9"
                fill="none" stroke="#f0d18b" strokeWidth=".25" />
              <path d="M.7,8.2 Q-1,8.4 -.3,9.6 Q.2,10.2 1,9.7 Q-.1,9.5 .7,8.2 Z"
                fill="#edf1c9" opacity={theme.isNight ? '.95' : '.8'} />
            </g>
          </g>
          <EaveSleepButterfly path={butterflyFlightPath} rest={butterflyRoute[4]}
            night={!!theme.isNight} dusk={theme.timeOfDay === 'dusk'} />
        </g>

        {/* Sturdy artisan heavy-timber stairs (Plan B: 咬合门槛、厚重踏步挑檐、基石嵌地与真实接触阴影) */}
        <g id="cabin-stairs">
          {/* 1. 真实地面接触阴影 (Ground Contact Shadow - 彻底消除浮空感) */}
          <polygon points={cabinFace([14, -13, -14], [58, -13, -14], [58, -32, -14], [14, -32, -14])}
            fill="#131e11" opacity="0.38" />
          <ellipse cx={cabinPoint(36, -23, -14).x} cy={cabinPoint(36, -23, -14).y + 1.2} rx="26" ry="6.5"
            fill="#10180d" opacity="0.22" />

          {/* 2. 嵌地基石垫层 (Bedding Fieldstone Plinth - 扎根泥土大地的粗琢基石) */}
          <g id="stairs-stone-bedding">
            <polygon points={cabinFace([15, -15, -11.5], [57, -15, -11.5], [57, -29.5, -11.5], [15, -29.5, -11.5])}
              fill="#7c7161" stroke="#3d3327" strokeWidth="0.65" strokeLinejoin="round" />
            <polygon points={cabinFace([15, -29.5, -11.5], [57, -29.5, -11.5], [57, -29.5, -14.5], [15, -29.5, -14.5])}
              fill="#524637" stroke="#342b1f" strokeWidth="0.65" strokeLinejoin="round" />
            <polygon points={cabinFace([15, -15, -11.5], [15, -29.5, -11.5], [15, -29.5, -14.5], [15, -15, -14.5])}
              fill="#635747" stroke="#342b1f" strokeWidth="0.65" strokeLinejoin="round" />
            <polyline points={cabinFace([36, -29.5, -11.5], [36, -29.5, -14.5])}
              stroke="#342b1f" strokeWidth="0.6" strokeLinecap="round" fill="none" />
          </g>

          {/* 3. 第一级重型实木踏步 (Lower Heavy-Timber Step) */}
          <g id="stairs-lower-tier">
            {/* 踏面顶板 (Sunlit Top Tread) */}
            <polygon points={cabinFace([17, -15, -7.5], [55, -15, -7.5], [55, -28.2, -7.5], [17, -28.2, -7.5])}
              fill="#9e7146" stroke="#4d2e15" strokeWidth="0.7" strokeLinejoin="round" />
            <polyline points={cabinFace([36, -15, -7.5], [36, -28.2, -7.5])}
              stroke="#7a532f" strokeWidth="0.5" strokeLinecap="round" opacity="0.65" fill="none" />

            {/* 实木踏板挑檐立面 (Tread Nosing Lip - 2.2厚度实木) */}
            <polygon points={cabinFace([16.5, -28.2, -7.5], [55.5, -28.2, -7.5], [55.5, -28.2, -9.7], [16.5, -28.2, -9.7])}
              fill="#7a4f29" stroke="#42240e" strokeWidth="0.7" strokeLinejoin="round" />
            <polyline points={cabinFace([16.5, -28.2, -7.5], [55.5, -28.2, -7.5])}
              stroke="#cca06e" strokeWidth="0.75" strokeLinecap="round" opacity="0.85" fill="none" />

            {/* 内退踢脚板 (Recessed Under-Nosing Riser) */}
            <polygon points={cabinFace([17, -27.5, -9.7], [55, -27.5, -9.7], [55, -27.5, -12.5], [17, -27.5, -12.5])}
              fill="#4a2b13" stroke="#341c0b" strokeWidth="0.6" strokeLinejoin="round" />

            {/* 左侧实木端面 (Left Cheek - 迎光暖木色) */}
            <polygon points={cabinFace([17, -15, -7.5], [16.5, -28.2, -7.5], [16.5, -28.2, -9.7], [17, -27.5, -9.7], [17, -27.5, -12.5], [17, -15, -12.5])}
              fill="#865a31" stroke="#462811" strokeWidth="0.7" strokeLinejoin="round" />

            {/* 工匠实木榫栓 (Craftsman Wood Dowels) */}
            <circle cx={cabinPoint(17, -20.5, -10.5).x} cy={cabinPoint(17, -20.5, -10.5).y} r="1.1"
              fill="#4d2f16" stroke="#9e7044" strokeWidth="0.4" />
            <circle cx={cabinPoint(17, -25, -10.5).x} cy={cabinPoint(17, -25, -10.5).y} r="1.1"
              fill="#4d2f16" stroke="#9e7044" strokeWidth="0.4" />
          </g>

          {/* 4. 第二级重型实木踏步 (Upper Heavy-Timber Step - 严密咬合门槛) */}
          <g id="stairs-upper-tier">
            {/* 踏面顶板 (Sunlit Top Tread) */}
            <polygon points={cabinFace([18, -3.5, -1.5], [54, -3.5, -1.5], [54, -16.2, -1.5], [18, -16.2, -1.5])}
              fill="#a8794a" stroke="#4d2e15" strokeWidth="0.7" strokeLinejoin="round" />
            <polyline points={cabinFace([36, -3.5, -1.5], [36, -16.2, -1.5])}
              stroke="#835730" strokeWidth="0.55" strokeLinecap="round" opacity="0.65" fill="none" />

            {/* 实木踏板挑檐立面 (Tread Nosing Lip - 2.2厚度实木) */}
            <polygon points={cabinFace([17.5, -16.2, -1.5], [54.5, -16.2, -1.5], [54.5, -16.2, -3.7], [17.5, -16.2, -3.7])}
              fill="#82552c" stroke="#42240e" strokeWidth="0.7" strokeLinejoin="round" />
            <polyline points={cabinFace([17.5, -16.2, -1.5], [54.5, -16.2, -1.5])}
              stroke="#d5a675" strokeWidth="0.8" strokeLinecap="round" opacity="0.9" fill="none" />

            {/* 内退踢脚板 (Recessed Under-Nosing Riser) */}
            <polygon points={cabinFace([18, -15.5, -3.7], [54, -15.5, -3.7], [54, -15.5, -7.5], [18, -15.5, -7.5])}
              fill="#452710" stroke="#301a09" strokeWidth="0.6" strokeLinejoin="round" />

            {/* 左侧实木端面 (Left Cheek - 迎光暖木色) */}
            <polygon points={cabinFace([18, -3.5, -1.5], [17.5, -16.2, -1.5], [17.5, -16.2, -3.7], [18, -15.5, -3.7], [18, -15.5, -7.5], [18, -3.5, -7.5])}
              fill="#8d6034" stroke="#462811" strokeWidth="0.7" strokeLinejoin="round" />

            {/* 工匠实木榫栓 (Craftsman Wood Dowels) */}
            <circle cx={cabinPoint(18, -9, -4.5).x} cy={cabinPoint(18, -9, -4.5).y} r="1.1"
              fill="#4d2f16" stroke="#9e7044" strokeWidth="0.4" />
            <circle cx={cabinPoint(18, -13, -4.5).x} cy={cabinPoint(18, -13, -4.5).y} r="1.1"
              fill="#4d2f16" stroke="#9e7044" strokeWidth="0.4" />
          </g>

          {/* 5. 基石边缘微型草尖掩映 (Grounding Greenery) */}
          <path d={`M${cabinPoint(14.5, -26, -14).x},${cabinPoint(14.5, -26, -14).y + 1} q-2,-5 -4,-7 q3,2 5,6`}
            fill="none" stroke="#426437" strokeWidth="0.85" strokeLinecap="round" />
          <path d={`M${cabinPoint(15.5, -24, -14).x},${cabinPoint(15.5, -24, -14).y + 1} q-1,-4 -2,-6 q2,2 3,5`}
            fill="none" stroke="#5a8542" strokeWidth="0.75" strokeLinecap="round" />
        </g>
        <g id="cabin-wildflowers" fill="none" stroke="#426437" strokeWidth="1.1" strokeLinecap="round">
          <path d="M-77,53 Q-82,43 -86,40 M-75,54 Q-75,43 -72,40 M86,65 Q89,57 94,52" />
          <circle cx="-86" cy="40" r="2.6" fill="#fff9eb" stroke="none" />
          <circle cx="-86" cy="40" r="1" fill="#d8aa3b" stroke="none" />
          <circle cx="94" cy="52" r="2.3" fill="#fff9eb" stroke="none" />
          <circle cx="94" cy="52" r="0.8" fill="#d8aa3b" stroke="none" />
        </g>
        <g id="cabin-signpost" transform="translate(-65, 60)">
          <ellipse cy="18" rx="6" ry="2" fill="#1b2516" opacity="0.3" />
          <path d="M0,0 V18" stroke="#674222" strokeWidth="2.5" />
          <path d="M-5,2 H29 L27,14 H-7 Z" fill="#e9d5b4" stroke="#70502e" strokeWidth="1" />
          <text x="11" y="10.5" fill="#55371d" fontSize="7" fontWeight="bold" textAnchor="middle">🪵 安睡木屋</text>
        </g>
        {cabinOccupant && (
          <g id="cabin-sleep-whispers" transform="translate(0, -55)" className="pointer-events-none">
            <g className="animate-sleep-bubble-1">
              <circle cx="2" cy="0" r="1.8" fill="#fde68a" opacity="0.8" />
              <circle cx="1.5" cy="-0.5" r="0.6" fill="#ffffff" opacity="0.9" />
            </g>
            <g className="animate-sleep-bubble-2">
              <circle cx="8" cy="-6" r="2.6" fill="#fef08a" opacity="0.75" />
              <circle cx="7.2" cy="-6.8" r="0.8" fill="#ffffff" opacity="0.9" />
            </g>
            <g className="animate-sleep-bubble-3">
              <circle cx="14" cy="-14" r="3.4" fill="#fed7aa" opacity="0.65" />
              <circle cx="13" cy="-15" r="1.0" fill="#ffffff" opacity="0.85" />
            </g>
          </g>
        )}
        <g transform="translate(0, 91)" className="opacity-0 group-hover/cabin:opacity-100 transition-opacity pointer-events-none">
          <rect x="-82" y="-8" width="164" height="17" rx="8" fill="#1c1917" opacity="0.94" />
          <text y="4" fill="#fed7aa" fontSize="9" textAnchor="middle">🪵 林间安睡木屋 · 独立暖榻卧室</text>
        </g>
      </g>
    </g>
  );
});
