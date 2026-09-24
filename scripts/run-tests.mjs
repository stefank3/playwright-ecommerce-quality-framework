import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { readConfig } from '../src/config/runtime.ts';
import { checkTestOutputs } from '../src/config/output-paths.ts';

readConfig(process.env);
checkTestOutputs();
const args = process.argv.slice(2);
// Runner/config overrides would bypass the lane contract. Allow only documented focused workflows.
for (let index = 0; index < args.length; index++) {
  const arg = args[index];
  if (arg === '--grep' && args[index + 1] && !args[index + 1].startsWith('-')) {
    index++;
  } else if (!['--list', '--debug'].includes(arg)) {
    console.error('Only --list, --debug, or --grep <pattern> are accepted.');
    process.exit(1);
  }
}
const require = createRequire(import.meta.url);
const guard = new URL('./deny-network.mjs', import.meta.url).href;
const cli = require.resolve('@playwright/test/cli');
const result = spawnSync(process.execPath, [cli, 'test', ...args], {
  cwd: fileURLToPath(new URL('../', import.meta.url)),
  stdio: 'inherit',
  env: { ...process.env, NODE_OPTIONS: `--import=${guard}` },
});
process.exit(result.status ?? 1);
