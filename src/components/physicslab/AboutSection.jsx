import CountUp from '../../content/TextAnimations/CountUp/CountUp';
import Reveal from './Reveal';

const STATS = [
  { to: 24, suffix: '', label: 'Interactive simulations' },
  { to: 38, suffix: '', label: 'Guided experiments' },
  { to: 120, suffix: '+', label: 'Adjustable parameters' },
  { to: 100, suffix: '%', label: 'Hands-on, zero lectures' }
];

export default function AboutSection() {
  return (
    <section className="lab-section" id="about">
      <div className="lab-wrap">
        <div className="about-grid">
          <Reveal>
            <div>
              <p className="lab-eyebrow">
                <span className="eb-num">04</span>
                <span className="eb-rule" aria-hidden="true" />
                About
              </p>
              <h2 className="lab-h2">Built for people who press “what if?”</h2>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="about-copy">
              <p className="lead">
                Physics Lab is an educational platform where every idea comes with something to
                play with. No static diagrams, no walls of derivation — just systems that respond
                when you touch them.
              </p>
              <p>
                Each simulation is grounded in the real equation, so what you see is exactly what
                the mathematics predicts. Adjust a parameter and the curve, the timing, the color —
                the physics itself — updates in front of you. That feedback loop is the whole
                teaching method.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="lab-stats">
            {STATS.map(s => (
              <div className="lab-stat" key={s.label}>
                <div className="lab-stat-num">
                  <CountUp to={s.to} duration={1.6} />
                  {s.suffix && <sup>{s.suffix}</sup>}
                </div>
                <div className="lab-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
