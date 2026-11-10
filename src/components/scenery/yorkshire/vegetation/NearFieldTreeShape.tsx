import type { LandscapeTreeSpecies } from './LandscapeTreeShape';

type Props = {
  species: LandscapeTreeSpecies;
  leaf: string; shade: string; light: string; trunk?: string; birchTrunk?: string;
  birchCrown?: 'paired' | 'open-weave';
};

/** Field / lawn trees only. Roots and crown envelopes retain their placement;
 * open branch fans distinguish these crowns from the distant silhouettes. */
export function NearFieldTreeShape({ species, leaf, shade, light, trunk = shade, birchTrunk = '#dfdfc8', birchCrown = 'paired' }: Props) {
  return <g data-near-field-tree={species} strokeLinejoin="round">
    <path d="M-3,.4 Q0,-.6 3,.4 L4,1 Q1,1.5 -3,1Z" fill={shade} opacity=".25" />
    {species === 'birch' ? <>
      {/* A slim, slightly leaning leader remains visible through the leaf crown. */}
      <path d="M-1.2,0 Q-.1,-9 -1,-18 Q-1.6,-28 .8,-39 L1.4,-39 Q-.1,-28 .2,-21 Q.8,-10 1.1,0Z" fill={birchTrunk} />
      <path d="M.6,-31 Q-.3,-20 .7,-9 L1.1,0 .3,0 Q-.2,-11 -.5,-19Z" fill={trunk} opacity=".3" />
      {birchCrown === 'open-weave' ? <BirchOpenCrown leaf={leaf} shade={shade} light={light} trunk={trunk} birchTrunk={birchTrunk} /> : <>
      <path d="M-.4,-15 Q-4,-20 -6,-29 M-.7,-22 Q3,-26 6,-34 M-.3,-28 Q-3,-32 -3,-36"
        stroke={birchTrunk} strokeWidth=".8" fill="none" />
      <path d="M-5,-25 Q-9,-26 -9,-20 M-5.6,-28 Q-8,-31 -8,-27 M2,-26 Q8,-29 9,-23 M4.5,-31 Q8,-33 9,-29 M-.1,-32 Q3,-35 4,-33"
        stroke={trunk} strokeWidth=".35" fill="none" strokeLinecap="round" />
      <path d="M-6,-31 Q-9,-32 -10,-28 L-9,-28 -10,-25 -8.6,-25 -9,-22 -7.8,-23 -7.3,-19 Q-5.3,-22 -5.5,-25 L-4.3,-26Z
        M4,-32 Q7,-34 9,-31 L8.6,-29 10,-28 9,-26 10,-24 8.8,-24 8.5,-20 Q6.5,-22 6,-25 L4.5,-26Z
        M-2,-35 Q-5,-35 -5.5,-31 L-4.5,-31 -5,-28 -3.8,-28 -3,-25 Q-1,-28 -1,-31Z" fill={shade} />
      <path d="M.4,-40 Q-2,-39 -2.9,-36 L-2,-36 -3,-33 -1.6,-34 -1.3,-31 Q.6,-32 1.5,-35 L2.5,-34 3,-37 2,-39Z
        M-3.6,-36 Q-6.3,-35 -7,-32 L-6,-32 -7.5,-29 -6.3,-29 -6.5,-25 -5.3,-26 -4.6,-23 Q-3,-26 -3.1,-29 L-1.8,-30 -2,-33Z
        M3.5,-36 Q1.7,-34 2.1,-31 L3,-31 2.5,-28 3.7,-29 4.5,-25 Q6,-28 5.7,-31 L6.7,-31 Q7,-34 5,-35Z
        M-8.5,-27 Q-11,-25 -10,-23 L-9.3,-23 -9.8,-20 -8.6,-21 -8.3,-17 Q-6.3,-19 -6.6,-22 L-5.8,-23Z
        M6.4,-29 Q4.5,-27 5,-24 L6,-24 5.7,-21 7,-22 7.4,-18 Q9,-20 8.4,-23 L9.2,-24Z" fill={leaf} />
      <path d="M.4,-39 Q-1.5,-38 -1.8,-36 L-.7,-36 -1.1,-34 Q.6,-35 1,-37 L2,-37Z
        M-4.2,-34 Q-6,-33 -5.8,-31 L-4.8,-31 -5.6,-28 Q-3.7,-29 -3.4,-31Z
        M3.8,-35 Q2.8,-33 3.3,-31 L4.2,-32 4.2,-29 Q5.8,-31 5,-33Z
        M-8.5,-25 L-9.3,-23 -8.2,-23 -8.5,-21 Q-6.8,-22 -7.3,-24Z" fill={light} />
      <path d="M-1,-4 l1.3,-.3 M-.8,-9 l.9,-.2 M-1,-13 l1.4,-.4 M-1.1,-19 l.8,-.2 M-.9,-24 l.8,-.3"
        stroke={trunk} strokeWidth=".5" fill="none" strokeLinecap="round" />
      <path d="M-1,-7 l.5,-.1 M-.9,-16 l.6,-.2" stroke={trunk} strokeWidth=".8" />
      <path d="M-7.8,-18 Q-9.4,-19 -8.4,-20.5 Q-7,-20 -7.8,-18Z
        M7.5,-16.5 Q6.2,-18 7.5,-19 Q8.8,-18 7.5,-16.5Z
        M-.6,-30 Q-2,-31 -.8,-32 Q.5,-31.5 -.6,-30Z" fill={leaf} />
      </>}
    </> : species === 'pine' ? <>
      <path d="M-1.1,0 L-.6,-31 .4,-34 .6,-15 1.1,0Z" fill={trunk} />
      <path d="M-.5,-2 L-.3,-12" stroke={light} strokeWidth=".35" opacity=".6" />
      <path d="M0,-36 Q-.6,-31 -3.3,-28 L-2.2,-28.2 Q-4,-25 -6.2,-23 L-3.5,-23.2 Q-5,-20 -8.4,-17.8 L-5.2,-18 Q-7,-14 -10.7,-10.9 L-9,-10 -6.3,-10.5 Q-3,-8.5 0,-8.2 Q4,-8.1 6.1,-9.8 L9.3,-9.5 11,-10.5 Q7.7,-13.5 5.3,-18 L8.5,-17.8 Q4.5,-21 3.5,-23.3 L6.2,-23 Q3,-26 2.2,-28 L3.1,-27.8Z" fill={leaf} />
      <path d="M.1,-34 Q1,-29 3.1,-27.8 L2.2,-28 Q3,-26 6.2,-23 L3.5,-23.3 Q4.5,-21 8.5,-17.8 L5.3,-18 Q7.7,-13.5 11,-10.5 L9.3,-9.5 6.1,-9.8 Q4,-8.1 0,-8.2 L1.2,-10.6 -.3,-12.5 1.4,-17.5 -.1,-19.1 1,-24Z" fill={shade} />
      <path d="M-.7,-31 Q-1.3,-27 -4,-25 L-1.6,-25.8 0,-27.4Z
        M-1,-24 Q-3,-20.5 -6.3,-19 L-3.9,-19.4 -2,-18.7 .4,-21Z
        M-1.7,-17.5 Q-4.5,-13.5 -8.1,-11.9 L-5.1,-12.2 -3.3,-11.3 .1,-13.6Z" fill={light} opacity=".8" />
      <path d="M-.5,-26 l-1.5,1.2 M-2,-21 l-1.8,1.2 M-1,-14 l-2,1.6 M3,-12.3 l1.6,.8 M3,-19.7 l1,.5"
        fill="none" stroke={leaf} strokeWidth=".45" strokeLinecap="round" />
    </> : <>
      {/* The main fork reaches left and upward; a lower bough opens to the right.
          Wedges of sky expose their junction instead of a solid skirt of leaves. */}
      <path d="M-1.8,0 Q-.5,-5 -1.1,-11 Q-3,-16 -6.4,-20 L-10,-24 -9.2,-24.8 -4.6,-21 Q-2,-19 -.5,-16 Q.3,-24 -2,-31 L-.9,-31 Q2,-26 1.5,-20 Q5,-20 8.8,-24 L9.7,-23.5 Q6,-18 1.5,-17 L1,-11 Q1,-4 2,0 L.5,-.5 -.5,.2Z" fill={trunk} />
      <path d="M-.6,-1 Q.4,-8 -.2,-12 M-2,-17 Q-4,-21 -8,-23 M.5,-23 L-.6,-29"
        stroke={light} strokeWidth=".45" fill="none" opacity=".5" />
      <path d="M-5,-20 Q-7,-25 -6,-28 M-8,-23 L-12,-22 M1,-25 Q5,-28 5,-31 M5,-20 L10,-19 M8,-23 L10,-27"
        stroke={trunk} strokeWidth=".6" fill="none" strokeLinecap="round" />
      <path d="M-14,-23 Q-13,-27 -9,-27 L-9.5,-28 Q-6,-30 -3,-28 L-1,-27 Q-2,-24 -5,-23 L-4,-22 -8,-21 -8,-19 Q-11,-19 -12,-21 L-14,-21Z
        M3,-26 Q7,-29 11,-27 L10.5,-26 Q14,-26 14,-23 L15,-22 Q13,-20 10,-20 L11,-18 Q7,-17 4,-20 L2,-20Z
        M-2,-32 Q0,-35 3,-33 L5,-33 7,-30 6,-27 3,-26 3,-24 Q0,-25 -1,-28 L-3,-28Z" fill={shade} />
      <path d="M-9,-29 Q-8,-32 -5,-32 L-5,-33 Q-2,-35 0,-33 L2,-33 Q4,-31 2,-29 L3,-28 Q0,-26 -3,-27 L-3,-25 Q-6,-25 -7,-28 L-9,-27Z
        M-14,-23 Q-15,-26 -12,-27 L-12,-28 Q-9,-29 -7,-27 L-5,-27 -4,-25 Q-6,-23 -9,-24 L-9,-22 Q-12,-21 -13,-23Z
        M3,-29 Q4,-32 7,-31 L9,-32 Q12,-31 11,-29 L13,-28 Q12,-25 9,-25 L8,-23 5,-24 5,-26 2,-27Z
        M7,-21 Q9,-24 12,-22 L14,-23 Q16,-21 14,-19 L15,-18 Q12,-16 10,-17 L9,-15 Q6,-16 5,-18 L3,-18 3,-20Z
        M-10,-19 Q-9,-22 -6,-21 L-4,-22 -2,-20 -3,-18 -2,-17 Q-5,-15 -7,-17 L-9,-16Z" fill={leaf} />
      {/* Broken shoulders follow branch direction; most foliage keeps its body colour. */}
      <path d="M-6.7,-31 Q-5.4,-32.8 -3.9,-31.4 Q-2.4,-33 -1,-31.7 Q-1.8,-29.7 -3.5,-30.1 Q-4.8,-28.4 -6,-29.5Z
        M-12.6,-26 Q-11.4,-27.5 -9.5,-26.2 Q-8,-26.9 -7.6,-25.8 Q-8.9,-24.2 -10.2,-25 Q-11.8,-24.3 -12.6,-26Z
        M5,-29.8 Q6.8,-31 7.5,-29.4 Q9.5,-30 9.3,-28.7 Q8,-27 6.9,-28 Q5.7,-26.4 4.8,-27.6Z
        M8,-21 Q9.5,-22 10.2,-20.7 Q12,-21.5 12,-20.2 Q10.8,-18.8 9.7,-19.5 L8.1,-18.7Z" fill={light} />
      <path d="M-9,-18.7 Q-7.2,-20 -5.5,-18.6 Q-6.1,-17.4 -7.2,-18 Q-8,-17.2 -9,-18.7Z" fill={light} opacity=".65" />
      <path d="M-14,-22 Q-16,-22 -15,-24 Q-13,-24 -14,-22Z
        M-4,-33 Q-6,-34 -4,-35 Q-2,-34 -4,-33Z
        M12,-26 Q12,-28 14,-27 Q14,-25 12,-26Z
        M2,-24 Q0,-25 1,-26.5 Q3,-26 2,-24Z" fill={leaf} />
      {/* A few oblique leaf tips break the broad masses at the ends of the fans. */}
      {[[-12,-25,-55],[-6,-31,-30],[-1,-32,15],[7,-29,45],[12,-21,60],[-7,-19,-50],[5,-25,35]].map(([x,y,a],i) =>
        <g key={i} transform={`translate(${x} ${y}) rotate(${a})`}>
          <path d="M0,1 Q-1.8,-.2 -1.3,-2 Q.4,-1.8 0,1 M.2,-.3 Q.8,-2.5 2.5,-2.2 Q2.6,-.5 .2,-.3Z"
            fill={i === 2 || i === 5 ? leaf : light} />
        </g>)}
    </>}
    <path d="M-2,.6 Q-3,-1.3 -4,-2 M1,.7 Q2,-1.5 3,-2.3" fill="none" stroke={leaf} strokeWidth=".45" strokeLinecap="round" />
  </g>;
}

