import { expect, test } from '@playwright/test';
import fs from 'node:fs';
import { ROOM_VIEWS } from './helpers';

test('measure native room navigation from click through the first moving frame and settling', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/tests/fixtures/app-profile.html');
  await page.locator('#panoramic-world-stage').waitFor();
  await page.getByTitle('收起面板（查看完整约克郡风光）', { exact: true }).click();
  await page.mouse.move(20, 150);
  await page.waitForTimeout(1000);
  const measurements: unknown[] = [];
  for (const [id, label] of [...ROOM_VIEWS.slice(1), ROOM_VIEWS[0]]) {
    await page.evaluate(() => {
      const target = window as unknown as {
        roomRenderSamples: { duration: number; commitTime: number }[];
        roomSwitchDone: Promise<unknown>;
      };
      const stage = document.querySelector('#panoramic-world-stage') as SVGGraphicsElement;
      const previous = getComputedStyle(stage).transform;
      const previousTarget = stage.style.transform;
      let clickTime = 0, targetTime = 0, firstFrame = 0;
      const gaps: number[] = [];
      let previousFrame = 0;
      target.roomSwitchDone = new Promise(resolve => {
        let frame = 0;
        const observer = new MutationObserver(() => {
          if (clickTime && !targetTime && stage.style.transform !== previousTarget) targetTime = performance.now() - clickTime;
        });
        observer.observe(stage, { attributes: true, attributeFilter: ['style'] });
        const sample = (time: number) => {
          if (previousFrame) gaps.push(time - previousFrame);
          previousFrame = time;
          if (!firstFrame && getComputedStyle(stage).transform !== previous) firstFrame = performance.now() - clickTime;
          frame = requestAnimationFrame(sample);
        };
        const finish = (event: TransitionEvent) => {
          if (event.target !== stage || event.propertyName !== 'transform') return;
          cancelAnimationFrame(frame);
          observer.disconnect();
          stage.removeEventListener('transitionend', finish);
          const renders = target.roomRenderSamples.filter(sample => sample.commitTime >= clickTime).map(sample => sample.duration);
          resolve({ clickToTargetMs: targetTime, clickToFirstFrameMs: firstFrame,
            settledMs: performance.now() - clickTime, reactCommits: renders.length,
            reactTotalMs: renders.reduce((sum, duration) => sum + duration, 0),
            reactMaxMs: Math.max(...renders), maxFrameGapMs: Math.max(...gaps),
            transition: getComputedStyle(stage).transitionDuration, camera: stage.getAttribute('style') });
        };
        stage.addEventListener('transitionend', finish);
        document.addEventListener('click', () => {
          target.roomRenderSamples.length = 0;
          clickTime = performance.now();
          frame = requestAnimationFrame(sample);
        }, { capture: true, once: true });
      });
    });
    await page.getByRole('button', { name: label, exact: true }).click();
    const sample = await page.evaluate(() => (window as unknown as { roomSwitchDone: Promise<Record<string, unknown>> }).roomSwitchDone);
    expect(sample.clickToFirstFrameMs).toBeGreaterThan(0);
    measurements.push({ room: id, ...sample });
  }
  const metrics = { environment: 'Windows / Chromium 141 / React development Profiler / DPR 1 / 1200×800',
    recording: test.info().project.use.trace, measurements };
  console.log(JSON.stringify(metrics));
  fs.writeFileSync(process.env.LWM_ROOM_METRICS_FILE || test.info().outputPath('room-switch-metrics.json'), JSON.stringify(metrics, null, 2) + '\n');
});
