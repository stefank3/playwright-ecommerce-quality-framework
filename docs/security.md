# Security controls

M2 implements deterministic network denial plus a separately authorized, explicitly opted-in live lane for the two exact Automation Exercise hosts. Four UI and five API scenarios may run once under Stefan's current authorization; follow [live testing](live-testing.md) for policy evidence, limits and manual commands. [AGENTS.md](../AGENTS.md) governs authority and [roadmap](roadmap.md) progression. No persistent content, other target, M2 merge, release or deployment is authorized.

## Threat model

Protected assets include developer/CI credentials, local files, synthetic data ownership, artifact contents, repository integrity, and the external site's availability. Trust boundaries are environment/configuration, browser/network responses, fixture inputs, filesystem paths, dependency installation, and CI artifact publication. Automation Exercise and its resources are externally controlled and untrusted. Neither a demo-site label nor repository approval grants permission for arbitrary testing.

| Risk                                       | Required control                                                                                                                                                       |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Secrets leak through configuration or logs | Allowlist variables, validate types, print safe names/status only, redact values before logging                                                                        |
| Malicious or unexpected response data      | Validate relevant schemas; bound input sizes; never execute response-derived shell commands or follow arbitrary target URLs                                            |
| Excessive requests or unintended mutation  | Explicit live opt-in, allowlisted origins/endpoints, bounded requests/time, read-only first, no automatic schedule activation                                          |
| Sensitive browser evidence                 | Minimize capture, use synthetic contexts, prohibit unsafe uploads, review each artifact type                                                                           |
| Filesystem escape or broad cleanup         | Resolve and validate paths beneath the designated artifact root; reject traversal, absolute overrides, and symlink/reparse-point escape; delete only run-owned outputs |
| Compromised dependencies or workflows      | Review additions, pin approved versions/actions, use least privilege and controlled updates                                                                            |

## Secrets and synthetic data

Never commit `.env` files, tokens, credentials, authentication state, real customer data, private datasets, or machine-specific configuration. A future `.env.example` may contain variable names and safe placeholders only when configuration exists. Do not collect all environment variables for diagnostics. Secret scanning later complements manual review; it does not justify collecting secrets.

Use deterministic synthetic builders and reserved example domains. No real identities, payment details, deliverable email addresses, or copied production records. Future live mutations require explicit approval, unique run ownership, bounded lifecycle, and cleanup limited to that run's data. Prefer no account or authentication state at all for the initial slice.

If authentication is later approved, use dedicated synthetic accounts, least privilege, isolated short-lived contexts, and locally ignored storage state with restricted access. Never share state between tests or commit/upload it. Define expiration, cleanup, and revocation before enabling capture.

Keep Release Signal prompts, scoring, schema, billing, telemetry, security configuration, production data, and internal governance private. Only separately approved high-level public descriptions belong in this portfolio.

## External traffic policy

Required deterministic tests deny the covered Node built-ins and browser outbound traffic including setup/teardown; direct runner invocation without the preload is rejected. Both browser lanes stay offline with service workers and DNS blocked. In the live lane only approved route-handler fetches and fixed API operations dispatch through the shared budget. HTTPS origins, paths, methods, redirects and query parameters are checked; unrelated assets/third parties are aborted. These are maintained-test safety controls, not a hostile-code sandbox.

Before an authorized live run, re-check Terms and `robots.txt`, record the date/restrictions, and confirm the scenario/allowlist. Neither check grants authority by itself. The 2026-09-24 paths redirected to the homepage without policy text; [live testing](live-testing.md) records that limitation and its disposition. Resolve uncertain/conflicting restrictions before execution.

Dependencies with default telemetry or analytics must have it disabled or be rejected. Browser installation must use the approved Playwright installation mechanism during authorized implementation, separate from test execution; the authorized M1 setup uses the official Playwright installer; downloads are separate from deterministic execution.

Enforced limits: one worker, zero retries, five-minute cap, at most 100 outbound dispatches including assets/API/redirects, and one second between dispatches. Local locking and manual-workflow concurrency prevent overlapping runs within each environment; the operator must coordinate across local/CI because no distributed lock exists. Cache hits and blocked requests are counted separately. If limits prevent execution, stop; never silently raise them. [Live testing](live-testing.md) documents fixed paths and timeout bounds.

Stop on HTTP 401/403/429, detected challenge pages, budget exhaustion or signs of harm. No bypass, retry storm, load testing, scanning, credential attacks or scraping campaigns. One failure stops the live suite; focused reruns need a concrete framework correction. Live CI is manual-only, never scheduled or an automatic PR gate.

## Artifacts, redaction, and retention

Built-in HTML reporting is retained. Synthetic failures may capture traces/screenshots. Live traces/screenshots/video and raw error context are disabled; a sanitizer reduces errors to categories before downstream reporters and retains only fixed scenario metadata and numeric traffic attachments. No raw response, cookie, authorization header, environment map or personal field is attached. Safe summary JSON serves as live failure evidence instead of an unredactable raw trace.

Traces, screenshots, and videos cannot be assumed safely redacted by a logging filter. Disable capture for sensitive contexts; discard unsafe captures rather than upload them. Inspect artifacts before sharing, including DOM snapshots, network bodies, metadata, and console output. If a diagnostic cannot be made safe, report a sanitized error without that artifact.

Retention is at most seven days. Deterministic CI uploads nothing; the authorized manual workflow uploads only `playwright-report/live/` and `test-results/live/summary.json`, never the workspace. Live and deterministic outputs are separated so later offline validation preserves live evidence. Local retention requires manual deletion; no scheduler exists. Public artifacts are not confidential. No raw trace is a public portfolio sample; any curated image needs inspection before publication.

## Supply chain and CI

At the implementation gate, review package purpose, maintainer health, license, install scripts, default telemetry/analytics behavior, known vulnerabilities, and transitive impact; minimize additions and use a reviewed lock file. Default telemetry/analytics must be disabled or the dependency rejected, consistent with the external traffic policy. M1 dependencies were selected under the explicit implementation authorization. Record dependency-update checks and unresolved risk dispositions later.

The M1 GitHub Actions workflow uses `contents: read`, with extra permissions only for a justified job. Pin third-party actions to reviewed full commit SHAs and maintain an approved update policy with review and validation. Do not expose secrets to untrusted PR code or use privileged PR workflows to execute it. Required CI has no live-site credentials; isolate any separately approved live execution and apply bounded time/concurrency and artifact retention.

## Incident response

If sensitive material is generated or captured: stop execution and publication, restrict access, notify Stefan without repeating the secret, revoke/rotate exposed credentials, and remove unsafe local/CI artifacts within authorized scope. If committed or published, coordinate approved history cleanup and downstream removal; do not assume deletion revokes a credential. Preserve only sanitized incident facts, assess exposure, fix capture/redaction controls, and revalidate before resuming. Do not silently rewrite Git history or conceal the incident.
