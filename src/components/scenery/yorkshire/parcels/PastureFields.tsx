import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';

/**
 * 🌾 PastureFields (Yorkshire Patchwork Dales Pasture Fields)
 *
 * Layer: 03 LAND PARCELS
 * Spatial Region: YORKSHIRE_LAYOUT.pastureParcels
 *
 * Divides the countryside into 3 generous patchwork fields:
 * - West Beck Meadow
 * - Central Sunny Slope
 * - East Hillside Fell Pasture
 */
export const PastureFields: React.FC<YorkshireCommonProps> = ({ className }) => {
  const parcels = YORKSHIRE_LAYOUT.pastureParcels;

  return (
    <g id="patchwork-pasture-fields" className={className} opacity="0.95">
      <defs>
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
      </defs>

      {/* 田亩 1：西侧河畔开阔草场 (West Beck Meadow) */}
      <polygon
        id={parcels.westBeckField.id}
        points={parcels.westBeckField.polygon}
        fill="url(#ysPastureField1Grad)"
        stroke="#425824"
        strokeWidth="0.8"
      />

      {/* 田亩 2：中景宽广缓坡草场 (Central Sunny Slope) */}
      <polygon
        id={parcels.centralSunnySlope.id}
        points={parcels.centralSunnySlope.polygon}
        fill="url(#ysPastureField2Grad)"
        stroke="#425824"
        strokeWidth="0.8"
      />

      {/* 田亩 3：东侧山麓牧场 (East Hillside Fell Pasture) */}
      <polygon
        id={parcels.eastHillsideFell.id}
        points={parcels.eastHillsideFell.polygon}
        fill="url(#ysPastureField3Grad)"
        stroke="#425824"
        strokeWidth="0.8"
      />
    </g>
  );
};
