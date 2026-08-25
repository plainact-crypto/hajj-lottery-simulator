import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const SITE_URL = 'https://hajj-lottery-simulator.pages.dev';
const PUBLISHER = 'pub-3834409606150590';
const problems = [];
const warnings = [];

const read = (file) => fs.readFile(path.join(DIST, file), 'utf8');
const exists = async (file) => { try { await fs.access(path.join(DIST, file)); return true; } catch { return false; } };
const routeFile = (route) => route === '/' ? 'index.html' : `${route.replace(/^\//, '')}/index.html`;
const pick = (html, re) => html.match(re)?.[1]?.trim() || '';

const sitemap = await read('sitemap.xml');
const routes = [...sitemap.matchAll(/<loc>https:\/\/hajj-lottery-simulator\.pages\.dev([^<]*)<\/loc>/g)]
  .map((match) => match[1] || '/')
  .map((route) => route.replace(/\/$/, '') || '/');

if (routes.length < 100) problems.push(`Production sitemap has only ${routes.length} routes; expected at least 100.`);
if (new Set(routes).size !== routes.length) problems.push('Production sitemap contains duplicate URLs.');

const titles = new Map();
const descriptions = new Map();
const routeSet = new Set([...routes, '/trips']);

for (const route of routes) {
  const file = routeFile(route);
  if (!(await exists(file))) { problems.push(`Missing prerendered HTML for ${route}`); continue; }
  const html = await read(file);
  const title = pick(html, /<title>(.*?)<\/title>/s);
  const description = pick(html, /<meta\s+name="description"\s+content="([^"]*)"/i);
  const canonical = pick(html, /<link\s+rel="canonical"\s+href="([^"]*)"/i);
  const robots = pick(html, /<meta\s+name="robots"\s+content="([^"]*)"/i);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  const jsonLd = [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map((m) => m[1]);

  if (!title) problems.push(`Missing title: ${route}`);
  if (!description || description.length < 50) problems.push(`Missing/weak meta description: ${route}`);
  const expectedCanonical = `${SITE_URL}${route === '/' ? '/' : route}`;
  if (canonical !== expectedCanonical) problems.push(`Canonical mismatch: ${route} -> ${canonical || 'missing'}`);
  if (!robots.includes('index')) problems.push(`Indexable sitemap route lacks index robots directive: ${route}`);
  if (h1Count !== 1) problems.push(`Expected exactly one H1 on ${route}; found ${h1Count}.`);
  if (!html.includes('<div id="root">') || html.includes('<div id="root"></div>')) problems.push(`Route is not server-prerendered: ${route}`);
  if (!jsonLd.length) problems.push(`Missing JSON-LD structured data: ${route}`);
  for (const raw of jsonLd) { try { JSON.parse(raw); } catch { problems.push(`Invalid JSON-LD on ${route}`); } }

  if (title) {
    if (titles.has(title)) problems.push(`Duplicate title: ${route} and ${titles.get(title)} -> ${title}`);
    else titles.set(title, route);
  }
  if (description) {
    if (descriptions.has(description)) warnings.push(`Duplicate meta description: ${route} and ${descriptions.get(description)}`);
    else descriptions.set(description, route);
  }

  const hrefs = [...html.matchAll(/href="(\/[^"]*)"/g)].map((m) => m[1].split('#')[0].split('?')[0]);
  for (const href of hrefs) {
    if (!href || href === '/' || /\.[a-z0-9]{2,5}$/i.test(href)) continue;
    const clean = href.replace(/\/$/, '') || '/';
    if (!routeSet.has(clean) && !(await exists(routeFile(clean)))) warnings.push(`Internal link target is outside sitemap/known routes: ${route} -> ${clean}`);
  }
}

const robotsTxt = await read('robots.txt');
if (!/User-agent:\s*\*/i.test(robotsTxt) || !/Allow:\s*\//i.test(robotsTxt)) problems.push('robots.txt does not clearly allow crawling.');
if (!robotsTxt.includes(`${SITE_URL}/sitemap.xml`)) problems.push('robots.txt sitemap URL mismatch.');

const adsTxt = (await read('ads.txt')).trim();
if (!adsTxt.includes(`google.com, ${PUBLISHER}, DIRECT, f08c47fec0942fa0`)) problems.push('ads.txt publisher record is missing or changed.');
const indexHtml = await read('index.html');
if (!indexHtml.includes(`ca-${PUBLISHER}`)) problems.push('AdSense publisher ID in index.html does not match ads.txt.');

const notFound = await read('404.html');
if (!/name="robots"\s+content="noindex,follow"/i.test(notFound)) problems.push('404.html must be noindex,follow.');
if (!/<h1>الصفحة غير موجودة<\/h1>/.test(notFound)) problems.push('404.html is missing its visible H1.');

if (problems.length) {
  console.error(`Phase 12 QA FAILED with ${problems.length} blocking issue(s):`);
  for (const problem of problems) console.error(`- ${problem}`);
  if (warnings.length) { console.error(`Warnings (${warnings.length}):`); for (const warning of warnings.slice(0, 25)) console.error(`- ${warning}`); }
  process.exit(1);
}

console.log(`Phase 12 QA PASSED: ${routes.length} sitemap routes, prerendering, metadata, canonical, H1, JSON-LD, robots, 404 and ads.txt checks are clean.`);
if (warnings.length) {
  console.log(`Non-blocking warnings: ${warnings.length}`);
  for (const warning of warnings.slice(0, 25)) console.log(`- ${warning}`);
}
