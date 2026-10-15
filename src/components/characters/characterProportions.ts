/** Authoring measurements for a neutral, floor-length robe. SVG units, floor at (0, 0).
 * Head count uses the bare head-circle diameter, not hat or pompom height.
 * Sitting poses compress the body; they must not be stretched into a standing pose. */
export const STANDING_CHARACTER_PROPORTIONS = {
  headRadius: 7,
  headCenterY: -34,
  shoulderY: -27,
  shoulderWidth: 10.4,
  shoulderDepth: 7.6,
  cuffY: -13.2,
  hemY: 0,
  hemWidth: 18,
  hemDepth: 13.2,
  approximateTopY: -45,
  headUnits: 3.2,
} as const;

export const CHARACTER_REFERENCE_PALETTE = {
  beanie: '#425b6e', hair: '#1f1b18', skin: '#f5d6be', shirt: '#e07a5f', shadow: '#1b120a',
} as const;

/** World dimensions, independent of camera zoom. Authoring paths keep their
 * accepted proportions; each pose is positioned from its floor/seat contact. */
export const CHARACTER_WORLD_SIZE = {
  standingHeight: 48,
  authoringScale: 48 / 45,
  headRadius: 7 * 48 / 45,
  floorSeatedHeight: 33 * 48 / 45,
  chairSeatedHeight: 44,
} as const;

/** User's Boxy SVG robe. Preserve its wide, shallow footprint and normalize
 * the floor from the actual lowest hem point instead of the old y=8 anchor. */
export const SEATED_SIDE_ROBE = {
  cx: -0.6,
  cy: 4.7,
  rx: 10.044,
  ry: 2.454,
  groundY: 4.7 + 2.454,
} as const;

export const SEATED_SIDE_HEIGHT = (25 + SEATED_SIDE_ROBE.groundY) * CHARACTER_WORLD_SIZE.authoringScale;

export function characterScaleAtSeat(seatY: number) {
  return `translate(0,${seatY}) scale(${CHARACTER_WORLD_SIZE.authoringScale}) translate(0,${-seatY})`;
}
