import type { Placement } from './sceneTypes';
import { WHEAT_TRAMLINES, tramlineX } from './fieldParcels';
import { LANDSCAPE_SURFACES } from './landscapeGeometry';

type Point = {x:number;y:number};
export interface ObservatorySite {
  center: Point; scale:number; start:Point; end:Point; control1:Point; control2:Point;
  tramline:number; bankStart:Point; bankEnd:Point; path:string;
}
const offset=LANDSCAPE_SURFACES.backgroundOffsetY;

/** Site geometry is in the wheat layer's coordinates, independent of the viewing camera. */
export function resolveObservatorySite(placement:Placement):ObservatorySite {
  const s=placement.scale;
  const center={x:placement.position.x,y:placement.position.y+48*s};
  const start={x:placement.position.x-16*s,y:placement.position.y+72*s};
  // Enter the field from the door's near-left side and meet the left-hand margin farther forward.
  const authoredY=Math.max(205,Math.min(510,center.y+78*s-offset));
  const all=WHEAT_TRAMLINES.map((_,i)=>i);
  const left=all.filter(i=>tramlineX(i,authoredY)<start.x-12*s);
  const tramline=(left.length?left:all).reduce((best,i)=>
    Math.abs(tramlineX(i,authoredY)-start.x)<Math.abs(tramlineX(best,authoredY)-start.x)?i:best);
  const end={x:tramlineX(tramline,authoredY),y:authoredY+offset};
  const direction=end.x>=start.x?1:-1;
  const line=WHEAT_TRAMLINES[tramline],slope=(line.y2-line.y1)/(line.x2-line.x1);
  const control1={x:start.x-17*s,y:start.y+13*s};
  const control2={x:end.x-direction*36*s,y:end.y-direction*36*s*slope};
  const bankStart={x:tramlineX(tramline,authoredY-14),y:authoredY-14+offset};
  const bankEnd={x:tramlineX(tramline,authoredY+18),y:authoredY+18+offset};
  return {center,scale:s,start,end,control1,control2,tramline,bankStart,bankEnd,
    path:`M${start.x},${start.y} C${control1.x},${control1.y} ${control2.x},${control2.y} ${end.x},${end.y}`};
}

/** Reserve the entire footprint of each roll, including a little working clearance. */
export function isInObservatorySite(x:number,y:number,site:ObservatorySite,padding=0):boolean {
  const dx=x-site.center.x,dy=y-site.center.y;
  if ((dx/(101*site.scale+padding))**2+(dy/(40*site.scale+padding*.285))**2<1) return true;
  const {start:a,control1:b,control2:c,end:d}=site;
  for(let i=0;i<=24;i++){
    const t=i/24,u=1-t;
    const px=u*u*u*a.x+3*u*u*t*b.x+3*u*t*t*c.x+t*t*t*d.x;
    const py=u*u*u*a.y+3*u*u*t*b.y+3*u*t*t*c.y+t*t*t*d.y;
    if(Math.hypot(x-px,(y-py)/.285)<9*site.scale+padding)return true;
  }
  return false;
}

/** A roll's raised body must also stay clear of the door and path, not just its ground anchor. */
export function isBaleInObservatorySite(x:number,y:number,scale:number,site:ObservatorySite):boolean {
  return isInObservatorySite(x,y,site,20*scale)
    || isInObservatorySite(x,y-9*scale,site,17*scale);
}
