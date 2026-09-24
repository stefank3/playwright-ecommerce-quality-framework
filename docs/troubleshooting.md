# Troubleshooting

| Symptom                                     | Meaning and correction                                                                                                                 |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| npm engine error or doctor failure          | Activate Node 24.21.0 and npm 11; compare `node --version` with `.node-version`                                                        |
| Browser executable missing                  | Run `npx playwright install chromium` using this repository's pinned installation                                                      |
| Linux missing shared libraries              | Use the official `npx playwright install --with-deps chromium` setup command with appropriate privileges                               |
| Invalid deterministic configuration         | Clear unknown QE_ keys, reject live mode, and keep timeout within 1000–30000; values are deliberately not echoed                       |
| Node network access disabled                | A deterministic test attempted network transport; use an injected controlled response rather than weakening the guard                  |
| Unexpected browser request blocked          | A resource/navigation is not controlled; inspect the scenario and fixture, preserve fail-closed routing                                |
| Formatting or LF check fails after checkout | Confirm `.gitattributes` exists, run `npm run format`, then inspect the diff; do not change hash evidence through silent normalization |
| Lint fixture-parameter warning              | Playwright requires destructured fixture arguments; only the documented local exception is allowed                                     |
| Report contains no failure screenshot/trace | Passing tests do not retain failure artifacts; an early setup failure may have no page to capture                                      |
| Artifact directory rejected                 | Restore a real repository-local `test-results` directory, not a symlink/reparse point; do not point output outside the repository      |

For install failures, check registry/proxy access without posting credentials or full environment dumps. `npm ci` replaces dependency installation from the lockfile; do not delete or regenerate the lockfile to hide a compatibility error. Stop foreground report/debug processes with Ctrl+C before retrying locked files on Windows.

Direct Playwright/IDE runs without the preload fail closed; use the documented npm wrappers. Live commands require exact QE_LIVE/QE_BASE_URL opt-in; clear those variables before default commands. Output checks reject nested links as well as unsafe roots. If a live lock remains after an interrupted process, verify no local run is active before removing only that lock. A live safety stop or sanitized failure requires classification from the scenario, line location and numeric summary; do not repeat the suite or bypass a challenge. See [live testing](live-testing.md).
