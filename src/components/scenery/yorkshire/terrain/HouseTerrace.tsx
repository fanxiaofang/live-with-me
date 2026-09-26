import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT, DEBUG_TERRAIN } from '../landscapeLayout';

/**
 * 🏡 HouseTerrace (Natural Raised Grassy Terrace with Limited Stone Retaining)
 *
 * Layer: 02 TERRAIN / House Terrace
 * Spatial Region: YORKSHIRE_LAYOUT.mainTerrace
 *
 * Phase 2 redesign: the house is embedded into a natural raised landform.
 * - ~80% natural terrain (grass, gentle slopes)
 * - ~20% visible retaining structure (stone steps, limited front edge stonework)
 * - House appears rooted into the hillside, not sitting on a stone platform
 * - Front terrain rolls down naturally toward middle foreground
 * - Central entrance steps remain as compositional feature
 */
export const HouseTerrace: React.FC<YorkshireCommonProps> = ({
  onTriggerToast,
  setHoveredObject,
  className,
}) => {
  const terrace = YORKSHIRE_LAYOUT.mainTerrace;

  // Natural terrace outline: broad crown, gentle shoulders, soft front drop
  // This is a large organic shape, not a diamond or rectangle
  const terraceOutline = `
    M${terrace.leftShoulder.x},${terrace.leftShoulder.y}
    C${terrace.leftShoulder.x + 40},${terrace.leftShoulder.y - 30}
     ${terrace.crown.x - 80},${terrace.crown.y - 20}
     ${terrace.crown.x},${terrace.crown.y}
    C${terrace.crown.x + 80},${terrace.crown.y - 20}
     ${terrace.rightShoulder.x - 40},${terrace.rightShoulder.y - 30}
     ${terrace.rightShoulder.x},${terrace.rightShoulder.y}
    C${terrace.rightShoulder.x + 30},${terrace.rightShoulder.y + 40}
     ${terrace.frontEdge.x + 120},${terrace.frontEdge.y - 60}
     ${terrace.frontEdge.x},${terrace.frontEdge.y}
    C${terrace.frontEdge.x - 120},${terrace.frontEdge.y - 60}
     ${terrace.leftShoulder.x - 30},${terrace.leftShoulder.y + 40}
     ${terrace.leftShoulder.x},${terrace.leftShoulder.y}
    Z
  `;

  // Front drop: visible but not abrupt, rolls down naturally
  const frontDropPath = `
    M${terrace.leftShoulder.x + 20},${terrace.frontEdge.y - 40}
    C${terrace.crown.x - 60},${terrace.frontEdge.y - 20}
     ${terrace.crown.x + 60},${terrace.frontEdge.y - 20}
     ${terrace.rightShoulder.x - 20},${terrace.frontEdge.y - 40}
    L${terrace.rightShoulder.x - 10},${terrace.frontEdge.y + 20}
    C${terrace.crown.x + 50},${terrace.frontEdge.y + 35}
     ${terrace.crown.x - 50},${terrace.frontEdge.y + 35}
     ${terrace.leftShoulder.x + 10},${terrace.frontEdge.y + 20}
    Z
  `;

  return (
    <g id="homestead-natural-terrace" className={className}>
      <defs>
        {/* Natural terrace turf: warm, sunlit, rooted */}
        <linearGradient id="naturalTerraceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a8bd55" />
          <stop offset="35%" stopColor="#93ab48" />
          <stop offset="70%" stopColor="#7a9438" />
          <stop offset="100%" stopColor="#5f772e" />
        </linearGradient>

        {/* Front drop shading: subtle depth, not cliff */}
        <linearGradient id="frontDropGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7a9438" />
          <stop offset="50%" stopColor="#5f772e" />
          <stop offset="100%" stopColor="#465e22" />
        </linearGradient>

        {/* Limited stone retaining: only at entrance front edge */}
        <linearGradient id="limitedStoneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a8072" />
          <stop offset="50%" stopColor="#6e6557" />
          <stop offset="100%" stopColor="#524a3e" />
        </linearGradient>
      </defs>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 1. NATURAL TERRACE MASS: The house sits IN the hillside             */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        id="terrace-natural-mass"
        d={terraceOutline}
        fill="url(#naturalTerraceGrad)"
      />

      {/* Subtle crown highlight: sunlit top */}
      <path
        d={`M${terrace.crown.x - 60},${terrace.crown.y - 10}
          C${terrace.crown.x - 30},${terrace.crown.y - 18}
           ${terrace.crown.x + 30},${terrace.crown.y - 18}
           ${terrace.crown.x + 60},${terrace.crown.y - 10}
          L${terrace.crown.x + 40},${terrace.crown.y + 5}
          C${terrace.crown.x},${terrace.crown.y + 12}
           ${terrace.crown.x - 40},${terrace.crown.y + 5}
           ${terrace.crown.x - 60},${terrace.crown.y - 10}
          Z`}
        fill="#b8cc60"
        opacity={0.35}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 2. FRONT DROP: Natural roll-down, not a wall                        */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <path
        id="terrace-front-drop"
        d={frontDropPath}
        fill="url(#frontDropGrad)"
        opacity={0.9}
      />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 3. LIMITED STONE RETAINING: Only at entrance, ~20% of perimeter     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <g id="terrace-limited-stonework">
        {/* Left stone segment */}
        <polygon
          points={`
            ${terrace.leftShoulder.x + 30},${terrace.frontEdge.y - 25}
            ${terrace.crown.x - 45},${terrace.frontEdge.y - 15}
            ${terrace.crown.x - 40},${terrace.frontEdge.y + 5}
            ${terrace.leftShoulder.x + 40},${terrace.frontEdge.y - 5}
          `}
          fill="url(#limitedStoneGrad)"
          stroke="#3a332a"
          strokeWidth="0.7"
        />

        {/* Right stone segment */}
        <polygon
          points={`
            ${terrace.crown.x + 45},${terrace.frontEdge.y - 15}
            ${terrace.rightShoulder.x - 30},${terrace.frontEdge.y - 25}
            ${terrace.rightShoulder.x - 40},${terrace.frontEdge.y - 5}
            ${terrace.crown.x + 40},${terrace.frontEdge.y + 5}
          `}
          fill="url(#limitedStoneGrad)"
          stroke="#3a332a"
          strokeWidth="0.7"
        />

        {/* Stone cap highlights */}
        <line
          x1={terrace.leftShoulder.x + 30} y1={terrace.frontEdge.y - 25}
          x2={terrace.crown.x - 45} y2={terrace.frontEdge.y - 15}
          stroke="#b5ab9c" strokeWidth="1.2" opacity="0.7"
        />
        <line
          x1={terrace.crown.x + 45} y1={terrace.frontEdge.y - 15}
          x2={terrace.rightShoulder.x - 30} y2={terrace.frontEdge.y - 25}
          stroke="#b5ab9c" strokeWidth="1.2" opacity="0.7"
        />
      </g>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* 4. CENTRAL ENTRANCE STEPS: Connect upper terrace to lower slope     */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <g
        id="terrace-entrance-steps"
        transform={`translate(${terrace.exposedStone.entranceSteps.anchor.x}, ${terrace.exposedStone.entranceSteps.anchor.y})`}
      >
        {/* Grounding shadow */}
        <ellipse cx="0" cy="42" rx="65" ry="14" fill="#1a2414" opacity="0.35" />

        {/* Step 4 (bottom, embedded in slope) */}
        <polygon points="-52,30 0,38 52,30 0,22" fill="#6e6557" stroke="#4a4339" strokeWidth="0.7" />
        <polygon points="-52,30 0,38 0,43 -52,35" fill="#554d40" />
        <polygon points="0,38 52,30 52,35 0,43" fill="#423a30" />

        {/* Step 3 */}
        <polygon points="-45,18 0,26 45,18 0,11" fill="#7d7262" stroke="#554d40" strokeWidth="0.7" />
        <polygon points="-45,18 0,26 0,31 -45,23" fill="#625848" />
        <polygon points="0,26 45,18 45,23 0,31" fill="#4e463a" />

        {/* Step 2 */}
        <polygon points="-38,7 0,14 38,7 0,0" fill="#8d8170" stroke="#625850" strokeWidth="0.7" />
        <polygon points="-38,7 0,14 0,19 -38,12" fill="#706456" />
        <polygon points="0,14 38,7 38,12 0,19" fill="#5a5044" />

        {/* Step 1 (top, flush with terrace) */}
        <polygon points="-31,-3 0,4 31,-3 0,-9" fill="#9d9180" stroke="#6e6557" strokeWidth="0.7" />
        <polygon points="-31,-3 0,4 0,9 -31,2" fill="#7d7262" />
        <polygon points="0,4 31,-3 31,2 0,9" fill="#665c4e" />

        {/* Tread highlights */}
        <line x1="-48" y1="30" x2="0" y2="37" stroke="#c5bbaa" strokeWidth="0.8" />
        <line x1="-41" y1="18" x2="0" y2="24" stroke="#d0c6b6" strokeWidth="0.8" />
        <line x1="-34" y1="7" x2="0" y2="12" stroke="#dbd1c2" strokeWidth="0.8" />

        {/* Rustic wicket gate */}
        <g
          id="terrace-wicket-gate"
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onTriggerToast?.('🚪 台地原木小门 · 拾级而下，通向阳光明媚的中景缓坡');
          }}
          onMouseEnter={() => setHoveredObject?.('🚪 台地田园小门 · 连通自然台地与下方缓坡牧场')}
          onMouseLeave={() => setHoveredObject?.(null)}
        >
          <rect x="-58" y="-10" width="5" height="28" rx="1.2" fill="#4a3522" stroke="#2a1d12" strokeWidth="0.7" />
          <polygon points="-59,-10 -55,-14 -51,-10" fill="#5f452e" />
          <rect x="53" y="-10" width="5" height="28" rx="1.2" fill="#4a3522" stroke="#2a1d12" strokeWidth="0.7" />
          <polygon points="52,-10 56,-14 60,-10" fill="#5f452e" />

          <g transform="rotate(-32 -58 0)">
            <line x1="-58" y1="0" x2="-36" y2="0" stroke="#6b4e35" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="-58" y1="9" x2="-36" y2="9" stroke="#6b4e35" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="-38" y1="-3" x2="-38" y2="14" stroke="#543c26" strokeWidth="2" strokeLinecap="round" />
            <line x1="-57" y1="9" x2="-38" y2="0" stroke="#543c26" strokeWidth="1.8" />
          </g>
          <g transform="rotate(32 58 0)">
            <line x1="58" y1="0" x2="36" y2="0" stroke="#6b4e35" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="58" y1="9" x2="36" y2="9" stroke="#6b4e35" strokeWidth="2.2" strokeLinecap="round" />
            <line x1="38" y1="-3" x2="38" y2="14" stroke="#543c26" strokeWidth="2" strokeLinecap="round" />
            <line x1="57" y1="9" x2="38" y2="0" stroke="#543c26" strokeWidth="1.8" />
          </g>
        </g>
      </g>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* DEBUG: Terrace boundary                                             */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      {DEBUG_TERRAIN && (
        <g id="debug-house-terrace" pointerEvents="none">
          <path d={terraceOutline} fill="none" stroke="#ff0066" strokeWidth="2" strokeDasharray="8 4" opacity={0.6} />
          <path d={frontDropPath} fill="none" stroke="#ff6699" strokeWidth="2" strokeDasharray="6 3" opacity={0.6} />
          <circle cx={terrace.crown.x} cy={terrace.crown.y} r={5} fill="#ff0066" opacity={0.7} />
          <circle cx={terrace.frontEdge.x} cy={terrace.frontEdge.y} r={5} fill="#ff6699" opacity={0.7} />
        </g>
      )}
    </g>
  );
};
