import { useId, type ReactNode } from 'react';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { YardObject } from '../../../../features/yard-editor/YardWorld';
import { YARD_OBJECTS, type YardId } from '../../../../features/yard-editor/yardLayout';
import { MeadowWearPatch } from './MeadowWearPatch';

function FarmObject({ id, theme, children }: { id: YardId; theme: YorkshireSceneTheme; children: ReactNode }) {
  const anchor = YARD_OBJECTS[id];
  return <YardObject id={id}>
    <g id={`farmyard-${id}`} transform={`translate(${anchor.x} ${anchor.y})`} pointerEvents="none"
      strokeLinejoin="round" strokeLinecap="round"
      filter={theme.landscapeEnvironment ? 'url(#field-environment-tone)' : undefined}
      opacity={!theme.landscapeEnvironment && theme.isNight ? .65 : 1}>
      {children}
    </g>
  </YardObject>;
}

function FeedSack({ x, y, scale = 1, dark = false }: { x: number; y: number; scale?: number; dark?: boolean }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} data-feed-sack="">
    <ellipse cy="1" rx="14" ry="4" fill="#30281d" opacity=".22" />
    <path d="M-6,-30 Q-10,-34 -7,-36 L-1,-34 5,-36 7,-33 4,-29 Q14,-21 13,-7 Q14,2 1,2 Q-13,3 -13,-6 Q-14,-20 -6,-30Z"
      fill={dark ? '#a38a57' : '#c4a876'} stroke="#79613f" strokeWidth=".7" />
    <path d="M4,-29 Q10,-16 8,-5 Q4,0 -5,0 Q13,6 13,-7 Q14,-21 4,-29Z" fill="#806b48" opacity=".45" />
    <path d="M-7,-23 Q-11,-15 -9,-7 M-5,-32 Q0,-30 5,-32 M-5,-3 Q1,-5 6,-3" stroke="#e0c99b" strokeWidth=".8" fill="none" />
    <path d="M-6,-30 Q0,-28 6,-30 M3,-29 l4,6" stroke="#675138" strokeWidth="1.2" fill="none" />
    <path d="M-4,-17 L4,-17 4,-10 -4,-10Z" fill="#b49a67" opacity=".7" />
    <path d="M0,-11 V-16 M0,-13 l-2,-2 M0,-14 l2,-2" stroke="#766641" strokeWidth=".65" fill="none" />
  </g>;
}

