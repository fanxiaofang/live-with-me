import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';
import { meadowGroundPath } from '../../../../world/scene/landscapeGeometry';
import { DEFAULT_SCENE_LAYOUT } from '../../../../world/scene/sceneLayout';
import { FIELD_EDGE_STUDY } from '../../../../world/scene/fieldEdges';
import { MEADOW_STUDY } from '../vegetation/meadowStudy';
import { FieldContactFringe } from './FieldContactFringe';
import { FieldEdgePlanting } from './FieldEdgePlanting';
import { FieldAccess } from './FieldAccess';
import type { EntityId, SceneLayout } from '../../../../world/scene/sceneTypes';

const GROUND_SHADOWS: { entity: EntityId; x: number; y: number; rx: number; ry: number; opacity: number }[] = [
  { entity: 'main_cottage', x: 0, y: 165, rx: 310, ry: 100, opacity: 1 },
  { entity: 'wooden_cabin', x: 9, y: 57, rx: 92, ry: 24, opacity: 0.55 },
  { entity: 'capsule_pod', x: 0, y: 57, rx: 76, ry: 22, opacity: 0.55 },
  { entity: 'observatory', x: 0, y: 50, rx: 78, ry: 20, opacity: 0.45 },
];

/**
 * ⛰️ TerrainMass (Seamless Ground Architecture & Homestead Meadow Grounds)
 *
 * Layer: 02 TERRAIN MASS
 * An asymmetric terrace embraces both sleeping cabins and opens into a deeper front yard.
 * Matching feather contours dissolve its edge into the pasture. The lower tree slope and
 * the independent radio-station rise remain shallow, without hard outlines or retaining walls.
 * Building contact shadows follow sceneLayout rather than the authored terrace outline.
 */
