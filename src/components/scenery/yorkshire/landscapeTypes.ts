import type { InteractionTarget } from '../../../world/interactions/interactionTypes';

/**
 * 🎨 Yorkshire Countryside Theme tokens
 */
export interface YorkshireSceneTheme {
  skyTop: string;
  skyBottom: string;
  hillGreenFar: string;
  hillGreenMid: string;
  hillGreenNear: string;
  wheatFar: string;
  wheatNear: string;
  roadColor: string;
  riverColor: string;
  riverReflect: string;
  riverRipples: string;
  ambientTint: string;
  cottageGlow: string;
  tractorLightGlow: string;
  roofColor: string;
  isNight: boolean;
  isRainy: boolean;
}

/**
 * Common props shared across Yorkshire landscape layer components
 */
export interface YorkshireCommonProps {
  theme: YorkshireSceneTheme;
  onTriggerToast?: (msg: string) => void;
  setHoveredObject?: (target: InteractionTarget | null) => void;
  className?: string;
}

/**
 * Conceptual Architecture Layer IDs (01 to 06)
 */
export type YorkshireLayerId =
  | '01_TERRAIN_SILHOUETTE'
  | '02_TERRAIN_MASS'
  | '03_LAND_PARCELS'
  | '04_BOUNDARIES'
  | '05_INFRASTRUCTURE'
  | '06_DRESSING';

export interface SheepConfig {
  id: string;
  name: string;
  x: number;
  y: number;
  scale: number;
  quoteIndex: number;
  hoverText: string;
}
