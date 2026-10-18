import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2];
if (!root) throw new Error('Pass the evidence directory');
const files = fs.readdirSync(root, { recursive: true }).filter(f => /\.json$/.test(f));
const median = values => [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];
const groups = new Map();
const traces = [];
for (const file of files) {
  const name = path.basename(file);
  if (!/^(baseline|controls|calibration|trace)-/.test(name)) continue;
  const report = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
  if (name.startsWith('trace-')) {
    for (const trace of report.measurements) {
      const select = (event, thread) => trace.eventTotals.filter(e => e.event === event && (!thread || e.thread === thread)).reduce((sum, e) => sum + e.inclusiveMs, 0);
      traces.push({ file, scenario: trace.measurement.scenario, p95Ms: trace.measurement.p95Ms,
        boundedToProbe: trace.boundedToProbe ?? false, traceWindowMs: trace.traceWindowMs ?? null,
        elapsedMs: trace.measurement.elapsedMs, rootCommits: trace.measurement.rootCommits,
        functionCallMs: select('FunctionCall', 'CrRendererMain'), paintMs: select('Paint', 'CrRendererMain'),
        styleMs: select('UpdateLayoutTree', 'CrRendererMain'), layoutMs: select('Layout', 'CrRendererMain'),
        rasterWorkerMs: select('RasterTask'), gpuProcessTaskMs: select('GPUTask'),
        note: trace.note });
    }
    continue;
  }
  const suite = name.split('-')[0];
  const mode = name.includes('-headless-') ? 'headless' : 'headed';
  const dpr = Number(name.match(/-dpr(\d)/)?.[1] ?? 1);
  for (const m of report.measurements) {
    const key = `${suite}/${mode}/dpr${dpr}/${report.variant ?? 'normal'}/${m.scenario}`;
    if (!groups.has(key)) groups.set(key, { suite, mode, dpr, variant: report.variant ?? 'normal', scenario: m.scenario, samples: [] });
    groups.get(key).samples.push({ file, ...m });
  }
}
const summaries = [...groups.values()].map(({ samples, ...group }) => ({ ...group, runs: samples.length,
  p50MedianMs: median(samples.map(m => m.p50Ms)), p95MedianMs: median(samples.map(m => m.p95Ms)),
  p95MinMs: Math.min(...samples.map(m => m.p95Ms)), p95MaxMs: Math.max(...samples.map(m => m.p95Ms)),
  maxFrameIntervalMs: Math.max(...samples.map(m => m.maxMs)),
  largestInitialWaitMs: Math.max(...samples.map(m => m.firstFrameWaitMs)),
  largestFinalWaitMs: Math.max(...samples.map(m => m.finalFrameWaitMs)),
  over33_4Ms: samples.reduce((s, m) => s + m.over33_4Ms, 0),
  over50Ms: samples.reduce((s, m) => s + m.over50Ms, 0),
  longTaskTotalMs: samples.reduce((s, m) => s + m.longTaskTotalMs, 0),
  longTaskCount: samples.reduce((s, m) => s + m.longTasks.length, 0),
  rootCommits: samples.map(m => m.rootCommits),
  actionCompletedMs: samples.map(m => m.actionCompletedMs), files: samples.map(m => m.file),
}));
const result = { generatedAt: new Date().toISOString(), summaries, traces,
  exclusions: 'Failed setup attempts contain environment files only, excluded. IAB is reported separately. No historical results are merged. Trace event sums are inclusive, nested and across overlapping threads; they are not GPU hardware execution time or a partition of wall time.' };
fs.writeFileSync(path.join(root, 'summary.json'), JSON.stringify(result, null, 2) + '\n');
const table = ['| Suite | Mode / DPR | Variant | Scenario | Runs | P50 median | P95 median (range) | Max | Long tasks |',
  '| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: |',
  ...summaries.map(s => `| ${s.suite} | ${s.mode} / ${s.dpr} | ${s.variant} | ${s.scenario} | ${s.runs} | ${s.p50MedianMs} | ${s.p95MedianMs} (${s.p95MinMs}–${s.p95MaxMs}) | ${s.maxFrameIntervalMs} | ${s.longTaskCount} |`)];
fs.writeFileSync(path.join(root, 'summary.md'), table.join('\n') + '\n');
console.log(JSON.stringify({ groups: summaries.length, traceSegments: traces.length, output: path.join(root, 'summary.json') }));
