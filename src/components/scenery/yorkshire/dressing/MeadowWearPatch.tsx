import React from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';

interface MeadowWearPatchProps {
  id: string;
  theme: Pick<YorkshireSceneTheme, 'roadColor' | 'hillGreenFar'>;
  transform?: string;
  opacity?: number;
  variant?: 'entry' | 'scuff';
}

/** Local grass wear. Entrances fade along +y; scuffs leave grass between soil spots.
 * Keep each patch in its owner's ground plane, under steps, fences and occupants. */
export function MeadowWearPatch({ id, theme, transform, opacity = 1, variant = 'entry' }: MeadowWearPatchProps) {
  const gradientId = `${id}-fade`;
  const scuff = variant === 'scuff';
  return <g id={id} transform={transform} opacity={opacity} pointerEvents="none">
    <defs>
      <radialGradient id={gradientId} cx="46%" cy="35%" r="68%">
        <stop offset="0%" stopColor={theme.roadColor} stopOpacity="0.5" />
        <stop offset="48%" stopColor={theme.roadColor} stopOpacity="0.28" />
        <stop offset="100%" stopColor={theme.roadColor} stopOpacity="0" />
      </radialGradient>
    </defs>
    <path d={scuff
      ? 'M-35,0 C-37,-5 -25,-10 -15,-8 C-7,-12 1,-7 8,-8 C18,-10 21,-4 29,-4 C38,-3 39,3 29,5 C23,8 16,5 10,8 C1,12 -5,7 -13,9 C-23,10 -22,5 -30,5 C-36,5 -40,2 -35,0 Z'
      : 'M-31,0 C-21,-5 -5,-4 16,0 C31,5 25,11 18,14 C25,18 15,24 12,27 C17,31 8,36 4,38 C9,41 1,47 -9,44 C-19,42 -16,35 -25,32 C-32,29 -27,23 -34,20 C-42,14 -40,5 -31,0 Z'}
      fill={`url(#${gradientId})`} />
    <path d={scuff
      ? 'M-26,-2 Q-21,-5 -15,-3 L-10,-4 Q-7,-1 -12,1 Q-18,0 -22,2 Z'
      : 'M-23,11 Q-17,8 -10,10 Q-5,8 1,12 L-3,14 Q-12,13 -18,15 Z'}
      fill={theme.roadColor} opacity="0.52" />
    <path d={scuff
      ? 'M-3,1 Q1,-2 7,0 Q11,-1 16,2 L12,4 Q5,3 1,5 Z'
      : 'M-11,21 Q-6,18 1,20 Q5,19 10,22 Q7,25 1,24 L-4,26 Q-10,25 -11,21 Z'}
      fill={theme.roadColor} opacity="0.38" />
    <path d={scuff
      ? 'M22,0 Q26,-2 30,0 Q29,2 24,3 Z M-9,5 Q-5,3 -2,5 L-6,7 Z'
      : 'M-12,33 Q-6,30 -1,33 Q-3,35 -8,36 Z M1,39 Q5,37 8,39 Q5,41 2,41 Z'}
      fill={theme.roadColor} opacity="0.22" />
    <path d={scuff
      ? 'M-30,2 l4,0.5 M-15,5 l3,0.5 M-5,-4 l4,-0.5 M18,-2 l3,-0.5 M21,5 l4,0.5'
      : 'M-29,13 l5,1 M-20,23 l4,0.5 M12,19 l5,-0.5 M-16,31 l4,0.5 M3,34 l3,-0.5 M-5,41 l3,0.5'}
      fill="none" stroke={theme.hillGreenFar} strokeWidth="1" strokeLinecap="round" opacity="0.4" />
  </g>;
}
