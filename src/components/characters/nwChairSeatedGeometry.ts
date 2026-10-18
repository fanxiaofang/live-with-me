import { NW_SEATED_V6 } from './nwChairSeatedV6Assets';
import { chairPoint, DESK_CHAIR_MEASUREMENTS as chair } from '../desk/chairGeometry';

// Original chair frame for seat, placement and contact shadows. The visible
// body is now the complete v6 authoring silhouette, calibrated to this frame;
// these references are not a reconstructed skeleton or a cloth simulation.
const seat = chair.seatTop;
export const NW_CHAIR_SEATED = {
  direction: 'NW-eight-view-seated',
  seatHeight: seat,
  head: chairPoint(0, .6, seat + 18),
  shoulders: [chairPoint(-4.5, .8, 25), chairPoint(4.2, .8, 25.3)],
  hip: chairPoint(0, 2, seat),
  hands: [NW_SEATED_V6.hand, chairPoint(3.3, -5.7, 18.4)],
  // Authoring reference for the supported patch, separate from the hem.
  bearing: {u: 0, v: 2, radiusU: 4.2, radiusV: 2.2},
} as const;

const point = (u: number, v: number, height: number) => {
  const p = chairPoint(u, v, height);
  return `${Number(p.x.toFixed(4))},${Number(p.y.toFixed(4))}`;
};
const p = point;

export const NW_CHAIR_ROBE = { outline: NW_SEATED_V6.outline } as const;

/** A true ellipse in the furniture's horizontal plane, projected as cubics. */
export function chairPlaneEllipse(u: number, v: number, ru: number, rv: number, height: number) {
  const k = .55228475;
  return `M${p(u+ru,v,height)}
    C${p(u+ru,v+k*rv,height)} ${p(u+k*ru,v+rv,height)} ${p(u,v+rv,height)}
    C${p(u-k*ru,v+rv,height)} ${p(u-ru,v+k*rv,height)} ${p(u-ru,v,height)}
    C${p(u-ru,v-k*rv,height)} ${p(u-k*ru,v-rv,height)} ${p(u,v-rv,height)}
    C${p(u+k*ru,v-rv,height)} ${p(u+ru,v-k*rv,height)} ${p(u+ru,v,height)}Z`;
}
