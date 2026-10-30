import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { f2Projection, f2LandmarkTransform } from '../../src/world/render/f2/F2CameraAdapter';
import { F2_STUDIES, requestedHillsMode } from '../../src/world/render/f2/f2Config';
import { OVERVIEW_CAMERA, sceneToViewBox, type Camera } from '../../src/world/camera/cameraMath';
import { scenePoint } from '../../src/world/scene/sceneTypes';
import { sliceViewport } from '../../src/world/coordinates/viewport';
import { transformPoint } from '../../src/world/coordinates/affine2d';

const sampledView = (camera: Camera, width = 1600, height = 900) => ({ width, height, camera });

test('source distance response preserves all calibrated overview placements and SVG slice/origin contracts',()=>{
 for(const [width,height] of [[1600,900],[1200,800],[390,844],[1920,800]])
 for(const {placement} of Object.values(F2_STUDIES)) for(const index of [0,1,2]){
  const p=f2Projection(sampledView(OVERVIEW_CAMERA,width,height),index,placement),fit=sliceViewport(width,height);
  for(const [x,y] of [[-4,.1],[0,0],[1.7,.095],[4,-3]]){
   const source=scenePoint(placement.centerX+placement.offsetX+x*400,
    placement.horizonY+placement.offsetY+placement.layerOffsetY[index]-y*400);
   const v=sceneToViewBox(source,OVERVIEW_CAMERA);
   const expected={x:fit.a*v.x+fit.e,y:fit.d*v.y+fit.f};
   const actual={x:width/2+(p.x+x*p.scale)*height/2,y:height/2-(p.y+y*p.scale)*height/2};
   assert.ok(Math.abs(expected.x-actual.x)<1e-9);
   assert.ok(Math.abs(expected.y-actual.y)<1e-9);
  }
 }
});
test('F2 is current by default and Legacy remains an explicit nonpersistent comparison',()=>{
 assert.equal(requestedHillsMode(''),'f2');
 assert.equal(requestedHillsMode('?hills=legacy'),'legacy');
 assert.equal(requestedHillsMode('?hills=f2'),'f2');
 assert.equal(requestedHillsMode('?hills=other'),'f2');
});
test('Frozen F2 geometry, shaders and relief model remain byte-identical to their source',()=>{
 const root=new URL('../../',import.meta.url);
 const provenance=JSON.parse(readFileSync(new URL('docs/visual-system/f2-evidence/provenance.json',root),'utf8'));
 for(const file of provenance.files){
  if(file.source==='src/backdrop/createBackdrop.js')continue;
  const bytes=readFileSync(new URL(file.target,root));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),file.sha256,file.source);
 }
});

test('F2 restores 0/1.5/3.5 percent pan, source displacement caps and exponent zoom',()=>{
 for(const [width,height] of [[1600,900],[1200,800],[390,844],[1920,800]]) {
  const fit=sliceViewport(width,height).a;
  const pan=sampledView({x:100/fit,y:135+50/fit,zoom:.66},width,height);
  for(const [i,response] of [{pan:0,zoom:0},{pan:.015,zoom:.025},{pan:.035,zoom:.065}].entries()) {
   const initial=f2Projection(sampledView(OVERVIEW_CAMERA,width,height),i),p=f2Projection(pan,i);
   assert.ok(Math.abs((p.x-initial.x)*height/2-100*response.pan)<1e-9);
   assert.ok(Math.abs(-(p.y-initial.y)*height/2-50*response.pan)<1e-9);
   for(const zoom of [.45,1.18,2.5]) {
    const q=f2Projection(sampledView({...OVERVIEW_CAMERA,zoom},width,height),i);
    assert.ok(Math.abs(q.scale/initial.scale-(zoom/.66)**response.zoom)<1e-12);
   }
   for(const sign of [-1,1]) {
    const q=f2Projection(sampledView({x:sign*100000,y:135+sign*100000,zoom:.66},width,height),i);
    assert.ok(Math.abs(q.x-initial.x-sign*(i===0?0:.01))<1e-12);
    assert.ok(Math.abs(q.y-initial.y+sign*(i===0?0:.01))<1e-12);
   }
  }
 }
});

test('SVG landmarks stay on the actual nearest F2 mesh through pan, clamp, zoom and aspect changes',()=>{
 for(const [width,height] of [[1600,900],[1200,800],[390,844],[1920,800]])
 for(const camera of [OVERVIEW_CAMERA,{x:123,y:-90,zoom:1.18},{x:-230,y:200,zoom:.45},{x:1000,y:600,zoom:2.5}])
 for(const {placement} of Object.values(F2_STUDIES)) {
  const view=sampledView(camera,width,height),m=f2LandmarkTransform(view,placement);
  const p=f2Projection(view,2,placement),fit=sliceViewport(width,height);
  for(const [x,y] of [[245,170],[380,210],[1320,195],[-160,205]]) {
   const v=transformPoint(m,{x,y});
   const actual={x:fit.e+fit.a*v.x,y:fit.f+fit.d*v.y};
   const units=placement.unitsPerDesignUnit*placement.scale*placement.layerScale[2];
   const ridgeX=(x-placement.centerX-placement.offsetX)/units;
   const ridgeY=(placement.horizonY+placement.offsetY+placement.layerOffsetY[2]-y)/units;
   const expected={x:width/2+(p.x+ridgeX*p.scale)*height/2,y:height/2-(p.y+ridgeY*p.scale)*height/2};
   assert.ok(Math.hypot(expected.x-actual.x,expected.y-actual.y)<1e-9);
  }
 }
});
test('Host sky sampling matches SVG sRGB stops and interpolation', async()=>{
 const {sampleWorldSky}=await import('../../src/world/render/f2/F2Atmosphere');
 const {COUNTRYSIDE_THEMES}=await import('../../src/world/theme/worldTheme');
 const theme=COUNTRYSIDE_THEMES.day;
 assert.equal(sampleWorldSky(theme,-320).getHexString(),'31739c');
 assert.equal(sampleWorldSky(theme,-135).getHexString(),'4d8aaf');
 assert.equal(sampleWorldSky(theme,50).getHexString(),'69a1c2');
 assert.equal(sampleWorldSky(theme,420).getHexString(),'fdf6ec');
 assert.equal(sampleWorldSky(theme,800).getHexString(),'fdf6ec');
});
test('Calibration variants keep an explicit original F2 and choose refined only inside F2 mode',async()=>{
 const {requestedF2Study,F2_STUDIES}=await import('../../src/world/render/f2/f2Config');
 assert.equal(requestedF2Study(''),'refined');
 assert.equal(requestedF2Study('?hillsStudy=baseline'),'baseline');
 assert.equal(requestedF2Study('?hillsStudy=position35'),'position35');
 assert.equal(requestedF2Study('?hillsStudy=__proto__'),'refined');
 assert.equal(requestedHillsMode(''),'f2');
 assert.equal(F2_STUDIES.baseline.placement.offsetY,0);
 assert.equal(F2_STUDIES.refined.placement.offsetY,40);
});
