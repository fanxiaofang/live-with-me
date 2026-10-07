import React from 'react';
import type { YorkshireSceneTheme } from '../../components/scenery/yorkshire/landscapeTypes';
import type { HoverTarget } from '../interactions/interactionTypes';
import { svgAction } from '../interactions/svgAction';
import { TerrainSilhouette, RailwayLandscape, TerrainMass, RiverValley, PastureFields, DrystoneWalls, YorkshireDressing } from '../../components/scenery/yorkshire';
export interface BackgroundLandscapeProps {
  theme: YorkshireSceneTheme;
  setHoveredObject: HoverTarget;
  onTriggerToast?: (message: string) => void;
}
export function BackgroundLandscape({ theme, setHoveredObject, onTriggerToast }: BackgroundLandscapeProps) {
  return <><g id="sky-and-clouds" transform="translate(0, -115)">
            {/* --- Layer 1: High-Altitude Atmospheric Stratiform & Cirrus Ribbon (极远处慢速舒展云带) --- */}
            <g id="sky-clouds-far-layer" className="cloud-drift-far" filter="url(#cloudAtmosphereBlur)">
              {/* Upper delicate wispy cirrus filaments (高空手绘舒卷轻羽云) */}
              <path
                d="M-2800,52 C-2200,40 -1600,65 -1000,45 C-400,30 200,58 800,42 C1400,28 2000,55 2600,38 C3200,25 3800,48 4200,38 L4200,72 C3800,82 3200,60 2600,75 C2000,90 1400,62 800,75 C200,92 -400,65 -1000,80 C-1600,95 -2200,70 -2800,82 Z"
                fill="url(#wispyCirrusGrad)"
                opacity="0.6"
              />
              <path
                d="M-2600,80 C-2000,65 -1400,90 -800,70 C-200,55 400,82 1000,68 C1600,52 2200,80 2800,62 C3400,50 3900,70 4200,60 L4200,92 C3900,102 3400,82 2800,96 C2200,112 1600,85 1000,100 C400,115 -200,88 -800,102 C-1400,118 -2000,92 -2600,106 Z"
                fill="url(#wispyCirrusGrad)"
                opacity="0.45"
              />

              {/* Main Retro-Anime Elongated Horizon Cloud Bank (经典复古动画长条状、连笔柔和剪影，底色汲取天空灰蓝) */}
              <path
                d="M-3000,145 C-2400,115 -1800,98 -1200,128 C-700,102 -200,88 250,108 C550,82 850,75 1150,98 C1450,78 1850,68 2250,98 C2650,82 3150,108 3650,92 C4000,82 4200,102 4400,98 L4400,225 L-3000,225 Z"
                fill="url(#cloudFarBandGrad)"
                opacity="0.85"
              />

              {/* Soft Sunlit Glaze across cloud crests (低饱和度天光漫反射，微量柔和采光，非刺眼纯白) */}
              <path
                d="M-3000,138 C-2400,110 -1800,92 -1200,122 C-700,98 -200,82 250,102 C550,78 850,70 1150,92 C1450,72 1850,62 2250,92 C2650,78 3150,102 3650,88 C4000,78 4200,98 4400,92 L4400,128 C4200,132 4000,112 3650,122 C3150,138 2650,112 2250,128 C1850,98 1450,108 1150,128 C850,105 550,112 250,138 C-200,118 -700,132 -1200,158 C-1800,128 -2400,148 -3000,178 Z"
                fill="url(#cloudCrestGlaze)"
                opacity="0.75"
              />
            </g>

            {/* --- Layer 2: Midground Mountain Ridge & Valley Mist (中景山峦流岚与山脊薄雾，实现视差与山脊天然晕染) --- */}
            <g id="sky-clouds-ridge-mist" className="cloud-drift-mist" filter="url(#ridgeMistBlur)">
              {/* Meandering soft valley mist dipping across mountain saddles (在远山脊线间柔缓游走) */}
              <path
                d="M-3000,165 C-2300,145 -1700,175 -1100,150 C-600,132 -100,165 350,142 C750,122 1150,158 1550,138 C2050,118 2550,158 3050,138 C3550,122 4000,152 4400,142 L4400,240 C4000,250 3550,225 3050,240 C2550,255 2050,220 1550,235 C1150,250 750,220 350,235 C-100,255 -600,225 -1100,245 C-1700,265 -2300,235 -3000,255 Z"
                fill="url(#ridgeValleyMistGrad)"
                opacity="0.65"
              />
              <path
                d="M-2800,178 C-2100,160 -1500,185 -900,165 C-400,145 100,175 550,152 C950,135 1350,168 1850,148 C2350,130 2850,165 3350,145 C3850,132 4200,160 4400,152 L4400,220 L-2800,220 Z"
                fill="url(#ridgeValleyMistGrad)"
                opacity="0.5"
              />
            </g>

            {/* Atmosphere Horizon Mist Wash (暖金晨雾将云底、谷雾与远山天际线无缝交融) */}
            <rect x="-3000" y="80" width="7400" height="200" fill="url(#distantHazeGrad)" />
          </g>

          {/* ========================================================================= */}
          {/* 🌟 REFACTORED LOW-POLY COUNTRYSIDE TERRAIN & PRESERVED RAILWAY INFRASTRUCTURE */}
          {/*    100% 低多边形设计风格 · 严格遵循 2.5D 轴测平面层级与中景金色麦田过渡     */}
          {/*    远山峰峦与中远景麦田/高架桥往后移，草地扩大包围主屋草台后方              */}
          {/* ========================================================================= */}
          <g id="hills">
            {/* 01 & 05 DISTANT MOUNTAINS, WHEAT TERRACES & RAILWAY (整体往后平移至远景层) */}
            <g id="distant-mountain-wheat-railway-depth" transform="translate(0, -115)">
              {/* 01 TERRAIN SILHOUETTE (低多边形折纸远山峰峦与阶梯麦田) */}
              <TerrainSilhouette theme={theme} />

              {/* 05 INFRASTRUCTURE: RAILWAY (经典石拱高架桥、穿山隧道与复古蒸汽机车) */}
              <RailwayLandscape theme={theme} />
            </g>

            {/* 02 TERRAIN MASS (平整低多边形各级台地、主庭院大台面与底板) */}
            <TerrainMass theme={theme} />

            {/* 02 TERRAIN: River Valley (纯净连贯无断流谷地) */}
            <RiverValley
              theme={theme}
              onTriggerToast={onTriggerToast}
              setHoveredObject={setHoveredObject}
            />

            {/* 03 LAND PARCELS (低多边形几何草甸分块与平整田亩) */}
            <PastureFields theme={theme} />

            {/* 04 BOUNDARIES (低多边形石墙与标志性五杠原木门) */}
            <DrystoneWalls
              theme={theme}
              onTriggerToast={onTriggerToast}
              setHoveredObject={setHoveredObject}
            />

            {/* 5. Natural Meadow Flora & Wildflowers (纯净草甸上的点缀野花 · 全景微风律动) */}
            <g id="meadow-flanking-flora" opacity="0.9">
              {[
                { x: 470, y: 516, col: '#fef08a', h: 8, curv: 1 },
                { x: 420, y: 496, col: '#ffffff', h: 9, curv: -1 },
                { x: 375, y: 500, col: '#a855f7', h: 8, curv: 1 },
                { x: 330, y: 474, col: '#ffffff', h: 9, curv: -1 },
                { x: 285, y: 460, col: '#fef08a', h: 7, curv: 1 },
                { x: 245, y: 432, col: '#ffffff', h: 8, curv: -1 },
                { x: 205, y: 408, col: '#a855f7', h: 7, curv: 1 },
                { x: 150, y: 415, col: '#fef08a', h: 8, curv: -1 },
                { x: 90, y: 422, col: '#ffffff', h: 7, curv: 1 },
                { x: 20, y: 428, col: '#fef08a', h: 8, curv: -1 },
              ].map((fl, i) => {
                const flDelay = Number(((fl.x + 300) * 0.003).toFixed(2));
                return (
                  <g key={`spf-${i}`} transform={`translate(${fl.x}, ${fl.y})`}>
                    <g
                      className="animate-wind-flower"
                      style={{
                        animationDelay: `${flDelay}s`,
                        transformOrigin: '0px 0px',
                      }}
                    >
                      <path
                        d={`M0,0 Q${fl.curv},${-fl.h * 0.5} 0,${-fl.h}`}
                        stroke="#486d26"
                        strokeWidth="0.8"
                        strokeLinecap="round"
                        fill="none"
                      />
                      <g transform={`translate(0, ${-fl.h})`}>
                        <circle cx="0" cy="0" r="1.9" fill={fl.col} />
                        {fl.col === '#ffffff' && <circle cx="0" cy="0" r="0.7" fill="#facc15" />}
                        {fl.col === '#fef08a' && <circle cx="0" cy="0" r="0.65" fill="#ca8a04" />}
                      </g>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* 6. COTTAGE VEGETABLE & PUMPKIN GARDEN (西翼阳光缓坡南瓜菜圃与香草地) */}
            <g id="cottage-pumpkin-patch" transform="translate(-120, 395)">
              {/* Ground contact shadow under garden beds */}
              <ellipse cx="50" cy="38" rx="60" ry="18" fill="#1b2518" opacity="0.35" />

              {/* Terraced Cedar Timber Raised Beds */}
              {/* Bed 1: Lower Raised Bed (Loam soil with ripe pumpkins) */}
              <polygon points="0,22 96,22 104,44 6,44" fill="#382210" stroke="#241407" strokeWidth="0.8" />
              <polygon points="2,23 94,23 100,42 8,42" fill="#4a2e16" />
              {/* Dark Loam Texture lines */}
              <line x1="8" y1="28" x2="92" y2="28" stroke="#321e0e" strokeWidth="0.8" />
              <line x1="12" y1="35" x2="96" y2="35" stroke="#321e0e" strokeWidth="0.8" />

              {/* Plump Golden-Orange Pumpkins with green vines & leaves */}
              {/* Pumpkin 1 (Big ripe prize pumpkin) */}
              <g transform="translate(26, 32)">
                <ellipse cx="0" cy="3" rx="10" ry="8" fill="#d97706" />
                <ellipse cx="-4" cy="3" rx="6" ry="7.5" fill="#ea580c" />
                <ellipse cx="4" cy="3" rx="6" ry="7.5" fill="#ea580c" />
                <ellipse cx="0" cy="2" rx="4" ry="7.5" fill="#f59e0b" />
                {/* Curly Green Stem */}
                <path d="M0,-4 Q2,-9 -2,-11" stroke="#365314" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                {/* Tendril leaf */}
                <ellipse cx="6" cy="-2" rx="3.5" ry="2" fill="#4d7c0f" transform="rotate(-15 6 -2)" />
              </g>

              {/* Pumpkin 2 */}
              <g transform="translate(54, 30)">
                <ellipse cx="0" cy="3" rx="8.5" ry="7" fill="#d97706" />
                <ellipse cx="-3.5" cy="3" rx="5.5" ry="6.5" fill="#ea580c" />
                <ellipse cx="3.5" cy="3" rx="5.5" ry="6.5" fill="#ea580c" />
                <ellipse cx="0" cy="2" rx="3.5" ry="6.5" fill="#f59e0b" />
                <path d="M0,-3 Q-2,-8 2,-9" stroke="#365314" strokeWidth="1.4" fill="none" strokeLinecap="round" />
                <ellipse cx="-5" cy="-2" rx="3" ry="1.8" fill="#4d7c0f" transform="rotate(20 -5 -2)" />
              </g>

              {/* Pumpkin 3 */}
              <g transform="translate(78, 34)">
                <ellipse cx="0" cy="2.5" rx="7.5" ry="6" fill="#f59e0b" />
                <ellipse cx="-3" cy="2.5" rx="4.8" ry="5.5" fill="#d97706" />
                <ellipse cx="3" cy="2.5" rx="4.8" ry="5.5" fill="#d97706" />
                <path d="M0,-2 Q1,-6 -1,-7" stroke="#365314" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              </g>

              {/* Bed 2: Upper Raised Bed (Cabbages & Garden Herbs) */}
              <polygon points="12,4 86,4 92,20 18,20" fill="#382210" stroke="#241407" strokeWidth="0.8" />
              <polygon points="14,5 84,5 89,18 19,18" fill="#4a2e16" />
              {/* Savoy Cabbages */}
              {[28, 46, 64, 80].map((cx, idx) => (
                <g key={`cabbage-${idx}`} transform={`translate(${cx}, 12)`}>
                  <ellipse cx="0" cy="0" rx="4.5" ry="3.5" fill="#2d5236" />
                  <ellipse cx="-1" cy="-0.5" rx="3.5" ry="3" fill="#3f6e4a" />
                  <ellipse cx="0.5" cy="0" rx="2.5" ry="2" fill="#5ea56e" />
                  <circle cx="0" cy="-0.2" r="1.2" fill="#86efac" />
                </g>
              ))}

              {/* Hand-carved Wooden Garden Sign Stake */}
              <g transform="translate(-4, 38)">
                <rect x="0" y="0" width="2.5" height="14" rx="0.5" fill="#5c381e" stroke="#2a1608" strokeWidth="0.5" />
                <polygon points="-8,-9 16,-9 14,0 -10,0" fill="#eedcc5" stroke="#684628" strokeWidth="0.8" />
                <text x="3" y="-3" fill="#4a2c14" fontSize="5.5" fontWeight="bold" textAnchor="middle">
                  🎃 PUMPKINS
                </text>
              </g>

              {/* Stone Water Basin & Watering Can in Garden */}
              <g transform="translate(108, 32)">
                <ellipse cx="0" cy="7" rx="8" ry="4" fill="#1b2518" opacity="0.3" />
                <rect x="-6" y="0" width="12" height="7" rx="2" fill="#696053" stroke="#332c25" strokeWidth="0.8" />
                <ellipse cx="0" cy="0" rx="6" ry="2.2" fill="#386b68" stroke="#332c25" strokeWidth="0.6" />
                <ellipse cx="0" cy="0" rx="4.5" ry="1.4" fill="#64a5a1" opacity="0.75" />
              </g>
            </g>

            {/* 7. WEST HOMESTEAD WOODPILE & FLOWER BEDS */}
            <g id="west-cottage-grounds" transform="translate(-130, 330)">
              {/* Stacked split birch logs */}
              <ellipse cx="8" cy="18" rx="14" ry="5" fill="#1b2518" opacity="0.3" />
              <rect x="0" y="6" width="16" height="12" rx="1.5" fill="#523924" stroke="#2c1d12" strokeWidth="0.7" />
              {/* Log ends with birch bark and rings */}
              {[
                { x: 3, y: 10, r: 2.4 }, { x: 8, y: 10, r: 2.4 }, { x: 13, y: 10, r: 2.4 },
                { x: 5.5, y: 14.5, r: 2.4 }, { x: 10.5, y: 14.5, r: 2.4 },
              ].map((lg, i) => (
                <circle key={`wlog-${i}`} cx={lg.x} cy={lg.y} r={lg.r} fill="#d8cbba" stroke="#382618" strokeWidth="0.6" />
              ))}

              {/* Flowering Lavender Clump (迎风轻曳薰衣草) */}
              <g transform="translate(24, 14)">
                <g className="animate-wind-flower" style={{ animationDelay: '0.6s', transformOrigin: '0px 0px' }}>
                  <path d="M-2,5 Q-4,-4 -6,-10 M0,5 Q0,-5 0,-12 M2,5 Q4,-4 5,-9" stroke="#385434" strokeWidth="1.2" fill="none" />
                  <circle cx="-6" cy="-10" r="1.6" fill="#a855f7" />
                  <circle cx="0" cy="-12" r="1.8" fill="#9333ea" />
                  <circle cx="5" cy="-9" r="1.5" fill="#c084fc" />
                </g>
              </g>
            </g>

            {/* Delicate Homestead Garden Flora (野甘菊与三叶草，自然点缀主屋四周的开阔庭院草地 · 连动微风律动) */}
            <g id="homestead-garden-flora" opacity="0.85">
              {[
                { x: -160, y: 350 }, { x: -80, y: 360 }, { x: 80, y: 370 },
                { x: -40, y: 440 }, { x: 140, y: 460 }, { x: -180, y: 480 },
                { x: -90, y: 520 }, { x: 160, y: 510 }, { x: 320, y: 480 },
                { x: 440, y: 460 }, { x: 620, y: 420 }, { x: 740, y: 430 },
              ].map((fl, i) => {
                const hflDelay = Number(((fl.x + 200) * 0.003 + (fl.y - 350) * 0.001).toFixed(2));
                return (
                  <g key={`hfl-${i}`} transform={`translate(${fl.x}, ${fl.y})`}>
                    <g
                      className="animate-wind-flower"
                      style={{
                        animationDelay: `${hflDelay}s`,
                        transformOrigin: '0px 0px',
                      }}
                    >
                      <path d="M0,0 Q0.5,-3 0,-6" stroke="#486d26" strokeWidth="0.75" fill="none" />
                      <g transform="translate(0, -6)">
                        <circle cx="0" cy="0" r="1.7" fill="#ffffff" />
                        <circle cx="0" cy="0" r="0.65" fill="#fef08a" />
                      </g>
                    </g>
                  </g>
                );
              })}
            </g>
          </g>

          {/* ======================================================== */}
          {/* 1.5 TRACTOR & HAY BALES AT THE FARMYARD CORNER (农家角落·拖拉机与草垛) */}
          {/*     配备田园原木栅栏、农夫机耕车辙印与工具木桶，彻底摆脱悬空孤立感 */}
          {/* ======================================================== */}
          <g
            id="tractor-in-field"
            transform="translate(110, 220)"
            className="cursor-pointer transition-opacity hover:opacity-95"
            onMouseEnter={() => setHoveredObject({ kind: 'entity', id: 'tractor' })}
            onMouseLeave={() => setHoveredObject(null)}
          >
            {/* Weathered Timber Paddock Fence behind Tractor (木制农庄围栏) */}
            <g id="farm-paddock-fence" opacity="0.85">
              <line x1="-55" y1="18" x2="115" y2="18" stroke="#523d29" strokeWidth="2.5" />
              <line x1="-55" y1="26" x2="115" y2="26" stroke="#523d29" strokeWidth="2" />
              {[-45, -5, 35, 75, 110].map((fx) => (
                <rect key={`pf-${fx}`} x={fx - 1.5} y="10" width="3.2" height="24" rx="0.8" fill="#422f1f" />
              ))}
            </g>

            {/* Earthy Tractor Wheel Ruts & Farm Track (机耕泥泞车辙印) */}
            <g opacity="0.45">
              <path d="M22,46 C32,60 45,78 60,98" stroke="#52402e" strokeWidth="3" strokeDasharray="5 4" fill="none" />
              <path d="M42,46 C52,60 65,78 80,98" stroke="#52402e" strokeWidth="3" strokeDasharray="5 4" fill="none" />
            </g>

            {/* Packed earth & fine gravel parking pad under tractor */}
            <ellipse cx="46" cy="46" rx="54" ry="12" fill="#604f3d" opacity="0.32" />

            {/* Farmyard Wooden Water Barrel & Vintage Milk Churn at Corner */}
            <g transform="translate(100, 26)">
              <rect x="0" y="0" width="10" height="15" rx="1.5" fill="#523d28" stroke="#332415" strokeWidth="0.8" />
              <line x1="0" y1="4" x2="10" y2="4" stroke="#2b1f14" strokeWidth="0.9" />
              <line x1="0" y1="11" x2="10" y2="11" stroke="#2b1f14" strokeWidth="0.9" />
              <ellipse cx="5" cy="0" rx="4.5" ry="1.8" fill="#695137" />
            </g>

            {/* Golden Cylindrical Hay Bales neatly stacked beside tractor */}
            <g transform="translate(-32, 22)">
              {/* Bottom Left Hay Bale */}
              <ellipse cx="0" cy="12" rx="14" ry="9" fill="#e8c956" />
              <rect x="-14" y="0" width="28" height="12" fill="#d9b434" />
              <ellipse cx="0" cy="0" rx="14" ry="7" fill="#fae274" stroke="#c9a224" strokeWidth="0.8" />
              <circle cx="0" cy="0" r="3" fill="none" stroke="#bfa02c" strokeWidth="1" strokeDasharray="3,2" />
            </g>
            <g transform="translate(-10, 26)">
              {/* Bottom Right Hay Bale */}
              <ellipse cx="0" cy="10" rx="13" ry="8" fill="#e8c956" />
              <rect x="-13" y="0" width="26" height="10" fill="#d9b434" />
              <ellipse cx="0" cy="0" rx="13" ry="6.5" fill="#fce47c" stroke="#c9a224" strokeWidth="0.8" />
            </g>
            <g transform="translate(-20, 10)">
              {/* Top Center Hay Bale */}
              <ellipse cx="0" cy="9" rx="12" ry="7" fill="#e8c956" />
              <rect x="-12" y="0" width="24" height="9" fill="#d9b434" />
              <ellipse cx="0" cy="0" rx="12" ry="6" fill="#fae274" stroke="#c9a224" strokeWidth="0.8" />
            </g>

            {/* Red Countryside Farm Tractor */}
            {/* Big Rear Wheel with Deep Tread & Bright Yellow Hub */}
            <circle cx="22" cy="30" r="18" fill="#242629" />
            {/* Rear Tire Tread Lugs */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
              <line
                key={deg}
                x1={22 + 14 * Math.cos((deg * Math.PI) / 180)}
                y1={30 + 14 * Math.sin((deg * Math.PI) / 180)}
                x2={22 + 18 * Math.cos((deg * Math.PI) / 180)}
                y2={30 + 18 * Math.sin((deg * Math.PI) / 180)}
                stroke="#141517"
                strokeWidth="2.5"
              />
            ))}
            <circle cx="22" cy="30" r="10" fill="#e0c868" stroke="#beaa46" strokeWidth="1.2" />
            <circle cx="22" cy="30" r="4" fill="#242629" />

            {/* Small Front Steering Wheel */}
            <circle cx="76" cy="37" r="10" fill="#242629" />
            <circle cx="76" cy="37" r="5" fill="#e0c868" stroke="#beaa46" strokeWidth="1" />
            <circle cx="76" cy="37" r="2.2" fill="#242629" />

            {/* Tractor Chassis & Transmission Link */}
            <rect x="22" y="32" width="54" height="6" fill="#303338" rx="1" />

            {/* Rear Mudguard / Fender */}
            <path d="M4,30 C4,14 40,14 40,30" stroke="#b83320" strokeWidth="5" fill="none" strokeLinecap="round" />

            {/* Tractor Engine Body & Hood (Crimson & Coral Highlights) */}
            <polygon points="16,18 48,15 82,23 82,37 32,37" fill="#d9402b" />
            <polygon points="16,18 48,15 48,22 18,24" fill="#f05b46" />
            {/* Front Radiator Grille */}
            <rect x="80" y="24" width="3" height="12" fill="#42474f" rx="1" />
            <line x1="81.5" y1="26" x2="81.5" y2="34" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />

            {/* Tractor Vertical Exhaust Chimney with gentle animated smoke */}
            <line x1="64" y1="21" x2="64" y2="6" stroke="#2b2d30" strokeWidth="2.8" strokeLinecap="round" />
            <circle cx="64" cy="6" r="2" fill="#4d5057" />
            <circle cx="64" cy="2" r="3" fill="#ffffff" opacity="0.6" className="animate-ping" />
            <circle cx="68" cy="-5" r="4.5" fill="#ffffff" opacity="0.35" className="animate-pulse" />

            {/* Tractor Open Driver Seat & Steering Wheel */}
            <rect x="18" y="10" width="12" height="9" rx="2.5" fill="#1b1c1e" />
            <line x1="38" y1="18" x2="33" y2="11" stroke="#222" strokeWidth="2.2" strokeLinecap="round" />
            <ellipse cx="32" cy="10" rx="3.5" ry="2" fill="none" stroke="#222" strokeWidth="1.8" />

            {/* Front Brass Headlight */}
            <circle cx="82" cy="28" r="3.2" fill="#fce47c" stroke="#947a28" strokeWidth="1" />
            {/* Headlight beam casting softly across the wheat field */}
            <polygon points="85,28 135,20 142,42 85,34" fill={theme.tractorLightGlow} className="pointer-events-none" />

            {/* Little harvest wooden basket on rear bracket with pumpkins */}
            <rect x="0" y="17" width="14" height="11" rx="1.5" fill="#9c7149" stroke="#6e4f32" strokeWidth="1" />
            <ellipse cx="4.5" cy="16" rx="3.5" ry="3" fill="#e88a38" />
            <ellipse cx="10" cy="16" rx="3.5" ry="3" fill="#eb9846" />
            <ellipse cx="7.2" cy="13.5" rx="3" ry="2.5" fill="#d97d2e" />
            {/* Pumpkin stems */}
            <line x1="7.2" y1="13.5" x2="7.2" y2="11" stroke="#3d6e42" strokeWidth="1.2" strokeLinecap="round" />
          </g>

          {/* ======================================================== */}
          {/* 1.8 HIGH MOUNTAIN DEEP-SPACE ALIEN RADIO STATION         */}
          {/*     (山巅高耸深空外星电波监听站 & 射电望远镜天线)         */}
          {/* ======================================================== */}
          
  </>;
}
