import { defineConfig } from '@playwright/test';
import { readConfig } from './src/config/runtime.ts';
import { requireDeterministicGuard } from './src/config/deterministic-guard.ts';

requireDeterministicGuard();
const config = readConfig(process.env);

export default defineConfig({
  testDir: './tests/deterministic',
  testMatch: '**/*.spec.ts',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  forbidOnly: true,
  timeout: config.timeoutMs,
  expect: { timeout: 5000 },
  outputDir: `${config.artifactRoot}/deterministic`,
  reporter: [
    ['list'],
    [
      'html',
      { open: 'never', outputFolder: 'playwright-report/deterministic' },
    ],
  ],
  metadata: {
    lane: config.mode,
    provenance: 'synthetic controlled fixtures; no live product evidence',
  },
  use: {
    browserName: 'chromium',
    headless: true,
    offline: true,
    serviceWorkers: 'block',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    launchOptions: {
      args: [
        '--disable-background-networking',
        '--host-resolver-rules=MAP * ~NOTFOUND',
      ],
    },
  },
  projects: [{ name: 'deterministic-chromium' }],
});
