import type { TimeOfDay } from '../../../types';
import type { YorkshireSceneTheme } from '../../../components/scenery/yorkshire/landscapeTypes';
import baseline from './config/baseline.json';
import initialStudy from './config/study.json';
import { environmentLook } from './vendor/backdrop/environment.js';
import { resolveSourceHillsLook } from './F2Atmosphere';

/** One source environment supplies WebGL sky/ridges and the SVG surface roles. */
export function resolveF2Environment(time: TimeOfDay) {
  const config = structuredClone(baseline);
  config.timeOfDay = time;
  config.weather = 'clear';
  const study = structuredClone(initialStudy);
  if (time === 'dusk') Object.assign(study.lighting, { sunAzimuth: 65, sunElevation: 15 });
  if (time === 'night') study.lighting.sunIntensity = 0;
  return { config, study, sky: environmentLook(config, config.layers[0], 0) };
}

export function createF2SceneTheme(host: YorkshireSceneTheme, time: TimeOfDay): YorkshireSceneTheme {
  const { config, sky } = resolveF2Environment(time);
  const nearest = resolveSourceHillsLook(config, 2);
  const surface = (hex: string) => '#' + environmentLook(config, { ...config.layers[2], color: hex }, 2).base.getHexString();
  const air = (hex: string, strength: number) => '#' + environmentLook(config, { ...config.layers[2], color: hex }, 2).base.lerp(sky.air, strength).getHexString();
  return { ...host, timeOfDay: time,
    // Railway stands ahead of the nearest ridge, sharing its air rather than its camera.
    railwayAtmosphere: { air: '#' + nearest.air.getHexString(), strength: nearest.layerAir * .7, nearestMountainStrength: nearest.layerAir },
    skyTop: '#' + sky.top.getHexString(), skyMid: '#' + sky.top.clone().lerp(sky.horizon, .5).getHexString(),
    skyBottom: '#' + sky.horizon.getHexString(), skyWarm: '#' + sky.air.getHexString(),
    hillGreenFar: air('#7c8b69', .3), hillGreenMid: surface('#8ea344'), hillGreenNear: surface('#485f2a'),
    wheatFar: surface('#d9c277'), wheatNear: surface('#b69a50'),
    landscapeEnvironment: {
      grassTop: surface('#9aa640'), grassMid: surface('#849f42'), grassDeep: surface('#5e7b2d'),
      wheatTop: surface('#d9c277'), wheatMid: surface('#d8bf70'), wheatDeep: surface('#d0b665'),
      foothillBack: air('#85977f', .58), foothillFront: air('#99a478', .3),
      woodland: air('#5a7557', .36), woodlandShade: air('#425d49', .36), woodlandLight: air('#718960', .38),
      birchTrunk: air('#bfc3a4', .3), farmWall: surface('#e1e0c7'), farmRoof: surface('#a84e34'),
      objectTint: time === 'night' ? '.46 .52 .64' : time === 'dusk' ? '.79 .70 .64' : '1 1 1',
    },
  };
}
