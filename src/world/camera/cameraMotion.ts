import type React from 'react';
import type { Camera } from './cameraMath';

export const CAMERA_TRANSITION_MS = 400;
export const CAMERA_SETTLE_MS = CAMERA_TRANSITION_MS + 50;

/** All depth layers share the same timing so their coverage stays synchronized. */
export function cameraTransformStyle(camera: Camera, isDragging = false): React.CSSProperties {
  return {
    transform: `translate(${camera.x}px, ${camera.y}px) scale(${camera.zoom})`,
    transformOrigin: '600px 400px',
    transition: isDragging ? 'none' : `transform ${CAMERA_TRANSITION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
    willChange: isDragging ? 'transform' : undefined,
  };
}
