import React, { useId } from 'react';
import { Person } from '../../types';
import type { InteractionTarget } from '../../world/interactions/interactionTypes';
import { svgAction } from '../../world/interactions/svgAction';
import { DeskSeatedCharacter } from './DeskSeatedCharacter';
import { WindsorSeatedCharacter } from './WindsorSeatedCharacter';
import type { EditableObjectId } from '../layout-gizmo/layoutStore';
import { chairPoint, chairSeatPath, chairXY, DESK_CHAIR_MEASUREMENTS as dimensions } from './chairGeometry';

export interface WindsorChairProps {
  isSeated?: boolean;
  occupant?: Person | null;
  isInspectorOpen?: boolean;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onHover?: (target: InteractionTarget | null) => void;
  onToggleSeated?: () => void;
  onOpenInspectorModal?: () => void;
  keyboardAnchor?: { x: number; y: number };
  interactive?: boolean;
  variant?: 'windsor' | 'retro';
  chairId?: 'attic-chair' | 'attic-chair-secondary';
}

/** Seat, feet, stretchers and back share one local furniture projection.
 * The near backrest covers the sitter's lower back. Head/cloth stay upright. */
export const WindsorChair: React.FC<WindsorChairProps> = ({
  isSeated = false, occupant = null, isInspectorOpen = false, onClick, onHover,
  keyboardAnchor = { x: 0, y: -7 }, interactive = true,
  variant = 'windsor', chairId = 'attic-chair',
}) => {
  const prefix = `chair-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const paint = (name: string) => `url(#${prefix}-${name})`;
  const seated = isSeated && Boolean(occupant);
  const secondary = chairId === 'attic-chair-secondary';
  const suffix = secondary ? '-secondary' : '';
  const legs = [{ u: -6.5, v: -5.5 }, { u: 6.5, v: -5.5 }, { u: -6.5, v: 5.5 }, { u: 6.5, v: 5.5 }];

  return <g {...(interactive ? svgAction(secondary ? '查看第二工位椅子' : '查看工位椅子') : {})} id={secondary ? 'retro-chair-root' : 'windsor-chair-root'}
    data-chair-kind={variant}
    data-seat-height={dimensions.seatTop} data-back-height={dimensions.backTop}
    className={interactive ? 'select-none cursor-pointer group/windsor-chair' : 'select-none'}
    onClick={interactive ? onClick : undefined}
    onMouseEnter={interactive ? e => { e.stopPropagation(); onHover?.(!isInspectorOpen && seated && occupant
      ? { kind: 'person', id: occupant.id } : { kind: 'furniture-part', id: chairId as EditableObjectId }); } : undefined}
    onMouseLeave={interactive ? () => onHover?.(null) : undefined}>
    <defs>
      <linearGradient id={`${prefix}-wood`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#bd8b57" /><stop offset="0.55" stopColor="#a36d3d" /><stop offset="1" stopColor="#70421f" />
      </linearGradient>
      <linearGradient id={`${prefix}-cushion`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={variant === 'retro' ? '#6d7c67' : '#f2e9d9'} />
        <stop offset="1" stopColor={variant === 'retro' ? '#455744' : '#cbbb9f'} />
      </linearGradient>
      <linearGradient id={`${prefix}-leg`} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#6c421f" /><stop offset="0.5" stopColor="#b27c48" /><stop offset="1" stopColor="#805027" />
      </linearGradient>
    </defs>

    <g id={`chair-floor-shadow${suffix}`}>
      <ellipse cx="0" cy="20.5" rx="14" ry="4.7" fill="#24170e" opacity="0.2" filter="url(#softShadow)" />
      {legs.map(({ u, v }, index) => {
        const foot = chairPoint(u * 1.16, v * 1.16, 0);
        return <ellipse key={index} cx={foot.x} cy={foot.y} rx="1.8" ry="0.65" fill="#20140b" opacity="0.35" />;
      })}
    </g>
    <g id={`chair-legs-and-stretchers${suffix}`} strokeLinecap="round">
      {legs.slice(0, 2).map(({ u, v }, index) => {
        const top = chairPoint(u, v, dimensions.legTop), foot = chairPoint(u * 1.16, v * 1.16, 0);
        return <line key={index} x1={top.x} y1={top.y} x2={foot.x} y2={foot.y} stroke="#76502f" strokeWidth="1.8" />;
      })}
      {[-6.5, 6.5].map(u => <path key={u} d={`M${chairXY(u * 1.07, -5.5 * 1.07, dimensions.stretcher)} L${chairXY(u * 1.07, 5.5 * 1.07, dimensions.stretcher)}`}
        stroke="#754a25" strokeWidth="1.3" />)}
      <path d={`M${chairXY(-6.5 * 1.07, 0, dimensions.stretcher)} L${chairXY(6.5 * 1.07, 0, dimensions.stretcher)}`} stroke="#986535" strokeWidth="1.4" />
      {legs.slice(2).map(({ u, v }, index) => {
        const top = chairPoint(u, v, dimensions.legTop), foot = chairPoint(u * 1.16, v * 1.16, 0);
        return <g key={index}>
          <line x1={top.x} y1={top.y} x2={foot.x} y2={foot.y} stroke="#4f301a" strokeWidth="2.5" />
          <line x1={top.x} y1={top.y} x2={foot.x} y2={foot.y} stroke={paint('leg')} strokeWidth="1.8" />
        </g>;
      })}
    </g>


    <g id={`chair-seat-plank${suffix}`}>
      <path d={chairSeatPath(dimensions.seatPlankBottom)} fill="#69401f" stroke="#523218" strokeWidth="0.5" />
      <path d={chairSeatPath(dimensions.seatPlankTop)} fill={paint('wood')} stroke="#78502a" strokeWidth="0.5" />
      <path d={`M${chairXY(-6.2, 7, dimensions.seatPlankTop)} L${chairXY(6.2, 7, dimensions.seatPlankTop)}`} stroke="#d1a16d" strokeWidth="0.65" strokeLinecap="round" />
      <g id={`chair-cushion-group${suffix}`}>
        <path d={chairSeatPath(dimensions.cushionBottom, 0.9)} fill="#baa98e" stroke="#a49071" strokeWidth="0.4" />
        <path d={chairSeatPath(dimensions.seatTop, 1.1)} fill={paint('cushion')} stroke="#c8b99f" strokeWidth="0.5" />
        <path d={`M${chairXY(-5, 5.9, dimensions.seatTop)} L${chairXY(5, 5.9, dimensions.seatTop)}`} stroke="#f8f1e4" strokeWidth="0.55" strokeLinecap="round" />
      </g>
    </g>

    {seated && occupant && (variant === 'windsor'
      ? <WindsorSeatedCharacter occupant={occupant} keyboardAnchor={keyboardAnchor} />
      : <DeskSeatedCharacter occupant={occupant} keyboardAnchor={keyboardAnchor} secondary={secondary} />)}

    {variant === 'windsor' ? <g id="chair-windsor-backrest" strokeLinecap="round" fill="none">
      {[-7, -4.7, -2.3, 0, 2.3, 4.7, 7].map((u, index) => {
        const bottom = chairPoint(u, 6.1, dimensions.seatPlankTop), top = chairPoint(u, 6.5, dimensions.backTop - 2.4 + (1 - Math.abs(u) / 7) * 1.4);
        return <g key={u}>
          <line x1={bottom.x} y1={bottom.y} x2={top.x} y2={top.y} stroke={index === 0 || index === 6 ? '#75502d' : '#a47542'} strokeWidth={index === 0 || index === 6 ? 1.6 : 0.85} />
          {(index === 0 || index === 6) && <line x1={bottom.x - 0.3} y1={bottom.y - 0.2} x2={top.x - 0.3} y2={top.y + 0.3} stroke="#c99a60" strokeWidth="0.4" />}
        </g>;
      })}
      <path d={`M${chairXY(-8, 6.5, dimensions.backTop - 2.8)} C${chairXY(-4.5, 6.5, dimensions.backTop - 0.4)} ${chairXY(4.5, 6.5, dimensions.backTop - 0.4)} ${chairXY(8, 6.5, dimensions.backTop - 2.8)}`}
        stroke="#5f3a1e" strokeWidth="2.9" />
      <path d={`M${chairXY(-8, 6.5, dimensions.backTop - 2.4)} C${chairXY(-4.5, 6.5, dimensions.backTop)} ${chairXY(4.5, 6.5, dimensions.backTop)} ${chairXY(8, 6.5, dimensions.backTop - 2.4)}`}
        stroke={paint('wood')} strokeWidth="2.1" />
    </g> : <g id="chair-retro-backrest" strokeLinecap="round">
      {[-6.8, 6.8].map(u => <line key={u}
        x1={chairPoint(u, 6.1, dimensions.seatPlankTop).x} y1={chairPoint(u, 6.1, dimensions.seatPlankTop).y}
        x2={chairPoint(u, 6.5, 24.5).x} y2={chairPoint(u, 6.5, 24.5).y}
        stroke={paint('wood')} strokeWidth="1.8" />)}
      <path d={`M${chairXY(-6.8, 6.5, 17)} L${chairXY(-6.8, 6.5, 23.5)}
        Q${chairXY(-6.8, 6.5, 26.4)} ${chairXY(-4.3, 6.5, 26.4)}
        L${chairXY(4.3, 6.5, 26.4)} Q${chairXY(6.8, 6.5, 26.4)} ${chairXY(6.8, 6.5, 23.5)}
        L${chairXY(6.8, 6.5, 17)} Q${chairXY(0, 6.5, 15.5)} ${chairXY(-6.8, 6.5, 17)} Z`}
        fill={paint('cushion')} stroke="#6b492b" strokeWidth="1.4" strokeLinejoin="round" />
      <path d={`M${chairXY(-5.5, 6.5, 18)} L${chairXY(-5.5, 6.5, 23.2)}
        Q${chairXY(-5.5, 6.5, 25.2)} ${chairXY(-3.8, 6.5, 25.2)} L${chairXY(3.8, 6.5, 25.2)}`}
        fill="none" stroke="#b0b798" strokeWidth="0.4" strokeOpacity="0.65" />
    </g>}
    {interactive && <g transform="translate(0,-39)" className="opacity-0 group-hover/windsor-chair:opacity-100 transition-opacity duration-200 pointer-events-none">
      <rect x="-59" y="-8" width="118" height="17" rx="8" fill="#251d17" opacity="0.95" />
      <text x="0" y="3" fill="#f5eee3" fontSize="7" textAnchor="middle">{seated ? `${occupant?.name} · 桌前安静在场` : variant === 'retro' ? '复古固定脚办公椅 · 织物软垫' : '白橡木温莎椅 · 棉麻软垫'}</text>
    </g>}
  </g>;
};
