# Architecture

M2 extends the test-focused modular monolith with a separate manually selected live lane. There is no application, database, deployed service, or local ecommerce server. Separate orchestration from reusable boundaries without inventing a platform.

## Modules and dependency direction

| Module                      | Responsibility                                                     | Allowed direction                                                 |
| --------------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| `src/config/`               | Immutable settings, safe errors and output validation              | Zod/Node filesystem; no UI, client, fixtures or specs             |
| `src/api/contracts/`        | Pure product, brand and rejection schemas                          | Zod and safe error types; never transport, fixtures or assertions |
| `src/api/product-client.ts` | Fixed read-only endpoint operation, status and response validation | Injected narrow transport, pure contract, errors                  |
| `src/data/`                 | Fresh synthetic payload builder and minimal static markup          | Pure contract types only                                          |
| `src/ui/`                   | Controlled listing plus live products, detail and cart objects     | Injected Playwright page; no API or assertions                    |
| `src/fixtures/`             | Isolated lifecycle, network guard, UI/client composition           | Config, data, UI and API public boundaries                        |
| `tests/deterministic/`      | Scenario intent and boundary checks                                | Fixtures/public modules; no support module imports specs          |
| `scripts/`                  | Preflight, network-denied execution and repository checks          | Tool/runtime boundaries, not domain behavior                      |

Tests → fixtures/abstractions → configuration/data/contracts. UI and API never import each other. Fixtures and data builders may import pure contract types directly, never through an API barrel that imports transport. `check:repository` checks key prohibited local-import directions; review remains necessary for semantic coupling and external imports.

## Narrow vertical slice

The UI scenario navigates to `https://fixture.invalid/products`, fulfilled entirely from hand-authored markup, and asserts the product name and price through accessible locators. This reserved invalid host is a synthetic fixture identifier, not a contacted service.

The deterministic ProductClient still uses an injected in-memory response. LiveHttpTransport implements only five fixed provider operations over an isolated Playwright HTTP context, with checked redirects and an injected dispatch budget. Pure Zod contracts validate consumed fields and strip additive fields so harmless provider extensions do not fail tests. HTTP and provider statuses remain separate. No API implementation imports browser UI or fixtures.

Playwright fixtures compose these modules; a custom DI container, provider registry, broad page hierarchy, and shared assertions library would add no value to one scenario. Native Playwright assertions suffice.

## Deterministic execution and isolation

A deterministic config selects only `tests/deterministic/**/*.spec.ts`; a separate live config selects only `tests/live/**/*.spec.ts`. Unknown framework keys fail closed. Deterministic config and fixtures require an internal preload marker, so direct CLI/UI/VS Code invocation without the wrapper fails before discovery or execution. Live commands require their own wrapper and exact environment opt-in.

The deterministic wrapper preloads denial of fetch, HTTP/HTTPS, TLS/TCP, HTTP/2, WebSocket, DNS callback/promise/resolver APIs and UDP construction/send/connect, including worker inheritance. Chromium is offline with service workers and DNS blocked; routes fulfill only synthetic markup. Unexpected browser HTTP/WebSocket attempts are audited even when caught. These controls cover the tested Node built-ins, not native addons or hostile code.

In live mode the browser remains offline; approved requests are fetched by the route handler's HTTP context, then fulfilled. This keeps browser fallback traffic closed while allowing measured provider traffic. Static CSS/scripts are cached only for the run; session pages and cookies are never cached. Products, detail and cart objects encapsulate interactions, with assertions in specs. CSS is limited to unlabeled provider controls and stable product-row relationships. The worker-scoped budget is shared across UI/API tests; fail-fast prevents a fresh worker resetting it after failure. See [live policy](live-testing.md).

These are controls against accidental outbound traffic in maintained tests, not a sandbox for hostile code: a contributor able to replace scripts can bypass them. CI reviews and repository permissions remain necessary. Tests prove Node and browser denial using reserved `.invalid` addresses without contacting live targets.

## Tooling decisions

Node 24.21.0 is the pinned LTS baseline. TypeScript 6.0.3 is the newest stable release within typescript-eslint's published `<6.1.0` support range; TypeScript 7 was deliberately not selected. Exact dependencies and integrity hashes are in the lockfile. Prettier is the single formatting solution; Zod handles both configuration and response boundaries.

Build validates the fixed `dist/` path, rejects nested links, removes only that output, then compiles support/declarations. Every test wrapper checks both artifact roots before runner cleanup. Tests execute TypeScript through Playwright; offline preflight uses native Node type stripping. No new dependency is introduced in M2.

Synthetic failures retain traces/screenshots locally. Live trace/screenshot/video and error context are disabled; a small reporter sanitizes errors before built-in HTML output and emits numeric traffic evidence. Manual live CI uploads only this report/summary for seven days; deterministic CI uploads nothing. See [security](security.md).

Deterministic CI installs locked dependencies and Chromium, runs `npm run validate`, and rejects tracked changes and unexpected untracked files. A separate acknowledged workflow_dispatch live job cannot run on push, PR or schedule. See [standards](engineering-standards.md) and [roadmap](roadmap.md).
