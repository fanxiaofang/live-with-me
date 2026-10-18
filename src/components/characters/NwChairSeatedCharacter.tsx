import {useId} from 'react';
import type {Person} from '../../types';
import {RoundCharacterHand} from './RoundCharacterHand';
import {chairSeatPath} from '../desk/chairGeometry';
import {WindsorSeatedHead} from '../desk/WindsorSeatedHead';
import {chairPlaneEllipse, NW_CHAIR_ROBE as cloth, NW_CHAIR_SEATED as pose} from './nwChairSeatedGeometry';
import {NW_SEATED_V6} from './nwChairSeatedV6Assets';

/** Short-haired NW pose rebuilt from the complete v6 body reference. Original
 * head paths stay exact; authoring PNG and generated head are not rendered. */
export function NwChairSeatedCharacter({occupant,showSeatContact = true}: {occupant: Person; showSeatContact?: boolean}) {
  const prefix = `nw-chair-${useId().replace(/[^\w-]/g,'')}`;
  const skin = occupant.skinColor ?? '#fad4c0';
  const shirt = occupant.shirtColor;
  const headphones = ['coding','study','writing','listening_music'].includes(occupant.currentState);
  const hand = pose.hands[0];
  return <g id="seated-character-body" data-scene-character="chair-seated" data-character-pose="chair-seated"
    data-windsor-pose="nw-chair-legs-down-v6" data-facing={pose.direction} data-person-id={occupant.id}
    data-nw-chair-seated="shorthair-study" data-hand-mode="lap" data-seat-contact-y={pose.hip.y}
    data-head-center-y={pose.head.y} data-seated-silhouette="rounded-back-hip-lap" data-body-source={NW_SEATED_V6.sourceSha256}>
    <defs>
      <clipPath id={`${prefix}-seat`}><path d={chairSeatPath(pose.seatHeight,1.1)}/></clipPath>
      <clipPath id={`${prefix}-robe`}><path d={cloth.outline}/></clipPath>
      <radialGradient id={`${prefix}-soft`}>
        <stop stopColor="#38271e" stopOpacity=".16"/><stop offset=".6" stopColor="#38271e" stopOpacity=".07"/>
        <stop offset="1" stopColor="#38271e" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <path data-nw-hem-ground-shadow="true" d={chairPlaneEllipse(0,-9.3,6.4,2.2,.12)} fill={`url(#${prefix}-soft)`}/>
    {showSeatContact && <g clipPath={`url(#${prefix}-seat)`} data-nw-seat-contact="true">
      <path d={chairPlaneEllipse(0,2,4.8,2.7,pose.seatHeight)} fill="#38271e" opacity=".12"/>
      <path d={chairPlaneEllipse(0,2,4.2,2.2,pose.seatHeight)} fill="#38271e" opacity=".08"/>
    </g>}
    {/* The original rounded hand tucks under the new sleeve opening. */}
    <g data-windsor-resting-arm="near">
      <g id="volumetric-left-hand">
        <ellipse cx={hand.x} cy={hand.y+.85} rx="1.65" ry=".42" fill="#30251e" opacity=".07"/>
        <RoundCharacterHand cx={hand.x} cy={hand.y} rx={1.65} ry={1.45} skinColor={skin}/>
      </g>
    </g>
    <path data-desk-robe="true" data-continuous-cloth="shoulder-pelvis-thigh-knee-hem" d={cloth.outline}
      fill={shirt} stroke="#30251e" strokeOpacity=".12" strokeWidth=".18" strokeLinejoin="round"/>
    <g clipPath={`url(#${prefix}-robe)`} data-nw-volume-folds="true">
      {NW_SEATED_V6.shadows.map((band,i)=><g key={i} fill="#342016" opacity={band.opacity}>
        {band.paths.map((d,j)=><path key={j} d={d}/>)}
      </g>)}
    </g>
    <WindsorSeatedHead person={occupant} cx={pose.head.x} cy={pose.head.y} headphones={headphones}/>
  </g>;
}

export function NwChairSeatedGuides() {
  return <g data-windsor-pose-guides="true" pointerEvents="none" fontSize="2" fill="none" strokeWidth=".35">
    <path d={chairSeatPath(pose.seatHeight,1.1)} fill="#368779" fillOpacity=".08" stroke="#287264" strokeDasharray="1 1"/>
    <path d={chairPlaneEllipse(0,2,4.2,2.2,pose.seatHeight)} fill="#438779" fillOpacity=".17" stroke="#287264"/>
    <text x="9" y="8" fill="#236658" stroke="none">原坐面参照</text>
  </g>;
}
