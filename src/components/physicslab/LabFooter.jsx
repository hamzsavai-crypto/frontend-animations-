import { Link } from 'react-router-dom';
import LogoMark from './LogoMark';

export default function LabFooter() {
  return (
    <footer className="lab-footer">
      <div className="lab-wrap lab-footer-inner">
        <div>
          <Link className="lab-logo" to="/" aria-label="Physics Lab — back to top">
            <LogoMark size={24} />
            <span className="lab-logo-word">
              Physics <em>Lab</em>
            </span>
          </Link>
          <p className="lab-footer-tag">Understand physics by playing with it.</p>
        </div>

        <nav aria-label="Footer">
          <ul className="lab-footer-links">
            <li><Link to="/simulations">Simulations</Link></li>
            <li><Link to="/concepts">Concepts</Link></li>
            <li><Link to="/experiments">Experiments</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </nav>

        <p className="lab-footer-legal">
          © 2026 Physics Lab
          <br />
          Every animation here has a reason.<br/>
          <span style={{opacity:0.6}}>Client-side routing · No reloads</span>
        </p>
      </div>
    </footer>
  );
}
