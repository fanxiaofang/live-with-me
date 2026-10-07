import { scenePoint, viewBoxPoint, type ScenePoint, type ViewBoxPoint } from '../scene/sceneTypes';

export const CAMERA_ORIGIN = viewBoxPoint(600, 400);
export interface Camera { x: number; y: number; zoom: number }
export const OVERVIEW_CAMERA: Camera = { x: 0, y: 135, zoom: 0.66 };
export const clampZoom = (zoom: number) => Number(Math.min(2.5, Math.max(0.45, zoom)).toFixed(12));
export function sceneToViewBox(p: ScenePoint, camera: Camera): ViewBoxPoint {
  return viewBoxPoint(600 + camera.zoom * (p.x - 600) + camera.x, 400 + camera.zoom * (p.y - 400) + camera.y);
}
export function viewBoxToScene(q: ViewBoxPoint, camera: Camera): ScenePoint {
  return scenePoint(600 + (q.x - 600 - camera.x) / camera.zoom, 400 + (q.y - 400 - camera.y) / camera.zoom);
}
export function focusCamera(p: ScenePoint, zoom: number, composition = CAMERA_ORIGIN): Camera {
  return { x: Number((composition.x - 600 - zoom * (p.x - 600)).toFixed(10)),
    y: Number((composition.y - 400 - zoom * (p.y - 400)).toFixed(10)), zoom };
}

export function panBounds(focus:Camera) {
  return { minX:Math.min(-420,focus.x),maxX:Math.max(420,focus.x),minY:Math.min(-120,focus.y),maxY:Math.max(300,focus.y) };
}
export function clampPan(camera:Camera,focus:Camera):Camera {
  const bounds=panBounds(focus);
  return {...camera,x:Math.min(bounds.maxX,Math.max(bounds.minX,camera.x)),y:Math.min(bounds.maxY,Math.max(bounds.minY,camera.y))};
}
