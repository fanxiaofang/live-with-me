/** Fixed crop-plane placements. Depth owns the footprint, size and detail level;
 * it is not adjusted by the camera or by the foreground occlusion. */
export function fieldDressingDepth(depth: number) {
  // Preserve the original rear sizes; nearer rolls grow gently rather than
  // extrapolating the distant perspective into oversized foreground objects.
  const scale = depth <= 1 ? .43 + depth * .7 : 1.13 + Math.min(.22, (depth - 1) * .18);
  return { y: 208 + depth * 78, scale, opacity: Math.min(1, .79 + depth * .21) };
}

// Permanent crop-plane anchors revealed by downward pans. Leave a clear strip
// before the meadow edge instead of lining it with partially occluded rolls.
const FRONT_FIELD_BALES = [
  [-2780, 332], [-1960, 343], [-1260, 328], [-610, 340], [55, 334],
  [685, 347], [1480, 333], [2120, 345], [2900, 329], [3760, 340],
  // Four requested accents in the expanded field, clear of the meadow fringe.
  [-310, 398], [285, 389], [1040, 383], [1770, 386],
].map(([x, y], i) => ({ id: `front-field-${i}`, x, depth: (y - 208) / 78 }));

export const FIELD_HAY_BALES = [
  { id: 'far-west', x: -1150, depth: .08 },
  { id: 'far-west-pair', x: -760, depth: .16 },
  { id: 'far-central', x: 380, depth: .07 },
  { id: 'far-east-central', x: 740, depth: .13 },
  { id: 'far-east', x: 1080, depth: .10 },
  { id: 'far-east-pair', x: 1750, depth: .15 },
  { id: 'far-outer', x: 2300, depth: .18 },
  { id: 'mid-west', x: -580, depth: .43 },
  { id: 'mid-cut', x: -240, depth: .54 },
  { id: 'mid-cut-inner', x: 270, depth: .44 },
  { id: 'mid-central', x: 780, depth: .49 },
  { id: 'mid-east', x: 1120, depth: .51 },
  { id: 'mid-outer', x: 1580, depth: .58 },
  { id: 'mid-cut-satellite', x: -90, depth: .39 },
  { id: 'mid-east-satellite', x: 1320, depth: .45 },
  { id: 'near-west', x: -440, depth: .90 },
  { id: 'near-cut-inner', x: 230, depth: .92 },
  { id: 'near-central', x: 880, depth: .86 },
  { id: 'near-east-inner', x: 1160, depth: .96 },
  { id: 'near-east', x: 1470, depth: .94 },
  { id: 'near-outer', x: 1960, depth: .99 },
  ...FRONT_FIELD_BALES,
].sort((a, b) => a.depth - b.depth);

export const FIELD_SCARECROWS = [
  { id: 'far', x: 475, depth: .25, shirt: '#8f7961' },
  { id: 'middle', x: 840, depth: .48, shirt: '#78836a' },
  { id: 'near', x: 1070, depth: .84, shirt: '#a47757' },
] as const;
