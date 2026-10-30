import { memo } from 'react';
import type { YorkshireSceneTheme } from '../../../components/scenery/yorkshire/landscapeTypes';
import { foothillSurfacePath } from '../../scene/foothillGeometry';
import { requestedMeadowFoothill } from '../../scene/currentScene';
import { F2MeadowFoothill } from './F2MeadowFoothill';

export const F2FoothillLandform = memo(function F2FoothillLandform({ theme }: { theme: YorkshireSceneTheme }) {
  const meadow=requestedMeadowFoothill();
  return <g data-foothill-transition={meadow ? 'meadow-hill' : 'source-foot'} pointerEvents="none" aria-hidden="true">
    <path data-foothill-surface="" d={foothillSurfacePath()} fill="transparent" />
    {meadow && <F2MeadowFoothill theme={theme}/>}
  </g>;
});
