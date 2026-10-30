import assert from 'node:assert/strict';
import { test } from 'node:test';
import { FIELD_EDGE_STUDY, frontEdgeY, requestedFieldEdges } from '../../src/world/scene/fieldEdges';
import { meadowGroundPath, rollingWheatPath, wheatBackEdgePath, wheatBoundaryFencePosts, wheatRearY } from '../../src/world/scene/landscapeGeometry';
import { resolveLandscapeCoverage, resolveParallaxCamera, PARALLAX_PRESETS } from '../../src/world/camera/parallaxMath';
import { sceneToViewBox } from '../../src/world/camera/cameraMath';
import { scenePoint } from '../../src/world/scene/sceneTypes';

test('both field edges are current by default and old geometry requires an explicit comparison', () => {
  for (const q of ['', '?fieldEdges=bad']) assert.equal(requestedFieldEdges(q), 'both');
  assert.equal(requestedFieldEdges('?fieldEdges=original'), 'original');
  for (const mode of ['front', 'rear', 'both']) assert.equal(requestedFieldEdges('?fieldEdges=' + mode), mode);
  assert.equal(meadowGroundPath(), meadowGroundPath(false));
  assert.equal(rollingWheatPath(), rollingWheatPath(0, false));
});

test('rear study keeps a continuous crop, bridge approach and safe coverage envelope', () => {
  for (let x = -3200; x <= 4200; x += 2) {
    const y = wheatRearY(x, true), delta = y - wheatRearY(x);
    assert.ok(y <= 225, 'must fit the existing F2 opaque coverage envelope at ' + x);
    assert.ok(Math.abs(delta) <= 13.001, 'shallow planar changes only');
    if (x >= -400 && x <= 120) assert.ok(Math.abs(delta) < .001, 'western bridge approach unchanged');
  }
  const path = rollingWheatPath(0, true);
  assert.equal((path.match(/M /g) || []).length, 1);
  assert.equal((path.match(/Z/g) || []).length, 1);
  const originalPosts = wheatBoundaryFencePosts(), studyPosts = wheatBoundaryFencePosts(true);
  assert.deepEqual(studyPosts.map(p => p.x), originalPosts.map(p => p.x));
  for (const p of studyPosts) assert.ok(Math.abs(p.y - wheatRearY(p.x, true)) < 1e-6);
  const rearCoordinates = [...wheatBackEdgePath(true).matchAll(/C ([^C]+)/g)].map(m => m[1].trim().split(',').map(Number));
  for (const c of rearCoordinates) assert.ok(c[0] < c[2] && c[2] < c[4], 'no folding / reversing contour');
});

test('front contact remains shallow, continuous and leaves the courtyard below it', () => {
  for (let x = -4000; x <= 6000; x += 2) {
    const y = frontEdgeY(x);
    assert.ok(y >= 170 && y <= FIELD_EDGE_STUDY.frontMaxY);
  }
  assert.ok(FIELD_EDGE_STUDY.frontMaxY < 215, 'contact stays behind courtyard shoulder');
  const path = meadowGroundPath(true);
  assert.equal((path.match(/M /g) || []).length, 1);
  assert.equal((path.match(/Z/g) || []).length, 1);
});

test('hidden wheat coverage covers the irregular grass contact through the existing camera domain', () => {
  for (const zoom of [.45, .66, .95, 1.6, 2.5]) for (let y = -120; y <= 330; y += 15) {
    const camera = {x: 0, y, zoom}, wheat = resolveParallaxCamera(camera, PARALLAX_PRESETS.wheat);
    const coverage = resolveLandscapeCoverage(camera, true);
    const cropBottom = sceneToViewBox(scenePoint(0, 355 + coverage.wheatFrontExtension - 115), wheat).y;
    const contactTop = sceneToViewBox(scenePoint(0, FIELD_EDGE_STUDY.frontMaxY), camera).y;
    assert.ok(cropBottom >= contactTop + 7.9999);
  }
});
