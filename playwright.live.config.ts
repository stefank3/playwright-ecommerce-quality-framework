import { defineConfig } from '@playwright/test';
import { readLiveConfig } from './src/config/live.ts';

const config = readLiveConfig(process.env);
if (Reflect.get(globalThis, Symbol.for('qe.live-wrapper')) !== true)
  throw new Error(
    'Use the documented npm live commands; direct execution is disabled.',
  );
export default defineConfig({
  testDir: './tests/live',
  testMatch: '**/*.spec.ts',
  workers: 1,
  retries: 0,
  fullyParallel: false,
  forbidOnly: true,
  maxFailures: 1,
  globalTimeout: 300000,
  timeout: 60000,
  expect: { timeout: 10000 },
  outputDir: 'test-results/live',
  preserveOutput: 'never',
  reporter: [
    ['./src/reporting/live-reporter.ts'],
    ['list'],
    ['html', { outputFolder: 'playwright-report/live', open: 'never' }],
  ],
  metadata: {
    lane: 'manual live',
    target: 'Automation Exercise',
    policy: 'one worker; zero retries; 100 sends; 1s spacing; 5min cap',
  },
  use: {
    baseURL: config.baseURL,
    browserName: 'chromium',
    headless: true,
    offline: true,
    serviceWorkers: 'block',
    trace: 'off',
    screenshot: 'off',
    video: 'off',
    actionTimeout: 15000,
    navigationTimeout: 45000,
    launchOptions: {
      args: [
        '--disable-background-networking',
        '--host-resolver-rules=MAP * ~NOTFOUND',
        '--disable-quic',
        '--force-webrtc-ip-handling-policy=disable_non_proxied_udp',
      ],
    },
  },
  projects: [{ name: 'live-chromium' }],
});
