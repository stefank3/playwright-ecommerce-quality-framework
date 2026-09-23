import { z } from 'zod';
import { FrameworkError } from './errors.ts';

const schema = z.object({
  QE_MODE: z.literal('deterministic').default('deterministic'),
  QE_TIMEOUT_MS: z.coerce.number().int().min(1000).max(30000).default(30000),
});

export type RuntimeConfig = Readonly<{
  mode: 'deterministic';
  timeoutMs: number;
  artifactRoot: 'test-results';
}>;

/**
 * Validate only framework-owned environment keys; never echo rejected values.
 * @param environment Environment map, normally process.env.
 * @returns Immutable deterministic settings.
 * @throws FrameworkError for unknown QE_ keys, invalid values, or live mode.
 */
export function readConfig(
  environment: Readonly<Record<string, string | undefined>>,
): RuntimeConfig {
  const allowed = new Set(['QE_MODE', 'QE_TIMEOUT_MS']);
  if (
    Object.keys(environment).some(
      (key) => key.startsWith('QE_') && !allowed.has(key),
    )
  ) {
    throw new FrameworkError(
      'configuration',
      'Unknown framework environment key.',
    );
  }
  const result = schema.safeParse(environment);
  if (!result.success) {
    throw new FrameworkError(
      'configuration',
      'Invalid deterministic configuration.',
    );
  }
  return Object.freeze({
    mode: result.data.QE_MODE,
    timeoutMs: result.data.QE_TIMEOUT_MS,
    artifactRoot: 'test-results',
  });
}
