import React, { useId } from 'react';
import { CharacterHead, type CharacterHeadProps } from '../CharacterAvatar';
import { normalizeIsoFacing } from '../../utils/characterFacing';
import { CHARACTER_REFERENCE_PALETTE as palette, STANDING_CHARACTER_PROPORTIONS as proportions, CHARACTER_WORLD_SIZE } from './characterProportions';
import { CHARACTER_GROUND_SLOPE } from './characterProjection';
import { RoundCharacterHand } from './RoundCharacterHand';

export interface StandingCharacterProps extends Pick<CharacterHeadProps,
  'facing' | 'skinColor' | 'hairColor' | 'hairStyle' | 'beanieColor' | 'showBeanie' | 'hasPompom'> {
  shirtColor?: string;
  parentScale?: number;
}

/** Front/back keep the v3 outline. The side body has a narrower depth profile
 * and overlapping sleeves; the head meets the robe without an exposed neck. */
export function StandingCharacter({ facing = 'SE', skinColor = palette.skin, hairColor = palette.hair,
  hairStyle = 'curtain_crescent', beanieColor = palette.beanie, showBeanie = true, hasPompom = true,
  shirtColor = palette.shirt, parentScale = 1 }: StandingCharacterProps) {
  const direction = normalizeIsoFacing(facing);
  const side = direction === 'SW' || direction === 'NE';
  const back = direction === 'NW';
  const shadowId = `standing-shadow-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const contactShadowId = `${shadowId}-contact`;
  const cuff = proportions.cuffY;
  const hemDepth = (side ? proportions.hemWidth : proportions.hemDepth) / 2 * CHARACTER_GROUND_SLOPE;
  const outline = { stroke: palette.shadow, strokeOpacity: 0.12, strokeWidth: 0.4, strokeLinejoin: 'round' as const };

  return <g data-character-pose="standing" data-facing={direction}
    data-standing-height={CHARACTER_WORLD_SIZE.standingHeight}
    transform={`scale(${CHARACTER_WORLD_SIZE.authoringScale / parentScale})`}>
    <defs><radialGradient id={shadowId}>
      <stop offset="0" stopColor={palette.shadow} stopOpacity="0.28" />
      <stop offset="0.55" stopColor={palette.shadow} stopOpacity="0.14" />
      <stop offset="1" stopColor={palette.shadow} stopOpacity="0" />
    </radialGradient>
      <linearGradient id={contactShadowId} x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0" stopColor={palette.shadow} stopOpacity="0" />
        <stop offset="0.25" stopColor={palette.shadow} stopOpacity="0.24" />
        <stop offset="0.5" stopColor={palette.shadow} stopOpacity="0.36" />
        <stop offset="0.75" stopColor={palette.shadow} stopOpacity="0.24" />
        <stop offset="1" stopColor={palette.shadow} stopOpacity="0" />
      </linearGradient>
    </defs>
    <ellipse cx="0" cy="0.5" rx={side ? 8.5 : 11.5} ry={hemDepth + 1.3} fill={`url(#${shadowId})`} />
    {/* A narrow contact crescent follows the existing hem, below the robe.
        Its ends fade without a blur filter; the wider soft shadow stays intact. */}
    <g data-contact-shadow="true" transform={direction === 'NE' ? 'scale(-1,1)' : undefined}>
      <path d={side
        ? `M-6.6,-0.5 C-3.7,${hemDepth * 1.3} 3.7,${hemDepth * 1.3} 6.6,0.1
          Q6.73,0.42 6.52,0.56 C3.7,${hemDepth * 1.3 + 0.6} -3.7,${hemDepth * 1.3 + 0.6} -6.55,-0.1
          Q-6.72,-0.2 -6.6,-0.5 Z`
        : `M9,0 C4.95,${hemDepth * 4 / 3} -4.95,${hemDepth * 4 / 3} -9,0
          Q-9.12,0.38 -8.9,0.45 C-4.95,${hemDepth * 4 / 3 + 0.52} 4.95,${hemDepth * 4 / 3 + 0.52} 8.9,0.45
          Q9.12,0.38 9,0 Z`} fill={`url(#${contactShadowId})`} />
    </g>
    <g data-standing-body="true" transform={direction === 'NE' ? 'scale(-1,1)' : undefined}>
      {side ? <>
        {/* Facing left in local coordinates: front at x<0, back at x>0.
            The far arm is drawn first and mostly covered by the torso. */}
        <path d={`M2,-27 Q3.5,-25.5 4,-21.4 L4.6,${cuff + 0.5}
          Q3.5,${cuff + 1.2} 2.4,${cuff + 0.6} L1.9,-22 Z`}
          fill={shirtColor} {...outline} />
        <RoundCharacterHand cx={3.7} cy={cuff + 1.7} rx={1.3} ry={1.3} skinColor={skinColor} />
        <path d={`M-1.9,-29 Q-3.8,-28.2 -4,-25.5
          C-4.75,-21.5 -4.45,-17.2 -4.86,-12
          C-5.18,-7.1 -5.5,-2.7 -6.6,-0.5
          C-3.7,${hemDepth * 1.3} 3.7,${hemDepth * 1.3} 6.6,0.1
          Q5.7,-2.4 4.9,-5.8 C4,-10 4.97,-18 3.7,-25.2
          Q3.5,-28.3 1.2,-29 Q-0.3,-29.4 -1.9,-29 Z`}
          fill={shirtColor} {...outline} />
        {/* The back cloth panel stays behind the near sleeve, with a soft side seam. */}
        <path d={`M2.4,-25 C3.02,-18 2.7,-10.2 3.7,-4.1 Q4.2,-1.5 5.1,1.1
          Q6.1,0.8 6.6,0.1 Q5.7,-2.4 4.9,-5.8
          C4,-10 4.97,-18 3.7,-25.2 Z`} fill={palette.shadow} opacity="0.055" />
        <path d="M2.45,-14 C2.8,-9.2 2.7,-5.1 3.6,-1.1"
          fill="none" stroke={palette.shadow} strokeOpacity="0.11" strokeWidth="0.45" strokeLinecap="round" />
        {/* The near sleeve sits inside the silhouette, rather than along its front edge. */}
        <RoundCharacterHand cx={0.15} cy={cuff + 1.35} rx={1.55} ry={1.55} skinColor={skinColor} />
        <path d={`M0,-26.8 Q1.8,-26.3 1.9,-22.7 L1.8,${cuff + 0.2}
          Q0.2,${cuff + 0.8} -1.5,${cuff + 0.2} L-1.4,-22.9
          Q-1.5,-25.5 0,-26.8 Z`} fill={shirtColor} />
        <path d={`M0,-26.8 Q1.8,-26.3 1.9,-22.7 L1.8,${cuff + 0.2}
          M-1.4,-22.9 L-1.5,${cuff + 0.2}`}
          fill="none" stroke={palette.shadow} strokeOpacity="0.13" strokeWidth="0.45" strokeLinecap="round" />
        <path d={`M-1.5,${cuff - 0.35} Q0.2,${cuff + 0.3} 1.8,${cuff - 0.35}`}
          stroke={palette.shadow} strokeOpacity="0.17" strokeWidth="0.5" fill="none" />
        <path d="M-4.5,-7 Q-3.9,-3.6 -5,-1.1 M5,-5 Q4.5,-2.9 5.3,-0.7"
          fill="none" stroke={palette.shadow} strokeOpacity="0.12" strokeWidth="0.5" strokeLinecap="round" />
      </> : <>
        {/* One outer shape includes the dropped sleeves, so shoulders cannot bubble. */}
        <path d={`M0,-29 C4.4,-29 6.1,-25.6 6.6,-22.8 L7.2,${cuff}
          Q6.3,${cuff + 0.5} 5.2,${cuff} C5.9,-8.6 7.4,-4.1 8.8,-1.2
          Q9.15,0 9,0 C4.95,${hemDepth * 4 / 3} -4.95,${hemDepth * 4 / 3} -9,0
          Q-9.15,0 -8.8,-1.2 C-7.4,-4.1 -5.9,-8.6 -5.2,${cuff}
          Q-6.3,${cuff + 0.5} -7.2,${cuff} L-6.6,-22.8 C-6.1,-25.6 -4.4,-29 0,-29 Z`}
          fill={shirtColor} {...outline} />
        <path d={`M4.5,-23.1 C4.8,-18.3 4.8,-11 7.9,0.4 L9,0 Q9.15,0 8.8,-1.2
          C7.4,-4.1 5.9,-8.6 5.2,${cuff} Q6.3,${cuff + 0.5} 7.2,${cuff} L6.6,-22.8 Z`}
          fill={palette.shadow} opacity="0.05" />
        {[-1, 1].map(sign => <g key={sign} transform={`scale(${sign},1)`}>
          <path d={`M3.8,-25.7 Q5.6,-23.1 5.4,-19 L5.2,${cuff}`}
            fill="none" stroke={palette.shadow} strokeOpacity="0.09" strokeWidth="0.45" />
          <RoundCharacterHand cx={6.2} cy={cuff + 1.35} rx={1.55} ry={1.55} skinColor={skinColor} />
          <path d={`M5.2,${cuff - 0.45} Q6.3,${cuff} 7.2,${cuff - 0.45}
            L7.2,${cuff + 0.3} Q6.3,${cuff + 0.8} 5.2,${cuff + 0.3} Z`} fill={shirtColor} />
          <path d={`M5.2,${cuff + 0.3} Q6.3,${cuff + 0.8} 7.2,${cuff + 0.3}`}
            fill="none" stroke={palette.shadow} strokeOpacity="0.17" strokeWidth="0.5" />
        </g>)}
        <path d={back ? 'M-2.7,-27.2 Q0,-26.4 2.7,-27.2' : 'M-2.6,-26.5 Q0,-25.1 2.6,-26.5'}
          fill="none" stroke={palette.shadow} strokeOpacity="0.17" strokeWidth="0.5" />
        <path d={back ? 'M0,-23.7 L0,-17.7' : 'M0,-25.8 L0,-23.5'}
          fill="none" stroke={palette.shadow} strokeOpacity={back ? 0.09 : 0.12} strokeWidth="0.45" />
        <path d="M-6.7,-5.2 Q-6.1,-3.6 -7,-1.7 M5.8,-4.5 Q5.2,-2.6 6.1,-1.2"
          fill="none" stroke={palette.shadow} strokeOpacity="0.12" strokeWidth="0.5" strokeLinecap="round" />
      </>}
    </g>
    <CharacterHead cx={0} cy={proportions.headCenterY} r={proportions.headRadius}
      facing={direction} skinColor={skinColor} hairColor={hairColor} hairStyle={hairStyle}
      beanieColor={beanieColor} showBeanie={showBeanie} hasPompom={hasPompom} />
  </g>;
}
