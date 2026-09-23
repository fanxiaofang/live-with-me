import React from 'react';

/**
 * 2.5D 治愈风咖啡角组件 (Coffee & Cups Collection)
 * 专为轻盈收纳柜下层格设计：
 * - 现烘咖啡熟豆纸袋 (立体自立袋身、风琴褶侧面、单向排气阀、黄铜折边夹，严丝合缝平稳落座于搁板面)
 * - 软木塞玻璃储豆罐 (透亮圆柱玻璃、高烘咖啡豆)
 * - 3只手作温暖陶土/抹茶/燕麦釉色咖啡杯 (自然高低错落的手工杯组)
 */

// 1. 咖啡豆组合 (立体纸袋 + 密封罐)
export const CoffeeBeansDisplay: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <g id="shelf-coffee-beans" className={`select-none ${className}`}>
      <defs>
        {/* 牛皮纸袋正面温润渐变 */}
        <linearGradient id="beanBagFrontGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#d4a36e" />
          <stop offset="60%" stopColor="#e2b988" />
          <stop offset="100%" stopColor="#c89660" />
        </linearGradient>

        {/* 牛皮纸袋侧风琴褶阴影渐变 */}
        <linearGradient id="beanBagSideGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#966838" />
          <stop offset="100%" stopColor="#b4834e" />
        </linearGradient>

        {/* 玻璃罐深烘咖啡豆渐变 */}
        <linearGradient id="jarBeansGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4a2a14" />
          <stop offset="50%" stopColor="#331b0c" />
          <stop offset="100%" stopColor="#221107" />
        </linearGradient>

        {/* 真实高透清澈玻璃壁渐变 (两侧微弱折射，中央纯净通透，彻底告别浑浊塑料感) */}
        <linearGradient id="clearGlassWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.25" />
          <stop offset="8%" stopColor="#94a3b8" stopOpacity="0.10" />
          <stop offset="25%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="75%" stopColor="#ffffff" stopOpacity="0.02" />
          <stop offset="92%" stopColor="#94a3b8" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#f8fafc" stopOpacity="0.22" />
        </linearGradient>

        {/* 柔和玻璃光学反射微光渐变 (两端自然羽化消散，不生硬刺眼) */}
        <linearGradient id="softGlassSheenGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="15%" stopColor="#ffffff" stopOpacity="0.30" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="85%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
        </linearGradient>

        {/* 天然质感软木塞渐变 */}
        <linearGradient id="naturalCorkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a37242" />
          <stop offset="35%" stopColor="#c69768" />
          <stop offset="70%" stopColor="#d5a87b" />
          <stop offset="100%" stopColor="#ab7a49" />
        </linearGradient>

        {/* 牛皮纸袋底部自立褶微阴影 */}
        <linearGradient id="bagBottomFoldGrad" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#875b2d" />
          <stop offset="100%" stopColor="#d4a36e" />
        </linearGradient>
      </defs>

      {/* --- A. 底部接触柔和投影 (牢牢贴合柜板，消除悬空感) --- */}
      {/* 咖啡豆纸袋底部实触阴影与扩散软影 */}
      <ellipse cx="-4.8" cy="1.3" rx="3.8" ry="1.4" fill="#18110b" opacity="0.32" />
      <polygon
        points="-7.8,0.7 -3.5,1.7 -1.6,0.5 -5.8,-0.2"
        fill="#120c07"
        opacity="0.22"
      />

      {/* 右侧玻璃储豆罐投影 (与加大后的罐底严密贴合) */}
      <ellipse cx="4.2" cy="-0.3" rx="3.6" ry="1.4" fill="#18110b" opacity="0.30" />
      <ellipse cx="4.2" cy="-0.3" rx="2.6" ry="0.9" fill="#120c07" opacity="0.24" />

      {/* --- B. 左侧：立体牛皮纸熟豆自立袋 (已沿Z轴落座底板，具备饱满2.5D厚度与结构) --- */}
      <g id="kraft-bean-pouch" transform="translate(-4.5, 0.4)">
        {/* 1. 袋身左侧风琴褶 (Gusset Side Panel - 呈现厚度与进深) */}
        <polygon
          points="-3.5,0.2 -2.0,0.9 -2.0,-6.6 -3.5,-7.2"
          fill="url(#beanBagSideGrad)"
          stroke="#7a5229"
          strokeWidth="0.25"
        />
        {/* 侧面内折压痕虚线/折痕 */}
        <line
          x1="-2.75"
          y1="0.55"
          x2="-2.75"
          y2="-6.9"
          stroke="#68421d"
          strokeWidth="0.3"
          opacity="0.7"
        />

        {/* 2. 袋身受光主正面 (Front Panel) */}
        <polygon
          points="-2.0,0.9 2.5,-0.3 2.5,-7.8 -2.0,-6.6"
          fill="url(#beanBagFrontGrad)"
          stroke="#825c35"
          strokeWidth="0.3"
        />

        {/* 3. 底部立体自立袋三角折角 (Bottom Stand-up Tuck) */}
        <polygon
          points="-2.0,0.9 0.2,0.3 -2.0,-0.3"
          fill="url(#bagBottomFoldGrad)"
          opacity="0.5"
        />
        <line
          x1="-2.0"
          y1="0.9"
          x2="2.5"
          y2="-0.3"
          stroke="#5c3c1e"
          strokeWidth="0.4"
        />

        {/* 4. 单向排气透气阀 (Degassing Valve - 烘焙豆袋核心细节) */}
        <circle cx="0.2" cy="-4.8" r="0.6" fill="#eed5b8" stroke="#aa7948" strokeWidth="0.2" />
        <circle cx="0.2" cy="-4.8" r="0.25" fill="#754b23" />

        {/* 5. 极简手工烘焙豆标签贴纸 (Specialty Label) */}
        <polygon
          points="-1.2,-1.2 1.9,-2.0 1.9,-3.9 -1.2,-3.1"
          fill="#faf6ee"
          stroke="#c9b9a6"
          strokeWidth="0.2"
        />
        {/* 产区/风味抽象极简条纹与小咖啡豆图腾 */}
        <line x1="-0.8" y1="-3.3" x2="1.5" y2="-3.9" stroke="#6e5033" strokeWidth="0.35" strokeLinecap="round" />
        <line x1="-0.8" y1="-2.7" x2="0.6" y2="-3.1" stroke="#96704c" strokeWidth="0.25" strokeLinecap="round" />
        <ellipse cx="0.3" cy="-1.8" rx="0.5" ry="0.3" fill="#54311c" />

        {/* 6. 顶部折叠封口与黄铜封条夹 (Top Crimp & Tin-Tie Clip) */}
        {/* 折边背光厚度 */}
        <polygon
          points="-3.5,-7.2 -2.0,-6.6 2.5,-7.8 2.3,-8.5 -2.0,-7.3 -3.5,-7.9"
          fill="#85592e"
        />
        {/* 压合折封条主体 */}
        <polygon
          points="-2.0,-6.6 2.5,-7.8 2.4,-7.4 -2.0,-6.2"
          fill="#caa173"
        />
        {/* 黄铜金属封口夹 */}
        <line
          x1="-2.6"
          y1="-7.0"
          x2="2.3"
          y2="-8.3"
          stroke="#d97706"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
        <line
          x1="-2.4"
          y1="-7.1"
          x2="2.1"
          y2="-8.4"
          stroke="#fef08a"
          strokeWidth="0.4"
          strokeLinecap="round"
          opacity="0.8"
        />
      </g>

      {/* --- C. 右侧：高透高硼硅玻璃圆柱储豆罐 (精巧放大比例、温润天然软木塞、真实通透折射与柔和微光) --- */}
      <g id="glass-bean-jar" transform="translate(4.2, -0.6)">
        {/* 1. 加厚实心玻璃底座折射层 (Thick Glass Base - 消除塑料单薄感，呈现玻璃器皿的质感分量) */}
        <path
          d="M -3.2,0.5 L -3.2,-0.3 C -3.2,0.35 3.2,0.35 3.2,-0.3 L 3.2,0.5 C 3.2,1.2 -3.2,1.2 -3.2,0.5 Z"
          fill="#94a3b8"
          fillOpacity="0.12"
        />
        <path
          d="M -2.6,0.65 C -1.2,1.05 1.2,1.05 2.6,0.65"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.22"
          opacity="0.25"
        />

        {/* 2. 满装深烘焙精品咖啡豆 (透明玻璃内部饱满熟豆堆叠，颗粒分明) */}
        <path
          d="M -2.9,-0.2 L -2.9,-5.3 C -2.9,-6.0 2.9,-6.0 2.9,-5.3 L 2.9,-0.2 C 2.9,0.5 -2.9,0.5 -2.9,-0.2 Z"
          fill="url(#jarBeansGrad)"
        />
        {/* 咖啡豆堆叠顶面自然弧面 */}
        <ellipse cx="0" cy="-5.3" rx="2.9" ry="0.8" fill="#422511" stroke="#251208" strokeWidth="0.18" />

        {/* 精致咖啡豆颗粒细节与中心缝线 */}
        <g id="jar-coffee-beans-detail" opacity="0.95">
          {/* 顶层饱满熟豆 */}
          <ellipse cx="-1.5" cy="-4.9" rx="0.75" ry="0.46" transform="rotate(-15, -1.5, -4.9)" fill="#5e371e" stroke="#221107" strokeWidth="0.14" />
          <line x1="-1.9" y1="-5.0" x2="-1.1" y2="-4.8" stroke="#1c0d05" strokeWidth="0.16" />

          <ellipse cx="0.1" cy="-5.1" rx="0.8" ry="0.48" fill="#522f18" stroke="#221107" strokeWidth="0.14" />
          <line x1="-0.3" y1="-5.1" x2="0.5" y2="-5.1" stroke="#1c0d05" strokeWidth="0.16" />

          <ellipse cx="1.7" cy="-4.7" rx="0.75" ry="0.45" transform="rotate(20, 1.7, -4.7)" fill="#63391f" stroke="#221107" strokeWidth="0.14" />
          <line x1="1.3" y1="-4.8" x2="2.1" y2="-4.5" stroke="#1c0d05" strokeWidth="0.16" />

          {/* 中上层熟豆 */}
          <ellipse cx="-1.8" cy="-3.8" rx="0.8" ry="0.48" fill="#4c2a15" stroke="#221107" strokeWidth="0.14" />
          <ellipse cx="-0.3" cy="-4.0" rx="0.82" ry="0.5" fill="#5a331b" stroke="#221107" strokeWidth="0.14" />
          <line x1="-0.7" y1="-4.0" x2="0.1" y2="-4.0" stroke="#1c0d05" strokeWidth="0.16" />

          <ellipse cx="1.4" cy="-3.6" rx="0.8" ry="0.48" fill="#4e2b16" stroke="#221107" strokeWidth="0.14" />

          {/* 中下层熟豆 */}
          <ellipse cx="-1.2" cy="-2.6" rx="0.82" ry="0.5" fill="#61371e" stroke="#221107" strokeWidth="0.14" />
          <line x1="-1.6" y1="-2.6" x2="-0.8" y2="-2.6" stroke="#1c0d05" strokeWidth="0.16" />

          <ellipse cx="0.6" cy="-2.7" rx="0.85" ry="0.5" fill="#522d17" stroke="#221107" strokeWidth="0.14" />
          <ellipse cx="2.0" cy="-2.4" rx="0.72" ry="0.44" fill="#462411" stroke="#221107" strokeWidth="0.14" />

          {/* 底层近玻璃处熟豆 */}
          <ellipse cx="-1.8" cy="-1.4" rx="0.8" ry="0.48" fill="#4c2813" stroke="#221107" strokeWidth="0.14" />
          <ellipse cx="-0.1" cy="-1.5" rx="0.85" ry="0.5" fill="#59321b" stroke="#221107" strokeWidth="0.14" />
          <line x1="-0.5" y1="-1.5" x2="0.3" y2="-1.5" stroke="#1c0d05" strokeWidth="0.16" />

          <ellipse cx="1.5" cy="-1.3" rx="0.8" ry="0.48" fill="#482612" stroke="#221107" strokeWidth="0.14" />
          <ellipse cx="-0.8" cy="-0.5" rx="0.8" ry="0.5" fill="#563019" stroke="#221107" strokeWidth="0.14" />
          <ellipse cx="0.9" cy="-0.6" rx="0.8" ry="0.5" fill="#492713" stroke="#221107" strokeWidth="0.14" />
        </g>

        {/* 3. 清透高硼硅玻璃圆柱壁 (高透无色、两侧低饱和微弱边缘折射，通透纯粹) */}
        <path
          d="M -3.2,0.5 L -3.2,-6.8 C -3.2,-7.5 3.2,-7.5 3.2,-6.8 L 3.2,0.5 C 3.2,1.2 -3.2,1.2 -3.2,0.5 Z"
          fill="url(#clearGlassWallGrad)"
          stroke="#94a3b8"
          strokeWidth="0.22"
          strokeOpacity="0.35"
        />

        {/* 4. 玻璃罐口双层圆润收边 (柔和半透明微反射，取代生硬刺眼的纯白粗圈) */}
        <ellipse cx="0" cy="-6.8" rx="3.2" ry="0.88" fill="none" stroke="#ffffff" strokeWidth="0.22" opacity="0.35" />
        <ellipse cx="0" cy="-6.8" rx="2.8" ry="0.75" fill="none" stroke="#cbd5e1" strokeWidth="0.16" opacity="0.25" />

        {/* 5. 温润天然软木塞 (微倒角锥形木塞，贴合高硼硅玻璃瓶口) */}
        {/* 内部下嵌塞身微影 */}
        <ellipse cx="0" cy="-6.9" rx="2.7" ry="0.72" fill="#78471f" opacity="0.6" />
        {/* 软木塞外露主体 */}
        <path
          d="M -2.8,-6.9 L -2.5,-8.3 C -2.5,-9.0 2.5,-9.0 2.5,-8.3 L 2.8,-6.9 Z"
          fill="url(#naturalCorkGrad)"
          stroke="#7a461d"
          strokeWidth="0.2"
        />
        {/* 软木塞顶端平圆切面 */}
        <ellipse cx="0" cy="-8.3" rx="2.5" ry="0.7" fill="#deb688" stroke="#966535" strokeWidth="0.18" />
        {/* 软木自然微孔质感 */}
        <circle cx="-1.1" cy="-7.6" r="0.16" fill="#5e3414" opacity="0.32" />
        <circle cx="0.8" cy="-7.8" r="0.14" fill="#5e3414" opacity="0.32" />
        <circle cx="-0.2" cy="-8.1" r="0.13" fill="#5e3414" opacity="0.28" />
        <circle cx="1.4" cy="-7.4" r="0.15" fill="#5e3414" opacity="0.28" />

        {/* 6. 柔和光学微光泽 (羽化渐变纵向反光，绝不生硬死白) */}
        {/* 主受光侧微光条（两端淡入淡出羽化，半透明优雅） */}
        <line
          x1="-2.3"
          y1="-6.4"
          x2="-2.3"
          y2="0.0"
          stroke="url(#softGlassSheenGrad)"
          strokeWidth="0.28"
          strokeLinecap="round"
        />
        {/* 极纤细内部高光丝 */}
        <line
          x1="-2.3"
          y1="-5.5"
          x2="-2.3"
          y2="-1.5"
          stroke="#ffffff"
          strokeWidth="0.15"
          strokeLinecap="round"
          opacity="0.24"
        />
        {/* 右侧环境微弱漫射轮廓光 */}
        <line
          x1="2.4"
          y1="-6.0"
          x2="2.4"
          y2="-0.6"
          stroke="#ffffff"
          strokeWidth="0.16"
          strokeLinecap="round"
          opacity="0.12"
        />
      </g>
    </g>
  );
};

