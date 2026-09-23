# Roadmap and review gates

## Current status and source authority

Repository: `stefank3/playwright-ecommerce-quality-framework`, public; default branch `main`. M0 working branch: `milestone/0-contract`, tracking `origin/milestone/0-contract`. Recorded initialization baseline: `5a6bb0ba489267d72bbde4b996764afbda3b657a`. The reviewed architecture contract is committed at `7a7d83599ce1505647444d1e686787a090edae0b`. Recheck Git for current state; this is a planning record, not a substitute for inspection.

The repository is planning-only. M0 architecture review is completed: the corrected contract at commit `7a7d83599ce1505647444d1e686787a090edae0b` received `APPROVE WITH NON-BLOCKING RISKS`, with zero blockers. A narrow read-only review also covered the closure diff subsequently committed unchanged as `e2ef8789d526b0ec1544868015fa94a71d100586`. This final record correction is uncommitted and awaits its own exact-state review; earlier verdicts do not cover it. M1 remains explicitly unauthorized and not started. No implementation or dependencies exist; dependency installation and functional implementation gates remain closed. No Node.js baseline is selected, no tests or CI exist, and no npm command has been implemented or validated. No PR, merge, release, deployment, or Automation Exercise contact is authorized. Completion of architecture review does not authorize progression to M1.

Source inputs read for this draft are `QA_Engineering_Portfolio_Project_Charter.md` and `Pasted markdown(7).md` (approved corrected roadmap and final M0 kickoff package), supplied by Stefan outside the repository. They are provenance references, not missing repository links. The corrected package narrows the charter's eventual deliverable list. Its historical “repository not created / M0 not authorized” status is superseded by the actual initialization and Stefan's current documentation-only authorization. Setup instructions for other projects/tools do not authorize those operations here.

Follow the [authority and read order in AGENTS.md](../AGENTS.md). Repository facts and Git history establish implementation truth; root contracts govern agent roles; these documents record the design and approved scope. Stefan's explicit authorization controls execution and resolves conflicts.

## Approved decisions and draft resolutions

| Decision | Rationale and status |
| --- | --- |
| Public repository, `main`, one bounded branch per milestone | Approved: reviewable portfolio evidence with isolated milestone scope |
| MIT license choice | Approved choice; `LICENSE` creation is deferred beyond the eight-file M0 scope |
| Test-focused modular monolith; strict TypeScript and Playwright | Approved: sufficient boundaries without deployment complexity |
| Chromium initially | Approved: controls runtime and maintenance cost while proving one slice |
| Automation Exercise as an external live target | Approved target choice; does not imply current availability or permission for intrusive testing |
| Required deterministic lane; optional manual/scheduled live lane | Approved split: required checks must not rely on a third party |
| Built-in reporters; later `@axe-core/playwright` with explicit limitations | Approved direction: useful diagnostics without custom infrastructure or certification claims |
| `src/` support and `tests/` scenarios | Independently reviewed M0 contract: makes dependency direction visible without a separate app; see [architecture](architecture.md) |
| Transport-independent API contract boundary, fixture-based composition | Independently reviewed M0 contract: validate real boundaries without a generic DI/contracts platform |
| Dependencies proposed individually, no versions installed | Preserves the implementation gate; [rationale](engineering-standards.md) |

## Milestones and acceptance criteria

| Milestone | Authorized/planned scope | Acceptance gate |
| --- | --- | --- |
| M0 — Contract | Exactly [README](../README.md), [AGENTS](../AGENTS.md), [CLAUDE](../CLAUDE.md), [architecture](architecture.md), [test strategy](test-strategy.md), [engineering standards](engineering-standards.md), [security](security.md), and this roadmap | Eight documents agree; scope, links, structure, claims, and whitespace checked; Claude reviews exact state; Stefan resolves decisions and authorizes progression |
| M1 — Foundation | Only the locked vertical slice below | Slice and relevant deterministic boundary checks demonstrate intended behavior; approved live observations are separately labelled; configuration, artifacts, and corresponding basic docs validated; exact-state review accepted |
| M2 — Core capability | Approved incremental reusable UI/API capabilities and meaningful coverage | Each addition has a justified risk/use case, typed contract, isolated checks, truthful docs, and accepted review; no automatic permission for mutation |
| M3 — Hardening | Negative paths, accessibility, isolation, errors, security, and reliability | Bounded failures, cleanup, artifact controls, and accessibility limits verified; no unexplained skips/flakiness or unresolved blockers |
| M4 — CI and evidence | Deterministic required CI, separately approved restrained live workflow, reports, clean-clone evidence | Required CI uses documented local commands; external failures classified separately; permissions/retention reviewed; PowerShell clean-clone procedure verified |
| M5 — Presentation | Accurate README, diagrams, reviewed screenshots, demo scripts, explanation guide | Every capability/result tied to evidence; two-minute summary, five-minute demo, and fifteen-minute walkthrough rehearsed; no private details exposed |
| M6 — Release | Final audit, exact-state review, semantic release, profile linkage, closure | Repository definition of done met, acceptable corrected-state Claude verdict, Stefan's explicit release/publication authorization, and clean recorded release evidence |

