# Proposed architecture

Planning-only design, subject to the [roadmap review gate](roadmap.md). [Engineering standards](engineering-standards.md) own shared implementation rules; [security](security.md) owns traffic and artifact controls.

## Shape and rationale

Use one test-focused modular monolith: a single repository and toolchain with explicit support-module boundaries. There is no deployment or scaling requirement that warrants services. No separate ecommerce application will be built.

Select `src/` for reusable test support and `tests/` for scenario orchestration. This makes dependency direction visible and keeps specs from becoming utility libraries. Support under `tests/` would save one directory but blur reusable contracts and scenario setup as coverage grows. `src/` is not an application or a separately published library; introduce only modules needed by the authorized slice.

Proposed shape only; none of these directories exists in M0:

```text
src/
  api/          # typed operations; pure contracts in a separate boundary
  config/       # validated execution policy
  data/         # synthetic builders and controlled payloads
  fixtures/     # composition and lifecycle
  ui/           # small page/component abstractions
  assertions/   # shared quality expectations
tests/
  deterministic/
  live/
  accessibility/
```

## Boundaries and dependency direction

| Boundary | Responsibility and permitted dependencies | Reason |
| --- | --- | --- |
| Configuration | Parse environment and explicit mode into immutable typed settings; validate origins, budgets, paths, and timeouts before use | Central validation prevents accidental live execution and inconsistent defaults |
| Data | Pure synthetic builders, fixed seeds, controlled response/markup fixtures; no network, environment reads, or specs | Repeatable inputs make failures explainable |
| API | Typed endpoint operations using injected Playwright request context and validated settings; pure response schemas/types in a transport-independent boundary such as `src/api/contracts/` | Runtime validation protects against malformed external data without a generic provider framework |
| UI | One small abstraction initially, using injected Playwright page and semantic locators; no API orchestration or test assertions | Reuse interactions while keeping scenario intent in specs |
| Fixtures | Compose config, data, UI, and API dependencies; own isolated context creation and teardown | Playwright fixtures provide lifecycle management without custom dependency injection |
| Assertions | Reusable expectations over values or public UI observations; may use Playwright assertions and pure API contract types | Share meaningful checks without hiding entire scenarios |
| Suites | Depend on fixtures and public abstractions/assertions; define scenario intent and expected outcomes | Specs orchestrate; support modules never import specs |
| Reporting | Playwright built-in reporters and policy-controlled output configuration, outside domain assertions | Avoid custom reporting infrastructure until a concrete unmet need exists |

Dependency flow is suites → fixtures/abstractions/assertions → validated configuration and pure data/contracts. Fixtures may import UI/API modules; UI/API modules never import fixtures or suites. UI and API do not import one another. Configuration and data do not depend on browser, transport, reporter, or spec modules. Pure response contracts may be used by API clients and assertions without importing a live client. Avoid cycles and cross-module private imports.

The pure API contract boundary, such as `src/api/contracts/`, must not import the HTTP client, fixtures, assertions, or transport concerns. Fixtures and test-data builders may import pure, transport-independent API contract types from this boundary. Consumers import its public contract surface directly, not an API barrel that also imports the client; the contract boundary must never bring in the HTTP client or transport concerns. This keeps assertions and data builders independent of transport and prevents dependency cycles. This is a proposed boundary only; no folders are created in M0.

Keep SDK and HTTP handling at UI/API boundaries. Inject only the page, request context, and settings actually needed; no generic ports hierarchy, service locator, or custom DI container. Assertions expose business-relevant expectations without implementing product business logic.

## Two execution lanes

The required deterministic lane validates framework behavior against hand-authored synthetic payloads and minimal markup. A UI boundary check may fulfill its initial document and all resources with Playwright interception, or use static in-memory markup. It must not navigate to the real site and then intercept only an API call. Deny unhandled outbound requests, block service workers, and fail on attempted external access. API contract checks use local fixture values or an injected controlled transport, never a live base URL. No standalone application or server is required.

The optional live lane injects an explicitly enabled, allowlisted Automation Exercise origin into the same narrow public boundaries. It provides evidence of integration with an externally controlled target. There is no fallback from deterministic to live, and no fallback that turns live failures into fixture successes. Lane and provenance must appear in results. See [test strategy](test-strategy.md) for evidence limits and failure classification.

Accessibility specs under `tests/accessibility/` must be explicitly assigned to a lane. Controlled markup checks are deterministic; live-page audits obey live policy and never enter required PR checks merely because of their directory name.

## Artifacts and rejected complexity

Built-in reporters are the initial reporting choice because they supply familiar diagnostics with little maintenance. Failure capture is conditional on the [artifact policy](security.md); traces may contain entire responses and cannot be assumed redacted. Keep artifact collection outside reusable domain assertions.

Strict TypeScript plus runtime schemas are complementary: types help development, while schemas validate untrusted runtime values. Chromium alone limits initial matrix cost. Additional browsers need demonstrated coverage value after the narrow slice.

Exclude microservices, Kubernetes, Cucumber, Allure, Docker, cloud browser grids, visual-testing SaaS, test-management integrations, custom reporters, broad page-object inheritance, and large utility libraries unless a later approved need justifies them. AI-provider and MCP abstractions belong to later repositories, not this framework. Dependency candidates and individual rationale are in [engineering standards](engineering-standards.md).
