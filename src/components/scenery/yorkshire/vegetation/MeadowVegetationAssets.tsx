import React from 'react';

/** Current retained v2 asset baseline, accepted by the user on 2026-10-19.
 * Keep silhouette paths, component proportions and source colours stable.
 * Composition and scene placement are separate concerns. */
export type MeadowClusterKind = 'soft' | 'wild' | 'flower';
export type MeadowFlowerSpecies = 'daisy' | 'buttercup' | 'clover';
type Kind = MeadowClusterKind;
type Species = MeadowFlowerSpecies;

const blades = {
  short: [
    'M-29,2 C-32,-3 -39,-9 -45,-7 C-36,-9 -29,-1 -27,3 Z M-19,1 C-19,-9 -24,-17 -29,-16 C-22,-18 -15,-8 -15,2 Z M1,3 C0,-5 5,-15 11,-15 C7,-11 5,-4 5,3 Z',
    'M-35,4 C-33,-4 -34,-9 -38,-12 Q-28,-9 -31,4 Z M-10,3 C-13,-4 -20,-11 -26,-9 C-17,-11 -8,-4 -6,3 Z M12,4 C17,-3 24,-7 30,-4 C24,-5 18,1 16,5 Z',
    'M-24,5 C-25,0 -23,-7 -20,-9 Q-21,-2 -20,5 Z M-4,5 C-3,-5 -5,-16 -8,-19 C-2,-16 1,-6 0,5 Z M25,6 C28,0 34,-3 41,-1 C35,-.5 31,3 29,7 Z',
  ],
  woven: [
    'M-28,2 C-28,-5 -34,-12 -40,-12 C-31,-12 -25,-3 -24,3 Z M-9,0 C-8,-9 -10,-16 -14,-19 C-7,-16 -4,-9 -5,1 Z M12,4 C15,-4 19,-14 26,-15 C21,-10 19,-3 17,4 Z',
    'M-20,4 C-18,-4 -13,-10 -7,-9 C-13,-7 -15,-1 -15,4 Z M3,3 C-1,-4 -6,-10 -13,-10 C-4,-12 3,-4 7,3 Z M30,5 C32,0 38,-5 44,-3 C39,-3 36,2 34,6 Z',
    'M-2,5 C1,-1 9,-6 14,-4 C8,-3 5,2 3,6 Z M20,5 C20,-1 18,-6 15,-8 C21,-7 24,-1 25,6 Z',
  ],
  meadow: [
    'M-9,2 C-10,-22 -8,-46 3,-62 C-5,-44 -7,-19 -6,2 Z M-19,2 C-23,-16 -32,-38 -47,-38 C-34,-41 -21,-18 -16,2 Z M16,3 C21,-19 36,-41 47,-32 C50,-28 49,-22 48,-19 C49,-29 44,-33 41,-31 C30,-24 23,-9 19,3 Z',
    'M-13,4 C-12,-14 -22,-39 -33,-47 C-19,-40 -10,-17 -10,4 Z M4,2 C5,-20 14,-48 30,-53 C15,-43 9,-19 7,3 Z M23,5 C29,-9 44,-15 53,-10 C42,-14 31,-5 26,5 Z',
    'M-22,6 C-17,-8 -7,-19 9,-20 C-6,-16 -14,-5 -19,6 Z M1,6 C-4,-8 -12,-19 -22,-17 C-10,-21 -1,-8 4,6 Z M12,7 C13,-3 9,-14 3,-18 C11,-15 16,-3 15,7 Z',
  ],
  leaning: [
    'M-18,3 C-23,-13 -35,-30 -48,-25 C-35,-33 -21,-14 -15,3 Z M1,2 C5,-15 6,-35 -3,-43 C9,-37 8,-15 4,3 Z M14,4 C22,-12 30,-26 42,-24 C32,-23 23,-10 17,5 Z',
    'M-7,4 C-8,-14 -12,-30 -23,-34 C-9,-31 -4,-13 -4,4 Z M24,7 C28,-6 39,-16 49,-12 C39,-15 31,-2 27,7 Z',
    'M-20,7 C-16,-3 -7,-10 1,-8 C-8,-8 -14,1 -17,7 Z M5,6 C2,-3 -6,-12 -15,-13 C-4,-14 4,-4 8,6 Z',
  ],
};

