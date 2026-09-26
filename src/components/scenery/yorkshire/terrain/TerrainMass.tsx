import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT, anchorsToPath, DEBUG_TERRAIN } from '../landscapeLayout';

/**
 * ⛰️ TerrainMass (Central Landform, Western Valley Slope, Eastern Shoulder, Foreground)
 *
 * Layer: 02 TERRAIN MASS
 * Spatial Region: YORKSHIRE_LAYOUT.scene.worldBounds & mainTerrace & foregroundSlope
 *
 * Phase 2 redesign: the terrain itself carries the composition.
 * Phase 2.1 rhythm correction: the major masses use explicit cubic Bézier
 * sections with distinct rhythms (not one shared spline language), and the
 * foreground is a single uneven landform instead of stacked horizontal bands.
 * Phase 2.3 visual recomposition: the large smooth masses now carry
 * SECONDARY LANDFORM VOLUME —
 *   - the central crown is smaller and more concentrated, so the house reads
 *     as embedded in a local rise rather than on a broad green stage;
 *   - a small number of broad secondary terrain planes (left shoulder shadow,
 *     sunlit upper slope, darker lower front slope) give the mass volume
 *     without reverting to a polygon collage or low-poly facets;
 *   - the western valley slope opens through a shallow mid-bank bench;
 *   - the eastern shoulder flows out into the communication ridge base;
 *   - the foreground gains a lower shadow basin and a soft lateral shoulder.
 * Still no decorative elements (walls, trails, trees, stones, sheep tracks).
 *
 * Phase 2.4 — scope reduced to MIDGROUND + PLAYSPACE terrain only.
 * The distant countryside is no longer this component's job; it belongs to
 * `BackgroundYorkshireMatte`. Everything here now stays inside the playable
 * window (see foregroundSlope.extent) instead of spanning the whole 6000px
 * world as giant flat surfaces:
 *   - main house local rise + nearby central slope
 *   - western valley shoulder near gameplay
 *   - local east shoulder rising to the communication hill base
 *   - foreground slope
 */
