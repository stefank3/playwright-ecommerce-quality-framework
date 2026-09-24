import type {
  Reporter,
  TestCase,
  TestResult,
  TestError,
  TestStep,
  FullResult,
} from '@playwright/test/reporter';
import { writeFileSync } from 'node:fs';
import { sanitizeFailure } from '../config/sanitize-failure.ts';

/** Scrub provider values before downstream HTML/JSON reporters receive any failure evidence. */
export default class LiveReporter implements Reporter {
  private results: {
    title: string;
    status: string;
    durationMs: number;
    traffic: unknown;
  }[] = [];
  /** Replace raw diagnostics with a category inferred without retaining their contents. */
  private scrub(error: TestError): void {
    sanitizeFailure(error);
  }
  /** Scrub individual failed steps before built-in reporters observe them. */
  onStepEnd(_test: TestCase, _result: TestResult, step: TestStep): void {
    if (step.error) this.scrub(step.error);
  }
  /** Keep only numeric traffic attachments and sanitized errors; discard stdout/stderr. */
  onTestEnd(test: TestCase, result: TestResult): void {
    result.errors.forEach((error) => this.scrub(error));
    result.stdout = [];
    result.stderr = [];
    result.attachments = result.attachments.filter(
      (item) => item.name === 'traffic',
    );
    const traffic: unknown = JSON.parse(
      result.attachments[0]?.body?.toString() ?? '{}',
    );
    this.results.push({
      title: test.title,
      status: result.status,
      durationMs: result.duration,
      traffic,
    });
  }
  /** Sanitize runner-level errors too. */
  onError(error: TestError): void {
    this.scrub(error);
  }
  /** Save a compact run-owned diagnostic with no requests, cookies, bodies, or environment values. */
  onEnd(result: FullResult): void {
    writeFileSync(
      'test-results/live/summary.json',
      JSON.stringify(
        {
          status: result.status,
          durationMs: result.duration,
          results: this.results,
        },
        null,
        2,
      ) + '\n',
    );
  }
}
