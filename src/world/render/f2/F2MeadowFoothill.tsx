import { useId,useMemo } from 'react';
import type { YorkshireSceneTheme } from '../../../components/scenery/yorkshire/landscapeTypes';
import { MEADOW_FOOTHILL, meadowHillPath, meadowHillSurfaceY } from '../../scene/meadowFoothill';
import { meadowFoothillMaterial } from './meadowFoothillMaterial';
import { F2FoothillWindmill } from './F2FoothillWindmill';
import { BLENDED_MEADOW_COLUMNS, BLENDED_MEADOW_DEPTHS, BLENDED_MEADOW_STEP } from '../../scene/meadowVegetation';

/** The approved meadow surface and its static windmill. */
export function F2MeadowFoothill({theme}:{theme:YorkshireSceneTheme}) {
  const id=useId().replace(/:/g,''),height=MEADOW_FOOTHILL.height;
  const material=useMemo(()=>meadowFoothillMaterial(theme.timeOfDay || 'day'),[theme.timeOfDay]);
  const columns=BLENDED_MEADOW_COLUMNS,path=meadowHillPath(height);
  const step=BLENDED_MEADOW_STEP,depths=BLENDED_MEADOW_DEPTHS;
  return <g data-gentle-foothill="meadow" data-main-foothill-revision="grassland-form"
    data-foothill-material="blended-vegetation" data-review-status="accepted" pointerEvents="none" aria-hidden="true">
    <defs>
      <clipPath id={`${id}-clip`}><path d={path}/></clipPath>
      {/* Blend across adjacent samples horizontally; preserve vertical material detail.
          The outer clip keeps the hill silhouette crisp. */}
      <filter id={`${id}-interpolate`} x="-2%" y="0" width="104%" height="100%" colorInterpolationFilters="sRGB"><feGaussianBlur stdDeviation="1.5 0"/></filter>
      {columns.map((x,i)=><linearGradient key={x} id={`${id}-${i}`} gradientUnits="userSpaceOnUse"
        x1={x} x2={x} y1={meadowHillSurfaceY(x+step/2,0,height)} y2={meadowHillSurfaceY(x+step/2,1,height)}>
        {depths.map(d=><stop key={d} offset={d} stopColor={material.colorAt(x+step/2,d)}/>)}</linearGradient>)}
    </defs>
    <g clipPath={`url(#${id}-clip)`} data-meadow-hill-body="opaque">
      <path d={path} fill={material.groundAt(490)}/>
      <g filter={`url(#${id}-interpolate)`}>{columns.map((x,i)=><rect key={x} x={x} y="125" width={step+.2} height="160" fill={`url(#${id}-${i})`}/>)}</g>
    </g>
    <F2FoothillWindmill theme={theme}/>
  </g>;
}
