import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = async (name) => JSON.parse(await fs.readFile(path.join(ROOT, 'src', name), 'utf8'));
const base = await readJson('seoRoutes.json');
const seasonal = await readJson('seasonalSeoRoutes.json');
const tools = await readJson('toolSeoRoutes.json');
const source = await fs.readFile(path.join(ROOT, 'src', 'content', 'scaleContent.ts'), 'utf8');

const rowPattern = /\{path:'([^']+)',cluster:'([^']+)',title:'([^']+)',eyebrow:'([^']+)',intro:'([^']+)'/g;
const scale = [...source.matchAll(rowPattern)].map((m) => ({ path:m[1], cluster:m[2], title:m[3], intro:m[5] }));
const paths = scale.map((x) => x.path);
const titles = scale.map((x) => x.title);
const intros = scale.map((x) => x.intro);
const duplicates = (items) => [...new Set(items.filter((item, i) => items.indexOf(item) !== i))];

const problems = [];
if (duplicates(paths).length) problems.push(`Duplicate scale paths: ${duplicates(paths).join(', ')}`);
if (duplicates(titles).length) problems.push(`Duplicate scale titles: ${duplicates(titles).join(', ')}`);
if (duplicates(intros).length) problems.push(`Duplicate scale intros: ${duplicates(intros).join(', ')}`);
for (const page of scale) {
  if (page.title.length < 18) problems.push(`Title too weak: ${page.path}`);
  if (page.intro.length < 70) problems.push(`Intro too short: ${page.path}`);
}

const knownRoutes = new Set([...Object.keys(base), ...Object.keys(seasonal), ...Object.keys(tools), ...paths]);
if (knownRoutes.size < 100) problems.push(`Route inventory below Phase 11 gate: ${knownRoutes.size}/100`);
if (scale.length < 50) problems.push(`Scale registry below planned depth: ${scale.length}/50`);

if (problems.length) {
  console.error('Phase 11 content audit FAILED');
  for (const problem of problems) console.error(`- ${problem}`);
  process.exit(1);
}

const clusterCounts = scale.reduce((acc, page) => ({...acc, [page.cluster]:(acc[page.cluster]||0)+1}), {});
console.log(`Phase 11 content audit passed: ${knownRoutes.size} unique indexable route intents, ${scale.length} scaled pages.`);
console.log('Scale cluster counts:', clusterCounts);
