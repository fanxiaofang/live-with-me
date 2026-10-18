import { DESK_CHAIR_MEASUREMENTS } from './chairGeometry';
import type { RoomLayoutConfig } from '../layout-gizmo/layoutStore';

export interface DeskSurfaceStudy {
  outline: 'straight' | 'cove';
  height: number;
  thickness: number;
  width: number;
}
export interface DeskStudyDraft { surface: DeskSurfaceStudy; layout: RoomLayoutConfig }
export const BASE_DESK_SURFACE: DeskSurfaceStudy = { outline: 'straight', height: 22.6, thickness: 2.4, width: 1 };
export const createDeskStudy = (layout: RoomLayoutConfig): DeskStudyDraft => ({
  surface: { ...BASE_DESK_SURFACE }, layout: structuredClone(layout),
});
export const deskStudyRise = (surface?: DeskSurfaceStudy) => (surface?.height ?? 22.6) - DESK_CHAIR_MEASUREMENTS.deskTop;

/** Keep the existing desk's authored ground axes, rather than inventing a new camera. */
export function deskSurfacePoint(s: number, t: number, surface: DeskSurfaceStudy) {
  return { x: (-53 + 74 * s + 32 * t) * surface.width, y: 5.4 - 21.1 * s + 9.1 * t - deskStudyRise(surface) };
}
export function deskSurfacePaths(surface: DeskSurfaceStudy) {
  const p = (s: number, t: number, down = 0) => {
    const point = deskSurfacePoint(s, t, surface); return `${point.x},${point.y + down}`;
  };
  const front = (down = 0) => surface.outline === 'cove'
    ? `M${p(1, 1, down)} C${p(.74, 1.13, down)} ${p(.58, .78, down)} ${p(.4, .83, down)} C${p(.2, .87, down)} ${p(.14, 1.17, down)} ${p(0, 1, down)}`
    : `M${p(1, 1, down)} L${p(0, 1, down)}`;
  const thickness = surface.thickness;
  const frontReturn = surface.outline === 'cove'
    ? `C${p(.14, 1.17, thickness)} ${p(.2, .87, thickness)} ${p(.4, .83, thickness)} C${p(.58, .78, thickness)} ${p(.74, 1.13, thickness)} ${p(1, 1, thickness)}`
    : `L${p(1, 1, thickness)}`;
  const frontTop = front();
  return {
    top: surface.outline === 'cove'
      ? `M${p(0, 0)} L${p(1, 0)} Q${p(1.08, .5)} ${p(1, 1)} ${frontTop.slice(frontTop.indexOf(' C') + 1)} Q${p(-.1, .5)} ${p(0, 0)} Z`
      : `M${p(0, 0)} L${p(1, 0)} L${p(1, 1)} L${p(0, 1)} Z`,
    front: `${frontTop} L${p(0, 1, thickness)} ${frontReturn} Z`,
    side: `M${p(0, 0)} L${p(0, 1)} L${p(0, 1, thickness)} L${p(0, 0, thickness)} Z`,
    frontTop,
  };
}
