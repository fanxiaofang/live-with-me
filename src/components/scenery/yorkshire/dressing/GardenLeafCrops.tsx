import type { YorkshireSceneTheme } from '../landscapeTypes';

type LeafCrop = 'cabbage' | 'carrot' | 'lettuce' | 'potato';
const GREENS = {
  day: {
    cabbage: ['#3f602f','#7a9848','#b2c76e','#d0da95'],
    carrot: ['#365d36','#639344','#9abb59','#b8ca77'],
    lettuce: ['#376b35','#659b40','#91ba58','#adc97a'],
    potato: ['#304f32','#4e783c','#88a052','#acb876'],
  },
  dusk: {
    cabbage: ['#485b2e','#899447','#b6bc6a','#ceca8f'],
    carrot: ['#435e32','#748b40','#a9b55b','#c4c476'],
    lettuce: ['#496b32','#7d9942','#a6b95b','#bdc67c'],
    potato: ['#3a5030','#60733a','#92934f','#b5ad75'],
  },
  night: {
    cabbage: ['#344b30','#627b43','#92a162','#aeb784'],
    carrot: ['#304735','#506d43','#829b57','#a0ad75'],
    lettuce: ['#354c36','#647d47','#8ea564','#a8b78b'],
    potato: ['#2c4332','#466440','#72864f','#929d70'],
  },
} as const;

