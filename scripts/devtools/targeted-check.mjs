import { parseArgs } from 'node:util';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { root, projectFile, previewURL, isMain, cli, report } from './common.mjs';

const areas = {
  art: { unit: [], e2e: [], note: '实际场景尺寸与局部视觉检查；按需要复用 art skill 的 preview-asset.mjs。' },
  yard: { unit: ['yardLayout'], e2e: ['yard-editor'], note: '涉及拖动／存档才选择 E2E；静态造型无需执行整套庭院交互。' },
  camera: { unit: ['camera-bounds', 'overviewFraming', 'scene'], e2e: ['camera-framing'], note: '相机检查包含现有测试的视口用例；可用 --grep 进一步缩小。' },
  layout: { unit: ['layout'], e2e: ['layout-editor'], note: '复用现有布局存储与编辑检查。' },
  presence: { unit: ['presence'], e2e: ['presence'], note: '只检查同住人状态与相关交互。' },
  interactions: { unit: ['interactions'], e2e: ['interactions'], note: '只检查现有交互注册与分派。' },
  tools: { unit: ['devtools'], e2e: [], note: '开发工具输入、规划、HTTP 检查及几何不变量。' },
};
const rules = [
  [/^scripts\/devtools\//, 'tools'], [/placementMath\.ts$/, 'tools'],
  [/^src\/features\/yard-editor\//, 'yard'],
  [/^src\/world\/camera\/|^src\/world\/coordinates\/|\/(roomTargets|sceneLayout|explorationBounds)\.ts$/, 'camera'],
  [/^src\/features\/layout-editor\/|^src\/components\/layout-gizmo\//, 'layout'],
  [/^src\/features\/presence\//, 'presence'], [/^src\/world\/interactions\//, 'interactions'],
  [/^src\/components\/(architecture|scenery|plants|cabinet|desk|bookshelf|tea|wall-posters)\//, 'art'],
];
/** @param {{files?:string[],area?:string[],typecheck?:boolean,e2e?:boolean,grep?:string,url?:string}} options */
export function planChecks({ files = [], area = [], typecheck = false, e2e = false, grep, url } = {}) {
  const normalized = [...new Set(files.map(file => projectFile(file).local))];
  const selected = new Set(area), unknown = [];
  for (const item of selected) if (!areas[item]) throw new Error(`Unknown area: ${item}. Choose ${Object.keys(areas).join(', ')}.`);
  for (const file of normalized) {
    const matches = rules.filter(([pattern]) => pattern.test(file));
    if (matches.length) for (const [, item] of matches) selected.add(item);
    else if (!/^tests\//.test(file)) unknown.push(file);
  }
  const unit = new Set(), browser = new Set(), notes = [];
  for (const item of selected) {
    for (const name of areas[item].unit) unit.add(`tests/unit/${name}.test.ts`);
    if (e2e) for (const name of areas[item].e2e) browser.add(`tests/e2e/${name}.spec.ts`);
    notes.push(areas[item].note);
  }
  for (const file of normalized) {
    if (/^tests\/unit\/[^/]+\.test\.(ts|mjs)$/.test(file)) unit.add(file);
    if (e2e && /^tests\/e2e\/[^/]+\.spec\.ts$/.test(file)) browser.add(file);
  }
  const missing = [...unit, ...browser].filter(file => !existsSync(resolve(root, file)));
  if (missing.length) throw new Error(`Mapped checks do not exist: ${missing.join(', ')}`);
  const commands = [];
  if (typecheck) commands.push({ kind: 'types', args: ['node_modules/typescript/bin/tsc', '--noEmit'] });
  if (unit.size) commands.push({ kind: 'unit', args: ['--import', 'tsx', '--test', ...[...unit].sort()] });
  if (browser.size) commands.push({ kind: 'e2e', args: ['node_modules/@playwright/test/cli.js', 'test',
    '--config', 'scripts/devtools/playwright.config.ts', ...[...browser].sort(), ...(grep ? ['--grep', grep] : [])] });
  return { files: normalized, areas: [...selected], typecheck, e2e, url: previewURL(url).href, commands, unknown,
    notes: [...new Set(notes)], limitations: '按文件路径筛选候选检查，不做完整依赖推断，也不能证明视觉效果或所有回归。默认只列计划；--run 执行，--e2e 才加入浏览器检查。' };
}
export function changedFiles() {
  const git = args => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean);
  return [...new Set([...git(['diff', '--name-only', '-z', 'HEAD', '--']), ...git(['ls-files', '--others', '--exclude-standard', '-z'])])];
}
export async function main(args = process.argv.slice(2)) {
  const { values } = parseArgs({ args, options: {
    files: { type: 'string', multiple: true }, area: { type: 'string', multiple: true },
    typecheck: { type: 'boolean' }, e2e: { type: 'boolean' }, run: { type: 'boolean' },
    grep: { type: 'string' }, url: { type: 'string' }, help: { type: 'boolean' },
  } });
  if (values.help) return console.log('check:target -- [--files src/path.ts --files src/other.tsx] [--area art|yard|camera|layout|presence|interactions|tools] [--typecheck] [--e2e --grep pattern] [--run] [--url http://127.0.0.1:3000/]');
  const plan = planChecks({ ...values, files: values.files ?? (values.area ? [] : changedFiles()), area: values.area ?? [] });
  report({ ...plan, execution: values.run ? 'requested' : 'plan-only' });
  if (!values.run) return;
  if (!plan.commands.length) return console.log('没有可自动执行的检查；按计划中的视觉／人工项目复核。');
  if (plan.commands.some(command => command.kind === 'e2e')) {
    const response = await fetch(plan.url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error('The requested preview server is unavailable. This runner does not start or stop servers.');
  }
  for (const command of plan.commands) {
    const result = spawnSync(process.execPath, command.args, { cwd: root, stdio: 'inherit',
      env: { ...process.env, LWM_PREVIEW_URL: plan.url } });
    if (result.error) throw result.error;
    if (result.status !== 0) { process.exitCode = result.status ?? 1; return; }
  }
}
if (isMain(import.meta.url)) await cli(main);
