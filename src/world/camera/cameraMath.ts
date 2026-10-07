import { viewBoxPoint, scenePoint, type ScenePoint, type ViewBoxPoint } from '../scene/sceneTypes';

export const CAMERA_ORIGIN = viewBoxPoint(600, 400);
export interface Camera { x: number; y: number; zoom: number }
export const OVERVIEW_CAMERA: Camera = { x: 0, y: 135, zoom: 0.66 };
export const clampZoom = (zoom: number) => Math.min(2.5, Math.max(0.45, zoom));
export function sceneToViewBox(p: ScenePoint, camera: Camera): ViewBoxPoint {
  return viewBoxPoint(600 + camera.zoom * (p.x - 600) + camera.x, 400 + camera.zoom * (p.y - 400) + camera.y);
}
export function viewBoxToScene(q: ViewBoxPoint, camera: Camera): ScenePoint {
  return scenePoint(600 + (q.x - 600 - camera.x) / camera.zoom, 400 + (q.y - 400 - camera.y) / camera.zoom);
}
export function focusCamera(p: ScenePoint, zoom: number, composition = CAMERA_ORIGIN): Camera {
  return { x: composition.x - 600 - zoom * (p.x - 600), y: composition.y - 400 - zoom * (p.y - 400), zoom };
}
