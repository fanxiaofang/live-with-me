import React from 'react';
import type { ResolvedPresenceSlot } from '../../features/presence/presenceAllocation';
import type { Person } from '../../types';
import type { InteractionTarget } from '../../world/interactions/interactionTypes';
import { svgAction } from '../../world/interactions/svgAction';
import { StandingCharacter } from '../characters/StandingCharacter';
import { CHARACTER_WORLD_SIZE } from '../characters/characterProportions';
import { MeadowWearPatch } from '../scenery/yorkshire/dressing/MeadowWearPatch';
import type { YorkshireSceneTheme } from '../scenery/yorkshire/landscapeTypes';

export interface ObservatoryHavenProps {
  characterParentScale?: number;
  theme: Pick<YorkshireSceneTheme, 'roadColor' | 'hillGreenFar'>;
  presenceSlots: Partial<Record<'observatory_post', ResolvedPresenceSlot>>;
  alienPulseEffect?: boolean;
  triggerAlienSignal: (event?: React.MouseEvent) => void;
  onSelectPerson: (person: Person) => void;
  setHoveredObject: (target: InteractionTarget | null) => void;
}

/**
 * 📐 严格统一的 2.5D 轴测投影体系 (Consistent Axonometric Projection)
 * 与整个 Live With Me 场景 (TimberFlooring, CottageFoundation, WoodenCabinHaven)
 * 严格共享相同的地面视觉斜率与轴测空间向量：
 *
 * - u 轴：长边轴，向右下方延伸 (dx = +1, dy = +SLOPE)
 * - v 轴：进深轴，向左下方延伸 (dx = -1, dy = +SLOPE)
 * - z 轴：垂直高度轴，垂直向上 (dx = 0, dy = -1)
 */
const SLOPE = 0.283088; // 统一地面斜率常数 (约 15.8°)
const GROUND_Y = 48; // 地面接触基准高度
const DECK_Z = 66; // 观测平台离地高度 (高架架空)
const DECK_THICKNESS = 5; // 承重钢梁边框厚度

/**
 * 3D 轴测点 (u, v, z) -> 2D 屏幕点 (x, y)
 */
const pt = (u: number, v: number, z = 0) => ({
  x: Number((u - v).toFixed(2)),
  y: Number((GROUND_Y + SLOPE * (u + v) - z).toFixed(2)),
});

/**
 * 将若干个 3D 点格式化为 SVG polygon points 字符串
 */
const face = (...vertices: [number, number, number][]) =>
  vertices.map(([u, v, z]) => `${pt(u, v, z).x},${pt(u, v, z).y}`).join(' ');

