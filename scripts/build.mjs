import { rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { safeOutput } from '../src/config/output-paths.ts';

const output = safeOutput('dist');
// Only this resolved, fixed repository-owned output root may be removed.
rmSync(output, { recursive: true });
const result = spawnSync(
  process.execPath,
  ['node_modules/typescript/bin/tsc', '-p', 'tsconfig.build.json'],
  { stdio: 'inherit' },
);
process.exitCode = result.status ?? 1;
