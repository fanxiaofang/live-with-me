import { FULL_VIEWBOX, type ViewBoxBounds } from '../coordinates/viewport';
import { sceneExplorationBounds, type SceneBounds } from '../scene/explorationBounds';
import type { SceneLayout } from '../scene/sceneTypes';
import { clampZoom, type Camera } from './cameraMath';

export const OVERVIEW_MAX_ZOOM = .54;

/** Frame the roof and estate, reserving the lower edge for navigation. */
export function resolveOverviewCamera(layout: SceneLayout, viewport: ViewBoxBounds = FULL_VIEWBOX, bounds?: SceneBounds): Camera {
  const width = viewport.maxX - viewport.minX;
  const height = viewport.maxY - viewport.minY;
  const content = bounds ?? sceneExplorationBounds(layout);
  const cottage = layout.main_cottage;
  const zoom = clampZoom(Math.min(OVERVIEW_MAX_ZOOM,
    width * .9 / (640 * cottage.scale), height * .66 / (content.maxY - content.minY)));
  // A phone prioritizes the whole cottage; wide screens keep the estate context.
  const portrait = Math.max(0, Math.min(1, (800 - width) / 400));
  return {
    x: Number(((600 - cottage.position.x) * zoom * portrait).toFixed(4)),
    y: overviewBottomY(zoom, content.maxY, viewport, panoramaBottomMargin(zoom)),
    zoom,
  };
}

export function panoramaBottomMargin(zoom: number): number {
  return .06 + .06 * Math.max(0, Math.min(1, (zoom - .45) / (.66 - .45))) ** 2;
}

export function overviewBottomY(zoom: number, bottom: number, viewport: ViewBoxBounds, margin = .12): number {
  const height = viewport.maxY - viewport.minY;
  return Number((viewport.maxY - height * margin - 400 - zoom * (bottom - 400)).toFixed(4));
}
