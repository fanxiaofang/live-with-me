import { WEAR_GROUND_Y, type WearPoint, type WearStroke } from './yardWear';

const distance=(p:WearPoint,a:WearPoint,b:WearPoint)=>{
  const dx=b.x-a.x,dy=b.y-a.y,den=dx*dx+dy*dy;
  const t=den?Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/den)):0;
  return Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);
};
function simplify(points:WearPoint[],limit:number):WearPoint[] {
  if(points.length<3)return points;
  let best=limit,index=-1;
  for(let i=1;i<points.length-1;i++){
    const d=distance(points[i],points[0],points.at(-1)!);
    if(d>best){best=d;index=i;}
  }
  return index<0?[points[0],points.at(-1)!]:[
    ...simplify(points.slice(0,index+1),limit).slice(0,-1),...simplify(points.slice(index),limit),
  ];
}
export const wearPolyline=(points:WearPoint[])=>points.map((p,i)=>`${i?'L':'M'}${p.x},${p.y}`).join(' ');

function lengths(points:WearPoint[]) {
  const result=[0];
  for(let i=1;i<points.length;i++)result.push(result[i-1]+Math.hypot(points[i].x-points[i-1].x,points[i].y-points[i-1].y));
  return result;
}
function along(points:WearPoint[],arc:number[],s:number):WearPoint {
  let lo=0,hi=arc.length-1;
  while(lo+1<hi){const mid=(lo+hi)>>1;if(arc[mid]<s)lo=mid;else hi=mid;}
  const t=Math.max(0,Math.min(1,(s-arc[lo])/(arc[hi]-arc[lo]||1)));
  return {x:points[lo].x+(points[hi].x-points[lo].x)*t,y:points[lo].y+(points[hi].y-points[lo].y)*t};
}

/** Judge a turn over a ground-distance window. Short alternating input motions
 * fail the straight-arm test and must not become protected corner anchors. */
function cornerAnchors(points:WearPoint[],arc:number[],span:number) {
  const candidates:{index:number;score:number}[]=[];
  for(let i=1;i<points.length-1;i++){
    if(arc[i]<span||arc.at(-1)!-arc[i]<span)continue;
    const a=along(points,arc,arc[i]-span),p=points[i],b=along(points,arc,arc[i]+span);
    const ax=p.x-a.x,ay=p.y-a.y,bx=b.x-p.x,by=b.y-p.y;
    const la=Math.hypot(ax,ay),lb=Math.hypot(bx,by),dot=(ax*bx+ay*by)/(la*lb||1);
    if(la/span>.9&&lb/span>.9&&dot<.4)candidates.push({index:i,score:1-dot});
  }
  const selected:number[]=[];
  for(const c of candidates.sort((a,b)=>b.score-a.score))
    if(selected.every(i=>Math.abs(arc[i]-arc[c.index])>span))selected.push(c.index);
  return [0,...selected.sort((a,b)=>a-b),points.length-1];
}

function smoothSection(points:WearPoint[],span:number,limit:number) {
  const arc=lengths(points),total=arc.at(-1)!;
  if(!total)return [points[0]];
  const count=Math.max(1,Math.ceil(total/4)),step=total/count;
  const samples=Array.from({length:count+1},(_,i)=>along(points,arc,i*step));
  const smoothed=samples.map((p,i)=>{
    if(!i||i===count)return p;
    let x=0,y=0,weight=0;
    for(let j=Math.max(0,i-Math.ceil(span/step));j<=Math.min(count,i+Math.ceil(span/step));j++){
      const w=Math.max(0,1-Math.abs(i-j)*step/span);x+=samples[j].x*w;y+=samples[j].y*w;weight+=w;
    }
    const dx=x/weight-p.x,dy=y/weight-p.y,factor=Math.min(1,limit/(Math.hypot(dx,dy)||1));
    return {x:p.x+dx*factor,y:p.y+dy*factor};
  });
  return simplify(smoothed,.8);
}

