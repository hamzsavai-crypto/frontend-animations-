import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LogoMark from './LogoMark';

const LINKS = [
  { id: 'simulations', label: 'Simulations', to: '/simulations' },
  { id: 'concepts', label: 'Concepts', to: '/concepts' },
  { id: 'experiments', label: 'Experiments', to: '/experiments' },
  { id: 'about', label: 'About', to: '/about' }
];

export default function LabNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // homepage scroll spy only on /
  useEffect(() => {
    if (location.pathname !== '/') return undefined;
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const sections = LINKS.map(l => document.getElementById(l.id)).filter(Boolean);
    if (!sections.length) return undefined;
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-38% 0px -55% 0px', threshold: 0 }
    );
    sections.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, [location.pathname]);

  const close = () => setOpen(false);

  const handleLogoClick = (e) => {
    close();
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // also update hash
      history.pushState(null, '', '/');
    }
  };

  const handleHomeAnchor = (id) => (e) => {
    close();
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      // if not on home, navigate to /#id then scroll after
      e.preventDefault();
      navigate(`/#${id}`);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
    }
  };

  const isActive = (to) => {
    if (to === '/') return location.pathname === '/';
    return location.pathname.startsWith(to);
  };

  return (
    <header className={`lab-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="lab-wrap lab-nav-inner">
        <Link className="lab-logo" to="/" aria-label="Physics Lab — home" onClick={handleLogoClick}>
          <LogoMark size={26} />
          <span className="lab-logo-word">
            Physics <em>Lab</em>
          </span>
        </Link>

        <nav aria-label="Primary">
          <ul className="lab-nav-links">
            {LINKS.map(l => (
              <li key={l.id}>
                <Link
                  to={l.to}
                  className={`lab-nav-link ${isActive(l.to) || active === l.id ? 'is-active active' : ''}`}
                  onClick={location.pathname === '/' ? handleHomeAnchor(l.id) : close}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="lab-nav-burger"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen(v => !v)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className={`lab-nav-mobile ${open ? 'is-open' : ''}`} id="lab-mobile-menu">
        <ul>
          <li>
            <Link to="/" onClick={close}>Home <span aria-hidden="true">→</span></Link>
          </li>
          {LINKS.map(l => (
            <li key={l.id}>
              <Link to={l.to} onClick={close}>
                {l.label}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
