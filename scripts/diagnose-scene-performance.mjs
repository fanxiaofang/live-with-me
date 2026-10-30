// Production-only diagnostic runner. Never attaches to a user's browser/profile.
// Start a separate vite preview first; examples and evidence live in SCENE_PERFORMANCE_DIAGNOSIS.md.
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { execFileSync } from 'node:child_process';

const args = Object.fromEntries(process.argv.slice(2).map(arg => arg.replace(/^--/, '').split('=')));
const headed = args.headed === 'true';
const dpr = Number(args.dpr ?? 1);
const suite = args.suite ?? 'baseline';
const repeats = Number(args.repeats ?? (suite === 'trace' ? 1 : 3));
if (!['baseline', 'controls', 'trace', 'calibration'].includes(suite) || !Number.isInteger(repeats) || repeats < 1 || (suite === 'trace' && repeats !== 1)) throw new Error('Invalid suite/repeats (trace uses one recording per variant)');
if (![1, 2].includes(dpr)) throw new Error('Use DPR 1 or 2');
const directory = args.out;
if (!directory) throw new Error('--out=<new evidence directory> is required');
fs.mkdirSync(directory, { recursive: true });
const save = (name, data) => {
  const file = path.join(directory, name);
  // Preserve previous evidence, including accidental repeated invocations.
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
};
const sha = file => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const round = value => Number(value.toFixed(2));
let activeCase = {};
let inspected = false;
const browser = await chromium.launch({ headless: !headed });
const browserSession = await browser.newBrowserCDPSession();
const system = await browserSession.send('SystemInfo.getInfo');
const provenance = {
  head: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  status: execFileSync('git', ['status', '--porcelain=v1'], { encoding: 'utf8' }),
  dist: Object.fromEntries(['dist/index.html', ...fs.readdirSync('dist/assets').filter(f => /\.(js|css)$/.test(f)).map(f => `dist/assets/${f}`)].map(f => [f, sha(f)])),
  runnerSha256: sha('scripts/diagnose-scene-performance.mjs'),
};
const environment = { measuredAt: new Date().toISOString(), mode: headed ? 'headed Chromium window requested foreground' : 'headless Chromium',
  browserVersion: browser.version(), platform: os.platform(), cpu: os.cpus()[0]?.model,
  logicalCpus: os.cpus().length, viewport: { width: 1200, height: 800 }, dpr,
  baseURL: args.url ?? 'http://127.0.0.1:4175', seed: 15176, system, provenance,
  limitations: 'rAF cadence is not presented FPS. Window focus/visibility do not prove unoccluded physical presentation. No CPU throttle. Fresh isolated storage uses default people/layout. React hook counts root commits, not commit duration. Traces have instrumentation overhead; thread timings overlap. No real phone measurement.' };
save(`environment-${suite}-${headed ? 'headed' : 'headless'}-dpr${dpr}.json`, environment);
fs.copyFileSync('scripts/diagnose-scene-performance.mjs', path.join(directory, 'runner-source.mjs'), fs.constants.COPYFILE_EXCL);

async function open() {
  const context = await browser.newContext({ viewport: environment.viewport, deviceScaleFactor: dpr,
    locale: 'zh-CN', timezoneId: 'Asia/Shanghai', reducedMotion: 'no-preference' });
  await context.addInitScript(() => {
    let seed = 15176;
    Math.random = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
    window.__sceneCommits = [];
    let rendererId = 0;
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = { supportsFiber: true, renderers: new Map(),
      inject(renderer) { const id = ++rendererId; this.renderers.set(id, renderer); return id; },
      onCommitFiberRoot() { window.__sceneCommits.push(performance.now()); },
      onCommitFiberUnmount() {}, onPostCommitFiberRoot() {},
    };
  });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(environment.baseURL);
  await page.locator('#panoramic-world-stage').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.bringToFront();
  await page.getByRole('button', { name: '收起面板（查看完整约克郡风光）', exact: true }).click();
  await page.getByRole('button', { name: '白天', exact: true }).click();
  await page.waitForTimeout(2000);
  if (args.inspect === 'true' && !inspected) {
    inspected = true;
    console.log('window-ready: 15 seconds for native foreground inspection before sampling');
    await page.waitForTimeout(15000);
  }
  return { context, page, errors };
}

