import React from 'react';
import { CommunicationHillProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';
import { CharacterHead } from '../../../CharacterAvatar';

/**
 * 📡 CommunicationHill (SETI Deep-Space Alien Radio Observatory on Engineered Artificial Staging Deck)
 *
 * Layer: 05 INFRASTRUCTURE
 *
 * Redesigned per user request:
 * - Replaced awkward steep mountain slope with an engineered artificial platform (人工科研观星高台)
 * - Heavy structural steel-truss pylons, stone footings, industrial cantilevered deck, and perimeter safety railings
 * - Full interactive capabilities: Parabolic Radio Dish, Telemetry Cabin, Avatar Presence, Alien Signal Pulses
 */
export const CommunicationHill: React.FC<CommunicationHillProps> = ({
  activeRoom,
  onSelectRoom,
  onSelectPerson,
  presenceSlots,
  alienPulseEffect,
  triggerAlienSignal,
  hasMovedRef,
  setHoveredObject,
  className,
}) => {
  const hill = YORKSHIRE_LAYOUT.communicationHill;

  return (
    <g id="hilltop-observatory-haven" className={className}>
      {/* 🌟 1. ELEVATED OBSERVATORY ON ENGINEERED ARTIFICIAL STAGING DECK */}
      <g
        id="room-observatory"
        transform={`translate(${hill.center.x}, ${hill.center.y}) scale(0.86)`}
        onClick={() => {
          if (!hasMovedRef?.current) onSelectRoom?.('observatory');
        }}
        onMouseEnter={() => setHoveredObject?.('room-observatory')}
        onMouseLeave={() => setHoveredObject?.(null)}
        className="cursor-pointer group/observatory"
      >
        {/* Ground Footprint Drop Shadow under Artificial Deck */}
        <ellipse cx="0" cy="56" rx="80" ry="18" fill="#152014" opacity="0.38" filter="url(#softShadow)" />

        {/* Active Room Focus Aura (Cosmic Emerald Glow) */}
        {activeRoom === 'observatory' && (
          <ellipse
            cx="0"
            cy="-8"
            rx="88"
            ry="72"
            fill="rgba(56, 239, 125, 0.12)"
            stroke="#38ef7d"
            strokeWidth="2.2"
            strokeDasharray="7 5"
            className="animate-[pulse_3s_infinite]"
          />
        )}

        {/* ========================================================================= */}
        {/* A. ENGINEERED STRUCTURAL STAGING PYLONS & GANTRY LEGS (人工钢构桁架基座)   */}
        {/* ========================================================================= */}
        <g id="staging-deck-structural-pylons">
          {/* Concrete / Ashlar Stone Anchorage Pier Footings (4个稳固的混凝土锚固基座) */}
          <rect x="-66" y="44" width="16" height="12" rx="2" fill="#505a52" stroke="#2d352f" strokeWidth="1" />
          <polygon points="-66,44 -50,44 -46,38 -62,38" fill="#6a776c" />
          <rect x="50" y="44" width="16" height="12" rx="2" fill="#465048" stroke="#2d352f" strokeWidth="1" />
          <polygon points="50,44 66,44 62,38 46,38" fill="#5a665c" />
          <rect x="-24" y="48" width="14" height="10" rx="2" fill="#4a544c" stroke="#28302a" strokeWidth="1" />
          <rect x="10" y="48" width="14" height="10" rx="2" fill="#404a42" stroke="#28302a" strokeWidth="1" />

          {/* Heavy Structural Steel Columns (高强度工字钢立柱) */}
          <line x1="-58" y1="44" x2="-58" y2="24" stroke="#222b24" strokeWidth="5" strokeLinecap="round" />
          <line x1="-58" y1="44" x2="-58" y2="24" stroke="#48594d" strokeWidth="2.5" strokeLinecap="round" />

          <line x1="58" y1="44" x2="58" y2="24" stroke="#222b24" strokeWidth="5" strokeLinecap="round" />
          <line x1="58" y1="44" x2="58" y2="24" stroke="#48594d" strokeWidth="2.5" strokeLinecap="round" />

          <line x1="-17" y1="48" x2="-17" y2="25" stroke="#1f2721" strokeWidth="4.5" strokeLinecap="round" />
          <line x1="17" y1="48" x2="17" y2="25" stroke="#1f2721" strokeWidth="4.5" strokeLinecap="round" />

          {/* Diagonal Steel Lattice Cross Bracing (桁架交叉斜撑与节点螺栓) */}
          <line x1="-58" y1="40" x2="-17" y2="26" stroke="#334036" strokeWidth="2.2" />
          <line x1="-17" y1="44" x2="-58" y2="26" stroke="#334036" strokeWidth="2.2" />
          <line x1="58" y1="40" x2="17" y2="26" stroke="#334036" strokeWidth="2.2" />
          <line x1="17" y1="44" x2="58" y2="26" stroke="#334036" strokeWidth="2.2" />
          <line x1="-17" y1="44" x2="17" y2="26" stroke="#334036" strokeWidth="2.2" />
          <line x1="17" y1="44" x2="-17" y2="26" stroke="#334036" strokeWidth="2.2" />

          {/* Access Ladder on the Left (金属检修爬梯) */}
          <line x1="-66" y1="48" x2="-66" y2="22" stroke="#3d4c41" strokeWidth="1.8" />
          <line x1="-61" y1="48" x2="-61" y2="22" stroke="#3d4c41" strokeWidth="1.8" />
          {[26, 31, 36, 41, 46].map((ly) => (
            <line key={`ld-${ly}`} x1="-66" y1={ly} x2="-61" y2={ly} stroke="#738c7a" strokeWidth="1.2" />
          ))}
        </g>

        {/* ========================================================================= */}
        {/* B. CANTILEVERED OBSERVATION PLATFORM DECK (悬挑人工观测平台台面)           */}
        {/* ========================================================================= */}
        <g id="cantilevered-observation-deck">
          {/* Deck Plinth Edge (深色防滑钢构收边大梁) */}
          <polygon points="-75,20 0,6 75,20 0,34" fill="#2d3730" stroke="#1a221c" strokeWidth="1.2" />
          <polygon points="-75,20 0,34 0,40 -75,26" fill="#1e2621" />
          <polygon points="0,34 75,20 75,26 0,40" fill="#252f28" />

          {/* Yellow & Black Industrial Warning Strip on Platform Edge (安全警示斜纹) */}
          <polygon points="-73,21 0,34 0,36 -73,23" fill="#eab308" opacity="0.8" />
          <polygon points="0,34 73,21 73,23 0,36" fill="#ca8a04" opacity="0.8" />

          {/* Platform Floor Surface (平整宽敞的网纹防滑钢板台面) */}
          <polygon points="-72,19 0,7 72,19 0,31" fill="#4d5a50" />
          <polygon points="-70,18.5 0,7.5 70,18.5 0,29.5" fill="#5a685e" />

          {/* Isometric Floor Panel Seams (等轴测分块缝隙) */}
          <line x1="-36" y1="13" x2="-10" y2="24" stroke="#38443b" strokeWidth="1.2" opacity="0.6" />
          <line x1="10" y1="24" x2="36" y2="13" stroke="#38443b" strokeWidth="1.2" opacity="0.6" />
          <line x1="0" y1="8" x2="0" y2="30" stroke="#38443b" strokeWidth="1.2" opacity="0.5" />

          {/* Heavy Safety Handrail with Corner Caution Lanterns (工业防护栏杆与角位航标灯) */}
          <g id="deck-perimeter-handrail">
            <line x1="-70" y1="14" x2="0" y2="2" stroke="#252f28" strokeWidth="2.2" />
            <line x1="0" y1="2" x2="70" y2="14" stroke="#252f28" strokeWidth="2.2" />
            <line x1="-70" y1="9" x2="0" y2="-3" stroke="#36433a" strokeWidth="1.6" />
            <line x1="0" y1="-3" x2="70" y2="9" stroke="#36433a" strokeWidth="1.6" />

            {/* Handrail Vertical Stanchions (立柱) */}
            {[-68, -48, -28, -8, 8, 28, 48, 68].map((sx) => {
              const syTop = sx < 0 ? 14 + (sx / 68) * 12 - 7 : 2 + (sx / 70) * 12 - 5;
              const syBase = sx < 0 ? 19 + (sx / 68) * 12 : 7 + (sx / 70) * 12 + 5;
              return (
                <g key={`st-${sx}`}>
                  <line x1={sx} y1={syBase} x2={sx} y2={syTop} stroke="#252f28" strokeWidth="2.0" strokeLinecap="round" />
                  <circle cx={sx} cy={syTop} r="1.3" fill="#ca8a04" />
                </g>
              );
            })}

            {/* Green & Red Perimeter Navigation Marker LEDs (平台角位安全指示信号灯) */}
            <circle cx="-70" cy="8" r="2.2" fill="#22c55e" className="animate-pulse" />
            <circle cx="70" cy="8" r="2.2" fill="#ef4444" className="animate-pulse" />
          </g>
        </g>

        {/* ========================================================================= */}
        {/* C. RADIO TELEMETRY CONTROL CABIN & POWER STATION (射电控制工作站机房)     */}
        {/* ========================================================================= */}
        <g id="radio-control-cabin" transform="translate(-40, -4)">
          {/* Cabin Shadow on Deck */}
          <polygon points="-6,22 28,14 32,24 0,32" fill="#202922" opacity="0.4" />

          {/* Cabin Body Walls */}
          <polygon points="-8,4 18,-4 18,22 -8,30" fill="#38453d" stroke="#252e28" strokeWidth="1.2" />
          <polygon points="18,-4 28,-1 28,25 18,22" fill="#29332c" />

          {/* Panel Seams */}
          <line x1="-8" y1="12" x2="18" y2="4" stroke="#47574d" strokeWidth="0.8" />
          <line x1="-8" y1="20" x2="18" y2="12" stroke="#47574d" strokeWidth="0.8" />

          {/* Slanted Alpine Roof with Solar Panel Array */}
          <polygon points="-10,4 16,-6 30,-2 4,8" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <line x1="-2" y1="1" x2="22" y2="-7" stroke="#38bdf8" strokeWidth="0.8" opacity="0.7" />
          <line x1="2" y1="5" x2="26" y2="-3" stroke="#38bdf8" strokeWidth="0.8" opacity="0.7" />
          <line x1="10" y1="-2" x2="14" y2="6" stroke="#38bdf8" strokeWidth="0.8" opacity="0.7" />

          {/* Equipment Door */}
          <rect x="-4" y="11" width="10" height="16" rx="2" fill="#252d27" stroke="#181f1a" strokeWidth="0.9" />
          <circle cx="4" cy="19" r="1.2" fill="#fcd34d" />

          {/* Illuminated Monitoring Observation Window */}
          <rect x="8" y="5" width="7" height="8" rx="1.5" fill="#064e3b" stroke="#10b981" strokeWidth="0.8" />
          <line x1="9" y1="9" x2="14" y2="9" stroke="#38ef7d" strokeWidth="1" className="animate-pulse" />
          <circle cx="10" cy="7" r="0.8" fill="#fcd34d" />
          <circle cx="13" cy="7" r="0.8" fill="#38ef7d" />

          {/* Communications Mast atop Cabin Roof */}
          <line x1="16" y1="-6" x2="16" y2="-28" stroke="#334155" strokeWidth="1.6" />
          <line x1="13" y1="-22" x2="19" y2="-22" stroke="#475569" strokeWidth="1" />
          <line x1="14" y1="-16" x2="18" y2="-16" stroke="#475569" strokeWidth="1" />
          <circle cx="16" cy="-28" r="2.2" fill="#ef4444" className="animate-ping" />
          <circle cx="16" cy="-28" r="1.6" fill="#f87171" />

          {/* Heavy Cable Conduit Bridge to Dish */}
          <path d="M26,20 Q36,18 42,22" stroke="#1e293b" strokeWidth="2.5" fill="none" />
          <path d="M26,22 Q36,20 42,24" stroke="#047857" strokeWidth="1.6" fill="none" />
        </g>

        {/* ========================================================================= */}
        {/* D. GRAND PARABOLIC SETI ALIEN RADIO DISH & LATTICE TOWER (射电抛物面天线)  */}
        {/* ========================================================================= */}
        <g
          id="alien-receiver-assembly"
          transform="translate(16, -4)"
          onClick={(e) => {
            triggerAlienSignal?.(e);
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            setHoveredObject?.('alien-receiver');
          }}
          onMouseLeave={() => setHoveredObject?.(null)}
          className="group/dish cursor-pointer"
        >
          {/* Base Shadow on Terrace Deck */}
          <ellipse cx="0" cy="22" rx="26" ry="10" fill="#1b231d" opacity="0.4" filter="url(#softShadow)" />

          {/* Lattice Mast */}
          <g id="dish-lattice-mast">
            <rect x="-18" y="19" width="6" height="4" rx="1" fill="#3f4a42" stroke="#252d27" strokeWidth="0.8" />
            <rect x="12" y="19" width="6" height="4" rx="1" fill="#3f4a42" stroke="#252d27" strokeWidth="0.8" />
            <rect x="-8" y="14" width="5" height="3" rx="1" fill="#2d352f" />
            <rect x="3" y="14" width="5" height="3" rx="1" fill="#2d352f" />

            <line x1="-15" y1="20" x2="-6" y2="-12" stroke="#242c26" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="15" y1="20" x2="6" y2="-12" stroke="#242c26" strokeWidth="3.2" strokeLinecap="round" />
            <line x1="-6" y1="15" x2="-3" y2="-10" stroke="#333d36" strokeWidth="2.2" />
            <line x1="5" y1="15" x2="3" y2="-10" stroke="#333d36" strokeWidth="2.2" />

            <line x1="-14" y1="16" x2="5" y2="6" stroke="#3f4d42" strokeWidth="1.6" />
            <line x1="14" y1="16" x2="-5" y2="6" stroke="#3f4d42" strokeWidth="1.6" />
            <line x1="-10" y1="7" x2="4" y2="-3" stroke="#3f4d42" strokeWidth="1.6" />
            <line x1="10" y1="7" x2="-4" y2="-3" stroke="#3f4d42" strokeWidth="1.6" />
            <line x1="-6" y1="-2" x2="3" y2="-10" stroke="#3f4d42" strokeWidth="1.4" />
            <line x1="6" y1="-2" x2="-3" y2="-10" stroke="#3f4d42" strokeWidth="1.4" />

            <line x1="0" y1="18" x2="0" y2="-10" stroke="#48594d" strokeWidth="1.4" />
            {[-8, -4, 0, 4, 8, 12, 16].map((ly) => (
              <line key={`dl-${ly}`} x1="-2.5" y1={ly} x2="2.5" y2={ly} stroke="#48594d" strokeWidth="1" />
            ))}

            <ellipse cx="0" cy="-12" rx="14" ry="4.5" fill="#3e4d42" stroke="#222b24" strokeWidth="1" />
            <ellipse cx="0" cy="-15" rx="13" ry="4" fill="none" stroke="#222b24" strokeWidth="0.9" />
            <line x1="-13" y1="-12" x2="-13" y2="-15" stroke="#222b24" strokeWidth="1" />
            <line x1="13" y1="-12" x2="13" y2="-15" stroke="#222b24" strokeWidth="1" />

            <rect x="-6" y="-18" width="12" height="7" rx="2" fill="#2d3730" stroke="#161d18" strokeWidth="1" />
            <circle cx="0" cy="-15" r="3" fill="#b09361" />
            <rect x="-12" y="-21" width="5" height="8" rx="1.5" fill="#1f2621" stroke="#141815" strokeWidth="0.8" />
            <rect x="7" y="-21" width="5" height="8" rx="1.5" fill="#1f2621" stroke="#141815" strokeWidth="0.8" />
          </g>

          {/* Parabolic Dish (Angled skyward 34° toward Deep Space) */}
          <g transform="translate(0, -22) rotate(-34 0 0)">
            <ellipse cx="0" cy="0" rx="34" ry="21" fill="#1a231c" />
            <ellipse cx="0" cy="-3" rx="33" ry="19" fill="#2d3b2f" stroke="#495f4c" strokeWidth="1.2" />
            <ellipse cx="0" cy="-2" rx="31" ry="17.5" fill="#3e5241" />

            <ellipse cx="0" cy="-1" rx="28" ry="15" fill="none" stroke="#546e58" strokeWidth="0.9" opacity="0.75" />
            <ellipse cx="0" cy="0" rx="21" ry="11" fill="none" stroke="#546e58" strokeWidth="0.9" opacity="0.75" />
            <ellipse cx="0" cy="1" rx="13" ry="7" fill="none" stroke="#546e58" strokeWidth="0.9" opacity="0.75" />

            {[-60, -30, 0, 30, 60].map((deg) => (
              <line
                key={`dr-${deg}`}
                x1={0}
                y1={0}
                x2={31 * Math.sin((deg * Math.PI) / 180)}
                y2={-17 * Math.cos((deg * Math.PI) / 180)}
                stroke="#546e58"
                strokeWidth="0.8"
                opacity="0.65"
              />
            ))}

            <line x1="-22" y1="-2" x2="0" y2="-24" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="22" y1="-2" x2="0" y2="-24" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="0" y1="12" x2="0" y2="-24" stroke="#e2e8f0" strokeWidth="1.5" strokeLinecap="round" />

            <circle cx="0" cy="-24" r="4.2" fill="#b09361" stroke="#5a4521" strokeWidth="0.8" />
            <circle cx="0" cy="-24" r="2.2" fill="#38ef7d" className="animate-pulse" />
            <circle cx="0" cy="-24" r="1.2" fill="#ffffff" />
          </g>

          {/* Interactive Alien Signal Waves */}
          {alienPulseEffect && (
            <g transform="translate(0, -38)" className="pointer-events-none">
              <ellipse cx="0" cy="0" rx="14" ry="8" fill="none" stroke="#38ef7d" strokeWidth="2.2" className="animate-ping" opacity="0.9" />
              <ellipse cx="0" cy="-14" rx="28" ry="15" fill="none" stroke="#38ef7d" strokeWidth="2.0" className="animate-pulse" opacity="0.7" />
              <ellipse cx="0" cy="-30" rx="42" ry="22" fill="none" stroke="#38ef7d" strokeWidth="1.6" opacity="0.5" />
            </g>
          )}

          {/* Status Display Pill */}
          <g transform="translate(0, 36)" className="transition-transform group-hover/dish:scale-105">
            <rect x="-34" y="-7" width="68" height="14" rx="7" fill="#09130d" stroke="#38ef7d" strokeWidth="0.9" opacity="0.95" />
            <circle cx="-24" cy="0" r="2.2" fill="#38ef7d" className="animate-pulse" />
            <text x="3" y="3" fill="#d1fae5" fontSize="6.5" fontWeight="bold" textAnchor="middle" letterSpacing="0.4">
              1420.4 MHz · SETI
            </text>
          </g>
        </g>

        {/* E. Character Presence on Observation Staging Deck */}
        {presenceSlots?.observatory?.occupant && (
          <g
            transform="translate(-6, 12) scale(0.72)"
            onClick={(e) => {
              e.stopPropagation();
              onSelectPerson?.(presenceSlots.observatory.occupant!);
            }}
            className="cursor-pointer"
          >
            <CharacterHead
              character={presenceSlots.observatory.occupant}
              size={36}
              interactive={true}
              showExpressionBubble={true}
            />
          </g>
        )}
      </g>
    </g>
  );
};
