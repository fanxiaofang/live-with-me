import { CHARACTER_WORLD_SIZE } from '../characters/characterProportions';

/** Hat and accessories use the same r=7 head authoring space. */
export function DeskHeadphones({ cx, cy, part }: { cx: number; cy: number; part: 'band' | 'cups' }) {
  const scale = CHARACTER_WORLD_SIZE.headRadius / 7;
  return <g data-desk-headphones={part} transform={`translate(${cx},${cy + 14 * scale}) scale(${scale})`}>
    {part === 'band' ? <>
      <path d="M-8.5,-11.6 C-9.8,-30.8 9.8,-30.8 8.5,-11.6"
        stroke="#283a41" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M-8.55,-13.2 C-9.1,-29.3 9.1,-29.3 8.55,-13.2"
        stroke="#65777a" strokeWidth="0.35" strokeOpacity="0.65" fill="none" />
    </> : [-1, 1].map(sign => <g key={sign} transform={`scale(${sign},1)`}>
      <ellipse data-ear-cup="true" cx="7.8" cy="-11.4" rx="1.6" ry="2.3" fill="#24353d" />
      <ellipse cx="8.2" cy="-11.4" rx="1.1" ry="1.8" fill="#415965" />
      <path d="M8.15,-12.8 Q8.65,-11.5 8.15,-10.1" stroke="#82908c" strokeWidth="0.35" strokeOpacity="0.65" fill="none" />
    </g>)}
  </g>;
}
