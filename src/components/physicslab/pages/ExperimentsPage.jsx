import { Link } from 'react-router-dom';
import { EXPERIMENTS } from '../data';
import Reveal from '../Reveal';

export default function ExperimentsPage() {
  return (
    <div className="lab-wrap">
      <div className="lab-page-hero">
        <div className="lab-crumb"><Link to="/">Home</Link><i /><span>Experiments</span></div>
        <h1>Experiments</h1>
        <p className="lede">Short, focused labs that end with a measured result — the same way a real lab notebook would. Each one is 9–18 minutes.</p>
      </div>

      <div className="exp-list">
        {EXPERIMENTS.map((e, i) => (
          <Reveal as="div" key={e.id} delay={i * 50}>
            <Link className="exp-row" to={`/experiments/${e.id}`}>
              <span className="exp-index">{e.num}</span>
              <h3 className="exp-name">{e.name}</h3>
              <p className="exp-blurb">{e.blurb}</p>
              <span className="exp-meta">
                <span className="exp-tag">{e.tag}</span>
                <span className="exp-dur">{e.dur} · {e.difficulty}</span>
              </span>
              <span className="exp-arrow">→</span>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
