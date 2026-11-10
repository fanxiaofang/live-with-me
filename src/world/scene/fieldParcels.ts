// Shared ground directions for tramlines, parcel margins and their existing trees.
// Covers the entire crop area exposed by the allowed camera range. Marks remain
// fixed here; the meadow, rather than the camera, decides which parts are seen.
export const FIELD_DETAIL_FRONT_Y = 560;

export const WHEAT_TRAMLINES = [
  { x1: -2600, y1: 215, x2: -2350, y2: 375 },
  { x1: -1900, y1: 220, x2: -1600, y2: 375 },
  { x1: -1200, y1: 210, x2: -880, y2: 375 },
  { x1: -500, y1: 205, x2: -150, y2: 380 },
  { x1: 200, y1: 200, x2: 580, y2: 370 },
  { x1: 900, y1: 190, x2: 1320, y2: 375 },
  { x1: 1600, y1: 192, x2: 2050, y2: 380 },
  { x1: 2300, y1: 195, x2: 2800, y2: 375 },
  { x1: 3000, y1: 198, x2: 3550, y2: 380 },
];

export function tramlinePoint(index: number, t: number) {
  const line = WHEAT_TRAMLINES[index];
  return { x: line.x1 + (line.x2 - line.x1) * t, y: line.y1 + (line.y2 - line.y1) * t };
}

export function tramlineX(index: number, y: number) {
  const line = WHEAT_TRAMLINES[index];
  return line.x1 + (y - line.y1) * (line.x2 - line.x1) / (line.y2 - line.y1);
}
