import { defineConfig } from '@playwright/test';
import base from '../playwright.config';

// Focused interaction audit against the already-running local preview.
export default defineConfig({
  ...base,
  testDir: '../tests/e2e',
  testMatch: 'interactions.spec.ts',
  timeout: 120000,
  outputDir: '../test-results/seedpod',
  use: { ...base.use, channel: 'msedge' },
  webServer: undefined,
});
