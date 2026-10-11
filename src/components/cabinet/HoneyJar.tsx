import React, { useState } from 'react';

export interface HoneyJarProps {
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
}

/**
 * 2.5D 治愈风金黄野花蜂蜜罐 (Handcrafted Wildflower Honey Jar)
 * 专为咖啡黑胶边柜顶台面设计：
 * - 剔透复古六棱玻璃蜜罐，盛放着温暖透亮的野花金蜂蜜
 * - 质朴棉麻盖布配天然黄麻细绳蝴蝶结，充满田园手作温度
 * - 精致牛皮纸手绘蜜蜂小标签
 * - 罐旁斜倚一根精巧的木质螺纹蜂蜜搅拌棒 (Honey Dipper)
 * - 悬浮轻微微晃动与金光粒子点缀，交互趣味与治愈感兼备
 */
export const HoneyJar: React.FC<HoneyJarProps> = ({
  className = '',
  onClick,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <g
      id="honey-jar-group"
      className={`select-none transition-transform duration-300 ${isHovered ? '-translate-y-0.5' : ''} ${className}`}
      onClick={onClick}
      onMouseEnter={(e) => {
        setIsHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        onMouseLeave?.(e);
      }}
    >
      <title>金黄野花蜂蜜 (Wildflower Honey Jar)</title>

      <defs>
        {/* 蜜液金黄暖光渐变 (丰盈透亮的天然野花原蜜) */}
        <linearGradient id="honeyLiquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="25%" stopColor="#fde047" />
          <stop offset="55%" stopColor="#f59e0b" />
          <stop offset="85%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* 玻璃侧壁透光反光渐变 */}
        <linearGradient id="honeyGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="15%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#fef3c7" stopOpacity="0.05" />
          <stop offset="85%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
        </linearGradient>

        {/* 棉麻盖布柔和暖白/淡燕麦渐变 */}
        <linearGradient id="honeyClothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffdf0" />
          <stop offset="30%" stopColor="#fef9c3" />
          <stop offset="70%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f5e17b" />
        </linearGradient>

        {/* 盖布向下阴影渐变 */}
        <linearGradient id="honeyClothFoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ecd56e" />
          <stop offset="100%" stopColor="#cbb04c" />
        </linearGradient>

        {/* 榉木蜂蜜棒车木渐变 */}
        <linearGradient id="honeyDipperWoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2c8a2" />
          <stop offset="45%" stopColor="#c69a68" />
          <stop offset="100%" stopColor="#9a6e3e" />
        </linearGradient>
      </defs>

      {/* 1. 台面柔和接触阴影 (自然暖棕漫反射，契合木台面) */}
      <ellipse cx="0.4" cy="1.2" rx="4.2" ry="1.8" fill="#3a2212" opacity="0.20" filter="url(#cabinetFootShadowFilter)" />
      <ellipse cx="0.2" cy="1.0" rx="2.8" ry="1.1" fill="#28150a" opacity="0.16" />

      {/* 2. 玻璃蜜罐主体 */}
      <g id="honey-jar-body">
        {/* 2.1 罐底微圆角底托沉底阴影 */}
        <path
          d="
            M -3.2,-0.2
            C -3.4,0.4 -2.5,1.2 -0.8,1.3
            C 0.8,1.4 2.6,1.0 3.2,0.2
            L 3.5,-5.5
            C 3.5,-6.0 2.2,-6.6 0.0,-6.6
            C -2.2,-6.6 -3.5,-6.0 -3.5,-5.5
            Z
          "
          fill="#451a03"
          opacity="0.18"
        />

        {/* 2.2 罐身金黄蜂蜜液体 (沉静温润、流动浓稠感) */}
        <path
          d="
            M -3.3,-0.6
            C -3.4,0.5 -1.8,1.1 0.0,1.1
            C 1.8,1.1 3.4,0.5 3.3,-0.6
            L 3.4,-5.2
            C 3.4,-5.8 1.8,-6.3 0.0,-6.3
            C -1.8,-6.3 -3.4,-5.8 -3.4,-5.2
            Z
          "
          fill="url(#honeyLiquidGrad)"
          stroke="#b45309"
          strokeWidth="0.25"
        />

        {/* 蜜液表面液面弧度 (自然粘稠内凹弧光) */}
        <ellipse cx="0" cy="-5.2" rx="3.3" ry="0.9" fill="#fef08a" opacity="0.65" />
        <ellipse cx="0" cy="-5.2" rx="2.8" ry="0.7" fill="#f59e0b" opacity="0.8" />

        {/* 蜜中微小气泡 (天然原蜜活性微气泡) */}
        <circle cx="-1.5" cy="-2.4" r="0.3" fill="#fef9c3" opacity="0.75" />
        <circle cx="1.6" cy="-3.6" r="0.22" fill="#fef9c3" opacity="0.7" />
        <circle cx="-0.4" cy="-4.2" r="0.25" fill="#fef9c3" opacity="0.8" />
        <circle cx="0.8" cy="-1.6" r="0.2" fill="#fef9c3" opacity="0.6" />

        {/* 2.3 外层高透玻璃反光柱面 (剔透晶莹) */}
        <path
          d="
            M -3.4,-0.6
            C -3.5,0.6 -1.8,1.2 0.0,1.2
            C 1.8,1.2 3.5,0.6 3.4,-0.6
            L 3.5,-6.2
            C 3.5,-6.9 1.8,-7.4 0.0,-7.4
            C -1.8,-7.4 -3.5,-6.9 -3.5,-6.2
            Z
          "
          fill="url(#honeyGlassGrad)"
        />

        {/* 玻璃左侧高光竖条 */}
        <path
          d="M -2.7,-0.4 L -2.7,-5.8"
          stroke="#ffffff"
          strokeWidth="0.45"
          strokeLinecap="round"
          opacity="0.6"
        />
        {/* 玻璃右侧微弱侧光 */}
        <path
          d="M 2.6,-0.5 L 2.6,-5.6"
          stroke="#ffffff"
          strokeWidth="0.3"
          strokeLinecap="round"
          opacity="0.35"
        />

        {/* 2.4 罐身贴纸：质朴牛皮纸野花蜂蜜标贴 */}
        <g id="honey-label" transform="translate(0, -3.2)">
          {/* 米黄小贴纸 */}
          <rect
            x="-2.4"
            y="-1.5"
            width="4.8"
            height="3.0"
            rx="0.5"
            fill="#fffbeb"
            stroke="#d97706"
            strokeWidth="0.2"
          />
          {/* 贴纸内细金虚线边框 */}
          <rect
            x="-2.1"
            y="-1.3"
            width="4.2"
            height="2.6"
            rx="0.3"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="0.12"
            strokeDasharray="0.8 0.4"
          />
          {/* 可爱小蜜蜂与文字 */}
          <ellipse cx="-0.8" cy="0" rx="0.5" ry="0.35" fill="#f59e0b" />
          <ellipse cx="-0.8" cy="0" rx="0.5" ry="0.35" stroke="#78350f" strokeWidth="0.12" fill="none" />
          <line x1="-0.8" y1="-0.32" x2="-0.8" y2="0.32" stroke="#78350f" strokeWidth="0.15" />
          <ellipse cx="-0.8" cy="-0.4" rx="0.22" ry="0.3" fill="#ffffff" opacity="0.85" />
          <line x1="0.1" y1="-0.4" x2="1.7" y2="-0.4" stroke="#92400e" strokeWidth="0.22" strokeLinecap="round" />
          <line x1="0.1" y1="0.3" x2="1.4" y2="0.3" stroke="#b45309" strokeWidth="0.18" strokeLinecap="round" />
        </g>
      </g>

      {/* 3. 紧密捆绑在瓶身侧面的木质蜂蜜搅拌棒 (与瓶体用麻绳绑在一起，一体式设计) */}
      <g id="integrated-honey-dipper" transform="translate(3.1, -4.2) rotate(9)">
        {/* 棒身贴合瓶壁的微弱接触阴影 */}
        <line x1="-0.1" y1="-4.5" x2="0.1" y2="3.8" stroke="#331c0c" strokeWidth="0.6" opacity="0.25" />

        {/* 螺纹搅拌球头 (向上露出瓶口侧上方，优雅有致) */}
        <g id="dipper-head" transform="translate(0, -3.4)">
          {/* 球形/椭圆核心 */}
          <ellipse cx="0" cy="0" rx="0.95" ry="1.4" fill="url(#honeyDipperWoodGrad)" stroke="#78350f" strokeWidth="0.18" />
          {/* 车木螺纹凹槽线条 */}
          <line x1="-0.85" y1="-0.75" x2="0.85" y2="-0.75" stroke="#60290a" strokeWidth="0.22" />
          <line x1="-0.95" y1="-0.25" x2="0.95" y2="-0.25" stroke="#60290a" strokeWidth="0.22" />
          <line x1="-0.95" y1="0.25" x2="0.95" y2="0.25" stroke="#60290a" strokeWidth="0.22" />
          <line x1="-0.85" y1="0.75" x2="0.85" y2="0.75" stroke="#60290a" strokeWidth="0.22" />
          {/* 顶端小圆木圆头 */}
          <circle cx="0" cy="-1.45" r="0.32" fill="#be8f5d" stroke="#78350f" strokeWidth="0.15" />
          {/* 球头上凝结的一小抹晶莹蜜珠 */}
          <ellipse cx="0.4" cy="0.4" rx="0.3" ry="0.45" fill="#f59e0b" opacity="0.9" />
          <circle cx="0.3" cy="0.2" r="0.12" fill="#fef08a" />
        </g>

        {/* 细木手柄 (向下贴着罐身垂直延伸) */}
        <path d="M 0,-2.0 L 0,4.2" stroke="url(#honeyDipperWoodGrad)" strokeWidth="0.6" strokeLinecap="round" />
        {/* 手柄底部端头 */}
        <circle cx="0" cy="4.2" r="0.3" fill="#9a6e3e" stroke="#78350f" strokeWidth="0.12" />
      </g>

      {/* 4. 瓶口与向下垂落的荷叶边田园盖布 (向下自然包裹瓶颈) */}
      <g id="honey-jar-lid" transform="translate(0, -6.5)">
        {/* 4.1 玻璃瓶口颈圈凸起 */}
        <ellipse cx="0" cy="-0.2" rx="2.7" ry="0.8" fill="#fef3c7" stroke="#b45309" strokeWidth="0.2" />

        {/* 4.2 向下披垂的荷叶边盖布褶皱裙边 (Scalloped Draped Skirt Hanging Downward) */}
        {/* 裙边向下垂落在瓶颈和瓶肩周围，波浪荷叶褶皱自然下垂 */}
        <path
          d="
            M -3.1,-0.2
            C -3.2,0.8 -3.5,1.8 -3.1,2.5
            C -2.6,2.8 -2.3,1.9 -1.8,2.6
            C -1.4,3.0 -0.8,2.0 0.0,2.7
            C 0.8,2.0 1.4,3.0 1.8,2.6
            C 2.3,1.9 2.6,2.8 3.1,2.5
            C 3.5,1.8 3.2,0.8 3.1,-0.2
            Z
          "
          fill="url(#honeyClothGrad)"
          stroke="#ca8a04"
          strokeWidth="0.22"
        />

        {/* 盖布向下自然悬垂的竖向立体阴影褶皱 (布褶下垂质感) */}
        <path d="M -2.4,0.3 C -2.6,1.2 -2.7,2.0 -2.5,2.4" stroke="url(#honeyClothFoldGrad)" strokeWidth="0.25" fill="none" opacity="0.75" />
        <path d="M -1.2,0.5 C -1.3,1.4 -1.4,2.1 -1.2,2.5" stroke="url(#honeyClothFoldGrad)" strokeWidth="0.28" fill="none" opacity="0.85" />
        <path d="M 0.0,0.6 C 0.0,1.5 -0.1,2.1 0.0,2.6" stroke="url(#honeyClothFoldGrad)" strokeWidth="0.25" fill="none" opacity="0.7" />
        <path d="M 1.2,0.5 C 1.3,1.4 1.4,2.1 1.2,2.5" stroke="url(#honeyClothFoldGrad)" strokeWidth="0.28" fill="none" opacity="0.85" />
        <path d="M 2.4,0.3 C 2.6,1.2 2.7,2.0 2.5,2.4" stroke="url(#honeyClothFoldGrad)" strokeWidth="0.25" fill="none" opacity="0.75" />

        {/* 4.3 顶盖平坦丰满的椭圆顶布 (覆盖瓶盖顶端) */}
        <ellipse cx="0" cy="-0.3" rx="2.8" ry="1.0" fill="url(#honeyClothGrad)" stroke="#ca8a04" strokeWidth="0.2" />
        {/* 顶布柔和高光弧 */}
        <ellipse cx="0" cy="-0.4" rx="2.2" ry="0.7" fill="#ffffff" opacity="0.35" />

        {/* 4.4 束口细麻绳 (Jute Twine Bow)：紧紧缠绕在瓶颈处，并将旁边的木棒牢固捆绑在瓶身上 */}
        {/* 麻绳颈圈 (横跨布盖腰部与木棒，体现捆绑一体感) */}
        <ellipse cx="0.1" cy="0.35" rx="2.5" ry="0.65" fill="none" stroke="#78350f" strokeWidth="0.35" />
        <ellipse cx="0.1" cy="0.35" rx="2.5" ry="0.65" fill="none" stroke="#b45309" strokeWidth="0.2" />

        {/* 捆绑木棒处额外缠绕的一圈麻绳交叉线 */}
        <line x1="2.4" y1="0.1" x2="3.4" y2="0.6" stroke="#78350f" strokeWidth="0.32" />
        <line x1="2.4" y1="0.6" x2="3.4" y2="0.1" stroke="#b45309" strokeWidth="0.26" />

        {/* 绳结蝴蝶结与垂挂小绳须 */}
        <g id="twine-bow" transform="translate(0.1, 0.4)">
          {/* 绳结中心小圆点 */}
          <circle cx="0" cy="0" r="0.34" fill="#78350f" />
          {/* 左侧蝴蝶圈 */}
          <ellipse cx="-0.7" cy="-0.2" rx="0.6" ry="0.32" transform="rotate(-15, -0.7, -0.2)" fill="none" stroke="#78350f" strokeWidth="0.26" />
          {/* 右侧蝴蝶圈 */}
          <ellipse cx="0.7" cy="-0.2" rx="0.6" ry="0.32" transform="rotate(15, 0.7, -0.2)" fill="none" stroke="#78350f" strokeWidth="0.26" />
          {/* 左下垂须 */}
          <path d="M -0.2,0.2 C -0.5,0.8 -0.8,1.4 -0.9,1.9" fill="none" stroke="#78350f" strokeWidth="0.22" strokeLinecap="round" />
          {/* 右下垂须 */}
          <path d="M 0.2,0.2 C 0.6,0.7 0.8,1.3 0.7,1.8" fill="none" stroke="#78350f" strokeWidth="0.22" strokeLinecap="round" />
        </g>
      </g>

      {/* 5. 悬浮微光闪烁粒子 (仅在鼠标悬浮时活化，增添甜蜜童话感) */}
      {isHovered && (
        <g id="honey-sparkles" className="animate-pulse pointer-events-none">
          <circle cx="-3.2" cy="-7.5" r="0.4" fill="#fde047" opacity="0.9" />
          <path d="M -3.2,-8.2 L -3.2,-6.8 M -3.9,-7.5 L -2.5,-7.5" stroke="#f59e0b" strokeWidth="0.2" />
          <circle cx="2.8" cy="-8.5" r="0.3" fill="#fde047" opacity="0.85" />
          <circle cx="3.8" cy="-4.0" r="0.35" fill="#fde047" opacity="0.9" />
        </g>
      )}
    </g>
  );
};