Only M0 writing and document validation are currently authorized. Every later milestone needs its own bounded scope approval.

## Locked M1 vertical slice

1. One read-only UI scenario.
2. One API scenario.
3. Validated configuration.
4. One reusable UI abstraction.
5. One API client.
6. Failure artifacts.
7. Basic documentation corresponding to implemented behavior.

Supporting types, schemas, fixtures, and deterministic checks must remain tied to this slice. Candidate read-only product-list scenarios in [test strategy](test-strategy.md) are not verified endpoint contracts. Exact scenario acceptance criteria need approval before implementation.

M1 excludes full checkout, account lifecycle automation, broad page-object hierarchies, multiple browsers, custom reporting, a local ecommerce application, large utility libraries, comprehensive accessibility coverage, and CI/presentation work. Do not interpret M2 or M3 descriptions as advance authorization to expand M1.

## Review, dependency, and publication gates

1. Codex drafts and validates M0 without dependency installation or live contact.
2. Claude reads all eight files read-only using [CLAUDE.md](../CLAUDE.md). The initial and corrected-state architecture reviews are recorded below.
3. Record branch, baseline, reviewed commit, SHA-256 over each reviewed file's bytes without normalization, findings, severity (`BLOCKER`, `MAJOR`, `MINOR`, `NOTE`), evidence, and dispositions. Codex addresses accepted findings; Stefan owns disputed decisions and risk acceptance. Re-review substantive corrections; administrative records follow the rule below.
4. Claude must return `APPROVE` or `APPROVE WITH NON-BLOCKING RISKS`. `CHANGES REQUIRED` blocks completion. There must be no unresolved `BLOCKER`; a `MAJOR` blocks unless Stefan explicitly accepts and documents the risk with rationale. Only that explicit acceptance permits `APPROVE WITH NON-BLOCKING RISKS` for an accepted MAJOR risk, provided no other blocking finding remains; otherwise the MAJOR remains blocking. `MINOR` and `NOTE` are non-blocking unless explicitly escalated. Any finding rejected as invalid requires documented evidence and an acceptable final verdict; an unresolved `BLOCKER` cannot be waived.
5. Stefan approves architecture and explicitly authorizes M1 and dependency installation. Only then select/pin supported Node.js LTS and exact package versions, approve formatter/schema tooling, and introduce the required manifest/lock file. M1 must create `.gitignore` before the first dependency installation and in the same bounded change that introduces the manifest and lock file. It must cover dependency directories, reports/test results, environment secrets, and any future authentication-state files. This prerequisite does not authorize creating it in M0. M0 architecture review is completed; this separate progression gate remains closed.
6. For each later milestone, implement approved scope, validate, review the exact final diff, correct accepted findings, and obtain Claude's final corrected-state verdict. Record actual reviewer model/version when relevant to the audit.
7. Commit, push, PR, merge, release, and deployment require explicit authorization for each operation. Review approval is not publication permission. The original M0 documentation request authorized none of these operations; later explicit authorizations covered the commits and pushes of `7a7d835` and `e2ef878` only. The current final-record request authorizes editing and validation only: no staging, commit, push, PR, merge, release, or deployment.

### Initial architecture review — completed

| Field | Recorded evidence |
| --- | --- |
| Date / reviewer | 2026-09-23 / Claude Code (Anthropic), independent and read-only |
| Model | Claude Opus 4.7 (`claude-opus-4-7`) |
| Branch / baseline | `milestone/0-contract` / `5a6bb0ba489267d72bbde4b996764afbda3b657a` |
| Reviewed state | Empty tracked-file inventory; exactly eight untracked M0 documents, identified by the original hashes below; no ignored files or implementation artifacts |
| Verdict | `APPROVE WITH NON-BLOCKING RISKS`; no blocking findings |
| Findings summary | Three MINOR non-blocking risks and eight NOTE optional improvements; disposition mapped below |
| Mutation / validation | Claude modified no repository files; reported valid relative links, LF-only UTF-8 without BOM, and clean whitespace; no dependencies, implementation, CI, or external contact |
| Accepted disposition | Stefan accepted all eleven items as bounded M0 documentation hardening. Codex applied the corrections; unresolved M1 decisions remain open. No M1, dependency-installation, or publication authority was granted |
| Corrected-state review | Subsequently completed for commit `7a7d83599ce1505647444d1e686787a090edae0b`, as recorded below; the initial verdict covers only the original hashes |

