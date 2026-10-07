import React from 'react';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';
import { YorkshireCommonProps } from '../landscapeTypes';

/**
 * 🚂 RailwayLandscape (Ribblehead Stone Railway Viaduct & Mountain Tunnel Portal)
 *
 * Layer: 05 INFRASTRUCTURE / Railway
 * Spatial Region: YORKSHIRE_LAYOUT.railway
 *
 * Optimizations per User Request:
 * 1. Viaduct Rightmost Pier Grounding (最右侧桥墩接地修复):
 *    - Pier 8 at x = 35 extended solidly down to baseY = 233, perfectly resting on the terrain with realistic base plinth and ground shadow.
 * 2. Track & Tunnel Connection (铁轨与隧道口的衔接):
 *    - Open-air rails run cleanly to the tunnel threshold (x = 58).
 *    - Inside the tunnel mouth, tracks smoothly recede into the dark interior cavity with perspective gradient depth, naturally framed by the ashlar arch voussoirs.
 * 3. Tunnel Portal Surroundings & Shadows (隧道口周边阴影与山体颜色优化):
 *    - Removed the harsh opaque dark green background patch.
 *    - Added soft, natural contact occlusion shadows that preserve the full continuity and colors of the mountain slopes and fields.
 * 4. West Track Extension & Abutment (最左侧铁轨自然延伸远方):
 *    - Removed the awkward hanging iron plate / boxy cutoff on the left.
 *    - Viaduct spans seamlessly from the west with continuous masonry arches, approach embankment, and track rails naturally receding into the distant western hills.
 */
