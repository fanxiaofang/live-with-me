import React, { useRef } from 'react';
import { WoodenCabinHaven } from '../architecture/WoodenCabinHaven';
import {
  LIVE_WITH_ME_PROJECTION,
  LIVE_WITH_ME_PROJECTION_AXES,
  projectGround,
} from '../../world/liveWithMeProjection';

/**
 * 📐 ProjectionCalibration — Phase 0 dev-only calibration scene
 *
 * NOT WIRED INTO THE APP. Nothing imports this component, so it is absent from
 * the production bundle and cannot change the live scene's pixels. It exists as
 * a copy-paste target: drop it (plus `src/world/liveWithMeProjection.ts`) into a
 * fresh project and you get the real cabin standing on a ground grid that was
 * generated from the project's OWN extracted axes.
 *
 * Shows:
 *   1. the real cabin asset (WoodenCabinHaven)
 *   2. the extracted ground anchor
 *   3. the extracted ground-contact footprint polygon
 *   4. ground axis A
 *   5. ground axis B
 *   6. an axonometric reference grid built from axisA / axisB
 *
 * The grid is generated from the extracted axes. It is NOT a standard 2:1
 * isometric grid — the project's real ground slope is ±0.283088 (≈15.806°).
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
const AXES = { a: LIVE_WITH_ME_PROJECTION.ground.axisA, b: LIVE_WITH_ME_PROJECTION.ground.axisB };
const GROUND_UNIT = LIVE_WITH_ME_PROJECTION.scale.GROUND_UNIT;

/** Build the grid segments in ground-space, then project them. */
function buildGrid(radius: number, step: number): { ax: string; bx: string } {
  const segmentsA: string[] = [];
  const segmentsB: string[] = [];

  for (let i = -radius; i <= radius; i += step) {
    // Constant-a line: runs along axis B
    const p1 = projectGround(i, -radius, 0, LIVE_WITH_ME_PROJECTION_AXES);
    const p2 = projectGround(i, radius, 0, LIVE_WITH_ME_PROJECTION_AXES);
    segmentsA.push(`M${p1.x},${p1.y} L${p2.x},${p2.y}`);

    // Constant-b line: runs along axis A
    const q1 = projectGround(-radius, i, 0, LIVE_WITH_ME_PROJECTION_AXES);
    const q2 = projectGround(radius, i, 0, LIVE_WITH_ME_PROJECTION_AXES);
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

  const axisALength = GROUND_UNIT * 1.6;
  const axisBLength = GROUND_UNIT * 1.6;
  const endA = projectGround(axisALength, 0, 0, LIVE_WITH_ME_PROJECTION_AXES);
  const endB = projectGround(0, axisBLength, 0, LIVE_WITH_ME_PROJECTION_AXES);

  const footprintPoints = CABIN.footprint
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

      {/* ── Calibration ground plane, centred on the origin ──────────────── */}
      <g
        id="calibration-ground"
        transform={`translate(${width / 2}, ${height * 0.72})`}
      >
        {/* Two grid families — generated from the extracted axes only */}
        <path d={ax} fill="none" stroke="#6f8f66" strokeWidth="0.8" opacity="0.55" />
        <path d={bx} fill="none" stroke="#6f8f66" strokeWidth="0.8" opacity="0.4" />

        {/* Origin cross */}
        <line x1="-10" y1="0" x2="10" y2="0" stroke="#31502c" strokeWidth="1.2" />
        <line x1="0" y1="-10" x2="0" y2="10" stroke="#31502c" strokeWidth="1.2" />

        {/* ── Ground axis A ─────────────────────────────────────────────── */}
        <g id="calibration-axis-a">
          <line x1="0" y1="0" x2={endA.x} y2={endA.y} stroke="#c2410c" strokeWidth="2.4" strokeLinecap="round" />
          <polygon
            points={`${endA.x},${endA.y} ${endA.x - 11},${endA.y - 5} ${endA.x - 8},${endA.y + 6}`}
            fill="#c2410c"
          />
          <text x={endA.x + 8} y={endA.y + 4} fontSize="13" fontWeight="bold" fill="#c2410c">
            Axis A · +{LIVE_WITH_ME_PROJECTION.ground.axisAAngleDeg}°
          </text>
        </g>

        {/* ── Ground axis B ─────────────────────────────────────────────── */}
        <g id="calibration-axis-b">
          <line x1="0" y1="0" x2={endB.x} y2={endB.y} stroke="#1d4ed8" strokeWidth="2.4" strokeLinecap="round" />
          <polygon
            points={`${endB.x},${endB.y} ${endB.x - 11},${endB.y + 5} ${endB.x - 8},${endB.y - 6}`}
            fill="#1d4ed8"
          />
          <text x={endB.x + 8} y={endB.y - 4} fontSize="13" fontWeight="bold" fill="#1d4ed8">
            Axis B · {LIVE_WITH_ME_PROJECTION.ground.axisBAngleDeg}°
          </text>
        </g>

        {/* ── Extracted cabin ground-contact footprint ──────────────────── */}
        <polygon
          id="calibration-footprint"
          points={footprintPoints}
          fill="#f59e0b"
          fillOpacity="0.22"
          stroke="#b45309"
          strokeWidth="1.6"
          strokeDasharray="5 4"
        />

        {/* ── Ground anchor ─────────────────────────────────────────────── */}
        <g id="calibration-ground-anchor">
          <circle cx="0" cy="0" r="6.5" fill="#111827" />
          <circle cx="0" cy="0" r="3" fill="#facc15" />
          <text x="11" y="-9" fontSize="12" fontWeight="bold" fill="#111827">
            ground anchor ({anchorLocal.x}, {anchorLocal.y})
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
        <text x="16" y="26" fontSize="14" fontWeight="bold" fill="#1f2937">
          LiveWithMeProjection — calibration
        </text>
        <text x="16" y="46" fontSize="11.5" fill="#374151">
          axis A = ({AXES.a.x}, {AXES.a.y}) · {LIVE_WITH_ME_PROJECTION.ground.axisAAngleDeg}°
        </text>
        <text x="16" y="63" fontSize="11.5" fill="#374151">
          axis B = ({AXES.b.x}, {AXES.b.y}) · {LIVE_WITH_ME_PROJECTION.ground.axisBAngleDeg}°
        </text>
        <text x="16" y="80" fontSize="11.5" fill="#374151">
          |slope| = {LIVE_WITH_ME_PROJECTION.ground.slopeMagnitude} (NOT 2:1 iso)
        </text>
        <text x="16" y="97" fontSize="11.5" fill="#374151">
          GROUND_UNIT = {GROUND_UNIT} scene units (house floor width / 4)
        </text>
        <text x="16" y="114" fontSize="11.5" fill="#374151">
          classification = {LIVE_WITH_ME_PROJECTION.confidence.classification}
        </text>
      </g>
    </svg>
  );
};

export default ProjectionCalibration;
