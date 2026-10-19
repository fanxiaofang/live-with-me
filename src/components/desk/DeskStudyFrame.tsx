import { useId, type ReactNode } from 'react';
import type { DeskSurfaceStudy } from './deskStudyModel';
import { deskStudyRise, deskSurfacePaths } from './deskStudyModel';
import { SoftSurfaceShadow } from '../../world/render/GroundShadow';

/** Low-detail study using the same top, support feet and local axes in every view. */
export function DeskStudyFrame({ surface, children }: { surface: DeskSurfaceStudy; children: ReactNode }) {
  const id = `desk-study-${useId().replace(/[^\w-]/g, '')}`;
  const paths = deskSurfacePaths(surface);
  const rise = deskStudyRise(surface);
  const feet = [{ x: -53, y: 28 }, { x: 21, y: 7 }, { x: -21, y: 37 }, { x: 53, y: 16 }];
  return <g data-desk-study-frame={surface.outline} data-desk-height={surface.height} data-desk-thickness={surface.thickness}>
    <defs><linearGradient id={`${id}-top`} x1="0" y1="0" x2="1" y2="1">
      <stop stopColor="#eed7be" /><stop offset=".5" stopColor="#dfbe98" /><stop offset="1" stopColor="#cb9e70" />
    </linearGradient></defs>
    <g transform={`scale(${surface.width},1)`}>
      <SoftSurfaceShadow bounds={{ x: -55, y: 7, width: 108, height: 30 }} blur={1.2}>
        <polygon points="-55,28 21,7 53,16 -21,37" fill="#24160d" opacity=".22" />
      </SoftSurfaceShadow>
      {feet.map((foot, index) => <g key={index}>
        <ellipse cx={foot.x} cy={foot.y} rx="3.5" ry="1.6" fill="#24160d" opacity=".3" />
        <line x1={foot.x} y1={foot.y - 22.6 - rise + surface.thickness} x2={foot.x} y2={foot.y}
          stroke={index < 2 ? '#5a381b' : '#784b25'} strokeWidth="3.2" strokeLinecap="round" />
        <line x1={foot.x} y1={foot.y - 4} x2={foot.x} y2={foot.y} stroke="#bc9853" strokeWidth="3.4" strokeLinecap="round" />
      </g>)}
      <path d={`M-51,${6 - rise} L19,${-13.8 - rise} M-51,${9.8 - rise} L-19,${19.2 - rise}`} fill="none" stroke="#4d2f16" strokeWidth="3" />
    </g>
    <path d={paths.side} fill="#784b2c" stroke="#4a2a11" strokeWidth=".5" />
    <path d={paths.front} fill="#986333" stroke="#683d1b" strokeWidth=".5" />
    <path d={paths.top} fill={`url(#${id}-top)`} stroke="#ba8f62" strokeWidth=".7" />
    <path d={paths.frontTop} fill="none" stroke="#fff1db" strokeWidth=".8" opacity=".85" />
    {children}
  </g>;
}
