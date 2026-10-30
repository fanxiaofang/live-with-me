import assert from 'node:assert/strict';
import { test } from 'node:test';
import { meadowVegetationWeights, SUMMER_MEADOW_VEGETATION } from '../../src/world/scene/meadowVegetation';
import { meadowFoothillMaterial } from '../../src/world/render/f2/meadowFoothillMaterial';

test('vegetation weights remain bounded, normalized, continuous and deterministic',()=>{
  for(let x=90;x<=990;x+=9) for(let d=0;d<=1;d+=.05) {
    const w=meadowVegetationWeights(x,d);
    assert.ok(w.every(v=>v>=0&&v<=1));
    assert.ok(Math.abs(w.reduce((a,b)=>a+b,0)-1)<1e-12);
    assert.deepEqual(w,meadowVegetationWeights(x,d));
    const near=meadowVegetationWeights(x+.01,d+.0001);
    assert.ok(w.every((v,i)=>Math.abs(v-near[i])<.002));
  }
});
test('a vegetation palette changes ground colour without moving coverage or changing F2 lighting/toe',()=>{
  const replacement=structuredClone(SUMMER_MEADOW_VEGETATION);
  replacement.ground.dryGrass='#b89b6a';
  replacement.trees.birch.leaf='#baa369';
  assert.notEqual(replacement.trees.birch.leaf,SUMMER_MEADOW_VEGETATION.trees.birch.leaf);
  assert.deepEqual(replacement.trees.pine,SUMMER_MEADOW_VEGETATION.trees.pine);
  for(const time of ['day','dusk','night'] as const) {
    const normal=meadowFoothillMaterial(time),variant=meadowFoothillMaterial(time,.65,replacement);
    assert.notEqual(normal.colorAt(405,.3),variant.colorAt(405,.3));
    assert.deepEqual(normal.sun,variant.sun);
    assert.deepEqual(normal.lighting,variant.lighting);
    for(const x of [90,240,490,750,990]) {
      assert.equal(normal.colorAt(x,1),normal.groundAt(x));
      assert.equal(variant.colorAt(x,1),variant.groundAt(x));
    }
  }
});
