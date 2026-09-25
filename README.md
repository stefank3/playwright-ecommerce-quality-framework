# Playwright Ecommerce Quality Framework

[![Deterministic quality](https://github.com/stefank3/playwright-ecommerce-quality-framework/actions/workflows/deterministic.yml/badge.svg)](https://github.com/stefank3/playwright-ecommerce-quality-framework/actions/workflows/deterministic.yml)

A production-style end-to-end test automation framework built with [Playwright](https://playwright.dev/) and strict TypeScript. It validates core e-commerce behaviour across browser and API layers while keeping fast, deterministic CI checks separate from explicitly authorized live testing.

The framework covers product discovery, search, cart operations, quantities, prices and totals, together with typed product, brand and search APIs. Its architecture uses focused page objects, schema-validated API contracts, isolated fixtures, fail-closed configuration, network safety controls and actionable Playwright reports.

Automatic CI runs 49 deterministic tests without contacting external applications. A separate manual lane runs nine UI and API scenarios against the shared [Automation Exercise](https://automationexercise.com/) practice site with one worker, zero retries, bounded traffic and strict target allowlisting.

## What this framework demonstrates

- Maintainable UI automation through focused page and component objects.
- Typed API testing with runtime schema validation and sanitized failures.
- Deterministic CI with synthetic fixtures and enforced network isolation.
- Controlled live testing with explicit opt-in, traffic budgets and reports.
- Cross-platform setup for Windows and Linux development environments.

## Start locally

**Study this framework:** [Code walkthrough](docs/code-walkthrough.md) · [Interview guide](docs/interview-guide.md) · [Technical workbook](guide/Playwright-Ecommerce-Quality-Framework-Guide.md) · [Download PDF](guide/Playwright-Ecommerce-Quality-Framework-Guide.pdf). The [generation contract](docs/extending.md#study-guide-and-pdf-generation) explains how to reproduce the PDF.

Use **Node 24.21.0 LTS** (`.node-version`) and npm 11. From the repository root, in PowerShell or Bash:

```sh
npm ci
npx playwright install chromium
npm run validate
npm run report
```

On Linux, use `npx playwright install --with-deps chromium` for required system libraries. Setup downloads need network access; deterministic tests deny outbound application traffic. No application server, credentials or environment file is required. See [setup](docs/setup.md) for clone/branch instructions.

## Two testing lanes

| Lane            | Scenario examples                                                                                   | Execution                                           |
| --------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Deterministic   | Controlled catalog UI/API, malformed contracts, live configuration rejection, transport guard tests | `npm test`; required `npm run validate`; push/PR CI |
| Manual live UI  | Product search; two-product cart with prices/quantities/totals; quantity three; removal             | `npm run test:live:ui` with opt-in                  |
| Manual live API | Products, brands, known search, unsupported method and missing search parameter                     | `npm run test:live:api` with opt-in                 |

Live tests use one worker, zero retries, exact HTTPS host/path allowlists, one-second request spacing, at most 100 dispatches and a five-minute limit. Third-party resources are blocked. Read the [dated policy check, authorization and limitations](docs/live-testing.md) before running. Do not overlap local and CI live runs.

PowerShell, when a live run is authorized:

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

`test:live:list` makes no target requests. Live execution is never included in `npm test`, `validate`, push or PR CI. The separate live workflow requires manual dispatch and acknowledgment; no schedule exists.

## Architecture and technology choices

- A test-focused modular monolith keeps specs, fixtures, page objects, pure contracts and transport separate; there is no separate ecommerce application or backend.
- Playwright provides Chromium automation, native assertions, isolation and HTML reports. Small products/detail/cart objects encapsulate provider interactions; specs own assertions.
- TypeScript 6.0.3 matches the pinned lint parser's supported range. Type-aware ESLint rejects unawaited assertions; Prettier owns formatting.
- Zod checks consumed response fields while accepting additive provider fields. HTTP status and provider response codes remain distinct.
- Deterministic Node/browser denial and explicit live routing make lane selection fail closed. These are safety controls for maintained tests, not a hostile-code sandbox.
- Exact dependencies and lockfile installation keep the baseline reproducible; M2 adds no dependency.

## Commands and evidence

| Command               | Purpose                                                                                            |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| `npm run doctor`      | Offline runtime/browser/config/output preflight                                                    |
| `npm run validate`    | Formatting, type-aware lint, strict typing, deterministic tests, clean build and repository checks |
| `npm run test:list`   | Deterministic discovery                                                                            |
| `npm run test:debug`  | Guarded Playwright Inspector; direct unguarded CLI/IDE execution fails closed                      |
| `npm run build`       | Safely clear and compile reusable support to ignored dist                                          |
| `npm run report`      | Open `playwright-report/deterministic/index.html` on loopback                                      |
| `npm run report:open` | Open `playwright-report/live/index.html` on loopback                                               |

Reports are generated locally, not committed. Live failure evidence is sanitized status/timing/traffic data; raw live traces, screenshots and cookies are not captured. Ctrl+C stops the report server. See [live execution evidence](docs/live-testing.md) for actual results and limitations, not a guarantee of future passes.

Two complete live runs passed on 2026-09-24. The canonical supported-runtime run used **Node 24.21.0: 9 passed (5 API + 4 UI), 33,471.642 ms, 31 outbound dispatches**; the image below represents this first run. Stefan later performed an additional authorized PowerShell owner-verification run: **9 passed on Node 24.13.0**, which is outside the supported baseline and is not canonical runtime or clean-install evidence. Subsequent clean deterministic validation on required Node 24.21.0 passed **49 tests**. Live tests remain manual and explicitly opt-in; no additional live run is required. See [runtime, traffic and artifact provenance](docs/live-testing.md) for details. The curated image contains no target page, cookies or response data.

![Playwright report: nine live tests passed on 2026-09-24](docs/assets/live-report.png)

The shared public target can change selectors, products, prices or availability. Blocked ads/images/fonts mean these checks do not establish visual fidelity. Accessibility, Firefox/WebKit, account lifecycle and checkout remain deferred. MIT is intended, but no `LICENSE` exists and no open-source license has been granted; GitHub platform rights to view and fork still apply.

## Documentation

[Setup](docs/setup.md) · [Running/debugging](docs/running-tests.md) · [Live testing](docs/live-testing.md) · [Extending](docs/extending.md) · [Troubleshooting](docs/troubleshooting.md)

[Architecture](docs/architecture.md) · [Test strategy](docs/test-strategy.md) · [Standards](docs/engineering-standards.md) · [Security](docs/security.md) · [Roadmap](docs/roadmap.md) · [Agent governance](AGENTS.md) · [Reviewer contract](CLAUDE.md)
