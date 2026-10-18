import {useId, useMemo, type CSSProperties} from 'react';
import type {Person} from '../../types';
import {WindsorSeatedHead} from '../desk/WindsorSeatedHead';
import {APPROVED_NW_FLOOR_SEATED as asset} from './approvedNwFloorSeatedAssets';
import {CHARACTER_REFERENCE_PALETTE as palette, SEATED_SIDE_ROBE as hem} from './characterProportions';

/** Current NW floor-seated baseline approved from the user's SVG.
 * Only document placement and SVG ID scopes are normalized. Body paths and
 * the supplied uniform scale are retained; this is not a chair-seated asset.
 */
export function NwFloorSeatedCharacter({person}:{person:Person}){
  const prefix=`nw-floor-seated-${useId().replace(/[^\w-]/g,'')}`;
  const markup=useMemo(()=>asset.body.replaceAll('NW_FLOOR_PREFIX',prefix),[prefix]);
  const colors={'--nw-floor-shirt':person.shirtColor??palette.shirt,'--nw-floor-skin':person.skinColor??palette.skin} as CSSProperties;
  return <g data-character-pose="floor-seated" data-facing="NW-eight-view"
    data-seated-study="nw-floor-user-approved" data-seated-approval="current-approved"
    data-seated-source={asset.sourceSha256}
    transform={`scale(${asset.scale}) translate(0,${-hem.groundY})`} style={colors}>
    <g dangerouslySetInnerHTML={{__html:markup}}/>
    <WindsorSeatedHead person={person} cx={0} cy={-14} headphones={false}/>
  </g>;
}
