type MutableError = {
  message?: string;
  stack?: string;
  snippet?: string;
  value?: string;
  cause?: unknown;
  errorContext?: string;
};

/** Remove raw diagnostics in the worker before artifact collection and again before reporting. */
export function sanitizeFailure(error: MutableError): void {
  const text = error.message ?? '';
  const category = /Timeout|timed out/i.test(text)
    ? 'timeout (selector/network/environment needs triage)'
    : /expect\(/.test(text)
      ? 'assertion mismatch'
      : /safety stop|blocked|redirect/.test(text)
        ? 'network policy'
        : /transport|JSON/.test(text)
          ? 'transport/response'
          : 'framework or provider (needs triage)';
  if (!text.startsWith('Live failure:'))
    error.message = `Live failure: ${category}. Raw values withheld; inspect the scenario and numeric traffic evidence.`;
  delete error.stack;
  delete error.snippet;
  delete error.value;
  delete error.cause;
  delete error.errorContext;
}
