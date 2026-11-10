import type { YorkshireSceneTheme } from '../landscapeTypes';

type SaladPalette = {deep:string;leaf:string;light:string;vein:string;stem:string};

/** Upright round stems carry long petioles and arching lanceolate leaves. */
function WaterSpinach({p,pose}:{p:SaladPalette;pose:number}) {
  const leaves=[
    [[-2,-13,14,.92],[3,-15,128,.96],[-2.1,-9,55,.76],[3,-10.9,149,.83],[-1.8,-5.9,-7,.91],[1.9,-7.4,169,.98],[.7,-17.3,42,.6],[.7,-17.3,126,.59],[.7,-17.3,79,.5]],
    [[-2,-13,31,1.03],[3,-15,141,.83],[-2.1,-9,42,.88],[3,-10.9,161,.78],[-1.8,-5.9,-16,.79],[1.9,-7.4,156,1.05],[.7,-17.3,57,.64],[.7,-17.3,135,.51]],
    [[-2,-13,6,.82],[3,-15,119,1.04],[-2.1,-9,67,.69],[3,-10.9,133,.94],[-1.8,-5.9,-2,1.02],[1.9,-7.4,177,.82],[.7,-17.3,37,.54],[.7,-17.3,113,.66],[.7,-17.3,82,.42]],
  ][pose];
  return <g data-water-spinach-art="round-stems-arching-blades">
    <path d="M-1.1,0 Q-3.4,-7 -2,-13 M1.3,0 Q3.6,-8 3,-15 M.1,-.1 Q-1.2,-9 .7,-17.3" fill="none" stroke={p.stem} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M-1.7,-.2 Q-3.6,-7.2 -2.4,-12 M1.7,-.3 Q3.9,-8 3.4,-14" fill="none" stroke={p.deep} strokeWidth=".35" opacity=".5" strokeLinecap="round" />
    {leaves.map(([x,y,angle,size],i)=><g key={i} transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}>
      <path d="M0,0 Q-1.5,-1.3 -3.4,-1.7" fill="none" stroke={p.stem} strokeWidth=".7" strokeLinecap="round" />
      <path d={(i+pose)%3===2
        ? 'M-3,-1.6 C-5.1,-5.7 -10,-5.3 -15.3,-3.5 C-11.3,-3.4 -10.6,-1.6 -8.6,-.2 Q-5.3,1.9 -3,-1.6Z'
        : 'M-3,-1.6 C-5.4,-6.5 -10.9,-6.6 -15.4,-4.2 C-11.6,-4.5 -10.8,-1.8 -8.1,-.5 Q-4.8,1 -3,-1.6Z'}
        fill={i===2 ? p.deep : p.leaf} />
      <path d="M-3.3,-1.8 Q-7.3,-4.2 -12.4,-4" fill="none" stroke={p.stem} strokeWidth=".42" opacity=".7" strokeLinecap="round" />
      {(i===0 || i===3) && <path d="M-4.3,-2.3 Q-7.9,-5.5 -11.8,-4.7 Q-7.9,-4.5 -4.3,-2.3Z" fill={p.light} opacity=".65" />}
    </g>)}
  </g>;
}

export function GardenSaladCrop({ crop, theme, variation }: {
  crop: 'waterSpinach'; theme: YorkshireSceneTheme; variation: number;
}) {
  const p=theme.isNight
    ? {deep:'#38533a',leaf:'#5e7f49',light:'#829e60',vein:'#9cab78',stem:'#7e9661'}
    : theme.timeOfDay==='dusk'
      ? {deep:'#4c6635',leaf:'#789547',light:'#9db75e',vein:'#b7c47d',stem:'#93a95e'}
      : {deep:'#416d38',leaf:'#689b43',light:'#91b956',vein:'#b2ce7d',stem:'#8ab15c'};
  const pose=variation%3;
  return <g data-salad-crop={crop} data-plant-pose={pose}>
    <WaterSpinach p={p} pose={pose} />
  </g>;
}
