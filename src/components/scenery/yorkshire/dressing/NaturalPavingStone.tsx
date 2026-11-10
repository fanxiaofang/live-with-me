export type NaturalStoneKind = 'rawGranite' | 'riverRock' | 'splitSlate';

const PALETTES = {
  rawGranite: { top: '#b6af96', shoulder: '#c9c1a7', facet: '#a19b83', side: '#817b66', edge: '#706d59' },
  riverRock: { top: '#a5ac8b', shoulder: '#bec2a1', facet: '#8c9979', side: '#717f63', edge: '#637057' },
  splitSlate: { top: '#a8aa95', shoulder: '#c0c1aa', facet: '#929b84', side: '#737e69', edge: '#64705d' },
};

// Worn decorative stones: lopsided oval silhouettes and quiet domed surfaces.
const SHAPES = {
  rawGranite: [
    'M-17,0 C-18,-4 -11,-8 -4,-8 C3,-9 12,-6 16,-2 C20,3 13,7 5,8 C-3,10 -12,7 -16,4 Q-18,2 -17,0Z',
    'M-16,-2 C-13,-7 -7,-8 0,-7 C7,-8 15,-4 17,0 C19,5 11,8 4,8 C-4,9 -13,6 -16,3 Q-18,0 -16,-2Z',
    'M-18,1 C-19,-3 -13,-7 -6,-7 C0,-9 7,-7 12,-4 C18,-2 19,3 14,6 C8,10 0,8 -5,8 C-12,8 -17,5 -18,1Z',
  ],
  riverRock: [
    'M-15,0 C-17,-4 -10,-9 -3,-9 C5,-10 13,-5 15,-1 C18,4 12,8 4,9 C-3,11 -11,7 -14,4 Q-16,2 -15,0Z',
    'M-15,-2 C-12,-8 -4,-9 3,-7 C9,-6 16,-2 16,2 C15,7 8,10 1,9 C-6,10 -13,6 -15,3 Q-17,0 -15,-2Z',
    'M-16,0 C-16,-5 -9,-8 -2,-8 C6,-9 13,-4 15,0 C17,5 10,9 3,8 C-5,10 -12,7 -15,4 Q-17,2 -16,0Z',
  ],
  splitSlate: [
    'M-21,0 C-21,-3 -13,-6 -5,-6 C4,-7 15,-5 20,-2 C25,2 16,5 8,6 C0,8 -12,6 -18,4 Q-22,2 -21,0Z',
    'M-20,-1 C-18,-5 -9,-7 -1,-6 C8,-7 17,-3 20,0 C23,4 13,6 4,6 C-5,7 -15,5 -19,3 Q-22,1 -20,-1Z',
    'M-22,1 C-22,-3 -13,-5 -5,-6 C3,-8 12,-5 18,-2 C23,0 22,4 15,5 C7,7 -2,6 -9,6 C-16,5 -21,4 -22,1Z',
  ],
};

export function NaturalPavingStone({ kind, index, thickness = 2 }: { kind: NaturalStoneKind; index: number; thickness?: number }) {
  const p = PALETTES[kind];
  const variant = (index - 1) % 3;
  const outline = SHAPES[kind][variant];
  const flat = kind === 'splitSlate';
  return <g data-natural-stone={kind} data-stone-variant={variant} strokeLinejoin="round" strokeLinecap="round">
    <path d={outline} transform={`translate(0 ${thickness})`} fill={p.side} stroke={p.edge} strokeWidth=".45" />
    <path d={outline} fill={p.top} stroke={p.edge} strokeWidth=".45" />
    <path d={flat
      ? 'M-17,-1 C-13,-4 -5,-5 1,-4 Q7,-5 12,-2 C5,-3 0,-1 -5,-1 Q-12,1 -17,-1Z'
      : variant === 1
        ? 'M-12,-2 C-9,-6 -3,-6 2,-5 Q7,-5 10,-2 C5,-3 0,-1 -4,-1 Q-9,1 -12,-2Z'
        : 'M-13,-1 C-11,-5 -5,-6 0,-5 Q6,-6 10,-2 C3,-3 0,0 -5,0 Q-10,1 -13,-1Z'} fill={p.shoulder} />
    <path d={flat
      ? 'M-15,3 C-6,6 4,5 12,3 Q17,2 20,0 C19,4 13,5 7,6 Q-6,8 -15,3Z'
      : 'M-10,4 C-4,7 4,6 10,3 Q14,2 16,0 C15,5 10,7 4,8 Q-5,9 -10,4Z'} fill={p.facet} opacity=".7" />
    {kind === 'rawGranite' && <path d="M-4,2 l1,.2 M7,-1 l1.2,-.2" fill="none" stroke={p.facet} strokeWidth=".65" opacity=".6" />}
  </g>;
}
