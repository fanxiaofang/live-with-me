import React from 'react';
import { CharacterHead } from '../CharacterAvatar';

export interface WoodenCabinHavenProps {
  activeRoom: string;
  onSelectRoom: (roomId: string) => void;
  presenceSlots: Record<string, any>;
  onSelectPerson: (person: any) => void;
  setHoveredObject: (id: string | null) => void;
  hoveredObject?: string | null;
  hasMovedRef: React.MutableRefObject<boolean> | React.RefObject<boolean>;
  theme: {
    cottageGlow: string;
    isNight?: boolean;
    [key: string]: any;
  };
}

/**
 * 2.5D 左侧独立安睡小木屋 (Cozy Timber Sleeping Cabin · corn_lounge)
 * 
 * 核心定位强化 (根据用户明确指定)：
 * - 左侧的小木屋就是提供一个睡觉的地方，和右侧的睡眠舱（Capsule Pod）定位完全一致！
 * - 位于庄园西侧台地 (x=-240, y=390)，与右侧胶囊睡眠舱 (x=930) 形成主宅东西两翼的安睡天地呼应；
 * - 内部是纯正温馨的雪松原木卧房：工匠松木大床、饱满云朵软枕、红陶羊毛暖冬被、百褶床头小台灯、睡前读物与热饮；
 * - 槽位 tatami_corn 人物安详熟睡，有呼噜浮标与专属身份展牌。
 */
