import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';

/**
 * 🌾 PastureFields (Meadow Wildflowers)
 *
 * Layer: 03 LAND PARCELS
 * Sparse flowers share the master ground plane, without long relief contours.
 */
export const PastureFields: React.FC<YorkshireCommonProps> = ({ className }) => {
  return (
    <g id="patchwork-pasture-fields" className={className}>
      {/* ------------------------------------------------------------------- */}
      {/* 纯净田园小野花与雏菊点缀 (Natural Pastoral Chamomile & Flora · 全景风律协同) */}
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
