import React from 'react';

// Authoring-only SVG assets. Nothing in src imports these studies.
// Leaf height is independent of the flat ground plane. Each clump has four filled
// compound paths: silhouette, overlapping leaves, lit folds and a broken root edge.
type Kind = 'soft' | 'wild' | 'flower';
type Shape = 'low' | 'reed' | 'bent';
const colors = { ground: '#78933f', root: '#4c6d3d', leaf: '#71934b', light: '#a1b762', mid: '#829e50' };

const shapes: Record<Shape, readonly string[]> = {
  low: [
    'M-39,4 C-34,0 -39,-7 -43,-8 Q-47,-10 -43,-12 C-33,-15 -23,-7 -21,-1 C-24,-8 -26,-16 -32,-18 Q-36,-22 -31,-22 C-20,-22 -13,-12 -11,-4 C-13,-14 -8,-22 -2,-24 Q4,-27 2,-22 C-2,-16 -3,-8 1,-3 C6,-14 13,-18 20,-16 Q24,-15 20,-13 C13,-10 12,-5 12,-1 C21,-9 30,-11 37,-7 Q41,-4 36,-5 C28,-5 25,0 24,2 C32,-3 38,-2 43,1 C34,1 30,6 22,6 Q18,5 15,6 Q10,9 6,8 Q1,6 -3,7 Q-9,9 -14,6 Q-20,5 -24,6 Q-31,7 -39,4 Z',
    'M-27,4 C-24,-3 -28,-14 -32,-18 C-23,-13 -18,-4 -17,4 Z M-12,5 C-15,-6 -10,-20 -2,-24 Q2,-25 0,-21 C-5,-14 -5,-3 -3,5 Z M2,6 C3,-3 12,-16 20,-16 C11,-9 11,0 10,6 Z M17,6 C22,-2 29,-7 37,-7 C29,-4 27,1 25,5 Z',
    'M-28,-15 C-22,-11 -19,-5 -18,0 C-20,-6 -25,-10 -28,-15 Z M-4,-19 C-8,-8 -6,-1 -5,3 L-9,1 C-11,-6 -8,-14 -4,-19 Z M11,-7 C8,-1 8,2 8,4 L4,4 C5,0 7,-4 11,-7 Z',
    'M-34,4 Q-26,1 -21,4 Q-16,1 -11,5 Q-7,7 -3,4 Q1,5 4,6 Q9,3 12,4 Q16,6 21,4 L27,3 L32,4 Q27,7 22,6 Q18,5 15,6 Q10,9 6,8 Q1,6 -3,7 Q-9,9 -14,6 Q-20,5 -24,6 Q-31,7 -34,4 Z',
  ],
  reed: [
    'M-25,4 C-25,-7 -34,-19 -38,-22 C-22,-18 -18,-7 -16,-2 C-21,-19 -20,-36 -12,-43 C-17,-26 -10,-13 -7,-5 C-9,-29 2,-46 17,-49 C5,-42 0,-23 1,-9 C8,-28 22,-37 35,-35 C21,-29 16,-17 14,-7 C22,-20 34,-23 43,-20 C30,-16 26,-5 23,2 C31,-2 38,-2 43,1 C34,2 29,7 22,8 L13,6 L5,9 L-4,7 L-14,8 Z',
    'M-16,6 C-14,-4 -22,-25 -12,-43 C-16,-23 -8,-12 -6,6 Z M-6,6 C-6,-17 -2,-37 17,-49 C4,-36 2,-19 4,6 Z M6,7 C8,-15 18,-33 35,-35 C21,-27 18,-12 14,7 Z M19,6 C24,-12 31,-18 43,-20 C30,-10 30,-3 26,5 Z',
    'M6,-35 C1,-20 0,-9 1,1 L-2,5 C-3,-9 0,-27 6,-35 Z M23,-27 C17,-16 15,-6 15,0 L11,4 C12,-11 17,-23 23,-27 Z M-14,-27 C-13,-15 -8,-9 -7,-3 L-10,-1 C-15,-12 -16,-21 -14,-27 Z',
    'M-25,4 Q-21,0 -17,3 L-12,2 L-6,6 L1,3 L7,7 L13,3 L20,5 L28,2 L34,3 L22,8 L13,6 L5,9 L-4,7 L-14,8 Z',
  ],
  bent: [
    'M-31,5 C-30,-5 -34,-16 -41,-22 C-27,-18 -23,-8 -21,-3 C-23,-25 -14,-42 2,-47 C-11,-35 -12,-19 -9,-7 C-8,-33 4,-57 26,-60 C10,-51 5,-28 6,-12 C17,-37 35,-45 49,-40 C29,-36 23,-23 20,-10 C30,-20 42,-23 53,-19 C39,-18 33,-11 29,-3 C36,-7 45,-6 51,-2 C40,-3 35,4 29,7 L20,5 L10,9 L0,7 L-12,9 L-21,6 Z',
    'M-22,6 C-23,-17 -16,-38 2,-47 C-11,-33 -12,-14 -9,5 Z M-7,7 C-9,-23 3,-53 26,-60 C9,-46 3,-20 3,6 Z M5,7 C13,-19 25,-43 49,-40 C29,-33 23,-12 18,7 Z M23,6 C28,-10 39,-21 53,-19 C39,-14 35,-4 31,5 Z',
    'M10,-44 C1,-25 0,-9 1,1 L-3,5 C-4,-14 1,-33 10,-44 Z M32,-33 C21,-19 19,-8 17,-2 L12,3 C16,-13 21,-28 32,-33 Z M-13,-28 C-16,-18 -15,-7 -13,-1 L-16,3 C-19,-9 -18,-19 -13,-28 Z',
    'M-31,5 L-24,2 L-18,4 L-12,3 L-6,6 L2,3 L9,7 L16,3 L23,5 L31,2 L38,2 L29,7 L20,5 L10,9 L0,7 L-12,9 L-21,6 Z',
  ],
};

