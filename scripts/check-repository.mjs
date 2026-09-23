import { readdirSync, readFileSync } from 'node:fs';
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

/** List maintained text files without descending into dependencies, Git, or generated output. */
function filesUnder(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (excluded.has(entry.name)) return [];
    const path = resolve(directory, entry.name);
    return entry.isDirectory() ? filesUnder(path) : [path];
  });
}

const files = filesUnder(root);
const fileSet = new Set(files);
let links = 0;
for (const file of files) {
  const name = relative(root, file).split(sep).join('/');
  const bytes = readFileSync(file);
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
  if (/\.(ts|mjs)$/.test(name) && content.split('\n').length > 350)
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
