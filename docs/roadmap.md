# Roadmap and review gates

## Current status and authority

PR #1 merged the eight-document M0 contract using merge commit `1eb2d3a062702a3e3d5d772e3a982a7438bb5ee0`. The M0 branch is retained. M1 starts from that verified main commit on `milestone/1-foundation`.

Stefan subsequently authorized the complete narrow M1 foundation, dependency/runtime selection, deterministic GitHub Actions, implementation-backed documentation, validation, commit, push, and opening an M1 PR. This explicitly supersedes the M0 prohibition on implementation and its CI deferral. One independent Claude review of the final M1 PR head is the next gate; no M1 merge, M2, live external testing, release, or deployment is authorized.

Follow [AGENTS.md](../AGENTS.md) for authority/read order. The original charter and corrected kickoff package remain historical planning inputs. The M0 review records below preserve what was authorized at their dates; their statements that M1 was unauthorized are historical, not current instructions.

## M1 selected decisions

- Node 24.21.0 LTS, strict TypeScript 6.0.3, Playwright 1.63.0, Chromium, one worker and zero retries. The lint parser excludes TypeScript 7, so the newest compatible stable TS 6 patch was selected.
- Prettier for formatting, ESLint/typescript-eslint for linting, Zod for runtime schemas, and exact lockfile installation with lifecycle scripts disabled. See [standards](engineering-standards.md) for versions and rationale.
- One controlled read-only product-list UI scenario and one API scenario, never live. An injected in-memory transport validates the fixed API operation; minimal synthetic markup tests the UI abstraction without an application server.
- One deterministic Playwright project with disjoint test directory; live mode is rejected. Network-denied Node execution, offline Chromium, route interception, and teardown auditing make accidental live requests fail closed.
- Support-only compilation is applicable and implemented. Configuration, malformed responses, transport failures, isolation and network denial receive bounded supporting tests.
- `.gitignore` and `.gitattributes` were created before dependency installation and implementation files respectively. Artifact uploads remain disabled; local diagnostic retention remains at most seven days.
- Current gate authorizes deterministic CI earlier than the original M4 plan. Live workflows, comprehensive evidence/presentation, accessibility, and expanded browser coverage remain deferred.

## Milestones and gates

| Milestone            | Scope and acceptance                                                                                                                                                                                                                    |
| -------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M0 — Contract        | Eight documents, independent reviews and administrative record complete; PR #1 merged                                                                                                                                                   |
| M1 — Foundation      | One UI and one API scenario; validated config, one UI abstraction/client, controlled fixtures, safe failure artifacts, pinned toolchain, deterministic CI and verified operational docs. Final PR head awaits independent Claude review |
| M2 — Core capability | Separately authorized useful UI/API extensions with typed contracts and isolated checks                                                                                                                                                 |
| M3 — Hardening       | Negative paths, accessibility, security/reliability and lifecycle evidence; no unexplained skips or flaky passes                                                                                                                        |
| M4 — CI and evidence | Expand reproducibility/evidence and consider separately authorized restrained live workflow; deterministic CI already introduced in M1                                                                                                  |
| M5 — Presentation    | Accurate demonstrations, reviewed screenshots, explanation guide and portfolio evidence                                                                                                                                                 |
| M6 — Release         | Repository definition of done, final exact-state audit and explicit release authority                                                                                                                                                   |

M1 excludes checkout, account lifecycle, broad page hierarchies, multiple browsers, custom reporters, a separate application, large utility libraries, comprehensive accessibility and portfolio-presentation work. Supporting checks must remain tied to this slice.

## Remaining decisions and risks

Live UI selectors, API fields, origin/endpoint allowlists and Terms/robots checks are deliberately unverified and deferred until live scope is explicitly authorized. Controlled tests do not validate the external product. Accessibility tooling and Firefox/WebKit remain later work. No license file is introduced; MIT remains an intended choice without an open-source grant.

The selected source/network policies protect against accidental requests in maintained tests, not malicious repository code. Browser cache installation and npm registry access are setup traffic, not live target testing. CI execution evidence must be reported from the actual run, not inferred from the workflow file. The final M1 Claude review is pending; no prior verdict approves M1.

## Historical M0 review evidence

The following is an archive of M0 evidence, findings and dispositions. References to deferral, unmerged state or missing authorization describe M0 at review time. Current M1 authority and implementations are specified above; the evidence and its limitations are not rewritten as M1 claims.

### Initial claimed Claude Opus 4.7 architecture review — recorded

