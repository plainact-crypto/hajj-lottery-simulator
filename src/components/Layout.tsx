import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Disclaimer } from './Disclaimer';
import { RouteSeo } from './RouteSeo';

const links = [
  ['/', 'المحاكي'],
  ['/guides', 'الأدلة والمقالات'],
  ['/umrah-1448-checker', 'فاحص العمرة 1448'],
  ['/how-it-works', 'كيف تعمل المحاكاة'],
  ['/hajj-levels', 'مستويات الحج'],
  ['/rituals', 'مناسك الحج'],
  ['/hajj-systems-world', 'أنظمة الحج حول العالم'],
  ['/articles-sources', 'المصادر'],
  ['/about', 'عن الموقع'],
] as const;

export function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <div className="app-shell">
      <RouteSeo />
      <header className="site-header">
        <div className="nav-inner">
          <Link to="/" className="brand" aria-label="الصفحة الرئيسية">
            <span className="brand-mark" aria-hidden="true">◈</span>
            <span>محاكي قرعة الحج</span>
          </Link>
          <button className="menu-button" type="button" aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            <span /><span /><span />
          </button>
          <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="التنقل الرئيسي">
            {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
            <a href="/trips" style={{display:'inline-flex',alignItems:'center',gap:'6px',fontWeight:700,textDecoration:'none'}} aria-label="رحلات"><span aria-hidden="true">✈️</span><span>رحلات</span></a>
          </nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="site-footer">
        <Disclaimer />
        <p>محاكي قرعة الحج — مشروع مستقل غير رسمي للتوعية والمحاكاة التعليمية</p>
        <p className="footer-links">
          <Link to="/guides">الأدلة والمقالات</Link><span>•</span>
          <Link to="/umrah-1448-checker">فاحص العمرة 1448</Link><span>•</span>
          <Link to="/how-it-works">كيف تعمل المحاكاة</Link><span>•</span>
          <Link to="/hajj-levels">مستويات الحج</Link><span>•</span>
          <Link to="/rituals">المناسك</Link><span>•</span>
          <Link to="/hajj-systems-world">أنظمة الحج</Link><span>•</span>
          <Link to="/articles-sources">المصادر</Link><span>•</span>
          <Link to="/about">عن الموقع</Link><span>•</span>
          <Link to="/privacy">الخصوصية</Link><span>•</span>
          <Link to="/disclaimer">إخلاء المسؤولية</Link>
        </p>
      </footer>
    </div>
  );
}
