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
 * - One coherent central landform with broad crown, gentle shoulders, natural front drop
 * - Western landmass visibly descends toward river valley
 * - Eastern landmass rises toward communication hill ridge
 * - Foreground descends gently away from house in layered pasture slopes
 * - No decorative elements (walls, trails, trees, stones, sheep tracks)
 */
export const TerrainMass: React.FC<YorkshireCommonProps> = ({ theme, className }) => {
  const terrace = YORKSHIRE_LAYOUT.mainTerrace;
  const valley = YORKSHIRE_LAYOUT.riverValley;
  const hill = YORKSHIRE_LAYOUT.communicationHill;
  const fg = YORKSHIRE_LAYOUT.foregroundSlope;

  // Central landform: broad crown beneath/behind house, gentle shoulders, natural drop
  const centralLandformPath = anchorsToPath(
    [
      { x: -420, y: 320 },   // far left approach
      { x: terrace.leftShoulder.x, y: terrace.leftShoulder.y },
      { x: terrace.crown.x, y: terrace.crown.y },
      { x: terrace.rightShoulder.x, y: terrace.rightShoulder.y },
      { x: 520, y: 300 },    // far right approach
    ],
    800
  );

  // Western valley slope: descends from central fields toward river
  const westValleySlopePath = anchorsToPath(
    [
      { x: -420, y: 320 },   // connects to central landform left edge
      { x: -460, y: 370 },   // eastBank toe
      { x: valley.valleyFloor.centerline[2].x, y: valley.valleyFloor.centerline[2].y }, // valley floor
      { x: valley.westBank.toe.x, y: valley.westBank.toe.y },
      { x: valley.westBank.crest.x, y: valley.westBank.crest.y },
    ],
    800
  );

  // Eastern shoulder: rises toward communication hill
  const eastShoulderPath = anchorsToPath(
    [
      { x: 520, y: 300 },    // connects to central landform right edge
      { x: 620, y: 280 },    // gentle rise
      { x: hill.ridge.leftAnchor.x, y: hill.ridge.leftAnchor.y },
      { x: hill.ridge.leftShoulder.x, y: hill.ridge.leftShoulder.y },
    ],
    800
  );

  // Foreground pasture slopes: gentle depth progression
  const middlePasturePath = anchorsToPath(
    [
      { x: -2400, y: fg.middlePasture.yTop },
      { x: -600, y: fg.middlePasture.yTop + 15 },
      { x: -100, y: fg.middlePasture.yTop + 8 },
      { x: 300, y: fg.middlePasture.yTop + 12 },
      { x: 720, y: fg.middlePasture.yTop + 5 },
      { x: 1200, y: fg.middlePasture.yTop + 10 },
      { x: 2200, y: fg.middlePasture.yTop },
      { x: 3600, y: fg.middlePasture.yTop + 15 },
    ],
    fg.middlePasture.yBottom
  );

  const lowerForegroundPath = anchorsToPath(
    [
      { x: -2400, y: fg.lowerForeground.yTop },
      { x: -1200, y: fg.lowerForeground.yTop + 10 },
      { x: -350, y: fg.lowerForeground.yTop + 15 },
      { x: 140, y: fg.lowerForeground.yTop + 12 },
      { x: 650, y: fg.lowerForeground.yTop + 8 },
      { x: 1180, y: fg.lowerForeground.yTop + 14 },
      { x: 2200, y: fg.lowerForeground.yTop + 10 },
      { x: 3600, y: fg.lowerForeground.yTop + 18 },
    ],
    fg.lowerForeground.yBottom
  );

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

        {/* Middle pasture: calm, rolling */}
        <linearGradient id="middlePastureGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8da848" />
          <stop offset="100%" stopColor="#6b8335" />
        </linearGradient>

        {/* Lower foreground: quieter, simpler */}
        <linearGradient id="lowerForegroundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a9438" />
          <stop offset="100%" stopColor="#5a7030" />
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
      {/* 4. FOREGROUND SLOPES: Gentle depth progression                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        id="middle-pasture"
        d={middlePasturePath}
        fill="url(#middlePastureGrad)"
      />

      <path
        id="lower-foreground"
        d={lowerForegroundPath}
        fill="url(#lowerForegroundGrad)"
      />

      {/* Subtle contour line at pasture transition (not decorative, structural) */}
      <path
        d={anchorsToPath([
          { x: -600, y: fg.middlePasture.yTop + 15 },
          { x: -100, y: fg.middlePasture.yTop + 8 },
          { x: 300, y: fg.middlePasture.yTop + 12 },
          { x: 720, y: fg.middlePasture.yTop + 5 },
        ])}
        fill="none"
        stroke="#9cb84a"
        strokeWidth="1.2"
        opacity={0.3}
      />

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
