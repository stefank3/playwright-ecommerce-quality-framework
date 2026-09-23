# Playwright Ecommerce Quality Framework

**Planning only — the M0 architecture contract is committed and independently reviewed. M1 and runtime implementation remain unauthorized and not started.** No framework, tests, dependencies, browser installation, or CI workflow exists. Installation and test commands are not yet implemented or validated. The reviewed commit and evidence limitations are recorded in the [roadmap](docs/roadmap.md).

This public portfolio repository belongs to Stefan Kajchevski (`stefank3`). It is intended for QA engineers and reviewers who want to understand how a small Playwright and strict TypeScript framework can separate repeatable framework validation from evidence gathered against a live ecommerce site. The portfolio aim is to demonstrate test design, maintainability, risk assessment, and honest release-quality decisions through future verified work.

## Planned capabilities

- Reusable UI interactions and a typed API client, composed through Playwright fixtures.
- Deterministic configuration and contract checks using synthetic fixtures and intercepted responses.
- Restrained, explicitly enabled live UI/API checks against Automation Exercise.
- Focused accessibility checks with `@axe-core/playwright`; automated checks cannot establish complete WCAG compliance.
- Built-in Playwright reporting and carefully controlled failure artifacts.
- Required deterministic GitHub Actions checks, with live execution in a separate manual or scheduled lane.

These are design targets, not implemented features. Chromium is the only initially required browser. Automation Exercise is an externally controlled live target: availability, content, timing, and behavior can change independently of this framework. Fixture-based checks cannot establish that the live product works.

## Scope and limits

The design is a test-focused modular monolith. No separate ecommerce application is planned. Milestone 1 is limited to one read-only UI scenario, one API scenario, validated configuration, one UI abstraction, one API client, failure artifacts, and basic documentation. Broader coverage, accessibility hardening, CI, presentation evidence, and release work belong to later milestones.

No badges, screenshots, execution results, or verified Quick Start are available at this stage. MIT is the approved intended license, but no `LICENSE` file exists yet. No open-source license has been granted yet; GitHub platform rights to view and fork the public repository still apply. Runtime and dependency versions remain undecided until the implementation gate.

## Read the contract

- [Agent governance and authority](AGENTS.md)
- [Independent Claude Code review contract](CLAUDE.md)
- [Architecture and decision rationale](docs/architecture.md)
- [Test strategy and evidence limits](docs/test-strategy.md)
- [Engineering standards and future command contract](docs/engineering-standards.md)
- [Security and external-target controls](docs/security.md)
- [Roadmap, current status, and approval gates](docs/roadmap.md)
