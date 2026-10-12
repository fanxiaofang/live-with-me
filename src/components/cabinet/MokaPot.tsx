import React from 'react';

export interface MokaPotProps {
  className?: string;
  hasSteam?: boolean;
}

/**
 * 2.5D 高清极简经典意式摩卡壶 (Crisp Isometric Moka Express)
 * - 经典八角切面壶身：高反差铝银与冷灰切面，清晰锐利的高光倒角棱线。
 * - 黑色电木防烫手柄与顶盖圆钮：结实厚重，线条分明。
 * - 黄铜安全泄压阀：精致纯净。
 * - 壶嘴袅袅升起的治愈咖啡微蒸汽动画。
 */
export const MokaPot: React.FC<MokaPotProps> = ({
  className = '',
  hasSteam = true,
}) => {
  return (
    <g id="moka-pot" className={`select-none ${className}`}>
      <defs>
        {/* 铝制金属受光面渐变 (明亮纯净金属银) */}
        <linearGradient id="crispMokaLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* 铝制金属阴影切面渐变 */}
        <linearGradient id="crispMokaShadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* 黑色电木手柄渐变 */}
        <linearGradient id="crispMokaHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* 1. 台面接触纯净阴影 (无模糊滤镜) */}
      <ellipse cx="0" cy="1.2" rx="4.5" ry="2.0" fill="#140601" opacity="0.35" />

      {/* 2. 防烫黑色把手 (位于左后侧) */}
      <g id="moka-handle">
        <path
          d="
            M -3.2,-4.5
            C -6.8,-5.5 -7.2,-10.5 -4.8,-12.8
            C -3.2,-13.2 -2.6,-12.8 -3.2,-11.5
            C -5.2,-9.5 -4.8,-6.8 -2.8,-6.0
            Z
          "
          fill="url(#crispMokaHandleGrad)"
          stroke="#0f172a"
          strokeWidth="0.6"
        />
      </g>

      {/* 3. 下壶体 (八角形加热水仓) */}
      {/* 3.1 左侧暗面 */}
      <polygon
        points="-3.5,0.6 -1.2,1.3 -1.0,-4.5 -3.0,-4.8"
        fill="url(#crispMokaShadowGrad)"
        stroke="#334155"
        strokeWidth="0.6"
      />
      {/* 3.2 正面受光切面 */}
      <polygon
        points="-1.2,1.3 2.6,0.2 2.2,-4.8 -1.0,-4.5"
        fill="url(#crispMokaLightGrad)"
        stroke="#475569"
        strokeWidth="0.6"
      />
      {/* 3.3 右侧亮面 */}
      <polygon
        points="2.6,0.2 3.8,-0.4 3.2,-5.0 2.2,-4.8"
        fill="#cbd5e1"
        stroke="#475569"
        strokeWidth="0.6"
      />

      {/* 黄铜减压安全阀 */}
      <circle cx="-2.2" cy="-2.0" r="0.75" fill="#f59e0b" stroke="#92400e" strokeWidth="0.4" />
      <circle cx="-2.2" cy="-2.0" r="0.3" fill="#fef08a" />

      {/* 4. 中段连接锁紧环与腰线 */}
      <polygon
        points="-3.0,-4.8 3.2,-5.0 3.0,-5.8 -2.8,-5.6"
        fill="#334155"
        stroke="#1e293b"
        strokeWidth="0.5"
      />
      <line x1="-3.0" y1="-5.2" x2="3.2" y2="-5.4" stroke="#ffffff" strokeWidth="0.7" opacity="0.9" />

      {/* 5. 上壶体 (八角形萃取仓) */}
      {/* 5.1 上壶左侧暗面 */}
      <polygon
        points="-2.8,-5.6 -0.8,-5.3 -1.2,-12.2 -3.8,-11.6"
        fill="url(#crispMokaShadowGrad)"
        stroke="#334155"
        strokeWidth="0.6"
      />
      {/* 5.2 上壶主正面受光切面 */}
      <polygon
        points="-0.8,-5.3 3.0,-5.8 3.6,-12.5 -1.2,-12.2"
        fill="url(#crispMokaLightGrad)"
        stroke="#475569"
        strokeWidth="0.6"
      />
      {/* 5.3 上壶右侧切面 */}
      <polygon
        points="3.0,-5.8 4.2,-6.1 5.2,-12.8 3.6,-12.5"
        fill="#94a3b8"
        stroke="#475569"
        strokeWidth="0.6"
      />
      {/* 出液三角壶嘴 */}
      <polygon
        points="3.6,-12.5 5.6,-12.2 4.2,-10.8"
        fill="#ffffff"
        stroke="#475569"
        strokeWidth="0.6"
      />

      {/* 竖向高光棱线 */}
      <line x1="-0.8" y1="-5.3" x2="-1.2" y2="-12.2" stroke="#ffffff" strokeWidth="0.8" strokeLinecap="round" />
      <line x1="3.0" y1="-5.8" x2="3.6" y2="-12.5" stroke="#ffffff" strokeWidth="0.7" strokeLinecap="round" />

      {/* 6. 顶盖与黑钮 */}
      <polygon
        points="-3.8,-11.6 -1.2,-12.2 3.6,-12.5 1.0,-13.8 -2.4,-13.2"
        fill="#e2e8f0"
        stroke="#475569"
        strokeWidth="0.6"
      />
      <polygon
        points="-2.4,-13.2 1.0,-13.8 0,-15.0 -2.0,-14.6"
        fill="#ffffff"
        stroke="#475569"
        strokeWidth="0.5"
      />
      {/* 顶盖小黑提钮 */}
      <ellipse cx="-0.8" cy="-15.4" rx="1.1" ry="0.85" fill="#0f172a" stroke="#020617" strokeWidth="0.4" />

      {/* 7. 现煮咖啡的热气微蒸汽动画 */}
      {hasSteam && (
        <g id="moka-steam" className="pointer-events-none">
          <path
            d="M 5.0,-13.2 C 6.2,-16.0 4.2,-18.2 5.5,-21.0"
            stroke="#ffffff"
            strokeWidth="0.85"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          >
            <animate
              attributeName="d"
              values="
                M 5.0,-13.2 C 6.2,-16.0 4.2,-18.2 5.5,-21.0;
                M 5.0,-13.2 C 4.5,-16.2 6.8,-18.5 5.8,-21.8;
                M 5.0,-13.2 C 6.2,-16.0 4.2,-18.2 5.5,-21.0
              "
              dur="3s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.3;0.8;0.3"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      )}
    </g>
  );
};
