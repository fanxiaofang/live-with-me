import React from 'react';
import { DrystoneWalls, MountainSilhouette, PastureFields, RailwayLandscape, RollingWheatSilhouette, TerrainMass } from '../../components/scenery/yorkshire';
import type { YorkshireSceneTheme } from '../../components/scenery/yorkshire/landscapeTypes';
import { Camera, OVERVIEW_CAMERA } from '../camera/cameraMath';
import { getParallaxTransformStyle, PARALLAX_PRESETS } from '../camera/parallaxMath';
import type { HoverTarget } from '../interactions/interactionTypes';

export interface BackgroundLandscapeProps {
  theme: YorkshireSceneTheme;
  camera?: Camera;
  isDragging?: boolean;
  setHoveredObject: HoverTarget;
  onTriggerToast?: (message: string) => void;
}

export interface HomesteadMeadowProps {
  theme: YorkshireSceneTheme;
  setHoveredObject: HoverTarget;
  onTriggerToast?: (message: string) => void;
}

/**
 * 🌾 BackgroundLandscape (Multiplane Parallax Far & Midground Layers)
 * Contains:
 * - Layer 0: Infinite Sky & Horizon Clouds (0.08x translation, 0.15x zoom)
 * - Layer 1: Far Mountain Silhouettes & Viaduct Railway (0.28x translation, 0.40x zoom)
 * - Layer 2: Midground Rolling Wheat Swales & Farm Tractor (0.65x translation, 0.70x zoom)
 */
