import React from 'react';
import { CharacterHead, type CharacterHeadProps } from '../CharacterAvatar';
import { normalizeIsoFacing } from '../../utils/characterFacing';
import { CHARACTER_PREVIEW_PALETTE } from './characterPreviewPalette';

export const APPEARANCE_DIRECTIONS = [
  { facing: 'SE', label: '正面' },
  { facing: 'SW', label: '左侧' },
  { facing: 'NW', label: '背面' },
  { facing: 'NE', label: '右侧' },
] as const;

/** A portrait for choosing appearance. The shared scene head remains unchanged;
 * the shirt is cropped at the frame's lower edge, with no detached floor shadow. */
export function CharacterAppearancePreview({ facing, shirtColor, ...head }:
  Pick<CharacterHeadProps, 'facing' | 'skinColor' | 'beanieColor' | 'hairStyle' | 'hairColor' | 'hasPompom'> & {
    shirtColor: string;
  }) {
  const direction = normalizeIsoFacing(facing);
  const side = direction === 'SW' || direction === 'NE';
  const label = APPEARANCE_DIRECTIONS.find(view => view.facing === direction)!.label;
  const width = 64;
  const height = 80;
  // Explicit bounds also prevent the SVG's intrinsic size from expanding the layout.
  return <div data-testid="appearance-preview" style={{
    backgroundColor: CHARACTER_PREVIEW_PALETTE.background,
    width, height, minWidth: width, maxWidth: width, minHeight: height, maxHeight: height,
    flex: '0 0 auto', padding: 4, boxSizing: 'border-box', overflow: 'hidden',
  }} className="rounded-xl border border-[#8c8276]">
    <svg viewBox="-12 -27 24 34" role="img" aria-label={`装扮预览：${label}`} data-facing={direction}
      width="100%" height="100%" style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }}>
      <g transform={direction === 'NE' ? 'scale(-1,1)' : undefined}>
        <path d={side
          ? 'M-6.5,7 C-7.5,-1 -4.5,-8.5 -1,-9 C2.5,-9.5 6,-5.5 6,7 Z'
          : 'M-8,7 C-8,-2 -5,-9 0,-9 C5,-9 8,-2 8,7 Z'} fill={shirtColor} />
        {direction === 'NW' && <path d="M-4,-8.5 Q0,-7.5 4,-8.5 M0,-7.5 V7"
          stroke="#1b120a" strokeWidth="0.5" strokeOpacity="0.13" fill="none" />}
      </g>
      <CharacterHead {...head} facing={direction} r={7} cy={-14} showBeanie />
    </svg>
  </div>;
}
