import React from 'react';
import type { InteractionTarget } from '../../world/interactions/interactionTypes';
import { svgAction } from '../../world/interactions/svgAction';
import { EditableObjectId, IsoGizmo, RoomLayoutConfig } from '../layout-gizmo';
import { DEFAULT_ROOM_LAYOUT } from '../layout-gizmo/layoutStore';
import { DeskFrame } from './DeskFrame';
import { BankerLampDisplay, CoffeeMugDisplay, LaptopDisplay } from './DeskItems';
import { useDeskStudy } from './DeskStudyContext';
import { deskStudyRise } from './deskStudyModel';
import { DeskSurfaceGuide } from './DeskContactGuides';

export interface AtticDeskProps {
  layout?: RoomLayoutConfig;
  activeGizmoId?: EditableObjectId | null;
  isInspectorOpen?: boolean;
  onSelectGizmo?: (id: EditableObjectId | null) => void;
  onDragGizmoDelta?: (dx: number, dy: number) => void;
  onDragGizmoEnd?: () => void;
  onHoverObject?: (target: InteractionTarget | null) => void;
}

/** One desk, with two independent computer/cup slots and a shared banker lamp. */
export const AtticDesk: React.FC<AtticDeskProps> = ({
  layout = DEFAULT_ROOM_LAYOUT, activeGizmoId, isInspectorOpen = false,
  onSelectGizmo, onDragGizmoDelta, onDragGizmoEnd, onHoverObject,
}) => {
  const study = useDeskStudy();
  const rise = deskStudyRise(study?.surface);
  const items = [
    { id: 'desk-lamp', domId: 'desk-slot-banker-lamp', element: <BankerLampDisplay /> },
    { id: 'desk-laptop', domId: 'desk-slot-laptop', element: <LaptopDisplay /> },
    { id: 'desk-laptop-secondary', domId: 'desk-slot-laptop-secondary', element: <LaptopDisplay instance="-secondary" /> },
    { id: 'desk-cup', domId: 'desk-slot-coffee-mug', element: <CoffeeMugDisplay /> },
    { id: 'desk-cup-secondary', domId: 'desk-slot-coffee-mug-secondary', element: <CoffeeMugDisplay instance="-secondary" /> },
  ] as const;
  const isDeskChild = isInspectorOpen && activeGizmoId && items.some(item => item.id === activeGizmoId);
  return <g id="attic-workdesk-container" className="select-none">
    <DeskFrame onHover={hovered => onHoverObject?.(hovered ? { kind: 'furniture-part', id: 'desk-group' } : null)}
      onClick={event => {
        if (!isInspectorOpen) return;
        event.stopPropagation(); onSelectGizmo?.(activeGizmoId === 'desk-group' ? null : 'desk-group');
      }}>
      {items.map(item => <g key={item.id} {...svgAction(item.domId)} id={item.domId}
        transform={`translate(${layout[item.id].screen.x},${layout[item.id].screen.y - rise})`} className="cursor-pointer"
        onClick={event => {
          if (!isInspectorOpen) return;
          event.stopPropagation(); onSelectGizmo?.(activeGizmoId === item.id ? null : item.id);
        }}
        onMouseEnter={event => { event.stopPropagation(); onHoverObject?.({ kind: 'furniture-part', id: item.id }); }}
        onMouseLeave={event => { event.stopPropagation(); onHoverObject?.(null); }}>
        {item.element}
      </g>)}
      {study?.guides && <DeskSurfaceGuide surface={study.surface} />}
    </DeskFrame>
    {isDeskChild && activeGizmoId && <IsoGizmo pos={layout[activeGizmoId].screen}
      displayCoords={layout[activeGizmoId].screen} fixedW={layout[activeGizmoId].fixedW}
      objectName={layout[activeGizmoId].name} onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)}
      onDragEnd={() => onDragGizmoEnd?.()} />}
  </g>;
};