async function state(page) {
  return page.evaluate(() => ({ visibility: document.visibilityState, focus: document.hasFocus(),
    dpr: devicePixelRatio, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    svgElements: document.querySelectorAll('svg *').length,
    people: [...document.querySelectorAll('[data-scene-character]')].map(n => ({ kind: n.dataset.sceneCharacter, person: n.dataset.personId })),
    storage: { ...localStorage }, camera: document.querySelector('#panoramic-world-stage')?.getAttribute('style') ?? null,
    runningAnimations: document.getAnimations().filter(a => a.playState === 'running').length,
    smilAnimations: document.querySelectorAll('animate, animateTransform, animateMotion').length,
    heap: performance.memory ? { used: performance.memory.usedJSHeapSize, total: performance.memory.totalJSHeapSize } : null,
  }));
}

async function measure(page, scenario, action) {
  console.log(`measuring ${scenario}`);
  const before = await state(page);
  if (before.visibility !== 'visible' || !before.focus) throw new Error('Measurement requires visible, focused page');
  await page.evaluate(() => {
    const probe = { started: performance.now(), frames: [], longTasks: [], raf: 0 };
    performance.clearMarks('lwm-probe-start'); performance.clearMarks('lwm-probe-end');
    performance.mark('lwm-probe-start');
    probe.observer = new PerformanceObserver(list => probe.longTasks.push(...list.getEntries().map(e => ({ start: e.startTime, duration: e.duration }))));
    probe.observer.observe({ type: 'longtask', buffered: false });
    const frame = t => { probe.frames.push(t); probe.raf = requestAnimationFrame(frame); };
    probe.raf = requestAnimationFrame(frame);
    window.__sceneProbe = probe;
  });
  let actionCompletedMs = null;
  if (action) { await action(); actionCompletedMs = await page.evaluate(() => performance.now() - window.__sceneProbe.started); }
  await page.evaluate(async () => { const left = 3000 - (performance.now() - window.__sceneProbe.started); if (left > 0) await new Promise(r => setTimeout(r, left)); });
  const raw = await page.evaluate(() => {
    const p = window.__sceneProbe;
    cancelAnimationFrame(p.raf);
    p.longTasks.push(...p.observer.takeRecords().map(e => ({ start: e.startTime, duration: e.duration })));
    p.observer.disconnect();
    const ended = performance.now();
    performance.mark('lwm-probe-end');
    const result = { elapsedMs: ended - p.started, firstFrameWaitMs: p.frames[0] - p.started,
      finalFrameWaitMs: ended - p.frames.at(-1), rawFrameIntervalsMs: p.frames.slice(1).map((t, i) => t - p.frames[i]),
      longTasks: p.longTasks.map(e => ({ startMs: e.start - p.started, durationMs: e.duration })),
      rootCommitTimesMs: window.__sceneCommits.filter(t => t >= p.started && t <= ended).map(t => t - p.started) };
    delete window.__sceneProbe;
    return result;
  });
  if (!raw.rawFrameIntervalsMs.length) throw new Error('No frame samples');
  const sorted = [...raw.rawFrameIntervalsMs].sort((a, b) => a - b);
  const result = { scenario, before, after: await state(page), ...raw, actionCompletedMs,
    p50Ms: round(sorted[Math.ceil(sorted.length * .5) - 1]), p95Ms: round(sorted[Math.ceil(sorted.length * .95) - 1]),
    maxMs: round(sorted.at(-1)), over33_4Ms: sorted.filter(t => t > 33.4).length,
    over50Ms: sorted.filter(t => t > 50.1).length,
    longTaskTotalMs: round(raw.longTasks.reduce((s, t) => s + t.durationMs, 0)), rootCommits: raw.rootCommitTimesMs.length };
  fs.appendFileSync(path.join(directory, 'measurements.jsonl'), JSON.stringify({ ...activeCase, ...result }) + '\n');
  return result;
}

const button = (page, name) => page.getByRole('button', { name, exact: true }).click();
async function pan(page) {
  await page.mouse.move(600, 170); await page.mouse.down();
  for (let i = 1; i <= 30; i++) { const step = i <= 15 ? i : 30 - i;
    await page.mouse.move(600 + step * 8, 170 + step * 3); await page.waitForTimeout(40); }
  await page.mouse.up();
}
async function wheel(page) {
  await page.mouse.move(600, 170);
  for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, i < 6 ? -60 : 60); await page.waitForTimeout(80); }
}

