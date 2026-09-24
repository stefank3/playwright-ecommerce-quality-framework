import { spawnSync } from 'node:child_process';
import { mkdirSync, rmdirSync } from 'node:fs';
import { readLiveConfig } from '../src/config/live.ts';
import { checkTestOutputs, safeOutput } from '../src/config/output-paths.ts';

readLiveConfig(process.env);
checkTestOutputs();
mkdirSync('test-results/live', { recursive: true });
const args = process.argv.slice(2);
const allowedArgs = ['--list', '--headed', 'ui', 'api'];

if (args.some((arg) => !allowedArgs.includes(arg))) {
  throw new Error('Only --list, --headed, ui or api are allowed.');
}

const headed = args.includes('--headed');

if (
  headed &&
  (!args.includes('ui') || args.includes('api') || args.includes('--list'))
) {
  throw new Error('--headed is allowed only with the live UI test selection.');
}
const lock = safeOutput('test-results') + '/.live-run-lock';
try {
  mkdirSync(lock);
} catch {
  throw new Error(
    'Another local live run may be active. Inspect before removing its lock.',
  );
}
try {
  const selection = args.includes('ui')
    ? ['catalog.ui.spec.ts']
    : args.includes('api')
      ? ['catalog.api.spec.ts']
      : [];
  const result = spawnSync(
    process.execPath,
    [
      'node_modules/@playwright/test/cli.js',
      'test',
      '--config=playwright.live.config.ts',
      ...selection,
      ...(headed ? ['--headed'] : []),
      ...(args.includes('--list') ? ['--list'] : []),
    ],
    {
      stdio: 'inherit',
      timeout: 315000,
      env: {
        ...process.env,
        PLAYWRIGHT_NO_COPY_PROMPT: '1',
        NODE_OPTIONS: `--import=${new URL('./live-marker.mjs', import.meta.url).href}`,
      },
    },
  );
  process.exitCode = result.status ?? 1;
} finally {
  rmdirSync(lock);
}
