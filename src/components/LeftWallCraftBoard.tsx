import { DEFAULT_ROOM_LAYOUT } from './layout-gizmo/layoutStore';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Heart, Users, Sparkles } from 'lucide-react';
import { RoomLayoutConfig, EditableObjectId, IsoGizmo } from './layout-gizmo';

interface LeftWallCraftBoardProps {
  onHover?: (label: string | null) => void;
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
 * 2.5D 左侧墙面手作木工工具墙 & 三人萌感背影相框 & 陶艺风铃：
 * 
 * 视觉重构重点：
 * 1. 彻底移除拟真高光、拟物木纹渐变与玻璃反光等写实杂质；
 * 2. 采用柔和、圆润、呼吸感充足的极简扁平化 UI / 绘本风格；
 * 3. 统一护航人物形象（三人合照）：
 *    - 极致圆润的“水滴团子/豆豆人”无性别萌系体态；
 *    - 图 1 标志性饱满圆球毛线帽、蓬松顶球、精细工整虚线缝线、圆弧翻折罗纹帽檐、微露月牙后颈；
 *    - 纯平色彩层次，与整体小世界温馨治愈的木屋美学完全同频；
 * 4. 交互相册模组支持点击唤出柔和圆润的极简扁平化大弹窗，赏析高清晰度三人萌态。
 */
export const LeftWallCraftBoard: React.FC<LeftWallCraftBoardProps> = ({
  onHover,
  selfPerson,
  linPerson,
  yuPerson,
  layout = DEFAULT_ROOM_LAYOUT,
  effectiveGizmoId,
  isInspectorOpen = false,
  onSelectGizmo,
  onDragGizmoDelta,
  onDragGizmoEnd,
}) => {
  const [chimeRinging, setChimeRinging] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);

