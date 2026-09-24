import {
  existsSync,
  lstatSync,
  mkdirSync,
  realpathSync,
  writeFileSync,
  unlinkSync,
  readdirSync,
} from 'node:fs';
import { resolve, sep, join } from 'node:path';
import { FrameworkError } from './errors.ts';

/** Resolve a fixed output root before cleanup, rejecting links and escapes. */
export function safeOutput(
  name: 'test-results' | 'playwright-report' | 'dist',
): string {
  const root = realpathSync(process.cwd());
  const target = resolve(root, name);
  if (
    !target.startsWith(root + sep) ||
    (existsSync(target) && lstatSync(target).isSymbolicLink())
  ) {
    throw new FrameworkError(
      'configuration',
      'Output directory must be repository-local and not a link.',
    );
  }
  mkdirSync(target, { recursive: true });
  if (realpathSync(target) !== target)
    throw new FrameworkError(
      'configuration',
      'Output path resolves outside its intended location.',
    );
  rejectLinks(target);
  return target;
}

/** Reject nested links as well, before tools can follow them while writing artifacts. */
function rejectLinks(directory: string): void {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink())
      throw new FrameworkError(
        'configuration',
        'Nested output links are forbidden.',
      );
    if (entry.isDirectory()) rejectLinks(join(directory, entry.name));
  }
}

/** Validate writable output roots before tests; no network or user-supplied paths are used. */
export function checkTestOutputs(): void {
  for (const name of ['test-results', 'playwright-report'] as const) {
    const root = safeOutput(name);
    const probe = join(root, `.preflight-${process.pid}`);
    try {
      writeFileSync(probe, '', { flag: 'wx' });
      unlinkSync(probe);
    } catch {
      throw new FrameworkError(
        'configuration',
        'Output directory is not writable.',
      );
    }
  }
}