// Each control changes only one factor; all are disposable DOM changes in isolated contexts.
const controls = {
  normal: '',
  'cloud-filter-off': '#sky-clouds-far-layer, #sky-clouds-ridge-mist { filter: none !important; }',
  'cloud-motion-paused': '.cloud-drift-far, .cloud-drift-mist { animation-play-state: paused !important; }',
  'vegetation-motion-paused': '.animate-wheat-wave, .animate-wheat-tuft, .animate-wind-grass, .animate-wind-flower, .animate-wind-clover { animation-play-state: paused !important; }',
  'all-css-motion-paused': '* { animation-play-state: paused !important; }',
  'all-svg-filters-off': 'svg [filter] { filter: none !important; }',
  'smil-motion-paused': '',
  'all-motion-paused': '* { animation-play-state: paused !important; }',
};

async function trace(page, session, label, action) {
  await session.send('Tracing.start', { categories: 'devtools.timeline,v8,blink,blink.user_timing,cc,gpu,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.frame', transferMode: 'ReturnAsStream' });
  const measurement = await measure(page, label, action);
  const finished = new Promise(resolve => session.once('Tracing.tracingComplete', resolve));
  await session.send('Tracing.end');
  const { stream } = await finished;
  let json = '';
  for (;;) { const chunk = await session.send('IO.read', { handle: stream }); json += chunk.data; if (chunk.eof) break; }
  await session.send('IO.close', { handle: stream });
  const file = `${label}.trace.json.gz`;
  fs.writeFileSync(path.join(directory, file), gzipSync(json), { flag: 'wx' });
  const events = JSON.parse(json).traceEvents;
  const start = events.find(e => e.name === 'lwm-probe-start')?.ts;
  const end = events.find(e => e.name === 'lwm-probe-end')?.ts;
  if (!start || !end) throw new Error(`Missing trace probe markers in ${file}; raw trace preserved`);
  const names = new Map(events.filter(e => e.ph === 'M' && e.name === 'thread_name').map(e => [`${e.pid}:${e.tid}`, e.args.name]));
  const totals = new Map();
  for (const e of events) if (e.ph === 'X' && e.dur > 0 && e.ts < end && e.ts + e.dur > start) {
    const duration = Math.min(e.ts + e.dur, end) - Math.max(e.ts, start);
    const thread = names.get(`${e.pid}:${e.tid}`) ?? `${e.pid}:${e.tid}`;
    const key = `${e.pid}:${e.tid}/${thread}/${e.name}`;
    const item = totals.get(key) ?? { pid: e.pid, tid: e.tid, thread, event: e.name, count: 0, inclusiveMs: 0, maxMs: 0 };
    item.count++; item.inclusiveMs += duration / 1000; item.maxMs = Math.max(item.maxMs, duration / 1000); totals.set(key, item);
  }
  return { measurement, trace: file, boundedToProbe: true, traceWindowMs: (end - start) / 1000, eventTotals: [...totals.values()].map(e => ({ ...e, inclusiveMs: round(e.inclusiveMs), maxMs: round(e.maxMs) })).sort((a, b) => b.inclusiveMs - a.inclusiveMs),
    note: 'Inclusive event durations may nest and threads overlap. Do not sum into wall time or GPU execution cost. React commit duration is not separately profiled in production.' };
}

