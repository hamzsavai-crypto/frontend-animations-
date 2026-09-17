import { Link } from 'react-router-dom';
import Hero from '../Hero';
import Reveal from '../Reveal';
import SimCard from '../SimCard';
import ProjectileViz from '../ProjectileViz';
import HarmonicViz from '../HarmonicViz';
import OpticsViz from '../OpticsViz';
import { SIMS, CONCEPTS, EXPERIMENTS } from '../data';

const SIM_VIZ = {
  projectile: ProjectileViz,
  harmonic: HarmonicViz,
  optics: OpticsViz
};

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* simulations preview */}
      <section className="lab-section" id="simulations">
        <div className="lab-wrap">
          <Reveal>
            <div className="lab-section-head">
              <div>
                <p className="lab-eyebrow"><span className="eb-num">01</span><span className="eb-rule" aria-hidden="true" />Simulations</p>
                <h2 className="lab-h2">Learning is hands-on</h2>
              </div>
              <p className="lab-lede">
                Every simulation is a real physical system running in your browser — not a looped video. Change the setup and the mathematics changes with it.
              </p>
            </div>
          </Reveal>

          <div className="sim-grid">
            {SIMS.map((s, i) => (
              <Reveal key={s.id} delay={i * 90}>
                <Link className="sim-card-link" to={`/simulations/${s.id}`} aria-label={`${s.title} — open simulation`}>
                  <div className="sim-card" style={{ borderRadius: 18, border: '1px solid var(--lab-border)', background: 'var(--lab-surface)', overflow: 'hidden' }}>
                    <div className="sim-viewport">
                      <span className="sim-tag">{s.tag}</span>
                      <span className="sim-status"><i aria-hidden="true" />live</span>
                      {(() => { const Viz = SIM_VIZ[s.id]; return <Viz />; })()}
                    </div>
                    <div className="sim-body">
                      <div className="sim-meta-top">
                        <span className="sim-index">{s.index}</span>
                        <h3 className="sim-title">{s.title}</h3>
                      </div>
                      <p className="sim-desc">{s.desc}</p>
                      <div className="sim-foot">
                        <span className="sim-eq">{s.equation}</span>
                        <span className="sim-open">Open lab <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M1.5 6.5h9.5M7.5 2.5l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={180}>
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
              <Link className="btn btn-ghost" to="/simulations">View all simulations →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* concepts */}
      <section className="lab-section" id="concepts">
        <div className="lab-wrap">
          <Reveal>
            <div className="lab-section-head">
              <div>
                <p className="lab-eyebrow"><span className="eb-num">02</span><span className="eb-rule" aria-hidden="true" />Concepts</p>
                <h2 className="lab-h2">Three ideas, repeated everywhere</h2>
              </div>
              <p className="lab-lede">Mechanics, waves and light look different in the lab, but the same few ideas keep reappearing.</p>
            </div>
          </Reveal>

          <Reveal>
            <div className="concept-grid">
              {CONCEPTS.map(c => (
                <Link key={c.id} to={`/concepts/${c.id}`} className="concept" style={{ textDecoration: 'none' }}>
                  <h3 className="concept-name">{c.title} <span>{c.tag}</span></h3>
                  <p>{c.desc}</p>
                  <div style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--lab-accent)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Read →</div>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* experiments */}
      <section className="lab-section" id="experiments">
        <div className="lab-wrap">
          <Reveal>
            <div className="lab-section-head">
              <div>
                <p className="lab-eyebrow"><span className="eb-num">03</span><span className="eb-rule" aria-hidden="true" />Experiments</p>
                <h2 className="lab-h2">Guided labs, no lab coat required</h2>
              </div>
              <p className="lab-lede">Short, focused experiments that end with a measured result — the same way a real lab notebook would.</p>
            </div>
          </Reveal>

          <div className="exp-list">
            {EXPERIMENTS.slice(0, 5).map((e, i) => (
              <Reveal as="div" key={e.id} delay={i * 60}>
                <Link className="exp-row" to={`/experiments/${e.id}`}>
                  <span className="exp-index">{e.num}</span>
                  <h3 className="exp-name">{e.name}</h3>
                  <p className="exp-blurb">{e.blurb}</p>
                  <span className="exp-meta">
                    <span className="exp-tag">{e.tag}</span>
                    <span className="exp-dur">{e.dur}</span>
                  </span>
                  <span className="exp-arrow" aria-hidden="true">→</span>
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120}>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
              <Link className="btn btn-ghost" to="/experiments">All experiments →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* about teaser */}
      <section className="lab-section" id="about">
        <div className="lab-wrap">
          <div className="about-grid">
            <Reveal>
              <div>
                <p className="lab-eyebrow"><span className="eb-num">04</span><span className="eb-rule" aria-hidden="true" />About</p>
                <h2 className="lab-h2">Built for people who press “what if?”</h2>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="about-copy">
                <p className="lead">Physics Lab is an educational platform where every idea comes with something to play with. No static diagrams, no walls of derivation — just systems that respond when you touch them.</p>
                <p>Each simulation is grounded in the real equation, so what you see is exactly what the mathematics predicts. Adjust a parameter and the curve, the timing, the color — the physics itself — updates in front of you.</p>
                <div style={{ marginTop: 18 }}>
                  <Link className="btn btn-ghost" to="/about">About the lab →</Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
