import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';
import { DEFAULT_SCENE_LAYOUT } from '../../../../world/scene/sceneLayout';
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
 * Edge Optimization per User Request:
 * - Retains an approximate rounded rectangle/oval geometry embracing the cabin cluster
 * - Scope preserved: spans comfortably from west sleeping cabin to east capsule pod
 * - Edge feathered and smoothly dissolved into the master pasture ground (与整块草地自然衔接)
 * - Removed all harsh cutout outlines, dark border crescents, and artificial dashed seams
 * - Grounding AO placed strictly under building footings
 */
export const TerrainMass: React.FC<YorkshireCommonProps & { sceneLayout?: SceneLayout }> = ({ className, sceneLayout = DEFAULT_SCENE_LAYOUT }) => {
  const boundary = YORKSHIRE_LAYOUT.drystoneWalls.eastWall;
  // Approximate rounded isometric rectangle geometry embracing cottage cluster
  const terracePath =
    'M -70,398 C -70,305 450,215 540,215 C 630,215 1150,305 1150,398 C 1150,488 630,585 540,585 C 450,585 -70,488 -70,398 Z';

  const outerFeatherPath =
    'M -95,398 C -95,295 440,198 540,198 C 640,198 1175,295 1175,398 C 1175,498 640,602 540,602 C 440,602 -95,498 -95,398 Z';

  const midFeatherPath =
    'M -82,398 C -82,300 445,206 540,206 C 635,206 1162,300 1162,398 C 1162,493 635,593 540,593 C 445,593 -82,493 -82,398 Z';

  return (
    <g id="yorkshire-terrain-mass" className={className}>
      <defs>
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

      {/* ========================================================================= */}
      {/* 1. 全景统一宽阔主大地基面 (Continuous Master Pasture Ground - 遵循 2.5D 轴测平面边界) */}
      {/*    彻底消除麦田与草甸交界处的死硬横切线与高光条，实现 100% 自然羽化交融   */}
      {/* ========================================================================= */}
      <g id="master-axonometric-ground-plane">
        {/* A. 麦田与深绿草甸无缝羽化交融过渡裙带 (Seamless Wheat-to-Pasture Apron) */}
        <path
          d="M -4000,165 C -3000,150 -2000,168 -1100,150 C -300,135 350,130 1050,140 C 1750,150 2500,160 3300,175 C 4000,190 4800,180 6000,190 L 6000,248 C 4800,245 4000,255 3300,242 C 2500,222 1750,215 1050,202 C 350,190 -300,198 -1100,215 C -2000,236 -3000,218 -4000,232 Z"
          fill="url(#wheatPastureBlendGrad)"
          opacity="0.95"
        />

        {/* B. 具有自然起伏波浪弧度的主草坪大地基面 (Organic Rolling Master Meadow Ground) */}
        <path
          d="M -4000,212 C -3000,198 -2000,216 -1100,195 C -300,178 350,170 1050,182 C 1750,195 2500,202 3300,222 C 4000,236 4800,225 6000,235 L 6000,2600 L -4000,2600 Z"
          fill="url(#isoGroundPastureGrad)"
        />

        {/* C. 麦田与草甸自然交界处的舒缓地势等高田垄光影 (Soft Organic Swale Ridge & Berm) */}
        <path
          d="M -3200,210 C -2200,195 -1200,214 -200,185 C 450,172 1200,188 2200,204 C 3000,218 3800,228 4600,232"
          fill="none"
          stroke="#b8bd68"
          strokeWidth="0.8"
          opacity="0.32"
        />
        <path
          d="M -3200,212 C -2200,197 -1200,216 -200,187 C 450,174 1200,190 2200,206 C 3000,220 3800,230 4600,234"
          fill="none"
          stroke="#556b24"
          strokeWidth="1.2"
          opacity="0.25"
        />

        {/* 远方中景舒缓地势等高线 (Soft Natural Topographic Swale Lines) */}
        <path
          d="M-1800,280 Q-400,305 720,295 Q1800,280 3200,270"
          fill="none"
          stroke="#88ab43"
          strokeWidth="1.0"
          opacity="0.25"
        />

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
      {/* 2. 主屋庭院草台缓坡（几何规整矩形/椭圆轮廓 · 360°自然羽化融汇大地）          */}
      {/* ========================================================================= */}
      <g id="homestead-organic-meadow-grounds">
        {/* A. 外缘两重微渐变消隐层 (Multi-step soft alpha feathering into master pasture) */}
        <path d={outerFeatherPath} fill="url(#isoTerraceTurfGrad)" opacity="0.22" />
        <path d={midFeatherPath} fill="url(#isoTerraceTurfGrad)" opacity="0.45" />

        {/* B. 羽化草台主体 (Feather-masked core lawn with perfect edge blending) */}
        <g mask="url(#homesteadTerraceBlendMask)">
          <path d={terracePath} fill="url(#isoTerraceTurfGrad)" opacity="0.88" />

          {/* 阳光在庭院中央的温和漫射光斑 (Warm Dappled Sunlight across Central Lawn · 11s 超长周期呼吸律动) */}
          <ellipse
            cx="540"
            cy="460"
            rx="480"
            ry="155"
            fill="url(#lawnSunDapple)"
            className="animate-sunbeam-breathe"
            style={{ transformOrigin: '540px 460px' }}
          />
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
            { x: 380, y: 535, s: 1.15 },
            { x: 500, y: 545, s: 1.2 },
            { x: 620, y: 540, s: 1.1 },
            { x: 740, y: 520, s: 1.0 },
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
            { x: 460, y: 525, r: 26 },
            { x: 640, y: 520, r: 24 },
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
            { x: 440, y: 535, c: '#ffffff', stemH: 13, stemCurv: 3 },
            { x: 580, y: 530, c: '#facc15', stemH: 12, stemCurv: -2 },
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
      {/* 3. 东翼胶囊仓区域草地 (Clean Seamless Pasture Grounds)                    */}
      {/* ========================================================================= */}
      <g id="terrace-embedded-features" />
    </g>
  );
};
