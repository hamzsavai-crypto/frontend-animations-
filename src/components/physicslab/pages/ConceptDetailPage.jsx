import { Link, useParams } from 'react-router-dom';
import { getConcept } from '../data';

export default function ConceptDetailPage() {
  const { id } = useParams();
  const c = getConcept(id);
  if (!c) {
    return (
      <div className="lab-wrap">
        <div className="lab-page-hero">
          <h1>Concept not found</h1>
          <p className="lede">No concept with id "{id}".</p>
          <Link className="btn btn-ghost" to="/concepts">← Concepts</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lab-wrap">
      <div className="lab-page-hero">
        <div className="lab-crumb"><Link to="/">Home</Link><i /><Link to="/concepts">Concepts</Link><i /><span>{c.title}</span></div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--lab-accent)' }}>{c.tag}</span>
        </div>
        <h1>{c.title}</h1>
        <p className="lede">{c.long}</p>
      </div>

      <div className="concept-detail-grid">
        <div className="lab-prose">
          <h3>Principles</h3>
          <ul>
            {c.principles.map(p => <li key={p}>{p}</li>)}
          </ul>

          <h3>Equations</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {c.equations.map(eq => <span key={eq} className="eq-chip">{eq}</span>)}
          </div>

          <h3>Why it matters</h3>
          <p>{c.desc} The same structure shows up in mechanics, waves and light because all three are consequences of differential equations with similar form. Once you recognize the pattern, you can transfer intuition from a pendulum to an LC circuit to a quantum well.</p>

          <div style={{ marginTop: 22, display: 'flex', gap: 10 }}>
            <Link className="btn btn-primary" to="/concepts">← All concepts</Link>
            <Link className="btn btn-ghost" to="/simulations">Go to simulations</Link>
          </div>
        </div>

        <div className="panel" style={{ background: 'var(--lab-surface)', border: '1px solid var(--lab-border)', borderRadius: 16, padding: 22 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, margin: '0 0 12px' }}>Quick check</h3>
          <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--lab-muted)', margin: '0 0 14px' }}>
            {c.id === 'mechanics' && "If you double v₀ at 45°, range quadruples (R∝v₀²). If you launch from height h, add extra flight from falling."}
            {c.id === 'waves' && "Two waves out of phase by π cancel. That’s destructive interference — the reason noise-cancelling headphones work."}
            {c.id === 'light' && "Snell’s law comes from matching phases at the boundary. Total internal reflection happens when sinθ₂ would need to be >1."}
          </p>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--lab-faint)', borderTop: '1px solid var(--lab-border-faint)', paddingTop: 12 }}>
            This page is client-routed — no reload, back button preserves scroll.
          </div>
        </div>
      </div>
    </div>
  );
}
