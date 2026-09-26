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
 * Phase 2.3 recomposition: the three tiers were raised into the readable
 * band between the house and the near-terrain top edge, and each tier now
 * owns a distinct screen band with its own rhythm:
 *   - FAR     quiet, coolest, lowest contrast, few crests
 *   - MID-FAR the rolling fell character — broad shoulders, uneven spacing
 *   - MID     olive-wheat, connects visually toward farm & communication hill
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
      {/* LAYER 1: FAR — quietest tier: coolest, lightest, few crests          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        d={anchorsToPath(ridges.far.anchors, ridges.far.baseline)}
        fill={resolveColor(ridges.far.fill)}
        opacity={0.55}
      />

      {/* Cool atmospheric wash: pushes the far tier back, lowers contrast.
          Kept light so the far silhouettes stay readable (the distance must
          not read as empty). */}
      <path
        d={anchorsToPath(ridges.far.anchors, 170)}
        fill={theme.skyBottom}
        opacity={0.17}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* LAYER 2: MID-FAR — rolling fell character                            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        d={anchorsToPath(ridges.midFar.anchors, ridges.midFar.baseline)}
        fill={resolveColor(ridges.midFar.fill)}
        opacity={0.7}
      />

      {/* Atmospheric glaze on mid-far */}
      <path
        d={anchorsToPath(ridges.midFar.anchors, 190)}
        fill={theme.skyBottom}
        opacity={0.1}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* LAYER 3: MID — olive landforms meeting the farm & communication hill */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        d={anchorsToPath(ridges.mid.anchors, ridges.mid.baseline)}
        fill={resolveColor(ridges.mid.fill)}
        opacity={0.88}
      />

      {/* Warm wheat glaze: keeps the mid tier reading as sunlit dales farmland
          inside the required olive-green value band (not a gold stripe). */}
      <path
        d={anchorsToPath(ridges.mid.anchors, ridges.mid.baseline)}
        fill={theme.wheatFar}
        opacity={0.3}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* COMMUNICATION HILL RIDGE: integrated rear-right high shoulder        */}
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
 * Structure: midground ridge → long rising west shoulder → broad high
 * shoulder → small summit platform → shorter east descent.
 *
 * Phase 2.3: re-composed as a broad high SHOULDER of a larger fell rather
 * than an isolated dark triangular mound. The summit platform is wide and
 * gently rounded so the station sits on it naturally, and the palette is
 * lightened (mid-olive) so the hill is never the darkest object in the
 * background. No sharp apex, no single dark filled triangle.
 */
const CommunicationHillRidge: React.FC<{ theme: YorkshireCommonProps['theme'] }> = ({ theme }) => {
  const hill = YORKSHIRE_LAYOUT.communicationHill;
  const ridge = hill.ridge;
  const baseY = hill.base.y;

  // Long rising west shoulder → broad high shoulder → wide flat-ish summit
  // platform → shorter east descent. Each segment has its own rhythm.
  const ridgePath = `
    M${ridge.leftAnchor.x},${ridge.leftAnchor.y}
    C660,164 712,150 ${ridge.leftShoulder.x},${ridge.leftShoulder.y}
    C790,132 812,124 ${ridge.highShoulder.x},${ridge.highShoulder.y}
    C852,112 872,${ridge.summit.y} ${ridge.summit.x},${ridge.summit.y}
    C918,${ridge.summit.y} 938,110 ${ridge.rightShoulder.x},${ridge.rightShoulder.y}
    C1010,146 1092,172 ${ridge.rightAnchor.x},${ridge.rightAnchor.y}
    L${ridge.rightAnchor.x},${baseY} L${ridge.leftAnchor.x},${baseY} Z
  `;

  // Sunlit western face: from the west shoulder up over the summit platform.
  const sunlitPath = `
    M${ridge.leftShoulder.x},${ridge.leftShoulder.y}
    C790,132 812,124 ${ridge.highShoulder.x},${ridge.highShoulder.y}
    C852,112 872,${ridge.summit.y} ${ridge.summit.x},${ridge.summit.y}
    C918,${ridge.summit.y} 938,110 ${ridge.rightShoulder.x},${ridge.rightShoulder.y}
  `;

  // Soft under-slope on the east side — keeps the mass grounded, not a wall.
  const eastUnderSlopePath = `
    M900,140
    C980,158 1070,180 1130,198
    L${ridge.rightAnchor.x},${baseY} L900,${baseY} Z
  `;

  // Atmospheric glaze on the long west face — ties the ridge into the
  // mid-far tier instead of letting it float as a separate object.
  const westGlazePath = `
    M${ridge.leftAnchor.x},${ridge.leftAnchor.y}
    C660,164 712,150 ${ridge.leftShoulder.x},${ridge.leftShoulder.y}
    C790,132 812,124 ${ridge.highShoulder.x},${ridge.highShoulder.y}
    C852,112 872,${ridge.summit.y} ${ridge.summit.x},${ridge.summit.y}
    L${ridge.summit.x},${baseY} L${ridge.leftAnchor.x},${baseY} Z
  `;

  return (
    <g id="communication-hill-ridge" opacity="0.96">
      {/* Main ridge mass: midground ridge → high shoulder → summit platform.
          Mid-olive palette (never the darkest object in the background). */}
      <path d={ridgePath} fill="#6b8055" opacity={0.92} />

      {/* East under-slope: soft grounding, slightly deeper olive */}
      <path d={eastUnderSlopePath} fill="#5d7048" opacity={0.55} />

      {/* Sunlit western face + summit platform (broad, wind-shaped) */}
      <path d={sunlitPath} fill="#82985f" opacity={0.62} />

      {/* Atmospheric integration with the mid-far tier */}
      <path d={westGlazePath} fill={theme.skyBottom} opacity={0.14} />

      {DEBUG_TERRAIN && (
        <g pointerEvents="none">
          <circle cx={ridge.summit.x} cy={ridge.summit.y} r={5} fill="#00ff00" opacity={0.7} />
          <circle cx={ridge.leftShoulder.x} cy={ridge.leftShoulder.y} r={4} fill="#00ccff" opacity={0.7} />
          <circle cx={ridge.highShoulder.x} cy={ridge.highShoulder.y} r={4} fill="#00ccff" opacity={0.7} />
          <circle cx={ridge.rightShoulder.x} cy={ridge.rightShoulder.y} r={4} fill="#00ccff" opacity={0.7} />
          <path d={ridgePath} fill="none" stroke="#ff6600" strokeWidth="1.5" strokeDasharray="6 4" opacity={0.5} />
        </g>
      )}
    </g>
  );
};
