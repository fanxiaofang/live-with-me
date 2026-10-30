import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  workers: 1,
  timeout: 60000,
  use: {
    channel: 'msedge', baseURL: process.env.F2_URL || 'http://127.0.0.1:3012',
    viewport: { width: 1200, height: 800 }, deviceScaleFactor: 1,
    locale: 'zh-CN', timezoneId: 'Asia/Shanghai',
  },
});