export const WoodenCabinHaven: React.FC<WoodenCabinHavenProps> = ({
  activeRoom,
  onSelectRoom,
  presenceSlots,
  onSelectPerson,
  setHoveredObject,
  hasMovedRef,
}) => {
  const cabinOccupant = presenceSlots.tatami_corn?.occupant;
  const slotCfg = presenceSlots.tatami_corn?.config;

  return (
    <g id="wooden-cabin-haven">
      <defs>
        {/* Wooden Cabin Floor Iso Gradient */}
        <linearGradient id="cabinFloorIsoGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#875830" />
          <stop offset="50%" stopColor="#704423" />
          <stop offset="100%" stopColor="#553115" />
        </linearGradient>

        {/* Side Wall Shadow Gradient */}
        <linearGradient id="cabinSideWallGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#3d2616" />
          <stop offset="100%" stopColor="#5c3b24" />
        </linearGradient>

        {/* Ceiling Ambient Occlusion Gradient */}
        <linearGradient id="cabinCeilingAOGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#140d07" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#140d07" stopOpacity="0" />
        </linearGradient>

        {/* Lantern Ambient Glow */}
        <radialGradient id="cabinLanternGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff8eb" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#fef08a" stopOpacity="0.55" />
          <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Main Wooden Cabin Interactive Group (位于主宅西翼安睡台地 x=160, y=340，与东翼太空舱完美对称呼应) */}
      <g
        id="room-corn_lounge"
        onClick={() => {
          if (!hasMovedRef.current) onSelectRoom('corn_lounge');
        }}
        onMouseEnter={() => setHoveredObject('room-corn_lounge')}
        onMouseLeave={() => setHoveredObject(null)}
        className="cursor-pointer group/cabin"
      >
        {/* 1. SOFT MEADOW CONTACT, STONE FOOTINGS & WOODLAND SURROUND */}
        <ellipse cx="0" cy="58" rx="94" ry="23" fill="#1b2518" opacity="0.45" />
        <ellipse cx="0" cy="56" rx="80" ry="16" fill="#121a10" opacity="0.35" />

        {/* Stone Plinth Footings under Timber Sills */}
        <polygon points="-76,52 -58,52 -56,58 -78,58" fill="#544c42" stroke="#362f27" strokeWidth="0.6" />
        <polygon points="58,52 76,52 78,58 56,58" fill="#544c42" stroke="#362f27" strokeWidth="0.6" />
        <polygon points="-14,54 14,54 16,60 -16,60" fill="#5c5348" stroke="#3a3229" strokeWidth="0.6" />

        {/* Wild Woodland Ferns & Grasses softening the base */}
        <g opacity="0.85">
          <path d="M-82,56 Q-86,48 -92,44 M-80,57 Q-82,46 -85,40 M-78,58 Q-74,48 -70,44" stroke="#3f6d38" strokeWidth="1.4" strokeLinecap="round" fill="none" />
          <path d="M78,56 Q82,48 88,44 M80,57 Q82,46 85,40 M76,58 Q73,48 70,45" stroke="#3f6d38" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        </g>

        {/* Rustic Split-Cedar Firewood Stack under Lean-To Eave on Cabin Flank */}
        <g id="cabin-firewood-stack" transform="translate(-78, 30)">
          <ellipse cx="5" cy="24" rx="11" ry="3.5" fill="#162015" opacity="0.4" />
          {/* Chopped Logs Layer 1 */}
          <rect x="-2" y="12" width="13" height="5" rx="2" fill="#82522b" stroke="#482710" strokeWidth="0.5" />
          <ellipse cx="11" cy="14.5" rx="2" ry="2.5" fill="#c49563" />
          <circle cx="11" cy="14.5" r="0.6" fill="#673e1f" />
          {/* Chopped Logs Layer 2 */}
          <rect x="0" y="7" width="12" height="5" rx="2" fill="#784b26" stroke="#482710" strokeWidth="0.5" />
          <ellipse cx="12" cy="9.5" rx="2" ry="2.5" fill="#be8f5d" />
          <circle cx="12" cy="9.5" r="0.6" fill="#673e1f" />
          {/* Chopped Logs Layer 3 */}
          <rect x="-1" y="2" width="12" height="5" rx="2" fill="#8f5d32" stroke="#482710" strokeWidth="0.5" />
          <ellipse cx="11" cy="4.5" rx="2" ry="2.5" fill="#cca06e" />
          <circle cx="11" cy="4.5" r="0.6" fill="#673e1f" />
          {/* Lean-to Timber Rafter */}
          <line x1="-5" y1="0" x2="16" y2="3" stroke="#52351e" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* Active Room Indicator (Atmospheric Ambient Warm Glow) */}
        {activeRoom === 'corn_lounge' && (
          <g className="pointer-events-none">
            <ellipse
              cx="0"
              cy="10"
              rx="98"
              ry="68"
              fill="rgba(245, 158, 11, 0.08)"
              stroke="#f59e0b"
              strokeWidth="1.6"
              className="animate-[pulse_3s_infinite]"
            />
            <ellipse
              cx="0"
              cy="10"
              rx="84"
              ry="54"
              fill="rgba(254, 215, 170, 0.06)"
            />
          </g>
        )}

        {/* 2. CHIMNEY EMBEDDED IN ROOF (穿透屋顶后侧的立体石砌烟囱) */}
        <g id="cabin-chimney">
          {/* Stepped Lead/Copper Roof Flashing Base */}
          <polygon points="-36,-18 -18,-18 -16,-22 -38,-22" fill="#b45309" stroke="#78350f" strokeWidth="0.6" />

          {/* Chimney 3D Stack: Front Face (Sunlit) */}
          <rect x="-35" y="-56" width="13" height="36" rx="1.5" fill="url(#cabinStoneGrad)" stroke="#221b14" strokeWidth="1" />
          {/* Chimney 3D Stack: Right Side Bevel (Shadow depth) */}
          <polygon points="-22,-56 -18,-59 -18,-24 -22,-20" fill="#352e25" stroke="#1f1812" strokeWidth="0.8" />

          {/* Fieldstone Block Textures */}
          <rect x="-33" y="-52" width="6" height="5" rx="1" fill="#696053" stroke="#221b14" strokeWidth="0.5" />
          <rect x="-26" y="-50" width="3.5" height="5" rx="1" fill="#4d453b" stroke="#221b14" strokeWidth="0.5" />
          <rect x="-33" y="-43" width="9" height="5" rx="1" fill="#584f44" stroke="#221b14" strokeWidth="0.5" />
          <rect x="-32" y="-36" width="5" height="5" rx="1" fill="#6b6255" stroke="#221b14" strokeWidth="0.5" />
          <rect x="-26" y="-35" width="3.5" height="5" rx="1" fill="#453d33" stroke="#221b14" strokeWidth="0.5" />

          {/* Stepped Stone Cornice Cap */}
          <polygon points="-37,-58 -16,-62 -15,-60 -36,-56" fill="#483f34" stroke="#1f1812" strokeWidth="0.8" />

          {/* Terracotta Chimney Flue Pot with Warm Rim */}
          <rect x="-30" y="-66" width="8" height="7" rx="1.5" fill="#b94e32" stroke="#682514" strokeWidth="0.8" />
          <line x1="-29" y1="-63" x2="-23" y2="-63" stroke="#e07255" strokeWidth="0.8" />
          <ellipse cx="-26" cy="-66" rx="3.5" ry="1.5" fill="#2d130a" stroke="#682514" strokeWidth="0.6" />

          {/* Gently Billowing Translucent Woodsmoke Puffs */}
          <g id="chimney-smoke" className="pointer-events-none">
            <circle cx="-26" cy="-72" r="4.5" fill="#fcfbf7" opacity="0.45" className="animate-pulse" />
            <circle cx="-23" cy="-82" r="7" fill="#fcfbf7" opacity="0.38" className="animate-pulse" />
            <circle cx="-27" cy="-95" r="9.5" fill="#fcfbf7" opacity="0.26" />
            <circle cx="-22" cy="-110" r="13" fill="#fcfbf7" opacity="0.16" />
            <circle cx="-25" cy="-126" r="16" fill="#fcfbf7" opacity="0.08" />
          </g>
        </g>

        {/* 3. 3D FIELDSTONE FOUNDATION & OILED TIMBER PORCH DECK */}
        <g id="cabin-foundation">
          <polygon points="-62,44 62,44 64,47 -64,47" fill="#6d6355" stroke="#261e17" strokeWidth="0.8" />
          <rect x="-64" y="47" width="128" height="8.5" rx="1.2" fill="url(#cabinStoneGrad)" stroke="#221b14" strokeWidth="1" />

          <rect x="-60" y="48.5" width="22" height="5.5" rx="1.2" fill="#63594b" stroke="#2d241a" strokeWidth="0.7" />
          <rect x="-36" y="48.5" width="26" height="5.5" rx="1.2" fill="#52483d" stroke="#2d241a" strokeWidth="0.7" />
          <rect x="-8" y="48.5" width="28" height="5.5" rx="1.2" fill="#61574a" stroke="#2d241a" strokeWidth="0.7" />
          <rect x="22" y="48.5" width="20" height="5.5" rx="1.2" fill="#4d4439" stroke="#2d241a" strokeWidth="0.7" />
          <rect x="44" y="48.5" width="17" height="5.5" rx="1.2" fill="#5c5244" stroke="#2d241a" strokeWidth="0.7" />

          <rect x="-61" y="41" width="122" height="4.5" rx="1" fill="#8c5828" stroke="#382110" strokeWidth="1" />
          {[-44, -28, -12, 4, 20, 36, 52].map((gx) => (
            <line key={`dplank-${gx}`} x1={gx} y1="41" x2={gx} y2="45.5" stroke="#482b13" strokeWidth="0.9" />
          ))}
          <line x1="-60" y1="41.5" x2="60" y2="41.5" stroke="#c49362" strokeWidth="0.8" opacity="0.6" />

          {/* 2-Step Front Entrance Stairs */}
          <g id="cabin-stairs" transform="translate(-4, 0)">
            <rect x="-14" y="45.5" width="28" height="3.5" rx="1" fill="#8c5b32" stroke="#3d2411" strokeWidth="0.8" />
            <line x1="-13" y1="46" x2="13" y2="46" stroke="#c49362" strokeWidth="0.6" opacity="0.6" />
            <rect x="-16" y="49" width="32" height="4" rx="1.2" fill="#6e4423" stroke="#331c0c" strokeWidth="0.8" />
            <line x1="-15" y1="49.5" x2="15" y2="49.5" stroke="#ba8958" strokeWidth="0.6" opacity="0.5" />
            <ellipse cx="0" cy="53.5" rx="18" ry="2.5" fill="#1b2518" opacity="0.4" />
          </g>

          {/* Porch Details: Hunter Green Garden Boots */}
          <g transform="translate(-24, 42.5)" opacity="0.95">
            <path d="M0,0 L3.5,0 L4,5 L7.5,5 L7.5,8 L-1.5,8 L-1.5,5 Z" fill="#2d4429" stroke="#152613" strokeWidth="0.7" />
            <path d="M5,-0.5 L8.5,-0.5 L9,4.5 L12.5,4.5 L12.5,7.5 L3.5,7.5 L3.5,4 Z" fill="#2d4429" stroke="#152613" strokeWidth="0.7" />
          </g>

          {/* Porch Details: Hammered Copper Watering Can */}
          <g transform="translate(44, 38)" opacity="0.95">
            <ellipse cx="4" cy="9" rx="5" ry="2.5" fill="#1b2518" opacity="0.3" />
            <rect x="0" y="2" width="8" height="7" rx="2" fill="#b86b3e" stroke="#5d3119" strokeWidth="0.8" />
            <line x1="1" y1="3" x2="7" y2="3" stroke="#e08e5c" strokeWidth="0.8" />
            <path d="M0,4 C-3.5,3 -3.5,7.5 0,7.5" stroke="#844522" strokeWidth="1.2" fill="none" />
            <line x1="8" y1="4" x2="13.5" y2="1.5" stroke="#844522" strokeWidth="1.2" />
            <ellipse cx="14" cy="1.2" rx="1.5" ry="2" fill="#d47e4d" stroke="#5d3119" strokeWidth="0.6" />
          </g>
        </g>

        {/* 4. LEFT WALL FIREWOOD LEAN-TO SHELTER */}
        <g id="cabin-firewood-leanto" transform="translate(-62, 14)">
          <polygon points="-16,-2 4,-2 2,1 -18,1" fill="url(#cabinShingleGrad)" stroke="#361f0d" strokeWidth="0.8" />
          <line x1="-18" y1="1" x2="2" y2="1" stroke="#e07255" strokeWidth="0.8" />
          <rect x="-16" y="1" width="2.6" height="27" rx="0.8" fill="#4d2f17" stroke="#2a1608" strokeWidth="0.6" />
          <rect x="1" y="1" width="2.6" height="27" rx="0.8" fill="#4d2f17" stroke="#2a1608" strokeWidth="0.6" />

          {[
            { cx: -11, cy: 23, r: 4.8 },
            { cx: -2, cy: 23.5, r: 4.8 },
            { cx: 7, cy: 24, r: 4.6 },
            { cx: -6.5, cy: 15.5, r: 4.8 },
            { cx: 2.5, cy: 16, r: 4.8 },
            { cx: -2, cy: 8, r: 4.5 },
          ].map((log, idx) => (
            <g key={`fw-log-${idx}`}>
              <circle cx={log.cx} cy={log.cy} r={log.r} fill="#cf9f6e" stroke="#422915" strokeWidth="0.9" />
              <circle cx={log.cx} cy={log.cy} r={log.r * 0.65} fill="none" stroke="#aa794d" strokeWidth="0.7" strokeDasharray="4 1.5" />
              <circle cx={log.cx} cy={log.cy} r={log.r * 0.28} fill="#885b34" />
              <line x1={log.cx} y1={log.cy} x2={log.cx + log.r * 0.7} y2={log.cy - log.r * 0.3} stroke="#543319" strokeWidth="0.6" />
            </g>
          ))}

          <g transform="translate(-14, 25)">
            <rect x="-2" y="0" width="6" height="4.5" rx="1.2" fill="#755034" stroke="#432c1b" strokeWidth="0.6" />
            <line x1="1" y1="0" x2="4" y2="-4" stroke="#b08154" strokeWidth="0.9" strokeLinecap="round" />
            <polygon points="0.5,0 2,-0.5 1.8,-1.5 0.3,-1" fill="#94a3b8" stroke="#475569" strokeWidth="0.4" />
          </g>
        </g>

        {/* 5. 2.5D ISOMETRIC ARCHITECTURAL CUTAWAY SLEEPING BEDROOM ALCOVE (安睡卧房) */}
        <g id="cabin-sleeping-interior">
          <rect x="-58" y="-2" width="70" height="44" fill="#3b2311" stroke="#221206" strokeWidth="1.2" />
          <polygon points="-58,42 12,42 12,44.5 -58,44.5" fill="#4d2f16" stroke="#2b1607" strokeWidth="0.8" />
          <line x1="-58" y1="42.5" x2="12" y2="42.5" stroke="#7a4e2a" strokeWidth="0.6" />

          {/* Recessed Knotty Pine Back Wall */}
          <polygon points="-48,6 12,6 12,24 -48,24" fill="#eedcc5" />
          {[10, 14, 18, 22].map((sy) => (
            <line key={`bk-pwall-${sy}`} x1="-48" y1={sy} x2="12" y2={sy} stroke="#c7b195" strokeWidth="0.7" opacity="0.65" />
          ))}
          <polygon points="-48,22.8 12,22.8 12,24 -48,24" fill="#633e21" stroke="#3d2311" strokeWidth="0.5" />

          {/* Receding West Side Wall */}
          <polygon points="-56,2 -48,6 -48,24 -56,42" fill="url(#cabinSideWallGrad)" />
          <line x1="-53" y1="3.5" x2="-53" y2="35.5" stroke="#3d2514" strokeWidth="0.6" opacity="0.5" />
          <line x1="-50" y1="5" x2="-50" y2="29" stroke="#3d2514" strokeWidth="0.6" opacity="0.5" />
          <polygon points="-56,40.5 -48,22.8 -48,24 -56,42" fill="#54331a" stroke="#2c1a0c" strokeWidth="0.5" />

          <line x1="12" y1="2" x2="12" y2="42" stroke="#221206" strokeWidth="1.2" />
          <line x1="11.2" y1="2" x2="11.2" y2="42" stroke="#7a4e2a" strokeWidth="0.6" opacity="0.7" />

          {/* 2.5D Refined Timber Floor with True Depth Perspective */}
          <polygon points="-56,42 -48,24 12,24 12,42" fill="url(#cabinFloorIsoGrad)" stroke="#38200f" strokeWidth="0.6" />
          <line x1="-54.1" y1="37.8" x2="12" y2="37.8" stroke="#3d220f" strokeWidth="0.75" opacity="0.65" />
          <line x1="-52.5" y1="34.2" x2="12" y2="34.2" stroke="#381f0d" strokeWidth="0.7" opacity="0.6" />
          <line x1="-51.1" y1="31.0" x2="12" y2="31.0" stroke="#331c0b" strokeWidth="0.65" opacity="0.55" />
          <line x1="-49.9" y1="28.2" x2="12" y2="28.2" stroke="#2e190a" strokeWidth="0.6" opacity="0.5" />
          <line x1="-48.8" y1="25.8" x2="12" y2="25.8" stroke="#281508" strokeWidth="0.55" opacity="0.45" />

          <line x1="-20" y1="42" x2="-20" y2="24" stroke="#2d1708" strokeWidth="0.75" opacity="0.6" />
          <line x1="-32" y1="42" x2="-29.5" y2="24" stroke="#351b0a" strokeWidth="0.7" opacity="0.55" />
          <line x1="-44" y1="42" x2="-38.5" y2="24" stroke="#351b0a" strokeWidth="0.7" opacity="0.55" />
          <line x1="-56" y1="42" x2="-48" y2="24" stroke="#241105" strokeWidth="0.9" opacity="0.75" />
          <line x1="-8" y1="42" x2="-10.5" y2="24" stroke="#351b0a" strokeWidth="0.7" opacity="0.55" />
          <line x1="4" y1="42" x2="-1.5" y2="24" stroke="#351b0a" strokeWidth="0.7" opacity="0.55" />

          <ellipse cx="-38" cy="33" rx="14" ry="4.5" fill="#fde68a" opacity="0.12" className="pointer-events-none" />

          {/* Ceiling & Ambient Glow */}
          <polygon points="-56,2 12,2 12,6 -48,6" fill="#1b120c" opacity="0.38" />
          <polygon points="-56,2 12,2 12,11 -48,11" fill="url(#cabinCeilingAOGrad)" className="pointer-events-none" />
          <polygon points="-52,3 10,3 9,4.8 -51,4.8" fill="#3d2311" stroke="#1f1107" strokeWidth="0.4" />

          <line x1="-48" y1="6" x2="-48" y2="24" stroke="#1c1007" strokeWidth="2.5" opacity="0.5" filter="url(#softShadow)" />
          <line x1="-48" y1="24" x2="12" y2="24" stroke="#1c1007" strokeWidth="1.6" opacity="0.38" />

          <ellipse cx="-20" cy="24" rx="32" ry="16" fill="url(#cabinGlow)" opacity="0.6" className="pointer-events-none" />

          {/* Backwall Bookshelf */}
          <g id="cabin-backwall-shelf">
            <polygon points="-43.5,13.5 -30.5,13.5 -30.5,15.5 -43.5,15.5" fill="#1b120c" opacity="0.32" />
            <polygon points="-44,11 -31,11 -30.5,12.2 -43.5,12.2" fill="#8c5828" stroke="#4d2f16" strokeWidth="0.4" />
            <rect x="-43.5" y="12.2" width="13" height="1.6" rx="0.4" fill="#583416" stroke="#331c0c" strokeWidth="0.4" />
            <rect x="-42" y="8.5" width="3.2" height="3.5" rx="0.6" fill="#f4ede2" stroke="#8c7866" strokeWidth="0.4" />
            <rect x="-36.5" y="9" width="3.4" height="3" rx="0.5" fill="#c25f38" stroke="#752e14" strokeWidth="0.4" />
            <circle cx="-34.8" cy="8" r="1.6" fill="#4d7c49" />
          </g>

          {/* Wool Rug on Floor */}
          <ellipse cx="-18" cy="38.5" rx="19" ry="4.5" fill="#844535" opacity="0.38" />
          <ellipse cx="-18" cy="38.5" rx="15" ry="3.5" fill="#4a5d48" opacity="0.48" />

          {/* 2.5D Isometric Bedside Nightstand & Pleated Lamp */}
          <g id="cabin-nightstand-3d">
            <ellipse cx="-39" cy="37.5" rx="7.5" ry="2.2" fill="#140d08" opacity="0.5" filter="url(#softShadow)" />
            <line x1="-43.5" y1="34" x2="-43.5" y2="37" stroke="#3d2513" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="-34.5" y1="34" x2="-34.5" y2="37" stroke="#3d2513" strokeWidth="1.4" strokeLinecap="round" />
            <line x1="-42.5" y1="28" x2="-42.5" y2="30.5" stroke="#2a1608" strokeWidth="1.2" strokeLinecap="round" />

            <rect x="-44" y="27" width="10" height="7.5" rx="0.8" fill="#754f2c" stroke="#432c1b" strokeWidth="0.7" />
            <rect x="-43" y="28" width="8" height="2.8" rx="0.5" fill="#845833" stroke="#52331c" strokeWidth="0.5" />
            <circle cx="-39" cy="29.4" r="0.75" fill="#d97706" stroke="#78350f" strokeWidth="0.3" />

            <rect x="-43" y="31.4" width="8" height="2.5" fill="#54331a" />
            <rect x="-42" y="32.4" width="6" height="1.2" rx="0.3" fill="#3b5266" />
            <rect x="-41.5" y="31.5" width="5" height="1" rx="0.3" fill="#99382b" />

            <polygon points="-45,25.5 -35,25.5 -34,27 -44,27" fill="#a47246" stroke="#4d2f16" strokeWidth="0.6" />
            <polygon points="-45,25.5 -44,27 -44,34.5 -45,33" fill="#583416" stroke="#331c0c" strokeWidth="0.6" />

            {/* Pleated Bedside Lamp */}
            <g id="bedside-table-lamp">
              <ellipse cx="-39.5" cy="26.2" rx="2.4" ry="0.9" fill="#b45309" stroke="#78350f" strokeWidth="0.4" />
              <line x1="-39.5" y1="26.2" x2="-39.5" y2="20.5" stroke="#d97706" strokeWidth="1" />
              <circle cx="-39.5" cy="16.8" r="0.7" fill="#b45309" />

              <polygon points="-43,21.8 -36,21.8 -37.5,17.2 -41.5,17.2" fill="#fef3c7" stroke="#d97706" strokeWidth="0.6" />
              <line x1="-40.8" y1="17.3" x2="-41.8" y2="21.7" stroke="#fcd34d" strokeWidth="0.5" />
              <line x1="-39.5" y1="17.2" x2="-39.5" y2="21.8" stroke="#fcd34d" strokeWidth="0.5" />
              <line x1="-38.2" y1="17.3" x2="-37.2" y2="21.7" stroke="#fcd34d" strokeWidth="0.5" />
              <circle cx="-39.5" cy="19.5" r="14" fill="url(#cabinLanternGlow)" opacity="0.5" className="animate-pulse pointer-events-none" />
            </g>

            {/* Steaming Mug */}
            <g id="bedside-mug">
              <rect x="-36.5" y="24.2" width="2.8" height="2.6" rx="0.5" fill="#e8dfd1" stroke="#8a7966" strokeWidth="0.4" />
              <path d="M-33.7,24.8 C-33,24.8 -33,26.2 -33.7,26.2" stroke="#8a7966" strokeWidth="0.4" fill="none" />
              <path d="M-35,23 Q-34.5,21.5 -35,20.5" stroke="#ffffff" strokeWidth="0.5" fill="none" opacity="0.65" />
            </g>
          </g>

          {/* 11. 2.5D ISOMETRIC CRAFTSMAN PINE BED (东西走向三维工匠松木大床) */}
          <g id="cabin-pine-bed-isometric">
            {/* Ground Contact Shadow */}
            <polygon points="-28,36 8.5,36 6.5,23 -26,23" fill="#140d08" opacity="0.52" filter="url(#softShadow)" />

            <rect x="-27" y="32" width="2.5" height="4.5" rx="0.6" fill="#4a2c14" />
            <rect x="5.5" y="32" width="2.5" height="4.5" rx="0.6" fill="#4a2c14" />
            <rect x="-24.5" y="22" width="2" height="3" rx="0.5" fill="#38200f" />

            <polygon points="-27,31.5 7,31.5 7,34.5 -27,34.5" fill="#673f20" stroke="#38200f" strokeWidth="0.7" />
            <line x1="-26" y1="32.5" x2="6" y2="32.5" stroke="#8c5828" strokeWidth="0.5" opacity="0.8" />

            <polygon points="-27,31.5 7,31.5 5,21.5 -25,21.5" fill="#fffdfa" stroke="#d5cbba" strokeWidth="0.6" />

            {/* Craftsman Headboard at East */}
            <g id="bed-headboard-east-3d">
              <rect x="4.5" y="14" width="2.2" height="12.5" rx="0.6" fill="#583416" stroke="#2d1706" strokeWidth="0.5" />
              <circle cx="5.6" cy="13.2" r="1.1" fill="#8c5828" stroke="#2d1706" strokeWidth="0.4" />
              <rect x="6.5" y="24" width="2.4" height="12.5" rx="0.6" fill="#583416" stroke="#2d1706" strokeWidth="0.5" />
              <circle cx="7.7" cy="23.2" r="1.2" fill="#8c5828" stroke="#2d1706" strokeWidth="0.4" />

              <polygon points="4.5,15.2 6.5,16.2 6.5,31.5 4.5,30.5" fill="#6d4727" stroke="#3b2311" strokeWidth="0.7" />
              <polygon points="4.5,15.2 6.5,16.2 7.5,17.2 5.5,16.2" fill="#8c5828" />
              {[19, 23, 27].map((hy) => (
                <line key={`3dh-slat-${hy}`} x1="4.7" y1={hy} x2="6.3" y2={hy + 0.8} stroke="#4d2f16" strokeWidth="0.8" />
              ))}
            </g>

            {/* Craftsman Footboard at West */}
            <g id="bed-footboard-west-3d">
              <rect x="-25.2" y="19" width="2" height="7.5" rx="0.5" fill="#583416" stroke="#2d1706" strokeWidth="0.4" />
              <circle cx="-24.2" cy="18.2" r="1" fill="#8c5828" stroke="#2d1706" strokeWidth="0.4" />
              <rect x="-27.2" y="28" width="2.2" height="7.5" rx="0.5" fill="#583416" stroke="#2d1706" strokeWidth="0.5" />
              <circle cx="-26.1" cy="27.2" r="1.1" fill="#8c5828" stroke="#2d1706" strokeWidth="0.4" />

              <polygon points="-25.2,21.5 -27.2,22.5 -27.2,31.5 -25.2,30.5" fill="#583416" stroke="#2d1706" strokeWidth="0.7" />
            </g>

            {/* Pillows at East */}
            <g id="bed-pillows-east-3d">
              <polygon points="3.2,18 5.2,19 5.2,29.5 3.2,28.5" fill="#f4eee4" stroke="#d5cbba" strokeWidth="0.5" />
              <polygon
                points="-1.8,19.5 3.5,20.2 3.5,30.5 -1.8,29.8"
                fill="#fffdfa"
                stroke="#d5cbba"
                strokeWidth="0.7"
                filter="url(#softShadow)"
              />
              <ellipse cx="0.8" cy="25.5" rx="2.4" ry="4.5" fill="#f5ede2" opacity="0.6" />
              <path d="M0.8,22 Q-0.4,25.5 0.8,29" stroke="#c4b59f" strokeWidth="0.7" fill="none" />
            </g>

            {/* Cozy Terracotta Quilt */}
            <g id="bed-quilt-west-3d">
              <polygon
                points="-26,21.5 -6.5,21.5 -6.5,31.5 -26,31.5"
                fill="#b94e32"
                stroke="#882e16"
                strokeWidth="0.7"
                filter="url(#softShadow)"
              />
              <line x1="-22" y1="22" x2="-9" y2="31" stroke="#942a12" strokeWidth="0.7" strokeDasharray="3 1.5" />
              <line x1="-15" y1="22" x2="-4.5" y2="28.5" stroke="#942a12" strokeWidth="0.7" strokeDasharray="3 1.5" />
              <line x1="-9" y1="22" x2="-22" y2="31" stroke="#942a12" strokeWidth="0.7" strokeDasharray="3 1.5" />
              <line x1="-4.5" y1="24" x2="-15" y2="31" stroke="#942a12" strokeWidth="0.7" strokeDasharray="3 1.5" />

              <polygon points="-26,31.5 -6.5,31.5 -6.5,33.8 -26,33.8" fill="#942a12" />
              <line x1="-26" y1="33.8" x2="-6.5" y2="33.8" stroke="#661b0c" strokeWidth="0.6" />

              <polygon points="-6.5,21.5 -3.8,21.5 -3.8,31.5 -6.5,31.5" fill="#3a5a40" stroke="#223927" strokeWidth="0.6" />
              <polygon points="-6.5,31.5 -3.8,31.5 -3.8,33.5 -6.5,33.5" fill="#29402e" />
              <line x1="-5.2" y1="22" x2="-5.2" y2="33" stroke="#588157" strokeWidth="0.5" opacity="0.7" />
            </g>

            {/* 12. SLEEPER / CHARACTER IN BED (安睡人物) */}
            {cabinOccupant && slotCfg ? (
              <g
                id={`person-in-cabin-${cabinOccupant.id}`}
                transform={`translate(${slotCfg.offset.dx}, ${slotCfg.offset.dy})`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectPerson(cabinOccupant);
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  setHoveredObject(`person-${cabinOccupant.id}`);
                }}
                onMouseLeave={() => setHoveredObject(null)}
                className="cursor-pointer group/char"
              >
                <CharacterHead
                  cx={0}
                  cy={0}
                  r={5.5}
                  skinColor={cabinOccupant.skinColor || '#fad4c0'}
                  hairColor={cabinOccupant.hairColor || '#1a1a1a'}
                  hairStyle={cabinOccupant.hairStyle || 'curtain_crescent'}
                  beanieColor={cabinOccupant.beanieColor || '#425b6e'}
                  hasPompom={cabinOccupant.hasPompom ?? true}
                  isSleeping={true}
                  facing={slotCfg.facing}
                />
                <path d="M-4,-2.2 Q-5.5,0 -4,2.2" stroke={cabinOccupant.shirtColor} strokeWidth="2.2" fill="none" />

                <g
                  transform="translate(0, -20)"
                  className="opacity-0 group-hover/char:opacity-100 transition-opacity duration-200 pointer-events-none"
                >
                  <rect x="-44" y="-7.5" width="88" height="15" rx="7.5" fill="#1c1917" opacity="0.94" stroke="#c47a4f" strokeWidth="0.6" />
                  <text x="0" y="3" fill="#f0ebe1" fontSize="8" fontWeight="bold" textAnchor="middle">
                    🪵 {cabinOccupant.name} · {slotCfg.badgeLabel.split('(')[0].trim()}
                  </text>
                </g>
              </g>
            ) : (
              <g opacity="0.4">
                <ellipse cx="0" cy="26" rx="2.5" ry="4" fill="#deb46a" />
              </g>
            )}
          </g>

          {/* Porch Awning over Doorway */}
          <rect x="-60" y="-4" width="74" height="4.5" rx="1.5" fill="#54331a" stroke="#2c1a0c" strokeWidth="1" />
          <polygon points="-62,-9 15,-9 16,-4 -63,-4" fill="url(#cabinShingleGrad)" stroke="#421a0c" strokeWidth="0.8" />
          <line x1="-63" y1="-4" x2="16" y2="-4" stroke="#e07255" strokeWidth="0.9" />

          {/* Brass Storm Lantern */}
          <g transform="translate(-24, -4)">
            <line x1="0" y1="0" x2="0" y2="4.5" stroke="#2a1e14" strokeWidth="1" />
            <circle cx="0" cy="4.5" r="1.2" fill="#8c5828" />
            <rect x="-2.5" y="4.5" width="5" height="7" rx="1.2" fill="#fef08a" stroke="#8c5828" strokeWidth="0.7" />
            <ellipse cx="0" cy="8" rx="1" ry="1.8" fill="#f59e0b" />
            <rect x="-3" y="11.5" width="6" height="1.5" rx="0.5" fill="#78350f" />
            <circle cx="0" cy="8" r="15" fill="url(#cabinLanternGlow)" className="animate-pulse pointer-events-none" />
          </g>
        </g>

        {/* 6. RIGHT FACADE CEDAR LOG WALL & FLOWER WINDOW */}
        <g id="cabin-log-walls">
          <rect x="12" y="-2" width="48" height="44" rx="1" fill="url(#cabinLogGrad)" stroke="#382110" strokeWidth="1.4" />
          {[6, 14, 22, 30, 38].map((ly) => (
            <g key={`rlog-${ly}`}>
              <line x1="12" y1={ly} x2="60" y2={ly} stroke="#2a1608" strokeWidth="1.4" />
              <line x1="12" y1={ly + 1.2} x2="60" y2={ly + 1.2} stroke="#b68354" strokeWidth="0.9" opacity="0.85" />
            </g>
          ))}

          {/* Corner saddle notches */}
          <g id="log-corner-notches-right">
            {[0, 8, 16, 24, 32, 40].map((ny, idx) => (
              <g key={`notch-r-${idx}`} transform={`translate(60, ${ny})`}>
                <ellipse cx="3.5" cy="3" rx="4.6" ry="4.2" fill="#cf9f6e" stroke="#4a2c14" strokeWidth="1.1" />
                <ellipse cx="3.5" cy="3" rx="2.8" ry="2.4" fill="none" stroke="#9a6e42" strokeWidth="0.7" strokeDasharray="3 1.5" />
                <circle cx="3.5" cy="3" r="1.2" fill="#754b25" />
              </g>
            ))}
          </g>
          <g id="log-corner-notches-left">
            {[2, 10, 18, 26, 34, 42].map((ny, idx) => (
              <g key={`notch-l-${idx}`} transform={`translate(-58, ${ny})`}>
                <ellipse cx="-3.2" cy="3" rx="4.4" ry="4" fill="#a47244" stroke="#3d220d" strokeWidth="1.1" />
                <ellipse cx="-3.2" cy="3" rx="2.6" ry="2.2" fill="none" stroke="#754b25" strokeWidth="0.7" />
                <circle cx="-3.2" cy="3" r="1.1" fill="#583416" />
              </g>
            ))}
          </g>

          {/* Window & Planter Box */}
          <g id="cabin-window" transform="translate(24, 4)">
            <rect x="0" y="0" width="24" height="23" rx="2" fill="#4d2f17" stroke="#2c1a0c" strokeWidth="1.2" />
            <rect x="2" y="2" width="20" height="19" rx="1" fill="#fde68a" stroke="#d97706" strokeWidth="0.6" />
            <rect x="2" y="2" width="20" height="19" rx="1" fill="url(#cabinGlow)" opacity="0.85" />

            <path d="M2,2 L8,2 Q6,10 2,14 Z" fill="#fffdf9" opacity="0.88" />
            <path d="M22,2 L16,2 Q18,10 22,14 Z" fill="#fffdf9" opacity="0.88" />
            <line x1="12" y1="2" x2="12" y2="21" stroke="#4d2f17" strokeWidth="1.4" />
            <line x1="2" y1="11" x2="22" y2="11" stroke="#4d2f17" strokeWidth="1.4" />

            <line x1="4" y1="4" x2="10" y2="10" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />
            <line x1="14" y1="4" x2="20" y2="10" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.65" />

            <g id="window-planter" transform="translate(-1, 22)">
              <rect x="0" y="0" width="26" height="7" rx="1.5" fill="#663f21" stroke="#361f0d" strokeWidth="1" />
              <line x1="1" y1="1.5" x2="25" y2="1.5" stroke="#9e693d" strokeWidth="0.8" />
              <ellipse cx="4" cy="-1" rx="4" ry="2.5" fill="#365c27" />
              <ellipse cx="12" cy="-2" rx="5" ry="3" fill="#446e32" />
              <ellipse cx="20" cy="-1" rx="4" ry="2.5" fill="#365c27" />

              <circle cx="4" cy="-1.5" r="2" fill="#ec4899" />
              <circle cx="4" cy="-1.5" r="0.8" fill="#fef08a" />
              <circle cx="9" cy="-3" r="2.2" fill="#f59e0b" />
              <circle cx="9" cy="-3" r="0.9" fill="#78350f" />
              <circle cx="14" cy="-1.5" r="2.4" fill="#ffffff" />
              <circle cx="14" cy="-1.5" r="1" fill="#eab308" />
              <circle cx="19" cy="-3" r="2" fill="#f43f5e" />
              <circle cx="19" cy="-3" r="0.8" fill="#fef08a" />
              <circle cx="23" cy="-1" r="1.8" fill="#8b5cf6" />
              <circle cx="23" cy="-1" r="0.6" fill="#ffffff" />

              <path d="M6,6 Q7,10 9,13" stroke="#446e32" strokeWidth="1.1" fill="none" />
              <circle cx="9" cy="13" r="1.2" fill="#446e32" />
              <path d="M18,6 Q20,11 22,14" stroke="#365c27" strokeWidth="1.1" fill="none" />
              <circle cx="22" cy="14" r="1.2" fill="#365c27" />
            </g>
          </g>
        </g>

        {/* 7. FRONT-FACING GABLED ROOF */}
        <g id="cabin-main-roof">
          <polygon points="-66,-2 0,-44 66,-2" fill="#784f2c" stroke="#382110" strokeWidth="1.4" />
          {[-50, -38, -26, -14, 0, 14, 26, 38, 50].map((px) => {
            const yTop = -44 + Math.abs(px) * (42 / 66);
            return (
              <line key={`gplank-${px}`} x1={px} y1={yTop} x2={px} y2="-2" stroke="#5a381f" strokeWidth="0.9" opacity="0.75" />
            );
          })}

          <polygon points="0,-46 -70,-1 -68,3 0,-40 68,3 70,-1" fill="url(#cabinShingleGrad)" stroke="#4a1c0d" strokeWidth="1.4" />

          {[
            { y: -36, l: -14, r: 14 },
            { y: -28, l: -28, r: 28 },
            { y: -20, l: -42, r: 42 },
            { y: -12, l: -54, r: 54 },
            { y: -4, l: -64, r: 64 },
          ].map((row, idx) => (
            <g key={`shingle-row-${idx}`}>
              <line x1={row.l} y1={row.y} x2={row.r} y2={row.y} stroke="#4a1a0c" strokeWidth="1.3" />
              <line x1={row.l + 2} y1={row.y + 1} x2={row.r - 2} y2={row.y + 1} stroke="#ea8c6e" strokeWidth="0.9" opacity="0.8" />
            </g>
          ))}

          <polyline points="-72,-1 0,-46 72,-1" fill="none" stroke="#5a381f" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="-70,0 0,-44 70,0" fill="none" stroke="#8f5e36" strokeWidth="1.4" strokeLinecap="round" />

          <g transform="translate(0, -46)">
            <polygon points="0,0 -4,9 0,16 4,9" fill="#5a381f" stroke="#2a1608" strokeWidth="0.8" />
            <circle cx="0" cy="18" r="2.2" fill="#8f5e36" stroke="#2a1608" strokeWidth="0.6" />
          </g>

          <polygon points="-44,-16 44,-16 44,-13 -44,-13" fill="#4d2f17" stroke="#2a1608" strokeWidth="0.7" />
          <rect x="-2" y="-42" width="4" height="27" rx="0.6" fill="#4d2f17" stroke="#2a1608" strokeWidth="0.7" />
          <polygon points="0,-32 2.5,-29 0,-26 -2.5,-29" fill="#deb46a" stroke="#8c5f28" strokeWidth="0.5" />

          {[-58, -46, -34, 34, 46, 58].map((rx) => (
            <rect key={`rafter-${rx}`} x={rx} y="-2" width="2.8" height="4.5" rx="0.8" fill="#4a2c14" />
          ))}
          <polygon points="-66,0 0,-38 66,0 66,4 0,-34 -66,4" fill="#140d08" opacity="0.2" />
        </g>

        {/* 8. RUSTIC SIGNPOST IN FOREGROUND: "🪵 安睡木屋" */}
        <g id="cabin-signpost" transform="translate(-62, 54)">
          <ellipse cx="2" cy="18" rx="4" ry="2" fill="#141c12" opacity="0.35" />
          <rect x="0" y="0" width="3" height="18" rx="1" fill="#54371d" stroke="#2c1a0c" strokeWidth="0.8" />
          <rect x="-2" y="2" width="32" height="2" rx="0.6" fill="#6d4727" stroke="#3d2513" strokeWidth="0.5" />

          <polygon points="-3,4 29,4 27,18 -5,18" fill="#eedcc5" stroke="#684628" strokeWidth="1.2" filter="url(#softShadow)" />
          <text x="12" y="14" fill="#4a2c14" fontSize="7.5" fontWeight="bold" textAnchor="middle">
            🪵 安睡木屋
          </text>
          <circle cx="-1.5" cy="7" r="0.7" fill="#b45309" />
          <circle cx="25.5" cy="7" r="0.7" fill="#b45309" />
        </g>

        {/* 9. MEADOW WILDFLOWERS */}
        <g id="cabin-wildflowers">
          <g transform="translate(-68, 50)">
            <line x1="0" y1="12" x2="-2" y2="2" stroke="#3a5635" strokeWidth="1.6" />
            <circle cx="-2" cy="2" r="3.8" fill="#ffffff" />
            <circle cx="-2" cy="2" r="1.5" fill="#d97706" />
          </g>
          <g transform="translate(-76, 56)">
            <line x1="0" y1="10" x2="1" y2="1" stroke="#3a5635" strokeWidth="1.4" />
            <circle cx="1" cy="1" r="3.2" fill="#ffffff" />
            <circle cx="1" cy="1" r="1.3" fill="#d97706" />
          </g>
          <g transform="translate(64, 50)">
            <line x1="0" y1="14" x2="2" y2="1" stroke="#486842" strokeWidth="1.6" />
            <circle cx="2" cy="1" r="3.6" fill="#ffffff" />
            <circle cx="2" cy="1" r="1.5" fill="#d97706" />
          </g>
          <circle cx="-34" cy="62" r="2.2" fill="#ffffff" />
          <circle cx="-34" cy="62" r="1" fill="#d97706" />
          <circle cx="34" cy="63" r="2.2" fill="#ffffff" />
          <circle cx="34" cy="63" r="1" fill="#d97706" />
          <circle cx="8" cy="65" r="2" fill="#facc15" />
        </g>

        {/* 10. FLOATING SLEEP & STATUS BUBBLES */}
        {cabinOccupant && (
          <g id="cabin-sleep-whispers" transform="translate(10, -56)" className="pointer-events-none">
            <text x="8" y="2" fill="#deb46a" fontSize="10" fontWeight="bold" className="animate-bounce">z</text>
            <text x="16" y="-8" fill="#c58e42" fontSize="13" fontWeight="bold" className="animate-pulse">Z</text>

            <g transform="translate(-10, 8)">
              <rect x="-48" y="-8" width="96" height="17" rx="8.5" fill="#1c1917" opacity="0.94" stroke="#c47a4f" strokeWidth="0.6" />
              <text x="0" y="4" fill="#fed7aa" fontSize="9.2" fontWeight="bold" textAnchor="middle">
                🪵 {cabinOccupant.name} · 木屋安睡中
              </text>
            </g>
          </g>
        )}

        {/* 11. HOVER PILL LABEL FOR CABIN */}
        <g
          transform="translate(0, 56)"
          className="opacity-0 group-hover/cabin:opacity-100 transition-opacity pointer-events-none"
        >
          <rect x="-82" y="-8" width="164" height="17" rx="8.5" fill="#1c1917" opacity="0.94" stroke="#c47a4f" strokeWidth="0.6" />
          <text x="0" y="4" fill="#fed7aa" fontSize="9" fontWeight="bold" textAnchor="middle">
            🪵 林间安睡木屋 · 独立暖榻卧室
          </text>
        </g>
      </g>
    </g>
  );
};