/** Leaf structure, not a shared rosette: each species has its own growth habit. */
export function GardenLeafCrop({ crop, theme, variation }: {
  crop: LeafCrop; theme: YorkshireSceneTheme; variation: number;
}) {
  const [deep,leaf,light,vein] = GREENS[theme.isNight ? 'night' : theme.timeOfDay === 'dusk' ? 'dusk' : 'day'][crop];
  const pose = variation % 3;
  const root = theme.isNight ? '#a17a48' : theme.timeOfDay === 'dusk' ? '#ce863b' : '#e6983c';
  return <g data-leaf-crop={crop} data-plant-pose={pose}>
    <ellipse data-crop-ground-shadow="" cx=".5" cy=".4" rx={crop==='potato' ? 8 : crop==='carrot' ? 3 : 6} ry="1.35" fill={deep} opacity=".25" />
    {crop==='cabbage' && <>
      {/* Outer leaves cradle an asymmetric head; the folds do not form concentric rings. */}
      <path d="M-1,-1 C-5.7,1 -9,-1.3 -7.7,-4 Q-8.5,-6.1 -5.7,-6.3 Q-3.4,-6.3 -1,-2 M1,-.6 Q7.5,.5 8.2,-3 Q9,-5.7 6,-6.5 Q3.5,-6.2 1,-.6Z" fill={deep} />
      <path d="M-4.9,-1.5 Q-7.4,-2.5 -6.7,-4.3 Q-5.6,-5.5 -3.7,-3.8 L-1.8,-1.2 M3,-1.4 Q7,-1.8 7,-3.8 Q6.7,-5.1 5,-4.5Z" fill={leaf} />
      <path d="M-4.9,-2.4 C-6.8,-6.8 -3.8,-10.2 -.2,-10 Q4.9,-10.2 5.7,-6 Q6.1,-2.2 1,-1.1 Q-2.6,-.7 -4.9,-2.4Z" fill={leaf} />
      <path d="M-4.1,-4.7 Q-4.5,-8.9 -.5,-9.2 Q2.7,-9.3 3.6,-7 Q1.5,-7.3 -.2,-5.8 Q-2,-4.3 -4.1,-4.7Z" fill={light} />
      <path d="M3.8,-7.5 Q6,-4.7 2.7,-2.5 Q.8,-1.4 -1.1,-2.1 Q1.8,-3.6 1.8,-5.5 Q1.7,-6.9 3.8,-7.5Z" fill={light} opacity=".8" />
      <path d="M-4.8,-5.6 Q-3.6,-4.1 -1,-3.9 M2.5,-7.6 Q.9,-8.2 -.8,-7 M-5.7,-3.9 Q-4.9,-2.2 -3.3,-1.8" fill="none" stroke={vein} strokeWidth=".45" opacity=".65" strokeLinecap="round" />
      {pose!==1 && <path d={pose===0 ? 'M-1.8,-.8 Q-7,1.3 -7.3,-1.9 Q-4.4,-2 -1.8,-.8Z' : 'M1,-1 Q6.3,.1 7.7,-1.5 Q7.5,1.4 3.4,.3Z'} fill={leaf} />}
    </>}
    {crop==='carrot' && <>
      <path d="M-1.9,.2 Q-2.6,-2.1 -.1,-2.8 Q2.5,-2.9 2,.1Z" fill={root} />
      <path d="M-1.8,-.1 Q-2.1,-1.5 -.7,-2.2" fill="none" stroke={vein} strokeWidth=".6" opacity=".6" />
      {/* Three spreading fronds with paired leaflets, held by visible flexible petioles. */}
      {[-1,0,1].map((side,i) => <g key={side} transform={`rotate(${side*(pose===1 ? 32 : 25) + (pose===2 && i===2 ? 12 : 0)} 0 -2)`}>
        <path d={`M0,-1.9 Q${side*.7},-7 ${side},${i===1 ? -16 : -13.8}`} fill="none" stroke={leaf} strokeWidth=".65" strokeLinecap="round" />
        {[[-6,2.8],[-8.7,2.5],[-11,1.9]].map(([y,w],j) => <g key={j} transform={`translate(${side*j*.22} ${y})`}>
          <path d={`M0,0 Q${-w-1},-.3 ${-w},-2.2 Q${-w+.8},-3.1 0,-.5 M0,-.5 Q${w-1},-3.3 ${w+.6},-2 Q${w+1},-.7 0,0Z`} fill={i===0 ? leaf : j===2 ? light : leaf} />
        </g>)}
        <path d="M-.2,-12 Q-2.1,-14.5 -.6,-15.2 Q1.5,-14.1 -.2,-12Z" fill={light} />
      </g>)}
    </>}
    {crop==='lettuce' && <>
      {/* Celtuce reads first as a fleshy stalk with a crown of long, open leaves. */}
      <path d="M-2.4,-.2 Q-2.5,-5.1 -1.6,-12.9 Q-.1,-14 1.6,-12.9 Q1.8,-6.6 2.3,-.3 Q.1,.8 -2.4,-.2Z" fill={light} />
      <path d="M.9,-12.8 Q1.3,-6 2.3,-.3 L.9,.1 Q-.2,-6.4 .9,-12.8Z" fill={leaf} opacity=".65" />
      <path d="M-1.3,-2.1 Q-1.7,-6 -.8,-10.1" fill="none" stroke={vein} strokeWidth=".65" opacity=".6" strokeLinecap="round" />
      <path d="M-1.9,-5.1 L-.7,-4.6 M.2,-7.6 L1.4,-8" fill="none" stroke={leaf} strokeWidth=".5" opacity=".6" strokeLinecap="round" />
      {[
        [[-1.1,-8,-61,.58],[-.7,-11,-37,.96],[.7,-12,43,1.02],[-.3,-13.4,-7,1.04]],
        [[-1.1,-8.8,-52,.67],[-.7,-11.5,-46,.87],[.7,-11.3,32,1.1],[-.3,-13.4,10,.99]],
        [[-1.1,-7.8,-70,.5],[-.7,-10.5,-27,1.07],[.7,-12.4,52,.87],[-.3,-13.4,-16,1.1]],
      ][pose].map(([x,y,angle,size],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}>
        <path d={i===(pose===1 ? 1 : 2)
          ? 'M0,0 C-1.3,-2.6 -4.6,-4.6 -3.7,-7.2 Q-4.7,-9.2 -2.8,-10.7 Q-.9,-12.8 1,-12 Q3.5,-11.6 3.3,-10 Q1.8,-11.2 1,-10.5 Q3.5,-8.5 2.4,-6.7 Q3.2,-4.7 1.4,-2.7Z'
          : 'M0,0 C-1.5,-3 -4.3,-5.3 -3.1,-7.6 Q-4.1,-9.6 -2.2,-11 Q-1.3,-12.5 .1,-13 Q1.4,-11.8 2.6,-10.9 Q4,-9.5 2.8,-7.5 Q3.7,-5.4 1.7,-3.6Z'} fill={i===0 ? deep : leaf} />
        <path d="M0,-.6 Q-.9,-5.8 -.1,-10.6" fill="none" stroke={vein} strokeWidth=".45" opacity=".5" strokeLinecap="round" />
        {i===3 && <path d="M-1.2,-6.6 Q-2.2,-9.2 -.3,-11 Q-.5,-8.7 .3,-7.1Z" fill={light} opacity=".65" />}
      </g>)}
    </>}
    {crop==='potato' && <>
      {/* Low, spreading compound shoots instead of stacked leaves on one upright stem. */}
      {[[-4,-3,-48],[2,-2,38],[0,-3,pose===0 ? -9 : 16]].map(([x,y,angle],i) => <g key={i} transform={`translate(${x} ${y}) rotate(${angle+(pose===2 && i===0 ? -14 : 0)})`}>
        <path d="M0,3 Q.5,-2 0,-8" fill="none" stroke={deep} strokeWidth=".8" strokeLinecap="round" />
        <path d="M0,-.4 Q-4.4,1 -5.2,-1.4 Q-5.3,-4.1 -2.7,-3.2 Q-.8,-2.3 0,-.4 M0,-3.9 Q-4.5,-3.8 -4.1,-6.1 Q-2.8,-8 -.9,-5.6Z" fill={i===0 ? deep : leaf} />
        <path d="M.1,.2 Q3.5,1.1 4.5,-1.4 Q4.5,-3.7 2.3,-3 Q.7,-2.5 .1,.2 M.1,-3.7 Q4,-4.1 3.4,-6.5 Q1.2,-7.6 .1,-3.7Z" fill={leaf} />
        <path d="M0,-6.2 Q-3,-8.2 -1.5,-10.2 Q.8,-12.1 2.2,-9.4 Q2.9,-7.3 0,-6.2Z" fill={i===1 ? light : leaf} />
        <path d="M-.6,-.6 L-3.4,-1.9 M.7,-.6 L3,-1.5 M0,-7.4 L.2,-9.3" stroke={vein} strokeWidth=".35" opacity=".45" />
      </g>)}
      {pose===0 && <g transform="translate(2.5 -9.5)">
        <path d="M-1.3,0 Q-2.8,-1.6 -.9,-1.9 Q-.5,-3.2 .6,-2 Q2.1,-2.4 1.8,-.8 Q3,.4 1.2,.7 Q.6,2 -.3,.9 Q-2,1.5 -1.3,0Z" fill={theme.isNight ? '#a4a594' : '#d8d3b5'} />
        <circle cx=".2" cy="-.3" r=".6" fill={root} />
      </g>}
    </>}
  </g>;
}
