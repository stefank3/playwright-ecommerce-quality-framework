# Proposed test strategy

Planning only: no scenarios, runners, commands, or results exist. The objective is to show reliable framework behavior and honestly bounded live product evidence. Follow [architecture](architecture.md), [security](security.md), and the locked M1 scope in [roadmap](roadmap.md).

## Initial slice and coverage

M1 contains one read-only UI scenario and one API scenario, validated configuration, one UI abstraction, one API client, failure artifacts, and corresponding basic documentation. A candidate pair is viewing a product listing and reading a product-list API response. Exact scenario, endpoint, and expected fields remain subject to the implementation gate; nothing about the live endpoint has been verified during M0. Prefer read-only API behavior as well as read-only UI behavior.

Framework/configuration/contract checks support that same slice; they must not introduce additional product flows. Full checkout, account lifecycle, broad page hierarchies, multiple browsers, custom reporting, comprehensive accessibility, CI, and presentation work are outside M1.

## Lane contract

| Lane | Planned checks | Meaning and limits |
| --- | --- | --- |
| Required deterministic | Config rejection/defaults, synthetic API contracts, malformed payload handling, meaningful builder/adapter checks, UI boundary behavior on controlled markup and intercepted responses | Proves framework behavior under controlled inputs; cannot prove live site availability, actual selectors, product correctness, or conformance to a provider-owned contract |
| Optional live | Approved read-only UI/API integration checks against Automation Exercise, manual or separately authorized scheduled runs | Evidence for the observed target and time only; externally dependent and excluded from required PR validation |

Deterministic fixtures are hand-authored and synthetic, versioned with expected contract changes, and never raw production captures. Include valid, missing-field, wrong-type, and relevant error examples within the approved slice. Contracts express consumer expectations, not a claim of provider agreement. Review fixture drift against later authorized live observations; never update fixtures just to make a failure disappear.

For UI interception, control the initial document and all network resources; fail closed on unhandled network attempts and block service workers. Minimal test markup is a fixture, not a local ecommerce application. Use injected controlled responses for API boundary checks. A required check must not contact Automation Exercise even during setup or teardown. Suite selection must enforce lane isolation, not rely only on labels.

Selecting and recording the lane-isolation enforcement mechanism is a required M1 gate decision before implementation. It must make deterministic and live suite selection disjoint and prevent accidental live execution. No mechanism is selected or implemented in M0.

## Selectors, isolation, and lifecycle

Prefer accessible role/name and label locators, scoped to a meaningful region. Use stable test IDs only if actually available; use a documented, narrowly scoped fallback for an externally controlled DOM. Avoid positional selectors, brittle CSS chains, arbitrary sleeps, and speculative test IDs. Controlled markup can validate locator mechanics but does not validate the current live DOM.

Give every test its own browser/request context and fixtures. Do not depend on ordering, shared accounts, storage state, or other tests' mutations. Use seeded deterministic builders and reserved example domains, never real customer identities. Validate relevant HTTP status, schema, and meaningful values; do not assert only that a response exists.

Future mutating scenarios require separate approval, unique synthetic ownership markers, a bounded cleanup plan, and a way to report cleanup failure. Clean up only resources created by that run. Never delete unrelated records or retry non-idempotent operations blindly. Close contexts in teardown even on failure.

## Runtime policy to implement later

Future preflight means `npm run doctor`, the intended entry point defined in [engineering standards](engineering-standards.md). It is not implemented or validated in M0.

Start Chromium only. Proposed defaults are zero test retries in both lanes, 30-second test timeout, 5-second assertion timeout, and 10-second API request timeout; approve final values at the implementation gate. Investigate failures before introducing a documented exception. Use condition-based Playwright waiting within bounds. A later accepted retry must preserve the original failure and report flakiness rather than conceal it.

Live execution follows the single-run, single-worker, request-budget policy in [security](security.md). It stops on throttling or blocking and cannot automatically restart as a retry. Deterministic parallelism can be considered only after isolation is proven; it must not silently raise live concurrency.

Every skipped or quarantined test needs a reason, owner, affected risk, review/expiry date, and restoration criterion. Report exclusions alongside results. An unexplained skip or flaky pass cannot satisfy a milestone gate.

## Failure classification and evidence

| Category | Evidence and response |
| --- | --- |
| Framework defect | Shared client/configuration/fixture behavior violates its contract; reproduce with controlled input and fix the shared boundary |
| Test defect | Incorrect expectation, selector, setup, or cleanup; correct the test without weakening the requirement |
| Product defect | Observed live behavior contradicts an established expectation after environmental causes are assessed; record sanitized evidence and uncertainty |
| External target instability | Outage, throttling, third-party resource failure, or changing content; mark externally blocked/unstable, never count it as a framework pass |
| Environment or configuration failure | Missing browser, invalid settings, denied output path, or network setup issue; fail preflight and report safe diagnostics |

Classify from evidence, not merely HTTP status. Preserve an unknown/untriaged outcome until the cause is supported; do not automatically label every live failure as external instability. Reports must include lane, scenario, timing, relevant versions, and sanitized error context.

Use built-in Playwright reports, with failure-only screenshots/traces where capture is safe. Video is off by default. Apply [redaction, retention, and upload restrictions](security.md) before collection or sharing. No sensitive raw artifact is acceptable merely because a test failed.

## Accessibility and later browsers

In M3, use `@axe-core/playwright` for approved pages/states and record rules, scope, exclusions, and tooling version. Automated checks detect only part of accessibility risk and do not certify WCAG compliance. Manual keyboard, focus, and screen-reader assessment remains separately scoped work. Live accessibility checks follow live traffic controls. Firefox/WebKit and any expanded browser matrix require later risk-based scope approval.
