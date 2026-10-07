import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';

/**
 * 🏔️ TerrainSilhouette (Distant Mountain Ridges, Silhouettes & Horizons)
 *
 * Layer: 01 TERRAIN SILHOUETTE
 * Complete Low-Poly Refactor:
 * - Geometric faceted origami mountain peaks replacing all wavy Bezier splines
 * - Crisp triangular & quadrilateral light/shadow facet pairs
 * - Planar low-poly golden wheat steps & fell fields
 * - Seamless integration with mountain tunnel portal entrance
 */
export const TerrainSilhouette: React.FC<YorkshireCommonProps> = ({ theme, className }) => {
  return (
    <g id="yorkshire-terrain-silhouette" className={className}>
      <defs>
        <pattern id="wheatPattern" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45 0 0)">
          <line x1="0" y1="0" x2="0" y2="16" stroke="#fef08a" strokeWidth="1.2" opacity="0.65" />
          <line x1="8" y1="0" x2="8" y2="16" stroke="#ca8a04" strokeWidth="0.8" opacity="0.4" />
        </pattern>
      </defs>

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

        {/* Peak 3: 穿山隧道依托的东侧主山体 (x: 52 to 420) - 严格与隧道口(x=52..86)及桥台正交咬合 */}
        {/* 隧道正上方迎光山体面 (从隧道门楼左柱顶x=52, y=160与桥梁标高y=182.5平顺升起至主峰x=200, y=118) */}
        <polygon points="52,182.5 52,160 76,147 200,118 260,185" fill="url(#lowPolyMountainLitGrad)" />
        {/* 山峰背光阴影面 (向东侧倾斜延伸) */}
        <polygon points="200,118 360,145 420,165 260,185" fill="url(#lowPolyMountainShadeGrad)" />
        {/* 隧道口右侧与上方立体基岩包裹面 (精准贴合隧道右侧壁x=86, y=150..182.5，消除遮挡与悬空) */}
        <polygon points="76,147 86,150 86,182.5 260,185 200,118" fill="#4a5f3f" opacity="0.45" />

        {/* Peak 4: 中央向阳主峰 (x: 420 to 920) */}
        <polygon points="420,165 680,122 790,155 580,190" fill="url(#lowPolyMountainLitGrad)" />
        <polygon points="680,122 880,145 920,165 790,155" fill="url(#lowPolyMountainShadeGrad)" />

        {/* Peak 5: 观星台后方东翼山脊 (x: 920 to 1450) */}
        <polygon points="920,165 1180,128 1310,155 1060,190" fill="url(#lowPolyMountainLitGrad)" />
        <polygon points="1180,128 1450,165 1310,155" fill="url(#lowPolyMountainShadeGrad)" />

        {/* Peak 6: 极东远山 (x: 1450 to 2400) */}
        <polygon points="1450,165 1850,135 2050,165 1700,195" fill="url(#lowPolyMountainLitGrad)" />
        <polygon points="1850,135 2400,170 2050,165" fill="url(#lowPolyMountainShadeGrad)" />

        {/* 远山棱角山脊微光线 (Low-Poly Crisp Ridge Highlight Edges) */}
        <line x1="-850" y1="115" x2="-700" y2="175" stroke="#a4be96" strokeWidth="1.2" opacity="0.75" />
        <line x1="-420" y1="135" x2="-250" y2="150" stroke="#a4be96" strokeWidth="1.2" opacity="0.75" />
        {/* 隧道右后方主山脊棱角线 (从隧道门楼顶x=76,y=147向东北主峰x=200,y=118延伸) */}
        <line x1="76" y1="147" x2="200" y2="118" stroke="#a4be96" strokeWidth="1.4" opacity="0.85" />
        <line x1="200" y1="118" x2="360" y2="145" stroke="#364930" strokeWidth="1.2" opacity="0.6" />
        <line x1="680" y1="122" x2="790" y2="155" stroke="#364930" strokeWidth="1.2" opacity="0.6" />
        <line x1="1180" y1="128" x2="1310" y2="155" stroke="#364930" strokeWidth="1.2" opacity="0.6" />
      </g>

      {/* ------------------------------------------------------------------- */}
      {/* 2. 远景空气透视低多边形薄雾层 (Atmospheric Planar Haze)               */}
      {/* ------------------------------------------------------------------- */}
      <polygon
        points="-3200,215 -1800,185 -900,210 0,180 800,205 1600,185 2800,210 4200,195 4200,320 -3200,320"
        fill={theme.skyBottom}
        opacity="0.30"
      />

      {/* ------------------------------------------------------------------- */}
      {/* 3. 中远景低多边形金色麦田台面 (Low-Poly Stepped Wheat Facets)         */}
      {/* ------------------------------------------------------------------- */}
      <g id="lowpoly-wheat-terraces">
        {/* 阶梯式平整麦田台面 (Flat planar low-poly facets, no wavy curves) */}
        <polygon
          points="-3200,225 -1600,210 -800,235 -200,205 380,225 960,200 1550,225 2400,210 4200,230 4200,350 2600,320 1600,310 900,290 100,305 -700,315 -1800,310 -3200,325"
          fill="url(#lowPolyWheatLitGrad)"
        />
        <polygon
          points="-3200,225 -1600,210 -800,235 -200,205 380,225 960,200 1550,225 2400,210 4200,230 4200,350 2600,320 1600,310 900,290 100,305 -700,315 -1800,310 -3200,325"
          fill="url(#wheatPattern)"
          opacity="0.14"
        />

        {/* 麦田背光斜切面 (Faceted Terrace Drop Shades) */}
        <polygon points="-800,235 100,305 380,225 -200,205" fill="url(#lowPolyWheatShadeGrad)" opacity="0.6" />
        <polygon points="960,200 900,290 1600,310 1550,225" fill="url(#lowPolyWheatShadeGrad)" opacity="0.6" />

        {/* 麦田棱角分界线 */}
        <line x1="-1600" y1="210" x2="-800" y2="235" stroke="#f6e08c" strokeWidth="1.2" opacity="0.75" />
        <line x1="-200" y1="205" x2="380" y2="225" stroke="#f6e08c" strokeWidth="1.2" opacity="0.75" />
        <line x1="960" y1="200" x2="1550" y2="225" stroke="#f6e08c" strokeWidth="1.2" opacity="0.75" />
      </g>

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
            {/* 树干 */}
            <polygon points="-1,6 1,6 1,12 -1,12" fill="#291e17" />
            {/* 受光面三棱锥 */}
            <polygon points="0,-16 -6,6 0,6" fill="#325232" />
            {/* 背光面三棱锥 */}
            <polygon points="0,-16 0,6 6,6" fill="#1e341e" />
          </g>
        ))}
      </g>

      {/* ------------------------------------------------------------------- */}
      {/* 6. 背景山丘脚下与褶皱深色小树林群落 (Distant Foothill Woodland & Forest Strips) */}
      {/*    在深绿远山与浅绿麦田/草地过渡带植入深色调小树林，大幅拉开纵深感与层次 */}
      {/* ------------------------------------------------------------------- */}
      <g id="lowpoly-foothill-woodlands" opacity="0.94">
        {/* 西侧远山脚与褶皱带林冠群落 (West Foothills & Valley Folds: x: -950 ~ -300) */}
        <g id="west-foothill-trees">
          {/* 树林底部深色土壤阴影带 */}
          <polygon points="-980,192 -680,182 -420,198 -240,210 -240,218 -420,205 -680,190 -980,198" fill="#122014" opacity="0.45" />
          
          {[
            { x: -940, y: 184, s: 0.85, type: 'copse' },
            { x: -910, y: 180, s: 1.1, type: 'pine' },
            { x: -880, y: 182, s: 0.95, type: 'copse' },
            { x: -850, y: 178, s: 1.2, type: 'pine' },
            { x: -820, y: 180, s: 0.9, type: 'copse' },
            { x: -760, y: 185, s: 1.0, type: 'pine' },
            { x: -720, y: 182, s: 1.15, type: 'copse' },
            { x: -680, y: 179, s: 1.25, type: 'pine' },
            { x: -640, y: 184, s: 0.9, type: 'copse' },
            { x: -580, y: 188, s: 1.05, type: 'pine' },
            { x: -540, y: 192, s: 1.2, type: 'copse' },
            { x: -490, y: 190, s: 1.0, type: 'pine' },
            { x: -440, y: 195, s: 1.15, type: 'copse' },
            { x: -390, y: 198, s: 0.95, type: 'pine' },
            { x: -340, y: 202, s: 1.1, type: 'copse' },
            { x: -280, y: 206, s: 1.0, type: 'pine' },
          ].map((t, idx) => (
            <g key={`wft-${idx}`} transform={`translate(${t.x}, ${t.y}) scale(${t.s})`}>
              {/* 树干 */}
              <polygon points="-1,3 1,3 1,8 -1,8" fill="#241a13" />
              {t.type === 'pine' ? (
                /* 深色低多边形冷杉/赤松 */
                <g>
                  <polygon points="0,-15 -5,4 0,4" fill="#213d26" />
                  <polygon points="0,-15 0,4 5,4" fill="#152819" />
                  <polygon points="0,-18 -4,-4 0,-4" fill="#2a4c30" />
                  <polygon points="0,-18 0,-4 4,-4" fill="#1b3320" />
                  <line x1="0" y1="-18" x2="-4" y2="-4" stroke="#46734e" strokeWidth="0.6" opacity="0.6" />
                </g>
              ) : (
                /* 深色圆冠林/阔叶灌木群 */
                <g>
                  <ellipse cx="-2" cy="-3" rx="7" ry="5.5" fill="#1e3722" />
                  <ellipse cx="2" cy="-2" rx="6" ry="5" fill="#15291a" />
                  <ellipse cx="0" cy="-6" rx="6.5" ry="5" fill="#294a2f" />
                  <ellipse cx="-1" cy="-7.5" rx="4.5" ry="3.2" fill="#396340" opacity="0.8" />
                </g>
              )}
            </g>
          ))}
        </g>

        {/* 穿山隧道东侧山麓与麦田交界树林带 (Tunnel East Foothills: x: 180 ~ 580) */}
        <g id="mid-foothill-trees">
          <polygon points="170,195 380,210 580,198 580,206 380,218 170,202" fill="#122014" opacity="0.4" />
          {[
            { x: 190, y: 192, s: 0.95, type: 'pine' },
            { x: 225, y: 194, s: 1.1, type: 'copse' },
            { x: 260, y: 198, s: 1.25, type: 'pine' },
            { x: 295, y: 202, s: 1.0, type: 'copse' },
            { x: 335, y: 204, s: 1.15, type: 'pine' },
            { x: 375, y: 206, s: 0.9, type: 'copse' },
            { x: 420, y: 202, s: 1.2, type: 'pine' },
            { x: 465, y: 198, s: 1.05, type: 'copse' },
            { x: 510, y: 195, s: 1.15, type: 'pine' },
            { x: 555, y: 192, s: 0.95, type: 'copse' },
          ].map((t, idx) => (
            <g key={`mft-${idx}`} transform={`translate(${t.x}, ${t.y}) scale(${t.s})`}>
              <polygon points="-1,3 1,3 1,8 -1,8" fill="#241a13" />
              {t.type === 'pine' ? (
                <g>
                  <polygon points="0,-14 -5,4 0,4" fill="#233f28" />
                  <polygon points="0,-14 0,4 5,4" fill="#172b1c" />
                  <polygon points="0,-17 -4,-3 0,-3" fill="#2e5234" />
                  <polygon points="0,-17 0,-3 4,-3" fill="#1d3623" />
                  <line x1="0" y1="-17" x2="-4" y2="-3" stroke="#487851" strokeWidth="0.6" opacity="0.6" />
                </g>
              ) : (
                <g>
                  <ellipse cx="-2" cy="-3" rx="7" ry="5.5" fill="#1f3924" />
                  <ellipse cx="2" cy="-2" rx="6" ry="5" fill="#162b1b" />
                  <ellipse cx="0" cy="-6" rx="6.5" ry="5" fill="#2c4d32" />
                  <ellipse cx="-1" cy="-7.5" rx="4.5" ry="3.2" fill="#3c6844" opacity="0.8" />
                </g>
              )}
            </g>
          ))}
        </g>

        {/* 东侧主峰脚下与观星山麓山林褶皱带 (East Mountain Base & Observatory Flank: x: 620 ~ 1380) */}
        <g id="east-foothill-trees">
          <polygon points="610,192 880,178 1150,185 1380,180 1380,188 1150,193 880,186 610,199" fill="#122014" opacity="0.45" />
          {[
            { x: 630, y: 190, s: 1.05, type: 'copse' },
            { x: 670, y: 186, s: 1.2, type: 'pine' },
            { x: 710, y: 182, s: 0.95, type: 'copse' },
            { x: 755, y: 178, s: 1.15, type: 'pine' },
            { x: 805, y: 174, s: 1.3, type: 'pine' },
            { x: 855, y: 172, s: 1.0, type: 'copse' },
            { x: 905, y: 170, s: 1.2, type: 'pine' },
            { x: 955, y: 173, s: 1.1, type: 'copse' },
            { x: 1005, y: 176, s: 1.25, type: 'pine' },
            { x: 1060, y: 180, s: 0.9, type: 'copse' },
            { x: 1120, y: 182, s: 1.15, type: 'pine' },
            { x: 1180, y: 184, s: 1.05, type: 'copse' },
            { x: 1245, y: 182, s: 1.2, type: 'pine' },
            { x: 1310, y: 179, s: 0.95, type: 'copse' },
            { x: 1360, y: 177, s: 1.1, type: 'pine' },
          ].map((t, idx) => (
            <g key={`eft-${idx}`} transform={`translate(${t.x}, ${t.y}) scale(${t.s})`}>
              <polygon points="-1,3 1,3 1,8 -1,8" fill="#241a13" />
              {t.type === 'pine' ? (
                <g>
                  <polygon points="0,-15 -5,4 0,4" fill="#203a24" />
                  <polygon points="0,-15 0,4 5,4" fill="#142618" />
                  <polygon points="0,-18 -4,-4 0,-4" fill="#284a2e" />
                  <polygon points="0,-18 0,-4 4,-4" fill="#19301e" />
                  <line x1="0" y1="-18" x2="-4" y2="-4" stroke="#44714b" strokeWidth="0.6" opacity="0.6" />
                </g>
              ) : (
                <g>
                  <ellipse cx="-2" cy="-3" rx="7" ry="5.5" fill="#1d3521" />
                  <ellipse cx="2" cy="-2" rx="6" ry="5" fill="#142718" />
                  <ellipse cx="0" cy="-6" rx="6.5" ry="5" fill="#28472d" />
                  <ellipse cx="-1" cy="-7.5" rx="4.5" ry="3.2" fill="#38603d" opacity="0.8" />
                </g>
              )}
            </g>
          ))}
        </g>
      </g>
    </g>
  );
};
