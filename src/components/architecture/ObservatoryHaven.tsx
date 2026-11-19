import React from 'react';
import { ObservatoryStoneTower } from './ObservatoryStoneTower';
import type { ResolvedPresenceSlot } from '../../features/presence/presenceAllocation';
import type { Person } from '../../types';
import type { InteractionTarget } from '../../world/interactions/interactionTypes';
import { svgAction } from '../../world/interactions/svgAction';
import { StandingCharacter } from '../characters/StandingCharacter';
import { CHARACTER_WORLD_SIZE } from '../characters/characterProportions';
import type { YorkshireSceneTheme } from '../scenery/yorkshire/landscapeTypes';

export interface ObservatoryHavenProps {
  characterParentScale?: number;
  theme: Pick<YorkshireSceneTheme, 'roadColor' | 'hillGreenFar'> & { isNight?: boolean };
  presenceSlots: Partial<Record<'observatory_post', ResolvedPresenceSlot>>;
  alienPulseEffect?: boolean;
  showFrequencyReadout?: boolean;
  triggerAlienSignal: (event?: React.MouseEvent) => void;
  onSelectPerson: (person: Person) => void;
  setHoveredObject: (target: InteractionTarget | null) => void;
}

/**
 * 📐 严格统一的 2.5D 轴测投影体系 (Consistent Axonometric Projection)
 * 与整个 Live With Me 场景 (TimberFlooring, CottageFoundation, WoodenCabinHaven)
 * 严格共享相同的地面视觉斜率与轴测空间向量：
 *
 * - u 轴：长边轴，向右下方延伸 (dx = +1, dy = +SLOPE)
 * - v 轴：进深轴，向左下方延伸 (dx = -1, dy = +SLOPE)
 * - z 轴：垂直高度轴，垂直向上 (dx = 0, dy = -1)
 */
const SLOPE = 0.283088; // 统一地面斜率常数 (约 15.8°)
const GROUND_Y = 48; // 地面接触基准高度
const DECK_Z = 82; // 石塔内部楼梯通向的观测平台高度
const DECK_U = 40;
const DECK_V = 36;
const RECEIVER_Z = DECK_Z + 62; // Short, braced frame clears the rear canopy edge.
const RECEIVER_U = -27;
const RECEIVER_V = -27;
const DISH_SCALE = 1.16;
// Projected bowl normal is its rotated minor axis; the prime-focus feed faces back at the bowl.
const FEED_FOCUS = { x: -6, y: -18 };

/**
 * 3D 轴测点 (u, v, z) -> 2D 屏幕点 (x, y)
 */
const pt = (u: number, v: number, z = 0) => ({
  x: Number((u - v).toFixed(2)),
  y: Number((GROUND_Y + SLOPE * (u + v) - z).toFixed(2)),
});

/**
 * 将若干个 3D 点格式化为 SVG polygon points 字符串
 */
const face = (...vertices: [number, number, number][]) =>
  vertices.map(([u, v, z]) => `${pt(u, v, z).x},${pt(u, v, z).y}`).join(' ');

/** A thin masonry cap receives two timber beams, leaving the central stair opening clear. */
function ObservatoryCrown({ night = false }: { night?: boolean }) {
  return <g id="observatory-stone-crown" pointerEvents="none" strokeLinejoin="round"
    filter={night ? 'url(#field-environment-tone)' : undefined}>
    <path d="M-38,-26 A38,10.8 0 0 0 38,-26 L38,-23.5 A38,10.8 0 0 1 -38,-23.5Z" fill="#a79371" />
    <ellipse cy="-26" rx="38" ry="10.8" fill="#c5b18b" />
    {[-15,11].map(u => <g key={u} data-deck-bearing-beam="">
      <polygon points={face([u-2,18,74],[u+2,18,74],[u+2,18,79],[u-2,18,79])} fill="#ae8856" stroke="#715335" strokeWidth=".5" />
      <polygon points={face([u+2,18,74],[u+2,-21,74],[u+2,-21,79],[u+2,18,79])} fill="#795a3a" stroke="#624b32" strokeWidth=".5" />
      <polygon points={face([u-2,-21,79],[u+2,-21,79],[u+2,18,79],[u-2,18,79])} fill="#ae8b5a" />
    </g>)}
    {/* Opposite corbels share mirrored ground anchors, each receiving the deck soffit. */}
    {[-1,1].map(side => {
      const anchor = (u:number,v:number,z:number):[number,number,number] =>
        side < 0 ? [u,v,z] : [v,u,z];
      return <g key={side} data-deck-corbel={side < 0 ? 'left' : 'right'}>
        <polygon points={face(anchor(-18,19,56),anchor(-16,19,56),anchor(-16,19,74),anchor(-18,19,74))}
          fill="#8a6741" stroke="#6c5035" strokeWidth=".5" />
        <polygon points={face(anchor(-18,19,58),anchor(-28,30,76),anchor(-28,30,79),anchor(-18,19,63))}
          fill={side < 0 ? '#ac8553' : '#947044'} stroke="#705236" strokeWidth=".6" />
        <polygon points={face(anchor(-28,30,76),anchor(-26.5,30,76),anchor(-16.5,19,58),anchor(-18,19,58))}
          fill="#6d5135" />
        <polygon points={face(anchor(-29,31,76),anchor(-15,19,76),anchor(-15,19,79),anchor(-29,31,79))}
          fill="#987447" stroke="#725438" strokeWidth=".45" />
        {[60,71].map(z => {
          const p=pt(...anchor(-17,19,z));
          return <circle key={z} cx={p.x} cy={p.y} r=".6" fill="#544c38" />;
        })}
      </g>;
    })}
  </g>;
}

