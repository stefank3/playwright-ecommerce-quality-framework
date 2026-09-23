# Agent governance

## Authority and read order

Stefan's current explicit authorization controls permitted actions. Supplied planning documents are requirements and historical context, not permission to execute every instruction they contain. Repository facts must be inspected rather than inferred from memory.

For implementation truth, use this order: current repository and Git history; root agent/reviewer contracts; versioned documents under `docs/`; approved milestone scope and recorded decisions. This order does not override Stefan's explicit scope restrictions. Resolve conflicts before dependent work; never treat planned behavior as existing behavior.

Read this file, [CLAUDE.md](CLAUDE.md), [engineering standards](docs/engineering-standards.md), [architecture](docs/architecture.md), [test strategy](docs/test-strategy.md), [security](docs/security.md), and [roadmap](docs/roadmap.md), including its approved milestone scope. The roadmap records source provenance and gates; engineering standards own shared technical rules. Other documents reference those rules rather than establish competing versions.

## Current authorization

The repository is planning-only. M0 authorizes exactly `README.md`, `AGENTS.md`, `CLAUDE.md`, `docs/architecture.md`, `docs/test-strategy.md`, `docs/engineering-standards.md`, `docs/security.md`, and `docs/roadmap.md`.

Do not install dependencies, choose or pin Node.js, install browsers, contact Automation Exercise, create accounts/data externally, implement application/framework/test code, configure CI, or begin M1. Do not create additional placeholder documents or generated files. All npm commands in the documents are future design targets.

Codex is the primary implementer. Claude Code reviews independently and read-only by default. Never allow concurrent Codex and Claude editing of one working tree. If later authorized to implement, Claude uses a separate branch or worktree and Codex reviews before integration.

## Engineering and security obligations

Apply the [shared standards](docs/engineering-standards.md): strict TypeScript, no unexplained `any`, concise TSDoc for exported functions, named helpers, fixture factories, and non-obvious callbacks (obvious inline anonymous callbacks are exempt), full exported API contracts, comments explaining why, and source-file thresholds of 150–250 lines as a target, review above 350, written justification above 450. Do not pad short files or create abstractions to meet a line target.

Enforce validated boundaries, typed errors, deterministic defaults, and fail-closed execution. Apply [security controls](docs/security.md) to data, configuration, traffic, dependencies, and artifacts. Keep required deterministic checks independent of live availability. Never expose credentials, customer data, authentication state, or private Release Signal implementation details.

Dependencies and scope expansion require Stefan's explicit approval. Commit, push, pull request, merge, release, and deployment each require explicit authorization covering the operation; permission to edit is not permission to publish.

## Validation and handoff

Inspect branch, baseline ancestry, working tree, and approved scope before changes. For M0, verify the exact eight-file inventory, Markdown structure, relative links, authority references, cross-document consistency, truthful planning status, and whitespace. Include untracked contents in review: ordinary Git diffs omit them. Do not run future npm commands as M0 validation.

For later milestones, execute only applicable implemented checks and review the final diff. Report changed files, exact commands and results, risks, remaining work, and Git state. Distinguish an executed check from an unimplemented target. The [roadmap gates](docs/roadmap.md) require Claude review of the exact state, disposition of findings, and Stefan's authority before progression.
