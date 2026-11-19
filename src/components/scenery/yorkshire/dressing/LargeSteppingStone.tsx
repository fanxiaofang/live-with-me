import { rotateGroundPoint } from '../../../../world/scene/placementMath';
import type { PavingView } from '../../../../features/yard-editor/yardLayout';

type StoneStudy = {
  top: string; shoulder: string; facet: string; vein: string; contact: string;
};

// Four independently drawn families. These are finished scene-space studies,
// not rotations, mirrors, or aspect-ratio fits of a common stone.
const STUDIES = {
  crosswise: [
    {
      top: 'M-31,-3 Q-32,-8 -25,-15 L-17,-19 Q-12,-21 -5,-18 L26,-9 Q32,-7 33,-1 L31,9 Q29,13 22,16 L8,20 Q3,21 -5,17 L-28,7 Q-33,5 -31,-3Z',
      shoulder: 'M-29,-5 Q-29,-9 -23,-14 L-16,-17 Q-12,-19 -5,-16 L24,-8 L8,-10 -11,-15 -21,-12Z',
      facet: 'M-23,6 L-3,14 Q6,19 12,16 L26,11 Q28,10 29,7 L29,10 21,15 8,18 -4,15Z',
      vein: 'M-18,-4 Q-11,-6 -4,-2 M10,8 L17,7',
      contact: 'M-25,8 Q-9,16 6,21 Q14,22 27,15',
    },
    {
      top: 'M-32,-4 L-27,-13 Q-24,-17 -17,-18 L-8,-17 14,-12 29,-6 Q34,-3 32,4 L28,13 Q25,17 15,19 L4,20 -24,10 Q-32,7 -32,-4Z',
      shoulder: 'M-29,-6 L-25,-12 Q-22,-15 -17,-15 L-7,-14 17,-9 L-1,-11 -17,-12 -25,-8Z',
      facet: 'M-23,7 L4,16 Q13,19 23,14 L27,10 26,14 15,17 5,18Z',
      vein: 'M-15,-3 L-8,-1 -3,-2 M9,9 L15,10',
      contact: 'M-26,10 L3,21 Q16,24 27,17',
    },
    {
      top: 'M-30,-6 Q-30,-12 -22,-17 L-12,-20 3,-16 26,-10 Q33,-8 33,-2 L30,10 Q27,14 18,17 L8,21 -5,18 -26,8 Q-33,4 -30,-6Z',
      shoulder: 'M-28,-6 Q-27,-11 -20,-15 L-12,-17 4,-13 22,-9 L3,-11 -13,-14 -23,-10Z',
      facet: 'M-24,7 L-3,15 8,18 18,15 28,9 L28,12 18,16 8,19 -5,16Z',
      vein: 'M-13,-6 Q-8,-6 -2,-2 M10,9 L17,8',
      contact: 'M-26,9 L-5,19 Q9,25 23,18',
    },
  ],
  diagonal: [
    {
      top: 'M-32,1 Q-34,-4 -27,-9 L-13,-16 13,-20 Q20,-20 25,-15 L31,-6 Q34,-1 30,7 L23,14 -3,20 Q-11,21 -18,17 L-29,10Z',
      shoulder: 'M-29,-1 L-24,-7 -12,-13 13,-17 Q18,-17 22,-14 L10,-14 -10,-10 -22,-5Z',
      facet: 'M-22,12 Q-11,19 -4,17 L22,11 28,5 27,9 21,13 -3,18 Q-12,20 -22,14Z',
      vein: 'M-14,5 Q-5,0 1,0 M13,-8 L20,-9',
      contact: 'M-25,13 Q-11,24 0,22 L23,16',
    },
    {
      top: 'M-31,0 L-22,-11 -3,-17 19,-19 Q25,-18 28,-11 L32,-2 28,9 17,17 -10,21 Q-18,20 -25,14 L-32,7Z',
      shoulder: 'M-28,-1 L-20,-9 -2,-14 18,-16 24,-12 L7,-12 -12,-7 -23,-3Z',
      facet: 'M-23,12 L-11,18 16,14 27,7 L25,11 17,16 -10,19 -21,16Z',
      vein: 'M-15,6 L-8,2 -1,3 M11,-7 L18,-8',
      contact: 'M-27,14 Q-17,24 -7,23 L18,19',
    },
    {
      top: 'M-33,2 Q-32,-6 -23,-11 L-5,-18 17,-20 Q24,-20 28,-12 L31,-3 Q33,4 27,11 L18,16 -6,21 -20,17 Q-30,13 -33,7Z',
      shoulder: 'M-29,0 Q-28,-5 -21,-8 L-4,-15 17,-17 23,-13 L9,-13 -8,-9 -23,-3Z',
      facet: 'M-24,13 L-7,18 17,13 28,7 25,12 18,15 -6,19 -20,16Z',
      vein: 'M-15,7 Q-6,3 0,4 M11,-8 L17,-10',
      contact: 'M-27,14 Q-15,24 -5,23 L20,18',
    },
  ],
  lengthwise: [
    {
      top: 'M-28,-3 Q-29,-9 -22,-14 L-9,-21 Q-3,-23 5,-20 L22,-14 Q27,-12 29,-4 L28,8 19,17 3,21 Q-3,23 -12,19 L-25,12 Q-29,9 -28,-3Z',
      shoulder: 'M-25,-4 Q-25,-8 -19,-12 L-8,-18 Q-3,-20 4,-17 L17,-13 -1,-14 -12,-12 -21,-7Z',
      facet: 'M-23,10 L-10,16 3,18 17,14 25,7 L24,11 18,16 3,20 -11,18 -23,12Z',
      vein: 'M-6,-8 L-9,-2 -6,2 M9,9 L13,6',
      contact: 'M-24,14 L-11,22 Q2,27 17,21',
    },
    {
      top: 'M-27,-7 L-18,-17 -2,-22 13,-18 Q21,-16 25,-10 L29,0 26,12 15,20 -1,22 -18,17 -27,8 Q-30,2 -27,-7Z',
      shoulder: 'M-24,-6 L-16,-14 -2,-19 12,-15 19,-11 L3,-14 -8,-13 -19,-8Z',
      facet: 'M-24,8 L-16,14 -1,19 13,17 24,10 L23,14 14,19 -1,20 -17,16Z',
      vein: 'M-5,-9 L-2,-3 -4,2 M9,10 L14,8',
      contact: 'M-24,12 Q-11,25 1,25 L17,22',
    },
    {
      top: 'M-29,-3 L-23,-13 -10,-20 Q-2,-24 5,-21 L21,-15 27,-7 Q31,0 27,9 L17,18 2,23 -12,20 -24,13 Q-30,7 -29,-3Z',
      shoulder: 'M-26,-4 L-20,-11 -9,-17 Q-2,-20 4,-18 L17,-14 -1,-15 -12,-12 -22,-7Z',
      facet: 'M-25,11 L-10,17 2,20 15,16 25,8 L24,12 17,17 2,21 -12,18Z',
      vein: 'M-7,-8 Q-4,-3 -7,3 M8,11 L13,7',
      contact: 'M-24,14 L-12,23 Q3,28 18,21',
    },
  ],
  eastwest: [
    {
      top: 'M-34,-5 Q-34,-11 -26,-15 L-13,-18 14,-17 29,-12 Q34,-10 35,-3 L32,10 Q30,15 22,18 L-5,21 -25,16 Q-32,14 -34,7Z',
      shoulder: 'M-31,-5 Q-31,-9 -24,-12 L-12,-15 13,-14 26,-10 L8,-11 -12,-12 -25,-9Z',
      facet: 'M-29,11 L-23,14 -4,18 20,15 30,10 L28,14 21,17 -5,19 -25,15Z',
      vein: 'M-22,-2 Q-13,-4 -5,-1 M9,8 L19,7',
      contact: 'M-29,15 L-7,23 Q11,25 28,19',
    },
    {
      top: 'M-33,-7 L-24,-15 -5,-19 18,-16 31,-10 Q35,-7 33,1 L30,12 19,19 -8,20 -27,14 Q-34,11 -33,-7Z',
      shoulder: 'M-30,-6 L-22,-12 -5,-16 17,-13 27,-9 L9,-11 -8,-12 -24,-8Z',
      facet: 'M-29,10 L-24,12 -7,17 17,16 28,10 L26,14 18,17 -8,18 -25,13Z',
      vein: 'M-19,-2 L-12,-4 -5,-2 M8,7 L16,8',
      contact: 'M-28,14 Q-7,25 11,23 L25,20',
    },
    {
      top: 'M-35,-3 Q-34,-10 -26,-14 L-8,-18 15,-17 30,-11 34,-1 Q35,7 29,13 L18,19 -8,21 -27,15 Q-35,12 -35,-3Z',
      shoulder: 'M-31,-4 Q-30,-8 -24,-11 L-7,-15 14,-14 27,-10 L8,-11 -9,-12 -25,-8Z',
      facet: 'M-30,10 L-25,13 -7,18 17,16 29,10 L26,14 18,17 -8,19 -27,14Z',
      vein: 'M-22,-1 Q-13,-5 -4,-2 M9,8 L17,7',
      contact: 'M-30,15 Q-9,26 10,24 L27,19',
    },
  ],
} as const satisfies Record<PavingView, readonly StoneStudy[]>;

