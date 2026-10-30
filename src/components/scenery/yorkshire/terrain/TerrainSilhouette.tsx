import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { mountainApronPath, rollingWheatPath, wheatBackEdgePath, wheatBoundaryFencePosts, wheatRearY } from '../../../../world/scene/landscapeGeometry';
import { FOOTHILL_FARMSTEADS, foothillSurfaceY } from '../../../../world/scene/foothillGeometry';
import { requestedMeadowFoothill } from '../../../../world/scene/currentScene';
import { MEADOW_HILL_FARM } from '../../../../world/scene/meadowFoothill';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { LandscapeTreeShape, type LandscapeTreeSpecies } from '../vegetation/LandscapeTreeShape';
import { WHEAT_TRAMLINES, tramlinePoint } from '../../../../world/scene/fieldParcels';
import { FieldParcels } from './FieldParcels';
import { FieldDressing } from '../dressing/FieldDressing';

export function DistantFarmsteads({ theme, landform = false }: { theme?: YorkshireSceneTheme; landform?: boolean }) {
  const meadow=landform && requestedMeadowFoothill();
  const firstX=meadow ? MEADOW_HILL_FARM.x : landform ? FOOTHILL_FARMSTEADS[0].x : 740,secondX=landform ? FOOTHILL_FARMSTEADS[1].x : 1120;
  const first=landform ? foothillSurfaceY(firstX,meadow ? MEADOW_HILL_FARM.depth : FOOTHILL_FARMSTEADS[0].depth) : 176;
  const second = landform ? foothillSurfaceY(secondX, FOOTHILL_FARMSTEADS[1].depth) : 157;
  const wall = theme?.landscapeEnvironment?.farmWall || '#f8fafc';
  const roof = theme?.landscapeEnvironment?.farmRoof || '#a84e34';
  return <>
      <g transform={`translate(${firstX}, ${first - 18})`} data-farmstead-root={landform ? firstX+','+first : undefined}>
        <polygon points="0,10 16,10 16,18 0,18" fill={wall} />
        <polygon points="-2,10 8,2 18,10" fill={roof} />
      </g>
      <g transform={`translate(${secondX}, ${second - 15})`} data-farmstead-root={landform ? secondX+','+second : undefined}>
        <polygon points="0,8 14,8 14,15 0,15" fill={wall} />
        <polygon points="-2,8 7,1 16,8" fill={roof} />
      </g>

  </>;
}

interface TerrainSurfaceProps extends YorkshireCommonProps {
  frontExtension?: number;
  rearRefined?: boolean;
  ridgesOnly?: boolean;
}

const WHEAT_MARGIN_SECTIONS = [3, 4, 5, 6].map(index => ({
  index, start: tramlinePoint(index, 0.14), end: tramlinePoint(index, 0.48),
}));
const WHEAT_BOUNDARY_POSTS = wheatBoundaryFencePosts();
const REFINED_BOUNDARY_POSTS = wheatBoundaryFencePosts(true);
// Move only each line's far endpoint along its existing vector to meet the new edge.
const REFINED_TRAMLINES = WHEAT_TRAMLINES.map(line => {
  const dx = line.x2 - line.x1, dy = line.y2 - line.y1;
  let low = -.3, high = .3;
  for (let i = 0; i < 28; i++) {
    const t = (low + high) / 2;
    if (line.y1 + dy * t < wheatRearY(line.x1 + dx * t, true)) low = t;
    else high = t;
  }
  const t = (low + high) / 2;
  return { ...line, x1: line.x1 + dx * t, y1: line.y1 + dy * t };
});
const WHEAT_TREE_CLUSTERS: { line: number; t: number; trees: { t: number; dx: number; s: number; species: LandscapeTreeSpecies }[] }[] = [
  { line: 4, t: 0.27, trees: [{ t: -0.015, dx: -2, s: .78, species: 'birch' }, { t: 0.015, dx: 2, s: .92, species: 'broadleaf' }] },
  { line: 5, t: 0.29, trees: [{ t: -0.025, dx: -2, s: .84, species: 'pine' }, { t: 0, dx: 2, s: 1, species: 'birch' }, { t: 0.035, dx: -1, s: .9, species: 'broadleaf' }] },
];
// Closer than the foothill woodland: clearer trunks and warmer, less air-mixed crowns.
const FIELD_TREE_COLORS = {
  pine: { leaf: '#587548', shade: '#3e5c3d', light: '#7d9055' },
  birch: { leaf: '#718b52', shade: '#4f7044', light: '#9ba96b' },
  broadleaf: { leaf: '#7a8448', shade: '#596b3c', light: '#9b9d5c' },
};

