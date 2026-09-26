import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT, anchorsToPath, DEBUG_TERRAIN } from '../landscapeLayout';

/**
 * 🏔️ TerrainSilhouette (Distant Ridge System — 3-Layer Depth Hierarchy)
 *
 * Layer: 01 TERRAIN SILHOUETTE
 * Spatial Region: YORKSHIRE_LAYOUT.distantRidges
 *
 * Phase 2 redesign: replaces flat ridge bands with a clear depth system.
 * - FAR: soft, low-contrast upland silhouettes
 * - MID-FAR: broader Yorkshire fell shapes
 * - MID: rolling landforms connecting toward communication hill & farm
 *
 * Atmospheric depth comes from value compression & simpler shapes, not blur.
 */
export const TerrainSilhouette: React.FC<YorkshireCommonProps> = ({ theme, className }) => {
  const ridges = YORKSHIRE_LAYOUT.distantRidges;

  // Resolve theme color keys to actual hex values
  const resolveColor = (key: string): string => {
    const map: Record<string, string> = {
      hillGreenFar: theme.hillGreenFar,
      hillGreenMid: theme.hillGreenMid,
      hillGreenNear: theme.hillGreenNear,
      wheatFar: theme.wheatFar,
      wheatNear: theme.wheatNear,
      skyBottom: theme.skyBottom,
    };
    return map[key] || theme.hillGreenFar;
  };

  return (
    <g id="yorkshire-terrain-silhouette" className={className}>
      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* LAYER 1: FAR — soft, low-contrast ridge silhouettes                  */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        d={anchorsToPath(ridges.far.anchors, ridges.far.baseline)}
        fill={resolveColor(ridges.far.fill)}
        opacity={0.55}
      />

      {/* Atmospheric haze between far and mid-far */}
      <path
        d={anchorsToPath(ridges.far.anchors, 350)}
        fill={theme.skyBottom}
        opacity={0.22}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* LAYER 2: MID-FAR — broader Yorkshire fell shapes                     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        d={anchorsToPath(ridges.midFar.anchors, ridges.midFar.baseline)}
        fill={resolveColor(ridges.midFar.fill)}
        opacity={0.78}
      />

      {/* Subtle atmospheric glaze on mid-far */}
      <path
        d={anchorsToPath(ridges.midFar.anchors, 380)}
        fill={theme.skyBottom}
        opacity={0.14}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* LAYER 3: MID — rolling landforms connecting to midground           */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        d={anchorsToPath(ridges.mid.anchors, ridges.mid.baseline)}
        fill={resolveColor(ridges.mid.fill)}
        opacity={0.92}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* COMMUNICATION HILL RIDGE: integrated rear-right high point           */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <CommunicationHillRidge theme={theme} />

      {/* Debug anchors */}
      {DEBUG_TERRAIN && (
        <g id="debug-ridge-anchors" pointerEvents="none">
          {[...ridges.far.anchors, ...ridges.midFar.anchors, ...ridges.mid.anchors].map((a, i) => (
            <circle key={`dbg-ridge-${i}`} cx={a.x} cy={a.y} r={3} fill="#ff00ff" opacity={0.6} />
          ))}
        </g>
      )}
    </g>
  );
};

/**
 * Rear-right ridge system that naturally hosts the communication station.
 * Structure: midground ridge → raised shoulder → communication summit.
 * Slightly asymmetric, wind-shaped, no isolated cone/volcano look.
 */
const CommunicationHillRidge: React.FC<{ theme: YorkshireCommonProps['theme'] }> = ({ theme }) => {
  const hill = YORKSHIRE_LAYOUT.communicationHill;
  const ridge = hill.ridge;

  // Build ridge silhouette from control points
  const ridgePath = anchorsToPath(
    [
      { x: ridge.leftAnchor.x, y: ridge.leftAnchor.y },
      { x: ridge.leftShoulder.x, y: ridge.leftShoulder.y },
      { x: ridge.summit.x + (hill.summitSkew * 40), y: ridge.summit.y }, // slight lean
      { x: ridge.rightShoulder.x, y: ridge.rightShoulder.y },
      { x: ridge.rightAnchor.x, y: ridge.rightAnchor.y },
    ],
    hill.base.y
  );

  return (
    <g id="communication-hill-ridge" opacity="0.96">
      {/* Main ridge mass: connects midground to summit */}
      <path
        d={ridgePath}
        fill="#4a5c48"
        opacity={0.85}
      />

      {/* Wind-shaped summit highlight (asymmetric, leans with prevailing wind) */}
      <path
        d={anchorsToPath([
          { x: ridge.leftShoulder.x, y: ridge.leftShoulder.y },
          { x: ridge.summit.x + (hill.summitSkew * 40), y: ridge.summit.y },
          { x: ridge.rightShoulder.x, y: ridge.rightShoulder.y },
        ])}
        fill="#5a6e56"
        opacity={0.6}
      />

      {/* Soft atmospheric integration with distant ridges */}
      <path
        d={anchorsToPath([
          { x: ridge.leftAnchor.x, y: ridge.leftAnchor.y },
          { x: ridge.leftShoulder.x, y: ridge.leftShoulder.y },
          { x: ridge.summit.x + (hill.summitSkew * 40), y: ridge.summit.y },
        ])}
        fill={theme.skyBottom}
        opacity={0.12}
      />

      {DEBUG_TERRAIN && (
        <g pointerEvents="none">
          <circle cx={ridge.summit.x} cy={ridge.summit.y} r={5} fill="#00ff00" opacity={0.7} />
          <circle cx={ridge.leftShoulder.x} cy={ridge.leftShoulder.y} r={4} fill="#00ccff" opacity={0.7} />
          <circle cx={ridge.rightShoulder.x} cy={ridge.rightShoulder.y} r={4} fill="#00ccff" opacity={0.7} />
          <path d={ridgePath} fill="none" stroke="#ff6600" strokeWidth="1.5" strokeDasharray="6 4" opacity={0.5} />
        </g>
      )}
    </g>
  );
};
