import type { Affine2D } from './affine2d';

export function sliceViewport(width:number,height:number,left=0,top=0):Affine2D {
  const fit=Math.max(width/1200,height/800);
  return {a:fit,b:0,c:0,d:fit,e:left+(width-1200*fit)/2,f:top+(height-800*fit)/2};
}
export function clientToSvg(parent:SVGGraphicsElement,x:number,y:number) {
  const matrix=parent.getScreenCTM();
  if(!matrix) return null;
  return new DOMPoint(x,y).matrixTransform(matrix.inverse());
}
