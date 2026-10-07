import { DEFAULT_ROOM_LAYOUT } from '../layout-gizmo/layoutStore';
import React from 'react';
import { CabinetFrame } from './CabinetFrame';
import { RetroTurntable } from './RetroTurntable';
import { MokaPot } from './MokaPot';
import { CoffeeBeansDisplay, CeramicCupsDisplay } from './CoffeeCorner';
import { CabinetLayoutConfig, EditableObjectId, IsoGizmo } from '../layout-gizmo';

export interface RecordCabinetProps {
  onHoverObject?: (label: string | null) => void;
  isPlaying?: boolean;
  layout?: CabinetLayoutConfig;
  activeGizmoId?: EditableObjectId | null;
  isInspectorOpen?: boolean;
  onSelectGizmo?: (id: EditableObjectId | null) => void;
  onDragGizmoDelta?: (dx: number, dy: number) => void;
  onDragGizmoEnd?: () => void;
}

/**
 * 2.5D 轻盈日式/北欧风咖啡黑胶边柜 (Minimalist Coffee & Vinyl Console)
 * 支持 2.5D 坐标动态绑定与可视化 Gizmo 拖拽对齐
 */
export const RecordCabinet: React.FC<RecordCabinetProps> = ({
  onHoverObject,
  isPlaying = true,
  layout = DEFAULT_ROOM_LAYOUT,
  activeGizmoId,
  isInspectorOpen = false,
  onSelectGizmo,
  onDragGizmoDelta,
  onDragGizmoEnd,
}) => {
  // 坐标优先取 layout 动态状态，缺省兜底
  const beansPos = layout['coffee-beans'].screen;
  const cupsPos = layout['ceramic-cups'].screen;
  const turntablePos = layout['record-player'].screen;
  const mokaPos = layout['moka-pot'].screen;

  const beansScale = layout['coffee-beans'].scale;
  const cupsScale = layout['ceramic-cups'].scale;
  const turntableScale = layout['record-player'].scale;
  const mokaScale = layout['moka-pot'].scale;

  const isCabinetChild =
    Boolean(isInspectorOpen && activeGizmoId &&
    ['record-player', 'moka-pot', 'coffee-beans', 'ceramic-cups'].includes(activeGizmoId));

  return (
    <g id="record-cabinet-container" className="select-none">
      {/* 1. 复古胡桃木/老柚木边柜主体骨架 */}
      <CabinetFrame
        onHover={(hovered) => {
          onHoverObject?.(hovered ? 'cabinet:复古胡桃木咖啡唱片边柜' : null);
        }}
        onClick={() => {
          if (isInspectorOpen) {
            onSelectGizmo?.(activeGizmoId === 'cabinet-group' ? null : 'cabinet-group');
          }
        }}
      >
        {/* 2. 下层开放格内嵌物品 */}
        {/* 2.1 左侧格：手冲咖啡熟豆包与玻璃储豆罐 */}
        <g
          id="cabinet-coffee-beans"
          transform={`translate(${beansPos.x}, ${beansPos.y}) scale(${beansScale})`}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onSelectGizmo?.(activeGizmoId === 'coffee-beans' ? null : 'coffee-beans');
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            onHoverObject?.('cabinet:现烘单品咖啡豆与密封罐 (点击可调优坐标)');
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            onHoverObject?.(null);
          }}
        >
          <CoffeeBeansDisplay />
        </g>

        {/* 2.2 右侧格：几只手作小陶土咖啡杯 */}
        <g
          id="cabinet-ceramic-cups"
          transform={`translate(${cupsPos.x}, ${cupsPos.y}) scale(${cupsScale})`}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onSelectGizmo?.(activeGizmoId === 'ceramic-cups' ? null : 'ceramic-cups');
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            onHoverObject?.('cabinet:手作陶土咖啡杯 (点击可调优坐标)');
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            onHoverObject?.(null);
          }}
        >
          <CeramicCupsDisplay />
        </g>
      </CabinetFrame>

      {/* 3. 顶面操作台陈列物品 (台面层，置于顶板之上) */}
      <g id="cabinet-countertop-items">
        {/* 3.1 顶面左侧：复古极简黑胶唱片机 */}
        <g
          id="cabinet-record-player"
          transform={`translate(${turntablePos.x}, ${turntablePos.y}) scale(${turntableScale})`}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onSelectGizmo?.(activeGizmoId === 'record-player' ? null : 'record-player');
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            onHoverObject?.('turntable:复古黑胶唱片机 (点击可调优坐标)');
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            onHoverObject?.(null);
          }}
        >
          <RetroTurntable isPlaying={isPlaying} />
        </g>

        {/* 3.2 顶面右侧：经典意式摩卡咖啡壶 */}
        <g
          id="cabinet-moka-pot"
          transform={`translate(${mokaPos.x}, ${mokaPos.y}) scale(${mokaScale})`}
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onSelectGizmo?.(activeGizmoId === 'moka-pot' ? null : 'moka-pot');
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            onHoverObject?.('cabinet:经典意式摩卡咖啡壶 (点击可调优坐标)');
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            onHoverObject?.(null);
          }}
        >
          <MokaPot hasSteam={true} />
        </g>
      </g>

      {/* 4. 可视化 2.5D 轴测 Gizmo 把手 (仅在选中属于边柜内部的小物件时才在此渲染) */}
      {layout && isCabinetChild && activeGizmoId && (
        <IsoGizmo
          pos={layout[activeGizmoId].screen}
          displayCoords={layout[activeGizmoId].screen}
          fixedW={layout[activeGizmoId].fixedW}
          objectName={layout[activeGizmoId].name}
          onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
          onDragEnd={onDragGizmoEnd}
        />
      )}
    </g>
  );
};
