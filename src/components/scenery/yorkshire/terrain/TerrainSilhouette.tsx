import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';

/**
 * 🏔️ TerrainSilhouette (Distant Mountain Ridges, Silhouettes & Horizons)
 *
 * Layer: 01 TERRAIN SILHOUETTE
 * Spatial Region: YORKSHIRE_LAYOUT.distantRidges
 *
 * Preserves distant mountain ranges, cel-shaded facets, patchwork fell fields,
 * observatory summit rock base, wheat slopes, hedgerows, and distant farmsteads.
 */
export const TerrainSilhouette: React.FC<YorkshireCommonProps> = ({ theme, className }) => {
  const layout = YORKSHIRE_LAYOUT.distantRidges;

  return (
    <g id="yorkshire-terrain-silhouette" className={className}>
      <defs>
        <pattern id="wheatPattern" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45 0 0)">
          <line x1="0" y1="0" x2="0" y2="16" stroke="#fef08a" strokeWidth="1.2" opacity="0.65" />
          <line x1="8" y1="0" x2="8" y2="16" stroke="#ca8a04" strokeWidth="0.8" opacity="0.4" />
        </pattern>
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
      </defs>

      {/* Distant Mountain Range 1 */}
      <path
        d={layout.mountainRange1.path}
        fill={theme.hillGreenFar}
      />

      {/* Mountain 1 Patchwork Dales Fields */}
      <polygon points="120,150 260,175 340,168 200,145" fill="#849977" opacity="0.65" />
      <polygon points="620,138 740,162 820,154 700,132" fill="#9cb086" opacity="0.6" />
      <polygon points="1180,145 1320,168 1400,160 1260,140" fill="#849977" opacity="0.65" />

      {/* Mountain 1 Bold Cel-Shaded Facets */}
      <polygon points="180,145 320,165 420,172 260,175" fill="#44563a" opacity="0.55" />
      <polygon points="680,132 820,152 940,158 780,170" fill="#405236" opacity="0.58" />
      <polygon points="1240,140 1400,160 1520,165 1350,175" fill="#44563a" opacity="0.55" />

      {/* Far Hillside Field Boundary Stone Seams */}
      <line x1="200" y1="145" x2="260" y2="175" stroke="#483c30" strokeWidth="0.9" opacity="0.7" />
      <line x1="700" y1="132" x2="740" y2="162" stroke="#483c30" strokeWidth="0.9" opacity="0.7" />
      <line x1="1260" y1="140" x2="1320" y2="168" stroke="#483c30" strokeWidth="0.9" opacity="0.7" />

      {/* Distant mountain haze layer */}
      <path
        d="M-2400,205 Q-1200,180 -600,215 Q-180,170 260,175 Q580,192 890,165 Q1240,185 1520,175 2200,185 Q2900,170 3600,205 L3600,350 L-2400,350 Z"
        fill={theme.skyBottom}
        opacity="0.32"
      />

      {/* Distant Mountain Ridge 2 */}
      <path
        d={layout.mountainRange2.path}
        fill={theme.hillGreenMid}
      />

      {/* Observatory Summit Mountain Base */}
      <g id="observatory-summit-mountain-base">
        <path
          d="M740,210 Q800,140 840,105 Q880,72 920,86 Q960,115 1040,170 Q1120,205 1180,240 L1180,310 L740,310 Z"
          fill="#485942"
        />
        <polygon points="760,205 840,105 880,72 875,160 805,215" fill="#62785a" />
        <polygon points="880,72 920,86 1020,170 950,185 875,160" fill="#323f30" />
        <path d="M810,135 Q850,118 878,122 Q915,116 950,140" fill="none" stroke="#253023" strokeWidth="2.2" />
        <path d="M780,170 Q835,150 872,154 Q920,148 980,175" fill="none" stroke="#253023" strokeWidth="2.4" />
        <g opacity="0.9">
          <g transform="translate(805, 155)">
            <polygon points="0,0 7,-18 14,0" fill="#1b2a1e" />
            <polygon points="2,-10 7,-24 12,-10" fill="#283e2c" />
          </g>
          <g transform="translate(945, 130)">
            <polygon points="0,0 8,-20 16,0" fill="#1b2a1e" />
            <polygon points="2,-12 8,-28 14,-12" fill="#283e2c" />
          </g>
          <g transform="translate(980, 160)">
            <polygon points="0,0 7,-18 14,0" fill="#1b2a1e" />
            <polygon points="2,-10 7,-24 12,-10" fill="#283e2c" />
          </g>
        </g>
      </g>

      {/* Ridge 2 Cel-Shaded Facets */}
      <polygon points="240,178 420,195 560,198 380,210" fill="#46582a" opacity="0.5" />
      <polygon points="880,168 1080,190 1240,192 1020,208" fill="#405226" opacity="0.52" />

      {/* Distant farmsteads */}
      <g transform="translate(720, 150)">
        <rect x="0" y="8" width="18" height="12" fill="#fffaf2" />
        <polygon points="-2,8 9,0 20,8" fill="#a84e34" />
      </g>
      <g transform="translate(1100, 135)">
        <rect x="0" y="6" width="15" height="10" fill="#fffaf2" />
        <polygon points="-2,6 7,0 17,6" fill="#a84e34" />
      </g>

      {/* Distant Rolling Golden Wheat Slopes */}
      <path
        d={layout.wheatSlopes.path}
        fill={theme.wheatFar}
      />
      <path
        d={layout.wheatSlopes.path}
        fill="url(#wheatPattern)"
        opacity="0.12"
      />

      {/* Distant Hedgerow & Countryside Trees */}
      <g opacity="0.8">
        {[-360, -240, -120, -20, 80, 180, 280, 390, 680, 790, 910, 1040, 1150, 1280, 1420, 1600, 1800, 2050].map((tx) => (
          <g key={`hedge-${tx}`} transform={`translate(${tx}, ${268 + (tx % 15) - 7})`}>
            <ellipse cx="0" cy="0" rx="16" ry="6.5" fill={theme.hillGreenFar} />
            <ellipse cx="-3" cy="-1.5" rx="10" ry="4.5" fill={theme.hillGreenMid} opacity="0.65" />
          </g>
        ))}
      </g>
    </g>
  );
};
