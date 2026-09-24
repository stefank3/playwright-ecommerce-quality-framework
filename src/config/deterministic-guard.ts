import { FrameworkError } from './errors.ts';

/** Refuse direct runner/IDE execution without the network-denial preload in this process. */
export function requireDeterministicGuard(): void {
  if (
    Reflect.get(globalThis, Symbol.for('qe.deterministic-network-denied')) !==
    true
  ) {
    throw new FrameworkError(
      'configuration',
      'Required network guard missing. Use npm test or npm run test:debug.',
    );
  }
}
