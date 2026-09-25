# Interview guide

Rehearse against baseline `3193e84826dd3d01af1bf43295e11e7988acc605`. Use the [walkthrough](code-walkthrough.md) for source details and the [workbook](../guide/Playwright-Ecommerce-Quality-Framework-Guide.md) or [PDF](../guide/Playwright-Ecommerce-Quality-Framework-Guide.pdf) for lessons. Historical live results are in [live testing](live-testing.md); a successful old run does not establish current target health.

## Thirty-second explanation

“This is my portfolio test framework for ecommerce UI and API behavior, built with Playwright and strict TypeScript. Its automatic gate runs 49 deterministic tests against synthetic data with network denial. A separate, explicitly authorized lane has nine live scenarios for a shared practice site. Fixtures compose page objects and typed API boundaries, while Zod validates external data. The main design decision is separating repeatable framework evidence from time-specific live observations.”

## Two-minute explanation

“I built a test-focused modular monolith: one repository with clear boundaries between specs, fixtures, UI objects, API transport, contracts and configuration. There is no ecommerce application or backend in this repository.

“The default lane demonstrates framework behavior with a controlled product page and an injected in-memory API response. Supporting tests exercise configuration rejection, malformed data, isolation, redirects, error sanitization and network denial. The command wrapper installs a Node preload before Playwright starts; the browser is offline and only the synthetic document is fulfilled. Direct execution without the marker fails closed.

“Live testing is deliberately separate. Four UI scenarios cover search and cart behavior; five API scenarios cover products, brands, search and two rejected operations. The wrapper requires exact opt-in and an approved origin. Requests pass through fixed operations or browser allowlists, a shared 100-send budget, one-second spacing and a five-minute limit. One worker, no retries and fail-fast behavior limit repeated traffic. These controls prevent accidental requests in maintained tests; they are not a hostile-code sandbox.

“I keep assertions in specs and interactions in focused page objects. Zod validates consumed API fields and strips additive fields. I distinguish HTTP status from provider response codes. Reports also differ by lane: synthetic failures can keep traces, while live capture is disabled and errors are reduced to safe categories and numeric traffic evidence.

“The repository records two successful historical live runs, with only the first on the supported runtime. Current automatic CI validates the deterministic lane. I would not claim production impact, accessibility compliance or cross-browser coverage.”

## Five-minute demonstration plan

Prepare the runtime and dependencies before the interview. Leave live variables unset. This demonstration makes no live requests.

| Time      | Show                                                             | Explain                                                                                      |
| --------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| 0:00-0:40 | README and architecture diagram                                  | Portfolio scope, no application backend, two kinds of evidence.                              |
| 0:40-1:30 | `tests/deterministic/products.spec.ts` and deterministic fixture | A short scenario receives its collaborators; setup and cleanup stay out of its assertions.   |
| 1:30-2:15 | `ProductClient.list()` and `parseProducts`                       | Injected transport, status check, unknown input, runtime contract, safe error.               |
| 2:15-3:15 | `npm test -- --grep "read-only"`                                 | Two controlled scenarios run through the guard. Read the actual result, not an assumed pass. |
| 3:15-4:00 | Existing deterministic HTML report                               | Scenario provenance and failure-artifact policy; passing runs need not contain screenshots.  |
| 4:00-5:00 | Live config and recorded evidence, without executing             | Fixed target/budget/one worker; disclose limitations and one accepted deferred finding.      |

Open the existing report with `npm run report` beforehand if time is limited; it serves on loopback and needs Ctrl+C when finished. Keep the PDF available as a fallback. Do not replace a failed offline demo with an impromptu live run. Inspector is optional and can exceed the five-minute slot.

## Questions and concise answers

