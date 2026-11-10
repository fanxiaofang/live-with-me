import { defineConfig } from '@playwright/test';
import base from './playwright.config';

/** Camera and current-scene regressions, isolated from the normal dev preview. */
export default defineConfig({
  ...base,
  testMatch: ['camera-framing.spec.ts', 'view-toolbar.spec.ts', 'room-navigation.spec.ts', 'input.spec.ts',
    'f2-default-scene.spec.ts', 'landscape-environment.spec.ts', 'sheep-pen.spec.ts'],
  timeout: 120000,
  outputDir: './test-results/camera',
  use: { ...base.use, channel: 'msedge', baseURL: 'http://127.0.0.1:3014' },
  webServer: {
    command: 'npm run dev -- --host=127.0.0.1 --port=3014 --strictPort',
    url: 'http://127.0.0.1:3014', reuseExistingServer: !process.env.CI,
    env: { DISABLE_HMR: 'true' },
  },
});