function BackgroundLandscapeAsset({
  theme,
  camera = OVERVIEW_CAMERA,
  isDragging = false,
  setHoveredObject,
}: BackgroundLandscapeProps) {
  const skyStyle = getParallaxTransformStyle(camera, PARALLAX_PRESETS.sky, isDragging);
  const mountainStyle = getParallaxTransformStyle(camera, PARALLAX_PRESETS.mountains, isDragging);
  const wheatStyle = getParallaxTransformStyle(camera, PARALLAX_PRESETS.wheat, isDragging);

  return (
    <>
      {/* ========================================================================= */}
      {/* 🌌 PARALLAX LAYER 0: INFINITE SKY & HIGH-ALTITUDE STRATIFORM CLOUDS       */}
      {/* ========================================================================= */}
      <g id="parallax-sky-layer" style={skyStyle}>
        <g id="sky-and-clouds" transform="translate(0, -115)">
          {/* Layer 1: High-Altitude Atmospheric Stratiform & Cirrus Ribbon (极远处慢速舒展云带) */}
          <g id="sky-clouds-far-layer" className="cloud-drift-far" filter="url(#cloudAtmosphereBlur)">
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

            {/* Main Retro-Anime Elongated Horizon Cloud Bank */}
            <path
              d="M-3000,145 C-2400,115 -1800,98 -1200,128 C-700,102 -200,88 250,108 C550,82 850,75 1150,98 C1450,78 1850,68 2250,98 C2650,82 3150,108 3650,92 C4000,82 4200,102 4400,98 L4400,225 L-3000,225 Z"
              fill="url(#cloudFarBandGrad)"
              opacity="0.85"
            />

            {/* Soft Sunlit Glaze across cloud crests */}
            <path
              d="M-3000,138 C-2400,110 -1800,92 -1200,122 C-700,98 -200,82 250,102 C550,78 850,70 1150,92 C1450,72 1850,62 2250,92 C2650,78 3150,102 3650,88 C4000,78 4200,98 4400,92 L4400,128 C4200,132 4000,112 3650,122 C3150,138 2650,112 2250,128 C1850,98 1450,108 1150,128 C850,105 550,112 250,138 C-200,118 -700,132 -1200,158 C-1800,128 -2400,148 -3000,178 Z"
              fill="url(#cloudCrestGlaze)"
              opacity="0.75"
            />
          </g>

          {/* Layer 2: Midground Mountain Ridge & Valley Mist (山脊薄雾流岚) */}
          <g id="sky-clouds-ridge-mist" className="cloud-drift-mist" filter="url(#ridgeMistBlur)">
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

          {/* Atmosphere Horizon Mist Wash (远山地平线晨雾融边) */}
          <rect x="-3000" y="80" width="7400" height="200" fill="url(#distantHazeGrad)" />
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 🏔️ PARALLAX LAYER 1: FAR MOUNTAIN SILHOUETTE & VIADUCT RAILWAY            */}
      {/* ========================================================================= */}
      <g id="parallax-mountains-layer" style={mountainStyle}>
        <g id="distant-mountain-railway-depth" transform="translate(0, -115)">
          {/* 01 FAR MOUNTAINS (低多边形折纸远山峰峦、山麓树丛与林冠) */}
          <MountainSilhouette theme={theme} />

          {/* 05 INFRASTRUCTURE: RAILWAY (经典石拱高架桥、穿山隧道与复古机车) */}
          <RailwayLandscape theme={theme} />
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 🌾 PARALLAX LAYER 2: MIDGROUND ROLLING WHEAT FIELDS & TRACTOR              */}
      {/* ========================================================================= */}
      <g id="parallax-wheat-layer" style={wheatStyle}>
        <g id="distant-wheat-tractor-depth" transform="translate(0, -115)">
          {/* 02 ROLLING WHEAT FIELDS (自然山丘麦浪、等高草垄、风波纹漫射与轻摇麦穗) */}
          <RollingWheatSilhouette theme={theme} />

          {/* 1.5 TRACTOR & HAY BALES PLANTED AT THE WHEAT FIELD MARGIN (麦田机耕地头) */}
          {/* 移动并深植于麦垄等高线边缘，与麦田共享 0.65x 视差，彻底摆脱大木屋周边 */}
          <g
            id="tractor-in-field"
            transform="translate(75, 275)"
            className="cursor-pointer transition-opacity hover:opacity-95"
            onMouseEnter={() => setHoveredObject({ kind: 'entity', id: 'tractor' })}
            onMouseLeave={() => setHoveredObject(null)}
          >
            {/* Weathered Timber Paddock Fence behind Tractor */}
            <g id="farm-paddock-fence" opacity="0.9">
              <line x1="-55" y1="18" x2="115" y2="18" stroke="#4a3725" strokeWidth="2.8" />
              <line x1="-55" y1="26" x2="115" y2="26" stroke="#4a3725" strokeWidth="2.2" />
              {[-45, -5, 35, 75, 110].map((fx) => (
                <g key={`pf-${fx}`}>
                  <rect x={fx - 1.6} y="10" width="3.5" height="24" rx="0.8" fill="#3a281a" stroke="#22160d" strokeWidth="0.5" />
                  <polygon points={`${fx - 1.6},10 ${fx},7 ${fx + 1.9},10`} fill="#543c29" />
                </g>
              ))}
            </g>

            {/* Earthy Tractor Wheel Ruts & Gravel Track trailing into the field margin */}
            <g opacity="0.55">
              <path d="M22,46 C32,60 45,78 60,98" stroke="#423324" strokeWidth="3.6" strokeDasharray="6 4" fill="none" />
              <path d="M23,47 C33,61 46,79 61,99" stroke="#63503d" strokeWidth="1.2" fill="none" opacity="0.6" />
              <path d="M42,46 C52,60 65,78 80,98" stroke="#423324" strokeWidth="3.6" strokeDasharray="6 4" fill="none" />
              <path d="M43,47 C53,61 66,79 81,99" stroke="#63503d" strokeWidth="1.2" fill="none" opacity="0.6" />
              <circle cx="35" cy="62" r="1" fill="#786654" />
              <circle cx="52" cy="74" r="1.2" fill="#786654" />
              <circle cx="70" cy="88" r="0.9" fill="#786654" />
              <path d="M28,68 Q27,63 25,60 M28,68 Q30,64 32,61" stroke="#527027" strokeWidth="0.8" fill="none" />
              <path d="M48,82 Q47,77 45,74 M48,82 Q50,78 52,75" stroke="#527027" strokeWidth="0.8" fill="none" />
            </g>

            {/* Packed earth & fine gravel parking pad under tractor */}
            <ellipse cx="46" cy="46" rx="58" ry="14" fill="#4d3e30" opacity="0.38" />

            {/* Farmyard Wooden Water Barrel & Vintage Galvanized Milk Churn at Corner */}
            <g transform="translate(100, 24)">
              <rect x="0" y="2" width="11" height="15" rx="1.8" fill="#4a3622" stroke="#251a0f" strokeWidth="0.8" />
              <line x1="0" y1="5.5" x2="11" y2="5.5" stroke="#1f2429" strokeWidth="1.1" />
              <line x1="0" y1="13" x2="11" y2="13" stroke="#1f2429" strokeWidth="1.1" />
              <ellipse cx="5.5" cy="2" rx="5" ry="2" fill="#634c32" stroke="#251a0f" strokeWidth="0.6" />
              <rect x="13" y="6" width="7" height="11" rx="1.2" fill="#94a3b8" stroke="#475569" strokeWidth="0.7" />
              <polygon points="14,6 19,6 18,3 15,3" fill="#cbd5e1" stroke="#475569" strokeWidth="0.6" />
              <circle cx="16.5" cy="2" r="1" fill="#475569" />
            </g>

            {/* 🌾 Golden Cylindrical Hay Bales nestled along the wheat edge */}
            <g transform="translate(-32, 22)">
              <g>
                <ellipse cx="0" cy="12" rx="14" ry="9" fill="#d9b434" />
                <rect x="-14" y="0" width="28" height="12" fill="#eab308" />
                <ellipse cx="0" cy="0" rx="14" ry="7" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
                <line x1="-8" y1="0" x2="-8" y2="12" stroke="#854d0e" strokeWidth="1.0" strokeDasharray="3,1" />
                <line x1="8" y1="0" x2="8" y2="12" stroke="#854d0e" strokeWidth="1.0" strokeDasharray="3,1" />
                <circle cx="0" cy="0" r="4.5" fill="none" stroke="#ca8a04" strokeWidth="0.8" strokeDasharray="3,2" />
                <path d="M-14,8 Q-18,10 -20,13 M-12,12 Q-15,15 -17,18" stroke="#fde047" strokeWidth="0.7" fill="none" />
              </g>
            </g>
            <g transform="translate(-10, 26)">
              <g>
                <ellipse cx="0" cy="10" rx="13" ry="8" fill="#d9b434" />
                <rect x="-13" y="0" width="26" height="10" fill="#eab308" />
                <ellipse cx="0" cy="0" rx="13" ry="6.5" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
                <line x1="-7" y1="0" x2="-7" y2="10" stroke="#854d0e" strokeWidth="1.0" strokeDasharray="3,1" />
                <line x1="7" y1="0" x2="7" y2="10" stroke="#854d0e" strokeWidth="1.0" strokeDasharray="3,1" />
                <circle cx="0" cy="0" r="3.5" fill="none" stroke="#ca8a04" strokeWidth="0.8" strokeDasharray="3,2" />
              </g>
            </g>
            <g transform="translate(-20, 10)">
              <g>
                <ellipse cx="0" cy="9" rx="12" ry="7" fill="#d9b434" />
                <rect x="-12" y="0" width="24" height="9" fill="#eab308" />
                <ellipse cx="0" cy="0" rx="12" ry="6" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
                <line x1="-6" y1="0" x2="-6" y2="9" stroke="#854d0e" strokeWidth="1.0" strokeDasharray="3,1" />
                <line x1="6" y1="0" x2="6" y2="9" stroke="#854d0e" strokeWidth="1.0" strokeDasharray="3,1" />
                <circle cx="0" cy="0" r="3" fill="none" stroke="#ca8a04" strokeWidth="0.8" strokeDasharray="3,2" />
                <path d="M12,4 Q16,6 18,9" stroke="#fef08a" strokeWidth="0.7" fill="none" />
              </g>
            </g>

            {/* 🚜 Red Countryside Farm Tractor */}
            <ellipse cx="22" cy="46" rx="16" ry="5" fill="#18191c" opacity="0.45" />
            <ellipse cx="76" cy="46" rx="10" ry="3.5" fill="#18191c" opacity="0.45" />

            <circle cx="22" cy="30" r="18.5" fill="#1c1d20" />
            <circle cx="22" cy="30" r="16.5" fill="#292b30" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <line
                key={deg}
                x1={22 + 15 * Math.cos((deg * Math.PI) / 180)}
                y1={30 + 15 * Math.sin((deg * Math.PI) / 180)}
                x2={22 + 19 * Math.cos((deg * Math.PI) / 180)}
                y2={30 + 19 * Math.sin((deg * Math.PI) / 180)}
                stroke="#121315"
                strokeWidth="2.8"
              />
            ))}
            <circle cx="22" cy="30" r="11" fill="#eab308" stroke="#a16207" strokeWidth="1.2" />
            <circle cx="22" cy="30" r="9" fill="#ca8a04" />
            <circle cx="22" cy="30" r="4.5" fill="#1e2024" stroke="#0f1012" strokeWidth="0.8" />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <circle
                key={`lug-${deg}`}
                cx={22 + 2.8 * Math.cos((deg * Math.PI) / 180)}
                y={30 + 2.8 * Math.sin((deg * Math.PI) / 180)}
                r="0.8"
                fill="#fde047"
              />
            ))}

            <circle cx="76" cy="37" r="10.5" fill="#1c1d20" />
            <circle cx="76" cy="37" r="9.2" fill="#2a2c30" />
            <circle cx="76" cy="37" r="5.5" fill="#eab308" stroke="#a16207" strokeWidth="1" />
            <circle cx="76" cy="37" r="2.4" fill="#1e2024" />
            <circle cx="76" cy="37" r="1" fill="#fde047" />

            <rect x="22" y="31" width="54" height="6.5" fill="#23262b" rx="1.2" />
            <rect x="36" y="34" width="16" height="5" fill="#1a1c20" rx="1" />

            <path d="M3,30 C3,12 41,12 41,30" stroke="#991b1b" strokeWidth="5.6" fill="none" strokeLinecap="round" />
            <path d="M4,30 C4,13 40,13 40,30" stroke="#dc2626" strokeWidth="3.6" fill="none" strokeLinecap="round" />

            <polygon points="16,18 48,14 82,22 82,37 30,37" fill="#b91c1c" />
            <polygon points="16,18 48,14 82,22 82,25 48,17 16,21" fill="#ef4444" />
            <line x1="18" y1="19.5" x2="80" y2="23.5" stroke="#fca5a5" strokeWidth="0.8" opacity="0.85" />

            <g opacity="0.75">
              <line x1="52" y1="21" x2="52" y2="28" stroke="#450a0a" strokeWidth="1.2" />
              <line x1="56" y1="22" x2="56" y2="29" stroke="#450a0a" strokeWidth="1.2" />
              <line x1="60" y1="23" x2="60" y2="30" stroke="#450a0a" strokeWidth="1.2" />
              <rect x="65" y="25" width="8" height="3" rx="0.5" fill="#eab308" stroke="#78350f" strokeWidth="0.5" />
            </g>

            <rect x="80" y="23" width="3.5" height="13.5" fill="#33383f" rx="1" stroke="#1f2329" strokeWidth="0.6" />
            <line x1="81.8" y1="25" x2="81.8" y2="35" stroke="#ffffff" strokeWidth="0.9" opacity="0.7" />

            {/* Exhaust Stack */}
            <line x1="64" y1="22" x2="64" y2="5" stroke="#1f2226" strokeWidth="3.2" strokeLinecap="round" />
            <rect x="62.2" y="10" width="3.6" height="7" rx="1" fill="#374151" stroke="#111827" strokeWidth="0.6" />
            <line x1="63" y1="4.5" x2="66.5" y2="3.5" stroke="#1f2226" strokeWidth="1.2" strokeLinecap="round" />

            {/* Rising smoke particles */}
            <g transform="translate(64, 4)">
              <circle cx="0" cy="0" r="2.2" fill="#f8fafc" className="animate-tractor-smoke-1" />
              <circle cx="0" cy="0" r="3.2" fill="#ffffff" className="animate-tractor-smoke-2" />
            </g>

            {/* Driver Cockpit & Steering Wheel */}
            <rect x="17" y="9" width="13" height="9.5" rx="2.8" fill="#18191c" stroke="#0a0a0c" strokeWidth="0.8" />
            <line x1="23" y1="18.5" x2="23" y2="23" stroke="#374151" strokeWidth="1.6" />
            <line x1="39" y1="18" x2="33" y2="10" stroke="#1f242b" strokeWidth="2.4" strokeLinecap="round" />
            <ellipse cx="32" cy="9.5" rx="4" ry="2.2" fill="none" stroke="#111827" strokeWidth="2.0" />
            <line x1="36" y1="24" x2="33" y2="17" stroke="#6b7280" strokeWidth="1.2" strokeLinecap="round" />
            <circle cx="33" cy="17" r="1.1" fill="#ef4444" />

            {/* Headlight casting softly across wheat field */}
            <circle cx="82" cy="27" r="3.6" fill="#fef08a" stroke="#a16207" strokeWidth="1.2" />
            <circle cx="82" cy="27" r="2.2" fill="#fffbeb" />
            <polygon points="85,27 138,18 145,43 85,33" fill={theme.tractorLightGlow} className="pointer-events-none" />

            {/* Wooden Harvest Basket with pumpkins & hayfork */}
            <g transform="translate(-1, 16)">
              <rect x="0" y="0" width="15" height="12" rx="1.5" fill="#785331" stroke="#452c16" strokeWidth="1.0" />
              <line x1="0" y1="4" x2="15" y2="4" stroke="#452c16" strokeWidth="0.8" />
              <line x1="0" y1="8" x2="15" y2="8" stroke="#452c16" strokeWidth="0.8" />
              <ellipse cx="3.5" cy="4" rx="3" ry="4" fill="#a89276" stroke="#715c44" strokeWidth="0.6" />
              <ellipse cx="9" cy="2" rx="3.5" ry="3" fill="#ea580c" />
              <ellipse cx="9" cy="1.5" rx="2" ry="2.6" fill="#f59e0b" />
              <line x1="9" y1="0" x2="9" y2="-1.8" stroke="#365314" strokeWidth="1" strokeLinecap="round" />
              <line x1="13" y1="10" x2="19" y2="-4" stroke="#9a714c" strokeWidth="1.1" strokeLinecap="round" />
              <path d="M19,-4 L20,-8 M19,-4 L18,-8 M19,-4 L21,-7" stroke="#64748b" strokeWidth="0.8" />
            </g>
          </g>
        </g>
      </g>
    </>
  );
}

