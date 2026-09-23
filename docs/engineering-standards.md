# Engineering standards and future commands

This is the shared technical contract referenced by [AGENTS.md](../AGENTS.md) and [CLAUDE.md](../CLAUDE.md). The repository is planning-only. All rules below describe future implementation unless explicitly describing document review. See [roadmap](roadmap.md) for approval gates.

## Code and boundaries

Use strict TypeScript. Prefer `unknown` plus validation at external boundaries; unexplained `any`, unchecked casts, and broad error suppression are prohibited. Any unavoidable escape hatch needs a narrow scope, written reason, and compensating validation. Parse environment variables, mode, URLs, payloads, and artifact paths before side effects. Reject invalid values with safe typed errors.

Use discriminated error categories for configuration, transport, contract, and lifecycle failures; retain a useful sanitized cause. Do not attach raw headers, bodies, or credentials to an error. Keep Playwright assertion failures recognizable and preserve context rather than catch-and-ignore failures. Default to deterministic execution; missing live opt-in, invalid origin, or exhausted budget fails closed.

Follow [architecture dependency direction](architecture.md). Use descriptive kebab-case filenames, PascalCase types/classes, and camelCase functions/variables. Specs should describe behavior; support names should describe responsibilities. Avoid global mutable state, unrelated helpers, speculative interfaces, and inheritance hierarchies. Extract a shared abstraction when it clarifies demonstrated reuse, not anticipated scale.

Target 150–250 lines per source file, review files above 350 lines, and require explicit written justification above 450. These are maintainability signals, not minimum sizes or a reason to split cohesive code artificially.

## Documentation in code

Exported functions, named helpers, fixture factories, and non-obvious callbacks require concise TSDoc proportional to their responsibility. Obvious inline anonymous callbacks whose purpose is already clear from the enclosing call are exempt. Exported APIs document purpose, parameters, return value, relevant errors, side effects, and important constraints. Inline comments explain why, such as a live-target restriction or unusual selector choice; they must not restate syntax. Update comments and docs with behavior. Explain abstractions and tradeoffs in plain language Stefan can use in a walkthrough.

## Dependency proposal — uninstalled

| Candidate | Intended purpose and reason | Approval timing |
| --- | --- | --- |
| `@playwright/test` | Browser/API runner, fixtures, assertions, interception, and built-in reporting in one coherent tool | M1 implementation gate |
| `typescript` | Strict static contracts for framework support and specs | M1 implementation gate |
| ESLint with TypeScript support | Detect unsafe code and enforce agreed boundary/style rules without manual review repetition | M1 implementation gate |
| Formatting solution, not yet selected | Consistent formatting with minimal configuration and review noise | Select at M1 gate; do not choose multiple overlapping formatters |
| `zod` or another justified schema validator | Validate untrusted configuration and API responses at runtime; prefer one validator over handwritten duplicate checks | Compare need, footprint, and maintenance at M1 gate |
| `@axe-core/playwright` | Focused automated accessibility diagnostics using Playwright context | Justified candidate for M3; install only when that scope is authorized |

Each addition needs purpose, alternatives, license/maintenance/security assessment, default telemetry/analytics behavior (disable it or reject the dependency), version compatibility, and Stefan's approval. Exact versions and the supported Node.js LTS baseline are selected and pinned only at the implementation gate. No runtime version is selected in M0. A lock file and reproducible installation belong to authorized implementation, not this document change.

Initially exclude Cucumber, Allure, Docker, custom DI/reporters, cloud grids, visual-testing SaaS, and test-management integrations: none is needed to demonstrate the approved slice. No separate ecommerce application is permitted.

## Future command contract — none implemented or passing

The following are design targets, not installation instructions or executable repository capabilities. There is no `package.json`, lock file, or script today. Final names, behavior, and applicability need implementation-gate approval.

| Future command | Intended contract |
| --- | --- |
| `npm ci` | Reproducible dependency installation after a reviewed manifest and lock file exist |
| `npm run doctor` | Intended future preflight command: check approved runtime, browser binaries, validated configuration, and writable artifact path without printing secrets or contacting the live target |
| `npm run format:check` | Check formatting without changing files |
| `npm run lint` | Static lint checks |
| `npm run typecheck` | Strict type checking without emitting files |
| `npm test` | Default deterministic suite only; no implicit live fallback |
| `npm run build` | Candidate compile verification; since this is a test repository, justify whether compilation adds value beyond typecheck before implementation, and document non-applicability if omitted |
| `npm run validate` | Primary deterministic gate: doctor, formatting, lint, typing, deterministic tests, and build only if approved/applicable |
| `npm run test:deterministic` | Explicit deterministic suite selection |
| `npm run test:live` | Separate opt-in live selection with validated traffic controls; never part of required validation |
| `npm run test:accessibility` | Later controlled-fixture accessibility selection by default; any live variant requires separate explicit live selection |
| `npm run test:debug` | Focused deterministic debugging; live debugging requires explicit activation and the same traffic limits |
| `npm run report` | View an existing approved local report without uploading artifacts |

No command may be called working until implemented and successfully executed against an identified state. Do not add a meaningless build or runtime script merely for consistency. Once CI exists, it uses the same primary deterministic gate as local work; live execution remains separate.

## Validation and operational documentation

M0 validation is document inventory, structure, links, consistency, claim review, and whitespace inspection only. Later implementation must record actual commands, exit results, environment, branch/commit, and exclusions. Relevant boundary tests must demonstrate rejection as well as successful behavior; test behavior rather than duplicate implementation.

Introduce operational documentation alongside functionality: supported OS/prerequisite versions, verified PowerShell steps and POSIX differences, required/optional environment variables, installation, relevant start/stop behavior or explicit non-applicability, smoke checks, suite commands, single-test reruns, debugging, artifact locations, expected output, and common failures. Clean-clone reproduction and local/CI parity become release evidence only after execution. Never publish fictional results, metrics, experience, or implemented-feature claims.
