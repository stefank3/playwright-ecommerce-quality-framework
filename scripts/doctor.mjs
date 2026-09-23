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

try {
  const pinned = readFileSync(
    new URL('../.node-version', import.meta.url),
    'utf8',
  ).trim();
  if (process.versions.node !== pinned)
    throw new Error(`Use the pinned Node.js ${pinned} runtime.`);
  const config = readConfig(process.env);
  accessSync(chromium.executablePath(), constants.R_OK);
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
  console.error(
    'Doctor failed. Check pinned Node, Chromium installation, QE_ settings, and local artifact directory. Values are not printed.',
  );
  process.exitCode = 1;
}
