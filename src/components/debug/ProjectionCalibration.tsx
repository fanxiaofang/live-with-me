import React, { useRef } from 'react';
import { WoodenCabinHaven } from '../architecture/WoodenCabinHaven';
import {
  LIVE_WITH_ME_PROJECTION,
  VISUAL_GROUND_PROJECTION,
  projectGround,
} from '../../world/liveWithMeProjection';

/**
 * 📐 ProjectionCalibration — Phase 0 dev-only calibration scene
 *    (Phase 0.1: semantics corrected)
 *
 * NOT WIRED INTO THE APP. Nothing imports this component, so it is absent from
 * the production bundle and cannot change the live scene's pixels.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ⚠️ WHAT THIS SCENE DOES *NOT* PROVE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * It does NOT prove "the cabin obeys a ±15.806° projection".
 * The cabin is a hand-drawn front-elevation 2.5D asset and is NOT a projection
 * axis source. There is no cabin → axes causal relationship here.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * ✅ WHAT IT DOES PROVE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *   CABIN  →  anchor only  →  ●
 *                             └─ VISUAL_GROUND_PROJECTION grid extends from it
 *
 * i.e. when the cabin's reliable ground anchor is placed on the
 * MAIN-HOUSE-derived visual ground projection, can a new ground plane read as
 * naturally extending from under its feet?
 *
 *   Grid source : MAIN HOUSE floor (TimberFlooring + CottageFoundation)
 *   Cabin role  : ANCHOR REFERENCE ONLY
 *
 * The grid is generated from VISUAL_GROUND_PROJECTION.axisA / .axisB.
 * It is NOT a standard 2:1 isometric grid — the project's current visual ground
 * slope is ±0.283088 (≈15.806°).
 */

export interface ProjectionCalibrationProps {
  width?: number;
  height?: number;
  /** Grid half-extent in ground units. */
  gridRadius?: number;
  /** Grid spacing in ground units. */
  gridStep?: number;
  className?: string;
}

const CABIN = LIVE_WITH_ME_PROJECTION.calibration.cabin;
const VISUAL_GROUND_UNIT = LIVE_WITH_ME_PROJECTION.scale.VISUAL_GROUND_UNIT;

/** Build the grid segments in ground-space, then project them. */
function buildGrid(radius: number, step: number): { ax: string; bx: string } {
  const segmentsA: string[] = [];
  const segmentsB: string[] = [];

  for (let i = -radius; i <= radius; i += step) {
    // Constant-a line: runs along axis B
    const p1 = projectGround(i, -radius);
    const p2 = projectGround(i, radius);
    segmentsA.push(`M${p1.x},${p1.y} L${p2.x},${p2.y}`);

    // Constant-b line: runs along axis A
    const q1 = projectGround(-radius, i);
    const q2 = projectGround(radius, i);
    segmentsB.push(`M${q1.x},${q1.y} L${q2.x},${q2.y}`);
  }

  return { ax: segmentsA.join(' '), bx: segmentsB.join(' ') };
}

