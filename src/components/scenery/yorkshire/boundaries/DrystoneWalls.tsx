import { svgAction } from '../../../../world/interactions/svgAction';
import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';

/**
 * 🧱 DrystoneWalls (Yorkshire Authentic Low Field Boundaries & 5-Bar Gate)
 *
 * Layer: 04 BOUNDARIES
 *
 * Cleaned per user request:
 * - Removed chaotic, jagged west fence lines and polygon cages
 * - Retains the iconic English countryside 5-bar wooden pasture gate and neat low stone boundary
 */
export const DrystoneWalls: React.FC<YorkshireCommonProps> = ({
  onTriggerToast,
  setHoveredObject,
  className,
}) => {
  const walls = YORKSHIRE_LAYOUT.drystoneWalls;

  return (
    <g id="field-boundary-walls" className={className}>
      <defs>
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
      </defs>

      {/* ----------------------------------------------------------------------- */}
      {/* 经典五杠原木牧场门 (5-Bar Field Gate)                                  */}
      {/* 仅保留独立的原木牧场门，去除所有石墙，展现无界的开阔草场                   */}
      {/* ----------------------------------------------------------------------- */}
      <g id={walls.eastWall.id} opacity="0.9">
        {/* 🌟 标志性五杠斜撑原木牧场门 (5-Bar Field Gate) */}
        <g {...svgAction('east-5bar-pasture-gate')}
          id="east-5bar-pasture-gate"
          transform={`translate(${walls.eastWall.gateAnchor.x}, ${walls.eastWall.gateAnchor.y})`}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onTriggerToast?.('🚪 约克郡传统原木牧场门 · 5-Bar Field Gate，通往东侧开阔羊群山坡');
          }}
          onMouseEnter={() => setHoveredObject?.({ kind: 'entity', id: 'pasture-gate' })}
          onMouseLeave={() => setHoveredObject?.(null)}
        >
          <rect x="0" y="-6" width="5" height="26" rx="1.2" fill="#442f1b" stroke="#25170a" strokeWidth="0.8" />
          <rect x="50" y="2" width="4.5" height="24" rx="1.2" fill="#442f1b" stroke="#25170a" strokeWidth="0.8" />
          {[0, 4.5, 9, 13.5, 18].map((ry, i) => (
            <line
              key={`gate-rail-${i}`}
              x1="3"
              y1={ry}
              x2="51"
              y2={ry + 6.5}
              stroke="#735234"
              strokeWidth={i === 0 ? '2.4' : '1.7'}
              strokeLinecap="round"
            />
          ))}
          <line x1="4" y1="16" x2="50" y2="7" stroke="#5a3d24" strokeWidth="2.0" strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
};
