# Running, debugging, and evidence

Run `npm run validate` for the primary local/CI gate. It runs doctor, formatting, linting, type checking, deterministic tests, support compilation and repository checks. A nonzero result stops the sequence. Run the failing individual command after fixing the cause, then repeat the full gate before handoff.

`npm test` and `npm run test:deterministic` select only the deterministic project. `npm run test:list` verifies discovery without execution. `npm run test:debug` launches the same guarded suite in Playwright Inspector; choose a step/test there. For a focused rerun, use `npm test -- --grep "read-only UI"`; the wrapper forwards only the pattern and keeps lane/network controls active. Runner flags that could override config/project are rejected.

## Tests and what they prove

| Test group         | Evidence                                                                                                                                       |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Product UI         | The reusable page abstraction and role/name locators read one product name and price from controlled markup                                    |
| Product API        | The client validates a synthetic successful listing and exposes expected typed data                                                            |
| Configuration      | Deterministic immutable defaults; rejection of live mode, unknown keys, nonnumeric and out-of-range timeouts                                   |
| Response contracts | Missing fields, empty listing and wrong ID types fail at the runtime boundary                                                                  |
| Client failures    | Fixed endpoint use; transport exceptions are sanitized; non-success status is rejected before payload acceptance                               |
| Data isolation     | Builders return independent mutable instances                                                                                                  |
| Network denial     | Node fetch and Playwright APIRequestContext are rejected before transport; unexpected browser navigation and WebSockets are denied and audited |

All data is synthetic. There are no skipped, quarantined, live, accessibility, cross-browser, account, or checkout tests. Tests are framework/consumer-contract evidence, not provider-certified contracts or proof of product correctness. Zero retries means a failure stays visible.

## Artifacts and shutdown

Built-in list output describes the run. HTML output goes to ignored `playwright-report/`; test diagnostics go to ignored `test-results/`. Failure-only traces and screenshots are configured for synthetic contexts; video is off. `dist/` contains build output, not a deployable app.

Use `npm run report` to inspect an existing report on loopback. Stop its server with Ctrl+C. Traces can contain DOM and network payloads: do not share them without review. Delete local diagnostics within seven days; CI uploads are disabled. See [security](security.md).

CI performs the same install/browser setup and `npm run validate`. Network is permitted for setup downloads, then test traffic is blocked by the maintained runner/browser policy. The policy is not a hostile-code sandbox. No workflow or command should silently fall back to live execution.