export function Grass({ type, x = 0, y = 0, scale = 1, flip = false }: {
  type: keyof typeof blades; x?: number; y?: number; scale?: number; flip?: boolean;
}) {
  return <g data-clump={type} transform={`translate(${x} ${y}) scale(${flip ? -scale : scale} ${scale})`}>
    {blades[type].map((d, i) => <path key={i} d={d} data-part="body" fill={['#526f3f', '#648449', '#829954'][i]} />)}
    {type === 'meadow' && <path data-part="detail" fill="#9eaf65" opacity=".5"
      d="M-7,-10 C-8,-26 -5,-46 1,-57 C-4,-43 -6,-25 -6,-10 Z M10,-16 C14,-33 21,-45 27,-49 C20,-42 14,-29 11,-16 Z" />}
  </g>;
}

// Narrow ray florets for Bellis, five rounded petals for Ranunculus.
// Deterministic export geometry, all petals combined into one path.
function petalRing(count: number, reach: number, breadth: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = i * Math.PI * 2 / count;
    const p = (x: number, y: number) => `${(x * Math.cos(angle) - y * Math.sin(angle)).toFixed(2)},${(x * Math.sin(angle) + y * Math.cos(angle)).toFixed(2)}`;
    const r = reach - (count > 5 && i % 3 === 0 ? .4 : 0);
    return `M${p(-.35, -.9)} C${p(-breadth, -r * .55)} ${p(-breadth, -r)} ${p(0, -r)} C${p(breadth, -r)} ${p(breadth, -r * .55)} ${p(.35, -.9)} Z`;
  }).join(' ');
}

