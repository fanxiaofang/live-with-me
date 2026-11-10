import assert from 'node:assert/strict';
import { test } from 'node:test';
import { fitWearStroke } from '../../src/features/yard-editor/wearCurve';
import { buildWearMaterial } from '../../src/features/yard-editor/wearMaterial';
import { WEAR_GROUND_Y, type WearPoint, type WearStroke } from '../../src/features/yard-editor/yardWear';

const stroke=(points:WearPoint[]):WearStroke=>({size:64,strength:'trail',points});
const totalTurn=(points:WearPoint[])=>points.slice(1,-1).reduce((sum,p,i)=>{
  const a=points[i],b=points[i+2],ax=p.x-a.x,ay=(p.y-a.y)/WEAR_GROUND_Y,bx=b.x-p.x,by=(b.y-p.y)/WEAR_GROUND_Y;
  return sum+Math.abs(Math.atan2(ax*by-ay*bx,ax*bx+ay*by));
},0);

test('subpixel alternating hand jitter is removed rather than protected as corners in every ground direction',()=>{
  for(const angle of [0,Math.PI/4,Math.PI/2]){
    const points=Array.from({length:81},(_,i)=>{
      const x=i*3,y=(i%2?2:-2);return {x:400+x*Math.cos(angle)-y*Math.sin(angle),y:400+(x*Math.sin(angle)+y*Math.cos(angle))*WEAR_GROUND_Y};
    });
    const raw=stroke(points),saved=JSON.stringify(raw),fit=fitWearStroke(raw);
    assert.ok(totalTurn(fit.stroke.points)<totalTurn(points)*.15);
    assert.deepEqual(fit.stroke.points[0],points[0]);assert.deepEqual(fit.stroke.points.at(-1),points.at(-1));
    assert.ok(fit.maxError<6);assert.equal(JSON.stringify(raw),saved);
  }
});

test('a sustained right turn and reversal retain their intended turning point',()=>{
  const a=Array.from({length:31},(_,i)=>({x:400+i*4,y:400}));
  for(const tail of [Array.from({length:30},(_,i)=>({x:520,y:400+(i+1)*4*WEAR_GROUND_Y})),Array.from({length:30},(_,i)=>({x:520-(i+1)*4,y:400}))]){
    const fit=fitWearStroke(stroke([...a,...tail]));
    assert.ok(fit.stroke.points.some(p=>Math.hypot(p.x-520,(p.y-400)/WEAR_GROUND_Y)<.01));
  }
});

test('eraser and single click are untouched; fitted material unions and erases normally',()=>{
  const dab=stroke([{x:400,y:400}]),erase={...dab,strength:'erase' as const};
  assert.equal(fitWearStroke(dab).stroke,dab);assert.equal(fitWearStroke(erase).stroke,erase);
  const fit=fitWearStroke(stroke(Array.from({length:80},(_,i)=>({x:400+i*3,y:400+(i%2?2:-2)*WEAR_GROUND_Y})))).stroke;
  const material=buildWearMaterial([fit],true);
  assert.ok(material.outline&&material.contacts.length&&material.facets.length);
  assert.deepEqual(buildWearMaterial([fit,fit],true).coverage,material.coverage);
  assert.equal(buildWearMaterial([fit,{...fit,size:90,strength:'erase'}],true).coverage.length,0);
});

function outlinePolygon(path:string) {
  const points:WearPoint[]=[];
  let current={x:0,y:0};
  for(const match of path.matchAll(/([MQ])([^MQZ]+)/g)){
    const v=match[2].match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/gi)!.map(Number);
    if(match[1]==='M'){current={x:v[0],y:v[1]};points.push(current);continue;}
    const a=current,c={x:v[0],y:v[1]},b={x:v[2],y:v[3]};
    for(let i=1;i<=8;i++){const t=i/8,u=1-t;points.push({x:u*u*a.x+2*u*t*c.x+t*t*b.x,y:u*u*a.y+2*u*t*c.y+t*t*b.y});}
    current=b;
  }
  return points;
}
function widthAt(points:WearPoint[],y:number) {
  const crossings:number[]=[];
  for(let i=0;i<points.length;i++){
    const a=points[i],b=points[(i+1)%points.length];
    if((a.y<=y&&b.y>y)||(b.y<=y&&a.y>y))crossings.push(a.x+(b.x-a.x)*(y-a.y)/(b.y-a.y));
  }
  return Math.max(...crossings)-Math.min(...crossings);
}

test('straight-down soil keeps a stable body width with mild rounded endpoints',()=>{
  for(const size of [64,140]){
    const s={...stroke([{x:500,y:335},{x:500,y:470}]),size};
    const saved=JSON.stringify(s),polygon=outlinePolygon(buildWearMaterial([s]).outline);
    const widths=Array.from({length:16},(_,i)=>widthAt(polygon,380+i*2));
    assert.ok(widths.every(Number.isFinite));
    assert.ok(Math.max(...widths)-Math.min(...widths)<8);
    const middle=widthAt(polygon,400);
    // Cap roots retain most of the body width; no pronounced narrow shoulder.
    for(const y of [335,470]){
      assert.ok(widthAt(polygon,y)>middle*.78,`${size}: ${y} width=${widthAt(polygon,y)}, middle=${middle}`);
      assert.ok(widthAt(polygon,y)<=middle*1.05);
    }
    assert.equal(JSON.stringify(s),saved);
  }
});

test('two touching strokes keep their full width at the join instead of tapering twice',()=>{
  const a=stroke([{x:500,y:335},{x:500,y:400}]),b=stroke([{x:500,y:400},{x:500,y:470}]);
  const polygon=outlinePolygon(buildWearMaterial([a,b]).outline);
  assert.ok(widthAt(polygon,400)>widthAt(polygon,380)*.85);
});
