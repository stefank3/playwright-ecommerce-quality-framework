# Playwright Ecommerce Quality Framework

A small, test-focused Playwright and strict TypeScript framework demonstrating repeatable QA automation without depending on a public demo site's availability.

**M1 foundation:** one controlled product-list UI scenario, one typed API scenario, configuration and contract checks, failure artifacts, and deterministic CI. Independent Claude review of the final M1 PR is the next gate. No live product behavior is claimed: Automation Exercise remains an externally controlled, uncontacted future target.

## Quick start

Use Node.js **24.21.0 LTS** (see `.node-version`) with npm 11. These commands work from the repository root in PowerShell and POSIX shells:

```sh
npm ci
npx playwright install chromium
npm run validate
```

Linux needs browser system libraries; use `npx playwright install --with-deps chromium` where package-manager privileges are available. Dependency installation and browser downloads need network access; deterministic tests do not. No environment file, credentials, application server, or live target is needed.

## Why these choices

- Playwright supplies browser automation, assertions, fixtures, and reports in one tool.
- Strict TypeScript catches development errors; Zod validates runtime configuration and responses.
- A modular monolith keeps reusable support under `src/` and scenarios under `tests/deterministic/`.
- Chromium and one worker keep the foundation bounded. Controlled markup and injected API responses make required checks repeatable.
- Prettier, ESLint, and a compiled support build provide a small, reproducible quality gate.

## Commands

| Command              | Purpose                                                               |
| -------------------- | --------------------------------------------------------------------- |
| `npm ci`             | Install exact lockfile dependencies; lifecycle scripts are disabled   |
| `npm run doctor`     | Verify pinned Node, browser binary, configuration, and artifact path  |
| `npm run lint`       | Lint maintained code                                                  |
| `npm run typecheck`  | Strict checks across support, tests, and configuration                |
| `npm test`           | Deterministic tests with Node network blocking                        |
| `npm run build`      | Compile reusable support and declarations into ignored `dist/`        |
| `npm run validate`   | Doctor, formatting, lint, typing, tests, build, and repository checks |
| `npm run test:list`  | Inspect deterministic discovery without running scenarios             |
| `npm run test:debug` | Local deterministic Playwright Inspector workflow                     |
| `npm run report`     | Open the last local HTML report; stop with Ctrl+C                     |

The live command intentionally exits with an error before any request. There are no live specs or live CI jobs. Automated accessibility, cross-browser coverage, account/checkout flows, and broader coverage are deferred. Controlled tests cannot prove the real site's selectors, availability, API contract, or accessibility.

MIT remains the intended license, but no `LICENSE` file exists. No open-source license has been granted; GitHub platform rights to view and fork still apply.

## Documentation

[Setup](docs/setup.md) · [Running and debugging](docs/running-tests.md) · [Extension](docs/extending.md) · [Troubleshooting](docs/troubleshooting.md)

[Architecture](docs/architecture.md) · [Test strategy](docs/test-strategy.md) · [Standards](docs/engineering-standards.md) · [Security](docs/security.md) · [Roadmap and review history](docs/roadmap.md) · [Agent governance](AGENTS.md) · [Claude review contract](CLAUDE.md)
