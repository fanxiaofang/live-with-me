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
    // Phase 2.1: each depth tier has its own anchor rhythm —
    // no tier may read as a scaled copy of another.
    far: {
      id: 'ridge-far',
      depth: 'far',
      // Long, slow, low-amplitude upland silhouette: few crests, wide spans,
      // minimal local undulation (7 anchors over the full 6000px world).
      anchors: [
        { x: -2400, y: 196 }, { x: -1250, y: 176 }, { x: -200, y: 186 },
        { x: 720, y: 166 }, { x: 1550, y: 180 }, { x: 2450, y: 170 },
        { x: 3600, y: 194 },
      ],
      baseline: 500,
      fill: 'hillGreenFar',
      opacity: 1.0,
    },
    midFar: {
      id: 'ridge-mid-far',
      depth: 'mid-far',
      // Broader fell shoulders with two asymmetric rises (left one dominant),
      // deliberately uneven anchor spacing so the waveform never repeats.
      anchors: [
        { x: -2400, y: 244 }, { x: -1600, y: 200 }, { x: -1080, y: 170 },
        { x: -480, y: 218 }, { x: 200, y: 232 }, { x: 820, y: 186 },
        { x: 1350, y: 212 }, { x: 2100, y: 228 }, { x: 2900, y: 214 },
        { x: 3600, y: 242 },
      ],
      baseline: 500,
      fill: 'hillGreenMid',
      opacity: 1.0,
    },
    mid: {
      id: 'ridge-mid',
      depth: 'mid',
      // Terrain-specific: gentle rise behind the farm belt, shallow dip,
      // then climbs to meet the communication hill leftAnchor (660,252),
      // falling away again behind it. Not a copy of the far waveform.
      anchors: [
        { x: -2400, y: 258 }, { x: -1500, y: 236 }, { x: -760, y: 252 },
        { x: -220, y: 238 }, { x: 160, y: 254 }, { x: 470, y: 246 },
        { x: 660, y: 252 }, { x: 920, y: 266 }, { x: 1250, y: 280 },
        { x: 1800, y: 254 }, { x: 2600, y: 268 }, { x: 3600, y: 280 },
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
    leftShoulder: { x: -320, y: 240 }, // Gentle left slope, slightly higher
    rightShoulder: { x: 368, y: 236 }, // Phase 2.1: wider & lower than left — mild asymmetry
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
    // Phase 2.1: the two banks are deliberately unequal in character —
    // west bank = long, soft, compound descent; east bank = short, firm rise.
    westBank: {
      crest: { x: -1010, y: 232 },  // Far western upland — pushed further west for a longer run
      toe: { x: -680, y: 480 },     // Valley floor edge
      width: 330,                   // Long horizontal run of the descent
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
      toe: { x: -450, y: 372 },     // Where valley meets central fields
      crest: { x: -338, y: 440 },   // Rising back to field level — short & firm
      width: 112,
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
    // Phase 2.1: longer west shoulder, tighter east falloff — mild asymmetry
    // baked into the explicit Bézier silhouette in TerrainSilhouette.
    ridge: {
      leftAnchor: { x: 660, y: 252 },   // Meets the mid ridge anchor of the same position
      leftShoulder: { x: 806, y: 168 }, // Long, gentle west shoulder
      summit: { x: 895, y: 88 },        // Preserved station position
      rightShoulder: { x: 950, y: 172 }, // Tighter east falloff
      rightAnchor: { x: 1130, y: 288 },
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
    topEdge: [
      { x: -2400, y: 648 }, { x: -1050, y: 616 }, { x: -540, y: 590 },
      { x: -260, y: 566 }, { x: -40, y: 540 }, { x: 230, y: 532 },
      { x: 540, y: 502 }, { x: 850, y: 486 }, { x: 1250, y: 498 },
      { x: 2100, y: 522 }, { x: 3600, y: 538 },
    ],
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