| Field                  | Recorded evidence                                                                                                                                                                                                |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date / reviewer        | 2026-09-23 / Claude Code (Anthropic), independent and read-only                                                                                                                                                  |
| Model                  | Claude Opus 4.7 (`claude-opus-4-7`)                                                                                                                                                                              |
| Branch / baseline      | `milestone/0-contract` / `5a6bb0ba489267d72bbde4b996764afbda3b657a`                                                                                                                                              |
| Reviewed state         | Empty tracked-file inventory; exactly eight untracked M0 documents, identified by the original hashes below; no ignored files or implementation artifacts                                                        |
| Verdict                | `APPROVE WITH NON-BLOCKING RISKS`; no blocking findings                                                                                                                                                          |
| Findings summary       | Three MINOR non-blocking risks and eight NOTE optional improvements; disposition mapped below                                                                                                                    |
| Mutation / validation  | Claude modified no repository files; reported valid relative links, LF-only UTF-8 without BOM, and clean whitespace; no dependencies, implementation, CI, or external contact                                    |
| Accepted disposition   | Stefan accepted all eleven items as bounded M0 documentation hardening. Codex applied the corrections; unresolved M1 decisions remain open. No M1, dependency-installation, or publication authority was granted |
| Corrected-state review | Subsequently completed for commit `7a7d83599ce1505647444d1e686787a090edae0b`, as recorded below; the initial verdict covers only the original hashes                                                             |

Historical evidence source: Stefan-supplied “Claude Code Milestone 0 Architecture Review” attachment. The earlier record reports that all eight on-disk byte hashes matched the review and that the files were LF-only. The table preserves those reported SHA-256 values over original on-disk bytes, not hashes of the corrected contract or this final record. No normalization is part of hashing. During later reviews, the original source transcript, original supplied hashes, and claimed Claude Opus 4.7 model identity could not be independently confirmed; only the repository evidence available then was verified. The model and original hash table remain attributed historical claims, not later independent confirmations.

| Reviewed file                   | Original reviewed SHA-256                                          |
| ------------------------------- | ------------------------------------------------------------------ |
| `README.md`                     | `1F6EE4F13A41597912DF67BB5F16485BCF39094A9F62AD87F9893D07984F9FBB` |
| `AGENTS.md`                     | `13858699D02E5BF17E8333CE5D076981AC2CF8B8A6EBAC85CD8E2FE4739E3E0F` |
| `CLAUDE.md`                     | `87A16E1C930119C3B875A51BE147C53A3D756C1C96E3A61F77DFD250ECA183C0` |
| `docs/architecture.md`          | `0137BD7112EE4ACA0C2D7EE0D6725AFA7120AB5B35B2DDAE5A9C7FDDA76DC72F` |
| `docs/test-strategy.md`         | `1528209EBEB03FCB7A0E56AA9BDC25101865A8709C86B193AD0193A1AAE27F57` |
| `docs/engineering-standards.md` | `876FF4EA53836886D846FED8DD1DCEF42029EC99BB84657CA25DD2B55CA08D15` |
| `docs/security.md`              | `2BCCCD3715956D56A7B74CE5031F4D8E6E285ED4726645F2F7B54D8F34E3404F` |
| `docs/roadmap.md`               | `716CC6F2BBE600B70C5FCB070D852C63B65D25999A03E5418AF40B8DD5CF1F88` |

| Review item / severity | Accepted documentation correction                                                                        |
| ---------------------- | -------------------------------------------------------------------------------------------------------- |
| 2.1 / MINOR            | Standardize severity taxonomy in the reviewer contract and records                                       |
| 2.2 / MINOR            | Clarify TSDoc scope and exempt obvious inline anonymous callbacks; align the AGENTS summary              |
| 2.3 / MINOR            | Make `.gitignore` a prerequisite before M1 dependency installation, within the manifest/lock-file change |
| 3.1 / NOTE             | Specify SHA-256 over unmodified on-disk file bytes                                                       |
| 3.2 / NOTE             | Add the review-record template below                                                                     |
| 3.3 / NOTE             | Name `npm run doctor` as intended future preflight in standards and strategy                             |
| 3.4 / NOTE             | Disable default telemetry or reject the dependency; require approved Playwright browser installation     |
| 3.5 / NOTE             | Require lane-isolation mechanism selection at the M1 gate without selecting it now                       |
| 3.6 / NOTE             | Separate pure API contracts from transport imports                                                       |
| 3.7 / NOTE             | Require dated pre-live Terms of Service and robots.txt checks without contacting the target now          |
| 3.8 / NOTE             | Clarify the intended MIT license and absence of a current reuse grant                                    |

### Corrected-state architecture review — completed

