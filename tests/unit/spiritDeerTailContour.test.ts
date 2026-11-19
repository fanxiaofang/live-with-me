import assert from 'node:assert/strict';
import {test} from 'node:test';
import {deerModelGeometry} from '../../src/components/scenery/yorkshire/dressing/spiritDeerModel';
import {refineDeerNeckContour} from '../../src/components/scenery/yorkshire/dressing/spiritDeerNeckContour';
import {refineDeerTailContour} from '../../src/components/scenery/yorkshire/dressing/spiritDeerTailContour';

test('尾巴预览保护已通过的颈背、臀部、尾根、长度和原骨骼绑定',()=>{
 const g=deerModelGeometry(true,true,true);refineDeerNeckContour(g);
 const p=g.getAttribute('position'),old=Float32Array.from(p.array),index=g.index!.array.slice(),skinIndex=g.getAttribute('skinIndex').array.slice(),skinWeight=g.getAttribute('skinWeight').array.slice();
 const report=refineDeerTailContour(g);assert.ok(report.changedVertices>50&&report.maxDisplacement<3);
 for(let i=0;i<p.count;i++){
  assert.equal(p.getX(i),old[i*3],'尾巴伸出长度应保持');
  if(old[i*3]>=-39){assert.equal(p.getY(i),old[i*3+1]);assert.equal(p.getZ(i),old[i*3+2]);}
  assert.ok(Number.isFinite(p.getY(i))&&Number.isFinite(p.getZ(i)));
 }
 assert.deepEqual(g.index!.array,index);assert.deepEqual(g.getAttribute('skinIndex').array,skinIndex);assert.deepEqual(g.getAttribute('skinWeight').array,skinWeight);
 const n=g.getAttribute('normal');for(let i=0;i<n.count;i++)assert.ok(Math.abs(Math.hypot(n.getX(i),n.getY(i),n.getZ(i))-1)<1e-4);
 g.dispose();
});

test('尾根到中段的上轮廓不因展开尾毛而新增明显凹口',()=>{
 const g=deerModelGeometry(true,true,true);refineDeerTailContour(g);
 const p=g.getAttribute('position'),index=g.index!;
 const top=(x:number)=>{
  let value=Infinity;for(let t=0;t<index.count;t+=3)for(let k=0;k<3;k++){
   const a=index.getX(t+k),b=index.getX(t+(k+1)%3),ax=p.getX(a),bx=p.getX(b);
   if((ax<=x&&bx>x)||(bx<=x&&ax>x))value=Math.min(value,p.getY(a)+(p.getY(b)-p.getY(a))*(x-ax)/(bx-ax));
  }return value;
 };
 refineDeerTailContour(g);let previous=top(-39);
 for(let x=-39.5;x>=-47;x-=.5){const value=top(x);assert.ok(value>=previous-.12,'尾巴上缘出现反向鼓起，尾根会形成凹口');previous=value;}
 g.dispose();
});
