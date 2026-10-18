import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { mountainApronPath, rollingWheatPath } from '../../../../world/scene/landscapeGeometry';

interface TerrainSurfaceProps extends YorkshireCommonProps {
  frontExtension?: number;
}

/**
 * 🏔️ MountainSilhouette (Far Low-Poly Distant Mountain Ridges, Pines & Woodlands)
 * Layer 01: FAR DISTANT BACKGROUND SILHOUETTE
 */
export const MountainSilhouette: React.FC<TerrainSurfaceProps> = ({ theme, className, frontExtension = 0 }) => {
  const ridges = React.useMemo(() => (
    <>
      {/* ------------------------------------------------------------------- */}
      {/* 1. 远景低多边形主山脉基底与分面 (Clean Low-Poly Mountain Peak Facets)  */}
      {/* ------------------------------------------------------------------- */}
      <g id="lowpoly-distant-mountains">
        {/* Mountain Base Silhouette (远山全幅贯穿低多边形折线天际线) */}
        <polygon
          points="-3200,500 -3200,160 -2400,130 -1800,170 -1200,140 -700,175 -250,150 180,135 450,172 680,122 920,165 1180,128 1450,165 1850,135 2400,170 3200,130 4200,160 4200,500"
          fill={theme.hillGreenFar}
        />

        {/* --- 独立低多边形山峰采光面与阴影面 (Faceted Origami Peaks) --- */}

        {/* Peak 1: 西侧远山 (x: -1200 to -600) */}
        <polygon points="-1200,140 -850,115 -700,175 -980,185" fill="url(#lowPolyMountainLitGrad)" opacity="0.9" />
        <polygon points="-850,115 -600,160 -700,175" fill="url(#lowPolyMountainShadeGrad)" opacity="0.85" />

        {/* Peak 2: 谷地左翼山丘 (x: -700 to 0) */}
        <polygon points="-700,175 -420,135 -250,150 -520,195" fill="url(#lowPolyMountainLitGrad)" opacity="0.88" />
        <polygon points="-420,135 -150,175 -250,150" fill="url(#lowPolyMountainShadeGrad)" opacity="0.9" />

        {/* Peak 3: 连贯自然的低多边形山丘 (Natural Faceted Low-Poly Mountain Peak) */}
        <polygon points="-150,175 180,135 120,172 -30,185" fill="url(#lowPolyMountainLitGrad)" opacity="0.9" />
        <polygon points="180,135 420,165 290,175 120,172" fill="url(#lowPolyMountainShadeGrad)" opacity="0.88" />
        <polygon points="120,172 290,175 420,165 240,178" fill="url(#lowPolyMountainShadeGrad)" opacity="0.45" />

        {/* Peak 4: 中央向阳主峰 (x: 420 to 920) */}
        <polygon points="420,165 680,122 790,155 580,190" fill="url(#lowPolyMountainLitGrad)" />
        <polygon points="680,122 880,145 920,165 790,155" fill="url(#lowPolyMountainShadeGrad)" />

        {/* Peak 5: 观星台后方东翼山脊 (x: 920 to 1450) */}
        <polygon points="920,165 1180,128 1310,155 1060,190" fill="url(#lowPolyMountainLitGrad)" />
        <polygon points="1180,128 1450,165 1310,155" fill="url(#lowPolyMountainShadeGrad)" />

        {/* Peak 6: 极东远山 (x: 1450 to 2400) */}
        <polygon points="1450,165 1850,135 2050,165 1700,195" fill="url(#lowPolyMountainLitGrad)" />
        <polygon points="1850,135 2400,170 2050,165" fill="url(#lowPolyMountainShadeGrad)" />

        {/* 远山自然山脊分水线 */}
        <line x1="-850" y1="115" x2="-700" y2="175" stroke="#7a9668" strokeWidth="1.0" opacity="0.6" />
        <line x1="-420" y1="135" x2="-250" y2="150" stroke="#7a9668" strokeWidth="1.0" opacity="0.6" />
        <line x1="-30" y1="185" x2="180" y2="135" stroke="#7a9668" strokeWidth="1.0" opacity="0.55" />
        <line x1="180" y1="135" x2="290" y2="175" stroke="#2d3f28" strokeWidth="1.0" opacity="0.45" />
        <line x1="680" y1="122" x2="790" y2="155" stroke="#2d3f28" strokeWidth="1.0" opacity="0.5" />
        <line x1="1180" y1="128" x2="1310" y2="155" stroke="#2d3f28" strokeWidth="1.0" opacity="0.5" />
      </g>

      {/* ------------------------------------------------------------------- */}
      {/* 2. 远景空气透视低多边形薄雾层 (Atmospheric Planar Haze)               */}
      {/* ------------------------------------------------------------------- */}
      <polygon
        points="-3200,215 -1800,185 -900,210 0,180 800,205 1600,185 2800,210 4200,195 4200,320 -3200,320"
        fill={theme.skyBottom}
        opacity="0.30"
      />
    </>
  ), [theme]);

  const apron = (
    <>
      {/* ------------------------------------------------------------------- */}
      {/* 3. 远山与中景麦田自然交融山麓裙带 (Foothill Mountain-to-Wheat Apron Band) */}
      {/* ------------------------------------------------------------------- */}
      <g id="foothill-mountain-wheat-apron">
        <path
          d={mountainApronPath(frontExtension)}
          fill="url(#mountainWheatApronGrad)"
          opacity="0.95"
        />
        <path
          d="M -900,180 C -650,195 -450,230 -350,245 C -550,250 -750,235 -950,210 Z"
          fill="#5f784e"
          opacity="0.45"
        />
        <path
          d="M 220,175 C 350,195 480,225 560,240 C 420,245 300,230 200,200 Z"
          fill="#5a734a"
          opacity="0.4"
        />
        <path
          d="M 850,170 C 1020,190 1180,220 1260,238 C 1120,245 980,230 840,195 Z"
          fill="#5f774e"
          opacity="0.42"
        />
      </g>
    </>
  );

  const landmarks = React.useMemo(() => (
    <>
      {/* ------------------------------------------------------------------- */}
      {/* 4. 远方微型低多边形农舍剪影 (Distant Low-Poly Farmsteads)             */}
      {/* ------------------------------------------------------------------- */}
      <g transform="translate(740, 158)">
        <polygon points="0,10 16,10 16,18 0,18" fill="#f8fafc" />
        <polygon points="-2,10 8,2 18,10" fill="#a84e34" />
      </g>
      <g transform="translate(1120, 142)">
        <polygon points="0,8 14,8 14,15 0,15" fill="#f8fafc" />
        <polygon points="-2,8 7,1 16,8" fill="#a84e34" />
      </g>

      {/* ------------------------------------------------------------------- */}
      {/* 5. 棱角分明的低多边形赤松剪影 (Low-Poly Prismatic Pines on Crests)   */}
      {/* ------------------------------------------------------------------- */}
      <g id="lowpoly-crest-pines" opacity="0.85">
        {[
          { x: 800, y: 172, scale: 0.9 },
          { x: 840, y: 165, scale: 1.1 },
          { x: 960, y: 160, scale: 1.0 },
          { x: 1010, y: 155, scale: 0.8 },
          { x: -350, y: 178, scale: 0.85 },
          { x: -180, y: 185, scale: 0.95 },
        ].map((p, idx) => (
          <g key={`lpp-${idx}`} transform={`translate(${p.x}, ${p.y}) scale(${p.scale})`}>
            <polygon points="-1,6 1,6 1,12 -1,12" fill="#291e17" />
            <polygon points="0,-16 -6,6 0,6" fill="#325232" />
            <polygon points="0,-16 0,6 6,6" fill="#1e341e" />
          </g>
        ))}
      </g>

      {/* ------------------------------------------------------------------- */}
      {/* 6. 生态斑块分布的山麓植被群落 (Natural Clustered Foothill Woodlands)     */}
      {/* ------------------------------------------------------------------- */}
      <g id="lowpoly-foothill-woodlands" opacity="0.95">
        <g id="west-foothill-trees">
          <ellipse cx="-860" cy="186" rx="90" ry="8" fill="#101c12" opacity="0.4" />
          <ellipse cx="-640" cy="188" rx="80" ry="7" fill="#101c12" opacity="0.38" />
          <ellipse cx="-420" cy="200" rx="70" ry="7" fill="#101c12" opacity="0.35" />
          {[
            { x: -940, y: 178, s: 1.25, type: 'pine', lit: '#25442b', shd: '#152b1b' },
            { x: -890, y: 175, s: 1.35, type: 'pine', lit: '#2a4c30', shd: '#193320' },
            { x: -820, y: 177, s: 1.15, type: 'copse', lit: '#33583c', shd: '#1a3321' },
            { x: -740, y: 180, s: 1.3, type: 'pine', lit: '#27472d', shd: '#172f1d' },
            { x: -660, y: 181, s: 1.2, type: 'copse', lit: '#35603e', shd: '#1d3823' },
            { x: -580, y: 184, s: 1.3, type: 'pine', lit: '#25432a', shd: '#152b1a' },
            { x: -500, y: 188, s: 1.15, type: 'copse', lit: '#366240', shd: '#1d3724' },
            { x: -420, y: 191, s: 1.25, type: 'pine', lit: '#28482f', shd: '#162e1e' },
            { x: -915, y: 188, s: 0.95, type: 'shrub', lit: '#3d6342', shd: '#1c3620' },
            { x: -860, y: 186, s: 1.1, type: 'copse', lit: '#35603e', shd: '#1c3622' },
            { x: -780, y: 189, s: 0.9, type: 'shrub', lit: '#3e6a45', shd: '#203c24' },
            { x: -700, y: 187, s: 1.05, type: 'copse', lit: '#305638', shd: '#1b3421' },
            { x: -620, y: 192, s: 0.95, type: 'shrub', lit: '#3e6945', shd: '#223d26' },
            { x: -540, y: 195, s: 1.1, type: 'copse', lit: '#335c3c', shd: '#1c3622' },
            { x: -460, y: 198, s: 0.9, type: 'shrub', lit: '#396340', shd: '#1e3823' },
            { x: -370, y: 202, s: 1.0, type: 'pine', lit: '#234027', shd: '#132818' },
            { x: -300, y: 206, s: 0.85, type: 'shrub', lit: '#396340', shd: '#1e3823' },
          ].map((t, idx) => (
            <g key={`wft-${idx}`} transform={`translate(${t.x}, ${t.y}) scale(${t.s})`}>
              <polygon points="-1,3 1,3 1,9 -1,9" fill="#1e150f" />
              {t.type === 'pine' ? (
                <g>
                  <polygon points="0,-16 -6,4 0,4" fill={t.lit} />
                  <polygon points="0,-16 0,4 6,4" fill={t.shd} />
                  <polygon points="0,-19 -4.5,-3 0,-3" fill="#325b3a" />
                  <polygon points="0,-19 0,-3 4.5,-3" fill="#1e3a24" />
                </g>
              ) : t.type === 'copse' ? (
                <g>
                  <ellipse cx="-2.5" cy="-3" rx="7.5" ry="6" fill={t.lit} />
                  <ellipse cx="2.5" cy="-2" rx="6.5" ry="5.5" fill={t.shd} />
                  <ellipse cx="0" cy="-7" rx="6.8" ry="5.5" fill={t.lit} />
                  <ellipse cx="-1" cy="-8.5" rx="5" ry="3.5" fill="#42704a" opacity="0.8" />
                </g>
              ) : (
                <g>
                  <ellipse cx="-3" cy="-1.5" rx="5.5" ry="4" fill={t.lit} />
                  <ellipse cx="3" cy="-1" rx="5" ry="3.8" fill={t.shd} />
                  <ellipse cx="0" cy="-3.5" rx="4.8" ry="3.5" fill="#46754d" opacity="0.85" />
                </g>
              )}
            </g>
          ))}
        </g>

        <g id="mid-foothill-trees">
          <ellipse cx="290" cy="164" rx="42" ry="5" fill="#101c12" opacity="0.25" />
          <ellipse cx="370" cy="166" rx="46" ry="5" fill="#101c12" opacity="0.25" />
          {[
            { x: 125, y: 162, s: 0.75, type: 'shrub', lit: '#3d6743', shd: '#203924' },
            { x: 160, y: 154, s: 0.8, type: 'shrub', lit: '#355e3b', shd: '#1c3620' },
            { x: 245, y: 158, s: 1.15, type: 'pine', lit: '#25442b', shd: '#152b1b' },
            { x: 275, y: 154, s: 1.25, type: 'copse', lit: '#35603e', shd: '#1d3823' },
            { x: 305, y: 162, s: 1.3, type: 'pine', lit: '#28482f', shd: '#17301f' },
            { x: 335, y: 156, s: 1.1, type: 'copse', lit: '#32583a', shd: '#1b3421' },
            { x: 365, y: 164, s: 1.25, type: 'pine', lit: '#244128', shd: '#142918' },
            { x: 395, y: 160, s: 1.05, type: 'shrub', lit: '#3d6743', shd: '#203924' },
            { x: 425, y: 166, s: 1.2, type: 'copse', lit: '#345e3c', shd: '#1c3622' },
            { x: 460, y: 168, s: 0.95, type: 'shrub', lit: '#396340', shd: '#1e3823' },
          ].map((t, idx) => (
            <g key={`mft-${idx}`} transform={`translate(${t.x}, ${t.y}) scale(${t.s})`}>
              <polygon points="-1,3 1,3 1,9 -1,9" fill="#1e150f" />
              {t.type === 'pine' ? (
                <g>
                  <polygon points="0,-15 -5.5,4 0,4" fill={t.lit} />
                  <polygon points="0,-15 0,4 5.5,4" fill={t.shd} />
                  <polygon points="0,-18 -4,-3 0,-3" fill="#325b3a" />
                  <polygon points="0,-18 0,-3 4,-3" fill="#1e3a24" />
                </g>
              ) : t.type === 'copse' ? (
                <g>
                  <ellipse cx="-2.5" cy="-3" rx="7.5" ry="6" fill={t.lit} />
                  <ellipse cx="2.5" cy="-2" rx="6.5" ry="5.5" fill={t.shd} />
                  <ellipse cx="0" cy="-7" rx="6.8" ry="5.5" fill={t.lit} />
                  <ellipse cx="-1" cy="-8.5" rx="5" ry="3.5" fill="#44734d" opacity="0.8" />
                </g>
              ) : (
                <g>
                  <ellipse cx="-3" cy="-1.5" rx="5.5" ry="4" fill={t.lit} />
                  <ellipse cx="3" cy="-1" rx="5" ry="3.8" fill={t.shd} />
                  <ellipse cx="0" cy="-3.5" rx="4.8" ry="3.5" fill="#46754d" opacity="0.85" />
                </g>
              )}
            </g>
          ))}
        </g>

        <g id="east-foothill-trees">
          <ellipse cx="735" cy="158" rx="45" ry="5" fill="#101c12" opacity="0.25" />
          <ellipse cx="945" cy="156" rx="40" ry="5" fill="#101c12" opacity="0.25" />
          <ellipse cx="1145" cy="144" rx="45" ry="5" fill="#101c12" opacity="0.25" />
          <ellipse cx="1340" cy="158" rx="35" ry="5" fill="#101c12" opacity="0.22" />
          {[
            { x: 705, y: 154, s: 1.25, type: 'copse', lit: '#35603e', shd: '#1d3823' },
            { x: 730, y: 150, s: 1.35, type: 'pine', lit: '#244128', shd: '#142918' },
            { x: 765, y: 155, s: 1.15, type: 'copse', lit: '#315739', shd: '#1a3321' },
            { x: 790, y: 158, s: 0.9, type: 'shrub', lit: '#3d6743', shd: '#203924' },
            { x: 925, y: 154, s: 1.25, type: 'pine', lit: '#28482f', shd: '#17301f' },
            { x: 955, y: 158, s: 1.15, type: 'copse', lit: '#2f5436', shd: '#19311f' },
            { x: 985, y: 152, s: 1.2, type: 'pine', lit: '#25432a', shd: '#152b1a' },
            { x: 1085, y: 142, s: 1.2, type: 'copse', lit: '#335b3a', shd: '#1b3420' },
            { x: 1110, y: 138, s: 1.3, type: 'pine', lit: '#27462c', shd: '#162d1c' },
            { x: 1150, y: 144, s: 1.15, type: 'copse', lit: '#305537', shd: '#1a3320' },
            { x: 1175, y: 140, s: 1.25, type: 'pine', lit: '#234027', shd: '#132818' },
            { x: 1320, y: 156, s: 1.15, type: 'pine', lit: '#25432a', shd: '#152b1a' },
            { x: 1350, y: 160, s: 1.0, type: 'copse', lit: '#325838', shd: '#19311f' },
            { x: 1375, y: 154, s: 1.1, type: 'pine', lit: '#234027', shd: '#132818' },
          ].map((t, idx) => (
            <g key={`eft-${idx}`} transform={`translate(${t.x}, ${t.y}) scale(${t.s})`}>
              <polygon points="-1,3 1,3 1,9 -1,9" fill="#1e150f" />
              {t.type === 'pine' ? (
                <g>
                  <polygon points="0,-16 -5.5,4 0,4" fill={t.lit} />
                  <polygon points="0,-16 0,4 5.5,4" fill={t.shd} />
                  <polygon points="0,-19 -4,-3 0,-3" fill="#325b3a" />
                  <polygon points="0,-19 0,-3 4,-3" fill="#1e3a24" />
                </g>
              ) : t.type === 'copse' ? (
                <g>
                  <ellipse cx="-2.5" cy="-3" rx="7.5" ry="6" fill={t.lit} />
                  <ellipse cx="2.5" cy="-2" rx="6.5" ry="5.5" fill={t.shd} />
                  <ellipse cx="0" cy="-7" rx="6.8" ry="5.5" fill={t.lit} />
                  <ellipse cx="-1" cy="-8.5" rx="5" ry="3.5" fill="#44734d" opacity="0.8" />
                </g>
              ) : (
                <g>
                  <ellipse cx="-3" cy="-1.5" rx="5.5" ry="4" fill={t.lit} />
                  <ellipse cx="3" cy="-1" rx="5" ry="3.8" fill={t.shd} />
                  <ellipse cx="0" cy="-3.5" rx="4.8" ry="3.5" fill="#46754d" opacity="0.85" />
                </g>
              )}
            </g>
          ))}
        </g>
      </g>
    </>
  ), []);
  return <g id="yorkshire-mountain-silhouette" className={className}>{ridges}{apron}{landmarks}</g>;
};

