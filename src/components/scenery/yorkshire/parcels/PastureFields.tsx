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
      {/* 1. 前景微起伏草坡自然起伏弧线与田埂光影 (Pasture Swale Contours & Sunlight Ridges) */}
      {/* ------------------------------------------------------------------- */}
      <g id="pasture-axonometric-traces" opacity="0.45">
        {/* 西南向微起伏草坡缓痕 (Soft Organic Meadow Swale Crease) */}
        <path
          d="M-550,480 Q-200,600 220,730"
          fill="none"
          stroke="#718f34"
          strokeWidth="1.4"
        />
        <path
          d="M-550,481 Q-200,601 220,731"
          fill="none"
          stroke="#9dc252"
          strokeWidth="0.8"
          opacity="0.6"
        />
        {/* 东南向微起伏草坡缓痕 (Soft Organic Meadow Swale Crease) */}
        <path
          d="M860,510 Q1200,630 1650,715"
          fill="none"
          stroke="#718f34"
          strokeWidth="1.4"
        />
        <path
          d="M860,511 Q1200,631 1650,716"
          fill="none"
          stroke="#9dc252"
          strokeWidth="0.8"
          opacity="0.6"
        />
        {/* 中景麦田脚下向阳草甸微光田埂 (Sunlit Ridge Crease below wheat) */}
        <path
          d="M-300,380 Q200,360 800,370 T1400,395"
          fill="none"
          stroke="#a3c458"
          strokeWidth="1.0"
          opacity="0.4"
        />
      </g>

      {/* ------------------------------------------------------------------- */}
      {/* 2. 纯净田园小野花与雏菊点缀 (Natural Pastoral Chamomile & Flora · 全景风律协同) */}
      {/*    稀疏雅致，连同草芽在微风波浪中轻盈摇曳                              */}
      {/* ------------------------------------------------------------------- */}
      <g id="pasture-chamomile-dots" opacity="0.9">
        {[
          { x: -520, y: 560, col: 'white' },
          { x: -340, y: 620, col: 'yellow' },
          { x: -280, y: 530, col: 'white' },
          { x: -160, y: 580, col: 'white' },
          { x: -60, y: 640, col: 'yellow' },
          { x: 120, y: 660, col: 'white' },
          { x: 260, y: 610, col: 'white' },
          { x: 380, y: 590, col: 'yellow' },
          { x: 520, y: 640, col: 'white' },
          { x: 680, y: 620, col: 'white' },
          { x: 880, y: 580, col: 'yellow' },
          { x: 1020, y: 610, col: 'white' },
          { x: 1120, y: 640, col: 'white' },
          { x: -220, y: 470, col: 'yellow' },
          { x: 740, y: 460, col: 'white' },
          { x: 860, y: 490, col: 'yellow' },
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
                {f.col === 'white' ? (
                  <circle cx="-3" cy="-9" r="1.8" fill="#ffffff" />
                ) : (
                  <circle cx="3" cy="-8" r="1.6" fill="#fef08a" />
                )}
                <circle cx={f.col === 'white' ? -3 : 3} cy={f.col === 'white' ? -9 : -8} r="0.65" fill="#eab308" />
              </g>
            </g>
          );
        })}
      </g>
    </g>
  );
};
