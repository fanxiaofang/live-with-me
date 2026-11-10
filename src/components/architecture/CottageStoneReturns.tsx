import type { YorkshireSceneTheme } from '../scenery/yorkshire/landscapeTypes';

type Point = readonly [number, number];
const polygon = (points: Point[]) => `M${points.join(' L')}Z`;

function stonePalette(theme: YorkshireSceneTheme) {
  if (theme.isNight) return { faces: ['#57574b', '#626153', '#505246', '#5b5b4e'], top: '#7b7966', end: '#494c41', joint: '#343b31', moss: '#4d623c', grass: '#6c7d46' };
  if (theme.timeOfDay === 'dusk') return { faces: ['#786b55', '#84745d', '#6e634f', '#7c705b'], top: '#a18c6e', end: '#615643', joint: '#4b4435', moss: '#59653a', grass: '#83904b' };
  return { faces: ['#817866', '#8e8471', '#756e5c', '#857e6a'], top: '#b0a38c', end: '#696252', joint: '#514c3e', moss: '#5d703f', grass: '#8a9d50' };
}

/** Short dry-stone wall feet outside the cutaway. The shell hides the rear run;
 * the exposed coping and bonded ends explain the wall's thickness at each post. */
export function CottageStoneReturns({ theme }: { theme: YorkshireSceneTheme }) {
  const p = stonePalette(theme);
  return <g id="cottage-stone-returns" pointerEvents="none" aria-hidden="true">
    {([-1, 1] as const).map(side => {
      const width = side === -1 ? 29 : 26;
      const end = side === -1 ? -5 : -2;
      const height = side === -1 ? 33 : 30;
      const point = (t: number, w: number, z = 0): Point => [side * (270 - t + w), 153 - .285 * (t + w) - z];
      const face = (a: number, b: number, low: number, high: number) => polygon([
        point(a, width, low + .4), point(b - .5, width, low),
        point(b, width, high - 1), point(b - 2, width, high + .3),
        point(a + 1.5, width, high), point(a, width, high - 1.4),
      ]);
      return <g key={side} data-stone-return={side === -1 ? 'left' : 'right'} strokeLinejoin="round">
        {/* Keep the grounding shadow as a slim warm contact edge; a broad olive
            footprint showed through the exposed stone joints and read as a notch. */}
        <path d={polygon([point(end-.8,0),point(98.6,0),point(98.6,width+1.2),point(end-.8,width+1.2)])} fill="#3b342c" opacity=".18" />
        <path d={polygon([point(end,0),point(98,0),point(98,width),point(end,width)])} fill={p.joint} />
        <path d={face(end,98,0,height)} fill={p.joint} />
        {/* Offset joints and restrained facets, matching the sheepfold's gritstone. */}
        {[[end,21,48,72,98],[end,12,38,65,98]].map((cuts,row) => cuts.slice(0,-1).map((a,i) => {
          const b = cuts[i+1], low = row * 11, high = low + 10.5;
          return <g key={`${row}-${i}`}>
            <path d={face(a,b,low,high)} fill={p.faces[(i+row+(side===1?1:0))%4]} stroke={p.joint} strokeWidth=".45" />
            {i%2===0 && <path d={`M${point(a+3,width,high-1.4)} L${point(Math.min(b-3,a+13),width,high-1)}`} stroke={p.top} strokeWidth=".65" opacity=".5" />}
          </g>;
        }))}
        {/* The wall end turns back towards the post, rather than ending as a thin sheet. */}
        {[0,1].map(row => <g key={row}>
          <path d={polygon([point(end,0,row*11),point(end,width,row*11),point(end,width,row*11+10.6),point(end,0,row*11+10.6)])}
            fill={side===-1?p.faces[row]:p.end} stroke={p.joint} strokeWidth=".5" />
          <path d={`M${point(end,row?10:18,row*11+.5)} L${point(end,row?10:18,row*11+10.4)}`} stroke={p.joint} strokeWidth=".65" />
        </g>)}
        {[end,19,45,71].map((a,i,starts) => {
          const b = starts[i+1] ?? 98, h = height + (i%2 ? -.6 : .5);
          return <g key={a}>
            <path d={face(a,b,22,h-2)} fill={p.faces[(i+1)%4]} stroke={p.joint} strokeWidth=".45" />
            {i===0 && <path d={polygon([point(end,0,22),point(end,width,22),point(end,width,h-2),point(end,0,h-2)])} fill={p.end} />}
            <path d={polygon([point(a-.5,-1,h),point(b-.8,-1,h-.3),point(b+.4,width+1,h-1),point(a+1,width+1,h-1.5),point(a-.5,width-2,h)])}
              fill={p.top} stroke={p.joint} strokeWidth=".5" />
            <path d={`M${point(a+2,width,h-1.6)} L${point(b-2,width,h-1)}`} fill="none" stroke={p.faces[1]} strokeWidth=".8" />
          </g>;
        })}
        <path d={`M${point(end,width+1,3)} q4,-2 7,-1 l-1,2 -5,1 Z M${point(16,width+.5,10)} l5,-.4 -1,1.8 -4,.3Z`} fill={p.moss} />
        {[end+1,18].map((t,i) => <g key={t} transform={`translate(${point(t,width+2)})`}>
          <path d={`M-5,1 Q-5,-3 -8,-5 Q-3,-4 -1,0 Q0,-6 ${i?3:1},-8 Q3,-3 2,1 Q5,-3 8,-3 L5,2Z`} fill={p.moss} />
          <path d="M-1,1 Q-2,-3 -4,-5 M2,1 Q3,-2 5,-4" stroke={p.grass} strokeWidth=".65" fill="none" />
        </g>)}
      </g>;
    })}
  </g>;
}
