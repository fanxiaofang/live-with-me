import type { Person } from '../../types';
import { CharacterHead } from '../CharacterAvatar';
import { CHARACTER_WORLD_SIZE } from '../characters/characterProportions';
import { RoundCharacterHand } from '../characters/RoundCharacterHand';
import { DeskHeadphones } from './DeskHeadphones';
import { DESK_CHAIR_MEASUREMENTS as dimensions } from './chairGeometry';

type Point = { x: number; y: number };
export const DESK_SEATED_ANCHORS = {
  seatY: dimensions.floorY - dimensions.seatTop,
  headX: -1.1,
  headAboveSeat: 18,
} as const;

/** Targets must be reachable from both shoulders, otherwise both hands rest on the lap. */
export function deskHandTargets(keyboard: Point, working: boolean) {
  const seatY = DESK_SEATED_ANCHORS.seatY;
  const shoulders = [{ x: -6, y: seatY - 9 }, { x: 5, y: seatY - 10 }];
  const targets = [{ x: keyboard.x - 6, y: keyboard.y - 2 }, { x: keyboard.x + 4, y: keyboard.y - 3.5 }];
  const reachable = working && targets.every((hand, index) =>
    Math.hypot(hand.x - shoulders[index].x, hand.y - shoulders[index].y) <= 12.5);
  return { mode: reachable ? 'keyboard' : 'lap', shoulders,
    hands: reachable ? targets : [{ x: -4, y: seatY - 0.6 }, { x: 4, y: seatY - 1.3 }] };
}

/** The long robe bends over the seat and knees, then covers the feet. */
export function DeskSeatedCharacter({ occupant, keyboardAnchor, secondary = false }: {
  occupant: Person; keyboardAnchor: Point; secondary?: boolean;
}) {
  const shirt = occupant.shirtColor;
  const skin = occupant.skinColor ?? '#fad4c0';
  const { seatY, headX, headAboveSeat } = DESK_SEATED_ANCHORS;
  const headY = seatY - headAboveSeat;
  const working = ['coding', 'study', 'writing'].includes(occupant.currentState);
  const headphones = working || occupant.currentState === 'listening_music';
  const { shoulders, hands, mode } = deskHandTargets(keyboardAnchor, working);
  const suffix = secondary ? '-secondary' : '';
  return <g id={`seated-character-body${suffix}`} data-scene-character="chair-seated"
    data-person-id={occupant.id} data-seat-contact-y={seatY} data-head-center-y={headY} data-hand-mode={mode}>
    <ellipse cx="-10" cy="20" rx="6.5" ry="1.35" fill="#24170e" opacity="0.12" />
    <ellipse cx="0" cy={seatY + 0.9} rx="6.3" ry="1.5" fill="#24170e" opacity="0.15" />
    <path data-desk-robe="true" d={`M-1.1,${seatY - 11}
      C-5.7,${seatY - 11} -7.4,${seatY - 8.4} -7.2,${seatY - 5}
      Q-7.1,${seatY - 1.2} -5.6,${seatY + 0.6}
      C-6.4,${seatY + 2.2} -9.8,${seatY + 4.6} -11.4,${seatY + 5.2}
      C-13.3,${seatY + 6} -14.8,15.7 -15,18.9
      Q-12,21 -6.5,20.2 C-5.7,16.8 -4.6,13.1 -1.2,11.2
      Q3.7,9.6 6.7,8.2 C8.5,6 8.1,${seatY - 4.8} 6.1,${seatY - 8.6}
      Q3.7,${seatY - 11} -1.1,${seatY - 11} Z`}
      fill={shirt} stroke="#1b120a" strokeOpacity="0.12" strokeWidth="0.4" strokeLinejoin="round" />
    <path d={`M4.8,${seatY - 8.8} Q7.7,${seatY - 5} 6.7,8.2 Q4.2,9.6 1.1,10.6
      Q4.8,${seatY + 0.4} 4.8,${seatY - 8.8} Z`} fill="#1b120a" opacity="0.06" />
    <path d={`M-4.9,${seatY + 0.6} Q-1.7,${seatY + 2.3} 3.8,${seatY + 0.6}
      M-10.7,12.5 Q-12.6,15.4 -12.8,18.4 M-7.1,13.4 Q-7.5,16.8 -8.3,19.5`}
      fill="none" stroke="#1b120a" strokeOpacity="0.13" strokeWidth="0.55" strokeLinecap="round" />
    <path d={`M-3.7,${seatY - 9.2} Q-1.1,${seatY - 8.5} 1.5,${seatY - 9.2}
      M-1.1,${seatY - 7.8} V${seatY - 3.9}`}
      fill="none" stroke="#1b120a" strokeOpacity="0.13" strokeWidth="0.5" strokeLinecap="round" />
    <g id={`desk-typing-arms${suffix}`} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {hands.map((hand, index) => {
        const shoulder = shoulders[index];
        const elbow = { x: shoulder.x + (index === 0 ? -2 : 1.5),
          y: (shoulder.y + hand.y) / 2 + (mode === 'keyboard' ? 2.5 : 0.7) };
        const path = `M${shoulder.x},${shoulder.y} Q${elbow.x},${elbow.y} ${hand.x},${hand.y}`;
        return <g key={index}>
          <path d={path} stroke="#1b120a" strokeOpacity="0.12" strokeWidth="3.8" />
          <path d={path} stroke={shirt} strokeWidth="3.2" />
        </g>;
      })}
    </g>
    {hands.map((hand, index) => <g key={index} id={`volumetric-${index === 0 ? 'left' : 'right'}-hand${suffix}`}>
      <ellipse cx={hand.x} cy={hand.y + 0.8} rx="1.65" ry="0.5" fill="#1c2021" opacity="0.08" />
      <RoundCharacterHand cx={hand.x} cy={hand.y} rx={1.65} ry={1.45} skinColor={skin} />
    </g>)}
    {headphones && <DeskHeadphones cx={headX} cy={headY} part="band" />}
    <CharacterHead cx={headX} cy={headY} r={CHARACTER_WORLD_SIZE.headRadius} skinColor={skin}
      hairColor={occupant.hairColor} hairStyle={occupant.hairStyle}
      beanieColor={occupant.beanieColor} hasPompom={occupant.hasPompom ?? true} facing="back" />
    {headphones && <DeskHeadphones cx={headX} cy={headY} part="cups" />}
  </g>;
}
