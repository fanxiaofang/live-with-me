import * as THREE from 'three';
import type { YorkshireSceneTheme } from '../../../components/scenery/yorkshire/landscapeTypes';
import { OVERVIEW_CAMERA } from '../../camera/cameraMath';
import type { F2Calibration } from './f2Config';
import { resolveLook } from './vendor/backdrop/ridgeMaterial.js';

/** Calibrate distance for the host composition, retaining the source environment's air colour. */
export function resolveSourceHillsLook(config, index: number) {
  const look = resolveLook(config, config.layers[index], index);
  const strength = config.timeOfDay === 'night' ? .65 : 1;
  look.layerAir = Math.min(.88, look.layerAir + [.12, .14, .07][index] * strength);
  look.foot = Math.min(.65, look.foot + [.035, .06, .07][index] * strength);
  look.footY += [.025, .035, .06][index];
  look.footWidth *= 1.25;
  look.light *= .88;
  return look;
}

/** Match the SVG gradient's sRGB interpolation, then return linear shader colour. */
export function sampleWorldSky(theme: YorkshireSceneTheme, viewBoxY: number) {
  const f = Math.max(0, Math.min(1, (viewBoxY + 320) / 740));
  const a = new THREE.Color(f < .5 ? theme.skyTop : theme.skyMid || theme.skyTop).convertLinearToSRGB();
  const b = new THREE.Color(f < .5 ? theme.skyMid || theme.skyTop : theme.skyBottom).convertLinearToSRGB();
  return a.lerp(b, f < .5 ? f * 2 : (f - .5) * 2).convertSRGBToLinear();
}

export function resolveHostHillsLook(config, index: number, theme: YorkshireSceneTheme, calibration: F2Calibration) {
  const layer = config.layers[index];
  const look = resolveLook(config, layer, index);
  if (!calibration.adaptAtmosphere) {
    look.air.lerp(new THREE.Color(theme.skyWarm || theme.skyBottom),
      theme.isNight ? 1 : config.timeOfDay === 'dusk' ? .6 : theme.isRainy ? .85 : .2);
    return look;
  }
  const p = calibration.placement;
  const meanRidge = layer.points.reduce((sum, point) => sum + point.y, 0) / layer.points.length;
  const sourceY = p.horizonY + p.offsetY + p.layerOffsetY[index]
    - meanRidge * p.unitsPerDesignUnit * p.scale * p.layerScale[index];
  const referenceY = 400 + OVERVIEW_CAMERA.zoom * (sourceY - 400) + OVERVIEW_CAMERA.y;
  // Use the real sky at the overview composition, fixed while panning/focusing.
  // This avoids colour pumping when the camera moves.
  look.air.copy(sampleWorldSky(theme, referenceY));
  const strength = theme.isNight ? .65 : 1;
  look.layerAir = Math.min(.9, look.layerAir + [.18, .20, .10][index] * strength);
  look.foot = Math.min(.65, look.foot + [.025, .045, .08][index] * strength);
  look.footY += [.015, .025, .065][index];
  look.footWidth *= 1.1;
  return look;
}
