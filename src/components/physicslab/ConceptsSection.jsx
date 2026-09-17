import Reveal from './Reveal';

const GlyphParabola = (
  <svg className="concept-glyph" viewBox="0 0 120 56" fill="none" aria-hidden="true">
    <line x1="8" y1="48" x2="112" y2="48" strokeWidth="1" strokeDasharray="2 4" />
    <path className="draw" d="M12 48 Q 60 -18 108 48" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="60" cy="12" r="2.5" />
  </svg>
);

const GlyphWave = (
  <svg className="concept-glyph" viewBox="0 0 120 56" fill="none" aria-hidden="true">
    <line x1="8" y1="28" x2="112" y2="28" strokeWidth="1" strokeDasharray="2 4" />
    <path
      className="draw"
      d="M10 28 Q 22.5 4 35 28 T 60 28 T 85 28 T 110 28"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const GlyphLight = (
  <svg className="concept-glyph" viewBox="0 0 120 56" fill="none" aria-hidden="true">
    <line x1="60" y1="6" x2="60" y2="50" strokeWidth="1" strokeDasharray="2 4" />
    <line className="draw" x1="8" y1="18" x2="60" y2="18" strokeWidth="1.5" strokeLinecap="round" />
    <line className="draw" x1="60" y1="18" x2="112" y2="40" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CONCEPTS = [
  {
    name: 'Mechanics',
    tag: 'MCN',
    glyph: GlyphParabola,
    desc: 'Forces decide how things move. Velocity, acceleration, and the shapes in between.'
  },
  {
    name: 'Waves',
    tag: 'WAV',
    glyph: GlyphWave,
    desc: 'Energy travels in oscillation — period, amplitude, and interference.'
  },
  {
    name: 'Light',
    tag: 'OPT',
    glyph: GlyphLight,
    desc: 'Waves that behave like particles: reflection, refraction, dispersion.'
  }
];

export default function ConceptsSection() {
  return (
    <section className="lab-section" id="concepts">
      <div className="lab-wrap">
        <Reveal>
          <div className="lab-section-head">
            <div>
              <p className="lab-eyebrow">
                <span className="eb-num">02</span>
                <span className="eb-rule" aria-hidden="true" />
                Concepts
              </p>
              <h2 className="lab-h2">Three ideas, repeated everywhere</h2>
            </div>
            <p className="lab-lede">
              Mechanics, waves and light look different in the lab, but the same few ideas keep
              reappearing. Physics Lab teaches them that way.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="concept-grid">
            {CONCEPTS.map(c => (
              <div className="concept" key={c.name}>
                {c.glyph}
                <h3 className="concept-name">
                  {c.name} <span>{c.tag}</span>
                </h3>
                <p>{c.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
