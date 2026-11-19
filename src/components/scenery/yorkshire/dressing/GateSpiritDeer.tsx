import { useCallback, useId, useRef } from 'react';
import { SpiritDeer } from './SpiritDeer';
import { SpiritDeerFlowers } from './SpiritDeerFlowers';
import { createDeerPatrolGround, SpiritDeerFootprints } from './SpiritDeerFootprints';
import type { PatrolMotionHandler } from './SpiritDeerFootprints';
import { useDeerAwakening } from './useDeerAwakening';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { YardAttachment, YardObject, useYardDeerPatrol, useYardRuntimeDepth } from '../../../../features/yard-editor/YardWorld';
import { YARD_OBJECTS } from '../../../../features/yard-editor/yardLayout';
import { AmbientGroundShadow, ContactGroundShadow } from '../../../../world/render/GroundShadow';

// Solid, tapering twigs for the wooden sculpture; the spirit keeps its fine light branches.
const TIMBER_ANTLERS = [
  'M31,-99 Q29,-106 26,-111 L19,-118 Q16,-122 16,-129 Q17,-131 18,-128 Q19,-122 22,-120 L28,-115 Q31,-119 30,-123 L29,-126 Q30,-128 31,-125 Q34,-120 31,-114 L30,-111 35,-101Z',
  'M21,-118 L13,-118 Q8,-119 7,-124 Q7,-127 9,-124 Q11,-121 14,-121 L20,-121Z',
  'M40,-100 Q44,-107 44,-114 L40,-122 Q40,-126 42,-129 Q44,-131 43,-127 L43,-123 46,-117 52,-125 Q55,-128 54,-125 L48,-113 Q48,-106 45,-100Z',
  'M48,-120 Q55,-117 59,-121 L63,-125 Q65,-126 64,-123 Q59,-115 50,-117Z',
];
const BODY = 'M-33,-65 Q-12,-73 14,-67 Q26,-65 29,-55 Q29,-45 14,-43 L-27,-46 Q-39,-49 -33,-65Z';
const TAIL = 'M-31,-65 C-36,-67 -40,-70 -43,-69 C-42,-64 -38,-61 -32,-60Z';
// The head and neck share one continuous wooden base, with no internal closing edge.
const NECK = 'M9,-57 C18,-65 23,-77 27,-89 Q32,-102 43,-101 L49,-96 59,-93 Q64,-91 61,-87 C56,-85 51,-85 47,-85 C43,-85 41,-85 39,-83 C37,-78 37,-72 34,-66 Q31,-57 27,-49 Q24,-42 23,-33 L23,-24 Q25,-13 27,-5 L22,-4 Q18,-15 17,-25 L15,-39 Q13,-46 9,-49Z';
const FAR_LEGS = 'M-26,-54 Q-27,-42 -29,-32 L-36,-9 -32,-8 -23,-30 -20,-52Z M23,-55 Q29,-43 30,-31 L34,-9 38,-8 35,-32 30,-58Z';
const FAR_HOOVES = 'M-36,-9 L-32,-8 -30,-4 Q-33,-2 -38,-4Z M33.5,-11 Q36,-10 38,-10 L41,-4 Q37,-2 33,-4Z';
const NEAR_LEGS = 'M-26,-51 Q-22,-53 -18,-49 Q-16,-44 -16,-40 L-13,-29 Q-12,-26 -15,-21 L-22,-6 -26,-5 -19,-28Z';
const NEAR_HOOVES = 'M-26,-7 L-22,-7 -19,0 -27,0Z M21.5,-7 L26.5,-7 29,1 21,1Z';
const HEAD_CONTOUR = 'M27,-89 Q32,-102 43,-101 L49,-96 59,-93 Q64,-91 61,-87 C56,-85 51,-85 47,-85 C43,-85 41,-85 39,-83';
// This same-tone patch only occludes the ear roots; it adds no separate material boundary.
const HEAD = HEAD_CONTOUR + ' L34,-88Z';
const EARS = 'M34,-96 Q22,-98 23,-110 Q34,-107 38,-99 M43,-99 Q45,-110 55,-110 Q53,-99 46,-96';

