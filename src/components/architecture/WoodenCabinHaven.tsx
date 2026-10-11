import React from 'react';
import type { PresenceAllocation } from '../../features/presence/presenceAllocation';
import type { Person, RoomId } from '../../types';
import type { InteractionTarget } from '../../world/interactions/interactionTypes';
import { svgAction } from '../../world/interactions/svgAction';
import { CharacterHead } from '../CharacterAvatar';

export interface WoodenCabinHavenProps {
  onSelectRoom: (roomId: RoomId | 'overview') => void;
  presenceSlots: PresenceAllocation['slots'];
  onSelectPerson: (person: Person) => void;
  setHoveredObject: (target: InteractionTarget | null) => void;
  hasMovedRef: React.MutableRefObject<boolean> | React.RefObject<boolean>;
  theme: {
    cottageGlow: string;
    isNight?: boolean;
    roofColor?: string;
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

/** A detached sleeping cabin, with a courtyard-facing cutaway and flower window. */
export const WoodenCabinHaven: React.FC<WoodenCabinHavenProps> = React.memo(({
  onSelectRoom, presenceSlots, onSelectPerson, setHoveredObject, hasMovedRef, theme,
}) => {
  const cabinOccupant = presenceSlots.tatami_corn?.occupant;
  const slotCfg = presenceSlots.tatami_corn?.config;
  const lamp = cabinPoint(66, 30, 23);
  const activeRoofColor = theme.roofColor || '#ad4c32';

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
          <stop offset="0%" stopColor="#c75b3e" />
          <stop offset="28%" stopColor={activeRoofColor} />
          <stop offset="68%" stopColor="#8c3822" />
          <stop offset="100%" stopColor="#6e2716" />
        </linearGradient>
        <linearGradient id="cabinTerracottaRight" x1="0%" y1="0%" x2="65%" y2="100%">
          <stop offset="0%" stopColor="#963c25" />
          <stop offset="38%" stopColor="#7a2e1c" />
          <stop offset="75%" stopColor="#5f2012" />
          <stop offset="100%" stopColor="#45160b" />
        </linearGradient>
        <linearGradient id="cabinTerracottaEaveLip" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d17256" />
          <stop offset="45%" stopColor={activeRoofColor} />
          <stop offset="100%" stopColor="#7a2d1b" />
        </linearGradient>
        <linearGradient id="cabinRidgeCapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c85f41" />
          <stop offset="42%" stopColor="#a3442c" />
          <stop offset="78%" stopColor="#752a18" />
          <stop offset="100%" stopColor="#4e160a" />
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

        <g id="cabin-sleeping-interior" clipPath="url(#cabin-interior-clip)">
          <polygon points={cabinFace([6, 0], [74, 0], [74, 0, 45], [6, 0, 45])} fill="#3b2414" />
          {/* The sleeping area and the space behind the flower window share
              one back wall and floor; the front window wall is not a partition. */}
          <polygon points={cabinFace([6, 36], [126, 36], [126, 36, 43], [6, 36, 43])} fill="#a77a49" />
          {[9, 17, 25, 33, 41].map(height => <polyline key={height}
            points={cabinFace([6, 36, height], [126, 36, height])} stroke="#6f4a29" strokeWidth="1.1" fill="none" />)}
          <polygon points={cabinFace([6, 0], [6, 36], [6, 36, 43], [6, 0, 45])} fill="#755033" />
          <polygon id="cabin-timber-floor" points={cabinFace([6, 0], [126, 0], [126, 36], [6, 36])}
            fill="url(#cabinFloorIsoGrad)" stroke="#503018" strokeWidth="0.8" />
          {[8, 16, 24, 32].map(v => <polyline key={v} points={cabinFace([6, v], [126, v])}
            stroke="#59371b" strokeWidth="0.7" opacity="0.75" fill="none" />)}
          {[20, 43, 65, 87, 109].map(u => <polyline key={u} points={cabinFace([u, 0], [u, 36])}
            stroke="#59371b" strokeWidth="0.5" opacity="0.5" fill="none" />)}
          <polyline points={cabinFace([6, 36, 2], [126, 36, 2])}
            stroke="#694222" strokeWidth="2" fill="none" />
          <polygon points={cabinFace([6, 0, 45], [126, 0, 45], [126, 36, 43], [6, 36, 43])}
            fill="#24160d" opacity="0.35" />

          {/* A narrow bedside cabinet, with one reading lamp as the main light. */}
          <g id="cabin-nightstand-3d">
            <polygon points={cabinFace([60, 25, 1], [72, 25, 1], [72, 37, 1], [60, 37, 1])}
              fill="#23170d" opacity="0.4" />
            <polygon points={cabinFace([60, 25, 14], [72, 25, 14], [72, 25, 2], [60, 25, 2])}
              fill="#855b34" stroke="#4e321c" strokeWidth="0.7" />
            <polygon points={cabinFace([60, 25, 14], [60, 37, 14], [60, 37, 2], [60, 25, 2])}
              fill="#624024" stroke="#4e321c" strokeWidth="0.7" />
            <polygon points={cabinFace([59, 24, 15], [73, 24, 15], [73, 38, 15], [59, 38, 15])}
              fill="#b18758" stroke="#624024" strokeWidth="0.7" />
            <polyline points={cabinFace([62, 25, 10], [70, 25, 10])} stroke="#5d3c20" strokeWidth="0.6" fill="none" />
            <circle cx={cabinPoint(66, 25, 8).x} cy={cabinPoint(66, 25, 8).y} r="0.8" fill="#bd8b43" />
            <g id="bedside-table-lamp" transform={`translate(${lamp.x}, ${lamp.y})`}>
              <ellipse cy="8" rx="2.8" ry="1.1" fill="#926127" />
              <path d="M0,8 V0" stroke="#ae7d39" strokeWidth="1.2" fill="none" />
              <path d="M-4,2 L-2.4,-4 H2.4 L4,2 Z" fill="#f6e4b8" stroke="#b78b50" strokeWidth="0.7" />
              <path d="M-1.3,-3.5 L-2,1.5 M1.3,-3.5 L2,1.5" stroke="#d5b57c" strokeWidth="0.5" />
              <circle cy="1" r="10" fill="url(#cabinLanternGlow)" opacity={theme.isNight ? 0.5 : 0.15} className="pointer-events-none" />
            </g>
          </g>

          {/* The old pine bed's turned posts, slats and thick wool quilt, now
              on the same ground axes as the cabin, with its head at the east. */}
          <g id="cabin-pine-bed-isometric">
            <polygon points={cabinFace([12, 10, 0], [60, 10, 0], [60, 34, 0], [12, 34, 0])} fill="#2a1a0e" opacity="0.5" />
            <polygon points={cabinFace([14, 12, 9], [58, 12, 9], [58, 12, 4], [14, 12, 4])}
              fill="#704827" stroke="#3d2512" strokeWidth="0.8" />
            <polygon points={cabinFace([14, 12, 9], [14, 33, 9], [14, 33, 4], [14, 12, 4])}
              fill="#51331c" stroke="#3d2512" strokeWidth="0.7" />
            <polygon points={cabinFace([14, 12, 10], [58, 12, 10], [58, 33, 10], [14, 33, 10])}
              fill="#f5ebdc" stroke="#c8b89f" strokeWidth="0.7" />
            <g id="cabin-bed-headboard">
              <path d={`M${cabinFace([58, 12, 19])} Q${cabinFace([58, 17, 23])} ${cabinFace([58, 22.5, 21])}
                Q${cabinFace([58, 28, 23])} ${cabinFace([58, 33, 19])} L${cabinFace([58, 33, 8])}
                L${cabinFace([58, 12, 8])} Z`} fill="#754b28" stroke="#3b2311" strokeWidth="0.8" />
              {[11, 15, 18].map(height => <polyline key={height}
                points={cabinFace([58, 14, height], [58, 31, height])} stroke="#492b14" strokeWidth="0.8" fill="none" />)}
              {[12, 33].map(v => {
                const top = cabinPoint(58, v, 24), bottom = cabinPoint(58, v, 2);
                return <g key={v}>
                  <path d={`M${top.x},${top.y} V${bottom.y}`} stroke="#513017" strokeWidth="2.8" strokeLinecap="round" />
                  <path d={`M${top.x - 0.5},${top.y + 1} V${bottom.y - 1}`} stroke="#9b693e" strokeWidth="0.7" />
                  <circle cx={top.x} cy={top.y - 1.2} r="1.7" fill="#a47242" stroke="#513017" strokeWidth="0.6" />
                </g>;
              })}
            </g>
            <path id="cabin-soft-pillow" d={`M${cabinFace([47, 14, 12])} Q${cabinFace([55, 12, 12])} ${cabinFace([56, 17, 12])}
              L${cabinFace([56, 28, 12])} Q${cabinFace([56, 33, 12])} ${cabinFace([50, 32, 12])}
              L${cabinFace([46, 30, 12])} Q${cabinFace([43, 23, 12])} ${cabinFace([47, 14, 12])} Z`}
              fill="#fffdfa" stroke="#d5cbba" strokeWidth="0.8" />
            <polyline points={cabinFace([49, 18, 12.4], [48, 23, 12.4], [49, 29, 12.4])}
              fill="none" stroke="#ded1bd" strokeWidth="0.7" strokeLinejoin="round" />
            <polygon points={cabinFace([14, 12, 11], [44, 12, 11], [44, 33, 11], [14, 33, 11])}
              fill="#b94e32" stroke="#882e16" strokeWidth="0.8" />
            <polygon points={cabinFace([14, 12, 11], [44, 12, 11], [44, 12, 5], [14, 12, 5])} fill="#942a12" />
            {[17, 27, 37].map(u => <polyline key={u} points={cabinFace([u, 12, 11.4], [u + 7, 23, 11.4], [u, 33, 11.4])}
              stroke="#8e321d" strokeWidth="0.7" strokeDasharray="2 1.3" fill="none" />)}
            {[18, 28].map(v => <polyline key={v} points={cabinFace([14, v, 11.4], [29, v - 4, 11.4], [44, v, 11.4])}
              stroke="#d87550" strokeWidth="0.6" fill="none" />)}
            <polygon points={cabinFace([40, 12, 11.5], [44, 12, 11.5], [44, 33, 11.5], [40, 33, 11.5])}
              fill="#3a5a40" stroke="#29402e" strokeWidth="0.5" />
            <polyline points={cabinFace([44, 12, 12], [43, 19, 12], [44, 26, 12], [43, 33, 12])}
              fill="none" stroke="#fff7e9" strokeWidth="1.7" strokeLinejoin="round" />
            <g id="cabin-bed-footboard">
              <polygon points={cabinFace([14, 12, 13], [14, 33, 13], [14, 33, 5], [14, 12, 5])}
                fill="#673f20" stroke="#38200f" strokeWidth="0.8" />
              {[12, 33].map(v => {
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

        {/* The gable and the two roof slopes use the same extrusion as the walls. */}
        <g id="cabin-main-roof">
          <polygon points={cabinFace([0, 0, 48], [63, 0, 84], [126, 0, 48])}
            fill="#9c6d3d" stroke="#4e3018" strokeWidth="1.2" />
          {[53, 60, 67, 74, 81].map(height => {
            const halfWidth = (84 - height) * 63 / 36;
            return <polyline key={height} points={cabinFace([63 - halfWidth, 0, height], [63 + halfWidth, 0, height])}
              stroke="#67401f" strokeWidth="1.2" fill="none" />;
          })}
          <polyline points={cabinFace([63, 0, 49], [63, 0, 82])} stroke="#704724" strokeWidth="2.2" fill="none" />
          {/* 2. 右坡红陶瓦底面 (Right Roof Terracotta Slope Base) */}
          <polygon points={cabinFace([63, -4, 86], [133, -4, 46], [133, 47, 46], [63, 47, 86])}
            fill="url(#cabinTerracottaRight)" stroke="#5f2012" strokeWidth="0.8" />
          {/* 3. 右坡红陶瓦沉静背光层 (Selected Element 2: Right Slope Terracotta Ambient Depth - 与大木屋背光陶瓦同调，消除污浊灰黑感) */}
          <polygon points={cabinFace([63, -4, 86], [133, -4, 46], [133, 47, 46], [63, 47, 86])}
            fill="url(#cabinTerracottaRight)" stroke="#55190b" strokeWidth="0.5" opacity="0.88" />
          {/* 4. 左坡暖阳红陶瓦面 (Selected Element 1: Left Slope Terracotta Clay Shingles - 饱满温暖的陶瓦红渐变) */}
          <polygon points={cabinFace([-7, -4, 46], [63, -4, 86], [63, 47, 86], [-7, 47, 46])}
            fill="url(#cabinTerracottaLeft)" stroke="#8a3720" strokeWidth="0.8" />

          {/* 左坡红陶瓦横向搭接瓦层 (Sparser horizontal course lines - 简约舒展) */}
          {[14, 32].map(v => (
            <polyline key={`l-course-${v}`}
              points={cabinFace([-7, v, 46], [63, v, 86])}
              stroke="#6b2211" strokeWidth="0.8" opacity="0.45" fill="none" />
          ))}

          {/* 左坡红陶瓦起垄 (Sparser vertical tile ribs - 疏朗不密集) */}
          {[10, 28, 46].map(u => {
            const height = 86 - (63 - u) * 40 / 70;
            return (
              <g key={`l-rib-${u}`}>
                <polyline points={cabinFace([u, -4, height], [u, 47, height])}
                  stroke="#662211" strokeWidth="0.8" opacity="0.5" fill="none" />
                <polyline points={cabinFace([u + 1.2, -4, height + 0.4], [u + 1.2, 47, height + 0.4])}
                  stroke="#d57659" strokeWidth="0.5" opacity="0.4" fill="none" />
              </g>
            );
          })}

          {/* 右坡红陶瓦横向搭接瓦层 (Sparser horizontal course lines) */}
          {[14, 32].map(v => (
            <polyline key={`r-course-${v}`}
              points={cabinFace([63, v, 86], [133, v, 46])}
              stroke="#461408" strokeWidth="0.8" opacity="0.45" fill="none" />
          ))}

          {/* 右坡红陶瓦起垄 (Sparser vertical tile ribs) */}
          {[80, 98, 116].map(u => {
            const height = 86 - (u - 63) * 40 / 70;
            return (
              <g key={`r-rib-${u}`}>
                <polyline points={cabinFace([u, -4, height], [u, 47, height])}
                  stroke="#481508" strokeWidth="0.8" opacity="0.5" fill="none" />
                <polyline points={cabinFace([u - 1, -4, height + 0.35], [u - 1, 47, height + 0.35])}
                  stroke="#8c331f" strokeWidth="0.5" opacity="0.35" fill="none" />
              </g>
            );
          })}

          {/* 工匠级立体马鞍压脊陶瓦体系 (Clean, calm terracotta ridge cap) */}
          <polyline points={cabinFace([63, -4, 86], [63, 47, 86])}
            stroke="#451408" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          <polyline points={cabinFace([63, -4, 86.8], [63, 47, 86.8])}
            stroke="url(#cabinRidgeCapGrad)" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <polyline points={cabinFace([63, -4, 87.2], [63, 47, 87.2])}
            stroke="#e48a6e" strokeWidth="0.6" opacity="0.7" strokeLinecap="round" fill="none" />
          {[12, 28].map(v => (
            <polyline key={`ridge-joint-${v}`}
              points={cabinFace([61.8, v, 86.3], [64.2, v, 86.3])}
              stroke="#381006" strokeWidth="0.75" fill="none" />
          ))}

          {/* 屋脊中央工匠金属压脊片与端头固定扣 (Ridge Crest Cap Plate - 呼应主屋屋脊) */}
          <g id="cabin-roof-ridge-cap">
            <polygon
              points={`${cabinPoint(63, -4.2, 87.6).x},${cabinPoint(63, -4.2, 87.6).y} ` +
                      `${cabinPoint(61, -4.2, 85.8).x},${cabinPoint(61, -4.2, 85.8).y} ` +
                      `${cabinPoint(63, -4.2, 84.8).x},${cabinPoint(63, -4.2, 84.8).y} ` +
                      `${cabinPoint(65, -4.2, 85.8).x},${cabinPoint(65, -4.2, 85.8).y}`}
              fill="#452a1a"
              stroke="#25140a"
              strokeWidth="0.6"
            />
            <circle
              cx={cabinPoint(63, -4.2, 86.2).x}
              cy={cabinPoint(63, -4.2, 86.2).y}
              r="0.8"
              fill="#8c7a6b"
            />
          </g>

          {/* Solid timber fascia and terracotta tile lip, using the main cottage's
              terracotta material and warm timber face/soffit colours. */}
          <g id="cabin-solid-eaves">
            {/* 左山墙陶瓦侧面厚度层 (Rake edge tile thickness: 完美封合屋面与木梁间缝隙) */}
            <polygon points={cabinFace([-7, -4, 46], [-7, 47, 46], [-7, 47, 43], [-7, -4, 43])}
              fill="#6e2515" stroke="#551a0d" strokeWidth="0.5" />

            {/* 左山墙实木封檐厚度板 (Timber Gable Rake Fascia Board) */}
            <polygon points={cabinFace([-7, -4, 43], [-7, 47, 43], [-7, 47, 36], [-7, -4, 36])}
              fill="#3b2314" stroke="#2d190d" strokeWidth="0.65" />
            <polyline points={cabinFace([-7, -4, 43], [-7, 47, 43])}
              stroke="#805132" strokeWidth="0.8" fill="none" />

            {/* 正面实木封檐大梁正面 (Front Fascia Board Face: 紧密衔接陶瓦檐口) */}
            <polygon points={cabinFace([-7, -4, 43], [63, -4, 83], [63, -4, 76], [-7, -4, 36])}
              fill="#5a3821" stroke="#3b2314" strokeWidth="0.65" />
            <polygon points={cabinFace([63, -4, 83], [133, -4, 43], [133, -4, 36], [63, -4, 76])}
              fill="#492c19" stroke="#2a170b" strokeWidth="0.65" />
            <polyline points={cabinFace([-7, -4, 43], [63, -4, 83], [133, -4, 43])}
              stroke="#805132" strokeWidth="0.8" fill="none" />

            {/* 陶瓦出檐厚度口 (Terracotta Tile Eave Lips: 46 -> 43 高度咬合) */}
            <polygon points={cabinFace([-7, -4, 46], [63, -4, 86], [63, -4, 83], [-7, -4, 43])}
              fill="url(#cabinTerracottaEaveLip)" stroke="#8a3720" strokeWidth="0.5" />
            <polygon points={cabinFace([63, -4, 86], [133, -4, 46], [133, -4, 43], [63, -4, 83])}
              fill="url(#cabinTerracottaRight)" stroke="#752c18" strokeWidth="0.5" />

            {/* 左前角包边交接线 (Corner Seamless Return Line) */}
            <polyline points={cabinFace([-7, -4, 46], [-7, -4, 36])}
              stroke="#2d190d" strokeWidth="0.8" fill="none" />

            {/* 陶瓦起伏微节律瓦当滴水 (Sparser tile scallops aligned with ribs) */}
            {[10, 28, 46].map(u => {
              const height = 86 - (63 - u) * 40 / 70;
              return (
                <polyline key={`l-scallop-${u}`}
                  points={cabinFace([u, -4, height], [u, -4, height - 2.8])}
                  stroke="#662211" strokeWidth="0.75" fill="none" />
              );
            })}
            {[80, 98, 116].map(u => {
              const height = 86 - (u - 63) * 40 / 70;
              return (
                <polyline key={`r-scallop-${u}`}
                  points={cabinFace([u, -4, height], [u, -4, height - 2.8])}
                  stroke="#52180c" strokeWidth="0.75" fill="none" />
              );
            })}

            {/* 陶瓦迎光沉稳温润檐脊微高光 (Matte Terracotta Eave Crest Lines - 与主屋一致) */}
            <polyline points={cabinFace([-7, -4, 46.3], [63, -4, 86.3])}
              stroke="#ba5539" strokeWidth="0.85" strokeLinecap="round" opacity="0.9" fill="none" />
            <polyline points={cabinFace([63, -4, 86.3], [133, -4, 46.3])}
              stroke="#9c422a" strokeWidth="0.75" strokeLinecap="round" opacity="0.85" fill="none" />
          </g>
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
        {cabinOccupant && <g id="cabin-sleep-whispers" transform="translate(0, -55)" className="pointer-events-none">
          <text fill="#b48342" fontSize="9" fontWeight="bold" opacity="0.85">z</text>
          <text x="8" y="-8" fill="#c58e42" fontSize="11" fontWeight="bold" opacity="0.75">Z</text>
        </g>}
        <g transform="translate(0, 91)" className="opacity-0 group-hover/cabin:opacity-100 transition-opacity pointer-events-none">
          <rect x="-82" y="-8" width="164" height="17" rx="8" fill="#1c1917" opacity="0.94" />
          <text y="4" fill="#fed7aa" fontSize="9" textAnchor="middle">🪵 林间安睡木屋 · 独立暖榻卧室</text>
        </g>
      </g>
    </g>
  );
});
