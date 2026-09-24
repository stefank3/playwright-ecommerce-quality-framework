# Extending within an approved milestone

Do not add product flows without scope approval. M2 adds four live UI and five live API cases to the controlled foundation. Before changes, read [architecture](architecture.md), [standards](engineering-standards.md), [test strategy](test-strategy.md), and [security](security.md).

1. Describe the risk and expected behavior in the scenario spec.
2. Add a small synthetic payload or markup fixture, never a captured production response.
3. Adjust pure contracts first if the consumer requirement changes; include a meaningful rejected input.
4. Keep UI interactions in the one relevant page/component abstraction and assertions in the scenario.
5. Compose dependencies and cleanup in fixtures. Do not import specs from support or HTTP clients from pure contracts/data.
6. Run the primary validation gate and update only documentation backed by actual behavior.

The network guard fulfills only the approved document. Any later synthetic resource must be explicitly intercepted before use; do not add a permissive route.continue fallback. Do not weaken offline settings to make a test pass. New tests should prove behavior or risk control rather than mirror method bodies.

Live extensions require scoped authorization and updates to the exact endpoint allowlist, negative tests, traffic budget and [policy record](live-testing.md). Keep contracts additive for unconsumed fields and strict for consumed fields. A mode flag alone never grants permission. Do not relax safety controls or assertions to accommodate site failures.
