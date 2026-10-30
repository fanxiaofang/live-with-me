import { resolveSceneOptions } from './currentScene';

export type FieldEdgeMode = 'original' | 'rear' | 'front' | 'both';
export const hasRearEdge = (mode: FieldEdgeMode) => mode === 'rear' || mode === 'both';
export const hasFrontEdge = (mode: FieldEdgeMode) => mode === 'front' || mode === 'both';
export function requestedFieldEdges(search = typeof window === 'undefined' ? '' : window.location.search): FieldEdgeMode {
  return resolveSceneOptions(search).fieldEdges;
}
export type EdgePoint = { x: number; y: number };
export const FIELD_EDGE_STUDY = {
  // Signed planar offsets, not terrain elevation. Leave the western bridge margin intact.
  rearOffsets: [
    [-3000,-2350,-9],[-2100,-1650,7],[-1500,-1000,-11],[-850,-400,8],
    [120,610,-13],[590,980,9],[980,1580,-12],
    [1700,2250,8],[2350,2940,-11],[3200,3760,8],[3900,4200,-7],
  ] as readonly (readonly [number,number,number])[],
  rearSampleStep: 24,
  frontMaxY: 202,
  // Original pasture bounding box, so editing the edge cannot recolour the whole lawn.
  pastureGradientY: [178.8453064, 2600.0000916],
  fringeCenters: [-150, 200, 1070, 1470],
  frontPoints: [
    [-4000,186],[-3200,181],[-2500,192],[-1800,183],[-1200,190],[-700,177],
    [-430,186],[-220,175],[-40,173],[65,180],[160,178],[350,184],[510,174],
    [690,187],[910,178],[1110,190],[1200,173],[1310,177],[1520,187],
    [1840,181],[2300,194],[3000,183],[4000,195],[5000,182],[6000,188],
  ].map(([x,y])=>({x,y})) as readonly EdgePoint[],
} as const;

const rounded = (n: number) => Number(n.toFixed(4));
export function smoothEdgePath(points: readonly EdgePoint[]) {
  const curves = points.slice(1).map((b,index)=>{
    const a=points[index],before=points[Math.max(0,index-1)],after=points[Math.min(points.length-1,index+2)];
    const da=(b.y-before.y)/(b.x-before.x),db=(after.y-a.y)/(after.x-a.x),dx=(b.x-a.x)/3;
    return 'C '+[a.x+dx,a.y+da*dx,b.x-dx,b.y-db*dx,b.x,b.y].map(rounded).join(',');
  });
  return 'M '+points[0].x+','+points[0].y+' '+curves.join(' ');
}
export function frontEdgeY(x: number) {
  const p=FIELD_EDGE_STUDY.frontPoints;
  const hi=p.findIndex(point=>point.x>=x);
  if(hi<=0)return p[hi===0?0:p.length-1].y;
  const a=p[hi-1],b=p[hi],before=p[Math.max(0,hi-2)],after=p[Math.min(p.length-1,hi+1)];
  const t=(x-a.x)/(b.x-a.x),t2=t*t,t3=t2*t;
  const da=(b.y-before.y)/(b.x-before.x),db=(after.y-a.y)/(after.x-a.x),dx=b.x-a.x;
  return (2*t3-3*t2+1)*a.y+(t3-2*t2+t)*da*dx+(-2*t3+3*t2)*b.y+(t3-t2)*db*dx;
}
export function rearEdgeOffset(x: number) {
  return FIELD_EDGE_STUDY.rearOffsets.reduce((sum,[start,end,amount])=>{
    if(x<=start||x>=end)return sum;
    return sum+amount*Math.sin(Math.PI*(x-start)/(end-start))**2;
  },0);
}
