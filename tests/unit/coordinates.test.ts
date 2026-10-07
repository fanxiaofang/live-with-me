import assert from 'node:assert/strict';
import { test } from 'node:test';
import { panBounds } from '../../src/world/camera/cameraMath';
import { inverse, multiply, transformDelta, transformPoint } from '../../src/world/coordinates/affine2d';
import { sliceViewport } from '../../src/world/coordinates/viewport';

test('slice, camera, building and nested parent matrices round-trip CSS points and deltas',()=>{
  for(const [width,height] of [[1200,800],[1600,900],[390,844]]) for(const zoom of [0.66,1.6,2.5]) {
    const camera={a:zoom,b:0,c:0,d:zoom,e:600*(1-zoom)+220,f:400*(1-zoom)+150};
    const building={a:0.8,b:0,c:0,d:0.8,e:540,f:210};
    const wall={a:1,b:-0.2852,c:0,d:1,e:-124,f:6};
    const matrix=multiply(sliceViewport(width,height,20,10),multiply(camera,multiply(building,wall)));
    const original={x:-72,y:75};
    const result=transformPoint(inverse(matrix),transformPoint(matrix,original));
    assert.ok(Math.hypot(result.x-original.x,result.y-original.y)<1e-9);
    const delta=transformDelta(inverse(matrix),{dx:40,dy:-25});
    const forward=transformDelta(matrix,delta);
    assert.ok(Math.hypot(forward.dx-40,forward.dy+25)<1e-9);
  }
  assert.throws(()=>inverse({a:0,b:0,c:0,d:0,e:0,f:0}));
});
test('manual bounds include legacy limits and the derived focus outside them',()=>{
  assert.deepEqual(panBounds({x:-700,y:330,zoom:1.6}),{minX:-700,maxX:420,minY:-120,maxY:330});
});