export const TerrainMass: React.FC<YorkshireCommonProps> = ({ theme, className }) => {
  const terrace = YORKSHIRE_LAYOUT.mainTerrace;
  const valley = YORKSHIRE_LAYOUT.riverValley;
  const fg = YORKSHIRE_LAYOUT.foregroundSlope;

  // ── Central landform ────────────────────────────────────────────────────
  // Tight, concentrated crown; clearly readable left and right shoulders;
  // a natural front drop. The hierarchy is crown → shoulders → front slope,
  // so the house sits on a LOCAL rise, not a wide flat stage.
  const centralLandformPath = `
    M-460,358
    C-400,330 -340,300 ${terrace.leftShoulder.x},${terrace.leftShoulder.y}
    C-190,232 -112,196 ${terrace.crown.x},${terrace.crown.y}
    C140,180 232,218 ${terrace.rightShoulder.x},${terrace.rightShoulder.y}
    C412,296 478,312 552,326
    L552,800 L-460,800 Z
  `;

  // ── Western valley slope ────────────────────────────────────────────────
  // Long upper west slope → shallow mid-bank bench → narrow floor. The
  // bench keeps the mouth of the valley open and stops it reading as a
  // sharply carved wedge.
  const westValleySlopePath = `
    M-460,358
    C-486,382 -504,398 ${valley.eastBank.toe.x},${valley.eastBank.toe.y}
    C-636,452 -706,472 ${valley.westBank.bench.x},${valley.westBank.bench.y}
    C-848,438 -882,414 ${valley.westBank.toe.x},${valley.westBank.toe.y}
    C-900,458 -960,432 ${valley.westBank.crest.x},${valley.westBank.crest.y}
    L${valley.westBank.crest.x},800 L-460,800 Z
  `;

  // ── Eastern shoulder ────────────────────────────────────────────────────
  // Flows east out of the central mass and settles into the communication
  // ridge base — a high shoulder that supports the ridge rather than a
  // separate hill. Metres of rise, broad and calm.
  const eastShoulderPath = `
    M552,326
    C684,310 806,296 924,294
    C1046,292 1168,304 1290,320
    L1290,800 L552,800 Z
  `;

  // ── Secondary terrain planes (volume, not parcels) ──────────────────────
  // Three broad organic planes maximum. Each is a large calm curve, never a
  // facet or tessellated polygon; they read as light falling across volume.

  // 1. Softer shadow plane on the left shoulder
  const leftShadowPlanePath = `
    M-440,392
    C-382,346 -318,300 ${terrace.leftShoulder.x},${terrace.leftShoulder.y}
    C-196,242 -132,222 -68,208
    C-78,282 -118,344 -186,392
    C-278,436 -358,450 -440,446 Z
  `;

  // 2. Sunlit plane on the central upper slope
  const sunlitUpperPlanePath = `
    M-68,208
    C-32,184 -4,172 ${terrace.crown.x},${terrace.crown.y}
    C112,176 214,208 ${terrace.rightShoulder.x},${terrace.rightShoulder.y}
    C270,286 190,300 118,282
    C54,266 6,242 -68,208 Z
  `;

  // 3. Darker lower front slope plane
  const frontLowerPlanePath = `
    M-206,472
    C-96,510 40,542 176,554
    C304,564 412,562 486,554
    C452,632 306,672 132,668
    C-44,664 -172,606 -206,472 Z
  `;

  // ── Foreground ──────────────────────────────────────────────────────────
  // ONE uneven landform from the topEdge anchors — lower west foreground,
  // central descending slope, higher east shoulder. No stacked strips.
  const foregroundPath = anchorsToPath(fg.topEdge, 800);

  // Lower shadow basin: broad, soft darkening low in the foreground.
  const foregroundBasinPath = `
    M-620,692
    C-420,742 -180,768 40,764
    C250,760 420,740 566,710
    C468,796 200,826 -110,820
    C-330,814 -520,766 -620,692 Z
  `;

  // Soft lateral shoulder on the east side of the foreground.
  const foregroundLateralShoulderPath = `
    M520,596
    C650,578 776,566 900,562
    C1024,558 1146,562 1252,570
    C1124,634 916,664 706,660
    C624,658 560,632 520,596 Z
  `;

  return (
    <g id="yorkshire-terrain-mass" className={className}>
      <defs>
        {/* Central terrace turf: warmest, clearest green — the house rise
            sits at the front of the value hierarchy. */}
        <linearGradient id="terraceTurfGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8bd52" />
          <stop offset="38%" stopColor="#8fa946" />
          <stop offset="72%" stopColor="#708a38" />
          <stop offset="100%" stopColor="#54692a" />
        </linearGradient>

        {/* Western valley slope: cooler, shaded, descending */}
        <linearGradient id="westValleyGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7f9a3d" />
          <stop offset="50%" stopColor="#658034" />
          <stop offset="100%" stopColor="#52692c" />
        </linearGradient>

        {/* Eastern shoulder: rising toward the communication ridge */}
        <linearGradient id="eastShoulderGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8fa946" />
          <stop offset="50%" stopColor="#7f9a3d" />
          <stop offset="100%" stopColor="#6a7f4c" />
        </linearGradient>

        {/* Foreground: quieter and slightly darker than the house rise,
            but never reading as black. */}
        <linearGradient id="foregroundGrad" x1="0" y1="0" x2="1" y2="0.25">
          <stop offset="0%" stopColor="#657c33" />
          <stop offset="45%" stopColor="#7f9a3d" />
          <stop offset="78%" stopColor="#8ba546" />
          <stop offset="100%" stopColor="#7f9a3d" />
        </linearGradient>
      </defs>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. CENTRAL LANDFORM: concentrated crown, clear shoulders, front drop */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        id="central-landform"
        d={centralLandformPath}
        fill="url(#terraceTurfGrad)"
      />

      {/* Secondary plane 1 — softer shadow on the left shoulder */}
      <path
        id="plane-left-shadow"
        d={leftShadowPlanePath}
        fill="#5c7330"
        opacity={0.28}
      />

      {/* Secondary plane 2 — sunlit central upper slope */}
      <path
        id="plane-sunlit-upper"
        d={sunlitUpperPlanePath}
        fill="#b3c65e"
        opacity={0.3}
      />

      {/* Secondary plane 3 — darker lower front slope */}
      <path
        id="plane-front-lower"
        d={frontLowerPlanePath}
        fill="#4e6324"
        opacity={0.24}
      />

      {/* Crown definition: a light touch along the top of the rise so the
          local elevation reads without a hard ridge line. */}
      <path
        d={`M${terrace.leftShoulder.x + 30},${terrace.leftShoulder.y - 6}
            C-170,238 -110,202 ${terrace.crown.x},${terrace.crown.y - 4}
            C140,180 226,214 ${terrace.rightShoulder.x - 20},${terrace.rightShoulder.y - 4}`}
        fill="none"
        stroke="#bccd6a"
        strokeWidth="1.6"
        opacity={0.34}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. WESTERN VALLEY SLOPE: open mouth, mid-bank bench                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        id="west-valley-slope"
        d={westValleySlopePath}
        fill="url(#westValleyGrad)"
        opacity={0.9}
      />

      {/* Bench shelf: a soft tonal break where the slope eases off, so the
          descent has two characters instead of one continuous ramp. */}
      <path
        d={`M${valley.westBank.bench.x - 120},${valley.westBank.bench.y - 30}
            C${valley.westBank.bench.x - 40},${valley.westBank.bench.y - 10}
             ${valley.westBank.bench.x + 60},${valley.westBank.bench.y + 10}
             ${valley.westBank.bench.x + 150},${valley.westBank.bench.y + 26}
            L${valley.westBank.bench.x + 150},${valley.westBank.bench.y + 96}
            C${valley.westBank.bench.x + 40},${valley.westBank.bench.y + 84}
             ${valley.westBank.bench.x - 60},${valley.westBank.bench.y + 58}
             ${valley.westBank.bench.x - 120},${valley.westBank.bench.y + 40} Z`}
        fill="#5a7030"
        opacity={0.2}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. EASTERN SHOULDER: flows into the communication ridge base        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        id="east-shoulder"
        d={eastShoulderPath}
        fill="url(#eastShoulderGrad)"
        opacity={0.92}
      />

      {/* Broad shoulder shading so the eastern rise has volume */}
      <path
        d="M600,470 C740,452 880,446 1020,452 C1160,458 1280,470 1380,486
           L1380,700 C1240,660 1080,640 920,636 C760,632 660,646 600,660 Z"
        fill="#66804a"
        opacity={0.16}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. FOREGROUND: one uneven landform + basin + lateral shoulder       */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        id="foreground-slope"
        d={foregroundPath}
        fill="url(#foregroundGrad)"
      />

      {/* Soft lateral shoulder (east side of the foreground) */}
      <path
        id="foreground-lateral-shoulder"
        d={foregroundLateralShoulderPath}
        fill="#7d9740"
        opacity={0.26}
      />

      {/* Lower shadow basin: quiet depth low in the foreground, broad curve */}
      <path
        id="foreground-shadow-basin"
        d={foregroundBasinPath}
        fill="#4e6324"
        opacity={0.19}
      />

      {/* Central descending slope: soft shading where the land falls from the
          terrace front toward the viewer (diagonal, never a horizontal band) */}
      <path
        id="central-descent-shade"
        d="M-176,556 C-72,612 34,662 116,724 C60,760 -30,764 -104,738
           C-164,710 -222,634 -176,556 Z"
        fill="#4e6324"
        opacity={0.15}
      />

      {/* Contour strokes that follow the land: west runs with the valley
          descent, centre falls toward the viewer, east climbs the shoulder */}
      <g id="foreground-contours" opacity={0.26}>
        <path d="M-490,614 C-408,636 -318,652 -238,672" fill="none" stroke="#9cb84a" strokeWidth="1.2" />
        <path d="M-64,590 C-10,638 46,686 88,734" fill="none" stroke="#9cb84a" strokeWidth="1.2" />
        <path d="M566,544 C650,528 744,516 842,508" fill="none" stroke="#a8c055" strokeWidth="1.2" />
      </g>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* DEBUG: Terrain anchors & boundaries                                */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {DEBUG_TERRAIN && (
        <g id="debug-terrain-mass" pointerEvents="none">
          <path d={centralLandformPath} fill="none" stroke="#ff0066" strokeWidth="2" strokeDasharray="8 4" opacity={0.6} />
          <path d={westValleySlopePath} fill="none" stroke="#00ccff" strokeWidth="2" strokeDasharray="8 4" opacity={0.6} />
          <path d={eastShoulderPath} fill="none" stroke="#ffaa00" strokeWidth="2" strokeDasharray="8 4" opacity={0.6} />
          <circle cx={terrace.crown.x} cy={terrace.crown.y} r={6} fill="#ff0066" opacity={0.7} />
          <circle cx={terrace.leftShoulder.x} cy={terrace.leftShoulder.y} r={5} fill="#ff3388" opacity={0.7} />
          <circle cx={terrace.rightShoulder.x} cy={terrace.rightShoulder.y} r={5} fill="#ff3388" opacity={0.7} />
          <circle cx={terrace.frontEdge.x} cy={terrace.frontEdge.y} r={5} fill="#ff6699" opacity={0.7} />
          <circle cx={terrace.planes.leftShadow.x} cy={terrace.planes.leftShadow.y} r={4} fill="#ffd000" opacity={0.7} />
          <circle cx={terrace.planes.sunlitUpper.x} cy={terrace.planes.sunlitUpper.y} r={4} fill="#ffd000" opacity={0.7} />
          <circle cx={terrace.planes.frontLower.x} cy={terrace.planes.frontLower.y} r={4} fill="#ffd000" opacity={0.7} />
          <circle cx={valley.westBank.bench.x} cy={valley.westBank.bench.y} r={4} fill="#00ccff" opacity={0.7} />
          <circle cx={fg.shadowBasin.x} cy={fg.shadowBasin.y} r={4} fill="#00ff88" opacity={0.7} />
          <circle cx={fg.lateralShoulder.x} cy={fg.lateralShoulder.y} r={4} fill="#00ff88" opacity={0.7} />
        </g>
      )}
    </g>
  );
};
