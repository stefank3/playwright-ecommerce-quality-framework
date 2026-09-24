# Test strategy

Required deterministic checks establish framework correctness under controlled inputs. Manual live checks establish observations about Automation Exercise at a recorded time. Neither lane substitutes for the other. Follow [architecture](architecture.md), [security](security.md), and the authorized [roadmap](roadmap.md).

## Lane isolation and coverage

The default configuration selects only `tests/deterministic/`; `playwright.live.config.ts` selects only `tests/live/`. Separate wrappers enforce configuration and output safety before runner startup. A deterministic preload sets a process-local internal marker, checked by configuration and fixtures; direct CLI/UI/VS Code execution without it fails closed. Inherited workers retain denial. Opt-in live variables cause default configuration to reject execution rather than switch lanes.

Deterministic tests cover the original controlled UI/API slice, config defaults/rejection, malformed and additive contracts, transport errors, data isolation, browser routing, preload enforcement, and fetch/HTTP/HTTPS/TLS/TCP/HTTP2/WebSocket/DNS/UDP denial. Synthetic fixtures are hand-authored, not raw captures. Negative live-origin and endpoint tests never dispatch requests. The guard covers maintained code using the tested built-ins, not arbitrary hostile native code.

| Live group         | Expected evidence                                                                     |
| ------------------ | ------------------------------------------------------------------------------------- |
| Product search     | Searched-products heading and matching Blue Top name/price                            |
| Two-product cart   | Both names, expected prices, exact quantities and total equals price times quantity   |
| Product quantity   | Three units in the isolated cart, with exact total                                    |
| Product removal    | The added row disappears from that cart                                               |
| API products       | HTTP 200, provider 200, non-empty schema and representative id/name/price             |
| API brands         | Non-empty valid brands with unique numeric IDs                                        |
| API search         | Non-empty validated results matching the fixed product term                           |
| API negative cases | HTTP status remains distinct from documented provider 405/400 and exact safe messages |

Contracts tolerate additive fields and strictly validate everything consumed. A schema failure must not be hidden by widening consumed types. Live expectations are consumer assertions backed by public provider documentation, not provider certification.

## Selectors and lifecycle

Prefer roles, placeholders, headings and domain relationships. Provider search submit, cart-add/remove icons and table cells lack usable accessible names, so documented IDs/classes are narrowly scoped to product cards/rows. Do not use positional selectors or arbitrary test sleeps. Budget waits are deliberate traffic throttling, not UI synchronization.

Each test gets a fresh context and session. Only transient cart additions/removal are allowed; no registration/login, review, contact, subscription, checkout, payment, order or persistent data. CSS/scripts may be cached across tests; cookies/session HTML may not. Close contexts even on failure.

## Execution bounds

`npm run doctor` is the offline preflight. Each test wrapper additionally validates output roots and nested links. Deterministic defaults are 30-second tests and five-second assertions; QE_TIMEOUT_MS accepts 1000–30000. Live uses 60-second tests, ten-second assertions, 15-second actions/HTTP, 45-second navigation, a five-minute global cap, one worker and zero retries. One failed live case stops further cases to preserve the shared budget and avoid traffic after a safety failure. Report unexecuted cases honestly.

At most 100 outbound dispatches, at least one second apart; redirects/assets count. See [live testing](live-testing.md) for allowlists and manual commands. No automatic live trigger exists. A focused rerun requires a concrete framework correction; never weaken assertions to force a pass.

## Failure classification and evidence

Classify failures as framework, selector/assertion, network/environment, or provider only when supported by evidence. An HTTP failure alone is not proof of a provider defect. Unknown cases remain untriaged. Report pass/fail/skip/unexecuted counts, duration, commands, traffic and limitations. No unexplained skips or flaky passes satisfy a gate.

Synthetic failures may retain local trace/screenshots. Live errors are sanitized before built-in HTML reporting; only fixed scenario metadata and numeric traffic evidence are attached. Raw traces, screenshots, DOM snapshots, cookie values and response bodies are disabled. Separate report/output directories preserve each lane's evidence. Manual CI retains only sanitized live artifacts for seven days; deterministic CI uploads nothing.

Accessibility and Firefox/WebKit remain separately scoped future work. No current automated check certifies WCAG conformance or cross-browser behavior.
