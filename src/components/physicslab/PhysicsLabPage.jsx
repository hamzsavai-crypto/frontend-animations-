import './lab.css';
import LabNav from './LabNav';
import Hero from './Hero';
import SimulationsSection from './SimulationsSection';
import ConceptsSection from './ConceptsSection';
import ExperimentsSection from './ExperimentsSection';
import AboutSection from './AboutSection';
import LabFooter from './LabFooter';

/**
 * Physics Lab — homepage.
 * A single, coherent dark canvas: nav, hero with a cursor-reactive
 * dot field, three live simulation cards, concepts, experiments,
 * about, footer. All scroll reveals run once; all visuals pause
 * offscreen.
 */
export default function PhysicsLabPage() {
  return (
    <div className="lab-page">
      <LabNav />
      <main>
        <Hero />
        <SimulationsSection />
        <ConceptsSection />
        <ExperimentsSection />
        <AboutSection />
      </main>
      <LabFooter />
    </div>
  );
}
