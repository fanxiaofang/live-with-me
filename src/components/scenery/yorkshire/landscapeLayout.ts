/**
 * 🗺️ YORKSHIRE LANDSCAPE SPATIAL CONTRACT & LAYOUT DEFINITION
 *
 * Phase 2: Semantic terrain skeleton parameters.
 * All major landforms are defined by control points and anchors,
 * not raw SVG path strings.
 */

// ─────────────────────────────────────────────────────────────────────────────
// DEBUG: Development-only terrain visualization (never expose to users)
// ─────────────────────────────────────────────────────────────────────────────
export const DEBUG_TERRAIN = false;

export const YORKSHIRE_LAYOUT = {
  scene: {
    viewBox: '0 0 1200 800',
    origin: { x: 600, y: 400 },
    horizonY: 145,
    midgroundY: 350,
    foregroundY: 600,
    worldBounds: {
      minX: -2400,
      maxX: 3600,
      minY: 0,
      maxY: 2400,
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🏔️ DISTANT RIDGES: 3-layer depth hierarchy (far / mid-far / mid)
  // ───────────────────────────────────────────────────────────────────────────
  distantRidges: {
    far: {
      id: 'ridge-far',
      depth: 'far',
      // Low-contrast, soft, layered upland silhouettes
      anchors: [
        { x: -2400, y: 200 }, { x: -1200, y: 170 }, { x: -600, y: 210 },
        { x: -200, y: 160 }, { x: 180, y: 145 }, { x: 420, y: 172 },
        { x: 680, y: 132 }, { x: 940, y: 158 }, { x: 1240, y: 140 },
        { x: 1520, y: 165 }, { x: 2200, y: 145 }, { x: 2900, y: 170 },
        { x: 3600, y: 200 },
      ],
      baseline: 500,
      fill: 'hillGreenFar',
      opacity: 1.0,
    },
    midFar: {
      id: 'ridge-mid-far',
      depth: 'mid-far',
      // Broader Yorkshire fell shapes, more presence
      anchors: [
        { x: -2400, y: 220 }, { x: -1200, y: 190 }, { x: -600, y: 230 },
        { x: -150, y: 185 }, { x: 240, y: 178 }, { x: 560, y: 198 },
        { x: 880, y: 168 }, { x: 1240, y: 192 }, { x: 1520, y: 182 },
        { x: 2200, y: 190 }, { x: 2900, y: 195 }, { x: 3600, y: 220 },
      ],
      baseline: 500,
      fill: 'hillGreenMid',
      opacity: 1.0,
    },
    mid: {
      id: 'ridge-mid',
      depth: 'mid',
      // Rolling landforms connecting toward communication hill and farm
      anchors: [
        { x: -2400, y: 235 }, { x: -1200, y: 210 }, { x: -600, y: 245 },
        { x: -150, y: 210 }, { x: 240, y: 185 }, { x: 560, y: 210 },
        { x: 880, y: 180 }, { x: 1240, y: 212 }, { x: 1520, y: 195 },
        { x: 2200, y: 210 }, { x: 2900, y: 220 }, { x: 3600, y: 235 },
      ],
      baseline: 400,
      fill: 'wheatFar',
      opacity: 1.0,
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🏡 CENTRAL LANDFORM: One coherent natural terrace beneath/behind house
  // ───────────────────────────────────────────────────────────────────────────
  mainTerrace: {
    // House sits at local (0,0); terrace extends outward in world space
    houseLocalCenter: { x: 0, y: 0 },
    crown: { x: 0, y: 150 },           // Broad crown beneath/behind house
    leftShoulder: { x: -320, y: 240 }, // Gentle left slope
    rightShoulder: { x: 340, y: 230 }, // Gentle right slope
    frontEdge: { x: 0, y: 420 },       // Visible but not abrupt front drop
    lowerSlope: { x: 0, y: 580 },      // Natural transition into middle fields
    rearRise: { x: 0, y: 100 },        // Slight rise behind house
    // ~80% natural terrain, ~20% visible retaining structure
    exposedStone: {
      entranceSteps: { anchor: { x: 0, y: 465 }, tiers: 4 },
      wicketGate: { anchor: { x: 0, y: 465 }, postsWidth: 130 },
      // Limited stonework at front edge only
      frontRetaining: { yTop: 420, yBottom: 465, segments: 3 },
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🌊 RIVER VALLEY: Broad west-side valley with embedded river
  // ───────────────────────────────────────────────────────────────────────────
  riverValley: {
    region: 'west-valley',
    // Valley structure: westBank descends → valleyFloor → eastBank rises
    westBank: {
      crest: { x: -850, y: 210 },   // Far western upland
      toe: { x: -680, y: 480 },     // Valley floor edge
      width: 170,
    },
    valleyFloor: {
      centerline: [
        { x: -510, y: 218 }, { x: -595, y: 248 }, { x: -675, y: 438 },
        { x: -552, y: 750 }, { x: -680, y: 770 },
      ],
      width: 120,
      depth: 25, // Visual depth below surrounding terrain
    },
    eastBank: {
      toe: { x: -460, y: 370 },     // Where valley meets central fields
      crest: { x: -310, y: 480 },   // Rising back to field level
      width: 150,
    },
    ducksAnchor: { x: -640, y: 480 },
    pebbles: [
      { cx: -605, cy: 270, rx: 9, ry: 5 },
      { cx: -595, cy: 274, rx: 6, ry: 3.2 },
      { cx: -690, cy: 420, rx: 12, ry: 6.5 },
      { cx: -535, cy: 630, rx: 14, ry: 7.5 },
    ],
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 📡 COMMUNICATION HILL: Part of larger rear-right ridge system
  // ───────────────────────────────────────────────────────────────────────────
  communicationHill: {
    // Station sits on a natural high point of a broader ridge
    summit: { x: 895, y: 88 },
    // Ridge connection: midground ridge → raised shoulder → summit
    ridge: {
      leftAnchor: { x: 740, y: 240 },
      leftShoulder: { x: 820, y: 160 },
      summit: { x: 895, y: 88 },
      rightShoulder: { x: 980, y: 150 },
      rightAnchor: { x: 1180, y: 280 },
    },
    // Slightly asymmetric, wind-shaped summit
    summitSkew: -0.15, // Lean slightly left
    base: { x: 895, y: 320 },
    station: {
      center: { x: 895, y: 88 },
      radioCabin: { x: -40, y: 2 },
      parabolicDish: { x: 16, y: 2 },
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🌾 PASTURE PARCELS (preserved for Phase 3, not redesigned now)
  // ───────────────────────────────────────────────────────────────────────────
  pastureParcels: {
    westBeckField: {
      id: 'field-west-beck',
      polygon: '-720,440 -460,370 -310,480 -560,640',
      bounds: { minX: -720, maxX: -310, minY: 370, maxY: 640 },
    },
    centralSunnySlope: {
      id: 'field-central-slope',
      polygon: '-310,480 0,510 260,490 200,690 -160,720',
      bounds: { minX: -310, maxX: 260, minY: 480, maxY: 720 },
    },
    eastHillsideFell: {
      id: 'field-east-fell',
      polygon: '260,490 580,440 760,480 620,720 200,690',
      bounds: { minX: 200, maxX: 760, minY: 440, maxY: 720 },
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🧱 DRYSTONE WALLS (preserved for Phase 3, not redesigned now)
  // ───────────────────────────────────────────────────────────────────────────
  drystoneWalls: {
    westWall: {
      id: 'wall-west',
      segments: [
        { start: { x: -720, y: 440 }, end: { x: -460, y: 370 } },
        { start: { x: -460, y: 370 }, end: { x: -310, y: 480 } },
      ],
    },
    eastWall: {
      id: 'wall-east',
      segment1: { start: { x: 260, y: 490 }, end: { x: 440, y: 460 } },
      gateAnchor: { x: 440, y: 452 },
      segment2: { start: { x: 498, y: 467 }, end: { x: 680, y: 435 } },
    },
    observatoryWall: {
      id: 'wall-observatory',
      path: 'M740,240 C800,260 880,270 980,270',
      ascentStepsAnchor: { x: 800, y: 225 },
    },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🚂 RAILWAY (preserved, not redesigned)
  // ───────────────────────────────────────────────────────────────────────────
  railway: {
    anchor: { x: -160, y: 224 },
    deck: { minX: -430, maxX: 85, y: 180, height: 7 },
    piers: [-385, -315, -245, -175, -105, -35, 35],
    tunnelPortal: { x: 82, y: 158 },
    locomotive: { x: -140, y: 168 },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🚜 WEST FARM (preserved, not redesigned)
  // ───────────────────────────────────────────────────────────────────────────
  westFarm: {
    anchor: { x: 110, y: 220 },
    tractor: { x: 110, y: 220 },
    paddockFence: { minX: -55, maxX: 115, y: 18 },
    hayBales: { x: -32, y: 22 },
    pumpkinPatch: { x: -120, y: 395 },
    woodpile: { x: -130, y: 330 },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🌿 FOREGROUND SLOPE: Gentle depth progression from terrace to bottom
  // ───────────────────────────────────────────────────────────────────────────
  foregroundSlope: {
    centralTerrace: { yTop: 420, yBottom: 520 },
    middlePasture: { yTop: 520, yBottom: 620 },
    lowerForeground: { yTop: 620, yBottom: 800 },
    // Visual quietness: foreground should be simpler than house area
    contourInterval: 45,
    benchAnchor: { x: 295, y: 452 },
    sheepFlock: [
      { id: 'sheep-1', name: '西侧河畔啃草羊', x: -420, y: 460, scale: 0.95, quoteIndex: 0, hoverText: '🐑 约克郡黑脸羊 · 在西侧开阔草场安静吃草（点击互动）' },
      { id: 'sheep-2', name: '中景草场安睡羊', x: -50, y: 610, scale: 1.0, quoteIndex: 1, hoverText: '🐑 约克郡黑脸羊 · 在向阳草坡上惬意打盹（点击互动）' },
      { id: 'sheep-3', name: '东侧草场母羊', x: 360, y: 560, scale: 1.0, quoteIndex: 2, hoverText: '🐑 约克郡母羊 · 在牧场大门旁照看着小羊（点击互动）' },
      { id: 'sheep-4', name: '欢脱小羊羔', x: 410, y: 575, scale: 0.68, quoteIndex: 3, hoverText: '🐑 雀跃小羊羔 · 活蹦乱跳的黑脸小羊羔（点击互动）' },
      { id: 'sheep-5', name: '山麓探头小羊', x: 640, y: 420, scale: 0.75, quoteIndex: 4, hoverText: '🐑 山麓小羊 · 静立在石墙边迎风远眺（点击互动）' },
    ],
  },
} as const;

export type YorkshireLayout = typeof YORKSHIRE_LAYOUT;

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Build SVG path from anchor points using cubic Bézier smoothing
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Build a smooth SVG path through anchor points (Catmull-Rom → cubic Bézier).
 * If `baseline` is provided, the path is closed along the given Y baseline.
 */
export function anchorsToPath(
  anchors: readonly { x: number; y: number }[],
  baseline?: number
): string {
  if (anchors.length < 2) return '';
  const pts = [...anchors];
  let d = `M${pts[0].x},${pts[0].y}`;

  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
  }

  if (baseline !== undefined) {
    d += ` L${pts[pts.length - 1].x},${baseline} L${pts[0].x},${baseline} Z`;
  }
  return d;
}
