import React from 'react';

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
  setHoveredObject?: (name: string | null) => void;
  className?: string;
}

/**
 * Props for interactive infrastructure like Communication Hill
 */
export interface CommunicationHillProps extends YorkshireCommonProps {
  activeRoom?: string;
  onSelectRoom?: (roomId: any) => void;
  onSelectPerson?: (person: any) => void;
  presenceSlots?: Record<string, any>;
  alienPulseEffect?: boolean;
  triggerAlienSignal?: (e?: React.MouseEvent) => void;
  hasMovedRef?: React.RefObject<boolean>;
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
