import { svgAction } from '../../world/interactions/svgAction';
import type { InteractionTarget } from '../../world/interactions/interactionTypes';
import React from 'react';
import { CharacterHead } from '../CharacterAvatar';
import type { Person, RoomId } from '../../types';
import type { ResolvedPresenceSlot } from '../../utils/sceneViewMapping';

export interface ObservatoryHavenProps {
  activeRoom?: RoomId | 'overview';
  presenceSlots: Partial<Record<'observatory_post', ResolvedPresenceSlot>>;
  alienPulseEffect?: boolean;
  triggerAlienSignal: (event?: React.MouseEvent) => void;
  onSelectPerson: (person: Person) => void;
  setHoveredObject: (target: InteractionTarget | null) => void;
}
export function ObservatoryHaven({ activeRoom, presenceSlots, alienPulseEffect, triggerAlienSignal, onSelectPerson, setHoveredObject }: ObservatoryHavenProps) {
  return <>
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

              {/* 3. RADIO TELEMETRY CONTROL CABIN & POWER STATION (山巅射电监听工作站/操作机柜室) */}
              <g id="radio-control-cabin" transform="translate(-40, 2)">
                {/* Cabin Shadow on Deck */}
                <polygon points="-6,22 28,14 32,24 0,32" fill="#202922" opacity="0.4" />

                {/* Cabin Body Walls */}
                <polygon points="-8,4 18,-4 18,22 -8,30" fill="#38453d" stroke="#252e28" strokeWidth="1.2" />
                <polygon points="18,-4 28,-1 28,25 18,22" fill="#29332c" />

                {/* Corrugated Texture / Panel Seams */}
                <line x1="-8" y1="12" x2="18" y2="4" stroke="#47574d" strokeWidth="0.8" />
                <line x1="-8" y1="20" x2="18" y2="12" stroke="#47574d" strokeWidth="0.8" />

                {/* Slanted Alpine Roof with Solar Panel Array */}
                <polygon points="-10,4 16,-6 30,-2 4,8" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
                {/* Solar Cells Grid */}
                <line x1="-2" y1="1" x2="22" y2="-7" stroke="#38bdf8" strokeWidth="0.8" opacity="0.7" />
                <line x1="2" y1="5" x2="26" y2="-3" stroke="#38bdf8" strokeWidth="0.8" opacity="0.7" />
                <line x1="10" y1="-2" x2="14" y2="6" stroke="#38bdf8" strokeWidth="0.8" opacity="0.7" />

                {/* Front Heavy Duty Equipment Door */}
                <rect x="-4" y="11" width="10" height="16" rx="2" fill="#252d27" stroke="#181f1a" strokeWidth="0.9" />
                <circle cx="4" cy="19" r="1.2" fill="#fcd34d" />

                {/* Illuminated Monitoring Observation Window (Glowing with phosphor meters) */}
                <rect x="8" y="5" width="7" height="8" rx="1.5" fill="#064e3b" stroke="#10b981" strokeWidth="0.8" />
                <line x1="9" y1="9" x2="14" y2="9" stroke="#38ef7d" strokeWidth="1" className="animate-pulse" />
                <circle cx="10" cy="7" r="0.8" fill="#fcd34d" />
                <circle cx="13" cy="7" r="0.8" fill="#38ef7d" />

                {/* Tall Communications Beacon Mast atop Cabin Roof */}
                <line x1="16" y1="-6" x2="16" y2="-28" stroke="#334155" strokeWidth="1.6" />
                <line x1="13" y1="-22" x2="19" y2="-22" stroke="#475569" strokeWidth="1" />
                <line x1="14" y1="-16" x2="18" y2="-16" stroke="#475569" strokeWidth="1" />
                {/* Strobe Warning Light */}
                <circle cx="16" cy="-28" r="2.2" fill="#ef4444" className="animate-ping" />
                <circle cx="16" cy="-28" r="1.6" fill="#f87171" />

                {/* Cable Conduit Bridge running to the Radio Dish */}
                <path d="M26,20 Q36,18 42,22" stroke="#1e293b" strokeWidth="2.5" fill="none" />
                <path d="M26,22 Q36,20 42,24" stroke="#047857" strokeWidth="1.6" fill="none" />
              </g>

              {/* 4. GRAND PARABOLIC SETI ALIEN RADIO DISH & LATTICE STEEL TOWER (大口径外星射电抛物面天线塔架) */}
              <g {...svgAction('捕获外星电波')}
                id="alien-receiver-assembly"
                transform="translate(16, 2)"
                onClick={(e) => {
                  triggerAlienSignal(e);
                }}
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  setHoveredObject({ kind: 'entity', id: 'alien-receiver' });
                }}
                onMouseLeave={() => setHoveredObject(null)}
                className="group/dish cursor-pointer"
              >
                {/* Base Shadow on Terrace Deck */}
                <ellipse cx="0" cy="22" rx="26" ry="10" fill="#1b231d" opacity="0.45" filter="url(#softShadow)" />

                {/* Heavy Structural Steel Quad-Pylon Lattice Tower (高架钢桁架塔体) */}
                <g id="dish-lattice-mast">
                  {/* Concrete Anchorage Footings */}
                  <rect x="-18" y="19" width="6" height="4" rx="1" fill="#3f4a42" stroke="#252d27" strokeWidth="0.8" />
                  <rect x="12" y="19" width="6" height="4" rx="1" fill="#3f4a42" stroke="#252d27" strokeWidth="0.8" />
                  <rect x="-8" y="14" width="5" height="3" rx="1" fill="#2d352f" />
                  <rect x="3" y="14" width="5" height="3" rx="1" fill="#2d352f" />

                  {/* Main Steel Truss Legs */}
                  <line x1="-15" y1="20" x2="-6" y2="-12" stroke="#242c26" strokeWidth="3.2" strokeLinecap="round" />
                  <line x1="15" y1="20" x2="6" y2="-12" stroke="#242c26" strokeWidth="3.2" strokeLinecap="round" />
                  <line x1="-6" y1="15" x2="-3" y2="-10" stroke="#333d36" strokeWidth="2.2" />
                  <line x1="5" y1="15" x2="3" y2="-10" stroke="#333d36" strokeWidth="2.2" />

                  {/* Steel Diagonal Lattice Cross Bracings */}
                  <line x1="-14" y1="16" x2="5" y2="6" stroke="#3f4d42" strokeWidth="1.6" />
                  <line x1="14" y1="16" x2="-5" y2="6" stroke="#3f4d42" strokeWidth="1.6" />
                  <line x1="-10" y1="7" x2="4" y2="-3" stroke="#3f4d42" strokeWidth="1.6" />
                  <line x1="10" y1="7" x2="-4" y2="-3" stroke="#3f4d42" strokeWidth="1.6" />
                  <line x1="-6" y1="-2" x2="3" y2="-10" stroke="#3f4d42" strokeWidth="1.4" />
                  <line x1="6" y1="-2" x2="-3" y2="-10" stroke="#3f4d42" strokeWidth="1.4" />

                  {/* Central Service Maintenance Ladder */}
                  <line x1="0" y1="18" x2="0" y2="-10" stroke="#48594d" strokeWidth="1.4" />
                  {[-8, -4, 0, 4, 8, 12, 16].map((ly) => (
                    <line key={ly} x1="-2.5" y1={ly} x2="2.5" y2={ly} stroke="#48594d" strokeWidth="1" />
                  ))}

                  {/* Maintenance Circular Walkway Platform with Safety Rail */}
                  <ellipse cx="0" cy="-12" rx="14" ry="4.5" fill="#3e4d42" stroke="#222b24" strokeWidth="1" />
                  <ellipse cx="0" cy="-15" rx="13" ry="4" fill="none" stroke="#222b24" strokeWidth="0.9" />
                  <line x1="-13" y1="-12" x2="-13" y2="-15" stroke="#222b24" strokeWidth="1" />
                  <line x1="13" y1="-12" x2="13" y2="-15" stroke="#222b24" strokeWidth="1" />
                  <line x1="0" y1="-7.5" x2="0" y2="-11" stroke="#222b24" strokeWidth="1" />

                  {/* Dual-Axis Motorized Antenna Pedestal & Gimbal Turret */}
                  <rect x="-6" y="-18" width="12" height="7" rx="2" fill="#2d3730" stroke="#161d18" strokeWidth="1" />
                  <circle cx="0" cy="-15" r="3" fill="#b09361" />
                  {/* Heavy Mechanical Counterweight Cylinders */}
                  <rect x="-12" y="-21" width="5" height="8" rx="1.5" fill="#1f2621" stroke="#141815" strokeWidth="0.8" />
                  <rect x="7" y="-21" width="5" height="8" rx="1.5" fill="#1f2621" stroke="#141815" strokeWidth="0.8" />
                </g>

                {/* 🌟 GRAND PARABOLIC DISH (Angled skyward 34° toward Deep Space / Cosmos) */}
                <g transform="translate(0, -22) rotate(-34 0 0)">
                  {/* Outer Dish Structural Shell & Dark Rim */}
                  <ellipse cx="0" cy="0" rx="30" ry="20" fill="#28332a" stroke="#18201a" strokeWidth="1.6" filter="url(#softShadow)" />

                  {/* Dish Interior Parabolic Reflecting Surface (Weathered Sage / Mountain Titanium) */}
                  <ellipse cx="0" cy="0" rx="28" ry="18" fill="#cddad0" stroke="#526356" strokeWidth="1.4" />

                  {/* Concentric Microwave Radar Reflective Wire Mesh Rings */}
                  <ellipse cx="0" cy="0" rx="21" ry="13.5" fill="none" stroke="#758879" strokeWidth="0.9" strokeDasharray="4 2.5" />
                  <ellipse cx="0" cy="0" rx="14" ry="9" fill="none" stroke="#758879" strokeWidth="0.9" strokeDasharray="3 2" />
                  <ellipse cx="0" cy="0" rx="7" ry="4.5" fill="none" stroke="#758879" strokeWidth="0.8" />

                  {/* Parabolic Radial Rib Spokes (8 structural sectors) */}
                  <line x1="-27" y1="0" x2="27" y2="0" stroke="#687b6d" strokeWidth="0.8" opacity="0.75" />
                  <line x1="0" y1="-17" x2="0" y2="17" stroke="#687b6d" strokeWidth="0.8" opacity="0.75" />
                  <line x1="-20" y1="-12" x2="20" y2="12" stroke="#687b6d" strokeWidth="0.7" opacity="0.6" />
                  <line x1="-20" y1="12" x2="20" y2="-12" stroke="#687b6d" strokeWidth="0.7" opacity="0.6" />

                  {/* Quad-pod Struts converging to Sub-Reflector Feed Horn Tip */}
                  <line x1="-23" y1="0" x2="0" y2="-24" stroke="#324036" strokeWidth="1.5" />
                  <line x1="23" y1="0" x2="0" y2="-24" stroke="#324036" strokeWidth="1.5" />
                  <line x1="0" y1="16" x2="0" y2="-24" stroke="#324036" strokeWidth="1.5" />
                  <line x1="0" y1="-16" x2="0" y2="-24" stroke="#324036" strokeWidth="1.5" />

                  {/* Central Sub-reflector Horn & Alien Detection Sensor Feed */}
                  <circle cx="0" cy="-24" r="4.0" fill="#152119" stroke="#34d399" strokeWidth="1.3" />
                  <circle cx="0" cy="-24" r="2.5" fill="#34d399" />
                  {/* High Gain Core Sensor Tip */}
                  <circle cx="0" cy="-24" r="1.2" fill="#ffffff" />
                </g>

                {/* 📡 COSMIC ALIEN WAVE RESONANCE & PULSES (Click-triggered or subtle) */}
                {alienPulseEffect && (
                  <g transform="translate(14, -54)">
                    <circle cx="0" cy="0" r="18" fill="none" stroke="#34d399" strokeWidth="1.8" className="animate-ping pointer-events-none" />
                    <circle cx="0" cy="0" r="36" fill="none" stroke="#38bdf8" strokeWidth="1.6" className="animate-ping pointer-events-none" />
                    <circle cx="0" cy="0" r="54" fill="none" stroke="#a78bfa" strokeWidth="1.2" className="animate-ping pointer-events-none" />
                  </g>
                )}
              </g>

              {/* 5. OUTDOOR FIELD TELEMETRY CONSOLE & CRT OSCILLOSCOPE (户外射电监听操作台与频谱示波器) */}
              <g id="telemetry-field-desk" transform="translate(-16, 12)">
                {/* Console Desk Body */}
                <rect x="0" y="0" width="22" height="17" rx="2.5" fill="#222b24" stroke="#141a15" strokeWidth="1.2" />

                {/* Dual CRT Phosphor Display Screens */}
                {/* CRT Screen 1: Pulsing Signal Oscilloscope Waveform */}
                <rect x="2" y="2" width="10" height="7.5" rx="1.2" fill="#08140c" stroke="#10b981" strokeWidth="0.7" />
                <path
                  d="M3,5.5 Q5,3.2 6.5,5.5 T9,5.5 T11,5.5"
                  fill="none"
                  stroke="#38ef7d"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  className="animate-pulse"
                />

                {/* CRT Screen 2: Frequency Spectrum Analyzer */}
                <rect x="13" y="2" width="7" height="7.5" rx="1.2" fill="#08140c" stroke="#38bdf8" strokeWidth="0.7" />
                <line x1="14.5" y1="8" x2="14.5" y2="4.5" stroke="#38bdf8" strokeWidth="1" />
                <line x1="16.5" y1="8" x2="16.5" y2="3.2" stroke="#38ef7d" strokeWidth="1" className="animate-pulse" />
                <line x1="18.5" y1="8" x2="18.5" y2="5.5" stroke="#38bdf8" strokeWidth="1" />

                {/* Instrument Dials, Knobs & LED Indicators */}
                <circle cx="4" cy="12.5" r="1.3" fill="#fcd34d" />
                <circle cx="8" cy="12.5" r="1.3" fill="#ef4444" />
                <circle cx="12" cy="12.5" r="1.3" fill="#38ef7d" className="animate-ping" />
                <circle cx="16" cy="12.5" r="1.3" fill="#38bdf8" />
                <line x1="2" y1="15.5" x2="20" y2="15.5" stroke="#37453b" strokeWidth="0.8" />

                {/* Frequency Badge Tag */}
                <g transform="translate(11, 24)" className="pointer-events-none">
                  <rect x="-26" y="-5.5" width="52" height="11" rx="5.5" fill="#121a14" stroke="#10b981" strokeWidth="0.8" opacity="0.95" />
                  <text x="0" y="2.8" fill="#38ef7d" fontSize="6.8" fontWeight="bold" textAnchor="middle">
                    1420.4 MHz · SETI
                  </text>
                </g>
              </g>

              {/* 6. SETI RESEARCHER / LISTENING SPECIALIST (由 Presence 场景槽位 observatory_post 动态分配与驱动：侧身监听外星电波) */}
              {(() => {
                const obsOccupant = presenceSlots.observatory_post?.occupant;
                const slotCfg = presenceSlots.observatory_post?.config;
                if (!obsOccupant || !slotCfg) return null;

                return (
                  <g {...svgAction('查看人物状态')}
                    id={`person-in-observatory-${obsOccupant.id}`}
                    transform={`translate(${slotCfg.offset.dx}, ${slotCfg.offset.dy})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectPerson(obsOccupant);
                    }}
                    onMouseEnter={(e) => {
                      e.stopPropagation();
                      setHoveredObject({ kind: 'person', id: obsOccupant.id });
                    }}
                    onMouseLeave={() => setHoveredObject(null)}
                    className="cursor-pointer group/char"
                  >
                    {/* Floor Shadow */}
                    <ellipse cx="0" cy="12" rx="7" ry="3" fill="#1a201b" opacity="0.45" />
                    {/* Warm Winter Parka / Character Body */}
                    <rect x="-6" y="-2" width="12" height="14" rx="4" fill={obsOccupant.shirtColor} filter="url(#softShadow)" />
                    {/* Character Head: 侧身视角 (facing="side") */}
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

                    {/* Over-Ear Radio Communication Headset (监听耳机与麦克风) */}
                    <path d="M-6,-7 Q0,-13 6,-7" stroke="#1e293b" strokeWidth="1.8" fill="none" />
                    <rect x="-7" y="-9" width="2.5" height="4.5" rx="1.2" fill="#38ef7d" />
                    <rect x="4.5" y="-9" width="2.5" height="4.5" rx="1.2" fill="#38ef7d" />
                    <path d="M-5,-5 Q-2,-2 1,-4" stroke="#1e293b" strokeWidth="0.9" fill="none" />

                    {/* Clipboard / Radio Log in Hand */}
                    <polygon points="5,1 11,1 11,8 5,8" fill="#e2e8f0" stroke="#475569" strokeWidth="0.6" />
                    <line x1="7" y1="3" x2="10" y2="3" stroke="#059669" strokeWidth="0.6" />
                    <line x1="7" y1="5" x2="10" y2="5" stroke="#059669" strokeWidth="0.6" />

                    {/* Character Name & Activity Whispers */}
                    <g transform="translate(0, -23)" className="pointer-events-none">
                      <rect x="-46" y="-7" width="92" height="15" rx="7.5" fill="#121a14" stroke="#10b981" strokeWidth="0.8" opacity="0.94" />
                      <text x="0" y="3.5" fill="#d1fae5" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                        📡 {obsOccupant.name} · {slotCfg.badgeLabel.split('(')[0].trim()}
                      </text>
                    </g>
                  </g>
                );
              })()}

              {/* Hover Pill Label for Alien Radio Station */}
              <g
                transform="translate(0, 48)"
                className="opacity-0 group-hover/observatory:opacity-100 transition-opacity pointer-events-none"
              >
                <rect x="-76" y="-8.5" width="152" height="17" rx="8.5" fill="#131c15" stroke="#10b981" strokeWidth="0.9" opacity="0.95" />
                <text x="0" y="3.8" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
                  📡 山巅外星电波监听站 · 点击捕获信号
                </text>
              </g>
            </>;
}
