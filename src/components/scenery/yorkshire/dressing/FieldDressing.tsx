import type { CSSProperties } from 'react';
import { FIELD_HAY_BALES, FIELD_SCARECROWS, fieldDressingDepth } from '../../../../world/scene/fieldDressing';

/** The retained bale geometry is anchored at its bottom (local y=17.5). */
function HayBale({ detailed }: { detailed: boolean }) {
  return <g transform="translate(0 -17.5)">
    <ellipse cx="1" cy="16" rx="14" ry="2.1" fill="#7b642e" opacity=".23" />
    <ellipse cx="0" cy="10" rx="13" ry="7.5" fill="#c99f2e" />
    <rect x="-13" y="0" width="26" height="10" fill="#dfb33b" />
    <ellipse cx="0" cy="0" rx="13" ry="6.2" fill="#f4d45d" stroke="#b88b20" strokeWidth=".75" />
    {detailed && <g data-bale-detail="">
      <path d="M-7,0 v10 M7,0 v10" stroke="#784e11" strokeWidth=".8" strokeDasharray="3,1" />
      <circle r="3.8" fill="none" stroke="#b88b20" strokeWidth=".7" strokeDasharray="3,2" />
      <path d="M-13,6 Q-17,8 -19,11 M11,4 Q15,6 17,9" stroke="#f4d45d" strokeWidth=".65" fill="none" />
    </g>}
  </g>;
}

function Scarecrow({ shirt, detailed }: { shirt: string; detailed: boolean }) {
  return <g>
    <ellipse cx="1.5" cy=".5" rx="5" ry="1" fill="#79663c" opacity=".2" />
    <path d="M0,0 L-1,-42 M-17,-31 L17,-29" fill="none" stroke="#796346" strokeWidth="1.8" strokeLinecap="round" />
    <path d="M-5,-34 L-14,-33 L-15,-28 L-7,-28 L-6,-15 L0,-16 L6,-14 L7,-28 L14,-26 L16,-31 L6,-34Z" fill={shirt} />
    <path d="M0,-33 L1,-17 L6,-14 L7,-28 L14,-26 L16,-31 L6,-34Z" fill="#594e3c" opacity=".15" />
    <ellipse cx="0" cy="-39" rx="4.2" ry="5" fill="#c6ad73" />
    <path d="M-5,-42 L-3,-49 L3,-48 L5,-42Z" fill="#b09c65" />
    <ellipse cy="-42" rx="8" ry="1.8" fill="#d2bc83" />
    <path d="M-5,-34 L0,-31 L4,-34 L7,-30 L1,-29Z" fill="#bc9563" />
    {detailed && <g data-scarecrow-detail="">
      <path d="M-15,-30 l-5,-2 m5,3 l-4,1 M15,-29 l5,-1 m-5,2 l4,2 M-4,-15 l-2,5 m5,-6 v5 M4,-15 l2,5" stroke="#d5bd7e" strokeWidth=".8" fill="none" />
      <path d="M-3,-24 l4,1 l-1,4 l-4,-1Z" fill="#b5a081" />
      <path d="M-4,-43 Q0,-42 4,-43" fill="none" stroke="#8d754d" strokeWidth="1" />
    </g>}
  </g>;
}

export function FieldDressing({ style }: { style?: CSSProperties }) {
  return <g id="field-depth-dressing" pointerEvents="none" aria-hidden="true" style={style}>
    <g id="perspective-hay-bales">
      {FIELD_HAY_BALES.map(bale => {
        const { y, scale, opacity } = fieldDressingDepth(bale.depth);
        return <g key={bale.id} data-hay-bale={bale.id} data-field-depth={bale.depth}
          data-field-root={`${bale.x},${y}`} transform={`translate(${bale.x} ${y}) scale(${scale})`} opacity={opacity}>
          <HayBale detailed={bale.depth > .3} />
        </g>;
      })}
    </g>
    <g id="field-scarecrows">
      {FIELD_SCARECROWS.map(crow => {
        const { y, scale, opacity } = fieldDressingDepth(crow.depth);
        return <g key={crow.id} data-scarecrow={crow.id} data-field-depth={crow.depth}
          data-field-root={`${crow.x},${y}`} transform={`translate(${crow.x} ${y}) scale(${scale})`} opacity={opacity}>
          <Scarecrow shirt={crow.shirt} detailed={crow.depth > .3} />
        </g>;
      })}
    </g>
  </g>;
}
