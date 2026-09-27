/**
 * 📐 LiveWithMeProjection — Phase 0 extraction artifact
 *
 * AUDIT + EXTRACTION ONLY.
 * No component in the production scene imports this file. It exists so a new
 * project (e.g. a grass prototype) can draw ground that matches the existing
 * live-with-me buildings WITHOUT redefining its own isometric convention.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHERE THESE NUMBERS COME FROM (nothing here is assumed)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The project does NOT use a standard 2:1 isometric projection.
 * The ground slope constant is ±0.283088 (≈ ±15.806°), and it is written
 * explicitly in the source in three independent places:
 *
 *   1. src/components/architecture/TimberFlooring.tsx
 *        floor rhombus: `-272,135 0,58 272,135 0,212`
 *        documented comment:
 *          宽轴向斜率 (width axis)  +0.283088  (dx=272, dy=77)
 *          深轴向斜率 (depth axis)  -0.283088  (dx=272, dy=-77)
 *   2. src/components/architecture/CottageFoundation.tsx
 *        `0.283088 * px` used for pier posts, rim beam pegs and pebble rows
 *   3. src/components/layout-gizmo/isoMath.ts   (independent subsystem)
 *        `X = u*1.0 + v*0.8`, `Y = -0.2852*u + 0.228*v - w`
 *        → |slope| 0.2852 and 0.228/0.8 = 0.2850  (≈ 0.1° away from the house)
 *
 * The main house floor is used as the numeric source because it is the only
 * asset that exposes a rigorous ground-plane rhombus. The left cabin is kept
 * as the calibration ASSET (it is what a new project places on the ground),
 * but it is drawn as a front-elevation 2.5D object and exposes no ground-plane
 * edges — see `confidence` and the accompanying spec doc.
 */

export interface ScreenVector {
  x: number;
  y: number;
}

export interface ScreenPoint {
  x: number;
  y: number;
}

/** Scale demo / dev overlay consumers use this to draw a ground grid. */
export interface GroundProjection {
  /** Screen direction of one ground unit along ground axis A. */
  axisA: ScreenVector;
  /** Screen direction of one ground unit along ground axis B. */
  axisB: ScreenVector;
  /** Screen direction of one scene unit straight up. */
  vertical: ScreenVector;
}

/**
 * Project a ground-plane coordinate (a, b) in scene units, at height h,
 * to a screen/scene-space offset. Matches the contract above exactly.
 */
export function projectGround(
  a: number,
  b: number,
  h = 0,
  projection: GroundProjection = LIVE_WITH_ME_PROJECTION_AXES
): ScreenPoint {
  return {
    x: a * projection.axisA.x + b * projection.axisB.x,
    y: a * projection.axisA.y + b * projection.axisB.y - h,
  };
}

/** The three axes, factored out so `projectGround` can default to them. */
export const LIVE_WITH_ME_PROJECTION_AXES: GroundProjection = {
  axisA: { x: 0.96219, y: 0.272379 },
  axisB: { x: 0.96219, y: -0.272379 },
  vertical: { x: 0, y: -1 },
};

export const LIVE_WITH_ME_PROJECTION = {
  /**
   * Which asset the numbers were measured from, and which asset a new project
   * should actually place on top of the ground.
   */
  source: {
    /** The asset a new project copies into its own scene and stands on the ground. */
    calibrationAsset: 'WoodenCabinHaven (左侧独立安睡小木屋)',
    calibrationAssetFile: 'src/components/architecture/WoodenCabinHaven.tsx',
    /** Instanced here, inside the camera group: */
    calibrationAssetInstance: 'src/components/ThreeWorld.tsx',
    calibrationAssetInstanceLine: 3759,

    /**
     * The asset the ground AXES were actually measured from. It is the only
     * asset with a rigorous, explicitly documented ground-plane rhombus.
     */
    axisSourceAsset: 'TimberFlooring + CottageFoundation (主屋木地板 / 碎石散水基底)',
    axisSourceFile: 'src/components/architecture/TimberFlooring.tsx',

    /** Independent cross-check that agrees to ≈0.1°. */
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

  ground: {
    axisA: { x: 0.96219, y: 0.272379 },
    axisB: { x: 0.96219, y: -0.272379 },

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
  },

  vertical: {
    axis: { x: 0, y: -1 },
    angleDeg: -90,
    /** Walls, chimneys, posts, door frames are all exactly screen-vertical. */
    isPureScreenVertical: true,
  },

  calibration: {
    /**
     * CABIN — the asset a new project places on the ground.
     *
     * local (0, 55.5) is the bottom centre of the stone plinth: the point where
     * the cabin's solid geometry meets the ground plane.
     */
    cabin: {
      component: 'WoodenCabinHaven',
      file: 'src/components/architecture/WoodenCabinHaven.tsx',
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
       * Visible GROUND CONTACT outline — the stone plinth base.
       * NOTE: this is a front-elevation contact band, not a plan-view rhombus.
       * Its "depth" is the plinth face height, NOT the building's plan depth.
       */
      footprint: [
        { x: -62, y: 44 },
        { x: 62, y: 44 },
        { x: 64, y: 55.5 },
        { x: -64, y: 55.5 },
      ],
      footprintCenter: { x: 0, y: 49.75 },
      footprintWidthVisual: 126,
      footprintDepthVisual: 11.5,
      /** Cannot be derived: the cabin is drawn as a front elevation. */
      footprintPlanDepth: null,

      /** Corroboration for the anchor: the welcome stepping stones sit here. */
      corroboration: 'cabin-stepping-stones at scene (216,396)…(240,412)',
    },

    /** MAIN HOUSE — used as the axis source and cross-check. */
    mainHouse: {
      component: 'TimberFlooring + CottageFoundation',
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
        'NOT MEASURABLE as an angle. The cabin is a hand-drawn front-elevation ' +
        '2.5D asset: its base is a horizontal band with an axis-aligned elliptical ' +
        'contact shadow, and its side roof slope is ±32.5° while its interior ' +
        'floor edge is ≈-66°. It exposes no ground-plane edge pair, so no ' +
        'ground-axis angle can be extracted from it.',
      verdict: 'structural-mismatch',
    },
    mainHouseVsLayoutGizmo: {
      axisAAngleDeg: 0.119,
      axisBAngleDeg: 0.1,
      note:
        'isoMath.ts uses |slope| 0.2852 (u) and 0.2850 (v) vs the house 0.283088. ' +
        'Angles agree within ≈0.12°, BUT the gizmo applies an extra x ' +
        'foreshortening on its depth axis (cosV = 0.8 against cosU = 1.0), ' +
        'whereas the house axes have equal x extent (272 : 272).',
      verdict: 'shared-contract-with-locale-tolerance',
    },
    thresholdDeg: 3,
    exceedsThreshold: false,
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
     * A convenient visual module for texturing / grid spacing.
     * = main house floor width (544) / 4.
     */
    GROUND_UNIT: 136,
    references: {
      mainHouseFloorWidth: 544,
      mainHouseFloorDepth: 154,
      mainHousePlankPitch: 9.625,
      cabinFootprintWidth: 126,
      cabinFootprintVisibleDepth: 11.5,
    },
  },

  confidence: {
    groundAxes: 'high — explicit documented constant in 2 files + 1 agreeing subsystem',
    groundAnchor: 'high — corroborated by the welcome stepping stones',
    cabinFootprint: 'medium — visible contact band only; plan depth not derivable',
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