// Use the older flagstones' broken lit edges and sparse mineral fragments,
// rather than a continuous pale rim around a smooth gray-green surface.
const EDGE_GLINTS: Record<PavingView, string> = {
  crosswise: 'M-23,-12 L-17,-15 -11,-13 M15,-7 L22,-5',
  diagonal: 'M-23,-5 L-14,-10 -9,-10 M9,-15 L17,-15',
  lengthwise: 'M-20,-9 L-9,-15 -3,-15 M15,-10 L21,-7',
  eastwest: 'M-25,-9 L-14,-12 -6,-12 M12,-12 L23,-9',
};
const MINERAL_FLECKS = [
  'M-14,-4 L-9,-6 -5,-4 -9,-2Z M8,6 L12,4 16,6 12,8Z',
  'M-15,2 L-11,0 -7,2 -10,4Z M7,-5 L11,-7 15,-5 11,-3Z',
  'M-12,-5 L-7,-7 -3,-5 -7,-3Z M9,6 L13,5 16,7 12,9Z',
] as const;

// Preserve the existing fine-turn control without rotating the slab's height.
function turnPath(path: string, angle: number) {
  if (!angle) return path;
  return path.replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, x, y) => {
    const p = rotateGroundPoint({ x: Number(x), y: Number(y) }, { x: 0, y: 0 }, angle);
    return `${p.x},${p.y}`;
  });
}

