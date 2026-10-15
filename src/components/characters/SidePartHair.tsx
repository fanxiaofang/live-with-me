import React from 'react';

/** Reference hairstyle: one long swept front lock, tucked opposite temple,
 * compact nape hair and a small low tie. Profiles show different anatomy. */
export function SidePartHair({ view, color, tuckedSide = false }: {
  view: 'front' | 'side' | 'back' | 'sleeping'; color: string; tuckedSide?: boolean;
}) {
  const fill = { fill: color, stroke: '#302821', strokeOpacity: 0.28, strokeWidth: 0.22,
    strokeLinejoin: 'round' as const };
  const line = { fill: 'none', stroke: '#302821', strokeOpacity: 0.25, strokeWidth: 0.3,
    strokeLinecap: 'round' as const };
  if (view === 'sleeping') return <g data-sidepart-hair="sleeping">
    <path d="M-1.4,-3.4 C-4.3,-3.4 -6.1,-1.9 -6.2,0.1
      C-6.2,2.9 -4.9,4.7 -2.8,5.8 C-3.5,3.6 -3.1,0.6 -1.4,-1.3 Z" {...fill} />
    <path d="M5.3,0.6 C7.2,1 7.6,2.7 6.6,4.1 C6.2,2.8 4.9,2.5 5.3,0.6 Z" {...fill} />
    <ellipse cx="5.8" cy="1" rx="0.7" ry="0.4" fill="#694b3b" />
  </g>;
  if (view === 'back') return <g data-sidepart-hair="back">
    <path d="M-7.5,-12 L7.5,-12 C7.6,-9.8 7.1,-7.2 6.1,-5.9
      Q5.4,-5.2 4.8,-5.3 L5.2,-6.6 C4.1,-5.2 2.6,-4.5 0.9,-4.8
      L0,-4.5 L-0.9,-4.8 C-2.8,-4.4 -4.3,-5.4 -5,-6.5
      Q-4.6,-5.5 -4.4,-5.1 C-6.8,-5.6 -7.7,-8.8 -7.5,-12 Z" {...fill} />
    {/* One continuous gathered tuft, with a single taper instead of two lobes. */}
    <path d="M-1.1,-4.9 C-2,-3.7 -1.4,-1.3 0.2,0.7
      C0.7,-1 1.7,-2.1 1.1,-3.7 Q0.7,-4.5 1,-4.9 Z" {...fill} />
    <path d="M-5.8,-9.3 C-5.7,-7.6 -4.1,-5.4 -1.1,-5.1
      M5.3,-9.1 C5,-7.1 3.3,-5.4 1,-5
      M-0.4,-8.5 Q-0.9,-6.7 -0.3,-5.3 M-0.4,-3.5 Q-0.6,-1.8 0,0" {...line} />
    <ellipse data-low-hair-tie="true" cx="0" cy="-4.8" rx="1" ry="0.45" fill="#694b3b" />
  </g>;
  if (view === 'front') return <g data-sidepart-hair="front">
    <path d="M5.3,-14.7 C7.1,-12.3 7.2,-9.8 5.6,-7.6
      Q4.9,-7 4.3,-7.1 C5.4,-8.7 5.6,-10.6 4.8,-12.1 Q4.2,-13.4 3.6,-14.5 Z" {...fill} />
    {/* The visible root begins close to the parting, covering part of the face.
        The opposite temple is tucked away, without a second hanging lock. */}
    <path data-long-front-lock="true" d="M-1,-15.5 C-4,-15.3 -6.6,-13.3 -6.7,-10.7
      C-6.9,-6.9 -5.2,-3.7 -2.4,-1.8 C-3.2,-5.2 -2.8,-8.1 -1.8,-11.9
      Q-1.3,-13.2 -0.2,-14.3 Z" {...fill} />
    <path d="M-4.9,-12 C-5.3,-7.3 -4.7,-5.5 -3.8,-4.1
      M5.7,-11.6 Q6,-9.8 5.4,-8.7" {...line} />
  </g>;
  return <g data-sidepart-hair={tuckedSide ? 'tucked-profile' : 'long-lock-profile'}>
    {/* Canonical profile faces left. Hair covers the rear quadrant of the head,
        from beneath the brim to the nape, instead of leaving a skin-coloured gap. */}
    <path data-gathered-side-hair="true" d="M-0.2,-15 L7.2,-13.8
      C7.8,-10.9 7.4,-7.8 6.5,-6.4 Q6,-5.5 5.4,-5.3
      C4.4,-5.7 3.8,-6.5 3.6,-7.3 Q3.5,-8.7 2.6,-9.3
      C2.2,-10.4 2.5,-11.4 1.5,-12.2 Q0.5,-13.1 -0.2,-15 Z" {...fill} />
    <path d="M5.2,-5.5 C6.6,-5.7 7.7,-4.3 7.6,-2.9
      C7.5,-1.5 6.9,-0.6 6.4,0.1 C6.7,-1.6 5.4,-2.3 5.1,-3.6
      Q4.9,-4.7 5.2,-5.5 Z" {...fill} />
    <path d="M5.9,-11.7 C6.7,-8.5 6.3,-7.1 5.6,-6
      M5.8,-4.1 Q6.6,-2.7 6.6,-1.6" {...line} />
    <ellipse data-low-hair-tie="true" cx="5.5" cy="-5.4" rx="0.7" ry="0.45" fill="#694b3b" />
    {tuckedSide ? <>
      {/* The character's left temple is swept back. The opposite long lock is
          only a slim contour outside the face silhouette, not a near-side curtain. */}
      <path data-far-front-lock="true" d="M-6.5,-14.5
        C-7.7,-12.7 -7.3,-9.1 -6.2,-6.3 Q-5.1,-3.7 -3.4,-2.2
        C-4.1,-4.4 -4.2,-6 -4.3,-8.3 Q-6.4,-10.1 -6.9,-12.2
        L-5.6,-14 Z" {...fill} />
      <path d="M0.7,-13.5 C1.7,-12 2.8,-11.8 3.4,-10.1
        M3.7,-8.3 Q4.1,-6.7 5.1,-5.9" {...line} />
    </> : <>
      {/* The character's right lock falls from the temple plane. The forehead
          and forward edge of the face remain ahead of it after the NE mirror. */}
      <path data-long-front-lock="true" d="M0.5,-15
        C-2.4,-14.5 -3.8,-12.6 -3.9,-10.2
        C-4.2,-6.9 -3.1,-3.8 -0.7,-2.1
        C-1.4,-5.1 -1.2,-8.2 -0.2,-10.9 Q0.6,-13 2.1,-14 Z" {...fill} />
      <path d="M-2.6,-11.7 C-3.1,-8.4 -2.7,-6.1 -1.8,-4.5" {...line} />
    </>}
  </g>;
}
