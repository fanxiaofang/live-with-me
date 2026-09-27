/**
 * 📐 LiveWithMeProjection — Phase 0 extraction artifact
 *    (Phase 0.1: SEMANTIC CLEANUP — naming / semantics / contract boundaries only)
 *
 * AUDIT + EXTRACTION ONLY.
 * No component in the production scene imports this file. It exists so a new
 * project (e.g. a grass prototype) can draw ground that matches the existing
 * live-with-me buildings WITHOUT redefining its own isometric convention.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️ READ THIS FIRST — THERE IS NO SINGLE UNIVERSAL PROJECTION
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * This project does NOT have one unified world→screen camera. Two separate,
 * deliberately UNMERGED contracts exist:
 *
 *   A. VISUAL_GROUND_PROJECTION          → ground authoring
 *      Source : TimberFlooring.tsx + CottageFoundation.tsx
 *      Use for: terrain, grass, paths, roads, fences, dry-stone walls,
 *               platforms, building ground planes, future grass prototype.
 *      This is a VISUAL AUTHORING CONTRACT, not a full 3D camera.
 *
 *   B. INTERACTION_GIZMO_PROJECTION_REFERENCE   → gizmo / manipulation
 *      Source : src/components/layout-gizmo/isoMath.ts
 *      Use for: the layout gizmo only (project / unproject furniture).
 *      Its angles are close to (A) — ≈0.1° — BUT it applies an extra
 *      x-foreshortening on the depth axis (cosV = 0.8 vs cosU = 1.0).
 *      This is an INTERACTION / MANIPULATION CONTRACT.
 *
 * (B) is stored here as extraction metadata only. Do NOT duplicate, replace,
 * modify, or unify with isoMath.ts, and never make the production gizmo import
 * from this file.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHERE THE VISUAL GROUND NUMBERS COME FROM (nothing here is assumed)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Not a standard 2:1 isometric. The ground slope constant is ±0.283088
 * (≈ ±15.806°) and is written explicitly in the source:
 *
 *   1. src/components/architecture/TimberFlooring.tsx
 *        floor rhombus: `-272,135 0,58 272,135 0,212`
 *        documented comment:
 *          宽轴向斜率 (width axis)  +0.283088  (dx=272, dy=77)
 *          深轴向斜率 (depth axis)  -0.283088  (dx=272, dy=-77)
 *   2. src/components/architecture/CottageFoundation.tsx
 *        `0.283088 * px` used for pier posts, rim beam pegs and pebble rows
 *   3. src/components/layout-gizmo/isoMath.ts   (independent subsystem, see B)
 *
 * ASSET ROLES — these two roles must never be conflated:
 *
 *   WoodenCabinHaven                        → ANCHOR REFERENCE ONLY
 *       A hand-drawn front-elevation 2.5D asset. It exposes NO reliable
 *       ground-plane edge pair, so it is NOT an axis source. Its value is its
 *       reliable ground anchor (where it touches the ground).
 *
 *   TimberFlooring + CottageFoundation      → VISUAL GROUND AXIS SOURCE
 *       The main house complex is the only rigorous, documented axonometric
 *       ground-plane in the project. All axis numbers come from here.
 */

export interface ScreenVector {
  x: number;
  y: number;
}

export interface ScreenPoint {
  x: number;
  y: number;
}

