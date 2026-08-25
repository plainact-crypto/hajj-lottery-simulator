import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import baseSeoRoutes from '../seoRoutes.json';
import seasonalSeoRoutes from '../seasonalSeoRoutes.json';
import toolSeoRoutes from '../toolSeoRoutes.json';
import { SCALE_CONTENT } from '../content/scaleContent';

const SITE_URL = 'https://hajj-lottery-simulator.pages.dev';
const scaleSeoRoutes = Object.fromEntries(SCALE_CONTENT.map((page) => [page.path, {
  title: `${page.title} | محاكي قرعة الحج`,
  description: page.intro,
  index: true,
}]));
const seoRoutes = { ...baseSeoRoutes, ...seasonalSeoRoutes, ...toolSeoRoutes, ...scaleSeoRoutes };
const DEFAULT = seoRoutes['/' as keyof typeof seoRoutes];

function setMeta(selector: string, attr: string, value: string) {
  let node = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!node) {
    node = document.createElement('meta');
    const match = selector.match(/meta\[(name|property)="([^"]+)"\]/);
    if (match) node.setAttribute(match[1], match[2]);
    document.head.appendChild(node);
  }
  node.setAttribute(attr, value);
}

export function RouteSeo() {
  const location = useLocation();
  useEffect(() => {
    const pathname = location.pathname.replace(/\/$/, '') || '/';
    const meta = (seoRoutes as Record<string, typeof DEFAULT>)[pathname] ?? DEFAULT;
    const canonicalUrl = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
    document.title = meta.title;
    setMeta('meta[name="description"]', 'content', meta.description);
    setMeta('meta[name="robots"]', 'content', meta.index ? 'index,follow,max-image-preview:large' : 'noindex,follow');
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    setMeta('meta[property="og:url"]', 'content', canonicalUrl);
    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = canonicalUrl;
  }, [location.pathname]);
  return null;
}
