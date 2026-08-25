import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Disclaimer } from './Disclaimer';
import { RouteSeo } from './RouteSeo';
import { SeoEnhancements } from './SeoEnhancements';

const links = [
  ['/egypt-hajj/2027', '/egypt-hajj', 'الحج في مصر'],
  ['/hajj-lottery/2027', '/hajj-lottery', 'حج القرعة'],
  ['/tourist-hajj/2027', '/tourist-hajj', 'الحج السياحي'],
  ['/hajj-rituals', '/hajj-rituals', 'مناسك الحج'],
  ['/hajj-preparation', '/hajj-preparation', 'الاستعداد'],
  ['/umrah', '/umrah', 'العمرة'],
  ['/makkah-madinah', '/makkah-madinah', 'مكة والمدينة'],
  ['/tools', '/tools', 'الأدوات'],
] as const;

const footerGroups = [
  {
    label: 'الحج في مصر',
    items: [
      ['/', 'المحاكي'], ['/egypt-hajj/2027', 'دليل الحج في مصر 2027'], ['/egypt-hajj/compare-options', 'مقارنة طرق الحج'],
      ['/hajj-lottery/2027', 'حج القرعة 2027'], ['/hajj-lottery/statistics', 'إحصاءات القرعة'], ['/tourist-hajj/2027', 'الحج السياحي 2027'], ['/tourist-hajj/choose-program', 'اختيار البرنامج'],
    ],
  },
  {
    label: 'الأدلة والأدوات',
    items: [
      ['/hajj-rituals', 'مناسك الحج'], ['/hajj-preparation', 'الاستعداد للحج'], ['/umrah', 'دليل العمرة'], ['/makkah-madinah', 'مكة والمدينة'],
      ['/umrah-1448-checker', 'فاحص العمرة'], ['/tools', 'الأدوات'], ['/data/hajj-tourism-history', 'البيانات التاريخية'], ['/guides', 'الأدلة والمقالات'], ['/official-sources', 'المصادر الرسمية'],
    ],
  },
  {
    label: 'عن الموقع',
    items: [
      ['/about', 'عن الموقع'], ['/authors', 'فريق التحرير'], ['/editorial-policy', 'سياسة التحرير'], ['/sources-policy', 'سياسة المصادر'], ['/corrections-policy', 'التصحيحات'], ['/contact', 'تواصل معنا'], ['/privacy', 'الخصوصية'], ['/disclaimer', 'إخلاء المسؤولية'],
    ],
  },
] as const;

export function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <div className="app-shell">
      <RouteSeo />
      <header className="site-header"><div className="nav-inner">
        <Link to="/" className="brand" aria-label="الصفحة الرئيسية والمحاكي"><span className="brand-mark" aria-hidden="true">◈</span><span>محاكي قرعة الحج</span></Link>
        <button className="menu-button" type="button" aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={open} onClick={() => setOpen((value) => !value)}><span /><span /><span /></button>
        <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="التنقل الرئيسي">
          {links.map(([to, prefix, label]) => {
            const active = location.pathname === prefix || location.pathname.startsWith(`${prefix}/`);
            return <Link key={to} to={to} className={active ? 'active' : undefined} aria-current={active ? 'page' : undefined}>{label}</Link>;
          })}
        </nav>
      </div></header>
      <SeoEnhancements />
      <main><Outlet /></main>
      <footer className="site-footer">
        <Disclaimer />
        <p className="footer-note">محاكي قرعة الحج — مشروع مستقل غير رسمي للتوعية والمحاكاة التعليمية</p>
        <div className="footer-link-groups">
          {footerGroups.map((group) => <section className="footer-link-group" key={group.label} aria-label={group.label}>
            <strong>{group.label}</strong>
            <div>{group.items.map(([to, label]) => <Link to={to} key={to}>{label}</Link>)}</div>
          </section>)}
        </div>
      </footer>
    </div>
  );
}
