import { resolveSceneOptions } from '../../scene/currentScene';

export interface F2Placement {
  centerX: number; horizonY: number; unitsPerDesignUnit: number; scale: number;
  offsetX: number; offsetY: number;
  layerScale: readonly number[]; layerOffsetY: readonly number[];
  hiddenBottom: number; pixelRatioLimit: number;
}

const originalPlacement: F2Placement = {
  centerX: 600, horizonY: 35, unitsPerDesignUnit: 400, scale: 1,
  offsetX: 0, offsetY: 0,
  layerScale: [1, 1, 1], layerOffsetY: [0, 0, 0],
  hiddenBottom: -8, pixelRatioLimit: 1.5,
};

export type F2StudyId = 'baseline' | 'position20' | 'position35' | 'refined';
export interface F2Calibration {
  id: F2StudyId;
  label: string;
  placement: F2Placement;
  adaptAtmosphere: boolean;
}

const lowered = (offsetY: number): F2Placement => ({
  ...originalPlacement,
  offsetY,
  // Bring the distant contours closer together without changing their shapes.
  layerOffsetY: [10, 4, 0],
});

/** Source units: at 1600x900 overview, +25/+40 move the nearest ridge 22/35px down. */
export const F2_STUDIES: Record<F2StudyId, F2Calibration> = {
  baseline: { id: 'baseline', label: '原接入，无鲸鱼云', placement: originalPlacement, adaptAtmosphere: false },
  position20: { id: 'position20', label: '下移约20px，仅位置', placement: lowered(25), adaptAtmosphere: false },
  position35: { id: 'position35', label: '下移约35px，仅位置', placement: lowered(40), adaptAtmosphere: false },
  refined: { id: 'refined', label: '位置＋空气色＋山脚过渡', placement: lowered(40), adaptAtmosphere: true },
};

export const F2_PLACEMENT = F2_STUDIES.refined.placement;
export type HillsMode = 'legacy' | 'f2';
export function requestedHillsMode(search = typeof window === 'undefined' ? '' : window.location.search): HillsMode {
  return resolveSceneOptions(search).hills;
}
export function requestedF2Study(search = typeof window === 'undefined' ? '' : window.location.search): F2StudyId {
  return resolveSceneOptions(search).hillsStudy;
}
