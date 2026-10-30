import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createHash } from 'node:crypto';

interface Probe {
  started: number;
  frames: number[];
  longTasks: { startMs: number; durationMs: number }[];
  animationFrame: number;
  observer: PerformanceObserver;
}
type ProbeWindow = Window & { scenePerformanceProbe?: Probe };
const round = (value: number) => Number(value.toFixed(2));

async function measure(page: Page, scenario: string, action?: () => Promise<void>) {
  await page.evaluate(() => {
    const probe: Probe = { started: performance.now(), frames: [], longTasks: [], animationFrame: 0,
      observer: new PerformanceObserver(list => {
        for (const entry of list.getEntries()) probe.longTasks.push({ startMs: entry.startTime - probe.started, durationMs: entry.duration });
      }) };
    probe.observer.observe({ type: 'longtask', buffered: false });
    const frame = (time: number) => { probe.frames.push(time); probe.animationFrame = requestAnimationFrame(frame); };
    probe.animationFrame = requestAnimationFrame(frame);
    (window as ProbeWindow).scenePerformanceProbe = probe;
  });
  if (action) await action();
  // Wall-clock duration, rather than a fixed frame count, retains stalls in the sample.
  await page.evaluate(async () => {
    const remaining = 3000 - (performance.now() - (window as ProbeWindow).scenePerformanceProbe!.started);
    if (remaining > 0) await new Promise(resolve => setTimeout(resolve, remaining));
  });
  const raw = await page.evaluate(() => {
    const probe = (window as ProbeWindow).scenePerformanceProbe!;
    cancelAnimationFrame(probe.animationFrame);
    for (const entry of probe.observer.takeRecords()) probe.longTasks.push({ startMs: entry.startTime - probe.started, durationMs: entry.duration });
    probe.observer.disconnect();
    const intervals = probe.frames.slice(1).map((time, index) => time - probe.frames[index]);
    const result = { elapsedMs: performance.now() - probe.started, initialFrameWaitMs: probe.frames[0] - probe.started,
      finalFrameWaitMs: performance.now() - probe.frames.at(-1)!, intervals, longTasks: probe.longTasks };
    delete (window as ProbeWindow).scenePerformanceProbe;
    return result;
  });
  expect(raw.intervals.length, 'the visible production page must supply frame samples').toBeGreaterThan(0);
  const sorted = [...raw.intervals].sort((a, b) => a - b);
  const percentile = (p: number) => sorted[Math.ceil(p * sorted.length) - 1];
  return { scenario, elapsedMs: round(raw.elapsedMs), samples: sorted.length,
    p50FrameIntervalMs: round(percentile(0.5)), p95FrameIntervalMs: round(percentile(0.95)),
    maxFrameIntervalMs: round(sorted.at(-1)!), intervalsOver33Ms: sorted.filter(t => t > 33.4).length,
    initialFrameWaitMs: round(raw.initialFrameWaitMs), finalFrameWaitMs: round(raw.finalFrameWaitMs),
    longTaskCount: raw.longTasks.length, longTaskTotalMs: round(raw.longTasks.reduce((sum, task) => sum + task.durationMs, 0)),
    rawFrameIntervalsMs: raw.intervals.map(round), longTasks: raw.longTasks.map(task => ({ startMs: round(task.startMs), durationMs: round(task.durationMs) })) };
}

test('record the production scene with normal motion enabled', async ({ page, browser }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await page.locator('#panoramic-world-stage').waitFor();
  await page.evaluate(async () => { await document.fonts.ready; });
  await page.getByRole('button', { name: '收起面板（查看完整约克郡风光）', exact: true }).click();
  await page.getByRole('button', { name: '白天', exact: true }).click();
  await page.waitForTimeout(2000);
  const measurements = [await measure(page, 'day-overview-idle')];
  measurements.push(await measure(page, 'day-overview-pan', async () => {
    await page.mouse.move(600, 170); await page.mouse.down();
    for (let i = 1; i <= 30; i++) {
      const step = i <= 15 ? i : 30 - i;
      await page.mouse.move(600 + step * 8, 170 + step * 3);
      await page.waitForTimeout(40);
    }
    await page.mouse.up();
  }));
  measurements.push(await measure(page, 'day-overview-wheel', async () => {
    await page.mouse.move(600, 170);
    for (let i = 0; i < 12; i++) { await page.mouse.wheel(0, i < 6 ? -60 : 60); await page.waitForTimeout(80); }
  }));
  measurements.push(await measure(page, 'day-desk-navigation', async () => {
    await page.getByRole('button', { name: '我的阁楼房间', exact: true }).click();
  }));
  measurements.push(await measure(page, 'day-desk-idle'));
  await page.getByRole('button', { name: '夜晚', exact: true }).click();
  await page.getByRole('button', { name: '整栋小屋', exact: true }).click();
  await page.waitForTimeout(1500);
  measurements.push(await measure(page, 'night-overview-idle'));
  const scene = await page.evaluate(() => ({ dpr: devicePixelRatio, userAgent: navigator.userAgent,
    visibility: document.visibilityState, svgElements: document.querySelectorAll('svg *').length,
    cssAnimations: document.getAnimations().filter(animation => animation.playState === 'running').length,
    smilAnimations: document.querySelectorAll('animate, animateTransform, animateMotion').length,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches }));
  const report = { measuredAt: new Date().toISOString(), environment: { mode: 'production preview / headless Chromium',
    browserVersion: browser.version(), platform: os.platform(), cpu: os.cpus()[0]?.model,
    viewport: info.project.use.viewport, ...scene }, repeat: info.repeatEachIndex,
    chairSourceSha256: createHash('sha256').update(fs.readFileSync('src/components/desk/WindsorChair.tsx')).digest('hex'),
    limitations: 'requestAnimationFrame cadence and main-thread long tasks; not proof of presented/composited FPS or real mobile-device performance. Normal motion retained. No trace, screenshots or CPU throttle.',
    measurements, pageErrors: errors };
  const directory = process.env.LWM_SCENE_METRICS_DIR ?? info.outputPath('metrics');
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, `${info.project.name}-run-${info.repeatEachIndex + 1}.json`), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ project: info.project.name, repeat: info.repeatEachIndex + 1,
    measurements: measurements.map(({ scenario, p95FrameIntervalMs, maxFrameIntervalMs, longTaskCount }) => ({ scenario, p95FrameIntervalMs, maxFrameIntervalMs, longTaskCount })) }));
  expect(errors).toEqual([]);
});