| Question                                            | Truthful answer                                                                                                                                                                                                                  |
| --------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Why Playwright?                                     | One runner supplies browser automation, HTTP contexts, dependency-aware fixtures, assertions and HTML reporting. This repository currently implements Chromium coverage only.                                                    |
| Why TypeScript?                                     | Strict types make fixture names, operation variants and returned contracts explicit. Indexed and optional-property checks surface uncertainty. Types alone cannot validate provider JSON.                                        |
| Why Zod?                                            | The input is unknown at runtime. Schemas validate fields the scenarios consume and produce typed outputs; additive fields are stripped.                                                                                          |
| Why not a generic HTTP client?                      | Only five provider operations are approved. A fixed operation union limits accidental URL/method expansion and keeps tests reviewable.                                                                                           |
| What does Page Object Model mean here?              | Small objects own navigation, interactions and meaningful locators. Specs own expected outcomes. There is no base-page hierarchy or assertion framework.                                                                         |
| How does dependency injection work?                 | Playwright fixtures construct page objects and clients and provide them through `use`. ProductClient takes a function; the live adapter takes a narrow requester and dispatcher. No DI container is needed.                      |
| What is deterministic here?                         | Inputs and expected results are controlled locally. The synthetic UI is fulfilled HTML, and the API response is injected. It does not mean execution duration is identical or every machine must succeed.                        |
| Why have live tests too?                            | Controlled tests cannot reveal actual provider selector or contract drift. Live tests add dated integration observations under a separate authorization and traffic policy.                                                      |
| Do API tests launch a browser?                      | Their requests do not use a page. However, the shared auto audit/guard requests a browser context, so these scenario suites still have browser setup. Pure boundary tests can avoid it.                                          |
| Why is direct Playwright restricted?                | It could omit the preload or wrapper controls. Config requires the lane's process marker, and wrappers restrict accepted arguments. Markers are operational safeguards, not security credentials.                                |
| How does headed mode work?                          | The live UI wrapper accepts UI plus headed and rejects headed API/list combinations. Visibility changes; policies and assertions do not. It still needs separate live authorization.                                             |
| Does offline browser mode prevent all live traffic? | The browser stays offline, but approved route-handler fetches deliberately use HTTP transport. That path performs policy checks and budget accounting.                                                                           |
| Why no retries?                                     | A retry could hide instability and repeat traffic. In the live lane maxFailures 1 also prevents another worker continuing with a fresh budget after failure.                                                                     |
| What does “typed API client” include?               | ProductClient validates one listing via an injected transport. LiveHttpTransport returns HTTP status and unknown JSON; the live spec applies the relevant pure parser. They are distinct layers, not a single inheritance chain. |
| Can HTTP 200 mean a rejected operation?             | Yes. Two provider examples return HTTP 200 with body responseCode 405 or 400. The spec checks both independently.                                                                                                                |
| Where are screenshots and traces?                   | Only synthetic failures may retain them locally. Live trace/screenshot/video and error context are disabled; live HTML and summary carry sanitized diagnostics.                                                                  |
| What does CI run?                                   | PRs and selected pushes install locked dependencies/Chromium and run validate, then check repository cleanliness. Live workflow is acknowledged manual dispatch only.                                                            |
| Does validate regenerate the PDF?                   | No. Python generation is an explicit docs command. Node repository checks validate guide inventory, links and PDF source/build fingerprint. Visual inspection is a separate publishing check.                                    |
| What would you improve first?                       | I would start with an approved risk: exhaustive UI search filtering or exact cart row count/reload checks. I would add deterministic coverage before any authorized live evidence.                                               |
| What business impact did this deliver?              | It is portfolio evidence of engineering practice. I have no demonstrated production-user or revenue outcome from this repository.                                                                                                |

## Trade-offs worth explaining aloud

One worker and zero retries simplify isolation and traffic reasoning at the cost of throughput. A fixed API operation table is intentionally less flexible than arbitrary requests. Hand-authored fixtures make failures reproducible but cannot predict provider drift. Additive schemas reduce unnecessary breakage but validate only the fields actually consumed. Narrow CSS fallbacks are necessary for unlabeled provider controls; they are still vulnerable to DOM change.

Disabling live raw capture reduces sensitive evidence retention but makes diagnosis harder. Categorical errors are not root-cause proof. The reporter expects trusted numeric traffic attachments from its fixture; it is not a general-purpose redaction service. Local locking and CI concurrency work within their environments, so an operator must coordinate across them.

## Honest limitations and deferred work

- Chromium only; no automated accessibility certification or Firefox/WebKit coverage.
- No checkout, payment, account lifecycle, persistent user data or production usage claim.
- UI search confirms the expected card, not that every returned card was filtered. Cart checks omit exact full-row count and reload persistence.
- Responses are buffered before byte limits; API/browser handling differs for HTTP 303.
- Newly documented during the study-guide review: API requests use no Playwright `page`, but shared automatic fixtures may still create a browser context. This is a potential future optimization, not an accepted historical N-1–N-5 disposition.
- Network patches protect maintained code against accidents, not malicious native code or all possible execution paths.
- Historical policy URLs redirected to the homepage without policy text; that did not grant unlimited permission.
- Two historical live suites passed; the second used Node 24.13.0 and is owner verification rather than supported-runtime evidence.
- MIT is intended, but no license grant/file is present. Broader hardening and release remain deferred.

## Before presenting

- Confirm the branch/commit and a clean or clearly disclosed documentation worktree.
- Select Node 24.21.0/npm 11 and installed Chromium; run `npm run validate` in advance and quote its actual count/result.
- Ensure no live QE_ variables are set. Never display a full environment map or credentials.
- Choose the two deterministic scenarios for the timed demonstration and have the existing report/PDF ready.
- Trace one UI and one API path without reading each line aloud.
- Explain the difference between static types, runtime contracts and business assertions.
- State exactly what historical live evidence proves and what it cannot prove now.
- Name one accepted limitation and an appropriately scoped next improvement.
- Close foreground Inspector/report processes after the demonstration.

## Rehearsal exercises

**Explain an empty products array.** Answer: HTTP can succeed, but `parseProducts` rejects an empty list because the consumer contract requires at least one item. A network diagnosis would be premature.

**Explain a caught blocked navigation.** Answer: the route records denial before aborting; its teardown audit still fails. Catching the immediate error cannot make the scenario clean.

**Explain why a third-party request was blocked without failing the live UI.** Answer: unsupported resource traffic is expected and counted; unauthorized navigation or routed request failures set the failure flag. Blocking ads does not prove full visual fidelity.

**Explain a missing failure screenshot.** Answer: live capture is disabled by policy. A passing synthetic run also need not retain a failure screenshot, and early setup failure may create no page.

**Explain a PDF mismatch in repository checks.** Answer: edit canonical Markdown/tooling, regenerate with pinned Python dependencies, inspect the pages and re-run checks. Never hand-edit the PDF or bypass the fingerprint.
