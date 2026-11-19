import assert from 'node:assert/strict';
import {test} from 'node:test';
import {deerModelGeometry} from '../../src/components/scenery/yorkshire/dressing/spiritDeerModel';
import {refineDeerNeckContour} from '../../src/components/scenery/yorkshire/dressing/spiritDeerNeckContour';

test('后颈局部预览保持头胸四肢、深度、拓扑及原绑定，位移有界',()=>{
 const g=deerModelGeometry(true,true,true),p=g.getAttribute('position'),old=Float32Array.from(p.array),indices=g.index!.array.slice();
 const skinIndex=g.getAttribute('skinIndex').array.slice(),skinWeight=g.getAttribute('skinWeight').array.slice();
 const report=refineDeerNeckContour(g);assert.ok(report.changedVertices>20);assert.ok(report.maxDisplacement<=2.500001);
 let lower=0,upper=0;
 for(let i=0;i<p.count;i++){
  const x=old[i*3],y=old[i*3+1],z=old[i*3+2],distance=Math.hypot(p.getX(i)-x,p.getY(i)-y);
  assert.equal(p.getZ(i),z);assert.ok(Number.isFinite(distance));
  if(y<=-98||y>=-64||x<=-8||x>=17+(-y-61)*.45+1.5)assert.equal(distance,0,'保护区域出现位移');
  if(distance>1e-5){if(y>-82)lower++;else upper++;}
 }
 assert.ok(lower>10&&upper>10,'两个圈选的颈背区均应有小幅修整');
 assert.deepEqual(g.index!.array,indices);assert.deepEqual(g.getAttribute('skinIndex').array,skinIndex);assert.deepEqual(g.getAttribute('skinWeight').array,skinWeight);
 g.dispose();
});

test('外轮廓确实补浅凹并收鼓包，不能只磨圆边缘',()=>{
 const g=deerModelGeometry(true,true,true),p=g.getAttribute('position'),index=g.index!;
 const top=(x:number)=>{
  let value=Infinity;
  for(let t=0;t<index.count;t+=3)for(let k=0;k<3;k++){
   const a=index.getX(t+k),b=index.getX(t+(k+1)%3),ax=p.getX(a),bx=p.getX(b);
   if((ax<=x&&bx>x)||(bx<=x&&ax>x))value=Math.min(value,p.getY(a)+(p.getY(b)-p.getY(a))*(x-ax)/(bx-ax));
  }
  return value;
 };
 const beforeDip=top(4),beforeBulge=top(13);refineDeerNeckContour(g);
 assert.ok(top(4)<beforeDip-.8,'浅凹处应向上补起');
 assert.ok(top(13)>beforeBulge+.35,'凸包处应向内收回');g.dispose();
});
