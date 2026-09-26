import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT, anchorsToPath, DEBUG_TERRAIN } from '../landscapeLayout';

/**
 * 🖼️ BackgroundYorkshireMatte (Painted Distant Countryside Backdrop)
 *
 * Layer: 00 BACKGROUND MATTE
 * Spatial Region: YORKSHIRE_LAYOUT.backgroundMatte
 *
 * Phase 2.4 — hybrid background strategy.
 *
 * The distant countryside is no longer simulated with a handful of large flat
 * SVG terrain slabs. It is a continuous illustrated backdrop:
 *
 *   - every band is filled with a FADE-TO-TRANSPARENT vertical gradient, so no
 *     ridge ever ends on a hard horizontal edge (that hard edge was the main
 *     reason the old backdrop read as stacked colour slabs);
 *   - bands overlap so successive crests read as depth rather than stripes;
 *   - far agricultural land is suggested by a few very large, soft, low
 *     contrast tonal patches — never parcels, never hard field boundaries;
 *   - aerial perspective comes from value compression and haze, not blur.
 *
 * Responsibility carried here:
 *   distant ridges · distant rolling Yorkshire hills · atmospheric depth ·
 *   far agricultural land · broad rear communication-hill context
 *
 * Composed for the REAL overview camera (scale 0.66) — see landscapeLayout.
 * No gameplay, no interactive content, no field parcels, no walls.
 */
