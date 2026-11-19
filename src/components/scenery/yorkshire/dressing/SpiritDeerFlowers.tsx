import { useId } from 'react';
import type { RefCallback } from 'react';

// Saturated petal bodies stay legible against the silver-blue spirit and dark grass.
const palettes=[
  {light:'#ff9eaf',petal:'#ee598b',shade:'#a43c84',accent:'#f77a9c',center:'#ffd46a',glow:'#f274a5'},
  {light:'#ffda7c',petal:'#f5a83e',shade:'#b57537',accent:'#ffc15b',center:'#bd6459',glow:'#ffc46b'},
  {light:'#c9a6ff',petal:'#9b70ea',shade:'#6851ac',accent:'#b38bf1',center:'#ffe186',glow:'#b58af1'},
];
const flowerTones=[2,0,2,1,0,1,2];

// Irregular patches between and outside the soles, rather than a symmetrical flower ring.
const flowers=[
  {x:-39,y:2,size:.78,height:4,lean:-1,delay:.05,angle:12},
  {x:-18,y:7,size:1,height:5,lean:1.2,delay:.22,angle:34},
  {x:7,y:10,size:.82,height:3.5,lean:-.8,delay:.38,angle:8},
  {x:35,y:6,size:1.05,height:4.5,lean:1,delay:.12,angle:24},
  {x:46,y:-1,size:.65,height:3.8,lean:1.3,delay:.48,angle:42},
  {x:-47,y:8,size:.55,height:3,lean:-.8,delay:.61,angle:5},
  {x:8,y:-6,size:.56,height:3.5,lean:-1,delay:.32,angle:28},
];

/** Ephemeral light flowers in the owner's ground layer. No extra renderer or saved plants. */
export function SpiritDeerFlowers({ rootRef }: { rootRef: RefCallback<SVGGElement> }) {
  const id='deer-life-'+useId().replace(/[^a-zA-Z0-9_-]/g,'');
  return <g ref={rootRef} data-deer-life-flowers="" opacity="0" pointerEvents="none" aria-hidden="true"
    strokeLinecap="round" strokeLinejoin="round">
    <defs>
      {palettes.map((palette,tone)=><g key={tone}>
        <radialGradient id={`${id}-glow-${tone}`}>
          <stop stopColor={palette.glow} stopOpacity=".22" /><stop offset=".4" stopColor={palette.glow} stopOpacity=".08" /><stop offset="1" stopColor={palette.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-petal-${tone}`} x1="0" y1="0" x2=".5" y2="1">
          <stop stopColor={palette.light} /><stop offset=".48" stopColor={palette.petal} /><stop offset="1" stopColor={palette.shade} stopOpacity=".9" />
        </linearGradient>
      </g>)}
    </defs>
    <style>{`
      @keyframes ${id}-lift {
        0% {opacity:0;transform:translate(0,0)}
        4% {opacity:.7;transform:translate(.5px,-2px)}
        17% {opacity:.48;transform:translate(3px,-15px)}
        24% {opacity:0;transform:translate(5px,-23px)}
        100% {opacity:0;transform:translate(5px,-23px)}
      }
      @keyframes ${id}-turn {
        0%,100% {transform:rotate(-20deg) scaleX(.65)}
        50% {transform:rotate(24deg) scaleX(1)}
      }
      .${id}-lift {animation:${id}-lift 18s linear infinite;opacity:0}
      .${id}-turn {animation:${id}-turn 4.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
      @media(prefers-reduced-motion:reduce){.${id}-lift,.${id}-turn{animation:none}.${id}-lift{opacity:0}}
    `}</style>
    {flowers.map((flower,index)=><g key={index} transform={`translate(${flower.x} ${flower.y}) scale(${flower.size})`}
      data-spirit-flower="" data-bloom-delay={flower.delay}>
      <g data-flower-growth="" transform="scale(.25)">
        <path d={`M0,0 Q${-flower.lean},${-flower.height*.55} ${flower.lean},${-flower.height}`} fill="none" stroke="#8cc4ad" strokeWidth=".55" opacity=".52" />
        <path d="M0,-1 Q-3,-1.1 -2.5,-3 Q-.5,-3 0,-1Z" fill="#a6d6bc" opacity=".3" />
        <g transform={`translate(${flower.lean} ${-flower.height})`}>
          <g data-flower-bud="" opacity=".28">
            <path d="M0,.5 Q-2,-1 0,-3 Q2,-1 0,.5Z" fill={palettes[flowerTones[index]].light} />
            <ellipse cy="-.7" rx="3" ry="2.3" fill={`url(#${id}-glow-${flowerTones[index]})`} />
          </g>
          <g data-flower-open="" opacity="0" transform="scale(.25)">
            <ellipse rx="8" ry="3.5" fill={`url(#${id}-glow-${flowerTones[index]})`} />
            {/* The flower lies along the ground plane; the short stem remains upright. */}
            <g transform={`scale(1 .48) rotate(${flower.angle})`}>
              {[0,72,144,216,288].map((angle,petal)=><path key={angle} transform={`rotate(${angle})`}
                d="M0,.3 C-1.8,-.7 -2.5,-3.5 -.3,-4.5 C1.9,-4.9 2.1,-1.1 0,.3Z"
                fill={petal===1||petal===4?palettes[flowerTones[index]].accent:`url(#${id}-petal-${flowerTones[index]})`} />)}
              <circle r=".8" fill={palettes[flowerTones[index]].center} />
            </g>
          </g>
        </g>
      </g>
    </g>)}
    <g data-flower-petals="" opacity="0">
      {[{x:-17,y:1,delay:-2},{x:35,y:2,delay:-11}].map((emitter,index)=><g key={index} transform={`translate(${emitter.x} ${emitter.y})`}>
        <g className={id+'-lift'} style={{animationDelay:`${emitter.delay}s`}}>
          <path className={id+'-turn'} d="M0,0 C-2,-.6 -2,-3 .2,-3.4 C2,-2.8 2,-.7 0,0Z" fill={`url(#${id}-petal-${index})`} />
        </g>
      </g>)}
    </g>
  </g>;
}