/**
 * 🏔️ MountainSilhouette (Far Low-Poly Distant Mountain Ridges, Pines & Woodlands)
 * Layer 01: FAR DISTANT BACKGROUND SILHOUETTE
 */
export const MountainSilhouette: React.FC<TerrainSurfaceProps> = ({ theme, className, frontExtension = 0, ridgesOnly = false }) => {
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
      <DistantFarmsteads />

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
  return <g id="yorkshire-mountain-silhouette" className={className}>{ridges}{!ridgesOnly && <>{apron}{landmarks}</>}</g>;
};

/**
 * 🌾 RollingWheatSilhouette (Continuous Midground Wheat Plain)
 * Layer 02: MIDGROUND ROLLING WHEAT FIELDS
 */
export const RollingWheatSilhouette = React.memo(function RollingWheatSilhouetteAsset({ theme, className, frontExtension = 0, rearRefined = false }: TerrainSurfaceProps) {
  const surfacePath = rollingWheatPath(frontExtension, rearRefined);
  const environmentStyle = theme.landscapeEnvironment ? { filter: 'url(#field-environment-tone)' } : undefined;

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
        {rearRefined && theme.landscapeEnvironment && <FieldParcels surfacePath={surfacePath} />}

        {/* 细密亚光麦穗颗粒织理 (Fine Matte Wheat Granular Texture) */}
        <path
          d={surfacePath}
          fill="url(#wheatPattern)"
          opacity="0.08"
          style={environmentStyle}
        />

        {/* Restore the original faint diagonal tramlines for a little ground depth. */}
        <g id="flat-wheat-tramlines" opacity="0.14" pointerEvents="none">
          {(rearRefined ? REFINED_TRAMLINES : WHEAT_TRAMLINES).map((line, idx) => (
            <line key={`ftl-${idx}`} {...line} stroke="#6b4c16"
              strokeWidth="0.8" strokeDasharray="14 7" />
          ))}
        </g>

        {/* Each short margin lies on an existing tramline, using the same endpoints. */}
        <g id="flat-wheat-field-margins" fill="none" stroke="#96944f"
          strokeWidth="2.4" strokeLinecap="round" opacity="0.34" pointerEvents="none">
          {WHEAT_MARGIN_SECTIONS.filter(({ index }) => !(rearRefined && theme.landscapeEnvironment && (index === 4 || index === 5))).map(({ index, start, end }) => (
            <line key={index} data-tramline={index}
              x1={start.x} y1={start.y} x2={end.x} y2={end.y} />
          ))}
        </g>

        {/* One continuous fence follows the actual crop / foothill boundary. */}
        <g id="wheat-margin-fences" pointerEvents="none" opacity="0.62" style={environmentStyle}>
          <path d={wheatBackEdgePath(rearRefined)} transform="translate(0, -4)" fill="none"
            stroke="#776347" strokeWidth="1.2" />
          <path d={wheatBackEdgePath(rearRefined)} transform="translate(0, 1)" fill="none"
            stroke="#776347" strokeWidth="1.2" />
          {(rearRefined ? REFINED_BOUNDARY_POSTS : WHEAT_BOUNDARY_POSTS).map((post, i) => (
            <path key={i} d={`M${post.x},${post.y + 5} v-13`}
              stroke="#68563d" strokeWidth="1.7" strokeLinecap="round" />
          ))}
        </g>

        {/* Small, uneven clusters grow beside the same tramlines as the margins. */}
        <g id="wheat-margin-trees" pointerEvents="none" style={environmentStyle}>
          {WHEAT_TREE_CLUSTERS.map(cluster => (
            <g key={cluster.line} data-tramline={cluster.line}>
              {cluster.trees.map((tree, i) => {
                const point = tramlinePoint(cluster.line, cluster.t + tree.t);
                return (
                  <g key={i} data-field-tree="" data-tree-species={tree.species}
                    transform={`translate(${point.x + tree.dx}, ${point.y}) scale(${tree.s})`}>
                    <ellipse cx="1" cy="1" rx="12" ry="2.5" fill="#74723f" opacity="0.2" />
                    <LandscapeTreeShape species={tree.species} {...FIELD_TREE_COLORS[tree.species]}
                      trunk="#625238" birchTrunk="#dfdfc8" />
                  </g>
                );
              })}
            </g>
          ))}
        </g>

        <FieldDressing style={environmentStyle} />

        {/* ================================================================= */}
        {/* 🌾 E. 地头边界金黄麦穗微风轻摇簇 (Field Margin Wheat Tufts)        */}
        {/* ================================================================= */}
        <g id="terrace-wheat-tufts" opacity="0.85" style={environmentStyle}>
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
