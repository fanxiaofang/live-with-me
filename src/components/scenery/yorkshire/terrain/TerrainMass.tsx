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
 * - Central landform: quick left shoulder rise, longer rolling right shoulder
 * - Western slope: firm drop into the valley floor, long soft climb to the crest
 * - Eastern shoulder: rises toward the communication hill left anchor
 * - Foreground: lower west, central descending slope, higher east shoulder
 * - No decorative elements (walls, trails, trees, stones, sheep tracks)
 */
export const TerrainMass: React.FC<YorkshireCommonProps> = ({ theme, className }) => {
  const terrace = YORKSHIRE_LAYOUT.mainTerrace;
  const valley = YORKSHIRE_LAYOUT.riverValley;
  const hill = YORKSHIRE_LAYOUT.communicationHill;
  const fg = YORKSHIRE_LAYOUT.foregroundSlope;

  // Central landform: explicit Bézier — left shoulder rises fairly directly,
  // right shoulder rolls longer and lazier (asymmetric rhythm, not mirrored).
  const centralLandformPath = `
    M-420,320
    C-388,294 -356,260 ${terrace.leftShoulder.x},${terrace.leftShoulder.y}
    C-258,203 -132,152 ${terrace.crown.x},${terrace.crown.y}
    C118,147 258,180 ${terrace.rightShoulder.x},${terrace.rightShoulder.y}
    C436,272 486,290 520,300
    L520,800 L-420,800 Z
  `;

  // Western valley slope: explicit Bézier — firm east-side drop from the
  // central fields into the valley floor, then a long, soft compound climb
  // up to the far western crest (concave bench, then convex shoulder).
  const westValleySlopePath = `
    M-420,320
    C-442,348 -450,360 ${valley.eastBank.toe.x},${valley.eastBank.toe.y}
    C-540,452 -612,470 ${valley.westBank.toe.x},${valley.westBank.toe.y}
    C-806,498 -938,362 ${valley.westBank.crest.x},${valley.westBank.crest.y}
    L${valley.westBank.crest.x},800 L-420,800 Z
  `;

  // Eastern shoulder: rises toward the communication hill left anchor (660,252),
  // then continues up the long west shoulder of the hill ridge.
  const eastShoulderPath = `
    M520,300
    C562,288 610,272 ${hill.ridge.leftAnchor.x},${hill.ridge.leftAnchor.y}
    C700,236 760,206 ${hill.ridge.leftShoulder.x},${hill.ridge.leftShoulder.y}
    L${hill.ridge.leftShoulder.x},800 L520,800 Z
  `;

  // Foreground: ONE uneven landform from the topEdge anchors —
  // lower west foreground, central descending slope, higher east shoulder.
  const foregroundPath = anchorsToPath(fg.topEdge, 800);

  return (
    <g id="yorkshire-terrain-mass" className={className}>
      <defs>
        {/* Central terrace turf: warm, sunlit, slightly elevated */}
        <linearGradient id="terraceTurfGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a3b84e" />
          <stop offset="40%" stopColor="#8ba43f" />
          <stop offset="75%" stopColor="#6b8332" />
          <stop offset="100%" stopColor="#4e6324" />
        </linearGradient>

        {/* Western valley slope: cooler, shaded, descending */}
        <linearGradient id="westValleyGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#7a9438" />
          <stop offset="50%" stopColor="#5f7a2e" />
          <stop offset="100%" stopColor="#465e22" />
        </linearGradient>

        {/* Eastern shoulder: rising toward ridge */}
        <linearGradient id="eastShoulderGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8ba43f" />
          <stop offset="50%" stopColor="#7a9438" />
          <stop offset="100%" stopColor="#5a7048" />
        </linearGradient>

        {/* Foreground: one uneven landform — cooler/lower toward the west,
            warming and rising through the east shoulder */}
        <linearGradient id="foregroundGrad" x1="0" y1="0" x2="1" y2="0.25">
          <stop offset="0%" stopColor="#5f772e" />
          <stop offset="45%" stopColor="#7a9438" />
          <stop offset="78%" stopColor="#86a344" />
          <stop offset="100%" stopColor="#7a9438" />
        </linearGradient>
      </defs>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. CENTRAL LANDFORM: Broad crown, gentle shoulders, natural drop   */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        id="central-landform"
        d={centralLandformPath}
        fill="url(#terraceTurfGrad)"
      />

      {/* Subtle contour shading on the crown */}
      <path
        d={anchorsToPath([
          { x: -380, y: 335 },
          { x: terrace.leftShoulder.x + 40, y: terrace.leftShoulder.y + 20 },
          { x: terrace.crown.x, y: terrace.crown.y + 30 },
          { x: terrace.rightShoulder.x - 40, y: terrace.rightShoulder.y + 20 },
          { x: 480, y: 320 },
        ])}
        fill="#8ba43f"
        opacity={0.4}
      />

      {/* Front edge shading: natural drop, not cliff */}
      <path
        d={anchorsToPath([
          { x: terrace.leftShoulder.x + 20, y: terrace.frontEdge.y - 40 },
          { x: terrace.crown.x, y: terrace.frontEdge.y - 20 },
          { x: terrace.rightShoulder.x - 20, y: terrace.frontEdge.y - 40 },
        ])}
        fill="#5a7030"
        opacity={0.35}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. WESTERN VALLEY SLOPE: Descends toward river                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        id="west-valley-slope"
        d={westValleySlopePath}
        fill="url(#westValleyGrad)"
        opacity={0.88}
      />

      {/* Valley floor shadow (subtle, not decorative) */}
      <path
        d={anchorsToPath([
          { x: valley.valleyFloor.centerline[2].x - 30, y: valley.valleyFloor.centerline[2].y },
          { x: valley.valleyFloor.centerline[2].x, y: valley.valleyFloor.centerline[2].y + 10 },
          { x: valley.valleyFloor.centerline[3].x, y: valley.valleyFloor.centerline[3].y },
        ])}
        fill="#3a4a28"
        opacity={0.3}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. EASTERN SHOULDER: Rises toward communication hill               */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        id="east-shoulder"
        d={eastShoulderPath}
        fill="url(#eastShoulderGrad)"
        opacity={0.9}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. FOREGROUND: one uneven landform, no stacked strips              */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        id="foreground-slope"
        d={foregroundPath}
        fill="url(#foregroundGrad)"
      />

      {/* Central descending slope: soft shading where the land falls
          from the terrace front toward the viewer (diagonal, not a band) */}
      <path
        id="central-descent-shade"
        d="M-170,552 C-70,606 30,654 108,714 C56,748 -30,752 -100,728 C-158,700 -214,628 -170,552 Z"
        fill="#4e6324"
        opacity={0.16}
      />

      {/* Contour strokes that follow the land: west runs with the valley
          descent, center falls toward the viewer, east climbs the shoulder */}
      <g id="foreground-contours" opacity={0.3}>
        <path d="M-470,612 C-392,632 -306,646 -230,664" fill="none" stroke="#9cb84a" strokeWidth="1.2" />
        <path d="M-60,586 C-8,634 44,680 84,728" fill="none" stroke="#9cb84a" strokeWidth="1.2" />
        <path d="M556,540 C636,524 728,512 822,504" fill="none" stroke="#a8c055" strokeWidth="1.2" />
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
          <circle cx={valley.valleyFloor.centerline[2].x} cy={valley.valleyFloor.centerline[2].y} r={5} fill="#00ccff" opacity={0.7} />
          <circle cx={hill.ridge.leftAnchor.x} cy={hill.ridge.leftAnchor.y} r={5} fill="#ffaa00" opacity={0.7} />
        </g>
      )}
    </g>
  );
};
