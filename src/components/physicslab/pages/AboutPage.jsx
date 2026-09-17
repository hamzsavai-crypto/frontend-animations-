import { Link } from 'react-router-dom';
import CountUp from '../../../content/TextAnimations/CountUp/CountUp';
import Reveal from '../Reveal';

const STATS = [
  { to: 24, suffix: '', label: 'Interactive simulations' },
  { to: 38, suffix: '', label: 'Guided experiments' },
  { to: 120, suffix: '+', label: 'Adjustable parameters' },
  { to: 100, suffix: '%', label: 'Hands-on, zero lectures' }
];

export default function AboutPage() {
  return (
    <div className="lab-wrap">
      <div className="lab-page-hero">
        <div className="lab-crumb"><Link to="/">Home</Link><i /><span>About</span></div>
        <h1>Built for people who press “what if?”</h1>
        <p className="lede">Physics Lab is an educational platform where every idea comes with something to play with. No static diagrams, no walls of derivation — just systems that respond when you touch them.</p>
      </div>

      <div className="about-grid">
        <Reveal>
          <div>
            <p className="lab-eyebrow"><span className="eb-num">04</span><span className="eb-rule" aria-hidden="true" />About</p>
            <h2 className="lab-h2">Every animation here has a reason.</h2>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="about-copy">
            <p className="lead">Each simulation is grounded in the real equation, so what you see is exactly what the mathematics predicts. Adjust a parameter and the curve, the timing, the color — the physics itself — updates in front of you. That feedback loop is the whole teaching method.</p>
            <p>We started with three domains that cover most of introductory physics: trajectories (mechanics), oscillations (waves), and refraction (optics). Each has a minimal interactive lab with real-time readouts, plus guided experiments that mirror how you’d measure it on a bench.</p>
            <p>The site itself is a demonstration of the same principle: it’s a client-side routed SPA. Navigating between /simulations, /concepts, /experiments and /about doesn’t reload the page — it swaps content, preserves state, and keeps the physics running. The router is built on react-router-dom with scroll restoration and a 404 boundary.</p>
          </div>
        </Reveal>
      </div>

      <Reveal>
        <div className="lab-stats">
          {STATS.map(s => (
            <div className="lab-stat" key={s.label}>
              <div className="lab-stat-num"><CountUp to={s.to} duration={1.6} />{s.suffix && <sup>{s.suffix}</sup>}</div>
              <div className="lab-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <div style={{ marginTop: 42, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <div className="panel" style={{ background: 'var(--lab-surface)', border: '1px solid var(--lab-border)', borderRadius: 16, padding: 22 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', margin: '0 0 8px' }}>Tech</h3>
          <p style={{ margin: 0, color: 'var(--lab-muted)', fontSize: 14, lineHeight: 1.6 }}>React 19, react-router-dom 6, Vite, custom SVG visuals driven by rAF. Visuals pause offscreen via IntersectionObserver and when tab is hidden. All physics is computed per-frame, not pre-baked.</p>
        </div>
        <div className="panel" style={{ background: 'var(--lab-surface)', border: '1px solid var(--lab-border)', borderRadius: 16, padding: 22 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', margin: '0 0 8px' }}>Design</h3>
          <p style={{ margin: 0, color: 'var(--lab-muted)', fontSize: 14, lineHeight: 1.6 }}>Dark, instrument-grade palette, one accent (amber), hairline borders, three type voices: Bricolage Grotesque (display), Geist (body), Geist Mono (data). Motion uses --ease-out and respects prefers-reduced-motion.</p>
        </div>
      </div>

      <div style={{ marginTop: 28, display: 'flex', gap: 12 }}>
        <Link className="btn btn-primary" to="/simulations">Start experimenting</Link>
        <Link className="btn btn-ghost" to="/">Back home</Link>
      </div>
    </div>
  );
}
