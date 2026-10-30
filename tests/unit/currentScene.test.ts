import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CURRENT_F2_SCENE, resolveSceneOptions, requestedMeadowFoothill } from '../../src/world/scene/currentScene';
import { requestedHillsMode, requestedF2Study } from '../../src/world/render/f2/f2Config';
import { requestedFoothillTransition } from '../../src/world/render/f2/foothillConfig';
import { requestedFoothillTrees } from '../../src/world/render/f2/foothillTreeConfig';
import { requestedFieldEdges } from '../../src/world/scene/fieldEdges';
import { requestedMeadowStudy } from '../../src/components/scenery/yorkshire/vegetation/meadowStudy';
import { requestedMeadowForeground } from '../../src/components/scenery/yorkshire/vegetation/meadowForeground';

test('omitted or unrelated query parameters retain the entire integrated scene', () => {
  for (const search of ['', '?hills=f2', '?theme=night', '?focusRoom=living_nook']) {
    assert.deepEqual(resolveSceneOptions(search), CURRENT_F2_SCENE);
    assert.equal(resolveSceneOptions(search).cottage, 'seedpod');
    assert.equal(requestedHillsMode(search), 'f2');
    assert.equal(requestedF2Study(search), 'refined');
    assert.equal(requestedFoothillTransition(search), true);
    assert.equal(requestedFoothillTrees(search), true);
    assert.equal(requestedFieldEdges(search), 'both');
    assert.equal(requestedMeadowStudy(search), 'complete');
    assert.equal(requestedMeadowForeground(search), 'entrance');
    assert.equal(requestedMeadowFoothill(search),true);
  }
});

test('saved study URLs resolve to the accepted meadow without reviving removed variants',()=>{
  const reviewed='?foothillStudy=gentle-hill&foothillComposition=windmill&foothillContour=natural&foothillSurface=meadow&foothillCover=blended';
  for(const query of [reviewed,'?foothillStudy=low-hills','?foothillStudy=solid-hill',
    '?foothillStudy=gentle-hill&foothillCompanion=rear-shoulder','?foothillHeight=25&foothillLandmarks=off'])assert.equal(requestedMeadowFoothill(query),true,query);
  for(const query of ['?hills=legacy','?hillsTransition=off','?foothillForm=source-foot']) {
    assert.equal(requestedMeadowFoothill(query),false,query);
  }
  assert.equal(requestedMeadowFoothill('?foothillForm=typo'),true);
});

test('historical comparisons are explicit and changing one option preserves the others', () => {
  assert.equal(requestedFoothillTransition('?hillsTransition=off'), false);
  assert.equal(requestedFoothillTrees('?hillsTrees=off'), false);
  assert.equal(requestedMeadowStudy('?meadowStudy=original'), 'original');
  assert.equal(requestedMeadowForeground('?meadowForeground=points'), 'points');
  assert.deepEqual(resolveSceneOptions('?meadowForeground=regions'), { ...CURRENT_F2_SCENE, meadowForeground: 'regions' });
  assert.deepEqual(resolveSceneOptions('?hills=legacy'), { ...CURRENT_F2_SCENE, hills: 'legacy' });
  assert.deepEqual(resolveSceneOptions('?cottage=classic'), { ...CURRENT_F2_SCENE, cottage: 'classic' });
  assert.deepEqual(resolveSceneOptions('?cottage=invalid'), CURRENT_F2_SCENE);
  assert.deepEqual(resolveSceneOptions('?hillsStudy=__proto__&meadowStudy=bad'), CURRENT_F2_SCENE);
});
