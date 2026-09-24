# Running, debugging and evidence

`npm run validate` is the fail-fast local/automatic CI gate: doctor, format check, lint, strict typing, deterministic tests, clean support build and repository checks. Live execution is separate and manual; see [live testing](live-testing.md).

## Supported commands

- `npm test` or `npm run test:deterministic`: controlled scenarios and boundary checks.
- `npm run test:list`: deterministic discovery without execution.
- `npm run test:debug`: guarded Playwright Inspector; close it when finished.
- `npm test -- --grep "read-only UI"`: focused deterministic selection.
- `npm run test:live:list`: list the live suite after explicit opt-in, no requests.
- `npm run test:live`, `test:live:ui`, `test:live:api`: real external requests under the bounded policy.

Direct `npx playwright test`, UI mode and IDE execution without the required preload fail closed. Runner/config overrides are rejected by wrappers. Missing `await` on a Playwright assertion is a lint error. Default tests never silently select live mode; clear live QE_ variables before running them.

## Reports and artifacts

Deterministic HTML lives at `playwright-report/deterministic/index.html`; `npm run report` opens it on loopback. Synthetic failure traces/screenshots live under `test-results/deterministic/`. Live HTML is `playwright-report/live/index.html`; use `npm run report:open`. Numeric sanitized live failure/results summary is `test-results/live/summary.json`. Ctrl+C stops either report server.

Generated output is ignored. Separate directories keep later deterministic validation from erasing live evidence. Delete local diagnostics within seven days and inspect before sharing. No raw live traces/screenshots/video or browser error context are captured. Manual CI uploads only sanitized live HTML/summary for seven days; automatic CI uploads nothing. See [security](security.md).

## Failure handling

Run the failed deterministic command after correcting its cause, then the full gate before handoff. Live runs use one worker, zero retries and fail-fast to prevent renewed traffic after errors. Record the failure category and unexecuted cases rather than treating them as passes. Do not rerun a complete live suite repeatedly; a focused rerun needs a concrete framework correction and the same controls.