export function LargeSteppingStone({ index, thickness = 2.8, angle = 0, view = 'crosswise' }: { index: number; thickness?: number; angle?: number; view?: PavingView }) {
  const family = STUDIES[view];
  const variant = (index - 1) % family.length;
  const stone = family[variant];
  const path = (d: string) => turnPath(d, angle);
  return <g data-large-stepping-stone="" data-stone-variant={variant} data-stone-view={view} data-stone-heading={angle} strokeLinejoin="round" strokeLinecap="round">
    <path d={path(stone.contact)} transform={`translate(0 ${thickness + .8})`} fill="none" stroke="#2d3826" strokeWidth="2.5" opacity=".17" />
    <path d={path(stone.top)} transform={`translate(0 ${thickness})`} fill="#7b6d54" stroke="#685c48" strokeWidth=".7" />
    <path data-stone-top="" d={path(stone.top)} fill={variant===1 ? '#a69b82' : '#ada084'} stroke="#73654f" strokeWidth=".65" />
    <path d={path(stone.shoulder)} fill="#c6b58e" opacity=".4" />
    <path d={path(stone.facet)} fill="#988869" opacity=".48" />
    <path d={path(MINERAL_FLECKS[variant])} fill="#c7b58c" opacity=".35" />
    <path d={path(EDGE_GLINTS[view])} fill="none" stroke="#cbbd97" strokeWidth=".85" opacity=".8" />
    <path d={path(stone.vein)} fill="none" stroke="#cfbf97" strokeWidth=".7" opacity=".55" />
    <path d={path(variant===1 ? 'M-4,6 L-2,5 M15,1 L17,0' : 'M-2,-3 L0,-4 M16,3 L18,2')} fill="none" stroke="#78694f" strokeWidth=".65" opacity=".6" />
  </g>;
}
