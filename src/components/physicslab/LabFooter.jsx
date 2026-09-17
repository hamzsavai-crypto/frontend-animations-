import LogoMark from './LogoMark';

export default function LabFooter() {
  return (
    <footer className="lab-footer">
      <div className="lab-wrap lab-footer-inner">
        <div>
          <a className="lab-logo" href="#top" aria-label="Physics Lab — back to top">
            <LogoMark size={24} />
            <span className="lab-logo-word">
              Physics <em>Lab</em>
            </span>
          </a>
          <p className="lab-footer-tag">Understand physics by playing with it.</p>
        </div>

        <nav aria-label="Footer">
          <ul className="lab-footer-links">
            <li>
              <a href="#simulations">Simulations</a>
            </li>
            <li>
              <a href="#concepts">Concepts</a>
            </li>
            <li>
              <a href="#experiments">Experiments</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
          </ul>
        </nav>

        <p className="lab-footer-legal">
          © 2026 Physics Lab
          <br />
          Every animation here has a reason.
        </p>
      </div>
    </footer>
  );
}