function StrawBale({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`} data-shed-hay="">
    <path d="M-24,-7 L9,2 24,-4 24,-23 -8,-32 -24,-25Z" fill="#b58a3c" />
    <path d="M-24,-25 L9,-16 24,-23 -8,-32Z" fill="#dfc46e" />
    <path d="M-24,-25 L9,-16 9,2 -24,-7Z" fill="#c9a34f" />
    <path d="M-14,-28 L18,-19 18,-1 M-7,-20 V-2" stroke="#78643b" strokeWidth="1.4" fill="none" />
    <path d="M-20,-22 l10,3 M-18,-17 l14,4 M-21,-11 l9,2 M-2,-15 l7,2 M-3,-7 l8,2 M13,-12 l7,-3 M-14,-28 l8,2 M0,-25 l9,3"
      stroke="#f0d58a" strokeWidth=".65" fill="none" />
    <path d="M-25,-9 l-5,1 M-22,-6 l-4,2 M12,2 l5,2" stroke="#c2a05b" strokeWidth=".8" fill="none" />
  </g>;
}

/** Open front and right side expose supplies; all feet share the compressed yard plane. */
export function FarmSupplyShed({ theme }: { theme: YorkshireSceneTheme }) {
  return <FarmObject id="supply_shed" theme={theme}>
    <title>半开放农具木棚：麻袋、干草和木柄工具</title>
    <path d="M-88,-5 Q-30,-29 35,-15 L96,7 Q62,30 -12,23 L-89,3Z" fill="#34442a" opacity=".12" />
    <MeadowWearPatch id="supply-shed-entry-wear" theme={theme} variant="scuff" opacity={.5}
      transform="matrix(.75 .212 -.35 .36 -19 13)" />
    <path d="M-78,-5 L24,25 82,8 79,5 24,21 -76,-8Z" fill="#302c20" opacity=".24" />
    {/* Raised deck: top corners meet the fascia; plank seams follow the existing yard axes. */}
    <g data-shed-deck="">
      <path d="M-77,-13 L24,16 38,12 -63,-17Z" fill="#957b51" />
      <path d="M-63,-17 L38,12 52,8 -49,-21Z" fill="#8d734d" />
      <path d="M-49,-21 L52,8 66,4 -35,-25Z" fill="#927851" />
      <path d="M-35,-25 L66,4 80,0 -21,-29Z" fill="#846b49" />
      <path d="M-63,-17 L38,12 M-49,-21 L52,8 M-35,-25 L66,4" stroke="#59442c" strokeWidth=".65" fill="none" opacity=".75" />
      <path d="M-60,-11 l17,4.8 M-19,-5 q10,1.8 17,4.7 M23,6 l13,3.7 M39,-1 l17,4.8"
        stroke="#b2996b" strokeWidth=".65" fill="none" opacity=".55" />
    </g>
    <path d="M-77,-6 L24,23 24,16 -77,-13Z" fill="#695134" />
    <path d="M24,23 L80,7 80,0 24,16Z" fill="#4f402c" />
    <path d="M-75,-12.4 L24,16 78,.6" stroke="#b49967" strokeWidth=".85" fill="none" />
    <path d="M-58,-5 l20,5.7 M-10,9 l18,5.2 M35,16.6 l17,-4.8" stroke="#453522" strokeWidth=".65" fill="none" opacity=".7" />
    <g fill="#3e3324"><circle cx="-68" cy="-7" r=".7" /><circle cx="16" cy="17.5" r=".7" /><circle cx="72" cy="6" r=".65" /></g>
    {/* Rear timber wall, interrupted board tones and a structural rail. */}
    <path d="M-77,-13 L-21,-29 -21,-104 -77,-88Z" fill="#715337" stroke="#49341f" strokeWidth="1" />
    {[-74,-63,-52,-41,-30].map((x,i) => <path key={x}
      d={`M${x},${-89-(x+77)*.283} v73 l9,-2.55 v-73Z`} fill={i%2 ? '#81613f' : '#8f6b43'} />)}
    <path d="M-73,-23 L-25,-37 M-73,-77 L-25,-91" stroke="#49351f" strokeWidth="3.8" />
    <path d="M-21,-29 L80,0 80,-75 -21,-104Z" fill="#503a26" />
    {[0,17,34,51,68].map((x,i) => <path key={x} d={`M${x-18},${-101+(x+3)*.283} v69 l14,4 v-69Z`}
      fill={i%2 ? '#63482e' : '#6e5032'} />)}
    <path d="M-19,-37 L77,-10 M-19,-96 L77,-69" stroke="#3e2c1d" strokeWidth="4" />
    {/* Stacked hay at the back; soft sacks sit forward, clear of the front posts. */}
    <StrawBale x={38} y={-9} scale={1.1} />
    <StrawBale x={39} y={-37} scale={.9} />
    <FeedSack x={-48} y={-7} scale={1.08} dark />
    <FeedSack x={-25} y={-2} scale={1.13} />
    <FeedSack x={-5} y={5} scale={.83} dark />
    {/* A wooden rake and a broad shovel lean against the back corner. */}
    <g transform="translate(57 -1) rotate(12)">
      <path d="M0,0 V-60" stroke="#c29a5d" strokeWidth="2.6" />
      <path d="M-9,-60 H9 M-8,-60 v-6 M-4,-60 v-6 M0,-60 v-6 M4,-60 v-6 M8,-60 v-6"
        stroke="#b48b50" strokeWidth="1.8" fill="none" />
      <path d="M-.5,-48 V-16" stroke="#e0b676" strokeWidth=".6" />
    </g>
    <g transform="translate(68 0) rotate(-8)">
      <path d="M0,-9 V-52 M-4,-60 Q0,-64 4,-60 V-54 H-4Z" stroke="#b89258" strokeWidth="2" fill="none" />
      <path d="M-6,-15 L5,-15 6,-4 Q0,3 -6,-3Z" fill="#626c61" stroke="#373e35" strokeWidth=".8" />
      <path d="M0,-12 V-2" stroke="#98a092" strokeWidth=".8" />
    </g>
    {/* Three exposed posts; the boarded rear corner carries the roof without a post across the sacks. */}
    {[[-77,-8,-93],[80,5,-80],[24,21,-64]].map(([x,y,top],i) => <g key={i} data-shed-post="">
      <ellipse cx={x+1} cy={y+4} rx="8" ry="2.2" fill="#293122" opacity=".25" />
      <path d={`M${x-5},${y} l6,-2 7,2 -5,3Z`} fill="#aaa08a" />
      <path d={`M${x-5},${y} v4 l8,2 5,-3 v-3 l-5,3Z`} fill="#6d6958" />
      <path d={`M${x-2},${y} V${top} l5,1 V${y+1}Z`} fill="#916438" stroke="#4b321e" strokeWidth=".7" />
      <path d={`M${x+3},${y+1} V${top+1} l3,-1 V${y-1}Z`} fill="#5a3e27" />
    </g>)}
    <path d="M-74,-70 L-55,-82 M27,-47 L47,-58 M21,-47 L4,-67 M76,-59 L59,-75"
      stroke="#523922" strokeWidth="5" fill="none" />
    <path d="M-74,-72 L-56,-83 M27,-49 L46,-60" stroke="#b1824b" strokeWidth="1.2" fill="none" />
    {/* Single pitched cedar roof, thick fascia and staggered shingle courses. */}
    <path d="M-88,-94 L-22,-116 92,-83 25,-60Z" fill="#8e5733" stroke="#49301e" strokeWidth="1.2" />
    <path d="M-88,-94 L25,-60 25,-54 -88,-88Z" fill="#5f3d26" />
    <path d="M25,-60 L92,-83 92,-77 25,-54Z" fill="#48301f" />
    <path d="M-72,-99 L42,-66 M-55,-105 L59,-72 M-39,-110 L76,-77" stroke="#5e3b24" strokeWidth="1.3" fill="none" />
    <path d="M-61,-102 l-6,6 M-29,-93 l-6,6 M3,-84 l-6,6 M35,-75 l-6,6
      M-32,-110 l-6,6 M0,-101 l-6,6 M32,-92 l-6,6 M64,-83 l-6,6" stroke="#644128" strokeWidth=".85" fill="none" />
    <path d="M-84,-94 L25,-62 M-19,-114 L88,-83" stroke="#ba8250" strokeWidth="1" fill="none" />
    <path d="M-9,8 l5,1.5 m-2,-2 4,2 M5,12 l6,1.5 m-3,-2 3,2 M-16,19 l4,1 M-5,23 l5,-.5"
      stroke="#c0a46b" strokeWidth=".7" fill="none" opacity=".8" />
    <path d="M-76,0 l-5,-4 m4,5 1,-6 M29,25 l4,-5 m-3,5 6,-1 M79,10 l5,-3" stroke="#718447" strokeWidth="1.5" fill="none" />
  </FarmObject>;
}

function WaterBucket({ x, y, scale = 1, wooden = false }: { x: number; y: number; scale?: number; wooden?: boolean }) {
  const body = wooden ? '#a17a46' : '#819691', edge = wooden ? '#5b4a31' : '#455d57';
  return <g transform={`translate(${x} ${y}) scale(${scale})`} data-water-bucket="">
    <ellipse cy="1" rx="11" ry="3" fill="#293d2c" opacity=".22" />
    <path d="M-10,-17 L-7,0 Q0,4 7,0 L10,-17Z" fill={body} stroke={edge} strokeWidth=".8" />
    <path d="M4,-17 L4,1 7,0 10,-17Z" fill={edge} opacity=".5" />
    <ellipse cy="-17" rx="10" ry="3.8" fill={edge} stroke={body} strokeWidth="1.3" />
    <ellipse cy="-16.5" rx="7.4" ry="2.2" fill={wooden ? '#59492e' : '#3d7776'} />
    <path d="M-9,-16 Q-12,-34 0,-34 Q12,-34 9,-16" stroke={edge} strokeWidth="1.3" fill="none" />
    {wooden ? <path d="M-7,-11 Q0,-8 8,-11 M-6,-3 Q0,0 7,-3 M-3,-13 v10 M2,-13 v11" stroke="#655b42" strokeWidth="1" fill="none" />
      : <path d="M-6,-13 L-4,-3 M-7,-6 Q0,-3 7,-6" stroke="#b6c3ae" strokeWidth=".85" fill="none" />}
  </g>;
}

export function VillageHandPump({ theme }: { theme: YorkshireSceneTheme }) {
  return <FarmObject id="hand_pump" theme={theme}>
    <title>复古铸铁手压井与三只水桶</title>
    <g transform="translate(0 2) scale(-.8 .8)"><HandPumpArtwork gardenTone /></g>
    <WaterBucket x={28} y={4} scale={.85} />
    <WaterBucket x={-33} y={14} scale={.8} wooden />
    <WaterBucket x={36} y={18} scale={.62} />
    <path d="M17,16 Q22,13 28,15 M26,18 l6,-1" stroke="#6e9381" strokeWidth="1.7" opacity=".6" fill="none" />
    <path d="M-29,7 l-4,-4 m3,4 1,-6 M32,13 l3,-4" stroke="#6b8145" strokeWidth="1.3" fill="none" />
  </FarmObject>;
}

/** The old station ID now owns only the trough, preserving its saved placement. */
export function SheepWaterStation({ theme }: { theme: YorkshireSceneTheme }) {
  const uid = useId().replace(/:/g, '');
  const wood = `sheep-trough-wood-${uid}`, water = `sheep-trough-water-${uid}`;
  return <FarmObject id="sheep_water_station" theme={theme}>
    <title>羊羔可低头饮水的低矮橡木长槽</title>
    <defs>
      <linearGradient id={wood} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#96754f" /><stop offset="50%" stopColor="#866445" /><stop offset="100%" stopColor="#715237" />
      </linearGradient>
      <linearGradient id={water} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1e5868" /><stop offset="50%" stopColor="#2c798e" /><stop offset="100%" stopColor="#15424d" />
      </linearGradient>
    </defs>
    <ellipse cx="12" cy="18" rx="67" ry="9" fill="#293c2c" opacity=".13" />
    {/* A restrained contact shadow keeps the low trough seated directly on grass. */}
    <ellipse cx="12" cy="23" rx="53" ry="5" fill="#293c2c" opacity=".16" />
    {/* Thick oak sides, a darker end, and a recessed water plane. */}
    <g transform="translate(0 3)" data-trough-height="lamb">
    <path d="M-48,-10 L51,18 72,8 Q76,9 74,14 L74,24 Q72,31 51,32 L-48,4 Q-55,-2 -48,-10Z" fill={`url(#${wood})`} stroke="#5c4934" strokeWidth=".8" />
    <path d="M51,18 L72,8 Q76,9 74,14 L74,24 Q72,31 51,32Z" fill="#6f563d" />
    <path d="M-48,-10 L-22,-18 72,8 Q76,9 74,13 L51,18Z" fill="#a3875d" stroke="#70583d" strokeWidth=".8" />
    <path d="M-40,-9 L-22,-14 68,11 51,16Z" fill="#494533" />
    <path d="M-40,-9 L51,16 51,20 -39,-5Z" fill="#514932" />
    <path d="M-32,-6.5 L-22,-9.3 60,13.9 50,16.7Z" fill={`url(#${water})`} />
    <path d="M-32,-6.5 L-22,-9.3 60,13.9 50,16.7Z" fill="#38bdf8" opacity=".28" />
    <path d="M-24,-6 L11,4 M24,9 L45,15" stroke="#ffffff" strokeWidth=".75" opacity=".8" fill="none" />
    <path d="M-10,-3.5 L20,5 M36,11 L51,15" stroke="#bae6fd" strokeWidth=".6" opacity=".65" fill="none" />
    {/* Quiet longitudinal fibres and one small grain swirl replace an evenly polished face. */}
    <path d="M-46,-6 Q-24,1 -7,4 L13,10 Q-11,5 -25,3 L-46,-3Z" fill="#b19a73" opacity=".13" />
    <path d="M-42,1 Q-20,9 1,13 L37,24 36,26 Q5,17 -12,14 L-42,5Z" fill="#5e4933" opacity=".14" />
    <path d="M-45,-5 L-30,-.8 Q-26,.5 -24,2 M-13,5 Q-8,7 1,8.5 L20,14 M26,16.7 L44,21.8
      M-41,2 L-30,5.1 M-11,12 L11,18.2 M20,20.7 L37,25.4" stroke="#59442f" strokeWidth=".65" opacity=".5" fill="none" />
    <path d="M-25,3 Q-19,1.5 -11,6.3 Q-17,8 -25,3Z" fill="#5d4934" opacity=".3" />
    <path d="M-28,2 Q-22,-.2 -14,4 M-22,5.2 Q-16,9 -7,8.2" stroke="#b09870" strokeWidth=".55" opacity=".5" fill="none" />
    {/* Worn edge catches light in short sections; the wet inner lip remains dark. */}
    <path d="M-44,-8 L-25,-2.6 M-2,4.3 L16,9.4 M34,14.6 L49,18.8 M57,16.5 L69,12.5"
      stroke="#b2986b" strokeWidth=".8" opacity=".75" fill="none" />
    <path d="M-20,-15.4 L-5,-11.1 M14,-5.7 L28,-1.7 M46,3.4 L63,8.3" stroke="#6a543a" strokeWidth=".65" opacity=".5" fill="none" />
    <path d="M58,20 Q65,17 71,16 M57,24 Q64,23 69,20.5 M60,28 L67,25.6"
      stroke="#443b2d" strokeWidth=".6" opacity=".4" fill="none" />
    </g>
  </FarmObject>;
}

/** Separate pump at the far end of the trough, leaving the gate approach open. */
export function SheepHandPump({ theme }: { theme: YorkshireSceneTheme }) {
  return <FarmObject id="sheep_hand_pump" theme={theme}>
    <title>羊圈独立铸铁压水井</title>
    <HandPumpArtwork troughOutlet />
  </FarmObject>;
}

/** Shared casting and mechanism; garden pump keeps its right-facing outlet and original scale. */
function HandPumpArtwork({ troughOutlet = false, gardenTone = false }: { troughOutlet?: boolean; gardenTone?: boolean }) {
  const upperOffset = troughOutlet ? 7 : 19;
  const riserTop = -44 + upperOffset;
  const iron = gardenTone
    ? { body: '#425f40', edge: '#2d482f', light: '#71886a', shade: '#344f36', highlight: '#91a286', mid: '#536e50' }
    : { body: '#3d6951', edge: '#284a37', light: '#7f9e78', shade: '#2c503d', highlight: '#90a67d', mid: '#527c5e' };
  return <g data-hand-pump-artwork="shared">
    <ellipse cy="5" rx="22" ry="5" fill="#283b2b" opacity=".22" />
    <path d="M-22,-2 L0,-8 22,-2 0,5Z" fill="#938c74" />
    <path d="M-22,-2 V3 L0,10 22,3 V-2 L0,5Z" fill="#686a57" />
    <path d="M-18,-2 L0,3 18,-2" stroke="#b3a78b" strokeWidth=".8" fill="none" />
    <ellipse cy="-3" rx="11" ry="3.2" fill="#253e32" />
    <path d="M-10,-6 V-3 Q0,1 10,-3 V-6Z" fill="#345741" />
    <ellipse cy="-6" rx="10" ry="3" fill="#5d7e60" />
    {/* A continuous straight riser supports a separate, broader pumping chamber. */}
    <path d={`M-6,-7 V${riserTop} H6 V-7 Q0,-4 -6,-7Z`} fill={iron.body} stroke={iron.edge} strokeWidth=".9" />
    <path d={`M-4,${riserTop+2} V-10`} stroke={iron.highlight} strokeWidth="1.4" />
    <path d={`M4,${riserTop+2} V-9`} stroke={iron.shade} strokeWidth="1.7" />
    <path d={`M-6,${riserTop+3} Q0,${riserTop+5} 6,${riserTop+3}`} stroke={iron.edge} strokeWidth="1.1" fill="none" />
    <g transform={`translate(0 ${upperOffset})`} data-pump-upper-assembly="">
      <path d="M-6,-44 Q-11,-49 -10,-62 L-8,-75 Q0,-78 8,-75 L10,-62 Q11,-49 6,-44Z"
        fill={iron.body} stroke={iron.edge} strokeWidth=".9" />
      <path d="M-5,-73 L-7,-61 Q-8,-51 -4,-46" stroke={iron.highlight} strokeWidth="1.5" fill="none" />
      <path d="M6,-73 L8,-61 Q9,-51 5,-46" stroke={iron.shade} strokeWidth="2" fill="none" />
      {/* Open pump mouth. Its near rim will occlude the inserted piston rod. */}
      <ellipse cy="-79" rx="9.5" ry="3.4" fill={iron.light} stroke={iron.edge} strokeWidth=".8" />
      <ellipse cy="-79" rx="6.8" ry="2.2" fill="#243e30" />
      <path d="M-8,-80 Q0,-82.6 8,-80" stroke={iron.highlight} strokeWidth=".75" fill="none" />
      {/* Single side outlet descends from the chamber; its lower mouth is hidden by the near wall. */}
      <g data-pump-high-outlet={troughOutlet ? 'trough' : 'chamber-side'}>
        {troughOutlet ? <>
          {/* Pipe and collar share the trough's northwest axis; the short end turns down. */}
          <path d="M-9,-62 L-29,-67.7 Q-37,-70 -37,-61 V-56 L-31,-54.3 V-61 Q-31,-63 -28,-62.1 L-9,-56Z"
            fill={iron.mid} stroke={iron.edge} strokeWidth=".85" />
          <path d="M-10,-58.7 L-28,-63.8 Q-34,-65.5 -34,-60 V-55.1 L-31,-54.3 V-61 Q-31,-63 -28,-62.1 L-9,-56Z" fill={iron.shade} />
          <path d="M-12,-61.7 L-29,-66.5 Q-35,-68.2 -35.5,-62" stroke={iron.highlight} strokeWidth=".8" fill="none" />
          <path d="M-9,-62 L-14,-63.4 V-57.4 L-9,-56Z" fill={iron.mid} stroke={iron.edge} strokeWidth=".65" />
          <path d="M-12,-62 V-57.7" stroke={iron.highlight} strokeWidth=".65" />
          <path d="M-36.5,-56 L-31.5,-54.6" stroke={iron.edge} strokeWidth=".65" />
        </> : <>
        {/* One side socket, with its inboard end occluded by the chamber. */}
        <path d="M-8,-63 H-12 Q-15,-63 -15,-60 V-57 Q-15,-54 -12,-54 H-8Z"
          fill={iron.body} stroke={iron.edge} strokeWidth=".8" />
        {/* A short horizontal neck precedes the gradual downward bend. */}
        <path d="M-11,-62.5 H-18 Q-20,-62.5 -22,-61.3 L-32,-55.5 Q-37,-52.5 -37,-47 L-31,-44 Q-31,-49 -28,-50.7 L-19,-55.8 Q-18,-56.5 -16,-56.5 H-11Z"
          fill={iron.mid} stroke={iron.edge} strokeWidth=".85" />
        <path d="M-11,-58.3 H-17 Q-19,-58.3 -21,-57.1 L-30,-51.9 Q-34,-49.6 -34,-45.5 L-31,-44 Q-31,-49 -28,-50.7 L-19,-55.8 Q-18,-56.5 -16,-56.5 H-11Z"
          fill={iron.shade} />
        <path d="M-13,-61 H-18 Q-20,-61 -22,-59.8 L-31,-54.6 Q-35,-52.2 -35.4,-48.3"
          stroke={iron.highlight} strokeWidth=".8" fill="none" />
        {/* Only the exposed collar edge is visible; no complete ellipse is pasted over the barrel. */}
        <path d="M-12,-62.3 V-55.9" stroke={iron.edge} strokeWidth="1.3" />
        <path d="M-13,-61.6 V-57" stroke={iron.highlight} strokeWidth=".65" />
        <path d="M-8,-64 Q-9,-59 -8,-53 L-5,-53 V-64Z" fill={iron.body} />
        <path d="M-36.4,-47 L-31.4,-44.6" stroke={iron.edge} strokeWidth=".65" fill="none" />

        </>}

      </g>
      {/* A rigid right-side cheek carries the pivot in the lever/piston plane. */}
      <g data-pump-lever-support="fixed-side-ear">
        <path d="M8,-69 L9,-86 Q12,-93 15,-87 L15,-68 11,-66Z" fill={iron.body} stroke={iron.edge} strokeWidth=".85" />
        <path d="M10,-72 V-86 Q11,-89 13,-90" stroke={iron.light} strokeWidth="1" fill="none" />
        <path d="M7,-69 L11,-67 15,-68 V-65 L11,-64 7,-66Z" fill={iron.edge} />
      </g>
      {/* Long operating arm lies to the right, opposite the water outlet. */}
      <path d="M-1,-96 V-75" stroke={iron.edge} strokeWidth="2.2" fill="none" />
      <path d="M-1.6,-94 V-79" stroke="#829b75" strokeWidth=".65" fill="none" />
      <path d="M-1,-96 Q6,-99 12,-88 Q23,-75 28,-59 L35,-43" stroke={iron.edge} strokeWidth="3.8" fill="none" />
      <path d="M0,-97 Q6,-97 11,-88 Q21,-75 26,-59 L33,-47" stroke={iron.highlight} strokeWidth=".85" fill="none" />
      <path d="M34.5,-45 L38,-36" stroke="#9d7648" strokeWidth="5" />
      <circle cx="-1" cy="-96" r="1.8" fill="#a28f5c" stroke={iron.edge} strokeWidth=".7" />
      <circle cx="12" cy="-88" r="3" fill="#b29a61" stroke={iron.edge} strokeWidth=".9" />
      <circle cx="12" cy="-88" r=".85" fill="#dfc586" />
      {/* The near wall of the open mouth hides the bottom of the moving rod. */}
      <path d="M-9.5,-79 Q0,-75.6 9.5,-79 V-75 Q0,-71.6 -9.5,-75Z" fill={iron.mid} stroke={iron.edge} strokeWidth=".8" />
      <path d="M-6.8,-79 Q0,-76.8 6.8,-79 L9.5,-79 Q0,-75.6 -9.5,-79Z" fill={iron.light} />
      <path d="M-8,-77.7 Q0,-75.2 8,-77.7" stroke={iron.highlight} strokeWidth=".65" fill="none" />
    </g>

    <circle cx="-7" cy="-5" r=".9" fill="#b3a478" /><circle cx="7" cy="-5" r=".9" fill="#b3a478" />
  </g>;
}

const SUNFLOWERS = [
  { x:-35, y:-4, h:48, lean:-8, size:.72, turn:-17 },
  { x:-13, y:-10, h:72, lean:-3, size:.95, turn:12 },
  { x:12, y:-5, h:62, lean:9, size:.88, turn:24 },
  { x:35, y:1, h:43, lean:8, size:.7, turn:-12 },
  { x:-20, y:6, h:41, lean:-7, size:.73, turn:-25 },
  { x:3, y:10, h:56, lean:0, size:.9, turn:4 },
] as const;

export function WildSunflowerPatch({ theme }: { theme: YorkshireSceneTheme }) {
  return <FarmObject id="wild_sunflowers" theme={theme}>
    <title>高低错落的野生向日葵丛</title>
    <path d="M-47,3 Q-20,-10 11,-4 Q38,-6 51,9 Q21,19 -9,13 L-39,10Z" fill="#3e5931" opacity=".18" />
    {SUNFLOWERS.map(({x,y,h,lean,size,turn},i) => <g key={i} transform={`translate(${x} ${y})`} data-wild-sunflower="">
      <path d={`M0,0 Q${-lean*.3},${-h*.55} ${lean},${-h}`} stroke={i%2 ? '#56703b' : '#657c3d'} strokeWidth="2" fill="none" />
      <path d={`M0,${-h*.27} Q-17,${-h*.24-14} -20,${-h*.27-8} Q-21,${-h*.27+6} 0,${-h*.27}
        M${lean*.3},${-h*.52} Q18,${-h*.52-18} 20,${-h*.52-8} Q19,${-h*.52+6} ${lean*.3},${-h*.52}`}
        fill={i%2 ? '#75934a' : '#658442'} />
      <path d={`M0,${-h*.27} l-15,-6 M${lean*.3},${-h*.52} l15,-6`} stroke="#a1ac5d" strokeWidth=".6" fill="none" />
      <g transform={`translate(${lean} ${-h}) rotate(${turn}) scale(${size} .95)`}>
        <path d="M-5,5 L-11,5 -8,0 -12,-4 -5,-5 -4,-11 1,-7 7,-10 7,-3 12,0 7,5 7,10 1,8 -3,12Z" fill="#5d743b" />
        {Array.from({length:11},(_,j) => <path key={j} transform={`rotate(${j*360/11})`}
          d="M-2,-4 Q-5,-11 -1,-15 Q3,-13 2.3,-7 L1,-4Z" fill={j%3 === 0 ? '#dca437' : j%3 === 1 ? '#f3c64e' : '#e8b63b'} />)}
        <ellipse rx="6.2" ry="6.7" fill="#684529" stroke="#a6742e" strokeWidth="1.3" />
        <path d="M-3,-3 l1,-1 M1,-3 l1,1 M-3,1 l1,1 M1,2 l1,-1 M0,0 h.2" stroke="#bb9250" strokeWidth="1.2" fill="none" />
      </g>
    </g>)}
    <path d="M-47,7 q-2,-9 -6,-12 m7,12 q0,-13 5,-18 M-27,10 q-6,-9 -10,-8 M18,13 q4,-12 8,-13 M36,10 q7,-9 12,-8 M-6,13 q-2,-9 -5,-13"
      stroke="#799148" strokeWidth="1.5" fill="none" />
    <path d="M-39,8 l3,-6 M26,12 l5,-5 M-15,12 l-4,-4" stroke="#b0af5b" strokeWidth="1.1" fill="none" />
  </FarmObject>;
}
