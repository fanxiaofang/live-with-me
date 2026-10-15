import { defineConfig } from '@playwright/test';

// Real production entry, normal CSS/SMIL motion, no tracing or screenshot capture.
export default defineConfig({
  testDir: './tests/performance', testMatch: 'scene-performance.spec.ts',
  workers: 1, fullyParallel: false, retries: 0, repeatEach: 3, timeout: 90000,
  use: { browserName: 'chromium', headless: true, viewport: { width: 1200, height: 800 },
    locale: 'zh-CN', timezoneId: 'Asia/Shanghai', baseURL: 'http://127.0.0.1:4173',
    trace: 'off', screenshot: 'off', video: 'off', contextOptions: { reducedMotion: 'no-preference' } },
  projects: [{ name: 'dpr-1', use: { deviceScaleFactor: 1 } }, { name: 'dpr-2', use: { deviceScaleFactor: 2 } }],
  webServer: { command: 'npm run preview -- --host=127.0.0.1 --port=4173 --strictPort',
    url: 'http://127.0.0.1:4173', reuseExistingServer: false },
});
