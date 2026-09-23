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
          <stop offset="0%" stopColor="#1b4625" />
          <stop offset="55%" stopColor="#12351b" />
          <stop offset="100%" stopColor="#0a2211" />
        </linearGradient>

        {/* 琴叶榕受光革质中层主叶 (自然油亮墨绿，蜡质厚实质感) */}
        <linearGradient id="figLeafLushGrad" x1="0%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#296636" />
          <stop offset="45%" stopColor="#1e5229" />
          <stop offset="85%" stopColor="#143b1c" />
          <stop offset="100%" stopColor="#0d2913" />
        </linearGradient>

        {/* 琴叶榕向阳中上层主叶 (明朗林绿，叶肉饱满) */}
        <linearGradient id="figLeafSunlitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3c8449" />
          <stop offset="45%" stopColor="#2a6a35" />
          <stop offset="100%" stopColor="#194823" />
        </linearGradient>

        {/* 顶冠杯状新生娇叶 (鲜亮黄绿，薄嫩透光) */}
        <linearGradient id="figLeafCrownGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#68b44e" />
          <stop offset="45%" stopColor="#4f9a38" />
          <stop offset="100%" stopColor="#2e6d22" />
        </linearGradient>

        {/* 琴叶榕标志性翻卷叶背嫩黄绿 (Underside Leaf Curl: 浅草绿透光层次) */}
        <linearGradient id="figLeafUnderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b4e476" />
          <stop offset="45%" stopColor="#93cf57" />
          <stop offset="100%" stopColor="#6ea838" />
        </linearGradient>

        {/* 粗壮凸起浅黄绿主叶脉渐变 (Thick Pale Chartreuse Midrib) */}
        <linearGradient id="figVeinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d8f892" />
          <stop offset="50%" stopColor="#b5e66a" />
          <stop offset="100%" stopColor="#82b844" />
        </linearGradient>

        {/* 革质蜡光表面高光 (Glossy Satin Sheen) */}
        <linearGradient id="figLeafSheenGrad" x1="0%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
        </linearGradient>

        {/* 顶芽初生娇嫩小叶 */}
        <linearGradient id="figSproutGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7ac45c" />
          <stop offset="50%" stopColor="#58a43c" />
          <stop offset="100%" stopColor="#367a24" />
        </linearGradient>
      </defs>

      {/* 
        【室内比例黄金重整】：
        以地面接触基准点 (0, 15.5) 为缩放原点进行 0.74x 紧凑化等比校准：
        - 盆底与阴影稳贴木地板基线；
        - 叶冠高度从 65px 优化为约 48px，彻底告别过大遮挡墙面挂画问题；
        - 冠幅与卧榻、书架、懒人沙发形成协调的室内家具生态天际线。
      */}
      <g transform="translate(0, 15.5) scale(0.74) translate(0, -15.5)">
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

      {/* --- 4. 琴叶榕真实木质主干与节间生态 (Woody Lignified Trunk & Botanical Nodes) --- */}
      <g id="fig-trunk-system">
        {/* 木质基部粗壮根颈 */}
        <path d="M-2.0,-1.2 Q0,-1.0 2.0,-1.2 L1.4,-3.8 L-1.4,-3.8 Z" fill="#3b2515" />
        {/* 优雅挺拔主茎干 (Sturdy Upright Trunk with subtle botanical curvature) */}
        <path
          d="M0,-1.5 Q-1.2,-10 0.5,-18 Q1.8,-26 0.8,-34 Q0.2,-40 0.5,-45"
          fill="none"
          stroke="#442a17"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* 主干受光侧木纹高光 */}
        <path
          d="M0.5,-2 Q-0.6,-10 1.1,-18 Q2.3,-26 1.3,-34 Q0.8,-40 1.0,-44"
          fill="none"
          stroke="#78502f"
          strokeWidth="0.9"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* 琴叶榕标志性植物学特征：叶节脱落后的木质化环痕 (Leaf Scars at Nodes) */}
        <ellipse cx="-0.2" cy="-6" rx="1.6" ry="0.55" fill="none" stroke="#25160c" strokeWidth="0.55" opacity="0.8" />
        <ellipse cx="0.4" cy="-13" rx="1.5" ry="0.5" fill="none" stroke="#25160c" strokeWidth="0.55" opacity="0.8" />
        <ellipse cx="1.2" cy="-21" rx="1.4" ry="0.45" fill="none" stroke="#25160c" strokeWidth="0.55" opacity="0.8" />
        <ellipse cx="1.0" cy="-29" rx="1.3" ry="0.4" fill="none" stroke="#25160c" strokeWidth="0.5" opacity="0.75" />

        {/* 琴叶榕独有的红棕色纸质干苞片/托叶鞘 (Papery Brown Stipule Sheaths at Nodes) */}
        <path d="M-0.8,-13 Q-2.0,-15 -1.4,-17.5 Q-0.3,-16 0.6,-14 Z" fill="#6d3a1f" opacity="0.9" />
        <path d="M1.2,-21 Q2.8,-23 2.2,-26 Q0.8,-24.5 0.5,-22.5 Z" fill="#6d3a1f" opacity="0.9" />
        <path d="M0.8,-29 Q2.2,-31.5 1.5,-34.5 Q0.3,-32.5 0.3,-30 Z" fill="#7a4123" opacity="0.92" />
        <path d="M0.2,-37 Q1.5,-39.5 1.0,-42.5 Q0.0,-40.5 0.0,-38 Z" fill="#7a4123" opacity="0.92" />

        {/* 粗壮短叶柄 (Petioles directly anchoring leaves to node scars) */}
        <path d="M-0.2,-13 Q-3,-15 -5,-17" fill="none" stroke="#3d2514" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M0.8,-15 Q4,-17 6.5,-19" fill="none" stroke="#3d2514" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M1.2,-22 Q5.5,-24 8,-26" fill="none" stroke="#3d2514" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M-0.1,-23 Q-4.5,-25 -7,-27" fill="none" stroke="#3d2514" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M0.8,-30 Q-3.5,-33 -5.5,-35" fill="none" stroke="#3d2514" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M1.0,-31 Q4.5,-34 6.8,-36" fill="none" stroke="#3d2514" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* --- 5. 2.5D 植物学真实生境：茂密有机层叠琴叶榕大叶冠 (Sculptural Fiddle Leaf Canopy) --- */}
      {/* 
        【彻底根据用户照片真实重构】：
        1. 经典小提琴轮廓 (Fiddle/Violin Silhouette)：顶部阔圆外展扇面、中间优雅收腰、基部耳状心形抱茎。
        2. 荷叶起伏波浪卷边 (Undulating Ruffled Margins)：叶缘绝非平滑死板线条，而是三维波浪翻卷起伏。
        3. 3D 卷边露出浅黄绿叶背 (Turned Underside Leaf Curls)：高度还原实物照片中叶片边缘卷折露出的明亮浅绿叶背。
        4. 粗壮凸起浅黄绿主脉 (Thick Chartreuse Midrib) 与 60° 放射羽状侧脉。
        5. 充沛丰富的 11 片叶四层垂直生态梯队，生机勃勃。
      */}
      <g
        id="fig-canopy-group"
        className={`origin-[0_0] transition-transform duration-700 ease-out ${
          rustle ? 'scale-[1.03] rotate-1' : 'group-hover/fig:scale-[1.01]'
        }`}
      >
        {/* ======================================================== */}
        {/* 5.1 第一层：后景深色背景阔叶 (Back Tier Deep Forest Leaves) */}
        {/* ======================================================== */}
        {/* 后景左上挺拔阔叶 (Back-Left Upper) */}
        <g id="fig-leaf-back-left-up" transform="translate(-4, -28) rotate(-32)">
          {/* 小提琴经典轮廓：宽扇顶 + 波浪收腰 + 耳基 */}
          <path
            d="M0,0
               C-2.5,-3 -4.5,-5 -4.8,-8.5
               C-5.2,-12 -3.8,-15 -5.8,-19.5
               C-8.0,-24.5 -6.5,-30.5 -1.5,-32.5
               C3.5,-34 8.5,-30 8.0,-24.5
               C7.5,-19.5 5.5,-15.5 3.5,-11.5
               C2.0,-8 1.0,-3.5 0,0 Z"
            fill="url(#figLeafDeepGrad)"
            stroke="#0c2011"
            strokeWidth="0.45"
          />
          {/* 粗壮凸起黄绿主叶脉 */}
          <path d="M0,0 Q-0.5,-16 0.5,-31" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.85" opacity="0.65" strokeLinecap="round" />
          {/* 侧脉 */}
          <path d="M0,-8 Q-3,-10 -4.5,-12 M0,-15 Q-4,-17 -5.5,-20 M0,-22 Q-4.5,-25 -4.5,-28" fill="none" stroke="#52935d" strokeWidth="0.4" opacity="0.4" />
          <path d="M0,-9 Q3,-11 4.5,-13 M0,-16 Q4,-18 6.5,-21 M0,-23 Q4,-26 5,-28" fill="none" stroke="#52935d" strokeWidth="0.4" opacity="0.4" />
        </g>

        {/* 后景右上挺拔阔叶 (Back-Right Upper) */}
        <g id="fig-leaf-back-right-up" transform="translate(4, -30) rotate(28)">
          <path
            d="M0,0
               C2.5,-3 4.5,-5 4.8,-8.5
               C5.2,-12 3.8,-15 5.8,-19.5
               C8.0,-24.5 6.5,-30.5 1.5,-32.5
               C-3.5,-34 -8.5,-30 -8.0,-24.5
               C-7.5,-19.5 -5.5,-15.5 -3.5,-11.5
               C-2.0,-8 -1.0,-3.5 0,0 Z"
            fill="url(#figLeafDeepGrad)"
            stroke="#0c2011"
            strokeWidth="0.45"
          />
          <path d="M0,0 Q0.5,-16 -0.5,-31" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.85" opacity="0.65" strokeLinecap="round" />
          <path d="M0,-8 Q3,-10 4.5,-12 M0,-15 Q4,-17 5.5,-20 M0,-22 Q4.5,-25 4.5,-28" fill="none" stroke="#52935d" strokeWidth="0.4" opacity="0.4" />
          <path d="M0,-9 Q-3,-11 -4.5,-13 M0,-16 Q-4,-18 -6.5,-21 M0,-23 Q-4,-26 -5,-28" fill="none" stroke="#52935d" strokeWidth="0.4" opacity="0.4" />
        </g>

        {/* 后景顶端中轴背景叶 (Back-Center Upright) */}
        <g id="fig-leaf-back-center" transform="translate(0.5, -36) rotate(-2)">
          <path
            d="M0,0
               C-2.8,-3.5 -5.0,-6 -4.8,-10.5
               C-4.5,-14 -3.0,-17.5 -4.8,-22
               C-6.5,-26.5 -3.5,-31.5 1.5,-32
               C6.5,-32.5 9.0,-27 7.5,-22
               C6.2,-17.5 4.5,-14 4.0,-10.5
               C3.5,-6 1.8,-3.5 0,0 Z"
            fill="url(#figLeafDeepGrad)"
            stroke="#0d2413"
            strokeWidth="0.4"
          />
          <path d="M0,0 Q0.5,-16 1.0,-31" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.9" opacity="0.7" strokeLinecap="round" />
        </g>

        {/* ======================================================== */}
        {/* 5.2 第二层：下层成熟阔大垂展叶 (Lower Mature Splaying Leaves) */}
        {/* ======================================================== */}
        {/* 下层左侧垂展大提琴叶 (Lower-Front-Left Dominant Violin Leaf) */}
        <g id="fig-leaf-lower-left" transform="translate(-5, -16) rotate(-20)">
          {/* 叶片主轮廓：生动收腰波浪边缘 */}
          <path
            d="M0,0
               C-3.5,-2.5 -6.5,-4.0 -8.5,-7.5
               C-10.5,-11.0 -7.5,-15.5 -11.0,-20.5
               C-14.5,-25.5 -11.0,-31.5 -3.5,-32.5
               C3.8,-33.5 7.5,-28.5 6.8,-22.5
               C6.2,-17.0 3.8,-13.0 1.5,-9.0
               C-0.2,-6.0 0.0,-2.5 0,0 Z"
            fill="url(#figLeafLushGrad)"
            stroke="#102b15"
            strokeWidth="0.5"
          />

          {/* 【照片核心特征】：波浪翻折叶背 (Curled Underside Flap: 露出嫩黄绿叶背) */}
          <path
            d="M-8.5,-7.5
               C-10.5,-11.0 -7.5,-15.5 -11.0,-20.5
               C-12.2,-17.5 -10.0,-13.0 -7.8,-9.5
               C-7.2,-8.5 -8.0,-7.8 -8.5,-7.5 Z"
            fill="url(#figLeafUnderGrad)"
            stroke="#5fa030"
            strokeWidth="0.3"
          />
          {/* 叶顶边缘翻卷微卷褶皱 */}
          <path
            d="M-11.0,-20.5
               C-14.5,-25.5 -11.0,-31.5 -3.5,-32.5
               C-5.5,-30.5 -10.0,-26.5 -9.5,-22.5
               C-9.2,-21.5 -10.5,-21.0 -11.0,-20.5 Z"
            fill="url(#figLeafUnderGrad)"
            stroke="#5fa030"
            strokeWidth="0.3"
          />

          {/* 革质蜡光表面漫反射高光带 */}
          <path
            d="M-1,-4 C-4,-8 -6,-14 -3,-24 C0,-28 4,-26 3,-20 C2,-14 0,-7 -1,-4 Z"
            fill="url(#figLeafSheenGrad)"
          />

          {/* 粗壮显眼的浅黄绿主脉 (从基部一直贯穿至顶端) */}
          <path d="M0,0 Q-3.5,-15 -4.0,-31.5" fill="none" stroke="url(#figVeinGrad)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M0,0 Q-3.5,-15 -4.0,-31.5" fill="none" stroke="#f0ffb8" strokeWidth="0.45" strokeLinecap="round" opacity="0.8" />

          {/* 人字形放射状凸起羽脉 (左侧 5 条，右侧 5 条) */}
          <path d="M-0.8,-6 Q-5,-7.5 -7.5,-9" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.65" opacity="0.85" />
          <path d="M-1.8,-11 Q-6.5,-12.5 -9.0,-15" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.65" opacity="0.85" />
          <path d="M-2.8,-17 Q-8.5,-18.5 -10.8,-21.5" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.7" opacity="0.85" />
          <path d="M-3.5,-23 Q-9.5,-24.5 -11.5,-27.5" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.65" opacity="0.8" />
          <path d="M-3.8,-27 Q-7.5,-29.5 -6.0,-31.5" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.55" opacity="0.75" />

          <path d="M-0.8,-7 Q2.5,-9 5.0,-11" fill="none" stroke="#68b44e" strokeWidth="0.55" opacity="0.8" />
          <path d="M-1.8,-12 Q3.0,-14.5 5.8,-17" fill="none" stroke="#68b44e" strokeWidth="0.55" opacity="0.8" />
          <path d="M-2.6,-18 Q3.5,-20.5 6.2,-23.5" fill="none" stroke="#68b44e" strokeWidth="0.6" opacity="0.8" />
          <path d="M-3.4,-24 Q2.0,-26.5 4.0,-29.5" fill="none" stroke="#68b44e" strokeWidth="0.55" opacity="0.75" />
        </g>

        {/* 下层右侧微躬舒展叶 (Lower-Front-Right Spreading Leaf) */}
        <g id="fig-leaf-lower-right" transform="translate(5, -18) rotate(22)">
          <path
            d="M0,0
               C3.5,-2.5 6.5,-4.0 8.5,-7.5
               C10.5,-11.0 7.5,-15.5 11.0,-20.5
               C14.5,-25.5 11.0,-31.5 3.5,-32.5
               C-3.8,-33.5 -7.5,-28.5 -6.8,-22.5
               C-6.2,-17.0 -3.8,-13.0 -1.5,-9.0
               C0.2,-6.0 0.0,-2.5 0,0 Z"
            fill="url(#figLeafLushGrad)"
            stroke="#102b15"
            strokeWidth="0.5"
          />

          {/* 右下翻卷叶背露出 */}
          <path
            d="M8.5,-7.5
               C10.5,-11.0 7.5,-15.5 11.0,-20.5
               C12.2,-17.5 10.0,-13.0 7.8,-9.5
               C7.2,-8.5 8.0,-7.8 8.5,-7.5 Z"
            fill="url(#figLeafUnderGrad)"
            stroke="#5fa030"
            strokeWidth="0.3"
          />

          {/* 粗壮凸起浅黄绿主脉 */}
          <path d="M0,0 Q3.5,-15 4.0,-31.5" fill="none" stroke="url(#figVeinGrad)" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M0,0 Q3.5,-15 4.0,-31.5" fill="none" stroke="#f0ffb8" strokeWidth="0.45" strokeLinecap="round" opacity="0.8" />

          {/* 侧脉 */}
          <path d="M0.8,-6 Q5,-7.5 7.5,-9" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.65" opacity="0.85" />
          <path d="M1.8,-11 Q6.5,-12.5 9.0,-15" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.65" opacity="0.85" />
          <path d="M2.8,-17 Q8.5,-18.5 10.8,-21.5" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.7" opacity="0.85" />
          <path d="M3.5,-23 Q9.5,-24.5 11.5,-27.5" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.65" opacity="0.8" />

          <path d="M0.8,-7 Q-2.5,-9 -5.0,-11" fill="none" stroke="#68b44e" strokeWidth="0.55" opacity="0.8" />
          <path d="M1.8,-12 Q-3.0,-14.5 -5.8,-17" fill="none" stroke="#68b44e" strokeWidth="0.55" opacity="0.8" />
          <path d="M2.6,-18 Q-3.5,-20.5 -6.2,-23.5" fill="none" stroke="#68b44e" strokeWidth="0.6" opacity="0.8" />
        </g>

        {/* 下层正中自然下垂大叶 (Lower-Center Drooping Leaf - 如照片底部饱满大叶) */}
        <g id="fig-leaf-lower-center" transform="translate(0, -13) rotate(3)">
          <path
            d="M0,0
               C-4.0,-2.0 -7.0,-3.5 -8.0,-6.5
               C-9.5,-10.0 -6.5,-13.5 -8.5,-18.0
               C-10.5,-22.5 -7.0,-27.5 0.0,-28.0
               C7.0,-27.5 10.5,-22.5 8.5,-18.0
               C6.5,-13.5 9.5,-10.0 8.0,-6.5
               C7.0,-3.5 4.0,-2.0 0,0 Z"
            fill="url(#figLeafDeepGrad)"
            stroke="#0f2613"
            strokeWidth="0.5"
          />
          {/* 主脉 */}
          <path d="M0,0 Q0,-14 0,-27.5" fill="none" stroke="url(#figVeinGrad)" strokeWidth="1.15" strokeLinecap="round" />
          <path d="M0,0 Q0,-14 0,-27.5" fill="none" stroke="#eaffba" strokeWidth="0.4" strokeLinecap="round" opacity="0.75" />
          {/* 对称侧羽脉 */}
          <path d="M0,-6 Q-4,-8 -7,-9 M0,-11 Q-5.5,-13 -7.5,-15 M0,-17 Q-6,-19 -7.5,-22" fill="none" stroke="#6db853" strokeWidth="0.55" opacity="0.75" />
          <path d="M0,-6 Q4,-8 7,-9 M0,-11 Q5.5,-13 7.5,-15 M0,-17 Q6,-19 7.5,-22" fill="none" stroke="#6db853" strokeWidth="0.55" opacity="0.75" />
        </g>

        {/* ======================================================== */}
        {/* 5.3 第三层：中层波浪大叶 (Mid Tier Lush Undulating Leaves)   */}
        {/* ======================================================== */}
        {/* 中层左侧大波浪大琴叶 (Mid-Left Magnificent Wavy Leaf) */}
        <g id="fig-leaf-mid-left" transform="translate(-4, -25) rotate(-18)">
          <path
            d="M0,0
               C-4.0,-3.0 -7.2,-4.5 -9.0,-8.5
               C-11.0,-12.5 -8.0,-17.0 -12.0,-22.0
               C-15.0,-26.5 -11.5,-32.5 -3.8,-33.5
               C4.0,-34.5 8.2,-29.0 7.2,-23.0
               C6.5,-17.5 4.0,-13.5 1.8,-9.5
               C0.0,-6.5 0.2,-2.5 0,0 Z"
            fill="url(#figLeafSunlitGrad)"
            stroke="#13361a"
            strokeWidth="0.5"
          />

          {/* 波浪翻卷叶背露出 (Underside Leaf Curl: 照片中极其抢眼的受光浅绿荷叶边) */}
          <path
            d="M-9.0,-8.5
               C-11.0,-12.5 -8.0,-17.0 -12.0,-22.0
               C-13.8,-18.5 -10.5,-14.0 -8.0,-10.0
               C-7.5,-9.0 -8.5,-8.5 -9.0,-8.5 Z"
            fill="url(#figLeafUnderGrad)"
            stroke="#68a834"
            strokeWidth="0.35"
          />
          {/* 上沿波浪翻卷 */}
          <path
            d="M-12.0,-22.0
               C-15.0,-26.5 -11.5,-32.5 -3.8,-33.5
               C-6.0,-31.0 -10.5,-27.0 -10.0,-23.5
               C-10.0,-22.5 -11.5,-22.2 -12.0,-22.0 Z"
            fill="url(#figLeafUnderGrad)"
            stroke="#68a834"
            strokeWidth="0.35"
          />

          {/* 凸起主脉 */}
          <path d="M0,0 Q-4.0,-16 -4.2,-33" fill="none" stroke="url(#figVeinGrad)" strokeWidth="1.25" strokeLinecap="round" />
          <path d="M0,0 Q-4.0,-16 -4.2,-33" fill="none" stroke="#f6ffd0" strokeWidth="0.5" strokeLinecap="round" opacity="0.85" />

          {/* 细腻侧羽脉 */}
          <path d="M-1,-7 Q-5.5,-8.5 -8.0,-10" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.7" opacity="0.85" />
          <path d="M-2,-12 Q-7.5,-13.5 -10.0,-16.5" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.7" opacity="0.85" />
          <path d="M-3,-18 Q-9.5,-19.5 -12.0,-23" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.7" opacity="0.85" />
          <path d="M-3.8,-24 Q-10.5,-25.5 -12.5,-29" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.65" opacity="0.8" />

          <path d="M-1,-8 Q2.8,-10 5.5,-12" fill="none" stroke="#70ba52" strokeWidth="0.6" opacity="0.8" />
          <path d="M-2,-13 Q3.5,-15.5 6.5,-18.5" fill="none" stroke="#70ba52" strokeWidth="0.6" opacity="0.8" />
          <path d="M-2.8,-19 Q4.0,-21.5 7.0,-24.5" fill="none" stroke="#70ba52" strokeWidth="0.6" opacity="0.8" />
        </g>

        {/* 中层右侧向阳舒展叶 (Mid-Right Sunlit Leaf) */}
        <g id="fig-leaf-mid-right" transform="translate(4, -26) rotate(16)">
          <path
            d="M0,0
               C4.0,-3.0 7.2,-4.5 9.0,-8.5
               C11.0,-12.5 8.0,-17.0 12.0,-22.0
               C15.0,-26.5 11.5,-32.5 3.8,-33.5
               C-4.0,-34.5 -8.2,-29.0 -7.2,-23.0
               C-6.5,-17.5 -4.0,-13.5 -1.8,-9.5
               C-0.0,-6.5 -0.2,-2.5 0,0 Z"
            fill="url(#figLeafSunlitGrad)"
            stroke="#13361a"
            strokeWidth="0.5"
          />

          {/* 右侧波浪翻卷叶背 */}
          <path
            d="M9.0,-8.5
               C11.0,-12.5 8.0,-17.0 12.0,-22.0
               C13.8,-18.5 10.5,-14.0 8.0,-10.0
               C7.5,-9.0 8.5,-8.5 9.0,-8.5 Z"
            fill="url(#figLeafUnderGrad)"
            stroke="#68a834"
            strokeWidth="0.35"
          />

          {/* 凸起主脉 */}
          <path d="M0,0 Q4.0,-16 4.2,-33" fill="none" stroke="url(#figVeinGrad)" strokeWidth="1.25" strokeLinecap="round" />
          <path d="M0,0 Q4.0,-16 4.2,-33" fill="none" stroke="#f6ffd0" strokeWidth="0.5" strokeLinecap="round" opacity="0.85" />

          {/* 侧脉 */}
          <path d="M1,-7 Q5.5,-8.5 8.0,-10" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.7" opacity="0.85" />
          <path d="M2,-12 Q7.5,-13.5 10.0,-16.5" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.7" opacity="0.85" />
          <path d="M3,-18 Q9.5,-19.5 12.0,-23" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.7" opacity="0.85" />
          <path d="M3.8,-24 Q10.5,-25.5 12.5,-29" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.65" opacity="0.8" />

          <path d="M1,-8 Q-2.8,-10 -5.5,-12" fill="none" stroke="#70ba52" strokeWidth="0.6" opacity="0.8" />
          <path d="M2,-13 Q-3.5,-15.5 -6.5,-18.5" fill="none" stroke="#70ba52" strokeWidth="0.6" opacity="0.8" />
        </g>

        {/* ======================================================== */}
        {/* 5.4 第四层：顶冠杯状挺立嫩叶与初展新芽 (Apical Chalice Crown) */}
        {/* ======================================================== */}
        {/* 
          【实物照片关键亮点】：
          顶端新叶如高脚杯/酒杯般向上挺立合抱 (Chalice/Goblet Upright)，
          叶色娇嫩翠绿黄亮，背部大面积翻折受光，生机盎然！
        */}
        {/* 顶端左侧杯状幼叶 (Crown-Left Chalice Leaf) */}
        <g id="fig-leaf-crown-left" transform="translate(-2, -35) rotate(-10)">
          <path
            d="M0,0
               C-2.5,-3 -4.5,-5 -5.2,-9
               C-6.0,-13 -4.0,-17 -6.2,-22
               C-8.0,-26.5 -4.5,-32.5 1.5,-33
               C6.5,-33.5 9.5,-28.5 8.5,-23
               C7.5,-18 5.5,-14 3.8,-10
               C2.0,-6.5 1.0,-2.5 0,0 Z"
            fill="url(#figLeafCrownGrad)"
            stroke="#1d4d23"
            strokeWidth="0.45"
          />

          {/* 大面积向阳翻折浅黄绿叶背 (Chalice Lip Curve) */}
          <path
            d="M-5.2,-9
               C-6.0,-13 -4.0,-17 -6.2,-22
               C-8.0,-26.5 -4.5,-32.5 1.5,-33
               C-1.5,-30.5 -4.5,-26.0 -4.0,-21.5
               C-3.5,-17.0 -4.5,-13.0 -4.0,-9.5
               C-3.8,-9.0 -4.8,-8.8 -5.2,-9 Z"
            fill="url(#figLeafUnderGrad)"
            stroke="#72b83a"
            strokeWidth="0.35"
          />

          {/* 鲜嫩明亮黄绿主脉 */}
          <path d="M0,0 Q0.5,-16 1.2,-32" fill="none" stroke="url(#figVeinGrad)" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M0,0 Q0.5,-16 1.2,-32" fill="none" stroke="#ffffff" strokeWidth="0.4" strokeLinecap="round" opacity="0.6" />

          {/* 嫩羽脉 */}
          <path d="M0,-8 Q-3.5,-10 -5.0,-12 M0,-14 Q-4.0,-16 -5.8,-19 M0,-21 Q-4.2,-24 -5.5,-27" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.55" opacity="0.85" />
          <path d="M0,-9 Q3.5,-11 5.5,-13 M0,-15 Q4.5,-17 7.0,-20 M0,-22 Q4.0,-25 6.0,-28" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.55" opacity="0.85" />
        </g>

        {/* 顶端右侧杯状幼叶 (Crown-Right Chalice Leaf) */}
        <g id="fig-leaf-crown-right" transform="translate(2, -36) rotate(12)">
          <path
            d="M0,0
               C2.5,-3 4.5,-5 5.2,-9
               C6.0,-13 4.0,-17 6.2,-22
               C8.0,-26.5 4.5,-32.5 -1.5,-33
               C-6.5,-33.5 -9.5,-28.5 -8.5,-23
               C-7.5,-18 -5.5,-14 -3.8,-10
               C-2.0,-6.5 -1.0,-2.5 0,0 Z"
            fill="url(#figLeafCrownGrad)"
            stroke="#1d4d23"
            strokeWidth="0.45"
          />

          {/* 右侧杯口翻折浅黄绿叶背 */}
          <path
            d="M5.2,-9
               C6.0,-13 4.0,-17 6.2,-22
               C8.0,-26.5 4.5,-32.5 -1.5,-33
               C1.5,-30.5 4.5,-26.0 4.0,-21.5
               C3.5,-17.0 4.5,-13.0 4.0,-9.5
               C3.8,-9.0 4.8,-8.8 5.2,-9 Z"
            fill="url(#figLeafUnderGrad)"
            stroke="#72b83a"
            strokeWidth="0.35"
          />

          {/* 鲜嫩明亮黄绿主脉 */}
          <path d="M0,0 Q-0.5,-16 -1.2,-32" fill="none" stroke="url(#figVeinGrad)" strokeWidth="1.1" strokeLinecap="round" />
          <path d="M0,0 Q-0.5,-16 -1.2,-32" fill="none" stroke="#ffffff" strokeWidth="0.4" strokeLinecap="round" opacity="0.6" />

          {/* 侧脉 */}
          <path d="M0,-8 Q3.5,-10 5.0,-12 M0,-14 Q4.0,-16 5.8,-19 M0,-21 Q4.2,-24 5.5,-27" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.55" opacity="0.85" />
          <path d="M0,-9 Q-3.5,-11 -5.5,-13 M0,-15 Q-4.5,-17 -7.0,-20 M0,-22 Q-4.0,-25 -6.0,-28" fill="none" stroke="url(#figVeinGrad)" strokeWidth="0.55" opacity="0.85" />
        </g>

        {/* 顶端正中直立新生卷曲娇芽 (Emerging Baby Leaf & Apical Bud) */}
        <g id="fig-apical-sprout" transform="translate(0.5, -44)">
          {/* 初展微卷小提琴嫩芽 (青翠半透明) */}
          <path
            d="M0,0
               C-1.8,-2 -3.0,-4 -3.2,-6.5
               C-3.5,-9.5 -1.5,-12 0.8,-12.5
               C3.0,-12.8 4.5,-10 4.0,-7
               C3.5,-4.5 2.0,-2.5 0,0 Z"
            fill="url(#figSproutGrad)"
            stroke="#1d5528"
            strokeWidth="0.35"
          />
          {/* 嫩脉 */}
          <path d="M0,0 Q0.3,-5 0.6,-12" fill="none" stroke="#b6f082" strokeWidth="0.65" strokeLinecap="round" />

          {/* 顶端直立红褐色绒毛托叶苞鞘 (Papery Terminal Bud Sheath) */}
          <path d="M0,-1 Q1.0,-4 0.6,-8 Q-0.3,-5 0,-1 Z" fill="#78350f" stroke="#3b1504" strokeWidth="0.3" />
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
      </g>

      {/* --- 7. 悬浮精致标签 (Hover Tooltip Badge) --- */}
      <g
        transform="translate(0, -42)"
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
