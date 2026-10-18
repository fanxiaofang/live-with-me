import { useId } from 'react';
import { chairXY as p } from './chairGeometry';
import type { WindsorChairProps } from './WindsorChair';
import { SofaDeskCharacter } from './SofaDeskCharacter';
import { svgAction } from '../../world/interactions/svgAction';

export type SofaChairVariant = 'club' | 'recliner';
export const SOFA_CHAIR_NAMES = { club: '苔绿方扶手沙发椅', recliner: '烟蓝高背电竞沙发椅' } as const;

// The camera sees the -u side, +v back and upper surfaces. All faces share bounds.
const sidePlane = (u: number) => `matrix(.8 .228 0 -1 ${u} ${20 - .2852 * u})`;
const backPlane = (v: number) => `matrix(1 -.2852 0 -1 ${.8 * v} ${20 + .228 * v})`;
const topPlane = (h: number) => `matrix(1 -.2852 .8 .228 0 ${20 - h})`;
const shell = { u0: -11, u1: 11, front: -9, back: 10.5, innerBack: 6.5, bottom: 3.5, seat: 14.2, arm: 21.2 };

/** A closed upholstered base, full-depth arms and one thick backrest. */
export function SofaWorkChair({ variant = 'club', chairId = 'attic-chair', isSeated = false,
  occupant, keyboardAnchor = { x: 0, y: -7 }, interactive = true, isInspectorOpen = false,
  onClick, onHover, showArms = true,
}: Omit<WindsorChairProps, 'variant'> & { variant?: SofaChairVariant; showArms?: boolean }) {
  const prefix = `sofa-${useId().replace(/[^\w-]/g, '')}`;
  const paint = (name: string) => `url(#${prefix}-${name})`;
  const high = variant === 'recliner';
  const seated = isSeated && Boolean(occupant);
  const c = high
    ? { light: '#8d9f9d', base: '#70898b', dark: '#536d72', edge: '#40595d', seam: '#b0c0bc' }
    : { light: '#a2b091', base: '#859674', dark: '#627755', edge: '#4e6246', seam: '#c2cbaa' };
  const top = high ? 33 : 28;
  const { u0, u1, front, back, innerBack, bottom, arm } = shell;
  const sideSilhouette = `M${front},${bottom + 1} Q${front},${bottom} ${front + 1},${bottom}
    H${back - 1} Q${back},${bottom} ${back},${bottom + 1} V${top - 1.6}
    Q${back},${top} ${back - 1.6},${top} H${innerBack + 1.6}
    Q${innerBack},${top} ${innerBack},${top - 1.6} V${arm}
    H${front + 1.8} Q${front},${arm} ${front},${arm - 1.8} Z`;
  return <g id={interactive ? chairId === 'attic-chair' ? 'sofa-chair-root' : 'sofa-chair-secondary-root' : `${prefix}-root`}
    data-chair-kind={variant} data-chair-study="sofa-nw-v2" data-seat-height={shell.seat}
    {...(interactive ? svgAction(`查看${SOFA_CHAIR_NAMES[variant]}`) : {})}
    className={interactive ? 'select-none cursor-pointer' : 'select-none'}
    onClick={interactive ? onClick : undefined}
    onMouseEnter={interactive ? e => { e.stopPropagation(); onHover?.(!isInspectorOpen && seated && occupant
      ? { kind: 'person', id: occupant.id } : { kind: 'furniture-part', id: chairId }); } : undefined}
    onMouseLeave={interactive ? () => onHover?.(null) : undefined}>
    <defs>
      <linearGradient id={`${prefix}-side`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor={c.dark} /><stop offset=".45" stopColor={c.base} /><stop offset="1" stopColor={c.light} />
      </linearGradient>
      <linearGradient id={`${prefix}-back`} x1="0" y1="0" x2=".85" y2="1">
        <stop stopColor={c.dark} /><stop offset="1" stopColor={c.base} />
      </linearGradient>
      <linearGradient id={`${prefix}-pad`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor={c.light} /><stop offset="1" stopColor={c.base} />
      </linearGradient>
    </defs>
    <ellipse cx="1" cy="21" rx="19" ry="5.8" fill="#30271e" opacity=".15" />
    <g data-sofa-part="feet" strokeLinecap="round">
      {[[-8.7, -6.7], [8.7, -6.7], [-8.7, 8], [8.7, 8]].map(([u, v], i) =>
        <path key={i} d={`M${p(u, v, 4.5)} L${p(u * 1.015, v * 1.015, .3)}`}
          stroke="#594a39" strokeWidth={high ? 2.3 : 1.9} />)}
    </g>
    <g data-sofa-part="base">
      <g transform={topPlane(12.2)}><rect x={u0} y={front} width={u1 - u0} height={back - front} rx="1.3" fill={c.dark} /></g>
      <g transform={sidePlane(u0)}><rect x={front} y={bottom} width={back - front} height="8.7" rx="1" fill={c.dark} /></g>
      <g transform={backPlane(back)}><rect x={u0} y={bottom} width={u1 - u0} height="8.7" rx="1" fill={c.dark} /></g>
    </g>
    <g data-sofa-part="far-arm">
      <g transform={sidePlane(6.5)}><rect x={front} y="12" width={innerBack - front} height={arm - 12} rx="1.4" fill={paint('side')} stroke={c.edge} strokeWidth=".3" /></g>
      <g transform={topPlane(arm)}><rect x="6.5" y={front} width="4.5" height={innerBack - front} rx="1.2" fill={paint('pad')} stroke={c.edge} strokeWidth=".3" /></g>
    </g>
    <g data-sofa-part="seat">
      <g transform={sidePlane(-6.5)}><rect x="-8" y="12.2" width="14.5" height="2" rx=".6" fill={c.base} /></g>
      <g transform={topPlane(shell.seat)}><rect x="-6.5" y="-8" width="13" height="14.5" rx="1.4" fill={paint('pad')} stroke={c.dark} strokeWidth=".35" /></g>
      <g transform={backPlane(innerBack)}><rect x="-6.5" y="14" width="13" height={top - 15} rx="2" fill={paint('pad')} /></g>
    </g>
    {showArms && seated && occupant && <SofaDeskCharacter occupant={occupant} keyboardAnchor={keyboardAnchor} part="far-arm" />}
    {seated && occupant && <SofaDeskCharacter occupant={occupant} keyboardAnchor={keyboardAnchor} part="body" />}
    <g data-sofa-part="continuous-near-side">
      <g transform={sidePlane(u0)}>
        <path d={sideSilhouette} fill={paint('side')} stroke={c.edge} strokeWidth=".45" />
        <path d={`M${front + 1.4},${bottom + 1.5} H${innerBack - 1.2} V${arm - 1.2}`}
          fill="none" stroke={c.seam} strokeOpacity=".38" strokeWidth=".23" />
        {high && <g transform="translate(-3,12)">
          <rect x="-1.7" y="-1.5" width="3.4" height="3" rx=".65" fill={c.edge} />
          <ellipse rx=".72" ry=".86" fill="#bbaa87" />
        </g>}
      </g>
      <g transform={topPlane(arm)}><rect x={u0} y={front} width="4.5" height={innerBack - front} rx="1.2" fill={paint('pad')} stroke={c.edge} strokeWidth=".3" /></g>
      <g transform={sidePlane(u0 - .12)}><rect x={front + .2} y={arm - .15} width={innerBack - front - .2} height=".9" rx=".4" fill={c.light} /></g>
    </g>
    {showArms && seated && occupant && <SofaDeskCharacter occupant={occupant} keyboardAnchor={keyboardAnchor} part="near-arm" />}
    <g data-sofa-occluder="solid-back">
      <g transform={topPlane(top)}><rect x={u0} y={innerBack} width={u1 - u0} height={back - innerBack} rx="1.2" fill={c.light} stroke={c.edge} strokeWidth=".3" /></g>
      <g transform={backPlane(back)}>
        <rect x={u0} y={bottom} width={u1 - u0} height={top - bottom} rx="1.5" fill={paint('back')} stroke={c.edge} strokeWidth=".45" />
        <path d={`M${u0 + 1.3},${bottom + 2} V${top - 2.2} Q${u0 + 1.3},${top - 1.3} ${u0 + 2.2},${top - 1.3}
          H${u1 - 2.2} Q${u1 - 1.3},${top - 1.3} ${u1 - 1.3},${top - 2.2} V${bottom + 2}`}
          fill="none" stroke={c.seam} strokeOpacity=".55" strokeWidth=".28" strokeLinecap="round" />
        {high && <path d={`M${u0 + 1.4},${top - 7} H${u1 - 1.4}`} stroke={c.edge} strokeWidth=".4" fill="none" />}
      </g>
    </g>
  </g>;
}
