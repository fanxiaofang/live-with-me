import React from 'react';
import { YorkshireCommonProps } from '../landscapeTypes';
import { YORKSHIRE_LAYOUT } from '../landscapeLayout';

/**
 * 🚜 FarmsteadLandscape (Tractor, Hay Bales, Paddock Fence, Pumpkin Patch, and Grounds)
 *
 * Layer: 05 INFRASTRUCTURE / Farmstead
 * Spatial Region: YORKSHIRE_LAYOUT.westFarm
 *
 * Preserves the tractor in the field, hay bales, paddock fence,
 * pumpkin patch, split birch woodpile, and garden flora.
 */
export const FarmsteadLandscape: React.FC<YorkshireCommonProps> = ({
  theme,
  setHoveredObject,
  className,
}) => {
  const farm = YORKSHIRE_LAYOUT.westFarm;

  return (
    <g id="yorkshire-farmstead-landscape" className={className}>
      {/* 1. COTTAGE VEGETABLE & PUMPKIN GARDEN (西翼阳光缓坡南瓜菜圃与香草地) */}
      <g id="cottage-pumpkin-patch" transform={`translate(${farm.pumpkinPatch.x}, ${farm.pumpkinPatch.y})`}>
        {/* Ground contact shadow under garden beds */}
        <ellipse cx="50" cy="38" rx="60" ry="18" fill="#1b2518" opacity="0.35" />

        {/* Terraced Cedar Timber Raised Beds */}
        <polygon points="0,22 96,22 104,44 6,44" fill="#382210" stroke="#241407" strokeWidth="0.8" />
        <polygon points="2,23 94,23 100,42 8,42" fill="#4a2e16" />
        <line x1="8" y1="28" x2="92" y2="28" stroke="#321e0e" strokeWidth="0.8" />
        <line x1="12" y1="35" x2="96" y2="35" stroke="#321e0e" strokeWidth="0.8" />

        {/* Pumpkin 1 */}
        <g transform="translate(26, 32)">
          <ellipse cx="0" cy="3" rx="10" ry="8" fill="#d97706" />
          <ellipse cx="-4" cy="3" rx="6" ry="7.5" fill="#ea580c" />
          <ellipse cx="4" cy="3" rx="6" ry="7.5" fill="#ea580c" />
          <ellipse cx="0" cy="2" rx="4" ry="7.5" fill="#f59e0b" />
          <path d="M0,-4 Q2,-9 -2,-11" stroke="#365314" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <ellipse cx="6" cy="-2" rx="3.5" ry="2" fill="#4d7c0f" transform="rotate(-15 6 -2)" />
        </g>

        {/* Pumpkin 2 */}
        <g transform="translate(54, 30)">
          <ellipse cx="0" cy="3" rx="8.5" ry="7" fill="#d97706" />
          <ellipse cx="-3.5" cy="3" rx="5.5" ry="6.5" fill="#ea580c" />
          <ellipse cx="3.5" cy="3" rx="5.5" ry="6.5" fill="#ea580c" />
          <ellipse cx="0" cy="2" rx="3.5" ry="6.5" fill="#f59e0b" />
          <path d="M0,-3 Q-2,-8 2,-9" stroke="#365314" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          <ellipse cx="-5" cy="-2" rx="3" ry="1.8" fill="#4d7c0f" transform="rotate(20 -5 -2)" />
        </g>

        {/* Pumpkin 3 */}
        <g transform="translate(78, 34)">
          <ellipse cx="0" cy="2.5" rx="7.5" ry="6" fill="#f59e0b" />
          <ellipse cx="-3" cy="2.5" rx="4.8" ry="5.5" fill="#d97706" />
          <ellipse cx="3" cy="2.5" rx="4.8" ry="5.5" fill="#d97706" />
          <path d="M0,-2 Q1,-6 -1,-7" stroke="#365314" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>

        {/* Savoy Cabbages */}
        <polygon points="12,4 86,4 92,20 18,20" fill="#382210" stroke="#241407" strokeWidth="0.8" />
        <polygon points="14,5 84,5 89,18 19,18" fill="#4a2e16" />
        {[28, 46, 64, 80].map((cx, idx) => (
          <g key={`cabbage-${idx}`} transform={`translate(${cx}, 12)`}>
            <ellipse cx="0" cy="0" rx="4.5" ry="3.5" fill="#2d5236" />
            <ellipse cx="-1" cy="-0.5" rx="3.5" ry="3" fill="#3f6e4a" />
            <ellipse cx="0.5" cy="0" rx="2.5" ry="2" fill="#5ea56e" />
            <circle cx="0" cy="-0.2" r="1.2" fill="#86efac" />
          </g>
        ))}

        {/* Wooden Sign Stake */}
        <g transform="translate(-4, 38)">
          <rect x="0" y="0" width="2.5" height="14" rx="0.5" fill="#5c381e" stroke="#2a1608" strokeWidth="0.5" />
          <polygon points="-8,-9 16,-9 14,0 -10,0" fill="#eedcc5" stroke="#684628" strokeWidth="0.8" />
          <text x="3" y="-3" fill="#4a2c14" fontSize="5.5" fontWeight="bold" textAnchor="middle">
            🎃 PUMPKINS
          </text>
        </g>

        {/* Stone Water Basin & Watering Can */}
        <g transform="translate(108, 32)">
          <ellipse cx="0" cy="7" rx="8" ry="4" fill="#1b2518" opacity="0.3" />
          <rect x="-6" y="0" width="12" height="7" rx="2" fill="#696053" stroke="#332c25" strokeWidth="0.8" />
          <ellipse cx="0" cy="0" rx="6" ry="2.2" fill="#386b68" stroke="#332c25" strokeWidth="0.6" />
          <ellipse cx="0" cy="0" rx="4.5" ry="1.4" fill="#64a5a1" opacity="0.75" />
        </g>
      </g>

      {/* 2. WEST HOMESTEAD WOODPILE & FLOWER BEDS */}
      <g id="west-cottage-grounds" transform={`translate(${farm.woodpile.x}, ${farm.woodpile.y})`}>
        <ellipse cx="8" cy="18" rx="14" ry="5" fill="#1b2518" opacity="0.3" />
        <rect x="0" y="6" width="16" height="12" rx="1.5" fill="#523924" stroke="#2c1d12" strokeWidth="0.7" />
        {[
          { x: 3, y: 10, r: 2.4 }, { x: 8, y: 10, r: 2.4 }, { x: 13, y: 10, r: 2.4 },
          { x: 5.5, y: 14.5, r: 2.4 }, { x: 10.5, y: 14.5, r: 2.4 },
        ].map((lg, i) => (
          <circle key={`wlog-${i}`} cx={lg.x} cy={lg.y} r={lg.r} fill="#d8cbba" stroke="#382618" strokeWidth="0.6" />
        ))}
        {/* Flowering Lavender Clump */}
        <g transform="translate(24, 14)">
          <path d="M-2,5 Q-4,-4 -6,-10 M0,5 Q0,-5 0,-12 M2,5 Q4,-4 5,-9" stroke="#385434" strokeWidth="1.2" fill="none" />
          <circle cx="-6" cy="-10" r="1.6" fill="#a855f7" />
          <circle cx="0" cy="-12" r="1.8" fill="#9333ea" />
          <circle cx="5" cy="-9" r="1.5" fill="#c084fc" />
        </g>
      </g>

      {/* 3. TRACTOR & HAY BALES AT THE FARMYARD CORNER */}
      <g
        id="tractor-in-field"
        transform={`translate(${farm.tractor.x}, ${farm.tractor.y})`}
        className="cursor-pointer transition-opacity hover:opacity-95"
        onMouseEnter={() => setHoveredObject?.('tractor')}
        onMouseLeave={() => setHoveredObject?.(null)}
      >
        {/* Weathered Timber Paddock Fence */}
        <g id="farm-paddock-fence" opacity="0.85">
          <line x1="-55" y1="18" x2="115" y2="18" stroke="#523d29" strokeWidth="2.5" />
          <line x1="-55" y1="26" x2="115" y2="26" stroke="#523d29" strokeWidth="2" />
          {[-45, -5, 35, 75, 110].map((fx) => (
            <rect key={`pf-${fx}`} x={fx - 1.5} y="10" width="3.2" height="24" rx="0.8" fill="#422f1f" />
          ))}
        </g>

        {/* Earthy Tractor Wheel Ruts & Farm Track */}
        <g opacity="0.45">
          <path d="M22,46 C32,60 45,78 60,98" stroke="#52402e" strokeWidth="3" strokeDasharray="5 4" fill="none" />
          <path d="M42,46 C52,60 65,78 80,98" stroke="#52402e" strokeWidth="3" strokeDasharray="5 4" fill="none" />
        </g>

        {/* Packed earth parking pad */}
        <ellipse cx="46" cy="46" rx="54" ry="12" fill="#604f3d" opacity="0.32" />

        {/* Water Barrel & Milk Churn */}
        <g transform="translate(100, 26)">
          <rect x="0" y="0" width="10" height="15" rx="1.5" fill="#523d28" stroke="#332415" strokeWidth="0.8" />
          <line x1="0" y1="4" x2="10" y2="4" stroke="#2b1f14" strokeWidth="0.9" />
          <line x1="0" y1="11" x2="10" y2="11" stroke="#2b1f14" strokeWidth="0.9" />
          <ellipse cx="5" cy="0" rx="4.5" ry="1.8" fill="#695137" />
        </g>

        {/* Golden Cylindrical Hay Bales */}
        <g transform="translate(-32, 22)">
          <ellipse cx="0" cy="12" rx="14" ry="9" fill="#e8c956" />
          <rect x="-14" y="0" width="28" height="12" fill="#d9b434" />
          <ellipse cx="0" cy="0" rx="14" ry="7" fill="#fae274" stroke="#c9a224" strokeWidth="0.8" />
          <circle cx="0" cy="0" r="3" fill="none" stroke="#bfa02c" strokeWidth="1" strokeDasharray="3,2" />
        </g>
        <g transform="translate(-10, 26)">
          <ellipse cx="0" cy="10" rx="13" ry="8" fill="#e8c956" />
          <rect x="-13" y="0" width="26" height="10" fill="#d9b434" />
          <ellipse cx="0" cy="0" rx="13" ry="6.5" fill="#fce47c" stroke="#c9a224" strokeWidth="0.8" />
        </g>
        <g transform="translate(-20, 10)">
          <ellipse cx="0" cy="9" rx="12" ry="7" fill="#e8c956" />
          <rect x="-12" y="0" width="24" height="9" fill="#d9b434" />
          <ellipse cx="0" cy="0" rx="12" ry="6" fill="#fae274" stroke="#c9a224" strokeWidth="0.8" />
        </g>

        {/* Red Countryside Farm Tractor */}
        <circle cx="22" cy="30" r="18" fill="#242629" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1={22 + 14 * Math.cos((deg * Math.PI) / 180)}
            y1={30 + 14 * Math.sin((deg * Math.PI) / 180)}
            x2={22 + 18 * Math.cos((deg * Math.PI) / 180)}
            y2={30 + 18 * Math.sin((deg * Math.PI) / 180)}
            stroke="#141517"
            strokeWidth="2.5"
          />
        ))}
        <circle cx="22" cy="30" r="10" fill="#e0c868" stroke="#beaa46" strokeWidth="1.2" />
        <circle cx="22" cy="30" r="4" fill="#242629" />

        <circle cx="76" cy="37" r="10" fill="#242629" />
        <circle cx="76" cy="37" r="5" fill="#e0c868" stroke="#beaa46" strokeWidth="1" />
        <circle cx="76" cy="37" r="2.2" fill="#242629" />

        <rect x="22" y="32" width="54" height="6" fill="#303338" rx="1" />
        <path d="M4,30 C4,14 40,14 40,30" stroke="#b83320" strokeWidth="5" fill="none" strokeLinecap="round" />

        <polygon points="16,18 48,15 82,23 82,37 32,37" fill="#d9402b" />
        <polygon points="16,18 48,15 48,22 18,24" fill="#f05b46" />
        <rect x="80" y="24" width="3" height="12" fill="#42474f" rx="1" />
        <line x1="81.5" y1="26" x2="81.5" y2="34" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />

        {/* Tractor Vertical Exhaust Chimney */}
        <line x1="64" y1="21" x2="64" y2="6" stroke="#2b2d30" strokeWidth="2.8" strokeLinecap="round" />
        <circle cx="64" cy="6" r="2" fill="#4d5057" />
        <circle cx="64" cy="2" r="3" fill="#ffffff" opacity="0.6" className="animate-ping" />
        <circle cx="68" cy="-5" r="4.5" fill="#ffffff" opacity="0.35" className="animate-pulse" />

        {/* Driver Seat & Steering Wheel */}
        <rect x="18" y="10" width="12" height="9" rx="2.5" fill="#1b1c1e" />
        <line x1="38" y1="18" x2="33" y2="11" stroke="#222" strokeWidth="2.2" strokeLinecap="round" />
        <ellipse cx="32" cy="10" rx="3.5" ry="2" fill="none" stroke="#222" strokeWidth="1.8" />

        {/* Headlight & Glow Beam */}
        <circle cx="82" cy="28" r="3.2" fill="#fce47c" stroke="#947a28" strokeWidth="1" />
        <polygon points="85,28 135,20 142,42 85,34" fill={theme.tractorLightGlow} className="pointer-events-none" />

        {/* Basket with pumpkins */}
        <rect x="0" y="17" width="14" height="11" rx="1.5" fill="#9c7149" stroke="#6e4f32" strokeWidth="1" />
        <ellipse cx="4.5" cy="16" rx="3.5" ry="3" fill="#e88a38" />
        <ellipse cx="10" cy="16" rx="3.5" ry="3" fill="#eb9846" />
        <ellipse cx="7.2" cy="13.5" rx="3" ry="2.5" fill="#d97d2e" />
        <line x1="7.2" y1="13.5" x2="7.2" y2="11" stroke="#3d6e42" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </g>
  );
};
