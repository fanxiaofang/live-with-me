import { useId } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { YardObject } from '../../../../features/yard-editor/YardWorld';
import { YARD_OBJECTS } from '../../../../features/yard-editor/yardLayout';

/** A shallow meadow pond, with an open grassy bank and a small planted shoulder. */
export function MeadowPond({ theme }: { theme: YorkshireSceneTheme }) {
  const uid = `meadow-pond-${useId().replace(/:/g, '')}`;
  const a = YARD_OBJECTS.meadow_pond;
  const water = 'M-83,-2 C-89,-16 -65,-30 -38,-29 C-15,-30 -12,-19 7,-21 C29,-23 35,-34 58,-26 C81,-19 94,-6 85,8 C77,21 50,27 25,27 C2,27 -6,20 -28,23 C-55,28 -78,17 -83,-2Z';
  return <YardObject id="meadow_pond">
    <g data-meadow-pond="shallow" transform={`translate(${a.x} ${a.y})`} pointerEvents="none"
      strokeLinecap="round" strokeLinejoin="round"
      filter={theme.landscapeEnvironment ? 'url(#field-environment-tone)' : undefined}
      opacity={!theme.landscapeEnvironment && theme.isNight ? .65 : 1}>
      <title>牧场小池塘 · 清浅水岸与水生草叶</title>
      <defs>
        <clipPath id={`${uid}-water`}><path d={water} /></clipPath>
        <radialGradient id={`${uid}-depth`} cx="48%" cy="43%" r="65%">
          <stop stopColor="#629b99" stopOpacity=".85" />
          <stop offset=".55" stopColor="#8bb8ac" stopOpacity=".65" />
          <stop offset="1" stopColor="#bed0aa" stopOpacity=".2" />
        </radialGradient>
      </defs>
      {/* The soil edge is interrupted by grass, rather than a closed stone necklace. */}
      <path d="M-90,-1 C-97,-19 -68,-35 -39,-34 C-14,-35 -10,-23 8,-25 C29,-27 36,-39 61,-31 C89,-22 102,-7 92,11 C82,28 50,33 25,32 C0,32 -7,25 -27,29 C-59,34 -84,22 -90,-1Z" fill="#9c9867" />
      <path d={water} fill="#c0ba8b" />
      <g clipPath={`url(#${uid}-water)`}>
        <path d="M-84,-5 C-60,-22 -40,-16 -28,-6 Q-12,9 18,16 C42,21 68,9 88,6 L88,34 -90,34Z" fill="#d1c79b" />
        <g fill="#a6a77d" opacity=".55">
          <ellipse cx="-57" cy="10" rx="5" ry="1.8" /><ellipse cx="-43" cy="15" rx="3" ry="1.2" />
          <ellipse cx="52" cy="17" rx="4" ry="1.5" /><ellipse cx="67" cy="12" rx="2.8" ry="1" />
        </g>
        <path d={water} fill={`url(#${uid}-depth)`} />
        <path d="M-74,-9 Q-57,-21 -39,-20 M27,-20 Q44,-30 59,-21" fill="none" stroke="#4e7c6c" strokeWidth="2.4" opacity=".42" />
        <path d="M-59,-9 Q-45,-14 -30,-11 M-23,-10 l8,.4 M17,8 Q32,11 46,7 M54,5 l8,-1 M-43,15 Q-32,18 -21,16" fill="none" stroke="#e4e9ca" strokeWidth=".9" opacity=".7" />
        <path d="M-6,-1 Q6,-3 17,-1" fill="none" stroke="#c5dac5" strokeWidth=".6" opacity=".65" />
      </g>
      {/* Selective bank depth: keep the sunny front shore broad and shallow. */}
      <path d="M-78,12 Q-62,28 -29,23 M32,27 Q65,26 81,14" fill="none" stroke="#8a8b60" strokeWidth="1.5" />
      <path d="M-60,23 Q-51,27 -41,26 M-12,25 l10,2 M44,29 l9,-2" fill="none" stroke="#c0b785" strokeWidth="1.1" />
      {/* A few rounded fieldstones settle into one shoulder, not all around the pond. */}
      <g transform="translate(-71 -20)">
        <path d="M-17,2 Q-19,-3 -11,-6 Q-3,-9 2,-3 L5,3 Q-4,8 -15,5Z" fill="#8a9272" />
        <path d="M-17,1 Q-16,-4 -9,-5 Q-2,-7 2,-2 L1,1 Q-8,4 -17,1Z" fill="#b6bb96" />
        <path d="M0,-6 Q0,-12 9,-13 Q19,-12 20,-5 L18,0 Q7,4 1,0Z" fill="#90997b" />
        <path d="M1,-7 Q4,-12 10,-11 Q16,-12 19,-6 Q11,-3 1,-7Z" fill="#c0c4a3" />
        <path d="M-8,9 Q-8,4 -2,4 Q5,3 8,8 L5,12 -3,12Z" fill="#a4ac8b" />
      </g>
      {/* Two distinct velvety cattail spikes rise above upright, strap-shaped leaves. */}
      <g data-pond-cattails="" transform="translate(56 -25)">
        <path d="M-9,4 Q-2,1 10,3" fill="none" stroke="#5f7750" strokeWidth="3" opacity=".55" />
        <path d="M-5,3 C-9,-10 -10,-20 -8,-31 C-7,-19 -6,-9 -2,3Z M2,3 Q1,-19 4,-33 Q5,-14 5,3Z" fill="#637e46" />
        <path d="M7,3 Q9,-9 9,-23 M-4,3 Q-9,-9 -11,-18" fill="none" stroke="#79844b" strokeWidth="1.2" />
        <g transform="translate(9 -22) rotate(-3)">
          <path d="M0,-14 V-17" stroke="#8d7047" strokeWidth=".65" />
          <rect x="-2.5" y="-14" width="5" height="14.5" rx="2.4" fill="#795138" />
          <path d="M-.9,-12 Q-.5,-13 .4,-12 L.5,-2 Q-.2,-.5 -1,-2Z" fill="#ac7d4b" />
          <path d="M1.8,-10 V-3" stroke="#65472f" strokeWidth=".55" />
        </g>
        <g transform="translate(-11 -17) rotate(-10)">
          <path d="M0,-11.5 V-14" stroke="#8d7047" strokeWidth=".6" />
          <rect x="-2.1" y="-11.5" width="4.2" height="12" rx="2" fill="#90613d" />
          <path d="M-.7,-9.5 V-2" stroke="#bc915b" strokeWidth=".85" />
        </g>
        <path d="M-5,3 C-10,-9 -15,-17 -19,-20 C-11,-17 -6,-8 -2,3Z M0,3 Q-4,-14 -2,-29 Q0,-15 3,3Z M5,3 Q13,-18 20,-26 Q16,-12 8,3Z M8,3 Q18,-7 24,-8 Q18,-1 11,4Z" fill="#7c9650" />
        <path d="M.4,1 Q-2,-14 -2,-25 M6,2 Q14,-17 18,-23 M-4,1 Q-11,-14 -17,-18" fill="none" stroke="#b0bd76" strokeWidth=".65" />
      </g>
      <g fill="#879b4e">
        <path d="M-93,-3 Q-99,-10 -98,-17 Q-92,-12 -93,-3 L-88,-3 Q-86,-13 -82,-16 L-85,-3Z" />
        <path d="M-59,29 Q-65,23 -65,17 Q-59,20 -58,27 Q-56,20 -51,18 L-53,29Z" />
        <path d="M84,17 Q87,5 92,1 L89,15 Q94,11 99,10 L94,17Z" />
        <path d="M20,-29 Q14,-34 15,-39 Q21,-35 22,-28 L26,-28 Q27,-34 31,-36 L29,-28Z" />
      </g>
    </g>
  </YardObject>;
}
