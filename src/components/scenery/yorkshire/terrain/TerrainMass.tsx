import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';

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
export const TerrainMass: React.FC<YorkshireCommonProps> = ({ className }) => {
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
      {/* ========================================================================= */}
      <g id="master-axonometric-ground-plane">
        {/* 严格衔接中远景麦田底边 (Y: 175~235) 的 2.5D 轴测草坪大地，草地范围大于主屋草台(Y: 215) */}
        <polygon
          points="-4000,210 -3200,210 -1800,195 -700,200 100,190 900,175 1600,195 2600,205 4200,235 6000,235 6000,2600 -4000,2600"
          fill="url(#isoGroundPastureGrad)"
        />

        {/* 麦田与草甸交界处 2.5D 轴测坡地柔和光影过渡线 */}
        <path
          d="M-3200,210 L-1800,195 L-700,200 L100,190 L900,175 L1600,195 L2600,205 L4200,235"
          fill="none"
          stroke="#9dc252"
          strokeWidth="1.6"
          opacity="0.4"
        />

        {/* 远方中景舒缓地势等高线 (Soft Natural Topographic Swale Lines) */}
        <path
          d="M-1800,280 Q-400,305 720,295 Q1800,280 3200,270"
          fill="none"
          stroke="#88ab43"
          strokeWidth="1.0"
          opacity="0.25"
        />
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
        {/* 1) 主大木屋底部深层接地阴影 */}
        <ellipse cx="540" cy="375" rx="310" ry="100" fill="url(#cottageGroundAOGrad)" />
        {/* 2) 西翼安睡小木屋底部接地阴影 */}
        <ellipse cx="210" cy="400" rx="115" ry="42" fill="url(#cottageGroundAOGrad)" opacity="0.75" />
        {/* 3) 东翼胶囊仓廊架底部接地阴影 */}
        <ellipse cx="880" cy="385" rx="135" ry="48" fill="url(#cottageGroundAOGrad)" opacity="0.75" />

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
      {/* 3. 东翼胶囊仓基岩与木栈道质朴挡土矮墙 (Bedrock & Retaining Ledge)           */}
      {/* ========================================================================= */}
      <g id="terrace-embedded-features">
        {/* 胶囊仓天然基岩支座 (Capsule Pod Ground Bedrock Plinth) */}
        <g id="capsule-pod-ground-bedrock" transform="translate(894, 320)">
          <polygon points="-75,44 0,32 75,44 0,58" fill="#58635a" stroke="#373e38" strokeWidth="1.2" />
          <polygon points="-75,44 0,58 0,66 -75,52" fill="#2b322c" />
          <polygon points="0,58 75,44 75,52 0,66" fill="#3c463e" />
          <polygon points="-52,43 -32,43 -42,48" fill="#4a6344" />
          <polygon points="26,45 48,45 38,50" fill="#4a6344" />
        </g>

        {/* 木栈道石砌挡土矮墙 (Terraced Stone Retaining Ledges) */}
        <g id="boardwalk-retaining-terrace" transform="translate(-36, 0)">
          <polygon points="796,368 912,372 908,388 792,384" fill="url(#stoneWallFaceGrad)" stroke="#2d261e" strokeWidth="0.8" />
          <polygon points="796,368 912,372 914,375 798,371" fill="url(#stoneWallCapGrad)" />
          <line x1="825" y1="369" x2="823" y2="385" stroke="#1d1712" strokeWidth="0.8" />
          <line x1="855" y1="370" x2="853" y2="386" stroke="#1d1712" strokeWidth="0.8" />
          <line x1="885" y1="371" x2="883" y2="387" stroke="#1d1712" strokeWidth="0.8" />
        </g>
      </g>
    </g>
  );
};
