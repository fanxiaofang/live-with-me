import React from 'react';
import { YorkshireSceneTheme } from './landscapeTypes';

/**
 * 🎨 Yorkshire Landscape Shared Gradients & Filter Defs
 * Can be rendered at the root of any Yorkshire SVG container or layer
 */
export const YorkshireDefs: React.FC<{ theme: YorkshireSceneTheme }> = ({ theme }) => {
  return (
    <defs>
      {/* 🌿 纯净无胡茬草坪底纹 (Empty pattern - completely removes stiff stubble lines) */}
      <pattern id="ysUnifiedLowPolyGrassPattern" width="1" height="1" patternUnits="userSpaceOnUse" />

      {/* 🔷 全景统一轴测大地渐变 (Seamless Master Axonometric Ground Gradient) */}
      <linearGradient id="isoGroundPastureGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9aa640" />
        <stop offset="12%" stopColor="#849f42" />
        <stop offset="35%" stopColor={theme.hillGreenMid} />
        <stop offset="70%" stopColor="#5e7b2d" />
        <stop offset="100%" stopColor={theme.hillGreenNear} />
      </linearGradient>

      {/* 🔷 远山与中景麦田自然交融坡面渐变 (Mountain Fell to Golden Wheat Apron Gradient) */}
      <linearGradient id="mountainWheatApronGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4d6444" stopOpacity="0.95" />
        <stop offset="30%" stopColor="#627a4d" stopOpacity="0.88" />
        <stop offset="65%" stopColor="#929d4c" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#caa64c" stopOpacity="0.9" />
      </linearGradient>

      {/* 🔷 宏阔起伏的自然山坡麦田主渐变 (Pastoral Rolling Hillside Wheat Base Gradient) */}
      <linearGradient id="pastoralRollingWheatGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#caa64c" />
        <stop offset="25%" stopColor="#e8c864" />
        <stop offset="55%" stopColor="#ddba57" />
        <stop offset="80%" stopColor="#cca247" />
        <stop offset="100%" stopColor="#b58d34" />
      </linearGradient>

      {/* 🔷 中景麦田与前景深绿草地无缝过渡渐变 (Seamless Wheat to Deep-Green Pasture Blend Gradient) */}
      <linearGradient id="wheatPastureBlendGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#caa64c" stopOpacity="0" />
        <stop offset="25%" stopColor="#bba042" stopOpacity="0.45" />
        <stop offset="55%" stopColor="#9baa3e" stopOpacity="0.75" />
        <stop offset="80%" stopColor="#789734" stopOpacity="0.92" />
        <stop offset="100%" stopColor="#5e7b2d" stopOpacity="1" />
      </linearGradient>

      {/* 🔷 麦浪向阳坡顶暖金光影渐变 (Sunlit Swale Crest Highlight Gradient) */}
      <linearGradient id="sunlitWheatCrestGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fae58e" stopOpacity="0.95" />
        <stop offset="50%" stopColor="#ebd174" stopOpacity="0.8" />
        <stop offset="100%" stopColor="#d5b050" stopOpacity="0.6" />
      </linearGradient>

      {/* 🔷 麦浪背阳凹处温润燕麦阴影渐变 (Soft Rolling Swale Hollow Shadow Gradient) */}
      <linearGradient id="rollingWheatHollowGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#a37e2c" stopOpacity="0.32" />
        <stop offset="100%" stopColor="#7a5c1e" stopOpacity="0.45" />
      </linearGradient>

      {/* 🔷 自然温润的庭院草坪渐变 (Organic Pastoral Lawn Turf Gradient - 去除塑料青荧感) */}
      <linearGradient id="isoTerraceTurfGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8ea846" />
        <stop offset="35%" stopColor="#7d9a3b" />
        <stop offset="70%" stopColor="#698730" />
        <stop offset="100%" stopColor="#557225" />
      </linearGradient>

      {/* 🔷 轴测台地轻微下沉收边阴影 (Subtle Axonometric Terrace Bevel Shadow) */}
      <linearGradient id="isoTerraceBevelGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4c6623" />
        <stop offset="100%" stopColor="#364917" />
      </linearGradient>

      {/* 🔷 低多边形向阳顶面草地渐变 (Low-Poly Sunlit Planar Facet) */}
      <linearGradient id="lowPolySunlitFacetGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#9ec052" />
        <stop offset="60%" stopColor="#8eb045" />
        <stop offset="100%" stopColor="#7fa03a" />
      </linearGradient>

      {/* 🔷 低多边形平整中间台地渐变 (Low-Poly Flat Mid-Plane Facet) */}
      <linearGradient id="lowPolyMidFacetGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8ba943" />
        <stop offset="45%" stopColor={theme.hillGreenMid} />
        <stop offset="85%" stopColor="#67832f" />
        <stop offset="100%" stopColor="#557025" />
      </linearGradient>

      {/* 🔷 低多边形背光阴影硬切面 (Low-Poly Faceted Shadow / Slope Drop) */}
      <linearGradient id="lowPolyShadowFacetGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4c6623" />
        <stop offset="50%" stopColor="#3d531b" />
        <stop offset="100%" stopColor="#2e4014" />
      </linearGradient>

      {/* 🔷 低多边形远山受光面 (Distant Mountain Sunlit Facet) */}
      <linearGradient id="lowPolyMountainLitGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#859c78" />
        <stop offset="100%" stopColor={theme.hillGreenFar} />
      </linearGradient>

      {/* 🔷 低多边形远山背光阴影面 (Distant Mountain Shadow Facet) */}
      <linearGradient id="lowPolyMountainShadeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#485c3f" />
        <stop offset="100%" stopColor="#36472e" />
      </linearGradient>

      {/* 🔷 低多边形金色麦田分块受光面与阴影面 */}
      <linearGradient id="lowPolyWheatLitGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#e5c56d" />
        <stop offset="100%" stopColor={theme.wheatFar} />
      </linearGradient>
      <linearGradient id="lowPolyWheatShadeGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ba933c" />
        <stop offset="100%" stopColor="#9e7b2e" />
      </linearGradient>

      {/* 规整风化灰砂岩墙体渐变 (暖调厚重石材) */}
      <linearGradient id="ysBastionFaceGradV2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#766d61" />
        <stop offset="35%" stopColor="#62594e" />
        <stop offset="75%" stopColor="#4c4338" />
        <stop offset="100%" stopColor="#352e26" />
      </linearGradient>

      {/* 饱满圆润石冠石帽渐变 (Coping Stones) */}
      <linearGradient id="ysBastionCapGradV2" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#a89d8e" />
        <stop offset="50%" stopColor="#beb3a4" />
        <stop offset="100%" stopColor="#968b7d" />
      </linearGradient>

      {/* 台地草坪向阳渐变 (Terrace Courtyard Turf) */}
      <linearGradient id="ysTerraceTurfGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9eb54a" />
        <stop offset="50%" stopColor="#80993c" />
        <stop offset="100%" stopColor="#5f772e" />
      </linearGradient>

      {/* 牧场田亩明度交错渐变 (消除单调死板平绿) */}
      <linearGradient id="ysPastureField1Grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#8da846" />
        <stop offset="100%" stopColor="#698533" />
      </linearGradient>

      <linearGradient id="ysPastureField2Grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#9cb34c" />
        <stop offset="100%" stopColor="#7a943a" />
      </linearGradient>

      <linearGradient id="ysPastureField3Grad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#819b3d" />
        <stop offset="100%" stopColor="#5d7529" />
      </linearGradient>

      {/* 规整灰岩石墙立面与顶石 */}
      <linearGradient id="ysFieldWallFaceGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#6e6557" />
        <stop offset="50%" stopColor="#554d40" />
        <stop offset="100%" stopColor="#3c352a" />
      </linearGradient>

      <linearGradient id="ysFieldWallCapGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#a49989" />
        <stop offset="50%" stopColor="#b6ab9a" />
        <stop offset="100%" stopColor="#928676" />
      </linearGradient>

      {/* 蓬松米白羊毛体 (Cream White Wool) */}
      <linearGradient id="ysSheepWoolGradV2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fffdfa" />
        <stop offset="55%" stopColor="#f3ede2" />
        <stop offset="100%" stopColor="#ded5c4" />
      </linearGradient>

      {/* 铁路高架石拱石材渐变 */}
      <linearGradient id="viaductStoneGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#857e72" />
        <stop offset="50%" stopColor="#6f685d" />
        <stop offset="100%" stopColor="#565046" />
      </linearGradient>
      <linearGradient id="viaductArchShade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#38332c" />
        <stop offset="100%" stopColor="#28241f" />
      </linearGradient>

      {/* 经典干砌石墙渐变 */}
      <linearGradient id="drystoneCapGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#948d82" />
        <stop offset="45%" stopColor="#aba398" />
        <stop offset="100%" stopColor="#878075" />
      </linearGradient>
      <linearGradient id="drystoneFaceGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#524d45" />
        <stop offset="60%" stopColor="#3d3831" />
        <stop offset="100%" stopColor="#292621" />
      </linearGradient>

      {/* 麦田纹理图案 */}
      <pattern id="wheatPattern" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45 0 0)">
        <line x1="0" y1="0" x2="0" y2="16" stroke="#fef08a" strokeWidth="1.2" opacity="0.65" />
        <line x1="8" y1="0" x2="8" y2="16" stroke="#ca8a04" strokeWidth="0.8" opacity="0.4" />
      </pattern>
    </defs>
  );
};
