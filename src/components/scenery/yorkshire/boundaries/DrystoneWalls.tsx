import React from 'react';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';
import { YorkshireCommonProps } from '../landscapeTypes';

/**
 * 🧱 DrystoneWalls (Yorkshire Authentic Low Field Boundaries)
 *
 * Layer: 04 BOUNDARIES
 *
 * - Renders the authentic low boundary stone wall along the northeastern hillside
 * SheepPen is mounted separately by HomesteadMeadow.
 */
export const DrystoneWalls: React.FC<YorkshireCommonProps> = ({
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
      {/* 东北侧自然山脊低矮干砌田界石墙 (North-East Hillside Drystone Boundary Wall)  */}
      {/* 连贯延展至远山，形成纯净开阔的英伦田园分界线                              */}
      {/* ----------------------------------------------------------------------- */}
      <g id={walls.eastWall.id} opacity="0.9">
        <g id="northeast-boundary-wall" transform="translate(1140, 172)">
          {/* 低矮石墙主体 */}
          <polygon
            points="0,6 90,14 190,20 190,28 90,22 0,14"
            fill="url(#ysFieldWallFaceGrad)"
          />
          {/* 石墙顶端风化压顶石 */}
          <polygon
            points="0,2 90,10 190,16 190,20 90,14 0,6"
            fill="url(#ysFieldWallCapGrad)"
          />
          {/* 石块砌缝细节 */}
          {[20, 48, 76, 110, 140, 168].map((sx, idx) => (
            <line
              key={`ne-sw-${idx}`}
              x1={sx}
              y1={idx * 2 + 5}
              x2={sx}
              y2={idx * 2 + 13}
              stroke="#2e271e"
              strokeWidth="0.8"
              opacity="0.65"
            />
          ))}
        </g>
      </g>

    </g>
  );
};
