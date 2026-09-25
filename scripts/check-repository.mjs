/**
 * Validate maintained files, documentation links, guide freshness and selected imports.
 * Inputs are repository-local files; output is a summary or thrown validation error.
 * Reads files and Git's candidate inventory; no network, tests or file writes.
 */
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { dirname, resolve, relative, sep } from 'node:path';
import { TextDecoder } from 'node:util';

const root = process.cwd();
const excluded = new Set([
  '.git',
  'node_modules',
  '.runtime',
  'dist',
  'test-results',
  'playwright-report',
]);

/** Read tracked and non-ignored untracked paths, retaining fixed generated-directory exclusions. */
function maintainedFiles() {
  const result = spawnSync(
    'git',
    ['ls-files', '--cached', '--others', '--exclude-standard', '-z', '--', '.'],
    { cwd: root, encoding: 'utf8', shell: false, maxBuffer: 10 * 1024 * 1024 },
  );
  if (result.error || result.status !== 0)
    throw new Error('Cannot read Git maintained-file inventory.');
  return [...new Set(result.stdout.split('\0').filter(Boolean))]
    .filter((name) => !name.split('/').some((part) => excluded.has(part)))
    .sort()
    .map((name) => resolve(root, name));
}

const files = maintainedFiles();
const fileSet = new Set(files);
const workbook = 'guide/Playwright-Ecommerce-Quality-Framework-Guide';
const guideFiles = [
  'docs/code-walkthrough.md',
  'docs/interview-guide.md',
  `${workbook}.md`,
  `${workbook}.pdf`,
  'guide/requirements.txt',
  'scripts/docs_pdf.py',
];
for (const name of guideFiles) {
  if (!fileSet.has(resolve(root, name)))
    throw new Error(`Missing maintained guide file: ${name}`);
}
const guideHash = createHash('sha256');
for (const name of [
  `${workbook}.md`,
  'scripts/docs_pdf.py',
  'guide/requirements.txt',
]) {
  guideHash.update(readFileSync(resolve(root, name)));
}
const fingerprint = `Guide build SHA-256: ${guideHash.digest('hex')}`;
const walkthrough = readFileSync(resolve(root, guideFiles[0]), 'utf8');
for (const file of files) {
  const name = relative(root, file).split(sep).join('/');
  if (!walkthrough.includes(`\`${name}\``))
    throw new Error(`Maintained file missing from walkthrough: ${name}`);
}
const lessons = readFileSync(resolve(root, `${workbook}.md`), 'utf8').match(
  /^## \d{2}\. .+$/gm,
);
if (
  lessons?.length !== 30 ||
  lessons.some(
    (lesson, index) =>
      !lesson.startsWith(`## ${String(index + 1).padStart(2, '0')}. `),
  )
)
  throw new Error('Workbook requires 30 ordered numbered lessons.');
let links = 0;
for (const file of files) {
  const name = relative(root, file).split(sep).join('/');
  const bytes = readFileSync(file);
  if (name === `${workbook}.pdf`) {
    if (
      !bytes.subarray(0, 5).equals(Buffer.from('%PDF-')) ||
      !bytes.subarray(-16).toString('ascii').includes('%%EOF') ||
      bytes.length > 5 * 1024 * 1024 ||
      !bytes.includes(Buffer.from(`/Subject (${fingerprint})`))
    )
      throw new Error(
        'Invalid, oversized or stale study PDF; run npm run docs:pdf.',
      );
    continue;
  }
  if (name === 'docs/assets/live-report.png') {
    if (
      !bytes
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ||
      bytes.length > 1024 * 1024
    )
      throw new Error('Invalid or oversized curated report PNG.');
    continue;
  }
  const content = new TextDecoder('utf-8', {
    fatal: true,
    ignoreBOM: true,
  }).decode(bytes);
  if (
    content.startsWith('\uFEFF') ||
    content.includes('\r') ||
    content.includes('\t') ||
    !content.endsWith('\n') ||
    content.endsWith('\n\n') ||
    /[ \t]+$/m.test(content)
  ) {
    throw new Error(`Encoding/whitespace violation: ${name}`);
  }
  if (/\.(ts|mjs|py)$/.test(name) && content.split('\n').length > 350)
    throw new Error(`Source requires size review: ${name}`);
  if (name.endsWith('.md')) {
    if ((content.match(/^```/gm)?.length ?? 0) % 2)
      throw new Error(`Unbalanced fence: ${name}`);
    for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1];
      if (!target || /^(https?:|#)/.test(target)) continue;
      if (!fileSet.has(resolve(dirname(file), target.split('#')[0])))
        throw new Error(`Broken Markdown link: ${name}`);
      links++;
    }
  }
  if (/^src\//.test(name)) {
    for (const match of content.matchAll(/from ['"]([^'"]+)['"]/g)) {
      const specifier = match[1];
      if (!specifier?.startsWith('.')) continue;
      const target = relative(root, resolve(dirname(file), specifier))
        .split(sep)
        .join('/');
      if (target.startsWith('tests/'))
        throw new Error(`Support imports a spec: ${name}`);
      if (
        /^src\/(config|data|api\/contracts)\//.test(name) &&
        /^src\/(fixtures|ui|assertions)\//.test(target)
      )
        throw new Error(`Boundary cycle risk: ${name}`);
      if (
        /^src\/(data|api\/contracts)\//.test(name) &&
        /^src\/api\/(?!contracts\/)/.test(target)
      )
        throw new Error(`Pure code imports transport: ${name}`);
      if (/^src\/ui\//.test(name) && /^src\/api\//.test(target))
        throw new Error(`UI imports API: ${name}`);
      if (/^src\/(ui|api)\//.test(name) && target.startsWith('src/fixtures/'))
        throw new Error(`Abstraction imports fixture: ${name}`);
    }
  }
}
console.log(
  `Repository checks OK: ${files.length} maintained files, ${links} relative links, LF/UTF-8, source sizes and dependency direction.`,
);
