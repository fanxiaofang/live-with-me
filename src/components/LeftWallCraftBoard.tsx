import React, { useState } from 'react';
import { useTimerScope } from '../shared/timers/useTimerScope';
import type { InteractionTarget } from '../world/interactions/interactionTypes';
import { svgAction } from '../world/interactions/svgAction';
import { EditableObjectId, IsoGizmo, RoomLayoutConfig } from './layout-gizmo';
import { DEFAULT_ROOM_LAYOUT } from './layout-gizmo/layoutStore';

interface LeftWallCraftBoardProps {
  onHover?: (target: InteractionTarget | null) => void;
  selfPerson?: { name?: string; shirtColor?: string; beanieColor?: string };
  linPerson?: { name?: string; shirtColor?: string; beanieColor?: string };
  yuPerson?: { name?: string; shirtColor?: string; beanieColor?: string };
  layout?: RoomLayoutConfig;
  effectiveGizmoId?: EditableObjectId | null;
  isInspectorOpen?: boolean;
  onSelectGizmo?: (id: EditableObjectId | null) => void;
  onDragGizmoDelta?: (dx: number, dy: number) => void;
  onDragGizmoEnd?: () => void;
}

/**
 * 2.5D 左侧墙面手作木工工具墙 & 陶艺小风铃：
 *
 * 视觉重点：
 * 1. 移除多余杂物，纯净温馨；
 * 2. 陶艺微鸣风铃精致、立体、小巧可爱；
 * 3. 采用柔和、圆润、呼吸感充足的治愈绘本风格。
 */