function Clump({ shape, x, y, scale = 1, flip = false }: { shape: Shape; x: number; y: number; scale?: number; flip?: boolean }) {
  return <g data-clump={shape} transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
    {shapes[shape].map((d, i) => <path key={i} d={d} data-part={i === 0 ? 'body' : 'detail'}
      fill={[colors.root, colors.leaf, colors.light, colors.root][i]} opacity={i === 2 ? .7 : 1} />)}
  </g>;
}

function Flowers() {
  return <g data-part="flowers">
    {/* Stems originate within the bent clump, rather than floating over a color patch. */}
    <path d="M4,1 C7,-22 15,-42 28,-54 M20,4 C22,-15 35,-29 45,-34 M-5,1 C-5,-17 -10,-28 -6,-38"
      fill="none" stroke="#496840" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9,-16 C14,-26 21,-28 25,-27 C20,-20 15,-17 9,-16 Z M22,-9 C16,-18 16,-23 17,-26 C23,-21 26,-15 22,-9 Z M-7,-18 C-15,-21 -17,-27 -17,-30 C-10,-28 -7,-23 -7,-18 Z" fill={colors.mid} />
    {[{ x: 28, y: -54, s: 1 }, { x: 45, y: -34, s: .76 }, { x: -6, y: -38, s: .65 }].map(({ x, y, s }) =>
      <g key={x} transform={`translate(${x} ${y}) rotate(-12) scale(${s})`}>
        <path d="M-1,-1 C-7,-8 1,-10 2,-3 C6,-9 11,-3 4,0 C12,1 8,7 3,3 C2,10 -4,8 -2,3 C-10,6 -11,-1 -4,-1 C-9,-5 -4,-8 -1,-1 Z" fill="#e5dfb2" />
        <path d="M-2,-1 Q0,-3 3,-1 Q4,2 1,3 Q-3,3 -2,-1 Z" fill="#c9a24e" />
      </g>)}
  </g>;
}

export function GrassComposition({ kind }: { kind: Kind }) {
  return <g data-vegetation={kind} pointerEvents="none">
    {kind === 'soft' && <>
      <Clump shape="low" x={-48} y={-11} scale={.72} flip />
      <Clump shape="low" x={-6} y={0} scale={1.1} />
      <Clump shape="reed" x={32} y={-1} scale={.38} flip />
      <Clump shape="low" x={58} y={13} scale={.58} />
    </>}
    {kind === 'wild' && <>
      <Clump shape="reed" x={-47} y={-12} scale={.65} flip />
      <Clump shape="bent" x={-12} y={0} scale={.88} />
      <Clump shape="reed" x={35} y={7} scale={.7} />
      <Clump shape="low" x={-30} y={11} scale={.66} />
    </>}
    {kind === 'flower' && <>
      <Clump shape="reed" x={-43} y={-10} scale={.58} />
      <Clump shape="bent" x={-5} y={0} scale={.7} />
      <Flowers />
      <Clump shape="low" x={-19} y={9} scale={.85} flip />
      <Clump shape="low" x={55} y={12} scale={.48} />
    </>}
  </g>;
}

export const studies = [
  { kind: 'soft' as const, name: '低矮柔软', description: '短叶向外舒展，宽而低，留出几处透气的缺口。' },
  { kind: 'wild' as const, name: '自然野草', description: '长叶弯向一侧，短草托住基部，高低错落。' },
  { kind: 'flower' as const, name: '疏花风草', description: '三枝小花从草簇内部长出，植株向右舒展。' },
];

export function StudySvg({ kind, overview = false }: { kind: Kind; overview?: boolean }) {
  const width = overview ? 300 : 520;
  const height = overview ? 180 : 200;
  return <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`}
    role="img" aria-label={`${studies.find(s => s.kind === kind)!.name}，${overview ? '世界总览缩放 0.66' : '放大细节'}，平整草地样板`}>
    <rect data-ground="flat" width={width} height={height} fill={colors.ground} />
    <g transform={overview ? 'translate(145 113) scale(0.66)' : 'translate(245 141) scale(2.1)'}>
      <GrassComposition kind={kind} />
    </g>
  </svg>;
}
