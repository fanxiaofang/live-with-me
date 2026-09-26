/**
 * 🗺️ YORKSHIRE LANDSCAPE SPATIAL CONTRACT & LAYOUT DEFINITION
 *
 * Single shared layout source establishing semantic spatial anchors,
 * coordinates, elevations, and scene regions.
 *
 * Strictly preserves current composition and coordinates during Phase 1 (Visual Freeze).
 */

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

  // 🏡 Main House (Homestead Cottage)
  mainHouse: {
    center: { x: 540, y: 210 },
    localCenter: { x: 0, y: 0 },
    footprint: {
      width: 600,
      depth: 300,
      yBase: 150,
    },
    elevation: 38,
  },

  // 🏰 Main Terrace (Stone Bastion & Retaining Wall)
  mainTerrace: {
    center: { x: 0, y: 300 },
    bounds: { minX: -300, maxX: 320, minY: 150, maxY: 515 },
    plinth: {
      pointsTop: '-300,150 0,62 300,150 0,242',
      depth: 38,
    },
    curvedWall: {
      westSpan: 'M-280,260 C-260,350 -200,435 -65,465',
      eastSpan: 'M65,465 C200,435 280,350 320,260',
      wallHeight: 26,
    },
    steps: {
      anchor: { x: 0, y: 465 },
      tiers: 4,
    },
    wicketGate: {
      anchor: { x: 0, y: 465 },
      postsWidth: 130,
    },
  },

  // 🌊 River Valley (Far-Left Beck & Meander)
  riverValley: {
    region: 'west-valley',
    anchor: { x: -600, y: 450 },
    corridor: [
      { x: -510, y: 218 },
      { x: -595, y: 248 },
      { x: -675, y: 438 },
      { x: -552, y: 750 },
      { x: -680, y: 770 },
    ],
    bounds: { minX: -850, maxX: -460, minY: 210, maxY: 800 },
    ducksAnchor: { x: -640, y: 480 },
    pebbles: [
      { cx: -605, cy: 270, rx: 9, ry: 5 },
      { cx: -595, cy: 274, rx: 6, ry: 3.2 },
      { cx: -690, cy: 420, rx: 12, ry: 6.5 },
      { cx: -535, cy: 630, rx: 14, ry: 7.5 },
    ],
  },

  // 🌾 Pasture Parcels (Patchwork Dales Fields)
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

  // 🧱 Drystone Boundary Walls
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

  // 🚂 Railway Infrastructure (Ribblehead Stone Viaduct)
  railway: {
    anchor: { x: -160, y: 224 },
    deck: { minX: -430, maxX: 85, y: 180, height: 7 },
    piers: [-385, -315, -245, -175, -105, -35, 35],
    tunnelPortal: { x: 82, y: 158 },
    locomotive: { x: -140, y: 168 },
  },

  // 🚜 West Farm & Agricultural Ground
  westFarm: {
    anchor: { x: 110, y: 220 },
    tractor: { x: 110, y: 220 },
    paddockFence: { minX: -55, maxX: 115, y: 18 },
    hayBales: { x: -32, y: 22 },
    pumpkinPatch: { x: -120, y: 395 },
    woodpile: { x: -130, y: 330 },
  },

  // 📡 Communication Hill & Summit Radio Station
  communicationHill: {
    center: { x: 895, y: 88 },
    bounds: { minX: 740, maxX: 1180, minY: 72, maxY: 310 },
    peakElevation: 88,
    rockCragAnchor: { x: 0, y: 0 },
    terraceDeck: { x: 0, y: 20 },
    radioCabin: { x: -40, y: 2 },
    parabolicDish: { x: 16, y: 2 },
  },

  // 🏔️ Distant Ridges & Silhouettes
  distantRidges: {
    mountainRange1: {
      horizonY: 145,
      path: 'M-2400,200 Q-1200,170 -600,210 Q-200,160 180,145 Q420,172 680,132 Q940,158 1240,140 Q1520,165 2200,145 Q2900,170 3600,200 L3600,500 L-2400,500 Z',
    },
    mountainRange2: {
      horizonY: 180,
      path: 'M-2400,220 Q-1200,190 -600,230 Q-150,185 240,178 Q560,198 880,168 Q1240,192 1520,182 2200,190 Q2900,195 3600,220 L3600,500 L-2400,500 Z',
    },
    wheatSlopes: {
      horizonY: 210,
      path: 'M-2400,235 Q-1200,210 -600,245 Q-150,210 240,185 Q560,210 Q880,180 1240,212 Q1520,195 2200,210 Q2900,220 3600,235 L3600,400 Q2600,340 1800,320 Q1240,280 860,265 Q480,270 160,280 Q-150,290 -600,295 Q-1200,310 -2400,330 Z',
    },
    upperTerrace: {
      horizonY: 270,
      path: 'M-2400,270 Q-1200,275 -600,280 C-200,265 160,248 420,244 C720,250 1020,238 1350,258 C1580,270 2200,275 3600,280 L3600,450 C2400,440 1400,375 1060,360 C740,350 460,345 180,335 C-100,325 -360,315 -600,310 C-1200,315 -2400,320 Z',
    },
  },

  // 🌿 Foreground Slope & Dressing
  foregroundSlope: {
    bounds: { minX: -2400, maxX: 3600, minY: 490, maxY: 2400 },
    benchAnchor: { x: 295, y: 452 },
    sheepFlock: [
      {
        id: 'sheep-1',
        name: '西侧河畔啃草羊',
        x: -420,
        y: 460,
        scale: 0.95,
        quoteIndex: 0,
        hoverText: '🐑 约克郡黑脸羊 · 在西侧开阔草场安静吃草（点击互动）',
      },
      {
        id: 'sheep-2',
        name: '中景草场安睡羊',
        x: -50,
        y: 610,
        scale: 1.0,
        quoteIndex: 1,
        hoverText: '🐑 约克郡黑脸羊 · 在向阳草坡上惬意打盹（点击互动）',
      },
      {
        id: 'sheep-3',
        name: '东侧草场母羊',
        x: 360,
        y: 560,
        scale: 1.0,
        quoteIndex: 2,
        hoverText: '🐑 约克郡母羊 · 在牧场大门旁照看着小羊（点击互动）',
      },
      {
        id: 'sheep-4',
        name: '欢脱小羊羔',
        x: 410,
        y: 575,
        scale: 0.68,
        quoteIndex: 3,
        hoverText: '🐑 雀跃小羊羔 · 活蹦乱跳的黑脸小羊羔（点击互动）',
      },
      {
        id: 'sheep-5',
        name: '山麓探头小羊',
        x: 640,
        y: 420,
        scale: 0.75,
        quoteIndex: 4,
        hoverText: '🐑 山麓小羊 · 静立在石墙边迎风远眺（点击互动）',
      },
    ],
  },
} as const;

export type YorkshireLayout = typeof YORKSHIRE_LAYOUT;
