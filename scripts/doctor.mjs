import {
  accessSync,
  constants,
  mkdirSync,
  lstatSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { resolve, sep } from 'node:path';
import { chromium } from '@playwright/test';
import { readConfig } from '../src/config/runtime.ts';
import { checkTestOutputs } from '../src/config/output-paths.ts';

let step = 'runtime: activate the version in .node-version';
try {
  const pinned = readFileSync(
    new URL('../.node-version', import.meta.url),
    'utf8',
  ).trim();
  if (process.versions.node !== pinned)
    throw new Error(`Use the pinned Node.js ${pinned} runtime.`);
  step = 'configuration: check QE_ keys and deterministic settings';
  const config = readConfig(process.env);
  step = 'browser: run npx playwright install chromium';
  accessSync(chromium.executablePath(), constants.R_OK);
  step = 'outputs: restore writable repository-local directories without links';
  checkTestOutputs();
  const root = realpathSync(process.cwd());
  const artifact = resolve(root, config.artifactRoot);
  mkdirSync(artifact, { recursive: true });
  if (
    lstatSync(artifact).isSymbolicLink() ||
    !realpathSync(artifact).startsWith(root + sep)
  ) {
    throw new Error('Artifact directory must remain inside the repository.');
  }
  const probe = resolve(artifact, `.doctor-${process.pid}`);
  writeFileSync(probe, '', { flag: 'wx' });
  rmSync(probe);
  console.log(
    `Doctor OK: Node ${pinned}, Chromium installed, deterministic config, writable local artifacts. No network used.`,
  );
} catch {
  console.error(`Doctor failed at ${step}. Values are not printed.`);
  process.exitCode = 1;
}
