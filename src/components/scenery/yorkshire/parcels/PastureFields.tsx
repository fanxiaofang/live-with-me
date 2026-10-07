import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';

/**
 * 🌾 PastureFields (Axonometric Meadow Details & Wildflowers)
 *
 * Layer: 03 LAND PARCELS
 * Completely Cleaned:
 * - Removed all harsh opaque disjointed polygon blocks and stubble patterns
 * - Provides gentle axonometric field contour accents and natural chamomile daisies
 * - Harmonizes 100% with the master axonometric ground plane
 */
export const PastureFields: React.FC<YorkshireCommonProps> = ({ className }) => {
  return (
    <g id="patchwork-pasture-fields" className={className}>
      {/* ------------------------------------------------------------------- */}
      {/* 1. 前景微起伏草坡自然起伏弧线 (Gentle Organic Meadow Swale Creases)   */}
      {/* ------------------------------------------------------------------- */}
      <g id="pasture-axonometric-traces" opacity="0.35">
        {/* 西南向微起伏草坡缓痕 (Soft Organic Meadow Swale Crease) */}
        <path
          d="M-450,520 Q-100,640 220,730"
          fill="none"
          stroke="#718f34"
          strokeWidth="1.2"
        />
        {/* 东南向微起伏草坡缓痕 (Soft Organic Meadow Swale Crease) */}
        <path
          d="M860,510 Q1200,630 1550,725"
          fill="none"
          stroke="#718f34"
          strokeWidth="1.2"
        />
      </g>

      {/* ------------------------------------------------------------------- */}
      {/* 2. 纯净田园小野花与雏菊点缀 (Natural Pastoral Chamomile & Flora · 全景风律协同) */}
      {/*    稀疏雅致，连同草芽在微风波浪中轻盈摇曳                              */}
      {/* ------------------------------------------------------------------- */}
      <g id="pasture-chamomile-dots" opacity="0.88">
        {[
          { x: -520, y: 560 },
          { x: -340, y: 620 },
          { x: -160, y: 580 },
          { x: 120, y: 660 },
          { x: 380, y: 590 },
          { x: 680, y: 620 },
          { x: 880, y: 580 },
          { x: 1120, y: 640 },
          { x: -220, y: 470 },
          { x: 740, y: 460 },
        ].map((f, idx) => {
          const windDelay = Number(((f.x + 600) * 0.0028 + (f.y - 400) * 0.001).toFixed(2));
          return (
            <g key={`pmf-${idx}`} transform={`translate(${f.x}, ${f.y})`}>
              <g
                className="animate-wind-flower"
                style={{
                  animationDelay: `${windDelay}s`,
                  transformOrigin: '0px 0px',
                }}
              >
                {/* 柔软微型草芽与花茎 */}
                <path
                  d="M0,0 Q-2,-5 -4,-8 M0,0 Q2,-5 4,-7"
                  stroke="#5d7b28"
                  strokeWidth="1.0"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* 雅致雏菊小白点 / 黄点 */}
                {idx % 2 === 0 ? (
                  <circle cx="-3" cy="-9" r="1.8" fill="#ffffff" />
                ) : (
                  <circle cx="3" cy="-8" r="1.6" fill="#fef08a" />
                )}
                <circle cx={idx % 2 === 0 ? -3 : 3} cy={idx % 2 === 0 ? -9 : -8} r="0.65" fill="#eab308" />
              </g>
            </g>
          );
        })}
      </g>
    </g>
  );
};
