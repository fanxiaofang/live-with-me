import React from 'react';
import { YorkshireSceneTheme } from './landscapeTypes';

/**
 * 🎨 Yorkshire Landscape Shared Gradients & Filter Defs
 * Can be rendered at the root of any Yorkshire SVG container or layer
 */
export const YorkshireDefs: React.FC<{ theme: YorkshireSceneTheme }> = ({ theme }) => {
  return (
    <defs>
      {/* 溪水河湾清澈碧青渐变 (Teal-Cyan Beck) */}
      <linearGradient id="ysRiverGradClean" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={theme.riverColor} />
        <stop offset="50%" stopColor={theme.riverReflect} />
        <stop offset="100%" stopColor={theme.riverColor} />
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
