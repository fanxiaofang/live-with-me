import { MEADOW_ENTRANCE } from '../../components/scenery/yorkshire/vegetation/meadowForeground';
import { isGrass, isGround, rotateGroundPoint, YARD_IDS, YARD_OBJECTS, type YardLayout } from './yardLayout';

export type DeerRoutePoint={x:number;y:number};
export type DeerPatrolPath={points:DeerRoutePoint[];length:number;signature:string};
const RATIO=.285;
export function makeDeerPatrolPath(home:DeerRoutePoint,west:DeerRoutePoint,east:DeerRoutePoint):DeerPatrolPath {
  const left=west.x<east.x?west:east,right=west.x<east.x?east:west;
  const finish={x:right.x+65-home.x,y:Math.max(left.y,right.y)+122-home.y};
  const points:DeerRoutePoint[]=[],c1={x:finish.x*.34,y:2},c2={x:finish.x*.76,y:finish.y+7};
  let length=0;
  for(let i=0;i<=96;i++) {
    const t=i/96,v=1-t,p={x:3*v*v*t*c1.x+3*v*t*t*c2.x+t*t*t*finish.x,
      y:3*v*v*t*c1.y+3*v*t*t*c2.y+t*t*t*finish.y};
    if(i)length+=Math.hypot(p.x-points[i-1].x,(p.y-points[i-1].y)/RATIO);
    points.push(p);
  }
  return {points,length,signature:[home.x,home.y,left.x,left.y,right.x,right.y].map(n=>n.toFixed(2)).join(':')};
}
export function deerPathFromLayout(layout:YardLayout) {
  const home=YARD_OBJECTS.gate_spirit_deer,placement=layout.gate_spirit_deer;
  const root={x:home.x+placement.dx,y:home.y+placement.dy};
  const post=(id:'fence_west'|'fence_east',point:DeerRoutePoint)=>{
    const p=layout[id],rotated=rotateGroundPoint(point,YARD_OBJECTS[id],p.angle);
    return {x:rotated.x+p.dx,y:rotated.y+p.dy};
  };
  return makeDeerPatrolPath(root,post('fence_west',MEADOW_ENTRANCE.hinge),post('fence_east',MEADOW_ENTRANCE.latch));
}
function distanceToSegment(p:DeerRoutePoint,a:DeerRoutePoint,b:DeerRoutePoint){
  const dx=b.x-a.x,dz=(b.y-a.y)/RATIO;
  const t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)/RATIO*dz)/Math.max(.00001,dx*dx+dz*dz)));
  return Math.hypot(p.x-a.x-dx*t,(p.y-a.y)/RATIO-dz*t);
}
function segmentsNear(a:DeerRoutePoint,b:DeerRoutePoint,c:DeerRoutePoint,d:DeerRoutePoint){
  const cross=(x:number,y:number,u:number,v:number)=>x*v-y*u;
  const ax=b.x-a.x,ay=b.y-a.y,bx=d.x-c.x,by=d.y-c.y,den=cross(ax,ay,bx,by);
  if(Math.abs(den)>.00001){
    const u=cross(c.x-a.x,c.y-a.y,bx,by)/den,v=cross(c.x-a.x,c.y-a.y,ax,ay)/den;
    if(u>=0&&u<=1&&v>=0&&v<=1)return true;
  }
  return Math.min(distanceToSegment(a,c,d),distanceToSegment(b,c,d),distanceToSegment(c,a,b),distanceToSegment(d,a,b))<29;
}
/** Ground-plane swept corridor, including the east half of the entrance. */
export function isDeerPathClear(path:DeerPatrolPath,layout:YardLayout) {
  const home=YARD_OBJECTS.gate_spirit_deer,p=layout.gate_spirit_deer;
  if(layout.fence_west.removed||layout.fence_east.removed||path.length>850||path.points.at(-1)!.x<160)return false;
  const fence=(id:'fence_west'|'fence_east',points:readonly DeerRoutePoint[])=>points.map(point=>{
    const rotated=rotateGroundPoint(point,YARD_OBJECTS[id],layout[id].angle);
    return {x:rotated.x+layout[id].dx-home.x-p.dx,y:rotated.y+layout[id].dy-home.y-p.dy};
  });
  const west=fence('fence_west',MEADOW_ENTRANCE.westPosts),east=fence('fence_east',MEADOW_ENTRANCE.eastPosts);
  const hinge=west.at(-1)!,latch=east[0],mid={x:(hinge.x+latch.x)/2,y:(hinge.y+latch.y)/2};
  const leaf=(root:DeerRoutePoint,angle:number)=>{
    const length=Math.hypot(mid.x-root.x,(mid.y-root.y)/RATIO),radians=angle*Math.PI/180;
    return {x:root.x+length*Math.cos(radians),y:root.y+length*Math.sin(radians)*RATIO};
  };
  const fences=[...west.slice(1).map((point,i)=>[west[i],point]),...east.slice(1).map((point,i)=>[east[i],point]),
    [hinge,leaf(hinge,-MEADOW_ENTRANCE.gateOpenAngle)],[latch,leaf(latch,180+MEADOW_ENTRANCE.gateOpenAngle)]];
  if(fences.some(([a,b])=>path.points.slice(1).some((point,i)=>segmentsNear(a,b,path.points[i],point))))return false;
  return !YARD_IDS.some(id=>{
    if(id==='gate_spirit_deer'||id==='fence_west'||id==='fence_east'||isGrass(id)||isGround(id)||layout[id].removed)return false;
    const object=YARD_OBJECTS[id],placement=layout[id],radius=(object as {bounds?:{radiusX:number}}).bounds?.radiusX??22;
    const x=object.x+placement.dx-home.x-p.dx,z=(object.y+placement.dy-home.y-p.dy)/RATIO;
    return path.points.slice(1).some((b,i)=>{
      const a=path.points[i],dx=b.x-a.x,dz=(b.y-a.y)/RATIO;
      const t=Math.max(0,Math.min(1,((x-a.x)*dx+(z-a.y/RATIO)*dz)/(dx*dx+dz*dz)));
      return Math.hypot(x-a.x-dx*t,z-a.y/RATIO-dz*t)<radius+24;
    });
  });
}
