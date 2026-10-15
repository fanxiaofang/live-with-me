import React from 'react';

interface CurlyHairProps {
  view: 'front' | 'side' | 'back';
  color: string;
  part?: 'lengths' | 'fringe';
}

/** Layered, swept curls drawn for the existing r=7 head and beanie.
 * Separate tapered wisps replace the short haircut's filled crescent fringe. */
export function CurlyHair({ view, color, part = 'lengths' }: CurlyHairProps) {
  const outline = { fill: color, stroke: '#211b17', strokeOpacity: 0.4,
    strokeWidth: 0.22, strokeLinejoin: 'round' as const };
  const strand = { fill: 'none', stroke: '#17120f', strokeOpacity: 0.24,
    strokeWidth: 0.32, strokeLinecap: 'round' as const };

  if (part === 'fringe') return <g data-curly-hair="fringe" data-hair-view={view}>
    {view === 'front' ? <>
      <path d="M-4.6,-14.1 C-4.7,-12.6 -4.1,-11.7 -3.4,-11.2
        Q-3.8,-12.2 -3.4,-13.2 C-3.1,-12.1 -2.2,-11.6 -1.5,-11.8
        Q-2.3,-12.8 -1.8,-14.2 Z" {...outline} />
      <path d="M1.9,-14.2 C1.5,-13 2.1,-11.9 3,-11.5
        Q2.5,-12.6 2.9,-13.1 C3.4,-12.1 4.2,-11.8 4.8,-11.8
        Q4,-12.8 4.1,-14 Z" {...outline} />
    </> : <>
      <path d="M-5.6,-14 C-5.5,-12.8 -4.8,-12 -4,-11.9
        Q-4.6,-12.7 -4.3,-13.6 Z" {...outline} />
      <path d="M0.1,-13.2 C-0.1,-12 0.6,-10.9 1.2,-10.4
        Q1.1,-11.6 1.5,-11.9 Q2,-10.7 2.5,-10.2
        C2.9,-11.5 2.3,-12.5 2.1,-13.2 Z" {...outline} />
    </>}
  </g>;

  if (view === 'front') return <g data-curly-hair="lengths" data-hair-view="front">
    {[false, true].map(mirror => <g key={String(mirror)} transform={mirror ? 'scale(-1,1)' : undefined}>
      <path d="M-6.7,-14.2 C-7.2,-12.5 -7.1,-10.6 -7.8,-9
        Q-8.4,-7.7 -9.2,-7.3 Q-7.6,-7.3 -6.8,-8.4
        C-7.2,-6.8 -7.8,-5.9 -8.9,-5.5 Q-7.3,-5.2 -6.2,-6.4
        C-6.6,-4.6 -7.6,-3.4 -8.6,-2.8 C-6.7,-2.6 -5.5,-3.9 -5.2,-5.2
        Q-5,-6.8 -5.5,-8.2 Q-4.6,-7.2 -3.7,-7.2
        C-5.4,-8.4 -5.9,-10.4 -5.7,-12.1 Q-5.3,-11.2 -4.8,-10.8
        Q-4.9,-12.8 -5.3,-14 Z" {...outline} />
      <path d="M-6.4,-11.3 Q-6.5,-9.2 -7.7,-8.4
        M-6.2,-8.1 Q-6.4,-6.1 -7.5,-5.7
        M-5.8,-5.9 Q-6.1,-4.4 -7,-3.7" {...strand} />
    </g>)}
  </g>;

  if (view === 'side') return <g data-curly-hair="lengths" data-hair-view="side">
    <path d="M4.8,-14.9 L7.4,-13.5 C7.3,-11.7 7.6,-9.3 9.4,-8.1
      Q7.9,-8 7.1,-9 C7.3,-7.2 8.2,-6.2 9.6,-5.6
      Q8,-5.3 6.9,-6.5 C7.1,-4.7 8,-3.3 9.3,-2.6
      Q7.6,-2.3 6.4,-3.5 C6.9,-1.5 7.8,-0.1 9,0.9
      C7.1,0.8 5.8,-0.3 5.2,-1.9 Q5,-0.5 5.3,0.4
      C4,-0.8 3.7,-2.6 4,-4.5 Q3.7,-3.8 3.8,-3.1
      C2.9,-4.8 3.3,-6.7 4.1,-8.6 C4.8,-10.5 4.5,-12.5 4.8,-14.9 Z" {...outline} />
    {/* The cheek lock turns inward, the long back locks sweep outward. */}
    <path d="M3.8,-13.3 C3.3,-11.9 3.7,-10.6 3.1,-9.2
      Q2.7,-8.1 1.8,-7.6 Q3.3,-7.8 4.1,-9.2
      C3.9,-7.4 2.8,-6.1 1.3,-5.7 C3.2,-5.7 4.7,-6.9 5.4,-8.8
      C6.3,-10.6 5.8,-12.1 5.6,-13.5 Z" {...outline} />
    <path d="M6.2,-11.3 Q6.6,-9 7.8,-8.5
      M5.9,-8.1 Q6.2,-6.1 7.9,-5.8
      M5.6,-5.4 Q5.7,-3.6 7.5,-2.9
      M4.9,-3.5 Q5.4,-1.5 6.8,-0.6" {...strand} />
  </g>;

  return <g data-curly-hair="lengths" data-hair-view="back">
    <path d="M-7.5,-12.2 L7.5,-12.2 C7.1,-10.3 7.7,-8.4 9.2,-7.3
      Q7.6,-7.2 6.9,-8.3 C7,-6.5 7.8,-5.5 9,-4.9
      Q7.4,-4.5 6.1,-6.2 C6.8,-3.9 7.6,-2.5 8.7,-1.6
      Q6.5,-1.4 5.2,-3 Q5.4,-0.7 6.7,1.1
      C5,1.3 3.7,0.2 3.1,-1.2 C3.1,0.5 3,1.8 2,2.8
      Q1.1,1.9 0.8,0.7 C0.7,2.4 0.4,3.4 -0.2,4.2
      C-1.2,3.1 -1.6,1.6 -1.6,0.5 Q-2,2 -3.2,2.6
      Q-3.7,0.8 -3.2,-1 Q-4.7,1 -6.5,1.2 Q-5.2,-0.5 -5.2,-2.7
      Q-6.7,-1.2 -8.7,-1.6 C-7.2,-2.9 -6.6,-4.3 -6.3,-6
      Q-7.5,-4.7 -9.1,-4.9 C-7.6,-6 -7.1,-7.2 -7,-8.2
      Q-8,-7.1 -9.3,-7.2 C-7.6,-8.7 -7.1,-10.3 -7.5,-12.2 Z" {...outline} />
    <path d="M-5.7,-9.1 C-5.5,-7.3 -6,-6 -7.5,-5.7
      M-4.2,-8.9 C-3.3,-6.7 -4.3,-4 -6.3,-3.3
      M-2.4,-7.5 C-1.7,-5.1 -2.3,-2.8 -4.3,-1.5
      M0,-6.8 Q1,-3.6 -0.2,-1.5
      M2.5,-8 C1.9,-5.8 2.4,-3.4 4.5,-2
      M4.7,-9 Q4.1,-6.5 6.6,-5.4
      M5.8,-4.9 Q6.2,-3.1 7.1,-2.4" {...strand} />
  </g>;
}
