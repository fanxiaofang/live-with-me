import type React from 'react';
import { Camera, OVERVIEW_CAMERA, sceneToViewBox, viewBoxToScene } from './cameraMath';
import { LANDSCAPE_SURFACES } from '../scene/landscapeGeometry';
import { scenePoint, viewBoxPoint } from '../scene/sceneTypes';
import { cameraTransformStyle } from './cameraMotion';

export interface ParallaxDamping {
  kTx: number;
  kTy: number;
  kSz: number;
}

export const PARALLAX_PRESETS = {
  sky: { kTx: 0.08, kTy: 0.05, kSz: 0.15 } as ParallaxDamping,
  mountains: { kTx: 0.28, kTy: 0.20, kSz: 0.40 } as ParallaxDamping,
  wheat: { kTx: 0.65, kTy: 0.55, kSz: 0.70 } as ParallaxDamping,
  stage: { kTx: 1.0, kTy: 1.0, kSz: 1.0 } as ParallaxDamping,
} as const;

export function resolveParallaxCamera(
  camera: Camera,
  damping: ParallaxDamping,
  baseCamera: Camera = OVERVIEW_CAMERA
): Camera {
  const dx = camera.x - baseCamera.x;
  const dy = camera.y - baseCamera.y;
  const dz = camera.zoom - baseCamera.zoom;
  return {
    x: Number((baseCamera.x + dx * damping.kTx).toFixed(4)),
    y: Number((baseCamera.y + dy * damping.kTy).toFixed(4)),
    zoom: Number((baseCamera.zoom + dz * damping.kSz).toFixed(4)),
  };
}

export function getParallaxTransformStyle(
  camera: Camera = OVERVIEW_CAMERA,
  damping: ParallaxDamping,
  isDragging = false,
  baseCamera: Camera = OVERVIEW_CAMERA
): React.CSSProperties {
  const resolved = resolveParallaxCamera(camera, damping, baseCamera);
  return cameraTransformStyle(resolved, isDragging);
}

export interface LandscapeCoverage {
  mountainFrontExtension: number;
  wheatFrontExtension: number;
}

/** Extend only hidden terrain skirts; landmarks keep their rigid layer projection. */
export function resolveLandscapeCoverage(camera: Camera): LandscapeCoverage {
  const mountains = resolveParallaxCamera(camera, PARALLAX_PRESETS.mountains);
  const wheat = resolveParallaxCamera(camera, PARALLAX_PRESETS.wheat);
  const { backgroundOffsetY, overlap } = LANDSCAPE_SURFACES;
  const project = (y: number, layer: Camera, offset: number = backgroundOffsetY) =>
    sceneToViewBox(scenePoint(0, y + offset), layer).y;
  const local = (y: number, layer: Camera) =>
    viewBoxToScene(viewBoxPoint(0, y), layer).y - backgroundOffsetY;

  return {
    mountainFrontExtension: Math.max(0,
      local(project(LANDSCAPE_SURFACES.wheatBackMaxY, wheat) + overlap, mountains)
      - LANDSCAPE_SURFACES.mountainApronFrontMinY),
    wheatFrontExtension: Math.max(0,
      local(project(LANDSCAPE_SURFACES.meadowBackMaxY, camera, 0) + overlap, wheat)
      - LANDSCAPE_SURFACES.wheatFrontMinY),
  };
}
