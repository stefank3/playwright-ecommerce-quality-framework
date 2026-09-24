# Engineering standards

Shared contract for [AGENTS.md](../AGENTS.md) and [CLAUDE.md](../CLAUDE.md). M2 extends the command contract; historical evidence remains in [roadmap](roadmap.md).

## Code and boundaries

Use strict TypeScript, `noUncheckedIndexedAccess`, exact optional properties, and checked overrides. Prefer `unknown` plus runtime validation; unexplained `any`, unchecked casts, and broad suppression are prohibited. Parse external inputs before effects and return safe typed errors. Do not log rejected environment values, upstream bodies, or credentials. Defaults are deterministic and failures cannot select live execution.

Follow [architecture](architecture.md): specs orchestrate, fixtures compose, UI/API expose narrow public behavior, configuration and data remain independent of transport. Names use kebab-case files, PascalCase types/classes, and camelCase functions. Avoid mutable global state and speculative abstractions.

Target 150–250 lines per source file; shorter cohesive files are fine. Review above 350 lines and require written justification above 450. No source file needs a size exception. Type-aware linting enables `no-floating-promises` (including discarded void promises) and `await-thenable`; Playwright assertions must be awaited.

## Documentation and comments

Exported functions, named helpers, fixture factories, and non-obvious callbacks require concise TSDoc. Obvious inline anonymous callbacks are exempt. Public APIs document purpose, parameters, return, relevant errors, side effects, and constraints in proportion to their responsibility. Comments explain why rather than syntax. One local ESLint exception permits Playwright's required empty fixture-parameter destructuring; it is explained at the call site.

## Dependency gate and selected versions

| Dependency              | Version          | Rationale / license                                                               |
| ----------------------- | ---------------- | --------------------------------------------------------------------------------- |
| Node.js                 | 24.21.0 LTS      | Supported runtime, native TS stripping; official distribution                     |
| `@playwright/test`      | 1.63.0           | Runner, Chromium automation, fixtures, assertions and reporting; Apache-2.0       |
| `typescript`            | 6.0.3            | Strict types and support compilation; compatible with the lint parser; Apache-2.0 |
| `eslint` / `@eslint/js` | 10.11.0 / 10.0.1 | Static checks and base rules; MIT                                                 |
| `typescript-eslint`     | 8.70.1           | TypeScript-aware linting; MIT                                                     |
| `prettier`              | 3.9.9            | One consistent formatter; MIT                                                     |
| `zod`                   | 4.6.5            | Runtime schemas at config and API boundaries; MIT                                 |
| `@types/node`           | 24.13.6          | Types matching Node's supported major; MIT                                        |

Direct dependencies are exact-pinned; transitive versions/integrity are locked. Review additions for purpose, alternatives, maintenance, license, known advisories, install scripts, default telemetry/analytics, and compatibility. Disable telemetry or reject the dependency. The selected tools require no telemetry service; deterministic execution blocks outbound Node/browser transport. npm lifecycle scripts are disabled in `.npmrc`; the official Playwright browser installer is a separate explicit setup step. Do not weaken script policy to fix installation casually.

Node's current installed system version need not change: a version manager or separate official runtime can select `.node-version`. Doctor requires the exact pinned patch so evidence and CI agree. npm 11 is required. Updates require a scoped review and full validation; do not introduce TypeScript 7 until the lint integration supports it.

## Command contract

| Command                                    | Implemented behavior                                                      |
| ------------------------------------------ | ------------------------------------------------------------------------- |
| `npm ci`                                   | Exact lockfile installation, install scripts disabled                     |
| `npm run doctor`                           | Offline runtime/browser/configuration/artifact-path preflight             |
| `npm run format:check`                     | Non-mutating formatting check                                             |
| `npm run lint`                             | ESLint with zero warning tolerance                                        |
| `npm run typecheck`                        | Strict no-emit checks for support, specs, config                          |
| `npm test` / `npm run test:deterministic`  | Guarded deterministic Playwright suite                                    |
| `npm run build`                            | Compile support and declarations to ignored `dist/`                       |
| `npm run check:repository`                 | Text encoding/links, source-size and selected dependency-direction checks |
| `npm run validate`                         | All primary checks, including tests/build, in a fail-fast sequence        |
| `npm run test:list` / `npm run test:debug` | Guarded discovery / local Inspector                                       |
| `npm run report`                           | Serve an existing HTML report on loopback; Ctrl+C stops it                |
| `npm run test:live`                        | Explicitly opted-in, restrained live suite; never part of validate        |
| `npm run test:live:list`                   | Validate opt-in and list the nine live cases without requests             |
| `npm run test:live:ui` / `test:live:api`   | Execute only the selected live subset under the same controls             |
| `npm run report:open`                      | Open the sanitized live report on loopback                                |

A future accessibility command remains deferred. No application-start command applies. `npm run format` is the mutating formatter. Automatic CI runs installation and `validate` only. The separate manual live workflow requires acknowledgment and uploads only sanitized report/summary. [Live testing](live-testing.md) owns the operational controls and commands.

Record actual check results rather than interpreting designed commands as passing. See [setup](setup.md), [running tests](running-tests.md), [extension](extending.md), and [troubleshooting](troubleshooting.md). M1 validation evidence belongs to its PR; a Claude verdict is never invented.
