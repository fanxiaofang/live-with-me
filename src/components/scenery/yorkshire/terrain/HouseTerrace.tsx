import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';

/**
 * 🏰 HouseTerrace (The Grand Terrace Bastion & Curved Retaining Wall)
 *
 * Layer: 02 TERRAIN / House Terrace Plinth & Forecourt
 * Spatial Region: YORKSHIRE_LAYOUT.mainTerrace
 *
 * Preserves the 38px thick stone plinth, curved retaining wall,
 * central welcoming stone steps, and rustic timber wicket gate.
 */
export const HouseTerrace: React.FC<YorkshireCommonProps> = ({
  onTriggerToast,
  setHoveredObject,
  className,
}) => {
  const layout = YORKSHIRE_LAYOUT.mainTerrace;

  return (
    <g id="homestead-grand-bastion-system" className={className}>
      <defs>
        {/* 规整风化灰砂岩墙体渐变 (暖调厚重石材) */}
        <linearGradient id="ysBastionFaceGradV2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#766d61" />
          <stop offset="35%" stopColor="#62594e" />
          <stop offset="75%" stopColor="#4c4338" />
          <stop offset="100%" stopColor="#352e26" />
        </linearGradient>

        {/* 饱满圆润石冠石帽渐变 (Coping Stones) */}
        <linearGradient id="ysBastionCapGradV2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#a89d8e" />
          <stop offset="50%" stopColor="#beb3a4" />
          <stop offset="100%" stopColor="#968b7d" />
        </linearGradient>

        {/* 台地草坪向阳渐变 (Terrace Courtyard Turf) */}
        <linearGradient id="ysTerraceTurfGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9eb54a" />
          <stop offset="50%" stopColor="#80993c" />
          <stop offset="100%" stopColor="#5f772e" />
        </linearGradient>
      </defs>

      {/* ========================================================================= */}
      {/* A. 紧贴主屋底部的垂直厚重石基 (Elevated House Plinth Foundation)            */}
      {/* ========================================================================= */}
      <g id="house-immediate-stone-plinth">
        {/* 地基接触阴影 */}
        <polygon points="-305,152 0,60 305,152 0,285" fill="#141c12" opacity="0.5" filter="url(#softShadow)" />

        {/* 实心平整石台顶面 (Plinth Top Surface) */}
        <polygon points="-300,150 0,62 300,150 0,242" fill="#756a5c" stroke="#483f34" strokeWidth="1.0" />

        {/* 西南垂直石立面 (South-West Plinth Face - 厚度 36px) */}
        <polygon points="-300,150 0,242 0,278 -300,186" fill="url(#ysBastionFaceGradV2)" stroke="#261f18" strokeWidth="1.0" />

        {/* 东南垂直石立面 (South-East Plinth Face) */}
        <polygon points="0,242 300,150 300,186 0,278" fill="#3b332a" stroke="#261f18" strokeWidth="1.0" />

        {/* 规整建筑石材水平错缝与竖向砌缝 (Masonry Coursing) */}
        <g opacity="0.6">
          <line x1="-300" y1="168" x2="0" y2="260" stroke="#1f1812" strokeWidth="1.2" />
          <line x1="0" y1="260" x2="300" y2="168" stroke="#1c150f" strokeWidth="1.2" />
          {[-240, -180, -120, -60].map((sx, i) => {
            const syTop = 150 + ((sx + 300) / 300) * 92 + (i % 2 === 0 ? 0 : 18);
            return <line key={`pl-seam-w-${sx}`} x1={sx} y1={syTop} x2={sx} y2={syTop + 18} stroke="#1f1812" strokeWidth="1.0" />;
          })}
          {[60, 120, 180, 240].map((sx, i) => {
            const syTop = 242 - (sx / 300) * 92 + (i % 2 === 0 ? 0 : 18);
            return <line key={`pl-seam-e-${sx}`} x1={sx} y1={syTop} x2={sx} y2={syTop + 18} stroke="#1c150f" strokeWidth="1.0" />;
          })}
        </g>

        {/* 基座顶边向阳高光倒角 */}
        <line x1="-300" y1="150" x2="0" y2="242" stroke="#d5cabb" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="0" y1="242" x2="300" y2="150" stroke="#a49787" strokeWidth="1.2" strokeLinecap="round" />
      </g>

      {/* ========================================================================= */}
      {/* B. 主屋台地外围【弧形干砌石围墙与石台阶】(Curved Bastion & Steps)            */}
      {/* ========================================================================= */}
      <g id="curved-bastion-terrace-perimeter">
        {/* 台地前庭平坦草皮 (Raised Terrace Forecourt Lawn) */}
        <path
          d="M-300,186 C-280,290 -240,410 -65,465 L65,465 C220,420 320,310 300,186 Z"
          fill="url(#ysTerraceTurfGrad)"
        />

        {/* 弧形挡土石墙垂直立面 (Curved Retaining Wall Face) */}
        {/* 西翼弧形段 */}
        <path
          d="M-280,260 C-260,350 -200,435 -65,465 L-65,491 C-200,461 -260,376 -280,286 Z"
          fill="url(#ysBastionFaceGradV2)"
          stroke="#261f18"
          strokeWidth="0.9"
        />
        {/* 东翼弧形段 */}
        <path
          d="M65,465 C200,435 280,350 320,260 L320,286 C280,376 200,461 65,491 Z"
          fill="#3e362d"
          stroke="#261f18"
          strokeWidth="0.9"
        />

        {/* 弧形墙体规整块面石缝阴影 (Masonry Seams on Curved Wall) */}
        <g opacity="0.6">
          <path d="M-280,273 C-260,363 -200,448 -65,478" fill="none" stroke="#211a14" strokeWidth="1.0" />
          <path d="M65,478 C200,448 280,363 320,273" fill="none" stroke="#1f1812" strokeWidth="1.0" />
          {[-230, -180, -130, -90].map((wx, i) => (
            <line key={`cw-seam-w-${i}`} x1={wx} y1={330 + i * 32} x2={wx + 2} y2={344 + i * 32} stroke="#211a14" strokeWidth="1.0" />
          ))}
          {[90, 130, 180, 230].map((wx, i) => (
            <line key={`cw-seam-e-${i}`} x1={wx} y1={426 - i * 32} x2={wx - 2} y2={440 - i * 32} stroke="#1f1812" strokeWidth="1.0" />
          ))}
        </g>

        {/* 墙顶厚实整齐的半圆石冠帽 (Coping Stones) */}
        <path
          d="M-280,260 C-260,350 -200,435 -65,465"
          fill="none"
          stroke="url(#ysBastionCapGradV2)"
          strokeWidth="6.0"
          strokeLinecap="round"
        />
        <path
          d="M-280,258.5 C-260,348.5 -200,433.5 -65,463.5"
          fill="none"
          stroke="#dcd2c4"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />

        <path
          d="M65,465 C200,435 280,350 320,260"
          fill="none"
          stroke="url(#ysBastionCapGradV2)"
          strokeWidth="6.0"
          strokeLinecap="round"
        />
        <path
          d="M65,463.5 C200,433.5 280,348.5 320,258.5"
          fill="none"
          stroke="#dcd2c4"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* 🌟 台地正中宽阔迎宾大石阶 (Grand Terraced Steps) */}
        <g id="bastion-central-stone-steps" transform={`translate(${layout.steps.anchor.x}, ${layout.steps.anchor.y})`}>
          {/* 接地阴影 */}
          <ellipse cx="0" cy="46" rx="72" ry="16" fill="#151e13" opacity="0.45" />

          {/* 第4级 (底阶·嵌入中景缓坡) */}
          <polygon points="-58,34 0,44 58,34 0,24" fill="#665b4f" stroke="#3d352b" strokeWidth="0.8" />
          <polygon points="-58,34 0,44 0,50 -58,40" fill="#4d4338" />
          <polygon points="0,44 58,34 58,40 0,50" fill="#383027" />

          {/* 第3级 */}
          <polygon points="-50,22 0,31 50,22 0,13" fill="#786c5e" stroke="#483f34" strokeWidth="0.8" />
          <polygon points="-50,22 0,31 0,37 -50,28" fill="#584e42" />
          <polygon points="0,31 50,22 50,28 0,37" fill="#42392f" />

          {/* 第2级 */}
          <polygon points="-42,10 0,18 42,10 0,2" fill="#8a7c6c" stroke="#54493c" strokeWidth="0.8" />
          <polygon points="-42,10 0,18 0,24 -42,16" fill="#635748" />
          <polygon points="0,18 42,10 42,16 0,24" fill="#4c4136" />

          {/* 第1级 (顶阶·与围墙台面齐平) */}
          <polygon points="-34,-1 0,6 34,-1 0,-8" fill="#9e907e" stroke="#605445" strokeWidth="0.8" />
          <polygon points="-34,-1 0,6 0,12 -34,5" fill="#6f6353" />
          <polygon points="0,6 34,-1 34,5 0,12" fill="#54483b" />

          {/* 台阶踏面高光微线 */}
          <line x1="-54" y1="34" x2="0" y2="43" stroke="#b8ad9e" strokeWidth="0.9" />
          <line x1="-46" y1="22" x2="0" y2="30" stroke="#c4b9aa" strokeWidth="0.9" />
          <line x1="-38" y1="10" x2="0" y2="17" stroke="#d2c7b8" strokeWidth="0.9" />

          {/* 台阶两侧英伦原木田园矮门 (Rustic Bastion Wicket Gate) */}
          <g
            id="terrace-wicket-gate"
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onTriggerToast?.('🚪 庄园台地原木小门 · 拾级而下，通向阳光明媚的中景缓坡');
            }}
            onMouseEnter={() => setHoveredObject?.('🚪 台地田园小门 · 连通主屋石台与下方中景缓坡牧场')}
            onMouseLeave={() => setHoveredObject?.(null)}
          >
            {/* 左立柱与合页 */}
            <rect x="-65" y="-12" width="6" height="32" rx="1.5" fill="#48321e" stroke="#26180c" strokeWidth="0.8" />
            <polygon points="-66,-12 -62,-16 -58,-12" fill="#63452b" />
            <rect x="-65" y="-4" width="10" height="2.5" fill="#1f2320" />
            <rect x="-65" y="10" width="10" height="2.5" fill="#1f2320" />

            {/* 右立柱与锁扣 */}
            <rect x="59" y="-12" width="6" height="32" rx="1.5" fill="#48321e" stroke="#26180c" strokeWidth="0.8" />
            <polygon points="58,-12 62,-16 66,-12" fill="#63452b" />

            {/* 左右对开的木条小栅门 (Open Wicket Gates) */}
            <g transform="rotate(-35 -65 0)">
              <line x1="-65" y1="0" x2="-40" y2="0" stroke="#755234" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="-65" y1="10" x2="-40" y2="10" stroke="#755234" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="-42" y1="-4" x2="-42" y2="16" stroke="#5a3d24" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="-64" y1="10" x2="-42" y2="0" stroke="#5a3d24" strokeWidth="2.0" />
            </g>
            <g transform="rotate(35 65 0)">
              <line x1="65" y1="0" x2="40" y2="0" stroke="#755234" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="65" y1="10" x2="40" y2="10" stroke="#755234" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="42" y1="-4" x2="42" y2="16" stroke="#5a3d24" strokeWidth="2.2" strokeLinecap="round" />
              <line x1="64" y1="10" x2="42" y2="0" stroke="#5a3d24" strokeWidth="2.0" />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
};
