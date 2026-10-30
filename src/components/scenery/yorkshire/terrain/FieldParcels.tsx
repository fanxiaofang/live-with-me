import { useId } from 'react';
import { tramlineX } from '../../../../world/scene/fieldParcels';
import { Grass, Plant } from '../vegetation/MeadowVegetationAssets';

const BACK = 150;
const FRONT = 520;
const a = (y: number) => tramlineX(4, y);
const b = (y: number) => tramlineX(5, y);
const west = `M-3200,${BACK} H${a(BACK)} L${a(FRONT)},${FRONT} H-3200Z`;
const east = `M${b(BACK)},${BACK} H4200 V${FRONT} H${b(FRONT)}Z`;

// A low, grassy crown above the crop plane. Width and lift taper into distance;
// the shallow earth side is a filled face, not two long outline strokes.
function bankSection(index: number, y: number) {
  const depth = (y - BACK) / (FRONT - BACK);
  return { x: tramlineX(index, y), y, width: 1.7 + depth * 14,
    lift: .45 + depth * 3.2, irregularity: Math.sin(y * .13 + index) * depth * .9 };
}
const BANKS = [4, 5].map(index => {
  const sections = Array.from({ length: 25 }, (_, i) => bankSection(index, BACK + (FRONT - BACK) * i / 24));
  const point = (p: ReturnType<typeof bankSection>, side: number, top: boolean) =>
    `${p.x + side * p.width + p.irregularity},${p.y - (top ? p.lift : 0)}`;
  const face = `M${sections.map(p => point(p, 1, true)).join(' L')} L${[...sections].reverse().map(p => point(p, 1, false)).join(' L')}Z`;
  const top = `M${sections.map(p => point(p, -1, true)).join(' L')} L${[...sections].reverse().map(p => point(p, 1, true)).join(' L')}Z`;
  return { index, face, top };
});
const BANK_PLANTS = [
  { line: 4, y: 214, side: -1 }, { line: 4, y: 228, side: 1 },
  { line: 4, y: 267, side: -1 }, { line: 4, y: 283, side: 1 }, { line: 4, y: 326, side: -1 },
  { line: 5, y: 209, side: 1 }, { line: 5, y: 224, side: -1 },
  { line: 5, y: 269, side: 1 }, { line: 5, y: 288, side: -1 }, { line: 5, y: 338, side: 1 },
];

// A sparse cut-stubble patch, compressed into the ground plane. The central and
// eastern parcels remain open; this is not a full-width texture or transition band.
const stubble = Array.from({ length: 8 }, (_, row) => {
  const y = 225 + row * 9;
  const left = -230 + row * 13, right = a(y) - 26;
  return Array.from({ length: Math.max(0, Math.floor((right - left) / 24)) }, (_, col) => {
    const x = left + col * 24 + (row % 2) * 7;
    const dy = ((col * 7 + row * 3) % 5) - 2;
    return `M${x},${y + dy} l1,-2.2 m3,1 l.7,-1.4`;
  }).join(' ');
}).join(' ');

/** All parcel surfaces and marks belong to the existing wheat camera layer. */
export function FieldParcels({ surfacePath }: { surfacePath: string }) {
  const clip = 'field-parcels-' + useId().replace(/:/g, '');
  return <g id="field-parcel-organization" pointerEvents="none" aria-hidden="true">
    <defs><clipPath id={clip}><path d={surfacePath} /></clipPath></defs>
    <g clipPath={`url(#${clip})`} style={{ filter: 'url(#field-environment-tone)' }}>
      <path data-field-parcel="west-cut" d={west} fill="#e8d49a" opacity=".42" />
      <path data-field-parcel="east-standing" d={east} fill="#b99442" opacity=".13" />
      <path data-field-stubble="" d={stubble} fill="none" stroke="#a78b4c"
        strokeWidth=".85" strokeLinecap="round" opacity=".36" />
      {BANKS.map(bank => <g key={bank.index} data-parcel-margin={bank.index} data-bank-profile="raised">
        <path data-bank-face="" d={bank.face} fill="#a38c53" opacity=".65" />
        <path data-bank-crown="" d={bank.top} fill="#a8ad69" opacity=".82" />
        {[218, 259, 302].map((y, i) => {
          const start = bankSection(bank.index, y), end = bankSection(bank.index, y + 10 + i * 3);
          return <path key={y} d={`M${start.x - start.width * .5},${y - start.lift} L${end.x - end.width * .5},${end.y - end.lift}`}
            stroke="#cfcb8b" strokeWidth={1 + i * .25} opacity=".55" strokeLinecap="round" />;
        })}
      </g>)}
      {BANK_PLANTS.map((plant, i) => {
        const p = bankSection(plant.line, plant.y);
        const scale = .11 + (plant.y - 200) * .0014;
        return <g key={i} data-bank-planting="" transform={`translate(${p.x + plant.side * p.width * .45} ${p.y - p.lift})`}>
          <Grass type={i % 3 === 0 ? 'leaning' : 'short'} scale={scale} flip={plant.side < 0} />
          {i % 3 !== 1 && <g transform={`translate(${plant.side * 4} -1) scale(${scale * .85})`}>
            <Plant species={i % 2 ? 'buttercup' : 'daisy'} />
          </g>}
        </g>;
      })}
    </g>
  </g>;
}
