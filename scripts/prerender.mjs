import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SSR_DIST = path.join(ROOT, '.ssr-dist');
const SITE_URL = 'https://hajj-lottery-simulator.pages.dev';
const NOINDEX_ROUTES = new Set(['/trips']);

const baseSeoRoutes = JSON.parse(await fs.readFile(path.join(ROOT, 'src', 'seoRoutes.json'), 'utf8'));
const seasonalSeoRoutes = JSON.parse(await fs.readFile(path.join(ROOT, 'src', 'seasonalSeoRoutes.json'), 'utf8'));
const toolSeoRoutes = JSON.parse(await fs.readFile(path.join(ROOT, 'src', 'toolSeoRoutes.json'), 'utf8'));

// Scale pages live in a typed TS registry used by the React renderer. Parse only the
// stable path/title/intro fields here so build-time prerendering has the same routes
// without maintaining a second hand-written SEO registry.
const scaleSource = await fs.readFile(path.join(ROOT, 'src', 'content', 'scaleContent.ts'), 'utf8');
const scaleSeoRoutes = {};
const scalePattern = /\{path:'([^']+)',cluster:'[^']+',title:'([^']+)',eyebrow:'[^']+',intro:'([^']+)'/g;
for (const match of scaleSource.matchAll(scalePattern)) {
  const [, route, title, description] = match;
  scaleSeoRoutes[route] = { title: `${title} | محاكي قرعة الحج`, description, index: true };
}

const seoRoutes = { ...baseSeoRoutes, ...seasonalSeoRoutes, ...toolSeoRoutes, ...scaleSeoRoutes };
const routes = [...new Set([...Object.keys(seoRoutes), '/trips'])];

const ssrEntry = path.join(SSR_DIST, 'entry-server.js');
const { render } = await import(pathToFileURL(ssrEntry).href);
const template = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');

function escapeHtml(value) { return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }
function replaceOrInsert(html, regex, replacement, before = '</head>') { if (regex.test(html)) return html.replace(regex, replacement); return html.replace(before, `  ${replacement}\n${before}`); }
function withSeo(html, route) {
  const original = seoRoutes[route] || seoRoutes['/'];
  const meta = NOINDEX_ROUTES.has(route) ? { ...original, index: false } : original;
  const canonical = `${SITE_URL}${route === '/' ? '/' : route}`;
  let out = html;
  out = replaceOrInsert(out, /<title>.*?<\/title>/s, `<title>${escapeHtml(meta.title)}</title>`);
  out = replaceOrInsert(out, /<meta\s+name="description"\s+content="[^"]*"\s*\/>/i, `<meta name="description" content="${escapeHtml(meta.description)}" />`);
  out = replaceOrInsert(out, /<meta\s+name="robots"\s+content="[^"]*"\s*\/>/i, `<meta name="robots" content="${meta.index === false ? 'noindex,follow' : 'index,follow,max-image-preview:large'}" />`);
  out = replaceOrInsert(out, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/i, `<meta property="og:title" content="${escapeHtml(meta.title)}" />`);
  out = replaceOrInsert(out, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/i, `<meta property="og:description" content="${escapeHtml(meta.description)}" />`);
  out = replaceOrInsert(out, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/i, `<meta property="og:url" content="${canonical}" />`);
  out = replaceOrInsert(out, /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/i, `<link rel="canonical" href="${canonical}" />`);
  return out;
}

for (const route of routes) {
  const appHtml = render(route);
  let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
  html = withSeo(html, route);
  const outputFile = route === '/' ? path.join(DIST, 'index.html') : path.join(DIST, route.replace(/^\//, ''), 'index.html');
  await fs.mkdir(path.dirname(outputFile), { recursive: true });
  await fs.writeFile(outputFile, html, 'utf8');
}

const sitemapRoutes = routes.filter((route) => !NOINDEX_ROUTES.has(route) && seoRoutes[route]?.index !== false);
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapRoutes.map((route) => `  <url><loc>${SITE_URL}${route === '/' ? '/' : route}</loc></url>`).join('\n')}\n</urlset>\n`;
await fs.writeFile(path.join(DIST, 'sitemap.xml'), sitemapXml, 'utf8');

await fs.rm(SSR_DIST, { recursive: true, force: true });
console.log(`Prerendered ${routes.length} routes; sitemap contains ${sitemapRoutes.length} indexable routes.`);
