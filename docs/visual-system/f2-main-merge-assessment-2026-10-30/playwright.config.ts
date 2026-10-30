import { defineConfig } from '@playwright/test';
import base from '../../../playwright.config';

export default defineConfig({
  ...base,
  testDir: '../../../tests/e2e',
  testMatch: ['f2-default-scene.spec.ts', 'interactions.spec.ts'],
  timeout: 120000,
  outputDir: '../../../test-results/f2-merge-assessment',
  // Full SVG snapshots on every traced assertion overwhelm this large scene.
  use: { ...base.use, baseURL: process.env.F2_URL ?? base.use?.baseURL, channel: 'msedge', trace: 'off' },
  webServer: undefined,
});