export const TerrainMass: React.FC<YorkshireCommonProps & { sceneLayout?: SceneLayout; meadowSurface?: React.ReactNode; frontRefined?: boolean; surfaceRefined?: boolean }> = ({ theme, className, sceneLayout = DEFAULT_SCENE_LAYOUT, meadowSurface, frontRefined = false, surfaceRefined = false }) => {
  const contactGradient = 'field-contact-' + React.useId().replace(/:/g, '');
  const boundary = YORKSHIRE_LAYOUT.drystoneWalls.eastWall;
  const station = sceneLayout.observatory;
  // Matching curve segments keep both feather rings around the entire organic silhouette.
  // The west apron gives the pumpkin rack a grass margin. The east shoulder
  // recedes before the sheep pen; the front yard extends toward y=630.
  const terracePath =
    'M -115,399 C -124,340 131,272 314,246 C 405,232 494,211 550,215 C 671,219 771,271 932,296 C 1056,318 1105,349 1099,408 C 1095,455 1013,490 951,500 C 858,521 774,534 713,587 C 666,622 597,637 528,624 C 459,617 409,586 339,599 C 250,602 198,564 112,537 C 6,520 -113,470 -115,399 Z';

  const outerFeatherPath =
    'M -140,399 C -149,328 121,253 309,228 C 403,214 494,193 551,197 C 676,201 779,253 940,278 C 1077,301 1130,340 1124,410 C 1120,467 1024,505 955,515 C 865,536 788,550 727,602 C 675,640 598,657 524,644 C 454,637 409,607 339,619 C 244,622 187,581 105,556 C -14,537 -138,482 -140,399 Z';

  const midFeatherPath =
    'M -127,399 C -136,334 126,263 312,237 C 404,223 494,202 550,206 C 673,210 775,262 936,287 C 1066,310 1117,345 1111,409 C 1107,461 1018,497 953,507 C 861,528 781,542 720,594 C 670,631 597,647 526,634 C 457,627 409,596 339,609 C 247,612 193,572 109,546 C -4,528 -125,476 -127,399 Z';

  return (
    <g id="yorkshire-terrain-mass" className={className}>
      <defs>
        {/* Lock the original pasture colour coordinates while its contact outline changes. */}
        {(frontRefined || surfaceRefined) && <linearGradient id={contactGradient} href="#isoGroundPastureGrad"
          gradientUnits="userSpaceOnUse" x1="0" x2="0"
          y1={FIELD_EDGE_STUDY.pastureGradientY[0]} y2={FIELD_EDGE_STUDY.pastureGradientY[1]} />}
        {/* 庭院微丘向阳面温暖漫射光斑 (Afternoon Sunbeam Dapple across Courtyard) */}
        <radialGradient id="lawnSunDapple" cx="48%" cy="42%" r="52%">
          <stop offset="0%" stopColor="#d3ed7a" stopOpacity="0.25" />
          <stop offset="50%" stopColor="#badb5e" stopOpacity="0.14" />
          <stop offset="80%" stopColor="#8db042" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#5c7a2b" stopOpacity="0" />
        </radialGradient>

        {/* 建筑基底深层接地接触阴影 (Deep Underfloor Soil Occlusion strictly beneath structures) */}
        <radialGradient id="cottageGroundAOGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0d160a" stopOpacity="0.55" />
          <stop offset="45%" stopColor="#142110" stopOpacity="0.35" />
          <stop offset="75%" stopColor="#1f3118" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2c4222" stopOpacity="0" />
        </radialGradient>

        {/* 边缘羽化滤镜 (Soft Edge Blur Filter for 100% seamless meadow integration) */}
        <filter id="terraceFeatherFilter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="15" />
        </filter>

        {/* 边缘平滑遮罩 */}
        <mask id="homesteadTerraceBlendMask">
          <path d={terracePath} fill="#ffffff" filter="url(#terraceFeatherFilter)" />
        </mask>

        <filter id="meadowLowSlopeFeather" x="-25%" y="-40%" width="150%" height="180%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <radialGradient id="meadowLowSlopeGrad" cx="48%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#b0c66b" stopOpacity="0.32" />
          <stop offset="58%" stopColor="#86a34d" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#6b873a" stopOpacity="0" />
        </radialGradient>

        {/* 胶囊仓天然基岩与木栈道挡土矮墙渐变 */}
        <linearGradient id="stoneWallCapGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#827769" />
          <stop offset="50%" stopColor="#9a8e7f" />
          <stop offset="100%" stopColor="#7c7062" />
        </linearGradient>
        <linearGradient id="stoneWallFaceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f4439" />
          <stop offset="50%" stopColor="#3a3128" />
          <stop offset="100%" stopColor="#251f19" />
        </linearGradient>
      </defs>

      {/* Keep the planar lawn. Only a narrow fringe and local access bank overlap the crop. */}
      <g id="master-axonometric-ground-plane">
        <path d={meadowGroundPath(frontRefined)} transform={frontRefined ? undefined : 'translate(0, -2)'}
          fill={frontRefined ? 'none' : '#9aa640'} opacity="0.28" />
        <path d={meadowGroundPath(frontRefined)} fill={frontRefined ? 'url(#' + contactGradient + ')' : 'url(#isoGroundPastureGrad)'} />
        {frontRefined && surfaceRefined && <FieldAccess theme={theme} />}
        {frontRefined && <FieldContactFringe />}
        {frontRefined && theme.landscapeEnvironment && <FieldEdgePlanting theme={theme} />}

        {/* D. 田界历史矮石墙与野草田埂碎化景致 (Historic Drystone Field Boundary Traces) */}
        {/* 呈现英国约克郡经典的自然田亩分界 */}
        <g id="pastoral-boundary-dressing" opacity="0.85">
          {/* 东侧低矮干砌石墙段 (East Weathered Drystone Wall Run) */}
          <g transform={`translate(${boundary.stoneWallAnchor.x}, ${boundary.stoneWallAnchor.y})`}>
            <polygon points="0,0 140,8 140,16 0,8" fill="#5c5448" />
            <polygon points="0,-4 140,4 140,8 0,0" fill="#9e9384" />
            {[15, 40, 65, 90, 115].map((ex, ei) => (
              <line key={`esw-${ei}`} x1={ex} y1={ei * 1.5 - 2} x2={ex} y2={ei * 1.5 + 6} stroke="#3b352c" strokeWidth="0.7" opacity="0.6" />
            ))}
          </g>

          {/* 田埂边缘野草与雏菊丛 (Boundary Wild Chamomile & Buttercups) */}
          {[
            { x: -620, y: 212 },
            { x: -410, y: 198 },
            { x: -180, y: 188 },
            { x: 120, y: 182 },
            { x: 680, y: 184 },
            { x: 1040, y: 194 },
            { x: 1340, y: 202 },
            { x: 1560, y: 208 },
          ].map((fl, fi) => (
            <g key={`bd-fl-${fi}`} transform={`translate(${fl.x}, ${fl.y})`}>
              <path d="M0,0 Q-2,-5 -3,-8 M0,0 Q2,-4 3,-7" stroke="#486221" strokeWidth="0.8" fill="none" />
              <circle cx="-3" cy="-8" r="1.5" fill={fi % 2 === 0 ? '#fef08a' : '#ffffff'} />
              <circle cx="3" cy="-7" r="1.3" fill={fi % 3 === 0 ? '#facc15' : '#ffffff'} />
            </g>
          ))}
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 2. 主屋庭院草台缓坡：两翼承接小屋，中央前缘自然外伸。 */}
      {/* ========================================================================= */}
      <g id="homestead-organic-meadow-grounds">
        {/* A. 外缘两重微渐变消隐层 (Multi-step soft alpha feathering into master pasture) */}
        <path d={outerFeatherPath} fill="url(#isoTerraceTurfGrad)" opacity={surfaceRefined ? MEADOW_STUDY.featherOpacity : .22} />
        <path d={midFeatherPath} fill="url(#isoTerraceTurfGrad)" opacity={surfaceRefined ? MEADOW_STUDY.featherOpacity : .45} />

        {/* B. 羽化草台主体 (Feather-masked core lawn with perfect edge blending) */}
        <g mask="url(#homesteadTerraceBlendMask)">
          <path d={terracePath} fill={surfaceRefined ? 'url(#' + contactGradient + ')' : 'url(#isoTerraceTurfGrad)'} opacity="0.88" />

          {/* 阳光在庭院中央的温和漫射光斑 (Warm Dappled Sunlight across Central Lawn · 11s 超长周期呼吸律动) */}
          <ellipse
            cx="540"
            cy="490"
            rx="450"
            ry="175"
            fill="url(#lawnSunDapple)"
            className="animate-sunbeam-breathe"
            style={{ transformOrigin: '540px 490px' }}
          />
          {meadowSurface}
        </g>

        {/* C. 建筑底部深层接地接触阴影 (Deep Architectural Grounding AO - 仅位于建筑下方，绝不溢出到外缘) */}
        {GROUND_SHADOWS.map(shadow => {
          const { position, scale } = sceneLayout[shadow.entity];
          return <g key={shadow.entity} data-ground-shadow={shadow.entity}
            transform={`translate(${position.x}, ${position.y}) scale(${scale})`}>
            <ellipse cx={shadow.x} cy={shadow.y} rx={shadow.rx} ry={shadow.ry}
              fill="url(#cottageGroundAOGrad)" opacity={shadow.opacity} />
          </g>;
        })}

        {/* D. 自然微生草簇细节 (Natural Lawn Tufts · 根部锚定微风浪涌与由西向东相位波) */}
        <g id="lawn-natural-grass-tufts" opacity="0.88">
          {[
            { x: 30, y: 440, s: 1.0 },
            { x: 120, y: 470, s: 1.1 },
            { x: 260, y: 510, s: 1.0 },
            { x: 410, y: 570, s: 1.0 },
            { x: 500, y: 590, s: 1.1 },
            { x: 620, y: 595, s: 1.05 },
            { x: 740, y: 545, s: 1.0 },
            { x: 860, y: 485, s: 1.1 },
            { x: 960, y: 450, s: 1.0 },
            { x: 210, y: 425, s: 0.9 },
            { x: 440, y: 480, s: 1.05 },
            { x: 670, y: 485, s: 1.0 },
          ].map((tuft, idx) => {
            // 水平风波延时：由西向东（X轴递增）呈现波浪起伏律动
            const waveDelay = Number(((tuft.x + 100) * 0.0031 + (tuft.y - 400) * 0.0012).toFixed(2));
            return (
              <g key={`tg-${idx}`} transform={`translate(${tuft.x}, ${tuft.y}) scale(${tuft.s})`}>
                <g
                  className="animate-wind-grass"
                  style={{
                    animationDelay: `${waveDelay}s`,
                    transformOrigin: '0px 0px',
                  }}
                >
                  <path
                    d="M-4,0 Q-6,-7 -9,-12 M-1,0 Q-2,-9 -3,-15 M2,0 Q4,-8 6,-13 M5,0 Q8,-6 10,-9"
                    stroke={idx % 2 === 0 ? '#4e7025' : '#648b2d'}
                    strokeWidth="1.25"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M-2,0 Q-3,-8 -4,-13 M1,0 Q2,-8 3,-12"
                    stroke="#8cb33e"
                    strokeWidth="0.85"
                    strokeLinecap="round"
                    fill="none"
                  />
                </g>
              </g>
            );
          })}
        </g>

        {/* E. 三叶草与低矮地被微生苔藓小斑块 (Clover & Creeping Thyme Turf Patches · 连动轻晃) */}
        <g id="clover-turf-patches" opacity="0.82">
          {[
            { x: 160, y: 460, r: 20 },
            { x: 320, y: 505, r: 24 },
            { x: 450, y: 570, r: 22 },
            { x: 640, y: 565, r: 22 },
            { x: 820, y: 480, r: 22 },
          ].map((patch, idx) => {
            const cloverDelay = Number(((patch.x + 100) * 0.0033).toFixed(2));
            return (
              <g key={`clp-${idx}`} transform={`translate(${patch.x}, ${patch.y})`}>
                <ellipse cx="0" cy="0" rx={patch.r} ry={patch.r * 0.42} fill="#38541c" opacity="0.25" />
                <g
                  className="animate-wind-clover"
                  style={{
                    animationDelay: `${cloverDelay}s`,
                    transformOrigin: '0px 0px',
                  }}
                >
                  {/* 三叶草细茎 */}
                  <path d="M-5,0 Q-5,-2 -5,-3" stroke="#4d7024" strokeWidth="0.7" fill="none" />
                  <path d="M0,0 Q0,-3 0,-6" stroke="#4d7024" strokeWidth="0.7" fill="none" />
                  <path d="M5,0 Q5,-2 5,-3" stroke="#4d7024" strokeWidth="0.7" fill="none" />
                  {/* 三叶草小叶片群 */}
                  <circle cx="-5" cy="-3" r="3.0" fill="#587e2b" />
                  <circle cx="0" cy="-7" r="2.8" fill="#699433" />
                  <circle cx="5" cy="-3" r="3.0" fill="#587e2b" />
                  <circle cx="9" cy="2" r="2.6" fill="#699433" />
                  <circle cx="-8" cy="3" r="2.4" fill="#4d7024" />
                </g>
              </g>
            );
          })}
        </g>

        {/* F. 纯净田园毛茛野花与细碎小雏菊 (Pastoral Buttercups & Daisies · 连带细茎点头摇曳) */}
        <g id="meadow-field-blossoms" opacity="0.92">
          {[
            { x: 80, y: 450, c: '#facc15', stemH: 10, stemCurv: -2 },
            { x: 220, y: 485, c: '#ffffff', stemH: 12, stemCurv: 2 },
            { x: 340, y: 515, c: '#fef08a', stemH: 11, stemCurv: -1 },
            { x: 440, y: 590, c: '#ffffff', stemH: 11, stemCurv: 3 },
            { x: 580, y: 605, c: '#facc15', stemH: 10, stemCurv: -2 },
            { x: 720, y: 510, c: '#ffffff', stemH: 11, stemCurv: 2 },
            { x: 840, y: 475, c: '#fef08a', stemH: 10, stemCurv: -1 },
            { x: 920, y: 445, c: '#ffffff', stemH: 9, stemCurv: 1 },
          ].map((fl, idx) => {
            const flowerDelay = Number(((fl.x + 100) * 0.0031 + fl.stemH * 0.05).toFixed(2));
            return (
              <g key={`mfb-${idx}`} transform={`translate(${fl.x}, ${fl.y})`}>
                <g
                  className="animate-wind-flower"
                  style={{
                    animationDelay: `${flowerDelay}s`,
                    transformOrigin: '0px 0px',
                  }}
                >
                  {/* 柔韧细茎根部接地 */}
                  <path
                    d={`M0,0 Q${fl.stemCurv},${-fl.stemH * 0.5} 0,${-fl.stemH}`}
                    stroke="#486d26"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* 茎上微型嫩叶 */}
                  <path
                    d={`M${fl.stemCurv * 0.5},${-fl.stemH * 0.4} Q${fl.stemCurv * 0.5 + 2},${-fl.stemH * 0.4 - 2} ${fl.stemCurv * 0.5 + 3},${-fl.stemH * 0.4 - 1}`}
                    stroke="#5d8b2d"
                    strokeWidth="0.7"
                    fill="none"
                  />
                  {/* 花朵主体与花蕊 */}
                  <g transform={`translate(0, ${-fl.stemH})`}>
                    <circle cx="0" cy="0" r={fl.c === '#ffffff' ? 2.4 : 2.2} fill={fl.c} />
                    {fl.c === '#ffffff' && <circle cx="0" cy="0" r="0.85" fill="#facc15" />}
                    {fl.c !== '#ffffff' && <circle cx="0" cy="0" r="0.75" fill="#ca8a04" />}
                  </g>
                </g>
              </g>
            );
          })}
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 3. 外围低缓地形。只用柔和光影暗示起伏，不把外围设施并入主草台。 */}
      {/* ========================================================================= */}
      <g id="terrace-embedded-features" pointerEvents="none">
        <path id="guardian-tree-lower-slope"
          d="M 188,584 C 178,553 215,526 265,519 C 313,512 382,536 398,568 C 417,608 372,652 309,657 C 255,666 202,636 188,584 Z"
          fill="url(#meadowLowSlopeGrad)" filter="url(#meadowLowSlopeFeather)" />
        <g id="station-independent-meadow-rise"
          transform={`translate(${station.position.x}, ${station.position.y}) scale(${station.scale})`}>
          <path d="M -112,45 C -120,13 -72,-17 -8,-16 C 57,-19 113,5 116,42 C 121,77 61,98 -5,94 C -68,97 -109,76 -112,45 Z"
            fill="url(#meadowLowSlopeGrad)" filter="url(#meadowLowSlopeFeather)" />
        </g>
      </g>
    </g>
  );
};
