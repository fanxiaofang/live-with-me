import React, { useId } from 'react';
import { CHARACTER_WORLD_SIZE, SEATED_SIDE_ROBE } from '../characters/characterProportions';

// The accepted robe defines the hand-drawn horizontal plane. Cushion width
// and thickness remain furniture dimensions, independent of character scale.
const planeRatio = SEATED_SIDE_ROBE.ry / SEATED_SIDE_ROBE.rx;
export const TEA_CUSHION = {
  cx: 0, cy: 3.5, rx: 12, ry: 12 * planeRatio, thickness: 2,
  backRobeRy: 10 * planeRatio,
} as const;

/** Seat the real robe footprint on the cushion center, then mirror the whole
 * actor for the opposite seat. Scaling about the old pivot alone cannot align it. */
export function teaCharacterAtCushion(side: boolean) {
  const sourceCx = side ? SEATED_SIDE_ROBE.cx : 0;
  const sourceCy = side ? SEATED_SIDE_ROBE.cy : 3;
  return `translate(${TEA_CUSHION.cx},${TEA_CUSHION.cy}) scale(${CHARACTER_WORLD_SIZE.authoringScale}) translate(${-sourceCx},${-sourceCy})`;
}

export function TeaCushion({ highlighted = false }: { highlighted?: boolean }) {
  const id = `tea-cushion-shadow-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const { cy, rx, ry, thickness } = TEA_CUSHION;
  const baseY = cy + thickness;
  return <g data-tea-cushion="true">
    <defs>
      <radialGradient id={id}>
        <stop offset="0" stopColor="#24180f" stopOpacity="0.2" />
        <stop offset="0.7" stopColor="#24180f" stopOpacity="0.1" />
        <stop offset="1" stopColor="#24180f" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse data-cushion-ground-shadow="true" cx="0" cy={baseY + 0.12}
      rx={rx + 1.2} ry={ry + 0.25} fill={`url(#${id})`} />
    <path data-cushion-ground-contact="true"
      d={`M${rx},${baseY} A${rx},${ry} 0 0 1 ${-rx},${baseY}
        L${-rx},${baseY + 0.16} A${rx},${ry} 0 0 0 ${rx},${baseY + 0.16} Z`}
      fill="#24180f" opacity="0.14" />
    {/* Both arcs are the same ellipse, separated only by cushion thickness. */}
    <path data-cushion-side="true"
      d={`M${-rx},${cy} A${rx},${ry} 0 0 0 ${rx},${cy}
        L${rx},${baseY} A${rx},${ry} 0 0 1 ${-rx},${baseY} Z`}
      fill="#99876a" />
    <ellipse data-cushion-top="true" cx="0" cy={cy} rx={rx} ry={ry}
      fill="#c7b99d" stroke={highlighted ? '#fbbf24' : '#ded4bd'}
      strokeWidth={highlighted ? 1.4 : 0.8} />
  </g>;
}
