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
      {/* 东侧草坡低矮干砌石矮墙与经典五杠原木门 (East Pasture Boundary & 5-Bar Gate) */}
      {/* 仅保留规整低矮的田园界石与木门，开阔通透，杜绝多余铁栅栏杂乱感           */}
      {/* ----------------------------------------------------------------------- */}
      <g id={walls.eastWall.id} opacity="0.9">
        {/* 低矮质朴石墙段 */}
        <polygon
          points="320,480 440,460 440,466 320,486"
          fill="url(#ysFieldWallFaceGrad)"
          stroke="#211a14"
          strokeWidth="0.7"
        />
        <line
          x1="320"
          y1="480"
          x2="440"
          y2="460"
          stroke="url(#ysFieldWallCapGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* 🌟 标志性五杠斜撑原木牧场门 (5-Bar Field Gate) */}
        <g
          id="east-5bar-pasture-gate"
          transform={`translate(${walls.eastWall.gateAnchor.x}, ${walls.eastWall.gateAnchor.y})`}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onTriggerToast?.('🚪 约克郡传统原木牧场门 · 5-Bar Field Gate，通往东侧开阔羊群山坡');
          }}
          onMouseEnter={() => setHoveredObject?.('🚪 英伦传统五木杠栅栏门 · 经典的农夫手工斜撑牧场大门')}
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

        {/* 木门右侧衔接的低矮干砌石墙 */}
        <polygon
          points="496,467 590,448 590,454 496,473"
          fill="url(#ysFieldWallFaceGrad)"
          stroke="#211a14"
          strokeWidth="0.7"
        />
        <line
          x1="496"
          y1="467"
          x2="590"
          y2="448"
          stroke="url(#ysFieldWallCapGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
      </g>
    </g>
  );
};
