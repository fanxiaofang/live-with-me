import { defineConfig } from '@playwright/test';

// Reuse an explicitly chosen preview. Never start another Vite or run a browser matrix.
export default defineConfig({
  testDir: '../../tests/e2e', workers: 1, retries: 0, reporter: 'line',
  use: { baseURL: process.env.LWM_PREVIEW_URL || 'http://127.0.0.1:3000',
    channel: 'msedge', headless: true, contextOptions: { reducedMotion: 'reduce' }, screenshot: 'only-on-failure' },
  outputDir: '../../test-results/targeted-check',
});