/** Chamfered rear and side expansion keeps the former front reach unchanged. */
const deckOutline = (inset: number, z: number): [number,number,number][] => {
  const l=-DECK_U-3+inset,r=DECK_U-3-inset,b=-DECK_V-3+inset,f=DECK_V-3-inset,c=6;
  return [[l+c,b,z],[r-c,b,z],[r,b+c,z],[r,f-c,z],[r-c,f,z],[l+c,f,z],[l,f-c,z],[l,b+c,z]];
};

function ObservatoryDeck({ night = false }: { night?: boolean }) {
  const uid='observatory-deck-'+React.useId().replace(/:/g,'');
  const outline=deckOutline(0,DECK_Z),inner=deckOutline(2,DECK_Z+.1);
  return <g id="observatory-deck-platform" filter={night ? 'url(#field-environment-tone)' : undefined} strokeLinejoin="round">
    <defs><clipPath id={uid}><polygon points={face(...inner)} /></clipPath></defs>
    {[2,3,4].map(i => {const p=outline[i],n=outline[(i+1)%8];return <polygon key={i}
      points={face([p[0],p[1],DECK_Z-3],[n[0],n[1],DECK_Z-3],n,p)}
      fill={i===4 ? '#a17a4a' : '#7c5d3c'} stroke="#6e5337" strokeWidth=".55" />;})}
    <polygon points={face(...outline)} fill="#92744b" stroke="#765d3e" strokeWidth=".7" />
    <polygon points={face(...inner)} fill="#b09263" />
    <g clipPath={'url(#'+uid+')'}>
      {[-28,-16,-4,8,20,30].map(v => <line key={v}
        x1={pt(-44,v,DECK_Z+.1).x} y1={pt(-44,v,DECK_Z+.1).y}
        x2={pt(38,v,DECK_Z+.1).x} y2={pt(38,v,DECK_Z+.1).y}
        stroke="#806344" strokeWidth=".6" opacity=".65" />)}
    </g>
    <polygon id="observatory-operation-mat" points={face([10,20,DECK_Z+.2],[32,20,DECK_Z+.2],[32,31,DECK_Z+.2],[10,31,DECK_Z+.2])}
      fill="#7e8060" fillOpacity=".45" stroke="#777958" strokeWidth=".5" />
  </g>;
}

function ObservatoryRail({ front }: { front: boolean }) {
  const points=deckOutline(1.2,DECK_Z);
  const edges=front ? [2,3,4,5] : [6,7,0,1];
  const posts=(front ? [2,3,4,5,6] : [0,1,7]).map(i=>points[i]);
  const a=points[front ? 4 : 0],b=points[front ? 5 : 1];
  posts.push([(a[0]+b[0])/2,(a[1]+b[1])/2,DECK_Z]);
  return <g id={front ? 'observatory-front-guardrail' : 'observatory-rear-guardrail'} strokeLinecap="round">
    {edges.map(i => {const a=points[i],b=points[(i+1)%8];return <g key={i}>
      {[6,14].map(z=><line key={z} x1={pt(a[0],a[1],DECK_Z+z).x} y1={pt(a[0],a[1],DECK_Z+z).y}
        x2={pt(b[0],b[1],DECK_Z+z).x} y2={pt(b[0],b[1],DECK_Z+z).y}
        stroke={z===14 ? '#745a3c' : '#8d6d46'} strokeWidth={z===14 ? 1.6 : 1.05} />)}
    </g>;})}
    {posts.map(([u,v],i)=><line key={i} x1={pt(u,v,DECK_Z).x} y1={pt(u,v,DECK_Z).y}
      x2={pt(u,v,DECK_Z+14.5).x} y2={pt(u,v,DECK_Z+14.5).y} stroke="#80603d" strokeWidth="1.8" />)}
  </g>;
}

