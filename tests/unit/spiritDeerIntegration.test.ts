import assert from 'node:assert/strict';
import {test} from 'node:test';
import {defaultYardSnapshot,resolveSavedYardSnapshot} from '../../src/features/yard-editor/yardDefaults';
import {deerPathFromLayout,isDeerPathClear} from '../../src/features/yard-editor/deerPatrolRoute';

test('默认庭院的真实门口支持灵鹿跨门巡视，运行路线不修改布局',()=>{
 const snapshot=defaultYardSnapshot(),before=JSON.stringify(snapshot);
 const path=deerPathFromLayout(snapshot.layout);
 assert.ok(isDeerPathClear(path,snapshot.layout));
 assert.ok(path.points.at(-1)!.x>430);
 assert.equal(JSON.stringify(snapshot),before);
});

test('真实存档拥有门栏与守护鹿的位置，空存档才使用默认场景',()=>{
 const baseline=defaultYardSnapshot();
 assert.deepEqual(resolveSavedYardSnapshot(null),baseline);
 const saved={objects:{gate_spirit_deer:{dx:12,dy:-20,angle:0},fence_west:{dx:0,dy:0,angle:0}},wearStrokes:[]};
 const snapshot=resolveSavedYardSnapshot(saved);
 assert.deepEqual(snapshot.layout.gate_spirit_deer,saved.objects.gate_spirit_deer);
 assert.deepEqual(snapshot.layout.fence_west,saved.objects.fence_west);
 assert.deepEqual(snapshot.wearStrokes,[]);
});
