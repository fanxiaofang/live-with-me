import React from 'react';

export interface CabinetFrameProps {
  onHover?: (hovered: boolean) => void;
  onClick?: () => void;
  children?: React.ReactNode;
}

/**
 * 2.5D 高清质感温润天然老柚木/白橡木边柜 (Crisp Wabi-Sabi Natural Teak Console)
 * 彻底解决颜色焦脏、白色高光突兀、转角毛刺刺出等问题：
 * 1. 色彩重塑：摒弃焦红与死黑，使用质朴优雅的温润老柚木原色，融入和风小屋整体木质色调。
 * 2. 告别生硬纯白高光：采用木材质感同色系的浅金木蜡油倒角柔光（#c49f78），无涂改液塑料感。
 * 3. 根除毛刺：采用 strokeLinejoin="round" 消除尖角外刺，高光线使用 butt 切齐并严控端点边界。
 * 4. 内格柔和通透：深而不死，呈现自然木质凹格进深，完美衬托内部咖啡豆与手作杯。
 */
export const CabinetFrame: React.FC<CabinetFrameProps> = ({
  onHover,
  onClick,
  children,
}) => {
  return (
    <g
      id="warm-walnut-cabinet"
      className="cursor-pointer select-none"
      onClick={onClick}
      onMouseEnter={() => onHover?.(true)}
      onMouseLeave={() => onHover?.(false)}
    >
      <defs>
        {/* 柜顶主台面渐变 (自然质朴、通透温润的柚木/暖橡木纹色) */}
        <linearGradient id="warmTeakTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a47d58" />
          <stop offset="50%" stopColor="#8d6644" />
          <stop offset="100%" stopColor="#765233" />
        </linearGradient>

        {/* 柜体前沿受光立面渐变 */}
        <linearGradient id="warmTeakFrontGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#68472d" />
          <stop offset="100%" stopColor="#53351d" />
        </linearGradient>

        {/* 板材厚度切面渐变 */}
        <linearGradient id="warmTeakEdgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#724d31" />
          <stop offset="100%" stopColor="#55361e" />
        </linearGradient>

        {/* 柜体左侧外立面背光暗面 */}
        <linearGradient id="warmTeakSideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4e321d" />
          <stop offset="60%" stopColor="#3d2514" />
          <stop offset="100%" stopColor="#2c190c" />
        </linearGradient>

        {/* 开放格内部温润背板 (通透深木色，告别死黑空洞) */}
        <linearGradient id="warmTeakCubbyBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#22150c" />
          <stop offset="50%" stopColor="#2d1c10" />
          <stop offset="100%" stopColor="#372416" />
        </linearGradient>

        {/* 储物内底板受光面 */}
        <linearGradient id="warmTeakCubbyFloorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5a3c25" />
          <stop offset="100%" stopColor="#442a17" />
        </linearGradient>

        {/* 敦厚实木短腿渐变 */}
        <linearGradient id="warmTeakLegGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#4f331f" />
          <stop offset="50%" stopColor="#634229" />
          <stop offset="100%" stopColor="#3a2212" />
        </linearGradient>

        {/* 复古黄铜小标识 */}
        <linearGradient id="vintageBrassBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
      </defs>

      {/* --- 1. 地面纯净接触矢量投影 (无滤镜，边缘柔和干净) --- */}
      <polygon
        points="-27,-2.0 14,-14.0 32,-9.0 -8,3.2"
        fill="#1e130a"
        opacity="0.14"
      />
      <polygon
        points="-24,-3.0 12,-13.2 28,-9.2 -6,1.8"
        fill="#140a03"
        opacity="0.2"
      />

      {/* 4条短腿扎实落地脚垫接触影 */}
      <ellipse cx="-23.2" cy="-2.4" rx="2.2" ry="0.9" fill="#140a03" opacity="0.32" />
      <ellipse cx="15.2" cy="-13.4" rx="2.0" ry="0.8" fill="#140a03" opacity="0.3" />
      <ellipse cx="-6.0" cy="1.6" rx="2.6" ry="1.1" fill="#140a03" opacity="0.4" />
      <ellipse cx="27.0" cy="-8.8" rx="2.5" ry="1.0" fill="#140a03" opacity="0.38" />

      {/* --- 2. 扎实敦厚实木矮脚 (短小稳固，消除毛刺) --- */}
      {/* 2.1 后左腿 */}
      <g id="leg-back-left">
        <polygon
          points="-24.8,-6.8 -21.6,-6.8 -21.8,-2.6 -25.0,-2.6"
          fill="url(#warmTeakLegGrad)"
          stroke="#26170c"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <ellipse cx="-23.4" cy="-2.6" rx="1.6" ry="0.6" fill="#362012" stroke="#221308" strokeWidth="0.4" />
      </g>

      {/* 2.2 后右腿 */}
      <g id="leg-back-right">
        <polygon
          points="13.6,-17.8 16.8,-17.8 17.0,-13.6 13.8,-13.6"
          fill="url(#warmTeakLegGrad)"
          stroke="#26170c"
          strokeWidth="0.5"
          strokeLinejoin="round"
        />
        <ellipse cx="15.4" cy="-13.6" rx="1.5" ry="0.6" fill="#362012" stroke="#221308" strokeWidth="0.4" />
      </g>

      {/* 2.3 柜底加厚实木横撑大梁 */}
      <polygon
        points="-28.4,-7.0 15.6,-19.6 32.8,-14.7 -11.2,-2.1"
        fill="#2e1c0e"
        stroke="#1e1006"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />

      {/* 2.4 前左腿 (主视腿，柔和木蜡微光) */}
      <g id="leg-front-left">
        <polygon
          points="-8.2,-3.8 -4.6,-3.8 -4.4,1.4 -8.0,1.4"
          fill="url(#warmTeakLegGrad)"
          stroke="#26170c"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        <ellipse cx="-6.2" cy="1.4" rx="1.8" ry="0.75" fill="#3f2715" stroke="#221308" strokeWidth="0.4" />
        {/* 柱脚立体温和木色反光 (内缩端点，使用 butt 端点防毛刺) */}
        <line x1="-7.4" y1="-3.2" x2="-7.2" y2="0.8" stroke="#a47d58" strokeWidth="0.6" strokeLinecap="butt" opacity="0.7" />
      </g>

      {/* 2.5 前右腿 */}
      <g id="leg-front-right">
        <polygon
          points="24.8,-13.6 28.4,-13.6 28.6,-8.8 25.0,-8.8"
          fill="url(#warmTeakLegGrad)"
          stroke="#26170c"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        <ellipse cx="26.8" cy="-8.8" rx="1.7" ry="0.75" fill="#3f2715" stroke="#221308" strokeWidth="0.4" />
        <line x1="25.6" y1="-13.0" x2="25.8" y2="-9.2" stroke="#a47d58" strokeWidth="0.6" strokeLinecap="butt" opacity="0.7" />
      </g>

      {/* --- 3. 柜体内部空间 (温润深木色，告别死黑，层级分明) --- */}
      {/* 3.1 开放格背板 */}
      <polygon
        points="-26.4,-22.6 13.6,-34.0 13.6,-20.7 -26.4,-9.3"
        fill="url(#warmTeakCubbyBackGrad)"
        stroke="#1a1009"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      {/* 顶部自然阴影接缝 */}
      <line x1="-26.4" y1="-22.6" x2="13.6" y2="-34.0" stroke="#120904" strokeWidth="0.9" opacity="0.8" strokeLinecap="butt" />

      {/* 3.2 储物格内底板 */}
      <polygon
        points="-26.4,-9.3 13.6,-20.7 30.8,-15.8 -9.2,-4.4"
        fill="url(#warmTeakCubbyFloorGrad)"
        stroke="#24140a"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />

      {/* 3.3 左侧内壁 */}
      <polygon
        points="-26.4,-22.6 -9.2,-17.7 -9.2,-4.4 -26.4,-9.3"
        fill="#27180e"
        stroke="#180e07"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />

      {/* 3.4 右侧内壁 */}
      <polygon
        points="13.6,-34.0 30.8,-29.1 30.8,-15.8 13.6,-20.7"
        fill="#392314"
        stroke="#201208"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />

      {/* 3.5 中间垂直立柱隔板 */}
      <polygon
        points="-7.0,-28.2 10.2,-23.3 10.2,-10.0 -7.0,-14.9"
        fill="#3c2516"
        stroke="#1f1107"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      {/* 隔板前沿厚度切面 */}
      <polygon
        points="10.2,-23.3 11.6,-23.7 11.6,-10.4 10.2,-10.0"
        fill="#311c0f"
        stroke="#1a0e05"
        strokeWidth="0.4"
        strokeLinejoin="round"
      />
      {/* 隔板中央小巧复古铜徽 */}
      <g id="divider-vintage-badge" transform="translate(10.9, -17.0)">
        <rect x="-0.7" y="-2.0" width="1.4" height="4.0" rx="0.3" fill="url(#vintageBrassBadgeGrad)" stroke="#45270c" strokeWidth="0.3" />
        <circle cx="0" cy="0" r="0.35" fill="#301805" />
      </g>

      {/* --- 4. 开放格内陈列物品 (children: 咖啡熟豆包与手作杯) --- */}
      {children}

      {/* --- 5. 柜体前沿与外框包围结构 --- */}
      {/* 5.1 底板前唇 */}
      <polygon
        points="-11.2,-4.2 32.8,-16.8 32.8,-14.7 -11.2,-2.1"
        fill="url(#warmTeakFrontGrad)"
        stroke="#241409"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      {/* 底板边缘温润木蜡光泽 (同色系暗金浅木，内缩防毛刺) */}
      <line x1="-10.8" y1="-4.1" x2="32.4" y2="-16.7" stroke="#b08b68" strokeWidth="0.6" opacity="0.6" strokeLinecap="butt" />

      {/* 5.2 柜体左侧外立面 (干净的凹槽木饰面) */}
      <g id="cabinet-left-exterior-face">
        <polygon
          points="-28.4,-23.7 -11.2,-18.8 -11.2,-2.1 -28.4,-7.0"
          fill="url(#warmTeakSideGrad)"
          stroke="#201207"
          strokeWidth="0.6"
          strokeLinejoin="round"
        />
        {/* 侧面嵌入线槽 */}
        <polygon
          points="-26.6,-21.8 -13.0,-17.8 -13.0,-4.0 -26.6,-8.0"
          fill="#2b1a0d"
          stroke="#1b0f06"
          strokeWidth="0.4"
          strokeLinejoin="round"
        />
      </g>

      {/* 5.3 左侧立柱前沿切面 */}
      <polygon
        points="-11.2,-17.1 -9.2,-17.7 -9.2,-4.4 -11.2,-3.8"
        fill="url(#warmTeakEdgeGrad)"
        stroke="#201207"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />

      {/* 5.4 右侧立柱前沿切面 */}
      <polygon
        points="30.8,-29.1 32.8,-29.7 32.8,-16.4 30.8,-15.8"
        fill="url(#warmTeakEdgeGrad)"
        stroke="#201207"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />

      {/* 5.5 顶板前沿下挂挑檐厚度立面 */}
      <polygon
        points="-11.2,-19.2 32.8,-31.8 32.8,-29.7 -11.2,-17.1"
        fill="url(#warmTeakFrontGrad)"
        stroke="#201207"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />

      {/* 5.6 柜顶主操作台面 (饱满平整，自然温暖柚木光泽) */}
      <polygon
        points="-28.4,-23.7 15.6,-36.3 32.8,-31.4 -11.2,-18.8"
        fill="url(#warmTeakTopGrad)"
        stroke="#3c2615"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />

      {/* 5.7 台面前沿倒角柔光线 (移除刺眼白线，采用自然浅金木色，两端精确对齐顶点且使用 butt，绝无毛刺) */}
      <line
        x1="-11.2"
        y1="-18.8"
        x2="32.8"
        y2="-31.4"
        stroke="#c49f78"
        strokeWidth="0.65"
        strokeLinecap="butt"
        opacity="0.8"
      />
      <line
        x1="-28.4"
        y1="-23.7"
        x2="-11.2"
        y2="-18.8"
        stroke="#a47d58"
        strokeWidth="0.55"
        strokeLinecap="butt"
        opacity="0.6"
      />
    </g>
  );
};
