import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';

/**
 * ⛰️ TerrainMass (Rolling Pasture Base, Knolls, Slopes & Terraces)
 *
 * Layer: 02 TERRAIN MASS
 * Spatial Region: YORKSHIRE_LAYOUT.scene.worldBounds & foregroundSlope
 *
 * Preserves the upper terrace, homestead lawn plateau, east tech terrace knoll,
 * west cabin knoll, and rolling Morandi pasture base terrain.
 */
export const TerrainMass: React.FC<YorkshireCommonProps> = ({ theme, className }) => {
  return (
    <g id="yorkshire-terrain-mass" className={className}>
      <defs>
        <linearGradient id="homesteadLawnGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#98ad48" />
          <stop offset="42%" stopColor={theme.hillGreenMid} />
          <stop offset="85%" stopColor="#637c35" />
          <stop offset="100%" stopColor={theme.hillGreenNear} />
        </linearGradient>

        <linearGradient id="foregroundPastureGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#829940" />
          <stop offset="30%" stopColor={theme.hillGreenNear} />
          <stop offset="75%" stopColor="#2c3c18" />
          <stop offset="100%" stopColor="#1a2510" />
        </linearGradient>

        <linearGradient id="stoneWallCapGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#827769" />
          <stop offset="50%" stopColor="#9a8e7f" />
          <stop offset="100%" stopColor="#7c7062" />
        </linearGradient>
        <linearGradient id="stoneWallFaceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4f4439" />
          <stop offset="50%" stopColor="#3a3128" />
          <stop offset="100%" stopColor="#251f19" />
        </linearGradient>
      </defs>

      {/* 1. Mountain Trail Switchback from Observatory to Valley */}
      <g id="mountain-switchback-trail" opacity="0.8">
        <path
          d="M890,110 Q830,135 840,165 Q850,195 780,215 Q710,235 620,250 Q500,265 380,270 Q240,285 140,295"
          fill="none"
          stroke="#baa58c"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="12 4"
        />
        <path
          d="M890,110 Q830,135 840,165 Q850,195 780,215 Q710,235 620,250 Q500,265 380,270 Q240,285 140,295"
          fill="none"
          stroke="#8c7760"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </g>

      {/* 2. Upper Agricultural & Farmstead Terrace */}
      <path
        d="M-2400,270 Q-1200,275 -600,280 C-200,265 160,248 420,244 C720,250 1020,238 1350,258 C1580,270 2200,275 3600,280 L3600,450 C2400,440 1400,375 1060,360 C740,350 460,345 180,335 C-100,325 -360,315 -600,310 C-1200,315 -2400,320 Z"
        fill={theme.hillGreenMid}
      />
      <polygon points="420,244 600,258 720,250 540,274" fill="#36491e" opacity="0.48" />
      <polygon points="1020,238 1200,262 1350,258 1160,278" fill="#32451b" opacity="0.5" />
      <polygon points="-200,265 0,278 160,248 -60,290" fill="#36491e" opacity="0.46" />

      {/* Meandering drystone wall along the upper wheat terrace boundary */}
      <g id="yorkshire-drystone-wall" opacity="0.85">
        <path
          d="M-280,248 C-120,252 60,242 220,246 C340,250 480,242 620,248 C760,254 900,244 1080,252"
          fill="none"
          stroke="#635749"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M-280,246.5 C-120,250.5 60,240.5 220,244.5 C340,248.5 480,240.5 620,246.5 C760,252.5 900,242.5 1080,250.5"
          fill="none"
          stroke="#9c8e7c"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeDasharray="8 3"
        />
        {[-160, -40, 110, 290, 430, 560, 710, 850, 980].map((wx, i) => (
          <circle key={`wms-${i}`} cx={wx} cy={246 + (i % 3) * 1.5} r="2.2" fill="#3a5234" opacity="0.75" />
        ))}
      </g>

      {/* 4. Unified Homestead Garden Lawn Plateau */}
      <path
        d="M-2400,305 Q-1200,310 -600,310 C-200,322 180,338 460,348 C760,358 1060,364 1350,372 C1580,378 2200,380 3600,385 L3600,430 C2400,440 1400,460 900,490 C550,520 220,535 70,545 C-100,560 -300,578 -650,605 C-1200,640 -2400,670 Z"
        fill="url(#homesteadLawnGrad)"
      />
      <polygon points="-280,332 0,355 40,372 -240,350" fill="#2d3e18" opacity="0.45" />
      <polygon points="460,348 640,366 760,358 580,378" fill="#2d3e18" opacity="0.48" />
      <polygon points="1060,364 1240,380 1350,372 1180,392" fill="#2a3a16" opacity="0.5" />
      <path
        d="M-200,322 C180,338 460,348 760,358 C1060,364 1350,372 1580,378"
        fill="none"
        stroke="#b5cb58"
        strokeWidth="1.6"
        opacity="0.45"
      />

      {/* 4.1 EAST RIDGE TECH TERRACE & HILLSIDE SHOULDER */}
      <g id="east-tech-terrace-knoll">
        <path
          d="M740,240 C850,225 1020,240 1200,265 C1320,285 1400,320 1400,450 C1250,460 1060,450 880,440 C780,430 730,400 710,360 C700,310 720,260 740,240 Z"
          fill="url(#homesteadLawnGrad)"
        />
        <path
          d="M880,390 C960,395 1100,410 1200,425 C1320,440 1400,450 1400,470 C1250,480 1060,470 880,440 Z"
          fill="#263a18"
          opacity="0.45"
        />
        <path
          d="M740,240 C850,225 1020,240 1200,265"
          fill="none"
          stroke="#b5cb58"
          strokeWidth="2.2"
          opacity="0.55"
        />

        {/* Terraced Stone Retaining Ledges */}
        <g id="boardwalk-retaining-terrace" transform="translate(-36, 0)">
          <polygon points="796,368 912,372 908,388 792,384" fill="url(#stoneWallFaceGrad)" stroke="#2d261e" strokeWidth="0.8" />
          <polygon points="796,368 912,372 914,375 798,371" fill="url(#stoneWallCapGrad)" />
          <line x1="825" y1="369" x2="823" y2="385" stroke="#1d1712" strokeWidth="0.8" />
          <line x1="855" y1="370" x2="853" y2="386" stroke="#1d1712" strokeWidth="0.8" />
          <line x1="885" y1="371" x2="883" y2="387" stroke="#1d1712" strokeWidth="0.8" />
          <line x1="796" y1="378" x2="910" y2="382" stroke="#1d1712" strokeWidth="0.7" strokeDasharray="6 3" />
        </g>

        {/* Capsule Pod Bedrock Plinth */}
        <g id="capsule-pod-ground-bedrock" transform="translate(894, 320)">
          <polygon points="-75,44 0,32 75,44 0,58" fill="#58635a" stroke="#373e38" strokeWidth="1.2" />
          <polygon points="-75,44 0,58 0,66 -75,52" fill="#2b322c" />
          <polygon points="0,58 75,44 75,52 0,66" fill="#3c463e" />
          <ellipse cx="-42" cy="46" rx="10" ry="3.5" fill="#4a6344" />
          <ellipse cx="38" cy="48" rx="12" ry="4" fill="#4a6344" />
          <ellipse cx="2" cy="54" rx="8" ry="3" fill="#384f33" />
        </g>

        {/* Alpine Dwarf Pines & Outcrop Stones */}
        <g id="east-terrace-wildlife" opacity="0.9">
          <g transform="translate(775, 360)">
            <ellipse cx="0" cy="8" rx="8" ry="3" fill="#141f14" opacity="0.4" />
            <path d="M-6,8 Q-2,-2 0,-12 Q2,-2 6,8" fill="#254228" stroke="#182c1b" strokeWidth="0.6" />
            <path d="M-4,-2 Q0,-10 0,-16 Q0,-10 4,-2" fill="#345938" />
          </g>
          <g transform="translate(1015, 305)">
            <ellipse cx="0" cy="12" rx="10" ry="4" fill="#141f14" opacity="0.4" />
            <path d="M-8,12 Q-3,-4 0,-18 Q3,-4 8,12" fill="#254228" stroke="#182c1b" strokeWidth="0.6" />
            <path d="M-5,-4 Q0,-15 0,-24 Q0,-15 5,-4" fill="#345938" />
          </g>
          <ellipse cx="760" cy="385" rx="6.5" ry="3.2" fill="#756b5e" stroke="#524a40" strokeWidth="0.6" />
          <ellipse cx="785" cy="405" rx="8" ry="3.8" fill="#696054" stroke="#484238" strokeWidth="0.6" />
          <ellipse cx="995" cy="375" rx="7.5" ry="3.5" fill="#706659" stroke="#4a4339" strokeWidth="0.6" />
        </g>
      </g>

      {/* 4.2 WEST SLEEPING CABIN MEADOW TERRACE */}
      <g id="west-cabin-terrace-knoll">
        <path
          d="M-400,320 C-280,310 -80,315 160,340 C280,355 350,390 320,440 C280,480 140,490 20,485 C-120,480 -280,460 -400,430 Z"
          fill="url(#homesteadLawnGrad)"
          opacity="0.9"
        />
        <path
          d="M-80,440 C40,455 160,460 260,450 C290,460 280,478 240,485 C140,495 20,490 -80,470 Z"
          fill="#263a18"
          opacity="0.38"
        />
      </g>

      {/* 4.3 ROLLING MORANDI PASTURE KNOLLS & GENTLE SLOPES */}
      <g id="rolling-pasture-base-terrain">
        {/* Upper Midground Rolling Meadow Contour */}
        <path
          d="M-2400,410 Q-1200,430 -500,450 C-100,465 240,460 620,445 C1000,430 1400,420 2200,400 L3600,390 L3600,2400 L-2400,2400 Z"
          fill="url(#homesteadLawnGrad)"
        />
        <polygon points="-120,460 180,472 340,465 80,482" fill="#2d3e18" opacity="0.32" />
        <polygon points="560,452 780,456 940,442 720,468" fill="#2d3e18" opacity="0.35" />

        {/* Main Rolling Pasture Swell */}
        <path
          d="M-2400,490 Q-1400,515 -600,530 C-150,540 280,530 720,515 C1180,500 1700,525 3600,500 L3600,2400 L-2400,2400 Z"
          fill="url(#foregroundPastureGrad)"
        />
        <path
          d="M-2400,490 Q-1400,515 -600,530 C-150,540 280,530 720,515 C1180,500 1700,525 3600,500"
          fill="none"
          stroke="#9ecb55"
          strokeWidth="2.2"
          opacity="0.65"
        />

        {/* Gentle Southern Foreground Knoll Swell */}
        <path
          d="M-2400,570 Q-1100,590 -350,595 C140,600 650,575 1180,560 C1750,580 2600,600 3600,580 L3600,2400 L-2400,2400 Z"
          fill="url(#foregroundPastureGrad)"
        />
        <path
          d="M-2400,570 Q-1100,590 -350,595 C140,600 650,575 1180,560 C1750,580 2600,600 3600,580"
          fill="none"
          stroke="#a3c458"
          strokeWidth="1.8"
          opacity="0.6"
        />

        {/* Worn Sheep Track through foreground meadow */}
        <path
          d="M-400,635 Q180,630 650,622 Q1150,630 1800,625"
          fill="none"
          stroke="#70854d"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="18 10"
          opacity="0.45"
        />
      </g>
    </g>
  );
};