try {
  if (suite === 'calibration') {
    for (let run = 1; run <= repeats; run++) {
      const context = await browser.newContext({ viewport: environment.viewport, deviceScaleFactor: dpr, reducedMotion: 'no-preference' });
      const page = await context.newPage();
      await page.route('**/runtime-calibration', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Scene scheduling calibration</title><body style="margin:0;background:#456"></body>' }));
      await page.goto(`${environment.baseURL}/runtime-calibration`);
      await page.evaluate(() => { window.__sceneCommits = []; });
      await page.bringToFront();
      await page.waitForTimeout(800);
      activeCase = { suite, headed, dpr, run };
      const measurements = [await measure(page, 'blank-page-idle')];
      await page.setContent('<!doctype html><title>Scene scheduling calibration</title><style>@keyframes drift {to{transform:translateX(600px)}} div{width:60px;height:60px;background:#ddd;animation:drift 3s linear infinite alternate;will-change:transform}</style><div></div>');
      measurements.push(await measure(page, 'simple-composited-transform'));
      save(`calibration-${headed ? 'headed' : 'headless'}-dpr${dpr}-run${run}.json`, { run, measurements });
      console.log(JSON.stringify(measurements.map(m => ({ scenario: m.scenario, p50: m.p50Ms, p95: m.p95Ms }))));
      await context.close();
    }
    await browser.close();
    process.exit(0);
  }
  for (let run = 1; run <= repeats; run++) {
    const variants = suite === 'baseline' ? ['normal'] : (args.variants ? args.variants.split(',') : Object.keys(controls));
    if (variants.some(v => !(v in controls))) throw new Error('Unknown control variant');
    // Reverse every second repetition to expose order/thermal drift.
    if (run % 2 === 0) variants.reverse();
    for (const variant of variants) {
      activeCase = { suite, headed, dpr, run, variant };
      const { context, page, errors } = await open();
      if (controls[variant]) await page.addStyleTag({ content: controls[variant] });
      if (variant === 'smil-motion-paused' || variant === 'all-motion-paused') {
        await page.evaluate(() => document.querySelectorAll('svg').forEach(svg => svg.pauseAnimations()));
      }
      await page.waitForTimeout(800);
      const measurements = [];
      if (suite === 'trace') {
        const session = await context.newCDPSession(page);
        measurements.push(await trace(page, session, `${variant}-overview-idle`));
        if (variant === 'normal') {
          measurements.push(await trace(page, session, 'normal-overview-pan', () => pan(page)));
          measurements.push(await trace(page, session, 'normal-overview-wheel', () => wheel(page)));
          measurements.push(await trace(page, session, 'normal-desk-navigation', () => button(page, '我的阁楼房间')));
        } else { await button(page, '我的阁楼房间'); }
        await page.waitForTimeout(3000);
        measurements.push(await trace(page, session, `${variant}-desk-idle`));
      } else {
        measurements.push(await measure(page, 'day-overview-idle'));
        if (suite === 'baseline') {
          measurements.push(await measure(page, 'day-overview-pan', () => pan(page)));
          measurements.push(await measure(page, 'day-overview-wheel', () => wheel(page)));
          measurements.push(await measure(page, 'day-desk-navigation', () => button(page, '我的阁楼房间')));
        } else { await button(page, '我的阁楼房间'); await page.waitForTimeout(3000); }
        measurements.push(await measure(page, 'day-desk-idle'));
        if (suite === 'baseline') {
          await button(page, '黄昏'); await button(page, '整栋小屋'); await page.waitForTimeout(1600);
          measurements.push(await measure(page, 'dusk-overview-idle'));
          measurements.push(await measure(page, 'dusk-desk-navigation', () => button(page, '我的阁楼房间')));
          measurements.push(await measure(page, 'dusk-desk-idle'));
          await button(page, '夜晚'); await button(page, '整栋小屋'); await page.waitForTimeout(1600);
          measurements.push(await measure(page, 'night-overview-idle'));
          await page.getByTitle('展开同住人面板', { exact: true }).click();
          measurements.push(await measure(page, 'first-chair-detail', async () => {
            await button(page, '检视工位椅子 (空椅 / 组合态)');
            await page.getByRole('dialog', { name: '工位椅与桌前坐姿' }).waitFor({ state: 'visible' });
          }));
        }
      }
      if (errors.length) throw new Error(JSON.stringify(errors));
      const name = `${suite}-${headed ? 'headed' : 'headless'}-dpr${dpr}-${variant}-run${run}.json`;
      save(name, { environmentFile: `environment-${suite}-${headed ? 'headed' : 'headless'}-dpr${dpr}.json`, run, variant, controlCSS: controls[variant], measurements, pageErrors: errors });
      console.log(JSON.stringify({ name, measurements: measurements.map(m => { const v = m.measurement ?? m; return { scenario: v.scenario, p95: v.p95Ms, max: v.maxMs, commits: v.rootCommits, longTaskMs: v.longTaskTotalMs }; }) }));
      await context.close();
    }
  }
} finally { await browser.close(); }
