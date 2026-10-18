import { defineConfig } from '@playwright/test';
import baseline from './playwright.config';

// One isolated server for current character, chair and calibration regressions.
export default defineConfig({
  ...baseline,
  testMatch: ['character-export.spec.ts', 'character-five-views.spec.ts',
    'seated-nw-hairstyles.spec.ts', 'sofa-chair.spec.ts', 'desk-calibration.spec.ts',
    'chair-inspection.spec.ts', 'desk-workstations.spec.ts', 'delivery.spec.ts'],
  use: { ...baseline.use, baseURL: 'http://127.0.0.1:3182' },
  webServer: { ...baseline.webServer,
    command: 'npm run dev -- --host=127.0.0.1 --port=3182 --strictPort',
    url: 'http://127.0.0.1:3182', reuseExistingServer: false },
});
