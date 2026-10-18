import { useId } from 'react';
import type { Person } from '../../types';
import { FinalizedNwStandingCharacter } from '../characters/FinalizedNwStandingCharacter';
import { FINALIZED_NW_STANDING as standing } from '../characters/finalizedNwStandingAssets';
import { WindsorSeatedHead } from './WindsorSeatedHead';
import { RoundCharacterHand } from '../characters/RoundCharacterHand';

type Point = { x: number; y: number };
const add = (a: Point, b: Point, k = 1): Point => ({ x: a.x + b.x * k, y: a.y + b.y * k });
const unit = (a: Point, b: Point): Point => {
  const d = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  return { x: (b.x - a.x) / d, y: (b.y - a.y) / d };
};
const xy = (p: Point) => `${p.x.toFixed(3)},${p.y.toFixed(3)}`;

export function sofaDeskHandTargets(keyboardAnchor: Point, working: boolean) {
  const shoulders = [{ x: -1.5, y: -11.5 }, { x: 7, y: -12.2 }];
  const targets = [{ x: keyboardAnchor.x - 10.8, y: keyboardAnchor.y + .8 },
    { x: keyboardAnchor.x - 2, y: keyboardAnchor.y - 2.3 }];
  const reachable = working && targets.every((p, i) => {
    const d = Math.hypot(p.x - shoulders[i].x, p.y - shoulders[i].y);
    return d >= 5 && d <= (i === 0 ? 14 : 13);
  });
  const hands = reachable ? targets : [{ x: -7.7, y: .65 }, { x: 5.6, y: -5.4 }];
  const elbows = shoulders.map((shoulder, i) => {
    const hand = hands[i], upper = i === 0 ? 6.8 : 6.1, fore = i === 0 ? 7.6 : 7.3;
    const d = Math.hypot(hand.x - shoulder.x, hand.y - shoulder.y);
    const along = Math.max(0, Math.min(upper, (upper * upper - fore * fore + d * d) / (2 * d)));
    const bend = Math.sqrt(Math.max(0, upper * upper - along * along));
    const t = unit(shoulder, hand);
    // Choose the downward bend, never the solution that folds into the chest.
    return add(add(shoulder, t, along), { x: t.y, y: -t.x }, bend);
  });
  return { shoulders, elbows, hands, mode: reachable ? 'desk' : 'armrest' };
}

/** Filled sleeve: shoulder, upper arm, rounded elbow, tapered forearm and cuff. */
function sleevePath(shoulder: Point, elbow: Point, hand: Point) {
  const a = unit(shoulder, elbow), b = unit(elbow, hand);
  const na = { x: -a.y, y: a.x }, nb = { x: -b.y, y: b.x };
  const wrist = add(hand, b, -1.05);
  const r0 = 2.15, r1 = 1.8, r2 = 1.25;
  // Trim the inner offset edges at their intersection. Taking both edges all
  // the way to the elbow creates the small self-crossing loop seen in v1.
  const joinScale = r1 / Math.max(.25, 1 + na.x * nb.x + na.y * nb.y);
  const innerJoin = add(elbow, { x: na.x + nb.x, y: na.y + nb.y }, joinScale);
  const innerEntry = add(innerJoin, a, -.55), innerExit = add(innerJoin, b, .55);
  const upperOutside = add(elbow, na, -r1), foreOutside = add(elbow, nb, -r1);
  return {
    d: `M${xy(add(shoulder, na, r0))}
      C${xy(add(add(shoulder, a, 2.5), na, r0))} ${xy(add(innerEntry, a, -.9))} ${xy(innerEntry)}
      Q${xy(innerJoin)} ${xy(innerExit)} L${xy(add(wrist, nb, r2))}
      L${xy(add(wrist, nb, -r2))} L${xy(foreOutside)}
      Q${xy(add(add(elbow, na, -r1), nb, -r1))} ${xy(upperOutside)}
      C${xy(add(upperOutside, a, -1.2))} ${xy(add(add(shoulder, a, 2.5), na, -r0))} ${xy(add(shoulder, na, -r0))}
      Q${xy(add(shoulder, a, -2.5))} ${xy(add(shoulder, na, r0))} Z`,
    cuff: `M${xy(add(wrist, nb, r2))} L${xy(add(wrist, nb, -r2))}`,
  };
}

/** Keep the approved standing head and central torso; exclude hanging sleeves. */
export function SofaDeskCharacter({ occupant, keyboardAnchor, part }: {
  occupant: Person; keyboardAnchor: Point; part: 'body' | 'far-arm' | 'near-arm';
}) {
  const clip = `sofa-upper-${useId().replace(/[^\w-]/g, '')}`;
  const working = ['coding', 'study', 'writing'].includes(occupant.currentState);
  const { shoulders, elbows, hands, mode } = sofaDeskHandTargets(keyboardAnchor, working);
  if (part === 'body') return <g data-sofa-upper-body data-person-id={occupant.id} data-facing="NW"
    data-upper-body-source="approved-standing-nw" data-standing-offset-y="18">
    <defs><clipPath id={clip}>
      <path d="M-.7,-13.2 Q3,-14.1 6.8,-13.3 Q8,-9.5 8.1,-4 L8.3,4 H-.5 L-.2,-8 Q-.3,-11 -.7,-13.2 Z" />
    </clipPath></defs>
    <g clipPath={`url(#${clip})`} data-sofa-torso-crop>
      <g transform="translate(3,18)"><FinalizedNwStandingCharacter {...occupant} /></g>
    </g>
    <WindsorSeatedHead person={occupant} headphones={false}
      cx={3 + standing.origin.x + 545 * standing.scale} cy={18 + standing.origin.y + 390 * standing.scale} />
  </g>;
  const i = part === 'near-arm' ? 0 : 1;
  const sleeve = sleevePath(shoulders[i], elbows[i], hands[i]);
  return <g data-sofa-arms data-person-id={occupant.id} data-hand-mode={mode}>
    <g data-sofa-arm={i === 0 ? 'near' : 'far'} data-elbow-x={elbows[i].x} data-elbow-y={elbows[i].y}>
      <RoundCharacterHand cx={hands[i].x} cy={hands[i].y} rx={1.65} ry={1.25} skinColor={occupant.skinColor ?? '#f5d6be'} />
      <path data-sofa-sleeve d={sleeve.d} fill={occupant.shirtColor} stroke="#39281f" strokeOpacity=".2" strokeWidth=".35" strokeLinejoin="round" />
      <path d={sleeve.cuff} fill="none" stroke="#39281f" strokeOpacity=".25" strokeWidth=".35" strokeLinecap="round" />
    </g>
  </g>;
}
