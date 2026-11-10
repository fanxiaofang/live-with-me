import { YardAttachment, YardObject } from '../../../../features/yard-editor/YardWorld';
import { YARD_OBJECTS } from '../../../../features/yard-editor/yardLayout';
import { AmbientGroundShadow, ContactGroundShadow } from '../../../../world/render/GroundShadow';
import type { HoverTarget } from '../../../../world/interactions/interactionTypes';
import type { YorkshireSceneTheme } from '../landscapeTypes';
import { MeadowWearPatch } from './MeadowWearPatch';
import { useId } from 'react';

// The asset's local wheel contact stays at (46,49); the yard anchor is that receiving point.
const TRACTOR_BODY_TRANSFORM = 'translate(46 49) scale(0.84) translate(-46 -49)';
const TRACTOR_SCALE = 1.25;
const anchor = YARD_OBJECTS.tractor;
const placement = `translate(${anchor.x} ${anchor.y}) scale(${TRACTOR_SCALE}) translate(-46 -49)`;

/** A complete farm parking group, in the meadow camera and the yard's depth/save contract. */
export function MeadowTractor({theme,setHoveredObject}:{theme:YorkshireSceneTheme;setHoveredObject:HoverTarget}) {
  const lightId='tractor-light-'+useId().replace(/:/g,'');
  const environment=theme.landscapeEnvironment ? 'url(#field-environment-tone)' : undefined;
  return <>
    <YardAttachment id="tractor">
      <g data-tractor-ground="" transform={placement} filter={environment} pointerEvents="none" aria-hidden="true">
        <MeadowWearPatch id="tractor-parking-wear" theme={theme} variant="scuff" transform="translate(47 49) scale(1.65 1.3)" opacity={.85} />
        <AmbientGroundShadow cx={46} cy={49} rx={48} ry={8} color="#353a25" opacity={.24} />
        {/* A short, worn approach towards the planting area, ahead of the left-facing bonnet. */}
        <g id="tractor-wheel-ruts" strokeLinecap="round" fill="none">
          <path d="M22,48 Q13,48.1 6,48.8 M20,40.8 Q12,40.6 7,41.2" stroke={theme.roadColor} strokeWidth="3" opacity=".2" />
          <path d="M2,49.3 Q-5,49.8 -12,50.6 M1,41.6 Q-5,41.9 -11,42.5" stroke={theme.roadColor} strokeWidth="2.7" opacity=".14" />
          <path d="M-18,51.2 Q-26,52 -34,52.2 M-17,43 Q-23,43.3 -30,43.6" stroke={theme.roadColor} strokeWidth="2.2" opacity=".08" />
          <path d="M15,47.6 l-2,1.2 M9,48 l-1.6,1.1 M2,48.7 l-1.8,1 M14,40.4 l-1.6,1 M6,40.8 l-1.4,1.1" stroke="#686343" strokeWidth=".85" opacity=".25" />
          <path d="M-7,49.8 l-1.7,1 M-7,42 l-1.4,.9 M-21,51.3 l-1.4,.8" stroke="#686343" strokeWidth=".75" opacity=".12" />
        </g>
      </g>
    </YardAttachment>
    <YardObject id="tractor">
      <g id="tractor-in-meadow" data-tractor-layer="meadow" data-tractor-scale={TRACTOR_SCALE}
        transform={placement} filter={environment}>
      {/* Weathered Timber Paddock Fence behind Tractor */}
      <g id="farm-paddock-fence" transform="translate(0, -8)" opacity="0.9">
        <line x1="-55" y1="18" x2="115" y2="18" stroke="#4a3725" strokeWidth="2.8" />
        <line x1="-55" y1="26" x2="115" y2="26" stroke="#4a3725" strokeWidth="2.2" />
        {[-45, -5, 35, 75, 110].map((fx) => (
          <g key={`pf-${fx}`}>
            <rect x={fx - 1.6} y="10" width="3.5" height="24" rx="0.8" fill="#3a281a" stroke="#22160d" strokeWidth="0.5" />
            <polygon points={`${fx - 1.6},10 ${fx},7 ${fx + 1.9},10`} fill="#543c29" />
          </g>
        ))}
      </g>
      <g data-tractor-interaction="" tabIndex={0} role="img" aria-label="田边拖拉机与农场物资，车头朝左"
        className="cursor-pointer transition-opacity hover:opacity-95"
        onMouseEnter={()=>setHoveredObject({kind:'entity',id:'tractor'})}
        onMouseLeave={()=>setHoveredObject(null)}
        onFocus={()=>setHoveredObject({kind:'entity',id:'tractor'})}
        onBlur={()=>setHoveredObject(null)}>
      <g id="tractor-farm-supplies" transform="translate(117, 18)">
        <ellipse cx="9.5" cy="18" rx="14" ry="3.2" fill="#30271b" opacity=".25" />
        <rect x="0" y="2" width="11" height="15" rx="1.8" fill="#4a3622" stroke="#251a0f" strokeWidth="0.8" />
        <line x1="0" y1="5.5" x2="11" y2="5.5" stroke="#1f2429" strokeWidth="1.1" />
        <line x1="0" y1="13" x2="11" y2="13" stroke="#1f2429" strokeWidth="1.1" />
        <ellipse cx="5.5" cy="2" rx="5" ry="2" fill="#634c32" stroke="#251a0f" strokeWidth="0.6" />
        <rect x="13" y="6" width="7" height="11" rx="1.2" fill="#94a3b8" stroke="#475569" strokeWidth="0.7" />
        <polygon points="14,6 19,6 18,3 15,3" fill="#cbd5e1" stroke="#475569" strokeWidth="0.6" />
        <circle cx="16.5" cy="2" r="1" fill="#475569" />
      </g>
      <g data-tractor-body="" data-facing="left" transform={`translate(92 0) scale(-1 1) ${TRACTOR_BODY_TRANSFORM}`}>
      <defs>
        <linearGradient id={lightId} gradientUnits="userSpaceOnUse" x1="84" y1="27" x2="145" y2="27">
          <stop stopColor={theme.tractorLightGlow} stopOpacity=".85" />
          <stop offset=".35" stopColor={theme.tractorLightGlow} stopOpacity=".42" />
          <stop offset=".75" stopColor={theme.tractorLightGlow} stopOpacity=".12" />
          <stop offset="1" stopColor={theme.tractorLightGlow} stopOpacity="0" />
        </linearGradient>
        <filter id={`${lightId}-soft`} x="-15%" y="-50%" width="130%" height="200%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>
      <path d="M84,25 Q112,20 145,13 L145,43 Q112,34 84,29Z" fill={`url(#${lightId})`} filter={`url(#${lightId}-soft)`} pointerEvents="none" />
      <ContactGroundShadow cx={22} cy={48.5} rx={11} ry={1.7} color="#262b20" opacity={.42} />
      <ContactGroundShadow cx={76} cy={47.5} rx={7} ry={1.2} color="#262b20" opacity={.42} />

      {/* Matching far-side wheels recede by the same ground-plane offset. */}
      <g data-tractor-far-wheels="">
        <ellipse cx="15" cy="44.5" rx="8" ry="1.3" fill="#262b20" opacity=".2" />
        <ellipse cx="69" cy="44" rx="5.5" ry="1" fill="#262b20" opacity=".18" />
        <circle cx="15" cy="27" r="17.5" fill="#25282a" stroke="#171b1c" strokeWidth="1.1" />
        <path d="M2,16 A17,17 0 0 0 3,39" fill="none" stroke="#41453f" strokeWidth="1.8" strokeDasharray="3 3" />
        <circle cx="69" cy="35" r="9" fill="#25282a" stroke="#171b1c" strokeWidth="1" />
        <path d="M61,32 A8.5,8.5 0 0 0 65,42" fill="none" stroke="#41453f" strokeWidth="1.5" strokeDasharray="2 2.5" />
      </g>

      {/* The chassis and level rear carrier sit behind the wheels. */}
      <rect x="19" y="30" width="60" height="7" fill="#292d2e" rx="1.2" />
      <path d="M-10,25 L10,25 21,30" fill="none" stroke="#454841" strokeWidth="1.8" strokeLinejoin="round" />
      <g data-tractor-harvest-basket="">
        <rect x="-12" y="14" width="19" height="10.5" rx="1" fill="#ad8e5b" stroke="#715936" strokeWidth=".6" />
        <path d="M3,14 L7,14 7,23.5 3,24.5Z" fill="#8c744c" />
        <ellipse cx="-2.5" cy="14" rx="9.5" ry="1.8" fill="#c8aa76" />
        <ellipse cx="-2.5" cy="14" rx="7.7" ry="1.1" fill="#655238" />
        <path d="M-8,14 Q-9,9.5 -6,9.2 Q-3,10 -3,14Z" fill="#c6b18b" />
        <ellipse cx=".7" cy="12.8" rx="2.7" ry="2.4" fill="#dea03d" />
        <path d="M.7,10.5 L1,9.4" stroke="#526538" strokeWidth=".75" />
        <path d="M-11.8,14 Q-2.5,17 6.8,14" fill="none" stroke="#c8aa76" strokeWidth="1" />
        <path d="M-11,19 L6,19 M-6,16 L-6,23.8 M0,16 L0,23.8" stroke="#7f663f" strokeWidth=".65" fill="none" />
      </g>

      <circle cx="22" cy="30" r="18.5" fill="#1c1d20" />
      <circle cx="22" cy="30" r="16.5" fill="#292b30" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
        <line
          key={deg}
          x1={22 + 15 * Math.cos((deg * Math.PI) / 180)}
          y1={30 + 15 * Math.sin((deg * Math.PI) / 180)}
          x2={22 + 19 * Math.cos((deg * Math.PI) / 180)}
          y2={30 + 19 * Math.sin((deg * Math.PI) / 180)}
          stroke="#121315"
          strokeWidth="2.8"
        />
      ))}
      <circle cx="22" cy="30" r="11" fill="#eab308" stroke="#a16207" strokeWidth="1.2" />
      <circle cx="22" cy="30" r="9" fill="#ca8a04" />
      <circle cx="22" cy="30" r="4.5" fill="#1e2024" stroke="#0f1012" strokeWidth="0.8" />
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <circle
          key={`lug-${deg}`}
          cx={22 + 2.8 * Math.cos((deg * Math.PI) / 180)}
          cy={30 + 2.8 * Math.sin((deg * Math.PI) / 180)}
          r="0.8"
          fill="#fde047"
        />
      ))}

      {/* The open footwell separates the driver's seat from the engine casing. */}
      <path d="M38,24 L44,24 44,33 38,33Z" fill="#34312b" />
      <path d="M44,18 Q44,16 47,16 L76,19 82,22 82,34 44,33Z" fill="#c8352d" />
      <path d="M47,16 L76,19 82,22 48,20 44,21 44,18Z" fill="#ed604b" />
      <path d="M44,32 L82,33 82,37 43,36Z" fill="#8e2723" />
      <path d="M48,20.2 L76,22.7 M46,22 L46,30" fill="none" stroke="#f18a68" strokeWidth=".65" opacity=".75" />
      <path d="M53,23 l0,5 M57,23.5 l0,5" stroke="#832723" strokeWidth="1.1" strokeLinecap="round" />
      <rect x="65" y="25" width="7" height="2.5" rx=".65" fill="#d5ad53" />
      {/* The seat mount is behind the opaque near-side mudguard. */}
      <path d="M25,12 V17" stroke="#434842" strokeWidth="2" />
      {/* The mudguard sits over the tyre, leaving the yellow wheel readable. */}
      <path d="M2,29 C2,9 42,9 42,29 L38,29 C37,15 7,15 6,29Z" fill="#a42825" />
      <path d="M3,24 C7,9 36,10 41,24" stroke="#e84c3c" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M8,17 Q20,9 32,16" stroke="#ef8060" strokeWidth=".75" fill="none" opacity=".7" />
      <rect x="39" y="33" width="8" height="3" rx=".5" fill="#555952" />
      <path d="M40,33.5 H46" stroke="#92958a" strokeWidth=".6" />

      {/* The near wheel occludes the lower bonnet, with its axle behind the tyre. */}
      <path d="M66,34 L71,34 76,38" fill="none" stroke="#41453e" strokeWidth="2.6" strokeLinejoin="round" />
      <circle cx="76" cy="38" r="9.5" fill="#1c1d20" />
      <circle cx="76" cy="38" r="8.3" fill="#2a2c30" />
      {Array.from({length:10},(_,i)=>i*36).map(deg=><line key={`front-tread-${deg}`}
        x1={76+7.8*Math.cos(deg*Math.PI/180)} y1={38+7.8*Math.sin(deg*Math.PI/180)}
        x2={76+10*Math.cos(deg*Math.PI/180)} y2={38+10*Math.sin(deg*Math.PI/180)}
        stroke="#121617" strokeWidth="1.8" />)}
      <circle cx="76" cy="38" r="5" fill="#eab308" stroke="#a16207" strokeWidth="1" />
      <circle cx="76" cy="38" r="2.2" fill="#1e2024" />
      <circle cx="76" cy="38" r=".9" fill="#fde047" />

      <rect x="80" y="23" width="3.5" height="13.5" fill="#33383f" rx="1" stroke="#1f2329" strokeWidth="0.6" />
      <path d="M80.7,30 L82.5,30 M80.7,32 L82.5,32 M80.7,34 L82.5,34" stroke="#93998e" strokeWidth=".65" />

      {/* Exhaust Stack */}
      <line x1="64" y1="22" x2="64" y2="5" stroke="#1f2226" strokeWidth="3.2" strokeLinecap="round" />
      <rect x="62.2" y="10" width="3.6" height="7" rx="1" fill="#374151" stroke="#111827" strokeWidth="0.6" />
      <line x1="63" y1="4.5" x2="66.5" y2="3.5" stroke="#1f2226" strokeWidth="1.2" strokeLinecap="round" />



      {/* Driver Cockpit & Steering Wheel */}
      <path d="M18,4 Q18,3 20,3 Q22,3 22,5 L22,10 30,10 Q32,10 32,12 Q32,13.5 30,13.5 L21,13.5 Q18,13.5 18,11Z" fill="#25292a" stroke="#171c1b" strokeWidth=".6" />
      <path d="M23,10.5 H29.5" stroke="#51564d" strokeWidth=".6" />
      <path d="M43,24 L37,12" stroke="#303632" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="36.5" cy="11" rx="3.6" ry="1.7" fill="none" stroke="#242b28" strokeWidth="1.5" />

      {/* Headlight follows the left-facing bonnet across the meadow */}
      <circle cx="82" cy="27" r="3.6" fill="#fef08a" stroke="#a16207" strokeWidth="1.2" />
      <circle cx="82" cy="27" r="2.2" fill="#fffbeb" />

      </g>
      {/* Keep smoke outside the mirror, so scene wind and rising motion retain their direction. */}
      <g data-tractor-exhaust="" transform="translate(30.88 11.2) scale(.84)" pointerEvents="none" aria-hidden="true">
        <circle r="2.2" fill="#f8fafc" className="animate-tractor-smoke-1" />
        <circle r="3.2" fill="#ffffff" className="animate-tractor-smoke-2" />
      </g>
      </g>
      </g>
    </YardObject>
  </>;
}
