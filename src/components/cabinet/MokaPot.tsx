import React from 'react';

export interface MokaPotProps {
  className?: string;
  hasSteam?: boolean;
}

/**
 * 2.5D 极简风经典意式摩卡壶 (Minimalist Isometric Moka Express)
 * 契合温馨治愈矢量画风：
 * - 经典八角切面壶身 (哑光铝银与暖灰光影)
 * - 黑色电木防烫手柄与顶盖圆钮
 * - 黄铜安全阀
 * - 壶嘴袅袅升起的治愈咖啡微蒸汽
 */
export const MokaPot: React.FC<MokaPotProps> = ({
  className = '',
  hasSteam = true,
}) => {
  return (
    <g id="moka-pot" className={`select-none ${className}`}>
      <defs>
        {/* 铝制金属受光面渐变 */}
        <linearGradient id="mokaLightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="50%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>

        {/* 铝制金属阴影切面渐变 */}
        <linearGradient id="mokaShadowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#94a3b8" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>

        {/* 黑色电木手柄渐变 */}
        <linearGradient id="mokaHandleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
      </defs>

      {/* 1. 台面接触阴影 */}
      <ellipse cx="0" cy="1.2" rx="4.8" ry="2.2" fill="#1e1812" opacity="0.25" />

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
          fill="url(#mokaHandleGrad)"
          stroke="#0f172a"
          strokeWidth="0.3"
        />
      </g>

      {/* 3. 下壶体 (八角形加热水仓，下宽微上收) */}
      {/* 3.1 左侧暗面 */}
      <polygon
        points="-3.5,0.6 -1.2,1.3 -1.0,-4.5 -3.0,-4.8"
        fill="url(#mokaShadowGrad)"
        stroke="#475569"
        strokeWidth="0.25"
      />
      {/* 3.2 正面受光切面 */}
      <polygon
        points="-1.2,1.3 2.6,0.2 2.2,-4.8 -1.0,-4.5"
        fill="url(#mokaLightGrad)"
        stroke="#64748b"
        strokeWidth="0.25"
      />
      {/* 3.3 右侧微亮面 */}
      <polygon
        points="2.6,0.2 3.8,-0.4 3.2,-5.0 2.2,-4.8"
        fill="#cbd5e1"
        stroke="#64748b"
        strokeWidth="0.25"
      />

      {/* 黄铜减压安全阀 (侧面标志性细节) */}
      <circle cx="-2.2" cy="-2.0" r="0.65" fill="#d97706" stroke="#92400e" strokeWidth="0.2" />
      <circle cx="-2.2" cy="-2.0" r="0.25" fill="#fef08a" />

      {/* 4. 中段连接锁紧环与腰线 */}
      <polygon
        points="-3.0,-4.8 3.2,-5.0 3.0,-5.8 -2.8,-5.6"
        fill="#475569"
      />
      <line x1="-3.0" y1="-5.2" x2="3.2" y2="-5.4" stroke="#f1f5f9" strokeWidth="0.4" opacity="0.8" />

      {/* 5. 上壶体 (八角形萃取仓，向上优雅敞开) */}
      {/* 5.1 上壶左侧背光切面 */}
      <polygon
        points="-2.8,-5.6 -0.8,-5.3 -1.2,-12.2 -3.8,-11.6"
        fill="url(#mokaShadowGrad)"
        stroke="#475569"
        strokeWidth="0.25"
      />
      {/* 5.2 上壶主正面受光切面 */}
      <polygon
        points="-0.8,-5.3 3.0,-5.8 3.6,-12.5 -1.2,-12.2"
        fill="url(#mokaLightGrad)"
        stroke="#64748b"
        strokeWidth="0.25"
      />
      {/* 5.3 上壶右侧切面与尖角出液壶嘴 */}
      <polygon
        points="3.0,-5.8 4.2,-6.1 5.2,-12.8 3.6,-12.5"
        fill="#94a3b8"
        stroke="#64748b"
        strokeWidth="0.25"
      />
      {/* 倒咖啡三角壶嘴突出部 */}
      <polygon
        points="3.6,-12.5 5.6,-12.2 4.2,-10.8"
        fill="#f8fafc"
        stroke="#64748b"
        strokeWidth="0.25"
      />

      {/* 竖向切棱高光线 */}
      <line x1="-0.8" y1="-5.3" x2="-1.2" y2="-12.2" stroke="#ffffff" strokeWidth="0.45" opacity="0.9" />
      <line x1="3.0" y1="-5.8" x2="3.6" y2="-12.5" stroke="#ffffff" strokeWidth="0.35" opacity="0.6" />

      {/* 6. 顶盖与黑纽 */}
      {/* 八角阶梯式顶盖 */}
      <polygon
        points="-3.8,-11.6 -1.2,-12.2 3.6,-12.5 1.0,-13.8 -2.4,-13.2"
        fill="#e2e8f0"
        stroke="#475569"
        strokeWidth="0.25"
      />
      <polygon
        points="-2.4,-13.2 1.0,-13.8 0,-15.0 -2.0,-14.6"
        fill="#f1f5f9"
        stroke="#64748b"
        strokeWidth="0.2"
      />
      {/* 盖顶小黑电木球形提钮 */}
      <ellipse cx="-0.8" cy="-15.4" rx="1.0" ry="0.8" fill="#1e293b" />
      <ellipse cx="-0.9" cy="-15.7" rx="0.4" ry="0.25" fill="#94a3b8" opacity="0.7" />

      {/* 7. 现煮咖啡的热气蒸汽动画 (Gentle Cozy Steam) */}
      {hasSteam && (
        <g id="moka-steam" className="pointer-events-none">
          <path
            d="M 5.0,-13.2 C 6.2,-16.0 4.2,-18.2 5.5,-21.0"
            stroke="#ffffff"
            strokeWidth="0.75"
            strokeLinecap="round"
            fill="none"
            opacity="0.65"
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
              values="0.3;0.7;0.3"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
          <path
            d="M 3.8,-14.0 C 2.8,-16.5 4.5,-18.8 3.5,-22.0"
            stroke="#ffffff"
            strokeWidth="0.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.45"
          >
            <animate
              attributeName="d"
              values="
                M 3.8,-14.0 C 2.8,-16.5 4.5,-18.8 3.5,-22.0;
                M 3.8,-14.0 C 4.6,-16.8 2.5,-19.0 4.2,-22.5;
                M 3.8,-14.0 C 2.8,-16.5 4.5,-18.8 3.5,-22.0
              "
              dur="2.5s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.2;0.55;0.2"
              dur="2.5s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      )}
    </g>
  );
};
