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

// The crop edge and its fence share these exact Bézier segments.
const WHEAT_BACK_EDGE = [
  [-3200, 212, -2400, 195, -1600, 225, -800, 205],
  [-800, 205, -200, 190, 350, 208, 920, 185],
  [920, 185, 1500, 170, 2100, 202, 2800, 188],
  [2800, 188, 3500, 180, 3900, 202, 4200, 192],
] as const;

export function wheatBackEdgePath() {
  return `M ${WHEAT_BACK_EDGE[0][0]},${WHEAT_BACK_EDGE[0][1]} ${WHEAT_BACK_EDGE.map(
    ([, , x1, y1, x2, y2, x3, y3]) => `C ${x1},${y1} ${x2},${y2} ${x3},${y3}`,
  ).join(' ')}`;
}

export function wheatBoundaryFencePosts() {
  return WHEAT_BACK_EDGE.flatMap(([x0, y0, x1, y1, x2, y2, x3, y3], segment) => {
    const count = Math.ceil((x3 - x0) / 48);
    return Array.from({ length: count + (segment === WHEAT_BACK_EDGE.length - 1 ? 1 : 0) }, (_, i) => {
      const t = i / count, u = 1 - t;
      return {
        x: u ** 3 * x0 + 3 * u ** 2 * t * x1 + 3 * u * t ** 2 * x2 + t ** 3 * x3,
        y: u ** 3 * y0 + 3 * u ** 2 * t * y1 + 3 * u * t ** 2 * y2 + t ** 3 * y3,
      };
    });
  });
}

/** A crop margin on level ground: small vegetation offsets, without a raised lip. */
export function meadowGroundPath() {
  return `M -4000,186 C -3000,182 -2000,189 -1100,184
    C -800,183 -550,180 -340,181 l 28,-1 32,1 24,-1
    C -110,178 30,180 140,179 l 32,1 24,-1 30,1
    C 360,178 500,179 625,180 l 26,-1 34,1 30,-1
    C 850,180 980,181 1090,181 l 28,1 24,-1 36,1
    C 1310,181 1450,183 1570,183 l 30,-1 26,1 34,-1
    C 2100,184 2700,188 3300,187 C 4200,185 5100,190 6000,188
    L 6000,2600 L -4000,2600 Z`;
}

export function mountainApronPath(frontExtension = 0) {
  const y = (value: number) => extended(value, frontExtension);
  return `M -3200,160 C -2400,135 -1600,170 -800,145 C -250,132 200,152 650,132 C 1150,122 1650,152 2350,132 C 3150,122 3750,148 4200,138 L 4200,${y(255)} C 3450,${y(268)} 2550,${y(248)} 1750,${y(258)} C 950,${y(238)} 150,${y(252)} -650,${y(242)} C -1450,${y(258)} -2350,${y(242)} -3200,${y(252)} Z`;
}

export function rollingWheatPath(frontExtension = 0) {
  const y = (value: number) => extended(value, frontExtension);
  return `${wheatBackEdgePath()} L 4200,${y(385)} C 3400,${y(375)} 2400,${y(390)} 1500,${y(370)} C 600,${y(355)} -300,${y(380)} -1200,${y(365)} C -2100,${y(380)} -2700,${y(365)} -3200,${y(375)} Z`;
}
