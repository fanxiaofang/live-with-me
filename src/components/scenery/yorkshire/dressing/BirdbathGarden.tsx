import { useId } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { timberColor } from '../../../architecture/TimberFloorMaterial';
import { YardObject } from '../../../../features/yard-editor/YardWorld';
import { YARD_OBJECTS } from '../../../../features/yard-editor/yardLayout';
import { Grass, Plant } from '../vegetation/MeadowVegetationAssets';
import { meadowPlantPaletteCss } from '../vegetation/meadowPalette';

function woodlandPalette(theme: YorkshireSceneTheme) {
  const time = theme.isNight ? 'night' : theme.timeOfDay ?? 'day';
  const wood = (colour: string) => timberColor(colour, time);
  const light = theme.isNight
    ? { clay:'#a18160', clayShade:'#6e5747', clayLight:'#b49b77', lip:'#c2ae8a', inside:'#b6aa8b', cavity:'#655d49', water:'#668a97', waterDeep:'#466773', reflection:'#b9cfca', stone:'#8c9481', stoneShade:'#626e60', bird:'#73816e', breast:'#b5b69c' }
    : theme.timeOfDay === 'dusk'
      ? { clay:'#c39362', clayShade:'#916446', clayLight:'#d5ae78', lip:'#e3c897', inside:'#dfc99e', cavity:'#8c7550', water:'#9cbbb5', waterDeep:'#719b9b', reflection:'#e1ead4', stone:'#aaa98c', stoneShade:'#747e66', bird:'#808269', breast:'#d8c9a5' }
      : { clay:'#cd9b65', clayShade:'#976747', clayLight:'#deb781', lip:'#e9cc9a', inside:'#e8d3ab', cavity:'#8c7857', water:'#83b9c0', waterDeep:'#6e9ca4', reflection:'#edf5dd', stone:'#b1b39c', stoneShade:'#7a856c', bird:'#77836e', breast:'#e2d4b3' };
  return { ...light, wood:wood('#966b49'), woodShade:wood('#624b35'), woodLight:wood('#b48c5b'), grain:wood('#6d5039') };
}

