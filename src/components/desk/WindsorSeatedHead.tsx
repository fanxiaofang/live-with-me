import { useId, useMemo, type CSSProperties } from 'react';
import type { Person } from '../../types';
import { NW_SEATED_HEAD_ASSETS } from './nwSeatedHeadAssets';

// Same scale as the approved standing comparison. The entire head is only
// translated/uniformly scaled; no facial, hat or hairstyle paths are redrawn.
export const NW_HEAD_SCALE = 0.039734395750332004;
const SOURCE_CENTER = { x: 545, y: 390 };

function hairstyle(style?: string): keyof typeof NW_SEATED_HEAD_ASSETS {
  if (['wavy_curly', 'curly'].includes(style ?? '')) return 'curly';
  if (['long_wavy', 'long', 'sidepart'].includes(style ?? '')) return 'sidepart';
  if (['medium_straight', 'straight', 'bob', 'shaggy'].includes(style ?? '')) return 'shaggy';
  return 'shorthair';
}
function shade(hex: string, factor: number) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  return `#${[1, 3, 5].map(i => Math.round(parseInt(hex.slice(i, i + 2), 16) * factor).toString(16).padStart(2, '0')).join('')}`;
}

export function WindsorSeatedHead({ person, cx, cy, headphones }: {
  person: Person; cx: number; cy: number; headphones: boolean;
}) {
  const prefix = `windsor-nw-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const key = hairstyle(person.hairStyle);
  const asset = NW_SEATED_HEAD_ASSETS[key];
  const markup = useMemo(() => {
    const head = person.hasPompom === false ? asset.markup.replaceAll(asset.hatWithPom, asset.hatWithoutPom) : asset.markup;
    return head.replaceAll('NW_PREFIX', prefix);
  }, [asset, prefix, person.hasPompom]);
  const hair = person.hairColor ?? '#1f1b18';
  const hat = person.beanieColor ?? '#425b6e';
  const colors = {
    '--nw-hair': hair, '--nw-hair-shade': shade(hair, .87),
    '--nw-skin': person.skinColor ?? '#f5d6be',
    '--nw-hat': hat, '--nw-hat-shade': shade(hat, .87),
  } as CSSProperties;
  return <g data-windsor-head="back-left" data-nw-head-source={asset.sourceSha256} data-nw-hairstyle={key} data-nw-pompom={person.hasPompom !== false}
    transform={`translate(${cx},${cy}) scale(${NW_HEAD_SCALE}) translate(${-SOURCE_CENTER.x},${-SOURCE_CENTER.y})`} style={colors}>
    <g dangerouslySetInnerHTML={{ __html: markup }} />
    {headphones && <g data-desk-headphones="windsor-nw" strokeLinecap="round">
      <path d="M355,460 C272,1 820,2 715,500" fill="none" stroke="#283a41" strokeWidth="29" />
      <path d="M356,445 C293,24 799,28 716,482" fill="none" stroke="#65777a" strokeWidth="8" />
      <ellipse data-ear-cup="true" cx="709" cy="499" rx="24" ry="45" fill="#24353d" />
      <ellipse data-ear-cup="true" cx="365" cy="457" rx="40" ry="52" transform="rotate(-15 365 457)" fill="#24353d" />
      <ellipse cx="361" cy="457" rx="27" ry="41" transform="rotate(-15 361 457)" fill="#415965" />
      <path d="M355,425 Q339,456 356,485" stroke="#82908c" strokeWidth="8" fill="none" />
    </g>}
  </g>;
}
