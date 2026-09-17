import { Link } from 'react-router-dom';
import { CONCEPTS } from '../data';
import Reveal from '../Reveal';

export default function ConceptsPage() {
  return (
    <div className="lab-wrap">
      <div className="lab-page-hero">
        <div className="lab-crumb"><Link to="/">Home</Link><i /><span>Concepts</span></div>
        <h1>Concepts</h1>
        <p className="lede">Mechanics, waves and light look different in the lab, but the same few ideas keep reappearing. Physics Lab teaches them that way.</p>
      </div>

      <div className="listing-grid">
        {CONCEPTS.map((c, i) => (
          <Reveal key={c.id} delay={i * 80}>
            <Link to={`/concepts/${c.id}`} className="listing-card">
              <div className="kicker"><i />{c.tag}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
              <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {c.equations.slice(0, 2).map(eq => <span key={eq} className="eq-chip" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--lab-border-faint)', borderRadius: 6, padding: '3px 8px' }}>{eq}</span>)}
              </div>
              <div className="foot" style={{ marginTop: 14 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--lab-muted)' }}>{c.principles.length} principles</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Read →</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
