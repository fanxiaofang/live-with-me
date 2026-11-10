import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { root, projectFile } from '../../scripts/devtools/common.mjs';
import { inspectPreview, decodeRawModule } from '../../scripts/devtools/preview.mjs';
import { planChecks } from '../../scripts/devtools/targeted-check.mjs';
import { calculate } from '../../scripts/devtools/geometry';
import { rotateGroundPoint, scaleAroundLocalAnchor } from '../../src/world/scene/placementMath';
import { DEFAULT_SCENE_LAYOUT } from '../../src/world/scene/sceneLayout';

test('scaled placements retain the chosen world contact, including already-scaled buildings', () => {
  for (const [id, anchor] of [['capsule_pod', { x: 0, y: 63 }], ['wooden_cabin', { x: 9, y: 63 }]] as const) {
    const before = DEFAULT_SCENE_LAYOUT[id];
    const after = scaleAroundLocalAnchor(before, before.scale * .95, anchor);
    assert.ok(Math.abs(before.position.x + anchor.x * before.scale - after.position.x - anchor.x * after.scale) < 1e-10);
    assert.ok(Math.abs(before.position.y + anchor.y * before.scale - after.position.y - anchor.y * after.scale) < 1e-10);
  }
  assert.throws(() => scaleAroundLocalAnchor(DEFAULT_SCENE_LAYOUT.capsule_pod, -1, { x: 0, y: 63 }));
});

test('ground rotation preserves uncompressed distance, and CLI rejects ambiguous or invalid inputs', () => {
  const p = { x: 100, y: 28.5 }, pivot = { x: 0, y: 0 };
  const q = rotateGroundPoint(p, pivot, 90);
  assert.ok(Math.abs(q.x + 100) < 1e-10 && Math.abs(q.y - 28.5) < 1e-10);
  const proposal = calculate('scale', { entity: 'capsule_pod', percent: '-5' }) as any;
  assert.equal(proposal.factor, .95);
  assert.equal(proposal.readOnly, true);
  assert.throws(() => calculate('scale', { entity: 'main_cottage', percent: '10' }), /anchor/);
  assert.throws(() => calculate('scale', { entity: 'constructor', percent: '10' }), /Unknown entity/);
  assert.throws(() => calculate('scale', { entity: 'capsule_pod', percent: '10', factor: '2' }));
  assert.throws(() => calculate('rotate', { point: '1,', pivot: '0,0', angle: '30' }));
  assert.throws(() => projectFile('../outside.ts'));
});

test('check planning is narrow and adds browser / type checks only when requested', () => {
  const art = planChecks({ files: ['src/components/scenery/yorkshire/vegetation/GuardianOsmanthus.tsx'] });
  assert.deepEqual(art.commands, []);
  const yard = planChecks({ files: ['src/features/yard-editor/yardLayout.ts'] });
  assert.equal(yard.commands.length, 1);
  assert.deepEqual(yard.commands[0].args, ['--import', 'tsx', '--test', 'tests/unit/yardLayout.test.ts']);
  const camera = planChecks({ area: ['camera'], typecheck: true, e2e: true, grep: 'living' });
  assert.deepEqual(camera.commands.map(command => command.kind), ['types', 'unit', 'e2e']);
  assert.ok(camera.commands[2].args.includes('living'));
  assert.throws(() => planChecks({ area: ['everything'] }));
  assert.deepEqual(planChecks({ files: ['src/App.tsx'] }).unknown, ['src/App.tsx']);
});

test('preview inspection identifies the server root and detects stale served source', async () => {
  const source = 'src/world/scene/sceneLayout.ts';
  const local = await readFile(projectFile(source).absolute, 'utf8');
  let stale = false, wrong = false;
  const server = createServer((req, res) => {
    if (req.url === '/__lwm_dev_info') res.end(JSON.stringify({ app: 'live-with-me', root: wrong ? root + '/other' : root, hmr: true }));
    else if (req.url?.includes('?raw')) res.end('export default ' + JSON.stringify(stale ? 'old source' : local));
    else res.end('<script src="/@vite/client"></script>');
  });
  await new Promise<void>(done => server.listen(0, '127.0.0.1', done));
  const address = server.address() as { port: number };
  const url = `http://127.0.0.1:${address.port}/`;
  try {
    const result = await inspectPreview({ url, source });
    assert.equal(result.identity, 'verified');
    assert.equal((result.checks[0] as any).fresh, true);
    stale = true; await assert.rejects(inspectPreview({ url, source }), /stale source/);
    wrong = true; await assert.rejects(inspectPreview({ url }), /another project/);
    assert.equal(decodeRawModule('export default "a\\nb";'), 'a\nb');
    assert.throws(() => decodeRawModule('<html>not source</html>'));
  } finally { await new Promise<void>((done, reject) => server.close(error => error ? reject(error) : done())); }
});
