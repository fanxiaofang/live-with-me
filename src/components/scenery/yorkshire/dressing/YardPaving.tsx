import type { YorkshireSceneTheme } from '../landscapeTypes';
import { PAVING_SIZE_SCALE, YARD_IDS, isPaving, type YardId } from '../../../../features/yard-editor/yardLayout';
import { YardObject, useYardPlacement } from '../../../../features/yard-editor/YardWorld';
import { NaturalPavingStone } from './NaturalPavingStone';

const STONE = {
  fieldstone: { top:'#b8a77e', mid:'#998966', side:'#70634d', seam:'#665b48', light:'#d0c29a' },
  limestone: { top:'#d2c8a9', mid:'#b9ad8e', side:'#887f6a', seam:'#807967', light:'#e3d9bb' },
  cobble: { top:'#9a9b86', mid:'#818572', side:'#5e6658', seam:'#566052', light:'#b7b59a' },
  brick: { top:'#a66d4d', mid:'#90573e', side:'#653f31', seam:'#59392e', light:'#c18a62' },
} as const;

/** Reusable surface pieces; each paving slot keeps its own placement and yaw. */
export function YardPaving({ theme }: { theme: YorkshireSceneTheme }) {
  return <>{YARD_IDS.filter(isPaving).map(id => <PavingSlot key={id} id={id} theme={theme} />)}</>;
}

function PavingSlot({id,theme}:{id: YardId;theme:YorkshireSceneTheme}) {
  const {material,angle,pavingSize='medium'}=useYardPlacement(id);
  if (!material) return null;
  const index=Number(id.slice(7))||1;
  const size=PAVING_SIZE_SCALE[pavingSize];
  return <YardObject id={id}>
    <g data-paving-piece={material} data-paving-index={index} transform={`scale(1 .285) rotate(${angle}) scale(1 3.50877)`}
      pointerEvents="none" strokeLinejoin="round" strokeLinecap="round"
      style={theme.landscapeEnvironment ? {filter:'url(#field-environment-tone)'} : theme.isNight ? {opacity:.73} : undefined}>
      <g data-paving-size={pavingSize} transform={`scale(${size})`}>
        <ellipse cx="0" cy="4.5" rx="18" ry="5" fill="#2d3826" opacity=".2" />
        {material==='fieldstone' && <Fieldstone index={index} thickness={2/size} />}
        {material==='limestone' && <Limestone index={index} thickness={2/size} />}
        {material==='cobble' && <Cobble index={index} thickness={2/size} />}
        {material==='brick' && <Brick index={index} thickness={2/size} />}
        {(material==='rawGranite' || material==='riverRock' || material==='splitSlate') && <NaturalPavingStone kind={material} index={index} thickness={2/size} />}
        {(material==='oak' || material==='weathered') && <Timber index={index} weathered={material==='weathered'} thickness={1.3/size} />}
        {material!=='rawGranite' && material!=='riverRock' && material!=='splitSlate' && <path d="M-9,0 l4,-1 M5,-3 l4,-1" fill="none" stroke="#fff1d2" strokeWidth=".55" opacity=".35" />}
      </g>
    </g>
  </YardObject>;
}

function Fieldstone({index,thickness}:{index:number;thickness:number}) {
  const p=STONE.fieldstone, flip=index%2;
  const top=flip
    ? 'M-17,-2 L-12,-6 -5,-7 1,-6 8,-7 15,-3 17,1 11,4 4,5 -5,4 -12,5 -17,2Z'
    : 'M-16,-2 L-13,-5 -6,-6 1,-5 5,-7 13,-5 17,-1 14,3 6,5 -3,4 -10,5 -16,2Z';
  return <g data-stone-shape={flip?'long-flag':'broken-flag'}>
    <path d={top} transform={`translate(0 ${thickness})`} fill={p.side} stroke={p.seam} strokeWidth=".75" />
    <path d={top} fill={p.top} stroke={p.seam} strokeWidth=".7" />
    <path d={flip?'M-11,-4 L-5,-5 1,-4 M5,-5 L12,-3':'M-11,-3 L-5,-4 M1,-5 L5,-6 M7,-4 L12,-3'} fill="none" stroke={p.light} strokeWidth=".8" />
    {index%3===0 && <path d="M-4,1 l3,-1 M8,0 l2,-1" stroke="#70634d" strokeWidth=".65" fill="none" />}
  </g>;
}

