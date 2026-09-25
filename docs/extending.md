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

## Study guide and PDF generation

The [workbook Markdown](../guide/Playwright-Ecommerce-Quality-Framework-Guide.md) is canonical; its [PDF](../guide/Playwright-Ecommerce-Quality-Framework-Guide.pdf) is maintained generated evidence, never manually edited. The [walkthrough](code-walkthrough.md) inventories every maintained file and the [interview guide](interview-guide.md) provides rehearsal scripts. Explain the inspected implementation, including limitations; do not treat historical roadmap text as current behavior.

Use Python 3.12 with the exact [requirements](../guide/requirements.txt) in an isolated environment. Python tooling does not belong in npm dependencies. The existing ignored `.runtime/` can hold the environment and PDF review images. From the repository root, PowerShell:

```powershell
python -m venv .runtime/docs-venv
.runtime/docs-venv/Scripts/Activate.ps1
python -m pip install -r guide/requirements.txt
npm run docs:pdf
```

POSIX shells:

```sh
python3 -m venv .runtime/docs-venv
. .runtime/docs-venv/bin/activate
python -m pip install -r guide/requirements.txt
npm run docs:pdf
```

If PowerShell activation is unavailable under local policy, call `.runtime/docs-venv/Scripts/python.exe scripts/docs_pdf.py` directly; do not weaken machine policy. The portable npm command uses `python` on PATH, supplied by the activated environment. Installation may download packages; generation itself reads local files only. An existing isolated runtime containing all exact pins can also generate the PDF. ReportLab provides layout. Prose and headings use bundled Bitstream Vera files; code and bullets may use standard PDF fonts such as Courier or Helvetica. Not every font is claimed to be embedded. Current rendering and text extraction were independently verified in Claude’s review. Pillow and charset-normalizer are pinned dependencies; pypdf validates the generated structure. No npm dependency or CI workflow changes are needed.

Every new tracked or non-ignored maintained file must be added to the walkthrough inventory. Git-aware discovery includes tracked files and untracked non-ignored files, excluding ignored local/editor files and the fixed runtime/generated directories. An editor directory is excluded only when Git ignores it; the checker does not silently exempt arbitrary editor paths.

### Supported workbook syntax and layout

The generator is intentionally a small workbook renderer, not a general Markdown converter. Use one `#` title, exactly 30 numbered `##` lessons, `###` subheadings, plain paragraphs, inline backtick code, bold emphasis, flat `-`/numbered lists, fenced ASCII code and rectangular pipe tables with a separator row. Blank lines separate blocks. Avoid nested lists, blockquotes, raw HTML, images, Markdown links, footnotes, italic syntax and embedded diagrams requiring remote rendering. Workbook paths are written as inline code; linked source navigation is provided by the walkthrough. Known unsupported constructs are rejected: Setext headings, horizontal rules, `+` lists, `1)` lists, strikethrough and link-reference definitions, alongside the existing checks for links, italics, blockquotes, raw HTML, heading depth and indentation. The validator supports a deliberately limited documented subset; it does not implement or classify the complete Markdown grammar. Code must fit the printable width; split long examples deliberately rather than relying on clipping or tiny type.

Each lesson begins on a new page for study navigation, with a generated clickable contents page and 30 PDF bookmarks. Paragraphs and table cells wrap; table headers repeat. A4 margins, bundled Vera prose/heading fonts plus standard PDF code/bullet fonts, fixed metadata and ReportLab invariant mode make generation byte-reproducible in the pinned environment. The PDF subject records a SHA-256 over workbook bytes, generator bytes and requirements bytes in that order. Node repository checks require that fingerprint without importing Python or regenerating output. This detects stale inputs, not arbitrary PDF tampering or visual quality. Cross-platform byte identity is not claimed until separately verified.

### Review generated evidence

1. Edit canonical Markdown and run formatting before generation, because byte changes affect the fingerprint.
2. Run `npm run docs:pdf` twice; compare the PDF SHA-256 after each run.
3. The generator checks 25-40 A4 pages, extractable text, 30 resolvable bookmarks and matching build metadata before atomically replacing output. Failures before replacement preserve the previous PDF. Temporary output is removed on normal handled exceptions; abrupt termination cannot guarantee cleanup. The narrow `guide/*.pdf.tmp` ignore rule covers interrupted temporary output, not the final PDF.
4. Extract text and review contents/navigation. Render every page with local Poppler (`pdftoppm -png -r 110 ...`) or an equivalent local PDF renderer. Inspect all pages for clipping/overlap, plus full-size title, contents, architecture, live-safety and interview pages. Extraction alone cannot establish layout quality.
5. Run `npm run validate` and `git diff --check`; inspect new untracked files too. Record results without running live tests or claiming a fresh live pass.

Keep environments, extracted text and rendered images under ignored `.runtime/`; do not commit them. The PDF is not regenerated by `validate` or CI. Documentation updates need explicit generation and visual review; required deterministic tests, their count and their execution wrappers remain unchanged.
