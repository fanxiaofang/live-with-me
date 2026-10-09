import { defineConfig } from '@playwright/test';
import baseline from './playwright.config';

// Run the real entry and deferred panels against the already-built dist directory.
export default defineConfig({
  ...baseline,
  testMatch: ['baseline.spec.ts', 'delivery.spec.ts', 'interactions.spec.ts', 'layout-editor.spec.ts', 'runtime-failure.spec.ts', 'room-navigation.spec.ts'],
  metadata: { productionPreview: true },
  grepInvert: /@visual/,
  use: { baseURL: 'http://127.0.0.1:4173' },
  webServer: {
    command: 'npm run preview -- --host=127.0.0.1 --port=4173 --strictPort',
    url: 'http://127.0.0.1:4173', reuseExistingServer: false,
  },
});
