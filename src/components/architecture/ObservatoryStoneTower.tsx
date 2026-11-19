import { useId } from 'react';

/** A round, tapered tower with openings projected onto its near and right tangents. */
export function ObservatoryStoneTower({ night = false }: { night?: boolean }) {
  const uid = 'observatory-stone-' + useId().replace(/:/g, '');
  return <g id="observatory-stone-tower" strokeLinejoin="round" strokeLinecap="round">
    <title>麦田石砌电波台 · 曲面石墙、嵌入拱门与侧窗</title>
    <defs>
      <linearGradient id={uid+'-wall'} x1="-44" y1="0" x2="44" y2="0" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a99874" /><stop offset=".23" stopColor="#c6b48c" />
        <stop offset=".51" stopColor="#bba983" /><stop offset=".78" stopColor="#a59677" />
        <stop offset="1" stopColor="#8f836a" />
      </linearGradient>
    </defs>
    <g filter={night ? 'url(#field-environment-tone)' : undefined}>
      <ellipse cy="53" rx="49" ry="12" fill="#625e3e" opacity=".19" />
      {/* The exposed rear shoulder and curved front riser share the deck's ground ratio. */}
      <path d="M-49,49 A49,13.9 0 0 0 49,49 L49,53 A49,13.9 0 0 1 -49,53Z" fill="#9a8d70" />
      <ellipse cy="49" rx="49" ry="13.9" fill="#c9ba91" />
      <path d="M-36,-24 Q0,-3.6 36,-24 C37,-1 40,25 44,46 A44,12.5 0 0 1 -44,46 C-39,22 -37,-1 -36,-24Z"
        fill={'url(#'+uid+'-wall)'} stroke="#8d7e60" strokeWidth=".7" />
      {/* Courses turn around the cylinder instead of describing a flat facade. */}
      <g fill="none" stroke="#8d7d60" strokeWidth=".75" opacity=".72">
        <path d="M-36,-10 Q-22,-3 -8,-1 M4,-.5 Q22,-2 36,-10
          M-37,5 Q-25,11 -14,13 M7,14 Q24,11 38,5
          M-39,21 Q-30,26 -23,27 M17,29 Q31,25 40,21
          M-41,37 Q-33,41 -27,42 M19,44 Q32,41 42,36
          M-39,49 Q-32,53 -27,54 M20,55 Q33,52 40,48" />
        <path d="M-24,-5 l-.6,13 M-32,8 l-.7,16 M-25,28 l-.8,13
          M12,-1 l.8,13 M31,8 l1,16 M29,26 l1.1,14" />
      </g>
      <g fill="#d4c39b" opacity=".58">
        <path d="M-33,-7 q5,3 10,4 l-.2,5 q-6,-1 -11,-4Z
          M-37,12 l9,3 -.5,6 -9,-3Z M-39,29 l9,3 -.5,5 -10,-3Z
          M-35,44 l7,2 -.3,5 -8,-2Z" />
        <path d="M16,17 l10,-2 .4,4 -10,2Z M27,43 l11,-4 .5,4 -11,4Z" opacity=".5" />
      </g>
      {/* A single affine tangent keeps both jambs vertical and the sill in the wall plane. */}
      <g id="observatory-tower-window" transform="matrix(.82 -.22 0 1 24 0)">
        <path d="M-6,10 V-5 Q-6,-12 0,-12 Q6,-12 6,-5 V10Z" fill="#d0bf99" stroke="#968365" strokeWidth=".55" />
        <path d="M-3.8,7.8 V-4.7 Q-3.8,-9 0,-9 Q3.8,-9 3.8,-4.7 V7.8Z" fill="#454b3c" />
        <path d="M-3.8,7.8 V-4.7 Q-3.8,-9 0,-9 L.8,-7 Q-1.8,-7 -1.8,-3 V7.8Z" fill="#726e50" />
        <path d="M-6.5,10 H6.5 V11.8 H-6.5Z" fill="#9b8c6d" />
        <path d="M-6.5,10 H6.5" stroke="#e0cea6" strokeWidth=".6" />
      </g>
      {/* The near-left tangent gives arch, door boards and threshold one coherent slope. */}
      <g id="observatory-tower-entrance" transform="matrix(.96 .17 0 1 -12 58.5)">
        <path d="M-13,0 V-31 A13,13 0 0 1 13,-31 V0Z" fill="#ccb78e" stroke="#a08b66" strokeWidth=".65" />
        <path d="M-9.5,0 V-30.5 A9.5,9.5 0 0 1 9.5,-30.5 V0Z" fill="#4e4635" />
        <path d="M-7.6,-.7 V-29.7 A7.6,8.4 0 0 1 7.6,-29.7 V-.7Z" fill="#89613e" />
        <path d="M-9.5,0 V-30.5 Q-9.5,-36 -5.5,-38 Q-7.6,-34 -7.6,-29.7 V-.7Z" fill="#65533b" />
        <path d="M-4.4,-35 v33 M.2,-37 v35 M4.8,-34 v32" stroke="#644931" strokeWidth=".65" />
        <path d="M-6,-30 v17 M-2.5,-35 v14" stroke="#b38b56" strokeWidth=".6" />
        {/* Sparse radial arch joints and staggered jamb blocks stop at the reveal. */}
        <path d="M-13,-30 h3.5 M-12,-36 l3.2,1.2 M-7.3,-41.7 l1.7,3
          M0,-44 v3.5 M7.3,-41.7 l-1.7,3 M12,-36 l-3.2,1.2 M9.5,-30 H13
          M-13,-19 h3.5 M9.5,-15 H13 M-13,-7 h3.5" fill="none" stroke="#9c8661" strokeWidth=".7" />
        <circle cx="4.5" cy="-16" r="1.1" fill="#cfac69" />
        <path d="M-10,0 H10 L11,1.8 H-11Z" fill="#b8a47c" />
      </g>
      {/* Treads follow the same tangent, then advance outward toward the near-left field. */}
      <g id="observatory-entry-steps" transform="matrix(.96 .17 0 1 -12 58.5)">
        <path d="M-12,2 H11 L10.5,4 H-12.5Z M-16,7 H12 L11.5,9 H-16.5Z M-20,12 H13 L12.5,14 H-20.5Z"
          fill="#978b6c" />
        <path d="M-10,0 H10 L11,2 H-12Z M-12.5,4 H10.5 L12,7 H-16Z M-16.5,9 H11.5 L13,12 H-20Z"
          fill="#c9bb95" stroke="#ad9e7c" strokeWidth=".35" />
        <path d="M-11,1.8 H10.5 M-15,6.8 H11.5 M-19,11.8 H12.5" fill="none" stroke="#dfd0aa" strokeWidth=".6" />
      </g>
    </g>
    {night && <g transform="matrix(.82 -.22 0 1 24 0)">
      <path d="M-1.5,7 V-3.8 Q-1.5,-7 1,-7 Q3.4,-7 3.4,-3.8 V7Z" fill="#f0bf70" opacity=".88" />
    </g>}
  </g>;
}
