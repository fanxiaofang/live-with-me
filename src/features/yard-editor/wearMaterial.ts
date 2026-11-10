import type { WearPoint, WearStroke } from './yardWear';
import { WEAR_GROUND_Y } from './yardWear';

export const wearClamp=(n:number)=>Math.max(0,Math.min(1,n));
export const wearHash=(x:number,y:number)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
const smooth=(n:number)=>{n=wearClamp(n);return n*n*(3-2*n);};
function noise(x:number,y:number,scale:number) {
  x/=scale;y/=scale;
  const a=Math.floor(x),b=Math.floor(y),u=smooth(x-a),v=smooth(y-b);
  return (wearHash(a,b)*(1-u)+wearHash(a+1,b)*u)*(1-v)+(wearHash(a,b+1)*(1-u)+wearHash(a+1,b+1)*u)*v;
}

export const WEAR_DAY_PALETTE={grass:'#899e48',warm:'#adad5d',deep:'#718c43',soil:'#aa9367',light:'#c0a97a',shade:'#82734f',blade:'#738d42'};
export function wearNightColor(hex:string) {
  const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)),warmth=wearClamp((rgb[0]-rgb[1])/30);
  return '#'+rgb.map((v,i)=>Math.round(v*[.36,.4,.4][i]+[10,17,33][i]+warmth*[18,0,-16][i]).toString(16).padStart(2,'0')).join('');
}
export function wearPalette(theme:{isNight:boolean;isRainy?:boolean;timeOfDay?:string}) {
  const light=theme.isNight?1:theme.timeOfDay==='dusk'?.4:theme.isRainy?.22:0;
  if(!light)return WEAR_DAY_PALETTE;
  return Object.fromEntries(Object.entries(WEAR_DAY_PALETTE).map(([key,color])=>{
    const night=wearNightColor(color);
    return [key,'#'+[1,3,5].map(i=>Math.round(parseInt(color.slice(i,i+2),16)*(1-light)+parseInt(night.slice(i,i+2),16)*light).toString(16).padStart(2,'0')).join('')];
  })) as typeof WEAR_DAY_PALETTE;
}

/** Review candidate only: preserve the soil's brown hue while limiting its
 * luminance separation from the environment grass. No alpha or geometry edits. */
export function wearCalmPalette(theme:{isNight:boolean;isRainy?:boolean;timeOfDay?:string;landscapeEnvironment?:{grassMid:string};hillGreenMid?:string}) {
  const p=wearPalette(theme);
  if(!theme.isNight&&theme.timeOfDay!=='dusk')return p;
  const rgb=(hex:string)=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16));
  const luminance=(v:number[])=>v[0]*.2126+v[1]*.7152+v[2]*.0722;
  const soil=rgb(p.soil),soilLight=luminance(soil);
  const grassLight=luminance(rgb(theme.landscapeEnvironment?.grassMid??theme.hillGreenMid??p.grass));
  const contrast=theme.isNight?5:8;
  const target=grassLight+Math.max(-contrast,Math.min(contrast,soilLight-grassLight));
  const scale=soilLight?target/soilLight:1;
  const adjust=(hex:string)=>'#'+rgb(hex).map(v=>Math.max(0,Math.min(255,Math.round(v*scale)) ).toString(16).padStart(2,'0')).join('');
  return {...p,soil:adjust(p.soil),light:adjust(p.light),shade:adjust(p.shade)};
}
export function isWearDab(stroke:WearStroke) {
  const a=stroke.points[0];
  return stroke.points.every(p=>Math.hypot(p.x-a.x,(p.y-a.y)/.285)<=stroke.size*.6);
}
// Boundary character is independent of input jitter: a small, slow variation
// rather than broad noise thresholds repeatedly cutting into the whole road.
export const wearThreshold=(x:number,y:number,strength=.98)=>Math.min(.52,strength*.72)+.07*(noise(x,y/WEAR_GROUND_Y,160)-.5);
export function wearDensity(distance:number,size:number,strength:number) {
  const radius=size/2;
  return Math.max(strength*smooth((1-distance/radius)/.78),strength===.62&&distance<radius*8/46?.86:0);
}

function simplify(points:WearPoint[],epsilon:number):WearPoint[] {
  if(points.length<3)return points;
  const a=points[0],b=points.at(-1)!,dx=b.x-a.x,dy=b.y-a.y,den=dx*dx+dy*dy;
  let best=epsilon,index=-1;
  for(let i=1;i<points.length-1;i++){
    const p=points[i],t=den?wearClamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/den):0;
    const d=Math.hypot(p.x-a.x-t*dx,p.y-a.y-t*dy);
    if(d>best){best=d;index=i;}
  }
  return index<0?[a,b]:[...simplify(points.slice(0,index+1),epsilon).slice(0,-1),...simplify(points.slice(index),epsilon)];
}

