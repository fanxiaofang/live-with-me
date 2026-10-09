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
        <radialGradient id="cabinLanternGlow">
          <stop offset="0%" stopColor="#fff8db" stopOpacity="0.75" />
          <stop offset="50%" stopColor="#fcd581" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#efb761" stopOpacity="0" />
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
          <polygon points={cabinFace([-4, -7, -2], [130, -7, -2], [130, 44, -2], [-4, 44, -2])}
            fill="#8b7e68" stroke="#493f32" strokeWidth="0.9" />
          <polygon points={cabinFace([-4, -7, -2], [130, -7, -2], [130, -7, -10], [-4, -7, -10])}
            fill="url(#cabinStoneGrad)" stroke="#3b3026" strokeWidth="1" />
          <polygon points={cabinFace([-4, -7, -2], [-4, 44, -2], [-4, 44, -10], [-4, -7, -10])}
            fill="#4f473b" stroke="#3b3026" strokeWidth="0.8" />
          {[15, 40, 67, 93, 115].map(u => <polyline key={u}
            points={cabinFace([u, -7, -2], [u, -7, -10])} fill="none" stroke="#352b22" strokeWidth="0.8" />)}
          <g transform={`matrix(1 -0.2 0 1 ${cabinPoint(-4, -7, -2).x} ${cabinPoint(-4, -7, -2).y})`}>
            {[1, 25, 52, 82, 107].map((x, index) => <rect key={x} x={x} y="1.7" width={index === 4 ? 25 : 23}
              height="5.4" rx="1.1" fill={index % 2 ? '#52483d' : '#6d6252'} stroke="#3d3327" strokeWidth="0.65" />)}
          </g>
          <polygon points={cabinFace([0, -3, 3], [126, -3, 3], [126, -3, -2], [0, -3, -2])}
            fill="#81552e" stroke="#392411" strokeWidth="1" />
          <polyline points={cabinFace([0, -3, 3], [126, -3, 3])} fill="none" stroke="#c49262" strokeWidth="0.9" />
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
              <circle cy="1" r="15" fill="url(#cabinLanternGlow)" opacity={theme.isNight ? 0.8 : 0.42} className="pointer-events-none" />
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

        {/* Courtyard-facing flower window. Its sill and planter remain fully visible. */}
        <g id="cabin-window" transform={frontWall(88, 42)}>
          <rect width="27" height="25" rx="1.3" fill="#4d2f17" stroke="#2c1a0c" strokeWidth="1.2" />
          <rect x="2" y="2" width="23" height="21" rx="0.5" fill={theme.cottageGlow} />
          <path d="M2,2 H8 Q7,10 2,15 Z M25,2 H19 Q20,10 25,15 Z" fill="#fff6e5" opacity="0.88" />
          <path d="M13.5,2 V23 M2,12 H25" stroke="#644022" strokeWidth="1.4" fill="none" />
          <path d="M4,4 L10,9 M16,4 L22,9" stroke="#fffdf7" strokeWidth="1" opacity="0.6" fill="none" />
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
          <polygon points={cabinFace([63, -4, 86], [133, -4, 46], [133, 47, 46], [63, 47, 86])}
            fill="url(#terracottaRoof)" stroke="#752c18" strokeWidth="0.8" />
          <polygon points={cabinFace([63, -4, 86], [133, -4, 46], [133, 47, 46], [63, 47, 86])}
            fill="#392011" opacity="0.2" />
          <polygon points={cabinFace([-7, -4, 46], [63, -4, 86], [63, 47, 86], [-7, 47, 46])}
            fill="url(#terracottaRoof)" stroke="#8a3720" strokeWidth="0.8" />
          {[-4, 10, 24, 38, 52].map(u => {
            const height = 86 - (63 - u) * 40 / 70;
            return <g key={u}>
              <polyline points={cabinFace([u, -4, height], [u, 47, height])} stroke="#71341d" strokeWidth="1" fill="none" />
              <polyline points={cabinFace([u, -4, height + 0.8], [u, 47, height + 0.8])} stroke="#de9970" strokeWidth="0.6" opacity="0.65" fill="none" />
            </g>;
          })}
          {[7, 21, 35].map(v => <polyline key={v} points={cabinFace([-7, v, 46], [63, v, 86])}
            stroke="#7f4226" strokeWidth="0.65" opacity="0.65" fill="none" />)}
          {/* Solid timber fascia and tile lip, using the main cottage's
              terracotta material and warm timber face/soffit colours. */}
          <g id="cabin-solid-eaves">
            <polygon points={cabinFace([-7, -4, 44], [-7, 47, 44], [-7, 47, 37], [-7, -4, 37])}
              fill="#3b2314" stroke="#2d190d" strokeWidth="0.65" />
            <polyline points={cabinFace([-7, -4, 44], [-7, 47, 44])}
              stroke="#805132" strokeWidth="0.8" fill="none" />
            <polygon points={cabinFace([-7, -4, 44], [63, -4, 84], [63, -4, 77], [-7, -4, 37])}
              fill="#5a3821" stroke="#3b2314" strokeWidth="0.65" />
            <polygon points={cabinFace([63, -4, 84], [133, -4, 44], [133, -4, 37], [63, -4, 77])}
              fill="#492c19" stroke="#2a170b" strokeWidth="0.65" />
            <polyline points={cabinFace([-7, -4, 44], [63, -4, 84], [133, -4, 44])}
              stroke="#805132" strokeWidth="0.8" fill="none" />
            <polygon points={cabinFace([-7, -4, 46], [63, -4, 86], [63, -4, 83], [-7, -4, 43])}
              fill="url(#terracottaRoof)" stroke="#8a3720" strokeWidth="0.5" />
            <polygon points={cabinFace([63, -4, 86], [133, -4, 46], [133, -4, 43], [63, -4, 83])}
              fill="url(#terracottaRoof)" stroke="#752c18" strokeWidth="0.5" />
            {[-5, 14, 33, 52, 74, 93, 112, 131].map(u => {
              const height = 86 - Math.abs(63 - u) * 40 / 70;
              return <polyline key={u} points={cabinFace([u, -4, height], [u, -4, height - 2.7])}
                stroke="#662211" strokeWidth="0.65" fill="none" />;
            })}
            <polyline points={cabinFace([-7, -4, 46.3], [63, -4, 86.3], [133, -4, 46.3])}
              stroke="#ce8155" strokeWidth="0.8" fill="none" />
          </g>
          <polyline points={cabinFace([63, -4, 87], [63, 47, 87])} stroke="#b97c4b" strokeWidth="2.2" fill="none" />
        </g>

        <g id="cabin-stairs">
          <polygon points={cabinFace([18, -6, -2], [51, -6, -2], [51, -18, -2], [18, -18, -2])}
            fill="#a27646" stroke="#53331b" strokeWidth="0.8" />
          <polygon points={cabinFace([18, -18, -2], [51, -18, -2], [51, -18, -8], [18, -18, -8])}
            fill="#724926" stroke="#53331b" strokeWidth="0.7" />
          <polygon points={cabinFace([18, -6, -2], [18, -18, -2], [18, -18, -8], [18, -6, -8])}
            fill="#50321a" stroke="#392411" strokeWidth="0.6" />
          <polygon points={cabinFace([16, -18, -8], [53, -18, -8], [53, -29, -8], [16, -29, -8])}
            fill="#95683b" stroke="#53331b" strokeWidth="0.8" />
          <polygon points={cabinFace([16, -29, -8], [53, -29, -8], [53, -29, -15], [16, -29, -15])}
            fill="#624022" stroke="#392411" strokeWidth="0.7" />
          <polygon points={cabinFace([16, -18, -8], [16, -29, -8], [16, -29, -15], [16, -18, -15])}
            fill="#493019" stroke="#392411" strokeWidth="0.6" />
          <polyline points={cabinFace([18, -18, -2], [51, -18, -2])}
            stroke="#c49262" strokeWidth="0.8" fill="none" />
          <polyline points={cabinFace([16, -29, -8], [53, -29, -8])}
            stroke="#b98a57" strokeWidth="0.8" fill="none" />
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
          <text fill="#c58e42" fontSize="10" fontWeight="bold" className="animate-pulse">z</text>
          <text x="9" y="-9" fill="#deb46a" fontSize="12" fontWeight="bold">Z</text>
        </g>}
        <g transform="translate(0, 91)" className="opacity-0 group-hover/cabin:opacity-100 transition-opacity pointer-events-none">
          <rect x="-82" y="-8" width="164" height="17" rx="8" fill="#1c1917" opacity="0.94" />
          <text y="4" fill="#fed7aa" fontSize="9" textAnchor="middle">🪵 林间安睡木屋 · 独立暖榻卧室</text>
        </g>
      </g>
    </g>
  );
});