function DaisyHead({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g data-part="flowers" transform={`translate(${x} ${y}) scale(${scale} ${scale * .7})`}>
    <path d={petalRing(13, 4.5, .56)} fill="#dedcc6" />
    <ellipse rx="1.55" ry="1.45" fill="#c2a34f" />
  </g>;
}

function Daisy() {
  return <g data-species="daisy">
    <path data-part="body" fill="#526f3f"
      d="M0,3 C-5,0 -14,0 -16,-4 C-18,-9 -11,-10 -7,-6 L1,1 Z M2,2 C5,-1 10,-9 14,-7 C19,-4 12,1 3,4 Z M-1,3 C-5,5 -12,7 -15,4 C-16,1 -8,-1 -1,1 Z" />
    <path data-part="body" fill="#829954"
      d="M0,2 C-2,-3 -6,-11 -2,-13 C2,-15 4,-8 2,1 Z M2,3 C8,0 18,-1 18,3 C17,7 8,5 2,4 Z M-1,4 C-5,9 -10,10 -11,7 C-11,4 -5,1 -1,2 Z" />
    <path data-part="body" fill="#648449"
      d="M0,2 Q-1,-11 -5,-21 L-4.3,-21 Q.2,-11 1,2 Z M4,3 Q10,-7 12,-15 L12.7,-15 Q11,-6 5,3 Z" />
    <DaisyHead x={-5} y={-21} /><DaisyHead x={12} y={-15} scale={.77} />
  </g>;
}

function ButtercupHead({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g data-part="flowers" transform={`translate(${x} ${y}) rotate(14) scale(${scale} ${scale * .73})`}>
    <path d={petalRing(5, 3.9, 1.9)} fill="#c7ad51" />
    <path d="M-1.4,-.5 Q0,-1.7 1.5,-.5 L1,1.2 L-.5,1.6 L-1.5,.7 Z" fill="#9b8b3e" />
  </g>;
}

function Buttercup() {
  return <g data-species="buttercup">
    <path data-part="body" fill="#648449"
      d="M0,4 C2,-11 4,-28 10,-37 L10.8,-36.8 C5,-26 3,-9 1,4 Z M2,-10 Q-6,-17 -10,-25 L-9.3,-25 Q-5,-18 2.6,-11 Z" />
    <path data-part="body" fill="#526f3f"
      d="M0,4 Q-5,1 -8,0 Q-13,0 -14,-2 L-10,-3 Q-15,-6 -15,-8 L-9,-6 Q-11,-10 -10,-12 L-6,-8 L-5,-12 Q-2,-10 -4,-5 L-1,-7 L-2,-2 Z M2,3 Q7,1 8,-2 L11,-8 L12,-4 Q16,-7 18,-6 L15,-2 L20,0 Q18,2 13,1 L15,4 Q10,5 7,3 Z" />
    <path data-part="body" fill="#829954"
      d="M0,3 L-3,-3 L-7,-4 L-7,-8 L-3,-5 L-1,-7 L0,-3 L3,-4 L2,0 Z M3,-14 L7,-20 L10,-21 L9,-17 L13,-18 L10,-14 L6,-14 Z" />
    <ButtercupHead x={10} y={-37} /><ButtercupHead x={-10} y={-25} scale={.8} />
  </g>;
}

function Trifoliate({ x, y, scale = 1, angle = 0 }: { x: number; y: number; scale?: number; angle?: number }) {
  return <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${scale})`}>
    <path data-part="body" fill="#648449"
      d="M0,0 C-6,0 -11,-2 -10,-6 C-9,-11 -3,-7 0,0 Z M0,0 C-4,-5 -4,-13 0,-13 C5,-13 5,-5 0,0 Z M0,0 C3,-7 10,-10 11,-5 C12,-1 5,1 0,0 Z" />
    <path data-part="detail" fill="#9aab70" opacity=".55"
      d="M-9,-5 L-5,-4 L-4,-7 L-4,-5 L-5,-3 Z M-2,-9 L0,-6 L3,-9 L1,-5 Z M5,-6 L6,-3 L10,-4 L6,-2 Z" />
  </g>;
}

function CloverHead({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g data-part="flowers" transform={`translate(${x} ${y}) scale(${scale})`}>
    <path fill="#95677c" d="M-4,1 C-5,-1 -5,-3 -4,-4 L-4,-6 L-2,-7 Q-1,-10 1,-8 Q4,-9 4,-6 Q6,-5 5,-3 Q7,-1 5,1 Q4,4 1,4 Q-2,5 -4,1 Z" />
    <path fill="#b08b9c" d="M-3,-3 L-3,-6 L-1,-4 L0,-8 L1,-5 L3,-7 L3,-4 L4,-4 L3,-1 L1,-3 L0,0 L-1,-3 L-2,-1 Z" />
    <path fill="#c4a6ad" opacity=".7" d="M-2,-5 L-1,-7 L0,-5 L-1,-3 Z M1,-5 L2,-7 L3,-5 L2,-3 Z M2,-1 L4,-3 L4,-1 L3,1 Z" />
  </g>;
}

function Clover() {
  return <g data-species="clover">
    <path data-part="body" fill="#526f3f"
      d="M0,4 Q-1,-10 -4,-23 L-3.1,-23 Q1,-10 1,4 Z M2,4 Q11,-5 16,-17 L16.8,-17 Q13,-4 3,5 Z M0,1 L-10,-5 L-9.5,-6 L1,0 Z M5,1 L12,-7 L12.8,-6 L6,2 Z" />
    <Trifoliate x={-10} y={-5} scale={.8} angle={-25} />
    <Trifoliate x={12} y={-6} scale={.75} angle={25} />
    <Trifoliate x={0} y={4} scale={.7} angle={-8} />
    <CloverHead x={-4} y={-25} scale={.8} /><CloverHead x={17} y={-18} scale={.58} />
  </g>;
}

export function Plant({ species }: { species: Species }) {
  return species === 'daisy' ? <Daisy /> : species === 'buttercup' ? <Buttercup /> : <Clover />;
}

export function GrassComposition({ kind }: { kind: Kind }) {
  return <g data-vegetation={kind} pointerEvents="none">
    {kind === 'soft' && <>
      <Grass type="short" x={-28} y={-5} scale={.9} />
      <Grass type="woven" x={0} y={2} scale={1.15} />
      <Grass type="short" x={37} y={9} scale={.7} flip />
    </>}
    {kind === 'wild' && <>
      <Grass type="leaning" x={-35} y={-6} scale={.72} />
      <Grass type="meadow" x={6} y={0} />
      <Grass type="woven" x={-15} y={10} scale={.55} />
    </>}
    {kind === 'flower' && <>
      <g transform="translate(41 -2)"><Buttercup /></g>
      <Grass type="short" x={-31} y={4} scale={.32} />
      <g transform="translate(-4 3)"><Clover /></g>
      <g transform="translate(-52 8)"><Daisy /></g>
      <Grass type="woven" x={66} y={11} scale={.37} />
    </>}
  </g>;
}

/** The three retained compositions, in their original local SVG coordinates. */
export function ShortMeadowCluster() { return <GrassComposition kind="soft" />; }
export function WildGrassCluster() { return <GrassComposition kind="wild" />; }
export function WildflowerCluster() { return <GrassComposition kind="flower" />; }
