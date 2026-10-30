import { OVERVIEW_CAMERA, type Camera } from '../../camera/cameraMath';
import { sliceViewport } from '../../coordinates/viewport';
import baseline from './config/baseline.json';
import { WorldViewAdapter } from './vendor/backdrop/WorldViewAdapter.js';
import { F2_PLACEMENT, type F2Placement } from './f2Config';

export interface SampledWorldView {
  camera: Camera;
  width: number;
  height: number;
}

/** Sample the browser's actual CSS interpolation, including interrupted transitions. */
export function sampleWorldView(svg: SVGSVGElement): SampledWorldView | null {
  const layer = svg.querySelector<SVGGElement>('#panoramic-world-stage');
  if (!layer) return null;
  const matrix = new DOMMatrixReadOnly(getComputedStyle(layer).transform);
  const { width, height } = svg.getBoundingClientRect();
  if (!width || !height) return null;
  return { camera: { x: matrix.e, y: matrix.f, zoom: matrix.a }, width, height };
}

/** Keep the calibrated overview; apply the source's bounded, per-ridge response around it. */
export function f2Projection(view: SampledWorldView, index: number, placement: F2Placement = F2_PLACEMENT) {
  const p = placement, base = OVERVIEW_CAMERA;
  const { backdrop } = WorldViewAdapter({
    camera: view.camera, viewport: { width: view.width, height: view.height },
  }, baseline.layers[index].response);
  const slice = sliceViewport(view.width, view.height);
  const project = (x: number, y: number) => ({
    x: slice.e + slice.a * (600 + base.zoom * (x - 600) + base.x),
    y: slice.f + slice.d * (400 + base.zoom * (y - 400) + base.y),
  });
  const origin = project(p.centerX + p.offsetX, p.horizonY + p.offsetY + p.layerOffsetY[index]);
  const unit = 2 / view.height;
  const scale = p.unitsPerDesignUnit * p.scale * p.layerScale[index] * base.zoom * slice.a * unit * backdrop.scale;
  return {
    x: (origin.x - view.width / 2) * unit + backdrop.x,
    y: (view.height / 2 - origin.y) * unit + backdrop.y,
    scale,
  };
}

/** Attach SVG landmarks directly to the actual nearest mesh, outside any animated parent. */
export function f2LandmarkTransform(view: SampledWorldView, placement: F2Placement = F2_PLACEMENT) {
  const index = 2, p = f2Projection(view, index, placement);
  const slice = sliceViewport(view.width, view.height), unit = 2 / view.height;
  const scale = p.scale / (placement.unitsPerDesignUnit * placement.scale * placement.layerScale[index] * slice.a * unit);
  const anchorX = placement.centerX + placement.offsetX;
  const anchorY = placement.horizonY + placement.offsetY + placement.layerOffsetY[index];
  const originX = (view.width / 2 + p.x / unit - slice.e) / slice.a;
  const originY = (view.height / 2 - p.y / unit - slice.f) / slice.d;
  return {
    a: scale, b: 0, c: 0, d: scale,
    e: originX - scale * anchorX,
    f: originY - scale * anchorY,
  };
}
