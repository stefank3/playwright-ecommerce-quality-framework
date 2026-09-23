# Setup

Use Node.js 24.21.0 LTS and npm 11. `.node-version` pins the exact runtime; doctor rejects a different patch. Windows PowerShell is the locally verified platform. CI targets Ubuntu; macOS is not yet verified.

```sh
git clone https://github.com/stefank3/playwright-ecommerce-quality-framework.git
cd playwright-ecommerce-quality-framework
git checkout milestone/1-foundation
npm ci
npx playwright install chromium
npm run doctor
npm run validate
```

These commands have the same syntax in PowerShell and POSIX shells. On Linux, use `npx playwright install --with-deps chromium` to install browser system libraries as well. Browser installation may need administrator/package-manager permission. Use the approved Playwright installer; do not download arbitrary browser binaries.

Network access is needed for clone, npm registry installation and Playwright browser downloads. Test execution is deterministic and uses no live target. `.npmrc` disables lifecycle scripts and automatic audit/funding requests; run `npm audit` explicitly when reviewing dependencies. Do not enable install scripts globally to work around an error.

No `.env` file is needed or loaded. Configuration reads only framework-owned `QE_` keys from the environment; unexpected keys fail closed. Unrelated operating-system variables are ignored and never printed.

| Variable        | Default         | Allowed values                         |
| --------------- | --------------- | -------------------------------------- |
| `QE_MODE`       | `deterministic` | Only `deterministic`; live is rejected |
| `QE_TIMEOUT_MS` | `30000`         | Integer 1000–30000                     |

Optional timeout override in PowerShell:

```powershell
$env:QE_TIMEOUT_MS = '15000'
npm test
Remove-Item Env:QE_TIMEOUT_MS
```

POSIX alternative:

```sh
QE_TIMEOUT_MS=15000 npm test
```

No application/server process needs starting or stopping. Playwright owns and closes test browser contexts. `npm run report` and interactive debug mode remain foreground processes; close the Inspector or press Ctrl+C when finished.

The maintainer's separate `.runtime/` directory is ignored and not part of the project setup. Contributors should use their own Node version manager or the official distribution. Never commit machine-specific runtime paths or browser caches.