/** Compact iron frame sits inside the chamfered northern corner of the deck. */
function ObservatoryAntennaStand({ night = false }: { night?: boolean }) {
  const at = (u:number,v:number,z:number):[number,number,number] => [RECEIVER_U+u,RECEIVER_V+v,z];
  const feet=[at(-10,-7,DECK_Z),at(10,-7,DECK_Z),at(10,7,DECK_Z),at(-10,7,DECK_Z)];
  const top=[at(-6,-4,RECEIVER_Z-3),at(6,-4,RECEIVER_Z-3),at(6,4,RECEIVER_Z-3),at(-6,4,RECEIVER_Z-3)];
  const line=(a:[number,number,number],b:[number,number,number])=>'M'+face(a)+' L'+face(b);
  return <g id="observatory-antenna-stand" data-antenna-support="open-iron-frame" strokeLinecap="round" strokeLinejoin="round"
    filter={night ? 'url(#field-environment-tone)' : undefined}>
    <polygon points={face(at(-12,-9,DECK_Z+.1),at(12,-9,DECK_Z+.1),at(12,9,DECK_Z+.1),at(-12,9,DECK_Z+.1))}
      fill="#977b51" stroke="#745d3e" strokeWidth=".4" />
    {[-10,10].map(u=><path key={u} d={line(at(u,-8,DECK_Z+.3),at(u,8,DECK_Z+.3))} fill="none" stroke="#66634e" strokeWidth="1.2" />)}
    {feet.map(([u,v],i)=><polygon key={i} points={face([u-1.6,v-1.6,DECK_Z+.2],[u+1.6,v-1.6,DECK_Z+.2],[u+1.6,v+1.6,DECK_Z+.2],[u-1.6,v+1.6,DECK_Z+.2])}
      fill="#6e6b50" stroke="#504e3c" strokeWidth=".45" />)}
    {feet.map((p,i)=><g key={i}><path d={line(p,top[i])} fill="none" stroke={i<2 ? '#575748' : '#68624d'} strokeWidth="2.4" />
      <path d={line([p[0]-.5,p[1],p[2]+2],[top[i][0]-.5,top[i][1],top[i][2]-1])} fill="none" stroke="#a29b78" strokeWidth=".5" opacity=".7" /></g>)}
    <path d={line(at(-10,7,DECK_Z+5),at(6,4,RECEIVER_Z-9))+' '+
      line(at(10,7,DECK_Z+5),at(-6,4,RECEIVER_Z-9))+' '+
      line(at(10,-7,DECK_Z+6),at(6,4,RECEIVER_Z-9))}
      fill="none" stroke="#777059" strokeWidth="1.45" />
    <path d={line(at(-9,6.5,DECK_Z+17),at(9,6.5,DECK_Z+17))+' '+
      line(at(9,-6.5,DECK_Z+17),at(9,6.5,DECK_Z+17))}
      fill="none" stroke="#625f4c" strokeWidth="1.8" />
    <polygon points={face(at(-10,7,RECEIVER_Z-3),at(10,7,RECEIVER_Z-3),at(10,7,RECEIVER_Z),at(-10,7,RECEIVER_Z))} fill="#6b6550" />
    <polygon points={face(at(10,7,RECEIVER_Z-3),at(10,-7,RECEIVER_Z-3),at(10,-7,RECEIVER_Z),at(10,7,RECEIVER_Z))} fill="#504f40" />
    <polygon data-receiver-roof="steel-bearing-head" points={face(at(-10,-7,RECEIVER_Z),at(10,-7,RECEIVER_Z),at(10,7,RECEIVER_Z),at(-10,7,RECEIVER_Z))} fill="#8d8667" stroke="#5b5845" strokeWidth=".5" />
  </g>;
}

function ObservatoryWorkbench({ night = false }: { night?: boolean }) {
  return <g id="observatory-workbench" strokeLinejoin="round" filter={night ? 'url(#field-environment-tone)' : undefined}>
    {[[15,7],[30,7],[15,17],[30,17]].map(([u,v])=><g key={u+','+v}>
      <polygon points={face([u-1,v+1,DECK_Z],[u+1,v+1,DECK_Z],[u+1,v+1,DECK_Z+19],[u-1,v+1,DECK_Z+19])} fill="#526c70" />
      <polygon points={face([u+1,v+1,DECK_Z],[u+1,v-1,DECK_Z],[u+1,v-1,DECK_Z+19],[u+1,v+1,DECK_Z+19])} fill="#354a50" />
    </g>)}
    <polygon points={face([14,18,DECK_Z+18.5],[31,18,DECK_Z+18.5],[31,18,DECK_Z+20],[14,18,DECK_Z+20])} fill="#819b9e" />
    <polygon points={face([31,18,DECK_Z+18.5],[31,6,DECK_Z+18.5],[31,6,DECK_Z+20],[31,18,DECK_Z+20])} fill="#647e83" />
    <polygon points={face([14,6,DECK_Z+20],[31,6,DECK_Z+20],[31,18,DECK_Z+20],[14,18,DECK_Z+20])}
      fill="#b4c9c7" stroke="#607b80" strokeWidth=".55" />
    <path d={'M'+face([14.5,17.6,DECK_Z+19.7])+' L'+face([30.5,17.6,DECK_Z+19.7])}
      fill="none" stroke="#d4dfd8" strokeWidth=".5" />
    <path d={'M'+face([16,17,DECK_Z+4])+' L'+face([29,17,DECK_Z+4])}
      fill="none" stroke="#435e63" strokeWidth="1.2" />
    <polygon points={face([14,16,DECK_Z+20.1],[16,16,DECK_Z+20.1],[16,18,DECK_Z+20.1],[14,18,DECK_Z+20.1])}
      fill="#788e8e" opacity=".7" />
  </g>;
}


