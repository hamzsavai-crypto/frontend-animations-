import DotField from '../../content/Backgrounds/DotField/DotField';
import MaskedHeading from '../../content/TextAnimations/MaskedHeading/MaskedHeading';
import ScrambledText from '../../content/TextAnimations/ScrambledText/ScrambledText';
import CursorReadout from './CursorReadout';

import interferenceUrl from './assets/interference.jpg';

const CONSTANTS = [
  { sym: 'g', val: '9.807 m/s²' },
  { sym: 'c', val: '2.998×10⁸ m/s' },
  { sym: 'h', val: '6.626×10⁻³⁴ J·s' },
  { sym: 'ε₀', val: '8.854×10⁻¹² F/m' }
];

export default function Hero() {
  return (
    <section className="lab-hero" id="top">
      {/* cursor-reactive dot field — physics answering your touch */}
      <div className="lab-hero-bg" aria-hidden="true">
        <DotField
          dotRadius={1.6}
          dotSpacing={26}
          cursorRadius={380}
          bulgeOnly
          bulgeStrength={52}
          glowRadius={170}
          waveAmplitude={0}
          gradientFrom="rgba(148, 163, 184, 0.34)"
          gradientTo="rgba(148, 163, 184, 0.08)"
          glowColor="#0b0d12"
        />
      </div>

      <div className="lab-hero-frame" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </div>

      <div className="lab-hero-content">
        <p className="lab-hero-eyebrow">
          <span className="dot" aria-hidden="true" />
          Interactive physics education
        </p>

        <MaskedHeading
          className="lab-hero-title"
          text="PHYSICS LAB"
          tag="h1"
          src={interferenceUrl}
          mediaType="image"
          fillScale={1.4}
          parallax={30}
          drift={14}
          reveal="rise"
          trigger="view"
          duration={1.25}
          stagger={0.07}
          weight={800}
          tracking={-0.02}
          lineHeight={0.98}
          textScale={0.12}
          align="center"
        />

        <div className="lab-hero-sub">
          <ScrambledText
            radius={140}
            duration={1.5}
            speed={0.45}
            scrambleChars="0123456789.·×+−="
          >
            Understand physics by playing with it.
          </ScrambledText>
        </div>

        <div className="lab-hero-ctas">
          <a className="btn btn-primary" href="#simulations">
            Start experimenting
            <svg
              className="btn-arrow"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 1v11M2.5 7.5 7 12l4.5-4.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a className="btn btn-ghost" href="#concepts">
            How it works
          </a>
        </div>

        <div className="lab-constants" aria-label="Fundamental constants">
          {CONSTANTS.map(c => (
            <span className="lab-constant" key={c.sym}>
              {c.sym} = <b>{c.val}</b>
            </span>
          ))}
        </div>
      </div>

      <CursorReadout />
    </section>
  );
}
