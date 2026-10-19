import React from 'react';
import { DrystoneWalls, MountainSilhouette, PastureFields, RailwayLandscape, RollingWheatSilhouette, SheepPen, TerrainMass } from '../../components/scenery/yorkshire';
import type { YorkshireSceneTheme } from '../../components/scenery/yorkshire/landscapeTypes';
import { Camera, OVERVIEW_CAMERA } from '../camera/cameraMath';
import { getParallaxTransformStyle, PARALLAX_PRESETS } from '../camera/parallaxMath';
import type { HoverTarget } from '../interactions/interactionTypes';
import { LANDSCAPE_SURFACES } from '../scene/landscapeGeometry';
import type { SceneLayout } from '../scene/sceneTypes';
import { MeadowWearPatch } from '../../components/scenery/yorkshire/dressing/MeadowWearPatch';
import { useLandscapeCoverage } from './useLandscapeCoverage';

export interface BackgroundLandscapeProps {
  theme: YorkshireSceneTheme;
  camera?: Camera;
  isDragging?: boolean;
  setHoveredObject: HoverTarget;
  onTriggerToast?: (message: string) => void;
}

export interface HomesteadMeadowProps {
  meadowSurface?: React.ReactNode;
  beehivePlanting?: React.ReactNode;
  theme: YorkshireSceneTheme;
  sceneLayout: SceneLayout;
  setHoveredObject: HoverTarget;
  onTriggerToast?: (message: string) => void;
}

