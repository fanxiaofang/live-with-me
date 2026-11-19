import React from 'react';
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
 * 2.5D 左侧墙面手作木工工具墙：
 *
 * 视觉重点：
 * 1. 移除多余杂物，纯净温馨；
 * 2. 采用柔和、圆润、呼吸感充足的治愈绘本风格。
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
  // 左墙 2.5D 轴测透视矩阵 (左墙斜率 k = -0.2852)
  const LEFT_SLOPE = -0.2852;
  const SHEAR_MATRIX = `matrix(1, ${LEFT_SLOPE}, 0, 1, 0, 0)`;

  // 坐标解算：支持 2.5D 布局校准器独立移动各部件 (若未自定义，采用默认相对位移)
  // 基准原点: (-124, 6)
  const toolWallX = layout['craft-tool-wall'].screen.x - (-124);
  const toolWallY = layout['craft-tool-wall'].screen.y - (6);


  return (
    <>
      <g id="left-wall-craft-board" transform={`translate(-124, 6) ${SHEAR_MATRIX}`}>
        {/* ========================================================================= */}
        {/* 1. 木柄、旧黄铜与磨砂钢工具；用局部分面区分材质，保持小尺寸清晰。 */}
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
              fill="#a06b38"
              stroke="#59391f"
              strokeWidth="0.35"
            />
            <path d="M3.25,6 L3.25,19.8" stroke="#d0a064" strokeWidth="0.45" strokeLinecap="round" />
            <rect
              x="0.5"
              y="2.4"
              width="6.8"
              height="3.2"
              rx="1.2"
              fill="#737e71"
              stroke="#39423d"
              strokeWidth="0.35"
            />
            <path d="M1.3,2.85 H6.4" stroke="#c3c9b6" strokeWidth="0.45" strokeLinecap="round" />
            <path d="M1.3,5.05 H6.4" stroke="#4b544c" strokeWidth="0.45" strokeLinecap="round" />
          </g>

          {/* --- 工具 2: 黄铜三角尺 --- */}
          <g id="cute-triangle-ruler" transform="translate(13, 5)">
            <circle cx="2" cy="1.8" r="0.7" fill="#785126" />
            <polygon
              points="0.8,1.5 9.5,1.5 0.8,19"
              fill="#c99a3d"
              stroke="#705125"
              strokeWidth="0.35"
            />
            <path d="M1.35,2.05 H8.55" stroke="#edc974" strokeWidth="0.45" />
            <polygon
              points="2.2,4.5 6.5,4.5 2.2,13"
              fill="#d8c1a3"
              stroke="#82612e"
              strokeWidth="0.3"
            />
            {[4, 6.5, 9, 11.5, 14, 16.5].map((my) => (
              <line key={`tick-${my}`} x1="0.8" y1={my} x2="1.8" y2={my} stroke="#654b29" strokeWidth="0.35" />
            ))}
          </g>

          {/* --- 工具 3: 螺丝刀 --- */}
          <g id="cute-screwdriver" transform="translate(22, 5)">
            <circle cx="2" cy="2.5" r="0.7" fill="#8c5828" />
            <path
              d="M 1,2.8 C 1,1.8 3,1.8 3,2.8 L 3.2,9.5 C 3.2,10.6 0.8,10.6 0.8,9.5 Z"
              fill="#ad6539"
              stroke="#61341f"
              strokeWidth="0.35"
            />
            <path d="M1.5,3.2 Q1.25,6 1.6,8.7" fill="none" stroke="#d99a59" strokeWidth="0.4" strokeLinecap="round" />
            <rect x="1.5" y="10.2" width="1" height="10" rx="0.3" fill="#a6ac9e" stroke="#4c574f" strokeWidth="0.25" />
            <rect x="1.15" y="9.8" width="1.7" height="0.85" rx="0.2" fill="#bd984c" stroke="#70532b" strokeWidth="0.2" />
            <rect x="1.3" y="20.2" width="1.4" height="1.4" rx="0.2" fill="#505a52" />
          </g>

          {/* --- 工具 4: 剪刀 --- */}
          <g id="cute-scissors" transform="translate(29, 6)">
            <circle cx="3.2" cy="2" r="0.7" fill="#8c5828" />
            <ellipse cx="0.8" cy="3" rx="2.2" ry="2.6" fill="#45664e" stroke="#293b30" strokeWidth="0.35" />
            <ellipse cx="0.8" cy="3" rx="1.2" ry="1.6" fill="#d8c1a3" />
            <circle cx="3.5" cy="2.2" r="2" fill="#45664e" stroke="#293b30" strokeWidth="0.35" />
            <circle cx="3.5" cy="2.2" r="1.1" fill="#d8c1a3" />
            <circle cx="2" cy="7.5" r="0.7" fill="#c89f4e" stroke="#70532b" strokeWidth="0.2" />
            <polygon points="1.4,8 2.2,8 2.3,19 1.5,17.5" fill="#cdd0bf" stroke="#526056" strokeWidth="0.25" />
            <polygon points="2.2,8 2.8,8 2.3,19 2.2,19" fill="#879584" stroke="#46534b" strokeWidth="0.25" />
          </g>

          {/* --- 工具 5: 电烙铁 --- */}
          <g id="cute-soldering-iron" transform="translate(37, 5)">
            <circle cx="2" cy="2" r="0.7" fill="#8c5828" />
            <path
              d="M 2,1.8 C 1.2,-0.5 4,-0.8 3.8,2.2 C 3.6,4.5 2.8,6.5 3.5,8.8"
              fill="none"
              stroke="#3f443b"
              strokeWidth="0.65"
              strokeLinecap="round"
            />
            <rect x="1" y="2.8" width="2" height="8.5" rx="0.8" fill="#347c55" stroke="#254638" strokeWidth="0.35" />
            <path d="M1.55,3.7 V8.4" stroke="#83ad73" strokeWidth="0.4" strokeLinecap="round" />
            <rect x="0.6" y="9.2" width="2.8" height="1.1" rx="0.4" fill="#293f33" />
            <rect x="1.4" y="11" width="1.2" height="6.5" rx="0.2" fill="#b6baa6" stroke="#606b5e" strokeWidth="0.2" />
            <polygon points="1.4,17.5 2.6,17.5 2,21.5" fill="#bd8048" stroke="#70472e" strokeWidth="0.2" />
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

      </g>

    </>
  );
};
