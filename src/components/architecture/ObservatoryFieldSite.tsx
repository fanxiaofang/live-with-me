import type { ObservatorySite } from '../../world/scene/observatorySite';

/** Sample the existing route in the ground plane; its two verges vary independently. */
function walkedRoute(site:ObservatorySite) {
  const {start:a,control1:b,control2:c,end:d,scale:s}=site;
  const samples=Array.from({length:19},(_,i)=>{
    const t=i/18,u=1-t;
    const x=u*u*u*a.x+3*u*u*t*b.x+3*u*t*t*c.x+t*t*t*d.x;
    const y=u*u*u*a.y+3*u*u*t*b.y+3*u*t*t*c.y+t*t*t*d.y;
    const tx=3*u*u*(b.x-a.x)+6*u*t*(c.x-b.x)+3*t*t*(d.x-c.x);
    const ty=(3*u*u*(b.y-a.y)+6*u*t*(c.y-b.y)+3*t*t*(d.y-c.y))/.285;
    const len=Math.hypot(tx,ty)||1,half=(11-4*t)*s;
    return {x,y,nx:-ty/len,ny:tx/len*.285,half,t};
  });
  const edge=(p:typeof samples[number],side:number)=>{
    const width=p.half*(side>0?1+.13*Math.sin(p.t*9):.88+.12*Math.cos(p.t*12+1));
    return `${(p.x+side*p.nx*width).toFixed(2)},${(p.y+side*p.ny*width).toFixed(2)}`;
  };
  return {d:'M'+samples.map(p=>edge(p,1)).join(' L')+' L'+[...samples].reverse().map(p=>edge(p,-1)).join(' L')+'Z',samples};
}

/** Short, interrupted shoots grow into the soil from unwalked edges. */
function Stubble({x,y,flip=false,green=false}:{x:number;y:number;flip?:boolean;green?:boolean}) {
  return <g data-observatory-site-plant="" transform={`translate(${x} ${y}) scale(${flip?-1:1} 1)`}>
    <path d="M-3,0 l-.4,-2.8 M0,.4 l.6,-4 M3,.6 l1.4,-2.7" fill="none"
      stroke={green?'#858b50':'#b69b59'} strokeWidth=".65" strokeLinecap="round" />
    <path d="M-1,.7 Q-4,-1 -5.5,-.4 M1,1 Q3,-1.8 4,-2.5" fill="none" stroke="#939657" strokeWidth=".7" strokeLinecap="round" />
    {green&&<path d="M0,.7 Q-4,-.5 -4.2,-3 Q-1.1,-2.7 0,.7 M.4,.8 Q1.5,-3 3.3,-3.2 Q3,-.6 .4,.8Z" fill="#8c9459" />}
  </g>;
}

export function ObservatoryFieldSite({site}:{site:ObservatorySite}) {
  const {center,scale:s,bankStart:a,bankEnd:b}=site;
  const route=walkedRoute(site);
  return <g id="observatory-field-site" pointerEvents="none" aria-hidden="true" filter="url(#field-environment-tone)">
    {/* One worn junction on the existing field line; no outlined strip or repeating center marks. */}
    <path data-observatory-tramline-junction={site.tramline} d={`M${a.x},${a.y} L${b.x},${b.y}`}
      fill="none" stroke="#baa574" strokeWidth={3.1*s} strokeLinecap="round" opacity=".4" />
    <path data-observatory-access-path="" d={site.path} fill="none" stroke="none" />
    <path data-observatory-walked-surface="" d={route.d} fill="#bba173" opacity=".72" />
    {[3,8,13,16].map((index,i)=>{
      const p=route.samples[index],side=i%2?1:-1;
      return <path key={index} d={`M${p.x-3*s},${p.y} q${4*s},${-1.2*s} ${8*s},${.2*s} l${-2*s},${1.2*s} q${-5*s},${.6*s} ${-6*s},${-1.4*s}Z`}
        fill={i%2?'#ccb083':'#ad9568'} opacity={i%2?.46:.28} transform={`translate(${p.nx*side*2*s} ${p.ny*side*2*s})`} />;
    })}
    <g transform={`translate(${center.x} ${center.y}) scale(${s})`}>
      {/* Side maintenance scuffs are separate patches. Most of the back returns to the crop edge. */}
      <g data-observatory-clearing="" fill="#b49a6c">
        <path d="M-46,-8 Q-54,-10 -58,-5 L-56,-2 Q-63,1 -59,7 L-55,8 L-57,12
          Q-52,17 -44,16 L-39,10 L-40,0Z" opacity=".66" />
        <path d="M44,-9 Q53,-11 57,-5 L54,-3 Q61,1 57,6 L53,7 L55,10
          Q50,14 43,13 L39,5Z" opacity=".55" />
        {/* The frequent route fans out only in front of the entrance and its lower steps. */}
        <path d="M-36,9 Q-18,7 -3,12 Q11,12 19,19 L14,22 L17,25
          Q8,28 3,28 L-2,33 Q-16,36 -27,31 L-33,32 Q-44,27 -42,22
          L-38,20 Q-44,15 -36,9Z" opacity=".83" />
      </g>
      <path d="M-31,19 Q-19,15 -8,20 Q-1,22 5,25 L-2,29 Q-14,31 -26,27 L-33,26Z"
        fill="#c5aa7b" opacity=".7" />
      <path d="M-51,4 l3,-1 2,1.5 -3.5,1Z M48,5 l2.2,-.7 1.5,1.3 -2.7,.6Z
        M-32,27 l1.8,-.5 1.1,1 -2.1,.5Z M6,27 l1.6,-.6 1.3,1.2 -2.1,.4Z" fill="#a28e68" opacity=".72" />
      {/* Small, embedded pebbles; no stepping-stone pattern or continuous stone edging. */}
      <path d="M-48,9 l1.6,-.6 1.2,.7 -1.5,.8Z M40,13 l2,-.4 1,.8 -2,.5Z
        M-27,30 l1.4,-.5 1,.6 -1.6,.6Z" fill="#c0ae8b" />
      {[[-60,2],[-53,14],[-38,-14],[52,-9],[58,3],[39,18],[-37,30]].map(([x,y],i)=><Stubble key={i} x={x} y={y} flip={i%2===1} green={i===0||i===3||i===4} />)}
      <path d="M-64,0 l3,.5 m4,16 3,-.6 M59,9 l3,-.4 M33,-14 l3,-.6"
        fill="none" stroke="#b7a064" strokeWidth=".65" strokeLinecap="round" />
    </g>
    {[5,11,15].map((index,i)=>{
      const p=route.samples[index],side=i%2?-1:1;
      return <g key={index} transform={`translate(${p.x+p.nx*side*p.half} ${p.y+p.ny*side*p.half}) scale(${s})`}>
        <path d="M-2,0 l.5,-2.3 M.5,.4 l1.1,-2.8 M2.5,1 l1.8,-1.3" fill="none" stroke={i===1?'#b49d5c':'#919354'} strokeWidth=".65" strokeLinecap="round" />
      </g>;
    })}
  </g>;
}