export const LeftWallCraftBoard: React.FC<LeftWallCraftBoardProps> = ({
  onHover,
  layout = DEFAULT_ROOM_LAYOUT,
  effectiveGizmoId,
  isInspectorOpen = false,
  onSelectGizmo,
  onDragGizmoDelta,
  onDragGizmoEnd,
}) => {
  const timers = useTimerScope();
  const [chimeRinging, setChimeRinging] = useState(false);

  const handleChimeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInspectorOpen) {
      onSelectGizmo?.(effectiveGizmoId === 'craft-wind-chime' ? null : 'craft-wind-chime');
      return;
    }
    setChimeRinging(true);
    timers.schedule('feedback-0', () => setChimeRinging(false), 1200);
  };

  // 左墙 2.5D 轴测透视矩阵 (左墙斜率 k = -0.2852)
  const LEFT_SLOPE = -0.2852;
  const SHEAR_MATRIX = `matrix(1, ${LEFT_SLOPE}, 0, 1, 0, 0)`;

  // 坐标解算：支持 2.5D 布局校准器独立移动各部件 (若未自定义，采用默认相对位移)
  // 基准原点: (-124, 6)
  const toolWallX = layout['craft-tool-wall'].screen.x - (-124);
  const toolWallY = layout['craft-tool-wall'].screen.y - (6);

  const windChimeX = layout['craft-wind-chime'].screen.x - (-124);
  const windChimeY = layout['craft-wind-chime'].screen.y - (6);

  return (
    <>
      <g id="left-wall-craft-board" transform={`translate(-124, 6) ${SHEAR_MATRIX}`}>
        {/* ========================================================================= */}
        {/* 1. 极简扁平绘本风手作工具洞洞板 (5 样圆润小工具，无生硬高光)                 */}
        {/* ========================================================================= */}
        <g {...svgAction('craft-tool-wall')}
          id="craft-tool-wall"
          transform={`translate(${toolWallX}, ${toolWallY})`}
          onClick={(e) => {
            if (isInspectorOpen) {
              e.stopPropagation();
              onSelectGizmo?.(effectiveGizmoId === 'craft-tool-wall' ? null : 'craft-tool-wall');
            }
          }}
          onMouseEnter={() => onHover?.({ kind: 'furniture-part', id: 'craft-tool-wall' })}
          onMouseLeave={() => onHover?.(null)}
          className="cursor-pointer group/toolwall"
        >
          {/* 扁平微柔和投影 */}
          <rect x="1.5" y="1.5" width="44" height="32" rx="2.5" fill="#291a10" opacity="0.16" />

          {/* 极简扁平暖木洞洞板本体 (柔和暖沙色，无写实渐变) */}
          <rect
            x="0"
            y="0"
            width="44"
            height="32"
            rx="2.5"
            fill="#d8c1a3"
            stroke="#805631"
            strokeWidth="0.75"
          />
          {/* 内饰简洁装饰细框 */}
          <rect
            x="1"
            y="1"
            width="42"
            height="30"
            rx="1.8"
            fill="none"
            stroke="#f5ebe0"
            strokeWidth="0.5"
            opacity="0.9"
          />

          {/* 四角极简木色小圆钉 (扁平小圆，告别工业金属) */}
          {[
            { cx: 3, cy: 3 },
            { cx: 41, cy: 3 },
            { cx: 3, cy: 29 },
            { cx: 41, cy: 29 },
          ].map((pt, idx) => (
            <circle key={`screw-${idx}`} cx={pt.cx} cy={pt.cy} r="0.8" fill="#6d4420" />
          ))}

          {/* 规则简约洞洞阵列 (扁平深棕小点) */}
          {[8, 14, 20, 26, 32, 38].map((gx) =>
            [7, 13, 19, 25].map((gy) => (
              <circle key={`hole-${gx}-${gy}`} cx={gx} cy={gy} r="0.7" fill="#593b21" opacity="0.4" />
            ))
          )}

          {/* --- 工具 1: 小锤子 --- */}
          <g id="cute-hammer" transform="translate(5, 5)">
            <circle cx="2" cy="3" r="0.7" fill="#8c5828" />
            <circle cx="5.5" cy="3" r="0.7" fill="#8c5828" />
            <path
              d="M 2.8,4 L 2.8,20 C 2.8,21.5 4.6,21.5 4.6,20 L 4.6,4 Z"
              fill="#b67f4c"
              stroke="#683e18"
              strokeWidth="0.35"
            />
            <rect
              x="0.5"
              y="2.4"
              width="6.8"
              height="3.2"
              rx="1.2"
              fill="#7a8d9f"
              stroke="#384957"
              strokeWidth="0.35"
            />
          </g>

          {/* --- 工具 2: 黄铜三角尺 --- */}
          <g id="cute-triangle-ruler" transform="translate(13, 5)">
            <circle cx="2" cy="1.8" r="0.7" fill="#b45309" />
            <polygon
              points="0.8,1.5 9.5,1.5 0.8,19"
              fill="#f59e0b"
              stroke="#92400e"
              strokeWidth="0.35"
            />
            <polygon
              points="2.2,4.5 6.5,4.5 2.2,13"
              fill="#d8c1a3"
              stroke="#92400e"
              strokeWidth="0.3"
            />
            {[4, 6.5, 9, 11.5, 14, 16.5].map((my) => (
              <line key={`tick-${my}`} x1="0.8" y1={my} x2="1.8" y2={my} stroke="#78350f" strokeWidth="0.35" />
            ))}
          </g>

          {/* --- 工具 3: 螺丝刀 --- */}
          <g id="cute-screwdriver" transform="translate(22, 5)">
            <circle cx="2" cy="2.5" r="0.7" fill="#8c5828" />
            <path
              d="M 1,2.8 C 1,1.8 3,1.8 3,2.8 L 3.2,9.5 C 3.2,10.6 0.8,10.6 0.8,9.5 Z"
              fill="#fbbf24"
              stroke="#92400e"
              strokeWidth="0.35"
            />
            <line x1="2" y1="3" x2="2" y2="9.2" stroke="#fef3c7" strokeWidth="0.4" />
            <rect x="1.5" y="10.2" width="1" height="10" rx="0.3" fill="#94a3b8" stroke="#475569" strokeWidth="0.25" />
            <rect x="1.3" y="20.2" width="1.4" height="1.4" rx="0.2" fill="#475569" />
          </g>

          {/* --- 工具 4: 剪刀 --- */}
          <g id="cute-scissors" transform="translate(29, 6)">
            <circle cx="3.2" cy="2" r="0.7" fill="#8c5828" />
            <ellipse cx="0.8" cy="3" rx="2.2" ry="2.6" fill="#334155" stroke="#1e293b" strokeWidth="0.35" />
            <ellipse cx="0.8" cy="3" rx="1.2" ry="1.6" fill="#d8c1a3" />
            <circle cx="3.5" cy="2.2" r="2" fill="#334155" stroke="#1e293b" strokeWidth="0.35" />
            <circle cx="3.5" cy="2.2" r="1.1" fill="#d8c1a3" />
            <circle cx="2" cy="7.5" r="0.7" fill="#f59e0b" stroke="#78350f" strokeWidth="0.2" />
            <polygon points="1.4,8 2.2,8 2.3,19 1.5,17.5" fill="#cbd5e1" stroke="#475569" strokeWidth="0.25" />
            <polygon points="2.2,8 2.8,8 2.3,19 2.2,19" fill="#94a3b8" stroke="#475569" strokeWidth="0.25" />
          </g>

          {/* --- 工具 5: 电烙铁 --- */}
          <g id="cute-soldering-iron" transform="translate(37, 5)">
            <circle cx="2" cy="2" r="0.7" fill="#8c5828" />
            <path
              d="M 2,1.8 C 1.2,-0.5 4,-0.8 3.8,2.2 C 3.6,4.5 2.8,6.5 3.5,8.8"
              fill="none"
              stroke="#334155"
              strokeWidth="0.65"
              strokeLinecap="round"
            />
            <rect x="1" y="2.8" width="2" height="8.5" rx="0.8" fill="#38bdf8" stroke="#0284c7" strokeWidth="0.35" />
            <rect x="0.6" y="9.2" width="2.8" height="1.1" rx="0.4" fill="#0369a1" />
            <rect x="1.4" y="11" width="1.2" height="6.5" rx="0.2" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.2" />
            <polygon points="1.4,17.5 2.6,17.5 2,21.5" fill="#f59e0b" stroke="#92400e" strokeWidth="0.2" />
          </g>

          {/* 极简悬停微框 */}
          <rect
            x="0"
            y="0"
            width="44"
            height="32"
            rx="2.5"
            fill="none"
            stroke="#fbbf24"
            strokeWidth={effectiveGizmoId === 'craft-tool-wall' ? '1.2' : '0.6'}
            className={`${effectiveGizmoId === 'craft-tool-wall' ? 'opacity-100' : 'opacity-0 group-hover/toolwall:opacity-100'} transition-opacity duration-200`}
          />

          {/* 2.5D 轴测校准把手 */}
          {effectiveGizmoId === 'craft-tool-wall' && (
            <IsoGizmo
              pos={{ x: 22, y: 16 }}
              displayCoords={layout['craft-tool-wall'].screen}
              fixedW={0}
              label="工具洞洞板"
              onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
              onDragEnd={() => onDragGizmoEnd?.()}
            />
          )}
        </g>

        {/* ========================================================================= */}
        {/* 2. 经典雅致风铃 (呼应台灯墨绿透光玻璃 + 摩卡壶银白质感 + 复古黄铜)          */}
        {/* ========================================================================= */}
        <g {...svgAction('craft-wind-chime')}
          id="craft-wind-chime"
          transform={`translate(${windChimeX}, ${windChimeY})`}
          onClick={handleChimeClick}
          onMouseEnter={() => onHover?.({ kind: 'furniture-part', id: 'craft-wind-chime' })}
          onMouseLeave={() => onHover?.(null)}
          className="cursor-pointer group/chime"
        >
          <defs>
            {/* 1. 台灯同款翡翠墨绿玻璃渐变 */}
            <linearGradient id="chimeEmeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1f7a43" />
              <stop offset="50%" stopColor="#166534" />
              <stop offset="100%" stopColor="#0f4624" />
            </linearGradient>

            {/* 2. 摩卡壶同款温润银白铝瓷渐变 */}
            <linearGradient id="chimeWhiteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="55%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            {/* 3. 黄铜金属色渐变 (呼应台灯铜杆与摩卡壶安全阀) */}
            <linearGradient id="chimeBrassGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="50%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          <title>琉璃与黄铜双音风铃 🎐 (点击微风轻响)</title>

          {/* 稳固透明交互热区 */}
          <rect x="-1" y="-3" width="22" height="30" fill="transparent" />

          {/* 1. 墙面黄铜挂钉 (同色系极细边缘，告别粗糙黑描边) */}
          <ellipse cx="10" cy="-0.6" rx="1.2" ry="0.9" fill="url(#chimeBrassGrad)" stroke="#92400e" strokeWidth="0.2" />
          <circle cx="9.7" cy="-0.9" r="0.35" fill="#fef08a" opacity="0.9" />

          {/* 2. 纤细黄铜吊链 */}
          <line x1="10" y1="-0.6" x2="10" y2="3.2" stroke="#b45309" strokeWidth="0.45" strokeLinecap="round" />

          {/* 3. 随风轻晃的风铃主体 */}
          <g
            className={`transition-transform duration-300 ${
              chimeRinging
                ? 'animate-[wiggle_0.4s_ease-in-out_3]'
                : 'group-hover/chime:rotate-2'
            }`}
            style={{ transformOrigin: '10px 3.2px' }}
          >
            {/* 顶端黄铜小横架与连环 */}
            <circle cx="10" cy="3.5" r="0.9" fill="url(#chimeBrassGrad)" stroke="#92400e" strokeWidth="0.2" />
            <path
              d="M 6.8,4.8 Q 10,4.0 13.2,4.8"
              fill="none"
              stroke="#b45309"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
            <circle cx="6.8" cy="4.8" r="0.5" fill="#d97706" />
            <circle cx="13.2" cy="4.8" r="0.5" fill="#d97706" />

            {/* =================================================================== */}
            {/* 左铃：台灯经典墨绿透光玻璃铃 (Banker's Lamp Emerald Glass Bell)     */}
            {/* =================================================================== */}
            <line x1="6.8" y1="5.1" x2="6.8" y2="8.2" stroke="#b45309" strokeWidth="0.35" />

            <g transform="translate(6.8, 8.2)">
              {/* 墨绿玻璃铃体：采用同色系极细软边 (#14532d 0.25px)，无生硬黑框 */}
              <path
                d="M -3.2,5.2 C -3.4,1.8 -2.4,-1.6 0,-1.6 C 2.4,-1.6 3.4,1.8 3.2,5.2 C 2.2,5.7 -2.2,5.7 -3.2,5.2 Z"
                fill="url(#chimeEmeraldGrad)"
                stroke="#14532d"
                strokeWidth="0.25"
              />

              {/* 台灯同款玻璃透光微晕 (Soft Emerald Glow) */}
              <ellipse
                cx="-0.4"
                cy="1.2"
                rx="2.0"
                ry="1.2"
                fill="#4ade80"
                opacity="0.35"
              />

              {/* 铃口底部收边黄铜圈 */}
              <ellipse cx="0" cy="5.2" rx="3.2" ry="0.85" fill="url(#chimeBrassGrad)" stroke="#92400e" strokeWidth="0.2" />
              <ellipse cx="0" cy="5.2" rx="2.6" ry="0.6" fill="#0d3b1e" />

              {/* 内悬黄铜小撞珠 */}
              <line x1="0" y1="5.2" x2="0" y2="6.8" stroke="#b45309" strokeWidth="0.3" />
              <circle cx="0" cy="6.8" r="0.75" fill="url(#chimeBrassGrad)" stroke="#92400e" strokeWidth="0.15" />

              {/* 下垂清透白和纸风签 (带墨绿底纹) */}
              <line x1="0" y1="7.4" x2="0" y2="9.0" stroke="#b45309" strokeWidth="0.3" />
              <g transform="translate(0, 9.0)">
                <rect
                  x="-1.3"
                  y="0"
                  width="2.6"
                  height="6.2"
                  rx="0.4"
                  fill="#f8fafc"
                  stroke="#cbd5e1"
                  strokeWidth="0.2"
                />
                <rect x="-1.3" y="4.8" width="2.6" height="1.0" rx="0.2" fill="#166534" />
                <circle cx="0" cy="2.5" r="0.3" fill="#d97706" />
              </g>
            </g>

            {/* =================================================================== */}
            {/* 右铃：摩卡壶同款银白温润铃 (Moka Pot Silvery-White Bell, 微错落高度) */}
            {/* =================================================================== */}
            <line x1="13.2" y1="5.1" x2="13.2" y2="9.8" stroke="#b45309" strokeWidth="0.35" />

            <g transform="translate(13.2, 9.8)">
              {/* 银白金属/瓷质铃身：采用极细浅灰软边 (#64748b 0.25px)，高雅纯净 */}
              <path
                d="M -3.0,4.8 C -3.2,1.6 -2.2,-1.4 0,-1.4 C 2.2,-1.4 3.2,1.6 3.0,4.8 C 2.0,5.3 -2.0,5.3 -3.0,4.8 Z"
                fill="url(#chimeWhiteGrad)"
                stroke="#64748b"
                strokeWidth="0.25"
              />

              {/* 极简高光切线 (呼应摩卡壶切角光泽) */}
              <path
                d="M -0.8,-0.4 C -0.8,1.2 -1.0,3.2 -1.4,4.2"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.4"
                opacity="0.85"
              />

              {/* 铃口底部收边黄铜圈 */}
              <ellipse cx="0" cy="4.8" rx="3.0" ry="0.8" fill="url(#chimeBrassGrad)" stroke="#92400e" strokeWidth="0.2" />
              <ellipse cx="0" cy="4.8" rx="2.4" ry="0.55" fill="#475569" />

              {/* 内悬黄铜小撞珠 */}
              <line x1="0" y1="4.8" x2="0" y2="6.4" stroke="#b45309" strokeWidth="0.3" />
              <circle cx="0" cy="6.4" r="0.75" fill="url(#chimeBrassGrad)" stroke="#92400e" strokeWidth="0.15" />

              {/* 下垂清透白和纸风签 (带暖黄底纹) */}
              <line x1="0" y1="7.0" x2="0" y2="8.6" stroke="#b45309" strokeWidth="0.3" />
              <g transform="translate(0, 8.6)">
                <rect
                  x="-1.3"
                  y="0"
                  width="2.6"
                  height="6.2"
                  rx="0.4"
                  fill="#f8fafc"
                  stroke="#cbd5e1"
                  strokeWidth="0.2"
                />
                <rect x="-1.3" y="4.8" width="2.6" height="1.0" rx="0.2" fill="#d97706" />
                <circle cx="0" cy="2.5" r="0.3" fill="#166534" />
              </g>
            </g>
          </g>

          {/* 点击微风叮咚音符 (优雅黄铜与暖金色) */}
          {chimeRinging && (
            <g transform="translate(15, 7)">
              <text x="0" y="0" fill="#d97706" fontSize="4.4" fontWeight="bold" opacity="0.95">
                ♪
              </text>
              <text x="3.2" y="-4.0" fill="#f59e0b" fontSize="3.5" fontWeight="bold" opacity="0.85">
                ♬
              </text>
            </g>
          )}

          {/* 2.5D 轴测校准把手 */}
          {effectiveGizmoId === 'craft-wind-chime' && (
            <IsoGizmo
              pos={{ x: 10, y: 12 }}
              displayCoords={layout['craft-wind-chime'].screen}
              fixedW={0}
              label="陶艺风铃"
              onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
              onDragEnd={() => onDragGizmoEnd?.()}
            />
          )}
        </g>


      </g>

    </>
  );
};
