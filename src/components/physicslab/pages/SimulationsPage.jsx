import { Link } from 'react-router-dom';
import { SIMS } from '../data';
import Reveal from '../Reveal';

export default function SimulationsPage() {
  return (
    <div className="lab-wrap">
      <div className="lab-page-hero">
        <div className="lab-crumb"><Link to="/">Home</Link><i /><span>Simulations</span></div>
        <h1>Simulations</h1>
        <p className="lede">Three live systems, each a real integration running in your browser. No video loops — change a parameter and the math updates.</p>
      </div>

      <div className="listing-grid">
        {SIMS.map((s, i) => (
          <Reveal key={s.id} delay={i * 80}>
            <Link to={`/simulations/${s.id}`} className="listing-card">
              <div className="kicker"><i />{s.tag} · {s.index}</div>
              <h3>{s.title}</h3>
              <p>{s.long.slice(0, 130)}…</p>
              <div className="foot">
                <span className="eq-chip">{s.equation}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Open lab →</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>

      <div style={{ marginTop: 42, padding: 22, border: '1px dashed var(--lab-border)', borderRadius: 14, background: 'rgba(255,255,255,0.02)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', margin: '0 0 8px' }}>How routing works</h3>
        <p className="lab-prose" style={{ margin: 0, fontSize: 14 }}>
          This is a fully client-side routed SPA. Navigating between <code style={{ fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 6 }}>/simulations</code>, 
          <code style={{ fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 6, marginLeft: 6 }}>/concepts</code> and 
          <code style={{ fontFamily: 'var(--font-mono)', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 6, marginLeft: 6 }}>/experiments</code> happens without a full page reload.
          State is preserved, scroll is restored, and the back button works.
        </p>
      </div>
    </div>
  );
}
