import { DEER_LEGS, DEER_LEG_RADII } from './spiritDeerRig';
import {pairedEarDistance} from './spiritDeerHeadFeatures';

/** Procedural, three-dimensional effect carrier. Never rendered as an opaque skin. */
export type Point3 = [number, number, number];
// Transparent margin for particles; changing this does not scale the deer.
export const SPIRIT_BOUNDS = { x: -112, y: -194, width: 236, height: 258 };
type Ellipsoid = { center: Point3; radii: Point3; angle: number };
type Branch = { a: Point3; b: Point3; start: number; end: number; depth?:number };
const ellipsoids: Ellipsoid[] = [
  { center: [-7,-58,0], radii: [24,12,8.5], angle: -.025 },
  { center: [-27,-58,0], radii: [11.5,10.2,6.7], angle: -.12 },
  { center: [16,-61,0], radii: [11,14,8.4], angle: .12 },
  { center: [-38.5,-57.5,0], radii: [3.5,1.5,1.4], angle: -.65 },
  { center: [19,-68,0], radii: [7.2,11,5.6], angle: .25 },
  { center: [34.2,-94.5,0], radii: [7.1,5,3.9], angle: .14 },
  { center: [43,-92.6,1], radii: [7.2,2.7,2.7], angle: .07 },
  { center: [23,-105,4], radii: [2.7,8.5,1.4], angle: -.62 },
  { center: [42,-105,-4], radii: [2.5,8,1.3], angle: .6 },
  // Shoulder planes remain shallow; the hindquarter is authored as a taper
  // below, instead of overlapping round posterior/thigh muscle balls.
  ...[-5,5].flatMap((z):Ellipsoid[]=>[
    {center:[19.5,-62,z],radii:[5.7,9,5.1],angle:.30},
    {center:[16,-68,z*.8],radii:[6.5,9.5,4.7],angle:.18},
  ]),
  ...DEER_LEGS.map((leg):Ellipsoid=>({center:[...leg.sole],radii:[2.6,1.5,1.8],angle:0})),
];
const branches: Branch[] = DEER_LEGS.flatMap((leg,index) => {
  const joints=[leg.hip,leg.knee,leg.ankle,leg.sole],radii=DEER_LEG_RADII[index];
  return joints.slice(0,3).map((joint,segment) => ({
    a:[...joint] as Point3,b:[...joints[segment+1]] as Point3,start:radii[segment],end:radii[segment+1],
  }));
});
branches.push({ a: [-34,-62,0], b: [-41,-56,0], start: 1.6, end: .55 });
// One long, flattened sweep from pelvis into each stifle. The generous blend
// belongs to the flank join, not to a round mass at the rear of the pelvis.
for(const side of [-1,1])branches.push({a:[-28,-57,side*3.4],b:[-22,-42,side*4.7],start:6.1,end:3.05,depth:.68});
// A curved, tapering neckline reaches into the poll/jaw instead of ending
// one straight ellipsoid at the side of a separate skull.
branches.push({a:[17,-61,0],b:[21,-73,0],start:7.2,end:5.5,depth:.76});
branches.push({a:[21,-73,0],b:[26,-85,0],start:5.5,end:4.3,depth:.76});
branches.push({a:[26,-85,0],b:[31,-93,0],start:4.3,end:3.7,depth:.8});
branches.push({a:[30,-98.5,2],b:[27,-101,4],start:2,end:1.5});
branches.push({a:[37,-98.5,-2],b:[40,-101,-4],start:2,end:1.5});
// Inverse radii, rotations and branch axes are invariant throughout surface/volume sampling.
const preparedEllipsoids=ellipsoids.map(({center,radii,angle})=>({
  center,c:Math.cos(angle),s:Math.sin(angle),ix:1/radii[0],iy:1/radii[1],iz:1/radii[2],
}));
const originalRefinedEllipsoids=ellipsoids.map((shape,i)=>{
 const adjusted=i===0?{...shape,radii:[24,11.2,8.1] as Point3}:i===1?{...shape,radii:[10.8,9.0,6.1] as Point3}:i===3?{center:[-44.4,-59,0] as Point3,radii:[4.6,1.6,1.1] as Point3,angle:-.4}:shape;
 const {center,radii,angle}=adjusted;return {center,c:Math.cos(angle),s:Math.sin(angle),ix:1/radii[0],iy:1/radii[1],iz:1/radii[2]};
});
const preparedBranches=branches.map(shape=>{
  const [ax,ay,az]=shape.a,[bx,by,bz]=shape.b;
  const depth=shape.depth??1,dx=bx-ax,dy=by-ay,dz=(bz-az)/depth;
  return {ax,ay,az,dx,dy,dz,depth,inverseLength:1/(dx*dx+dy*dy+dz*dz),start:shape.start,change:shape.end-shape.start};
});
const bodyEllipsoids=preparedEllipsoids.slice(0,-DEER_LEGS.length),bodyBranches=preparedBranches.slice(DEER_LEGS.length*3);
const originalRefinedBranches=[...preparedBranches.filter((_,i)=>i!==DEER_LEGS.length*3),
 ...[{a:[-35.5,-62,0],b:[-43,-60.3,0],start:1.8,end:1.55},{a:[-43,-60.3,0],b:[-48.5,-56.5,0],start:1.55,end:.3}].map(shape=>{
  const [ax,ay,az]=shape.a,[bx,by,bz]=shape.b,dx=bx-ax,dy=by-ay,dz=bz-az;
  return {ax,ay,az,dx,dy,dz,depth:1,inverseLength:1/(dx*dx+dy*dy+dz*dz),start:shape.start,change:shape.end-shape.start};
 })];
