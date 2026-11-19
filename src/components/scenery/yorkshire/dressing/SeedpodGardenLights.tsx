import { useId } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { YardAttachment, YardObject } from '../../../../features/yard-editor/YardWorld';
import { YARD_OBJECTS } from '../../../../features/yard-editor/yardLayout';
import { ContactGroundShadow } from '../../../../world/render/GroundShadow';

const LAMPS = [
  { id: 'lamp_cottage_left', role: 'porch', small: true, facing: 1 },
  { id: 'lamp_cottage_right', role: 'porch', small: true, facing: -1 },
  { id: 'lamp_path_bend', role: 'path', small: false, facing: 1 },
  { id: 'lamp_entry_left', role: 'entry', small: false, facing: 1 },
  { id: 'lamp_entry_right', role: 'entry', small: false, facing: -1 },
] as const;

function lampPalette(theme: YorkshireSceneTheme, role: (typeof LAMPS)[number]['role']) {
  const time = theme.isNight ? 'night' : theme.timeOfDay === 'dusk' ? 'dusk' : 'day';
  const glass = time === 'night'
    ? { glass: '#edc690', glassLight: '#fff0ca' }
    : time === 'dusk' ? { glass: '#eddbb6', glassLight: '#fff1d2' } : { glass: '#e3d5b5', glassLight: '#fff3d7' };
  // Domestic enamel by the steps; honey-gold gate caps; a light malt-and-copper waymarker.
  const palettes = {
    porch: {
      day: { metal: '#e7d8b3', stem: '#bd934e', light: '#fff0cc', dark: '#95815b', brass: '#d0a35b', brassShade: '#9a743f' },
      dusk: { metal: '#d8c8a4', stem: '#ae8950', light: '#f5e3be', dark: '#827254', brass: '#d7af6b', brassShade: '#967447' },
      night: { metal: '#aaa58e', stem: '#8d794f', light: '#d4cbb0', dark: '#625f4d', brass: '#bda16a', brassShade: '#7e6c49' },
    },
    entry: {
      day: { metal: '#c59043', stem: '#594536', light: '#e8be72', dark: '#6d5233', brass: '#e5c58b', brassShade: '#94703c' },
      dusk: { metal: '#bd8b47', stem: '#544335', light: '#e1b675', dark: '#655038', brass: '#dfbf89', brassShade: '#8e6f42' },
      night: { metal: '#8f764d', stem: '#423c32', light: '#b7a272', dark: '#4d4737', brass: '#bba77b', brassShade: '#736346' },
    },
    path: {
      day: { metal: '#c79b60', stem: '#b28650', light: '#e1bd83', dark: '#8b6c43', brass: '#f4dba9', brassShade: '#aa8149' },
      dusk: { metal: '#bb935e', stem: '#a7804d', light: '#d7b680', dark: '#806644', brass: '#ebd2a2', brassShade: '#9e794a' },
      night: { metal: '#938367', stem: '#827355', light: '#b7a685', dark: '#615b47', brass: '#d4c29c', brassShade: '#8c7854' },
    },
  };
  return { ...palettes[role][time], ...glass };
}