  const handleChimeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInspectorOpen) {
      onSelectGizmo?.(effectiveGizmoId === 'craft-wind-chime' ? null : 'craft-wind-chime');
      return;
    }
    setChimeRinging(true);
    setTimeout(() => setChimeRinging(false), 1200);
  };

  const handlePhotoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInspectorOpen) {
      onSelectGizmo?.(effectiveGizmoId === 'left-wall-photos' ? null : 'left-wall-photos');
      return;
    }
    setPhotoOpen(true);
  };

  // 左墙 2.5D 轴测透视矩阵 (左墙斜率 k = -0.2852)
  const LEFT_SLOPE = -0.2852;
  const SHEAR_MATRIX = `matrix(1, ${LEFT_SLOPE}, 0, 1, 0, 0)`;

  // 三人统一无性别萌系治愈色彩（极简扁平基调）
  const selfShirt = selfPerson?.shirtColor || '#527899';
  const selfBeanie = selfPerson?.beanieColor || '#3d5e7a';
  const linShirt = linPerson?.shirtColor || '#dd7a38';
  const linBeanie = linPerson?.beanieColor || '#e58364';
  const yuShirt = yuPerson?.shirtColor || '#4d7853';
  const yuBeanie = yuPerson?.beanieColor || '#365c3b';

  // 坐标解算：支持 2.5D 布局校准器独立移动各部件 (若未自定义，采用默认相对位移)
  // 基准原点: (-124, 6)
  const toolWallX = layout['craft-tool-wall'].screen.x - (-124);
  const toolWallY = layout['craft-tool-wall'].screen.y - (6);

  const windChimeX = layout['craft-wind-chime'].screen.x - (-124);
  const windChimeY = layout['craft-wind-chime'].screen.y - (6);

  const photosX = layout['left-wall-photos'].screen.x - (-124);
  const photosY = layout['left-wall-photos'].screen.y - (6);

  return (
    <>
      <g id="left-wall-craft-board" transform={`translate(-124, 6) ${SHEAR_MATRIX}`}>
        {/* ========================================================================= */}
        {/* 1. 极简扁平绘本风手作工具洞洞板 (5 样圆润小工具，无生硬高光)                 */}
        {/* ========================================================================= */}
        <g
          id="craft-tool-wall"
          transform={`translate(${toolWallX}, ${toolWallY})`}
          onClick={(e) => {
            if (isInspectorOpen) {
              e.stopPropagation();
              onSelectGizmo?.(effectiveGizmoId === 'craft-tool-wall' ? null : 'craft-tool-wall');
            }
          }}
          onMouseEnter={() => onHover?.('手作工具墙 (小锤子 · 黄铜三角尺 · 螺丝刀 · 剪刀 · 电烙铁)')}
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
        {/* 2. 陶艺三色风铃挂饰 (纯平柔和质感)                                         */}
        {/* ========================================================================= */}
        <g
          id="craft-wind-chime"
          transform={`translate(${windChimeX}, ${windChimeY})`}
          onClick={handleChimeClick}
          onMouseEnter={() => onHover?.('手作陶艺风铃 (点击轻摇微鸣)')}
          onMouseLeave={() => onHover?.(null)}
          className="cursor-pointer group/chime"
        >
          <circle cx="10" cy="-2" r="1.1" fill="#784b24" stroke="#3b1d07" strokeWidth="0.3" />
          <line x1="10" y1="-2" x2="10" y2="2" stroke="#785536" strokeWidth="0.6" />

          <g
            className={`origin-top transition-transform ${
              chimeRinging
                ? 'animate-[wiggle_0.4s_ease-in-out_3]'
                : 'group-hover/chime:rotate-3 duration-300'
            }`}
            style={{ transformOrigin: '10px 4px' }}
          >
            {/* 顶端木珠 */}
            <circle cx="10" cy="4.5" r="3.2" fill="#804a25" stroke="#381c0b" strokeWidth="0.4" />

            {/* 中间青绿绳 + 黄陶珠 */}
            <line x1="10" y1="7.7" x2="10" y2="27.5" stroke="#49784f" strokeWidth="1.1" strokeLinecap="round" />
            <circle cx="10" cy="30" r="3.1" fill="#eab308" stroke="#854d0e" strokeWidth="0.35" />

            {/* 左侧紫陶铃 */}
            <line x1="8.2" y1="6.8" x2="4.5" y2="13.2" stroke="#6d482a" strokeWidth="0.8" strokeLinecap="round" />
            <circle cx="4.5" cy="13.2" r="1.7" fill="#4d5f29" stroke="#1a250a" strokeWidth="0.3" />
            <line x1="4.5" y1="14.9" x2="3.2" y2="24.5" stroke="#6d482a" strokeWidth="0.75" strokeLinecap="round" />
            <g transform="translate(3.2, 27.5)">
              <path
                d="M-2.5,-3 C-2.5,-4.8 2.5,-4.8 2.5,-3 C2.8,-0.5 3.5,2 3.2,3.2 C1.8,3.7 -1.8,3.7 -3.2,3.2 C-3.5,2 -2.8,-0.5 -2.5,-3 Z"
                fill="#9d64a4"
                stroke="#582a5c"
                strokeWidth="0.35"
              />
            </g>

            {/* 右侧珊瑚粉陶铃 */}
            <line x1="11.8" y1="6.8" x2="15.5" y2="13.2" stroke="#6d482a" strokeWidth="0.8" strokeLinecap="round" />
            <circle cx="15.5" cy="13.2" r="1.7" fill="#4d5f29" stroke="#1a250a" strokeWidth="0.3" />
            <line x1="15.5" y1="14.9" x2="16.8" y2="24.5" stroke="#6d482a" strokeWidth="0.75" strokeLinecap="round" />
            <g transform="translate(16.8, 27.5)">
              <path
                d="M-2.5,-3 C-2.5,-4.8 2.5,-4.8 2.5,-3 C2.8,-0.5 3.5,2 3.2,3.2 C1.8,3.7 -1.8,3.7 -3.2,3.2 C-3.5,2 -2.8,-0.5 -2.5,-3 Z"
                fill="#ea580c"
                stroke="#881326"
                strokeWidth="0.35"
              />
            </g>
          </g>

          {chimeRinging && (
            <g transform="translate(14, 16)">
              <text x="0" y="0" fill="#f59e0b" fontSize="4.8" fontWeight="bold" opacity="0.9">
                ♪
              </text>
              <text x="3.5" y="-5" fill="#fbbf24" fontSize="3.8" fontWeight="bold" opacity="0.8">
                ♬
              </text>
            </g>
          )}

          {/* 2.5D 轴测校准把手 */}
          {effectiveGizmoId === 'craft-wind-chime' && (
            <IsoGizmo
              pos={{ x: 10, y: 15 }}
              displayCoords={layout['craft-wind-chime'].screen}
              fixedW={0}
              label="陶艺风铃"
              onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
              onDragEnd={() => onDragGizmoEnd?.()}
            />
          )}
        </g>

        {/* ========================================================================= */}
        {/* 3. 墙面三人合照相框模组 (柔和圆润、极简扁平化、无拟真杂质)                  */}
        {/* ========================================================================= */}
        <g
          id="craft-trio-photo"
          transform={`translate(${photosX}, ${photosY})`}
          onClick={handlePhotoClick}
          onMouseEnter={() => onHover?.('三人合照小相框 (点击开启相册大图)')}
          onMouseLeave={() => onHover?.(null)}
          className="cursor-pointer group/photo"
        >
          {/* 纯平悬挂细麻绳与扁平木钉 */}
          <circle cx="16" cy="-4" r="0.9" fill="#92400e" />
          <line x1="16" y1="-4" x2="4" y2="1" stroke="#9a7b56" strokeWidth="0.5" />
          <line x1="16" y1="-4" x2="28" y2="1" stroke="#9a7b56" strokeWidth="0.5" />

          {/* 极简柔和微投影 */}
          <rect x="1.5" y="2.2" width="29" height="34" rx="2" fill="#291a10" opacity="0.18" />

          {/* 极简扁平温润木框 (宽 29, 高 34, 柔和圆角) */}
          <rect
            x="0"
            y="1"
            width="29"
            height="34"
            rx="2"
            fill="#78502d"
            stroke="#4a2c14"
            strokeWidth="0.6"
          />

          {/* 极简象牙白扁平卡纸衬底 */}
          <rect x="1.8" y="2.8" width="25.4" height="30.4" rx="1.2" fill="#faf6ee" />

          {/* 纯净画芯内景 (宽 22, 高 27) - 极简扁平绘本，无任何文字，无反光切角 */}
          <g id="photo-content-mini" transform="translate(3.5, 4.5)">
            <clipPath id="photoMiniClipFlat">
              <rect x="0" y="0" width="22" height="27" rx="0.8" />
            </clipPath>

            <g clipPath="url(#photoMiniClipFlat)">
              {/* 柔和扁平暖霞天空 */}
              <rect x="0" y="0" width="22" height="15" fill="#fde68a" opacity="0.7" />
              <rect x="0" y="7" width="22" height="10" fill="#fed7aa" opacity="0.8" />
              {/* 扁平柔和微丘 */}
              <circle cx="2" cy="26" r="14" fill="#a7f3d0" />
              <circle cx="19" cy="25" r="13" fill="#6ee7b7" />
              <rect x="0" y="18" width="22" height="9" fill="#4ade80" />

              {/* ===================================================================== */}
              {/* 三人统一无性别萌系体态：软萌圆润“水滴团子” + 图 1 标志性大冷帽          */}
              {/* ===================================================================== */}

              {/* --- Self (左侧 - 灰蓝萌团子) --- */}
              <g transform="translate(4.8, 12.8)">
                {/* 胖圆软糯身体 (水滴形纯平圆润曲线，无生硬肩角) */}
                <path
                  d="M -3.8,3.2 C -5.2,5 -5.2,10.8 -4.2,13.2 C -3,14.4 3,14.4 4.2,13.2 C 5.2,10.8 5.2,5 3.8,3.2 C 2.8,2 -2.8,2 -3.8,3.2 Z"
                  fill={selfShirt}
                  stroke="#1e293b"
                  strokeWidth="0.35"
                />
                {/* 圆润温润后颈微露 */}
                <path d="M -2.4,2 Q 0,3.5 2.4,2 Q 0,1 -2.4,2 Z" fill="#fcdcc2" />
                {/* 图 1 饱满圆球大冷帽冠体 */}
                <path
                  d="M -4.2,0.8 C -5,-3 -3.2,-5.6 0,-5.6 C 3.2,-5.6 5,-3 4.2,0.8 Z"
                  fill={selfBeanie}
                  stroke="#1e293b"
                  strokeWidth="0.35"
                />
                {/* 顶端小绒球 */}
                <circle cx="0" cy="-6" r="0.9" fill={selfBeanie} stroke="#1e293b" strokeWidth="0.3" />
                {/* 虚线拼缝 */}
                <path d="M -2.2,-4.5 Q -2.6,-1.2 -3,0.6" fill="none" stroke="#24384a" strokeWidth="0.35" strokeDasharray="0.6 0.4" />
                <path d="M 2.2,-4.5 Q 2.6,-1.2 3,0.6" fill="none" stroke="#24384a" strokeWidth="0.35" strokeDasharray="0.6 0.4" />
                {/* 圆弧折边罗纹帽檐 */}
                <path
                  d="M -4.4,-0.6 Q 0,-1.6 4.4,-0.6 L 4.4,1.4 Q 0,2.6 -4.4,1.4 Z"
                  fill="#2d485e"
                  stroke="#1e293b"
                  strokeWidth="0.35"
                />
                {[-3, -1.5, 0, 1.5, 3].map((rx) => (
                  <line key={`s-rib-${rx}`} x1={rx} y1="-0.8" x2={rx} y2="1.7" stroke="#1d2e3d" strokeWidth="0.25" />
                ))}
              </g>

              {/* --- Lin (中间 - 焦糖南瓜橙团子，略大略高) --- */}
              <g transform="translate(11, 11.2)">
                <path
                  d="M -4.2,3.4 C -5.6,5.4 -5.6,11.8 -4.5,14.2 C -3.2,15.5 3.2,15.5 4.5,14.2 C 5.6,11.8 5.6,5.4 4.2,3.4 C 3,2.2 -3,2.2 -4.2,3.4 Z"
                  fill={linShirt}
                  stroke="#7c2d12"
                  strokeWidth="0.35"
                />
                <path d="M -2.6,2.2 Q 0,3.8 2.6,2.2 Q 0,1.2 -2.6,2.2 Z" fill="#fcdcc2" />
                <path
                  d="M -4.5,1 C -5.4,-3.2 -3.4,-6 0,-6 C 3.4,-6 5.4,-3.2 4.5,1 Z"
                  fill={linBeanie}
                  stroke="#7c2d12"
                  strokeWidth="0.35"
                />
                <circle cx="0" cy="-6.5" r="0.95" fill={linBeanie} stroke="#7c2d12" strokeWidth="0.3" />
                <path d="M -2.4,-4.8 Q -2.8,-1.5 -3.2,0.8" fill="none" stroke="#9a3412" strokeWidth="0.35" strokeDasharray="0.6 0.4" />
                <path d="M 2.4,-4.8 Q 2.8,-1.5 3.2,0.8" fill="none" stroke="#9a3412" strokeWidth="0.35" strokeDasharray="0.6 0.4" />
                <path
                  d="M -4.8,-0.6 Q 0,-1.8 4.8,-0.6 L 4.8,1.6 Q 0,2.8 -4.8,1.6 Z"
                  fill="#b45309"
                  stroke="#7c2d12"
                  strokeWidth="0.35"
                />
                {[-3.2, -1.6, 0, 1.6, 3.2].map((rx) => (
                  <line key={`l-rib-${rx}`} x1={rx} y1="-0.9" x2={rx} y2="1.9" stroke="#78350f" strokeWidth="0.25" />
                ))}
              </g>

              {/* --- Yu (右侧 - 森林苔绿团子) --- */}
              <g transform="translate(17.2, 12.8)">
                <path
                  d="M -3.8,3.2 C -5.2,5 -5.2,10.8 -4.2,13.2 C -3,14.4 3,14.4 4.2,13.2 C 5.2,10.8 5.2,5 3.8,3.2 C 2.8,2 -2.8,2 -3.8,3.2 Z"
                  fill={yuShirt}
                  stroke="#14532d"
                  strokeWidth="0.35"
                />
                <path d="M -2.4,2 Q 0,3.5 2.4,2 Q 0,1 -2.4,2 Z" fill="#fcdcc2" />
                <path
                  d="M -4.2,0.8 C -5,-3 -3.2,-5.6 0,-5.6 C 3.2,-5.6 5,-3 4.2,0.8 Z"
                  fill={yuBeanie}
                  stroke="#14532d"
                  strokeWidth="0.35"
                />
                <circle cx="0" cy="-6" r="0.9" fill={yuBeanie} stroke="#14532d" strokeWidth="0.3" />
                <path d="M -2.2,-4.5 Q -2.6,-1.2 -3,0.6" fill="none" stroke="#166534" strokeWidth="0.35" strokeDasharray="0.6 0.4" />
                <path d="M 2.2,-4.5 Q 2.6,-1.2 3,0.6" fill="none" stroke="#166534" strokeWidth="0.35" strokeDasharray="0.6 0.4" />
                <path
                  d="M -4.4,-0.6 Q 0,-1.6 4.4,-0.6 L 4.4,1.4 Q 0,2.6 -4.4,1.4 Z"
                  fill="#204028"
                  stroke="#14532d"
                  strokeWidth="0.35"
                />
                {[-3, -1.5, 0, 1.5, 3].map((rx) => (
                  <line key={`y-rib-${rx}`} x1={rx} y1="-0.8" x2={rx} y2="1.7" stroke="#082912" strokeWidth="0.25" />
                ))}
              </g>
            </g>
          </g>

          {/* 扁平微光轮廓悬停反馈 */}
          <rect
            x="0"
            y="1"
            width="29"
            height="34"
            rx="2"
            fill="none"
            stroke="#fbbf24"
            strokeWidth={effectiveGizmoId === 'left-wall-photos' ? '1.2' : '0.6'}
            className={`${effectiveGizmoId === 'left-wall-photos' ? 'opacity-100' : 'opacity-0 group-hover/photo:opacity-100'} transition-opacity duration-200`}
          />

          {/* 2.5D 轴测校准把手 */}
          {effectiveGizmoId === 'left-wall-photos' && (
            <IsoGizmo
              pos={{ x: 14.5, y: 17 }}
              displayCoords={layout['left-wall-photos'].screen}
              fixedW={0}
              label="三人合照"
              onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
              onDragEnd={() => onDragGizmoEnd?.()}
            />
          )}
        </g>
      </g>

      {/* ========================================================================= */}
      {/* 4. 全局相册模组大弹窗 (柔和、圆润的极简扁平化 UI，无透视畸变)                 */}
      {/* ========================================================================= */}
      {photoOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            id="trio-album-modal"
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/55 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setPhotoOpen(false)}
          >
            <div
              className="relative w-full max-w-md bg-[#221c17] border border-[#4a3b2c] rounded-3xl shadow-2xl p-6 sm:p-7 text-[#f5efe6] flex flex-col items-center select-none"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 弹窗顶部栏：圆润标题与极简关闭按钮 */}
              <div className="w-full flex items-center justify-between pb-4 border-b border-[#3b2e22]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#8c5828]/30 border border-[#8c5828]/50 flex items-center justify-center text-[#e2a06f]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-[#f6efe6] tracking-wide">
                      三人合照 · 暖心纪念
                    </h3>
                    <p className="text-[11px] text-[#a89785]">阁楼专属羁绊 · 萌系无性别伙伴</p>
                  </div>
                </div>

                <button
                  onClick={() => setPhotoOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#a89785] hover:text-[#f6efe6] hover:bg-[#382b1e] transition-colors"
                  title="关闭相册"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 核心相片展台：柔和米白纯平相框与高清晰度萌系背影 */}
              <div className="w-full my-5 p-3.5 bg-[#fbf8f2] rounded-2xl shadow-md border border-[#dfd6c4]">
                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden relative bg-[#fdf5eb]">
                  <svg
                    viewBox="0 0 120 90"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    {/* 纯平柔和落霞背景 */}
                    <rect x="0" y="0" width="120" height="48" fill="#fef3c7" opacity="0.9" />
                    <rect x="0" y="28" width="120" height="30" fill="#fed7aa" opacity="0.75" />
                    {/* 柔和圆润微丘与草坪 */}
                    <circle cx="15" cy="85" r="50" fill="#bbf7d0" />
                    <circle cx="105" cy="85" r="48" fill="#86efac" />
                    <rect x="0" y="58" width="120" height="32" fill="#4ade80" />

                    {/* 治愈系微风小花草装饰 (纯平极简) */}
                    <circle cx="14" cy="65" r="1.6" fill="#ffffff" opacity="0.8" />
                    <circle cx="106" cy="68" r="1.6" fill="#ffffff" opacity="0.8" />
                    <circle cx="28" cy="74" r="1.3" fill="#fef08a" opacity="0.8" />
                    <circle cx="92" cy="73" r="1.3" fill="#fef08a" opacity="0.8" />

                    {/* ============================================================= */}
                    {/* 高清放大三人萌系背影：统一无性别水滴团子体态与大毛线帽              */}
                    {/* ============================================================= */}

                    {/* --- Self (左侧 - 灰蓝萌团子) --- */}
                    <g transform="translate(34, 43)">
                      {/* 水滴形胖圆身体 */}
                      <path
                        d="M -11,7 C -15,12 -15,28 -12,34 C -8,38 8,38 12,34 C 15,28 15,12 11,7 C 8,4 -8,4 -11,7 Z"
                        fill={selfShirt}
                        stroke="#1e293b"
                        strokeWidth="1"
                      />
                      {/* 微露圆润后颈 */}
                      <path d="M -7,4.8 Q 0,8.5 7,4.8 Q 0,2 -7,4.8 Z" fill="#fcdcc2" />

                      {/* 大圆球毛线帽主体 */}
                      <path
                        d="M -12,2 C -14.5,-9 -9.5,-16 0,-16 C 9.5,-16 14.5,-9 12,2 Z"
                        fill={selfBeanie}
                        stroke="#1e293b"
                        strokeWidth="1"
                      />
                      {/* 顶端毛绒圆球 */}
                      <circle cx="0" cy="-17.5" r="2.6" fill={selfBeanie} stroke="#1e293b" strokeWidth="0.9" />

                      {/* 工整虚线拼缝 */}
                      <path d="M -6.5,-13 Q -7.8,-3.5 -9,1.5" fill="none" stroke="#223748" strokeWidth="0.9" strokeDasharray="1.5 1.2" />
                      <path d="M 6.5,-13 Q 7.8,-3.5 9,1.5" fill="none" stroke="#223748" strokeWidth="0.9" strokeDasharray="1.5 1.2" />

                      {/* 圆弧翻折罗纹帽檐 */}
                      <path
                        d="M -12.6,-2 Q 0,-5 12.6,-2 L 12.6,3.6 Q 0,6.8 -12.6,3.6 Z"
                        fill="#2d485e"
                        stroke="#1e293b"
                        strokeWidth="1"
                      />
                      {[-8.5, -4.2, 0, 4.2, 8.5].map((rx) => (
                        <line key={`big-s-rib-${rx}`} x1={rx} y1="-2.8" x2={rx} y2="4.6" stroke="#1d2e3d" strokeWidth="0.75" />
                      ))}
                    </g>

                    {/* --- Lin (中间 - 焦糖南瓜橙团子) --- */}
                    <g transform="translate(60, 39)">
                      <path
                        d="M -12.5,8 C -17,13 -17,31 -13.5,37 C -9,41 9,41 13.5,37 C 17,31 17,13 12.5,8 C 9,4.5 -9,4.5 -12.5,8 Z"
                        fill={linShirt}
                        stroke="#7c2d12"
                        strokeWidth="1.1"
                      />
                      <path d="M -7.5,5.5 Q 0,9.5 7.5,5.5 Q 0,2.5 -7.5,5.5 Z" fill="#fcdcc2" />

                      <path
                        d="M -13,2.5 C -15.5,-9.5 -10,-17 0,-17 C 10,-17 15.5,-9.5 13,2.5 Z"
                        fill={linBeanie}
                        stroke="#7c2d12"
                        strokeWidth="1.1"
                      />
                      <circle cx="0" cy="-18.8" r="2.8" fill={linBeanie} stroke="#7c2d12" strokeWidth="0.9" />

                      <path d="M -7,-14 Q -8.2,-4 -9.5,2" fill="none" stroke="#9a3412" strokeWidth="0.9" strokeDasharray="1.5 1.2" />
                      <path d="M 7,-14 Q 8.2,-4 9.5,2" fill="none" stroke="#9a3412" strokeWidth="0.9" strokeDasharray="1.5 1.2" />

                      <path
                        d="M -13.5,-1.8 Q 0,-5 13.5,-1.8 L 13.5,4.2 Q 0,7.5 -13.5,4.2 Z"
                        fill="#b45309"
                        stroke="#7c2d12"
                        strokeWidth="1.1"
                      />
                      {[-9, -4.5, 0, 4.5, 9].map((rx) => (
                        <line key={`big-l-rib-${rx}`} x1={rx} y1="-2.6" x2={rx} y2="5.2" stroke="#78350f" strokeWidth="0.8" />
                      ))}
                    </g>

                    {/* --- Yu (右侧 - 森林苔绿团子) --- */}
                    <g transform="translate(86, 43)">
                      <path
                        d="M -11,7 C -15,12 -15,28 -12,34 C -8,38 8,38 12,34 C 15,28 15,12 11,7 C 8,4 -8,4 -11,7 Z"
                        fill={yuShirt}
                        stroke="#14532d"
                        strokeWidth="1"
                      />
                      <path d="M -7,4.8 Q 0,8.5 7,4.8 Q 0,2 -7,4.8 Z" fill="#fcdcc2" />

                      <path
                        d="M -12,2 C -14.5,-9 -9.5,-16 0,-16 C 9.5,-16 14.5,-9 12,2 Z"
                        fill={yuBeanie}
                        stroke="#14532d"
                        strokeWidth="1"
                      />
                      <circle cx="0" cy="-17.5" r="2.6" fill={yuBeanie} stroke="#14532d" strokeWidth="0.9" />

                      <path d="M -6.5,-13 Q -7.8,-3.5 -9,1.5" fill="none" stroke="#166534" strokeWidth="0.9" strokeDasharray="1.5 1.2" />
                      <path d="M 6.5,-13 Q 7.8,-3.5 9,1.5" fill="none" stroke="#166534" strokeWidth="0.9" strokeDasharray="1.5 1.2" />

                      <path
                        d="M -12.6,-2 Q 0,-5 12.6,-2 L 12.6,3.6 Q 0,6.8 -12.6,3.6 Z"
                        fill="#204028"
                        stroke="#14532d"
                        strokeWidth="1"
                      />
                      {[-8.5, -4.2, 0, 4.2, 8.5].map((rx) => (
                        <line key={`big-y-rib-${rx}`} x1={rx} y1="-2.8" x2={rx} y2="4.6" stroke="#082912" strokeWidth="0.75" />
                      ))}
                    </g>
                  </svg>
                </div>
              </div>

              {/* 弹窗底部：三位萌系伙伴标签与温馨文案 */}
              <div className="w-full flex items-center justify-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#527899]/20 text-[#93b8d9] border border-[#527899]/35">
                  <span className="w-2 h-2 rounded-full bg-[#527899]" />
                  {selfPerson?.name || '我自己'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#dd7a38]/20 text-[#f3ad7e] border border-[#dd7a38]/35">
                  <span className="w-2 h-2 rounded-full bg-[#dd7a38]" />
                  {linPerson?.name || '小林'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#4d7853]/20 text-[#9ad4a2] border border-[#4d7853]/35">
                  <span className="w-2 h-2 rounded-full bg-[#4d7853]" />
                  {yuPerson?.name || '阿雨'}
                </span>
              </div>

              <p className="text-xs text-[#a89785] text-center leading-relaxed px-2">
                “屋檐下并肩眺望黄昏的三只圆滚滚小身影，安静守候着属于你们的木屋时光。”
              </p>

              <button
                onClick={() => setPhotoOpen(false)}
                className="mt-4 w-full py-2.5 rounded-xl bg-[#362a1e] hover:bg-[#463627] text-[#f2ece2] text-xs font-medium transition-colors border border-[#53402e]"
              >
                收起相册
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