/**
 * 🏡 HomesteadMeadow (Master Stage Meadow Ground Plane, Retained Garden & Walls)
 * Lives in the 1.0x master stage layer alongside the cottage cluster.
 */
function HomesteadMeadowAsset({ theme, setHoveredObject, onTriggerToast }: HomesteadMeadowProps) {
  return (
    <g id="homestead-meadow-base">
      {/* 02 TERRAIN MASS (平整低多边形各级台地、主庭院大台面与底板) */}
      <TerrainMass theme={theme} />

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

      {/* 6. COTTAGE VEGETABLE & PUMPKIN GARDEN (西翼阳光缓坡双层雪松木高床菜圃) */}
      {/*    保留在当前草坪原位，待后续小木屋空间舒展方案敲定后再行协调 */}
      <g id="cottage-pumpkin-patch" transform="translate(-120, 395)">
        <ellipse cx="56" cy="40" rx="72" ry="22" fill="#141e12" opacity="0.45" />

        <polygon points="-4,44 112,44 116,48 -2,48" fill="#1b1208" />
        <polygon points="-4,22 4,22 10,46 2,46" fill="#382210" stroke="#1d1107" strokeWidth="0.8" />
        <polygon points="4,22 106,22 114,46 10,46" fill="#4d3017" stroke="#1d1107" strokeWidth="0.8" />
        <polygon points="106,22 116,22 122,46 114,46" fill="#301c0c" stroke="#1d1107" strokeWidth="0.8" />

        <line x1="6" y1="34" x2="110" y2="34" stroke="#2a180b" strokeWidth="0.8" />
        <line x1="110" y1="34" x2="119" y2="34" stroke="#221308" strokeWidth="0.8" />

        <rect x="-4" y="18" width="5" height="26" rx="0.8" fill="#5c381a" stroke="#201206" strokeWidth="0.6" />
        <polygon points="-4,18 -1.5,15 1,18" fill="#754924" />
        <rect x="2" y="24" width="5" height="24" rx="0.8" fill="#5c381a" stroke="#201206" strokeWidth="0.6" />
        <polygon points="2,24 4.5,21 7,24" fill="#754924" />
        <rect x="105" y="18" width="5" height="26" rx="0.8" fill="#5c381a" stroke="#201206" strokeWidth="0.6" />
        <polygon points="105,18 107.5,15 110,18" fill="#754924" />
        <rect x="114" y="24" width="5" height="24" rx="0.8" fill="#5c381a" stroke="#201206" strokeWidth="0.6" />
        <polygon points="114,24 116.5,21 119,24" fill="#754924" />

        <rect x="3" y="26" width="3" height="4" fill="#1e242b" />
        <circle cx="4.5" cy="28" r="0.6" fill="#64748b" />
        <rect x="115" y="26" width="3" height="4" fill="#1e242b" />
        <circle cx="116.5" cy="28" r="0.6" fill="#64748b" />

        <polygon points="5,23 105,23 111,43 11,43" fill="#20140a" />
        <line x1="12" y1="28" x2="102" y2="28" stroke="#160e06" strokeWidth="1.0" />
        <line x1="16" y1="35" x2="106" y2="35" stroke="#160e06" strokeWidth="1.0" />

        <polygon points="8,2 96,2 102,20 14,20" fill="#24160a" stroke="#150c05" strokeWidth="0.8" />
        <polygon points="10,3 94,3 100,19 16,19" fill="#3e2712" />
        <polygon points="12,4 92,4 97,18 17,18" fill="#20140a" />
        <rect x="8" y="0" width="4" height="20" rx="0.6" fill="#543317" stroke="#1c0f05" strokeWidth="0.5" />
        <rect x="94" y="0" width="4" height="20" rx="0.6" fill="#543317" stroke="#1c0f05" strokeWidth="0.5" />

        {[26, 44, 62, 80].map((cx, idx) => (
          <g key={`cabbage-${idx}`} transform={`translate(${cx}, 11)`}>
            <ellipse cx="0" cy="0" rx="5.2" ry="4" fill="#203d27" />
            <ellipse cx="-1.5" cy="-0.6" rx="4.2" ry="3.4" fill="#2d5236" />
            <ellipse cx="1.5" cy="-0.4" rx="4" ry="3.2" fill="#35603f" />
            <ellipse cx="0" cy="-0.2" rx="3" ry="2.4" fill="#4e825a" />
            <circle cx="0" cy="-0.2" r="1.4" fill="#86efac" />
            <circle cx="0" cy="-0.2" r="0.6" fill="#bbf7d0" />
          </g>
        ))}

        {[35, 53, 71, 88].map((rx, idx) => (
          <g key={`carrot-${idx}`} transform={`translate(${rx}, 13)`}>
            <path d="M0,0 Q-1,-4 -2,-6 M0,0 Q1,-4 2,-7 M0,0 Q0,-5 0,-8" stroke="#365314" strokeWidth="0.75" fill="none" />
            <circle cx="-2" cy="-6" r="0.7" fill="#65a30d" />
            <circle cx="2" cy="-7" r="0.7" fill="#65a30d" />
            <circle cx="0" cy="-8" r="0.8" fill="#84cc16" />
          </g>
        ))}

        {/* 🎃 南瓜 1 */}
        <g transform="translate(30, 32)">
          <ellipse cx="0" cy="8" rx="11" ry="3.5" fill="#141a10" opacity="0.5" />
          <ellipse cx="0" cy="3" rx="10.5" ry="8.5" fill="#c25e00" />
          <ellipse cx="-4.5" cy="3" rx="6.5" ry="8" fill="#ea580c" />
          <ellipse cx="4.5" cy="3" rx="6.5" ry="8" fill="#ea580c" />
          <ellipse cx="-1.8" cy="2.5" rx="4.5" ry="8.2" fill="#f59e0b" />
          <ellipse cx="1.8" cy="2.5" rx="4.5" ry="8.2" fill="#f59e0b" />
          <ellipse cx="0" cy="2" rx="2.5" ry="8.2" fill="#fbbf24" opacity="0.9" />
          <path d="M0,-3 Q1,-8 -2,-11 Q-3,-13 -1,-14" stroke="#4d3a1a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <polygon points="-2,10 0,8 2,10 1,12 -1,12" fill="#ca8a04" opacity="0.7" />
          <ellipse cx="7" cy="-2" rx="4.2" ry="2.6" fill="#3f6212" transform="rotate(-15 7 -2)" />
          <ellipse cx="7" cy="-2" rx="3.2" ry="1.8" fill="#65a30d" transform="rotate(-15 7 -2)" opacity="0.8" />
        </g>

        {/* 🎃 南瓜 2 */}
        <g transform="translate(62, 31)">
          <ellipse cx="0" cy="7.5" rx="9.5" ry="3.2" fill="#141a10" opacity="0.45" />
          <ellipse cx="0" cy="3" rx="9" ry="7.5" fill="#c25e00" />
          <ellipse cx="-3.8" cy="3" rx="6" ry="7.2" fill="#d97706" />
          <ellipse cx="3.8" cy="3" rx="6" ry="7.2" fill="#d97706" />
          <ellipse cx="0" cy="2.2" rx="3.8" ry="7.2" fill="#f59e0b" />
          <ellipse cx="0" cy="1.6" rx="2" ry="6.8" fill="#fde047" opacity="0.85" />
          <path d="M0,-2.5 Q-2,-7 2,-9" stroke="#4d3a1a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          <ellipse cx="-6" cy="-2" rx="3.8" ry="2.2" fill="#4d7c0f" transform="rotate(22 -6 -2)" />
          <polygon points="5,-1 8,-4 7,0 10,2 6,2" fill="#eab308" opacity="0.9" />
        </g>

        {/* 🎃 南瓜 3 */}
        <g transform="translate(92, 33)">
          <ellipse cx="0" cy="7" rx="9" ry="3.0" fill="#141a10" opacity="0.45" />
          <ellipse cx="0" cy="2.5" rx="8.5" ry="7.0" fill="#c25e00" />
          <ellipse cx="-3.5" cy="2.5" rx="5.5" ry="6.6" fill="#ea580c" />
          <ellipse cx="3.5" cy="2.5" rx="5.5" ry="6.6" fill="#ea580c" />
          <ellipse cx="0" cy="2" rx="3.2" ry="6.5" fill="#f59e0b" />
          <ellipse cx="0" cy="1.5" rx="1.8" ry="6.2" fill="#fde047" opacity="0.85" />
          <path d="M0,-2 Q1,-6 -1,-8" stroke="#4d3a1a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <ellipse cx="5" cy="-2" rx="3.5" ry="2.0" fill="#4d7c0f" transform="rotate(-15 5 -2)" />
        </g>

        {/* 南瓜爬藤与大叶 */}
        <g id="spilling-pumpkin-vines">
          <path d="M82,36 Q92,42 98,46 Q104,49 108,48" stroke="#365314" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <ellipse cx="94" cy="42" rx="4" ry="2.5" fill="#3f6212" transform="rotate(25 94 42)" />
          <ellipse cx="104" cy="47" rx="3.8" ry="2.4" fill="#4d7c0f" transform="rotate(-10 104 47)" />
          <ellipse cx="109" cy="48" rx="2.2" ry="1.8" fill="#65a30d" />
        </g>

        {/* 园艺工具与手工木刻菜牌 */}
        <g transform="translate(18, 14)">
          <line x1="0" y1="0" x2="-4" y2="-6" stroke="#854d0e" strokeWidth="1.2" strokeLinecap="round" />
          <polygon points="0,0 2,2 4,5 1,4" fill="#94a3b8" stroke="#475569" strokeWidth="0.5" />
        </g>
        <g transform="translate(-8, 38)">
          <rect x="0" y="0" width="3" height="15" rx="0.6" fill="#4d2c12" stroke="#221307" strokeWidth="0.5" />
          <polygon points="-10,-10 18,-10 16,0 -12,0" fill="#edd6b8" stroke="#5a381a" strokeWidth="0.8" />
          <line x1="-9" y1="-5" x2="15" y2="-5" stroke="#d5b58d" strokeWidth="0.6" />
          <circle cx="-8" cy="-8" r="0.6" fill="#854d0e" />
          <circle cx="14" cy="-8" r="0.6" fill="#854d0e" />
          <text x="3" y="-3.2" fill="#3b200b" fontSize="5.5" fontWeight="bold" textAnchor="middle">
            🎃 PUMPKINS
          </text>
        </g>

        {/* 天然石雕水槽与墨绿长嘴洒水壶 */}
        <g transform="translate(132, 32)">
          <ellipse cx="0" cy="8" rx="9" ry="4.5" fill="#141a10" opacity="0.35" />
          <rect x="-6" y="0" width="12" height="8" rx="2" fill="#585145" stroke="#2d2720" strokeWidth="0.8" />
          <ellipse cx="0" cy="0" rx="6" ry="2.4" fill="#2f5754" stroke="#2d2720" strokeWidth="0.6" />
          <ellipse cx="0" cy="0" rx="4.5" ry="1.6" fill="#5eead4" opacity="0.6" />

          <g transform="translate(10, 2)">
            <rect x="-3" y="1" width="6" height="6.5" rx="1.2" fill="#2d4a3e" stroke="#162721" strokeWidth="0.6" />
            <path d="M-2,1 C-2,-2 2,-2 2,1" stroke="#2d4a3e" strokeWidth="0.8" fill="none" />
            <line x1="3" y1="5" x2="7" y2="1" stroke="#2d4a3e" strokeWidth="0.9" />
            <ellipse cx="7.5" cy="0.8" rx="1.2" ry="0.8" fill="#ca8a04" transform="rotate(-30 7.5 0.8)" />
          </g>
        </g>
      </g>

      {/* 7. WEST HOMESTEAD WOODPILE & FLOWER BEDS */}
      <g id="west-cottage-grounds" transform="translate(-130, 330)">
        <ellipse cx="8" cy="18" rx="14" ry="5" fill="#1b2518" opacity="0.3" />
        <rect x="0" y="6" width="16" height="12" rx="1.5" fill="#523924" stroke="#2c1d12" strokeWidth="0.7" />
        {[
          { x: 3, y: 10, r: 2.4 }, { x: 8, y: 10, r: 2.4 }, { x: 13, y: 10, r: 2.4 },
          { x: 5.5, y: 14.5, r: 2.4 }, { x: 10.5, y: 14.5, r: 2.4 },
        ].map((lg, i) => (
          <circle key={`wlog-${i}`} cx={lg.x} cy={lg.y} r={lg.r} fill="#d8cbba" stroke="#382618" strokeWidth="0.6" />
        ))}

        <g transform="translate(24, 14)">
          <g className="animate-wind-flower" style={{ animationDelay: '0.6s', transformOrigin: '0px 0px' }}>
            <path d="M-2,5 Q-4,-4 -6,-10 M0,5 Q0,-5 0,-12 M2,5 Q4,-4 5,-9" stroke="#385434" strokeWidth="1.2" fill="none" />
            <circle cx="-6" cy="-10" r="1.6" fill="#a855f7" />
            <circle cx="0" cy="-12" r="1.8" fill="#9333ea" />
            <circle cx="5" cy="-9" r="1.5" fill="#c084fc" />
          </g>
        </g>
      </g>

      {/* 8. Delicate Homestead Garden Flora */}
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
  );
}

export const BackgroundLandscape = React.memo(BackgroundLandscapeAsset);
export const HomesteadMeadow = React.memo(HomesteadMeadowAsset);
