import React from 'react';

export interface RetroTurntableProps {
  isPlaying?: boolean;
  className?: string;
}

/**
 * 2.5D 高清清晰复古黑胶唱片机 (High-Definition Retro Turntable)
 * 彻底解决“唱片机没遵循等轴测方向、斜着转”与“发糊”问题：
 * 1. 严格数学等轴测旋转体系：
 *    - 最外层统一定位并压扁：transform="scale(1, 0.44)"
 *    - 纯正正圆内部执行平滑自转：rotate(0)->rotate(360)
 *    - 椭圆长轴永远 100% 保持严格水平，绝对不斜晃、不抛甩、不摆动，完美贴合木柜桌面！
 * 2. 空间固定光学反射：高光弧固定在房间光源方向，不随胶面翻滚，符合真实物理光学。
 * 3. 造型概括分明：象牙白机身，珊瑚橙方块按键，黄铜旋钮，高对比度黑胶盘。
 * 4. 几何边缘平滑抗毛刺：多边形统一使用 strokeLinejoin="round"。
 */
export const RetroTurntable: React.FC<RetroTurntableProps> = ({
  isPlaying = true,
  className = '',
}) => {
  return (
    <g id="retro-turntable-unit" className={`select-none ${className}`}>
      <defs>
        {/* 复古象牙白机身顶面 */}
        <linearGradient id="turntableDeckTop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#faf7f0" />
          <stop offset="60%" stopColor="#f0e9dc" />
          <stop offset="100%" stopColor="#e5dcce" />
        </linearGradient>

        {/* 机身正面立面 */}
        <linearGradient id="turntableDeckFront" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ded3c3" />
          <stop offset="100%" stopColor="#c5b6a3" />
        </linearGradient>

        {/* 机身左侧背光面 */}
        <linearGradient id="turntableDeckSide" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#988977" />
          <stop offset="100%" stopColor="#b3a593" />
        </linearGradient>

        {/* 鲜活珊瑚橙方块按键 */}
        <linearGradient id="orangeButtonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="60%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>

        {/* 精工黄铜旋钮 */}
        <linearGradient id="brassKnobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#a16207" />
        </linearGradient>

        {/* 黑胶中心经典复古红唱片标芯 */}
        <radialGradient id="vinylCenterLabel" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="60%" stopColor="#dc2626" />
          <stop offset="100%" stopColor="#991b1b" />
        </radialGradient>
      </defs>

      {/* --- 1. 底座与木台面接触阴影 (清晰扎实，无滤镜) --- */}
      <polygon
        points="-23,-3.0 4,-10.8 18,-6.8 -9,1.0"
        fill="#1e140d"
        opacity="0.32"
      />

      {/* --- 2. 两个圆润避震脚垫 --- */}
      <ellipse cx="-7.0" cy="5.2" rx="2.2" ry="1.0" fill="#221811" />
      <ellipse cx="13.2" cy="-0.6" rx="2.2" ry="1.0" fill="#221811" />

      {/* --- 3. 2.5D 机身主体 (大色块分明，挺拔有力) --- */}
      {/* 3.1 左侧暗面 */}
      <polygon
        points="-23,-3.7 -10,0 -10,6.0 -23,2.3"
        fill="url(#turntableDeckSide)"
        stroke="#7c6e5e"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />

      {/* 3.2 前立面 */}
      <polygon
        points="-10,0 16,-7.4 16,-1.4 -10,6.0"
        fill="url(#turntableDeckFront)"
        stroke="#9c8c78"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />
      <line x1="-10" y1="6.0" x2="16" y2="-1.4" stroke="#6b5b4a" strokeWidth="0.6" strokeLinecap="butt" />

      {/* 3.3 顶面板 */}
      <polygon
        points="-23,-3.7 3,-11.1 16,-7.4 -10,0"
        fill="url(#turntableDeckTop)"
        stroke="#b8ab9a"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />

      {/* 3.4 顶面前沿微倒角柔光 (象牙白微光，butt 切齐防毛刺) */}
      <line
        x1="-10"
        y1="0"
        x2="16"
        y2="-7.4"
        stroke="#fffdfa"
        strokeWidth="0.65"
        strokeLinecap="butt"
        opacity="0.8"
      />
      <line
        x1="-23"
        y1="-3.7"
        x2="-10"
        y2="0"
        stroke="#fffdfa"
        strokeWidth="0.55"
        strokeLinecap="butt"
        opacity="0.6"
      />

      {/* --- 4. 正面右侧标志性珊瑚橙方块按键 --- */}
      <g id="turntable-power-switch" transform="translate(6.5, -4.5)">
        <polygon points="-0.4,-0.2 3.4,-1.3 3.4,2.0 -0.4,3.1" fill="#443528" strokeLinejoin="round" />
        <polygon points="0,0 3.0,-0.9 3.0,1.9 0,2.8" fill="url(#orangeButtonGrad)" stroke="#9a3412" strokeWidth="0.4" strokeLinejoin="round" />
        <line x1="0.1" y1="0.1" x2="2.9" y2="-0.8" stroke="#fde047" strokeWidth="0.4" strokeLinecap="butt" opacity="0.8" />
      </g>

      {/* --- 5. 顶面控制旋钮与按键 --- */}
      {/* 5.1 左前方精致黄铜旋钮 */}
      <g id="turntable-volume-knob" transform="translate(-7.0, -1.0)">
        <ellipse cx="0.2" cy="0.3" rx="1.6" ry="0.8" fill="#241a12" opacity="0.4" />
        <path
          d="M -1.4,0.2 L -1.4,-1.8 C -1.4,-2.4 1.4,-2.4 1.4,-1.8 L 1.4,0.2 C 1.4,0.8 -1.4,0.8 -1.4,0.2 Z"
          fill="url(#brassKnobGrad)"
          stroke="#78350f"
          strokeWidth="0.4"
          strokeLinejoin="round"
        />
        <ellipse cx="0" cy="-1.8" rx="1.3" ry="0.65" fill="#fef08a" stroke="#b45309" strokeWidth="0.35" />
      </g>

      {/* 5.2 右前方速度控制黑钮 */}
      <g id="turntable-speed-toggles" transform="translate(8.5, -6.8)">
        <ellipse cx="-0.8" cy="0" rx="0.9" ry="0.5" fill="#18181b" stroke="#09090b" strokeWidth="0.3" />
        <ellipse cx="3.8" cy="-1.3" rx="0.9" ry="0.5" fill="#18181b" stroke="#09090b" strokeWidth="0.3" />
      </g>

      {/* --- 6. 铝合金转盘与严格水平等轴测黑胶唱片 (Isometric Horizontal Platter & Vinyl) --- */}
      <g id="turntable-platter-and-vinyl" transform="translate(-4.5, -5.2)">
        {/* 6.1 转盘金属底盘 (严格水平等轴测椭圆，长轴绝对水平，贴合柜面) */}
        <ellipse cx="0" cy="0.6" rx="9.6" ry="4.2" fill="#181512" opacity="0.45" />
        <ellipse cx="0" cy="0.2" rx="9.4" ry="4.1" fill="#2b3036" stroke="#1f2327" strokeWidth="0.5" />
        <ellipse cx="0" cy="-0.2" rx="9.0" ry="3.96" fill="#3f474f" stroke="#5a6570" strokeWidth="0.5" />

        {/* 6.2 唱片主体与光影 (外层施加等轴测压扁 scale(1, 0.44)，保证所有内部元素投影后长轴永远水平) */}
        <g id="isometric-vinyl-plane" transform="translate(0, -0.3) scale(1, 0.44)">
          {/* A. 纯黑曜石唱片基盘 */}
          <circle cx="0" cy="0" r="8.6" fill="#101214" stroke="#252b31" strokeWidth="0.6" />

          {/* B. 固定空间光照反射弧 (高光来自房间光源，永远固定在等轴测水平视角，绝不随自转倾斜) */}
          <path
            d="M -7.2,-2.2 C -4.0,-5.8 4.0,-5.8 7.2,-2.2 C 4.5,-4.0 -4.5,-4.0 -7.2,-2.2 Z"
            fill="#374151"
            opacity="0.45"
          />
          <path
            d="M -7.2,2.2 C -4.0,5.8 4.0,5.8 7.2,2.2 C 4.5,4.0 -4.5,4.0 -7.2,2.2 Z"
            fill="#374151"
            opacity="0.45"
          />

          {/* C. 纯正三维等轴测平稳自转层 (在正圆坐标系内自转，经外层 scale(1,0.44) 映射，椭圆长轴永远 100% 水平！) */}
          <g id="vinyl-rotating-label">
            {isPlaying && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 0 0"
                to="360 0 0"
                dur="3.0s"
                repeatCount="indefinite"
              />
            )}
            {/* 标志性复古珊瑚红唱片芯 */}
            <circle cx="0" cy="0" r="3.3" fill="url(#vinylCenterLabel)" stroke="#7f1d1d" strokeWidth="0.4" />
            <circle cx="0" cy="0" r="2.6" fill="none" stroke="#fed7aa" strokeWidth="0.35" opacity="0.8" />
            <circle cx="0" cy="0" r="1.3" fill="#fed7aa" />
            {/* 灵动的自转指示点 (直观感受平滑旋转，绝无倾斜晃动) */}
            <circle cx="0" cy="-2.0" r="0.35" fill="#fef08a" />
            <line x1="-1.7" y1="0" x2="-2.4" y2="0" stroke="#fef08a" strokeWidth="0.35" />
          </g>

          {/* 中心主轴孔 */}
          <circle cx="0" cy="0" r="0.5" fill="#ffffff" />
        </g>

        {/* 镀铬中心主轴顶针 (固定垂直于水平桌面) */}
        <line x1="0" y1="-0.5" x2="0" y2="-2.8" stroke="#f1f5f9" strokeWidth="0.8" strokeLinecap="round" />
        <circle cx="0" cy="-2.8" r="0.4" fill="#ffffff" />
      </g>

      {/* --- 7. 精工唱臂总成 (Tonearm) --- */}
      {/* 7.1 后方黑色万向转轴基座 */}
      <g id="tonearm-pivot" transform="translate(10.2, -9.0)">
        <ellipse cx="0" cy="0.3" rx="2.2" ry="1.1" fill="#1c1917" opacity="0.4" />
        <ellipse cx="0" cy="-1.8" rx="1.6" ry="0.8" fill="#292524" stroke="#0c0a09" strokeWidth="0.4" />
        <rect x="-1.0" y="-4.2" width="2.0" height="2.4" rx="0.4" fill="#292524" stroke="#0c0a09" strokeWidth="0.4" />
        <polygon points="0.8,-3.8 2.8,-4.4 2.8,-2.4 0.8,-1.8" fill="#18181b" stroke="#000000" strokeWidth="0.4" strokeLinejoin="round" />
      </g>

      {/* 7.2 唱臂杆 */}
      <line
        x1="10.0"
        y1="-12.2"
        x2="0.6"
        y2="-7.4"
        stroke="#92400e"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <line
        x1="9.8"
        y1="-12.4"
        x2="0.8"
        y2="-7.6"
        stroke="#fde047"
        strokeWidth="0.4"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/* 7.3 唱头与珊瑚橙唱针盒 */}
      <g id="tonearm-cartridge" transform="translate(0.6, -7.4)">
        <polygon points="-0.4,-0.8 2.6,0.2 2.1,1.2 -1.0,0.2" fill="#18181b" stroke="#000000" strokeWidth="0.4" strokeLinejoin="round" />
        <polygon points="-0.8,0.2 1.4,0.9 1.4,2.2 -0.8,1.5" fill="#f97316" stroke="#9a3412" strokeWidth="0.4" strokeLinejoin="round" />
        <circle cx="-0.2" cy="1.6" r="0.35" fill="#ffffff" />
      </g>

      {/* --- 8. 悠扬升起的金橙色音乐音符 --- */}
      {isPlaying && (
        <g id="retro-floating-notes" className="pointer-events-none select-none opacity-80">
          <text
            x="4"
            y="-16"
            fill="#d97706"
            fontSize="8"
            fontWeight="bold"
            className="animate-[pulse_3.5s_infinite]"
          >
            ♪
          </text>
          <text
            x="-4"
            y="-20"
            fill="#ea580c"
            fontSize="6.5"
            fontWeight="bold"
            className="animate-[pulse_4.5s_infinite]"
          >
            ♩
          </text>
        </g>
      )}
    </g>
  );
};