/** Rear fittings and foreground canopy are separate painter layers around the occupant. */
function ObservatoryListeningShelter({ night = false, front = false }: { night?: boolean; front?: boolean }) {
  const floor = DECK_Z;
  const q = (u: number,v: number,z: number) => {
    const p=pt(u,v,floor+z); return p.x+','+p.y;
  };
  const roofHeight = (v: number) => 59-(v+12)*6/44;
  const post = (u: number,v: number) => {
    const top=roofHeight(v)-1.6, h=1.3;
    return <g key={u+','+v} data-shelter-timber-post="">
      <polygon points={face([u-h,v+h,floor],[u+h,v+h,floor],[u+h,v+h,floor+top],[u-h,v+h,floor+top])}
        fill="#967044" stroke="#644a30" strokeWidth=".5" />
      <polygon points={face([u+h,v+h,floor],[u+h,v-h,floor],[u+h,v-h,floor+top],[u+h,v+h,floor+top])} fill="#6d5135" />
      <path d={'M'+q(u-.6,v+h,3)+' L'+q(u-.6,v+h,top-3)} fill="none" stroke="#c09a62" strokeWidth=".55" opacity=".8" />
    </g>;
  };
  const pillarLamp = (near: boolean) => {
    const [u,v,z] = near ? [-26,23,39] : [29,-5,44];
    const mount = near ? [-30,26] : [33,-9];
    const lamp=pt(u,v,floor+z);
    return <g data-shelter-pillar-lamp={near ? 'stair' : 'workbench'} pointerEvents="none">
      {night && <ellipse cx={lamp.x} cy={lamp.y+8} rx="5" ry="11" fill="#edc278" opacity=".09" />}
      <g filter="url(#field-environment-tone)">
        <path d={'M'+q(mount[0],mount[1],z-1)+' L'+q(mount[0],mount[1],z+7)+
          ' L'+q(u,v,z+7)+' L'+q(u,v,z+3)} fill="none" stroke="#45524a" strokeWidth=".85" />
        <path d={`M${lamp.x-2.8},${lamp.y-1} L${lamp.x-1.3},${lamp.y-3.3} L${lamp.x+1.3},${lamp.y-3.3} L${lamp.x+2.8},${lamp.y-1}Z`}
          fill="#637466" stroke="#3f5146" strokeWidth=".55" />
        <path d={`M${lamp.x-2.3},${lamp.y-1} V${lamp.y+4} Q${lamp.x},${lamp.y+5.2} ${lamp.x+2.3},${lamp.y+4} V${lamp.y-1}Z`}
          fill="#bdb58b" stroke="#475b4d" strokeWidth=".5" />
      </g>
      <path d={`M${lamp.x-1.3},${lamp.y-.5} V${lamp.y+3.5} Q${lamp.x},${lamp.y+4.2} ${lamp.x+1.3},${lamp.y+3.5} V${lamp.y-.5}Z`}
        fill={night ? '#ffe1a0' : '#d1c58f'} />
      <path d={`M${lamp.x-2.4},${lamp.y+4.4} H${lamp.x+2.4}`} stroke="#526350" strokeWidth=".65" />
    </g>;
  };
  // Board lengths vary at the eaves; all share one sloping bearing plane.
  const boards = [
    {l:-36,r:-24,b:-12,f:29,c:'#a76c42'},
    {l:-24,r:-12,b:-14,f:32,c:'#9b8054'},
    {l:-12,r:1,b:-12,f:30,c:'#7f8865'},
    {l:1,r:13,b:-13,f:33,c:'#8e9872'},
    {l:13,r:25,b:-11,f:31,c:'#778465'},
    {l:25,r:38,b:-12,f:29,c:'#8a906b'},
  ];
  if (front) return <g id="observatory-shelter-foreground" strokeLinejoin="round" strokeLinecap="round">
    <g filter={night ? 'url(#field-environment-tone)' : undefined}>
      {post(-30,26)}{post(36,23)}
      <path d={'M'+q(-30,26,40)+' L'+q(-18,26,roofHeight(26)-2)+
        ' M'+q(36,23,40)+' L'+q(24,23,roofHeight(23)-2)}
        fill="none" stroke="#85613d" strokeWidth="2.6" />
      {/* Front and side fascia visibly receive the roof boards. */}
      <polygon points={face([-33,27,floor+roofHeight(27)-3],[35,27,floor+roofHeight(27)-3],
        [35,27,floor+roofHeight(27)],[-33,27,floor+roofHeight(27)])} fill="#715236" />
      <polygon points={face([34,-11,floor+roofHeight(-11)-3],[34,28,floor+roofHeight(28)-3],
        [34,28,floor+roofHeight(28)],[34,-11,floor+roofHeight(-11)])} fill="#614c35" />
      {boards.map(({l,r,b,f,c},i) => <g key={l} data-shelter-roof-board="">
        <polygon points={face([l,f,floor+roofHeight(f)-1.3],[r-.3,f,floor+roofHeight(f)-1.3],
          [r-.3,f,floor+roofHeight(f)],[l,f,floor+roofHeight(f)])} fill="#5e5b41" />
        <polygon points={face([l,b,floor+roofHeight(b)],[r-.3,b,floor+roofHeight(b)],
          [r-.3,f,floor+roofHeight(f)],[l,f,floor+roofHeight(f)])}
          fill={c} stroke="#596047" strokeWidth=".6" />
        <path d={'M'+q(l+1.2,b+3,roofHeight(b+3)+.1)+' L'+q(l+1.2,f-3,roofHeight(f-3)+.1)}
          fill="none" stroke={i<2 ? '#c5a374' : '#b5be91'} strokeWidth=".6" opacity=".6" />
        {[-7,25].map(v => <circle key={v} cx={pt(r-2,v,floor+roofHeight(v)).x}
          cy={pt(r-2,v,floor+roofHeight(v)).y} r=".48" fill="#51533e" />)}
      </g>)}
      {/* A short replacement sheet overlaps two aged green boards at the eave. */}
      <polygon data-shelter-roof-patch="" points={face([24,17,floor+roofHeight(17)+.5],[38,17,floor+roofHeight(17)+.5],
        [38,31,floor+roofHeight(31)+.5],[24,31,floor+roofHeight(31)+.5])}
        fill="#bd8050" stroke="#805a38" strokeWidth=".6" />
      <path d={'M'+q(26,19,roofHeight(19)+.6)+' L'+q(26,29,roofHeight(29)+.6)} stroke="#d4a16a" strokeWidth=".7" />
    </g>
    {pillarLamp(true)}
  </g>;
  return <g id="observatory-control-cabin" data-observatory-stair-head="internal-access"
    data-listening-shelter="wide-patched-canopy" strokeLinecap="round" strokeLinejoin="round">
    <title>麦田监听棚 · 拼接雨棚、侧翻盖与塔内楼梯口</title>
    <g filter={night ? 'url(#field-environment-tone)' : undefined}>
      {post(-30,-9)}{post(33,-9)}
      <path d={'M'+q(-30,-9,44)+' L'+q(-18,-9,roofHeight(-9)-2)+
        ' M'+q(33,-9,44)+' L'+q(21,-9,roofHeight(-9)-2)} fill="none" stroke="#85613d" strokeWidth="2.5" />
      {/* Rear windbreak stays clear of the hatch's entire swing. */}
      {[8,15,22].map((z,i) => <polygon key={z}
        points={face([-29,-13,floor+z],[-7,-13,floor+z],[-7,-13,floor+z+5.5],[-29,-13,floor+z+5.5])}
        fill={['#ac8857','#9a794e','#b2905e'][i]} stroke="#735636" strokeWidth=".5" />)}
      <polygon points={face([-12,-5,floor+.2],[8,-5,floor+.2],[8,13,floor+.2],[-12,13,floor+.2])}
        fill="#876b46" stroke="#73583a" strokeWidth=".6" />
      <polygon data-central-stairwell="" points={face([-11,-4,floor+.25],[7,-4,floor+.25],[7,12,floor+.25],[-11,12,floor+.25])}
        fill="#30382c" />
      <polygon points={face([-10,-3,floor+.3],[-10,11,floor+.3],[-7,10,floor+.3],[-7,-3,floor+.3])} fill="#53563e" />
      {[2,6,10].map((v,i) => <path key={v} d={'M'+q(-7,v,.4)+' L'+q(5,v,.4)}
        stroke={['#69684c','#89805a','#b09a6c'][i]} strokeWidth={1+i*.2} fill="none" />)}
      <polygon points={face([-11,-4,floor+1],[-11,12,floor+1],[-22,12,floor+12],[-22,-4,floor+12])}
        data-stair-door-leaf="raised-hatch" fill="#ad8653" stroke="#725435" strokeWidth=".7" />
      <path d={'M'+q(-22,12,12)+' L'+q(-11,12,1)+' L'+q(-11,12,0)+' L'+q(-22,12,11)+'Z'} fill="#735637" />
      <path d={'M'+q(-15,-3,5)+' L'+q(-15,11,5)+' M'+q(-19,-3,9)+' L'+q(-19,11,9)}
        stroke="#795b38" strokeWidth=".6" fill="none" />
      <path d={'M'+q(-20,-2,10)+' L'+q(-14,-2,1)+
        ' M'+q(-11,-1,1.3)+' L'+q(-11,1,1.3)+' M'+q(-11,7,1.3)+' L'+q(-11,9,1.3)}
        stroke="#555b45" strokeWidth="1.1" fill="none" />
      <path d={'M'+q(-12,-5,1)+' L'+q(-12,-5,15)+' L'+q(8,-5,15)+' L'+q(8,-5,1)+
        ' M'+q(8,-5,15)+' L'+q(8,8,15)+' L'+q(8,8,1)}
        stroke="#9c794e" strokeWidth="1.5" fill="none" />
      {/* Coax follows the rear frame, then the deck to the back of the receiver. */}
      <path data-observatory-feed-cable="" d={'M'+q(-27,-27,62)+' L'+q(-22,-24,44)+
        ' L'+q(-17,-20,2)+' Q'+q(-5,-16,1)+' '+q(22,2,1)+' L'+q(22,6,20)}
        fill="none" stroke="#414b3c" strokeWidth=".85" />
    </g>
    {pillarLamp(false)}
  </g>;
}