/** A handmade driftwood guardian; the light lives inside the wood after dusk. */
export function GateSpiritDeer({ theme }: { theme: YorkshireSceneTheme }) {
  const id = 'gate-spirit-deer-' + useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const anchor = YARD_OBJECTS.gate_spirit_deer;
  const magic = theme.isNight ? 1 : theme.timeOfDay === 'dusk' ? .3 : 0;
  const awakening=useDeerAwakening(theme.isNight ? 1 : theme.timeOfDay==='dusk' ? .32 : 0);
  const patrol=useYardDeerPatrol(),reportDepth=useYardRuntimeDepth('gate_spirit_deer');
  const patrolGround=useRef<SVGGElement>(null),groundDriver=useRef<ReturnType<typeof createDeerPatrolGround>|null>(null);
  const onPatrol=useCallback<PatrolMotionHandler>((pose,weight,time)=>{
    reportDepth(pose&&weight>0?pose.y*weight:null);
    if(!patrolGround.current)return;
    groundDriver.current??=createDeerPatrolGround(patrolGround.current);
    groundDriver.current.update(pose,weight,time);
  },[reportDepth]);
  const p = theme.isNight || theme.timeOfDay === 'dusk'
      ? { wood:'#a1815f', shade:'#70533e', light:'#c0a17a', cut:'#cbb18a', grain:'#846348', rope:'#cdb891', moss:'#67784e', bark:'#88674c', ropeShade:'#8c7355' }
      : { wood:'#bd9367', shade:'#79573e', light:'#d6b58a', cut:'#e0c69a', grain:'#956e49', rope:'#e2cfaa', moss:'#6e8050', bark:'#9a754f', ropeShade:'#a18660' };
  const motes = [{x:17,y:-132,r:1.2,d:0},{x:66,y:-111,r:1.5,d:1.5},{x:-38,y:-67,r:1.1,d:3.2},{x:45,y:-37,r:1.3,d:4.7}];
  return <>
    <YardAttachment id="gate_spirit_deer">
      <g transform={`translate(${anchor.x} ${anchor.y})`} pointerEvents="none" aria-hidden="true">
        <defs><radialGradient id={id+'-ground'}>
          <stop stopColor={theme.isNight ? '#b9def5' : '#a5d9bb'} stopOpacity=".13" /><stop offset="1" stopColor="#8fc9ed" stopOpacity="0" />
        </radialGradient></defs>
        <g ref={patrolGround}>
          <g data-deer-moving-light=""><ellipse ref={awakening.ground} data-deer-ground-light="" cx="4" cy="-1" rx="52" ry="13" fill={`url(#${id}-ground)`} opacity="0" /></g>
          <g data-deer-home-flowers=""><SpiritDeerFlowers rootRef={awakening.flora} /></g>
          <SpiritDeerFootprints />
        </g>
      </g>
    </YardAttachment>
    <YardObject id="gate_spirit_deer" editBounds={{x:anchor.x-68,y:anchor.y-145,width:136,height:157}}>
      <g data-gate-spirit-deer="" data-deer-state={theme.isNight ? 'spirit' : magic ? 'awakening' : 'woodland'}
        data-deer-transitioning={awakening.transitioning || undefined}
        transform={`translate(${anchor.x} ${anchor.y})`} pointerEvents="none" aria-hidden="true"
        strokeLinecap="round" strokeLinejoin="round">
        <title>守门枝鹿 · 枯枝与麻绳做成的小鹿，入夜后微光苏醒</title>
        <defs>
          <radialGradient id={id+'-wood-erase'}><stop offset=".74" stopColor="black" /><stop offset="1" stopColor="white" /></radialGradient>
          <radialGradient id={id+'-spirit-reveal'}><stop offset=".74" stopColor="white" /><stop offset="1" stopColor="black" /></radialGradient>
          <radialGradient id={id+'-passing-light'}>
            <stop offset=".65" stopColor="#c9edfa" stopOpacity="0" /><stop offset=".82" stopColor="#d9f4ff" stopOpacity=".22" /><stop offset="1" stopColor="#c9edfa" stopOpacity="0" />
          </radialGradient>
          <mask id={id+'-wood-mask'} maskUnits="userSpaceOnUse" x="-90" y="-170" width="190" height="200">
            <rect x="-90" y="-170" width="190" height="200" fill="white" />
            <circle ref={awakening.woodMask} cx="15" cy="-60" r="0" fill={`url(#${id}-wood-erase)`} />
          </mask>
          <mask id={id+'-spirit-mask'} maskUnits="userSpaceOnUse" x="-90" y="-170" width="190" height="200">
            <rect x="-90" y="-170" width="190" height="200" fill="black" />
            <circle ref={awakening.spiritMask} cx="15" cy="-60" r="0" fill={`url(#${id}-spirit-reveal)`} />
          </mask>
          <clipPath id={id+'-wood-shape'}>
            {[BODY,NECK,FAR_LEGS,NEAR_LEGS,EARS,...TIMBER_ANTLERS].map((d,i)=><path key={i} d={d} />)}
          </clipPath>
          <radialGradient id={id+'-glow'}><stop stopColor="#e3f4ff" stopOpacity=".8" /><stop offset=".35" stopColor="#a4d7f5" stopOpacity=".32" /><stop offset="1" stopColor="#7ab9e6" stopOpacity="0" /></radialGradient>
          <linearGradient id={id+'-wood'} x1="0" y1="0" x2=".2" y2="1">
            <stop stopColor={p.light} /><stop offset=".36" stopColor={p.wood} /><stop offset="1" stopColor={p.shade} />
          </linearGradient>
        </defs>
        <style>{`
          @keyframes ${id}-breathe { 0%,100% { opacity:.5 } 50% { opacity:1 } }
          @keyframes ${id}-drift { 0%,100% { transform:translate(0,0);opacity:.2 } 45% { transform:translate(2px,-5px);opacity:.85 } }
          @keyframes ${id}-flow { from { stroke-dashoffset:0 } to { stroke-dashoffset:-76 } }
          #${id}-heart { animation:${id}-breathe 6s ease-in-out infinite }
          .${id}-mote { animation:${id}-drift 7s ease-in-out infinite }
          .${id}-flow { animation:${id}-flow 13s linear infinite }
          @media(prefers-reduced-motion:reduce) { #${id}-heart,.${id}-mote,.${id}-flow { animation:none } }
        `}</style>
        <g ref={awakening.shadow}><AmbientGroundShadow cx={0} cy={0} rx={47} ry={10} color="#293c2b" opacity={.19} /></g>
        <g data-deer-timber="" display={awakening.wood ? undefined : 'none'} mask={`url(#${id}-wood-mask)`}>
        {/* All four footprints sit under the soles; the far pair is smaller and quieter. */}
        <ContactGroundShadow cx={-34} cy={-3.5} rx={5} ry={1.2} color="#253c2a" opacity={.24} />
        <ContactGroundShadow cx={37} cy={-3.5} rx={5} ry={1.2} color="#253c2a" opacity={.24} />
        <ContactGroundShadow cx={-23} cy={.5} rx={6} ry={1.5} color="#253c2a" opacity={.3} />
        <ContactGroundShadow cx={25} cy={1.4} rx={6} ry={1.5} color="#253c2a" opacity={.3} />
        {/* Far legs attach behind the body; crooks are natural branch knees. */}
        <path d={FAR_LEGS} fill={p.shade} />
        <path d={FAR_HOOVES} fill={p.shade} />
        <path d="M-36,-7.5 l3,.5 1,1 -4,-.5Z M34,-9 l3,.5 1,1 -4,-.5Z" fill={p.bark} />
        <path d={TAIL} fill={p.wood} stroke={p.shade} strokeWidth=".7" />
        <path d="M-41,-67 Q-37,-63 -32,-63" fill="none" stroke={p.light} strokeWidth="1" />
        {/* Warm, partly peeled timber: a broad shoulder of light, bark below, pale end grain. */}
        <path d={BODY}
          fill={`url(#${id}-wood)`} stroke={p.shade} strokeWidth="1" />
        <path d="M-29,-64 Q-11,-70 11,-65 L18,-61 Q-3,-65 -28,-60Z" fill={p.light} opacity=".55" />
        <path d="M-27,-50 Q-16,-53 -5,-50 L4,-51 15,-48 22,-51 Q20,-45 13,-44 L-27,-47Z" fill={p.bark} />
        <path d="M-24,-60 Q-13,-64 -4,-62 M-1,-62 Q6,-62 11,-60 M-21,-55 Q-14,-57 -10,-55 M-8,-49 L-2,-48 3,-49" fill="none" stroke={p.grain} strokeWidth=".65" opacity=".7" />
        <path d="M-13,-59 Q-18,-58 -14,-55 Q-9,-54 -10,-57" fill="none" stroke={p.grain} strokeWidth=".6" />
        <ellipse cx="-31" cy="-56" rx="6.1" ry="9.3" transform="rotate(-12 -31 -56)" fill={p.cut} stroke={p.bark} strokeWidth="1.2" />
        <path d="M-32,-63 C-38,-64 -35,-50 -30,-49 M-29,-62 C-24,-58 -27,-50 -30,-52 M-32,-60 C-35,-60 -32,-53 -30,-54 M-34,-64 l2,3 M-28,-49 l-2,-2" fill="none" stroke={p.grain} strokeWidth=".55" opacity=".75" />
        {/* One curved branch flows through the shoulder into the near foreleg. */}
        <path d={NECK} fill={p.wood} stroke={p.shade} strokeWidth="1" />
        <path d="M15,-56 Q25,-74 31,-92 L34,-93 Q31,-76 26,-65 L21,-56Z" fill={p.light} opacity=".65" />
        <path d="M29,-65 Q34,-73 36,-82 L34,-82 Q31,-72 27,-68Z" fill={p.bark} />
        <path d="M11,-57 Q14,-52 20,-50 L24,-48 23,-44 Q17,-46 14,-50Z" fill={p.shade} opacity=".55" />
        <path d="M25,-74 Q27,-79 28,-83 M28,-69 l2,-4" fill="none" stroke={p.grain} strokeWidth=".65" />
        {/* The near hind leg enters below the cut end; its pastern narrows into the hoof. */}
        <path d={NEAR_LEGS} fill={p.wood} stroke={p.shade} strokeWidth=".8" />
        <path d="M-26,-51 Q-23,-49 -19,-50 L-17,-46 Q-22,-45 -25,-48Z" fill={p.bark} />
        <path d="M-24,-52 Q-21,-53 -18,-49" fill="none" stroke={p.shade} strokeWidth=".9" />
        <path d="M-21,-44 Q-17,-35 -16,-29 M-18,-23 L-24,-8 M20,-43 Q19,-35 20,-29 M21,-21 L24,-8" fill="none" stroke={p.light} strokeWidth=".85" opacity=".8" />
        <path d="M-19,-29 l3,2 M19,-26 l3,1" fill="none" stroke={p.grain} strokeWidth=".7" />
        <path d={NEAR_HOOVES} fill={p.shade} stroke={p.grain} strokeWidth=".65" />
        <path d="M-25.5,-5 L-22.5,-5 -21.5,-3.5 -25.8,-3.5Z M22.5,-5 L26,-5 26.8,-3.5 22.3,-3.5Z" fill={p.bark} />
        <path d="M-25,-5 l2.5,.2 M23,-5 l2.5,.2" fill="none" stroke={p.cut} strokeWidth=".5" opacity=".6" />
        {/* Small twigs, leaf-shaped ears, and a tapered wooden muzzle. */}
        <g fill={p.wood} stroke={p.shade} strokeWidth=".65">{TIMBER_ANTLERS.map((d,i)=><path key={i} d={d} />)}</g>
        <path d="M32,-102 L28,-111 21,-119 M18,-123 l-1,-5 M12,-120 l5,.5 M44,-103 Q47,-110 46,-114 L52,-123 M42,-123 l.5,-4 M53,-118 Q58,-118 61,-122" fill="none" stroke={p.light} strokeWidth=".85" />
        <path d={EARS} fill={p.wood} stroke={p.shade} strokeWidth=".8" />
        <path d="M26,-106 L33,-100 29,-101Z M50,-106 L46,-100 47,-103Z" fill={p.cut} />
        <path d={HEAD} fill={p.wood} />
        <path d={HEAD_CONTOUR} fill="none" stroke={p.shade} strokeWidth=".9" />
        {/* A quiet cheek arc separates the head from the neck without closing a hard seam. */}
        <path d="M32,-96 C30,-93 31,-89 34,-87 Q37,-84.5 42,-85" fill="none" stroke={p.grain} strokeWidth=".75" opacity=".6" />
        <path d="M36,-97 L42,-99 47,-95 58,-91 54,-90 43,-94 37,-94Z" fill={p.light} opacity=".8" />
        <path d="M59,-93 q7,1 3,5 l-4,-1Z" fill={p.bark} />
        <ellipse cx="44.5" cy="-94" rx="1.6" ry="2" fill={theme.isNight ? '#e9f5ff' : '#3e4032'} />
        <path d="M47,-87 q5,1 8,-1" fill="none" stroke={p.grain} strokeWidth=".7" />
        {/* One small head binding accents the head/neck join without wrapping the shoulder. */}
        <path d="M29,-96 Q33,-93 38,-94" fill="none" stroke={p.ropeShade} strokeWidth="1.8" />
        <path d="M29,-96.5 Q33,-93.5 38,-94.5" fill="none" stroke={p.rope} strokeWidth=".85" />
        {/* The rear binding stays quieter beside the pale end grain. */}
        <path d="M-26,-49 Q-23,-47 -18,-50 M-25,-46 Q-21,-44 -17,-47" fill="none" stroke={p.ropeShade} strokeWidth="1.6" />
        <path d="M-26,-49.4 Q-23,-47.4 -18,-50.4 M-25,-46.4 Q-21,-44.4 -17,-47.4" fill="none" stroke={p.light} strokeWidth=".8" opacity=".85" />
        <path d="M-22,-66.5 Q-21,-68 -19,-67.8 Q-17,-69.6 -15,-68.6 Q-12,-69.5 -10.5,-67.8 Q-9,-67.7 -8,-67 Q-11,-65.5 -13,-66.3 Q-15,-65.5 -17,-66.1 Q-20,-65.5 -22,-66.5Z M-6.5,-67.6 Q-5,-69 -3.5,-68.3 Q-2,-68.8 -.5,-67.2 Q-2,-66.4 -3.5,-67 Q-5,-66.5 -6.5,-67.6Z" fill={p.moss} />
        <path d="M-19,-67.4 Q-17,-68.5 -15,-67.8 M-5,-67.7 l1,.1" fill="none" stroke={p.light} opacity=".25" strokeWidth=".65" />
        {/* The vine curls out of a bark seam, with its tucked end partly occluded. */}
        <path d="M24,-70 Q26,-68 29,-71" fill="none" stroke={p.grain} strokeWidth=".9" />
        <path d="M28,-70 Q24,-68 23,-73 Q21,-78 26,-82 L28,-89" fill="none" stroke={p.moss} strokeWidth=".8" />
        <path d="M27,-70.5 L29,-71.5 28,-69.3Z" fill={p.bark} />
        <path d="M24,-78 Q18,-78 19,-83 Q24,-83 24,-78Z M26,-83 Q26,-88 31,-88 Q31,-84 26,-83Z" fill={p.moss} />
        <path d="M20,-82 l3,3 M29,-87 l-2,3" fill="none" stroke={p.cut} opacity=".5" strokeWidth=".5" />
        {/* The aperture sits within the log, clear of the shoulder seam. */}
        <g transform="translate(-7 0)">
        <path d="M6,-63 Q-2,-57 5,-49 Q14,-54 6,-63Z" fill={p.bark} />
        <path d="M6,-61.7 Q.5,-57 5.3,-50.5 Q11.5,-54.5 6,-61.7Z" fill={p.shade} />
        <path d="M5.8,-61 Q2,-57 4,-53" fill="none" stroke={p.grain} strokeWidth=".8" />
        <path d="M8,-60 Q12,-54.5 5.4,-49.7" fill="none" stroke={p.cut} strokeWidth=".65" opacity=".8" />
        </g>
        </g>
        {awakening.spirit && <g mask={awakening.transitioning?`url(#${id}-spirit-mask)`:undefined}>
          <SpiritDeer onPrepared={awakening.onPrepared} awakeningProgress={awakening.progress} motionEnabled={patrol.available} patrolPath={patrol.path} onPatrol={onPatrol} />
        </g>}
        {awakening.transitioning && <g clipPath={`url(#${id}-wood-shape)`} pointerEvents="none">
          <circle ref={awakening.band} cx="15" cy="-60" r="0" fill={`url(#${id}-passing-light)`} />
        </g>}
        {(magic>0 || awakening.transitioning) && awakening.wood && <g ref={awakening.awakening} data-deer-magic="" opacity="0">
          <g id={id+'-heart'}>
            <ellipse cx="-1" cy="-56" rx="11" ry="10" fill={`url(#${id}-glow)`} opacity=".32" />
            <path d="M6,-61 Q2,-56 6,-51 Q12,-55 6,-61Z" transform="translate(-7 0)" fill="#d9f0fa" opacity=".78" />
          </g>
          <g className={id+'-flow'} clipPath={`url(#${id}-wood-shape)`} fill="none" stroke="#c4e8fc" strokeWidth=".65" strokeDasharray="10 8 17 12" opacity=".45">
            <path d="M3,-58 Q12,-56 17,-66 Q25,-78 29,-90 M13,-55 Q21,-62 24,-72" />
          </g>
          <path d="M17,-129 l.6,3.5 M43,-129 l-.5,3 M64,-124 l-2,2" fill="none" stroke="#d4f0ff" strokeWidth="1" opacity=".65" />
          <circle cx="44.5" cy="-94" r=".45" fill="#d9f0fa" opacity=".45" />
          {motes.slice(0,2).map((m,i)=><g key={i} className={id+'-mote'} opacity=".3" style={{animationDelay:`-${m.d}s`}}>
            <circle cx={m.x} cy={m.y} r={m.r*5} fill={`url(#${id}-glow)`} />
            <circle cx={m.x} cy={m.y} r={m.r} fill="#e0f2ff" />
          </g>)}
        </g>}
      </g>
    </YardObject>
  </>;
}
