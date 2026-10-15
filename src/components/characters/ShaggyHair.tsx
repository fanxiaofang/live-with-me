import React from 'react';

export const SHAGGY_HAIR_PALETTE = { top: '#e4c983', underlayer: '#25221f' } as const;

/** Short feathered top over a dark nape, fitted to the existing r=7 head.
 * Roots are drawn before the beanie; the two profiles use its existing mirror. */
export function ShaggyHair({ view, color }: {
  view: 'front' | 'side' | 'back' | 'sleeping'; color: string;
}) {
  const top = { fill: color, stroke: '#725c3b', strokeOpacity: 0.32, strokeWidth: 0.2,
    strokeLinejoin: 'round' as const };
  const dark = { fill: SHAGGY_HAIR_PALETTE.underlayer };
  const strand = { fill: 'none', stroke: '#725c3b', strokeOpacity: 0.22, strokeWidth: 0.24,
    strokeLinecap: 'round' as const };

  if (view === 'sleeping') return <g data-shaggy-hair="sleeping">
    <path data-shaggy-underlayer="true" d="M-5.9,-0.4 Q-7,1 -6.4,3 L-5.5,2.6 L-5.1,3.3
      L-4.9,1.1 Z M5.7,-0.2 Q7,1.1 6.3,3.2 L5.6,2.7 L5,3.4 L4.8,1.1 Z" {...dark} />
    <path data-shaggy-top="true" d="M-6.3,-1.7 Q-6.9,-0.2 -7.7,0.4 L-6.1,0.2
      L-6.5,1.2 Q-5.5,1 -4.7,-0.1 L-4.9,0.9 Q-3.6,0.6 -3,-0.5
      L-2.8,0.7 Q-1.9,0.4 -1.4,-0.5 L-1,0.8 Q0,0.4 0.4,-0.6
      L1.1,0.8 Q2,0.2 2.4,-0.6 L3.3,0.9 L3.6,-0.2 Q4.4,0.8 5.3,1
      L5.1,0 Q6.3,0.7 7.6,0.5 Q6.6,-0.1 6.2,-1.6 Z" {...top} />
  </g>;

  if (view === 'back') return <g data-shaggy-hair="back">
    <path data-shaggy-underlayer="true" d="M-7,-12 L7,-12 Q7.5,-9.5 6.3,-7.8
      L6.7,-6.5 L5.5,-7 L5.5,-5.8 L4.3,-6.7 L3.8,-5.5 L2.9,-6.3
      L2.1,-5.3 L1.4,-6.1 L0.5,-5.2 L-0.3,-6 L-1.2,-5.4 L-1.9,-6.4
      L-3,-5.5 L-3.5,-6.5 L-4.7,-5.9 L-4.7,-7 L-6.2,-6.5 L-5.9,-7.8
      Q-7.4,-9.7 -7,-12 Z" {...dark} />
    {/* The rear cuff sits lower than the front cuff; expose the pale feathered
        layer below that curve, with the dark nape still visible underneath. */}
    <g transform="translate(0,1.9)">
      <path data-shaggy-top="true" d="M-7.7,-13.8 L7.7,-13.8
      Q7.7,-11.7 9,-10.5 Q7.5,-10.4 6.7,-11.2 L7.5,-9.4
      Q6.1,-9.8 5.5,-10.7 L5.7,-8.9 Q4.5,-9.5 4,-10.8
      Q4,-9.4 3.2,-8.8 L2.7,-10.5 Q2.3,-9.4 1.5,-9 L1,-10.6
      Q0.4,-9.4 -0.3,-8.8 L-0.8,-10.5 Q-1.4,-9.5 -2.2,-9.1 L-2.5,-10.8
      Q-3,-9.5 -4,-8.9 L-4.2,-10.8 Q-5,-9.7 -6.3,-9.2 L-6,-10.7
      Q-7.3,-9.8 -8.9,-10.4 Q-7.6,-11.6 -7.7,-13.8 Z" {...top} />
      <path d="M-5.4,-12 Q-5.4,-10.9 -5,-10.3 M-1.9,-12 Q-1.7,-10.7 -1.8,-10
      M2.3,-12 Q2.4,-10.9 2,-10.1 M5.8,-12 Q5.5,-11 6.1,-10.3" {...strand} />
    </g>
  </g>;

  if (view === 'side') return <g data-shaggy-hair="side">
    <path data-shaggy-underlayer="true" d="M3.4,-13 L7.1,-12 Q7.5,-9.7 6.8,-8
      L7.2,-6.8 L6.2,-7.3 L6.2,-6 L5.2,-6.8 L4.6,-5.8 L4,-7
      L3.3,-6.6 Q3.8,-8.2 3.3,-9.6 Z" {...dark} />
    <path data-shaggy-top="true" d="M-7.1,-14.6 C-7.5,-12.9 -8.1,-12.1 -9,-11.7
      Q-7.9,-11.5 -7,-12 L-7.8,-10.3 Q-6.5,-10.4 -5.6,-11.6
      L-5.8,-9.6 Q-4.4,-10.5 -4.1,-12.4 C-3.8,-11 -3.9,-10.3 -4.1,-9.3
      Q-2.7,-10 -2.3,-11.8 L-2.4,-10.2 Q-1,-10.7 -0.6,-12.2
      C0.1,-10.8 0.3,-9.7 0,-8.8 Q1.4,-9.6 1.9,-11.4 L2.5,-9.1
      Q3.2,-9.7 3.4,-10.6 L4.5,-8.7 L4.5,-10.1 Q5.4,-8.9 6.7,-8.4
      L6.1,-10 Q7.1,-9.2 8.6,-9.1 Q7.4,-10 7.1,-11.6 L6.6,-14 Z" {...top} />
    <path d="M-4.9,-12.9 Q-5,-11.6 -5.2,-10.8 M-0.2,-12.4 Q1,-11.1 0.8,-10.2
      M4.8,-11.8 Q5,-10.4 5.8,-9.7" {...strand} />
  </g>;

  return <g data-shaggy-hair="front">
    <path data-shaggy-underlayer="true" d="M-6.7,-13 L-4.8,-12.2 L-4.8,-8.4
      L-5.7,-7.4 L-5.7,-8.5 L-6.5,-8 L-6.2,-9.3 Q-7.1,-11 -6.7,-13 Z
      M6.7,-13 L4.8,-12.2 L4.8,-8.4 L5.7,-7.4 L5.7,-8.5 L6.5,-8 L6.2,-9.3
      Q7.1,-11 6.7,-13 Z" {...dark} />
    <path data-shaggy-top="true" d="M-7.3,-14.5 C-7.4,-12.8 -8.2,-12 -9,-11.7
      Q-7.9,-11.3 -6.9,-12 Q-7.4,-10.7 -8.3,-10.1 Q-7,-10.2 -6,-11.2
      L-6.5,-9.1 Q-5.3,-10.2 -4.8,-12.1 Q-4.4,-10.8 -4.6,-9.3
      C-3,-10 -2.9,-11.8 -2.4,-13.5 Q-2.1,-12.2 -2.7,-10.8
      Q-1.2,-11.2 -0.4,-13.1 C-0.2,-11.3 -1,-10.4 -1.3,-9.1
      C0.6,-9.8 1.1,-11.6 1.2,-12.4 Q1.7,-10.8 1.1,-10.2 Q2.6,-11 3.2,-12.8
      C3.5,-11.4 3.2,-10.3 3,-9.5 Q4.4,-10.1 4.6,-12.3 Q5.3,-10.6 5.9,-9.8
      L5.8,-11.2 Q6.8,-10.2 8.4,-10.3 Q7.5,-11.1 6.9,-12 Q8,-11.4 9,-11.8
      Q7.6,-12.6 7.2,-14.4 Z" {...top} />
    <path d="M-6,-13 Q-6.1,-12 -6.8,-11.3 M-3.3,-13 Q-3.4,-11.3 -4,-10.5
      M0.2,-13 Q0.5,-11.4 -0.2,-10.2 M4.2,-13 Q4.4,-11.6 3.8,-10.6" {...strand} />
  </g>;
}
