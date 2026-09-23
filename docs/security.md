# Proposed security controls

Planning only: these controls are requirements for future implementation, not deployed protections. M0 must not contact Automation Exercise or create external accounts/data. [AGENTS.md](../AGENTS.md) governs authorization; [roadmap](roadmap.md) controls progression.

## Threat model

Protected assets include developer/CI credentials, local files, synthetic data ownership, artifact contents, repository integrity, and the external site's availability. Trust boundaries are environment/configuration, browser/network responses, fixture inputs, filesystem paths, dependency installation, and CI artifact publication. Automation Exercise and its resources are externally controlled and untrusted. Neither a demo-site label nor repository approval grants permission for arbitrary testing.

| Risk | Required control |
| --- | --- |
| Secrets leak through configuration or logs | Allowlist variables, validate types, print safe names/status only, redact values before logging |
| Malicious or unexpected response data | Validate relevant schemas; bound input sizes; never execute response-derived shell commands or follow arbitrary target URLs |
| Excessive requests or unintended mutation | Explicit live opt-in, allowlisted origins/endpoints, bounded requests/time, read-only first, no automatic schedule activation |
| Sensitive browser evidence | Minimize capture, use synthetic contexts, prohibit unsafe uploads, review each artifact type |
| Filesystem escape or broad cleanup | Resolve and validate paths beneath the designated artifact root; reject traversal, absolute overrides, and symlink/reparse-point escape; delete only run-owned outputs |
| Compromised dependencies or workflows | Review additions, pin approved versions/actions, use least privilege and controlled updates |

## Secrets and synthetic data

Never commit `.env` files, tokens, credentials, authentication state, real customer data, private datasets, or machine-specific configuration. A future `.env.example` may contain variable names and safe placeholders only when configuration exists. Do not collect all environment variables for diagnostics. Secret scanning later complements manual review; it does not justify collecting secrets.

Use deterministic synthetic builders and reserved example domains. No real identities, payment details, deliverable email addresses, or copied production records. Future live mutations require explicit approval, unique run ownership, bounded lifecycle, and cleanup limited to that run's data. Prefer no account or authentication state at all for the initial slice.

If authentication is later approved, use dedicated synthetic accounts, least privilege, isolated short-lived contexts, and locally ignored storage state with restricted access. Never share state between tests or commit/upload it. Define expiration, cleanup, and revocation before enabling capture.

Keep Release Signal prompts, scoring, schema, billing, telemetry, security configuration, production data, and internal governance private. Only separately approved high-level public descriptions belong in this portfolio.

## External traffic policy

Required deterministic checks deny outbound network access, including setup and teardown; browser interception must cover the initial document and resources, with service workers blocked. Live mode requires explicit activation and validated HTTPS origins/endpoints. Reject unapproved redirects and third-party requests. Exact allowed hosts/paths must be approved before the first live run; M0 does not inspect the site to discover them.

Before the first authorized live run, re-check Automation Exercise Terms of Service and `robots.txt`, record the check date and relevant restrictions, and confirm the approved scenario and allowlist remain permitted. Neither check grants authorization by itself. Resolve uncertain or conflicting restrictions before live traffic. This check is deferred; M0 must not contact the target.

Dependencies with default telemetry or analytics must have it disabled or be rejected. Browser installation must use the approved Playwright installation mechanism during authorized implementation, separate from test execution; no browser download or dependency installation is permitted in M0.

Proposed starting limits for review: one live run at a time across local and scheduled execution, one worker, zero retries, a five-minute run cap, at most 100 outbound requests per run, and at least one second between outbound request dispatches. Count navigation, assets, API calls, redirects, and teardown requests, not just tests. If these limits prevent the scenario from running, stop and review the scope/budget; do not silently increase them. Implement enforcement before live execution. [Test strategy](test-strategy.md) supplies the separate test/assertion/request timeout proposals.

Stop on HTTP 429, blocking/challenge pages, access denial, budget exhaustion, or signs that traffic is harming the target. No bypass, retry storm, unattended tight loop, load/stress test, vulnerability scan, credential attack, scraping campaign, or destructive flow. Security tests use controlled local fixtures, owned systems, or explicitly authorized targets. A scheduled live workflow in M4 requires Stefan's approval of frequency and cancellation/concurrency policy and remains outside required PR checks.

## Artifacts, redaction, and retention

Use built-in reporters initially. Failure-only screenshot/trace capture is allowed only where data safety can be established; video is off by default. Redact authorization headers, cookies, tokens, query secrets, personal fields, and sensitive response values before logs or report attachments are written. Prefer field allowlists to fragile value matching.

Traces, screenshots, and videos cannot be assumed safely redacted by a logging filter. Disable capture for sensitive contexts; discard unsafe captures rather than upload them. Inspect artifacts before sharing, including DOM snapshots, network bodies, metadata, and console output. If a diagnostic cannot be made safe, report a sanitized error without that artifact.

Proposed retention is seven days maximum for local raw diagnostics and future CI failure artifacts; delete earlier when no longer needed. CI upload is off until redaction and publication risks are reviewed. Upload only explicit run-owned sanitized paths, never the workspace or home directory. Public-repository artifact access must not be treated as confidential. Any retained portfolio example requires separate review and publication authorization; never use raw traces as public sample evidence by default.

## Supply chain and CI

At the implementation gate, review package purpose, maintainer health, license, install scripts, known vulnerabilities, and transitive impact; minimize additions and use a reviewed lock file. Do not install tools during M0. Record dependency-update checks and unresolved risk dispositions later.

Future GitHub Actions default to `contents: read`, with extra permissions only for a justified job. Pin third-party actions to reviewed full commit SHAs and maintain an approved update policy with review and validation. Do not expose secrets to untrusted PR code or use privileged PR workflows to execute it. Required CI has no live-site credentials; isolate any separately approved live execution and apply bounded time/concurrency and artifact retention.

## Incident response

If sensitive material is generated or captured: stop execution and publication, restrict access, notify Stefan without repeating the secret, revoke/rotate exposed credentials, and remove unsafe local/CI artifacts within authorized scope. If committed or published, coordinate approved history cleanup and downstream removal; do not assume deletion revokes a credential. Preserve only sanitized incident facts, assess exposure, fix capture/redaction controls, and revalidate before resuming. Do not silently rewrite Git history or conceal the incident.
