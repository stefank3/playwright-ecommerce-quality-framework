export type FailureKind =
  'configuration' | 'transport' | 'contract' | 'network';

/** Safe boundary failure; messages never include raw external input or payloads. */
export class FrameworkError extends Error {
  readonly kind: FailureKind;

  /** Create a classified failure with a developer-authored safe message. */
  constructor(kind: FailureKind, message: string) {
    super(message);
    this.name = 'FrameworkError';
    this.kind = kind;
  }
}
