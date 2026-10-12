import React from 'react';

/**
 * 2.5D 高清极简咖啡角组件 (Crisp Coffee & Cups Display)
 * 专为胡桃木边柜下层开放格设计：
 * - 现烘咖啡熟豆纸袋：立体自立袋身、清晰折角结构、明亮单向排气阀、黄铜折边夹。
 * - 纯净高透玻璃储豆罐：剔透玻璃质感、饱满深烘咖啡豆层、温润天然软木塞与利落垂直反射高光。
 * - 3只手作温暖陶杯：赤陶红双色釉杯、抹茶鼠尾草绿杯、燕麦微斑杯，高反差轮廓，在深色背板前通透立体。
 */

// 1. 咖啡豆组合 (立体纸袋 + 密封储豆罐)
export const CoffeeBeansDisplay: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <g id="shelf-coffee-beans" className={`select-none ${className}`}>
      <defs>
        {/* 牛皮纸袋正面温润暖金渐变 */}
        <linearGradient id="crispBeanBagFrontGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#dfaf7a" />
          <stop offset="60%" stopColor="#edc697" />
          <stop offset="100%" stopColor="#cf9e69" />
        </linearGradient>

        {/* 牛皮纸袋侧风琴褶阴影面 */}
        <linearGradient id="crispBeanBagSideGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9a6936" />
          <stop offset="100%" stopColor="#b5834e" />
        </linearGradient>

        {/* 玻璃罐深烘咖啡豆饱满渐变 */}
        <linearGradient id="crispJarBeansGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#543019" />
          <stop offset="50%" stopColor="#3d200e" />
          <stop offset="100%" stopColor="#221006" />
        </linearGradient>

        {/* 天然质感软木塞渐变 */}
        <linearGradient id="crispCorkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#aa7846" />
          <stop offset="45%" stopColor="#cca172" />
          <stop offset="100%" stopColor="#9c6b39" />
        </linearGradient>
      </defs>

      {/* --- A. 底部接触纯净阴影 (无模糊滤镜，清爽实落) --- */}
      <ellipse cx="-4.8" cy="1.3" rx="4.0" ry="1.5" fill="#120601" opacity="0.4" />
      <ellipse cx="4.2" cy="-0.3" rx="3.6" ry="1.4" fill="#120601" opacity="0.38" />

      {/* --- B. 左侧：立体牛皮纸熟豆自立袋 --- */}
      <g id="kraft-bean-pouch" transform="translate(-4.5, 0.4)">
        {/* 1. 袋身左侧风琴褶阴影侧面 */}
        <polygon
          points="-3.5,0.2 -2.0,0.9 -2.0,-6.6 -3.5,-7.2"
          fill="url(#crispBeanBagSideGrad)"
          stroke="#69431d"
          strokeWidth="0.6"
        />
        {/* 侧面内折压痕清晰线 */}
        <line
          x1="-2.75"
          y1="0.55"
          x2="-2.75"
          y2="-6.9"
          stroke="#522f11"
          strokeWidth="0.6"
        />

        {/* 2. 袋身受光主正面 */}
        <polygon
          points="-2.0,0.9 2.5,-0.3 2.5,-7.8 -2.0,-6.6"
          fill="url(#crispBeanBagFrontGrad)"
          stroke="#734a21"
          strokeWidth="0.65"
        />

        {/* 3. 单向透气排气阀 */}
        <circle cx="0.2" cy="-4.8" r="0.75" fill="#fef08a" stroke="#92400e" strokeWidth="0.5" />
        <circle cx="0.2" cy="-4.8" r="0.3" fill="#78350f" />

        {/* 4. 手工烘焙豆极简米白标签贴纸 (高对比度纯净色块) */}
        <polygon
          points="-1.2,-1.2 1.9,-2.0 1.9,-3.9 -1.2,-3.1"
          fill="#fefcf8"
          stroke="#a89a87"
          strokeWidth="0.5"
        />
        {/* 产区/风味极简线条 */}
        <line x1="-0.8" y1="-3.3" x2="1.5" y2="-3.9" stroke="#78350f" strokeWidth="0.6" strokeLinecap="round" />
        <ellipse cx="0.3" cy="-1.8" rx="0.6" ry="0.35" fill="#78350f" />

        {/* 5. 顶部黄铜封口夹 */}
        <line
          x1="-2.6"
          y1="-7.0"
          x2="2.3"
          y2="-8.3"
          stroke="#f59e0b"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
        <line
          x1="-2.4"
          y1="-7.1"
          x2="2.1"
          y2="-8.4"
          stroke="#fef08a"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
      </g>

      {/* --- C. 右侧：高透高硼硅玻璃圆柱储豆罐 --- */}
      <g id="glass-bean-jar" transform="translate(4.2, -0.6)">
        {/* 1. 加厚玻璃底座反光层 */}
        <path
          d="M -3.2,0.5 L -3.2,-0.2 C -3.2,0.4 3.2,0.4 3.2,-0.2 L 3.2,0.5 C 3.2,1.2 -3.2,1.2 -3.2,0.5 Z"
          fill="#64748b"
          fillOpacity="0.25"
          stroke="#475569"
          strokeWidth="0.5"
        />

        {/* 2. 满装深烘精品咖啡豆层 (饱满醇厚色块) */}
        <path
          d="M -2.9,-0.2 L -2.9,-5.3 C -2.9,-6.0 2.9,-6.0 2.9,-5.3 L 2.9,-0.2 C 2.9,0.5 -2.9,0.5 -2.9,-0.2 Z"
          fill="url(#crispJarBeansGrad)"
          stroke="#1f0c03"
          strokeWidth="0.6"
        />
        {/* 咖啡豆顶面弧度 */}
        <ellipse cx="0" cy="-5.3" rx="2.9" ry="0.85" fill="#522f18" stroke="#1f0c03" strokeWidth="0.5" />

        {/* 精致提炼的 3 颗醒目熟豆 (告别数十颗模糊碎线) */}
        <ellipse cx="-1.2" cy="-4.2" rx="0.9" ry="0.55" transform="rotate(-15, -1.2, -4.2)" fill="#6e3f22" stroke="#1a0902" strokeWidth="0.4" />
        <ellipse cx="0.8" cy="-3.0" rx="0.95" ry="0.6" transform="rotate(20, 0.8, -3.0)" fill="#6e3f22" stroke="#1a0902" strokeWidth="0.4" />
        <ellipse cx="-0.6" cy="-1.8" rx="0.9" ry="0.55" fill="#5c341b" stroke="#1a0902" strokeWidth="0.4" />

        {/* 3. 清透高硼硅玻璃圆柱外轮廓 */}
        <path
          d="M -3.2,0.5 L -3.2,-6.8 C -3.2,-7.5 3.2,-7.5 3.2,-6.8 L 3.2,0.5 C 3.2,1.2 -3.2,1.2 -3.2,0.5 Z"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="0.65"
          strokeOpacity="0.6"
        />

        {/* 4. 玻璃受光侧清晰纯白高光线 (高反差通透感) */}
        <line
          x1="-2.3"
          y1="-6.2"
          x2="-2.3"
          y2="0.0"
          stroke="#ffffff"
          strokeWidth="0.75"
          strokeLinecap="round"
          opacity="0.85"
        />
        <line
          x1="2.4"
          y1="-5.8"
          x2="2.4"
          y2="-0.4"
          stroke="#ffffff"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.4"
        />

        {/* 5. 温润天然软木塞 */}
        <path
          d="M -2.8,-6.9 L -2.5,-8.3 C -2.5,-9.0 2.5,-9.0 2.5,-8.3 L 2.8,-6.9 Z"
          fill="url(#crispCorkGrad)"
          stroke="#693d17"
          strokeWidth="0.6"
        />
        {/* 软木塞顶端平圆面 */}
        <ellipse cx="0" cy="-8.3" rx="2.5" ry="0.7" fill="#deb688" stroke="#875323" strokeWidth="0.5" />
      </g>
    </g>
  );
};

