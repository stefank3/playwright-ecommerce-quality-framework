# Manual live testing

Automation Exercise is an externally controlled shared practice site. M2 covers four UI cases (product search, two-product cart, quantity three, removal) and five API cases (products, brands, search, unsupported method, missing search parameter). There are no account, contact, newsletter, review, checkout, payment, order, invoice or deletion-of-account flows.

## Authorization and policy check

On 2026-09-24, read-only preparation checked [robots.txt](https://automationexercise.com/robots.txt) and the candidate [Terms path](https://automationexercise.com/terms-and-conditions). Both returned HTTP 302 to `/`, not policy text. Inspected products/detail pages exposed no Terms link. The [provider API documentation](https://automationexercise.com/api_list) explicitly describes practice operations, but is not a substitute for Terms. No conflicting restriction was identified; policy text itself could not be verified. The bounded run relies on Stefan's explicit current authorization, not inferred permission from a missing page. Re-check policy and authorization before future manual runs.

Preparation made eight direct site requests (four initial checks and four follow-up policy/script inspections), each spaced at least one second, plus the separately disclosed browser lookup of provider documentation. Stefan explicitly accepts this disclosed preparation traffic. It is separate from both complete-suite runs and is not included in their aggregate traffic. No accounts or persistent data were created.

## Run deliberately

Any future live run remains separately authorized and should use required Node 24.21.0. No additional live run is required for closure. Install the pinned runtime/dependencies/browser using [setup](setup.md). Complete `npm run validate` with no live variables first. Only with future live authorization, in PowerShell:

```powershell
$env:QE_LIVE = 'true'
$env:QE_BASE_URL = 'https://automationexercise.com'
npm run test:live:list
npm run test:live
Remove-Item Env:QE_LIVE, Env:QE_BASE_URL
npm run report:open
```

Bash:

```sh
QE_LIVE=true QE_BASE_URL=https://automationexercise.com npm run test:live:list
QE_LIVE=true QE_BASE_URL=https://automationexercise.com npm run test:live
npm run report:open
```

`test:live:ui` and `test:live:api` select the corresponding subset; they are real requests, not debugging previews. Listing performs no target requests but still validates opt-in. Direct runner/IDE live execution is rejected. Automatic commands (`npm test`, `validate`, push and PR workflows) never select live specs. Remove live variables before deterministic commands; unknown framework keys fail closed.

## Boundaries and traffic

- Only exact HTTPS `automationexercise.com` and `www.automationexercise.com` hosts; base origins reject credentials, fragments, ports, encoded/subdomain tricks, paths and query strings.
- Browser GET paths: `/products` (optionally the fixed Blue Top search), `/product_details/1`, `/view_cart`, `/add_to_cart/1`, `/add_to_cart/2` (optional quantity 3), `/delete_cart/1`. Only first-party static CSS/JS are eligible assets; subscription scripts, images, fonts, WebSockets and third-party resources are blocked.
- API operations are fixed: GET products/brands, POST search with fixed public product term, POST products to verify rejection, and POST search without its required parameter. No arbitrary endpoint/form interface is exposed. HTTP status and provider `responseCode` are asserted separately.
- Shared run counter: at most 100 outbound dispatches including redirects/assets, at least one second between dispatches, five-minute run cap, one worker, no automatic retries. Asset cache hits and blocked requests are counted separately. A safety stop is sticky; one failure stops further scenarios to avoid restarting the worker/budget.
- Fresh browser/request contexts isolate each test's cart/cookies. Redirects are checked before each API dispatch and each browser routed request. HTTP 401/403/429 or challenge-page evidence stops traffic. Never bypass challenges or expand limits to obtain a pass.
- Local runs use a lock; manual workflow runs share a concurrency group. There is no distributed local/CI lock: the operator must not overlap the two. A manually dispatched workflow is not dispatched by this implementation task.

## Evidence and limitations

Live HTML: `playwright-report/live/index.html`; sanitized numeric summary/failure evidence: `test-results/live/summary.json`. `npm run report:open` serves the HTML on loopback; Ctrl+C stops it. Traces, screenshots, videos, raw response bodies and browser error context are disabled in the live lane. Reporter errors are reduced to categories before HTML output; only fixed scenario titles, status, durations and numeric traffic attachments are retained. This trades diagnostic detail for safe public CI artifacts. Review before sharing any artifact.

The separate `Manual live Automation Exercise` workflow is `workflow_dispatch` only, with explicit acknowledgment, fixed target, pinned actions, read-only permissions, bounded job duration and seven-day sanitized artifact retention. Deterministic CI remains the automatic gate. Local diagnostics must be deleted within seven days.

The site may change product names/prices, DOM or availability. Blocked ads/images/fonts make this functional evidence, not visual fidelity. No automated accessibility or cross-browser claim is made. The guards protect maintained test code against mistakes, not hostile code or arbitrary native modules.

## Executed evidence — 2026-09-24

Two complete successful live-suite runs occurred. The first is the canonical supported-runtime validation; the second is Stefan's explicitly authorized manual owner verification. Each passed 9 tests (5 API and 4 UI), with zero failures, skips or retries. No account, persistent user content, order or payment was created.

| Evidence                    | First run — canonical validation                                  | Second run — owner verification                                                                    |
| --------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Initiator                   | Codex under Stefan's implementation authorization                 | Stefan manually from PowerShell                                                                    |
| Runtime                     | Node 24.21.0; supported npm 11.x baseline                         | Node 24.13.0; npm 11.6.2                                                                           |
| Installation meaning        | Canonical supported-runtime live validation                       | Dependencies and Chromium already installed; not a clean installation                              |
| Timing                      | 2026-09-24                                                        | Approximately 12:27–12:28 +0200 on 2026-09-24                                                      |
| Artifact duration           | 33,471.642 ms                                                     | 33,550.921 ms; console approximately 33.6 seconds                                                  |
| API / UI tests              | 5 passed / 4 passed                                               | 5 passed / 4 passed                                                                                |
| Failures / skips / retries  | 0 / 0 / 0                                                         | 0 / 0 / 0                                                                                          |
| Sent / blocked / cache hits | 31 / 170 / 91                                                     | 31 / 170 / 91                                                                                      |
| Artifact provenance         | Committed `docs/assets/live-report.png` represents this first run | Ignored local HTML report and `test-results/live/summary.json` currently represent this second run |

Node 24.13.0 does not satisfy the repository's required Node 24.21.0 baseline. The second run is accepted as owner verification only, not clean-install or supported-runtime validation. Stefan explicitly confirmed its initiator, authorization and PowerShell timing; the console output and artifact timings match the second run identified by Claude. It was not an unexplained or unauthorized Codex execution. The current ignored summary independently corroborates the second duration, results and traffic; runtime and initiator are attributed to Stefan's confirmation.

Aggregate complete-suite evidence: **2 complete suites, 18 test executions, 0 failures, 0 skips, 0 retries; 62 sent requests, 340 blocked requests, 182 cache hits**. Per-run counters include the five API sends and dispatched browser documents/assets/cart operations; blocked/cache-hit requests caused no outbound dispatch. The eight direct preparation requests and separate documentation browser lookup remain outside these totals.

The following scenario durations belong to the first, canonical run:

| Scenario                     | Result | Duration  |
| ---------------------------- | ------ | --------- |
| Products API                 | Passed | 1,090 ms  |
| Brands API                   | Passed | 363 ms    |
| Search API                   | Passed | 1,450 ms  |
| Unsupported method API       | Passed | 502 ms    |
| Missing search parameter API | Passed | 973 ms    |
| Product search UI            | Passed | 15,715 ms |
| Multiple-product cart UI     | Passed | 3,868 ms  |
| Quantity UI                  | Passed | 3,123 ms  |
| Removal UI                   | Passed | 4,091 ms  |

The deterministic gate passed 49 tests with no skips/retries, plus doctor, formatting, type-aware lint, strict typing, clean build and repository checks. Live discovery listed exactly nine cases without traffic; missing opt-in and malicious-host rejection returned exit 1. An in-memory lint probe confirmed an unawaited Playwright assertion is rejected by no-floating-promises. Initial process-sandbox spawn failures and an overlapping install/discovery probe were environment/validation-order issues; final sequential checks passed after clean installation.

### Subsequent supported-runtime clean validation

After the second live run, Stefan activated **Node 24.21.0 and npm 11.19.0** and reported the following clean deterministic validation:

| Command / evidence                | Result                                            |
| --------------------------------- | ------------------------------------------------- |
| `npm ci`                          | Passed; 103 packages installed                    |
| `npx playwright install chromium` | Completed                                         |
| `npm run doctor`                  | Passed                                            |
| `npm run format:check`            | Passed                                            |
| `npm run lint`                    | Passed                                            |
| `npm run typecheck`               | Passed                                            |
| `npm test`                        | 49 passed; no failures or skips reported          |
| `npm run build`                   | Passed                                            |
| `npm run check:repository`        | Passed; 64 maintained files and 70 relative links |

This confirms clean installation and framework health under the supported runtime. It did not contact Automation Exercise and did not replace or repeat the live suite. No third live run occurred. This documentation correction executes no live command or target request and leaves generated/ignored artifacts untouched.

The [curated README image](assets/live-report.png) remains the first run's report capture. It was rendered offline and inspected, and includes only scenario names/status/timing. It is unchanged by the evidence correction; the ignored report/summary now represent Stefan's second run. No full report, trace, browser binary or dependency directory is committed. The [review disposition](roadmap.md) records Claude's original `CHANGES REQUIRED` verdict and effective `APPROVE WITH NON-BLOCKING RISKS` after Stefan resolved M-1. No implementation change or additional live run is required.
