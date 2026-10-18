import { chairPoint, DESK_CHAIR_MEASUREMENTS as chair } from './chairGeometry';

/** NW seated, legs enclosed by a compact robe as in the cushion/sofa poses.
 * Hip stays over the unchanged seat. No authored calves or floor-reaching hem.
 * The head is the finalized fifth-view asset, translated without redrawing. */
export const WINDSOR_SEATED_POSE = {
  direction: 'NW-eight-view-seated',
  seatY: chairPoint(0, 0, chair.seatTop).y,
  head: chairPoint(0, .6, chair.seatTop + 18),
  hip: chairPoint(0, .6, chair.seatTop),
  shoulders: [chairPoint(-4.5, .6, 24.8), chairPoint(4.2, .6, 24.8)],
  hips: [chairPoint(-4, .6, chair.seatTop), chairPoint(4, .6, chair.seatTop)],
  knees: [chairPoint(-4, -6, chair.seatTop), chairPoint(4, -6, chair.seatTop)],
  elbows: [chairPoint(-5.3, -1.8, 19.8), chairPoint(4.5, -1.8, 19.8)],
  hands: [{ x: -10, y: 4.5 }, { x: -5.3, y: 2.6 }],
} as const;
