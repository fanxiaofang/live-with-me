import { FULL_VIEWBOX, type ViewBoxBounds } from '../coordinates/viewport';
import { sceneExplorationBounds, type SceneBounds } from '../scene/explorationBounds';
import { LANDSCAPE_SURFACES } from '../scene/landscapeGeometry';
import { DEFAULT_SCENE_LAYOUT } from '../scene/sceneLayout';
import { scenePoint } from '../scene/sceneTypes';
import { OVERVIEW_CAMERA, sceneToViewBox, type Camera } from './cameraMath';
import { PARALLAX_PRESETS, resolveParallaxCamera } from './parallaxMath';

/** Keep a readable mountain/wheat separation while exploring at overview scale. */
function overviewMinY(zoom: number, viewportHeight: number) {
  const camera = { x: 0, y: 0, zoom };
  const mountains = resolveParallaxCamera(camera, PARALLAX_PRESETS.mountains);
  const wheat = resolveParallaxCamera(camera, PARALLAX_PRESETS.wheat);
  const offset = LANDSCAPE_SURFACES.backgroundOffsetY;
  const ridge = sceneToViewBox(scenePoint(0, 160 + offset), mountains).y;
  const field = sceneToViewBox(scenePoint(0, 200 + offset), wheat).y;
  return (viewportHeight * 0.018 - (field - ridge))
    / (PARALLAX_PRESETS.wheat.kTy - PARALLAX_PRESETS.mountains.kTy);
}

export function panBounds(
  camera: Camera,
  focus: Camera,
  viewport: ViewBoxBounds = FULL_VIEWBOX,
  content: SceneBounds = sceneExplorationBounds(DEFAULT_SCENE_LAYOUT),
): SceneBounds {
  const width = viewport.maxX - viewport.minX;
  const height = viewport.maxY - viewport.minY;
  const project = (x: number, y: number) => sceneToViewBox(scenePoint(x, y), { ...camera, x: 0, y: 0 });
  const start = project(content.minX, content.minY);
  const end = project(content.maxX, content.maxY);
  // If the subject fits, retain it inside this composition window. If it is
  // larger, allow traversing its crop instead of drifting beyond its edges.
  const xEnds = [viewport.minX + width * 0.08 - start.x, viewport.maxX - width * 0.08 - end.x];
  const yEnds = [viewport.minY + height * 0.18 - start.y, viewport.maxY - height * 0.12 - end.y];
  let minY = Math.min(...yEnds);
  const maxY = Math.max(...yEnds);
  const overviewWeight = Math.min(1, Math.max(0, (0.95 - camera.zoom) / (0.95 - OVERVIEW_CAMERA.zoom)));
  minY += (Math.min(maxY, Math.max(minY, overviewMinY(camera.zoom, height))) - minY) * overviewWeight;
  const bounds = { minX: Math.min(...xEnds), maxX: Math.max(...xEnds), minY, maxY };

  // Responsive room views can use a lower zoom on portrait screens. Keep their
  // focus and nearby travel reachable; zooming further out returns to panorama bounds.
  const isOverviewFocus = focus.x === OVERVIEW_CAMERA.x && focus.y === OVERVIEW_CAMERA.y
    && focus.zoom === OVERVIEW_CAMERA.zoom;
  if (camera.zoom >= 0.95 || (!isOverviewFocus && camera.zoom >= focus.zoom)) {
    const focusX = focus.x * camera.zoom / focus.zoom;
    const focusY = focus.y * camera.zoom / focus.zoom;
    bounds.minX = Math.min(bounds.minX, focusX - width * 0.12);
    bounds.maxX = Math.max(bounds.maxX, focusX + width * 0.12);
    bounds.minY = Math.min(bounds.minY, focusY - height * 0.1);
    bounds.maxY = Math.max(bounds.maxY, focusY + height * 0.1);
  }
  return bounds;
}

export function clampPan(camera: Camera, focus: Camera, viewport?: ViewBoxBounds, content?: SceneBounds): Camera {
  const bounds = panBounds(camera, focus, viewport, content);
  return {
    ...camera,
    x: Math.min(bounds.maxX, Math.max(bounds.minX, camera.x)),
    y: Math.min(bounds.maxY, Math.max(bounds.minY, camera.y)),
  };
}
