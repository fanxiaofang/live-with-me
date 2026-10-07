import { expect, test } from '@playwright/test';
import { stableScene } from './helpers';
test('repeated feedback owns its full duration and unmount clears every application deadline', async ({ page }) => {
  await page.addInitScript(() => {
    const originalSet = window.setTimeout.bind(window), originalClear = window.clearTimeout.bind(window);
    const pending = new Set<number>();
    (window as unknown as { feedbackTimers: Set<number> }).feedbackTimers = pending;
    window.setTimeout = ((handler: TimerHandler, delay?: number, ...args: unknown[]) => {
      if (typeof handler !== 'function' || ![1400, 3200].includes(delay ?? 0)) return originalSet(handler, delay, ...args);
      const id = originalSet(() => { pending.delete(id); handler(...args); }, delay); pending.add(id); return id;
    }) as typeof window.setTimeout;
    window.clearTimeout = (id?: number) => { if (id !== undefined) pending.delete(id); originalClear(id); };
  });
  await page.goto('/tests/fixtures/lifecycle.html');
  await page.getByRole('button', { name: '触发反馈' }).click();
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: '触发反馈' }).click();
  await page.waitForTimeout(500);
  await expect(page.getByTestId('pulse')).toHaveText('true');
  await expect(page.getByTestId('signal')).toContainText('深空信号解码');
  await page.waitForTimeout(1900);
  await expect(page.getByTestId('toast')).toHaveText('当前反馈');
  await page.getByRole('button', { name: '切换挂载' }).click();
  expect(await page.evaluate(() => (window as unknown as { feedbackTimers: Set<number> }).feedbackTimers.size)).toBe(0);
  await page.getByRole('button', { name: '切换挂载' }).click();
  await expect(page.getByTestId('toast')).toHaveText(''); await expect(page.getByTestId('pulse')).toHaveText('false');
});
test('all five themes render and CSS animation keeps translated feedback in its parent space', async ({ page }) => {
  await stableScene(page);
  for (const label of ['清晨', '午后', '黄昏', '深夜', '静雨']) {
    await page.getByRole('button', { name: label, exact: true }).click();
    await expect(page.locator('#skyFillGrad stop').first()).toHaveAttribute('stop-color', /#[a-f0-9]{6}/);
  }
  // Position and bouncing animation are separate nodes, even while CSS is active.
  expect(await page.locator('#living-cottage-haven g[transform][class*="animate-bounce"]').count()).toBe(0);
  await page.locator('#person-study-lin').focus(); await page.locator('#person-study-lin').press('Enter');
  expect(await page.locator('#person-study-lin g[transform="translate(0, -50)"] > g.animate-bounce').count()).toBe(1);
});
