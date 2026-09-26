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
 *
 * Phase 2.1: explicit cubic Bézier silhouette instead of uniform spline
 * smoothing — long, gentle west shoulder; tighter east falloff; mild
 * wind-shaped asymmetry at the summit. No isolated cone/volcano look.
 */
const CommunicationHillRidge: React.FC<{ theme: YorkshireCommonProps['theme'] }> = ({ theme }) => {
  const hill = YORKSHIRE_LAYOUT.communicationHill;
  const ridge = hill.ridge;
  const baseY = hill.base.y;
  const summitX = ridge.summit.x;
  const summitY = ridge.summit.y;

  // Hand-tuned Bézier: each segment has its own structural rhythm.
  const ridgePath = `
    M${ridge.leftAnchor.x},${ridge.leftAnchor.y}
    C742,236 776,204 ${ridge.leftShoulder.x},${ridge.leftShoulder.y}
    C836,128 862,${summitY} ${summitX},${summitY}
    C924,${summitY} 936,130 ${ridge.rightShoulder.x},${ridge.rightShoulder.y}
    C968,224 1032,262 ${ridge.rightAnchor.x},${ridge.rightAnchor.y}
    L${ridge.rightAnchor.x},${baseY} L${ridge.leftAnchor.x},${baseY} Z
  `;

  // Summit highlight: same hand-tuned rhythm, unclosed (filled against chord)
  const summitHighlightPath = `
    M${ridge.leftShoulder.x},${ridge.leftShoulder.y}
    C836,128 862,${summitY} ${summitX},${summitY}
    C924,${summitY} 936,130 ${ridge.rightShoulder.x},${ridge.rightShoulder.y}
  `;

  // Atmospheric glaze on the long west face only
  const westGlazePath = `
    M${ridge.leftAnchor.x},${ridge.leftAnchor.y}
    C742,236 776,204 ${ridge.leftShoulder.x},${ridge.leftShoulder.y}
    C836,128 862,${summitY} ${summitX},${summitY}
    L${summitX},${baseY} L${ridge.leftAnchor.x},${baseY} Z
  `;

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
        d={summitHighlightPath}
        fill="#5a6e56"
        opacity={0.6}
      />

      {/* Soft atmospheric integration with distant ridges */}
      <path
        d={westGlazePath}
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