Historical evidence source: Stefan-supplied “Claude Code Milestone 0 Architecture Review” attachment. The earlier record reports that all eight on-disk byte hashes matched the review and that the files were LF-only. The table preserves those reported SHA-256 values over original on-disk bytes, not hashes of the corrected contract or this final record. No normalization is part of hashing. During later reviews, the original source transcript, original supplied hashes, and claimed Claude Opus 4.7 model identity could not be independently confirmed; only the repository evidence available then was verified. The model and original hash table remain attributed historical claims, not later independent confirmations.

| Reviewed file | Original reviewed SHA-256 |
| --- | --- |
| `README.md` | `1F6EE4F13A41597912DF67BB5F16485BCF39094A9F62AD87F9893D07984F9FBB` |
| `AGENTS.md` | `13858699D02E5BF17E8333CE5D076981AC2CF8B8A6EBAC85CD8E2FE4739E3E0F` |
| `CLAUDE.md` | `87A16E1C930119C3B875A51BE147C53A3D756C1C96E3A61F77DFD250ECA183C0` |
| `docs/architecture.md` | `0137BD7112EE4ACA0C2D7EE0D6725AFA7120AB5B35B2DDAE5A9C7FDDA76DC72F` |
| `docs/test-strategy.md` | `1528209EBEB03FCB7A0E56AA9BDC25101865A8709C86B193AD0193A1AAE27F57` |
| `docs/engineering-standards.md` | `876FF4EA53836886D846FED8DD1DCEF42029EC99BB84657CA25DD2B55CA08D15` |
| `docs/security.md` | `2BCCCD3715956D56A7B74CE5031F4D8E6E285ED4726645F2F7B54D8F34E3404F` |
| `docs/roadmap.md` | `716CC6F2BBE600B70C5FCB070D852C63B65D25999A03E5418AF40B8DD5CF1F88` |

| Review item / severity | Accepted documentation correction |
| --- | --- |
| 2.1 / MINOR | Standardize severity taxonomy in the reviewer contract and records |
| 2.2 / MINOR | Clarify TSDoc scope and exempt obvious inline anonymous callbacks; align the AGENTS summary |
| 2.3 / MINOR | Make `.gitignore` a prerequisite before M1 dependency installation, within the manifest/lock-file change |
| 3.1 / NOTE | Specify SHA-256 over unmodified on-disk file bytes |
| 3.2 / NOTE | Add the review-record template below |
| 3.3 / NOTE | Name `npm run doctor` as intended future preflight in standards and strategy |
| 3.4 / NOTE | Disable default telemetry or reject the dependency; require approved Playwright browser installation |
| 3.5 / NOTE | Require lane-isolation mechanism selection at the M1 gate without selecting it now |
| 3.6 / NOTE | Separate pure API contracts from transport imports |
| 3.7 / NOTE | Require dated pre-live Terms of Service and robots.txt checks without contacting the target now |
| 3.8 / NOTE | Clarify the intended MIT license and absence of a current reuse grant |

### Corrected-state architecture review — completed

| Field | Recorded evidence |
| --- | --- |
| Date / reviewer | 2026-09-23 / Claude Code, independent reviewer |
| Model | Claude Opus 5.5 (`claude-opus-5-5`) |
| Branch / reviewed commit | `milestone/0-contract` / `7a7d83599ce1505647444d1e686787a090edae0b` |
| Original baseline | `5a6bb0ba489267d72bbde4b996764afbda3b657a` |
| Exact state | All eight reviewed SHA-256 hashes matched the document bytes subsequently committed in `7a7d835`; the inventory is the eight M0 documents listed above |
| Verdict / blockers | `APPROVE WITH NON-BLOCKING RISKS` / zero blocking findings |
| Evidence limitation | The original source transcript, original supplied hashes, and claimed Claude Opus 4.7 model identity could not be independently confirmed. Claude checked the original disposition record for internal consistency; only repository evidence available during later reviews was verified |
| Findings / dispositions | No blockers were reported. Stefan authorized the bounded closure clarifications to review evidence, severity, licensing, dependency telemetry, and pure-contract imports; those corrections were committed as `e2ef878`. The original findings transcript was not available for independent comparison; no finding IDs or severities are reconstructed here |
| Validation / mutation | All eight corrected-state hashes matched exact on-disk bytes before their unchanged commit as `7a7d835`. The available corrected-state summary does not establish an itemized reviewer validation/mutation log; this limitation is retained. The later narrow review's explicit validation and no-mutation evidence is recorded separately below |
| Source of this record | Stefan's verified review details and closure-update authorization; this record does not claim a new review of the uncommitted closure state |
| Disposition / status | M0 architecture review completed. Bounded closure documentation is authorized; M1 and dependency installation remain unauthorized |