| Field                    | Recorded evidence                                                                                                                                                                                                                                                                                                                   |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date / reviewer          | 2026-09-23 / Claude Code, independent reviewer                                                                                                                                                                                                                                                                                      |
| Model                    | Claude Opus 5.5 (`claude-opus-5-5`)                                                                                                                                                                                                                                                                                                 |
| Branch / reviewed commit | `milestone/0-contract` / `7a7d83599ce1505647444d1e686787a090edae0b`                                                                                                                                                                                                                                                                 |
| Original baseline        | `5a6bb0ba489267d72bbde4b996764afbda3b657a`                                                                                                                                                                                                                                                                                          |
| Exact state              | All eight reviewed SHA-256 hashes matched the document bytes subsequently committed in `7a7d835`; the inventory is the eight M0 documents listed above                                                                                                                                                                              |
| Verdict / blockers       | `APPROVE WITH NON-BLOCKING RISKS` / zero blocking findings                                                                                                                                                                                                                                                                          |
| Findings / dispositions  | R1, R2, and N1–N5 are recorded below; no blockers were reported                                                                                                                                                                                                                                                                     |
| Validation / mutation    | All eight corrected-state hashes matched exact on-disk bytes before their unchanged commit as `7a7d835`; 41 relative links resolved; valid UTF-8 without BOM, LF-only file bytes, no tabs or trailing whitespace, and single final newlines. Reviewer made no file changes, staged and committed nothing, and made no network calls |
| Source of this record    | Stefan's verified corrected-state review details; the source-evidence limitation belongs only to the initial claimed Claude Opus 4.7 review                                                                                                                                                                                         |
| Disposition / status     | M0 architecture review completed. Bounded closure documentation is authorized; M1 and dependency installation remain unauthorized                                                                                                                                                                                                   |

The verdict references the exact document bytes in commit `7a7d83599ce1505647444d1e686787a090edae0b`. It does not extend to later uncommitted edits merely because they record that verdict.

| Item | Severity | Finding                                       | Disposition                                                                                                                         |
| ---- | -------- | --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| R1   | MINOR    | “high-severity” wording                       | Corrected in the definition-of-done language committed in `e2ef878`                                                                 |
| R2   | MINOR    | Recording a verdict after review              | Corrected through review-record option (a), committed in `e2ef878`: commit reviewed bytes first, then record the verdict separately |
| N1   | NOTE     | “LF-normalized” wording                       | Corrected through byte-specific wording                                                                                             |
| N2   | NOTE     | Severity-to-blocking mapping                  | Corrected in CLAUDE.md                                                                                                              |
| N3   | NOTE     | Telemetry missing from dependency assessments | Corrected in engineering-standards.md and security.md                                                                               |
| N4   | NOTE     | Licence precision                             | Corrected in README.md                                                                                                              |
| N5   | NOTE     | Fixture and builder imports of pure contracts | Corrected in architecture.md                                                                                                        |

### Narrow closure-diff review — completed

| Field                      | Recorded evidence                                                                                                                                                                                                            |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date / reviewer            | 2026-09-23 / Claude Code, Claude Opus 5.5 (`claude-opus-5-5`), narrow read-only review                                                                                                                                       |
| Reviewed baseline          | `7a7d83599ce1505647444d1e686787a090edae0b`                                                                                                                                                                                   |
| Reviewed closure state     | The reviewed uncommitted closure diff was subsequently committed unchanged as `e2ef8789d526b0ec1544868015fa94a71d100586`; pre-commit hashes identified exact on-disk bytes. Committed-state verification uses Git blob bytes |
| Verdict / blockers         | `APPROVE WITH NON-BLOCKING RISKS` / zero blockers                                                                                                                                                                            |
| Validation                 | 58 relative links, strict UTF-8, LF endings, final newlines, whitespace, table structure, and `git diff --check` passed                                                                                                      |
| Mutation / network         | Reviewer made no mutations and no network calls                                                                                                                                                                              |
| Source / subsequent review | Stefan's supplied closure-diff review facts and dispositions; the final record-correction review was completed and its exact bytes committed as `b43f2d6`                                                                    |

| Finding / severity | Evidence and risk                                                                                                                                        | Disposition                                                                                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1 / MINOR         | The earlier corrected-state review record lacked findings, dispositions, and validation/mutation fields required by the template, reducing audit clarity | ACCEPTED AND CORRECTED: fields added in `b43f2d6`, with the supplied detailed findings and validation evidence completed in this administrative record                          |
| R2 / MINOR         | The administrative-record exception could permit unreviewed security, test-strategy, scope, severity, authorization, or governance changes               | ACCEPTED AND CORRECTED by the narrower rule in CLAUDE.md and this roadmap, reviewed and committed in `b43f2d6`                                                                  |
| R3 / MINOR         | `core.autocrlf=true` and no `.gitattributes` may produce CRLF working-tree files after a fresh Windows checkout; committed M0 Git blobs are LF           | ACCEPTED AND DEFERRED to authorized M1 kickoff: add `.gitattributes` containing `* text=auto eol=lf` before implementation files are introduced. Do not create it in this patch |

