import type React from 'react';
import { Camera, OVERVIEW_CAMERA } from './cameraMath';

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
  return {
    transform: `translate(${resolved.x}px, ${resolved.y}px) scale(${resolved.zoom})`,
    transformOrigin: '600px 400px',
    transition: isDragging ? 'none' : 'transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1)',
    willChange: isDragging ? 'transform' : undefined,
  };
}
