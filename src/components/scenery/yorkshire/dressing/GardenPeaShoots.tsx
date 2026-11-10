import type { YorkshireSceneTheme } from '../landscapeTypes';

/** Upright tender pea shoots, with oblique oval leaflets and restrained terminal tendrils. */
export function GardenPeaShoots({theme,variation}:{theme:YorkshireSceneTheme;variation:number}) {
  const p=theme.isNight
    ? {deep:'#35543b',leaf:'#64894c',light:'#8ca866',stem:'#92a674'}
    : theme.timeOfDay==='dusk'
      ? {deep:'#456831',leaf:'#7a9a45',light:'#a5ba64',stem:'#b1bd7a'}
      : {deep:'#3d7037',leaf:'#6fa148',light:'#9cc260',stem:'#a8c77a'};
  const pose=variation%3;
  const shoots=[
    [[-1.6,0,-5,1],[2,.1,7,.81]],
    [[-2,0,-8,.86],[1.3,0,2,1.06]],
    [[-1.2,.1,1,1.04],[2.2,0,10,.75]],
  ][pose];
  return <g data-pea-shoots="upright-oval-leaves">
    {shoots.map(([x,y,angle,size],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}>
      <path d="M0,0 Q1.2,-11 .2,-23.2" fill="none" stroke={p.stem} strokeWidth=".85" strokeLinecap="round" />
      {(pose===1 ? [[.5,-8.4,-9,1],[.5,-15.7,8,.91]] : pose===2
        ? [[.5,-6.8,12,.91],[.5,-14.5,-13,1.04]]
        : [[.5,-7.6,-6,1.04],[.5,-14.1,4,.94]]).map(([nx,ny,tilt,scale],j)=><g key={j} transform={`translate(${nx} ${ny})`}>
        {/* Rounded, pointed oval leaflets meet a node, rather than forming heart-shaped fans. */}
        <g transform={`rotate(${tilt}) scale(${scale})`}>
          <path d="M0,0 Q-1,-.6 -1.7,-1.6" fill="none" stroke={p.stem} strokeWidth=".55" strokeLinecap="round" />
          <path d="M-1.3,-1.3 C-4,-.5 -6.6,-3 -5.1,-5.7 Q-4.5,-6.8 -4.7,-7.4 Q-1.4,-7 -.7,-4.6 Q-.4,-2.7 -1.3,-1.3Z" fill={i===1 && j===0 ? p.deep : p.leaf} />
          <path d="M-1.6,-1.7 Q-3.3,-3.3 -4,-5.5" fill="none" stroke={p.stem} strokeWidth=".32" opacity=".6" strokeLinecap="round" />
        </g>
        <g transform={`translate(0 ${pose===2 && j===1 ? -1.2 : .4}) rotate(${pose===1 ? -12 : 6}) scale(${j===1 ? .8 : .95})`}>
          <path d="M0,0 Q1.2,-.8 1.6,-1.6" fill="none" stroke={p.stem} strokeWidth=".55" strokeLinecap="round" />
          <path d="M1.4,-1.4 C4.4,-.5 6.9,-3.3 5.1,-5.8 Q4.3,-6.8 4.7,-7.4 Q1.7,-7.1 .8,-4.7 Q.2,-2.9 1.4,-1.4Z" fill={j===1 && i===0 ? p.light : p.leaf} />
        </g>
      </g>)}
      {/* Folded new leaves point upward beside the growing tip. */}
      <path d="M.3,-20 Q-2.5,-20.2 -2.4,-22.3 Q-2.2,-24.4 -1.2,-25 Q.7,-23.8 .3,-20Z" fill={p.leaf} />
      <path d="M.3,-20.5 Q3,-21.7 2.1,-24.5 Q.7,-24.3 .3,-20.5Z" fill={p.light} />
      {i===(pose===1 ? 1 : 0)
        ? <path d="M.2,-23.2 Q.4,-26.1 2.2,-27 Q4,-27.7 4.1,-26.3 Q4,-25.3 3,-25.9" fill="none" stroke={p.stem} strokeWidth=".45" strokeLinecap="round" />
        : <path d="M.2,-23.2 Q-.2,-25.4 .6,-26.3" fill="none" stroke={p.stem} strokeWidth=".45" strokeLinecap="round" />}
    </g>)}
  </g>;
}