// 2. 几只手作小陶杯 (3只色彩饱满、轮廓锐利的手作杯)
export const CeramicCupsDisplay: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <g id="shelf-ceramic-cups" className={`select-none ${className}`}>
      {/* 底部接触纯净实触阴影 */}
      <ellipse cx="-5.0" cy="0.6" rx="2.4" ry="1.0" fill="#120601" opacity="0.38" />
      <ellipse cx="1.6" cy="0.2" rx="2.4" ry="1.0" fill="#120601" opacity="0.35" />
      <ellipse cx="-1.2" cy="1.3" rx="2.4" ry="1.0" fill="#120601" opacity="0.42" />

      {/* 杯 1：左侧 · 温暖赤陶红双色浸釉杯 */}
      <g id="cup-terracotta" transform="translate(-5.0, 0.4)">
        {/* 裸陶底座 */}
        <path d="M -1.8,0.2 L -1.8,-1.2 L 1.8,-1.2 L 1.8,0.2 Z" fill="#9c5a3b" stroke="#68341e" strokeWidth="0.5" />
        {/* 赤陶红杯身 */}
        <path
          d="M -1.8,-1.2 L -2.1,-4.5 L 2.1,-4.5 L 1.8,-1.2 Z"
          fill="#c85a3a"
          stroke="#7f2913"
          strokeWidth="0.6"
        />
        {/* 口沿纯白浸釉 */}
        <path
          d="M -2.1,-3.6 L -2.1,-4.5 L 2.1,-4.5 L 2.1,-3.6 Q 0,-3.9 -2.1,-3.6 Z"
          fill="#fefcf8"
        />
        {/* 杯口圆唇与热咖啡液面 */}
        <ellipse cx="0" cy="-4.5" rx="2.1" ry="0.75" fill="#fefcf8" stroke="#7f2913" strokeWidth="0.5" />
        <ellipse cx="0" cy="-4.5" rx="1.7" ry="0.5" fill="#381d11" />
        {/* 杯面高光亮线 */}
        <line x1="-1.3" y1="-4.1" x2="-1.2" y2="-1.2" stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* 杯 3：后右侧 · 燕麦斑点浓缩杯 */}
      <g id="cup-oatmeal" transform="translate(1.6, -0.1)">
        <path
          d="M -1.8,0.2 L -2.2,-3.8 L 2.2,-3.8 L 1.8,0.2 Z"
          fill="#e8dfd1"
          stroke="#8c7b66"
          strokeWidth="0.6"
        />
        {/* 手工铁斑颗粒 */}
        <circle cx="-0.8" cy="-1.5" r="0.3" fill="#443527" />
        <circle cx="0.8" cy="-2.5" r="0.28" fill="#443527" />
        {/* 杯口 */}
        <ellipse cx="0" cy="-3.8" rx="2.2" ry="0.8" fill="#fcf9f2" stroke="#8c7b66" strokeWidth="0.5" />
        <ellipse cx="0" cy="-3.8" rx="1.8" ry="0.6" fill="#3d2214" />
        <line x1="-1.4" y1="-3.4" x2="-1.2" y2="-0.8" stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" opacity="0.8" />
      </g>

      {/* 杯 2：前中侧 · 抹茶鼠尾草绿杯 */}
      <g id="cup-matcha" transform="translate(-1.2, 1.1)">
        <path
          d="M -1.7,0.2 L -1.9,-5.2 L 1.9,-5.2 L 1.7,0.2 Z"
          fill="#5f835b"
          stroke="#344e31"
          strokeWidth="0.6"
        />
        {/* 杯口与茶汤 */}
        <ellipse cx="0" cy="-5.2" rx="1.9" ry="0.7" fill="#88ad84" stroke="#344e31" strokeWidth="0.5" />
        <ellipse cx="0" cy="-5.2" rx="1.5" ry="0.5" fill="#2d190e" />
        <line x1="-1.2" y1="-4.8" x2="-1.0" y2="-0.6" stroke="#ffffff" strokeWidth="0.6" strokeLinecap="round" opacity="0.75" />
      </g>
    </g>
  );
};
