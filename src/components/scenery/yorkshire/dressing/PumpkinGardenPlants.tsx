/** Small nursery plants using the original rack's deep green and mint colour roles. */
export function PumpkinSucculentNursery() {
  return <g data-pumpkin-nursery="succulents">
    {[26,44,62,80].map((x,i) => <g key={x} transform={`translate(${x} ${i%2 ? 10.8 : 11.3}) scale(${i===2 ? .88 : i===1 ? 1.03 : .97})`}>
      <ellipse cx=".3" cy="1.7" rx="5.1" ry="1.7" fill="#203d27" opacity=".55" />
      {i%2===0 ? <>
        {/* Fleshy overlapping spoon leaves, with the mint centre made of actual young leaves. */}
        {[[-1.6,.7,-83],[1.6,.8,76],[-2,-.4,-43],[2,-.5,44],[0,-1,3]].map(([dx,dy,a],j) => <g key={j} transform={`translate(${dx} ${dy}) rotate(${a})`}>
          <path d="M0,1.1 C-2.2,-.1 -2.9,-3.4 -.9,-4.2 Q1.5,-5 2,-2.5 Q2.3,-.6 0,1.1Z" fill={j<2 ? '#2d5236' : '#35603f'} />
          <path d="M-.1,.3 Q-2.1,-1.4 -1.1,-3 Q.7,-3.9 1.1,-2 Q1.2,-.6 -.1,.3Z" fill="#4e825a" />
        </g>)}
        <path d="M-.2,.1 Q-2.5,-.2 -2,-2 Q-.7,-3.2 .2,-.7 Q.4,-3 1.8,-2.7 Q3,-.7 -.2,.1Z" fill="#86efac" />
        <path d="M-.3,-.4 Q-1.5,-.8 -1.3,-1.7 Q-.5,-1.9 -.3,-.4Z" fill="#bbf7d0" opacity=".6" />
      </> : <>
        {/* Round-leaf sedum: shorter plump leaves, irregularly stacked instead of a ring. */}
        <path d="M-.2,1.5 L-.4,-3.5 M-.3,-.2 L-3,-1.5 M-.3,-1.4 L2.5,-2.5" stroke="#2d5236" strokeWidth=".7" fill="none" />
        {[[-3,-.4,-28],[2.9,-.5,23],[-2,-2.3,-36],[2.1,-3,32],[0,-3.8,1]].map(([dx,dy,a],j) => <g key={j} transform={`translate(${dx} ${dy}) rotate(${a})`}>
          <path d="M0,.6 Q-2.7,.2 -2.3,-1.8 Q-.5,-3.6 1.4,-1.9 Q3.1,.2 0,.6Z" fill={j<2 ? '#2d5236' : '#4e825a'} />
          <path d="M-.8,-.4 Q-1.7,-1.7 -.1,-2.1 Q1.2,-1.8 1.2,-.8 Q.1,-1.3 -.8,-.4Z" fill={j>2 ? '#86efac' : '#35603f'} />
        </g>)}
      </>}
    </g>)}
    {[35,53,71,88].map((x,i) => <g key={x} transform={`translate(${x} ${i%2 ? 13 : 12.3})`}>
      <path d={`M0,0 Q${i%2 ? -1 : .7},-3.4 ${i%2 ? -.5 : .4},-5.8`} fill="none" stroke="#2d5236" strokeWidth=".7" />
      <path d="M-.2,-1.1 Q-3.5,-1 -3,-3 Q-.8,-4 -.2,-1.1Z M0,-3 Q2,-5 3,-3.3 Q2.9,-1.5 0,-3Z" fill="#35603f" />
      <path d="M0,-4.4 Q-2.2,-6.6 -.7,-7 Q1.7,-7.4 0,-4.4Z" fill="#4e825a" />
      <path d="M-.1,-4.9 Q-.9,-5.8 -.6,-6.4 Q.4,-6.4 -.1,-4.9Z" fill="#86efac" />
    </g>)}
  </g>;
}

/** Restrained shallow lobes and a short petiole; colours come from the existing pumpkin leaves. */
export function PumpkinLobedLeaf({ base, light }: { base: string; light?: string }) {
  return <g>
    <path d="M0,1.1 Q.1,-.4 .2,-1.5" fill="none" stroke={base} strokeWidth=".7" strokeLinecap="round" />
    <path d="M0,-.4 Q-2,-.8 -4,-1.7 Q-5.6,-2.8 -3.7,-3.5 Q-5.1,-5.5 -2.5,-5 Q-1.8,-7.4 -.1,-5.8 Q2,-7.2 2.8,-5 Q5.6,-5.3 4.1,-3.3 Q6,-2.1 3.4,-1.3 Q1.4,-.6 0,-.4Z" fill={base} />
    {light && <>
      <path d="M.1,-1.1 Q-1.1,-2 -2.8,-2.7 Q-3.8,-3.1 -2.4,-3.6 Q-2.9,-4.4 -1.4,-4.1 Q-.8,-5.8 .2,-4.7 Q2,-5.8 2.3,-4.2 Q3.6,-4.3 3.1,-3.4 Q1.2,-2.7 .1,-1.1Z" fill={light} opacity=".8" />
      <path d="M.1,-1 Q.5,-3.3 .1,-4.8 M.3,-2.5 L-2,-3.5 M.4,-2.6 L2.6,-3.6" fill="none" stroke={base} strokeWidth=".4" opacity=".7" strokeLinecap="round" />
    </>}
  </g>;
}
