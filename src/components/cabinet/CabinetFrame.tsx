import React from 'react';

export interface CabinetFrameProps {
  onHover?: (hovered: boolean) => void;
  onClick?: () => void;
  children?: React.ReactNode;
}

/**
 * 2.5D 温润老柚木/胡桃木复古黑胶边柜骨架 (Warm Teak & Walnut Vintage Credenza Frame)
 * 深度融入室内整体大地暖木氛围（与榻榻米深木底架 #5c3a21 / #754b2b、原木四层书架 #87552e / #a27444 以及起居室地板茶几完美协调）
 * 1. 材质与色彩：采用温润沉稳的天然胡桃木/深金柚木木蜡油质感（Warm Walnut / Antique Teak Woodwax）：
 *    - 顶板：沉稳温润金琥珀胡桃木光泽 (#7d522e -> #653f21)，既不轻佻发飘，又通透有木质肌理
 *    - 前立面与边缘：经典柚木暖棕色 (#5c371d -> #482914)，扎实厚重
 *    - 柜格内部背板与内壁：深沉静谧的幽深木影 (#24140a -> #331d10)，衬托其中的咖啡豆袋与白陶杯格外温馨明亮
 * 2. 敦厚稳重的形体与比例：保留短宽实木墩脚与厚实底裙板，扎实低重心，与小柴犬、暖炉、榻榻米自然呼应
 * 3. 精致黄铜与木刻细节：低饱和暖黄铜铭牌把手与手工木刻徽饰，增添日式中古工匠手作温度
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
        {/* 柜顶台面渐变 (温润胡桃木/金柚木实木受光台面：丰盈油润的琥珀暖棕质感) */}
        <linearGradient id="walnutTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8d5f38" />
          <stop offset="45%" stopColor="#784d28" />
          <stop offset="100%" stopColor="#633d1e" />
        </linearGradient>

        {/* 顶面自然漫反射微高光柔光 (清透温和木蜡油缎光) */}
        <linearGradient id="walnutTopSheen" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b88556" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#784d28" stopOpacity="0" />
        </linearGradient>

        {/* 柜体前沿立面渐变 (与榻榻米外木框 #5c3a21 呼应的沉稳暖胡桃木色) */}
        <linearGradient id="walnutFrontGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#5c371d" />
          <stop offset="100%" stopColor="#452712" />
        </linearGradient>

        {/* 厚度切面渐变 */}
        <linearGradient id="walnutThicknessGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6e4222" />
          <stop offset="100%" stopColor="#4a2a14" />
        </linearGradient>

        {/* 柜体左侧外立面渐变 (侧光背影，深沉质感老柚木) */}
        <linearGradient id="walnutSideGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4e2c16" />
          <stop offset="55%" stopColor="#3d210f" />
          <stop offset="100%" stopColor="#2c160a" />
        </linearGradient>

        {/* 侧面内凹实木饰板渐变 */}
        <linearGradient id="walnutSidePanelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#412412" />
          <stop offset="100%" stopColor="#2e170a" />
        </linearGradient>

        {/* 开放格内部温润背板渐变 (深邃暖咖木影，衬托陶杯与咖啡豆格外温馨) */}
        <linearGradient id="walnutCubbyBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e0f06" />
          <stop offset="40%" stopColor="#2c170b" />
          <stop offset="100%" stopColor="#3b2010" />
        </linearGradient>

        {/* 储物底板受光面渐变 */}
        <linearGradient id="walnutCubbyFloorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#56331a" />
          <stop offset="100%" stopColor="#402310" />
        </linearGradient>

        {/* 右侧板内壁侧光渐变 */}
        <linearGradient id="walnutRightWallGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#523018" />
          <stop offset="100%" stopColor="#3b200e" />
        </linearGradient>

        {/* 敦厚稳健实木短腿渐变 (粗壮沉实低重心实木墩) */}
        <linearGradient id="walnutLegGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#502e17" />
          <stop offset="60%" stopColor="#683d20" />
          <stop offset="100%" stopColor="#3d200e" />
        </linearGradient>

        {/* 柔和做旧复古黄铜五金暗金渐变 */}
        <linearGradient id="vintageBrassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#cfbc8a" />
          <stop offset="50%" stopColor="#b3985f" />
          <stop offset="100%" stopColor="#7e6737" />
        </linearGradient>
      </defs>

      {/* --- 1. 地面漫反射接触阴影 (敦厚稳稳着地，低重心扎实感) --- */}
      {/* 柜底整体柔和悬空阴影 */}
      <polygon
        points="-28,-1.5 15,-13.8 34,-8.6 -9,4.0"
        fill="#1e1006"
        opacity="0.28"
      />
      {/* 后左腿接触阴影 */}
      <ellipse cx="-23.2" cy="-2.4" rx="2.8" ry="1.2" fill="#180c04" opacity="0.45" />
      {/* 后右腿接触阴影 */}
      <ellipse cx="15.2" cy="-13.4" rx="2.6" ry="1.1" fill="#180c04" opacity="0.4" />
      {/* 前左腿接触阴影 */}
      <ellipse cx="-6.0" cy="1.6" rx="3.2" ry="1.4" fill="#180c04" opacity="0.5" />
      {/* 前右腿接触阴影 */}
      <ellipse cx="27.0" cy="-8.8" rx="3.0" ry="1.3" fill="#180c04" opacity="0.46" />

      {/* --- 2. 敦厚稳重实木矮脚 (短小、粗壮、沉稳着地，低重心厚重感) --- */}
      {/* 2.1 后左腿 */}
      <g id="leg-back-left">
        <polygon points="-24.8,-6.8 -21.6,-6.8 -21.8,-2.6 -25.0,-2.6" fill="url(#walnutLegGrad)" stroke="#221107" strokeWidth="0.3" />
        <ellipse cx="-23.4" cy="-2.6" rx="1.6" ry="0.6" fill="#1a0d05" stroke="#120803" strokeWidth="0.25" />
      </g>

      {/* 2.2 后右腿 */}
      <g id="leg-back-right">
        <polygon points="13.6,-17.8 16.8,-17.8 17.0,-13.6 13.8,-13.6" fill="url(#walnutLegGrad)" stroke="#221107" strokeWidth="0.3" />
        <ellipse cx="15.4" cy="-13.6" rx="1.5" ry="0.6" fill="#1a0d05" stroke="#120803" strokeWidth="0.25" />
      </g>

      {/* 2.3 柜体底层沉稳实木托梁裙边 (加固柜底厚重感) */}
      <polygon
        points="-28.4,-7.0 15.6,-19.6 32.8,-14.7 -11.2,-2.1"
        fill="#26140a"
        stroke="#1a0c05"
        strokeWidth="0.3"
      />

      {/* 2.4 前左腿 (粗壮短脚，底托沉实) */}
      <g id="leg-front-left">
        <polygon points="-8.2,-3.8 -4.6,-3.8 -4.4,1.4 -8.0,1.4" fill="url(#walnutLegGrad)" stroke="#221107" strokeWidth="0.35" />
        <ellipse cx="-6.2" cy="1.4" rx="1.8" ry="0.75" fill="#1d0e06" stroke="#120803" strokeWidth="0.25" />
        {/* 腿柱立体受光棱线 */}
        <line x1="-7.4" y1="-3.4" x2="-7.2" y2="1.1" stroke="#9e6d42" strokeWidth="0.45" opacity="0.65" strokeLinecap="round" />
      </g>

      {/* 2.5 前右腿 (粗壮短脚，底托沉实) */}
      <g id="leg-front-right">
        <polygon points="24.8,-13.6 28.4,-13.6 28.6,-8.8 25.0,-8.8" fill="url(#walnutLegGrad)" stroke="#221107" strokeWidth="0.35" />
        <ellipse cx="26.8" cy="-8.8" rx="1.7" ry="0.75" fill="#1d0e06" stroke="#120803" strokeWidth="0.25" />
        <line x1="25.6" y1="-13.2" x2="25.8" y2="-9.1" stroke="#9e6d42" strokeWidth="0.45" opacity="0.65" strokeLinecap="round" />
      </g>

      {/* --- 3. 柜体内部结构 (沉静温暖实木开放格内部) --- */}

      {/* 3.1 开放格内部背板 */}
      <polygon
        points="-26.4,-22.6 13.6,-34.0 13.6,-20.7 -26.4,-9.3"
        fill="url(#walnutCubbyBackGrad)"
        stroke="#1c0e06"
        strokeWidth="0.35"
      />
      {/* 背板顶沿自然深沉阴影 */}
      <line x1="-26.4" y1="-22.6" x2="13.6" y2="-34.0" stroke="#120803" strokeWidth="1.0" opacity="0.9" />

      {/* 3.2 储物格内底板 */}
      <polygon
        points="-26.4,-9.3 13.6,-20.7 30.8,-15.8 -9.2,-4.4"
        fill="url(#walnutCubbyFloorGrad)"
      />
      <line x1="-26.4" y1="-9.3" x2="13.6" y2="-20.7" stroke="#2a150b" strokeWidth="0.5" />

      {/* 3.3 左侧板内立面 */}
      <polygon
        points="-26.4,-22.6 -9.2,-17.7 -9.2,-4.4 -26.4,-9.3"
        fill="#2a160b"
      />

      {/* 3.4 右侧挡板内立面 */}
      <polygon
        points="13.6,-34.0 30.8,-29.1 30.8,-15.8 13.6,-20.7"
        fill="url(#walnutRightWallGrad)"
        stroke="#241309"
        strokeWidth="0.3"
      />
      <line x1="13.6" y1="-34.0" x2="13.6" y2="-20.7" stroke="#150a04" strokeWidth="0.6" opacity="0.8" />

      {/* 3.5 中间垂直立板 (划分左侧豆子格与右侧杯子格) */}
      <polygon
        points="-7.0,-28.2 10.2,-23.3 10.2,-10.0 -7.0,-14.9"
        fill="#442613"
        stroke="#28150a"
        strokeWidth="0.3"
      />
      {/* 隔板前边缘厚度 */}
      <polygon
        points="10.2,-23.3 11.6,-23.7 11.6,-10.4 10.2,-10.0"
        fill="#361d0d"
      />
      {/* 隔板前沿复古黄铜铭牌饰扣 */}
      <g id="divider-vintage-badge" transform="translate(10.9, -17.0)">
        <rect x="-0.8" y="-2.2" width="1.6" height="4.4" rx="0.3" fill="url(#vintageBrassGrad)" stroke="#57451e" strokeWidth="0.18" />
        <circle cx="0" cy="-1.0" r="0.22" fill="#30240d" />
        <circle cx="0" cy="1.0" r="0.22" fill="#30240d" />
        <circle cx="0" cy="0" r="0.4" fill="#6d582a" />
      </g>

      {/* --- 4. 放置在储物格内的物品 (通过 children 渲染：咖啡豆罐与手作陶杯) --- */}
      {children}

      {/* --- 5. 柜体前沿与外框包围板 (敦厚沉稳形体 + 温润胡桃木色) --- */}

      {/* 5.1 底板前沿厚度边缘 (加厚实木下唇) */}
      <polygon
        points="-11.2,-4.2 32.8,-16.8 32.8,-14.7 -11.2,-2.1"
        fill="url(#walnutFrontGrad)"
        stroke="#26140a"
        strokeWidth="0.35"
      />
      {/* 底板边缘温润做旧倒角微光 */}
      <line x1="-11.2" y1="-4.2" x2="32.8" y2="-16.8" stroke="#9e6d42" strokeWidth="0.5" opacity="0.7" />
      {/* 底部质朴木质暗线 */}
      <line x1="-9.0" y1="-3.6" x2="30.5" y2="-15.8" stroke="#c49a6c" strokeWidth="0.25" opacity="0.35" strokeDasharray="6 2 12 2" />

      {/* 5.2 柜体左侧外立面 (温润老柚木凹槽嵌板) */}
      <g id="cabinet-left-exterior-face">
        {/* 底板基底 */}
        <polygon
          points="-28.4,-23.7 -11.2,-18.8 -11.2,-2.1 -28.4,-7.0"
          fill="url(#walnutSideGrad)"
          stroke="#26140a"
          strokeWidth="0.35"
        />

        {/* 柜体侧面古典实木凹槽嵌板 (Recessed Side Molding Panel) */}
        <polygon
          points="-26.6,-21.8 -13.0,-17.8 -13.0,-4.0 -26.6,-8.0"
          fill="url(#walnutSidePanelGrad)"
          stroke="#1f0f07"
          strokeWidth="0.3"
        />
        {/* 凹槽内阴影线 */}
        <line x1="-26.6" y1="-21.8" x2="-13.0" y2="-17.8" stroke="#140904" strokeWidth="0.45" opacity="0.8" />
        <line x1="-26.6" y1="-21.8" x2="-26.6" y2="-8.0" stroke="#140904" strokeWidth="0.45" opacity="0.7" />
        {/* 凹槽下缘实木微反光线 */}
        <line x1="-26.6" y1="-8.0" x2="-13.0" y2="-4.0" stroke="#875730" strokeWidth="0.3" opacity="0.55" />
        <line x1="-13.0" y1="-17.8" x2="-13.0" y2="-4.0" stroke="#875730" strokeWidth="0.3" opacity="0.5" />

        {/* 内嵌质朴温润浅金细饰线 */}
        <polygon
          points="-25.0,-20.4 -14.6,-17.3 -14.6,-5.3 -25.0,-8.4"
          fill="none"
          stroke="#bfa275"
          strokeWidth="0.22"
          opacity="0.35"
        />

        {/* 侧面中央精致古典木雕菱形徽饰 */}
        <g id="vintage-side-wood-crest" transform="translate(-19.8, -12.8) skewY(15.9)" opacity="0.45">
          <path d="M 0,-4.2 L 3.0,0 L 0,4.2 L -3.0,0 Z" fill="none" stroke="#cfb588" strokeWidth="0.26" />
          <path d="M 0,-2.6 L 1.8,0 L 0,2.6 L -1.8,0 Z" fill="none" stroke="#cfb588" strokeWidth="0.2" opacity="0.7" />
          <circle cx="0" cy="0" r="0.4" fill="#cfb588" opacity="0.8" />
        </g>
      </g>

      {/* 5.3 左侧挡板前沿实木厚度切面 */}
      <polygon
        points="-11.2,-17.1 -9.2,-17.7 -9.2,-4.4 -11.2,-3.8"
        fill="url(#walnutThicknessGrad)"
        stroke="#26140a"
        strokeWidth="0.25"
      />
      <line x1="-11.2" y1="-17.1" x2="-11.2" y2="-3.8" stroke="#9e6d42" strokeWidth="0.35" opacity="0.7" />

      {/* 5.4 右侧挡板前沿实木厚度切面 */}
      <polygon
        points="30.8,-29.1 32.8,-29.7 32.8,-16.4 30.8,-15.8"
        fill="url(#walnutThicknessGrad)"
        stroke="#26140a"
        strokeWidth="0.25"
      />
      <line x1="32.8" y1="-29.7" x2="32.8" y2="-16.4" stroke="#241309" strokeWidth="0.35" />
      <line x1="30.8" y1="-29.1" x2="30.8" y2="-15.8" stroke="#9e6d42" strokeWidth="0.35" opacity="0.65" />

      {/* 5.5 柜体顶板前沿厚度 (挑檐实木线脚) */}
      <polygon
        points="-11.2,-19.2 32.8,-31.8 32.8,-29.7 -11.2,-17.1"
        fill="url(#walnutFrontGrad)"
        stroke="#26140a"
        strokeWidth="0.3"
      />
      {/* 顶檐中间古典嵌线 */}
      <line x1="-11.2" y1="-18.2" x2="32.8" y2="-30.8" stroke="#1d0e06" strokeWidth="0.3" />
      <line x1="-11.2" y1="-17.7" x2="32.8" y2="-30.3" stroke="#96653c" strokeWidth="0.3" opacity="0.6" />

      {/* 角部质朴暗金卷草细纹 */}
      <g id="top-lip-filigree-accents" opacity="0.35">
        <path d="M -8.5,-17.4 Q -6.5,-18.2 -4.0,-17.6" stroke="#c4a572" strokeWidth="0.25" fill="none" />
        <circle cx="-4.0" cy="-17.6" r="0.22" fill="#c4a572" />
        <path d="M 27.5,-29.8 Q 25.5,-30.6 23.0,-30.0" stroke="#c4a572" strokeWidth="0.25" fill="none" />
        <circle cx="23.0" cy="-30.0" r="0.22" fill="#c4a572" />
      </g>

      {/* 5.6 柜顶主操作台面 (沉稳温润胡桃木/老柚木质感) */}
      <polygon
        points="-28.4,-23.7 15.6,-36.3 32.8,-31.4 -11.2,-18.8"
        fill="url(#walnutTopGrad)"
        stroke="#523118"
        strokeWidth="0.35"
      />
      {/* 台面柔光漫反射层 */}
      <polygon
        points="-28.4,-23.7 15.6,-36.3 32.8,-31.4 -11.2,-18.8"
        fill="url(#walnutTopSheen)"
      />

      {/* 台面前沿温润倒角微高光线 (清透温和金暖琥珀倒角线) */}
      <line
        x1="-11.2"
        y1="-18.8"
        x2="32.8"
        y2="-31.4"
        stroke="#f0cb9e"
        strokeWidth="0.55"
        strokeLinecap="round"
        opacity="0.85"
      />
      <line
        x1="-28.4"
        y1="-23.7"
        x2="-11.2"
        y2="-18.8"
        stroke="#dcb487"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* 顶板后边缘收口线 */}
      <line
        x1="15.6"
        y1="-36.3"
        x2="32.8"
        y2="-31.4"
        stroke="#784d2a"
        strokeWidth="0.35"
        strokeLinecap="round"
        opacity="0.5"
      />
    </g>
  );
};