The verdict references the exact document bytes in commit `7a7d83599ce1505647444d1e686787a090edae0b`. It does not extend to later uncommitted edits merely because they record that verdict.

### Narrow closure-diff review — completed

| Field | Recorded evidence |
| --- | --- |
| Date / reviewer | 2026-09-23 / Claude Code, Claude Opus 5.5 (`claude-opus-5-5`), narrow read-only review |
| Reviewed baseline | `7a7d83599ce1505647444d1e686787a090edae0b` |
| Reviewed closure state | The reviewed uncommitted closure diff was subsequently committed unchanged as `e2ef8789d526b0ec1544868015fa94a71d100586`; pre-commit hashes identified exact on-disk bytes. Committed-state verification uses Git blob bytes |
| Verdict / blockers | `APPROVE WITH NON-BLOCKING RISKS` / zero blockers |
| Validation | 58 relative links, strict UTF-8, LF endings, final newlines, whitespace, table structure, and `git diff --check` passed |
| Mutation / network | Reviewer made no mutations and no network calls |
| Evidence limitation | Original source transcript, original supplied hashes, and claimed Claude Opus 4.7 model identity could not be independently confirmed; only available repository evidence was verified |
| Source / next gate | Stefan's supplied review facts and dispositions; this final uncommitted record correction requires one final Claude exact-state review |

| Finding / severity | Evidence and risk | Disposition |
| --- | --- | --- |
| R1 / MINOR | The earlier corrected-state review record lacked findings, dispositions, and validation/mutation fields required by the template, reducing audit clarity | ACCEPTED AND CORRECTED by this final record; unavailable historical details are explicitly limited rather than invented |
| R2 / MINOR | The administrative-record exception could permit unreviewed security, test-strategy, scope, severity, authorization, or governance changes | ACCEPTED AND CORRECTED by narrowing the rule below and in CLAUDE.md; this rule correction itself requires exact-state review |
| R3 / MINOR | `core.autocrlf=true` and no `.gitattributes` may produce CRLF working-tree files after a fresh Windows checkout; committed M0 Git blobs are LF | ACCEPTED AND DEFERRED to authorized M1 kickoff: add `.gitattributes` containing `* text=auto eol=lf` before implementation files are introduced. Do not create it in this patch |

### Review-record rule and template

Commit the exact reviewed implementation/document bytes first, under explicit Git authorization. A subsequent administrative record may add only review evidence, reviewer identity, reviewed-state identifiers, verdicts, validation results, status, findings, and dispositions. Any other change to requirements, scope, architecture, implementation, test strategy, security, severity rules, authorization rules, or governance requires an exact-state review. Identify the earlier reviewed commit explicitly; the record commit does not retroactively become the reviewed state. This final correction changes review rules and therefore requires exact-state review. No staging, committing, or pushing is authorized for this patch.

Use the template for each subsequent gate; unfilled fields mean pending, never approval. Verify committed states using Git blob bytes, such as the byte stream from `git show <commit>:<path>`, and uncommitted states using exact on-disk bytes. Record SHA-256 and identify which form was used; do not normalize or decode/re-encode bytes before hashing. Line-ending policy remains a separate validation. Distinguish reviewed content from the later administrative record, so the roadmap's own hash is unambiguous.

| Field | Required entry |
| --- | --- |
| Review identity | Date, gate, reviewer, actual model/version |
| Exact state | Branch, baseline and reviewed commit, tracked/untracked inventory, SHA-256 for each file with byte form identified (Git blob or on-disk); distinguish any later administrative record |
| Validation / mutation | Checks and exact results, limitations, whether the reviewer modified any files |
| Findings | ID, severity (`BLOCKER`, `MAJOR`, `MINOR`, `NOTE`), location, evidence, risk, correction, blocking status |
| Disposition | Stefan's acceptance/rejection and evidence, correction status, remaining decisions |
| Verdict / next gate | One allowed verdict from CLAUDE.md, corrected-state re-review status, explicit authorization still needed |

