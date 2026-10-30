export type LandscapeTreeSpecies = 'pine' | 'birch' | 'broadleaf';

/** Shared silhouettes; receiving layers supply their own scale and atmosphere. */
export function LandscapeTreeShape({ species, leaf, shade, light, trunk = shade, birchTrunk = '#c1c4a8' }: {
  species: LandscapeTreeSpecies;
  leaf: string; shade: string; light: string; trunk?: string; birchTrunk?: string;
}) {
  return <>
    <path d="M0,0 V-23" stroke={species === 'birch' ? birchTrunk : trunk} strokeWidth={species === 'birch' ? 1.5 : 2} fill="none" />
    {species === 'pine' ? <>
      <path d="M0,-36 Q-4,-27 -7,-22 L-3,-23 Q-7,-15 -11,-10 Q-6,-8 0,-8 Q6,-8 11,-10 Q7,-15 3,-23 L7,-22 Q4,-27 0,-36Z" fill={leaf} />
      <path d="M0,-34 L0,-9 Q6,-8 11,-10 L3,-23 L7,-22Z" fill={shade} opacity=".42" />
    </> : species === 'birch' ? <>
      <ellipse cx="-4" cy="-24" rx="5.8" ry="10" fill={light} />
      <ellipse cx="4" cy="-27" rx="6.2" ry="10.5" fill={leaf} />
      <ellipse cx="0" cy="-33" rx="5" ry="7" fill={light} />
      <path d="M-1,-7 h2 M-1,-13 h1.5" stroke={shade} strokeWidth=".7" />
    </> : <>
      <ellipse cx="-6" cy="-21" rx="9" ry="8" fill={leaf} />
      <ellipse cx="6" cy="-20" rx="9" ry="8" fill={shade} />
      <ellipse cx="0" cy="-28" rx="10" ry="8" fill={light} />
    </>}
  </>;
}
