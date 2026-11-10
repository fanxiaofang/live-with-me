import { useId } from 'react';
import { AmbientGroundShadow } from '../../../../world/render/GroundShadow';

/** Native flock artwork; poses share the adopted face, fleece and short-tail design. */
export function StorybookSheep({ lamb = false, pose = 'standing', facing = 'right' }: {
  lamb?: boolean;
  pose?: 'standing' | 'grazing' | 'resting';
  facing?: 'left' | 'right';
}) {
  const uid = useId().replace(/:/g, '');
  const wool = `sheep-wool-${uid}`, face = `sheep-face-${uid}`;
  return <g data-sheep-art={lamb ? 'storybook-lamb' : 'storybook-adult'} data-sheep-pose={pose}
    transform={facing === 'left' ? 'scale(-1 1)' : undefined} strokeLinecap="round" strokeLinejoin="round">
    <defs>
      <linearGradient id={wool} x1="0" y1="0" x2=".25" y2="1">
        <stop offset="0" stopColor="#f5eddc" /><stop offset=".55" stopColor="#eae0cb" /><stop offset="1" stopColor="#d8c9af" />
      </linearGradient>
      <linearGradient id={face} x1="0" y1="0" x2="1" y2=".7">
        <stop offset="0" stopColor="#685644" /><stop offset=".5" stopColor="#4d4034" /><stop offset="1" stopColor="#39312a" />
      </linearGradient>
    </defs>
    {pose === 'resting' ? <>
      <AmbientGroundShadow cx={0} cy={10} rx={24} ry={4.7} color="#2d3927" opacity={.24} />
      {/* Folded hooves emerge from beneath the weight-bearing belly, without upright legs. */}
      <path d="M-14,7 Q-16,9 -14,11 L-9,11.3 -7,8Z M7,8 Q6,10 9,11.5 L15,11 14,8Z" fill="#514230" />
      <path d="M-14,10 L-10,10.4 M10,10.5 L14,10" stroke="#a08b69" strokeWidth=".6" />
      <path data-sheep-tail="resting" d="M-17,0 Q-23,1 -23,6 Q-22,9 -19,6 L-17,3Z"
        fill="#dfd2bb" stroke="#b7a68c" strokeWidth=".5" />
      <path d="M-20,1 C-22,-5 -14,-10 -5,-9 C6,-12 17,-7 19,-1 Q22,3 19,7
        C15,12 -1,13 -12,10 Q-22,10 -20,1Z" fill={`url(#${wool})`} stroke="#b7a68c" strokeWidth=".6" />
      <path d="M-18,-1 C-16,-7 -5,-9 4,-7 Q12,-8 17,-2 C5,-4 -3,-.5 -12,1Z" fill="#f7efdf" opacity=".65" />
      <path d="M-18,5 Q-3,10 18,5 Q13,11 -1,11 Q-14,12 -18,5Z" fill="#cbbb9e" opacity=".3" />
      <path d="M11,5 Q10,0 14,-4 L20,-2 21,6 Q16,10 11,5Z" fill="#d8c8ab" />
      <g transform="translate(16 -2) rotate(-8)"><SheepHead face={face} sleeping /></g>
    </> : lamb ? <>
      <AmbientGroundShadow cx={1} cy={15} rx={18} ry={4.2} color="#2d3927" opacity={.22} />
      {/* Far legs recede behind the fleece, with distinct little hooves. */}
      <path d="M-7,5 L-8,13.4 -5.5,13.8 -4.4,5Z M7,5 L6.5,13.9 9,14 10,5Z" fill="#514737" />
      <path d="M-8,12.3 L-5.5,12.7 V14 L-8.5,13.7Z M6.5,12.8 L9,12.9 9.4,14.3 6.1,14.2Z" fill="#342e27" />
      <ellipse cx="-10" cy="15.6" rx="3" ry="1" fill="#2d3927" opacity=".25" />
      <ellipse cx="10" cy="16" rx="3" ry="1" fill="#2d3927" opacity=".25" />
      <path d="M-12,5 Q-12.5,10 -11.7,15 H-8.8 L-8.5,5Z M7.4,5 Q8.6,10 8.4,15.4 H11.5 L11,5Z" fill="#75604a" />
      <path d="M-11.8,13.6 L-8.7,13.8 V15.7 H-12.2Z M8.4,14.1 L11.5,14.2 12,16 H8.1Z" fill="#3c3329" />
      <path d="M-11,7 V12 M9.2,7 L9.7,12.5" stroke="#a08b69" strokeWidth=".65" />
      {/* Tail root is behind the fleece; only the short hanging tip is exposed. */}
      <path data-sheep-tail="lamb" d="M-13,-1 C-16,-1 -18,2 -16,5.5 Q-15,6.5 -14,4 L-12,1Z"
        fill="#dfd2bb" stroke="#b7a68c" strokeWidth=".5" />
      {/* A single soft torso, with only a slight break at the chest and rump. */}
      <path d="M-14,0 C-17,-6 -10,-11 -3,-11 C5,-13 12,-9 14,-4 Q17,-1 15,3
        C15,9 6,11 -1,10 C-9,11 -15,7 -15,3Z"
        fill={`url(#${wool})`} stroke="#b7a68c" strokeWidth=".55" />
      <path d="M-13,-3 C-11,-9 -3,-10 4,-9 Q10,-8 12,-4 C4,-6 -4,-4 -9,-2Z" fill="#f7efdf" opacity=".65" />
      <path d="M-13,4 Q-2,9 12,5 C8,11 -7,12 -13,4Z" fill="#cbbb9e" opacity=".3" />
      <path d="M10,4 Q9,-1 12,-5 L17,-3 17,4 Q14,7 10,4Z" fill="#d8c8ab" />
      <g transform="translate(14 -4) scale(.9)"><SheepHead face={face} lamb /></g>
    </> : <>
      <AmbientGroundShadow cx={1} cy={18} rx={25} ry={5} color="#2d3927" opacity={.23} />
      <path d="M-10,6 L-10.5,16.8 -7.5,17.1 -6.5,6Z M10,6 L10,17 13,17.2 14,6Z" fill="#514737" />
      <path d="M-10.5,15.2 L-7.4,15.5 V17.3 L-11,17.1Z M10,15.5 L13,15.6 13.4,17.5 9.7,17.4Z" fill="#342e27" />
      <ellipse cx="-12" cy="19" rx="3.5" ry="1.1" fill="#2d3927" opacity=".28" />
      <ellipse cx="11" cy="19.8" rx="3.5" ry="1.1" fill="#2d3927" opacity=".28" />
      <path d="M-15,7 Q-15,13 -13.5,18.7 H-10 L-10.8,7Z M8,7 Q9.5,14 9.2,19.3 H12.7 L13,7Z" fill="#75604a" />
      <path d="M-13.8,16.8 L-10,17 V19.2 H-14.2Z M9.2,17.5 L12.7,17.6 13.3,20 H8.8Z" fill="#3c3329" />
      <path d="M-13.8,9 L-12.7,15 M10.6,9 V15.5" stroke="#a08b69" strokeWidth=".7" />
      <path data-sheep-tail="adult" d="M-19,-2 C-22,-1 -24,2 -22,6 Q-21,7 -20,4 L-18,0Z"
        fill="#dfd2bb" stroke="#b7a68c" strokeWidth=".55" />
      <path d="M-20,0 C-22,-8 -14,-13 -6,-13 C3,-15 14,-13 18,-7 Q22,-5 21,-1
        C24,5 18,12 10,13 C0,16 -15,13 -19,7 Q-22,6 -20,3Z"
        fill={`url(#${wool})`} stroke="#b7a68c" strokeWidth=".6" />
      {/* Broad, unbroken back light and a restrained belly turn carry the fleece volume. */}
      <path d="M-18,-3 C-17,-10 -6,-13 3,-11 Q13,-12 18,-5 C8,-7 1,-5 -7,-3 Q-13,0 -18,-3Z"
        fill="#f7efdf" opacity=".65" />
      <path d="M-18,5 Q-4,13 17,7 C12,15 -8,17 -16,9Z" fill="#cbbb9e" opacity=".3" />
      {pose === 'grazing' ? <>
        <path d="M12,6 Q12,0 16,2 L23,9 20,15 Q16,14 14,10Z" fill="#d8c8ab" />
        <path d="M16,6 Q15,4 19,4 L24,9 21,12Z" fill="#5c4a39" />
        <g transform="translate(18 7) rotate(30)"><SheepHead face={face} />
          <path d="M9,7 l3,2 m-1,-1 3,-1" stroke="#718549" strokeWidth=".7" fill="none" />
        </g>
      </> : <>
        <path d="M14,7 Q12,1 15,-5 L22,-3 22,6 Q18,10 14,7Z" fill="#d8c8ab" />
        <path d="M15,2 Q15,-2 18,-5 L23,-3 21,3 Q18,5 15,2Z" fill="#5c4a39" />
        <g transform="translate(19 -1)"><SheepHead face={face} /></g>
      </>}
    </>}
  </g>;
}