function ObservatoryHavenAsset({
  theme,
  characterParentScale = 1,
  presenceSlots,
  alienPulseEffect,
  showFrequencyReadout = false,
  triggerAlienSignal,
  onSelectPerson,
  setHoveredObject,
}: ObservatoryHavenProps) {
  // The central stairwell opens between the two bearing beams.


  return (
    <>
      {/* ========================================================================= */}
      {/* Field approach, stone footing, and the compact tower body. */}
      {/* ========================================================================= */}
      <ObservatoryStoneTower night={theme.isNight} />
      <ObservatoryCrown night={theme.isNight} />

      <ObservatoryDeck night={theme.isNight} />
      <ObservatoryRail front={false} />
      <ObservatoryAntennaStand night={theme.isNight} />
      <ObservatoryListeningShelter night={theme.isNight} />

      {/* ========================================================================= */}
      {/* 7. GRAND PARABOLIC SETI DISH (大口径外星射电天线 · 核心精细化与透视修正)   */}
      {/*    后置独立钢架承托天线，前景棚顶与立柱稍后绘制     */}
      {/* ========================================================================= */}
      <g
        {...svgAction('捕获外星电波')}
        id="alien-receiver-assembly"
        onClick={(e) => {
          e.stopPropagation();
          triggerAlienSignal(e);
        }}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setHoveredObject({ kind: 'entity', id: 'alien-receiver' });
        }}
        onMouseLeave={() => setHoveredObject(null)}
        className="group/dish cursor-pointer"
      >
        {(() => {
          const du = RECEIVER_U;
          const dv = RECEIVER_V;
          const dishCenter = pt(du, dv, RECEIVER_Z + 29);
          return (
            <>
            <g id="dish-mechanics-and-reflector" filter="url(#field-environment-tone)">
              {/* 天线底座阴影 */}
              <ellipse
                cx={pt(du, dv, RECEIVER_Z + 0.2).x}
                cy={pt(du, dv, RECEIVER_Z + 0.2).y}
                rx="15"
                ry="6"
                fill="#59644b"
                opacity="0.28"
              />

              {/* 天线在甲板上的双层阶梯形旋转转台基座 */}
              <ellipse
                cx={pt(du, dv, RECEIVER_Z + 1.2).x}
                cy={pt(du, dv, RECEIVER_Z + 1.2).y}
                rx="14"
                ry="5.5"
                fill="#737c64"
                stroke="#52604d"
                strokeWidth="1"
              />
              <ellipse
                cx={pt(du, dv, RECEIVER_Z + 4).x}
                cy={pt(du, dv, RECEIVER_Z + 4).y}
                rx="11.5"
                ry="4.2"
                fill="#99a184"
                stroke="#68745b"
                strokeWidth="0.9"
              />

              {/* 现代仰角俯仰双支撑臂 (工整刚健的机械支架) */}
              <polygon
                points={`
                  ${pt(du - 7, dv, RECEIVER_Z + 4).x},${pt(du - 7, dv, RECEIVER_Z + 4).y}
                  ${pt(du - 4, dv, RECEIVER_Z + 19).x},${pt(du - 4, dv, RECEIVER_Z + 19).y}
                  ${pt(du - 1, dv, RECEIVER_Z + 19).x},${pt(du - 1, dv, RECEIVER_Z + 19).y}
                  ${pt(du - 3, dv, RECEIVER_Z + 4).x},${pt(du - 3, dv, RECEIVER_Z + 4).y}
                `}
                fill="#78836b"
                stroke="#57634f"
                strokeWidth="0.8"
              />
              <polygon
                points={`
                  ${pt(du + 3, dv, RECEIVER_Z + 4).x},${pt(du + 3, dv, RECEIVER_Z + 4).y}
                  ${pt(du + 1, dv, RECEIVER_Z + 19).x},${pt(du + 1, dv, RECEIVER_Z + 19).y}
                  ${pt(du + 4, dv, RECEIVER_Z + 19).x},${pt(du + 4, dv, RECEIVER_Z + 19).y}
                  ${pt(du + 7, dv, RECEIVER_Z + 4).x},${pt(du + 7, dv, RECEIVER_Z + 4).y}
                `}
                fill="#909a7c"
                stroke="#57634f"
                strokeWidth="0.8"
              />
              {/* 俯仰机械转轴核心齿轮与法兰端盖 */}
              <circle cx={pt(du, dv, RECEIVER_Z + 19).x} cy={pt(du, dv, RECEIVER_Z + 19).y} r="3.4" fill="#66735d" stroke="#a4ae8a" strokeWidth="1" />
              <circle cx={pt(du, dv, RECEIVER_Z + 19).x} cy={pt(du, dv, RECEIVER_Z + 19).y} r="1.4" fill="#bac2a3" />

              {/* 大口径射电抛物面天线主反射体 (指向深空右上天顶) */}
              <g transform={`translate(${dishCenter.x}, ${dishCenter.y}) scale(${DISH_SCALE})`}>
                {/* 1. 抛物面深色外壳与金属轮廓厚度 */}
                <ellipse rx="31.5" ry="19.5" transform="rotate(-18)" fill="#7e8870" stroke="#56634f" strokeWidth="1.1" />

                {/* 2. 金属双层反光卷边 (Metallic Rim Lip) */}
                <ellipse rx="30" ry="18" transform="rotate(-18)" fill="#abaf8c" stroke="#c4c7a4" strokeWidth="0.8" />

                {/* 3. 迎光面铝白/银绿涂层主反射盘面 */}
                <ellipse rx="28.5" ry="16.8" transform="rotate(-18)" fill="#d6e3d7" stroke="#7e9682" strokeWidth="0.8" />

                <ellipse rx="24" ry="14" transform="rotate(-18)" fill="#b8ceba" opacity=".7" />
                <path d="M-25,9 Q-2,19 23,-6 Q13,14 -5,17 Q-18,19 -25,9Z" fill="#8ba58d" opacity=".5" />
                <g transform="rotate(-18)" fill="none" stroke="#7c927a" strokeWidth=".55" opacity=".65">
                  <path d="M-27,0 Q0,5 27,0 M0,-15.5 Q-5,0 0,15.5" />
                  <path d="M-19,-10.5 Q-4,3 19,10.5 M-19,10.5 Q4,-3 19,-10.5" />
                </g>

                {/* 6. 前伸馈源三脚支撑杆 (Feed Horn Struts，带细致受光高光) */}
                <path
                  d={`M-23,6 L${FEED_FOCUS.x},${FEED_FOCUS.y} M23,-6 L${FEED_FOCUS.x},${FEED_FOCUS.y} M4,14 L${FEED_FOCUS.x},${FEED_FOCUS.y}`}
                  fill="none"
                  stroke="#53654f"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
                <line x1="-22.5" y1="5.5" x2={FEED_FOCUS.x} y2={FEED_FOCUS.y} stroke="#b0c5b3" strokeWidth="0.6" strokeLinecap="round" />

                {/* Prime-focus horn: narrow receiver behind a flared, dark aperture facing the dish. */}
                <g data-observatory-feed="prime-focus-horn"
                  transform={`translate(${FEED_FOCUS.x} ${FEED_FOCUS.y}) rotate(-18)`} strokeLinejoin="round">
                  <path d="M-2,-4 H2 V-.5 H-2Z" fill="#68766a" stroke="#34473c" strokeWidth=".55" />
                  <path d="M.8,-4 H2 V-.5 H.8Z" fill="#46574b" />
                  <path d="M-2.2,-1 H2.2 V.5 L3.7,4.5 H-3.7 L-2.2,.5Z"
                    fill="#b4ad87" stroke="#5b6250" strokeWidth=".6" />
                  <path d="M.9,.4 L2.5,4.5 H3.7 L2.2,.5 V-1 H.9Z" fill="#83886a" />
                  <ellipse cy="4.5" rx="3.7" ry="1.25" fill="#c3bea0" stroke="#69715c" strokeWidth=".55" />
                  <ellipse cy="4.5" rx="2.7" ry=".75" fill="#2e4035" />
                  <path d="M-1.4,-3 V-.8 M-2.3,1 L-3,3.5" fill="none" stroke="#d1ceb1" strokeWidth=".45" />
                  <path d="M1.8,-2.3 Q5,-3 5.6,.3" fill="none" stroke="#3d5041" strokeWidth=".65" />
                </g>
              </g>

            </g>
            <g id="observatory-signal-lights">
              {/* 📡 宇宙外星电波共振脉冲波 (点击天线时触发扩展波纹) */}
              {alienPulseEffect && (
                <g transform={`translate(${dishCenter.x + FEED_FOCUS.x * DISH_SCALE}, ${dishCenter.y + FEED_FOCUS.y * DISH_SCALE})`}>
                  <circle cx="0" cy="0" r="18" fill="none" stroke="#34d399" strokeWidth="1.8" className="animate-ping pointer-events-none" />
                  <circle cx="0" cy="0" r="36" fill="none" stroke="#38bdf8" strokeWidth="1.6" className="animate-ping pointer-events-none" />
                  <circle cx="0" cy="0" r="54" fill="none" stroke="#a78bfa" strokeWidth="1.2" className="animate-ping pointer-events-none" />
                </g>
              )}
            </g>
            </>
          );
        })()}
      </g>

      {/* ========================================================================= */}
      {/* 8. TELEMETRY CONSOLE & FREQUENCY READOUT (中央射电监听台与纯净频段标识)  */}
      {/*    位置向后挪动至 v ∈ [6, 14]，彻底补齐左侧立面，留出前方的观测活动空间     */}
      {/* ========================================================================= */}
      <ObservatoryWorkbench night={theme.isNight} />
      <g id="observatory-telemetry-console" transform={`translate(20 ${24 * SLOPE - 20})`}>
        {/* 控制台位置: u ∈ [-5, 7], v ∈ [6, 14], z ∈ [DECK_Z, DECK_Z + 9] */}
        {/* 1. 台体左侧封闭立面 (u = -5) - 彻底闭合原有的三角形空洞 */}
        <polygon
          points={face(
            [-5, 14, DECK_Z],
            [-5, 6, DECK_Z],
            [-5, 6, DECK_Z + 11.5],
            [-5, 14, DECK_Z + 9]
          )}
          fill="#253027"
          stroke="#171f19"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* 2. 台体正面立面 (v = 14) */}
        <polygon
          points={face(
            [-5, 14, DECK_Z],
            [7, 14, DECK_Z],
            [7, 14, DECK_Z + 9],
            [-5, 14, DECK_Z + 9]
          )}
          fill="#2d3930"
          stroke="#171f19"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* 3. 台体右侧立面 (u = 7) */}
        <polygon
          points={face(
            [7, 14, DECK_Z],
            [7, 6, DECK_Z],
            [7, 6, DECK_Z + 11.5],
            [7, 14, DECK_Z + 9]
          )}
          fill="#1f2721"
          stroke="#171f19"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* 4. 倾斜操作面板顶面 (全封闭工整顶盖) */}
        <polygon
          points={face(
            [-5, 14, DECK_Z + 9],
            [7, 14, DECK_Z + 9],
            [7, 6, DECK_Z + 11.5],
            [-5, 6, DECK_Z + 11.5]
          )}
          fill="#37473b"
          stroke="#1b231c"
          strokeWidth="0.8"
          strokeLinejoin="round"
        />

        {/* 经典 CRT 示波器显示屏 (绿光波形实时呼吸) */}
        <polygon
          points={face(
            [-3.5, 14, DECK_Z + 2.8],
            [3.5, 14, DECK_Z + 2.8],
            [3.5, 14, DECK_Z + 7.6],
            [-3.5, 14, DECK_Z + 7.6]
          )}
          fill="#052112"
          stroke="#10b981"
          strokeWidth="0.7"
          strokeLinejoin="round"
        />
        {/* 示波器正弦波形 */}
        <path
          d={`M ${pt(-2.8, 14, DECK_Z + 5.2).x},${pt(-2.8, 14, DECK_Z + 5.2).y} Q ${pt(-1.5, 14, DECK_Z + 6.8).x},${pt(-1.5, 14, DECK_Z + 6.8).y} ${pt(0, 14, DECK_Z + 5.2).x},${pt(0, 14, DECK_Z + 5.2).y} T ${pt(2.8, 14, DECK_Z + 5.2).x},${pt(2.8, 14, DECK_Z + 5.2).y}`}
          fill="none"
          stroke="#34d399"
          strokeWidth="1.1"
          strokeLinecap="round"
          className="animate-pulse"
        />

        {/* 精密旋钮与信号指示接口 */}
        <circle cx={pt(5.2, 14, DECK_Z + 6.8).x} cy={pt(5.2, 14, DECK_Z + 6.8).y} r="0.9" fill="#94a3b8" />
        <circle cx={pt(5.2, 14, DECK_Z + 4.2).x} cy={pt(5.2, 14, DECK_Z + 4.2).y} r="0.8" fill="#10b981" />

        <text transform={'translate('+pt(1,14,DECK_Z+1).x+' '+pt(1,14,DECK_Z+1).y+')'}
          fill="#a7bba0" fontSize="1.6" letterSpacing=".15" textAnchor="middle" className="pointer-events-none">1420</text>
        {(showFrequencyReadout || alienPulseEffect) && <g data-frequency-readout=""
          transform={'translate('+(pt(1,14,DECK_Z+13).x+16)+' '+pt(1,14,DECK_Z+13).y+')'}
          className="pointer-events-none">
          <path d="M-17,1 L-20,4" fill="none" stroke="#87a77d" strokeWidth=".5" />
          <rect x="-17" y="-4.8" width="34" height="7" rx="1.3" fill="#26372c" stroke="#87a77d" strokeWidth=".5" />
          <text x="0" y=".1" fill="#d7e9bc" fontSize="3.5" fontWeight="500" textAnchor="middle">1420.405 MHz</text>
        </g>}

      </g>

      {/* ========================================================================= */}
      {/* 9. SETI RESEARCHER / OBSERVATORY SPECIALIST (台面观测员动态席位)          */}
      {/*    当人物入驻时：自然站立于操作台前的防滑地垫上，空间宽裕自然            */}
      {/* ========================================================================= */}
      {(() => {
        const obsOccupant = presenceSlots.observatory_post?.occupant;
        const slotCfg = presenceSlots.observatory_post?.config;
        if (!obsOccupant || !slotCfg) return null;

        return (
          <g
            {...svgAction('查看人物状态')}
            id={`person-in-observatory-${obsOccupant.id}`}
            transform={`translate(${slotCfg.offset.dx}, ${slotCfg.offset.dy})`}
            onClick={(e) => {
              e.stopPropagation();
              onSelectPerson(obsOccupant);
            }}
            onMouseEnter={(e) => {
              e.stopPropagation();
              setHoveredObject({ kind: 'person', id: obsOccupant.id });
            }}
            onMouseLeave={() => setHoveredObject(null)}
            className="cursor-pointer group/char"
          >
            <StandingCharacter
              parentScale={characterParentScale}
              shirtColor={obsOccupant.shirtColor}
              skinColor={obsOccupant.skinColor || '#f5d6be'}
              hairColor={obsOccupant.hairColor || '#302319'}
              hairStyle={obsOccupant.hairStyle || 'curtain_crescent'}
              beanieColor={obsOccupant.beanieColor || '#1f3a2c'}
              hasPompom={obsOccupant.hasPompom ?? true}
              facing={slotCfg.facing}
            />
            <g transform={`scale(${CHARACTER_WORLD_SIZE.authoringScale / characterParentScale})`}>
            {/* 无线电通信耳罩式耳机与拾音麦克风 */}
            <g transform="translate(0,-34) scale(1.2727272727) translate(0,7)">
            <path d="M-6,-7 Q0,-13 6,-7" stroke="#1e293b" strokeWidth="1.8" fill="none" />
            <rect x="-7" y="-9" width="2.4" height="4.4" rx="1.2" fill="#34d399" />
            <rect x="4.6" y="-9" width="2.4" height="4.4" rx="1.2" fill="#34d399" />
            <path d="M-5,-5 Q-2,-2 1,-4" stroke="#1e293b" strokeWidth="0.9" fill="none" />
            </g>

            {/* 观测手板日志夹 */}
            <g transform="translate(-4.85,-17)">
            <polygon points="5,1 11,1 11,8 5,8" fill="#e2e8f0" stroke="#475569" strokeWidth="0.6" />
            <line x1="7" y1="3" x2="10" y2="3" stroke="#059669" strokeWidth="0.6" />
            <line x1="7" y1="5" x2="10" y2="5" stroke="#059669" strokeWidth="0.6" />
            </g>
            </g>


          </g>
        );
      })()}

      {/* ========================================================================= */}
      {/* 10. FOREGROUND PERIMETER GUARDRAILS (前排护栏：位于观众最前端视平线)      */}
      {/*     最核心的遮挡修复：前右段护栏真实、正确地走在天线锅与基座的前侧外围    */}
      {/*     前左段护栏与梯口无缝闭合，彻底解决原先断开孤线的问题                  */}
      {/* ========================================================================= */}
      <ObservatoryListeningShelter night={theme.isNight} front />
      <ObservatoryRail front />
      {/* UI label stays above the physical canopy rather than being sliced by its eaves. */}
      {(() => {
        const slot = presenceSlots.observatory_post;
        if (!slot?.occupant || !slot.config) return null;
        return <g data-observatory-person-label="" pointerEvents="none"
          transform={`translate(${slot.config.offset.dx},${slot.config.offset.dy - 56 / characterParentScale})`}>
          <rect x="-46" y="-7" width="92" height="15" rx="7.5" fill="#121a14" stroke="#10b981" strokeWidth=".8" opacity=".94" />
          <text x="0" y="3.5" fill="#d1fae5" fontSize="8.5" fontWeight="bold" textAnchor="middle">
            📡 {slot.occupant.name} · {slot.config.badgeLabel.split('(')[0].trim()}
          </text>
        </g>;
      })()}


      {/* ========================================================================= */}
      {/* 11. HOVER TOOLTIP (观测台整体浮动说明)                                    */}
      {/* ========================================================================= */}
      <g
        transform="translate(0, 56)"
        className="opacity-0 group-hover/observatory:opacity-100 transition-opacity pointer-events-none"
      >
        <rect x="-76" y="-8.5" width="152" height="17" rx="8.5" fill="#131c15" stroke="#10b981" strokeWidth="0.9" opacity="0.95" />
        <text x="0" y="3.8" fill="#a7f3d0" fontSize="9" fontWeight="bold" textAnchor="middle">
          📡 麦田石塔电波监听站 · 点击捕获信号
        </text>
      </g>
    </>
  );
}

export const ObservatoryHaven = React.memo(ObservatoryHavenAsset);
