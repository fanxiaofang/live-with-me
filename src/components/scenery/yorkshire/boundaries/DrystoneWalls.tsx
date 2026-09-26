import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';

/**
 * 🧱 DrystoneWalls (Yorkshire Authentic Drystone Boundary Walls & Gates)
 *
 * Layer: 04 BOUNDARIES
 * Spatial Region: YORKSHIRE_LAYOUT.drystoneWalls
 *
 * Preserves the drystone walls along field borders:
 * - West field wall
 * - East pasture wall with 5-bar timber gate
 * - Observatory hill terraced wall & ascent steps
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
      </defs>

      {/* ----------------------------------------------------------------------- */}
      {/* 墙 1：西侧河畔牧场分界石墙 (West Field Wall)                            */}
      {/* ----------------------------------------------------------------------- */}
      <g id={walls.westWall.id}>
        <polygon
          points="-720,440 -460,370 -460,378 -720,448"
          fill="url(#ysFieldWallFaceGrad)"
          stroke="#211a14"
          strokeWidth="0.7"
        />
        <line
          x1="-720"
          y1="440"
          x2="-460"
          y2="370"
          stroke="url(#ysFieldWallCapGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <line
          x1="-720"
          y1="440"
          x2="-460"
          y2="370"
          stroke="#241e18"
          strokeWidth="1.0"
          strokeDasharray="4 16"
        />

        {/* 南段下倾衔接石墙 */}
        <polygon
          points="-460,370 -310,480 -310,488 -460,378"
          fill="url(#ysFieldWallFaceGrad)"
          stroke="#211a14"
          strokeWidth="0.7"
        />
        <line
          x1="-460"
          y1="370"
          x2="-310"
          y2="480"
          stroke="url(#ysFieldWallCapGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </g>

      {/* ----------------------------------------------------------------------- */}
      {/* 墙 2：东侧草坡梯级分界石墙与大木门 (East Pasture Dividing Wall & 5-Bar Gate)*/}
      {/* ----------------------------------------------------------------------- */}
      <g id={walls.eastWall.id}>
        {/* 石墙前半段 */}
        <polygon
          points="260,490 440,460 440,468 260,498"
          fill="url(#ysFieldWallFaceGrad)"
          stroke="#211a14"
          strokeWidth="0.7"
        />
        <line
          x1="260"
          y1="490"
          x2="440"
          y2="460"
          stroke="url(#ysFieldWallCapGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* 🌟 标志性五杠斜撑原木牧场门 (5-Bar Field Gate - x: 440 ~ 495, y: 460) */}
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
          <rect x="0" y="-6" width="5" height="28" rx="1.2" fill="#442f1b" stroke="#25170a" strokeWidth="0.8" />
          <rect x="52" y="3" width="4.5" height="25" rx="1.2" fill="#442f1b" stroke="#25170a" strokeWidth="0.8" />
          {[0, 4.5, 9, 13.5, 18].map((ry, i) => (
            <line key={`gate-rail-${i}`} x1="3" y1={ry} x2="53" y2={ry + 7} stroke="#735234" strokeWidth={i === 0 ? '2.6' : '1.8'} strokeLinecap="round" />
          ))}
          <line x1="4" y1="16" x2="52" y2="7" stroke="#5a3d24" strokeWidth="2.2" strokeLinecap="round" />
        </g>

        {/* 石墙后半段向上延伸至山脚 */}
        <polygon
          points="498,467 680,435 680,443 498,475"
          fill="url(#ysFieldWallFaceGrad)"
          stroke="#211a14"
          strokeWidth="0.7"
        />
        <line
          x1="498"
          y1="467"
          x2="680"
          y2="435"
          stroke="url(#ysFieldWallCapGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      </g>

      {/* ----------------------------------------------------------------------- */}
      {/* 墙 3：右上通讯站山包修筑石径与台阶 (Observatory Hill Terraced Wall)      */}
      {/* ----------------------------------------------------------------------- */}
      <g id={walls.observatoryWall.id}>
        {/* 半山腰护坡石墙 (Lower Terrace Wall) */}
        <path
          d="M740,240 C800,260 880,270 980,270 L980,278 C880,278 800,268 740,248 Z"
          fill="url(#ysFieldWallFaceGrad)"
          stroke="#211a14"
          strokeWidth="0.7"
        />
        <path
          d="M740,240 C800,260 880,270 980,270"
          fill="none"
          stroke="url(#ysFieldWallCapGrad)"
          strokeWidth="4.2"
          strokeLinecap="round"
        />

        {/* 直通山顶电波站的修筑石径与石阶 (Stone Ascent Steps) */}
        <g id="observatory-stone-ascent" opacity="0.88">
          {[
            { x: 835, y: 195, w: 22 },
            { x: 825, y: 210, w: 24 },
            { x: 810, y: 225, w: 26 },
            { x: 790, y: 240, w: 28 },
            { x: 765, y: 255, w: 30 },
          ].map((st, i) => (
            <g key={`obs-step-${i}`}>
              <ellipse cx={st.x} cy={st.y + 1} rx={st.w / 2} ry="3.5" fill="#241d16" opacity="0.45" />
              <ellipse cx={st.x} cy={st.y} rx={st.w / 2} ry="3.2" fill="#8e8274" stroke="#544a3e" strokeWidth="0.6" />
              <line x1={st.x - st.w / 3} y1={st.y - 0.5} x2={st.x + st.w / 3} y2={st.y - 0.5} stroke="#bfb4a5" strokeWidth="0.6" />
            </g>
          ))}
        </g>
      </g>
    </g>
  );
};
