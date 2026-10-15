import type { Person } from '../../types';
import type { InteractionTarget } from '../../world/interactions/interactionTypes';
import { IsoGizmo, type EditableObjectId, type RoomLayoutConfig } from '../layout-gizmo';
import { DESK_SEATS, deskKeyboardInChairSpace, type DeskSeatId } from './chairGeometry';
import { WindsorChair } from './WindsorChair';

export type DeskOccupants = Record<DeskSeatId, Person | null>;
type Props = {
  layout: RoomLayoutConfig; occupants: DeskOccupants; relativeToDesk?: boolean; interactive?: boolean;
  hiddenPrimary?: boolean; isInspectorOpen?: boolean; activeGizmoId?: EditableObjectId | null;
  onSelectGizmo?: (id: EditableObjectId | null) => void;
  onDragGizmoDelta?: (dx: number, dy: number) => void; onDragGizmoEnd?: () => void;
  onOpenInspector?: (seat: DeskSeatId) => void; onHover?: (target: InteractionTarget | null) => void;
};

/** World and inspection use the same placements, occupants and keyboard anchors. */
export function DeskWorkstations({ layout, occupants, relativeToDesk = false, interactive = false,
  hiddenPrimary = false, isInspectorOpen = false, activeGizmoId,
  onSelectGizmo, onDragGizmoDelta, onDragGizmoEnd, onOpenInspector, onHover }: Props) {
  const origin = relativeToDesk ? layout['desk-group'].screen : { x: 0, y: 0 };
  const seats = [...DESK_SEATS].sort((a, b) => layout[a.chair].screen.y - layout[b.chair].screen.y);
  return <>{seats.map(seat => <g key={seat.slot} data-desk-seat={seat.slot}
    id={seat.slot === 'desk_workstation' ? 'isometric-chair-container' : 'isometric-chair-secondary-container'}
    transform={`translate(${layout[seat.chair].screen.x - origin.x},${layout[seat.chair].screen.y - origin.y})`}>
    <WindsorChair chairId={seat.chair} variant={seat.variant} occupant={occupants[seat.slot]}
      isSeated={Boolean(occupants[seat.slot]) && !(hiddenPrimary && seat.slot === 'desk_workstation')}
      interactive={interactive} isInspectorOpen={isInspectorOpen} keyboardAnchor={deskKeyboardInChairSpace(layout, seat.slot)}
      onHover={onHover} onClick={event => {
        event.stopPropagation();
        if (isInspectorOpen) onSelectGizmo?.(activeGizmoId === seat.chair ? null : seat.chair);
        else onOpenInspector?.(seat.slot);
      }} />
    {interactive && activeGizmoId === seat.chair && <IsoGizmo pos={{ x: 0, y: 5.8 }}
      displayCoords={layout[seat.chair].screen} fixedW={0} label={seat.label}
      onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)} onDragEnd={() => onDragGizmoEnd?.()} />}
  </g>)}</>;
}
