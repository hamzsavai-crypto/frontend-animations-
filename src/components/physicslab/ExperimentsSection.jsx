import Reveal from './Reveal';

const EXPERIMENTS = [
  {
    id: 'E·01',
    name: 'Galileo’s Ramp',
    blurb: 'Roll balls down an incline and measure acceleration with your own hands.',
    tag: 'Kinematics',
    dur: '12 min'
  },
  {
    id: 'E·02',
    name: 'The Second Pendulum',
    blurb: 'Find the string length that makes one full swing take exactly one second.',
    tag: 'Oscillations',
    dur: '9 min'
  },
  {
    id: 'E·03',
    name: 'Bending Light',
    blurb: 'Apply Snell’s law across three media and watch the rays turn.',
    tag: 'Optics',
    dur: '14 min'
  },
  {
    id: 'E·04',
    name: 'Charged Plates',
    blurb: 'Map the electric field between capacitor plates, line by line.',
    tag: 'Electrostatics',
    dur: '16 min'
  },
  {
    id: 'E·05',
    name: 'Standing Strings',
    blurb: 'Pin the nodes, release the harmonics, and hear the spectrum build.',
    tag: 'Waves',
    dur: '11 min'
  }
];

const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path
      d="M3 9h11M10 4.5 14.5 9 10 13.5"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function ExperimentsSection() {
  return (
    <section className="lab-section" id="experiments">
      <div className="lab-wrap">
        <Reveal>
          <div className="lab-section-head">
            <div>
              <p className="lab-eyebrow">
                <span className="eb-num">03</span>
                <span className="eb-rule" aria-hidden="true" />
                Experiments
              </p>
              <h2 className="lab-h2">Guided labs, no lab coat required</h2>
            </div>
            <p className="lab-lede">
              Short, focused experiments that end with a measured result — the same way a real lab
              notebook would.
            </p>
          </div>
        </Reveal>

        <div className="exp-list">
          {EXPERIMENTS.map((e, i) => (
            <Reveal as="div" key={e.id} delay={i * 60}>
              <a className="exp-row" href="#experiments" aria-label={`${e.name} — open experiment`}>
                <span className="exp-index">{e.id}</span>
                <h3 className="exp-name">{e.name}</h3>
                <p className="exp-blurb">{e.blurb}</p>
                <span className="exp-meta">
                  <span className="exp-tag">{e.tag}</span>
                  <span className="exp-dur">{e.dur}</span>
                </span>
                <span className="exp-arrow" aria-hidden="true">
                  <ArrowIcon />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
