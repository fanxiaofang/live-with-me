/** Vertical envelopes of the authored Bézier terrain, before projection. */
export const LANDSCAPE_SURFACES = {
  backgroundOffsetY: -115,
  mountainApronFrontMinY: 238,
  wheatBackMaxY: 225,
  wheatFrontMinY: 355,
  meadowBackMaxY: 190,
  overlap: 8,
} as const;

const extended = (y: number, extension: number) => Number((y + extension).toFixed(4));

export function mountainApronPath(frontExtension = 0) {
  const y = (value: number) => extended(value, frontExtension);
  return `M -3200,160 C -2400,135 -1600,170 -800,145 C -250,132 200,152 650,132 C 1150,122 1650,152 2350,132 C 3150,122 3750,148 4200,138 L 4200,${y(255)} C 3450,${y(268)} 2550,${y(248)} 1750,${y(258)} C 950,${y(238)} 150,${y(252)} -650,${y(242)} C -1450,${y(258)} -2350,${y(242)} -3200,${y(252)} Z`;
}

export function rollingWheatPath(frontExtension = 0) {
  const y = (value: number) => extended(value, frontExtension);
  return `M -3200,212 C -2400,195 -1600,225 -800,205 C -200,190 350,208 920,185 C 1500,170 2100,202 2800,188 C 3500,180 3900,202 4200,192 L 4200,${y(385)} C 3400,${y(375)} 2400,${y(390)} 1500,${y(370)} C 600,${y(355)} -300,${y(380)} -1200,${y(365)} C -2100,${y(380)} -2700,${y(365)} -3200,${y(375)} Z`;
}
