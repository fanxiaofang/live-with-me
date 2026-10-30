import { frontEdgeY } from './fieldEdges';

/** The access ends at a small worn opening in the meadow edge. It does not attach to a
 * landmark in the independently moving crop, or continue as a crop-plane road. */
export const FIELD_ACCESS = {
  bankStart: 1385, bankEnd: 1435, reach: 6,
  start: { x: 1100, y: 335 },
  control1: { x: 1195, y: 355 },
  control2: { x: 1390, y: 330 },
  foot: { x: 1410, y: frontEdgeY(1410) - 4 },
} as const;

export function fieldAccessPoint(t: number) {
  const u = 1 - t, { start: a, control1: b, control2: c, foot: d } = FIELD_ACCESS;
  const x = u ** 3 * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t ** 3 * d.x;
  const y = u ** 3 * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t ** 3 * d.y;
  const dx = 3 * u * u * (b.x - a.x) + 6 * u * t * (c.x - b.x) + 3 * t * t * (d.x - c.x);
  const dy = 3 * u * u * (b.y - a.y) + 6 * u * t * (c.y - b.y) + 3 * t * t * (d.y - c.y);
  const length = Math.hypot(dx, dy);
  return { x, y, nx: -dy / length, ny: dx / length, angle: Math.atan2(dy, dx) * 180 / Math.PI,
    halfWidth: 7 + 5 * (1 - t) };
}

export const FIELD_ACCESS_SAMPLES = Array.from({ length: 29 }, (_, i) => fieldAccessPoint(i / 28));
const roadSide = (side: number) => FIELD_ACCESS_SAMPLES.map((p, i) => {
  const breadth = p.halfWidth * (.82 + .12 * Math.sin(i * 1.7));
  return `${p.x + side * p.nx * breadth},${p.y + side * p.ny * breadth}`;
});
export const FIELD_ACCESS_WASH = `M${roadSide(1).join(' L')} L${roadSide(-1).reverse().join(' L')}Z`;

export const FIELD_ACCESS_BANK_SAMPLES = Array.from({ length: 23 }, (_, i) => {
  const t = i / 22, x = FIELD_ACCESS.bankStart + t * (FIELD_ACCESS.bankEnd - FIELD_ACCESS.bankStart);
  const breadth = Math.sin(Math.PI * t) ** 1.35;
  const irregularity = .85 + .15 * Math.cos(t * Math.PI * 6);
  return { x, edge: frontEdgeY(x), far: frontEdgeY(x) - FIELD_ACCESS.reach * breadth * irregularity, near: frontEdgeY(x) + 4 * breadth * irregularity };
});
export const FIELD_ACCESS_BANK = `M${FIELD_ACCESS_BANK_SAMPLES.map(p => `${p.x},${p.far}`).join(' L')} L${[...FIELD_ACCESS_BANK_SAMPLES].reverse().map(p => `${p.x},${p.near}`).join(' L')}Z`;