function SeedpodLamp({ id, role, small, facing, theme }: (typeof LAMPS)[number] & { theme: YorkshireSceneTheme }) {
  const scope = 'seedpod-lamp-' + useId().replace(/:/g, '');
  const anchor = YARD_OBJECTS[id];
  const p = lampPalette(theme, role);
  // One champagne-rose ceramic cap beside the original cream porch lamp.
  const cap = id === 'lamp_cottage_right'
    ? theme.isNight
      ? { body: '#b49985', light: '#d6b69b', dark: '#786858' }
      : theme.timeOfDay === 'dusk'
        ? { body: '#d7ac8e', light: '#efd1af', dark: '#9b775f' }
        : { body: '#e6bc9e', light: '#f7ddbd', dark: '#ac8167' }
    : role === 'path'
      ? { body: p.light, light: p.brass, dark: p.metal }
      : { body: p.metal, light: p.light, dark: p.dark };
  const strength = theme.isNight ? 1 : theme.timeOfDay === 'dusk' ? .48 : 0;
  const size = small ? .76 : 1;
  const lift = small ? 0 : 24;
  return <>
    {/* Light belongs to the receiving ground, below depth-sorted bodies and feet. */}
    <YardAttachment id={id}>
      <g transform={`translate(${anchor.x} ${anchor.y})`} pointerEvents="none" aria-hidden="true" data-lamp-ground-light={id}>
        <defs>
          <radialGradient id={`${scope}-pool`}>
            <stop stopColor="#ffd28b" stopOpacity=".48" />
            <stop offset=".35" stopColor="#efbc70" stopOpacity=".24" />
            <stop offset=".72" stopColor="#e8b766" stopOpacity=".08" />
            <stop offset="1" stopColor="#e8b766" stopOpacity="0" />
          </radialGradient>
        </defs>
        {strength > 0 && <ellipse cx={facing * 7} cy="3" rx={small ? 43 : 58} ry={small ? 15 : 20}
          fill={`url(#${scope}-pool)`} opacity={strength * (id.startsWith('lamp_entry') ? .8 : 1)} />}
      </g>
    </YardAttachment>
    <YardObject id={id}>
      <g data-garden-lamp={id} data-lamp-size={small ? 'low' : 'path'}
        transform={`translate(${anchor.x} ${anchor.y}) scale(${size})`}
        pointerEvents="none" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
        <title>{anchor.name} · 弯叶与磨砂种荚灯</title>
        <defs>
          <linearGradient id={`${scope}-glass`} x1="0" y1="0" x2="1" y2=".35">
            <stop stopColor={p.glass} />
            <stop offset=".42" stopColor={p.glassLight} />
            <stop offset="1" stopColor={p.glass} />
          </linearGradient>
          <radialGradient id={`${scope}-halo`}>
            <stop stopColor="#ffda97" stopOpacity=".3" />
            <stop offset=".5" stopColor="#ffce7e" stopOpacity=".11" />
            <stop offset="1" stopColor="#ffce7e" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ContactGroundShadow cx={0} cy={1} rx={10} ry={3} color="#263b2b" opacity={.24} />
        {/* Cast foot: a squat three-lobed shoe, with a defined underside. */}
        <path d="M-8,0 Q-9,-3 -3,-3 L1,-5 5,-2 Q10,-2 9,1 Q4,4 -5,3Z" fill={p.dark} />
        <path d="M-8,-1 Q-5,-4 -2,-3 L1,-5 4,-2 Q8,-3 9,0 Q4,2 -3,1Z" fill={p.metal} />
        <path d="M-6,-1 Q-1,-3 3,-1" fill="none" stroke={p.light} strokeWidth=".7" />
        <g transform={`scale(${facing} 1)`}>
          {/* Stem curves into the canopy; tall versions add a lower stalk only. */}
          <path d={`M-1,0 Q-4,${-12 - lift / 2} -2,${-22 - lift} Q1,${-36 - lift} 11,${-37 - lift}`}
            stroke={p.dark} strokeWidth="4.2" fill="none" />
          <path d={`M-1.5,-1 Q-3,${-15 - lift / 2} -1,${-23 - lift} Q2,${-34 - lift} 10,${-36 - lift}`}
            stroke={p.stem} strokeWidth="2.5" fill="none" />
          {!small && <>
            <path d="M-2,-17 C-15,-16 -18,-25 -16,-30 Q-5,-28 -2,-17Z" fill={p.metal} />
            <path d="M-3,-18 Q-9,-23 -14,-26" stroke={p.light} strokeWidth=".65" fill="none" />
            <path d="M-2,-9 Q4,-19 11,-18 Q9,-10 -2,-9Z" fill={role === 'path' ? p.metal : p.dark} />
          </>}
          <g transform={`translate(8 ${-lift})`}>
            {strength > 0 && <ellipse cy="-23" rx="23" ry="26" fill={`url(#${scope}-halo)`} opacity={strength} />}
            {/* An open glass body rests in a shallow cup, with a slim rear-side support. */}
            <path d="M-6.8,-30.4 Q0,-32 7.4,-30.4 L7,-28.9 Q0,-30.3 -7,-28.9Z" fill={p.brassShade} />
            <path d="M6.8,-30 L8.4,-30 Q11,-24 8.8,-18 Q7.4,-14 3.6,-12.6 L3,-13.5 Q6.6,-15.5 8,-21 Q9,-25 6.8,-30Z" fill={p.brassShade} />
            <path d="M-7,-30 Q-10,-24 -6,-16 Q-3,-11 1,-12 Q8,-14 9,-23 L7,-30Z" fill={`url(#${scope}-glass)`} />
            <path d="M-5,-28 Q-7,-22 -3,-16 Q-1,-13 1,-14 Q-2,-20 -1,-28Z" fill={p.glassLight} opacity={strength ? .65 : .3} />
            <path d="M-7,-27 Q-8,-22 -5.9,-17" stroke={p.glassLight} strokeWidth=".65" opacity=".55" fill="none" />
            <path d="M7,-22 Q6.5,-17.5 3,-14.3" stroke={p.brass} strokeWidth=".55" opacity=".65" fill="none" />
            <path d="M-5.2,-14.7 Q0,-11.3 5.2,-14.7 L4.5,-12.9 Q0,-10.8 -4.5,-12.9Z" fill={p.brassShade} />
            <path d="M-4.7,-14.2 Q0,-11.9 4.7,-14.2" stroke={p.brass} strokeWidth=".65" fill="none" />
            {/* Folded leaf cap shades the upper sky; its lip has thickness. */}
            <path d="M-15,-29 Q-12,-36 -4,-37 Q4,-40 12,-34 L17,-31 Q10,-27 4,-29 Q-5,-26 -15,-29Z" fill={cap.dark} />
            <path d="M-15,-31 Q-11,-38 -3,-39 Q6,-41 13,-35 L17,-33 Q8,-29 2,-31 Q-7,-28 -15,-31Z" fill={cap.body} />
            <path d="M-12,-32 Q-4,-37 4,-36 Q10,-35 13,-34 Q3,-37 -4,-32Z" fill={cap.light} />
            <path d="M-10,-31 Q0,-35 11,-33" stroke={p.brass} strokeWidth=".55" opacity=".7" fill="none" />
            {strength > 0 && <path d="M-10,-29 Q-2,-27 6,-30" stroke={p.glassLight} strokeWidth=".75" opacity={strength * .65} fill="none" />}
            <path d="M3,-38 Q6,-42 10,-40" stroke={cap.body} strokeWidth="2" fill="none" />
          </g>
        </g>
      </g>
    </YardObject>
  </>;
}

export function SeedpodGardenLights({ theme }: { theme: YorkshireSceneTheme }) {
  return <>{LAMPS.map(lamp => <SeedpodLamp key={lamp.id} {...lamp} theme={theme} />)}</>;
}
