import type { YorkshireSceneTheme } from '../landscapeTypes';

export type KitchenHerb = 'mint' | 'lemonBalm' | 'rosemary';

/** Reusable upright herbs: stems and leaf shapes distinguish the three species. */
export function KitchenHerbPlant({ kind, theme, variation=0 }: {
  kind: KitchenHerb; theme: YorkshireSceneTheme; variation?: number;
}) {
  const colours = theme.isNight
    ? { mint:['#304d38','#567b4e','#8ca773'], lemonBalm:['#3d5233','#6a8249','#a0ad6f'], rosemary:['#3c5547','#64836a','#93a08a'] }
    : theme.timeOfDay==='dusk'
      ? { mint:['#3f6037','#759249','#b4bd75'], lemonBalm:['#536832','#939f4d','#c5c97a'], rosemary:['#52664b','#8a9a6c','#b6b68b'] }
      : { mint:['#2f613d','#5b9253','#9bc477'], lemonBalm:['#537038','#80a34f','#b7cc77'], rosemary:['#496f59','#759c77','#a6b790'] };
  const [deep,leaf,light] = colours[kind];
  const pose=variation%3;
  return <g data-kitchen-herb={kind}>
    <ellipse cx=".5" cy=".3" rx={kind==='rosemary' ? 5 : 7} ry="1.3" fill={deep} opacity=".22" />
    {kind==='rosemary' ? <>
      {[[-1,-23,19],[.1,3,25],[1.2,29,17]].map(([base,angle,height],i) => <g key={i} transform={`translate(${base} 0) rotate(${angle+(pose-1)*3})`}>
        <path d={`M0,0 Q-.8,${-height*.5} .3,${-height}`} fill="none" stroke={deep} strokeWidth=".9" strokeLinecap="round" />
        {Array.from({length:i===1 ? 8 : 6},(_,j) => <g key={j} transform={`translate(0 ${-3-j*(height-5)/(i===1 ? 8 : 6)})`}>
          <path d="M0,0 Q-2.3,-1.3 -2,-3.2 Q-.7,-2.2 0,0 M.1,-.4 Q1.2,-3.6 2.3,-3 Q2.3,-1.2 .1,-.4Z" fill={j%3===0 ? light : leaf} />
        </g>)}
        {i!==1 && <g transform={`translate(0 ${-height*.45}) rotate(${i===0 ? -28 : 23})`}>
          <path d="M0,0 L0,-8" stroke={deep} strokeWidth=".5" />
          <path d="M0,-1 L-1.7,-4 -1,-4.5 0,-2 M0,-3 L1.5,-6 2,-5.6 0,-2 M0,-5 L-1.2,-8 -.5,-8.5 0,-6Z" fill={leaf} />
        </g>}
      </g>)}
    </> : <>
      {(kind==='mint' ? [[-1,-24,17],[.3,pose===1 ? -6 : 7,23],[1,27,15]] : [[-1.2,-33,14],[.2,-4,18],[1.1,32,15]]).map(([base,angle,height],i) => <g key={i} transform={`translate(${base} 0) rotate(${angle+(pose-1)*(i===0 ? 5 : -4)})`}>
        <path d={`M0,0 Q-.7,${-height*.5} .3,${-height}`} fill="none" stroke={deep} strokeWidth=".85" strokeLinecap="round" />
        {(i===1 ? [.31,.58,.84] : [.35,.73]).map((fraction,j) => <g key={j} transform={`translate(${j%2 ? -.3 : .1} ${-height*fraction})`}>
          {[-1,1].map(face => <g key={face} transform={`scale(${face*(face===(pose===1 ? -1 : 1) && j===1 ? .74 : 1)} ${kind==='lemonBalm' ? 1.16 : j===0 ? .82 : 1}) rotate(${face===-1 ? -12+pose*5 : 8-j*13})`}>
            <path d={kind==='mint'
              ? 'M0,0 Q2.4,-5.2 6.1,-4.2 Q7.7,-3.1 5.7,-1.8 Q6.4,-.8 4.5,-.4 Q3.2,.8 0,0Z'
              : 'M0,0 C.8,-4.7 3.5,-6.6 5.8,-5.6 Q8.1,-6.1 7.8,-3.9 Q9.3,-2.4 7.1,-1.2 Q7.4,.5 5.4,.4 Q2.9,2.2 0,0Z'} fill={face===-1 && j===0 ? deep : leaf} />
            {kind==='lemonBalm' && <path d="M1,-.6 Q2.7,-4.7 5.3,-4.7 Q6.9,-5.1 6.4,-3.6 Q3.8,-3.9 1,-.6Z" fill={light} opacity=".55" />}
            <path d="M.7,-.4 Q3.1,-2.5 5.3,-2.8" fill="none" stroke={face===-1 ? leaf : light} strokeWidth=".4" opacity=".7" strokeLinecap="round" />
          </g>)}
        </g>)}
      </g>)}
      <path d={kind==='mint' ? 'M-.2,-19 Q-3.1,-22.5 -.7,-24 Q2.2,-24 .7,-20Z' : 'M-.2,-14 Q-3.4,-17.5 -.7,-19 Q2.2,-19.3 .8,-15Z'} fill={light} />
    </>}
  </g>;
}