/**
 * 🌾 BackgroundLandscape (Multiplane Parallax Far & Midground Layers - Minimalist & Clean)
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
  const coverage = useLandscapeCoverage(camera, isDragging);

  // 极简干净的天空层：仅保留一组错落有致、无任何多余模糊脏斑的吉卜力硬切积云
  const sky = React.useMemo(() => (
    <g id="sky-and-clouds" transform={`translate(0, ${LANDSCAPE_SURFACES.backgroundOffsetY})`}>
      {!theme.isNight && !theme.isRainy && (
        <g id="sky-billowing-cumulus" className="cloud-drift-cumulus">
          {/* 左侧远方山脊上空：严格参考图造型的流线型鲸鱼云（头部在右、分叉尾鳍在左、腹部下垂鳍） */}
          <g id="cumulus-whale-west" transform="translate(35, 22)">
            {/* 鲸鱼云下层基底阴影 */}
            <path
              d="M 50,38 
                 C 38,28 25,16 15,8 
                 C 18,22 28,35 42,42 
                 C 30,45 20,52 10,60 
                 C 25,58 40,50 52,45 
                 C 100,32 170,24 250,28 
                 C 320,32 370,45 395,58 
                 C 370,70 310,78 240,74 
                 C 160,70 100,58 52,48 
                 Z"
              fill={theme.cloudShadow || '#9db6cb'}
              opacity="0.65"
            />
            {/* 鲸鱼云主体高光受光面 */}
            <path
              d="M 52,36 
                 C 40,26 27,14 17,6 
                 C 20,20 30,33 44,40 
                 C 32,43 22,50 12,58 
                 C 27,56 42,48 54,43 
                 C 102,30 172,22 252,26 
                 C 322,30 372,43 397,56 
                 C 372,68 312,76 242,72 
                 C 162,68 102,56 54,46 
                 Z"
              fill={theme.cloudHighlight || '#ffffff'}
              opacity="0.98"
            />
            {/* 腹部下垂特征鳍 */}
            <path
              d="M 230,55 Q 220,78 205,85 Q 215,70 235,55 Z"
              fill={theme.cloudHighlight || '#ffffff'}
              opacity="0.95"
            />
          </g>
        </g>
      )}
    </g>
  ), [theme]);

  const tractor = React.useMemo(() => (
    <g
      id="tractor-in-field"
      transform="translate(75, 230)"
      className="cursor-pointer transition-opacity hover:opacity-95"
      onMouseEnter={() => setHoveredObject({ kind: 'entity', id: 'tractor' })}
      onMouseLeave={() => setHoveredObject(null)}
    >
      {/* Weathered Timber Paddock Fence behind Tractor */}
      <g id="farm-paddock-fence" transform="translate(0, -8)" opacity="0.9">
        <line x1="-55" y1="18" x2="115" y2="18" stroke="#4a3725" strokeWidth="2.8" />
        <line x1="-55" y1="26" x2="115" y2="26" stroke="#4a3725" strokeWidth="2.2" />
        {[-45, -5, 35, 75, 110].map((fx) => (
          <g key={`pf-${fx}`}>
            <rect x={fx - 1.6} y="10" width="3.5" height="24" rx="0.8" fill="#3a281a" stroke="#22160d" strokeWidth="0.5" />
            <polygon points={`${fx - 1.6},10 ${fx},7 ${fx + 1.9},10`} fill="#543c29" />
          </g>
        ))}
      </g>

      {/* Tracks trail behind the left rear wheel; the tractor faces right. */}
      <g id="tractor-wheel-ruts" opacity="0.5" strokeLinecap="round">
        <path d="M22,48.5 C-4,49 -38,53 -78,55" stroke="#423324" strokeWidth="2.6" strokeDasharray="5 4" fill="none" />
        <path d="M22,49 C-4,49.5 -38,53.5 -78,55.5" stroke="#8a714b" strokeWidth=".9" fill="none" opacity="0.6" />
        <path d="M26,39.5 C-1,40 -35,44 -74,46" stroke="#423324" strokeWidth="2.2" strokeDasharray="5 4" fill="none" />
        <path d="M26,40 C-1,40.5 -35,44.5 -74,46.5" stroke="#8a714b" strokeWidth=".8" fill="none" opacity="0.6" />
        <circle cx="-64" cy="41" r="1" fill="#786654" />
        <circle cx="-49" cy="59" r="1.2" fill="#786654" />
        <circle cx="-16" cy="56" r="0.9" fill="#786654" />
        <path d="M-73,63 Q-74,58 -76,55 M-73,63 Q-71,59 -69,56" stroke="#527027" strokeWidth="0.8" fill="none" />
        <path d="M-51,38 Q-52,33 -54,30 M-51,38 Q-49,34 -47,31" stroke="#527027" strokeWidth="0.8" fill="none" />
      </g>

      {/* Packed earth & fine gravel parking pad under tractor */}
      <ellipse cx="46" cy="46" rx="58" ry="14" fill="#4d3e30" opacity="0.38" />

      {/* Supplies stand beside the rear of the tractor, clear of its path. */}
      <g id="tractor-farm-supplies" transform="translate(-32, 18)">
        <ellipse cx="9.5" cy="18" rx="14" ry="3.2" fill="#30271b" opacity=".25" />
        <rect x="0" y="2" width="11" height="15" rx="1.8" fill="#4a3622" stroke="#251a0f" strokeWidth="0.8" />
        <line x1="0" y1="5.5" x2="11" y2="5.5" stroke="#1f2429" strokeWidth="1.1" />
        <line x1="0" y1="13" x2="11" y2="13" stroke="#1f2429" strokeWidth="1.1" />
        <ellipse cx="5.5" cy="2" rx="5" ry="2" fill="#634c32" stroke="#251a0f" strokeWidth="0.6" />
        <rect x="13" y="6" width="7" height="11" rx="1.2" fill="#94a3b8" stroke="#475569" strokeWidth="0.7" />
        <polygon points="14,6 19,6 18,3 15,3" fill="#cbd5e1" stroke="#475569" strokeWidth="0.6" />
        <circle cx="16.5" cy="2" r="1" fill="#475569" />
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
  ), [theme.tractorLightGlow, setHoveredObject]);

  return (
    <>
      <g id="parallax-sky-layer" style={skyStyle}>
        {sky}
      </g>
      <g id="parallax-mountains-layer" style={mountainStyle}>
        <g id="distant-mountain-railway-depth" transform={`translate(0, ${LANDSCAPE_SURFACES.backgroundOffsetY})`}>
          <MountainSilhouette theme={theme} frontExtension={coverage.mountainFrontExtension} />
          <g id="railway-valley-placement" transform="translate(0, -28)">
            <RailwayLandscape theme={theme} />
          </g>
        </g>
      </g>
      <g id="parallax-wheat-layer" style={wheatStyle}>
        <g id="distant-wheat-tractor-depth" transform={`translate(0, ${LANDSCAPE_SURFACES.backgroundOffsetY})`}>
          <RollingWheatSilhouette theme={theme} frontExtension={coverage.wheatFrontExtension} />
          {tractor}
        </g>
      </g>
    </>
  );
}

