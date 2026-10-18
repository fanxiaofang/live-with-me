import { useId } from 'react';
import type { Person } from '../../types';
import { RoundCharacterHand } from '../characters/RoundCharacterHand';
import { chairSeatPath } from './chairGeometry';
import { WINDSOR_SEATED_POSE as pose } from './windsorSeatedPose';
import { WindsorSeatedHead } from './WindsorSeatedHead';
import { NwChairSeatedCharacter, NwChairSeatedGuides } from '../characters/NwChairSeatedCharacter';

export function usesNwChairStudy(person: Person) {
  return !person.hairStyle || ['curtain_crescent','short','shorthair'].includes(person.hairStyle);
}

export function WindsorSeatedCharacter(props: {occupant: Person; keyboardAnchor?: {x:number; y:number}; showSeatContact?: boolean}) {
  return usesNwChairStudy(props.occupant) ? <NwChairSeatedCharacter occupant={props.occupant} showSeatContact={props.showSeatContact}/> : <CompactWindsorSeatedCharacter {...props}/>;
}

/** Compact NW sitting silhouette, like the existing cushion/sofa figures.
 * The robe encloses the folded legs as one mass. No separate hanging panel.
 * The far arm is occluded by the torso; the near palm rests on the lap. */
function CompactWindsorSeatedCharacter({ occupant }: {
  occupant: Person; keyboardAnchor?: { x: number; y: number };
}) {
  const prefix = `windsor-cloth-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const shirt = occupant.shirtColor;
  const skin = occupant.skinColor ?? '#fad4c0';
  const headphones = ['coding', 'study', 'writing', 'listening_music'].includes(occupant.currentState);
  return <g id="seated-character-body" data-scene-character="chair-seated" data-windsor-pose="nw-compact-seated-v4"
    data-facing={pose.direction} data-person-id={occupant.id} data-seat-contact-y={pose.seatY}
    data-head-center-y={pose.head.y} data-hand-mode="lap" data-seated-silhouette="compact-robe"
    data-far-arm="occluded-by-torso">
    <defs>
      <radialGradient id={`${prefix}-ground`}>
        <stop stopColor="#24170e" stopOpacity=".2" /><stop offset=".6" stopColor="#24170e" stopOpacity=".09" />
        <stop offset="1" stopColor="#24170e" stopOpacity="0" />
      </radialGradient>
    </defs>
    <ellipse data-windsor-robe-contact="seat" cx="-3.5" cy="9.5" rx="10.9" ry="1.3"
      transform="rotate(-15.92 -3.5 9.5)" fill={`url(#${prefix}-ground)`} />
    <ellipse data-windsor-seat-contact="true" cx={pose.hip.x} cy={pose.hip.y + .2}
      rx="6.7" ry="1.7" transform={`rotate(-15.92 ${pose.hip.x} ${pose.hip.y + .2})`}
      fill="#24170e" opacity=".12" />
    <path data-desk-robe="true" data-continuous-cloth="shoulder-hip-lap-hem" d="M-.7,-6.7
      C-3.1,-7 -4.4,-5.3 -4.8,-3.4 C-5.3,-1.9 -5.5,.2 -6.8,1.8
      C-9.3,2.4 -12.5,3.6 -13.7,5.9 C-14.6,7.1 -14.9,8.8 -14.5,10.4
      C-10.1,12.1 -1.5,10.4 4.5,8.6 C6.5,8 7.2,6.8 6.9,4.7
      L5.9,-2.1 C5.5,-5 3.7,-6.7 1,-6.9Z"
      fill={shirt} stroke="#1b120a" strokeOpacity=".14" strokeWidth=".4" strokeLinejoin="round" />
    {/* A shallow fold describes the lap without cutting it off from the back. */}
    <path data-windsor-lap-fold="true" d="M-9.6,7.1 C-6,8.3 -1.3,7.8 1.8,6.3"
      fill="none" stroke="#1b120a" strokeOpacity=".1" strokeWidth=".42" strokeLinecap="round" />
    <path d="M4.2,-2.7 C5.1,.6 5.6,4.7 3.8,6.7"
      fill="none" stroke="#1b120a" strokeOpacity=".065" strokeWidth=".4" strokeLinecap="round" />
    <g data-windsor-resting-arm="near">
      <path d="M-2.5,-5.9 C-4.5,-5.8 -5.7,-3.6 -5.7,-1.5
        Q-5.7,0 -8.9,2.6 L-10.1,3.4 Q-10.2,4.5 -8.6,5
        Q-4.6,3.2 -3.5,1.1 C-2.1,-1 -1.8,-3.7 -2.5,-5.9Z" fill={shirt} />
      <path d="M-5.7,-1.5 Q-5.7,0 -8.9,2.6 M-3.5,1.1 Q-4.6,3.2 -8.6,5"
        fill="none" stroke="#1b120a" strokeOpacity=".12" strokeWidth=".42" strokeLinecap="round" />
      <g id="volumetric-left-hand">
        <ellipse cx={pose.hands[0].x} cy={pose.hands[0].y + .8} rx="1.7" ry=".45" fill="#1c2021" opacity=".08" />
        <RoundCharacterHand cx={pose.hands[0].x} cy={pose.hands[0].y} rx={1.7} ry={1.5} skinColor={skin} />
      </g>
    </g>
    <WindsorSeatedHead person={occupant} cx={pose.head.x} cy={pose.head.y} headphones={headphones} />
  </g>;
}

/** Optional authoring overlay, never mounted in the real room. */
export function WindsorPoseGuides({classic = true}: {classic?: boolean}) {
  return classic ? <NwChairSeatedGuides/> : <CompactWindsorPoseGuides/>;
}

function CompactWindsorPoseGuides() {
  return <g data-windsor-pose-guides="true" pointerEvents="none" fontSize="2.3" fill="none" strokeWidth=".5">
    <path d={chairSeatPath(14.2)} stroke="#7b5525" strokeDasharray="1 1" />
    {pose.hips.map((hip, i) => {
      const knee = pose.knees[i];
      return <g key={i} stroke={i === 0 ? '#1d6860' : '#6c3f88'}>
        <path d={`M${pose.shoulders[i].x},${pose.shoulders[i].y} L${hip.x},${hip.y} L${knee.x},${knee.y}`} />
        {[hip, knee].map((p, j) => <circle key={j} cx={p.x} cy={p.y} r=".65" />)}
      </g>;
    })}
    <g stroke="none" fill="#234f49">
      <text x="7.6" y="10">坐面</text><text x="-23" y="5">收腿 / 袍内</text>
    </g>
  </g>;
}
