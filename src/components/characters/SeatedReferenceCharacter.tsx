import React from 'react';
import { CharacterHead, type CharacterHeadProps } from '../CharacterAvatar';
import { normalizeIsoFacing } from '../../utils/characterFacing';
import { CHARACTER_REFERENCE_PALETTE as palette, CHARACTER_WORLD_SIZE, SEATED_SIDE_ROBE, SEATED_SIDE_HEIGHT } from './characterProportions';
import { SeatedSideBody } from './SeatedSideBody';

/** Accepted seated outline, scaled with the standing head; floor anchor is (0,0). */
export function SeatedReferenceCharacter({ facing = 'SE', hairStyle = 'curtain_crescent', hairColor = palette.hair }:
  Pick<CharacterHeadProps, 'facing' | 'hairStyle' | 'hairColor'>) {
  const direction = normalizeIsoFacing(facing);
  const side = direction === 'SW' || direction === 'NE';
  const groundY = side ? SEATED_SIDE_ROBE.groundY : 8;
  return <g data-character-pose="seated" data-facing={direction}
    data-seated-height={side ? Number(SEATED_SIDE_HEIGHT.toFixed(2)) : CHARACTER_WORLD_SIZE.floorSeatedHeight}
    transform={`scale(${CHARACTER_WORLD_SIZE.authoringScale}) translate(0,${-groundY})`}>
    {!side && <ellipse cx="0" cy="8" rx={direction === 'SE' ? 13 : 12} ry={direction === 'SE' ? 5.5 : 5} fill={palette.shadow} opacity="0.22" />}
    <g transform={direction === 'NE' ? 'scale(-1,1)' : undefined}>
      {side ? <SeatedSideBody showGroundShadow /> : <>
        <ellipse cx="0" cy="4" rx="10" ry="4.2" fill="#c56349" />
        <ellipse cx="0" cy="3.5" rx="9" ry="3.6" fill={palette.shirt} />
        <path d="M-6,2 C-7,-4 -5,-9 0,-9 C5,-9 7,-4 6,2 Z" fill={palette.shirt} />
        <path d="M-4,1 Q0,3 4,1" stroke="#000" strokeWidth="0.6" opacity="0.16" fill="none" />
        {direction === 'NW' ? <>
          <line x1="0" y1="-7.5" x2="0" y2="1.5" stroke="#000" strokeWidth="0.65" opacity="0.14" strokeLinecap="round" />
          <path d="M-3.5,-8.8 Q0,-8 3.5,-8.8" stroke="#000" strokeWidth="0.6" opacity="0.18" fill="none" />
        </> : <>
          <ellipse cx="-1.6" cy="1.2" rx="2.2" ry="1.5" fill={palette.skin} />
          <ellipse cx="1.6" cy="1.2" rx="2.2" ry="1.5" fill={palette.skin} />
        </>}
      </>}
    </g>
    <CharacterHead r={7} cy={-14} facing={direction} skinColor={palette.skin}
      hairColor={hairColor} beanieColor={palette.beanie} hairStyle={hairStyle} />
  </g>;
}
