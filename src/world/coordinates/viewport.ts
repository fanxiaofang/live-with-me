import type { Affine2D } from './affine2d';

export interface ViewBoxBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export const FULL_VIEWBOX: ViewBoxBounds = { minX: 0, maxX: 1200, minY: 0, maxY: 800 };

/** The visible rectangle of an xMidYMid slice SVG, including cropped wide/tall views. */
export function visibleViewBox(width: number, height: number): ViewBoxBounds {
  if (width <= 0 || height <= 0) return FULL_VIEWBOX;
  const fit = Math.max(width / 1200, height / 800);
  const visibleWidth = width / fit;
  const visibleHeight = height / fit;
  return {
    minX: (1200 - visibleWidth) / 2, maxX: (1200 + visibleWidth) / 2,
    minY: (800 - visibleHeight) / 2, maxY: (800 + visibleHeight) / 2,
  };
}

export function sliceViewport(width:number,height:number,left=0,top=0):Affine2D {
  const fit=Math.max(width/1200,height/800);
  return {a:fit,b:0,c:0,d:fit,e:left+(width-1200*fit)/2,f:top+(height-800*fit)/2};
}
export function clientToSvg(parent:SVGGraphicsElement,x:number,y:number) {
  const matrix=parent.getScreenCTM();
  if(!matrix) return null;
  return new DOMPoint(x,y).matrixTransform(matrix.inverse());
}