/** Smooth vector contours from an arbitrary set of grid cells, including holes. */
export function traceWearCells(cells:Set<number>,step:number,stride:number,xOffset:number,yScale=1,onContour?:(shape:WearPoint[])=>void) {
  const edges=new Map<string,string[]>();
  const add=(x:number,y:number,a:number,b:number)=>{const k=`${x},${y}`;edges.set(k,[...(edges.get(k)||[]),`${a},${b}`]);};
  for(const key of cells){
    const x=key%stride-xOffset,y=Math.floor(key/stride);
    if(!cells.has(key-stride))add(x,y,x+1,y);
    if(!cells.has(key+1))add(x+1,y,x+1,y+1);
    if(!cells.has(key+stride))add(x+1,y+1,x,y+1);
    if(!cells.has(key-1))add(x,y+1,x,y);
  }
  const paths:string[]=[];
  while(edges.size){
    const start=edges.keys().next().value!;let key=start;
    const points:WearPoint[]=[];
    do{
      const [x,y]=key.split(',').map(Number);points.push({x:x*step,y:y*step});
      const next=edges.get(key);if(!next?.length)break;
      const to=next.pop()!;if(!next.length)edges.delete(key);key=to;
    }while(key!==start&&points.length<200000);
    if(points.length<7)continue;
    // Equal-length grid edges make this a ground-space smoothing window.
    // Remove cell-scale stairs before simplifying, without widening the SVG blur.
    let rounded=points;
    for(let pass=0;pass<2;pass++)rounded=rounded.map((p,i)=>{
      const a=rounded[(i+rounded.length-2)%rounded.length],b=rounded[(i+2)%rounded.length];
      return {x:p.x*.5+(a.x+b.x)*.25,y:p.y*.5+(a.y+b.y)*.25};
    });
    const coarse=simplify([...rounded,rounded[0]],1.8).slice(0,-1);
    if(coarse.length<3)continue;
    // Bound the quadratic corner's reach: a long straight side must not pull
    // the cap's rounding halfway down the road.
    const shape=coarse.flatMap((a,i)=>{
      const b=coarse[(i+1)%coarse.length],count=Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)/12);
      return Array.from({length:count},(_,j)=>({x:a.x+(b.x-a.x)*j/count,y:a.y+(b.y-a.y)*j/count}));
    });
    onContour?.(shape);
    const a=shape[0],b=shape.at(-1)!;
    let d=`M${(a.x+b.x)/2},${(a.y+b.y)/2*yScale}`;
    shape.forEach((p,i)=>{const q=shape[(i+1)%shape.length];d+=`Q${p.x},${p.y*yScale} ${(p.x+q.x)/2},${(p.y+q.y)/2*yScale}`;});
    paths.push(d+'Z');
  }
  return paths.join('');
}

export type WearMaterialGeometry={outline:string;coverage:{d:string;alpha:number}[];contacts:{d:string;dx:number;dy:number}[];facets:{d:string;light:boolean}[];lips:string;tufts:(WearPoint&{side:number})[];bounds:{x:number;y:number;width:number;height:number};operations:number};

function touchesPaint(point:WearPoint,stroke:WearStroke,strokes:WearStroke[]) {
  return strokes.some(other=>{
    if(other===stroke||other.strength==='erase'||isWearDab(other))return false;
    return other.points.some((b,i)=>{
      const a=other.points[Math.max(0,i-1)],dx=b.x-a.x,dy=(b.y-a.y)/WEAR_GROUND_Y;
      const px=point.x-a.x,py=(point.y-a.y)/WEAR_GROUND_Y,t=wearClamp((px*dx+py*dy)/(dx*dx+dy*dy||1));
      return Math.hypot(px-t*dx,py-t*dy)<Math.min(stroke.size,other.size)*.3;
    });
  });
}

/** Replay the existing event log into one material coverage map. MAX blending
 * prevents crossings darkening; erase affects only earlier paint. No new save data. */
