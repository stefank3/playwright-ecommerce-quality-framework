# Independent review contract

This defines the Claude Code review contract. The completed initial M0 architecture review is recorded in [roadmap](docs/roadmap.md); its verdict applies only to the recorded file hashes. The corrected state requires a new review. Current repository status is planning-only.

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

For M0, assess the documented design and its evidence limits. No runtime check exists to pass. Inspect all eight untracked documents as well as Git state; an empty tracked diff is not an empty review. Check the locked M1 slice and deterministic/live isolation. Do not demand implementation or deferred operational files during this gate.

## Findings and verdict

Each finding must identify severity (`BLOCKER`, `MAJOR`, `MINOR`, or `NOTE`), file and location, evidence, risk, recommended correction, and whether it blocks the milestone. Use this taxonomy consistently in review prompts and records. Do not request style changes already enforced by automation; no such automation exists in M0.

Identify the reviewed branch, baseline commit, and exact document state (SHA-256 over the on-disk file bytes for every uncommitted file, without newline or encoding normalization), plus the actual reviewer model/version when available. Return findings in the review response; Codex records accepted findings and Stefan's dispositions in the roadmap within authorized scope. After corrections, review the corrected exact state again.

Finish with exactly one verdict: `APPROVE`, `APPROVE WITH NON-BLOCKING RISKS`, or `CHANGES REQUIRED`. The last verdict blocks completion. An acceptable verdict does not itself authorize implementation, dependencies, or Git/GitHub operations.