function SheepHead({ face, lamb = false, sleeping = false }: { face: string; lamb?: boolean; sleeping?: boolean }) {
  return <g data-sheep-head={lamb ? 'lamb' : 'adult'}>
    {/* Narrow sheep face: the nose continues down from the brow, without a broad separate muzzle. */}
    <path d="M3,-7 Q9,-8 11,-5 Q8,-2 4,-4Z" fill="#4d4033" />
    <path d="M5,-5.8 L8.5,-5.3" stroke="#927c60" strokeWidth=".65" />
    <path d={sleeping ? 'M-4,-7 Q-.3,-9.5 3.2,-7.5 Q5.7,-5.5 6,-2 L8,2.5 Q9,4.7 6.8,5.4 Q4.5,6 3,3.3 L0,1 Q-5,0 -5,-3Z'
      : lamb ? 'M-4,-7 Q-.3,-9.5 3.2,-7.5 Q5.7,-5.5 6,-2 L10,3 Q11,6 8,7 Q5,7.5 3,4 L0,1 Q-5,0 -5,-3Z'
      : 'M-4,-7 Q-.3,-9.5 3.2,-7.5 Q5.7,-5.5 6,-2 L11,4 Q12,7 8.5,8 Q5,8.5 3,5 L0,1 Q-5,0 -5,-3Z'}
      fill={`url(#${face})`} stroke="#45382d" strokeWidth=".55" />
    <path d={sleeping ? 'M3,-5.8 Q4.7,-3.9 5.5,.5' : 'M3,-5.8 Q4.7,-3.9 5.6,-.5 L7,2'} stroke="#88735a" strokeWidth=".65" opacity=".28" fill="none" />
    <path d="M-2,-4 Q-7,-5 -10,-1 Q-7,1.5 -2,-1Z" fill="#65503e" />
    <path d="M-4,-2.6 L-7.5,-1.5" stroke="#a18a6b" strokeWidth=".65" />
    <path d={lamb ? 'M-4,-7 Q-4,-11 0,-10 Q4,-10 5,-6 Q1,-4 -1,-6 Q-3,-5 -4,-7Z'
      : 'M-4,-7 Q-3,-10 1,-9 Q4,-9 5,-6 Q1,-5 -1,-6.5Z'} fill="#eee2cb" />
    <path d="M-.3,-5.5 Q1.2,-6 2.3,-5.1" stroke="#927c60" strokeWidth=".45" opacity=".65" fill="none" />
    {sleeping ? <path d="M-.1,-4.4 Q1.2,-3.3 2.5,-4.3" stroke="#c1aa84" strokeWidth=".65" fill="none" /> : <>
      <ellipse cx="1.2" cy="-4.3" rx={lamb ? .9 : .8} ry={lamb ? 1 : .9} fill="#211c18" />
      <circle cx="1.4" cy="-4.6" r=".23" fill="#f8edcf" />
    </>}
    <path d={sleeping ? 'M7.5,3.5 l.7,.3 M5.7,4.8 l1.2,-.2' : lamb ? 'M8.6,4.5 l.8,.4 M7,6 l1.3,-.2' : 'M9.4,5.6 l.8,.4 M7.7,7 l1.5,-.3'}
      stroke="#2d241d" strokeWidth=".6" fill="none" />
  </g>;
}