export const ProjectionCalibration: React.FC<ProjectionCalibrationProps> = ({
  width = 900,
  height = 620,
  gridRadius = 480,
  gridStep = 34,
  className,
}) => {
  const hasMovedRef = useRef<boolean>(false);
  const { ax, bx } = buildGrid(gridRadius, gridStep);

  // The cabin's own group origin sits at scene (220,340); its ground anchor is
  // 55.5 units lower. Shift the asset so the anchor lands on the calibration
  // origin, which is what makes the grid read as starting at the cabin's feet.
  const anchorLocal = CABIN.groundAnchorLocal;

  const endA = projectGround(VISUAL_GROUND_UNIT * 1.6, 0);
  const endB = projectGround(0, VISUAL_GROUND_UNIT * 1.6);

  // VISIBLE CONTACT BAND — NOT a plan-view footprint.
  const contactBandPoints = CABIN.contactBand
    .map((p) => `${p.x},${p.y - anchorLocal.y}`)
    .join(' ');

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={className}
      style={{ background: '#cfe0cb' }}
    >
      <defs>
        {/* Minimal stubs so the cabin renders standalone (in the real scene these
            come from ThreeWorld's shared <defs>). */}
        <linearGradient id="cabinStoneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6d6355" />
          <stop offset="100%" stopColor="#4a4238" />
        </linearGradient>
        <linearGradient id="cabinShingleGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a3f22" />
          <stop offset="100%" stopColor="#4a1c0d" />
        </linearGradient>
        <linearGradient id="cabinLogGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a5a30" />
          <stop offset="100%" stopColor="#5b3517" />
        </linearGradient>
        <radialGradient id="cabinGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3cf" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
        <filter id="softShadow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* ── Visual ground plane (source: MAIN HOUSE), centred on origin ──── */}
      <g
        id="calibration-ground"
        transform={`translate(${width / 2}, ${height * 0.72})`}
      >
        {/* Two grid families — generated from VISUAL_GROUND_PROJECTION only */}
        <path d={ax} fill="none" stroke="#6f8f66" strokeWidth="0.8" opacity="0.55" />
        <path d={bx} fill="none" stroke="#6f8f66" strokeWidth="0.8" opacity="0.4" />

        {/* Origin cross */}
        <line x1="-10" y1="0" x2="10" y2="0" stroke="#31502c" strokeWidth="1.2" />
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#31502c" strokeWidth="1.2" />

        {/* ── VISUAL_GROUND_PROJECTION axis A ───────────────────────────── */}
        <g id="calibration-axis-a">
          <line x1="0" y1="0" x2={endA.x} y2={endA.y} stroke="#c2410c" strokeWidth="2.4" strokeLinecap="round" />
          <polygon
            points={`${endA.x},${endA.y} ${endA.x - 11},${endA.y - 5} ${endA.x - 8},${endA.y + 6}`}
            fill="#c2410c"
          />
          <text x={endA.x + 8} y={endA.y + 4} fontSize="13" fontWeight="bold" fill="#c2410c">
            Axis A · +{VISUAL_GROUND_PROJECTION.axisAAngleDeg}°
          </text>
        </g>

        {/* ── VISUAL_GROUND_PROJECTION axis B ───────────────────────────── */}
        <g id="calibration-axis-b">
          <line x1="0" y1="0" x2={endB.x} y2={endB.y} stroke="#1d4ed8" strokeWidth="2.4" strokeLinecap="round" />
          <polygon
            points={`${endB.x},${endB.y} ${endB.x - 11},${endB.y + 5} ${endB.x - 8},${endB.y - 6}`}
            fill="#1d4ed8"
          />
          <text x={endB.x + 8} y={endB.y - 4} fontSize="13" fontWeight="bold" fill="#1d4ed8">
            Axis B · {VISUAL_GROUND_PROJECTION.axisBAngleDeg}°
          </text>
        </g>

        {/* ── Cabin VISIBLE CONTACT BAND — NOT a plan footprint ─────────── */}
        <g id="calibration-contact-band">
          <polygon
            points={contactBandPoints}
            fill="#f59e0b"
            fillOpacity="0.22"
            stroke="#b45309"
            strokeWidth="1.6"
            strokeDasharray="5 4"
          />
          <text
            x={CABIN.contactBandCenter.x + 18}
            y={CABIN.contactBandCenter.y - anchorLocal.y - 6}
            fontSize="11"
            fontWeight="bold"
            fill="#92400e"
          >
            VISIBLE CONTACT BAND
          </text>
          <text
            x={CABIN.contactBandCenter.x + 18}
            y={CABIN.contactBandCenter.y - anchorLocal.y + 8}
            fontSize="11"
            fontWeight="bold"
            fill="#b45309"
          >
            NOT PLAN FOOTPRINT
          </text>
        </g>

        {/* ── Ground anchor — the cabin's only reliable datum ───────────── */}
        <g id="calibration-ground-anchor">
          <circle cx="0" cy="0" r="6.5" fill="#111827" />
          <circle cx="0" cy="0" r="3" fill="#facc15" />
          <text x="11" y="-9" fontSize="12" fontWeight="bold" fill="#111827">
            cabin ground anchor ({anchorLocal.x}, {anchorLocal.y}) · anchor only
          </text>
        </g>

        {/* ── The real cabin asset, shifted so its anchor sits on origin ── */}
        <g id="calibration-cabin" transform={`translate(0, ${-anchorLocal.y})`}>
          <g id="room-corn_lounge">
            <WoodenCabinHaven
              activeRoom="none"
              onSelectRoom={() => {}}
              presenceSlots={{}}
              onSelectPerson={() => {}}
              setHoveredObject={() => {}}
              hasMovedRef={hasMovedRef}
              theme={{ cottageGlow: '#f59e0b' }}
            />
          </g>
        </g>
      </g>

      {/* ── HUD ─────────────────────────────────────────────────────────── */}
      <g id="calibration-hud" fontFamily="ui-monospace, monospace">
        <text x="16" y="24" fontSize="14" fontWeight="bold" fill="#1f2937">
          VISUAL_GROUND_PROJECTION — calibration
        </text>

        {/* The two role lines that must never be confused */}
        <text x="16" y="44" fontSize="11.5" fontWeight="bold" fill="#b45309">
          Axis source: Main House floor ±15.806°
        </text>
        <text x="16" y="61" fontSize="11.5" fontWeight="bold" fill="#92400e">
          Cabin: anchor reference only — NOT axis source
        </text>

        <text x="16" y="81" fontSize="11.5" fill="#374151">
          axis A = ({VISUAL_GROUND_PROJECTION.axisA.x}, {VISUAL_GROUND_PROJECTION.axisA.y}) · {VISUAL_GROUND_PROJECTION.axisAAngleDeg}°
        </text>
        <text x="16" y="98" fontSize="11.5" fill="#374151">
          axis B = ({VISUAL_GROUND_PROJECTION.axisB.x}, {VISUAL_GROUND_PROJECTION.axisB.y}) · {VISUAL_GROUND_PROJECTION.axisBAngleDeg}°
        </text>
        <text x="16" y="115" fontSize="11.5" fill="#374151">
          |slope| = {VISUAL_GROUND_PROJECTION.slopeMagnitude} (NOT 2:1 iso)
        </text>
        <text x="16" y="132" fontSize="11.5" fill="#374151">
          VISUAL_GROUND_UNIT = {VISUAL_GROUND_UNIT} · authoring convenience only
        </text>
        <text x="16" y="149" fontSize="11.5" fill="#6b7280">
          STATUS: current visual contract — not frozen as future world projection
        </text>
        <text x="16" y="166" fontSize="11.5" fill="#6b7280">
          classification = {LIVE_WITH_ME_PROJECTION.confidence.classification} · gizmo projection is a separate contract
        </text>
      </g>
    </svg>
  );
};

export default ProjectionCalibration;
