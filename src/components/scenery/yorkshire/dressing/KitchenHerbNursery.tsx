import type { YorkshireSceneTheme } from '../landscapeTypes';
import { YardObject } from '../../../../features/yard-editor/YardWorld';
import { YARD_OBJECTS } from '../../../../features/yard-editor/yardLayout';
import { KitchenHerbPlant } from './KitchenGardenPlants';
import { useId } from 'react';

/** A low kitchen herb trough with a rosemary pot; the whole garden is one movable yard object. */
export function KitchenHerbNursery({ theme }: { theme: YorkshireSceneTheme }) {
  const soilClip='herb-trough-'+useId().replace(/:/g,'');
  const anchor=YARD_OBJECTS.herb_nursery;
  const p=theme.isNight
    ? {wood:'#807052',face:'#615843',end:'#454638',edge:'#9a8763',seam:'#343a31',soil:'#363c32',pot:'#638b91',potShade:'#45676f',potLight:'#8eacac',potRim:'#a1b4ae',potEdge:'#3c5a60',label:'#b6ad85'}
    : theme.timeOfDay==='dusk'
      ? {wood:'#ba925c',face:'#977044',end:'#694c32',edge:'#d4b377',seam:'#563c2a',soil:'#483827',pot:'#88aba9',potShade:'#607f83',potLight:'#b3c8bd',potRim:'#cbd3ba',potEdge:'#49696b',label:'#dfc58b'}
      : {wood:'#c39c66',face:'#a67c4b',end:'#715137',edge:'#dfbb7e',seam:'#5d422d',soil:'#473625',pot:'#8db9bc',potShade:'#638f96',potLight:'#b5d3ce',potRim:'#d5e1d2',potEdge:'#50767d',label:'#e5d09b'};
  return <YardObject id="herb_nursery">
    <g id="kitchen-herb-nursery" transform={`translate(${anchor.x} ${anchor.y})`} pointerEvents="none" aria-hidden="true">
      <title>薄荷、柠檬香蜂草与迷迭香苗圃</title>
      <defs><clipPath id={soilClip}>
        <path d="M-100,-150 L100,-150 100,12.2 -100,-44.8Z" />
      </clipPath></defs>
      <ellipse cx="8" cy="4" rx="55" ry="8" fill={p.seam} opacity=".085" />
      <ellipse cx="-41.5" cy="-5.5" rx="4.2" ry="1.2" fill={p.seam} opacity=".34" />
      <ellipse cx="31.5" cy="11.2" rx="4" ry="1.1" fill={p.seam} opacity=".36" />
      {/* Low timber trough, with a shallow open top and a distinct end face. */}
      <path d="M-44,-16 L-39,-14.6 -39,-5 -44,-6.4Z M29,5 L34,6.4 34,12 29,10.6Z" fill={p.end} />
      <path d="M-44,-15.8 L-39,-14.4 -39,-12.4 -44,-13.8Z M29,5.1 L34,6.5 34,8.3 29,6.9Z" fill={p.seam} opacity=".6" />
      <path d="M-48,-30 L34,-6.6 51,-11.45 -31,-34.85Z" fill={p.wood} />
      <path d="M-43,-29.3 L33,-7.6 46,-11.3 -30,-33Z" fill={p.soil} />
      <path d="M-48,-30 L34,-6.6 34,7.4 -48,-16Z" fill={p.face} />
      <path d="M34,-6.6 L51,-11.45 51,2.55 34,7.4Z" fill={p.end} />
      <path d="M-47.5,-28.8 L33.5,-5.7 M35,-5.9 L50,-10.2" fill="none" stroke={p.seam} strokeWidth="1.1" opacity=".4" />
      <path d="M-48,-30 L34,-6.6 51,-11.45" fill="none" stroke={p.edge} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M-47,-23.1 L33,.1 M34,.1 L50,-4.5" fill="none" stroke={p.seam} strokeWidth=".7" opacity=".78" />
      <path d="M-37,-24 Q-27,-22 -19,-19.3 M-7,-14.9 Q2,-13.5 13,-9.1 M21,-.3 L29,2" fill="none" stroke={p.edge} strokeWidth=".5" opacity=".5" strokeLinecap="round" />
      <path d="M-44,-27.8 L-44,-16 M30,-6.8 L30,5.1 M46,-9.6 L46,1.7" stroke={p.wood} strokeWidth="2.5" />
      {[[-44,-26],[-44,-18],[30,-5],[30,3],[46,-8],[46,0]].map(([x,y],i) => <circle key={i} cx={x} cy={y} r=".55" fill={p.seam} />)}
      {/* The plants' roots sit inside the trough. Foliage hangs over the front lip. */}
      <g clipPath={`url(#${soilClip})`}>
      <g transform="translate(-32 -29) scale(1.05)"><KitchenHerbPlant kind="mint" theme={theme} variation={0} /></g>
      <g transform="translate(-13 -23.5) scale(.8)"><KitchenHerbPlant kind="mint" theme={theme} variation={2} /></g>
      <g transform="translate(5 -18.4) scale(1.08)"><KitchenHerbPlant kind="lemonBalm" theme={theme} variation={1} /></g>
      <g transform="translate(25 -12.6) scale(.82)"><KitchenHerbPlant kind="lemonBalm" theme={theme} variation={2} /></g>
      </g>
      <path d="M-47,-29.7 L33.6,-6.7" fill="none" stroke={p.edge} strokeWidth="1" strokeLinecap="round" />
      <g transform="translate(64 3)">
        <ellipse cx="1" cy="1.5" rx="9" ry="2.3" fill={p.seam} opacity=".12" />
        <ellipse cx="0" cy=".4" rx="6.1" ry="1.3" fill={p.seam} opacity=".34" />
        {/* A rounded glazed planter: quiet blue body, fine pale lip and tucked foot. */}
        <path d="M-5.5,-1.5 L-5.1,.1 Q0,1.8 5.1,.1 L5.5,-1.5Z" fill={p.potShade} />
        <path d="M-8.6,-14 C-8.7,-10 -9.3,-5.4 -6.4,-2 Q0,1.5 6.4,-2 C9.3,-5.4 8.7,-10 8.6,-14Z" fill={p.pot} stroke={p.potEdge} strokeWidth=".45" />
        <path d="M5.3,-13.5 Q7.2,-8.4 5.3,-3.6 Q4.2,-1.9 1.2,-1.1 Q4.5,-.7 6.4,-2 C9.3,-5.4 8.7,-10 8.6,-14Z" fill={p.potShade} />
        <path d="M-6.3,-10.7 Q-7,-7.4 -5.4,-4.6" fill="none" stroke={p.potLight} strokeWidth="1.15" strokeLinecap="round" />
        <ellipse cy="-14" rx="8.8" ry="2.7" fill={p.potRim} stroke={p.potEdge} strokeWidth=".4" />
        <ellipse cy="-14" rx="7.2" ry="1.9" fill={p.potShade} />
        <ellipse cy="-13.7" rx="6.8" ry="1.5" fill={p.soil} />
        <g transform="translate(0 -14) scale(.95)"><KitchenHerbPlant kind="rosemary" theme={theme} variation={1} /></g>
        <path d="M-8.6,-14 A8.6,2.6 0 0 0 8.6,-14" fill="none" stroke={p.potLight} strokeWidth=".85" />
      </g>
      {/* A small hand-written label sits on the front board rather than hiding the leaves. */}
      <g transform="translate(-18 -15) rotate(16)">
        <rect x="-10" y="-3.2" width="20" height="6.4" rx=".8" fill={p.label} />
        <text y="1.7" textAnchor="middle" fontSize="4.6" fill={p.seam} fontWeight="600">香草</text>
        <circle cx="-8" r=".45" fill={p.seam} /><circle cx="8" r=".45" fill={p.seam} />
      </g>
    </g>
  </YardObject>;
}
