import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';

/**
 * 🚂 RailwayLandscape (Ribblehead Stone Railway Viaduct & Steam Locomotive)
 *
 * Layer: 05 INFRASTRUCTURE / Railway
 * Spatial Region: YORKSHIRE_LAYOUT.railway
 *
 * Preserves the 7-arch stone viaduct, tunnel portal, locomotive, and steam clouds.
 */
export const RailwayLandscape: React.FC<YorkshireCommonProps> = ({ className }) => {
  const layout = YORKSHIRE_LAYOUT.railway;

  return (
    <g id="yorkshire-railway-viaduct" className={className} opacity="0.95">
      <defs>
        <linearGradient id="viaductStoneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#857e72" />
          <stop offset="50%" stopColor="#6f685d" />
          <stop offset="100%" stopColor="#565046" />
        </linearGradient>
        <linearGradient id="viaductArchShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38332c" />
          <stop offset="100%" stopColor="#28241f" />
        </linearGradient>
      </defs>

      {/* Viaduct Ground Drop Shadow in Valley Fold */}
      <ellipse cx={layout.anchor.x} cy={layout.anchor.y} rx="270" ry="14" fill="#1b291d" opacity="0.25" filter="url(#softShadow)" />

      {/* Main Continuous Masonry Track Deck & Parapet Wall */}
      <rect x={layout.deck.minX} y={layout.deck.y} width={layout.deck.maxX - layout.deck.minX} height={layout.deck.height} fill="url(#viaductStoneGrad)" />
      <line x1={layout.deck.minX} y1="180" x2={layout.deck.maxX} y2="180" stroke="#a89f92" strokeWidth="0.9" />
      <line x1={layout.deck.minX} y1="187" x2={layout.deck.maxX} y2="187" stroke="#484239" strokeWidth="1.2" />

      {/* 7 Classical Roman Ashlar Stone Arches & Tapered Piers */}
      {layout.piers.map((px, idx) => {
        const pierHeight = 33 + Math.sin(idx * 0.55) * 9;
        return (
          <g key={`viaduct-pier-${idx}`}>
            {/* Shaded Arch Barrel Soffit (拱券内部深色背光阴影) */}
            {idx < 6 && (
              <g>
                <path
                  d={`M ${px + 20},187 A 15 15 0 0 1 ${px + 50},187 Z`}
                  fill="url(#viaductArchShade)"
                />
                <path
                  d={`M ${px + 20},187 A 15 15 0 0 1 ${px + 50},187`}
                  fill="none"
                  stroke="#565046"
                  strokeWidth="2.4"
                />
              </g>
            )}
            {/* Tapered Ashlar Stone Pier */}
            <polygon
              points={`${px},187 ${px + 20},187 ${px + 22},${187 + pierHeight} ${px - 2},${187 + pierHeight}`}
              fill="url(#viaductStoneGrad)"
              stroke="#524c42"
              strokeWidth="0.8"
            />
            {/* Shaded Right Edge of Pier (Cel-shaded facet) */}
            <polygon
              points={`${px + 14},187 ${px + 20},187 ${px + 22},${187 + pierHeight} ${px + 16},${187 + pierHeight}`}
              fill="#3d372f"
              opacity="0.45"
            />
            {/* Stone Pier Base Plinth */}
            <rect x={px - 4} y={187 + pierHeight - 2} width="28" height="4" rx="0.5" fill="#4d473e" />
          </g>
        );
      })}

      {/* Mountain Railway Tunnel Portal */}
      <g id="viaduct-tunnel-portal" transform={`translate(${layout.tunnelPortal.x}, ${layout.tunnelPortal.y})`}>
        <polygon points="0,0 28,-10 38,36 0,36" fill="#3a4c22" />
        <polygon points="0,3 20,-4 25,34 0,34" fill="url(#viaductStoneGrad)" stroke="#4d473e" strokeWidth="0.8" />
        {/* Dark Arched Tunnel Mouth */}
        <path d="M0,34 L0,16 A 11 11 0 0 1 22,16 L22,34 Z" fill="#0d120f" stroke="#25201b" strokeWidth="1.4" />
        {/* Ashlar Stone Voussoirs */}
        <path d="M-2,34 L-2,14 A 13 13 0 0 1 24,14 L24,34" fill="none" stroke="#686054" strokeWidth="2.4" />
        <circle cx="11" cy="2" r="1.5" fill="#d97706" />
        {/* Wild Hillside Ivy Clinging to Tunnel Masonry */}
        <ellipse cx="6" cy="8" rx="7" ry="3.2" fill="#2d4221" />
        <ellipse cx="18" cy="10" rx="6" ry="2.8" fill="#3a562b" />
      </g>

      {/* Vintage Countryside Steam Locomotive crossing the Viaduct */}
      <g transform={`translate(${layout.locomotive.x}, ${layout.locomotive.y})`} opacity="0.95">
        {/* Locomotive Body (British Brunswick Green & Dark Cab) */}
        <rect x="0" y="5" width="22" height="7" rx="1" fill="#2c4431" />
        <rect x="18" y="1" width="10" height="11" rx="1" fill="#1e3022" />
        <circle cx="10" cy="5" r="1.8" fill="#d99b38" />
        <rect x="3" y="1" width="3" height="4" fill="#1b1c1e" />
        {/* Carriage 1 & 2 */}
        <rect x="-24" y="4" width="20" height="8" rx="1" fill="#783424" />
        <rect x="-48" y="4" width="20" height="8" rx="1" fill="#783424" />
        {/* Carriage Windows */}
        {[-44, -36, -20, -12].map((wx, i) => (
          <rect key={i} x={wx} y="6" width="4" height="3" fill="#fdf0d5" opacity="0.8" />
        ))}
        {/* Puffing White Steam Clouds Drifting gracefully into the dale */}
        <circle cx="4" cy="-2" r="3.5" fill="#ffffff" opacity="0.75" className="animate-[pulse_3s_infinite]" />
        <circle cx="-5" cy="-6" r="5" fill="#ffffff" opacity="0.55" className="animate-[bounce_3.5s_infinite]" />
        <circle cx="-16" cy="-10" r="6.5" fill="#ffffff" opacity="0.4" />
        <circle cx="-30" cy="-14" r="8" fill="#ffffff" opacity="0.22" />
      </g>
    </g>
  );
};