export function buildWearMaterial(strokes:WearStroke[], includeCoverage=false):WearMaterialGeometry {
  // Square cells in the unprojected ground plane; project only the final art.
  const step=3,stride=2048,offset=512,field=new Map<number,{weight:number;strength:number}>(),coverageField=new Map<number,number>();
  let operations=0;
  for(const stroke of strokes){
    const erase=stroke.strength==='erase';
    if(!erase&&isWearDab(stroke))continue;
    if(!erase)operations++;
    const radius=stroke.size/2,strength=stroke.strength==='light'?.46:stroke.strength==='medium'?.62:.98;
    const arc=[0];
    for(let i=1;i<stroke.points.length;i++)arc.push(arc[i-1]+Math.hypot(stroke.points[i].x-stroke.points[i-1].x,(stroke.points[i].y-stroke.points[i-1].y)/WEAR_GROUND_Y));
    const total=arc.at(-1)!,taperSpan=Math.min(total*.25,Math.max(32,radius*1.8));
    const start=stroke.points[0],end=stroke.points.at(-1)!;
    const closed=Math.hypot(start.x-end.x,(start.y-end.y)/WEAR_GROUND_Y)<radius*.5;
    const taperStart=!closed&&!touchesPaint(start,stroke,strokes),taperEnd=!closed&&!touchesPaint(end,stroke,strokes);
    for(let n=0;n<stroke.points.length;n++){
      const pa=stroke.points[Math.max(0,n-1)],pb=stroke.points[n];
      const a={x:pa.x,y:pa.y/WEAR_GROUND_Y},b={x:pb.x,y:pb.y/WEAR_GROUND_Y};
      const dx=b.x-a.x,dy=b.y-a.y,den=dx*dx+dy*dy;
      const left=Math.floor((Math.min(a.x,b.x)-radius)/step),right=Math.ceil((Math.max(a.x,b.x)+radius)/step);
      const top=Math.max(0,Math.floor((Math.min(a.y,b.y)-radius)/step)),bottom=Math.ceil((Math.max(a.y,b.y)+radius)/step);
      for(let j=top;j<=bottom;j++)for(let i=left;i<=right;i++){
        const x=(i+.5)*step,y=(j+.5)*step,px=x-a.x,py=y-a.y;
        const t=den?wearClamp((px*dx+py*dy)/den):0,d=Math.hypot(px-t*dx,py-t*dy);
        if(d>radius)continue;
        const key=j*stride+i+offset;
        if(erase){field.delete(key);coverageField.delete(key);}
        else {
          const along=arc[Math.max(0,n-1)]+t*(arc[n]-arc[Math.max(0,n-1)]);
          // A light easing into the round cap, without a narrow neck or shoulders.
          const endDistance=Math.min(taperStart?along:Infinity,taperEnd?total-along:Infinity);
          const radiusScale=.92+.08*smooth(endDistance/(taperSpan||1));
          const localSize=stroke.size*radiusScale,localRadius=radius*radiusScale;
          if(d>localRadius)continue;
          const weight=wearDensity(d,localSize,strength);if(weight>(field.get(key)?.weight||0))field.set(key,{weight,strength});
          if(includeCoverage){
            // A continuous centre with a thin shoulder. Edge displacement is
            // capped in ground units, so a large brush cannot magnify notches.
            const shoulder=smooth((d/localRadius-.25)/.5);
            const displacement=(noise(x,y,110)-.5)*4*shoulder;
            // The road gains a wider stable centre as the brush grows. Its
            // shoulder remains a small ground distance rather than a wide wash.
            const shoulderWidth=Math.min(localRadius*.32,stroke.strength==='light'?14:stroke.strength==='medium'?12:9);
            const falloff=smooth((localRadius*.72-d-displacement)/shoulderWidth);
            const peak=stroke.strength==='light'?.5:stroke.strength==='medium'?.78:.98;
            const alpha=peak*falloff;
            if(alpha>(coverageField.get(key)||0))coverageField.set(key,alpha);
          }
        }
      }
    }
  }
  const cells=new Set<number>();
  for(const [key,{weight,strength}] of field){const x=(key%stride-offset+.5)*step,y=(Math.floor(key/stride)+.5)*step*WEAR_GROUND_Y;if(weight>wearThreshold(x,y,strength))cells.add(key);}
  const orderedCells=new Set([...cells].sort((a,b)=>a-b));
  const detailCells=includeCoverage?new Set([...coverageField].filter(([,alpha])=>alpha>=1/3).map(([key])=>key)):cells;
  const facets:WearMaterialGeometry['facets']=[],sites:WearMaterialGeometry['tufts']=[],tufts:WearMaterialGeometry['tufts']=[];
  let lips='',minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
  for(const key of [...detailCells].sort((a,b)=>a-b)){
    const i=key%stride-offset,j=Math.floor(key/stride),x=i*step,y=j*step*WEAR_GROUND_Y,r=wearHash(i+10,j-31);
    minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x+step);maxY=Math.max(maxY,y+step*WEAR_GROUND_Y);
    // Sparse, low relief compacted-earth marks. A few readable facets rather
    // than adding fine grain everywhere to recover contrast at night.
    if(r>.997)facets.push({d:`M${x-5},${y} q4,-1.2 8,-.5 l4,.8 -6,.8 -5,-.3Z`,light:r>.9985});
    if(!detailCells.has(key-stride)&&r>.8)lips+=`M${x},${y+.6} l${2+r*2},-.4 `;
    if(r>.87){
      for(const [delta,nx,ny] of [[-stride,0,-1],[stride,0,1],[-1,-1,0],[1,1,0]]) {
        if(!detailCells.has(key+delta))sites.push({x:x+step/2+nx*step*.6,y:y+step*WEAR_GROUND_Y/2+ny*step*WEAR_GROUND_Y*.6,side:ny<0?-1:1});
      }
    }
  }
  // A small spatial lookup keeps the two shoulder populations sparse and staggered.
  const selected=new Map<string,WearPoint[]>();
  sites.sort((a,b)=>wearHash(a.x+17,a.y)-wearHash(b.x+17,b.y));
  for(const site of sites){
    const gx=Math.floor(site.x/75),gy=Math.floor(site.y/WEAR_GROUND_Y/75);let close=false;
    for(let y=gy-1;y<=gy+1;y++)for(let x=gx-1;x<=gx+1;x++)if(selected.get(`${x},${y}`)?.some(p=>Math.hypot(p.x-site.x,(p.y-site.y)/WEAR_GROUND_Y)<75))close=true;
    if(close)continue;
    tufts.push(site);const key=`${gx},${gy}`;selected.set(key,[...(selected.get(key)||[]),site]);
  }
  const coverage:WearMaterialGeometry['coverage']=[];
  const contacts:WearMaterialGeometry['contacts']=[];
  const collectContacts=(shape:WearPoint[])=>{
    // Anchor existing sparse grass on this final contour, slightly overlapping
    // the earth. The winding keeps material to the right, including hole edges.
    for(const tuft of tufts){
      let nearest=Infinity,anchor:WearPoint|undefined;
      for(let i=0;i<shape.length;i++){
        const a=shape[i],b=shape[(i+1)%shape.length],dx=b.x-a.x,dy=b.y-a.y,den=dx*dx+dy*dy;
        const t=wearClamp(((tuft.x-a.x)*dx+(tuft.y/WEAR_GROUND_Y-a.y)*dy)/(den||1));
        const x=a.x+t*dx,y=a.y+t*dy,d=Math.hypot(tuft.x-x,tuft.y/WEAR_GROUND_Y-y);
        if(d<nearest){nearest=d;const length=Math.sqrt(den)||1;anchor={x:x-dy/length*1.5,y:(y+dx/length*1.5)*WEAR_GROUND_Y};}
      }
      if(anchor&&nearest<9){tuft.x=anchor.x;tuft.y=anchor.y;}
    }
    for(let i=0;i<shape.length;i++){
      const a=shape[(i+shape.length-1)%shape.length],p=shape[i],b=shape[(i+1)%shape.length];
      // Long patches of contact, interrupted by intact turf. Reuse the exact
      // contour quadratics so these slivers cannot detach from the soil edge.
      if(noise(p.x,p.y,95)<.53&&!tufts.some(t=>Math.hypot(t.x-p.x,t.y/WEAR_GROUND_Y-p.y)<12))continue;
      const ax=(a.x+p.x)/2,ay=(a.y+p.y)/2,bx=(p.x+b.x)/2,by=(p.y+b.y)/2;
      if(Math.hypot(bx-ax,by-ay)<3)continue;
      const dx=bx-ax,dy=(by-ay)*WEAR_GROUND_Y,length=Math.hypot(dx,dy)||1;
      contacts.push({d:`M${ax},${ay*WEAR_GROUND_Y}Q${p.x},${p.y*WEAR_GROUND_Y} ${bx},${by*WEAR_GROUND_Y}`,dx:-dy/length*.65,dy:dx/length*.65});
    }
  };
  if(includeCoverage){
    // Nested contours replace one binary edge with scalar coverage. SVG paints
    // ascending grey values in a mask; crossings use MAX rather than stacking.
    for(let level=1;level<=18;level++){
      const alpha=level/18,cellsAtLevel=new Set<number>();
      for(const [key,value] of coverageField)if(value>=alpha)cellsAtLevel.add(key);
      if(cellsAtLevel.size)coverage.push({d:traceWearCells(cellsAtLevel,step,stride,offset,WEAR_GROUND_Y,level===6?collectContacts:undefined),alpha});
    }
    for(const key of coverageField.keys()){
      const x=(key%stride-offset)*step,y=Math.floor(key/stride)*step*WEAR_GROUND_Y;
      minX=Math.min(minX,x);minY=Math.min(minY,y);maxX=Math.max(maxX,x+step);maxY=Math.max(maxY,y+step*WEAR_GROUND_Y);
    }
  }
  return {outline:traceWearCells(orderedCells,step,stride,offset,WEAR_GROUND_Y,includeCoverage?undefined:collectContacts),coverage,contacts,facets,lips,tufts,operations,
    bounds:cells.size?{x:minX-8,y:minY-8,width:maxX-minX+16,height:maxY-minY+16}:{x:0,y:0,width:1,height:1}};
}
