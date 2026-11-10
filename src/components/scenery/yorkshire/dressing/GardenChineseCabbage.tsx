import type { YorkshireSceneTheme } from '../landscapeTypes';

/** Napa cabbage: a broad pale base, thick ribs and upright leaves wrapping a yellow-green heart. */
export function GardenChineseCabbage({theme,variation}:{theme:YorkshireSceneTheme;variation:number}) {
  const p=theme.isNight
    ? {deep:'#3f5b39',leaf:'#66834b',light:'#8da362',heart:'#a7b67a',rib:'#bbc4a0',shade:'#8c9c72'}
    : theme.timeOfDay==='dusk'
      ? {deep:'#4d6b32',leaf:'#7c9846',light:'#a9be65',heart:'#c5ce8a',rib:'#d8d5ad',shade:'#aab77a'}
      : {deep:'#416b35',leaf:'#739c45',light:'#a4c565',heart:'#c8d990',rib:'#e1e2bc',shade:'#b2c58a'};
  const pose=variation%3;
  return <g data-garden-chinese-cabbage="thick-ribs-wrapped-heart" transform={`rotate(${[-2,2,0][pose]} 0 0)`}>
    {/* The head has a rounded base rather than a pointed cluster of leaf stalks. */}
    <path d="M-4.2,-.1 C-8,-4.4 -9.1,-13.6 -6.8,-20.6 Q-5.5,-25.7 -.5,-25.3 Q5.2,-26.1 7,-20.7 C9.5,-13.9 7.7,-4.4 4,-.1 Q0,1.3 -4.2,-.1Z" fill={p.rib} />
    {/* The right blade is seen edge-on behind the heart; green is confined to its upper leaf face. */}
    <g transform={`rotate(${pose===1 ? 4 : pose===2 ? -2 : 0} 6 -11)`}>
      <path d="M5.2,-9.4 C9.5,-10.7 11.5,-15.7 9,-19.1 Q10.5,-21 8.4,-21.7 Q6.6,-23.1 5.6,-20.8 C4.7,-18.6 7.2,-16.2 6,-13.8 Q5,-11.8 5.2,-9.4Z" fill={p.leaf} />
      <path d="M6.6,-12.8 Q9.1,-15.6 8.2,-18.7" fill="none" stroke={p.shade} strokeWidth=".5" opacity=".65" strokeLinecap="round" />
    </g>
    <path d="M-6.6,-13.5 Q-8.3,-18.4 -6.2,-22.4 Q-6.7,-24.7 -4.5,-24.7 Q-3.2,-27.3 -1.2,-25.7 Q1,-27.5 2.9,-25.6 Q5.5,-26.1 5.8,-23.7 Q8.2,-21.4 6.4,-18.7 Q7,-14.1 3.3,-10.5 Q-1,-9.1 -6.6,-13.5Z" fill={p.heart} />
    <path d="M-4.8,-21.9 Q-3.2,-25.7 -.8,-23.4 Q1.8,-25.3 3.5,-22.4 Q5.3,-22.9 5,-20.7 Q2.5,-21.9 1.1,-19.8 Q-1.2,-22.1 -2.8,-20.3Z" fill={p.light} />
    <path d="M.3,-5.2 C-2.5,-10.7 -2.2,-15.9 -.2,-20.2 Q-3.7,-18.7 -3.4,-14.5 Q-4.1,-9.5 .3,-5.2Z" fill={p.shade} />
    <path d="M-1,-3.3 Q.2,-11.2 2.5,-17.6" fill="none" stroke={p.rib} strokeWidth=".7" opacity=".75" strokeLinecap="round" />
    {/* The left outer blade has a broad green face, supported by a wide pale petiole. */}
    <path d="M-5.3,-6.9 C-9.6,-9.1 -13,-12.4 -11.5,-16 Q-13.1,-18 -10.6,-19 Q-10.4,-21.6 -8.3,-20.4 Q-6.5,-22.9 -4.8,-20.7 Q-2.8,-21 -2.6,-18.5 C-1.6,-16 -3.9,-14.9 -3.3,-12.5 Q-2.1,-10.1 -3.8,-8.6 Q-4.3,-7.7 -5.3,-6.9Z" fill={p.leaf} />
    {/* One local turned edge replaces the continuous bright scalloped stripe. */}
    <path d="M-10.7,-17.8 Q-10.6,-20.1 -8.8,-19.2 Q-7,-21.3 -5.6,-19.6 Q-7.8,-20 -8.4,-17.8 Q-9.4,-18.7 -10.7,-17.8Z" fill={p.light} />
    {/* The broad rib narrows into the blade through a single connected pale-green midrib. */}
    <path d="M-3.6,-2.3 C-8.2,-6.5 -10.4,-12.7 -8.2,-18.6 Q-7.9,-14 -6,-12.2 C-5.1,-9.7 -5.9,-8.3 -3.7,-6 Q-4.2,-4.4 -3.6,-2.3Z" fill={p.shade} />
    <path d="M-2.6,.3 C-7.5,-3 -9.4,-8.5 -8.4,-14.2 Q-7.2,-11.8 -6.6,-9.9 Q-6.1,-6.9 -3.5,-5.9 Q-3.8,-2.8 -.9,.3Z" fill={p.rib} />
    <path d="M-8.5,-15.1 Q-10.4,-15.5 -10.8,-17.3 M-7.9,-16.3 Q-6,-17.1 -5.4,-19 M-7.4,-13 Q-5.4,-13.7 -4.9,-15.4" fill="none" stroke={p.shade} strokeWidth=".42" strokeLinecap="round" />
    <path d="M-3.3,-.2 Q-.5,-1.5 2.8,-.3 L2.3,.3 Q-.4,.9 -3.3,-.2Z" fill={p.rib} />
  </g>;
}