/** Ground-grown strawberries share roots with the plot but keep upright leaves, flowers and fruit. */
export function StrawberryPlant({ theme, variation=0 }: { theme: YorkshireSceneTheme; variation?: number }) {
  const p=theme.isNight
    ? {deep:'#304c38',leaf:'#54794b',light:'#879b5c',red:'#ad5949',shade:'#804338',shine:'#c57f5b',flower:'#b4b69c',gold:'#bca66a'}
    : theme.timeOfDay==='dusk'
      ? {deep:'#3b5831',leaf:'#68873d',light:'#a3af58',red:'#d65a36',shade:'#a6402b',shine:'#ee9256',flower:'#e0d3ab',gold:'#d6b856'}
      : {deep:'#315d36',leaf:'#5e8e45',light:'#a0bc60',red:'#e34d36',shade:'#ad382d',shine:'#f58155',flower:'#f0e5c4',gold:'#e5bf53'};
  const pose=variation%3;
  const leaves=[
    [[-4.6,-4.4,-34],[.3,-9.8,3],[5.2,-3.2,39]],
    [[-5.1,-3.2,-45],[-1,-10.1,-12],[4.3,-6,16]],
    [[-4.8,-2.8,-51],[1.5,-8.6,18],[5.6,-4.7,31]],
  ][pose];
  return <g data-garden-strawberry="">
    <ellipse data-crop-ground-shadow="" cx=".6" cy=".5" rx="7.5" ry="1.5" fill={p.deep} opacity=".25" />
    {leaves.map(([x,y,angle],i) => <g key={i}>
      <path d={`M0,-.2 Q${x*.3},${y*.6} ${x},${y}`} fill="none" stroke={p.leaf} strokeWidth=".65" strokeLinecap="round" />
      <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${i===0 && pose===2 ? .78 : .9})`}>
        {[[-2,-.2,-65,.66],[2,-.2,65,.66],[0,-1.9,-3,.9]].map(([dx,dy,a,s],j) => <g key={j}>
          <path d={`M0,.4 Q${dx*.5},${dy-.2} ${dx},${dy-.3}`} fill="none" stroke={p.leaf} strokeWidth=".45" />
          <g transform={`translate(${dx} ${dy}) rotate(${a}) scale(${s*(j===1 && pose===1 ? .75 : 1)} ${s})`}>
          <path d="M0,.3 Q-2.8,-.5 -3,-2.8 Q-3.8,-4 -2.1,-4.1 Q-2.3,-5.5 -.8,-5.2 Q.5,-6.7 1.4,-5.1 Q3.2,-5.2 2.8,-3.7 Q4,-2.2 2.5,-1.4 Q1.8,-.1 0,.3Z" fill={i===0 && j===0 ? p.deep : p.leaf} />
          <path d="M0,-.2 Q.2,-2.6 -.1,-4.4" fill="none" stroke={p.light} strokeWidth=".35" opacity=".4" strokeLinecap="round" />
          </g>
        </g>)}
      </g>
    </g>)}
    {pose!==0 && <g transform={`translate(${pose===1 ? 5.8 : -5} -7)`}>
      <path d={`M${pose===1 ? -5.8 : 5},7 Q${pose===1 ? -1.3 : 1.3},3.8 0,0`} fill="none" stroke={p.leaf} strokeWidth=".6" />
      <path d="M-1,1 L0,-.7 1.6,.9" fill="none" stroke={p.deep} strokeWidth=".6" />
      <g transform={pose===2 ? 'rotate(-24) scale(1 .65)' : undefined}>
      <path d="M0,-.8 Q-2.5,-3.6 -3.3,-1.4 Q-4.1,.6 -1.7,.8 Q-2.4,3.4 -.1,2.7 Q1.9,3.7 2.1,1.1 Q4.5,.4 2.7,-1.2 Q2.3,-3.6 0,-.8Z" fill={p.flower} />
      <circle cy=".2" r=".8" fill={p.gold} />
      </g>
    </g>}
    {pose!==1 && [[-5.6,-2.6],[5.1,-1.3]].map(([x,y],i) => <g key={i}>
      <path d={`M.3,-2.5 Q${x*.5},${y-6} ${x},${y-2}`} fill="none" stroke={p.leaf} strokeWidth=".6" strokeLinecap="round" />
      <g transform={`translate(${x} ${y}) rotate(${i ? -17 : 14}) scale(${i ? .95 : 1.1})`}>
      <path d="M0,-1.6 Q-.1,-2.5 -.2,-3.3" fill="none" stroke={p.leaf} strokeWidth=".6" />
      <path d="M-2.6,-.8 Q-2.6,-3.3 0,-2.6 Q2.6,-3.2 2.5,-.8 Q2.3,1.4 .1,3 Q-2.2,1.8 -2.6,-.8Z" fill={p.red} />
      <path d="M1.9,-1.7 Q3.6,.1 .1,3 Q1.4,.6 1.9,-1.7Z" fill={p.shade} />
      <path d="M-2,-.9 Q-1.9,-2.3 -.6,-2 Q.5,-1.9 .8,-1 Q.9,-.1 -.2,.7 Q-1.1,1 -1.5,.2 Q-2.1,.1 -2,-.9Z" fill={p.shine} opacity=".85" />
      <path d="M-2.3,-2.5 L-1,-3.1 0,-2.6 1.1,-3.1 2.1,-2.2 .7,-1.8 0,-2.1 -1.3,-1.7Z" fill={p.deep} />
      <path d="M-1.2,-.5 L-1,.1 M.2,.5 L.3,1 M.6,-1 L.7,-.5" stroke={p.gold} strokeWidth=".35" strokeLinecap="round" />
      </g>
    </g>)}
    {pose===2 && <path d="M1,.1 Q6.8,2.1 9,0 Q10.8,-2.1 12,-.8" fill="none" stroke={p.leaf} strokeWidth=".5" strokeLinecap="round" />}
  </g>;
}