export const RailwayLandscape: React.FC<YorkshireCommonProps> = ({ theme, className }) => {
  const layout = YORKSHIRE_LAYOUT.railway;
  const piers = layout.piers; // [-525, -455, -385, -315, -245, -175, -105, -35, 35]

  // 地势高度精准匹配：从西侧山麓缓坡过渡到中央低谷再到东侧隧道山体
  const PIER_BASE_Y = [222, 225, 227, 229, 231, 233, 232, 230, 233];

  return (
    <g id="yorkshire-railway-viaduct" className={className}>
      <defs>
        {/* 暖调风化灰砂岩石材渐变 */}
        <linearGradient id="viaductStoneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8c8477" />
          <stop offset="40%" stopColor="#756e62" />
          <stop offset="80%" stopColor="#5d564b" />
          <stop offset="100%" stopColor="#484238" />
        </linearGradient>

        {/* 桥墩受光面渐变 */}
        <linearGradient id="pierLitFaceGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#968e81" />
          <stop offset="60%" stopColor="#7a7266" />
          <stop offset="100%" stopColor="#676054" />
        </linearGradient>

        {/* 拱腹 3D 阴影厚度面渐变 */}
        <linearGradient id="viaductArchSoffitGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3c362d" />
          <stop offset="100%" stopColor="#221d18" />
        </linearGradient>

        {/* 隧道深邃内壁暗调渐变 */}
        <linearGradient id="tunnelMouthDarkGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#0a100c" />
          <stop offset="60%" stopColor="#040705" />
          <stop offset="100%" stopColor="#010202" />
        </linearGradient>

        {/* 隧道内部铁轨深度消隐渐变 (单轨水平自然铺设入洞，平滑消隐进入黑暗) */}
        <linearGradient id="tunnelInnerRailGrad" x1="55" y1="0" x2="75" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#cbd5e1" stopOpacity="0.95" />
          <stop offset="35%" stopColor="#94a3b8" stopOpacity="0.65" />
          <stop offset="70%" stopColor="#475569" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
        </linearGradient>

        <linearGradient id="tunnelInnerBallastGrad" x1="55" y1="0" x2="75" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#141a22" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#080c09" stopOpacity="0" />
        </linearGradient>

        {/* 西侧远景铁轨与桥体自然隐入地平线消隐渐变 (仅在最西侧 x: -650..-480 生效，东侧全通透) */}
        <linearGradient id="viaductWestFadeGrad" x1="-650" y1="0" x2="-480" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
        </linearGradient>

        <mask id="viaductWestApproachMask">
          <rect x="-1000" y="0" width="2000" height="800" fill="url(#viaductWestFadeGrad)" />
        </mask>
      </defs>

      {/* ========================================================================= */}
      {/* 1. 隧道口与桥墩接地柔和接触阴影 (Soft Ambient Grounding Occlusion)           */}
      {/* ========================================================================= */}
      <g id="viaduct-natural-ground-occlusion">
        {/* 隧道口基底与山体贴合阴影 */}
        <ellipse cx="68" cy="183" rx="19" ry="3.2" fill="#141f12" opacity="0.32" />
        {/* 隧道右侧贴山石砌接缝浅影 */}
        <polygon points="86,150 89,152 89,182.5 86,182.5" fill="#1b2a17" opacity="0.2" />

        {/* 各桥墩底座与地面自然贴合阴影 */}
        {piers.map((px, idx) => {
          const baseY = PIER_BASE_Y[idx] ?? 230;
          return (
            <ellipse
              key={`pier-shadow-${idx}`}
              cx={px + 10}
              cy={baseY + 2.5}
              rx="15"
              ry="2.6"
              fill="#182414"
              opacity="0.28"
            />
          );
        })}
      </g>

      {/* ========================================================================= */}
      {/* 2. 桥跨下方石拱与拱肩三角石墙 (Continuous Complete Arches)                   */}
      {/* ========================================================================= */}
      <g id="viaduct-spandrels-and-arches" mask="url(#viaductWestApproachMask)">
        {piers.map((px, idx) => {
          if (idx >= piers.length - 1) return null;
          const nextPx = piers[idx + 1];
          const spanLeft = px + 20;
          const spanRight = nextPx;
          const springY = 196;
          const midX = (spanLeft + spanRight) / 2;

          return (
            <g key={`viaduct-arch-span-${idx}`}>
              {/* 拱券上部三角实心石砌面 (Solid Spandrel Masonry above the open arch) */}
              <path
                d={`M ${spanLeft},182.5 L ${spanRight},182.5 L ${spanRight},${springY} A 25 13 0 0 0 ${spanLeft},${springY} Z`}
                fill="url(#viaductStoneGrad)"
                stroke="#5a5347"
                strokeWidth="0.6"
              />

              {/* 3D 拱腹内侧阴影厚度面 */}
              <path
                d={`M ${spanLeft},${springY} A 25 13 0 0 1 ${spanRight},${springY} L ${spanRight},${springY + 2.5} A 25 13 0 0 0 ${spanLeft},${springY + 2.5} Z`}
                fill="url(#viaductArchSoffitGrad)"
              />

              {/* 拱券弧线与外缘石 */}
              <path
                d={`M ${spanLeft},${springY} A 25 13 0 0 1 ${spanRight},${springY}`}
                fill="none"
                stroke="#3f382f"
                strokeWidth="1.4"
              />

              {/* 拱顶石 */}
              <polygon
                points={`${midX - 2},182 ${midX + 2},182 ${midX + 1.6},185.5 ${midX - 1.6},185.5`}
                fill="#948c7e"
                stroke="#423b32"
                strokeWidth="0.5"
              />
            </g>
          );
        })}
      </g>

      {/* ========================================================================= */}
      {/* 3. 经典渐缩石造桥墩群 (Tapered Ashlar Stone Piers · 包含右侧桥墩完美落地)      */}
      {/* ========================================================================= */}
      <g id="viaduct-piers" mask="url(#viaductWestApproachMask)">
        {piers.map((px, idx) => {
          const baseY = PIER_BASE_Y[idx] ?? 230;

          return (
            <g key={`viaduct-pier-${idx}`}>
              {/* 桥墩主受光面 */}
              <polygon
                points={`${px},182.5 ${px + 20},182.5 ${px + 22},${baseY} ${px - 2},${baseY}`}
                fill="url(#pierLitFaceGrad)"
                stroke="#4a4338"
                strokeWidth="0.7"
              />

              {/* 桥墩右侧阴影切面 */}
              <polygon
                points={`${px + 14},182.5 ${px + 20},182.5 ${px + 22},${baseY} ${px + 16},${baseY}`}
                fill="#363027"
                opacity="0.45"
              />

              {/* 拱座起拱线装饰线脚 */}
              <polygon
                points={`${px - 1.5},194 ${px + 21.5},194 ${px + 21.5},197 ${px - 1.5},197`}
                fill="#988f82"
                stroke="#423b32"
                strokeWidth="0.5"
              />

              {/* 桥墩横向石砌分格线 */}
              <line x1={px} y1="204" x2={px + 20} y2="204" stroke="#484238" strokeWidth="0.5" opacity="0.6" />
              <line x1={px} y1="212" x2={px + 21} y2="212" stroke="#484238" strokeWidth="0.5" opacity="0.6" />
              {baseY > 224 && (
                <line x1={px - 1} y1="220" x2={px + 21.5} y2="220" stroke="#484238" strokeWidth="0.5" opacity="0.5" />
              )}

              {/* 桥墩基底实心石座 (坚实入地) */}
              <polygon
                points={`${px - 4},${baseY - 3} ${px + 24},${baseY - 3} ${px + 25},${baseY + 3} ${px - 5},${baseY + 3}`}
                fill="#474137"
                stroke="#2a251e"
                strokeWidth="0.6"
              />
            </g>
          );
        })}
      </g>

      {/* ========================================================================= */}
      {/* 4. 顺应山势的穿山隧道口 (Mountain Tunnel Portal & Interior Track Depth)      */}
      {/* ========================================================================= */}
      <g id="viaduct-mountain-tunnel-portal">
        {/* A. 隧道石砌门楼主体 (高度严格与桥面承托梁基准齐平 y=182.5) */}
        <polygon
          points="52,182.5 52,160 76,147 86,150 86,182.5"
          fill="url(#viaductStoneGrad)"
          stroke="#473f34"
          strokeWidth="0.7"
        />

        {/* 门楼石质顶檐 (Stone Portal Coping Ledge) */}
        <polygon
          points="50,160 76,146 87,150 85,152 50,162"
          fill="#a2988a"
          stroke="#3d352b"
          strokeWidth="0.6"
        />

        {/* B. 深邃拱形隧道洞腔 (底沿与桥梁路基高度完全对齐 y=178) */}
        <path
          d="M 55,178 L 55,168.5 A 10.5 10.5 0 0 1 76,168.5 L 76,178 Z"
          fill="url(#tunnelMouthDarkGrad)"
        />

        {/* C. 洞内透视路基底面 (Interior Tunnel Ballast Floor) */}
        <polygon
          points="55,174.5 76,174.5 76,178 55,178"
          fill="#080c09"
        />

        {/* D. 洞内水平延伸平铺钢轨 (单线平铺在地面上，消隐于深处黑暗，彻底消除上下垂直堆叠感) */}
        <line
          x1="55"
          y1="175.0"
          x2="75"
          y2="175.0"
          stroke="url(#tunnelInnerRailGrad)"
          strokeWidth="0.85"
        />
        {/* 洞内道砟与轨枕深调衬影 */}
        <line
          x1="55"
          y1="175.8"
          x2="75"
          y2="175.8"
          stroke="url(#tunnelInnerBallastGrad)"
          strokeWidth="1.4"
        />

        {/* E. 石拱发券拱石外圈 (处于洞口外层，自然框住穿入的铁轨) */}
        <path
          d="M 54.5,178 L 54.5,168 A 11 11 0 0 1 76.5,168 L 76.5,178"
          fill="none"
          stroke="#5a5245"
          strokeWidth="1.8"
        />
        <path
          d="M 53.5,178 L 53.5,167 A 12 12 0 0 1 77.5,167 L 77.5,178"
          fill="none"
          stroke="#7d7466"
          strokeWidth="0.6"
        />

        {/* 拱顶石 (Keystone at apex x=65.5) */}
        <polygon
          points="64,155 67,155 67.5,159 63.5,159"
          fill="#b0a698"
          stroke="#3d352b"
          strokeWidth="0.5"
        />

        {/* F. 洞内温暖信号壁灯与微光 */}
        <circle cx="71" cy="171" r="1.2" fill="#f59e0b" />
        <circle cx="71" cy="171" r="3.2" fill="#fbbf24" opacity="0.22" />

        {/* G. 山麓自然攀缘苔藓 (Natural Moorland Moss Patches) */}
        <ellipse cx="58" cy="158" rx="3.5" ry="1.8" fill="#2d4221" />
        <ellipse cx="71" cy="152" rx="3.2" ry="1.6" fill="#3a562b" />
        <ellipse cx="80" cy="158" rx="2.8" ry="1.5" fill="#2d4221" />
      </g>

      {/* ========================================================================= */}
      {/* 5. 桥面结构、平整水平轨道梁与直通铁轨 (Completely Horizontal Rails)         */}
      {/* ========================================================================= */}
      <g id="viaduct-track-deck">
        {/* 西侧自然缓坡引桥护坎 */}
        <polygon
          points={`${layout.deck.minX},180 -525,182.5 -525,222 ${layout.deck.minX},218`}
          fill="url(#viaductStoneGrad)"
          stroke="#4a4338"
          strokeWidth="0.6"
          mask="url(#viaductWestApproachMask)"
        />

        {/* 桥身连续实心石质下承托梁 (全长完全水平，自西向东直通至隧道门柱 x=55，无缝拼接) */}
        <rect
          x={layout.deck.minX}
          y="178"
          width={55 - layout.deck.minX}
          height="4.5"
          fill="url(#viaductStoneGrad)"
          stroke="#3f382f"
          strokeWidth="0.6"
          mask="url(#viaductWestApproachMask)"
        />

        {/* 桥面线脚凸线 (全长水平) */}
        <line
          x1={layout.deck.minX}
          y1="182.5"
          x2="55"
          y2="182.5"
          stroke="#423a2f"
          strokeWidth="1.1"
          mask="url(#viaductWestApproachMask)"
        />

        {/* 桥面连续矮护栏 (到隧道门楼左柱 x=53 自然平顺收口) */}
        <rect
          x={layout.deck.minX}
          y="175"
          width={53 - layout.deck.minX}
          height="3"
          fill="#6d6559"
          stroke="#383228"
          strokeWidth="0.6"
          mask="url(#viaductWestApproachMask)"
        />
        {/* 护栏顶石高光 */}
        <line
          x1={layout.deck.minX}
          y1="175"
          x2="53"
          y2="175"
          stroke="#b8ad9d"
          strokeWidth="0.8"
          mask="url(#viaductWestApproachMask)"
        />

        {/* 连续深色道砟路基 (水平铺设直通洞口 x=55) */}
        <rect
          x={layout.deck.minX}
          y="174.0"
          width={55 - layout.deck.minX}
          height="4.0"
          fill="#242d27"
          mask="url(#viaductWestApproachMask)"
        />

        {/* 连续水平发光钢轨 (侧立面单轨视角，水平自西向东直通入洞口 x=55，与车轮及洞内地表完美贴合) */}
        {/* 钢轨下衬深色底影与轨枕轮廓 */}
        <line
          x1={layout.deck.minX}
          y1="175.8"
          x2="55"
          y2="175.8"
          stroke="#1e293b"
          strokeWidth="1.6"
          mask="url(#viaductWestApproachMask)"
        />
        {/* 钢轨受光顶面高光线 */}
        <line
          x1={layout.deck.minX}
          y1="175.0"
          x2="55"
          y2="175.0"
          stroke="#cbd5e1"
          strokeWidth="0.85"
          opacity="0.95"
          mask="url(#viaductWestApproachMask)"
        />
      </g>

      {/* ========================================================================= */}
      {/* 6. 约克郡复古蒸汽小火车 (Vintage Steam Locomotive & Passenger Carriages)     */}
      {/* ========================================================================= */}
      <g
        id="ribblehead-steam-train"
        transform={`translate(${layout.locomotive.x}, ${layout.locomotive.y})`}
      >
        {/* 铁轨投影 */}
        <ellipse cx="-12" cy="13.5" rx="38" ry="1.8" fill="#141a15" opacity="0.45" />

        {/* 车轮与转向架 */}
        {[-44, -36, -20, -12, 4, 12, 20].map((wx, i) => (
          <g key={`wheel-${i}`} transform={`translate(${wx}, 12)`}>
            <circle cx="0" cy="0" r="2.2" fill="#1b1c1e" />
            <circle cx="0" cy="0" r="1.4" fill="#3f454a" />
            <circle cx="0" cy="0" r="0.6" fill="#717a82" />
          </g>
        ))}

        {/* 蒸汽机车主体 (Brunswick Green Steam Engine) */}
        <g id="steam-engine-unit">
          {/* 锅炉主体 */}
          <rect x="0" y="5" width="22" height="7" rx="1.2" fill="#253a29" stroke="#142117" strokeWidth="0.6" />
          {/* 锅炉黄铜装饰圈 */}
          <line x1="6" y1="5" x2="6" y2="12" stroke="#d99b38" strokeWidth="0.7" />
          <line x1="12" y1="5" x2="12" y2="12" stroke="#d99b38" strokeWidth="0.7" />
          <line x1="18" y1="5" x2="18" y2="12" stroke="#d99b38" strokeWidth="0.7" />

          {/* 驾驶室 */}
          <rect x="18" y="1" width="10" height="11" rx="1" fill="#18271c" stroke="#0e1710" strokeWidth="0.6" />
          {/* 驾驶室车窗 */}
          <rect x="20" y="3" width="5" height="4" rx="0.5" fill="#fef08a" opacity="0.9" />
          <rect x="22" y="4" width="2" height="3" fill="#332a1e" opacity="0.7" />

          {/* 锅炉黄铜汽包 */}
          <circle cx="9" cy="5" r="1.8" fill="#eab308" stroke="#a16207" strokeWidth="0.5" />

          {/* 烟囱与排障器 */}
          <rect x="2.5" y="0.5" width="3.2" height="4.5" rx="0.5" fill="#17191a" />
          <polygon points="1.5,0.5 6.5,0.5 5.5,2 2.5,2" fill="#27292d" />
          <polygon points="-1,10 0,10 2,13 -1,13" fill="#1f2421" />

          {/* 前照灯 */}
          <circle cx="0.5" cy="8" r="1.2" fill="#fef3c7" />
        </g>

        {/* 客车车厢 1 & 2 */}
        <g id="passenger-carriages">
          <rect x="-24" y="4" width="20" height="8" rx="1" fill="#742d1e" stroke="#481a11" strokeWidth="0.6" />
          <rect x="-23" y="3.5" width="18" height="1" fill="#3c160e" />
          <rect x="-48" y="4" width="20" height="8" rx="1" fill="#742d1e" stroke="#481a11" strokeWidth="0.6" />
          <rect x="-47" y="3.5" width="18" height="1" fill="#3c160e" />

          {/* 车厢连接挂钩 */}
          <rect x="-27" y="9" width="3" height="1.5" fill="#1c1917" />
          <rect x="-3" y="9" width="3" height="1.5" fill="#1c1917" />

          {/* 车窗 */}
          {[-44, -36, -20, -12].map((wx, i) => (
            <g key={`win-${i}`}>
              <rect x={wx} y="5.8" width="4.5" height="3.4" rx="0.5" fill="#fef3c7" opacity="0.95" />
              <line x1={wx + 2.25} y1="5.8" x2={wx + 2.25} y2="9.2" stroke="#78350f" strokeWidth="0.5" opacity="0.7" />
            </g>
          ))}
        </g>

        {/* 白烟云朵 */}
        <g id="locomotive-steam-plumes">
          <circle cx="4" cy="-2.5" r="3.6" fill="#ffffff" opacity="0.82" className="animate-[pulse_3s_infinite]" />
          <circle cx="-6" cy="-7" r="5.2" fill="#ffffff" opacity="0.62" className="animate-[bounce_3.5s_infinite]" />
          <circle cx="-18" cy="-11.5" r="6.8" fill="#ffffff" opacity="0.42" />
          <circle cx="-33" cy="-16" r="8.5" fill="#ffffff" opacity="0.25" />
          <circle cx="-50" cy="-20" r="10.5" fill="#ffffff" opacity="0.12" />
        </g>
      </g>
    </g>
  );
};

