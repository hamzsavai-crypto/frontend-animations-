import { useEffect, useState } from 'react';
import LogoMark from './LogoMark';

const LINKS = [
  { id: 'simulations', label: 'Simulations' },
  { id: 'concepts', label: 'Concepts' },
  { id: 'experiments', label: 'Experiments' },
  { id: 'about', label: 'About' }
];

export default function LabNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // which section is currently in the middle band of the viewport
  useEffect(() => {
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
  }, []);

  const close = () => setOpen(false);

  return (
    <header className={`lab-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="lab-wrap lab-nav-inner">
        <a className="lab-logo" href="#top" aria-label="Physics Lab — home" onClick={close}>
          <LogoMark size={26} />
          <span className="lab-logo-word">
            Physics <em>Lab</em>
          </span>
        </a>

        <nav aria-label="Primary">
          <ul className="lab-nav-links">
            {LINKS.map(l => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  className={`lab-nav-link ${active === l.id ? 'is-active' : ''}`}
                >
                  {l.label}
                </a>
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
          {LINKS.map(l => (
            <li key={l.id}>
              <a href={`#${l.id}`} onClick={close}>
                {l.label}
                <span aria-hidden="true">→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
