import Reveal from './Reveal';
import SimCard from './SimCard';
import ProjectileViz from './ProjectileViz';
import HarmonicViz from './HarmonicViz';
import OpticsViz from './OpticsViz';

const SIMS = [
  {
    index: '01',
    tag: 'SIM·01 / Trajectory',
    title: 'Projectile Motion',
    desc: 'Launch at 45° and watch the parabola draw itself. Gravity, velocity and time stop being symbols and become a shape you can see.',
    equation: 'x(t) = v₀·t·cos θ',
    Viz: ProjectileViz
  },
  {
    index: '02',
    tag: 'SIM·02 / Oscillation',
    title: 'Simple Harmonic Motion',
    desc: 'A pendulum swings while an oscilloscope records it. See how period, amplitude and phase shape one underlying wave.',
    equation: 'x(t) = A·cos(ωt)',
    Viz: HarmonicViz
  },
  {
    index: '03',
    tag: 'SIM·03 / Refraction',
    title: 'Optics',
    desc: "White light slows down in glass and splits on the way out. Snell's law, told by a pulse of light bending through a prism.",
    equation: 'n₁ sin θ₁ = n₂ sin θ₂',
    Viz: OpticsViz
  }
];

export default function SimulationsSection() {
  return (
    <section className="lab-section" id="simulations">
      <div className="lab-wrap">
        <Reveal>
          <div className="lab-section-head">
            <div>
              <p className="lab-eyebrow">
                <span className="eb-num">01</span>
                <span className="eb-rule" aria-hidden="true" />
                Simulations
              </p>
              <h2 className="lab-h2">Learning is hands-on</h2>
            </div>
            <p className="lab-lede">
              Every simulation is a real physical system running in your browser — not a looped
              video. Change the setup and the mathematics changes with it.
            </p>
          </div>
        </Reveal>

        <div className="sim-grid">
          {SIMS.map((s, i) => (
            <SimCard key={s.index} {...s} delay={i * 90} />
          ))}
        </div>
      </div>
    </section>
  );
}