function ObservatoryHavenAsset({
  theme,
  characterParentScale = 1,
  presenceSlots,
  alienPulseEffect,
  triggerAlienSignal,
  onSelectPerson,
  setHoveredObject,
}: ObservatoryHavenProps) {
  // 柱网核心半跨距 (Pillar Grid Spacing)
  const PU = 26;
  const PV = 26;

  // 甲板半长与半宽 (Deck Half Extents)
  const DU = 35;
  const DV = 35;

  // 检修直梯在左侧边缘 (u = -DU) 的进深范围
  const LADDER_V1 = 8;
  const LADDER_V2 = 18;

  return (
    <>
      {/* ========================================================================= */}
      {/* 0. GROUND CONTACT & OCCLUSION SHADOWS (地面柔和阴影与接触遮蔽)            */}
      {/* ========================================================================= */}
      <g id="observatory-ground-shadows">
        {/* 高架平台投射在草地上的整体柔和阴影 */}
        <ellipse cx="0" cy="48" rx="74" ry="22" fill="#17221a" opacity="0.42" filter="url(#softShadow)" />
        <ellipse cx="0" cy="48" rx="60" ry="16" fill="#121a14" opacity="0.25" />

        {/* 4 处支柱立足点的局部接触加深阴影 */}
        <ellipse cx={pt(-PU, -PV, 0).x} cy={pt(-PU, -PV, 0).y} rx="9" ry="3.8" fill="#111712" opacity="0.5" />
        <ellipse cx={pt(-PU, PV, 0).x} cy={pt(-PU, PV, 0).y} rx="9" ry="3.8" fill="#111712" opacity="0.5" />
        <ellipse cx={pt(PU, -PV, 0).x} cy={pt(PU, -PV, 0).y} rx="9" ry="3.8" fill="#111712" opacity="0.5" />
        <ellipse cx={pt(PU, PV, 0).x} cy={pt(PU, PV, 0).y} rx="9" ry="3.8" fill="#111712" opacity="0.5" />
      </g>

      {/* A short approach at the access ladder, rather than a ring around the platform. */}
      <MeadowWearPatch id="observatory-entry-grass-wear" theme={theme}
        transform="matrix(0.28 0.079 -0.5 0.35 -50 46)" opacity={0.85} />

      {/* ========================================================================= */}
      {/* 1. ASHLAR STONE FOOTINGS (4个工整规矩的石砌锚固基座)                     */}
      {/*    彻底解决毛刺问题：使用 strokeLinejoin="round" 和平滑描边               */}
      {/* ========================================================================= */}
      <g id="observatory-stone-footings">
        {[
          { u: -PU, v: -PV, id: 'back' },
          { u: -PU, v: PV, id: 'left' },
          { u: PU, v: -PV, id: 'right' },
          { u: PU, v: PV, id: 'front' },
        ].map((f) => {
          const hw = 5.2; // 基础半宽
          const zh = 5.5; // 基础顶面高度
          return (
            <g key={`footing-${f.id}`} id={`footing-${f.id}`}>
              {/* 基座接地软阴影 */}
              <ellipse
                cx={pt(f.u, f.v, 0).x}
                cy={pt(f.u, f.v, 0).y}
                rx="8"
                ry="3.2"
                fill="#121a14"
                opacity="0.4"
              />
              {/* 顶面 */}
              <polygon
                points={face(
                  [f.u - hw, f.v - hw, zh],
                  [f.u + hw, f.v - hw, zh],
                  [f.u + hw, f.v + hw, zh],
                  [f.u - hw, f.v + hw, zh]
                )}
                fill="#59685d"
                stroke="#2a342c"
                strokeWidth="0.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* 前左侧立面 */}
              <polygon
                points={face(
                  [f.u - hw, f.v + hw, 0],
                  [f.u + hw, f.v + hw, 0],
                  [f.u + hw, f.v + hw, zh],
                  [f.u - hw, f.v + hw, zh]
                )}
                fill="#445147"
                stroke="#2a342c"
                strokeWidth="0.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* 前右侧立面 */}
              <polygon
                points={face(
                  [f.u + hw, f.v + hw, 0],
                  [f.u + hw, f.v - hw, 0],
                  [f.u + hw, f.v - hw, zh],
                  [f.u + hw, f.v + hw, zh]
                )}
                fill="#343f36"
                stroke="#2a342c"
                strokeWidth="0.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* 钢柱底座锚固钢板垫片 */}
              <polygon
                points={face(
                  [f.u - 2.6, f.v - 2.6, zh + 0.8],
                  [f.u + 2.6, f.v - 2.6, zh + 0.8],
                  [f.u + 2.6, f.v + 2.6, zh + 0.8],
                  [f.u - 2.6, f.v + 2.6, zh + 0.8]
                )}
                fill="#222a24"
                stroke="#181f1a"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
      </g>

      {/* ========================================================================= */}
      {/* 2. REFINED STEEL STAGING STRUCTURE (通透利落的高架钢构主柱与建筑斜撑)     */}
      {/* ========================================================================= */}
      <g id="observatory-staging-pylons">
        {/* 后侧背光主钢柱 */}
        <line
          x1={pt(-PU, -PV, 5.5).x}
          y1={pt(-PU, -PV, 5.5).y}
          x2={pt(-PU, -PV, DECK_Z - DECK_THICKNESS).x}
          y2={pt(-PU, -PV, DECK_Z - DECK_THICKNESS).y}
          stroke="#263128"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* 后侧向连系梁 (静谧背景横梁) */}
        <line
          x1={pt(-PU, -PV, 32).x}
          y1={pt(-PU, -PV, 32).y}
          x2={pt(PU, -PV, 32).x}
          y2={pt(PU, -PV, 32).y}
          stroke="#2b372e"
          strokeWidth="2.2"
        />
        <line
          x1={pt(-PU, -PV, 32).x}
          y1={pt(-PU, -PV, 32).y}
          x2={pt(-PU, PV, 32).x}
          y2={pt(-PU, PV, 32).y}
          stroke="#2b372e"
          strokeWidth="2.2"
        />

        {/* 左侧主钢柱 */}
        <line
          x1={pt(-PU, PV, 5.5).x}
          y1={pt(-PU, PV, 5.5).y}
          x2={pt(-PU, PV, DECK_Z - DECK_THICKNESS).x}
          y2={pt(-PU, PV, DECK_Z - DECK_THICKNESS).y}
          stroke="#2d3930"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* 右侧主钢柱 */}
        <line
          x1={pt(PU, -PV, 5.5).x}
          y1={pt(PU, -PV, 5.5).y}
          x2={pt(PU, -PV, DECK_Z - DECK_THICKNESS).x}
          y2={pt(PU, -PV, DECK_Z - DECK_THICKNESS).y}
          stroke="#29342c"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* 前侧主钢柱 */}
        <line
          x1={pt(PU, PV, 5.5).x}
          y1={pt(PU, PV, 5.5).y}
          x2={pt(PU, PV, DECK_Z - DECK_THICKNESS).x}
          y2={pt(PU, PV, DECK_Z - DECK_THICKNESS).y}
          stroke="#38473c"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* 前柱受光面微高光 */}
        <line
          x1={pt(PU, PV, 5.5).x + 0.6}
          y1={pt(PU, PV, 5.5).y}
          x2={pt(PU, PV, DECK_Z - DECK_THICKNESS).x + 0.6}
          y2={pt(PU, PV, DECK_Z - DECK_THICKNESS).y}
          stroke="#55695a"
          strokeWidth="1.6"
          strokeLinecap="round"
        />

        {/* 前左跨间 (v = PV) 极简建筑横梁与斜撑 */}
        <line
          x1={pt(-PU, PV, 32).x}
          y1={pt(-PU, PV, 32).y}
          x2={pt(PU, PV, 32).x}
          y2={pt(PU, PV, 32).y}
          stroke="#323f34"
          strokeWidth="2.8"
        />
        <line
          x1={pt(-PU, PV, 10).x}
          y1={pt(-PU, PV, 10).y}
          x2={pt(PU, PV, 54).x}
          y2={pt(PU, PV, 54).y}
          stroke="#3b4b3f"
          strokeWidth="2.2"
        />

        {/* 前右跨间 (u = PU) 极简建筑横梁与斜撑 */}
        <line
          x1={pt(PU, -PV, 32).x}
          y1={pt(PU, -PV, 32).y}
          x2={pt(PU, PV, 32).x}
          y2={pt(PU, PV, 32).y}
          stroke="#323f34"
          strokeWidth="2.8"
        />
        <line
          x1={pt(PU, -PV, 10).x}
          y1={pt(PU, -PV, 10).y}
          x2={pt(PU, PV, 54).x}
          y2={pt(PU, PV, 54).y}
          stroke="#3b4b3f"
          strokeWidth="2.2"
        />
      </g>

      {/* ========================================================================= */}
      {/* 3. SLEEK ACCESS LADDER (左侧极简登台直梯)                                 */}
      {/*    精确定位在左侧边框 u = -DU 处，与上方的护栏出入口严格对齐              */}
      {/* ========================================================================= */}
      <g id="observatory-access-ladder">
        {/* 左梯轨与右梯轨 */}
        <line
          x1={pt(-DU, LADDER_V1, 0).x}
          y1={pt(-DU, LADDER_V1, 0).y}
          x2={pt(-DU, LADDER_V1, DECK_Z + 10).x}
          y2={pt(-DU, LADDER_V1, DECK_Z + 10).y}
          stroke="#38453b"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <line
          x1={pt(-DU, LADDER_V2, 0).x}
          y1={pt(-DU, LADDER_V2, 0).y}
          x2={pt(-DU, LADDER_V2, DECK_Z + 10).x}
          y2={pt(-DU, LADDER_V2, DECK_Z + 10).y}
          stroke="#38453b"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* 工整分布的安全防滑踏棍 */}
        {[4, 11, 18, 25, 32, 39, 46, 53, 60].map((rz) => (
          <line
            key={`ladder-step-${rz}`}
            x1={pt(-DU, LADDER_V1, rz).x}
            y1={pt(-DU, LADDER_V1, rz).y}
            x2={pt(-DU, LADDER_V2, rz).x}
            y2={pt(-DU, LADDER_V2, rz).y}
            stroke="#637667"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        ))}

        {/* 顶部安全扶手向甲板内侧平滑弯折过渡，并自然连接甲板门柱 */}
        <path
          d={`M ${pt(-DU, LADDER_V1, DECK_Z + 10).x},${pt(-DU, LADDER_V1, DECK_Z + 10).y} Q ${pt(-DU + 3, LADDER_V1, DECK_Z + 11).x},${pt(-DU + 3, LADDER_V1, DECK_Z + 11).y} ${pt(-DU + 4, LADDER_V1, DECK_Z).x},${pt(-DU + 4, LADDER_V1, DECK_Z).y}`}
          fill="none"
          stroke="#4b5d50"
          strokeWidth="1.8"
        />
        <path
          d={`M ${pt(-DU, LADDER_V2, DECK_Z + 10).x},${pt(-DU, LADDER_V2, DECK_Z + 10).y} Q ${pt(-DU + 3, LADDER_V2, DECK_Z + 11).x},${pt(-DU + 3, LADDER_V2, DECK_Z + 11).y} ${pt(-DU + 4, LADDER_V2, DECK_Z).x},${pt(-DU + 4, LADDER_V2, DECK_Z).y}`}
          fill="none"
          stroke="#4b5d50"
          strokeWidth="1.8"
        />
      </g>

      {/* ========================================================================= */}
      {/* 4. SOLID CANTILEVERED OBSERVATION DECK PLATFORM (观景平台基座与地板)      */}
      {/* ========================================================================= */}
      <g id="observatory-deck-platform">
        {/* 平台下层承重边梁侧立面 (前左向) */}
        <polygon
          points={face(
            [-DU, DV, DECK_Z - DECK_THICKNESS],
            [DU, DV, DECK_Z - DECK_THICKNESS],
            [DU, DV, DECK_Z],
            [-DU, DV, DECK_Z]
          )}
          fill="#253027"
          stroke="#19211b"
          strokeWidth="0.8"
        />

        {/* 平台下层承重边梁侧立面 (前右向) */}
        <polygon
          points={face(
            [DU, DV, DECK_Z - DECK_THICKNESS],
            [DU, -DV, DECK_Z - DECK_THICKNESS],
            [DU, -DV, DECK_Z],
            [DU, DV, DECK_Z]
          )}
          fill="#1c241e"
          stroke="#19211b"
          strokeWidth="0.8"
        />

        {/* 平台甲板顶面 (大面积平整干净的观测地面) */}
        <polygon
          points={face(
            [-DU, -DV, DECK_Z],
            [DU, -DV, DECK_Z],
            [DU, DV, DECK_Z],
            [-DU, DV, DECK_Z]
          )}
          fill="#48564b"
          stroke="#263128"
          strokeWidth="1.2"
        />

        {/* 甲板内圈防滑走道嵌线 */}
        <polygon
          points={face(
            [-DU + 3, -DV + 3, DECK_Z + 0.1],
            [DU - 3, -DV + 3, DECK_Z + 0.1],
            [DU - 3, DV - 3, DECK_Z + 0.1],
            [-DU + 3, DV - 3, DECK_Z + 0.1]
          )}
          fill="#526155"
          stroke="#38453b"
          strokeWidth="0.8"
        />

        {/* 台面中央操作地垫 (为观测员提供专属站席标界，在控制台正前方留出充裕空间) */}
        <polygon
          id="observatory-operation-mat"
          points={face(
            [-8, 14, DECK_Z + 0.2],
            [14, 14, DECK_Z + 0.2],
            [14, 25, DECK_Z + 0.2],
            [-8, 25, DECK_Z + 0.2]
          )}
          fill="#28332a"
          stroke="#1c241e"
          strokeWidth="0.8"
        />
      </g>

      {/* ========================================================================= */}
      {/* 5. REAR PERIMETER GUARDRAILS (后排护栏：位于机房与天线后方)                */}
      {/*    彻底解决层级倒置问题：后排护栏先画，前排护栏最后画                      */}
      {/* ========================================================================= */}
      <g id="observatory-rear-guardrail">
        {/* 后右段栏杆顶线与腰杆 */}
        <line
          x1={pt(-DU + 1, -DV + 1, DECK_Z + 9).x}
          y1={pt(-DU + 1, -DV + 1, DECK_Z + 9).y}
          x2={pt(DU - 1, -DV + 1, DECK_Z + 9).x}
          y2={pt(DU - 1, -DV + 1, DECK_Z + 9).y}
          stroke="#2e3a31"
          strokeWidth="1.8"
        />
        <line
          x1={pt(-DU + 1, -DV + 1, DECK_Z + 4.5).x}
          y1={pt(-DU + 1, -DV + 1, DECK_Z + 4.5).y}
          x2={pt(DU - 1, -DV + 1, DECK_Z + 4.5).x}
          y2={pt(DU - 1, -DV + 1, DECK_Z + 4.5).y}
          stroke="#232d26"
          strokeWidth="1.2"
        />

        {/* 后左段栏杆 (从后角连接至梯子开口起点 v = LADDER_V1) */}
        <line
          x1={pt(-DU + 1, -DV + 1, DECK_Z + 9).x}
          y1={pt(-DU + 1, -DV + 1, DECK_Z + 9).y}
          x2={pt(-DU + 1, LADDER_V1, DECK_Z + 9).x}
          y2={pt(-DU + 1, LADDER_V1, DECK_Z + 9).y}
          stroke="#2e3a31"
          strokeWidth="1.8"
        />
        <line
          x1={pt(-DU + 1, -DV + 1, DECK_Z + 4.5).x}
          y1={pt(-DU + 1, -DV + 1, DECK_Z + 4.5).y}
          x2={pt(-DU + 1, LADDER_V1, DECK_Z + 4.5).x}
          y2={pt(-DU + 1, LADDER_V1, DECK_Z + 4.5).y}
          stroke="#232d26"
          strokeWidth="1.2"
        />

        {/* 后排立柱 */}
        {[
          { u: -DU + 1, v: -DV + 1 },
          { u: 0, v: -DV + 1 },
          { u: DU - 1, v: -DV + 1 },
          { u: -DU + 1, v: -10 },
          { u: -DU + 1, v: LADDER_V1 }, // 梯口后侧专用端头立柱
        ].map((sp, idx) => (
          <line
            key={`rear-rail-post-${idx}`}
            x1={pt(sp.u, sp.v, DECK_Z).x}
            y1={pt(sp.u, sp.v, DECK_Z).y}
            x2={pt(sp.u, sp.v, DECK_Z + 9).x}
            y2={pt(sp.u, sp.v, DECK_Z + 9).y}
            stroke="#2e3b32"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* ========================================================================= */}
      {/* 6. MINIMALIST OBSERVATION CABIN (左后方紧凑小木质/钢构监听室)             */}
      {/*    解决屋顶脱节：补齐左侧封墙、山花封板与精致封檐板，做到严丝合缝         */}
      {/* ========================================================================= */}
      <g id="observatory-control-cabin">
        {/* 机房空间定义: u ∈ [-30, -10], v ∈ [6, 26] */}
        {/* 左侧向墙面 (西北立面 u = -30) - 彻底封死左侧透空漏洞 */}
        <polygon
          points={face(
            [-30, 26, DECK_Z],
            [-30, 6, DECK_Z],
            [-30, 6, DECK_Z + 24],
            [-30, 26, DECK_Z + 20]
          )}
          fill="#313d35"
          stroke="#202923"
          strokeWidth="0.8"
        />

        {/* 正向立面 (西南立面 v = 26) */}
        <polygon
          points={face(
            [-30, 26, DECK_Z],
            [-10, 26, DECK_Z],
            [-10, 26, DECK_Z + 20],
            [-30, 26, DECK_Z + 20]
          )}
          fill="#3b4840"
          stroke="#242e27"
          strokeWidth="0.9"
        />

        {/* 右侧向立面与山墙三角形山花 (东南立面 u = -10) */}
        <polygon
          points={face(
            [-10, 26, DECK_Z],
            [-10, 6, DECK_Z],
            [-10, 6, DECK_Z + 24],
            [-10, 26, DECK_Z + 20]
          )}
          fill="#2b352e"
          stroke="#1e2620"
          strokeWidth="0.9"
        />

        {/* 屋顶倾斜底壳/封檐厚度侧面 (消除屋顶悬空感) */}
        <polygon
          points={face(
            [-31.5, 27, DECK_Z + 19.5],
            [-9, 27, DECK_Z + 19.5],
            [-9, 27, DECK_Z + 20.8],
            [-31.5, 27, DECK_Z + 20.8]
          )}
          fill="#141c24"
        />
        <polygon
          points={face(
            [-9, 27, DECK_Z + 19.5],
            [-9, 5, DECK_Z + 23.5],
            [-9, 5, DECK_Z + 24.8],
            [-9, 27, DECK_Z + 20.8]
          )}
          fill="#0f172a"
        />

        {/* 太阳能倾斜屋顶顶面 (自然向前出挑，盖住墙顶) */}
        <polygon
          points={face(
            [-31.5, 27, DECK_Z + 20.8],
            [-9, 27, DECK_Z + 20.8],
            [-9, 5, DECK_Z + 24.8],
            [-31.5, 5, DECK_Z + 24.8]
          )}
          fill="#1e293b"
          stroke="#0f172a"
          strokeWidth="0.9"
        />

        {/* 太阳能板光伏极线划分 */}
        <line
          x1={pt(-25, 26, DECK_Z + 21.2).x}
          y1={pt(-25, 26, DECK_Z + 21.2).y}
          x2={pt(-25, 6, DECK_Z + 24.5).x}
          y2={pt(-25, 6, DECK_Z + 24.5).y}
          stroke="#38bdf8"
          strokeWidth="0.75"
          opacity="0.65"
        />
        <line
          x1={pt(-16, 26, DECK_Z + 21.2).x}
          y1={pt(-16, 26, DECK_Z + 21.2).y}
          x2={pt(-16, 6, DECK_Z + 24.5).x}
          y2={pt(-16, 6, DECK_Z + 24.5).y}
          stroke="#38bdf8"
          strokeWidth="0.75"
          opacity="0.65"
        />

        {/* 设备舱门 */}
        <polygon
          points={face(
            [-27, 26, DECK_Z + 0.5],
            [-19, 26, DECK_Z + 0.5],
            [-19, 26, DECK_Z + 15],
            [-27, 26, DECK_Z + 15]
          )}
          fill="#28332c"
          stroke="#1a221d"
          strokeWidth="0.8"
        />
        <circle cx={pt(-20.5, 26, DECK_Z + 7.5).x} cy={pt(-20.5, 26, DECK_Z + 7.5).y} r="0.8" fill="#d97706" />

        {/* 监听观察窗与跳动脉冲线 */}
        <polygon
          points={face(
            [-16, 26, DECK_Z + 6],
            [-12, 26, DECK_Z + 6],
            [-12, 26, DECK_Z + 14],
            [-16, 26, DECK_Z + 14]
          )}
          fill="#064e3b"
          stroke="#10b981"
          strokeWidth="0.8"
        />
        <line
          x1={pt(-15.5, 26, DECK_Z + 10).x}
          y1={pt(-15.5, 26, DECK_Z + 10).y}
          x2={pt(-12.5, 26, DECK_Z + 10).x}
          y2={pt(-12.5, 26, DECK_Z + 10).y}
          stroke="#34d399"
          strokeWidth="0.9"
          className="animate-pulse"
        />

        {/* 屋顶信标天线杆 */}
        <line
          x1={pt(-11, 8, DECK_Z + 24.5).x}
          y1={pt(-11, 8, DECK_Z + 24.5).y}
          x2={pt(-11, 8, DECK_Z + 38).x}
          y2={pt(-11, 8, DECK_Z + 38).y}
          stroke="#334155"
          strokeWidth="1.2"
        />
        <circle cx={pt(-11, 8, DECK_Z + 38).x} cy={pt(-11, 8, DECK_Z + 38).y} r="1.3" fill="#38bdf8" />
      </g>

      {/* ========================================================================= */}
      {/* 7. GRAND PARABOLIC SETI DISH (大口径外星射电天线 · 核心精细化与透视修正)   */}
      {/*    位置位于后右半区 (u = 16, v = -14)，在 SVG 渲染树中先于前排护栏绘制     */}
      {/* ========================================================================= */}
      <g
        {...svgAction('捕获外星电波')}
        id="alien-receiver-assembly"
        onClick={(e) => {
          triggerAlienSignal(e);
        }}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setHoveredObject({ kind: 'entity', id: 'alien-receiver' });
        }}
        onMouseLeave={() => setHoveredObject(null)}
        className="group/dish cursor-pointer"
      >
        {(() => {
          const du = 16;
          const dv = -14;
          const dishCenter = pt(du, dv, DECK_Z + 27);
          return (
            <g id="dish-mechanics-and-reflector">
              {/* 天线底座阴影 */}
              <ellipse
                cx={pt(du, dv, DECK_Z + 0.2).x}
                cy={pt(du, dv, DECK_Z + 0.2).y}
                rx="15"
                ry="6"
                fill="#1a231d"
                opacity="0.45"
              />

              {/* 天线在甲板上的双层阶梯形旋转转台基座 */}
              <ellipse
                cx={pt(du, dv, DECK_Z + 1.2).x}
                cy={pt(du, dv, DECK_Z + 1.2).y}
                rx="14"
                ry="5.5"
                fill="#273229"
                stroke="#172019"
                strokeWidth="1"
              />
              <ellipse
                cx={pt(du, dv, DECK_Z + 4).x}
                cy={pt(du, dv, DECK_Z + 4).y}
                rx="11.5"
                ry="4.2"
                fill="#39473d"
                stroke="#202922"
                strokeWidth="0.9"
              />

              {/* 现代仰角俯仰双支撑臂 (工整刚健的机械支架) */}
              <polygon
                points={`
                  ${pt(du - 7, dv, DECK_Z + 4).x},${pt(du - 7, dv, DECK_Z + 4).y}
                  ${pt(du - 4, dv, DECK_Z + 19).x},${pt(du - 4, dv, DECK_Z + 19).y}
                  ${pt(du - 1, dv, DECK_Z + 19).x},${pt(du - 1, dv, DECK_Z + 19).y}
                  ${pt(du - 3, dv, DECK_Z + 4).x},${pt(du - 3, dv, DECK_Z + 4).y}
                `}
                fill="#2a362d"
                stroke="#18201a"
                strokeWidth="0.8"
              />
              <polygon
                points={`
                  ${pt(du + 3, dv, DECK_Z + 4).x},${pt(du + 3, dv, DECK_Z + 4).y}
                  ${pt(du + 1, dv, DECK_Z + 19).x},${pt(du + 1, dv, DECK_Z + 19).y}
                  ${pt(du + 4, dv, DECK_Z + 19).x},${pt(du + 4, dv, DECK_Z + 19).y}
                  ${pt(du + 7, dv, DECK_Z + 4).x},${pt(du + 7, dv, DECK_Z + 4).y}
                `}
                fill="#38463c"
                stroke="#18201a"
                strokeWidth="0.8"
              />
              {/* 俯仰机械转轴核心齿轮与法兰端盖 */}
              <circle cx={pt(du, dv, DECK_Z + 19).x} cy={pt(du, dv, DECK_Z + 19).y} r="3.4" fill="#202821" stroke="#48594d" strokeWidth="1" />
              <circle cx={pt(du, dv, DECK_Z + 19).x} cy={pt(du, dv, DECK_Z + 19).y} r="1.4" fill="#819785" />

              {/* 大口径射电抛物面天线主反射体 (指向深空右上天顶) */}
              <g transform={`translate(${dishCenter.x}, ${dishCenter.y})`}>
                {/* 1. 抛物面深色外壳与金属轮廓厚度 */}
                <ellipse rx="31.5" ry="19.5" transform="rotate(-18)" fill="#1e2c22" stroke="#121b15" strokeWidth="1.6" />

                {/* 2. 金属双层反光卷边 (Metallic Rim Lip) */}
                <ellipse rx="30" ry="18" transform="rotate(-18)" fill="#445749" stroke="#68806e" strokeWidth="0.8" />

                {/* 3. 迎光面铝白/银绿涂层主反射盘面 */}
                <ellipse rx="28.5" ry="16.8" transform="rotate(-18)" fill="#d6e3d7" stroke="#7e9682" strokeWidth="0.8" />

                {/* 4. 内部自然凹陷向心阴影层次 (逼真的抛物面锅体深度) */}
                <ellipse rx="24" ry="14" transform="rotate(-18)" fill="#b8ceba" opacity="0.88" />
                <ellipse rx="17" ry="9.8" transform="rotate(-18)" fill="#9bb39d" opacity="0.8" />
                <ellipse rx="10" ry="5.8" transform="rotate(-18)" fill="#7e9780" opacity="0.65" />

                {/* 5. 6 条向心强化极向肋构件与同心测距环 (精细而克制的科学仪器质感) */}
                <g transform="rotate(-18)" fill="none" stroke="#6b826f" strokeWidth="0.65" opacity="0.85">
                  <ellipse rx="19" ry="11" />
                  <ellipse rx="10" ry="5.8" />
                  {/* 主经纬线 */}
                  <line x1="-27" y1="0" x2="27" y2="0" />
                  <line x1="0" y1="-15.5" x2="0" y2="15.5" />
                  {/* 45度斜肋 */}
                  <line x1="-19" y1="-10.5" x2="19" y2="10.5" strokeDasharray="1.5,1" />
                  <line x1="-19" y1="10.5" x2="19" y2="-10.5" strokeDasharray="1.5,1" />
                </g>

                {/* 6. 前伸馈源三脚支撑杆 (Feed Horn Struts，带细致受光高光) */}
                <path
                  d="M -23,6 L 14,-29 M 23,-6 L 14,-29 M 4,14 L 14,-29"
                  fill="none"
                  stroke="#26382c"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <line x1="-22.5" y1="5.5" x2="14" y2="-29" stroke="#b0c5b3" strokeWidth="0.6" strokeLinecap="round" />

                {/* 7. 焦点次反射器与高灵敏度量子接收器 (Feed Horn Subreflector) */}
                <polygon points="9,-26 14,-33 19,-30 15,-23" fill="#293c2f" stroke="#16231a" strokeWidth="0.8" />
                <ellipse cx="14" cy="-30" rx="2.8" ry="1.9" fill="#10b981" stroke="#059669" strokeWidth="0.8" />
                <circle cx="14" cy="-30" r="1.1" fill="#e0fff0" className="animate-pulse" />
              </g>

              {/* 📡 宇宙外星电波共振脉冲波 (点击天线时触发扩展波纹) */}
              {alienPulseEffect && (
                <g transform={`translate(${dishCenter.x + 14}, ${dishCenter.y - 30})`}>
                  <circle cx="0" cy="0" r="18" fill="none" stroke="#34d399" strokeWidth="1.8" className="animate-ping pointer-events-none" />
                  <circle cx="0" cy="0" r="36" fill="none" stroke="#38bdf8" strokeWidth="1.6" className="animate-ping pointer-events-none" />
                  <circle cx="0" cy="0" r="54" fill="none" stroke="#a78bfa" strokeWidth="1.2" className="animate-ping pointer-events-none" />
                </g>
              )}
            </g>
          );
        })()}
      </g>

      {/* ========================================================================= */}
      {/* 8. TELEMETRY CONSOLE & FREQUENCY READOUT (中央射电监听台与纯净频段标识)  */}
      {/*    位置向后挪动至 v ∈ [6, 14]，彻底补齐左侧立面，留出前方的观测活动空间     */}
      {/* ========================================================================= */}
      <g id="observatory-telemetry-console">
        {/* 控制台位置: u ∈ [-5, 7], v ∈ [6, 14], z ∈ [DECK_Z, DECK_Z + 9] */}
        {/* 1. 台体左侧封闭立面 (u = -5) - 彻底闭合原有的三角形空洞 */}
        <polygon
          points={face(
            [-5, 14, DECK_Z],
            [-5, 6, DECK_Z],
            [-5, 6, DECK_Z + 11.5],
            [-5, 14, DECK_Z + 9]
          )}
          fill="#253027"
          stroke="#171f19"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* 2. 台体正面立面 (v = 14) */}
        <polygon
          points={face(
            [-5, 14, DECK_Z],
            [7, 14, DECK_Z],
            [7, 14, DECK_Z + 9],
            [-5, 14, DECK_Z + 9]
          )}
          fill="#2d3930"
          stroke="#171f19"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* 3. 台体右侧立面 (u = 7) */}
        <polygon
          points={face(
            [7, 14, DECK_Z],
            [7, 6, DECK_Z],
            [7, 6, DECK_Z + 11.5],
            [7, 14, DECK_Z + 9]
          )}
          fill="#1f2721"
          stroke="#171f19"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* 4. 倾斜操作面板顶面 (全封闭工整顶盖) */}
        <polygon
          points={face(
            [-5, 14, DECK_Z + 9],
            [7, 14, DECK_Z + 9],
            [7, 6, DECK_Z + 11.5],
            [-5, 6, DECK_Z + 11.5]
          )}
          fill="#37473b"
          stroke="#1b231c"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* 经典 CRT 示波器显示屏 (绿光波形实时呼吸) */}
        <polygon
          points={face(
            [-3.5, 14, DECK_Z + 2.8],
            [3.5, 14, DECK_Z + 2.8],
            [3.5, 14, DECK_Z + 7.6],
            [-3.5, 14, DECK_Z + 7.6]
          )}
          fill="#052112"
          stroke="#10b981"
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
        {/* 示波器正弦波形 */}
        <path
          d={`M ${pt(-2.8, 14, DECK_Z + 5.2).x},${pt(-2.8, 14, DECK_Z + 5.2).y} Q ${pt(-1.5, 14, DECK_Z + 6.8).x},${pt(-1.5, 14, DECK_Z + 6.8).y} ${pt(0, 14, DECK_Z + 5.2).x},${pt(0, 14, DECK_Z + 5.2).y} T ${pt(2.8, 14, DECK_Z + 5.2).x},${pt(2.8, 14, DECK_Z + 5.2).y}`}
          fill="none"
          stroke="#34d399"
          strokeWidth="1.1"
          strokeLinecap="round"
          className="animate-pulse"
        />

        {/* 精密旋钮与信号指示接口 */}
        <circle cx={pt(5.2, 14, DECK_Z + 6.8).x} cy={pt(5.2, 14, DECK_Z + 6.8).y} r="0.9" fill="#94a3b8" />
        <circle cx={pt(5.2, 14, DECK_Z + 4.2).x} cy={pt(5.2, 14, DECK_Z + 4.2).y} r="0.8" fill="#10b981" />

        {/* 优雅整洁的频段标牌 (完全内置固定在控制台斜面底座正前方) */}
        <g transform={`translate(${pt(1, 14, DECK_Z - 1.5).x}, ${pt(1, 14, DECK_Z - 1.5).y})`} className="pointer-events-none">
          <text
            x="0"
            y="0"
            fill="#34d399"
            fontSize="5.2"
            fontWeight="600"
            letterSpacing="0.4"
            textAnchor="middle"
            filter="drop-shadow(0 1px 2px rgba(0,0,0,0.85))"
          >
            1420.4 MHz · SETI
          </text>
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 9. SETI RESEARCHER / OBSERVATORY SPECIALIST (台面观测员动态席位)          */}
      {/*    当人物入驻时：自然站立于操作台前的防滑地垫上，空间宽裕自然            */}
      {/* ========================================================================= */}
      {(() => {
        const obsOccupant = presenceSlots.observatory_post?.occupant;
        const slotCfg = presenceSlots.observatory_post?.config;
        if (!obsOccupant || !slotCfg) return null;

        return (
          <g
            {...svgAction('查看人物状态')}
            id={`person-in-observatory-${obsOccupant.id}`}
            transform={`translate(${slotCfg.offset.dx}, ${slotCfg.offset.dy})`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPerson(obsOccupant);
            }}
            onMouseEnter={(e) => {
              e.stopPropagation();
              setHoveredObject({ kind: 'person', id: obsOccupant.id });
            }}
            onMouseLeave={() => setHoveredObject(null)}
            className="cursor-pointer group/char"
          >
            <StandingCharacter
              parentScale={characterParentScale}
              shirtColor={obsOccupant.shirtColor}
              skinColor={obsOccupant.skinColor || '#f5d6be'}
              hairColor={obsOccupant.hairColor || '#302319'}
              hairStyle={obsOccupant.hairStyle || 'curtain_crescent'}
              beanieColor={obsOccupant.beanieColor || '#1f3a2c'}
              hasPompom={obsOccupant.hasPompom ?? true}
              facing={slotCfg.facing}
            />
            <g transform={`scale(${CHARACTER_WORLD_SIZE.authoringScale / characterParentScale})`}>
            {/* 无线电通信耳罩式耳机与拾音麦克风 */}
            <g transform="translate(0,-34) scale(1.2727272727) translate(0,7)">
            <path d="M-6,-7 Q0,-13 6,-7" stroke="#1e293b" strokeWidth="1.8" fill="none" />
            <rect x="-7" y="-9" width="2.4" height="4.4" rx="1.2" fill="#34d399" />
            <rect x="4.6" y="-9" width="2.4" height="4.4" rx="1.2" fill="#34d399" />
            <path d="M-5,-5 Q-2,-2 1,-4" stroke="#1e293b" strokeWidth="0.9" fill="none" />
            </g>

            {/* 观测手板日志夹 */}
            <g transform="translate(-4.85,-17)">
            <polygon points="5,1 11,1 11,8 5,8" fill="#e2e8f0" stroke="#475569" strokeWidth="0.6" />
            <line x1="7" y1="3" x2="10" y2="3" stroke="#059669" strokeWidth="0.6" />
            <line x1="7" y1="5" x2="10" y2="5" stroke="#059669" strokeWidth="0.6" />
            </g>
            </g>

            {/* 纯净人物浮动名牌 */}
            <g transform={`translate(0,${-56 / characterParentScale})`} className="pointer-events-none">
              <rect x="-46" y="-7" width="92" height="15" rx="7.5" fill="#121a14" stroke="#10b981" strokeWidth="0.8" opacity="0.94" />
              <text x="0" y="3.5" fill="#d1fae5" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                📡 {obsOccupant.name} · {slotCfg.badgeLabel.split('(')[0].trim()}
              </text>
            </g>
          </g>
        );
      })()}

      {/* ========================================================================= */}
      {/* 10. FOREGROUND PERIMETER GUARDRAILS (前排护栏：位于观众最前端视平线)      */}
      {/*     最核心的遮挡修复：前右段护栏真实、正确地走在天线锅与基座的前侧外围    */}
      {/*     前左段护栏与梯口无缝闭合，彻底解决原先断开孤线的问题                  */}
      {/* ========================================================================= */}
      <g id="observatory-front-guardrail">
        {/* 前左侧护栏段：从梯口前侧立柱 v = LADDER_V2 顺畅闭合至前拐角 (-DU+1, DV-1) */}
        <line
          x1={pt(-DU + 1, LADDER_V2, DECK_Z + 9).x}
          y1={pt(-DU + 1, LADDER_V2, DECK_Z + 9).y}
          x2={pt(-DU + 1, DV - 1, DECK_Z + 9).x}
          y2={pt(-DU + 1, DV - 1, DECK_Z + 9).y}
          stroke="#3a483e"
          strokeWidth="2.0"
        />
        <line
          x1={pt(-DU + 1, LADDER_V2, DECK_Z + 4.5).x}
          y1={pt(-DU + 1, LADDER_V2, DECK_Z + 4.5).y}
          x2={pt(-DU + 1, DV - 1, DECK_Z + 4.5).x}
          y2={pt(-DU + 1, DV - 1, DECK_Z + 4.5).y}
          stroke="#2a352d"
          strokeWidth="1.2"
        />

        {/* 前左向整段前栏杆：从 (-DU+1, DV-1) 连续闭合至最前顶点 (DU-1, DV-1) */}
        <line
          x1={pt(-DU + 1, DV - 1, DECK_Z + 9).x}
          y1={pt(-DU + 1, DV - 1, DECK_Z + 9).y}
          x2={pt(DU - 1, DV - 1, DECK_Z + 9).x}
          y2={pt(DU - 1, DV - 1, DECK_Z + 9).y}
          stroke="#3a483e"
          strokeWidth="2.0"
        />
        <line
          x1={pt(-DU + 1, DV - 1, DECK_Z + 4.5).x}
          y1={pt(-DU + 1, DV - 1, DECK_Z + 4.5).y}
          x2={pt(DU - 1, DV - 1, DECK_Z + 4.5).x}
          y2={pt(DU - 1, DV - 1, DECK_Z + 4.5).y}
          stroke="#2a352d"
          strokeWidth="1.2"
        />

        {/* 前右向整段前栏杆：走在天线锅与转盘的最外侧！透视遮挡完全真实正交 */}
        <line
          x1={pt(DU - 1, -DV + 1, DECK_Z + 9).x}
          y1={pt(DU - 1, -DV + 1, DECK_Z + 9).y}
          x2={pt(DU - 1, DV - 1, DECK_Z + 9).x}
          y2={pt(DU - 1, DV - 1, DECK_Z + 9).y}
          stroke="#3a483e"
          strokeWidth="2.0"
        />
        <line
          x1={pt(DU - 1, -DV + 1, DECK_Z + 4.5).x}
          y1={pt(DU - 1, -DV + 1, DECK_Z + 4.5).y}
          x2={pt(DU - 1, DV - 1, DECK_Z + 4.5).x}
          y2={pt(DU - 1, DV - 1, DECK_Z + 4.5).y}
          stroke="#2a352d"
          strokeWidth="1.2"
        />

        {/* 前排各关键转折点立柱 (包含梯口端头柱、前左拐点柱、最前角柱、前右立柱) */}
        {[
          { u: -DU + 1, v: LADDER_V2 }, // 梯口前侧封闭端柱
          { u: -DU + 1, v: DV - 1 },    // 左侧外转角立柱
          { u: -10, v: DV - 1 },        // 前左跨中间立柱
          { u: 10, v: DV - 1 },         // 前左跨中间立柱
          { u: DU - 1, v: DV - 1 },     // 最前角立柱
          { u: DU - 1, v: 0 },          // 前右侧中间立柱 (位于天线锅前方)
          { u: DU - 1, v: -DV + 1 },    // 右侧外转角立柱
        ].map((sp, idx) => (
          <line
            key={`front-rail-post-${idx}`}
            x1={pt(sp.u, sp.v, DECK_Z).x}
            y1={pt(sp.u, sp.v, DECK_Z).y}
            x2={pt(sp.u, sp.v, DECK_Z + 9).x}
            y2={pt(sp.u, sp.v, DECK_Z + 9).y}
            stroke="#2e3b32"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* ========================================================================= */}
      {/* 11. HOVER TOOLTIP (观测台整体浮动说明)                                    */}
      {/* ========================================================================= */}
      <g
        transform="translate(0, 56)"
        className="opacity-0 group-hover/observatory:opacity-100 transition-opacity pointer-events-none"
      >
        <rect x="-76" y="-8.5" width="152" height="17" rx="8.5" fill="#131c15" stroke="#10b981" strokeWidth="0.9" opacity="0.95" />
        <text x="0" y="3.8" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
          📡 山巅外星电波监听站 · 点击捕获信号
        </text>
      </g>
    </>
  );
}

export const ObservatoryHaven = React.memo(ObservatoryHavenAsset);
