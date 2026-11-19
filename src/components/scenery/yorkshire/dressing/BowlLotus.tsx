import { useId } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { YardObject } from '../../../../features/yard-editor/YardWorld';
import { YARD_OBJECTS } from '../../../../features/yard-editor/yardLayout';
import { ContactGroundShadow } from '../../../../world/render/GroundShadow';

function lotusPalette(theme: YorkshireSceneTheme) {
  if (theme.isNight) return { bowl: '#929f90', bowlShade: '#637e72', rim: '#bec6ad', water: '#547e7d', waterDeep: '#3f666a', gleam: '#a7c4b5', leaf: '#5f8457', leafLight: '#8fa578', leafShade: '#3d654a', pink: '#b78898', pinkLight: '#dac0bc', pinkShade: '#916782', heart: '#c6aa70' };
  if (theme.timeOfDay === 'dusk') return { bowl: '#c3cbb1', bowlShade: '#8eaa94', rim: '#e4e3c7', water: '#88aaa0', waterDeep: '#5a8881', gleam: '#d5e0c6', leaf: '#79974f', leafLight: '#b1bf77', leafShade: '#536f43', pink: '#dfa2ad', pinkLight: '#f7d9cb', pinkShade: '#b97794', heart: '#e6ba69' };
  return { bowl: '#c8d5be', bowlShade: '#91ab96', rim: '#e5ead3', water: '#85b4aa', waterDeep: '#548b84', gleam: '#d8ead6', leaf: '#729b55', leafLight: '#b0c67e', leafShade: '#47764b', pink: '#e8a6b2', pinkLight: '#ffe0d8', pinkShade: '#c77794', heart: '#e8be65' };
}
type Palette = ReturnType<typeof lotusPalette>;

/** Peltate lotus leaves have whole, gently rippled edges and veins meeting inside the blade. */
function LotusLeaf({ x, y, scale = 1, p }: { x: number; y: number; scale?: number; p: Palette }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}>
    <path d="M-8,0 Q-9,-3 -5,-4 Q-2,-6 2,-4.6 Q6,-5 8,-2 Q10,1 6,3 Q3,5 -1,3.9 Q-6,5 -8,0Z" fill={p.leafShade} />
    <path d="M-8,-.7 Q-9,-3 -5,-4 Q-2,-6 2,-4.6 Q6,-5 8,-2 Q10,0 6,2 Q3,4 -1,3.2 Q-6,4 -8,-.7Z" fill={p.leaf} />
    <path d="M-6,-2 Q-3,-4 0,-3.7 L-.6,-.4Z M1,-3.6 Q5,-3.6 6.7,-1.8 L.4,-.2Z" fill={p.leafLight} opacity=".7" />
    <path d="M-5.5,-2.8 L0,-.4 5.7,-1.8 M-5,1.4 L0,-.4 3.8,2.1 M0,-.4 L.8,-3.5" fill="none" stroke={p.leafLight} strokeWidth=".45" opacity=".8" />
    <ellipse cy="-.4" rx=".8" ry=".5" fill={p.leafLight} />
  </g>;
}

/** A small water-grown lotus: an open bloom, a raised leaf, and floating leaves above visible water. */
export function BowlLotus({ theme }: { theme: YorkshireSceneTheme }) {
  const uid = 'bowl-lotus-' + useId().replace(/:/g, '');
  const p = lotusPalette(theme);
  const anchor = YARD_OBJECTS.bowl_lotus;
  return <YardObject id="bowl_lotus">
    <g id={uid} data-bowl-lotus="flowering" transform={`translate(${anchor.x} ${anchor.y})`}
      pointerEvents="none" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
      <title>青瓷水培碗莲 · 粉白盛花、浮叶与清水</title>
      <defs>
        <linearGradient id={`${uid}-glaze`} x1="0" y1="0" x2="1" y2=".15">
          <stop stopColor={p.bowlShade} /><stop offset=".25" stopColor={p.bowl} />
          <stop offset=".65" stopColor={p.bowl} /><stop offset="1" stopColor={p.bowlShade} />
        </linearGradient>
      </defs>
      <ContactGroundShadow cx={0} cy={1} rx={17} ry={3.5} color={p.leafShade} opacity={.18} />
      <ellipse cy="-.3" rx="10" ry="2.2" fill={p.bowlShade} />
      <path d="M-21,-15 C-20,-7 -17,-1 -9,0 Q0,2.4 9,0 C17,-1 20,-7 21,-15Z" fill={`url(#${uid}-glaze)`} />
      <path d="M-16.5,-10 Q-15,-5 -10,-3.7" fill="none" stroke={p.rim} strokeWidth="1.1" opacity=".6" />
      <ellipse cy="-15" rx="21" ry="6.5" fill={p.rim} />
      <ellipse cy="-15.2" rx="18.9" ry="5.1" fill={p.waterDeep} />
      <ellipse cy="-14.7" rx="18" ry="4.3" fill={p.water} />
      <path d="M-14,-16.2 Q-8,-18.4 -3,-17.3 M8,-13.4 Q12,-13.7 15,-15" stroke={p.gleam} strokeWidth=".65" fill="none" />
      {/* Roots remain beneath the water; each visible stem meets its leaf or flower. */}
      <path d="M-6,-14 Q-9,-22 -9,-28 M3,-14 Q3,-25 7,-37" fill="none" stroke={p.leafShade} strokeWidth="1.1" />
      <LotusLeaf x={-9} y={-28} scale={.9} p={p} />
      <LotusLeaf x={-9} y={-14.8} scale={.8} p={p} />
      <LotusLeaf x={8.5} y={-13.3} scale={.78} p={p} />
      <path d="M-20.4,-14 Q-17,-9.5 0,-9 Q17,-9.5 20.4,-14" fill="none" stroke={p.rim} strokeWidth="1.1" />
      <g transform="translate(7 -37)" data-lotus-bloom="open">
        <path d="M0,3 Q-5,-1 -3,-9 Q1,-7 2,-3 Q3,-9 7,-11 Q10,-4 4,2Z" fill={p.pinkShade} />
        <path d="M0,2 Q-6,-4 -2,-13 Q4,-8 3,-1Z" fill={p.pink} />
        <path d="M-1,2 Q-9,1 -12,-6 Q-5,-8 0,-1 Q6,-8 12,-6 Q10,2 3,3Z" fill={p.pink} />
        <path d="M0,2 Q-6,-1 -7,-9 Q0,-7 2,0 Q5,-7 10,-9 Q11,-2 3,3Z" fill={p.pinkLight} />
        <path d="M-1,2 Q-8,3 -13,-1 Q-6,-3 -1,0 Q4,-3 11,-2 Q8,4 1,4Z" fill={p.pink} />
        <path d="M-8,-.3 Q-4,0 -1,2 Q3,-.4 7,-.9 Q4,3.8 -.5,3.3 Q-5,2.9 -8,-.3Z" fill={p.pinkLight} />
        <ellipse cy=".1" rx="2.8" ry="1.5" fill={p.heart} />
        <path d="M-1.5,-.7 L-2,-1.8 M0,-1 L.2,-2.2 M1.4,-.6 L2,-1.7" stroke={p.heart} strokeWidth=".7" />
        <path d="M-2.5,3 Q0,5 3,2.9 L1,5Z" fill={p.leaf} />
      </g>
    </g>
  </YardObject>;
}
