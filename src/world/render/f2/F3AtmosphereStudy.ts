import type { FoothillAtmosphere, YorkshireSceneTheme } from '../../../components/scenery/yorkshire/landscapeTypes';
import type { TimeOfDay } from '../../../types';
import { Color } from 'three';

/** Period-aware atmosphere plus explicit development comparisons. */
export type AtmosphereStudy = 'baseline' | 'no-vignette' | 'clear-sky' | 'clear-sky-no-vignette' | 'midground' | 'valley-transition' | 'valley-mist' | 'valley-expanded-mist' | 'valley-baked-mist' | 'railway-midground' | 'foothill-valley' | 'foothill-valley-mist' | 'accepted-landscape';
export interface RailwayAirStudy { air: string; strength: number }
export interface SkyAppearance { top: string; horizon: string }

const CLEAR_DAY_SKY: Readonly<SkyAppearance> = { top: '#6aa9cf', horizon: '#e3eef1' };
const MIDGROUND_DAY: Readonly<FoothillAtmosphere> = {
  air: '#b9d2d8', surfaceStrength: .055, landmarkStrength: .07,
};
const VALLEY_TRANSITION: Readonly<FoothillAtmosphere> = { ...MIDGROUND_DAY, transition: 'valley' };
const BAKED_MIST: Readonly<FoothillAtmosphere> = { ...VALLEY_TRANSITION, mist: true, mistTechnique: 'baked' };
const EXPANDED_MIST: Readonly<FoothillAtmosphere> = { ...VALLEY_TRANSITION, mist: true, mistTechnique: 'expanded' };
const VALLEY_MATERIAL_DAY: Readonly<FoothillAtmosphere> = { ...VALLEY_TRANSITION, valleyMaterial: 's4' };
const VALLEY_MATERIAL_MIST: Readonly<FoothillAtmosphere> = { ...BAKED_MIST, valleyMaterial: 's4' };
const MIDGROUND_RAILWAY_DAY: Readonly<RailwayAirStudy> = { air: MIDGROUND_DAY.air, strength: .115 };
const VALLEY_MIST: Readonly<FoothillAtmosphere> = { ...VALLEY_TRANSITION, mist: true };

const makeEvening = (sky:SkyAppearance,air:string,surfaceStrength:number,landmarkStrength:number,railStrength:number) => {
  const foothill:Readonly<FoothillAtmosphere>={air,surfaceStrength,landmarkStrength};
  const transition:Readonly<FoothillAtmosphere>={...foothill,transition:'valley'};
  const valley:Readonly<FoothillAtmosphere>={...transition,valleyMaterial:'s4'};
  return {sky,foothill,transition,valley,railway:{air,strength:railStrength}};
};
const EVENING_LOOKS={
  dusk:makeEvening({top:'#667fa7',horizon:'#e7c5ad'},'#aeb3bc',.075,.09,.12),
  night:makeEvening({top:'#142b4c',horizon:'#4a6486'},'#506581',.085,.10,.10),
};

/** Shared by GPU and CPU valley shading; no daytime-white air in evening terrain. */
export function valleyPeriodAir(time:TimeOfDay){
  return time==='day'?{color:MIDGROUND_DAY.air,strength:.045}
    :{color:EVENING_LOOKS[time].foothill.air,strength:time==='dusk'?.065:.075};
}

export const DEFAULT_ATMOSPHERE_STUDY: AtmosphereStudy = 'accepted-landscape';

/** Keep useful comparisons; retired intermediate stages remain URL-compatible only. */
export const ATMOSPHERE_REVIEW_CHOICES:readonly {id:AtmosphereStudy;label:string}[]=[
  {id:'accepted-landscape',label:'当前 · 谷地＋铁路'},
  {id:'baseline',label:'原始基线'},
  {id:'foothill-valley',label:'谷地 · 无低雾'},
  {id:'foothill-valley-mist',label:'谷地 · 独立对照'},
  {id:'railway-midground',label:'铁路 · 独立对照'},
  {id:'valley-mist',label:'原始 C · 体积雾备选'},
  {id:'valley-expanded-mist',label:'C+ · 实时调参'},
  {id:'valley-baked-mist',label:'C+ · 原烘焙对照'},
];

