import React from 'react';

/**
 * 2.5D 工匠级实木企口地板 (Artisan Tongue-and-Groove Hardwood Timber Flooring)
 * 
 * 严格基于小屋等轴测几何定义：
 * - 顶点：左 (-272, 135)、后 (0, 58)、右 (272, 135)、前 (0, 212)
 * - 宽轴向斜率：+0.283088 (沿前左-后右轴，dx=272, dy=77)
 * - 深轴向斜率：-0.283088 (沿后左-前右轴，dx=272, dy=-77)
 * - 包含：
 *   1. 柔和木蜡油温润渐变基底 (Honey Teak & Amber Oak Wood-Wax Patina)
 *   2. 16条等轴测细密木板分幅与板材微色差 (Plank Cadence & Micro-tone Variation)
 *   3. 定长交错拼缝 (Staggered Butt Joints / 企口暗榫接缝)
 *   4. 双线V-Groove微倒角阴影与迎光微高光 (Double-line V-Groove Milling)
 *   5. 前缘实木挑檐与收边地袱框梁 (Perimeter Sill Beam & Rim Joist Fascia)
 */

interface TimberFlooringProps {
  className?: string;
}

export const TimberFlooring: React.FC<TimberFlooringProps> = ({ className }) => {
  // 总计 16 块等距实木板，跨越 Y=58 到 Y=212 (跨度 154px)
  const TOTAL_PLANKS = 16;
  const Y_SPAN = 154;
  const PLANK_STEP = Y_SPAN / TOTAL_PLANKS; // ~9.625px

  // 单板微色差池（焦糖蜜糖暖橡木与日本扁柏微色差）
  const plankTones = [
    { fill: '#a87a4e', opacity: 0.14 },
    { fill: '#96683e', opacity: 0.18 },
    { fill: '#b08154', opacity: 0.12 },
    { fill: '#8f6137', opacity: 0.20 },
    { fill: '#a4764a', opacity: 0.15 },
    { fill: '#ba8c5e', opacity: 0.10 },
    { fill: '#94663c', opacity: 0.18 },
    { fill: '#a07246', opacity: 0.14 },
    { fill: '#ad7e52', opacity: 0.13 },
    { fill: '#8c5f35', opacity: 0.22 },
    { fill: '#a6784c', opacity: 0.15 },
    { fill: '#b58658', opacity: 0.11 },
    { fill: '#986a40', opacity: 0.17 },
    { fill: '#a37549', opacity: 0.14 },
    { fill: '#8e6037', opacity: 0.20 },
    { fill: '#a97b4f', opacity: 0.13 },
  ];

  // 定长错缝接缝（Staggered Joints）沿板纵向的切割位置定义
  // 沿 Axis A (Slope +0.2831)，每块板在不同 X 位置具有微小交错接缝
  const buttJoints = [
    { plankIdx: 1, x: -90 },
    { plankIdx: 1, x: 75 },
    { plankIdx: 2, x: -160 },
    { plankIdx: 2, x: 20 },
    { plankIdx: 3, x: -70 },
    { plankIdx: 3, x: 120 },
    { plankIdx: 4, x: -140 },
    { plankIdx: 4, x: 50 },
    { plankIdx: 5, x: -50 },
    { plankIdx: 5, x: 140 },
    { plankIdx: 6, x: -170 },
    { plankIdx: 6, x: -10 },
    { plankIdx: 6, x: 160 },
    { plankIdx: 7, x: -110 },
    { plankIdx: 7, x: 70 },
    { plankIdx: 8, x: -180 },
    { plankIdx: 8, x: 0 },
    { plankIdx: 8, x: 150 },
    { plankIdx: 9, x: -80 },
    { plankIdx: 9, x: 90 },
    { plankIdx: 10, x: -150 },
    { plankIdx: 10, x: 30 },
    { plankIdx: 11, x: -60 },
    { plankIdx: 11, x: 120 },
    { plankIdx: 12, x: -130 },
    { plankIdx: 12, x: 40 },
    { plankIdx: 13, x: -40 },
    { plankIdx: 13, x: 110 },
    { plankIdx: 14, x: -100 },
    { plankIdx: 14, x: 60 },
  ];

  return (
    <g id="artisan-timber-flooring" className={className}>
      <defs>
        {/* 1. 地板主裁切路径 (Strict Rhombus Clipping) */}
        <clipPath id="flooringPlankClip">
          <polygon points="-272,135 0,58 272,135 0,212" />
        </clipPath>

        {/* 2. 木蜡油实木基底渐变 (Honey Teak to Warm Cedar) */}
        <linearGradient id="hardwoodBaseWaxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ae8155" />
          <stop offset="35%" stopColor="#9e7146" />
          <stop offset="75%" stopColor="#8c5f36" />
          <stop offset="100%" stopColor="#7a4f29" />
        </linearGradient>

        {/* 3. 前左收边地袱梁渐变 (Front-Left Sill Rim Joist) */}
        <linearGradient id="rimBeamLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c4e2b" />
          <stop offset="100%" stopColor="#5a3419" />
        </linearGradient>

        {/* 4. 前右收边地袱梁渐变 (Front-Right Sill Rim Joist - Shadow Side) */}
        <linearGradient id="rimBeamRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#663c1e" />
          <stop offset="100%" stopColor="#482711" />
        </linearGradient>

        {/* 5. 前缘挑檐柔和投影渐变 */}
        <linearGradient id="rimNosingShadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#221208" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#221208" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ======================================================== */}
      {/* 1. 全屋实木底板 (Polished Solid Timber Floor Base)       */}
      {/* ======================================================== */}
      <polygon
        points="-272,135 0,58 272,135 0,212"
        fill="url(#hardwoodBaseWaxGrad)"
      />

      {/* ======================================================== */}
      {/* 2. 裁切范围内的精工实木条板 (Clipped Artisan Planks)     */}
      {/* ======================================================== */}
      <g clipPath="url(#flooringPlankClip)">
        {/* 单板微色差层 (Individual Plank Tone Variations) */}
        {Array.from({ length: TOTAL_PLANKS }).map((_, idx) => {
          const yInterceptTop = 58 + idx * PLANK_STEP;
          const yInterceptBot = yInterceptTop + PLANK_STEP;
          const tone = plankTones[idx % plankTones.length];

          // 宽轴向斜率 0.283088
          const slope = 0.283088;
          const xL = -320;
          const xR = 320;
          const yLTop = yInterceptTop + slope * xL;
          const yRTop = yInterceptTop + slope * xR;
          const yLBot = yInterceptBot + slope * xL;
          const yRBot = yInterceptBot + slope * xR;

          return (
            <polygon
              key={`plank-tone-${idx}`}
              points={`${xL},${yLTop} ${xR},${yRTop} ${xR},${yRBot} ${xL},${yLBot}`}
              fill={tone.fill}
              opacity={tone.opacity}
            />
          );
        })}

        {/* 双线 V-Groove 企口微倒角嵌缝 (Double-line V-Groove Plank Seams) */}
        {Array.from({ length: TOTAL_PLANKS - 1 }).map((_, idx) => {
          const yIntercept = 58 + (idx + 1) * PLANK_STEP;
          const slope = 0.283088;
          const x1 = -320;
          const y1 = yIntercept + slope * x1;
          const x2 = 320;
          const y2 = yIntercept + slope * x2;

          return (
            <g key={`seam-${idx}`}>
              {/* 企口暗槽深色阴影线 (Dark Crevice) */}
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#3e2311"
                strokeWidth="0.85"
                opacity="0.38"
              />
              {/* 迎光微倒角高光线 (Warm Satin Micro-bevel Chamfer) */}
              <line
                x1={x1}
                y1={y1 + 0.45}
                x2={x2}
                y2={y2 + 0.45}
                stroke="#f0cb9e"
                strokeWidth="0.4"
                opacity="0.35"
              />
            </g>
          );
        })}

        {/* 定长错缝接缝 (Staggered Butt Joints / 企口拼缝暗线) */}
        {buttJoints.map((bj, i) => {
          // 当前木板的 Y 截距
          const yCenter = 58 + (bj.plankIdx + 0.5) * PLANK_STEP;
          // 板上中心点坐标
          const y = yCenter + 0.283088 * bj.x;
          // 横截缝沿深轴 (Slope = -0.283088)
          const halfW = 4.8;
          const halfH = halfW * 0.283088;

          return (
            <g key={`butt-joint-${i}`}>
              {/* 暗缝 */}
              <line
                x1={bj.x - halfW}
                y1={y + halfH}
                x2={bj.x + halfW}
                y2={y - halfH}
                stroke="#331c0d"
                strokeWidth="0.9"
                opacity="0.42"
              />
              {/* 接缝微倒角反光 */}
              <line
                x1={bj.x - halfW}
                y1={y + halfH + 0.4}
                x2={bj.x + halfW}
                y2={y - halfH + 0.4}
                stroke="#edd2af"
                strokeWidth="0.35"
                opacity="0.30"
              />
            </g>
          );
        })}

        {/* 自然原木微纹理 (Subtle Organic Wood Grain Waves) */}
        <path
          d="M-200,80 Q-100,105 0,135 T200,195"
          stroke="#e8be8d"
          strokeWidth="0.6"
          strokeDasharray="40 18 60 25"
          opacity="0.12"
          fill="none"
        />
        <path
          d="M-150,60 Q-50,86 50,116 T220,165"
          stroke="#422511"
          strokeWidth="0.5"
          strokeDasharray="50 30 70 20"
          opacity="0.08"
          fill="none"
        />
      </g>

      {/* ======================================================== */}
      {/* 3. 前缘实木收边地袱大梁 (Perimeter Sill Beam / 縁側框梁) */}
      {/* ======================================================== */}
      <g id="flooring-perimeter-rim-joist">
        {/* --- 前左侧收边大梁 (Front-Left Fascia Timber) --- */}
        {/* 梁身立面 (厚度 7px: Y 212->219, -272,135->142) */}
        <polygon
          points="-272,135 0,212 0,219 -272,142"
          fill="url(#rimBeamLeftGrad)"
          stroke="#422411"
          strokeWidth="0.7"
        />
        {/* 梁顶 45° 倒角高光线 (Top Chamfer Highlight) */}
        <line
          x1="-272"
          y1="135"
          x2="0"
          y2="212"
          stroke="#e2b484"
          strokeWidth="0.9"
          opacity="0.85"
        />
        {/* 梁底阴影收口 (Bottom Shadow Crease) */}
        <line
          x1="-272"
          y1="142"
          x2="0"
          y2="219"
          stroke="#2d170b"
          strokeWidth="0.8"
        />

        {/* --- 前右侧收边大梁 (Front-Right Fascia Timber - Shadow Side) --- */}
        <polygon
          points="0,212 272,135 272,142 0,219"
          fill="url(#rimBeamRightGrad)"
          stroke="#361c0c"
          strokeWidth="0.7"
        />
        {/* 右侧梁顶微光 */}
        <line
          x1="0"
          y1="212"
          x2="272"
          y2="135"
          stroke="#bf9062"
          strokeWidth="0.8"
          opacity="0.75"
        />
        {/* 右侧梁底暗线 */}
        <line
          x1="0"
          y1="219"
          x2="272"
          y2="142"
          stroke="#200e05"
          strokeWidth="0.8"
        />

        {/* 梁体实木端头榫卯与木楔栓钉 (Timber Joinery Pegs / Tenon Caps) */}
        {[-210, -150, -90, -30, 30, 90, 150, 210].map((px) => {
          const isLeft = px < 0;
          const py = 215.5 + (isLeft ? 0.283088 * px : -0.283088 * px);
          return (
            <g key={`beam-peg-${px}`}>
              {/* 沉孔阴影 */}
              <circle cx={px} cy={py} r="1.4" fill="#241308" opacity="0.8" />
              {/* 黄铜/硬木楔钉头 */}
              <circle cx={px - 0.2} cy={py - 0.2} r="0.9" fill="#946b3f" />
            </g>
          );
        })}

        {/* 门廊中央榫接咬合块 (Center Threshold Joint) */}
        <polygon
          points="-6,210.3 0,212 6,210.3 6,217.3 0,219 -6,217.3"
          fill="#523118"
          stroke="#38200e"
          strokeWidth="0.6"
        />
      </g>
    </g>
  );
};
