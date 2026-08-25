import { Link, useLocation } from 'react-router-dom';
import baseSeoRoutes from '../seoRoutes.json';
import seasonalSeoRoutes from '../seasonalSeoRoutes.json';
import toolSeoRoutes from '../toolSeoRoutes.json';
import { SCALE_CONTENT } from '../content/scaleContent';

const SITE_URL = 'https://hajj-lottery-simulator.pages.dev';
const HOME_NAME = 'الرئيسية';

const scaleSeoRoutes = Object.fromEntries(SCALE_CONTENT.map((page) => [page.path, {
  title: `${page.title} | محاكي قرعة الحج`,
  description: page.intro,
  index: true,
}]));
const seoRoutes = { ...baseSeoRoutes, ...seasonalSeoRoutes, ...toolSeoRoutes, ...scaleSeoRoutes } as Record<string, { title: string; description: string; index: boolean }>;

const sectionNames: Record<string, string> = {
  '/egypt-hajj': 'الحج في مصر',
  '/hajj-lottery': 'حج القرعة',
  '/tourist-hajj': 'الحج السياحي',
  '/hajj-rituals': 'مناسك الحج',
  '/hajj-preparation': 'الاستعداد للحج',
  '/umrah': 'العمرة',
  '/makkah-madinah': 'مكة والمدينة',
  '/tools': 'الأدوات',
  '/data': 'البيانات',
  '/guides': 'الأدلة والمقالات',
};

function cleanTitle(title: string) {
  return title.replace(/\s*\|\s*محاكي قرعة الحج.*$/u, '').trim();
}

function routeLabel(path: string) {
  if (sectionNames[path]) return sectionNames[path];
  const meta = seoRoutes[path];
  if (meta) return cleanTitle(meta.title);
  const scale = SCALE_CONTENT.find((item) => item.path === path);
  if (scale) return scale.title;
  return path.split('/').filter(Boolean).at(-1)?.replaceAll('-', ' ') || HOME_NAME;
}

function breadcrumbsFor(pathname: string) {
  const clean = pathname.replace(/\/$/, '') || '/';
  if (clean === '/') return [{ name: HOME_NAME, path: '/' }];
  const parts = clean.split('/').filter(Boolean);
  const crumbs = [{ name: HOME_NAME, path: '/' }];
  for (let i = 0; i < parts.length; i += 1) {
    const path = `/${parts.slice(0, i + 1).join('/')}`;
    // Only expose intermediate crumbs that are actual indexable routes or known section hubs.
    if (i === parts.length - 1 || seoRoutes[path] || sectionNames[path]) {
      crumbs.push({ name: routeLabel(path), path });
    }
  }
  return crumbs;
}

export function SeoEnhancements() {
  const { pathname } = useLocation();
  const clean = pathname.replace(/\/$/, '') || '/';
  const meta = seoRoutes[clean] || seoRoutes['/'];
  const crumbs = breadcrumbsFor(clean);
  const canonical = `${SITE_URL}${clean === '/' ? '/' : clean}`;

  const webPage = {
    '@context': 'https://schema.org',
    '@type': clean.startsWith('/tools/') || clean === '/tools' ? 'WebApplication' : 'WebPage',
    name: cleanTitle(meta.title),
    description: meta.description,
    url: canonical,
    inLanguage: 'ar-EG',
    isPartOf: {
      '@type': 'WebSite',
      name: 'محاكي قرعة الحج',
      url: `${SITE_URL}/`,
    },
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path === '/' ? '/' : crumb.path}`,
    })),
  };

  return <>
    {clean !== '/' && <nav className="breadcrumbs" aria-label="مسار الصفحة">
      {crumbs.map((crumb, index) => <span key={crumb.path}>
        {index > 0 && <span className="breadcrumb-separator" aria-hidden="true">/</span>}
        {index === crumbs.length - 1 ? <span aria-current="page">{crumb.name}</span> : <Link to={crumb.path}>{crumb.name}</Link>}
      </span>)}
    </nav>}
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPage) }} />
    {clean !== '/' && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }} />}
  </>;
}