// 2. 几只手作小陶杯 (3只色彩与房间呼应的手工咖啡杯)
export const CeramicCupsDisplay: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <g id="shelf-ceramic-cups" className={`select-none ${className}`}>
      {/* 底部接触阴影 (对应三个杯子的新落位：红色杯不动，另外两只往左下方自然收拢) */}
      {/* 杯1阴影 (红色杯：位置固定不变) */}
      <ellipse cx="-5.0" cy="0.6" rx="2.4" ry="1.0" fill="#18110b" opacity="0.25" />
      {/* 杯3阴影 (燕麦杯：往左下移动到 x:1.6, y:0.0) */}
      <ellipse cx="1.6" cy="0.2" rx="2.4" ry="1.0" fill="#18110b" opacity="0.25" />
      {/* 杯2阴影 (抹茶绿杯：往左下移动到 x:-1.2, y:1.1，处于前排) */}
      <ellipse cx="-1.2" cy="1.3" rx="2.4" ry="1.0" fill="#18110b" opacity="0.26" />

      {/* 杯 1：左侧 · 温暖赤陶红双色釉杯 (位置完全不动: translate(-5.0, 0.4)) */}
      <g id="cup-terracotta" transform="translate(-5.0, 0.4)">
        {/* 裸陶底座 */}
        <path d="M -1.8,0.2 L -1.8,-1.2 L 1.8,-1.2 L 1.8,0.2 Z" fill="#9c5a3b" />
        {/* 赤陶红杯身 */}
        <path
          d="M -1.8,-1.2 L -2.1,-4.5 L 2.1,-4.5 L 1.8,-1.2 Z"
          fill="#c85a3a"
          stroke="#8c3b22"
          strokeWidth="0.25"
        />
        {/* 口沿白色浸釉 */}
        <path
          d="M -2.1,-3.6 L -2.1,-4.5 L 2.1,-4.5 L 2.1,-3.6 Q 0,-3.9 -2.1,-3.6 Z"
          fill="#faf6ee"
        />
        {/* 杯口圆唇与热咖啡液面 */}
        <ellipse cx="0" cy="-4.5" rx="2.1" ry="0.75" fill="#faf6ee" stroke="#8c3b22" strokeWidth="0.2" />
        <ellipse cx="0" cy="-4.5" rx="1.7" ry="0.5" fill="#381d11" />
        {/* 杯面柔和高光微线 */}
        <line x1="-1.3" y1="-4.1" x2="-1.2" y2="-1.2" stroke="#ffffff" strokeWidth="0.35" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* 杯 3：后右侧 · 燕麦微斑浓缩杯 (从原先靠后的 (5.0, -1.2) 往左下移动至 (1.6, -0.1)) */}
      <g id="cup-oatmeal" transform="translate(1.6, -0.1)">
        <path
          d="M -1.8,0.2 L -2.2,-3.8 L 2.2,-3.8 L 1.8,0.2 Z"
          fill="#e8dfd1"
          stroke="#a39683"
          strokeWidth="0.25"
        />
        {/* 手工铁斑细微颗粒 */}
        <circle cx="-0.8" cy="-1.5" r="0.22" fill="#524335" />
        <circle cx="0.8" cy="-2.5" r="0.2" fill="#524335" />
        <circle cx="0.2" cy="-0.9" r="0.18" fill="#524335" />
        {/* 杯口 */}
        <ellipse cx="0" cy="-3.8" rx="2.2" ry="0.8" fill="#fcf9f2" stroke="#a39683" strokeWidth="0.2" />
        <ellipse cx="0" cy="-3.8" rx="1.8" ry="0.6" fill="#3d2214" />
        <line x1="-1.4" y1="-3.4" x2="-1.2" y2="-0.8" stroke="#ffffff" strokeWidth="0.4" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* 杯 2：前中侧 · 抹茶鼠尾草绿杯 (从原先偏上的 (0, -0.4) 往左下移动至 (-1.2, 1.1)) */}
      <g id="cup-matcha" transform="translate(-1.2, 1.1)">
        <path
          d="M -1.7,0.2 L -1.9,-5.2 L 1.9,-5.2 L 1.7,0.2 Z"
          fill="#6b8e67"
          stroke="#425c3f"
          strokeWidth="0.25"
        />
        {/* 杯身手拉坯微肋纹 */}
        <line x1="-1.7" y1="-1.5" x2="1.7" y2="-1.5" stroke="#88ad84" strokeWidth="0.3" opacity="0.6" />
        <line x1="-1.8" y1="-3.2" x2="1.8" y2="-3.2" stroke="#52704f" strokeWidth="0.3" opacity="0.6" />
        {/* 杯口 */}
        <ellipse cx="0" cy="-5.2" rx="1.9" ry="0.7" fill="#88ad84" stroke="#425c3f" strokeWidth="0.2" />
        <ellipse cx="0" cy="-5.2" rx="1.5" ry="0.5" fill="#2d190e" />
        <line x1="-1.2" y1="-4.8" x2="-1.0" y2="-0.6" stroke="#ffffff" strokeWidth="0.35" strokeLinecap="round" opacity="0.55" />
      </g>
    </g>
  );
};
