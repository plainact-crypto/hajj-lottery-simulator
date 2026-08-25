import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SSR_DIST = path.join(ROOT, '.ssr-dist');
const SITE_URL = 'https://hajj-lottery-simulator.pages.dev';

const baseSeoRoutes = JSON.parse(await fs.readFile(path.join(ROOT, 'src', 'seoRoutes.json'), 'utf8'));
const seasonalSeoRoutes = JSON.parse(await fs.readFile(path.join(ROOT, 'src', 'seasonalSeoRoutes.json'), 'utf8'));
const toolSeoRoutes = JSON.parse(await fs.readFile(path.join(ROOT, 'src', 'toolSeoRoutes.json'), 'utf8'));
const seoRoutes = { ...baseSeoRoutes, ...seasonalSeoRoutes, ...toolSeoRoutes };
const sitemap = await fs.readFile(path.join(ROOT, 'public', 'sitemap.xml'), 'utf8');
const sitemapRoutes = [...sitemap.matchAll(/<loc>https:\/\/hajj-lottery-simulator\.pages\.dev([^<]*)<\/loc>/g)]
  .map((match) => match[1] || '/')
  .map((route) => route.replace(/\/$/, '') || '/');
const routes = [...new Set([...sitemapRoutes, '/trips'])];

const ssrEntry = path.join(SSR_DIST, 'entry-server.js');
const { render } = await import(pathToFileURL(ssrEntry).href);
const template = await fs.readFile(path.join(DIST, 'index.html'), 'utf8');

function escapeHtml(value) { return String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;'); }
function replaceOrInsert(html, regex, replacement, before = '</head>') { if (regex.test(html)) return html.replace(regex, replacement); return html.replace(before, `  ${replacement}\n${before}`); }
function withSeo(html, route) {
  const meta = seoRoutes[route] || seoRoutes['/'];
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
await fs.rm(SSR_DIST, { recursive: true, force: true });
console.log(`Prerendered ${routes.length} routes with route-specific metadata.`);
