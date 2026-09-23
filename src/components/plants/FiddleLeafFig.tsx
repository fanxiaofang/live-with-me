import React, { useState } from 'react';

export interface FiddleLeafFigProps {
  onHover?: (hovered: boolean) => void;
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * 2.5D 治愈系高定北欧风琴叶榕 (Ficus Lyrata)
 * 彻底重构特色：
 * 1. 摒弃平庸千篇一律的红土盆：升级为【北欧哑光燕麦砂陶竖棱圆筒盆 + 天然胡桃木纯色十字高脚架】
 * 2. 真实琴叶榕植物学生态：
 *    - 经典小提琴腰身轮廓与波浪起伏卷边（Violin/Lyre leathery silhouette with undulating wavy margins）
 *    - 标志性人字形羽状叶脉与革质叶面漫反射高光
 *    - 木质化主干带叶痕环纹（Leaf scars）与节间红棕色干苞鞘（Papery brown stipule sheaths）
 *    - 顶端初展的亮黄绿折叠幼叶与新生顶芽
 *    - 盆口覆盖湿润多孔黑土，点缀火山浮石与微型青苔
 * 3. 灵动微交互：点击微风摇曳轻颤、露水微光闪烁与精致悬浮标签
 */
export const FiddleLeafFig: React.FC<FiddleLeafFigProps> = ({ onHover, onClick }) => {
  const [rustle, setRustle] = useState(false);
  const [sparkleEffect, setSparkleEffect] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    onClick?.(e);
    setRustle(true);
    setSparkleEffect(true);
    setTimeout(() => setRustle(false), 950);
    setTimeout(() => setSparkleEffect(false), 1400);
  };

