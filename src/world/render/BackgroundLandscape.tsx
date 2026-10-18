import React from 'react';
import { DrystoneWalls, MountainSilhouette, PastureFields, RailwayLandscape, RollingWheatSilhouette, SheepPen, TerrainMass } from '../../components/scenery/yorkshire';
import type { YorkshireSceneTheme } from '../../components/scenery/yorkshire/landscapeTypes';
import { Camera, OVERVIEW_CAMERA } from '../camera/cameraMath';
import { getParallaxTransformStyle, PARALLAX_PRESETS } from '../camera/parallaxMath';
import type { HoverTarget } from '../interactions/interactionTypes';
import { LANDSCAPE_SURFACES } from '../scene/landscapeGeometry';
import type { SceneLayout } from '../scene/sceneTypes';
import { useLandscapeCoverage } from './useLandscapeCoverage';

export interface BackgroundLandscapeProps {
  theme: YorkshireSceneTheme;
  camera?: Camera;
  isDragging?: boolean;
  setHoveredObject: HoverTarget;
  onTriggerToast?: (message: string) => void;
}

export interface HomesteadMeadowProps {
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
      <g opacity="0.55">
        <path d="M22,46 C32,60 45,78 60,98" stroke="#423324" strokeWidth="3.6" strokeDasharray="6 4" fill="none" />
        <path d="M23,47 C33,61 46,79 61,99" stroke="#63503d" strokeWidth="1.2" fill="none" opacity="0.6" />
        <path d="M42,46 C52,60 65,78 80,98" stroke="#423324" strokeWidth="3.6" strokeDasharray="6 4" fill="none" />
        <path d="M43,47 C53,61 66,79 81,99" stroke="#63503d" strokeWidth="1.2" fill="none" opacity="0.6" />
        <circle cx="35" cy="62" r="1" fill="#786654" />
        <circle cx="52" cy="74" r="1.2" fill="#786654" />
        <circle cx="70" cy="88" r="0.9" fill="#786654" />
      </g>
      <ellipse cx="46" cy="46" rx="58" ry="14" fill="#4d3e30" opacity="0.38" />
      <g transform="translate(100, 24)">
        <rect x="0" y="2" width="11" height="15" rx="1.8" fill="#4a3622" stroke="#251a0f" strokeWidth="0.8" />
        <line x1="0" y1="5.5" x2="11" y2="5.5" stroke="#1f2429" strokeWidth="1.1" />
        <line x1="0" y1="13" x2="11" y2="13" stroke="#1f2429" strokeWidth="1.1" />
        <ellipse cx="5.5" cy="2" rx="5" ry="2" fill="#634c32" stroke="#251a0f" strokeWidth="0.6" />
        <rect x="13" y="6" width="7" height="11" rx="1.2" fill="#94a3b8" stroke="#475569" strokeWidth="0.7" />
        <polygon points="14,6 19,6 18,3 15,3" fill="#cbd5e1" stroke="#475569" strokeWidth="0.6" />
        <circle cx="16.5" cy="2" r="1" fill="#475569" />
      </g>
      <g transform="translate(-32, 22)">
        <g>
          <ellipse cx="0" cy="12" rx="14" ry="9" fill="#d9b434" />
          <rect x="-14" y="0" width="28" height="12" fill="#eab308" />
          <ellipse cx="0" cy="0" rx="14" ry="7" fill="#fde047" stroke="#ca8a04" strokeWidth="0.8" />
          <line x1="-8" y1="0" x2="-8" y2="12" stroke="#854d0e" strokeWidth="1.0" strokeDasharray="3,1" />
          <line x1="8" y1="0" x2="8" y2="12" stroke="#854d0e" strokeWidth="1.0" strokeDasharray="3,1" />
          <circle cx="0" cy="0" r="4.5" fill="none" stroke="#ca8a04" strokeWidth="0.8" strokeDasharray="3,2" />
        </g>
      </g>
      <ellipse cx="22" cy="46" rx="16" ry="5" fill="#18191c" opacity="0.45" />
      <ellipse cx="76" cy="46" rx="10" ry="3.5" fill="#18191c" opacity="0.45" />
      <circle cx="22" cy="30" r="18.5" fill="#1c1d20" />
      <circle cx="22" cy="30" r="16.5" fill="#292b30" />
      <circle cx="22" cy="30" r="11" fill="#eab308" stroke="#a16207" strokeWidth="1.2" />
      <circle cx="22" cy="30" r="9" fill="#ca8a04" />
      <circle cx="22" cy="30" r="4.5" fill="#1e2024" stroke="#0f1012" strokeWidth="0.8" />
      <circle cx="76" cy="37" r="10.5" fill="#1c1d20" />
      <circle cx="76" cy="37" r="9.2" fill="#2a2c30" />
      <circle cx="76" cy="37" r="5.5" fill="#eab308" stroke="#a16207" strokeWidth="1" />
      <circle cx="76" cy="37" r="2.4" fill="#1e2024" />
      <rect x="22" y="31" width="54" height="6.5" fill="#23262b" rx="1.2" />
      <path d="M3,30 C3,12 41,12 41,30" stroke="#991b1b" strokeWidth="5.6" fill="none" strokeLinecap="round" />
      <polygon points="16,18 48,14 82,22 82,37 30,37" fill="#b91c1c" />
      <rect x="80" y="23" width="3.5" height="13.5" fill="#33383f" rx="1" stroke="#1f2329" strokeWidth="0.6" />
      <line x1="64" y1="22" x2="64" y2="5" stroke="#1f2226" strokeWidth="3.2" strokeLinecap="round" />
      <rect x="17" y="9" width="13" height="9.5" rx="2.8" fill="#18191c" stroke="#0a0a0c" strokeWidth="0.8" />
      <circle cx="82" cy="27" r="3.6" fill="#fef08a" stroke="#a16207" strokeWidth="1.2" />
      <polygon points="85,27 138,18 145,43 85,33" fill={theme.tractorLightGlow} className="pointer-events-none" />
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

function HomesteadMeadowAsset({ theme, sceneLayout, setHoveredObject, onTriggerToast }: HomesteadMeadowProps) {
  return (
    <g id="homestead-meadow-base">
      <TerrainMass theme={theme} sceneLayout={sceneLayout} />
      <PastureFields theme={theme} onTriggerToast={onTriggerToast} setHoveredObject={setHoveredObject} />
      <DrystoneWalls theme={theme} />
      <SheepPen theme={theme} />
    </g>
  );
}

export const BackgroundLandscape = React.memo(BackgroundLandscapeAsset);
export const HomesteadMeadow = React.memo(HomesteadMeadowAsset);
