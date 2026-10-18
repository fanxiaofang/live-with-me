import { useId, useMemo, type CSSProperties } from 'react';
import type { StandingCharacterProps } from './StandingCharacter';
import { FINALIZED_NW_STANDING as asset } from './finalizedNwStandingAssets';

function key(style?:string): keyof typeof asset.heads {
  if(['wavy_curly','curly'].includes(style??''))return 'curly';
  if(['long_wavy','long','sidepart'].includes(style??''))return 'sidepart';
  if(['medium_straight','straight','bob','shaggy'].includes(style??''))return 'shaggy';
  return 'shorthair';
}
function tint(hex:string,factor:number){
  if(!/^#[\da-f]{6}$/i.test(hex))return hex;
  return `#${[1,3,5].map(i=>Math.min(255,Math.round(parseInt(hex.slice(i,i+2),16)*factor)).toString(16).padStart(2,'0')).join('')}`;
}

/** Additional NW quarter view. Original four-view components stay untouched. */
export function FinalizedNwStandingCharacter({skinColor='#f5d6be',beanieColor='#425b6e',hairColor='#1f1b18',
  hairStyle='curtain_crescent',shirtColor='#e07a5f',hasPompom=true}: Omit<StandingCharacterProps,'facing'|'parentScale'|'showBeanie'>){
  const prefix=`finalized-nw-${useId().replace(/[^\w-]/g,'')}`;
  const hairstyle=key(hairStyle),head=asset.heads[hairstyle];
  const html=useMemo(()=>{
    const markup=asset.common+(hasPompom?head.head:head.head.replaceAll(head.hatWithPom,head.hatWithoutPom));
    return markup.replaceAll('NW_PREFIX',prefix);
  },[head,prefix,hasPompom]);
  const colors={'--nw-skin':skinColor,'--nw-hat':beanieColor,'--nw-hat-shade':tint(beanieColor,.87),
    '--nw-hair':hairColor,'--nw-hair-shade':tint(hairColor,.87),'--nw-shirt':shirtColor,
    '--nw-shirt-light':tint(shirtColor,1.02),'--nw-shirt-shade':tint(shirtColor,.73)} as CSSProperties;
  return <g data-character-pose="standing" data-facing="NW-eight-view" data-finalized-nw={hairstyle}
    data-nw-source={head.sourceSha256} data-nw-pompom={hasPompom}
    transform={`translate(${asset.origin.x},${asset.origin.y}) scale(${asset.scale})`}
    style={colors} dangerouslySetInnerHTML={{__html:html}}/>;
}