  return (
    <g
      id="component-fiddle-leaf-fig"
      className="cursor-pointer select-none group/fig"
      onClick={handleClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <defs>
        {/* 北欧燕麦白哑光陶瓷筒渐变 */}
        <linearGradient id="figPotOatmealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f7f5f0" />
          <stop offset="22%" stopColor="#ede7dc" />
          <stop offset="65%" stopColor="#ded5c5" />
          <stop offset="100%" stopColor="#b5aa99" />
        </linearGradient>

        {/* 陶瓷筒内口阴影与陶壁 */}
        <linearGradient id="figPotInnerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#e8e2d5" />
          <stop offset="50%" stopColor="#d5ccbd" />
          <stop offset="100%" stopColor="#9c907e" />
        </linearGradient>

        {/* 胡桃木腿渐变 */}
        <linearGradient id="figWoodLegGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8a5a36" />
          <stop offset="50%" stopColor="#694123" />
          <stop offset="100%" stopColor="#4a2c14" />
        </linearGradient>

        {/* 盆内营养沃土与微苔藓 */}
        <radialGradient id="figSoilGrad" cx="45%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#3d281a" />
          <stop offset="60%" stopColor="#25160d" />
          <stop offset="100%" stopColor="#140b06" />
        </radialGradient>

        {/* 琴叶榕深邃下层阔叶 (稳重深墨绿) */}
        <linearGradient id="figLeafDeepGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e4428" />
          <stop offset="55%" stopColor="#14331c" />
          <stop offset="100%" stopColor="#0d2413" />
        </linearGradient>

        {/* 琴叶榕受光革质中层主叶 (温润自然森林绿，消除刺眼荧光绿) */}
        <linearGradient id="figLeafLushGrad" x1="0%" y1="0%" x2="80%" y2="100%">
          <stop offset="0%" stopColor="#2e6839" />
          <stop offset="40%" stopColor="#23542d" />
          <stop offset="85%" stopColor="#183f21" />
          <stop offset="100%" stopColor="#112c17" />
        </linearGradient>

        {/* 琴叶榕向阳冠叶 (柔和沉稳暖橄榄绿，温润舒适) */}
        <linearGradient id="figLeafSunlitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3d7e48" />
          <stop offset="45%" stopColor="#2c6835" />
          <stop offset="100%" stopColor="#1e4e27" />
        </linearGradient>

        {/* 顶芽初生娇叶 (柔和嫩芽绿，避免过度荧光发光) */}
        <linearGradient id="figSproutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#68a872" />
          <stop offset="40%" stopColor="#4c8e57" />
          <stop offset="100%" stopColor="#2e6938" />
        </linearGradient>
      </defs>

      {/* --- 1. 地面漫反射接触阴影 (花架脚与陶筒在木地板上的投影) --- */}
      <ellipse cx="0" cy="15.5" rx="12" ry="5.2" fill="#1b120c" opacity="0.3" filter="url(#softShadow)" />

      {/* --- 2. 北欧实木十字高脚架 (Mid-Century Modern Timber Stand) --- */}
      {/* 2.1 后侧支腿 (在花盆背面) */}
      <g id="fig-stand-back-legs">
        {/* 后左腿 */}
        <line x1="-7.2" y1="4.0" x2="-8.0" y2="14.2" stroke="url(#figWoodLegGrad)" strokeWidth="1.8" strokeLinecap="round" />
        {/* 后右腿 */}
        <line x1="7.2" y1="3.2" x2="8.0" y2="13.2" stroke="url(#figWoodLegGrad)" strokeWidth="1.8" strokeLinecap="round" />
      </g>

      {/* --- 3. 极简北欧哑光燕麦白竖棱圆筒陶盆 (Nordic Fluted Ceramic Cylinder Planter) --- */}
      <g id="fig-fluted-planter">
        {/* 3.1 圆筒陶盆主体轮廓 */}
        <path
          d="M-8.2,-1.5 L-7.5,9.5 A7.5,3.0 0 0,0 7.5,9.5 L8.2,-1.5 Z"
          fill="url(#figPotOatmealGrad)"
          stroke="#9e917d"
          strokeWidth="0.4"
        />

        {/* 3.2 高级感立体竖棱凹凸纹理 (Architectural Vertical Fluting: 彻底告别粗笨大花盆) */}
        <path d="M-6.2,-1.2 L-5.8,9.8" stroke="#ffffff" strokeWidth="0.5" opacity="0.6" />
        <path d="M-5.6,-1.2 L-5.2,9.8" stroke="#b0a38f" strokeWidth="0.55" opacity="0.45" />

        <path d="M-3.8,-1.0 L-3.5,10.2" stroke="#ffffff" strokeWidth="0.5" opacity="0.65" />
        <path d="M-3.2,-1.0 L-2.9,10.2" stroke="#b0a38f" strokeWidth="0.55" opacity="0.4" />

        <path d="M-1.2,-0.8 L-1.0,10.5" stroke="#ffffff" strokeWidth="0.5" opacity="0.7" />
        <path d="M-0.6,-0.8 L-0.4,10.5" stroke="#b0a38f" strokeWidth="0.55" opacity="0.4" />

        <path d="M1.4,-0.8 L1.2,10.5" stroke="#ffffff" strokeWidth="0.5" opacity="0.55" />
        <path d="M2.0,-0.8 L1.8,10.5" stroke="#9e917d" strokeWidth="0.55" opacity="0.5" />

        <path d="M4.0,-1.0 L3.7,10.2" stroke="#ffffff" strokeWidth="0.45" opacity="0.45" />
        <path d="M4.6,-1.0 L4.3,10.2" stroke="#8c7f6b" strokeWidth="0.55" opacity="0.6" />

        <path d="M6.2,-1.2 L5.8,9.8" stroke="#8c7f6b" strokeWidth="0.6" opacity="0.65" />

        {/* 3.3 盆底边缘微圆弧投影 */}
        <path d="M-7.5,9.5 A7.5,3.0 0 0,0 7.5,9.5" fill="none" stroke="#756755" strokeWidth="0.6" opacity="0.5" />

        {/* 3.4 陶筒口部与沃土 (Potting Soil & Surface Dressing) */}
        <ellipse cx="0" cy="-1.5" rx="8.2" ry="3.1" fill="url(#figPotInnerGrad)" stroke="#8f826f" strokeWidth="0.4" />
        <ellipse cx="0" cy="-1.3" rx="7.4" ry="2.6" fill="url(#figSoilGrad)" />

        {/* 表面白石铺面与青苔生态点缀 (Pumice & Moss Accents) */}
        <ellipse cx="-4.2" cy="-1.2" rx="1.1" ry="0.6" fill="#f1ece3" opacity="0.8" />
        <ellipse cx="3.6" cy="-1.0" rx="0.9" ry="0.5" fill="#e5dfd5" opacity="0.85" />
        <ellipse cx="1.5" cy="-2.0" rx="1.2" ry="0.6" fill="#f8fafc" opacity="0.75" />
        {/* 生机微苔斑 */}
        <ellipse cx="-1.8" cy="-1.4" rx="1.5" ry="0.7" fill="#2d5e37" opacity="0.7" />
        <ellipse cx="2.2" cy="-1.6" rx="1.2" ry="0.6" fill="#3f7a4c" opacity="0.65" />
      </g>

      {/* 2.2 前侧胡桃木支腿与十字环抱榫卯 (Front Stand Frame) */}
      <g id="fig-stand-front-legs">
        {/* 横向咬合木托梁 */}
        <path d="M-8.2,6.5 Q0,9.0 8.2,6.5" fill="none" stroke="#54331a" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M-8.2,6.2 Q0,8.7 8.2,6.2" fill="none" stroke="#8c5832" strokeWidth="0.7" strokeLinecap="round" />

        {/* 前左腿 */}
        <line x1="-7.5" y1="4.8" x2="-8.5" y2="15.8" stroke="url(#figWoodLegGrad)" strokeWidth="2.0" strokeLinecap="round" />

        {/* 前右腿 */}
        <line x1="7.5" y1="4.0" x2="8.5" y2="14.8" stroke="url(#figWoodLegGrad)" strokeWidth="2.0" strokeLinecap="round" />
      </g>

      {/* --- 4. 琴叶榕真实木质主干与节间生态 (Woody S-Curved Trunk & Botanical Nodes) --- */}
      <g id="fig-trunk-system">
        {/* 木质基部粗壮根颈 */}
        <path d="M-1.8,-1.2 Q0,-1.0 1.8,-1.2 L1.2,-3.5 L-1.2,-3.5 Z" fill="#3b2515" />
        {/* 优雅苍劲主茎干 (S-Curved Lignified Trunk) */}
        <path
          d="M0,-1.5 Q-1.5,-9 0.8,-18 Q2.5,-24 1.2,-32 Q0.5,-37 0.8,-42"
          fill="none"
          stroke="#442a17"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        {/* 主干向阳木纹高光 */}
        <path
          d="M0.4,-2 Q-0.8,-9 1.4,-18 Q2.8,-24 1.6,-32"
          fill="none"
          stroke="#734c2d"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* 琴叶榕关键植物学特征：叶节脱落后的木质化环痕 (Leaf Scars) */}
        <ellipse cx="-0.2" cy="-6" rx="1.5" ry="0.5" fill="none" stroke="#2a180c" strokeWidth="0.5" opacity="0.75" />
        <ellipse cx="0.6" cy="-12" rx="1.4" ry="0.45" fill="none" stroke="#2a180c" strokeWidth="0.5" opacity="0.7" />
        <ellipse cx="1.6" cy="-21" rx="1.3" ry="0.4" fill="none" stroke="#2a180c" strokeWidth="0.5" opacity="0.7" />

        {/* 琴叶榕独有的红棕色纸质干苞片/托叶鞘 (Papery Brown Stipule Sheaths at Nodes) */}
        <path d="M-0.8,-12 Q-1.8,-14 -1.2,-16 Q-0.2,-15 0.5,-13 Z" fill="#6d3a1f" opacity="0.85" />
        <path d="M1.2,-21 Q2.6,-23 2.0,-25.5 Q0.8,-24 0.6,-22 Z" fill="#6d3a1f" opacity="0.85" />
        <path d="M0.5,-31 Q1.8,-34 1.2,-36.5 Q0.2,-34 0.2,-32 Z" fill="#7a4123" opacity="0.9" />

        {/* 侧向微木质叶柄分枝 */}
        <path d="M0.2,-10 Q-4,-13 -7,-16" fill="none" stroke="#3d2514" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M1.2,-15 Q6,-18 9,-22" fill="none" stroke="#3d2514" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M1.8,-24 Q7,-28 10,-32" fill="none" stroke="#3d2514" strokeWidth="1.3" strokeLinecap="round" />
      </g>

      {/* --- 5. 2.5D 有机层叠琴叶榕大叶冠 (Lush Fiddle Leaf Canopy) --- */}
      {/* 点击或悬浮时产生整株生动微颤摇曳动画 */}
      <g
        id="fig-canopy-group"
        className={`origin-[0_0] transition-transform duration-700 ease-out ${
          rustle ? 'scale-[1.03] rotate-1' : 'group-hover/fig:scale-[1.01]'
        }`}
      >
        {/* 5.1 远景深色背景阔叶 (Back Depth Leaves: 构筑浓郁森林质感底色) */}
        <g id="fig-leaf-back-left" transform="translate(-4, -18) rotate(-28)">
          {/* 提琴轮廓：宽大钝圆顶端与明显收腰 */}
          <path
            d="M0,0 C-3,-3 -5,-5 -6,-8 C-7.5,-12 -5.5,-15 -7.5,-19 C-9.5,-23 -7,-28 -2,-30 C3,-32 7,-28 7,-23 C7,-18 5,-14 3,-10 C1.5,-7 0.5,-3 0,0 Z"
            fill="url(#figLeafDeepGrad)"
            stroke="#0b1e10"
            strokeWidth="0.5"
          />
          {/* 主脉 */}
          <path d="M0,0 Q-1,-15 -0.5,-29" fill="none" stroke="#2f663b" strokeWidth="0.9" opacity="0.6" />
        </g>

        <g id="fig-leaf-back-right" transform="translate(4, -20) rotate(24)">
          <path
            d="M0,0 C3,-3 5,-5 6.5,-8 C8,-12 6,-15 8,-19 C10,-23 7.5,-28 2.5,-30 C-2.5,-32 -6.5,-28 -6.5,-23 C-6.5,-18 -4.5,-14 -2.5,-10 C-1,-7 -0.5,-3 0,0 Z"
            fill="url(#figLeafDeepGrad)"
            stroke="#0b1e10"
            strokeWidth="0.5"
          />
          <path d="M0,0 Q1,-15 1,-29" fill="none" stroke="#2f663b" strokeWidth="0.9" opacity="0.6" />
        </g>

        {/* 5.2 左下方垂展大琴叶 (Front-Left Spreading Leathery Violin Leaf) */}
        <g id="fig-leaf-front-left" transform="translate(-7, -16) rotate(-16)">
          {/* 叶身收腰波浪曲线 */}
          <path
            d="M0,0 C-4,-3 -7,-4 -9,-8 C-11,-12 -8,-16 -11.5,-21 C-14,-25 -10,-31 -3.5,-32 C3,-33 7,-28 6,-22 C5.5,-17 3,-13 1,-9 C-0.5,-6 0,-2 0,0 Z"
            fill="url(#figLeafLushGrad)"
            stroke="#122c17"
            strokeWidth="0.5"
          />
          {/* 向光受光半叶柔和漫反射 (哑光革质光泽，沉静柔和) */}
          <path
            d="M0,0 C-4,-3 -7,-4 -9,-8 C-11,-12 -8,-16 -11.5,-21 C-14,-25 -10,-31 -3.5,-32 Q-2,-16 0,0 Z"
            fill="#387a46"
            opacity="0.5"
          />

          {/* 细腻主叶脉 (温和草木绿，告别刺眼高光) */}
          <path d="M0,0 Q-4,-15 -4.5,-31" fill="none" stroke="#68a872" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />

          {/* 人字形羽状侧脉 (低对比柔和融入叶肉) */}
          <path d="M-1,-5 Q-5,-6 -8,-7.5" fill="none" stroke="#68a872" strokeWidth="0.45" opacity="0.6" />
          <path d="M-2,-9 Q-7,-10 -9.5,-12.5" fill="none" stroke="#68a872" strokeWidth="0.45" opacity="0.6" />
          <path d="M-3,-14 Q-9,-15 -11.5,-18" fill="none" stroke="#68a872" strokeWidth="0.5" opacity="0.6" />
          <path d="M-4,-20 Q-10,-22 -12,-26" fill="none" stroke="#68a872" strokeWidth="0.45" opacity="0.55" />
          <path d="M-4.2,-25 Q-8,-28 -6,-30.5" fill="none" stroke="#68a872" strokeWidth="0.4" opacity="0.5" />

          {/* 右侧羽脉 */}
          <path d="M-1,-6 Q2,-8 4.5,-10" fill="none" stroke="#52935d" strokeWidth="0.4" opacity="0.55" />
          <path d="M-2,-11 Q2.5,-13 5,-15.5" fill="none" stroke="#52935d" strokeWidth="0.4" opacity="0.55" />
          <path d="M-3,-17 Q3,-19 5.5,-23" fill="none" stroke="#52935d" strokeWidth="0.45" opacity="0.55" />
          <path d="M-4,-23 Q1.5,-26 2,-29" fill="none" stroke="#52935d" strokeWidth="0.4" opacity="0.5" />

          {/* 边缘微弱暗调轮廓 */}
          <path
            d="M-9,-8 Q-12,-16 -11.5,-21 Q-14,-25 -10,-31"
            fill="none"
            stroke="#458252"
            strokeWidth="0.3"
            opacity="0.4"
          />
        </g>

        {/* 5.3 右侧舒展大琴叶 (Front-Right Dominant Leaf with Leathery Luster) */}
        <g id="fig-leaf-front-right" transform="translate(8, -21) rotate(18)">
          <path
            d="M0,0 C4,-3 7,-4 9,-8 C11,-12 8,-16 12,-21 C14.5,-25 11,-31 4.5,-32 C-2,-33 -6,-28 -5.5,-22 C-5,-17 -2.5,-13 -0.5,-9 C0.5,-6 0,-2 0,0 Z"
            fill="url(#figLeafLushGrad)"
            stroke="#122c17"
            strokeWidth="0.5"
          />
          {/* 背光侧轻微沉淀 */}
          <path
            d="M0,0 C4,-3 7,-4 9,-8 C11,-12 8,-16 12,-21 C14.5,-25 11,-31 4.5,-32 Q2,-16 0,0 Z"
            fill="#3a7d49"
            opacity="0.45"
          />

          {/* 主叶脉 */}
          <path d="M0,0 Q4,-15 5.5,-31" fill="none" stroke="#68a872" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />

          {/* 右侧羽脉 */}
          <path d="M1,-5 Q5,-6 8,-7.5" fill="none" stroke="#68a872" strokeWidth="0.45" opacity="0.6" />
          <path d="M2,-9 Q7,-10 9.8,-12.5" fill="none" stroke="#68a872" strokeWidth="0.45" opacity="0.6" />
          <path d="M3,-14 Q9,-15 12,-18" fill="none" stroke="#68a872" strokeWidth="0.5" opacity="0.6" />
          <path d="M4,-20 Q10,-22 12.5,-26" fill="none" stroke="#68a872" strokeWidth="0.45" opacity="0.55" />

          {/* 左侧羽脉 */}
          <path d="M1,-6 Q-2,-8 -4.2,-10" fill="none" stroke="#52935d" strokeWidth="0.4" opacity="0.55" />
          <path d="M2,-11 Q-2.5,-13 -4.8,-15.5" fill="none" stroke="#52935d" strokeWidth="0.4" opacity="0.55" />
          <path d="M3,-17 Q-2.8,-19 -4.5,-23" fill="none" stroke="#52935d" strokeWidth="0.45" opacity="0.55" />

          {/* 柔和哑光漫光带 */}
          <path
            d="M2,-6 Q5,-14 6,-22 Q4,-26 2,-22"
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.6"
            opacity="0.15"
            strokeLinecap="round"
          />
        </g>

        {/* 5.4 中上层挺立主冠叶 (Crown Upright Flaring Violin Leaf) */}
        <g id="fig-leaf-crown-main" transform="translate(1, -29) rotate(-4)">
          <path
            d="M0,0 C-3,-3 -5.5,-5 -6.5,-9 C-7.5,-13 -4.5,-17 -6.5,-22 C-8,-26.5 -4,-32 1.5,-32.5 C7,-33 10,-28 9.5,-22 C9,-17 6.5,-13 4.5,-9 C3,-6 1,-2 0,0 Z"
            fill="url(#figLeafSunlitGrad)"
            stroke="#153b1e"
            strokeWidth="0.5"
          />
          {/* 受光提亮面 (沉稳橄榄林绿，消除原先荧光浅绿) */}
          <path
            d="M0,0 C-3,-3 -5.5,-5 -6.5,-9 C-7.5,-13 -4.5,-17 -6.5,-22 C-8,-26.5 -4,-32 1.5,-32.5 Q1,-16 0,0 Z"
            fill="#4a8f56"
            opacity="0.4"
          />

          {/* 主叶脉 */}
          <path d="M0,0 Q1,-16 1.8,-31.5" fill="none" stroke="#7ab884" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />

          {/* 细腻侧羽脉 */}
          <path d="M0.2,-5 Q-3.5,-7 -5.5,-8.5" fill="none" stroke="#7ab884" strokeWidth="0.45" opacity="0.6" />
          <path d="M0.5,-10 Q-4.5,-12 -6.2,-14.5" fill="none" stroke="#7ab884" strokeWidth="0.45" opacity="0.6" />
          <path d="M0.8,-15 Q-5,-17 -6.8,-20" fill="none" stroke="#7ab884" strokeWidth="0.5" opacity="0.6" />
          <path d="M1.2,-21 Q-4,-24 -5.5,-27" fill="none" stroke="#7ab884" strokeWidth="0.4" opacity="0.55" />

          <path d="M0.4,-6 Q3.8,-8 5.8,-9.5" fill="none" stroke="#68a872" strokeWidth="0.4" opacity="0.55" />
          <path d="M0.8,-11 Q4.8,-13 7.5,-15.5" fill="none" stroke="#68a872" strokeWidth="0.45" opacity="0.55" />
          <path d="M1.2,-16 Q5.5,-18 8.2,-21.5" fill="none" stroke="#68a872" strokeWidth="0.45" opacity="0.55" />
          <path d="M1.5,-22 Q4.8,-25 6.5,-27.5" fill="none" stroke="#68a872" strokeWidth="0.4" opacity="0.5" />
        </g>

        {/* 5.5 顶端新生娇嫩黄绿卷叶与芽尖 (Emerging Apical Sprout & Baby Leaf) */}
        <g id="fig-tender-sprout" transform="translate(1, -38)">
          {/* 初展微卷小提琴嫩叶 (柔和自然淡绿) */}
          <path
            d="M0,0 C-2,-2 -3.5,-4 -3.8,-6.5 C-4,-9 -2,-11 0.5,-11.5 C3,-12 4.5,-9.5 4,-7 C3.5,-4.8 2,-3 0,0 Z"
            fill="url(#figSproutGrad)"
            stroke="#1b4d26"
            strokeWidth="0.35"
          />
          {/* 嫩脉 */}
          <path d="M0,0 Q0.3,-5 0.5,-11" fill="none" stroke="#8ec898" strokeWidth="0.5" strokeLinecap="round" opacity="0.75" />

          {/* 顶端直立红褐色绒毛保护芽苞 (Apical Bud Sheath) */}
          <path d="M0,-1 Q0.8,-4 0.5,-7 Q-0.2,-4 0,-1 Z" fill="#78350f" stroke="#3b1504" strokeWidth="0.25" />
        </g>
      </g>

      {/* --- 6. 交互点击时的治愈微光 / 露水微闪 (Interactive Sparkle Effects) --- */}
      {sparkleEffect && (
        <g id="fig-sparkles" className="animate-[ping_1.1s_ease-out]">
          <circle cx="-9" cy="-35" r="1.5" fill="#a7f3d0" opacity="0.95" />
          <circle cx="12" cy="-42" r="1.3" fill="#fef08a" opacity="0.9" />
          <circle cx="2" cy="-50" r="1.6" fill="#6ee7b7" opacity="0.9" />
          {/* 四芒微星 */}
          <path d="M-8,-36 L-6,-36 L-7,-38 L-7,-34 Z" fill="#ffffff" />
          <path d="M11,-43 L13,-43 L12,-45 L12,-41 Z" fill="#ffffff" />
        </g>
      )}

      {/* --- 7. 悬浮精致标签 (Hover Tooltip Badge) --- */}
      <g
        transform="translate(0, -56)"
        className="opacity-0 group-hover/fig:opacity-100 transition-opacity duration-200 pointer-events-none"
      >
        <rect x="-42" y="-10" width="84" height="20" rx="10" fill="#18231c" opacity="0.92" />
        <text x="0" y="4" fill="#e2f7e8" fontSize="9.5" fontWeight="bold" textAnchor="middle">
          🌿 优雅琴叶榕
        </text>
      </g>
    </g>
  );
};