/** Flat graphic birch: irregular overlapping crown masses and scarred pale bark. */
function BirchOpenCrown({ leaf, shade, light, trunk, birchTrunk }: Omit<Props, 'species' | 'birchCrown'>) {
  const bark = '#4c4d3b';
  return <g data-birch-crown="open-weave" strokeLinecap="round">
    {/* Tapered limbs grow out of the stem, with a few visible secondary forks. */}
    <path d="M-1.4,0 Q-.5,-9 -1,-19 Q-1.1,-29 .3,-38 L1.1,-46 1.5,-45
      Q.6,-32 .7,-24 Q.4,-13 1.4,0Z" fill={birchTrunk} />
    <path d="M.5,-32 Q-.1,-21 .8,-12 L1.4,0 .6,0 Q-.2,-12 -.3,-21Z" fill="#afb49b" />
    <path d="M-.9,-20 Q-3.9,-24 -5.3,-28 L-7.4,-35 -6.7,-35 Q-4.6,-28 -2.6,-25 L.2,-22Z
      M.4,-27 Q3.5,-31 5.1,-34 L7.3,-40 7.8,-40 Q6.5,-33 3.8,-29 L.5,-24Z
      M-.5,-14 Q-3.8,-18 -5.7,-23 L-5.1,-23 Q-3.4,-19 -.2,-17Z
      M.5,-21 Q4,-22 6.4,-26 L7.1,-26 Q4.6,-21 1,-19.7Z" fill={birchTrunk} />
    <path d="M-5.5,-28 Q-8,-29 -9.2,-33 M-6,-31 Q-4.8,-34 -5,-37
      M4.8,-33 Q8,-34 9,-37 M6.6,-24.5 l2,-1.7 M-.1,-34 Q-2.5,-37 -2.3,-41"
      fill="none" stroke={trunk} strokeWidth=".35" />
    {/* Rear boughs have unequal shoulders and torn edges, leaving narrow branch windows. */}
    <path d="M2,-45 Q4.9,-46 6,-43 L7.9,-42.8 7.2,-40.8 Q10,-39.6 8.9,-37.2
      L10.2,-35.8 8.6,-34.2 9.1,-32.2 Q7.3,-29.9 4.9,-31.3 L3.2,-30.4
      Q1.1,-32.6 2.2,-35 L.9,-37.1 Q2.4,-39.5 1.3,-41.3Z
      M-4.9,-40.8 Q-7.7,-39.5 -7.2,-37 L-9.1,-36 -8.6,-33.9 Q-11,-32.5 -9.5,-30.3
      L-10.4,-28.5 -8.4,-27.9 -8.4,-25.5 Q-5.5,-24.4 -4.4,-27.2 L-2.1,-27.4
      Q-1.1,-30.1 -3,-31.8 L-2,-34.3 Q-4.3,-36.5 -3.7,-38.6Z" fill={shade} />
    {/* The top is a distinct upright cluster, offset from the broader lower boughs. */}
    <path d="M1,-50 Q-.1,-48.2 -1.4,-47.6 L-1,-45.8 -3.1,-44.6 -2.7,-42.9
      Q-4.6,-41.4 -3.6,-39.3 L-4.2,-37.5 -2.2,-36.9 -1.7,-34.9
      Q.8,-34.2 2.1,-36.6 L4.2,-37.3 3.8,-39.5 Q5.1,-40.9 3.7,-43.2
      L4,-45.2 2.3,-46.2 Q2.5,-48.4 1,-50Z" fill={leaf} />
    {/* A higher left bough has a longer, interrupted outline, with shade retained at its base. */}
    <path d="M-4.6,-41.2 Q-6.9,-39.7 -6.3,-37.8 L-8,-36.8 -7.3,-34.9
      Q-9.2,-33.2 -7.7,-31.7 L-8.4,-29.8 -6.4,-29.8 -5.2,-27.6
      Q-2.9,-28.3 -2.7,-30.7 L-.9,-31.7 -1.7,-33.4 Q-.9,-35.7 -3,-37.3
      L-2.8,-39.4Z" fill={leaf} />
    {/* The right crown sits lower and overlaps a dark rear cluster. */}
    <path d="M5.9,-38 Q8.3,-37.8 8.4,-35.6 L10,-34.9 9.4,-33.2 11,-31.8
      L9.9,-30.3 10.6,-28.3 8.4,-27.2 8.8,-25.2 Q6.5,-24.1 5.3,-26.5
      L3.3,-26.8 3.1,-29 Q1.3,-30.2 2.8,-32.5 L2.5,-34.5 4.7,-35.4Z" fill={shade} />
    <path d="M5.6,-37.2 Q7.7,-36.9 7.3,-34.8 L8.9,-33.5 7.9,-32 9.3,-30.5
      L7.9,-29.5 8.1,-27.9 5.9,-27.4 5.3,-25.6 Q3.4,-26.9 4,-29
      Q2.2,-30.4 3.6,-32.3 L3.1,-34.5Z" fill={leaf} />
    {/* A broad front cluster crosses the axis. Irregular setbacks reveal the deeper greens. */}
    <path d="M-1.3,-35.2 L.8,-36.2 Q2.5,-35.3 2.5,-33.4 L4.5,-32.4 3.9,-30.6
      Q5.1,-28.9 3.4,-27.2 L3.8,-25.4 1.7,-24.9 .8,-22.7 Q-1.6,-23.4 -1.3,-25.8
      L-3.6,-26.2 -3,-28.4 Q-4.8,-30.1 -2.9,-31.7 L-3.1,-33.6Z" fill={leaf} />
    <path d="M-1,-34.7 Q.2,-35.4 1.1,-34.4 L.6,-32.5 2.4,-31.4 1.5,-29.8
      L2.6,-28.6 .8,-27.2 .5,-25.4 -1.2,-26.5 -.8,-28.4 -2.4,-29.7 -.9,-31.4Z"
      fill={shade} opacity=".55" />
    {/* Lower bough tips disappear into connected leaf clusters at unequal heights. */}
    <g data-birch-lower-boughs="">
      <path d="M-5.9,-28 Q-8,-27.3 -7.8,-25.4 L-9,-24 -8.1,-22.5 -8.8,-21
        L-7,-20.3 -6.2,-18.5 Q-3.7,-19.2 -3.9,-21.4 L-2.4,-22.6 -3.3,-24.1
        Q-2.9,-26 -4.8,-26.4Z" fill={shade} />
      <path d="M-5.7,-27 Q-7.3,-25.9 -6.8,-24.4 L-8,-23 -6.9,-21.9 -7.2,-20.4
        Q-5.2,-19.5 -4.6,-21.4 L-3.1,-22.4 -4,-23.8 -3.7,-25.2Z" fill={leaf} />
      <path d="M6.6,-28.8 L8.4,-28.5 8.3,-27 10,-25.9 9,-24.6 9.2,-23
        L7.4,-22.7 6.6,-21.4 Q4.5,-22.4 5,-24 L3.7,-25.2 5,-26.5 5.1,-28Z" fill={leaf} />
      <path d="M-5.9,-26.4 L-6.9,-24.8 -6.4,-23.6 -7.1,-22.6 Q-5.4,-22.3 -5,-24
        L-4.6,-25.4Z" fill={light} opacity=".58" />
      <path d="M7.3,-24.7 Q8.2,-24.4 8.2,-23.4 L6.8,-22.3 6,-23.5Z" fill={shade} opacity=".6" />
    </g>
    {/* Broad, broken lit planes belong to selected shoulders, not to every cluster. */}
    <path d="M.8,-48.4 Q-1.2,-46.6 -.5,-44.9 L-2,-43.2 -1.2,-41.9 -2.1,-40
      Q.2,-40.6 .8,-42.6 L.4,-44.5 1.7,-46.2Z
      M-4.7,-39.2 Q-6.5,-37.8 -5.9,-36 L-7.1,-34.5 -6,-33 -6.8,-31.7
      Q-4.6,-32 -4,-34 L-4.7,-35.8 -3.5,-37Z
      M5.8,-35.4 L4.5,-33.9 5.1,-32.5 4.2,-31.3 5.1,-30.4 7,-32 6.5,-33.7Z"
      fill={light} opacity=".64" />
    {/* Uneven charcoal scars wrap around alternate sides of the pale stem. */}
    <path d="M-1.2,-1.6 L-.4,-1.9 .2,-3.7 -.3,-4.6 -1.1,-4Z
      M.35,-6.4 L1,-6.8 .9,-8.8 .3,-9.4 -.05,-8.1Z
      M-.9,-11.2 L-.3,-10.8 .45,-12.2 .1,-13.4 -.9,-13.7Z
      M-.9,-16.3 L-.15,-16.7 .25,-18.5 -.25,-19.2 -.95,-18.5Z
      M.25,-22.1 L.9,-22.7 .75,-24.4 .15,-24.8 -.1,-23.3Z
      M-.15,-28.5 L.5,-28.2 .9,-29.3 .25,-30Z
      M-3.8,-24.4 l.8,.5 .3,-1.1 -.6,-.8Z M3.6,-31.2 l.6,-.9 -.4,-.9 -.5,.8Z"
      fill={bark} />
    <path d="M-.7,-5.3 l1.2,-.2 M-.4,-10.1 l.75,-.18 M-1,-14.8 l1.1,-.24
      M-.6,-20.4 l1,-.23 M.1,-26.2 l.7,-.16 M-.4,-32.4 l.8,-.12"
      fill="none" stroke={bark} strokeWidth=".36" />
  </g>;
}