## Open decisions and risks

| Item | Next decision or mitigation |
| --- | --- |
| Review scope | Initial and corrected-state architecture reviews are complete; preserve their exact-state references when recording closure |
| Live scenario and target drift | Approve exact read-only API endpoint/expected fields, UI scenario/page/locator strategy, and host/path allowlist; record dated pre-live Terms of Service and robots.txt checks before authorized live traffic |
| Lane isolation | Select and record the enforcement mechanism at the M1 gate; no mechanism is chosen in M0 |
| Traffic budget may be too restrictive for page resources | Review proposed single-worker/request/time caps in [security](security.md); enforce before live use and fail closed rather than silently relax |
| Artifact leakage and public CI visibility | Review capture safety, retention/redaction enforcement, and whether later CI uploads remain off or use an approved retention period within the seven-day cap; no mechanism is selected and uploads remain off pending approval |
| Tooling/version compatibility | Select supported Node.js LTS, exact versions, formatter, schema validator, and command/build applicability at the implementation gate |
| External instability and misleading claims | Separate lane results, preserve unknown failures for triage, and distinguish future targets from executed evidence |
| M1 authorization | Remains closed despite completed M0 architecture review; obtain Stefan's explicit approval before implementation or dependencies |
| Checkout line endings / R3 | `.gitattributes` with `* text=auto eol=lf` is deferred to authorized M1 kickoff, before implementation files; validate blob bytes separately from checkout bytes |

## Explicit deferrals

No dependency, runtime pin, browser, code, CI, external request/account/data, or generated output is part of M0. `CONTRIBUTING.md`, `.env.example`, setup/running-tests/troubleshooting/explanation guides, design-decision expansion, root `SECURITY.md`, and `LICENSE` are deferred until applicable and separately authorized. `.gitignore` is deferred specifically to authorized M1 kickoff: create it before the first dependency installation, in the same bounded change as the manifest and lock file, as required by the gate above. Current security requirements live in [security](security.md), and current decisions live here and in [architecture](architecture.md). Do not create broken links or placeholders for future documents.

Cross-browser coverage, account/checkout flows, custom infrastructure/reporting, visual SaaS, and test-management integrations need later demonstrated value and approval. Repository 2 and other portfolio work do not begin during M0.

## Repository definition of done — future completion criteria

- Explicit problem, users, scope, exclusions, limitations, proportionate architecture, and stable typed/tested/documented public boundaries.
- Applicable formatting, linting, strict typing, tests, build (or justified non-applicability), security/dependency review, and primary validation succeed on the supported baseline; no unexplained skips, quarantine, or flakiness; no unresolved `BLOCKER`; a `MAJOR` blocks unless Stefan records explicit risk acceptance with rationale.
- No secrets, sensitive data, unsafe execution paths, or private Release Signal details; generated outputs stored/ignored under the documented policy and history inspected for leaks.
- A clean clone is installable, configurable, runnable, testable, debuggable, and stoppable from committed instructions; verified PowerShell and relevant POSIX differences, honest expected output, artifact paths, and troubleshooting.
- CI uses the documented local gate and required checks succeed at the reviewed head; live evidence is separately scoped. Documentation and implementation agree, with accurate TSDoc and justified file-size exceptions.
- Demonstrations and portfolio artifacts reflect actual evidence; Codex validation and acceptable Claude final verdict identify the same exact state, with blocking findings properly disposed.
- Authorized semantic release and notes, clean working tree, identified reviewed branch/commit, accurate metadata and profile linkage/pinning or a recorded pinning plan.

## Program context and definition of done

Sequence: this Playwright framework → `llm-quality-evaluation-framework` → `quality-engineering-mcp-server` → `stefank3` profile README → optional `saas-qa-case-study` → optional `api-quality-gates`. Only one implementation repository is active at a time; a later one requires completion or a formally documented pause. The profile has a tailored presentation gate, not artificial runtime requirements.

The initial portfolio is complete only when all three public flagships meet their own completion gates and independent Claude reviews; the MCP server is demonstrated with both Codex and Claude Code; the profile, metadata, pins, badges, screenshots, previews, and links accurately represent completed evidence; and Release Signal is presented without private disclosure. Stefan must be able to run/explain every flagship. Upwork claims and offerings must match demonstrable work, with three reusable proposal templates for Playwright automation, QA/release-risk assessment, and AI evaluation. A final audit must verify security, accuracy, working links, clean Git state, and actual passing checks. Optional repositories may remain honestly labelled future work without blocking initial completion.
