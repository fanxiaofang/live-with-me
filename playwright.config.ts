import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30000,
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.001, animations: 'disabled' } },
  use: {
    browserName: 'chromium', viewport: { width: 1200, height: 800 },
    deviceScaleFactor: 1, locale: 'zh-CN', timezoneId: 'Asia/Shanghai',
    baseURL: 'http://127.0.0.1:3000', screenshot: 'only-on-failure', trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev -- --host=127.0.0.1 --strictPort',
    url: 'http://127.0.0.1:3000', reuseExistingServer: false,
    env: { DISABLE_HMR: 'true' },
  },
});
