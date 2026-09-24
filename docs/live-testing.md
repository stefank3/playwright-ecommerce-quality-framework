# Manual live testing

Automation Exercise is an externally controlled shared practice site. M2 covers four UI cases (product search, two-product cart, quantity three, removal) and five API cases (products, brands, search, unsupported method, missing search parameter). There are no account, contact, newsletter, review, checkout, payment, order, invoice or deletion-of-account flows.

## Authorization and policy check

On 2026-09-24, read-only preparation checked [robots.txt](https://automationexercise.com/robots.txt) and the candidate [Terms path](https://automationexercise.com/terms-and-conditions). Both returned HTTP 302 to `/`, not policy text. Inspected products/detail pages exposed no Terms link. The [provider API documentation](https://automationexercise.com/api_list) explicitly describes practice operations, but is not a substitute for Terms. No conflicting restriction was identified; policy text itself could not be verified. The bounded run relies on Stefan's explicit current authorization, not inferred permission from a missing page. Re-check policy and authorization before future manual runs.

Preparation made eight direct site requests (four initial checks and four follow-up policy/script inspections), each spaced at least one second, plus the documentation browser lookup. These are separate from the one completed-suite validation allowance. No accounts or persistent data were created.

## Run deliberately

Install the pinned runtime/dependencies/browser using [setup](setup.md). Complete `npm run validate` with no live variables first. Then, in PowerShell:

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

One complete `npm run test:live` run, no retries or focused reruns: **9 passed, 0 failed, 0 skipped, 0 unexecuted; 33,471.642 ms**. API: 5/5 passed. UI: 4/4 passed. Final cumulative traffic: **31 outbound dispatches, 170 blocked browser requests, 91 static-asset cache hits**. These counters include the five API sends and all dispatched browser documents/assets/cart operations; blocked/cache-hit requests caused no outbound dispatch. Preparation requests listed above are separate. No account, persistent user content, order or payment was created.

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

The [curated README image](assets/live-report.png) shows the actual passing report. It was captured from generated local HTML through an offline intercepted document, inspected for content, and includes only scenario names/status/timing. No full report, trace, browser binary or dependency directory is committed. M2 remains unmerged and awaits independent review of its PR.
