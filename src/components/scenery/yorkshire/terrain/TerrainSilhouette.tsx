import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT, DEBUG_TERRAIN } from '../landscapeLayout';

/**
 * 🌫️ TerrainSilhouette (Horizon Transition Layer)
 *
 * Layer: 01 TERRAIN SILHOUETTE
 * Spatial Region: YORKSHIRE_LAYOUT.horizonTransition
 *
 * Phase 2.4 — responsibility reduced.
 *
 * This component no longer draws the distant ridges. Simulating the whole
 * distant countryside with large flat SVG bands was exactly what made the
 * landscape read as stacked colour slabs, so that job now belongs to
 * `BackgroundYorkshireMatte` (a painted, gradient-faded backdrop).
 *
 * What remains here is the TRANSITION layer: the aerial-perspective haze band
 * that dissolves the painted backdrop into the midground terrain silhouette.
 * It carries no ridge geometry, so it cannot duplicate the matte.
 */
export const TerrainSilhouette: React.FC<YorkshireCommonProps> = ({ theme, className }) => {
  const t = YORKSHIRE_LAYOUT.horizonTransition;

  return (
    <g id="yorkshire-terrain-silhouette" className={className}>
      <defs>
        {/* Horizon haze: transparent at the top, densest at the horizon peak,
            transparent again below so the midground terrain silhouette reads
            as emerging out of the distance rather than sitting on a cut line. */}
        <linearGradient
          id="horizonTransitionGrad"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={t.top}
          x2="0"
          y2={t.bottom}
        >
          <stop offset="0%" stopColor={theme.skyBottom} stopOpacity="0" />
          <stop offset="52%" stopColor={theme.skyBottom} stopOpacity={t.opacity} />
          <stop offset="100%" stopColor={theme.skyBottom} stopOpacity="0" />
        </linearGradient>

        {/* Slightly cooler counter-wash, so the transition also compresses
            value toward the distance instead of only lightening it. */}
        <linearGradient
          id="horizonCoolGrad"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={t.top}
          x2="0"
          y2={t.bottom}
        >
          <stop offset="0%" stopColor={theme.hillGreenFar} stopOpacity="0" />
          <stop offset="58%" stopColor={theme.hillGreenFar} stopOpacity={t.opacity * 0.42} />
          <stop offset="100%" stopColor={theme.hillGreenFar} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Atmospheric horizon blend */}
      <rect
        x="-3200"
        y={t.top}
        width="8000"
        height={t.bottom - t.top}
        fill="url(#horizonTransitionGrad)"
      />

      {/* Value compression toward the distance */}
      <rect
        x="-3200"
        y={t.top}
        width="8000"
        height={t.bottom - t.top}
        fill="url(#horizonCoolGrad)"
      />

      {DEBUG_TERRAIN && (
        <g id="debug-horizon-transition" pointerEvents="none">
          <line x1="-3200" y1={t.top} x2="4800" y2={t.top} stroke="#00ffff" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
          <line x1="-3200" y1={t.peak} x2="4800" y2={t.peak} stroke="#00ffff" strokeWidth="2" strokeDasharray="6 4" opacity="0.8" />
          <line x1="-3200" y1={t.bottom} x2="4800" y2={t.bottom} stroke="#00ffff" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.6" />
        </g>
      )}
    </g>
  );
};
