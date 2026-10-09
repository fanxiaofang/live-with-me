/** Geometry anchors used by the production railway and stone walls. Building placement is owned by world/scene/sceneLayout. */
export const YORKSHIRE_LAYOUT = {
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
      // The eastern meadow entrance meets the existing low stone wall.
      gateAnchor: { x: 1176, y: 178 },
      stoneWallAnchor: { x: 1230, y: 196 },
      segment2: { start: { x: 498, y: 467 }, end: { x: 680, y: 435 } },
    },
    observatoryWall: {
      id: 'wall-observatory',
      path: 'M740,240 C800,260 880,270 980,270',
      ascentStepsAnchor: { x: 800, y: 225 },
    },
  },
railway: {
    anchor: { x: -160, y: 224 },
    deck: { minX: -760, maxX: 56, y: 175, height: 7 },
    piers: [-685, -580, -475, -370, -265, -160, -55],
    tunnelPortal: { x: 58, y: 148 },
    locomotive: { x: -140, y: 163 },
  }
} as const;
