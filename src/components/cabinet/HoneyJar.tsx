import React, { useState } from 'react';

export interface HoneyJarProps {
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
}

/**
 * 2.5D 高清金黄野花蜂蜜罐 (Crisp Handcrafted Wildflower Honey Jar)
 * 专为咖啡黑胶边柜顶台面设计：
 * - 剔透复古玻璃蜜罐，盛放金黄透亮的野花原蜜。
 * - 纯净矢量接触阴影（无模糊滤镜，不发虚）。
 * - 结构线宽提升至 0.5px~0.7px，色块分明透亮。
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
        {/* 蜜液金黄暖光渐变 */}
        <linearGradient id="crispHoneyLiquidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="30%" stopColor="#fde047" />
          <stop offset="60%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>

        {/* 玻璃侧壁透光反光渐变 */}
        <linearGradient id="crispHoneyGlassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="20%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="80%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.45" />
        </linearGradient>

        {/* 棉麻盖布柔和暖白渐变 */}
        <linearGradient id="crispHoneyClothGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fffdf0" />
          <stop offset="40%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#f5d76e" />
        </linearGradient>

        {/* 榉木蜂蜜棒车木渐变 */}
        <linearGradient id="crispDipperWoodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2c8a2" />
          <stop offset="50%" stopColor="#c69a68" />
          <stop offset="100%" stopColor="#9a6e3e" />
        </linearGradient>
      </defs>

      {/* 1. 台面纯净接触阴影 (无模糊滤镜，干净利落) */}
      <ellipse cx="0.4" cy="1.2" rx="4.0" ry="1.6" fill="#140601" opacity="0.35" />
      <ellipse cx="0.2" cy="1.0" rx="2.8" ry="1.0" fill="#140601" opacity="0.3" />

      {/* 2. 玻璃蜜罐主体 */}
      <g id="honey-jar-body">
        {/* 2.1 罐身金黄蜂蜜液体 */}
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
          fill="url(#crispHoneyLiquidGrad)"
          stroke="#92400e"
          strokeWidth="0.6"
        />

        {/* 蜜液表面液面弧度 */}
        <ellipse cx="0" cy="-5.2" rx="3.3" ry="0.9" fill="#fef08a" opacity="0.75" />
        <ellipse cx="0" cy="-5.2" rx="2.8" ry="0.7" fill="#f59e0b" opacity="0.85" />

        {/* 2.2 外层高透玻璃反光柱面 */}
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
          fill="url(#crispHoneyGlassGrad)"
          stroke="#fef3c7"
          strokeWidth="0.5"
          strokeOpacity="0.4"
        />

        {/* 玻璃左侧清晰纯白高光竖条 */}
        <path
          d="M -2.7,-0.4 L -2.7,-5.8"
          stroke="#ffffff"
          strokeWidth="0.7"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* 2.3 罐身贴纸：质朴牛皮纸小标贴 */}
        <g id="honey-label" transform="translate(0, -3.2)">
          <rect
            x="-2.4"
            y="-1.5"
            width="4.8"
            height="3.0"
            rx="0.5"
            fill="#fffbeb"
            stroke="#b45309"
            strokeWidth="0.5"
          />
          <ellipse cx="-0.8" cy="0" rx="0.5" ry="0.35" fill="#f59e0b" stroke="#78350f" strokeWidth="0.4" />
          <line x1="0.1" y1="-0.4" x2="1.7" y2="-0.4" stroke="#92400e" strokeWidth="0.5" strokeLinecap="round" />
          <line x1="0.1" y1="0.3" x2="1.4" y2="0.3" stroke="#b45309" strokeWidth="0.4" strokeLinecap="round" />
        </g>
      </g>

      {/* 3. 侧面木质蜂蜜搅拌棒 */}
      <g id="integrated-honey-dipper" transform="translate(3.1, -4.2) rotate(9)">
        {/* 螺纹搅拌球头 */}
        <g id="dipper-head" transform="translate(0, -3.4)">
          <ellipse cx="0" cy="0" rx="1.0" ry="1.4" fill="url(#crispDipperWoodGrad)" stroke="#78350f" strokeWidth="0.5" />
          <line x1="-0.9" y1="-0.7" x2="0.9" y2="-0.7" stroke="#60290a" strokeWidth="0.5" />
          <line x1="-1.0" y1="0.0" x2="1.0" y2="0.0" stroke="#60290a" strokeWidth="0.5" />
          <line x1="-0.9" y1="0.7" x2="0.9" y2="0.7" stroke="#60290a" strokeWidth="0.5" />
        </g>
        {/* 细木手柄 */}
        <path d="M 0,-2.0 L 0,4.2" stroke="url(#crispDipperWoodGrad)" strokeWidth="0.75" strokeLinecap="round" />
      </g>

      {/* 4. 瓶口与荷叶边盖布 */}
      <g id="honey-jar-lid" transform="translate(0, -6.5)">
        {/* 荷叶边盖布 */}
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
          fill="url(#crispHoneyClothGrad)"
          stroke="#b45309"
          strokeWidth="0.55"
        />
        {/* 顶盖平坦椭圆 */}
        <ellipse cx="0" cy="-0.3" rx="2.8" ry="1.0" fill="url(#crispHoneyClothGrad)" stroke="#b45309" strokeWidth="0.55" />
        <ellipse cx="0" cy="-0.4" rx="2.2" ry="0.7" fill="#ffffff" opacity="0.45" />

        {/* 束口细麻绳 */}
        <ellipse cx="0.1" cy="0.35" rx="2.5" ry="0.65" fill="none" stroke="#78350f" strokeWidth="0.6" />
        <circle cx="0.1" cy="0.4" r="0.4" fill="#78350f" />
      </g>

      {/* 5. 悬浮微光闪烁粒子 */}
      {isHovered && (
        <g id="honey-sparkles" className="animate-pulse pointer-events-none">
          <circle cx="-3.2" cy="-7.5" r="0.5" fill="#fde047" />
          <circle cx="2.8" cy="-8.5" r="0.4" fill="#fde047" />
        </g>
      )}
    </g>
  );
};
