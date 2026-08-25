import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Disclaimer } from './Disclaimer';
import { RouteSeo } from './RouteSeo';
import { SeoEnhancements } from './SeoEnhancements';

const links = [
  ['/egypt-hajj/2027', 'الحج في مصر'],
  ['/hajj-lottery/2027', 'حج القرعة'],
  ['/tourist-hajj/2027', 'الحج السياحي'],
  ['/hajj-rituals', 'مناسك الحج'],
  ['/hajj-preparation', 'الاستعداد'],
  ['/umrah', 'العمرة'],
  ['/makkah-madinah', 'مكة والمدينة'],
  ['/tools', 'الأدوات'],
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
        <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="التنقل الرئيسي">{links.map(([to, label]) => <NavLink key={to} to={to}>{label}</NavLink>)}</nav>
      </div></header>
      <SeoEnhancements />
      <main><Outlet /></main>
      <footer className="site-footer">
        <Disclaimer />
        <p>محاكي قرعة الحج — مشروع مستقل غير رسمي للتوعية والمحاكاة التعليمية</p>
        <p className="footer-links">
          <Link to="/">المحاكي</Link><span>•</span>
          <Link to="/egypt-hajj/2027">دليل الحج في مصر 2027</Link><span>•</span>
          <Link to="/egypt-hajj/compare-options">مقارنة طرق الحج في مصر</Link><span>•</span>
          <Link to="/hajj-lottery/2027">حج القرعة 2027</Link><span>•</span>
          <Link to="/hajj-lottery/statistics">إحصاءات القرعة</Link><span>•</span>
          <Link to="/tourist-hajj/2027">الحج السياحي 2027</Link><span>•</span>
          <Link to="/tourist-hajj/choose-program">اختيار برنامج الحج السياحي</Link><span>•</span>
          <Link to="/hajj-rituals">مناسك الحج</Link><span>•</span>
          <Link to="/hajj-preparation">الاستعداد للحج</Link><span>•</span>
          <Link to="/umrah">دليل العمرة</Link><span>•</span>
          <Link to="/makkah-madinah">مكة والمدينة</Link><span>•</span>
          <Link to="/umrah-1448-checker">فاحص العمرة 1448</Link><span>•</span>
          <Link to="/tools">أدوات الحج والعمرة</Link><span>•</span>
          <Link to="/data/hajj-tourism-history">إحصاءات الحج التاريخية</Link><span>•</span>
          <Link to="/guides">الأدلة والمقالات</Link><span>•</span>
          <Link to="/official-sources">المصادر الرسمية</Link><span>•</span>
          <Link to="/about">عن الموقع</Link><span>•</span>
          <Link to="/authors">فريق التحرير</Link><span>•</span>
          <Link to="/editorial-policy">سياسة التحرير</Link><span>•</span>
          <Link to="/sources-policy">سياسة المصادر</Link><span>•</span>
          <Link to="/corrections-policy">التصحيحات</Link><span>•</span>
          <Link to="/contact">تواصل معنا</Link><span>•</span>
          <Link to="/privacy">الخصوصية</Link><span>•</span>
          <Link to="/disclaimer">إخلاء المسؤولية</Link>
        </p>
      </footer>
    </div>
  );
}
