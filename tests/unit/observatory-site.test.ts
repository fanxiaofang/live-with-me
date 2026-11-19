import assert from 'node:assert/strict';
import {test} from 'node:test';
import {resolveObservatorySite,isInObservatorySite,isBaleInObservatorySite} from '../../src/world/scene/observatorySite';
import {FIELD_HAY_BALES,fieldDressingDepth} from '../../src/world/scene/fieldDressing';
import {DEFAULT_SCENE_LAYOUT} from '../../src/world/scene/sceneLayout';
import {scenePoint} from '../../src/world/scene/sceneTypes';

test('电波塔工作空地清出相邻草垛，远处草垛保留，移动后按新位置避让',()=>{
  const base=DEFAULT_SCENE_LAYOUT.observatory;
  const site=resolveObservatorySite({...base,position:scenePoint(base.position.x+540,base.position.y)});
  const blocked=FIELD_HAY_BALES.filter(b=>{const p=fieldDressingDepth(b.depth);return isBaleInObservatorySite(b.x,p.y-115,p.scale,site);}).map(b=>b.id);
  assert.ok(blocked.includes('mid-outer'));
  assert.ok(blocked.includes('near-east'));
  assert.ok(!blocked.includes('far-east-pair'));
  assert.ok(!blocked.includes('far-east'));
  const moved=resolveObservatorySite({...base,position:scenePoint(base.position.x+1100,base.position.y)});
  const former=FIELD_HAY_BALES.find(b=>b.id==='far-east-pair')!;
  assert.equal(isInObservatorySite(former.x,fieldDressingDepth(former.depth).y-115,moved,20),false);
});

test('拖动塔体时道路入口跟随台阶、同一田垄上的交汇点保持不动',()=>{
  const base=DEFAULT_SCENE_LAYOUT.observatory;
  const start={...base,position:scenePoint(base.position.x+540,base.position.y)};
  const a=resolveObservatorySite(start);
  assert.equal(a.tramline,5);
  assert.ok(a.end.x<a.start.x);
  const b=resolveObservatorySite({...start,position:scenePoint(start.position.x+12,start.position.y)});
  assert.equal(b.start.x-a.start.x,12);
  assert.deepEqual(b.end,a.end);
  assert.equal(b.tramline,a.tramline);
  const midpoint={x:(a.start.x+3*a.control1.x+3*a.control2.x+a.end.x)/8,
    y:(a.start.y+3*a.control1.y+3*a.control2.y+a.end.y)/8};
  assert.ok(isInObservatorySite(midpoint.x,midpoint.y,a,8));
});