function Limestone({index,thickness}:{index:number;thickness:number}) {
  const p=STONE.limestone;
  const top=index%2
    ? 'M-16,-3 Q-13,-7 -6,-6 L1,-7 8,-5 Q15,-5 17,-1 L15,3 8,4 2,5 -6,4 -13,5 -17,1Z'
    : 'M-17,-1 L-14,-5 -7,-6 0,-5 7,-7 14,-4 17,0 14,4 6,5 -2,4 -11,5 -16,2Z';
  return <g data-stone-shape={index%2?'soft-limestone':'cut-limestone'}>
    <path d={top} transform={`translate(0 ${thickness})`} fill={p.side} stroke={p.seam} strokeWidth=".7" />
    <path d={top} fill={p.top} stroke={p.seam} strokeWidth=".65" />
    <path d="M-12,-3 Q-5,-5 1,-4 M6,-4 L12,-3 M-8,1 Q-2,0 2,1" fill="none" stroke={p.light} strokeWidth=".8" />
    <path d="M-3,-2 l2,1 M8,0 l2,-1" stroke="#9d947d" strokeWidth=".55" />
  </g>;
}

function Cobble({index,thickness}:{index:number;thickness:number}) {
  const p=STONE.cobble, offset=index%2;
  return <g data-stone-shape="cobble-set">
    <path d="M-15,1 Q-17,-2 -14,-4 Q-12,-7 -8,-5 Q-5,-8 -2,-5 L0,-2 -2,2 -7,4 -12,3Z M-3,-2 Q-2,-6 2,-6 Q5,-8 8,-5 Q13,-7 15,-3 L16,0 12,3 7,4 2,2 -1,4 -5,2Z"
      transform={`translate(0 ${thickness})`} fill={p.side} stroke={p.seam} strokeWidth=".75" />
    <path d="M-15,-1 Q-17,-4 -14,-6 Q-12,-9 -8,-7 Q-5,-10 -2,-7 L0,-4 -2,0 -7,2 -12,1Z M-3,-4 Q-2,-8 2,-8 Q5,-10 8,-7 Q13,-9 15,-5 L16,-2 12,1 7,2 2,0 -1,2 -5,0Z"
      fill={p.top} stroke={p.seam} strokeWidth=".7" />
    <path d={`M-12,-5 q3,-2 5,0 M${offset?2:4},-6 q3,-2 6,0 M-6,-2 q2,-1 4,0`} fill="none" stroke={p.light} strokeWidth=".75" />
  </g>;
}

function Brick({index,thickness}:{index:number;thickness:number}) {
  const p=STONE.brick, stagger=index%2;
  return <g data-brick-pattern={stagger?'header':'stretcher'}>
    <path d="M-16,-3 L-9,-5 7,-4 16,-2 15,3 -5,5 -16,2Z" transform={`translate(0 ${thickness})`} fill={p.side} stroke={p.seam} strokeWidth=".75" />
    <path d="M-16,-5 L-9,-7 7,-6 16,-4 15,1 -5,3 -16,0Z" fill={p.mid} stroke={p.seam} strokeWidth=".75" />
    <path d="M-16,-5 L-9,-7 7,-6 16,-4 9,-2 -7,-3Z" fill={p.top} />
    <path d={stagger?'M-7,-6 L-5,2 M7,-6 L9,-2':'M0,-5 L2,2'} stroke={p.seam} strokeWidth=".7" />
    <path d="M-12,-5 L-8,-6 M-3,-5 L4,-5 M10,-4 L13,-4" fill="none" stroke={p.light} strokeWidth=".7" />
  </g>;
}

function Timber({index,weathered,thickness}:{index:number;weathered:boolean;thickness:number}) {
  const base=weathered?'#756044':'#a1784b', top=weathered?'#9a805d':'#c49a63';
  const side=weathered?'#4e4436':'#705034', grain=weathered?'#584832':'#8d6842';
  const shift=index%3-1;
  return <g data-timber-pattern={weathered?'weathered':'oak-plank'}>
    {[-5,0,5].map((row,i)=>{
      const x=shift*(i===1?4:2);
      return <g key={row}>
        <path d={`M-16,${row-1} L-12,${row-3} 12,${row-2} 16,${row} 12,${row+2} -12,${row+2} -16,${row+1}Z`} transform={`translate(0 ${thickness})`} fill={side} stroke="#4b3927" strokeWidth=".55" />
        <path d={`M-16,${row-2} L-12,${row-4} 12,${row-3} 16,${row-1} 12,${row+1} -12,${row+1} -16,${row}Z`} fill={i===1?top:base} stroke="#59432c" strokeWidth=".55" />
        <path d={`M${-12+x},${row-3.2} Q${-3+x},${row-4.4} ${5+x},${row-3.5} M${-8-x},${row-.5} L${-2-x},${row-.7}`} fill="none" stroke={grain} strokeWidth=".55" opacity=".82" />
      </g>;
    })}
    {weathered && <path d="M-15,-5 l4,-1 2,2 -4,1 M10,2 l4,-1 1,2 -4,1" fill="#4d4334" opacity=".65" />}
    {!weathered && <><circle cx="-12" cy="-5" r=".65" fill="#493723"/><circle cx="12" cy="5" r=".65" fill="#493723"/></>}
  </g>;
}