/** Minimal shape `projectGround` needs. */
export interface GroundProjection {
  /** Screen direction of one ground unit along ground axis A. */
  axisA: ScreenVector;
  /** Screen direction of one ground unit along ground axis B. */
  axisB: ScreenVector;
  /** Screen direction of one scene unit straight up. */
  vertical: ScreenVector;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * A. VISUAL_GROUND_PROJECTION — the ground authoring contract
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * STATUS:
 *   CURRENT VISUAL CONTRACT.
 *   NOT YET FROZEN AS A FUTURE WORLD_PROJECTION.
 *
 * A future Projection Decision Prototype may compare this legacy ±15.806°
 * against standard 2:1 isometric (±26.565°) or other candidates. Until then
 * this describes the CURRENT state of the project only — it is deliberately
 * NOT named FINAL_WORLD_PROJECTION / WORLD_PROJECTION_V1 / CANONICAL_PROJECTION.
 *
 * Space: plain SVG user space inside ThreeWorld's `#panoramic-world-stage`.
 * 1 scene unit === 1 SVG user unit. There is no metric scale.
 */
export const VISUAL_GROUND_PROJECTION = {
  id: 'visual-ground',
  status: 'CURRENT VISUAL CONTRACT — NOT YET FROZEN AS FUTURE WORLD_PROJECTION',
  contract: 'VISUAL AUTHORING CONTRACT (not a full 3D camera)',

  axisA: { x: 0.96219, y: 0.272379 },
  axisB: { x: 0.96219, y: -0.272379 },
  vertical: { x: 0, y: -1 },

  /** Both ≈15.806°. NOT 26.565° (that would be standard 2:1 isometric). */
  axisAAngleDeg: 15.806,
  axisBAngleDeg: -15.806,

  /** Raw un-normalised edge vectors, exactly as they appear in the source. */
  axisARaw: { x: 272, y: 77 },
  axisBRaw: { x: 272, y: -77 },

  /** |dy/dx| for both axes. This is the project's real ground constant. */
  slopeMagnitude: 0.283088,

  /** The two ground axes are mirror-symmetric: equal x extent, equal |slope|. */
  symmetric: true,

  /** Where these numbers were measured. NOT the cabin. */
  axisSource: {
    role: 'VISUAL GROUND AXIS SOURCE',
    asset: 'TimberFlooring + CottageFoundation (主屋木地板 / 碎石散水基底)',
    file: 'src/components/architecture/TimberFlooring.tsx',
    supportingFile: 'src/components/architecture/CottageFoundation.tsx',
    documentedConstant: 0.283088,
    /** The explicit ground-plane rhombus the axes are read from. */
    floorRhombus: [
      { x: -272, y: 135 },
      { x: 0, y: 58 },
      { x: 272, y: 135 },
      { x: 0, y: 212 },
    ],
  },

  /** Assets that must NOT be treated as an axis source. */
  notAxisSource: {
    asset: 'WoodenCabinHaven (左侧独立安睡小木屋)',
    file: 'src/components/architecture/WoodenCabinHaven.tsx',
    role: 'ANCHOR REFERENCE ONLY',
    reason:
      'Hand-drawn front-elevation 2.5D asset. Its base is a horizontal band with '
      + 'an axis-aligned elliptical contact shadow; its roof is a symmetric front '
      + 'gable (±32.5°) while its interior floor edge is ≈-66° and its interior '
      + 'side wall top edge is +26.565° (2:1) — self-contradictory. It exposes no '
      + 'ground-plane edge pair, so it cannot yield a ground-axis angle.',
  },
} as const;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * B. INTERACTION_GIZMO_PROJECTION_REFERENCE — extraction metadata only
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Extracted from src/components/layout-gizmo/isoMath.ts:
 *
 *   X_screen = u * 1.0     + v * 0.8
 *   Y_screen = u * -0.2852 + v * 0.228 - w
 *
 * |slope|: u = 0.2852, v = 0.228 / 0.8 = 0.2850 → both ≈15.9°, i.e. ≈0.1° from
 * VISUAL_GROUND_PROJECTION. BUT the depth axis carries an extra x-foreshortening
 * (cosV = 0.8 against cosU = 1.0), whereas the main house axes have equal x
 * extent (272 : 272). The two are therefore NOT the same matrix and must not be
 * merged.
 *
 * Do NOT duplicate isoMath's implementation, do NOT replace it, do NOT modify
 * it, and do NOT let production gizmo code import this file.
 */
export const INTERACTION_GIZMO_PROJECTION_REFERENCE = {
  id: 'interaction-gizmo',
  role: 'INTERACTION / MANIPULATION CONTRACT (reference metadata only)',
  sourceFile: 'src/components/layout-gizmo/isoMath.ts',
  consumer: 'layout gizmo (furniture project / unproject)',
  cosU: 1.0,
  sinU: -0.2852,
  cosV: 0.8,
  sinV: 0.228,
  /** det = cosU*sinV - cosV*sinU */
  det: 0.45616,
  note:
    'Angles agree with VISUAL_GROUND_PROJECTION within ≈0.1°, but the depth axis '
    + 'has extra x-foreshortening (cosV 0.8 vs cosU 1.0). Keep separate. This is '
    + 'NOT the ground projection a new grass prototype should implement.',
  notFor: [
    'terrain',
    'grass',
    'paths / roads',
    'fences / dry-stone walls',
    'platforms',
    'anything outside the layout gizmo',
  ],
} as const;

/**
 * Project a ground-plane coordinate (a, b) in scene units, at height h,
 * to a screen/scene-space offset.
 *
 * Defaults to VISUAL_GROUND_PROJECTION — this helper exists for future GROUND
 * work (terrain, grass, roads, walls, platforms). It intentionally does NOT
 * default to the gizmo reference.
 */
export function projectGround(
  a: number,
  b: number,
  h = 0,
  projection: GroundProjection = VISUAL_GROUND_PROJECTION
): ScreenPoint {
  return {
    x: a * projection.axisA.x + b * projection.axisB.x,
    y: a * projection.axisA.y + b * projection.axisB.y - h,
  };
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Audit / spec metadata container
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * This is documentation-shaped data, NOT a universal projection object.
 * If you want to DRAW ground, use VISUAL_GROUND_PROJECTION, not this container.
 */
export const LIVE_WITH_ME_PROJECTION = {
  /**
   * Which asset a new project copies into its own scene and stands on the
   * ground, vs. which asset the axes were measured from.
   */
  source: {
    /** Role of each asset — never swap these two. */
    assetRoles: {
      anchorReferenceOnly: 'WoodenCabinHaven (左侧独立安睡小木屋)',
      visualGroundAxisSource: 'TimberFlooring + CottageFoundation (主屋木地板 / 碎石散水基底)',
    },

    /** The asset a new project places on the ground. NOT an axis source. */
    calibrationAsset: 'WoodenCabinHaven (左侧独立安睡小木屋)',
    calibrationAssetRole: 'ANCHOR REFERENCE ONLY',
    calibrationAssetFile: 'src/components/architecture/WoodenCabinHaven.tsx',
    calibrationAssetInstance: 'src/components/ThreeWorld.tsx',
    calibrationAssetInstanceLine: 3759,

    /** The asset the ground AXES were actually measured from. */
    axisSourceAsset: 'TimberFlooring + CottageFoundation (主屋木地板 / 碎石散水基底)',
    axisSourceRole: 'VISUAL GROUND AXIS SOURCE',
    axisSourceFile: 'src/components/architecture/TimberFlooring.tsx',

    /** Independent cross-check that agrees to ≈0.1° (different contract, see B). */
    crossCheckFile: 'src/components/layout-gizmo/isoMath.ts',

    /** Documented constant as written in the source. */
    sourceSlopeConstant: 0.283088,
  },

  /**
   * Scene/world space is the coordinate system INSIDE
   * ThreeWorld's `<g id="panoramic-world-stage">`. It is plain SVG user space:
   * 1 scene unit === 1 SVG user unit. There is no separate world→SVG scale.
   */
  space: {
    coordinateSystem: 'SVG user space inside #panoramic-world-stage',
    viewBox: '0 0 1200 800',
    preserveAspectRatio: 'xMidYMid slice',
    /** Camera is applied as a CSS transform on the stage group. */
    camera: {
      transform: 'translate(camX, camY) scale(zoom)',
      transformOrigin: '600px 400px',
      overview: { x: 0, y: 135, zoom: 0.66 },
      zoomRange: { min: 0.45, max: 2.5 },
    },
    /**
     * scene → viewport (before device pixel ratio):
     *   viewBox = (scene - (600,400)) * zoom + (600,400) + (camX,camY)
     *   then `slice`-fit the 1200x800 viewBox into the viewport.
     * Verified: puts the cabin base at ≈(466,626) in a 1600x900 viewport,
     * which matches the real screenshot.
     */
  },

  /** Ground authoring contract (see VISUAL_GROUND_PROJECTION above). */
  visualGround: {
    projection: VISUAL_GROUND_PROJECTION,
    /** Flat aliases for convenience — same facts, same numbers. */
    axisA: VISUAL_GROUND_PROJECTION.axisA,
    axisB: VISUAL_GROUND_PROJECTION.axisB,
    axisAAngleDeg: VISUAL_GROUND_PROJECTION.axisAAngleDeg,
    axisBAngleDeg: VISUAL_GROUND_PROJECTION.axisBAngleDeg,
    slopeMagnitude: VISUAL_GROUND_PROJECTION.slopeMagnitude,
  },

  /** Gizmo/manipulation contract — reference metadata only. */
  interactionGizmo: INTERACTION_GIZMO_PROJECTION_REFERENCE,

  vertical: {
    axis: { x: 0, y: -1 },
    angleDeg: -90,
    /** Walls, chimneys, posts, door frames are all exactly screen-vertical. */
    isPureScreenVertical: true,
  },

  calibration: {
    /**
     * CABIN — ANCHOR REFERENCE ONLY (NOT a projection axis source).
     *
     * local (0, 55.5) is the bottom centre of the stone plinth: the point where
     * the cabin's solid geometry meets the ground plane.
     */
    cabin: {
      component: 'WoodenCabinHaven',
      file: 'src/components/architecture/WoodenCabinHaven.tsx',
      role: 'ANCHOR REFERENCE ONLY — NOT a visual ground axis source',
      /** Transform chain, outermost first. */
      transformChain: [
        { target: '#panoramic-world-stage', transform: 'camera (translate + scale)' },
        { target: '#wooden-cabin-cluster', transform: 'translate(60, 0)' },
        { target: '#wooden-cabin-haven', transform: 'none' },
        { target: '#room-corn_lounge', transform: 'translate(160, 340)' },
      ],
      /** Effective origin of the cabin body inside scene space. */
      originScene: { x: 220, y: 340 },

      groundAnchorLocal: { x: 0, y: 55.5 },
      groundAnchorScene: { x: 220, y: 395.5 },

      /**
       * ⚠️ contactBand — the VISIBLE GROUND CONTACT BAND of the stone plinth as
       * seen in the front elevation. This is NOT a plan-view building footprint.
       *
       * DO NOT use contactBand as a building exclusion polygon. Grass-tuft
       * avoidance, collision, and road-avoidance logic must NOT treat this as
       * real building extent.
       *
       * Note `contactBandHeightVisual` is the visible plinth face height — it is
       * NOT a depth and must not be read as the building's plan depth.
       */
      contactBand: [
        { x: -62, y: 44 },
        { x: 62, y: 44 },
        { x: 64, y: 55.5 },
        { x: -64, y: 55.5 },
      ],
      contactBandCenter: { x: 0, y: 49.75 },
      contactBandWidthVisual: 126,
      contactBandHeightVisual: 11.5,

      /**
       * The cabin does not expose a reliable plan-view footprint.
       * Do NOT use contactBand as a building exclusion polygon.
       */
      planFootprint: null,

      /** Corroboration for the anchor: the welcome stepping stones sit here. */
      corroboration: 'cabin-stepping-stones at scene (216,396)…(240,412)',
    },

    /** MAIN HOUSE — the VISUAL GROUND AXIS SOURCE. */
    mainHouse: {
      component: 'TimberFlooring + CottageFoundation',
      role: 'VISUAL GROUND AXIS SOURCE',
      floorRhombus: [
        { x: -272, y: 135 },
        { x: 0, y: 58 },
        { x: 272, y: 135 },
        { x: 0, y: 212 },
      ],
      floorCenter: { x: 0, y: 135 },
      gravelSwale: [
        { x: -292, y: 145 },
        { x: 0, y: 62 },
        { x: 292, y: 145 },
        { x: 0, y: 236 },
      ],
      gravelSwaleCenter: { x: 0, y: 149 },
      /** Swale is outset ~20 scene units beyond the floor rhombus. */
      swaleOutset: 20,
      floorWidthVisual: 544,
      floorDepthVisual: 154,
      plankPitch: 9.625,
    },
  },

  /** Cabin vs main house vs layout-gizmo. */
  drift: {
    cabinVsMainHouse: {
      axisAAngleDeg: null,
      axisBAngleDeg: null,
      note:
        'NOT MEASURABLE as an angle. The cabin is a hand-drawn front-elevation '
        + '2.5D asset with no ground-plane edge pair, so no ground-axis angle can '
        + 'be extracted from it. The cabin is an anchor reference, never a '
        + 'projection axis source.',
      verdict: 'structural-mismatch',
    },
    mainHouseVsLayoutGizmo: {
      axisAAngleDeg: 0.119,
      axisBAngleDeg: 0.1,
      note:
        'isoMath.ts uses |slope| 0.2852 (u) and 0.2850 (v) vs the house 0.283088. '
        + 'Angles agree within ≈0.12°, BUT the gizmo applies an extra x '
        + 'foreshortening on its depth axis (cosV = 0.8 against cosU = 1.0), '
        + 'whereas the house axes have equal x extent (272 : 272). Two related '
        + 'but distinct contracts — do not merge them into one matrix.',
      verdict: 'related-contracts-not-identical',
      thresholdDeg: 3,
      exceedsThreshold: false,
    },
  },

  /**
   * No real-world unit exists anywhere in the project. Scene units are SVG
   * user units; the only scale is the camera zoom plus the viewBox fit.
   */
  scale: {
    worldScale: null,
    worldScaleNote: 'No metric or gameplay-world scale is defined in the source.',

    visualScaleUnit: 'SVG user unit inside #panoramic-world-stage',

    /**
     * ⚠️ VISUAL_GROUND_UNIT is an AUTHORING CONVENIENCE ONLY.
     * It is NOT a world unit, meter, gameplay unit, projection unit, or any
     * physical scale. It is simply main-house floor width (544) / 4, offered as
     * a handy module for grid spacing and texture tiling.
     */
    VISUAL_GROUND_UNIT: 136,
    VISUAL_GROUND_UNIT_NOTE:
      'AUTHORING CONVENIENCE ONLY — 544 / 4. Not a world/meter/gameplay/'
      + 'projection/physical unit.',

    references: {
      mainHouseFloorWidth: 544,
      mainHouseFloorDepth: 154,
      mainHousePlankPitch: 9.625,
      cabinContactBandWidth: 126,
      cabinContactBandHeight: 11.5,
    },
  },

  confidence: {
    visualGroundAxes: 'high — explicit documented constant in 2 files, ≈0.1° agreement with isoMath',
    groundAnchor: 'high — corroborated by the welcome stepping stones',
    cabinContactBand: 'medium — visible contact band only; plan footprint not derivable',
    verticalAxis: 'high — every wall/post/chimney edge is screen-vertical',
    classification: 'B',
  },

  classificationNote:
    'B — a partial projection helper exists (layout-gizmo/isoMath.ts is a real '
    + 'invertible projection) and the main house complex documents and reuses '
    + 'slope 0.283088 explicitly, with ≈0.1° agreement between the two. But there '
    + 'is no single shared camera/helper consumed by the scene: each asset '
    + 're-implements or hand-corrects the constant, the gizmo uses a different '
    + 'depth-axis x-foreshortening, and peripheral assets (the cabin) are '
    + 'hand-drawn front-elevation 2.5D with no ground-plane rhombus at all.',
} as const;

export type LiveWithMeProjection = typeof LIVE_WITH_ME_PROJECTION;
