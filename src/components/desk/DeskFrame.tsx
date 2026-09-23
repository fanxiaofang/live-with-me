import React from 'react';

export interface DeskFrameProps {
  onHover?: (hovered: boolean) => void;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

/**
 * 2.5D 北欧浅白橡木手工书桌骨架 (Craft Work Desk Frame)
 * 纯粹的独立 SVG 结构：
 * 包含地面接触软阴影、纤细锥形桌腿、黄铜脚套、结构拉梁以及浅白橡木台面
 */
export const DeskFrame: React.FC<DeskFrameProps> = ({
  onHover,
  onClick,
  children,
}) => {
  return (
    <g
      id="minimal-craft-desk-frame"
      className="cursor-pointer select-none group/deskframe"
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <defs>
        {/* 温暖柚木/木蜡油实木台面渐变 (Warm Oil-Waxed Wood Tone: 告别苍白，融入全屋温润木质) */}
        <linearGradient id="deskOakTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#eed7be" />
          <stop offset="45%" stopColor="#dfbe98" />
          <stop offset="100%" stopColor="#cb9e70" />
        </linearGradient>

        {/* 台面柔和木蜡油缎面光泽 */}
        <linearGradient id="deskTopSheenGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fff3e0" stopOpacity="0.25" />
          <stop offset="80%" stopColor="#dfbe98" stopOpacity="0" />
        </linearGradient>

        {/* 台面前沿立面渐变 (加厚扎实的温润原木边框) */}
        <linearGradient id="deskFrontEdgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a87140" />
          <stop offset="100%" stopColor="#875326" />
        </linearGradient>

        {/* 侧沿厚度渐变 (深邃暖木影) */}
        <linearGradient id="deskSideEdgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8c582c" />
          <stop offset="100%" stopColor="#623a1a" />
        </linearGradient>

        {/* 复古低调黄铜脚套反光 */}
        <linearGradient id="deskBrassTipGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="60%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#925907" />
        </linearGradient>
      </defs>

      {/* --- 1. 地面漫反射接触阴影 (四脚微印迹 + 桌面悬空柔和投影) --- */}
      <polygon
        points="-55,28 21,7 53,16 -21,37"
        fill="#24160d"
        opacity="0.22"
        filter="url(#softShadow)"
      />
      {/* 4 Delicate Leg Contact Footprints */}
      <ellipse cx="-53" cy="28" rx="3.5" ry="1.6" fill="#24160d" opacity="0.3" />
      <ellipse cx="21" cy="7" rx="3.5" ry="1.6" fill="#24160d" opacity="0.3" />
      <ellipse cx="-21" cy="37" rx="3.8" ry="1.7" fill="#24160d" opacity="0.35" />
      <ellipse cx="53" cy="16" rx="3.8" ry="1.7" fill="#24160d" opacity="0.35" />

      {/* --- 2. 4 Solid Sturdy Turned Legs (稳健实木圆柱桌腿，粗细增至 3.2px，分量感更扎实) --- */}
      {/* 靠墙左后腿 (Back Left Leg) */}
      <line x1="-53" y1="6" x2="-53" y2="28" stroke="#5a381b" strokeWidth="3.0" strokeLinecap="round" />
      <line x1="-53" y1="24" x2="-53" y2="28" stroke="url(#deskBrassTipGrad)" strokeWidth="3.2" strokeLinecap="round" />

      {/* 靠墙右后腿 (Back Right Leg) */}
      <line x1="21" y1="-15" x2="21" y2="7" stroke="#5a381b" strokeWidth="3.0" strokeLinecap="round" />
      <line x1="21" y1="3" x2="21" y2="7" stroke="url(#deskBrassTipGrad)" strokeWidth="3.2" strokeLinecap="round" />

      {/* 桌面下通透实木结构拉梁 (Under-Desk Solid Wood Apron Rails) */}
      <polygon points="-51,6 19,-13.8 19,-10.0 -51,9.8" fill="#4d2f16" />
      <polygon points="-51,9.8 -19,19.2 -19,23.0 -51,13.6" fill="#361f0d" />

      {/* 靠近镜头左前腿 (Front Left Leg: 稳固落地，温润受光) */}
      <line x1="-21" y1="14" x2="-21" y2="37" stroke="#784b25" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="-21.8" y1="16" x2="-21.8" y2="33" stroke="#9e6939" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />
      <line x1="-21" y1="33" x2="-21" y2="37" stroke="url(#deskBrassTipGrad)" strokeWidth="3.4" strokeLinecap="round" />

      {/* 靠近镜头右前腿 (Front Right Leg) */}
      <line x1="53" y1="-7" x2="53" y2="16" stroke="#784b25" strokeWidth="3.2" strokeLinecap="round" />
      <line x1="52.2" y1="-5" x2="52.2" y2="12" stroke="#9e6939" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />
      <line x1="53" y1="12" x2="53" y2="16" stroke="url(#deskBrassTipGrad)" strokeWidth="3.4" strokeLinecap="round" />

      {/* --- 3. 实木温润木蜡油桌面 (Solid Crafted Oiled Tabletop, 加厚至 4.5px 厚重质感) --- */}
      {/* 正立面前沿厚度 (增厚至 4.5px，告别单薄) */}
      <polygon
        points="-21,14.5 53,-6.6 53,-2.1 -21,19.0"
        fill="url(#deskFrontEdgeGrad)"
        stroke="#683d1b"
        strokeWidth="0.5"
      />
      {/* 左侧沿厚度 */}
      <polygon
        points="-53,5.4 -21,14.5 -21,19.0 -53,9.9"
        fill="url(#deskSideEdgeGrad)"
        stroke="#4a2a11"
        strokeWidth="0.5"
      />
      {/* 受光平整温润实木顶面 */}
      <polygon
        points="-53,5.4 21,-15.7 53,-6.6 -21,14.5"
        fill="url(#deskOakTopGrad)"
        stroke="#ba8f62"
        strokeWidth="0.7"
        className="transition-colors duration-200 group-hover/deskframe:brightness-[1.03]"
      />
      {/* 木蜡油柔光漫反射层 */}
      <polygon
        points="-53,5.4 21,-15.7 53,-6.6 -21,14.5"
        fill="url(#deskTopSheenGrad)"
      />
      {/* 边缘倒角温润浅金微光 (Warm Golden Edge Chamfer Highlight) */}
      <line x1="-21" y1="14.5" x2="53" y2="-6.6" stroke="#fff1db" strokeWidth="0.9" opacity="0.85" strokeLinecap="round" />
      <line x1="-53" y1="5.4" x2="-21" y2="14.5" stroke="#fce6ca" strokeWidth="0.8" opacity="0.7" strokeLinecap="round" />
      {/* 桌面淡淡质朴木质纹理细线 */}
      <line x1="-40" y1="3" x2="35" y2="-9.5" stroke="#ba8a59" strokeWidth="0.35" opacity="0.4" strokeDasharray="14 3 20 4" />
      <line x1="-30" y1="7" x2="45" y2="-5.5" stroke="#ba8a59" strokeWidth="0.35" opacity="0.35" strokeDasharray="18 4 10 3" />

      {/* 容纳桌面槽位物件的子容器 */}
      {children}
    </g>
  );
};