/** A small woodland-made water dish: a clay leaf rests in a fork, rather than on a plinth. */
export function BirdbathGarden({ theme }: { theme: YorkshireSceneTheme }) {
  const uid = 'woodland-birdbath-' + useId().replace(/:/g, '');
  const anchor = YARD_OBJECTS.cottage_bird_garden;
  const p = woodlandPalette(theme);
  return <YardObject id="cottage_bird_garden">
    <g id={uid} data-cottage-garden="cottage_bird_garden" data-birdbath-design="woodland-fork"
      transform={`translate(${anchor.x} ${anchor.y})`} pointerEvents="none" aria-hidden="true" strokeLinecap="round" strokeLinejoin="round">
      <title>林间枝托鸟浴：浅杏陶盘、木叉枝与小鸟</title>
      <style>{meadowPlantPaletteCss(theme, `#${uid}`)}</style>
      <defs>
        <linearGradient id={`${uid}-clay`} x1="0" y1="0" x2=".25" y2="1">
          <stop stopColor={p.clayLight} /><stop offset=".58" stopColor={p.clay} /><stop offset="1" stopColor={p.clayShade} />
        </linearGradient>
        <linearGradient id={`${uid}-water`} x1="0" y1="0" x2=".15" y2="1">
          <stop stopColor={p.waterDeep} stopOpacity=".65" />
          <stop offset=".48" stopColor={p.water} stopOpacity=".42" />
          <stop offset="1" stopColor={p.water} stopOpacity=".18" />
        </linearGradient>
      </defs>
      {/* The planting is open toward the path and gathers behind the water dish. */}
      <g transform="translate(-26 -2)">
        <Grass type="woven" scale={.29} />
        <g transform="translate(-5 1) scale(.37)"><Plant species="daisy" /></g>
      </g>
      <g transform="translate(24 -5) scale(.41)"><Plant species="clover" /></g>
      <ellipse cx="1" cy="4.3" rx="27" ry="5.5" fill={p.woodShade} opacity=".075" />
      {/* Low setting stones receive the roots; the stand has no oversized base plate. */}
      <g transform="translate(11 -.3)" data-birdbath-footing="rear-right">
        <path d="M-5,0 Q-6,-2.5 -1,-3 Q4.5,-3.6 6.5,-.8 L5.6,1.2 Q0,2.5 -4.5,1.4Z" fill={p.stoneShade} />
        <path d="M-5,0 Q-6,-2.5 -1,-3 Q4.5,-3.6 6.5,-.8 Q2,.6 -2,.7Z" fill={p.stone} />
      </g>
      <g transform="translate(-9 1.5)" data-birdbath-footing="left">
        <path d="M-8,0 Q-7,-4 0,-4 Q6,-4 8,-1 L7,2 Q0,4 -7,2Z" fill={p.stoneShade} />
        <path d="M-8,0 Q-7,-4 0,-4 Q6,-4 8,-1 Q2,1 -2,1Z" fill={p.stone} />
      </g>
      <g transform="translate(9 3)" data-birdbath-footing="front-right">
        <path d="M-6,-1 Q-3,-4 3,-3 L7,0 5,2 -4,2Z" fill={p.stoneShade} />
        <path d="M-6,-1 Q-3,-4 3,-3 L7,0 1,1 -4,0Z" fill={p.stone} />
      </g>
      <ellipse cy="1.4" rx="13" ry="2.3" fill={p.woodShade} opacity=".2" />
      <ellipse cx="10.9" cy="-1.2" rx="3.7" ry=".75" fill={p.woodShade} opacity=".26" />
      {/* The forks penetrate the underside of the dish and keep a gap between their boughs. */}
      <path d="M1,-11 Q5,-7 10,-5 Q14,-4 12,-2 Q7,-1 3,-4 L-1,-7Z" fill={p.woodShade} />
      <path d="M-3,-13 Q-7,-15 -10,-20 L-14,-21 Q-16,-20 -12,-16 Q-9,-10 -4,-10 C-4,-6 -6,-2 -12,-.4 Q-15,1 -11,2 Q-4,2 0,-2 Q4,2 10,1.5 Q13,1 10,-.7 Q4,-2 3,-7 Q2,-10 5,-12 Q11,-14 13,-19 L10,-21 Q8,-17 4,-16 Q0,-14 -3,-13Z" fill={p.wood} />
      <path d="M1,-13 Q4,-15 10,-18 L13,-19 Q11,-14 5,-12 Q2,-10 3,-7 Q4,-2 10,-.7 Q13,1 10,1.5 Q4,2 0,-2 Q1,-7 -1,-9Z" fill={p.woodShade} />
      <path d="M-10,.2 Q-4,-1 -2,-5 Q-.5,-8 -2,-11 M-11,-19 Q-8,-14 -5,-14 M6,-15 l3,-2" stroke={p.woodLight} strokeWidth=".8" fill="none" />
      <path d="M-4,-4.5 Q-2,-6 -2.8,-8 M3,-6 l1.1,2.4" stroke={p.grain} strokeWidth=".45" opacity=".65" fill="none" />
      {/* A shallow clay leaf: rounded, asymmetrical and warm, with a folded tip on the right. */}
      <path d="M-23,-27 C-22,-20 -15,-17.6 -3,-17.7 C10,-16.6 21,-20.5 24,-27 L12,-29 -13,-29Z" fill={p.clayShade} />
      <path d="M-22,-26.5 C-19,-21.7 -10,-19.2 -1,-19.5 Q10,-18.5 18,-23 L14,-25 Q1,-21.3 -11,-25Z" fill={`url(#${uid}-clay)`} />
      <path d="M-24,-27.7 C-23.7,-32.8 -9,-35.4 1,-33 Q14,-34 22,-30.1 L26,-29 Q24.7,-25.5 20,-23.7 C12,-19.7 -9,-20.2 -20,-23.4 Q-23.8,-24.8 -24,-27.7Z" fill={p.clayLight} />
      <path d="M-22.5,-28.5 C-20,-32 -8,-33.4 0,-31.7 Q12,-32.9 20,-29.6 L23.4,-28.8 Q12,-31.5 -1,-30.9 Q-15,-30.6 -22.5,-28.5Z" fill={p.lip} />
      {/* Clear shallow water reveals the warm basin; recess shade stays on its rear wall. */}
      <ellipse cx="-1" cy="-27.4" rx="18.2" ry="4.7" fill={p.inside} />
      <path d="M-19.2,-27.4 C-19.2,-30 -11,-32.1 -1,-32.1 C9,-32.1 17.2,-30 17.2,-27.4 C14,-29.6 7,-30.8 -1,-30.8 C-9,-30.8 -16,-29.6 -19.2,-27.4Z" fill={p.cavity} opacity=".35" />
      <ellipse cx="-1" cy="-27.1" rx="16.9" ry="3.55" fill={p.inside} />
      <ellipse cx="-1" cy="-26.3" rx="12.8" ry="1.9" fill={p.lip} opacity=".28" />
      <ellipse cx="-1" cy="-27.1" rx="16.9" ry="3.55" fill={`url(#${uid}-water)`} />
      <path d="M-14,-28.2 Q-9,-29.7 -3.5,-29.3 M1.5,-29.2 L4,-29 M5.5,-25.7 Q9,-25.8 12,-27" stroke={p.reflection} strokeWidth=".5" opacity=".9" fill="none" />
      <path d="M-11,-25.8 Q-5,-24.2 1,-24.9" stroke={p.reflection} strokeWidth=".35" opacity=".48" fill="none" />
      {/* A partial warm seam explains the front lip; it is not an outline around the whole bowl. */}
      <path d="M-19,-24 Q-10,-20.9 0,-21.3 Q10,-20.8 17,-23.4" stroke={p.clayShade} strokeWidth=".6" opacity=".55" fill="none" />
      <path d="M-11,-20.8 Q-5,-18.7 0,-19.1 M5,-19.6 l4,-.9" stroke={p.clayLight} strokeWidth=".65" fill="none" opacity=".7" />
      <g data-birdbath-bird="" transform="translate(15.5 -31.2)">
        <path d="M-1,-.5 L-1.5,1.7 M2,-.3 L2,1.3 M-2.8,1.8 l2.2,.1 M.7,1.5 l2,-.2" stroke={p.woodShade} strokeWidth=".55" fill="none" />
        <path d="M2.9,-4 L8,-2.2 6.6,-.6 2,-1.1Z" fill={p.woodShade} />
        <path d="M-3,-5 Q-1.5,-8 2,-6.2 Q5.6,-5 4,-1.1 Q2.3,.8 -1.1,-.2Z" fill={p.bird} />
        <path d="M-2,-4 Q.5,-5.3 2.5,-3.5 L1.7,-.7 Q-.9,.3 -2,-2Z" fill={p.breast} />
        <path d="M.1,-5 Q4,-5.8 3.9,-2.2 Q1.3,-1.2 .1,-5Z" fill={p.woodShade} />
        <circle cx="-3.1" cy="-5" r="2.65" fill={p.bird} />
        <path d="M-5.2,-5.7 L-8,-5 -5.1,-3.8Z" fill={p.clay} />
        <circle cx="-4" cy="-5.6" r=".45" fill={p.woodShade} />
      </g>
      <g transform="translate(-20 10) scale(.37)"><Plant species="daisy" /></g>
      <Grass type="short" x={21} y={10} scale={.22} />
    </g>
  </YardObject>;
}
