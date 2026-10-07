import { DEFAULT_ROOM_LAYOUT } from '../layout-gizmo/layoutStore';
import React from 'react';
import { DeskFrame } from './DeskFrame';
import { LaptopDisplay, BankerLampDisplay, CoffeeMugDisplay } from './DeskItems';
import { RoomLayoutConfig, EditableObjectId, IsoGizmo } from '../layout-gizmo';

export interface AtticDeskProps {
  layout?: RoomLayoutConfig;
  activeGizmoId?: EditableObjectId | null;
  isInspectorOpen?: boolean;
  onSelectGizmo?: (id: EditableObjectId | null) => void;
  onDragGizmoDelta?: (dx: number, dy: number) => void;
  onDragGizmoEnd?: () => void;
  onHoverObject?: (label: string | null) => void;
}

/**
 * 阁楼手工白橡木书桌与桌面插槽系统 (Attic Work Desk & Slot System)
 * 1. 书桌主体独立封装为 SVG 结构 (DeskFrame)
 * 2. 桌面摆件设计为独立插槽 (Slot: 电脑、墨绿台灯、白瓷水杯)
 * 3. 整体可通过校准器作为一个整体移动 (desk-group)
 * 4. 三个摆件插槽也可基于桌子局部坐标系各自独立拖拽校准微调
 */
export const AtticDesk: React.FC<AtticDeskProps> = ({
  layout = DEFAULT_ROOM_LAYOUT,
  activeGizmoId,
  isInspectorOpen = false,
  onSelectGizmo,
  onDragGizmoDelta,
  onDragGizmoEnd,
  onHoverObject,
}) => {
  // 相对桌子局部坐标系的插槽位置
  const laptopPos = layout['desk-laptop'].screen;
  const lampPos = layout['desk-lamp'].screen;
  const cupPos = layout['desk-cup'].screen;

  const isDeskChild = Boolean(
    isInspectorOpen &&
      activeGizmoId &&
      ['desk-laptop', 'desk-lamp', 'desk-cup'].includes(activeGizmoId)
  );

  return (
    <g id="attic-workdesk-container" className="select-none">
      {/* 1. 书桌主体独立 SVG 骨架 */}
      <DeskFrame
        onHover={(hovered) => {
          onHoverObject?.(hovered ? 'attic:阁楼手工白橡木书桌 (点击可校准整体)' : null);
        }}
        onClick={(e) => {
          if (isInspectorOpen) {
            e.stopPropagation();
            onSelectGizmo?.(activeGizmoId === 'desk-group' ? null : 'desk-group');
          }
        }}
      >
        {/* 2. 桌面摆件插槽层 (Slot Items on Desk) */}

        {/* 2.1 台灯插槽 (复古墨绿银行家台灯) */}
        <g
          id="desk-slot-banker-lamp"
          transform={`translate(${lampPos.x}, ${lampPos.y})`}
          className="cursor-pointer"
          onClick={(e) => {
            if (isInspectorOpen) {
              e.stopPropagation();
              onSelectGizmo?.(activeGizmoId === 'desk-lamp' ? null : 'desk-lamp');
            }
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            onHoverObject?.('attic:复古墨绿银行家台灯 (点击可调优桌面坐标)');
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            onHoverObject?.(null);
          }}
        >
          <BankerLampDisplay />
        </g>

        {/* 2.2 电脑插槽 (便携轻薄办公电脑) */}
        <g
          id="desk-slot-laptop"
          transform={`translate(${laptopPos.x}, ${laptopPos.y})`}
          className="cursor-pointer"
          onClick={(e) => {
            if (isInspectorOpen) {
              e.stopPropagation();
              onSelectGizmo?.(activeGizmoId === 'desk-laptop' ? null : 'desk-laptop');
            }
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            onHoverObject?.('attic:便携轻薄办公电脑 (点击可调优桌面坐标)');
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            onHoverObject?.(null);
          }}
        >
          <LaptopDisplay />
        </g>

        {/* 2.3 水杯插槽 (手作白瓷温热咖啡杯) */}
        <g
          id="desk-slot-coffee-mug"
          transform={`translate(${cupPos.x}, ${cupPos.y})`}
          className="cursor-pointer"
          onClick={(e) => {
            if (isInspectorOpen) {
              e.stopPropagation();
              onSelectGizmo?.(activeGizmoId === 'desk-cup' ? null : 'desk-cup');
            }
          }}
          onMouseEnter={(e) => {
            e.stopPropagation();
            onHoverObject?.('attic:手作白瓷温热咖啡杯 (点击可调优桌面坐标)');
          }}
          onMouseLeave={(e) => {
            e.stopPropagation();
            onHoverObject?.(null);
          }}
        >
          <CoffeeMugDisplay />
        </g>
      </DeskFrame>

      {/* 3. 可视化 2.5D 轴测 Gizmo 把手 (仅在选中属于书桌上的摆件时在此渲染) */}
      {layout && isDeskChild && activeGizmoId && (
        <IsoGizmo
          pos={layout[activeGizmoId].screen}
          displayCoords={layout[activeGizmoId].screen}
          fixedW={layout[activeGizmoId].fixedW}
          objectName={layout[activeGizmoId].name}
          onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
          onDragEnd={() => onDragGizmoEnd?.()}
        />
      )}
    </g>
  );
};
