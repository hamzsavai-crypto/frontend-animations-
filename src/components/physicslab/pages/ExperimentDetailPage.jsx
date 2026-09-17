import { Link, useParams } from 'react-router-dom';
import { getExperiment } from '../data';

export default function ExperimentDetailPage() {
  const { id } = useParams();
  const exp = getExperiment(id);
  if (!exp) {
    return (
      <div className="lab-wrap">
        <div className="lab-page-hero">
          <h1>Experiment not found</h1>
          <p className="lede">No experiment with id "{id}".</p>
          <Link className="btn btn-ghost" to="/experiments">← Experiments</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lab-wrap">
      <div className="lab-page-hero">
        <div className="lab-crumb"><Link to="/">Home</Link><i /><Link to="/experiments">Experiments</Link><i /><span>{exp.name}</span></div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', color: 'var(--lab-accent)' }}>{exp.num}</span>
          <span className="exp-tag">{exp.tag}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--lab-faint)' }}>{exp.dur} · {exp.difficulty}</span>
        </div>
        <h1>{exp.name}</h1>
        <p className="lede">{exp.blurb}</p>
      </div>

      <div className="exp-detail">
        <div className="lab-prose">
          <h3>Objective</h3>
          <p>{exp.objective}</p>

          <h3>Steps</h3>
          <ol style={{ margin: 0, paddingLeft: 20 }}>
            {exp.steps.map((s, i) => <li key={i} style={{ margin: '8px 0' }}>{s}</li>)}
          </ol>

          <h3>Expected result</h3>
          <p>{exp.result}</p>

          <div style={{ marginTop: 24, display: 'flex', gap: 10 }}>
            <Link className="btn btn-primary" to="/experiments">← All experiments</Link>
            <Link className="btn btn-ghost" to="/simulations">Open simulations</Link>
          </div>
        </div>

        <div>
          <div className="panel">
            <h3 style={{ fontFamily: 'var(--font-display)', margin: '0 0 10px', fontSize: 18 }}>Lab notebook</h3>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, lineHeight: 1.8, color: 'var(--lab-muted)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--lab-border-faint)', padding: '6px 0' }}><span>Date</span><span>2026-09-17</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--lab-border-faint)', padding: '6px 0' }}><span>Experiment</span><span>{exp.num}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--lab-border-faint)', padding: '6px 0' }}><span>Duration</span><span>{exp.dur}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}><span>Difficulty</span><span>{exp.difficulty}</span></div>
            </div>
            <div style={{ marginTop: 16, padding: 12, background: 'var(--lab-viewport)', borderRadius: 10, border: '1px solid var(--lab-border-faint)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--lab-faint)' }}>
              Tip: This detail page is routed client-side. Use browser back/forward — no reload.
            </div>
          </div>

          <div className="panel" style={{ marginTop: 14 }}>
            <h4 style={{ margin: '0 0 8px', fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--lab-faint)' }}>Related</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link to="/simulations" style={{ fontSize: 14, color: 'var(--lab-text)' }}>→ Simulations</Link>
              <Link to="/concepts" style={{ fontSize: 14, color: 'var(--lab-muted)' }}>→ Concepts</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
