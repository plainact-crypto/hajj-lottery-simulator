import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Disclaimer } from './Disclaimer';

const links = [
  ['/', 'ط§ظ„ظ…ط­ط§ظƒظٹ'],
  ['/how-it-works', 'ظƒظٹظپ طھط¹ظ…ظ„ ط§ظ„ظ…ط­ط§ظƒط§ط©'],
  ['/hajj-levels', 'ظ…ط³طھظˆظٹط§طھ ط§ظ„ط­ط¬'],
  ['/rituals', 'ظ…ظ†ط§ط³ظƒ ط§ظ„ط­ط¬'],
  ['/hajj-systems-world', 'ط£ظ†ط¸ظ…ط© ط§ظ„ط­ط¬ ط­ظˆظ„ ط§ظ„ط¹ط§ظ„ظ…'],
  ['/articles-sources', 'ط§ظ„ظ…ظ‚ط§ظ„ط§طھ ظˆط§ظ„ظ…طµط§ط¯ط±'],
  ['/about', 'ط¹ظ† ط§ظ„ظ…ظˆظ‚ط¹'],
] as const;

export function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => { setOpen(false); window.scrollTo(0, 0); }, [location.pathname]);

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="nav-inner">
          <Link to="/" className="brand" aria-label="ط§ظ„طµظپط­ط© ط§ظ„ط±ط¦ظٹط³ظٹط©">
            <span className="brand-mark" aria-hidden="true">â—ˆ</span>
            <span>ظ…ط­ط§ظƒظٹ ظ‚ط±ط¹ط© ط§ظ„ط­ط¬</span>
          </Link>
          <button className="menu-button" type="button" aria-label={open ? 'ط¥ط؛ظ„ط§ظ‚ ط§ظ„ظ‚ط§ط¦ظ…ط©' : 'ظپطھط­ ط§ظ„ظ‚ط§ط¦ظ…ط©'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
            <span /><span /><span />
          </button>
          <nav className={open ? 'nav-links open' : 'nav-links'} aria-label="ط§ظ„طھظ†ظ‚ظ„ ط§ظ„ط±ط¦ظٹط³ظٹ">
            {links.map(([to, label]) => <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}
          <a href="/trips" style={{display:'inline-flex',alignItems:'center',gap:'6px',fontWeight:700,textDecoration:'none'}} aria-label="رحلات">
  <span aria-hidden="true">✈️</span><span>رحلات</span>
</a></nav>
        </div>
      </header>
      <main><Outlet /></main>
      <footer className="site-footer">
        <Disclaimer />
        <p>ظ…ط­ط§ظƒظٹ ظ‚ط±ط¹ط© ط§ظ„ط­ط¬ â€” ظ…ط´ط±ظˆط¹ ظ…ط³طھظ‚ظ„ ط؛ظٹط± ط±ط³ظ…ظٹ</p>
        <p className="footer-links">
          <Link to="/how-it-works">ظƒظٹظپ طھط¹ظ…ظ„ ط§ظ„ظ…ط­ط§ظƒط§ط©</Link><span>â€¢</span>
          <Link to="/hajj-levels">ظ…ط³طھظˆظٹط§طھ ط§ظ„ط­ط¬</Link><span>â€¢</span>
          <Link to="/rituals">ط§ظ„ظ…ظ†ط§ط³ظƒ</Link><span>â€¢</span>
          <Link to="/hajj-systems-world">ط£ظ†ط¸ظ…ط© ط§ظ„ط­ط¬</Link><span>â€¢</span>
          <Link to="/articles-sources">ط§ظ„ظ…طµط§ط¯ط±</Link><span>â€¢</span>
          <Link to="/about">ط¹ظ† ط§ظ„ظ…ظˆظ‚ط¹</Link><span>â€¢</span>
          <Link to="/privacy">ط§ظ„ط®طµظˆطµظٹط©</Link><span>â€¢</span>
          <Link to="/disclaimer">ط¥ط®ظ„ط§ط، ط§ظ„ظ…ط³ط¤ظˆظ„ظٹط©</Link>
        </p>
      </footer>
    </div>
  );
}

