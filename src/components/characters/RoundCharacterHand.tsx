import React from 'react';

interface RoundCharacterHandProps {
  cx: number;
  cy: number;
  rx?: number;
  ry?: number;
  skinColor: string;
}

/** Simple rounded mitten. Sleeve overlap supplies the wrist; no finger seams. */
export function RoundCharacterHand({ cx, cy, rx = 1.7, ry = 1.5, skinColor }: RoundCharacterHandProps) {
  return <ellipse data-round-hand="true" cx={cx} cy={cy} rx={rx} ry={ry} fill={skinColor} />;
}