/**
 * 🌾 RollingWheatSilhouette (Midground Rolling Pastoral Wheat Hillside)
 * Layer 02: MIDGROUND ROLLING WHEAT FIELDS
 */
export const RollingWheatSilhouette = React.memo(function RollingWheatSilhouetteAsset({ className, frontExtension = 0 }: TerrainSurfaceProps) {
  const surfacePath = rollingWheatPath(frontExtension);

  return (
    <g id="yorkshire-wheat-silhouette" className={className}>
      <defs>
        <pattern id="wheatPattern" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45 0 0)">
          <line x1="0" y1="0" x2="0" y2="16" stroke="#fef08a" strokeWidth="1.0" opacity="0.45" />
          <line x1="8" y1="0" x2="8" y2="16" stroke="#ca8a04" strokeWidth="0.6" opacity="0.25" />
        </pattern>
      </defs>

      {/* ------------------------------------------------------------------- */}
      {/* 宏阔连贯的自然远景平原麦田 (Vast Continuous Pastoral Flat Wheat Plain) */}
      {/* ------------------------------------------------------------------- */}
      <g id="organic-rolling-wheat-fields">
        {/* ================================================================= */}
        {/* A. 广阔连绵的自然平原麦田主平面 (Master Continuous Flat Wheat Plain Ground) */}
        {/* 关键：必须是首个 path 节点以保证视差边界几何采样测试无缝通过           */}
        {/* ================================================================= */}
        <path
          d={surfacePath}
          fill="url(#pastoralRollingWheatGrad)"
        />

        {/* 细密亚光麦穗颗粒织理 (Fine Matte Wheat Granular Texture) */}
        <path
          d={surfacePath}
          fill="url(#wheatPattern)"
          opacity="0.08"
        />

        {/* 远端山麓微光天光柔和反照 (Soft Atmospheric Sunlit Glaze across Plain) */}
        <path
          d={surfacePath}
          fill="url(#sunlitWheatCrestGrad)"
        />

        {/* ================================================================= */}
        {/* B. 平原自然纵深透视机耕垄痕 (Subtle 2.5D Aerial Tramlines & Furrow Perspective) */}
        {/*    沿 2.5D 视轴微微延伸，近疏远密，赋予平坦地表逼真的纵深空间而非横向断层 */}
        {/* ================================================================= */}
        <g id="flat-wheat-tramlines" opacity="0.14">
          {[
            { x1: -2600, y1: 215, x2: -2350, y2: 375 },
            { x1: -1900, y1: 220, x2: -1600, y2: 375 },
            { x1: -1200, y1: 210, x2: -880, y2: 375 },
            { x1: -500, y1: 205, x2: -150, y2: 380 },
            { x1: 200, y1: 200, x2: 580, y2: 370 },
            { x1: 900, y1: 190, x2: 1320, y2: 375 },
            { x1: 1600, y1: 192, x2: 2050, y2: 380 },
            { x1: 2300, y1: 195, x2: 2800, y2: 375 },
            { x1: 3000, y1: 198, x2: 3550, y2: 380 },
          ].map((line, idx) => (
            <line
              key={`ftl-${idx}`}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="#6b4c16"
              strokeWidth="0.8"
              strokeDasharray="14 7"
            />
          ))}
        </g>

        {/* ================================================================= */}
        {/* 🌾 C. 舒缓麦浪随风漫射律动 (Gentle Wind Shimmer Waves across Plain)  */}
        {/* ================================================================= */}
        <g id="wheat-wind-waves" className="pointer-events-none" opacity="0.22">
          <path
            className="animate-wheat-wave"
            d="M -200,265 C 200,248 600,258 1150,270 C 800,285 400,280 -160,295 Z"
            fill="#fff9db"
            style={{ animationDelay: '0s' }}
          />
          <path
            className="animate-wheat-wave"
            d="M -700,230 C -200,215 300,230 850,218 C 500,235 50,228 -600,242 Z"
            fill="#fefce8"
            style={{ animationDelay: '3.6s' }}
          />
          <path
            className="animate-wheat-wave"
            d="M 1200,240 C 1600,228 2100,242 2600,232 C 2200,252 1700,245 1150,260 Z"
            fill="#fff9db"
            style={{ animationDelay: '1.8s' }}
          />
        </g>

        {/* ================================================================= */}
        {/* 🌾 D. 纵深透视阶梯草垛群 (Graduated Perspective Hay Bales · 近大远小)   */}
        {/*    以自然尺标建立平原向远方的宏阔纵深透视，前大后小，错落有致           */}
        {/* ================================================================= */}
        <g id="perspective-hay-bales">
          {[
            // 1. 远景小草垛 (Distant Tiny Bales · y: 210~224, scale: 0.48~0.56, 随空气透视淡化)
            { x: -1150, y: 214, scale: 0.50, opacity: 0.76 },
            { x: -760,  y: 220, scale: 0.56, opacity: 0.80 },
            { x: 380,   y: 210, scale: 0.52, opacity: 0.80 },
            { x: 740,   y: 218, scale: 0.54, opacity: 0.82 },
            { x: 1080,  y: 212, scale: 0.50, opacity: 0.78 },
            { x: 1750,  y: 217, scale: 0.52, opacity: 0.80 },
            { x: 2300,  y: 224, scale: 0.48, opacity: 0.75 },

            // 2. 中景中等草垛 (Midground Medium Bales · y: 252~270, scale: 0.78~0.88)
            { x: -580,  y: 262, scale: 0.82, opacity: 0.92 },
            { x: -210,  y: 257, scale: 0.85, opacity: 0.95 },
            { x: 190,   y: 252, scale: 0.78, opacity: 0.90 },
            { x: 620,   y: 267, scale: 0.82, opacity: 0.92 },
            { x: 1220,  y: 260, scale: 0.86, opacity: 0.95 },
            { x: 1580,  y: 270, scale: 0.80, opacity: 0.92 },

            // 3. 近景饱满大草垛 (Foreground Near Bales · y: 312~327, scale: 1.08~1.15, 清晰扎实)
            { x: -440,  y: 317, scale: 1.15, opacity: 1.0 },
            { x: 880,   y: 322, scale: 1.10, opacity: 1.0 },
            { x: 1420,  y: 312, scale: 1.08, opacity: 1.0 },
            { x: 1960,  y: 327, scale: 1.12, opacity: 1.0 },
          ].map((bale, idx) => (
            <g key={`hb-${idx}`} transform={`translate(${bale.x}, ${bale.y}) scale(${bale.scale})`} opacity={bale.opacity}>
              {/* 接触地面柔和投影 */}
              <ellipse cx="0" cy="11.5" rx="15" ry="5.5" fill="#4d3a14" opacity="0.32" />
              {/* 圆柱形草垛立面桶身 */}
              <ellipse cx="0" cy="10" rx="13" ry="7.5" fill="#c99f2e" />
              <rect x="-13" y="0" width="26" height="10" fill="#dfb33b" />
              {/* 草垛顶面受光圆盘 */}
              <ellipse cx="0" cy="0" rx="13" ry="6.2" fill="#f4d45d" stroke="#b88b20" strokeWidth="0.75" />
              {/* 捆扎麻绳线痕 */}
              <line x1="-7" y1="0" x2="-7" y2="10" stroke="#784e11" strokeWidth="0.8" strokeDasharray="3,1" />
              <line x1="7" y1="0" x2="7" y2="10" stroke="#784e11" strokeWidth="0.8" strokeDasharray="3,1" />
              {/* 顶面卷曲麦草同心纹 */}
              <circle cx="0" cy="0" r="3.8" fill="none" stroke="#b88b20" strokeWidth="0.7" strokeDasharray="3,2" />
              {/* 边缘散落的松散金黄麦秸 */}
              <path d="M-13,6 Q-17,8 -19,11 M11,4 Q15,6 17,9" stroke="#f4d45d" strokeWidth="0.65" fill="none" />
            </g>
          ))}
        </g>

        {/* ================================================================= */}
        {/* 🌾 E. 地头边界金黄麦穗微风轻摇簇 (Field Margin Wheat Tufts)        */}
        {/* ================================================================= */}
        <g id="terrace-wheat-tufts" opacity="0.85">
          {[
            { x: -320, y: 275, s: 0.9, d: '0.2s' },
            { x: -160, y: 282, s: 1.1, d: '1.1s' },
            { x: 120, y: 268, s: 1.0, d: '2.3s' },
            { x: 380, y: 260, s: 1.2, d: '0.8s' },
            { x: 620, y: 256, s: 0.95, d: '1.9s' },
            { x: 890, y: 264, s: 1.15, d: '2.7s' },
            { x: 1140, y: 272, s: 1.05, d: '0.5s' },
            { x: 1460, y: 274, s: 0.9, d: '1.4s' },
            { x: 1820, y: 266, s: 1.1, d: '2.1s' },
          ].map((wt, i) => (
            <g key={`wt-${i}`} transform={`translate(${wt.x}, ${wt.y}) scale(${wt.s})`}>
              <g className="animate-wheat-tuft" style={{ animationDelay: wt.d }}>
                <path d="M0,0 Q-1,-6 -2,-10 M0,0 Q1,-6 2,-11 M0,0 Q0,-7 0,-13" stroke="#8c6a28" strokeWidth="0.8" fill="none" />
                <ellipse cx="-2" cy="-10" rx="1.3" ry="2.2" fill="#d5b048" transform="rotate(-15 -2 -10)" />
                <ellipse cx="2" cy="-11" rx="1.3" ry="2.2" fill="#d5b048" transform="rotate(15 2 -11)" />
                <ellipse cx="0" cy="-13" rx="1.4" ry="2.4" fill="#e8c45a" />
                <line x1="-2" y1="-12" x2="-3.5" y2="-15" stroke="#92691b" strokeWidth="0.5" />
                <line x1="2" y1="-13" x2="3.5" y2="-16" stroke="#92691b" strokeWidth="0.5" />
                <line x1="0" y1="-15" x2="0" y2="-18" stroke="#92691b" strokeWidth="0.5" />
              </g>
            </g>
          ))}
        </g>
      </g>
    </g>
  );
});

/**
 * Composite TerrainSilhouette retaining full backward compatibility
 */
export const TerrainSilhouette: React.FC<YorkshireCommonProps> = ({ theme, className }) => {
  return (
    <g id="yorkshire-terrain-silhouette" className={className}>
      <MountainSilhouette theme={theme} />
      <RollingWheatSilhouette theme={theme} />
    </g>
  );
};
