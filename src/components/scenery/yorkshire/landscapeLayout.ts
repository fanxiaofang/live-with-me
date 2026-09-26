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
  // 🖼️ BACKGROUND MATTE: the painted distant countryside
  // ───────────────────────────────────────────────────────────────────────────
  // Phase 2.4 — hybrid background strategy.
  //
  // Responsibility split:
  //   BACKGROUND MATTE  → distant ridges, rolling fells, atmospheric depth,
  //                       far agricultural land, communication-hill context.
  //   TERRAIN SILHOUETTE→ horizon transition / haze blend only.
  //   TERRAIN MASS      → midground + playspace terrain only.
  //
  // Composed for the REAL overview camera (ThreeWorld ROOM_VIEWPORTS.overview,
  // scale 0.66). Only roughly world y ≈ 55 … 320 is visible between the sky
  // and the midground terrain silhouette, so every band is placed to read
  // inside that window. Off-screen world areas are deliberately not composed.
  //
  // Every band uses a fade-to-transparent vertical gradient instead of a flat
  // fill, which is what stops the backdrop reading as stacked colour slabs.
  backgroundMatte: {
    // Aerial-perspective wash across the whole backdrop
    atmosphere: { top: -160, horizon: 340 },

    // FAR — soft overlapping painted ridges, lowest contrast, few crests
    farBands: [
      {
        id: 'matte-far-a',
        depth: 0,
        tone: 'hillGreenFar',
        opacity: 0.5,
        baseline: 156,
        anchors: [
          { x: -2600, y: 106 }, { x: -1750, y: 84 }, { x: -950, y: 100 },
          { x: -150, y: 80 }, { x: 700, y: 98 }, { x: 1450, y: 82 },
          { x: 2200, y: 102 }, { x: 2950, y: 86 }, { x: 3700, y: 98 },
          { x: 4300, y: 88 },
        ],
      },
      {
        id: 'matte-far-b',
        depth: 1,
        tone: 'hillGreenFar',
        opacity: 0.62,
        baseline: 186,
        anchors: [
          { x: -2600, y: 126 }, { x: -1850, y: 106 }, { x: -1050, y: 122 },
          { x: -250, y: 104 }, { x: 600, y: 124 }, { x: 1350, y: 106 },
          { x: 2150, y: 126 }, { x: 2900, y: 108 }, { x: 3650, y: 122 },
          { x: 4300, y: 110 },
        ],
      },
    ],

    // MID-FAR — broader rolling fells: two asymmetric rises, uneven spacing
    midBands: [
      {
        id: 'matte-mid-a',
        depth: 2,
        tone: 'hillGreenMid',
        opacity: 0.68,
        baseline: 222,
        anchors: [
          { x: -2600, y: 152 }, { x: -1900, y: 134 }, { x: -1150, y: 150 },
          { x: -400, y: 130 }, { x: 300, y: 148 }, { x: 850, y: 132 },
          { x: 1500, y: 152 }, { x: 2100, y: 136 }, { x: 2750, y: 154 },
          { x: 3400, y: 138 }, { x: 4300, y: 156 },
        ],
      },
      {
        id: 'matte-mid-b',
        depth: 3,
        tone: 'hillGreenMid',
        opacity: 0.78,
        baseline: 262,
        anchors: [
          { x: -2600, y: 180 }, { x: -1950, y: 162 }, { x: -1250, y: 178 },
          { x: -550, y: 160 }, { x: 150, y: 176 }, { x: 750, y: 158 },
          { x: 1400, y: 178 }, { x: 2050, y: 162 }, { x: 2700, y: 182 },
          { x: 3350, y: 164 }, { x: 4300, y: 180 },
        ],
      },
    ],

    // Far agricultural land: a few very large, soft, low-contrast tonal
    // patches. Deliberately NOT parcels — no edges, no boundaries.
    farmPatches: [
      { id: 'matte-farm-a', cx: -320, cy: 244, rx: 640, ry: 72, tone: 'wheatFar', opacity: 0.2 },
      { id: 'matte-farm-b', cx: 780, cy: 258, rx: 720, ry: 82, tone: 'hillGreenNear', opacity: 0.16 },
      { id: 'matte-farm-c', cx: 1820, cy: 248, rx: 580, ry: 70, tone: 'wheatFar', opacity: 0.17 },
      { id: 'matte-farm-d', cx: 2980, cy: 256, rx: 620, ry: 76, tone: 'hillGreenNear', opacity: 0.14 },
    ],

    // Land base — guarantees no sky gap behind the midground terrain.
    landBase: { top: 236, bottom: 900 },
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🌫️ HORIZON TRANSITION: blends the painted matte into the midground
  // ───────────────────────────────────────────────────────────────────────────
  horizonTransition: {
    top: 140,
    peak: 232,
    bottom: 320,
    opacity: 0.22,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 🏡 CENTRAL LANDFORM: One coherent natural terrace beneath/behind house
  // ───────────────────────────────────────────────────────────────────────────
  mainTerrace: {
    // House sits at local (0,0); terrace extends outward in world space
    houseLocalCenter: { x: 0, y: 0 },
    // Phase 2.3: tightened the crown so the house reads as embedded in a
    // LOCAL rise instead of sitting on a giant green cushion/platform.
    crown: { x: 20, y: 168 },          // Smaller, concentrated crown under house
    leftShoulder: { x: -268, y: 268 }, // Left shoulder — clear drop-off
    rightShoulder: { x: 322, y: 262 }, // Right shoulder — mild asymmetry (lower)
    frontEdge: { x: 20, y: 430 },      // Visible but not abrupt front drop
    lowerSlope: { x: 20, y: 588 },     // Natural transition into middle fields
    rearRise: { x: 20, y: 126 },       // Slight rise behind house
    // Phase 2.3: secondary terrain planes (volume, not parcels)
    // 3 large planes max — left shadow plane, sunlit upper slope, darker front.
    planes: {
      leftShadow: { x: -300, y: 330 },   // Softer shadow plane on left shoulder
      sunlitUpper: { x: 90, y: 240 },    // Sunlit plane on central upper slope
      frontLower: { x: 130, y: 560 },    // Darker lower front slope
    },
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
    // Phase 2.1: the two banks are deliberately unequal in character —
    // west bank = long, soft, compound descent; east bank = short, firm rise.
    // Phase 2.3: broadened the valley mouth — added a shallow mid-bank bench
    // and pulled the east bank back from a sharp V-cut into a soft return.
    westBank: {
      crest: { x: -1180, y: 246 },  // Far western upland — pushed further west for a longer run
      bench: { x: -960, y: 360 },   // Shallow mid-bank bench (softens the descent)
      toe: { x: -780, y: 500 },     // Valley floor edge — further west, wider mouth
      width: 400,                   // Long horizontal run of the descent
    },
    valleyFloor: {
      centerline: [
        { x: -560, y: 232 }, { x: -650, y: 260 }, { x: -740, y: 452 },
        { x: -620, y: 760 }, { x: -740, y: 778 },
      ],
      width: 130,
      depth: 25, // Visual depth below surrounding terrain
    },
    eastBank: {
      toe: { x: -520, y: 410 },     // Where valley meets central fields — pulled west, softer
      crest: { x: -420, y: 470 },   // Rising back to field level — gentle, not a wall
      width: 100,
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
    // Ridge connection: midground ridge → raised shoulder → communication summit
    // Phase 2.3: re-composed as a broad high SHOULDER (not a dark triangle) —
    // long rising west shoulder → broad high shoulder → small summit platform
    // → shorter east descent. Wide enough to ground the station naturally.
    ridge: {
      // Phase 2.3: re-anchored onto the raised mid ridge so the hill reads as
      // a high shoulder of a larger fell, not a detached mound. The summit
      // (station position) is unchanged.
      leftAnchor: { x: 600, y: 172 },    // Meets the mid ridge (west end)
      leftShoulder: { x: 760, y: 142 },  // Long rising west shoulder
      highShoulder: { x: 830, y: 120 },  // Broad high shoulder before summit
      summit: { x: 895, y: 104 },        // Slightly softened — no sharp apex
      rightShoulder: { x: 960, y: 122 }, // Shorter east descent
      rightAnchor: { x: 1160, y: 204 },
    },
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
  // 🌿 FOREGROUND SLOPE: One uneven landform, not stacked strips
  // ───────────────────────────────────────────────────────────────────────────
  foregroundSlope: {
    centralTerrace: { yTop: 420, yBottom: 520 },
    // Phase 2.1: single top edge replacing the old horizontal bands —
    // slightly lower west foreground, central descending slope,
    // higher east shoulder rising toward the communication hill base.
    // Phase 2.4: EXTENT REDUCED to the playable/midground window. TerrainMass
    // must no longer span the whole 6000px world as one giant flat surface —
    // everything beyond this range belongs to the painted background matte.
    extent: { minX: -1600, maxX: 2600 },
    topEdge: [
      { x: -1600, y: 632 }, { x: -1050, y: 616 }, { x: -540, y: 590 },
      { x: -260, y: 566 }, { x: -40, y: 540 }, { x: 230, y: 532 },
      { x: 540, y: 502 }, { x: 850, y: 486 }, { x: 1250, y: 498 },
      { x: 2100, y: 522 }, { x: 2600, y: 530 },
    ],
    contourInterval: 45,
    benchAnchor: { x: 295, y: 452 },
    // Phase 2.3: subtle depth via terrain only (no parcels) —
    // one lower shadow basin + one soft lateral shoulder.
    shadowBasin: { x: -120, y: 690 },
    lateralShoulder: { x: 760, y: 620 },
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