function HomesteadMeadowAsset({ theme, sceneLayout, meadowSurface, beehivePlanting, setHoveredObject, onTriggerToast }: HomesteadMeadowProps) {
  const cabin = sceneLayout.wooden_cabin;
  return (
    <g id="homestead-meadow-base">
      <TerrainMass theme={theme} sceneLayout={sceneLayout} meadowSurface={meadowSurface} />
      <PastureFields theme={theme} onTriggerToast={onTriggerToast} setHoveredObject={setHoveredObject} />
      <DrystoneWalls theme={theme} />
      <SheepPen theme={theme} />

      {/* 6. COTTAGE VEGETABLE & PUMPKIN GARDEN (西翼阳光缓坡双层雪松木高床菜圃) */}
      {/* 小屋左前方的生活菜架，随小屋位置和缩放保持间距。 */}
      <g id="cottage-pumpkin-patch"
        transform={`translate(${cabin.position.x}, ${cabin.position.y}) scale(${cabin.scale}) translate(-195, 75)`}>
        {/* 架前踩薄的草、工具旁散土和洒水壶下的小片湿地。 */}
        <g id="pumpkin-garden-ground-traces" pointerEvents="none" aria-hidden="true">
          <MeadowWearPatch id="pumpkin-rack-working-wear" theme={theme} variant="scuff"
            transform="translate(57, 55) scale(1.35, 0.85)" opacity={0.85} />
          <MeadowWearPatch id="pumpkin-tools-ground-wear" theme={theme} variant="scuff"
            transform="translate(123, 47) scale(0.6, 0.7)" opacity={0.75} />
          <path d="M142,32 l4,-2 M150,25 l3,-2 M155,18 l4,-2"
            stroke={theme.roadColor} strokeWidth="2.4" strokeLinecap="round" fill="none" opacity="0.45" />
          <path d="M26,50 l2,0.5 M39,53 l1.5,-0.3 M83,50 l2,0.4 M112,49 l1.5,-0.4"
            stroke="#6c5435" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.45" />
          <ellipse cx="139" cy="42" rx="8" ry="3" fill="#354d31" opacity="0.23" />
          <ellipse cx="143" cy="43" rx="3" ry="1" fill="#71918a" opacity="0.22" />
        </g>
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

      {/* 7. WEST HOMESTEAD BEEHIVE & FLOWER BEDS */}
      {/* 蜂箱与蜜源花丛在小屋左后方，保留独立草地间隔。 */}
      <g id="west-cottage-grounds"
        transform={`translate(${cabin.position.x}, ${cabin.position.y}) scale(${cabin.scale}) translate(-175, -45)`}>
        {/* 草簇错落在蜂箱后侧与两边，入口前保留采蜜空隙。 */}
        <g id="beehive-meadow-grass" pointerEvents="none" aria-hidden="true">
          {[
            { x: -25, y: 23, scale: 0.7 },
            { x: 16, y: 32, scale: 0.65 },
            { x: 55, y: -11, scale: 0.6 },
          ].map((tuft, index) => <g key={index} transform={`translate(${tuft.x}, ${tuft.y}) scale(${tuft.scale})`}>
            <ellipse cx="0" cy="1" rx="7" ry="2.4" fill={theme.hillGreenFar} opacity="0.2" />
            <path d="M-5,0 Q-6,-5 -9,-8 M-1,1 Q-3,-7 -2,-11 M2,0 Q3,-6 6,-9 M5,1 Q7,-3 9,-5"
              stroke="#4e702f" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <path d="M0,0 Q0,-5 1,-8 M4,0 Q6,-4 8,-6"
              stroke="#88a94c" strokeWidth="0.8" strokeLinecap="round" fill="none" />
          </g>)}
        </g>
        <g id="beehive-meadow-wildflowers" pointerEvents="none" aria-hidden="true">
          {[
            { x: 0, y: 29, color: '#f4d775' },
            { x: 64, y: 24, color: '#fff9df' },
          ].map((flower, index) => <g key={index} transform={`translate(${flower.x}, ${flower.y})`}>
            <path d="M-2,0 Q-4,-4 -4,-7 M2,1 Q4,-3 3,-9"
              stroke="#486a34" strokeWidth="0.8" strokeLinecap="round" fill="none" />
            <ellipse cx="-4" cy="-7" rx="2.3" ry="1.7" fill={flower.color} />
            <ellipse cx="3" cy="-9" rx="2" ry="1.6" fill={flower.color} />
            <circle cx="-4" cy="-7" r="0.7" fill="#b98d32" />
            <circle cx="3" cy="-9" r="0.65" fill="#b98d32" />
            <path d="M-1,0 Q-6,-2 -7,-4 M3,1 Q7,-1 8,-3"
              stroke="#6d8b3c" strokeWidth="0.8" fill="none" />
          </g>)}
        </g>
        {/* ======================================================== */}
        {/* A. 蜜源花丛 (Lavender & Wildflowers - 摇曳薰衣草与金色雏菊)  */}
        {/* ======================================================== */}
        <g id="beehive-lavender-flowers" transform="translate(-12, 10)">
          {/* 地面小草影 */}
          <ellipse cx="0" cy="8" rx="9" ry="3.5" fill="#182315" opacity="0.25" />
          <g className="animate-wind-flower" style={{ animationDelay: '0.4s', transformOrigin: '0px 0px' }}>
            {/* 薰衣草花茎 */}
            <path d="M-5,7 Q-6,-1 -7,-8 M-1,7 Q-2,-2 -2,-12 M3,7 Q4,-2 4,-9 M7,7 Q9,-1 9,-7" stroke="#385434" strokeWidth="1.1" fill="none" strokeLinecap="round" />
            {/* 丰满紫色薰衣草花穗 */}
            <circle cx="-7" cy="-8" r="1.5" fill="#a855f7" />
            <circle cx="-6.5" cy="-6" r="1.2" fill="#c084fc" />
            <circle cx="-2" cy="-12" r="1.7" fill="#9333ea" />
            <circle cx="-2" cy="-9.5" r="1.4" fill="#a855f7" />
            <circle cx="-2" cy="-7.2" r="1.2" fill="#c084fc" />
            <circle cx="4" cy="-9" r="1.5" fill="#a855f7" />
            <circle cx="4" cy="-6.8" r="1.2" fill="#9333ea" />
            <circle cx="9" cy="-7" r="1.4" fill="#c084fc" />
          </g>
          {/* 金黄雏菊与白花点缀 */}
          <circle cx="-2" cy="6" r="1.6" fill="#fef08a" />
          <circle cx="-2" cy="6" r="0.65" fill="#ca8a04" />
          <circle cx="4" cy="7" r="1.4" fill="#ffffff" />
          <circle cx="4" cy="7" r="0.6" fill="#facc15" />
        </g>

        {/* ======================================================== */}
        {/* B. 可爱木制小蜜蜂箱 (Cute Storybook Wooden Beehive & Bees) */}
        {/* ======================================================== */}
        {/* 围绕箱体中心水平翻转，入口朝右，原木箱、屋顶、支架和配色保留。 */}
        {beehivePlanting}
        <g id="storybook-wooden-beehive" transform="translate(50, 2) scale(-1, 1)">
          {/* 1. 地面接触阴影 */}
          <ellipse cx="10" cy="19" rx="14" ry="5.5" fill="#182315" opacity="0.38" />

          {/* 2. 蜂箱四脚立柱支架 (4-Leg Wooden Hive Stand - 离地防潮) */}
          <rect x="2" y="13" width="2.2" height="6" rx="0.5" fill="#3b2413" stroke="#1d1108" strokeWidth="0.5" />
          <rect x="15.8" y="13" width="2.2" height="6" rx="0.5" fill="#3b2413" stroke="#1d1108" strokeWidth="0.5" />
          <rect x="6" y="10" width="2" height="5" rx="0.5" fill="#2d1b0d" />
          <rect x="19" y="10" width="2" height="5" rx="0.5" fill="#2d1b0d" />

          {/* 3. 起飞/降落斜木踏板 (Flight Landing Board) */}
          <polygon points="1,13 19,13 21,16.5 0,16.5" fill="#8c582f" stroke="#362010" strokeWidth="0.6" />
          <line x1="1" y1="13.8" x2="19" y2="13.8" stroke="#b27b4b" strokeWidth="0.6" />

          {/* 4. 下层主蜂巢箱 (Brood Chamber Box - 2.5D 等轴测温暖实木箱) */}
          <polygon points="1.5,4.5 18.5,4.5 18.5,13 1.5,13" fill="#e2b477" stroke="#4a2e16" strokeWidth="0.6" />
          <polygon points="18.5,4.5 24,1.8 24,9.8 18.5,13" fill="#b0834c" stroke="#4a2e16" strokeWidth="0.6" />
          <line x1="2" y1="8.5" x2="18" y2="8.5" stroke="#a4723c" strokeWidth="0.5" />
          <line x1="18.5" y1="8.5" x2="24" y2="5.8" stroke="#875929" strokeWidth="0.5" />
          <rect x="5.5" y="10.8" width="9" height="1.8" rx="0.6" fill="#1b1208" />

          {/* 5. 上层继箱 (Honey Super Box - 储蜜层) */}
          <polygon points="1,-2.5 19,-2.5 19,4.5 1,4.5" fill="#ebd0a6" stroke="#4a2e16" strokeWidth="0.6" />
          <polygon points="19,-2.5 24.5,-5.2 24.5,1.8 19,4.5" fill="#b88c54" stroke="#4a2e16" strokeWidth="0.6" />
          <rect x="7.5" y="0.5" width="5" height="1.6" rx="0.5" fill="#8c582f" opacity="0.85" />

          {/* 6. 人字倾斜木屋顶与铜绿护顶 (Pitched Storybook Gable Roof) */}
          <polygon points="1,-2.5 10,-8 19,-2.5" fill="#deb885" stroke="#3d2411" strokeWidth="0.6" />
          <polygon points="-0.5,-2.2 10,-8 15.5,-10.8 5,-5" fill="#6ea35d" stroke="#2d4a25" strokeWidth="0.6" />
          <polygon points="10,-8 20.5,-2.2 26,-5 15.5,-10.8" fill="#528343" stroke="#2d4a25" strokeWidth="0.6" />
          <line x1="10" y1="-8" x2="15.5" y2="-10.8" stroke="#a3e635" strokeWidth="0.8" />
          <polygon points="10,-6.5 11.8,-5.5 11.8,-3.5 10,-2.5 8.2,-3.5 8.2,-5.5" fill="#fbbf24" stroke="#854d0e" strokeWidth="0.4" />

          {/* 7. 飞舞的可爱小蜜蜂 (Tiny Buzzing Bees) */}
          {/* 蜜蜂 1：在蜂箱出入口前方飞舞 */}
          <g transform="translate(15, 8)">
            <ellipse cx="-1" cy="-1.4" rx="1.3" ry="0.8" fill="#e0f2fe" opacity="0.9" transform="rotate(-25 -1 -1.4)" />
            <ellipse cx="1" cy="-1.4" rx="1.3" ry="0.8" fill="#ffffff" opacity="0.9" transform="rotate(25 1 -1.4)" />
            <ellipse cx="0" cy="0" rx="2.0" ry="1.4" fill="#fbbf24" />
            <line x1="-0.6" y1="-1.2" x2="-0.6" y2="1.2" stroke="#451a03" strokeWidth="0.6" />
            <line x1="0.6" y1="-1.2" x2="0.6" y2="1.2" stroke="#451a03" strokeWidth="0.6" />
            <circle cx="1.6" cy="-0.2" r="0.4" fill="#1c1917" />
            <line x1="-2.0" y1="0" x2="-2.5" y2="0" stroke="#1c1917" strokeWidth="0.4" />
          </g>

          {/* 蜜蜂 2：在屋顶上方盘旋 */}
          <g transform="translate(25, -6)">
            <ellipse cx="-0.8" cy="-1.2" rx="1.1" ry="0.7" fill="#e0f2fe" opacity="0.85" transform="rotate(-20 -0.8 -1.2)" />
            <ellipse cx="0.8" cy="-1.2" rx="1.1" ry="0.7" fill="#ffffff" opacity="0.85" transform="rotate(20 0.8 -1.2)" />
            <ellipse cx="0" cy="0" rx="1.7" ry="1.2" fill="#facc15" />
            <line x1="-0.4" y1="-1" x2="-0.4" y2="1" stroke="#451a03" strokeWidth="0.5" />
            <line x1="0.5" y1="-1" x2="0.5" y2="1" stroke="#451a03" strokeWidth="0.5" />
          </g>

          {/* 蜜蜂 3：在花丛与蜂箱之间的开阔草地采蜜 (位于中间空档处) */}
          <g transform="translate(-10, 6)">
            <ellipse cx="0" cy="-1.1" rx="1.0" ry="0.6" fill="#e0f2fe" opacity="0.8" />
            <ellipse cx="0" cy="0" rx="1.5" ry="1.1" fill="#fbbf24" />
            <line x1="0" y1="-0.9" x2="0" y2="0.9" stroke="#451a03" strokeWidth="0.5" />
          </g>
        </g>
      </g>

    </g>
  );
}

export const BackgroundLandscape = React.memo(BackgroundLandscapeAsset);
export const HomesteadMeadow = React.memo(HomesteadMeadowAsset);
