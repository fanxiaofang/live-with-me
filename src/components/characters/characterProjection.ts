import type { IsoDirection4 } from '../../utils/characterFacing';

/** Character authoring only. Ground edge slope from TimberFlooring: (272, 77).
 * Width/depth are the character's own horizontal axes; height remains vertical.
 * Four quarter-turns under one fixed shallow view, not a new world camera. */
export const CHARACTER_GROUND_SLOPE = 77 / 272;
export const CHARACTER_GROUND_ANGLE = Math.atan(CHARACTER_GROUND_SLOPE) * 180 / Math.PI;

export function characterPoint(width: number, depth: number, height: number, facing: IsoDirection4) {
  switch (facing) {
    case 'SW': return { x: -depth, y: CHARACTER_GROUND_SLOPE * width - height };
    case 'NW': return { x: -width, y: -CHARACTER_GROUND_SLOPE * depth - height };
    case 'NE': return { x: depth, y: -CHARACTER_GROUND_SLOPE * width - height };
    default: return { x: width, y: CHARACTER_GROUND_SLOPE * depth - height };
  }
}

export function referenceGroundPoint(u: number, v: number) {
  return { x: u - v, y: CHARACTER_GROUND_SLOPE * (u + v) };
}
