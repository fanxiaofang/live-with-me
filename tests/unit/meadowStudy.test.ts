import assert from 'node:assert/strict';
import {test} from 'node:test';
import {nearPlantAnchors, REFINED_MEADOW_PLANTS} from '../../src/components/scenery/yorkshire/vegetation/meadowStudy';
import {HOMESTEAD_MEADOW_PLANTS} from '../../src/components/scenery/yorkshire/vegetation/meadowPlantingLayout';
import {OVERVIEW_CAMERA,sceneToViewBox} from '../../src/world/camera/cameraMath';
import {sliceViewport} from '../../src/world/coordinates/viewport';
test('near plant roots sit just outside the overview crop across aspect ratios, then move with the real ground',()=>{
 for(const [width,height]of [[1600,900],[1200,800],[390,844],[1477,1252],[1920,800]]){
  const anchors=nearPlantAnchors(width,height),fit=sliceViewport(width,height);
  const project=(p:typeof anchors.left,camera=OVERVIEW_CAMERA)=>{
   const q=sceneToViewBox(p,camera);return{x:q.x*fit.a+fit.e,y:q.y*fit.d+fit.f};
  };
  const left=project(anchors.left),right=project(anchors.right);
  assert.ok(left.x>=0&&left.x<width*.12);
  assert.ok(right.x>width*.85&&right.x<=width);
  for(const p of [left,right])assert.ok(p.y>height&&p.y<height+20);
  const shifted=project(anchors.left,{...OVERVIEW_CAMERA,x:100,y:OVERVIEW_CAMERA.y-80});
  assert.ok(Math.abs(shifted.x-left.x-100*fit.a)<1e-8);
  assert.ok(Math.abs(shifted.y-left.y+80*fit.d)<1e-8);
 }
});
test('tree refinement repositions existing six clumps and preserves all other accepted planting',()=>{
 assert.equal(REFINED_MEADOW_PLANTS.length,HOMESTEAD_MEADOW_PLANTS.length);
 let changed=0;
 for(let i=0;i<HOMESTEAD_MEADOW_PLANTS.length;i++){
  const a=HOMESTEAD_MEADOW_PLANTS[i],b=REFINED_MEADOW_PLANTS[i];
  if(a.zone!=='tree-outside'){assert.equal(b,a);continue}
  changed++;assert.equal(b.type,a.type);assert.equal(b.anchor,a.anchor);assert.equal(b.flip,a.flip);assert.equal(b.opacity,a.opacity);
  assert.ok(Math.abs(b.x)<80&&b.y>0&&b.y<55&&b.scale<.3);
 }
 assert.equal(changed,6);
});
