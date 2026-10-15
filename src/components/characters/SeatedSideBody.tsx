import React, { useId } from 'react';
import { CHARACTER_REFERENCE_PALETTE as palette, SEATED_SIDE_ROBE as hem } from './characterProportions';
import { RoundCharacterHand } from './RoundCharacterHand';

interface SeatedSideBodyProps {
  shirtColor?: string;
  skinColor?: string;
  holdingCup?: boolean;
  showGroundShadow?: boolean;
}

/** User's Boxy SVG profile facing left. Head center remains (0,-14).
 * Mirror the containing actor for the right profile, including its accessories. */
export function SeatedSideBody({ shirtColor = palette.shirt, skinColor = palette.skin,
  holdingCup = false, showGroundShadow = false }: SeatedSideBodyProps) {
  const prefix = `seated-contact-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  return <g data-seated-side-body="true">
    <defs>
      <linearGradient id={`${prefix}-rim`} x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0" stopColor={palette.shadow} stopOpacity="0" />
        <stop offset="0.25" stopColor={palette.shadow} stopOpacity="0.15" />
        <stop offset="0.5" stopColor={palette.shadow} stopOpacity="0.22" />
        <stop offset="0.75" stopColor={palette.shadow} stopOpacity="0.15" />
        <stop offset="1" stopColor={palette.shadow} stopOpacity="0" />
      </linearGradient>
      {showGroundShadow && <radialGradient id={`${prefix}-soft`}>
        <stop offset="0" stopColor={palette.shadow} stopOpacity="0.15" />
        <stop offset="0.65" stopColor={palette.shadow} stopOpacity="0.09" />
        <stop offset="1" stopColor={palette.shadow} stopOpacity="0" />
      </radialGradient>}
    </defs>
    {/* The shadow follows the robe footprint. It does not sit as a detached
        ellipse below the person; only a thin crescent remains under the hem. */}
    {showGroundShadow && <ellipse data-seated-ground-shadow="true" cx={hem.cx} cy="4.86"
      rx="10.9" ry="2.62" fill={`url(#${prefix}-soft)`} />}
    <path data-seated-contact-shadow="true"
      d={`M${hem.cx + hem.rx},${hem.cy} A${hem.rx},${hem.ry} 0 0 1 ${hem.cx - hem.rx},${hem.cy}
        L${hem.cx - hem.rx},${hem.cy + 0.22} A${hem.rx},${hem.ry} 0 0 0 ${hem.cx + hem.rx},${hem.cy + 0.22} Z`}
      fill={`url(#${prefix}-rim)`} />
    {/* Far sleeve is covered by the torso and the near forearm. */}
    <path d="M-2.1,-7.5 Q-3.7,-5.8 -3.5,-3.7 Q-3.9,-1.9 -5.1,0.8
      L-3.4,1.8 Q-1.6,-0.3 -1.6,-3.2 L-0.9,-6.3 Z" fill={shirtColor} />

    {/* Keep the user's broad, flat drape and original ellipse layering. */}
    <ellipse data-robe-hem="true" cx={hem.cx} cy={hem.cy} rx={hem.rx} ry={hem.ry} fill={shirtColor} />
    {/* Two smooth, nested ellipses follow the same hem construction as the
        front/back pose. The lower rim stays continuous around the seated lap. */}
    <ellipse cx="-0.6" cy="4.7" rx="9.727" ry="2.137" fill={palette.shadow} opacity="0.13" />
    <ellipse cx="-0.6" cy="4.1" rx="9.323" ry="2.021" fill={shirtColor} />

    {/* Continuous head-to-shoulder contour, with rounded chest and back depth. */}
    <path d="M-1.4,-9.1 C-3.3,-8.8 -5.159,-5.68 -5.409,-2.38
      C-5.959,0.32 -5.65,1.3 -6.1,2.9 C-4.9,5.2 1.45,5.6 4.95,3.6
      C4.2,0.5 6.837,-1.586 3.4,-7.1 C2.8,-8.7 1.2,-9.367 -1.4,-9.1 Z" fill={shirtColor} />
    <path d="M2.5,-6.6 C6.402,-3.162 4.127,-0.639 3.652,1.7
      C3.852,2.1 4.067,2.467 4.6,2.8 L4.85,2.5
      C4.862,0.771 4.778,-2.093 3.4,-7.1 L2.5,-6.6 Z"
      fill={palette.shadow} opacity="0.03" />
    <path d="M2.9,-1.3 Q3.2,0.6 3.6,1.7"
      fill="none" stroke={palette.shadow} strokeOpacity="0.055" strokeWidth="0.35" strokeLinecap="round" />

    {/* A full rounded palm sits behind the slanted cuff. Sleeve overlap keeps
        the hand attached without an exposed thin wrist or pointed thumb. */}
    <RoundCharacterHand cx={-2.8} cy={2} rx={1.85} ry={1.6} skinColor={skinColor} />
    <path d="M0.9,-7.6 C2.3,-6.9 2.25,-4.5 1.45,-2.45
      Q0.8,-0.4 -0.75,2.1 Q-1.45,1.35 -2,0.45 Q-1.05,-0.8 -0.9,-3.8
      L-0.6,-6.8 Q-0.1,-7.8 0.9,-7.6 Z" fill={shirtColor} />
    <path d="M1.4,-3.9 Q1.35,-0.9 -0.7,1.2"
      fill="none" stroke={palette.shadow} strokeOpacity="0.075" strokeWidth="0.4" strokeLinecap="round" />
    <path d="M-2,0.45 Q-1.45,1.35 -0.75,2.1" fill="none" stroke={palette.shadow}
      strokeOpacity="0.07" strokeWidth="0.3" strokeLinecap="round" />
    {holdingCup && <g data-seated-cup="true" transform="translate(1.05,0.7)">
      <path d="M-5.4,0.5 Q-5.5,2 -4,2 Q-2.5,2 -2.6,0.5 Z" fill="#eeeae1" />
      <ellipse cx="-4" cy="0.5" rx="1.4" ry="0.8" fill="#fcfbf7" />
      <ellipse cx="-4" cy="0.5" rx="0.95" ry="0.4" fill="#976849" />
    </g>}
  </g>;
}