const pairedEllipsoids=preparedEllipsoids.filter((_,i)=>i!==7&&i!==8),pairedRefinedEllipsoids=originalRefinedEllipsoids.filter((_,i)=>i!==7&&i!==8);
const oldEarBranches=new Set(preparedBranches.slice(-2)),pairedBranches=preparedBranches.filter(b=>!oldEarBranches.has(b)),pairedRefinedBranches=originalRefinedBranches.filter(b=>!oldEarBranches.has(b));

function smoothMin(a: number, b: number, width: number) {
  const h = Math.max(width - Math.abs(a-b), 0) / width;
  return Math.min(a,b) - h*h*width*.25;
}
function smoothStep(low:number,high:number,value:number){
  const t=Math.max(0,Math.min(1,(value-low)/(high-low)));return t*t*(3-2*t);
}

/** Signed distance in world units; negative values describe the interior volume. */
function shapeDistance(x: number, y: number, z: number, bodyOnly=false,refined=false,paired=false) {
  let result = 1000;
  for (const shape of paired?(refined?pairedRefinedEllipsoids:pairedEllipsoids):refined?originalRefinedEllipsoids:bodyOnly?bodyEllipsoids:preparedEllipsoids) {
    const dx=x-shape.center[0], dy=y-shape.center[1], dz=z-shape.center[2];
    const qx=(shape.c*dx+shape.s*dy)*shape.ix, qy=(-shape.s*dx+shape.c*dy)*shape.iy,qz=dz*shape.iz;
    const k0=Math.sqrt(qx*qx+qy*qy+qz*qz);
    const nx=qx*shape.ix,ny=qy*shape.iy,nz=qz*shape.iz;
    const k1=Math.sqrt(nx*nx+ny*ny+nz*nz);
    result=smoothMin(result,k0*(k0-1)/Math.max(k1,.001),1.7);
  }
  for (const shape of paired?(refined?pairedRefinedBranches:pairedBranches):refined?originalRefinedBranches:bodyOnly?bodyBranches:preparedBranches) {
    const qx=x-shape.ax,qy=y-shape.ay,qz=(z-shape.az)/shape.depth;
    const t=Math.max(0,Math.min(1,(qx*shape.dx+qy*shape.dy+qz*shape.dz)*shape.inverseLength));
    const dx=qx-t*shape.dx,dy=qy-t*shape.dy,dz=qz-t*shape.dz;
    const d=(Math.sqrt(dx*dx+dy*dy+dz*dz)-(shape.start+shape.change*t))*Math.min(1,shape.depth);
    result=smoothMin(result,d,shape.depth<1?2.2:1.2);
  }
  return paired?smoothMin(result,pairedEarDistance(x,y,z),1.2):result;
}
export function deerDistance(x:number,y:number,z:number,refined=false,paired=false){return shapeDistance(x,y,z,false,refined,paired);}
/** Sample the intact trunk independently; subtracting fused rest legs would
 * also remove the shoulder/haunch material in their intersection. */
export function deerBodyDistance(x:number,y:number,z:number){return shapeDistance(x,y,z,true);}