/** Same spatial treatment in every period; local mist is daytime-only. */
export function defaultAtmosphereStudy(_time: TimeOfDay): AtmosphereStudy {
  return DEFAULT_ATMOSPHERE_STUDY;
}

export function requestedAtmosphereStudy(search: string): AtmosphereStudy {
  const requested = new URLSearchParams(search).get('atmosphereStudy');
  const choices: readonly string[] = ['baseline','no-vignette','clear-sky','clear-sky-no-vignette',
    'midground','valley-transition','valley-mist','valley-expanded-mist','valley-baked-mist','railway-midground','foothill-valley','foothill-valley-mist','accepted-landscape'];
  return requested && choices.includes(requested) ? requested as AtmosphereStudy : DEFAULT_ATMOSPHERE_STUDY;
}

export function atmosphereStudyLook(study: AtmosphereStudy, time: TimeOfDay) {
  const midground = study === 'midground' || study === 'valley-transition' || study === 'valley-mist' || study === 'valley-expanded-mist' || study === 'valley-baked-mist' || study === 'railway-midground' || study === 'foothill-valley' || study === 'foothill-valley-mist' || study === 'accepted-landscape';
  if(time!=='day'){
    const p=EVENING_LOOKS[time];
    return {
      sky:study==='clear-sky'||study==='clear-sky-no-vignette'||midground?p.sky:undefined,
      vignetteOpacity:study==='no-vignette'||study==='clear-sky-no-vignette'||midground?0:1,
      railway:study==='railway-midground'||study==='accepted-landscape'?p.railway:undefined,
      foothill:!midground?undefined:study==='midground'?p.foothill
        :study==='foothill-valley'||study==='foothill-valley-mist'||study==='accepted-landscape'?p.valley:p.transition,
    };
  }
  return {
    sky: time === 'day' && (study === 'clear-sky' || study === 'clear-sky-no-vignette' || midground)
      ? CLEAR_DAY_SKY : undefined,
    vignetteOpacity: study === 'no-vignette' || study === 'clear-sky-no-vignette' || midground ? 0 : 1,
    railway: time === 'day' && (study === 'railway-midground' || study === 'accepted-landscape') ? MIDGROUND_RAILWAY_DAY : undefined,
    foothill: time !== 'day' || !midground ? undefined
      : study === 'foothill-valley' ? VALLEY_MATERIAL_DAY : study === 'foothill-valley-mist' || study === 'accepted-landscape' ? VALLEY_MATERIAL_MIST : study === 'valley-baked-mist' || study === 'railway-midground' ? BAKED_MIST : study === 'valley-expanded-mist' ? EXPANDED_MIST : study === 'valley-mist' ? VALLEY_MIST : study === 'valley-transition' ? VALLEY_TRANSITION : MIDGROUND_DAY,
  };
}

/** Change displayed sky endpoints only. In particular, skyWarm/air and all
 * landscape/railway material roles remain the original source environment. */
export function withStudySky(theme: YorkshireSceneTheme, sky?: SkyAppearance): YorkshireSceneTheme {
  return sky ? { ...theme, skyTop: sky.top,
    skyMid: '#' + new Color(sky.top).lerp(new Color(sky.horizon), .5).getHexString(),
    skyBottom: sky.horizon } : theme;
}

/** S3 changes only railway air. Material pigments, emission and parallax remain owned elsewhere. */
export function withStudyRailway(theme: YorkshireSceneTheme, railway?: RailwayAirStudy): YorkshireSceneTheme {
  return railway && theme.railwayAtmosphere
    ? { ...theme, railwayAtmosphere: { ...theme.railwayAtmosphere, ...railway } }
    : theme;
}
