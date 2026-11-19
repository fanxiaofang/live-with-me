import { useId } from 'react';
import type { HoverTarget } from '../../world/interactions/interactionTypes';
import { svgAction } from '../../world/interactions/svgAction';
import { IsoGizmo, type EditableObjectId, type RoomLayoutConfig } from '../layout-gizmo';
import type { YorkshireSceneTheme } from '../scenery/yorkshire/landscapeTypes';

type Props = {
  theme: YorkshireSceneTheme;
  layout: RoomLayoutConfig;
  effectiveGizmoId?: EditableObjectId | null;
  isInspectorOpen?: boolean;
  onHover: HoverTarget;
  onSelectGizmo?: (id: EditableObjectId | null) => void;
  onDragGizmoDelta?: (dx: number, dy: number) => void;
  onDragGizmoEnd?: () => void;
};

/** The old chime's stable edit ID now belongs to a single copper bell on the post. */
export function CottageCopperBell({ theme, layout, effectiveGizmoId, isInspectorOpen, onHover, onSelectGizmo, onDragGizmoDelta, onDragGizmoEnd }: Props) {
  const point = layout['craft-wind-chime'].screen;
  const glowId = 'copper-bell-glow-' + useId().replace(/:/g, '');
  const copper = theme.isNight
    ? { body: '#c39a79', shade: '#9d7055', light: '#f2ca95', inside: '#b48957', hook: '#a58d67', tag: '#f4dfaf' }
    : theme.timeOfDay === 'dusk'
      ? { body: '#d7956c', shade: '#ae704f', light: '#f4c69a', inside: '#925d42', hook: '#bf9968', tag: '#efdfb9' }
      : { body: '#da9473', shade: '#b77959', light: '#f5cba4', inside: '#975538', hook: '#b99671', tag: '#efdfbe' };
  return <g {...svgAction('左柱铜铃')} id="craft-wind-chime" data-cottage-copper-bell=""
    transform={`translate(${point.x} ${point.y})`} strokeLinecap="round" strokeLinejoin="round"
    onMouseEnter={() => onHover({ kind: 'furniture-part', id: 'craft-wind-chime' })}
    onMouseLeave={() => onHover(null)}
    onClick={event => {
      event.stopPropagation();
      if (isInspectorOpen) onSelectGizmo?.(effectiveGizmoId === 'craft-wind-chime' ? null : 'craft-wind-chime');
    }}>
    <title>左侧木柱上的小铜铃</title>
    <g transform="scale(.66)">
    <rect x="-4" y="-4" width="29" height="46" fill="transparent" />
    {theme.isNight && <g pointerEvents="none" aria-hidden="true">
      <defs>
        <radialGradient id={glowId}>
          <stop stopColor="#ffe0a0" stopOpacity=".42" />
          <stop offset=".42" stopColor="#f8c985" stopOpacity=".17" />
          <stop offset="1" stopColor="#edb776" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="14" cy="23" rx="20" ry="25" fill={`url(#${glowId})`} />
    </g>}
    {/* A small rounded fixing and curled hook replace the heavy triangular bracket. */}
    <ellipse cy="2" rx="1.8" ry="3.6" fill={copper.hook} />
    <circle cy="1" r=".65" fill={copper.light} />
    <path d="M1,2 C5,0 10,0 14,2 Q18,4 15,6 Q13,7 12,5" fill="none" stroke={copper.hook} strokeWidth="1.3" />
    <path d="M2,1.5 Q8,-.3 13.5,2" fill="none" stroke={copper.light} strokeWidth=".45" />
    <ellipse cx="14" cy="8.5" rx="1.8" ry="2.5" fill="none" stroke={copper.hook} strokeWidth=".9" />
    {/* A soft, squat copper dome, with one small flower stamp rather than surface noise. */}
    <path d="M5,23 C7,20 5.5,15 8.8,12.3 Q13.5,8.6 18.6,12.1 C22,14.5 20.5,20 23,23 L23.4,24.8 Q14,28.2 4.6,24.8Z" fill={copper.body} />
    <path d="M17,11.4 Q22,13.3 21,19.3 L23.4,24.8 Q20,26.2 17.5,26.5 Q20,22 18.5,18 Q19,14.3 17,11.4Z" fill={copper.shade} />
    <path d="M8.8,14.4 Q9.4,12 12.6,12 Q14.5,12.2 13.1,13.5 Q10.1,15.3 9.5,19.4 Q7.5,20.6 8.8,14.4Z" fill={copper.light} />
    {theme.isNight && <ellipse cx="14" cy="18" rx="6" ry="5" fill={`url(#${glowId})`} opacity=".7" />}
    <path d="M13.8,17.9 C10.5,17.6 10.9,15.2 12.7,15.6 Q13.8,15.9 13.8,17.1 Q14.4,14.5 16,15.4 Q17.1,16.6 14.7,17.9 Q17.6,17.5 17.2,19.2 Q16.1,20.6 14.5,18.8 Q14.8,21.2 13.1,20.6 Q11.9,19.6 13.8,17.9Z" fill={theme.isNight ? '#ffe9ba' : copper.light} opacity={theme.isNight ? .98 : .8} />
    <ellipse cx="14" cy="24.8" rx="9.4" ry="2.4" fill={copper.shade} />
    <ellipse cx="14" cy="24.8" rx="7.8" ry="1.35" fill={copper.inside} />
    {theme.isNight && <ellipse cx="14" cy="25" rx="6.7" ry=".8" fill="#ffdda0" opacity=".55" />}
    <path d="M4.9,24.6 Q14,27.3 23.1,24.6" stroke={copper.light} strokeWidth=".8" fill="none" />
    <path d="M14,24.5 V30.8" stroke={copper.hook} strokeWidth=".65" />
    <ellipse cx="14" cy="28.4" rx="1.6" ry="1.35" fill={copper.light} />
    {/* One little ivory leaf catches the breeze; it stays smaller than the bell. */}
    {theme.isNight && <ellipse cx="14.8" cy="34" rx="6" ry="7" fill={`url(#${glowId})`} opacity=".65" />}
    <path d="M14,30.5 C18.8,31.8 18.5,36.1 14.7,38 Q11.4,35.8 14,30.5Z" fill={copper.tag} />
    <path d="M14.1,32.1 Q15.8,34 14.8,36.4" stroke={copper.hook} strokeWidth=".4" opacity=".55" fill="none" />
    </g>
    {effectiveGizmoId === 'craft-wind-chime' && <IsoGizmo pos={{ x: 9.24, y: 11.88 }} displayCoords={point}
      fixedW={0} label="左柱小铜铃" onDragDelta={(dx, dy) => onDragGizmoDelta?.(dx, dy)} onDragEnd={() => onDragGizmoEnd?.()} />}
  </g>;
}
