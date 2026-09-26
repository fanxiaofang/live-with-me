import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT, anchorsToPath, DEBUG_TERRAIN } from '../landscapeLayout';

/**
 * 🌊 RiverValley (Broad West-Side Valley with Embedded River)
 *
 * Layer: 02 TERRAIN / River Valley
 * Spatial Region: YORKSHIRE_LAYOUT.riverValley
 *
 * Phase 2 redesign: the river is embedded into a broad valley structure.
 * - West bank visibly descends from upland toward valley floor
 * - Valley floor carries the river channel
 * - East bank rises again toward central fields
 * - The valley itself influences terrain silhouettes
 * - River remains secondary; valley structure is primary
 */
export const RiverValley: React.FC<YorkshireCommonProps> = ({
  theme,
  onTriggerToast,
  setHoveredObject,
  className,
}) => {
  const layout = YORKSHIRE_LAYOUT.riverValley;

  // West bank: descends from crest to valley floor
  const westBankPath = anchorsToPath(
    [
      { x: layout.westBank.crest.x, y: layout.westBank.crest.y },
      { x: layout.westBank.crest.x - 40, y: layout.westBank.crest.y + 60 },
      { x: layout.westBank.toe.x - 20, y: layout.westBank.toe.y - 40 },
      { x: layout.westBank.toe.x, y: layout.westBank.toe.y },
    ],
    800
  );

  // East bank: rises from valley floor back to field level
  const eastBankPath = anchorsToPath(
    [
      { x: layout.eastBank.toe.x, y: layout.eastBank.toe.y },
      { x: layout.eastBank.toe.x + 40, y: layout.eastBank.toe.y + 50 },
      { x: layout.eastBank.crest.x - 30, y: layout.eastBank.crest.y - 30 },
      { x: layout.eastBank.crest.x, y: layout.eastBank.crest.y },
    ],
    800
  );

  // Valley floor: the low point between banks
  const valleyFloorPath = anchorsToPath(
    [
      { x: layout.valleyFloor.centerline[0].x, y: layout.valleyFloor.centerline[0].y },
      { x: layout.valleyFloor.centerline[1].x, y: layout.valleyFloor.centerline[1].y },
      { x: layout.valleyFloor.centerline[2].x, y: layout.valleyFloor.centerline[2].y },
      { x: layout.valleyFloor.centerline[3].x, y: layout.valleyFloor.centerline[3].y },
      { x: layout.valleyFloor.centerline[4].x, y: layout.valleyFloor.centerline[4].y },
    ],
    800
  );

  // River channel: narrower, centered in valley floor
  const riverPath = `M${layout.valleyFloor.centerline[0].x},${layout.valleyFloor.centerline[0].y}
    C${layout.valleyFloor.centerline[1].x - 20},${layout.valleyFloor.centerline[1].y + 10}
     ${layout.valleyFloor.centerline[2].x - 15},${layout.valleyFloor.centerline[2].y - 20}
     ${layout.valleyFloor.centerline[2].x},${layout.valleyFloor.centerline[2].y}
    C${layout.valleyFloor.centerline[2].x + 15},${layout.valleyFloor.centerline[2].y + 20}
     ${layout.valleyFloor.centerline[3].x + 20},${layout.valleyFloor.centerline[3].y - 15}
     ${layout.valleyFloor.centerline[3].x},${layout.valleyFloor.centerline[3].y}
    L${layout.valleyFloor.centerline[4].x},${layout.valleyFloor.centerline[4].y}
    C${layout.valleyFloor.centerline[4].x - 30},${layout.valleyFloor.centerline[4].y - 20}
     ${layout.valleyFloor.centerline[3].x - 40},${layout.valleyFloor.centerline[3].y - 10}
     ${layout.valleyFloor.centerline[3].x - 60},${layout.valleyFloor.centerline[3].y - 30}
    C${layout.valleyFloor.centerline[3].x - 80},${layout.valleyFloor.centerline[3].y - 60}
     ${layout.valleyFloor.centerline[2].x - 60},${layout.valleyFloor.centerline[2].y - 40}
     ${layout.valleyFloor.centerline[2].x - 80},${layout.valleyFloor.centerline[2].y}
    C${layout.valleyFloor.centerline[2].x - 100},${layout.valleyFloor.centerline[2].y + 40}
     ${layout.valleyFloor.centerline[1].x - 50},${layout.valleyFloor.centerline[1].y + 30}
     ${layout.valleyFloor.centerline[0].x - 30},${layout.valleyFloor.centerline[0].y + 10}
    Z`;

  return (
    <g id="yorkshire-river-valley" className={className} opacity="0.96">
      <defs>
        <linearGradient id="ysRiverGradClean" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={theme.riverColor} />
          <stop offset="50%" stopColor={theme.riverReflect} />
          <stop offset="100%" stopColor={theme.riverColor} />
        </linearGradient>

        {/* West bank: shaded, descending */}
        <linearGradient id="westBankGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6b8335" />
          <stop offset="50%" stopColor="#5a7030" />
          <stop offset="100%" stopColor="#465e22" />
        </linearGradient>

        {/* East bank: rising, sunlit */}
        <linearGradient id="eastBankGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8ba43f" />
          <stop offset="50%" stopColor="#7a9438" />
          <stop offset="100%" stopColor="#6b8335" />
        </linearGradient>

        {/* Valley floor: moist, darker */}
        <linearGradient id="valleyFloorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5a7030" />
          <stop offset="100%" stopColor="#465e22" />
        </linearGradient>
      </defs>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. VALLEY STRUCTURE: west bank → valley floor → east bank          */}
      {/* ─────────────────────────────────────────────────────────────────── */}

      {/* West bank slope */}
      <path
        id="west-bank-slope"
        d={westBankPath}
        fill="url(#westBankGrad)"
      />

      {/* Valley floor */}
      <path
        id="valley-floor"
        d={valleyFloorPath}
        fill="url(#valleyFloorGrad)"
        opacity={0.9}
      />

      {/* East bank slope */}
      <path
        id="east-bank-slope"
        d={eastBankPath}
        fill="url(#eastBankGrad)"
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. RIVER CHANNEL: embedded in valley floor                         */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        id="river-channel"
        d={riverPath}
        fill="url(#ysRiverGradClean)"
        stroke="#4fa5a3"
        strokeWidth="1.0"
      />

      {/* Water surface glaze */}
      <path
        d={`M${layout.valleyFloor.centerline[0].x - 10},${layout.valleyFloor.centerline[0].y + 8}
          C${layout.valleyFloor.centerline[1].x - 25},${layout.valleyFloor.centerline[1].y + 15}
           ${layout.valleyFloor.centerline[2].x - 20},${layout.valleyFloor.centerline[2].y - 10}
           ${layout.valleyFloor.centerline[2].x - 5},${layout.valleyFloor.centerline[2].y + 5}
          C${layout.valleyFloor.centerline[2].x + 10},${layout.valleyFloor.centerline[2].y + 20}
           ${layout.valleyFloor.centerline[3].x + 15},${layout.valleyFloor.centerline[3].y - 5}
           ${layout.valleyFloor.centerline[3].x - 5},${layout.valleyFloor.centerline[3].y + 10}
          L${layout.valleyFloor.centerline[4].x - 10},${layout.valleyFloor.centerline[4].y + 5}
          C${layout.valleyFloor.centerline[4].x - 40},${layout.valleyFloor.centerline[4].y - 15}
           ${layout.valleyFloor.centerline[3].x - 55},${layout.valleyFloor.centerline[3].y - 20}
           ${layout.valleyFloor.centerline[3].x - 70},${layout.valleyFloor.centerline[3].y - 40}
          C${layout.valleyFloor.centerline[3].x - 85},${layout.valleyFloor.centerline[3].y - 70}
           ${layout.valleyFloor.centerline[2].x - 70},${layout.valleyFloor.centerline[2].y - 50}
           ${layout.valleyFloor.centerline[2].x - 90},${layout.valleyFloor.centerline[2].y - 10}
          C${layout.valleyFloor.centerline[2].x - 110},${layout.valleyFloor.centerline[2].y + 30}
           ${layout.valleyFloor.centerline[1].x - 60},${layout.valleyFloor.centerline[1].y + 40}
           ${layout.valleyFloor.centerline[0].x - 40},${layout.valleyFloor.centerline[0].y + 20}
          Z`}
        fill={theme.riverReflect}
        opacity={0.3}
      />

      {/* Soft ripple accents */}
      <g opacity={0.6}>
        <path d={`M${layout.valleyFloor.centerline[0].x + 5},${layout.valleyFloor.centerline[0].y + 15} Q${layout.valleyFloor.centerline[1].x - 10},${layout.valleyFloor.centerline[1].y + 25} ${layout.valleyFloor.centerline[1].x - 5},${layout.valleyFloor.centerline[1].y + 35}`} fill="none" stroke={theme.riverRipples} strokeWidth="1.4" strokeLinecap="round" />
        <path d={`M${layout.valleyFloor.centerline[2].x - 30},${layout.valleyFloor.centerline[2].y + 20} Q${layout.valleyFloor.centerline[2].x - 10},${layout.valleyFloor.centerline[2].y + 45} ${layout.valleyFloor.centerline[2].x + 5},${layout.valleyFloor.centerline[2].y + 60}`} fill="none" stroke={theme.riverRipples} strokeWidth="1.6" strokeLinecap="round" />
        <path d={`M${layout.valleyFloor.centerline[3].x - 20},${layout.valleyFloor.centerline[3].y + 30} Q${layout.valleyFloor.centerline[3].x},${layout.valleyFloor.centerline[3].y + 55} ${layout.valleyFloor.centerline[4].x + 10},${layout.valleyFloor.centerline[4].y + 40}`} fill="none" stroke={theme.riverRipples} strokeWidth="1.8" strokeLinecap="round" />
      </g>

      {/* River pebbles (structural, not decorative) */}
      <g id="river-pebbles">
        {layout.pebbles.map((p, idx) => (
          <ellipse key={`pebble-${idx}`} cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} fill="#6f6558" stroke="#484036" strokeWidth="0.7" />
        ))}
      </g>

      {/* Ducks (preserved interaction, now in valley context) */}
      <g
        id="valley-ducks"
        transform={`translate(${layout.ducksAnchor.x}, ${layout.ducksAnchor.y})`}
        className="cursor-pointer transition-transform hover:scale-110"
        onClick={(e) => {
          e.stopPropagation();
          onTriggerToast?.('🦆 嘎嘎~ 山谷溪流清澈见底，小鸭子正在顺水漂游');
        }}
        onMouseEnter={() => setHoveredObject?.('🦆 约克郡白鸭 · 在西侧山谷溪水中自由游曳')}
        onMouseLeave={() => setHoveredObject?.(null)}
      >
        <ellipse cx="0" cy="4" rx="10" ry="3" fill="#1b4d4c" opacity="0.4" />
        <ellipse cx="0" cy="5" rx="14" ry="3.5" fill="none" stroke="#a5e5e3" strokeWidth="0.8" opacity={0.5} className="animate-ping" />
        <path d="M-6,2 C-8,-1 -3,-5 3,-3 C8,-1 8,3 5,4 C2,5 -3,5 -6,2 Z" fill="#fffdfa" stroke="#d5cbba" strokeWidth="0.5" />
        <circle cx="6" cy="-4" r="2.8" fill="#fffdfa" />
        <path d="M7,-5 L12,-4 L7,-3 Z" fill="#f59e0b" />
        <circle cx="7" cy="-5" r="0.5" fill="#1e293b" />
        <g transform="translate(-13, -5)">
          <ellipse cx="0" cy="1" rx="3.5" ry="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.3" />
          <circle cx="2.5" cy="-1" r="1.6" fill="#fef08a" />
          <path d="M3.5,-1.5 L5.5,-1 L3.5,-0.5 Z" fill="#f59e0b" />
        </g>
      </g>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* DEBUG: Valley boundaries                                            */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {DEBUG_TERRAIN && (
        <g id="debug-river-valley" pointerEvents="none">
          <path d={westBankPath} fill="none" stroke="#00ccff" strokeWidth="2" strokeDasharray="6 4" opacity={0.6} />
          <path d={eastBankPath} fill="none" stroke="#00ccff" strokeWidth="2" strokeDasharray="6 4" opacity={0.6} />
          <path d={valleyFloorPath} fill="none" stroke="#0099ff" strokeWidth="2" strokeDasharray="6 4" opacity={0.6} />
          <circle cx={layout.westBank.crest.x} cy={layout.westBank.crest.y} r={5} fill="#00ccff" opacity={0.7} />
          <circle cx={layout.westBank.toe.x} cy={layout.westBank.toe.y} r={5} fill="#00ccff" opacity={0.7} />
          <circle cx={layout.eastBank.toe.x} cy={layout.eastBank.toe.y} r={5} fill="#0099ff" opacity={0.7} />
          <circle cx={layout.eastBank.crest.x} cy={layout.eastBank.crest.y} r={5} fill="#0099ff" opacity={0.7} />
        </g>
      )}
    </g>
  );
};
