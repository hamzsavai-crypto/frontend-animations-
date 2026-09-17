import SpotlightCard from '../../content/Components/SpotlightCard/SpotlightCard';
import Reveal from './Reveal';

const ArrowIcon = () => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
    <path
      d="M1.5 6.5h9.5M7.5 2.5l4 4-4 4"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Featured simulation card: a live physics visual on top,
 * the teaching note below. The shell is the repo's SpotlightCard —
 * a cursor-following light sweep, kept subtle.
 */
export default function SimCard({ index, tag, title, desc, equation, Viz, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <a className="sim-card-link" href="#simulations" aria-label={`${title} — open simulation`}>
        <SpotlightCard className="sim-card" spotlightColor="rgba(255, 178, 36, 0.07)">
          <div className="sim-viewport">
            <span className="sim-tag">{tag}</span>
            <span className="sim-status">
              <i aria-hidden="true" />
              live
            </span>
            <Viz />
          </div>

          <div className="sim-body">
            <div className="sim-meta-top">
              <span className="sim-index">{index}</span>
              <h3 className="sim-title">{title}</h3>
            </div>
            <p className="sim-desc">{desc}</p>
            <div className="sim-foot">
              <span className="sim-eq">{equation}</span>
              <span className="sim-open">
                Open simulation
                <ArrowIcon />
              </span>
            </div>
          </div>
        </SpotlightCard>
      </a>
    </Reveal>
  );
}
