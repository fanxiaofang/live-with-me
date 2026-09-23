import React from 'react';

/**
 * 2.5D 复古极简黑胶唱片机 (Retro Hi-Fi Turntable)
 * 严格按照用户最新参考图重塑：
 * 1. 紧凑比例机身 (告别原先过长的异形底座，黄金方正比例)
 * 2. 鼠尾草灰绿 / 薄荷灰卡其高级哑光机壳 (Sage Mint-Khaki Chassis)
 * 3. 正面右侧标志性立体珊瑚暖橙方块开关 (Terracotta Orange Square Button)
 * 4. 顶面左前方复古原木色圆柱旋钮与右侧细密黑钮 (Wood Knob & Controls)
 * 5. 完全移除亚克力防尘罩 (干净通透纯净敞开)
 * 6. 纯正等轴测平面的黑胶唱片顺时针流畅旋转动效 (Continuous Smooth Spinning Vinyl)
 * 7. 木质细杆直臂唱臂与珊瑚橙唱头 (Wood Tonearm & Orange Cartridge)
 */

export interface RetroTurntableProps {
  isPlaying?: boolean;
  className?: string;
}

export const RetroTurntable: React.FC<RetroTurntableProps> = ({
  isPlaying = true,
  className = '',
}) => {
  return (
    <g id="retro-turntable-unit" className={`select-none ${className}`}>
      <defs>
        {/* 方案A：中古复古奶油暖白/燕麦白机壳 (Vintage Cream Oat White Chassis) */}
        {/* 机身顶面受光面渐变 (温润细腻的哑光奶油白，轻盈典雅) */}
        <linearGradient id="plinthTopCreamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdfcf7" />
          <stop offset="45%" stopColor="#f4efe6" />
          <stop offset="100%" stopColor="#e8e0d2" />
        </linearGradient>

        {/* 机身前立面渐变 (奶油暖白受侧光面，带淡淡温和灰调) */}
        <linearGradient id="plinthFrontCreamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#e5ddd0" />
          <stop offset="60%" stopColor="#d5ccbe" />
          <stop offset="100%" stopColor="#bfb5a5" />
        </linearGradient>

        {/* 机身左侧背光面 (复古奶油暖燕麦深阴影) */}
        <linearGradient id="plinthSideCreamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b0a594" />
          <stop offset="100%" stopColor="#c5baa9" />
        </linearGradient>

        {/* 复古黄铜/浅金圆柱旋钮渐变 (在奶油白机壳上极为精致复古) */}
        <linearGradient id="brassKnobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="40%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>

        {/* 黑胶旋转中心复古红唱片芯渐变 */}
        <radialGradient id="recordCenterLabelGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f07553" />
          <stop offset="65%" stopColor="#dd5534" />
          <stop offset="100%" stopColor="#b43b1e" />
        </radialGradient>
      </defs>

      {/* --- 1. 底座与木柜台面的接触软阴影 --- */}
      <polygon
        points="-24,-2.5 4,-10.5 18,-6.5 -10,1.5"
        fill="#1a140f"
        opacity="0.28"
      />

      {/* --- 2. 底座下方两个圆润减震黑胶脚垫 (Rubber Isolation Feet) --- */}
      {/* 左前避震脚垫 */}
      <ellipse cx="-7.0" cy="5.8" rx="2.4" ry="1.4" fill="#18120e" stroke="#0e0a07" strokeWidth="0.3" />
      {/* 右前避震脚垫 */}
      <ellipse cx="13.2" cy="-0.2" rx="2.4" ry="1.4" fill="#18120e" stroke="#0e0a07" strokeWidth="0.3" />

      {/* --- 3. 紧凑比例机身主体 (中古极简奶油燕麦白外壳 Vintage Cream Chassis) --- */}
      {/* 3.1 左侧暗面 (沿侧面进深矢量 (-13, -3.7)) */}
      <polygon
        points="-23,-3.7 -10,0 -10,6.0 -23,2.3"
        fill="url(#plinthSideCreamGrad)"
        stroke="#8a7e6f"
        strokeWidth="0.35"
      />

      {/* 3.2 前受光立面 (沿正面宽度矢量 (26, -7.4)，高 6.0px) */}
      <polygon
        points="-10,0 16,-7.4 16,-1.4 -10,6.0"
        fill="url(#plinthFrontCreamGrad)"
        stroke="#a39686"
        strokeWidth="0.35"
      />
      {/* 前立面底边收口暗线 */}
      <line x1="-10" y1="6.0" x2="16" y2="-1.4" stroke="#786c5e" strokeWidth="0.45" />

      {/* 3.3 机身平整顶面 (温润奶油白面板 Top Deck) */}
      <polygon
        points="-23,-3.7 3,-11.1 16,-7.4 -10,0"
        fill="url(#plinthTopCreamGrad)"
        stroke="#c4baa9"
        strokeWidth="0.4"
      />
      {/* 顶面前沿倒角微高光棱线 (清爽亮洁的柔白倒角，与深色胡桃木台面形成鲜明高级的反差) */}
      <line
        x1="-10"
        y1="0"
        x2="16"
        y2="-7.4"
        stroke="#ffffff"
        strokeWidth="0.55"
        strokeLinecap="round"
        opacity="0.9"
      />
      <line
        x1="-23"
        y1="-3.7"
        x2="-10"
        y2="0"
        stroke="#fbf8f2"
        strokeWidth="0.5"
        strokeLinecap="round"
        opacity="0.8"
      />


      {/* --- 5. 顶面控制元件 (Controls on Deck) --- */}
      {/* 5.1 左前方复古黄铜圆柱旋钮 (Vintage Brass Knob) */}
      <g id="deck-wood-knob" transform="translate(-7.0, -1.0)">
        {/* 旋钮在面板上的小阴影 */}
        <ellipse cx="0.4" cy="0.4" rx="1.6" ry="0.8" fill="#1f1209" opacity="0.5" />
        {/* 圆柱侧面 */}
        <path
          d="M -1.4,0.1 L -1.4,-1.8 C -1.4,-2.4 1.4,-2.4 1.4,-1.8 L 1.4,0.1 C 1.4,0.7 -1.4,0.7 -1.4,0.1 Z"
          fill="url(#brassKnobGrad)"
          stroke="#854d0e"
          strokeWidth="0.2"
        />
        {/* 顶平圆面 */}
        <ellipse cx="0" cy="-1.8" rx="1.4" ry="0.65" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.2" />
        {/* 刻度槽微线 */}
        <line x1="-0.6" y1="-1.8" x2="0.6" y2="-1.8" stroke="#713f12" strokeWidth="0.3" />
      </g>

      {/* 5.2 右前方速度/微调控制键组 (Speed & Pitch Black Buttons) */}
      <g id="deck-black-controls" transform="translate(8.5, -6.8)">
        {/* 小圆形黑钮 1 */}
        <ellipse cx="-0.8" cy="0.2" rx="0.8" ry="0.45" fill="#1c1917" stroke="#0c0a09" strokeWidth="0.15" />
        <ellipse cx="-0.8" cy="-0.2" rx="0.7" ry="0.4" fill="#44403c" />

        {/* 细长微调滑块槽 */}
        <polygon points="1.0,-0.6 2.8,-1.1 2.8,-0.7 1.0,-0.2" fill="#1c1917" />

        {/* 小圆形黑钮 2 */}
        <ellipse cx="4.2" cy="-1.2" rx="0.75" ry="0.4" fill="#1c1917" stroke="#0c0a09" strokeWidth="0.15" />
        <ellipse cx="4.2" cy="-1.5" rx="0.65" ry="0.35" fill="#44403c" />

        {/* 小圆形黑钮 3 */}
        <ellipse cx="6.4" cy="-1.8" rx="0.75" ry="0.4" fill="#1c1917" stroke="#0c0a09" strokeWidth="0.15" />
        <ellipse cx="6.4" cy="-2.1" rx="0.65" ry="0.35" fill="#44403c" />
      </g>

      {/* --- 6. 铝合金转盘与黑胶唱片 (Turntable Platter & Vinyl Record) --- */}
      {/* 6.1 转盘金属厚度基座 (Die-Cast Aluminum Platter Base) */}
      <g id="turntable-platter-base" transform="translate(-4.5, -5.2)">
        {/* 转盘在机壳上的阴影 */}
        <ellipse cx="0" cy="0.6" rx="9.4" ry="4.2" fill="#1a110a" opacity="0.45" />
        {/* 转盘金属侧壁 */}
        <ellipse cx="0" cy="0.2" rx="9.0" ry="4.0" fill="#22272a" />
        {/* 转盘上沿金属反光 */}
        <ellipse cx="0" cy="-0.2" rx="8.8" ry="3.9" fill="#32383c" stroke="#485055" strokeWidth="0.35" />
      </g>

      {/* 6.2 旋转中的黑胶唱片 (Spinning Vinyl Record, 严格等轴测水平压扁旋转) */}
      <g transform="translate(-4.5, -5.5) scale(1, 0.44)">
        <g>
          {isPlaying && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 0 0"
              to="360 0 0"
              dur="2.8s"
              repeatCount="indefinite"
            />
          )}

          {/* 纯正深曜石黑胶片基 (Deep Matte Vinyl Disc) */}
          <circle cx="0" cy="0" r="8.6" fill="#181b1d" />

          {/* 精密细密同心音轨声槽 (Concentric Sound Micro-Grooves) */}
          <circle cx="0" cy="0" r="7.8" fill="none" stroke="#25292c" strokeWidth="0.4" />
          <circle cx="0" cy="0" r="6.8" fill="none" stroke="#25292c" strokeWidth="0.35" />
          <circle cx="0" cy="0" r="5.8" fill="none" stroke="#25292c" strokeWidth="0.35" />
          <circle cx="0" cy="0" r="4.8" fill="none" stroke="#25292c" strokeWidth="0.35" />

          {/* 旋转光泽质感反光 (Specular Sheen Rays) */}
          <path d="M-8.6,0 L8.6,0" stroke="#363c40" strokeWidth="0.6" opacity="0.35" />
          <path d="M0,-8.6 L0,8.6" stroke="#363c40" strokeWidth="0.6" opacity="0.35" />
          <path d="M-6.0,-6.0 L6.0,6.0" stroke="#444b50" strokeWidth="0.4" opacity="0.25" />

          {/* 标志性鲜亮复古珊瑚橙红中心唱片芯 (Coral Terracotta Center Label 如参考图) */}
          <circle cx="0" cy="0" r="3.4" fill="url(#recordCenterLabelGrad)" />
          {/* 唱片芯同心装饰圈 */}
          <circle cx="0" cy="0" r="3.0" fill="none" stroke="#f28066" strokeWidth="0.3" opacity="0.75" />
          <circle cx="0" cy="0" r="1.8" fill="none" stroke="#ab3419" strokeWidth="0.25" />
          <circle cx="0" cy="0" r="1.0" fill="#f8957c" />

          {/* 中心主轴孔与高光镀铬插柱 (Center Spindle) */}
          <circle cx="0" cy="0" r="0.5" fill="#f1f5f9" stroke="#64748b" strokeWidth="0.2" />
        </g>
      </g>

      {/* 突出于唱片表面的高耸镀铬立柱尖 (Spindle Pin, 直立于旋转中心) */}
      <g id="turntable-spindle-pin" transform="translate(-4.5, -5.5)">
        <line x1="0" y1="0" x2="0" y2="-2.0" stroke="#cbd5e1" strokeWidth="0.6" strokeLinecap="round" />
        <circle cx="0" cy="-2.0" r="0.35" fill="#ffffff" />
      </g>

      {/* --- 7. 精工唱臂总成 (Tonearm Assembly 如参考图：原木直细臂 + 黑色万向底座 + 珊瑚橙唱头) --- */}
      <g id="retro-tonearm">
        {/* 7.1 后方黑色万向转轴底座 (Black Gimbal Base) */}
        <g transform="translate(10.2, -9.0)">
          {/* 底座基座阴影 */}
          <ellipse cx="0" cy="0.4" rx="2.2" ry="1.1" fill="#1b231f" opacity="0.4" />
          {/* 圆台基座 */}
          <path
            d="M -1.8,0.2 L -1.4,-2.2 L 1.4,-2.2 L 1.8,0.2 Z"
            fill="#232a26"
            stroke="#121614"
            strokeWidth="0.25"
          />
          <ellipse cx="0" cy="-2.2" rx="1.4" ry="0.7" fill="#323b36" stroke="#1c221e" strokeWidth="0.2" />

          {/* 向上延伸的唱臂枢轴立柱 (Pivot Housing) */}
          <rect x="-1.1" y="-4.6" width="2.2" height="2.5" rx="0.4" fill="#232a26" stroke="#121614" strokeWidth="0.25" />
          <line x1="-0.8" y1="-4.2" x2="-0.8" y2="-2.4" stroke="#49554e" strokeWidth="0.3" />

          {/* 后端黑色配重重锤 (Rear Counterweight Block) */}
          <polygon
            points="0.8,-4.2 2.8,-4.8 2.8,-2.8 0.8,-2.2"
            fill="#181e1a"
            stroke="#0d110e"
            strokeWidth="0.2"
          />
        </g>

        {/* 7.2 直挺的原木色唱臂杆 (Warm Wood Straight Tonearm Wand) */}
        <g id="tonearm-wand">
          {/* 木质唱臂从基座 (10.2, -12.4) 笔直延伸向黑胶唱头处 (0.6, -7.4) */}
          <line
            x1="10.0"
            y1="-12.4"
            x2="0.6"
            y2="-7.4"
            stroke="#b8936f"
            strokeWidth="0.85"
            strokeLinecap="round"
          />
          {/* 木质细微高光 */}
          <line
            x1="9.8"
            y1="-12.6"
            x2="0.8"
            y2="-7.6"
            stroke="#dfc5aa"
            strokeWidth="0.3"
            strokeLinecap="round"
            opacity="0.8"
          />
        </g>

        {/* 7.3 唱头与珊瑚橙唱针盒 (Black Headshell with Vibrant Coral Orange Cartridge) */}
        <g id="cartridge-headshell" transform="translate(0.6, -7.4)">
          {/* 黑色倾斜唱头壳 */}
          <polygon
            points="-0.4,-0.8 2.6,0.2 2.0,1.2 -1.0,0.2"
            fill="#1c2420"
            stroke="#0e1310"
            strokeWidth="0.2"
          />
          {/* 珊瑚橙唱针盒 (Orange Cartridge Body 如参考图) */}
          <polygon
            points="-0.8,0.2 1.4,0.9 1.4,2.2 -0.8,1.5"
            fill="#e25c38"
            stroke="#9c2d11"
            strokeWidth="0.2"
          />
          {/* 唱针微小钻石接触点 (Diamond Stylus Contact Point) */}
          <circle cx="-0.2" cy="1.6" r="0.35" fill="#fef08a" />
        </g>
      </g>

      {/* --- 8. 悠扬升起的温馨金色音乐音符 (Floating Music Notes) --- */}
      {isPlaying && (
        <g id="retro-floating-notes" className="pointer-events-none">
          <text
            x="3"
            y="-14"
            fill="#f59e0b"
            fontSize="10"
            fontWeight="bold"
            className="animate-bounce"
          >
            ♪
          </text>
          <text
            x="11"
            y="-19"
            fill="#d97706"
            fontSize="8.5"
            fontWeight="bold"
            className="animate-pulse"
          >
            ♫
          </text>
          <text
            x="-2"
            y="-21"
            fill="#ea580c"
            fontSize="7"
            fontWeight="bold"
            className="animate-[pulse_1.5s_infinite]"
          >
            ♩
          </text>
        </g>
      )}
    </g>
  );
};