/** Maximum fitted-point distance to input, using a local segment index. */
function fitError(fitted:WearPoint[],raw:WearPoint[]) {
  const grid=new Map<string,number[]>(),cell=32;
  for(let i=1;i<raw.length;i++){
    const a=raw[i-1],b=raw[i];
    for(let y=Math.floor(Math.min(a.y,b.y)/cell);y<=Math.floor(Math.max(a.y,b.y)/cell);y++)
      for(let x=Math.floor(Math.min(a.x,b.x)/cell);x<=Math.floor(Math.max(a.x,b.x)/cell);x++){
        const key=`${x},${y}`;grid.set(key,[...(grid.get(key)||[]),i]);
      }
  }
  let error=0;
  for(const p of fitted){
    const indices=new Set<number>(),gx=Math.floor(p.x/cell),gy=Math.floor(p.y/cell);
    for(let y=gy-1;y<=gy+1;y++)for(let x=gx-1;x<=gx+1;x++)for(const i of grid.get(`${x},${y}`)||[])indices.add(i);
    let best=Infinity;
    for(const i of indices)best=Math.min(best,distance(p,raw[i-1],raw[i]));
    if(best>cell)for(let i=1;i<raw.length;i++)best=Math.min(best,distance(p,raw[i-1],raw[i]));
    error=Math.max(error,best);
  }
  return error;
}

/** Fit only on release: distance resampling, bounded jitter removal, then cubic
 * sections split at sustained turns. Stored points keep the existing schema. */
export function fitWearStroke(stroke:WearStroke) {
  const raw=stroke.points;
  const limit=Math.min(6,Math.max(3,stroke.size*.065));
  const fallback={stroke,path:wearPolyline(raw),maxError:0};
  if(stroke.strength==='erase'||raw.length<3)return fallback;
  const ground=raw.map(p=>({x:p.x,y:p.y/WEAR_GROUND_Y}));
  const arc=lengths(ground),span=Math.min(24,Math.max(12,stroke.size*.25),arc.at(-1)!*.22);
  if(!span)return fallback;
  const anchors=cornerAnchors(ground,arc,span);
  const fitted:WearPoint[]=[ground[0]];
  const projected=(p:WearPoint)=>`${p.x},${p.y*WEAR_GROUND_Y}`;
  let path=`M${projected(ground[0])}`;
  for(let section=1;section<anchors.length;section++){
    const reduced=smoothSection(ground.slice(anchors[section-1],anchors[section]+1),span,limit);
    for(let i=0;i<reduced.length-1;i++){
      const a=reduced[i],b=reduced[i+1],previous=reduced[Math.max(0,i-1)],next=reduced[Math.min(reduced.length-1,i+2)];
      const cap=Math.hypot(b.x-a.x,b.y-a.y)/3;
      const control=(p:WearPoint,dx:number,dy:number)=>{
        const k=Math.min(1,cap/(Math.hypot(dx,dy)||1));return {x:p.x+dx*k,y:p.y+dy*k};
      };
      const c1=control(a,(b.x-previous.x)/6,(b.y-previous.y)/6),c2=control(b,(a.x-next.x)/6,(a.y-next.y)/6);
      path+=`C${projected(c1)} ${projected(c2)} ${projected(b)}`;
      const steps=Math.max(2,Math.ceil((Math.hypot(b.x-a.x,b.y-a.y)+cap)/3));
      for(let n=1;n<=steps;n++){
        const t=n/steps,u=1-t;
        fitted.push({x:u*u*u*a.x+3*u*u*t*c1.x+3*u*t*t*c2.x+t*t*t*b.x,y:u*u*u*a.y+3*u*u*t*c1.y+3*u*t*t*c2.y+t*t*t*b.y});
      }
    }
  }
  const points=fitted.map(p=>({x:p.x,y:p.y*WEAR_GROUND_Y}));
  points[0]=raw[0];points[points.length-1]=raw.at(-1)!;
  return {stroke:{...stroke,points},path,maxError:fitError(fitted,ground)};
}