export function deerNormal(p: Point3): Point3 {
  const [x,y,z]=p, e=.12;
  const nx=deerDistance(x+e,y,z)-deerDistance(x-e,y,z);
  const ny=deerDistance(x,y+e,z)-deerDistance(x,y-e,z);
  const nz=deerDistance(x,y,z+e)-deerDistance(x,y,z-e);
  const length=Math.hypot(nx,ny,nz)||1;
  return [nx/length,ny/length,nz/length];
}

function randomSource() {
  let seed=739142;
  return () => { seed=(Math.imul(seed,1664525)+1013904223)>>>0; return seed/4294967296; };
}

export function createDeerSurface() {
  const random=randomSource();
  const seeds: Point3[]=[];
  // Rejection sampling keeps points on the union surface, not on intersecting primitives.
  for (let attempt=0; seeds.length<4200 && attempt<260000; attempt++) {
    const p: Point3=[-48+random()*111,-115+random()*117,-12+random()*24];
    const distance=deerDistance(...p);
    if (Math.abs(distance)>.38) continue;
    const n=deerNormal(p);
    seeds.push([p[0]-n[0]*distance,p[1]-n[1]*distance,p[2]-n[2]*distance]);
  }
  const positions: number[]=[], normals:number[]=[],strengths: number[]=[], phases: number[]=[], travel: number[]=[];
  const dots: number[]=[], dotSeeds: number[]=[];
  seeds.forEach((p,i)=>{dots.push(...p);dotSeeds.push(random());
    if (i%6!==0) return;
    let current: Point3=[...p];
    const phase=random()*Math.PI*2;
    const weight=.18+random()*.82;
    // Shorter facial strands do not all collect on the forward-facing nose cap.
    const steps=p[0]>30&&p[1]>-100&&p[1]<-84?22:34;
    for(let j=0;j<steps;j++) {
      const n=deerNormal(current);
      const [x,y,z]=current;
      const neck=smoothStep(4,18,x)*(1-smoothStep(-63,-52,y));
      const head=1-smoothStep(-97,-85,y);
      const leg=smoothStep(-50,-40,y);
      let direction: Point3=[1-.66*neck,-.06-.94*neck,.08];
      direction=[direction[0]+(1-direction[0])*head,direction[1]+(.18-direction[1])*head,.08];
      direction=[direction[0]+(.12-direction[0])*leg,direction[1]+(1-direction[1])*leg,.08];
      // Guide fibers down the shoulder into the foreleg instead of winding around a chest bulb.
      const shoulder=Math.exp(-(((x-19)/10)**2+((y+55)/11)**2));
      direction=[direction[0]+(.12-direction[0])*shoulder*.9,direction[1]+(1-direction[1])*shoulder*.9,.08];
      // Twist around the local anatomical direction, then project onto the true 3D surface.
      const swirl=(.5+.25*Math.sin(x*.08+y*.1+phase))*(1-.85*shoulder);
      const cross: Point3=[n[1]*direction[2]-n[2]*direction[1],n[2]*direction[0]-n[0]*direction[2],n[0]*direction[1]-n[1]*direction[0]];
      direction=[direction[0]+cross[0]*swirl,direction[1]+cross[1]*swirl,direction[2]+cross[2]*swirl];
      const dot=n[0]*direction[0]+n[1]*direction[1]+n[2]*direction[2];
      direction=[direction[0]-n[0]*dot,direction[1]-n[1]*dot,direction[2]-n[2]*dot];
      const length=Math.hypot(...direction)||1;
      let next: Point3=[x+direction[0]/length*.62,y+direction[1]/length*.62,z+direction[2]/length*.62];
      for(let pass=0;pass<2;pass++) {
        const distance=deerDistance(...next), normal=deerNormal(next);
        next=[next[0]-normal[0]*distance,next[1]-normal[1]*distance,next[2]-normal[2]*distance];
      }
      positions.push(...current,...next);
      const muzzle=smoothStep(39,50,x)*smoothStep(-100,-96,y)*(1-smoothStep(-86,-82,y));
      const strength=weight*(1-.7*muzzle);
      normals.push(...n,...n);strengths.push(strength,strength);
      phases.push(phase,phase); travel.push(j/steps,(j+1)/steps);
      current=next;
    }
  });
  return { positions,normals,strengths,phases,travel,dots,dotSeeds };
}
