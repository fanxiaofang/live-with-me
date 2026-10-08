import React from 'react';

/**
 * 2.5D 建筑基底体系 (Architectural Foundation, Crawl Space & Porch Steps)
 * 
 * 包含完整的北欧/日式田园木构建筑基础构造：
 * 1. 夯土散水与接地漫反射阴影 (Earth Berm, Crushed Stone Drainage Swale & Ground AO)
 * 2. 架空防潮层通风木格栅 (Ventilated Crawl Space Recess & Timber Slats)
 * 3. 承重实木短柱体系 (Sturdy Timber Foundation Posts & Tie Brackets)
 * 4. 花岗岩柱础石 (Carved Granite Pier Plinths / 束石)
 * 5. 前廊工匠级双层实木踏步与迎客石板 (Porch Timber Steps & Welcome Flagstone)
 * 6. 基底收边野花草叶与门廊铜灯 (Foundation Greenery & Brass Lantern)
 */

interface CottageFoundationProps {
  className?: string;
}

export const CottageFoundation: React.FC<CottageFoundationProps> = ({ className }) => {
  // 承重立柱沿前缘 X 轴分布坐标 (对称分布)
  const postsLeft = [-225, -165, -105, -45];
  const postsRight = [45, 105, 165, 225];

  return (
    <g id="architectural-cottage-foundation" className={className}>
      <defs>
        {/* 散水碎石垫层渐变 */}
        <linearGradient id="gravelSwaleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#63594e" />
          <stop offset="60%" stopColor="#4c433a" />
          <stop offset="100%" stopColor="#37312a" />
        </linearGradient>

        {/* 迎客青石板材质渐变 */}
        <linearGradient id="flagstoneSurfaceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#877d70" />
          <stop offset="50%" stopColor="#71675a" />
          <stop offset="100%" stopColor="#554d42" />
        </linearGradient>

        {/* 柱础花岗岩正面渐变 */}
        <linearGradient id="granitePierGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#766d62" />
          <stop offset="100%" stopColor="#4f473f" />
        </linearGradient>

        {/* 实木短柱向光侧渐变 */}
        <linearGradient id="timberPostGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5c3c24" />
          <stop offset="45%" stopColor="#6e492d" />
          <stop offset="100%" stopColor="#452a16" />
        </linearGradient>

        {/* 踏步实木踏面渐变 */}
        <linearGradient id="stepTimberTreadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#966a41" />
          <stop offset="100%" stopColor="#7a4f29" />
        </linearGradient>
      </defs>

      {/* ======================================================== */}
      {/* 1. 夯土垫层、碎石散水与接地柔和遮蔽阴影 (Ground AO & Gravel) */}
      {/* ======================================================== */}
      <g id="foundation-earth-gravel-berm">
        {/* 碎石散水护坡垫层 (Crushed Stone Drainage Swale Footprint - 柔和嵌入地表草甸) */}
        <polygon
          points="-292,145 0,62 292,145 0,236"
          fill="url(#gravelSwaleGrad)"
          stroke="#423930"
          strokeWidth="0.5"
        />
        {/* 碎石前缘柔和过渡阴影 (摒弃生硬死黑切线，自然羽化融入草坪) */}
        <polyline
          points="-292,145 0,236 292,145"
          stroke="#1e2c18"
          strokeWidth="1.4"
          opacity="0.28"
          strokeLinecap="round"
          fill="none"
        />

        {/* 散落的自然小卵石与碎石纹理 (Scattered River Gravel Pebbles) */}
        {[
          { cx: -240, cy: 168, rx: 3, ry: 1.5 },
          { cx: -190, cy: 188, rx: 3.5, ry: 1.8 },
          { cx: -130, cy: 206, rx: 4, ry: 1.9 },
          { cx: -75, cy: 224, rx: 3.2, ry: 1.6 },
          { cx: 75, cy: 224, rx: 3.8, ry: 1.8 },
          { cx: 130, cy: 206, rx: 4.2, ry: 2.0 },
          { cx: 190, cy: 188, rx: 3.4, ry: 1.6 },
          { cx: 240, cy: 168, rx: 3, ry: 1.5 },
        ].map((peb, i) => (
          <ellipse
            key={`gravel-peb-${i}`}
            cx={peb.cx}
            cy={peb.cy}
            rx={peb.rx}
            ry={peb.ry}
            fill="#786f64"
            stroke="#453e37"
            strokeWidth="0.5"
            opacity="0.75"
          />
        ))}

        {/* 🌿 散落石缝中的自然微草丝 (Subtle Verge Grass Sprouting from Stones) */}
        <g id="gravel-verge-grass" opacity="0.75">
          <path d="M-210,180 Q-213,174 -216,170 M-208,180 Q-209,173 -209,168" stroke="#527829" strokeWidth="0.8" fill="none" />
          <path d="M-80,222 Q-82,216 -85,212 M-78,222 Q-77,215 -76,211" stroke="#486d24" strokeWidth="0.8" fill="none" />
          <path d="M120,208 Q122,202 125,198 M118,208 Q119,203 118,199" stroke="#527829" strokeWidth="0.8" fill="none" />
          <path d="M210,180 Q213,174 216,171" stroke="#486d24" strokeWidth="0.8" fill="none" />
        </g>
      </g>

      {/* ======================================================== */}
      {/* 2. 架空防潮层暗部与通风木格栅 (Crawl Space & Ventilated Slats) */}
      {/* ======================================================== */}
      <g id="foundation-ventilated-crawlspace">
        {/* 室内架空深部阴影背板 (Deep Recessed Underfloor Shadow) */}
        {/* 左侧面: (-272, 142) -> (0, 219) -> (0, 236) -> (-272, 159) */}
        <polygon
          points="-272,142 0,219 0,236 -272,159"
          fill="#1c1611"
        />
        {/* 右侧面: (0, 219) -> (272, 142) -> (272, 159) -> (0, 236) */}
        <polygon
          points="0,219 272,142 272,159 0,236"
          fill="#15100c"
        />

        {/* 细密通风防潮排栅条 (Ventilated Timber Slat Grating) */}
        {/* 左侧通风栅条 */}
        {Array.from({ length: 32 }).map((_, i) => {
          const t = (i + 0.5) / 32;
          const x = -272 + t * 272;
          const yTop = 142 + t * 77;
          const yBot = 159 + t * 77;
          return (
            <line
              key={`slat-l-${i}`}
              x1={x}
              y1={yTop + 1}
              x2={x}
              y2={yBot - 1}
              stroke="#3d2c1d"
              strokeWidth="2.2"
              opacity="0.8"
            />
          );
        })}

        {/* 右侧通风栅条 */}
        {Array.from({ length: 32 }).map((_, i) => {
          const t = (i + 0.5) / 32;
          const x = 0 + t * 272;
          const yTop = 219 - t * 77;
          const yBot = 236 - t * 77;
          return (
            <line
              key={`slat-r-${i}`}
              x1={x}
              y1={yTop + 1}
              x2={x}
              y2={yBot - 1}
              stroke="#332418"
              strokeWidth="2.2"
              opacity="0.75"
            />
          );
        })}
      </g>

      {/* ======================================================== */}
      {/* 3. 承重短柱与花岗岩柱础石 (Posts & Granite Plinths)        */}
      {/* ======================================================== */}
      <g id="foundation-posts-and-plinths">
        {/* 渲染单组柱脚组件 helper */}
        {[...postsLeft, 0, ...postsRight].map((px) => {
          const isLeft = px <= 0;
          // 计算柱顶在收边梁下沿的 Y 坐标
          const yTop = 219 + (isLeft ? 0.283088 * px : -0.283088 * px);
          // 柱脚落点在基础面上的 Y 坐标
          const yBot = yTop + 13.5;
          const postW = 5.5;

          return (
            <g key={`pier-post-${px}`}>
              {/* --- A. 花岗岩柱础石 (Carved Granite Pier Plinth) --- */}
              <g transform={`translate(${px}, ${yBot})`}>
                {/* 础石地面落点接触投影 */}
                <ellipse cx="0" cy="4.2" rx="7.5" ry="2.6" fill="#140e0a" opacity="0.6" />

                {/* 础石正面与侧面 */}
                <polygon
                  points="-6,0 0,-1.7 6,0 6,3.5 0,5.2 -6,3.5"
                  fill="url(#granitePierGrad)"
                  stroke="#38322a"
                  strokeWidth="0.6"
                />
                {/* 础石顶面 */}
                <polygon
                  points="-6,0 0,-1.7 6,0 0,1.7"
                  fill="#8c8276"
                />
                {/* 础石受光高光倒角 */}
                <line x1="-6" y1="0" x2="0" y2="1.7" stroke="#b0a79b" strokeWidth="0.6" opacity="0.7" />
              </g>

              {/* --- B. 实木承重方柱 (Timber Post Stem) --- */}
              {/* 柱身正面 */}
              <rect
                x={px - postW / 2}
                y={yTop}
                width={postW}
                height={13.5}
                fill="url(#timberPostGrad)"
                stroke="#331e0f"
                strokeWidth="0.6"
                rx="0.5"
              />
              {/* 柱身向光高光细线 */}
              <line
                x1={px - postW / 2 + 0.8}
                y1={yTop}
                x2={px - postW / 2 + 0.8}
                y2={yTop + 13.5}
                stroke="#9c714c"
                strokeWidth="0.5"
                opacity="0.6"
              />

              {/* 柱顶承重铁件包角与螺栓 (Timber Post Tie Bracket) */}
              <rect
                x={px - postW / 2 - 0.5}
                y={yTop - 0.5}
                width={postW + 1}
                height="3.2"
                fill="#362f2a"
                stroke="#221e1a"
                strokeWidth="0.5"
                rx="0.5"
              />
              <circle cx={px} cy={yTop + 1.2} r="0.6" fill="#a89a8c" />
            </g>
          );
        })}
      </g>

      {/* ======================================================== */}
      {/* 4. 工匠级前廊双层实木踏步与迎客石板 (Porch Steps & Slate) */}
      {/* ======================================================== */}
      <g id="porch-entrance-steps">
        {/* --- 踏步底层接触阴影 --- */}
        <ellipse cx="0" cy="242" rx="48" ry="12" fill="#140e08" opacity="0.55" />

        {/* --- 第二级踏步 (Lower Step Landing) --- */}
        <g id="step-lower">
          {/* 踏面顶板 (Y: 226 -> 234, 跨度 84px) */}
          <polygon
            points="-42,226 0,218 42,226 0,234"
            fill="url(#stepTimberTreadGrad)"
            stroke="#4e311a"
            strokeWidth="0.8"
          />
          {/* 踏面黄铜防滑条 (Brass Inlay Strip) */}
          <line x1="-36" y1="227.5" x2="0" y2="220" stroke="#f59e0b" strokeWidth="0.75" opacity="0.85" />
          <line x1="0" y1="220" x2="36" y2="227.5" stroke="#d97706" strokeWidth="0.75" opacity="0.8" />
          {/* 左侧立板 */}
          <polygon
            points="-42,226 0,234 0,242 -42,234"
            fill="#523219"
            stroke="#361f0e"
            strokeWidth="0.7"
          />
          {/* 右侧立板 */}
          <polygon
            points="0,234 42,226 42,234 0,242"
            fill="#3d2310"
            stroke="#261408"
            strokeWidth="0.7"
          />
        </g>

        {/* --- 第一级踏步 (Upper Step - 与收边梁齐平紧密咬合) --- */}
        <g id="step-upper">
          {/* 踏面顶板 (Y: 217 -> 224, 跨度 68px) */}
          <polygon
            points="-34,217 0,210 34,217 0,224"
            fill="url(#stepTimberTreadGrad)"
            stroke="#52351c"
            strokeWidth="0.8"
          />
          {/* 踏面黄铜防滑条 */}
          <line x1="-28" y1="218.5" x2="0" y2="212" stroke="#fbbf24" strokeWidth="0.8" opacity="0.9" />
          <line x1="0" y1="212" x2="28" y2="218.5" stroke="#d97706" strokeWidth="0.8" opacity="0.8" />
          {/* 左侧立板 */}
          <polygon
            points="-34,217 0,224 0,231 -34,224"
            fill="#5a371d"
            stroke="#38210f"
            strokeWidth="0.7"
          />
          {/* 右侧立板 */}
          <polygon
            points="0,224 34,217 34,224 0,231"
            fill="#442813"
            stroke="#2b1709"
            strokeWidth="0.7"
          />
        </g>

        {/* --- 门廊夜照小铜灯 (Porch Warm Brass Lantern) --- */}
        <g id="porch-brass-lantern" transform="translate(42, 206)">
          <ellipse cx="0" cy="3" rx="5" ry="2.5" fill="#1e1812" opacity="0.3" />
          <rect x="-3" y="-8" width="6" height="10" rx="1.5" fill="#382516" stroke="#25160c" strokeWidth="0.6" />
          <rect x="-2" y="-7" width="4" height="8" rx="1" fill="#fef08a" opacity="0.9" />
          <ellipse cx="0" cy="-3" rx="12" ry="6" fill="#f59e0b" opacity="0.3" className="animate-pulse" />
        </g>

        {/* --- 迎客天然青石板踏脚石 (Rustic Welcome Flagstone - 自然咬合阶梯与草甸) --- */}
        <g id="porch-welcome-flagstone" transform="translate(0, 240)">
          {/* 石板深层入地阴影 */}
          <ellipse cx="0" cy="2.5" rx="34" ry="9" fill="#131c11" opacity="0.4" />
          {/* 青石板厚度立面 */}
          <polygon
            points="-28,0 -12,-2.5 12,-2.5 28,0 26,3.5 0,5.5 -26,3.5"
            fill="#4a4238"
            stroke="#342d25"
            strokeWidth="0.6"
          />
          {/* 青石板顶面 */}
          <polygon
            points="-28,0 -12,-2.5 12,-2.5 28,0 0,3.2"
            fill="url(#flagstoneSurfaceGrad)"
            stroke="#5a5044"
            strokeWidth="0.6"
          />
          {/* 石板表面温润磨损微光与刻线 */}
          <line x1="-24" y1="0.2" x2="0" y2="3.0" stroke="#998d7e" strokeWidth="0.6" opacity="0.75" />
          <line x1="0" y1="3.0" x2="24" y2="0.2" stroke="#6b6154" strokeWidth="0.5" opacity="0.6" />
        </g>
      </g>

      {/* ======================================================== */}
      {/* 5. 基座收边生态植被 (Softening Shrubs, Wildflowers & Grass)*/}
      {/* ======================================================== */}
      <g id="foundation-greenery">
        {/* 左转角质感红陶花盆与天竺葵 (Left Terracotta Planter & Geranium) */}
        <g transform="translate(-276, 142)">
          <ellipse cx="0" cy="4" rx="15" ry="7.5" fill="#192418" opacity="0.45" />
          <ellipse cx="-2" cy="0" rx="13" ry="8.5" fill="#325b33" />
          <ellipse cx="4" cy="-3" rx="10" ry="6.5" fill="#437b44" />
          {/* Terracotta flowerpot */}
          <polygon points="6,6 15,6 13,19 8,19" fill="#c05c35" stroke="#7e3221" strokeWidth="0.8" />
          <ellipse cx="10.5" cy="5.5" rx="4.5" ry="1.6" fill="#df6f46" />
          {/* Red blossoms */}
          <circle cx="8" cy="1" r="2.5" fill="#ef4444" />
          <circle cx="13" cy="2" r="2.3" fill="#dc2626" />
          <circle cx="10" cy="-2" r="2.6" fill="#f87171" />
        </g>

        {/* 🌿 西翼连绵田园花境带 (Organic West Cottage Shrub Border & Flowerbed) */}
        {/* 非机械式的柱脚绿球！只在西侧两栋木屋交接处形成一片自然连绵、层次丰富的田园灌木花境 */}
        <g id="west-cottage-border-flowerbed" transform="translate(-215, 172)">
          {/* 接地阴影 */}
          <ellipse cx="0" cy="5" rx="36" ry="11" fill="#152112" opacity="0.38" />
          
          {/* 连绵复合灌丛叶冠 (平滑起伏，非单一球体) */}
          <g id="border-shrub-foliage">
            <ellipse cx="-22" cy="1" rx="16" ry="9" fill="#243714" />
            <ellipse cx="4" cy="0" rx="18" ry="9.5" fill="#273a15" />
            <ellipse cx="22" cy="2" rx="14" ry="8" fill="#293c16" />
            
            <ellipse cx="-16" cy="-4" rx="14" ry="8" fill="#364e1c" />
            <ellipse cx="6" cy="-4" rx="15" ry="8.5" fill="#3c5720" />
            
            <ellipse cx="-8" cy="-8" rx="12" ry="7" fill="#4d6f28" />
            <ellipse cx="12" cy="-7" rx="11" ry="6.5" fill="#587e2f" />
            <ellipse cx="2" cy="-9" rx="8" ry="5.5" fill="#679137" />
          </g>

          {/* 花境中自然绽放的田园野花 (高低错落，随风轻摇) */}
          <g id="border-wildflowers">
            {/* 白雏菊簇 */}
            <g className="animate-wind-flower" style={{ animationDelay: '0.2s', transformOrigin: '0px 0px' }}>
              <path d="M-18,0 Q-21,-6 -23,-12" stroke="#426022" strokeWidth="0.85" fill="none" strokeLinecap="round" />
              <circle cx="-23" cy="-12" r="2.1" fill="#ffffff" />
              <circle cx="-23" cy="-12" r="0.85" fill="#eab308" />
            </g>
            <g className="animate-wind-flower" style={{ animationDelay: '0.45s', transformOrigin: '0px 0px' }}>
              <path d="M-6,0 Q-8,-7 -9,-14" stroke="#426022" strokeWidth="0.85" fill="none" strokeLinecap="round" />
              <circle cx="-9" cy="-14" r="2.0" fill="#ffffff" />
              <circle cx="-9" cy="-14" r="0.8" fill="#eab308" />
            </g>
            {/* 金毛茛 */}
            <g className="animate-wind-flower" style={{ animationDelay: '0.7s', transformOrigin: '0px 0px' }}>
              <path d="M12,0 Q14,-6 15,-11" stroke="#426022" strokeWidth="0.85" fill="none" strokeLinecap="round" />
              <circle cx="15" cy="-11" r="1.9" fill="#facc15" />
              <circle cx="15" cy="-11" r="0.8" fill="#ca8a04" />
            </g>
            <g className="animate-wind-flower" style={{ animationDelay: '0.9s', transformOrigin: '0px 0px' }}>
              <path d="M25,0 Q27,-5 28,-9" stroke="#426022" strokeWidth="0.85" fill="none" strokeLinecap="round" />
              <circle cx="28" cy="-9" r="1.6" fill="#fef08a" />
              <circle cx="28" cy="-9" r="0.7" fill="#ca8a04" />
            </g>
          </g>

          {/* 飘逸羊齿草叶尖 */}
          <g className="animate-wind-grass" style={{ animationDelay: '0.35s', transformOrigin: '0px 0px' }}>
            <path d="M-28,2 Q-33,-3 -36,-7 M-25,2 Q-29,-4 -31,-9" stroke="#486a27" strokeWidth="0.95" fill="none" strokeLinecap="round" />
            <path d="M18,3 Q22,-3 26,-7 M22,3 Q26,-2 30,-5" stroke="#4d7029" strokeWidth="0.85" fill="none" strokeLinecap="round" />
          </g>
        </g>

        {/* 🌿 前廊踏步石阶两侧微生雏菊草簇 (Stepping Stone Verge Accents) */}
        <g id="step-verge-accents">
          <g transform="translate(-36, 240)">
            <g className="animate-wind-flower" style={{ animationDelay: '0.8s', transformOrigin: '0px 0px' }}>
              <path d="M0,0 Q-2,-5 -4,-9" stroke="#486d26" strokeWidth="0.85" fill="none" strokeLinecap="round" />
              <circle cx="-4" cy="-9" r="1.8" fill="#ffffff" />
              <circle cx="-4" cy="-9" r="0.75" fill="#eab308" />
            </g>
            <path d="M2,0 Q4,-4 5,-7 M-1,0 Q-3,-4 -3,-6" stroke="#52792b" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          </g>
          <g transform="translate(34, 240)">
            <g className="animate-wind-flower" style={{ animationDelay: '1.05s', transformOrigin: '0px 0px' }}>
              <path d="M0,0 Q2,-4 3,-8" stroke="#486d26" strokeWidth="0.85" fill="none" strokeLinecap="round" />
              <circle cx="3" cy="-8" r="1.6" fill="#facc15" />
              <circle cx="3" cy="-8" r="0.7" fill="#ca8a04" />
            </g>
            <path d="M-2,0 Q-4,-3 -5,-6 M1,0 Q3,-3 4,-6" stroke="#52792b" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          </g>
        </g>

        {/* 🌿 零星石缝随风草叶 (Sparse Stone-Verge Grass Tufts) */}
        <g id="sparse-foundation-verge-grass">
          <g transform="translate(-115, 204)">
            <g className="animate-wind-grass" style={{ animationDelay: '0.6s', transformOrigin: '0px 0px' }}>
              <path d="M-2,0 Q-4,-5 -5,-9 M1,0 Q2,-6 3,-10 M4,0 Q6,-4 7,-7" stroke="#4e722a" strokeWidth="0.85" fill="none" strokeLinecap="round" />
            </g>
          </g>
          <g transform="translate(115, 204)">
            <g className="animate-wind-grass" style={{ animationDelay: '1.25s', transformOrigin: '0px 0px' }}>
              <path d="M-3,0 Q-4,-5 -4,-8 M0,0 Q1,-6 2,-9 M3,0 Q5,-4 6,-7" stroke="#4e722a" strokeWidth="0.85" fill="none" strokeLinecap="round" />
            </g>
          </g>
        </g>

        {/* 右转角绣球花丛 (Right Hydrangea Bush) */}
        <g transform="translate(276, 142)">
          <ellipse cx="0" cy="4" rx="17" ry="8.5" fill="#192418" opacity="0.45" />
          <ellipse cx="2" cy="0" rx="15" ry="9.5" fill="#305934" />
          <ellipse cx="-4" cy="-4" rx="11" ry="7.5" fill="#417847" />
          {/* Soft violet-blue blossoms */}
          <circle cx="2" cy="-2" r="3.6" fill="#818cf8" />
          <circle cx="-3" cy="2" r="3.3" fill="#a78bfa" />
          <circle cx="6" cy="3" r="3.2" fill="#6366f1" />
        </g>
      </g>
    </g>
  );
};
