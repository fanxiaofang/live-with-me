import { useId } from 'react';
import { chairXY as p } from './chairGeometry';
import type { WindsorChairProps } from './WindsorChair';
import { SofaDeskCharacter } from './SofaDeskCharacter';
import { svgAction } from '../../world/interactions/svgAction';

export type SofaChairVariant = 'club' | 'recliner';
export const SOFA_CHAIR_NAMES = { club: '青瓷绿方扶手沙发椅', recliner: '靛蓝高背沙发椅' } as const;

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
  // Celadon pottery and indigo book cloth share the scene's warm walnut frame.
  const c = high
    ? { light: '#7196b2', base: '#47759a', dark: '#294967', edge: '#233b50', seam: '#92aec0', panel: '#39608f' }
    : { light: '#88ad84', base: '#5f835b', dark: '#36533b', edge: '#2d412b', seam: '#b1c69b', panel: '#4e825a' };
  const wood = { light: '#c49462', base: '#8c5832', dark: '#4d3018', edge: '#361f0e' };
  const top = high ? 29 : 28;
  const { u0, u1, front, back, innerBack, bottom, arm } = shell;
  const sideSilhouette = `M${front},${bottom + 1} Q${front},${bottom} ${front + 1},${bottom}
    H${back - 1} Q${back},${bottom} ${back},${bottom + 1} V${top - 1.6}
    Q${back},${top} ${back - 1.6},${top} H${innerBack + 1.6}
    Q${innerBack},${top} ${innerBack},${top - 1.6} V${arm}
    H${front + 1.8} Q${front},${arm} ${front},${arm - 1.8} Z`;
  return <g id={interactive ? chairId === 'attic-chair' ? 'sofa-chair-root' : 'sofa-chair-secondary-root' : `${prefix}-root`}
    data-chair-kind={variant} data-chair-study="sofa-nw-v2" data-chair-finish="cottage-upholstery" data-seat-height={shell.seat}
    {...(interactive ? svgAction(`查看${SOFA_CHAIR_NAMES[variant]}`) : {})}
    className={interactive ? 'select-none cursor-pointer' : 'select-none'}
    onClick={interactive ? onClick : undefined}
    onMouseEnter={interactive ? e => { e.stopPropagation(); onHover?.(!isInspectorOpen && seated && occupant
      ? { kind: 'person', id: occupant.id } : { kind: 'furniture-part', id: chairId }); } : undefined}
    onMouseLeave={interactive ? () => onHover?.(null) : undefined}>
    <defs>
      <linearGradient id={`${prefix}-side`} x1="0" y1="0" x2=".25" y2="1">
        <stop stopColor={c.dark} /><stop offset=".4" stopColor={c.base} /><stop offset="1" stopColor={c.base} />
      </linearGradient>
      <linearGradient id={`${prefix}-back`} x1="0" y1="0" x2=".85" y2="1">
        <stop stopColor={c.dark} /><stop offset=".7" stopColor={c.panel} /><stop offset="1" stopColor={c.base} />
      </linearGradient>
      <linearGradient id={`${prefix}-pad`} x1="0" y1="0" x2="1" y2="1">
        <stop stopColor={c.light} /><stop offset=".65" stopColor={c.base} /><stop offset="1" stopColor={c.base} />
      </linearGradient>
    </defs>
    <ellipse cx="1" cy="21" rx="19" ry="5.8" fill="#2d1b0d" opacity=".18" />
    <ellipse cx="1" cy="20.8" rx="13.8" ry="3.4" fill="#2d1b0d" opacity=".12" />
    <g data-sofa-part="feet" strokeLinecap="round">
      {[[-8.7, -6.7], [8.7, -6.7], [-8.7, 8], [8.7, 8]].map(([u, v], i) =>
        <g key={i}>
          <path d={`M${p(u-1, v, 5)} L${p(u+1, v, 5)} L${p(u*1.045+.7, v*1.045, .3)} L${p(u*1.045-.7, v*1.045, .3)}Z`}
            fill={wood.base} stroke={wood.edge} strokeWidth=".4" strokeLinejoin="round" />
          <path d={`M${p(u-.55, v, 4.4)} L${p(u*1.045-.35, v*1.045, .8)}`} stroke={wood.light} strokeWidth=".45" />
        </g>)}
    </g>
    <g data-sofa-part="base">
      <g transform={topPlane(12.2)}><rect x={u0} y={front} width={u1 - u0} height={back - front} rx="1.3" fill={c.dark} /></g>
      <g transform={sidePlane(u0)}><rect x={front} y={bottom} width={back - front} height="8.7" rx="1" fill={c.dark} /></g>
      <g transform={backPlane(back)}><rect x={u0} y={bottom} width={u1 - u0} height="8.7" rx="1" fill={c.dark} /></g>
    </g>
    <g data-sofa-part="far-arm">
      <g transform={sidePlane(6.5)}><rect x={front} y="12" width={innerBack - front} height={arm - 12} rx="1.7" fill={c.dark} stroke={c.edge} strokeWidth=".45" /></g>
      <g transform={topPlane(arm)}><rect x="6.5" y={front} width="4.5" height={innerBack - front} rx="1.5" fill={paint('pad')} stroke={c.edge} strokeWidth=".45" /></g>
    </g>
    <g data-sofa-part="seat">
      <g transform={sidePlane(-6.5)}><rect x="-8" y="11.5" width="14.5" height="2.7" rx=".8" fill={c.dark} stroke={c.edge} strokeWidth=".4" /></g>
      <g transform={topPlane(shell.seat)}>
        <rect x="-6.5" y="-8" width="13" height="14.5" rx="2" fill={paint('pad')} stroke={c.edge} strokeWidth=".45" />
        <path d="M-5.3,-5.7Q-5.3,-6.8 -4.1,-6.8H4.2" fill="none" stroke={c.seam} strokeWidth=".4" />
      </g>
      <g transform={backPlane(innerBack)}>
        <rect x="-6.5" y="14" width="13" height={top - 15} rx="2.5" fill={paint('pad')} stroke={c.dark} strokeWidth=".45" />
        <path d={`M-5,16 V${top-4} Q-5,${top-2.5} -3.5,${top-2.5} H3.5`} fill="none" stroke={c.seam} strokeWidth=".35" opacity=".65" />
      </g>
    </g>
    {showArms && seated && occupant && <SofaDeskCharacter occupant={occupant} keyboardAnchor={keyboardAnchor} part="far-arm" />}
    {seated && occupant && <SofaDeskCharacter occupant={occupant} keyboardAnchor={keyboardAnchor} part="body" />}
    <g data-sofa-part="continuous-near-side">
      <g transform={sidePlane(u0)}>
        <path d={sideSilhouette} fill={paint('side')} stroke={c.edge} strokeWidth=".6" />
        <path d={`M${front+1.4},8.6 Q${front+1.4},7.3 ${front+2.8},7.3 H${innerBack-2.8}
          Q${innerBack-1.3},7.3 ${innerBack-1.3},8.8 V${arm-3.3} Q${innerBack-1.3},${arm-1.8} ${innerBack-2.8},${arm-1.8}
          H${front+3} Q${front+1.4},${arm-1.8} ${front+1.4},${arm-3.4}Z`}
          fill={c.base} stroke={c.dark} strokeWidth=".4" />
        <path d={`M${front+.35},${bottom+1} Q${front+.35},${bottom+.25} ${front+1.1},${bottom+.25}
          H${back-.4} V6.1 H${front+.35}Z`} fill={wood.base} stroke={wood.edge} strokeWidth=".4" />
        <path d={`M${front+.8},5.8 H${back-.6}`} fill="none" stroke={wood.light} strokeWidth=".45" />
        {high && <g transform="translate(-3,12)">
          <rect x="-1.7" y="-1.5" width="3.4" height="3" rx=".65" fill={c.edge} />
          <ellipse rx=".72" ry=".86" fill="#d99938" stroke="#694324" strokeWidth=".25" />
          <path d="M-.25,.35 V-.35" stroke="#fef08a" strokeWidth=".3" />
        </g>}
      </g>
      <g transform={topPlane(arm)}>
        <rect x={u0} y={front} width="4.5" height={innerBack - front} rx="1.5" fill={paint('pad')} stroke={c.edge} strokeWidth=".45" />
        <path d={`M${u0+1},${front+2} V${innerBack-1.8}`} fill="none" stroke={c.seam} strokeWidth=".45" opacity=".7" />
      </g>
      <g transform={sidePlane(u0 - .12)}><path d={`M${front+1.1},${arm-.2} H${innerBack-1.1}`} fill="none" stroke={c.light} strokeWidth=".65" strokeLinecap="round" /></g>
    </g>
    {showArms && seated && occupant && <SofaDeskCharacter occupant={occupant} keyboardAnchor={keyboardAnchor} part="near-arm" />}
    <g data-sofa-occluder="solid-back">
      <g transform={topPlane(top)}>
        <rect x={u0} y={innerBack} width={u1-u0} height={back-innerBack} rx="1.5" fill={paint('pad')} stroke={c.edge} strokeWidth=".45" />
      </g>
      <g transform={backPlane(back)}>
        <rect x={u0} y={bottom} width={u1-u0} height={top-bottom} rx="1.8" fill={paint('back')} stroke={c.edge} strokeWidth=".6" />
        {/* A raised upholstered centre, narrow turned edges and an exposed wood apron. */}
        <path d={`M${u0+2.2},9 Q${u0+1.6},${top-8} ${u0+2},${top-3.8}
          Q${u0+2.2},${top-1.7} ${u0+4},${top-1.7} H${u1-4}
          Q${u1-2.2},${top-1.7} ${u1-2},${top-3.8} L${u1-2.2},9 Q0,7.7 ${u0+2.2},9Z`}
          fill={c.base} stroke={c.dark} strokeWidth=".4" />
        <path d={`M${u0+2.5},10.5 V${top-4.2} Q${u0+2.5},${top-2.3} ${u0+4.3},${top-2.3} H${u1-4}`}
          fill="none" stroke={c.seam} strokeOpacity=".65" strokeWidth=".35" />
        <path d={`M${u0+.4},6.1 H${u1-.4} V${bottom+1.1} Q${u1-.4},${bottom+.3} ${u1-1.2},${bottom+.3}
          H${u0+1.2} Q${u0+.4},${bottom+.3} ${u0+.4},${bottom+1.1}Z`}
          fill={wood.dark} stroke={wood.edge} strokeWidth=".4" />
        <path d={`M${u0+.8},5.8 H${u1-.8}`} stroke={wood.base} strokeWidth=".55" fill="none" />
        {high && <path d={`M${u0+2.3},${top-7.2} Q0,${top-8.2} ${u1-2.3},${top-7.2}`}
          stroke={c.dark} strokeWidth=".45" fill="none" />}
      </g>
    </g>
  </g>;
}
