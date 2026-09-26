import React from 'react';
import { CommunicationHillProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';
import { CharacterHead } from '../../../CharacterAvatar';

/**
 * 📡 CommunicationHill (High Mountain SETI Deep-Space Alien Radio Station & Antenna Tower)
 *
 * Layer: 05 INFRASTRUCTURE / Communication Hill
 * Spatial Region: YORKSHIRE_LAYOUT.communicationHill
 *
 * Preserves the high mountain summit, radio dish, telemetry cabin,
 * console, presence avatar slot, and alien signal pulse effects.
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
  const station = hill.station;

  return (
    <g id="hilltop-observatory-haven" className={className}>
      {/* Mountain Ridge Wild Pines on the crest */}
      <g id="mountain-ridge-pines" opacity="0.85">
        <g transform="translate(820, 165)">
          <polygon points="0,0 8,-20 16,0" fill="#294833" />
          <polygon points="2,-12 8,-28 14,-12" fill="#355e42" />
          <line x1="8" y1="0" x2="8" y2="6" stroke="#2b2018" strokeWidth="2" />
        </g>
        <g transform="translate(945, 110)">
          <polygon points="0,0 7,-18 14,0" fill="#294833" />
          <polygon points="2,-10 7,-24 12,-10" fill="#355e42" />
          <line x1="7" y1="0" x2="7" y2="5" stroke="#2b2018" strokeWidth="1.8" />
        </g>
      </g>

      {/* Main Elevated SETI Alien Radio Station */}
      <g
        id="room-observatory"
        transform={`translate(${station.center.x}, ${station.center.y}) scale(0.84)`}
        onClick={() => {
          if (!hasMovedRef?.current) onSelectRoom?.('observatory');
        }}
        onMouseEnter={() => setHoveredObject?.('room-observatory')}
        onMouseLeave={() => setHoveredObject?.(null)}
        className="cursor-pointer group/observatory"
      >
        {/* Massive Cliff Outcrop Drop Shadow casting onto lower slopes */}
        <ellipse cx="0" cy="52" rx="78" ry="20" fill="#1b231d" opacity="0.35" filter="url(#softShadow)" />

        {/* Active Room Focus Aura (Cosmic Emerald Glow) */}
        {activeRoom === 'observatory' && (
          <ellipse
            cx="0"
            cy="-12"
            rx="86"
            ry="74"
            fill="rgba(56, 239, 125, 0.12)"
            stroke="#38ef7d"
            strokeWidth="2.2"
            strokeDasharray="7 5"
            className="animate-[pulse_3s_infinite]"
          />
        )}

        {/* 1. MOUNTAIN SUMMIT CLIFF CRAG / ROCKY PROMONTORY (山巅悬崖基座) */}
        <g id="summit-cliff-crag">
          <polygon points="-65,22 0,4 66,22 4,50 -65,22" fill="#363f38" stroke="#242c26" strokeWidth="1.5" />
          <polygon points="-65,22 4,50 4,62 -65,34" fill="#252c26" />
          <polygon points="4,50 66,22 66,34 4,62" fill="#2f3731" />
          <path d="M-40,28 L-10,42 L35,28" stroke="#1d231e" strokeWidth="1.8" fill="none" />
          <path d="M-20,38 L15,48 L50,34" stroke="#1d231e" strokeWidth="1.6" fill="none" />
          <ellipse cx="-45" cy="24" rx="8" ry="3.5" fill="#4d6953" />
          <ellipse cx="38" cy="26" rx="10" ry="4" fill="#4d6953" />
          <ellipse cx="2" cy="46" rx="7" ry="3" fill="#3f5744" />
        </g>

        {/* 2. Natural Mountain Stone Terrace Platform */}
        <g id="observatory-terrace-deck">
          <polygon points="-62,22 0,6 64,22 0,38" fill="#525d54" stroke="#333b35" strokeWidth="1.4" />
          <polygon points="-58,21 0,8 60,21 0,35" fill="#717e73" />
          <line x1="-36" y1="16" x2="-8" y2="29" stroke="#48524a" strokeWidth="1.2" opacity="0.65" />
          <line x1="8" y1="12" x2="38" y2="25" stroke="#48524a" strokeWidth="1.2" opacity="0.65" />
          <line x1="-15" y1="11" x2="16" y2="24" stroke="#48524a" strokeWidth="1" opacity="0.5" />

          {/* Heavy Wrought Iron Perimeter Safety Railing */}
          <g id="observatory-railing" opacity="0.9">
            <line x1="-58" y1="18" x2="58" y2="18" stroke="#252c27" strokeWidth="2.2" />
            <line x1="-58" y1="13" x2="58" y2="13" stroke="#252c27" strokeWidth="1.4" />
            {[-54, -36, -18, 0, 18, 36, 54].map((rx) => (
              <g key={rx}>
                <line x1={rx} y1="21" x2={rx} y2="10" stroke="#252c27" strokeWidth="2" strokeLinecap="round" />
                <circle cx={rx} cy="10" r="1.3" fill="#d4af37" />
              </g>
            ))}
          </g>
        </g>

        {/* 3. RADIO TELEMETRY CONTROL CABIN & POWER STATION */}
        <g id="radio-control-cabin" transform="translate(-40, 2)">
          <polygon points="-6,22 28,14 32,24 0,32" fill="#202922" opacity="0.4" />
          <polygon points="-8,4 18,-4 18,22 -8,30" fill="#38453d" stroke="#252e28" strokeWidth="1.2" />
          <polygon points="18,-4 28,-1 28,25 18,22" fill="#29332c" />
          <line x1="-8" y1="12" x2="18" y2="4" stroke="#47574d" strokeWidth="0.8" />
          <line x1="-8" y1="20" x2="18" y2="12" stroke="#47574d" strokeWidth="0.8" />
          <polygon points="-10,4 16,-6 30,-2 4,8" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
          <line x1="-2" y1="1" x2="22" y2="-7" stroke="#38bdf8" strokeWidth="0.8" opacity="0.7" />
          <line x1="2" y1="5" x2="26" y2="-3" stroke="#38bdf8" strokeWidth="0.8" opacity="0.7" />
          <line x1="10" y1="-2" x2="14" y2="6" stroke="#38bdf8" strokeWidth="0.8" opacity="0.7" />
          <rect x="-4" y="11" width="10" height="16" rx="2" fill="#252d27" stroke="#181f1a" strokeWidth="0.9" />
          <circle cx="4" cy="19" r="1.2" fill="#fcd34d" />
          <rect x="8" y="5" width="7" height="8" rx="1.5" fill="#064e3b" stroke="#10b981" strokeWidth="0.8" />
          <line x1="9" y1="9" x2="14" y2="9" stroke="#38ef7d" strokeWidth="1" className="animate-pulse" />
          <circle cx="10" cy="7" r="0.8" fill="#fcd34d" />
          <circle cx="13" cy="7" r="0.8" fill="#38ef7d" />
          <line x1="16" y1="-6" x2="16" y2="-28" stroke="#334155" strokeWidth="1.6" />
          <line x1="13" y1="-22" x2="19" y2="-22" stroke="#475569" strokeWidth="1" />
          <line x1="14" y1="-16" x2="18" y2="-16" stroke="#475569" strokeWidth="1" />
          <circle cx="16" cy="-28" r="2.2" fill="#ef4444" className="animate-ping" />
          <circle cx="16" cy="-28" r="1.6" fill="#f87171" />
          <path d="M26,20 Q36,18 42,22" stroke="#1e293b" strokeWidth="2.5" fill="none" />
          <path d="M26,22 Q36,20 42,24" stroke="#047857" strokeWidth="1.6" fill="none" />
        </g>

        {/* 4. GRAND PARABOLIC SETI ALIEN RADIO DISH & LATTICE STEEL TOWER */}
        <g
          id="alien-receiver-assembly"
          transform="translate(16, 2)"
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
          <ellipse cx="0" cy="22" rx="26" ry="10" fill="#1b231d" opacity="0.45" filter="url(#softShadow)" />

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
              <line key={ly} x1="-2.5" y1={ly} x2="2.5" y2={ly} stroke="#48594d" strokeWidth="1" />
            ))}
            <ellipse cx="0" cy="-12" rx="14" ry="4.5" fill="#3e4d42" stroke="#222b24" strokeWidth="1" />
            <ellipse cx="0" cy="-15" rx="13" ry="4" fill="none" stroke="#222b24" strokeWidth="0.9" />
            <line x1="-13" y1="-12" x2="-13" y2="-15" stroke="#222b24" strokeWidth="1" />
            <line x1="13" y1="-12" x2="13" y2="-15" stroke="#222b24" strokeWidth="1" />
            <line x1="0" y1="-7.5" x2="0" y2="-11" stroke="#222b24" strokeWidth="1" />
            <rect x="-6" y="-18" width="12" height="7" rx="2" fill="#2d3730" stroke="#161d18" strokeWidth="1" />
            <circle cx="0" cy="-15" r="3" fill="#b09361" />
            <rect x="-12" y="-21" width="5" height="8" rx="1.5" fill="#1f2621" stroke="#141815" strokeWidth="0.8" />
            <rect x="7" y="-21" width="5" height="8" rx="1.5" fill="#1f2621" stroke="#141815" strokeWidth="0.8" />
          </g>

          <g transform="translate(0, -22) rotate(-34 0 0)">
            <ellipse cx="0" cy="0" rx="30" ry="20" fill="#28332a" stroke="#18201a" strokeWidth="1.6" filter="url(#softShadow)" />
            <ellipse cx="0" cy="0" rx="28" ry="18" fill="#cddad0" stroke="#526356" strokeWidth="1.4" />
            <ellipse cx="0" cy="0" rx="21" ry="13.5" fill="none" stroke="#758879" strokeWidth="0.9" strokeDasharray="4 2.5" />
            <ellipse cx="0" cy="0" rx="14" ry="9" fill="none" stroke="#758879" strokeWidth="0.9" strokeDasharray="3 2" />
            <ellipse cx="0" cy="0" rx="7" ry="4.5" fill="none" stroke="#758879" strokeWidth="0.8" />
            <line x1="-27" y1="0" x2="27" y2="0" stroke="#687b6d" strokeWidth="0.8" opacity="0.75" />
            <line x1="0" y1="-17" x2="0" y2="17" stroke="#687b6d" strokeWidth="0.8" opacity="0.75" />
            <line x1="-20" y1="-12" x2="20" y2="12" stroke="#687b6d" strokeWidth="0.7" opacity="0.6" />
            <line x1="-20" y1="12" x2="20" y2="-12" stroke="#687b6d" strokeWidth="0.7" opacity="0.6" />
            <line x1="-23" y1="0" x2="0" y2="-24" stroke="#324036" strokeWidth="1.5" />
            <line x1="23" y1="0" x2="0" y2="-24" stroke="#324036" strokeWidth="1.5" />
            <line x1="0" y1="16" x2="0" y2="-24" stroke="#324036" strokeWidth="1.5" />
            <line x1="0" y1="-16" x2="0" y2="-24" stroke="#324036" strokeWidth="1.5" />
            <circle cx="0" cy="-24" r="4.0" fill="#152119" stroke="#34d399" strokeWidth="1.3" />
            <circle cx="0" cy="-24" r="2.5" fill="#34d399" />
            <circle cx="0" cy="-24" r="1.2" fill="#ffffff" />
          </g>

          {alienPulseEffect && (
            <g transform="translate(14, -54)">
              <circle cx="0" cy="0" r="18" fill="none" stroke="#34d399" strokeWidth="1.8" className="animate-ping pointer-events-none" />
              <circle cx="0" cy="0" r="36" fill="none" stroke="#38bdf8" strokeWidth="1.6" className="animate-ping pointer-events-none" />
              <circle cx="0" cy="0" r="54" fill="none" stroke="#a78bfa" strokeWidth="1.2" className="animate-ping pointer-events-none" />
            </g>
          )}
        </g>

        {/* 5. OUTDOOR FIELD TELEMETRY CONSOLE & CRT OSCILLOSCOPE */}
        <g id="telemetry-field-desk" transform="translate(-16, 12)">
          <rect x="0" y="0" width="22" height="17" rx="2.5" fill="#222b24" stroke="#141a15" strokeWidth="1.2" />
          <rect x="2" y="2" width="10" height="7.5" rx="1.2" fill="#08140c" stroke="#10b981" strokeWidth="0.7" />
          <path
            d="M3,5.5 Q5,3.2 6.5,5.5 T9,5.5 T11,5.5"
            fill="none"
            stroke="#38ef7d"
            strokeWidth="1.3"
            strokeLinecap="round"
            className="animate-pulse"
          />
          <rect x="13" y="2" width="7" height="7.5" rx="1.2" fill="#08140c" stroke="#38bdf8" strokeWidth="0.7" />
          <line x1="14.5" y1="8" x2="14.5" y2="4.5" stroke="#38bdf8" strokeWidth="1" />
          <line x1="16.5" y1="8" x2="16.5" y2="3.2" stroke="#38ef7d" strokeWidth="1" className="animate-pulse" />
          <line x1="18.5" y1="8" x2="18.5" y2="5.5" stroke="#38bdf8" strokeWidth="1" />
          <circle cx="4" cy="12.5" r="1.3" fill="#fcd34d" />
          <circle cx="8" cy="12.5" r="1.3" fill="#ef4444" />
          <circle cx="12" cy="12.5" r="1.3" fill="#38ef7d" className="animate-ping" />
          <circle cx="16" cy="12.5" r="1.3" fill="#38bdf8" />
          <line x1="2" y1="15.5" x2="20" y2="15.5" stroke="#37453b" strokeWidth="0.8" />

          <g transform="translate(11, 24)" className="pointer-events-none">
            <rect x="-26" y="-5.5" width="52" height="11" rx="5.5" fill="#121a14" stroke="#10b981" strokeWidth="0.8" opacity="0.95" />
            <text x="0" y="2.8" fill="#38ef7d" fontSize="6.8" fontWeight="bold" textAnchor="middle">
              1420.4 MHz · SETI
            </text>
          </g>
        </g>

        {/* 6. SETI RESEARCHER / LISTENING SPECIALIST */}
        {(() => {
          const obsOccupant = presenceSlots?.observatory_post?.occupant;
          const slotCfg = presenceSlots?.observatory_post?.config;
          if (!obsOccupant || !slotCfg) return null;

          return (
            <g
              id={`person-in-observatory-${obsOccupant.id}`}
              transform={`translate(${slotCfg.offset.dx}, ${slotCfg.offset.dy})`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectPerson?.(obsOccupant);
              }}
              onMouseEnter={(e) => {
                e.stopPropagation();
                setHoveredObject?.(`person-${obsOccupant.id}`);
              }}
              onMouseLeave={() => setHoveredObject?.(null)}
              className="cursor-pointer group/char"
            >
              <ellipse cx="0" cy="12" rx="7" ry="3" fill="#1a201b" opacity="0.45" />
              <rect x="-6" y="-2" width="12" height="14" rx="4" fill={obsOccupant.shirtColor} filter="url(#softShadow)" />
              <CharacterHead
                cx={0}
                cy={-7}
                r={5.5}
                skinColor={obsOccupant.skinColor || '#f5d6be'}
                hairColor={obsOccupant.hairColor || '#302319'}
                hairStyle={obsOccupant.hairStyle || 'curtain_crescent'}
                beanieColor={obsOccupant.beanieColor || '#1f3a2c'}
                hasPompom={obsOccupant.hasPompom ?? true}
                facing={slotCfg.facing}
              />
              <path d="M-6,-7 Q0,-13 6,-7" stroke="#1e293b" strokeWidth="1.8" fill="none" />
              <rect x="-7" y="-9" width="2.5" height="4.5" rx="1.2" fill="#38ef7d" />
              <rect x="4.5" y="-9" width="2.5" height="4.5" rx="1.2" fill="#38ef7d" />
              <path d="M-5,-5 Q-2,-2 1,-4" stroke="#1e293b" strokeWidth="0.9" fill="none" />
              <polygon points="5,1 11,1 11,8 5,8" fill="#e2e8f0" stroke="#475569" strokeWidth="0.6" />
              <line x1="7" y1="3" x2="10" y2="3" stroke="#059669" strokeWidth="0.6" />
              <line x1="7" y1="5" x2="10" y2="5" stroke="#059669" strokeWidth="0.6" />

              <g transform="translate(0, -23)" className="pointer-events-none">
                <rect x="-46" y="-7" width="92" height="15" rx="7.5" fill="#121a14" stroke="#10b981" strokeWidth="0.8" opacity="0.94" />
                <text x="0" y="3.5" fill="#d1fae5" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                  📡 {obsOccupant.name} · {slotCfg.badgeLabel.split('(')[0].trim()}
                </text>
              </g>
            </g>
          );
        })()}

        {/* Hover Pill Label */}
        <g
          transform="translate(0, 48)"
          className="opacity-0 group-hover/observatory:opacity-100 transition-opacity pointer-events-none"
        >
          <rect x="-76" y="-8.5" width="152" height="17" rx="8.5" fill="#131c15" stroke="#10b981" strokeWidth="0.9" opacity="0.95" />
          <text x="0" y="3.8" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
            📡 山巅外星电波监听站 · 点击捕获信号
          </text>
        </g>
      </g>
    </g>
  );
};
