import { projectIsoToScreen } from '../layout-gizmo/isoMath';
import type { RoomLayoutConfig } from '../layout-gizmo/layoutStore';

/** Shared physical heights in scene units, measured up from the local floor. */
export const DESK_CHAIR_MEASUREMENTS = {
  floorY: 20, deskTop: 22.6, deskThickness: 2.4,
  seatPlankBottom: 11.6, seatPlankTop: 13, cushionBottom: 13.4, seatTop: 14.2,
  legTop: 12.5, stretcher: 5.6, backTop: 26.4,
} as const;
export type DeskSeatId = 'desk_workstation' | 'desk_workstation_secondary';
export const DESK_SEATS = [
  { slot: 'desk_workstation', chair: 'attic-chair', laptop: 'desk-laptop', label: '温莎椅工位', variant: 'windsor' },
  { slot: 'desk_workstation_secondary', chair: 'attic-chair-secondary', laptop: 'desk-laptop-secondary', label: '复古椅工位', variant: 'retro' },
] as const;

/** Chair-local floor origin; follows the existing furniture authoring axes. */
export function chairPoint(u: number, v: number, height: number) {
  const point = projectIsoToScreen({ u, v, w: height });
  return { x: point.x, y: point.y + DESK_CHAIR_MEASUREMENTS.floorY };
}
export function chairXY(u: number, v: number, height: number) {
  const p = chairPoint(u, v, height);
  return `${Number(p.x.toFixed(2))},${Number(p.y.toFixed(2))}`;
}
export function chairSeatPath(height: number, inset = 0) {
  const w = 8 - inset, d = 7 - inset, r = 1.8;
  const p = (u: number, v: number) => chairXY(u, v, height);
  return `M${p(-w + r, -d)} L${p(w - r, -d)} Q${p(w, -d)} ${p(w, -d + r)}
    L${p(w, d - r)} Q${p(w, d)} ${p(w - r, d)} L${p(-w + r, d)}
    Q${p(-w, d)} ${p(-w, d - r)} L${p(-w, -d + r)} Q${p(-w, -d)} ${p(-w + r, -d)} Z`;
}
/** Keyboard location expressed in the independent chair's local SVG space. */
export function deskKeyboardInChairSpace(layout: RoomLayoutConfig, seat: DeskSeatId = 'desk_workstation', deskRise = 0) {
  const config = DESK_SEATS.find(item => item.slot === seat)!;
  const desk = layout['desk-group'].screen, laptop = layout[config.laptop].screen;
  const chair = layout[config.chair].screen;
  return { x: desk.x + laptop.x - chair.x, y: desk.y + laptop.y - chair.y - deskRise };
}