| NOTE finding                               | Disposition                                             |
| ------------------------------------------ | ------------------------------------------------------- |
| Outdated “untracked” wording               | Corrected in CLAUDE.md by `b43f2d6`                     |
| Ambiguous historical authorization wording | Corrected in docs/roadmap.md by `b43f2d6`               |
| Repeated “yet” in README                   | Corrected by `b43f2d6`                                  |
| Incomplete evidence-limitation wording     | Corrected in docs/roadmap.md by `b43f2d6`               |
| Missing accepted-MAJOR verdict rule        | Corrected in CLAUDE.md and docs/roadmap.md by `b43f2d6` |

### Final record-correction review — completed

| Field                 | Recorded evidence                                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Date / reviewer       | 2026-09-23 / Claude Opus 5.5 (`claude-opus-5-5`)                                                                                                               |
| Reviewed parent state | `e2ef8789d526b0ec1544868015fa94a71d100586`                                                                                                                     |
| Reviewed files        | CLAUDE.md, README.md, docs/roadmap.md                                                                                                                          |
| Committed state       | Reviewed bytes committed unchanged as `b43f2d602705ae2acf6f0cd59779c33d86cb4267`; the reviewed on-disk SHA-256 hashes below match the committed Git blob bytes |
| Verdict / blockers    | `APPROVE WITH NON-BLOCKING RISKS` / zero blockers                                                                                                              |
| Validation            | 58 links, 16 tables, headings, fences, UTF-8 without BOM, LF endings, final newlines, tabs, whitespace, and `git diff --check` passed                          |
| Mutation / network    | Reviewer made no mutations and no network calls                                                                                                                |
| Source / status       | Stefan's supplied final exact-state review facts and dispositions; this administrative record completes the M0 evidence and status                             |

| Reviewed file   | SHA-256 of reviewed on-disk bytes, unchanged in `b43f2d6` Git blobs |
| --------------- | ------------------------------------------------------------------- |
| CLAUDE.md       | `AB78BC751F85279D7350606E48A4F774B87BF00C2B40FBBB04E0719BAACE2F0B`  |
| README.md       | `D9FB63914DABD67CF7D79457EDC116702F59B1F7ABE3F8E280B7D68CE1850C33`  |
| docs/roadmap.md | `5FA9ECDFA4F9655EFE7D5597A8531991D032751A3868C854B4807E397CF66F20`  |

| Item | Severity | Disposition                                                                                                        |
| ---- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| F1   | MINOR    | Accepted and corrected by this administrative record                                                               |
| F2   | MINOR    | Accepted and corrected by stable post-commit status wording in this administrative record                          |
| F3   | NOTE     | Accepted and corrected by completing the review lists and committed-state wording                                  |
| F4   | NOTE     | Accepted and deferred to a separately authorized and reviewed M1 kickoff; no scope wording or file is changed here |
| F5   | NOTE     | Accepted for future review prompts; use the repository verdict `CHANGES REQUIRED`, not `REQUEST CHANGES`           |

### Review-record rule and template

Commit the exact reviewed implementation/document bytes first, under explicit Git authorization. A subsequent administrative record may add only review evidence, reviewer identity, reviewed-state identifiers, verdicts, validation results, status, findings, and dispositions. Any other change to requirements, scope, architecture, implementation, test strategy, security, severity rules, authorization rules, or governance requires an exact-state review. Identify the earlier reviewed commit explicitly; the record commit does not retroactively become the reviewed state. The review-rule correction received exact-state review and was committed unchanged as `b43f2d6`; this record supplies administrative evidence, status, findings, and dispositions only.

Use the template for each subsequent gate; unfilled fields mean pending, never approval. Verify committed states using Git blob bytes, such as the byte stream from `git show <commit>:<path>`, and uncommitted states using exact on-disk bytes. Record SHA-256 and identify which form was used; do not normalize or decode/re-encode bytes before hashing. Line-ending policy remains a separate validation. Distinguish reviewed content from the later administrative record, so the roadmap's own hash is unambiguous.

| Field                 | Required entry                                                                                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Review identity       | Date, gate, reviewer, actual model/version                                                                                                                                            |
| Exact state           | Branch, baseline and reviewed commit, tracked/untracked inventory, SHA-256 for each file with byte form identified (Git blob or on-disk); distinguish any later administrative record |
| Validation / mutation | Checks and exact results, limitations, whether the reviewer modified any files                                                                                                        |
| Findings              | ID, severity (`BLOCKER`, `MAJOR`, `MINOR`, `NOTE`), location, evidence, risk, correction, blocking status                                                                             |
| Disposition           | Stefan's acceptance/rejection and evidence, correction status, remaining decisions                                                                                                    |
| Verdict / next gate   | One allowed verdict from CLAUDE.md, corrected-state re-review status, explicit authorization still needed                                                                             |

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
