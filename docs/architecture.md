# Architecture

M1 implements a test-focused modular monolith. There is no application, database, deployed service, or local ecommerce server. The original rationale remains: separate orchestration from reusable boundaries without inventing a platform.

## Modules and dependency direction

| Module                      | Responsibility                                                      | Allowed direction                                            |
| --------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| `src/config/`               | Immutable validated environment settings and sanitized typed errors | Zod only; no UI, client, fixtures, or specs                  |
| `src/api/contracts/`        | Pure synthetic product-list schema and types                        | Zod and safe error type; never HTTP, fixtures, or assertions |
| `src/api/product-client.ts` | Fixed read-only endpoint operation, status and response validation  | Injected narrow transport, pure contract, errors             |
| `src/data/`                 | Fresh synthetic payload builder and minimal static markup           | Pure contract types only                                     |
| `src/ui/`                   | One semantic-locator product-list abstraction                       | Injected Playwright page; no API or test assertions          |
| `src/fixtures/`             | Isolated lifecycle, network guard, UI/client composition            | Config, data, UI and API public boundaries                   |
| `tests/deterministic/`      | Scenario intent and boundary checks                                 | Fixtures/public modules; no support module imports specs     |
| `scripts/`                  | Preflight, network-denied execution and repository checks           | Tool/runtime boundaries, not domain behavior                 |

Tests → fixtures/abstractions → configuration/data/contracts. UI and API never import each other. Fixtures and data builders may import pure contract types directly, never through an API barrel that imports transport. `check:repository` checks key prohibited local-import directions; review remains necessary for semantic coupling and external imports.

## Narrow vertical slice

The UI scenario navigates to `https://fixture.invalid/products`, fulfilled entirely from hand-authored markup, and asserts the product name and price through accessible locators. This reserved invalid host is a synthetic fixture identifier, not a contacted service.

The API client requests the fixed path `/api/productsList` through an injected in-memory function. It checks status and parses a deliberately small consumer schema. No HTTP adapter exists in M1. This avoids accidental live requests and keeps testing at the actual client boundary; it does not verify Automation Exercise's schema.

Playwright fixtures compose these modules; a custom DI container, provider registry, broad page hierarchy, and shared assertions library would add no value to one scenario. Native Playwright assertions suffice.

## Deterministic execution and isolation

A single Playwright project selects only `tests/deterministic/**/*.spec.ts`. Configuration accepts deterministic mode only; live and unknown framework keys fail closed. `test:live` is an explicit rejection command, not a hidden integration suite.

The npm test wrapper installs a Node preload that denies socket creation and fetch, including inherited worker processes. Chromium contexts are offline, service workers are blocked, DNS resolution is disabled by launch configuration, and browser routes fulfill only the synthetic document. Unexpected HTTP or WebSocket attempts are aborted and recorded; teardown fails even when scenario code catches the request error. The API uses no network transport.

These are controls against accidental outbound traffic in maintained tests, not a sandbox for hostile code: a contributor able to replace scripts can bypass them. CI reviews and repository permissions remain necessary. Tests prove Node and browser denial using reserved `.invalid` addresses without contacting live targets.

## Tooling decisions

Node 24.21.0 is the pinned LTS baseline. TypeScript 6.0.3 is the newest stable release within typescript-eslint's published `<6.1.0` support range; TypeScript 7 was deliberately not selected. Exact dependencies and integrity hashes are in the lockfile. Prettier is the single formatting solution; Zod handles both configuration and response boundaries.

Build compiles only reusable support and emits declarations into `dist/`. This verifies module emission and the extension-rewrite path in addition to no-emit type checking. Tests execute TypeScript through Playwright; doctor uses Node's native TypeScript stripping for the configuration module. No extra TS runtime dependency is needed.

Built-in list/HTML reporters and failure-only trace/screenshot capture supply diagnostics for synthetic contexts. Video and CI uploads are off. See [security](security.md) for retention and publication controls.

The latest authorization explicitly moves deterministic GitHub Actions into M1; expanded evidence and live workflows remain later work. The job installs from the lockfile, installs Chromium, and runs the same `npm run validate` as local use. See [standards](engineering-standards.md) and [roadmap](roadmap.md).
