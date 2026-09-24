import { setTimeout } from 'node:timers/promises';
import { FrameworkError } from '../config/errors.ts';

/** One worker owns a shared run budget. A stop is sticky across every subsequent request. */
export class LiveBudget {
  readonly started = Date.now();
  sent = 0;
  blocked = 0;
  cached = 0;
  private last = 0;
  private stopped = false;
  private queue: Promise<void> = Promise.resolve();

  /** Serialize dispatches with at least one second spacing, at most 100 sends and five minutes. */
  async dispatch(): Promise<void> {
    const next = this.queue.then(async () => {
      if (
        this.stopped ||
        this.sent >= 100 ||
        Date.now() - this.started >= 300000
      )
        this.stop();
      await setTimeout(Math.max(0, 1000 - (Date.now() - this.last)));
      if (this.stopped || Date.now() - this.started >= 300000) this.stop();
      this.sent++;
      this.last = Date.now();
    });
    this.queue = next.catch(() => {});
    await next;
  }

  /** Stop the run on throttling, access denial, challenge, or budget exhaustion. */
  stop(): never {
    this.stopped = true;
    throw new FrameworkError(
      'network',
      'Live safety stop: budget, throttling, or access restriction.',
    );
  }

  /** Return numeric diagnostics only, never request URLs, cookies or payloads. */
  summary(): { sent: number; blocked: number; cached: number } {
    return { sent: this.sent, blocked: this.blocked, cached: this.cached };
  }
}
