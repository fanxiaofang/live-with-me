import React from 'react';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';
import { YorkshireCommonProps } from '../landscapeTypes';
import { railwayAppearance } from './railwayAppearance';

/** Quiet stone arches suspended between two spatial membranes. */
const SUSPENDED_PIERS = [
  { end: 204, lean: -1 },
  { end: 211, lean: 1, fragment: { y: 218, width: 11, depth: 5 } },
  { end: 215, lean: -2 },
  { end: 208, lean: 2 },
  { end: 210, lean: -1, fragment: { y: 217, width: 9, depth: 4 } },
  { end: 216, lean: 1 },
  { end: 207, lean: -2, fragment: { y: 214, width: 12, depth: 5 } },
  { end: 203, lean: 1 },
];

export const RailwayLandscape: React.FC<YorkshireCommonProps> = React.memo(({ theme, className }) => {
  const layout = YORKSHIRE_LAYOUT.railway;
  const appearance = railwayAppearance(theme);
  const { light, emission: magicStrength, air } = appearance;
  // 8 个石砌桥墩中心间距 105px，构成 7 跨完整舒展石拱
  const piers = React.useMemo(() => [
    ...layout.piers, // [-685, -580, -475, -370, -265, -160, -55]
    50,              // Pier 7 at x = 50
  ], [layout.piers]);

  const PIER_WIDTH = 18;


  // 桥面水平基准线与两端消隐端点
  const DECK_Y = 175;
  const WEST_BARRIER_X = -735;
  const EAST_BARRIER_X = 100;

  // 7 跨标准 87px 宏大连续石拱 (Pier 0 至 Pier 7)
  const ARCH_SPANS = React.useMemo(() => {
    const list = [];
    for (let i = 0; i < piers.length - 1; i++) {
      list.push({
        spanLeft: piers[i] + PIER_WIDTH,
        spanRight: piers[i + 1],
      });
    }
    return list;
  }, [piers]);

  // 桥面轨枕序列：每 5.5px 一根，贯穿两端结界
  const sleeperPositions = React.useMemo(() => {
    const list: number[] = [];
    for (let x = WEST_BARRIER_X + 4; x <= EAST_BARRIER_X - 4; x += 5.5) {
      list.push(Math.round(x * 10) / 10);
    }
    return list;
  }, [WEST_BARRIER_X, EAST_BARRIER_X]);

  return (
    <g id="yorkshire-railway-viaduct" data-bridge-design="suspended-stone" className={className}>
      <style>{`
        #railway-spatial-light { transition: opacity ${light.transitionMs}ms ease-in-out; }
        .railway-spatial-motes { animation: railway-motes 8s ease-in-out infinite alternate; }
        @keyframes railway-motes { from { transform: translate(0,1px); opacity: .55; } to { transform: translate(1px,-1.5px); opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          #railway-spatial-light { transition: none; }
          .railway-spatial-motes { animation: none; }
        }
      `}</style>
      <defs>
        <filter id="railway-air-perspective" colorInterpolationFilters="linearRGB">
          <feComponentTransfer>
            <feFuncR type="linear" slope={air.slope} intercept={air.intercepts[0]} />
            <feFuncG type="linear" slope={air.slope} intercept={air.intercepts[1]} />
            <feFuncB type="linear" slope={air.slope} intercept={air.intercepts[2]} />
          </feComponentTransfer>
        </filter>
        <radialGradient id="railwaySuspensionMist">
          <stop offset="0" stopColor={light.core} stopOpacity=".45" />
          <stop offset=".5" stopColor={light.edge} stopOpacity=".18" />
          <stop offset="1" stopColor={light.edge} stopOpacity="0" />
        </radialGradient>
        {/* 桥体温暖灰砂岩受光面 (Sunlit Stone) */}
        <linearGradient id="viaductSunlitStoneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#cfc8bd" />
          <stop offset="40%" stopColor="#c2baa9" />
          <stop offset="100%" stopColor="#b0a797" />
        </linearGradient>

        {/* 拱圈三角拱肩实面渐变 (Arch Spandrel Masonry) */}
        <linearGradient id="viaductSpandrelGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d0c9b8" />
          <stop offset="48%" stopColor="#bcb5a3" />
          <stop offset="100%" stopColor="#a49e90" />
        </linearGradient>

        {/* 桥墩向阳主立面立体明暗 */}
        <linearGradient id="pierFrontFacetGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d3cbbb" />
          <stop offset="38%" stopColor="#c3bba9" />
          <stop offset="100%" stopColor="#aaa393" />
        </linearGradient>

        {/* 桥墩右侧轴测阴影切面 */}
        <linearGradient id="pierShadowFacetGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8d8477" />
          <stop offset="100%" stopColor="#7a7266" />
        </linearGradient>

        {/* 3D 拱腹内侧透视进深阴影面 */}
        <linearGradient id="viaductArchSoffitGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#787063" />
          <stop offset="100%" stopColor="#5e574c" />
        </linearGradient>

        {/* ✨ 两端自然透明化消融遮罩渐变 (Symmetrical Linear Opacity Mask) */}
        {/* 在西侧 x=-735 到 -685，由 0% 平滑过渡至 100%；在东侧 x=50 到 100，由 100% 平滑过渡至 0% */}
        <linearGradient
          id="viaductGlobalFadeGrad"
          x1={WEST_BARRIER_X}
          y1="0"
          x2={EAST_BARRIER_X}
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          {/* 西端渐变消隐: x=-735 为 0, x=-685 为 1 */}
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="6.0%" stopColor="#ffffff" stopOpacity="1" />
          {/* 中间桥体 100% 实心 */}
          <stop offset="94.0%" stopColor="#ffffff" stopOpacity="1" />
          {/* 东端渐变消隐: x=50 为 1, x=100 为 0 */}
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>

        <mask id="viaductEndsFadeMask">
          <rect
            x={WEST_BARRIER_X - 20}
            y="140"
            width={EAST_BARRIER_X - WEST_BARRIER_X + 40}
            height="110"
            fill="url(#viaductGlobalFadeGrad)"
          />
        </mask>

        {/* ✨ 薄薄空气结界微光环渐变 (Air Barrier Ring Shimmer Gradient) */}
        <linearGradient id="airBarrierRingGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light.core} stopOpacity="0.25" />
          <stop offset="30%" stopColor={light.core} stopOpacity="0.85" />
          <stop offset="50%" stopColor={light.core} stopOpacity="1" />
          <stop offset="70%" stopColor={light.edge} stopOpacity="0.85" />
          <stop offset="100%" stopColor={light.core} stopOpacity="0.25" />
        </linearGradient>

        {/* ✨ 空气结界内部透镜空气折射渐变 (Translucent Air Lens Radial) */}
        <radialGradient id="airBarrierLensGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={light.white} stopOpacity="0.45" />
          <stop offset="50%" stopColor={light.core} stopOpacity="0.18" />
          <stop offset="85%" stopColor={light.edge} stopOpacity="0.06" />
          <stop offset="100%" stopColor={light.edge} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g data-railway-atmosphere="" data-air-strength={air.strength} filter="url(#railway-air-perspective)">
      <g data-railway-material="" style={theme.landscapeEnvironment ? { filter: 'url(#field-environment-tone)' } : undefined}>
      {/* The open air beneath the stone replaces ground pads and pier planting. */}
      <g id="viaduct-arches-and-piers">
        {/* 7 跨连续大石拱 */}
        {ARCH_SPANS.map((span, idx) => {
          const { spanLeft, spanRight } = span;
          const springY = 197;
          const spanWidth = spanRight - spanLeft; // 87px
          const rx = spanWidth / 2; // 43.5px
          const ry = 13.5;

          return (
            <g key={`viaduct-grand-arch-${idx}`}>
              {/* 拱券上方连续平整三角拱肩 */}
              <path
                d={`M ${spanLeft},${DECK_Y + 7.5} L ${spanRight},${DECK_Y + 7.5} L ${spanRight},${springY} A ${rx} ${ry} 0 0 0 ${spanLeft},${springY} Z`}
                fill="url(#viaductSpandrelGrad)"
              />

              {/* 3D 拱腹内侧透视进深阴影面 */}
              <path
                d={`M ${spanLeft},${springY} A ${rx} ${ry} 0 0 1 ${spanRight},${springY} L ${spanRight},${springY + 3.2} A ${rx} ${ry} 0 0 0 ${spanLeft},${springY + 3.2} Z`}
                fill="url(#viaductArchSoffitGrad)"
              />

              {/* Sparse cut-stone joints follow the arch, with warm worn outer edges. */}
              <path d={`M${spanLeft + 1},${springY - .7} A${rx - 1} ${ry} 0 0 1 ${spanRight - 1},${springY - .7}`}
                fill="none" stroke="#e4ddca" strokeWidth=".6" opacity=".48" />
              {[.1,.23,.77,.9].map((fraction, j) => {
                const angle = Math.PI * fraction;
                const x = (spanLeft + spanRight)/2 - rx * Math.cos(angle);
                const y = springY - ry * Math.sin(angle);
                return <path key={j} d={`M${x},${y - .4} l${Math.cos(angle) * -1.3},-2.2`}
                  fill="none" stroke="#857f71" strokeWidth=".55" opacity=".48" />;
              })}
              <path d={`M${spanLeft + 5},184.5 h${15 + idx % 3 * 3} M${spanRight - 22},185 h12`}
                stroke={idx % 2 ? '#dfd7c3' : '#8c8779'} strokeWidth="1.2" opacity=".18" />
              {/* 拱圈发券精细弧线 */}
              <path
                d={`M ${spanLeft},${springY} A ${rx} ${ry} 0 0 1 ${spanRight},${springY}`}
                fill="none"
                stroke="#6b6357"
                strokeWidth="0.75"
              />
            </g>
          );
        })}

        {piers.map((px, idx) => {
          const { end, lean, fragment } = SUSPENDED_PIERS[idx];
          const edge = 10 + lean;
          return <g key={`viaduct-pier-${idx}`} data-suspended-pier={idx} transform={`translate(${px},0)`}>
            {/* Broad shoulders carry the arch; gently worn feet taper into open air. */}
            <path data-pier-body="" d={`M0,182.5 H12 L${edge + 1},${end - 5} Q${edge},${end} ${edge - 3},${end} L5,${end - 2} Q2,${end - 3} 2,${end - 7} Z`}
              fill="url(#pierFrontFacetGrad)" />
            <path d={`M12,182.5 H18 L16,${end - 8} Q15,${end - 4} ${edge - 3},${end} Q${edge},${end} ${edge + 1},${end - 5} Z`}
              fill="url(#pierShadowFacetGrad)" />
            <path d={`M2,197 H11 M12,197 H17 M4,${end - 7} L${edge - 1},${end - 6}`}
              fill="none" stroke="#8e887b" strokeWidth=".6" opacity=".48" />
            <path d={`M1,184 L2.6,${end - 8} M4,188 H11 M5,189 V193 M3.5,202 H9`}
              fill="none" stroke="#e0d8c5" strokeWidth=".65" opacity=".4" />
            <path d={`M2,194 H10 M7,194 V196 M4,${end - 5} L8,${end - 4}`}
              fill="none" stroke="#79766c" strokeWidth=".55" opacity=".4" />
            {fragment && <g data-floating-stone="">
              {/* One detached stone at three non-adjacent supports; no ground shadow. */}
              <path data-floating-body="" d={`M${9 - fragment.width/2},${fragment.y} Q9,${fragment.y - 1} ${9 + fragment.width/2},${fragment.y + 1} L${11},${fragment.y + fragment.depth} Q7,${fragment.y + fragment.depth + 1} ${6},${fragment.y + fragment.depth - 1} Z`}
                fill="url(#pierFrontFacetGrad)" />
              <path d={`M9,${fragment.y} L${9 + fragment.width/2},${fragment.y + 1} L11,${fragment.y + fragment.depth} L8,${fragment.y + fragment.depth + .5} Z`}
                fill="url(#pierShadowFacetGrad)" opacity=".65" />
            </g>}
          </g>;
        })}
      </g>

      {/* ========================================================================= */}
      {/* 3. 桥面结构、道砟、枕木与立体双轨 (两端应用透明化渐变遮罩)                      */}
      {/*    彻底去除水泥墙！轨道在两端平滑自然地由实化虚，渐变消失入结界之中             */}
      {/* ========================================================================= */}
      <g id="viaduct-deck-and-rails" mask="url(#viaductEndsFadeMask)">
        {/* 连续水平桥面石托梁主体 */}
        <rect
          x={WEST_BARRIER_X}
          y={DECK_Y + 2}
          width={EAST_BARRIER_X - WEST_BARRIER_X}
          height="5.5"
          fill="url(#viaductSunlitStoneGrad)"
        />

        {/* 桥面托梁上沿石帽高光线 */}
        <line
          x1={WEST_BARRIER_X}
          y1={DECK_Y + 2}
          x2={EAST_BARRIER_X}
          y2={DECK_Y + 2}
          stroke="#dfd9cd"
          strokeWidth="0.85"
          opacity="0.95"
        />

        {/* 桥面托梁下方悬挑阴影带 */}
        <rect
          x={WEST_BARRIER_X}
          y={DECK_Y + 6.7}
          width={EAST_BARRIER_X - WEST_BARRIER_X}
          height="0.8"
          fill="#6b6458"
        />

        {/* 碎石道砟层 */}
        <rect
          x={WEST_BARRIER_X}
          y={DECK_Y - 0.5}
          width={EAST_BARRIER_X - WEST_BARRIER_X}
          height="2.5"
          fill="#222824"
        />
        <line
          x1={WEST_BARRIER_X}
          y1={DECK_Y - 0.5}
          x2={EAST_BARRIER_X}
          y2={DECK_Y - 0.5}
          stroke="#3d4640"
          strokeWidth="0.6"
          opacity="0.8"
        />

        {/* 等距铺设的木质轨枕阵列 */}
        <g id="railroad-sleepers" opacity="0.85">
          {sleeperPositions.map((sx, i) => (
            <React.Fragment key={`slp-${i}`}>
              <line
                x1={sx}
                y1={DECK_Y - 0.6}
                x2={sx}
                y2={DECK_Y + 1.8}
                stroke="#151a16"
                strokeWidth="1.6"
              />
              <line
                x1={sx}
                y1={DECK_Y - 0.6}
                x2={sx}
                y2={DECK_Y + 0.1}
                stroke="#3e382d"
                strokeWidth="1.6"
                opacity="0.7"
              />
            </React.Fragment>
          ))}
        </g>

        {/* 钢轨结构 */}
        <line
          x1={WEST_BARRIER_X}
          y1={DECK_Y + 0.5}
          x2={EAST_BARRIER_X}
          y2={DECK_Y + 0.5}
          stroke="#101512"
          strokeWidth="1.2"
        />
        <line
          x1={WEST_BARRIER_X}
          y1={DECK_Y + 0.1}
          x2={EAST_BARRIER_X}
          y2={DECK_Y + 0.1}
          stroke="#64748b"
          strokeWidth="0.65"
          opacity="0.85"
        />
        <line
          x1={WEST_BARRIER_X}
          y1={DECK_Y - 0.5}
          x2={EAST_BARRIER_X}
          y2={DECK_Y - 0.5}
          stroke="#e2e8f0"
          strokeWidth="0.85"
          opacity="0.98"
        />

        {/* 栏杆 */}
        <line
          x1={WEST_BARRIER_X}
          y1={DECK_Y - 2.4}
          x2={EAST_BARRIER_X}
          y2={DECK_Y - 2.4}
          stroke="#857e72"
          strokeWidth="0.75"
          opacity="0.85"
        />
        <line
          x1={WEST_BARRIER_X}
          y1={DECK_Y - 1.0}
          x2={EAST_BARRIER_X}
          y2={DECK_Y - 1.0}
          stroke="#857e72"
          strokeWidth="0.45"
          opacity="0.5"
        />

        {/* 桥墩正上方英式高架桥经典避车台 */}
        <g id="parapet-refuges">
          {piers.map((px, i) => (
            <g key={`refuge-${i}`} transform={`translate(${px + 9}, 0)`}>
              <polygon
                points="-4.5,175.5 4.5,175.5 5.5,172.4 -5.5,172.4"
                fill="#b8b0a2"
                stroke="#686154"
                strokeWidth="0.5"
              />
              <line x1="-5.5" y1="172.4" x2="5.5" y2="172.4" stroke="#dfd8cb" strokeWidth="0.8" />
            </g>
          ))}
        </g>

        {/* 栏杆立柱 */}
        <g id="parapet-posts">
          {Array.from({ length: Math.floor((EAST_BARRIER_X - WEST_BARRIER_X) / 26) }).map((_, i) => {
            const postX = WEST_BARRIER_X + 10 + i * 26;
            return (
              <line
                key={`pp-${i}`}
                x1={postX}
                y1={DECK_Y - 2.4}
                x2={postX}
                y2={DECK_Y + 0.2}
                stroke="#857e72"
                strokeWidth="0.6"
                opacity="0.7"
              />
            );
          })}
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 6. 约克郡复古蒸汽小火车 (Vintage Steam Locomotive & Carriages)               */}
      {/* ========================================================================= */}
      <g
        id="ribblehead-steam-train"
        transform={`translate(${layout.locomotive.x}, ${layout.locomotive.y})`}
      >
        {/* 铁轨运行微弱投影 */}
        <ellipse cx="-12" cy="13.5" rx="38" ry="1.6" fill="#141a15" opacity="0.4" />

        {/* 车轮与转向架 (稳稳落在 y=174.5 的钢轨上) */}
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
          <rect x="0" y="5" width="22" height="7" rx="1.2" fill="#253a29" stroke="#142117" strokeWidth="0.5" />
          {/* 锅炉黄铜装饰圈 */}
          <line x1="6" y1="5" x2="6" y2="12" stroke="#d99b38" strokeWidth="0.7" />
          <line x1="12" y1="5" x2="12" y2="12" stroke="#d99b38" strokeWidth="0.7" />
          <line x1="18" y1="5" x2="18" y2="12" stroke="#d99b38" strokeWidth="0.7" />

          {/* 驾驶室 */}
          <rect x="18" y="1" width="10" height="11" rx="1" fill="#18271c" stroke="#0e1710" strokeWidth="0.5" />
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
          <rect x="-24" y="4" width="20" height="8" rx="1" fill="#742d1e" stroke="#481a11" strokeWidth="0.5" />
          <rect x="-23" y="3.5" width="18" height="1" fill="#3c160e" />
          <rect x="-48" y="4" width="20" height="8" rx="1" fill="#742d1e" stroke="#481a11" strokeWidth="0.5" />
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

        {/* 白烟云朵 (随风舒卷律动) */}
        <g id="locomotive-steam-plumes">
          <circle cx="4" cy="-2.5" r="3.6" fill="#ffffff" opacity="0.82" className="animate-[pulse_3s_infinite]" />
          <circle cx="-6" cy="-7" r="5.2" fill="#ffffff" opacity="0.62" className="animate-[bounce_3.5s_infinite]" />
          <circle cx="-18" cy="-11.5" r="6.8" fill="#ffffff" opacity="0.42" />
          <circle cx="-33" cy="-16" r="8.5" fill="#ffffff" opacity="0.25" />
          <circle cx="-50" cy="-20" r="10.5" fill="#ffffff" opacity="0.12" />
        </g>
      </g>
      </g>
      </g>
      {/* Emitted light stays outside the material tint, but inherits the same railway camera. */}
      <g id="railway-spatial-light" data-magic-strength={magicStrength} opacity={magicStrength} pointerEvents="none" aria-hidden="true">
      {/* ========================================================================= */}
      {/* 4. 🌀 薄薄的空气结界 (Subtle Translucent Air Barrier Membranes)             */}
      {/*    绝非大团白光！极为通透轻薄的空气折射薄膜与微光波纹，优雅作为世界的边界            */}
      {/* ========================================================================= */}
      <g id="subtle-air-barriers">
        {/* --- A. 西侧空气结界 (West Air Barrier at x = -735) --- */}
        <g
          id="west-air-barrier"
          transform={`translate(${WEST_BARRIER_X}, ${DECK_Y})`}
          data-spatial-emitter="portal"
        >
          {/* 外圈微弱扩散空间空气涟漪 (Soft Spatial Ripple Ring) */}
          <ellipse cx="0" cy="0" rx="6.5" ry="24" fill="none" stroke={light.edge} strokeWidth="0.6" strokeDasharray="3 3" opacity="0.3" />

          {/* 结界主透镜空气薄膜 (Thin Refraction Lens Membrane) */}
          <ellipse cx="0" cy="0" rx="3.5" ry="19" fill="url(#airBarrierLensGrad)" />

          {/* 结界垂直高光细边缘 (Crystalline Light Rim) */}
          <ellipse cx="0" cy="0" rx="3.5" ry="19" fill="none" stroke="url(#airBarrierRingGrad)" strokeWidth="1.0" opacity={light.coreOpacity} />

          {/* 空间折射中心极细微光轴线 */}
          <line x1="0" y1="-21" x2="0" y2="21" stroke={light.white} strokeWidth="0.75" opacity="0.65" />
          <circle cx="0" cy="-21" r="0.8" fill={light.white} opacity="0.8" />
          <circle cx="0" cy="21" r="0.8" fill={light.white} opacity="0.8" />

          {/* 边缘微光星屑 (Tiny Glimmering Motets) */}
          <circle cx="2" cy="-9" r="0.8" fill={light.white} opacity="0.75" />
          <circle cx="-1.5" cy="8" r="0.7" fill={light.core} opacity="0.6" />
        </g>

        {/* --- B. 东侧空气结界 (East Air Barrier at x = 100) --- */}
        <g
          id="east-air-barrier"
          transform={`translate(${EAST_BARRIER_X}, ${DECK_Y})`}
          data-spatial-emitter="portal"
        >
          {/* 外圈微弱扩散空间空气涟漪 */}
          <ellipse cx="0" cy="0" rx="6.5" ry="24" fill="none" stroke={light.edge} strokeWidth="0.6" strokeDasharray="3 3" opacity="0.3" />

          {/* 结界主透镜空气薄膜 */}
          <ellipse cx="0" cy="0" rx="3.5" ry="19" fill="url(#airBarrierLensGrad)" />

          {/* 结界垂直高光细边缘 */}
          <ellipse cx="0" cy="0" rx="3.5" ry="19" fill="none" stroke="url(#airBarrierRingGrad)" strokeWidth="1.0" opacity={light.coreOpacity} />

          {/* 空间折射中心极细微光轴线 */}
          <line x1="0" y1="-21" x2="0" y2="21" stroke={light.white} strokeWidth="0.75" opacity="0.65" />
          <circle cx="0" cy="-21" r="0.8" fill={light.white} opacity="0.8" />
          <circle cx="0" cy="21" r="0.8" fill={light.white} opacity="0.8" />

          {/* 边缘微光星屑 */}
          <circle cx="-2" cy="-10" r="0.9" fill={light.white} opacity="0.8" />
          <circle cx="1.8" cy="7" r="0.75" fill={light.core} opacity="0.65" />
          <circle cx="-1.2" cy="14" r="0.65" fill={light.core} opacity="0.55" />
        </g>
      </g>

        {piers.map((px, idx) => {
          const { end, fragment } = SUSPENDED_PIERS[idx];
          if (!fragment) return null;
          return <g key={idx} transform={`translate(${px},0)`} data-suspension-magic={idx} data-spatial-emitter="stone">
            <ellipse data-suspension-mist="" cx="9" cy={fragment.y + 1} rx="14" ry="6.5" fill="url(#railwaySuspensionMist)" />
            <path d={`M4,${end - 1} Q8,${end + 1} 11,${end - 2}`}
              fill="none" stroke={light.edge} strokeWidth="1" opacity={light.coreOpacity} />
            <path data-spatial-seam="" d={`M${9 - fragment.width/2},${fragment.y - .8} Q9,${fragment.y - 2.2} ${9 + fragment.width/2},${fragment.y + .1}`}
              fill="none" stroke={light.core} strokeWidth="1" opacity={light.coreOpacity} strokeLinecap="round" />
            <g className="railway-spatial-motes" style={{animationDelay: `${idx * -.9}s`}}>
              {[[-2,-3,.7],[18,1,.8],[1,6,.65],[15,-8,.55]].map(([x,y,r],i) =>
                <circle key={i} data-suspension-mote="" cx={x + (idx % 3 - 1)} cy={fragment.y + y} r={r}
                  fill={i % 2 ? light.edge : light.white} opacity={i % 2 ? .7 : .9} />)}
            </g>
          </g>;
        })}
      </g>
    </g>
  );
});
