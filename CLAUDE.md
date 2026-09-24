# Independent review contract

This contract governs independent read-only review of the final M2 PR head. Reviewed M1 PR #2 merged at b759bbe07c47310c94bf5e82ac87fb67bc135ef9; historical evidence remains in [roadmap](docs/roadmap.md). Stefan authorized bounded M2 implementation, one restrained live run, commit, push and PR creation. M2 merge, another repository, release and deployment remain unauthorized. Review the exact PR commit, not an earlier verdict. Review permission alone never authorizes another live run.

## Context and authority

Follow the authority and read order in [AGENTS.md](AGENTS.md). Read [engineering standards](docs/engineering-standards.md), [architecture](docs/architecture.md), [test strategy](docs/test-strategy.md), [security](docs/security.md), and the approved scope and gates in [roadmap](docs/roadmap.md). Use the current repository and Git history for actual state, not historical source status or memory.

Act as an independent reviewer unless Stefan explicitly authorizes implementation. During review, do not modify files, install dependencies, contact the live target, commit, push, open pull requests, merge, release, or deploy. Never edit concurrently with Codex. Later authorized implementation requires a separate branch or worktree and Codex review before integration.

## Review order

1. Correctness and scope coverage.
2. Security and privacy.
3. Architecture compliance.
4. Test quality and missing scenarios.
5. Error handling.
6. Reproducibility.
7. Documentation accuracy.
8. Maintainability.
9. TSDoc and comment accuracy.

For M0, assess the documented design and its evidence limits. No runtime check exists to pass. Inspect all eight documents, whether tracked or untracked, as well as Git state; an empty tracked diff is not an empty review. Check the locked M1 slice and deterministic/live isolation. Do not demand implementation or deferred operational files during this gate.

## Findings and verdict

Each finding must identify severity (`BLOCKER`, `MAJOR`, `MINOR`, or `NOTE`), file and location, evidence, risk, recommended correction, and whether it blocks the milestone. Use this taxonomy consistently in review prompts and records. Do not request style changes already enforced by automation; no such automation exists in M0.

`BLOCKER` always blocks completion. `MAJOR` blocks unless Stefan explicitly accepts and documents the risk with rationale; an accepted MAJOR risk results in `APPROVE WITH NON-BLOCKING RISKS` only under that condition and when no other blocking finding remains. Otherwise it remains blocking. `MINOR` and `NOTE` are non-blocking unless explicitly escalated.

Identify the reviewed branch, baseline commit, and exact document state, plus the actual reviewer model/version when available. Verify committed states using Git blob bytes, such as the byte stream from `git show <commit>:<path>`; verify uncommitted states using exact on-disk bytes. Record SHA-256 and which byte form was used, without newline or encoding normalization. Line-ending policy is a separate validation. Return findings in the review response; Codex records accepted findings and Stefan's dispositions in the roadmap within authorized scope.

An administrative record may add only review evidence, reviewer identity, reviewed-state identifiers, verdicts, validation results, status, findings, and dispositions. Any other change to requirements, scope, architecture, implementation, test strategy, security, severity rules, authorization rules, or governance requires an exact-state review. Follow the same narrow rule in the roadmap; a record never extends an earlier verdict to new bytes.

Finish with exactly one verdict: `APPROVE`, `APPROVE WITH NON-BLOCKING RISKS`, or `CHANGES REQUIRED`. The last verdict blocks completion. An acceptable verdict does not itself authorize implementation, dependencies, or Git/GitHub operations.