export const BackgroundYorkshireMatte: React.FC<YorkshireCommonProps> = ({ theme, className }) => {
  const matte = YORKSHIRE_LAYOUT.backgroundMatte;
  const commHill = YORKSHIRE_LAYOUT.communicationHill.ridge;
  const commBase = YORKSHIRE_LAYOUT.communicationHill.base.y;

  // Resolve a semantic tone key to a theme colour
  const tone = (key: string): string => {
    const map: Record<string, string> = {
      hillGreenFar: theme.hillGreenFar,
      hillGreenMid: theme.hillGreenMid,
      hillGreenNear: theme.hillGreenNear,
      wheatFar: theme.wheatFar,
      wheatNear: theme.wheatNear,
      skyBottom: theme.skyBottom,
    };
    return map[key] || theme.hillGreenMid;
  };

  // Highest point of a band — used to anchor its fade gradient
  const topOf = (anchors: readonly { x: number; y: number }[]): number =>
    anchors.reduce((min, a) => Math.min(min, a.y), Infinity);

  const bands = [...matte.farBands, ...matte.midBands];

  // Communication-hill context: long rising west shoulder → broad high
  // shoulder → wide summit platform → shorter east descent. Same anchors the
  // station asset is grounded on, so the asset and the backdrop stay aligned.
  const commPath = `
    M${commHill.leftAnchor.x},${commHill.leftAnchor.y}
    C660,164 712,150 ${commHill.leftShoulder.x},${commHill.leftShoulder.y}
    C790,132 812,124 ${commHill.highShoulder.x},${commHill.highShoulder.y}
    C852,112 872,${commHill.summit.y} ${commHill.summit.x},${commHill.summit.y}
    C918,${commHill.summit.y} 938,110 ${commHill.rightShoulder.x},${commHill.rightShoulder.y}
    C1012,148 1094,176 ${commHill.rightAnchor.x},${commHill.rightAnchor.y}
    L${commHill.rightAnchor.x},${commBase} L${commHill.leftAnchor.x},${commBase} Z
  `;

  return (
    <g id="yorkshire-background-matte" className={className}>
      <defs>
        {/* ── Aerial perspective wash across the whole backdrop ───────────── */}
        <linearGradient
          id="matteAtmosphereGrad"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={matte.atmosphere.top}
          x2="0"
          y2={matte.atmosphere.horizon}
        >
          <stop offset="0%" stopColor={theme.skyBottom} stopOpacity="0" />
          <stop offset="62%" stopColor={theme.skyBottom} stopOpacity="0.16" />
          <stop offset="100%" stopColor={theme.skyBottom} stopOpacity="0.34" />
        </linearGradient>

        {/* ── Land base: muted far land behind the midground terrain ──────── */}
        <linearGradient
          id="matteLandBaseGrad"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={matte.landBase.top}
          x2="0"
          y2={matte.landBase.bottom}
        >
          <stop offset="0%" stopColor={tone('hillGreenMid')} stopOpacity="0.3" />
          <stop offset="34%" stopColor={tone('hillGreenMid')} stopOpacity="0.56" />
          <stop offset="100%" stopColor={tone('hillGreenNear')} stopOpacity="0.72" />
        </linearGradient>

        {/* ── One fade-to-transparent gradient per painted band ───────────── */}
        {bands.map((b) => (
          <linearGradient
            key={b.id}
            id={`${b.id}-grad`}
            gradientUnits="userSpaceOnUse"
            x1="0"
            y1={topOf(b.anchors) - 18}
            x2="0"
            y2={b.baseline}
          >
            <stop offset="0%" stopColor={tone(b.tone)} stopOpacity={b.opacity} />
            <stop offset="50%" stopColor={tone(b.tone)} stopOpacity={b.opacity * 0.76} />
            <stop offset="100%" stopColor={tone(b.tone)} stopOpacity="0" />
          </linearGradient>
        ))}

        {/* ── Soft tonal patches suggesting far agricultural land ─────────── */}
        {matte.farmPatches.map((p) => (
          <radialGradient key={p.id} id={`${p.id}-grad`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={tone(p.tone)} stopOpacity={p.opacity} />
            <stop offset="58%" stopColor={tone(p.tone)} stopOpacity={p.opacity * 0.58} />
            <stop offset="100%" stopColor={tone(p.tone)} stopOpacity="0" />
          </radialGradient>
        ))}

        {/* ── Communication-hill context mass ─────────────────────────────── */}
        <linearGradient
          id="matteCommHillGrad"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={commHill.summit.y - 26}
          x2="0"
          y2={commBase}
        >
          <stop offset="0%" stopColor="#7d9163" stopOpacity="0.8" />
          <stop offset="46%" stopColor="#6b8055" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#5d7048" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. ATMOSPHERE — aerial perspective over the whole backdrop          */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <rect
        x="-3200"
        y={matte.atmosphere.top}
        width="8000"
        height={matte.atmosphere.horizon - matte.atmosphere.top}
        fill="url(#matteAtmosphereGrad)"
      />

      {/* 2. LAND BASE — muted far land; guarantees no sky gap                */}
      <rect
        x="-3200"
        y={matte.landBase.top}
        width="8000"
        height={matte.landBase.bottom - matte.landBase.top}
        fill="url(#matteLandBaseGrad)"
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. FAR RIDGES — soft overlapping painted silhouettes, no hard base  */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {matte.farBands.map((b) => (
        <path
          key={b.id}
          id={b.id}
          d={anchorsToPath(b.anchors, b.baseline)}
          fill={`url(#${b.id}-grad)`}
        />
      ))}

      {/* Sunlit rim on the nearer far band — a soft crest light, not a line */}
      <path
        d={anchorsToPath(matte.farBands[1].anchors)}
        fill="none"
        stroke={theme.skyBottom}
        strokeWidth="2.4"
        opacity="0.16"
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. MID-FAR FELLS — the rolling Yorkshire character                  */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {matte.midBands.map((b) => (
        <path
          key={b.id}
          id={b.id}
          d={anchorsToPath(b.anchors, b.baseline)}
          fill={`url(#${b.id}-grad)`}
        />
      ))}

      {/* Broad calm contour glazes: volume without facets or tessellation */}
      <path
        d="M-2100,196 C-1400,222 -600,230 200,198 C900,168 1700,166 2600,192
           C3300,212 3900,224 4300,218 L4300,300 L-2100,300 Z"
        fill={tone('hillGreenNear')}
        opacity="0.09"
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 5. FAR AGRICULTURAL LAND — soft tonal patches, never parcels        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <g id="matte-farmland">
        {matte.farmPatches.map((p) => (
          <ellipse
            key={p.id}
            id={p.id}
            cx={p.cx}
            cy={p.cy}
            rx={p.rx}
            ry={p.ry}
            fill={`url(#${p.id}-grad)`}
          />
        ))}
      </g>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 6. COMMUNICATION-HILL CONTEXT — broad rear-right high shoulder      */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path id="matte-comm-hill-context" d={commPath} fill="url(#matteCommHillGrad)" />

      {/* Wind-shaped sunlit summit face (keeps the shoulder readable) */}
      <path
        d={`M${commHill.leftShoulder.x},${commHill.leftShoulder.y}
            C790,132 812,124 ${commHill.highShoulder.x},${commHill.highShoulder.y}
            C852,112 872,${commHill.summit.y} ${commHill.summit.x},${commHill.summit.y}
            C918,${commHill.summit.y} 938,110 ${commHill.rightShoulder.x},${commHill.rightShoulder.y}`}
        fill="none"
        stroke="#9aae74"
        strokeWidth="2.2"
        opacity="0.26"
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* DEBUG                                                               */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {DEBUG_TERRAIN && (
        <g id="debug-background-matte" pointerEvents="none">
          {bands.map((b) => (
            <g key={`dbg-${b.id}`}>
              <path d={anchorsToPath(b.anchors, b.baseline)} fill="none" stroke="#ff00ff" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
              {b.anchors.map((a, i) => (
                <circle key={`dbg-${b.id}-${i}`} cx={a.x} cy={a.y} r={3} fill="#ff00ff" opacity="0.6" />
              ))}
            </g>
          ))}
          <path d={commPath} fill="none" stroke="#ff6600" strokeWidth="1.5" strokeDasharray="6 4" opacity="0.5" />
        </g>
      )}
    </g>
  );
};
