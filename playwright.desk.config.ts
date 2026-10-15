import { defineConfig } from '@playwright/test';
import baseline from './playwright.config';

// Dedicated fixture port keeps the user's development server available.
export default defineConfig({
  ...baseline,
  testMatch: ['desk-workstations.spec.ts'],
  use: { ...baseline.use, baseURL: 'http://127.0.0.1:3181' },
  webServer: { ...baseline.webServer,
    command: 'npm run dev -- --host=127.0.0.1 --port=3181 --strictPort',
    url: 'http://127.0.0.1:3181', reuseExistingServer: false },
});
