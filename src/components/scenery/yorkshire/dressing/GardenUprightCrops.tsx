import type { YorkshireSceneTheme } from '../landscapeTypes';

/** Mature upright crops, calibrated against the approved tomato rather than scaled as icons. */
export function GardenUprightCrop({ crop, theme, variation }: {
  crop: 'corn' | 'bean' | 'pepper'; theme: YorkshireSceneTheme; variation: number;
}) {
  const p = theme.isNight
    ? { deep: '#304b38', leaf: '#53764b', light: '#819359', stem: '#728256', wood: '#776147', woodDark: '#443d31', tie: '#9c987a', gold: '#b9a567', goldShade: '#8d7d50', goldLight: '#d2bc80', pod: '#91a65d', red: '#ad5949', redDark: '#804338', redLight: '#c57f5b' }
    : theme.timeOfDay === 'dusk'
      ? { deep: '#3b5831', leaf: '#68873d', light: '#a0ac58', stem: '#8b9753', wood: '#987142', woodDark: '#573c28', tie: '#c1ab77', gold: '#e1b54f', goldShade: '#b38636', goldLight: '#f2d581', pod: '#b0bc61', red: '#d65a36', redDark: '#a6402b', redLight: '#ee9256' }
      : { deep: '#355c34', leaf: '#608b40', light: '#9bb658', stem: '#829c4e', wood: '#a27b49', woodDark: '#5e422c', tie: '#d0bc8b', gold: '#edbf4f', goldShade: '#c38c2f', goldLight: '#ffe08b', pod: '#b2cb65', red: '#e34d30', redDark: '#b23b29', redLight: '#fa8650' };
  const lean = (variation - 2) * .25;
  const pose = variation % 3;
  const cornLeaves = [
    [[-6,-1,-7],[-15,1,6],[-24,-1,1],[-32,1,-12]],
    [[-8,1,14],[-18,-1,-12],[-25,1,-4],[-33,-1,12]],
    [[-5,-1,-16],[-13,1,17],[-24,-1,-6],[-31,1,4]],
  ][pose];
  const pepperLeaves = [
    [[-2,-7,-1,14],[1,-11,1,-17],[-1,-16,-1,-26],[1,-21,1,-47]],
    [[-1,-6,1,31],[-2,-13,-1,-12],[1,-17,1,-27],[-1,-23,-1,-48]],
    [[-1,-9,-1,28],[2,-12,1,8],[-1,-18,-1,-32],[1,-23,1,-40]],
  ][pose];
  return <g data-mature-crop={crop}>
    <ellipse data-crop-ground-shadow="" cx=".7" cy=".4" rx={crop === 'pepper' ? 6.5 : 7.5} ry="1.6" fill={p.deep} opacity=".24" />
    {crop === 'corn' && <g transform={`translate(${lean} 0)`}>
      {/* Jointed stalk with broad ribbon leaves, curved and folded at their tips. */}
      <path d="M-.6,0 Q.6,-17 .1,-39" fill="none" stroke={p.deep} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M-.9,-1 Q.1,-20 -.3,-38" fill="none" stroke={p.stem} strokeWidth="1.4" />
      {cornLeaves.map(([y,side,angle],i) => <g key={i} transform={`translate(0 ${y}) scale(${side} 1) rotate(${angle})`}>
        <path d="M0,0 C3.4,-6.8 10.2,-9.5 14.3,-4.2 Q16,-2.1 15.8,.4 Q13.5,-3.2 10.7,-2.5 Q5.6,-1.1 0,0Z" fill={i%2 ? p.leaf : p.deep} />
        <path d="M0,0 C4,-5.2 10,-7.9 14.3,-4.2 Q11.2,-5.1 8.1,-2.9 Q3.1,.1 0,0Z" fill={i%2 ? p.light : p.leaf} />
        <path d="M.3,-.3 Q6.6,-5.3 11.7,-4.8" fill="none" stroke={p.stem} strokeWidth=".5" />
        <path d="M-.8,1.5 Q-1.5,-1.6 0,-3.5" fill="none" stroke={p.light} strokeWidth="1" opacity=".7" />
      </g>)}
      {/* Exposed golden kernels sit inside a green husk, not a pale leaf-shaped mark. */}
      <g transform={`translate(${pose===1 ? 3.1 : -3.1} ${pose===2 ? -21 : -19}) rotate(${pose===1 ? 19 : -18}) scale(1.12)`}>
        <path d="M-1.8,4 Q-3.1,-.5 -1.8,-5 Q-.8,-7.4 .8,-5.6 Q2.9,-2.1 1.7,3.7Z" fill={p.goldShade} />
        <path d="M-1.5,2.9 Q-2.4,-1 -.9,-5.4 Q.2,-6.5 1,-4.1 Q2,-.8 .7,3.6Z" fill={p.gold} />
        <path d="M-1.1,2.1 Q-2,-1.3 -.9,-5.1 Q-.3,-5.9 .2,-4.4 Q.5,-1.8 -.1,.9 Q-.4,2.7 -1.1,2.1Z" fill={p.goldLight} opacity=".85" />
        <path d="M-1,-3.6 L.5,-3.4 M-1.3,-1.7 L.9,-1.5 M-1.4,.2 L.8,.4 M-.9,1.8 L.5,2" stroke={p.goldShade} strokeWidth=".35" opacity=".45" strokeLinecap="round" />
        <path d="M-1.8,4 Q-4.7,1.7 -4.1,-2 Q-1.9,-1.3 -.3,3 Q2.8,.4 3.6,-2.2 Q4.7,2.8 -1.8,4Z" fill={p.leaf} />
        <path d="M-1.8,4 Q-2.8,.5 -4.1,-2 Q-3.5,2.8 -1.8,4Z" fill={p.light} />
      </g>
      <path d="M.1,-38 L.2,-46.5 M.1,-42 Q-2.2,-44 -4,-44.5 M.1,-43.7 L-2,-46 M.2,-43 Q2.4,-45 4.1,-45.2 M.2,-44.4 L2.3,-46.2 M0,-39.2 L-3.5,-41.1 M.2,-39.5 L3.7,-41.4" fill="none" stroke={p.gold} strokeWidth=".65" strokeLinecap="round" />
      <path d="M-1.1,-9 L.9,-9 M-1,-19 L1,-19 M-1,-29 L1,-29" stroke={p.light} strokeWidth=".7" />
    </g>}
    {crop === 'bean' && <>
      <g transform="scale(1 1.25)">
      <ellipse cx="-7.7" cy=".2" rx="1.8" ry=".7" fill={p.woodDark} opacity=".4" />
      <ellipse cx="7.8" cy=".2" rx="1.8" ry=".7" fill={p.woodDark} opacity=".4" />
      <path d="M-7.8,.2 L-.5,-39 L7.9,.2 M-.5,-39 L4,-2 M-6,-10 L6,-10 M-3.8,-23 L4,-23" fill="none" stroke={p.woodDark} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M-8,-.1 L-.7,-39 M7.6,-.1 L-.7,-39" fill="none" stroke={p.wood} strokeWidth=".8" />
      <path d="M-5,-15 Q0,-14 5,-15 M-2.5,-30 L2.5,-30 M-1.5,-37.6 L.7,-37" fill="none" stroke={p.tie} strokeWidth=".5" />
      </g>
      <g transform={`translate(${lean} 0)`}>
        <path d="M-3,-.3 Q-7,-9 -1,-16 Q4,-22 .1,-27 Q-3,-32 .1,-37 M3,-1 Q6,-11 1,-18 Q-3,-24 2,-30" transform="scale(1 1.25)" fill="none" stroke={p.deep} strokeWidth="1.25" />
        <path d="M-3.2,-1 Q-6,-9 -.5,-16 Q4.5,-23 .2,-28 Q-2.1,-33 .2,-36" transform="scale(1 1.25)" fill="none" stroke={p.stem} strokeWidth=".65" />
        {/* Broad heart-shaped bean leaves form loose sprays with visible gaps for the pods. */}
        {[[-3,-7,1], [3,-13,-1], [-1,-19,1], [2,-25,-1], [-.2,-32,1], [4,-5,-1], [-3,-27,1]].map(([x,y,side], i) => <g key={i} transform={`translate(${x} ${y*1.25}) rotate(${[[0,-6,8,0,-8,11,0],[18,-21,-10,15,12,-16,20],[-15,16,22,-13,-19,8,-9]][pose][i]}) scale(${side} ${i===4 ? .85 : 1})`}>
          <path d="M0,0 C-2.7,-.2 -8.3,-.1 -8,-3.9 Q-7.8,-7.2 -4.8,-5.9 Q-2.5,-8.1 -.6,-5.4 Q.9,-3.5 0,0Z" fill={i%3===0 ? p.deep : p.leaf} />
          <path d="M-.7,-1.2 Q-6.6,-.9 -6.9,-3.6 Q-6.7,-5.3 -5,-4.7 Q-3.7,-6.2 -2.1,-4.7 Q-.5,-3.1 -.7,-1.2Z" fill={i%3===1 ? p.light : p.leaf} />
          <path d="M-.6,-.6 Q-2.7,-2.5 -5.1,-3.4" fill="none" stroke={p.stem} strokeWidth=".45" strokeLinecap="round" />
        </g>)}
        {[
          [[-5.8,-22],[5.5,-29],[1.9,-16],[-3.6,-10]],
          [[-5,-23.5],[4.7,-30],[2.5,-17.2],[-3.1,-11]],
          [[-6.4,-21],[5.2,-27.8],[2.1,-18],[-4,-9.3]],
        ][pose].map(([x,y], i) => <g key={i} transform={`translate(${x} ${y*1.25}) rotate(${[[0,7,-5,0],[12,-14,16,-11],[-17,13,-12,18]][pose][i]}) scale(${i%2 ? -1 : 1} ${i===pose ? 1.1 : .97})`}>
          <path d="M0,-1 L.6,-2.3" stroke={p.stem} strokeWidth=".55" />
          <path d="M-.4,-.8 C-2.5,2 -1.3,5.8 .4,8.2 Q1.7,9 1.4,7.3 Q-.2,3.5 .8,.2 Q1,-1 -.4,-.8Z" fill={p.leaf} />
          <path d="M-.4,-.7 C-2,1.8 -1.1,5.7 .6,8 Q1,8.5 .8,7.3 Q-.5,3.5 .5,.1 Q.8,-.6 -.4,-.7Z" fill={p.pod} />
          <path d="M.3,.4 Q-.4,3.6 .7,6.3" fill="none" stroke={p.leaf} strokeWidth=".3" opacity=".45" strokeLinecap="round" />
        </g>)}
      </g>
    </>}
    {crop === 'pepper' && <g transform={`translate(${lean} 0)`}>
      <path d="M0,-.2 Q-1.2,-11 .2,-22 M-.3,-6 Q-4,-10 -6,-15 M0,-12 Q4,-15 7,-19 M.2,-18 L-3,-24" fill="none" stroke={p.deep} strokeWidth="1.35" strokeLinecap="round" />
      {pepperLeaves.map(([x,y,side,angle],i) => <g key={i} transform={`translate(${x} ${y}) scale(${side} 1) rotate(${angle})`}>
        <path d="M0,0 Q4.1,-7.1 8.6,-4.7 Q11,-2.7 10.2,.4 Q8.7,-1.1 6.5,.5 Q2.6,2.1 0,0Z" fill={i===0 ? p.deep : p.leaf} />
        <path d="M1,-.4 Q5.1,-5.5 8.1,-3.7 Q5.2,-4 1,-.4Z" fill={p.light} opacity=".7" />
        <path d="M0,0 Q4.7,-2 8,-1.2" fill="none" stroke={p.stem} strokeWidth=".45" />
      </g>)}
      <path d="M-.4,-.4 Q-.7,-11 .2,-20 M-5,-12 L-5.7,-10.9 M6,-17 L5.8,-15.9 M1.9,-8.7 L2.6,-7.9" fill="none" stroke={p.stem} strokeWidth=".7" strokeLinecap="round" />
      {[[-6,-11,1],[6,-16,-1],[2.5,-8,1]].map(([x,y,side], i) => <g key={i} transform={`translate(${x + (pose===1 && i===0 ? 1.8 : 0)} ${y + (pose===2 && i===1 ? -2 : 0)}) rotate(${pose===1 ? -13 : pose===2 && i===0 ? 21 : 0}) scale(${side} ${i===2 ? .9 : 1})`}>
        <path d="M-.9,-.4 Q.7,-1.5 1.5,.1 C2.7,3.1 1.1,6.3 -1.6,7.4 Q.4,4.3 -.3,2.4 Q-1.3,1 -.9,-.4Z" fill={p.red} />
        <path d="M1.5,.1 Q3,3.5 .7,5.9 L-1.6,7.4 Q1.1,4.5 1.5,.1Z" fill={p.redDark} />
        <path d="M-.6,.1 Q.8,-.7 1.2,1.2 Q1.7,3.6 .2,5.4 Q-.4,6.2 -1,6.5 Q.3,3.9 -.4,2.2 Q-1.2,.9 -.6,.1Z" fill={p.redLight} opacity=".82" />
        <path d="M-1,-.3 L-.4,-1.1 .6,-1.1 1.5,-.2 .6,.1 .1,-.2 -.4,.3Z" fill={p.deep} />
      </g>)}
    </g>}
  </g>;
}
