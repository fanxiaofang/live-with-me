import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MEADOW_FOOTHILL, meadowHillRelief, meadowHillSurfaceY, meadowHillPath, meadowHillNormal, MEADOW_HILL_TREES, MEADOW_HILL_FARM, MEADOW_HILL_WINDMILL } from '../../src/world/scene/meadowFoothill';
import { meadowFoothillMaterial } from '../../src/world/render/f2/meadowFoothillMaterial';
import { resolveF2Environment } from '../../src/world/render/f2/F2Environment';

test('grassland profile has one continuous crown, tangent toes and supported landmarks',()=>{
  for(let x=91;x<990;x++) {
    const delta=meadowHillRelief(x)-meadowHillRelief(x-1);
    assert.ok(x<=490 ? delta>=0 : delta<=0);
    const left=(meadowHillRelief(x)-meadowHillRelief(x-.01))/.01;
    const right=(meadowHillRelief(x+.01)-meadowHillRelief(x))/.01;
    assert.ok(Math.abs(left-right)<.003,'the ridge must not have a short angular notch');
  }
  const h=MEADOW_FOOTHILL.height;
  for(const x of [MEADOW_FOOTHILL.start,MEADOW_FOOTHILL.end])assert.equal(meadowHillSurfaceY(x,0,h),meadowHillSurfaceY(x,1,h));
  for(const root of [...MEADOW_HILL_TREES,MEADOW_HILL_FARM,MEADOW_HILL_WINDMILL]) {
    const y=meadowHillSurfaceY(root.x,root.depth,h)!;
    assert.ok(y>meadowHillSurfaceY(root.x,0,h)! && y<meadowHillSurfaceY(root.x,1,h)!);
  }
  const {x,depth}=MEADOW_HILL_WINDMILL;
  assert.ok(Math.abs(meadowHillSurfaceY(x-7,depth,h)!-meadowHillSurfaceY(x+7,depth,h)!)<3);
  assert.ok(!/NaN|undefined/.test(meadowHillPath(h)));
});
test('grassland light shares F2 direction and the foot colour, without night sunlight',()=>{
  for(const time of ['day','dusk','night'] as const) {
    const m=meadowFoothillMaterial(time,.65);
    assert.deepEqual(m.lighting,resolveF2Environment(time).study.lighting);
    const left=m.response(meadowHillNormal(300,.3)),right=m.response(meadowHillNormal(700,.3));
    if(time==='day')assert.ok(left>right);
    if(time==='dusk')assert.ok(left<right);
    if(time==='night')assert.equal(left,right);
    for(const x of [90,240,490,750,990])assert.equal(m.colorAt(x,1),m.groundAt(x));
  }
});
