import type { YorkshireSceneTheme } from '../../../components/scenery/yorkshire/landscapeTypes';
import { MEADOW_HILL_WINDMILL, meadowHillSurfaceY } from '../../scene/meadowFoothill';
import { requestedMeadowFoothill } from '../../scene/currentScene';
import { meadowFoothillMaterial } from './meadowFoothillMaterial';

/** One modest stone mill on the accepted meadow's upper shoulder. */
export function F2FoothillWindmill({theme}:{theme:YorkshireSceneTheme}) {
  if (!requestedMeadowFoothill()) return null;
  const {x,depth}=MEADOW_HILL_WINDMILL;
  const y=meadowHillSurfaceY(x,depth)!;
  const material=meadowFoothillMaterial(theme.timeOfDay || 'day');
  const wall=material.landmarkColor('#b9b59a',[-.65,.5,.57]);
  const side=material.landmarkColor('#aaa990',[.65,.5,.57]);
  const roof=material.landmarkColor('#796e5c',[0,.8,.6]);
  const timber=material.landmarkColor('#665f4b',[0,0,1]);
  const sail=material.landmarkColor('#c8c4a9',[0,.2,.98]);
  return <g data-foothill-windmill="static" data-surface-root={`${x},${y}`} data-surface-depth={depth}
    transform={`translate(${x},${y})`} pointerEvents="none" aria-hidden="true">
    <path d="M-7,0 L-4,-26 L3,-26 L6,0Z" fill={wall}/>
    <path d="M0,-26 L3,-26 L6,0 H0Z" fill={side}/>
    <path d="M-5.5,-25 L-1,-32 L5,-25Z" fill={roof}/>
    <path d="M-1,0 V-6 Q1,-8 3,-6 V0Z M-1,-17 H1.5 V-13.5 H-1Z" fill={timber}/>
    <path d="M-5,-8 H-2 M1,-21 H3.5 M-4,-12 H-1.5" stroke={side} strokeWidth=".6"/>
    <g transform="translate(-.5,-24) rotate(28)" data-windmill-sails="">
      {[0,90,180,270].map(angle=><g key={angle} transform={`rotate(${angle})`}>
        <path d="M0,0 V-20" stroke={timber} strokeWidth="1.1"/>
        <path d="M.5,-7 H4 L4.8,-20 H.5Z" fill={sail}/>
        <path d="M.5,-11 H4.2 M.5,-16 H4.5" stroke={timber} strokeWidth=".45" opacity=".55"/>
      </g>)}
      <circle r="1.8" fill={timber}/>
      <circle r=".65" fill={sail}/>
    </g>
    {/* A short grass overlap seats the masonry without a dark ground blotch. */}
    <path d="M-8,1 L-7,-1 -5,.1 -4,-1.6 -2,.3 1,-.4 3,.5 5,-1 7,.1 8,1Z"
      fill={material.colorAt(x,depth)}/>
  </g>;
}
