import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getSim } from '../data';
import ProjectileLab from '../sims/ProjectileLab';
import HarmonicLab from '../sims/HarmonicLab';
import OpticsLab from '../sims/OpticsLab';

const LABS = {
  projectile: ProjectileLab,
  harmonic: HarmonicLab,
  optics: OpticsLab
};

export default function SimDetailPage() {
  const { id } = useParams();
  const sim = getSim(id);

  const [angle, setAngle] = useState(45);
  const [velocity, setVelocity] = useState(20);
  const [gravityKey, setGravityKey] = useState('earth');

  const [amplitude, setAmplitude] = useState(30);
  const [length, setLength] = useState(1.2);
  const [damping, setDamping] = useState(0.02);

  const [n, setN] = useState(1.52);
  const [incidence, setIncidence] = useState(0);
  const [wavelength, setWavelength] = useState(580);

  if (!sim) {
    return (
      <div className="lab-wrap">
        <div className="lab-page-hero">
          <h1>Simulation not found</h1>
          <p className="lede">No simulation with id "{id}".</p>
          <Link className="btn btn-ghost" to="/simulations">← Back to simulations</Link>
        </div>
      </div>
    );
  }

  const gravityMap = {
    earth: 9.81,
    moon: 1.62,
    mars: 3.71,
    jupiter: 24.79
  };

  const LabComp = LABS[sim.id];

  // derived readouts
  let readouts = [];
  if (sim.id === 'projectile') {
    const g = gravityMap[gravityKey];
    const th = angle * Math.PI / 180;
    const flight = (2 * velocity * Math.sin(th)) / g;
    const range = velocity * Math.cos(th) * flight;
    const apex = (velocity * Math.sin(th)) ** 2 / (2 * g);
    readouts = [
      { k: 'Flight time', v: `${flight.toFixed(2)} s` },
      { k: 'Range', v: `${range.toFixed(1)} m` },
      { k: 'Max height', v: `${apex.toFixed(1)} m` }
    ];
  } else if (sim.id === 'harmonic') {
    const omega = Math.sqrt(9.81 / length);
    const T = 2 * Math.PI / omega;
    readouts = [
      { k: 'Period', v: `${T.toFixed(2)} s` },
      { k: 'Frequency', v: `${(1 / T).toFixed(2)} Hz` },
      { k: 'ω', v: `${omega.toFixed(2)} rad/s` }
    ];
  } else if (sim.id === 'optics') {
    const v = 299792458 / n;
    readouts = [
      { k: 'Speed in glass', v: `${(v / 1e8).toFixed(2)}×10⁸ m/s` },
      { k: 'n effective', v: `${(n + (580 - wavelength) * 0.00025).toFixed(3)}` },
      { k: 'λ in medium', v: `${(wavelength / n).toFixed(0)} nm` }
    ];
  }

  return (
    <div className="lab-wrap">
      <div className="lab-page-hero">
        <div className="lab-crumb"><Link to="/">Home</Link><i /><Link to="/simulations">Simulations</Link><i /><span>{sim.title}</span></div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--lab-accent)' }}>{sim.tag}</span>
          <span style={{ width: 18, height: 1, background: 'var(--lab-border)' }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--lab-faint)' }}>{sim.index}</span>
        </div>
        <h1>{sim.title}</h1>
        <p className="lede">{sim.long}</p>
        <div style={{ marginTop: 14, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {sim.equations.map(eq => <span key={eq} className="eq-chip" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--lab-border-faint)', borderRadius: 7, padding: '4px 10px' }}>{eq}</span>)}
        </div>
      </div>

      {/* controls */}
      <div className="lab-controls">
        {sim.id === 'projectile' && (
          <>
            <div className="lab-control">
              <label><span>Launch angle</span><b>{angle}°</b></label>
              <input type="range" min="10" max="88" value={angle} onChange={e => setAngle(Number(e.target.value))} />
              <div className="meta"><span>10°</span><span>88°</span></div>
            </div>
            <div className="lab-control">
              <label><span>Initial velocity</span><b>{velocity} m/s</b></label>
              <input type="range" min="5" max="32" value={velocity} onChange={e => setVelocity(Number(e.target.value))} />
              <div className="meta"><span>5 m/s</span><span>32 m/s</span></div>
            </div>
            <div className="lab-control">
              <label><span>Gravity</span><b>{gravityMap[gravityKey].toFixed(2)} m/s²</b></label>
              <select value={gravityKey} onChange={e => setGravityKey(e.target.value)}>
                <option value="earth">Earth — 9.81</option>
                <option value="moon">Moon — 1.62</option>
                <option value="mars">Mars — 3.71</option>
                <option value="jupiter">Jupiter — 24.79</option>
              </select>
              <div className="meta"><span>Field</span><span>{gravityKey}</span></div>
            </div>
          </>
        )}

        {sim.id === 'harmonic' && (
          <>
            <div className="lab-control">
              <label><span>Amplitude</span><b>{amplitude}°</b></label>
              <input type="range" min="8" max="45" value={amplitude} onChange={e => setAmplitude(Number(e.target.value))} />
              <div className="meta"><span>8°</span><span>45°</span></div>
            </div>
            <div className="lab-control">
              <label><span>Length</span><b>{length.toFixed(1)} m</b></label>
              <input type="range" min="0.6" max="2.2" step="0.1" value={length} onChange={e => setLength(Number(e.target.value))} />
              <div className="meta"><span>0.6m</span><span>2.2m</span></div>
            </div>
            <div className="lab-control">
              <label><span>Damping</span><b>{damping.toFixed(2)}</b></label>
              <input type="range" min="0" max="0.18" step="0.01" value={damping} onChange={e => setDamping(Number(e.target.value))} />
              <div className="meta"><span>none</span><span>high</span></div>
            </div>
          </>
        )}

        {sim.id === 'optics' && (
          <>
            <div className="lab-control">
              <label><span>Refractive index</span><b>{n.toFixed(2)}</b></label>
              <input type="range" min="1.2" max="2.2" step="0.02" value={n} onChange={e => setN(Number(e.target.value))} />
              <div className="meta"><span>1.20</span><span>2.20</span></div>
            </div>
            <div className="lab-control">
              <label><span>Incidence angle</span><b>{incidence}°</b></label>
              <input type="range" min="-18" max="18" value={incidence} onChange={e => setIncidence(Number(e.target.value))} />
              <div className="meta"><span>-18°</span><span>18°</span></div>
            </div>
            <div className="lab-control">
              <label><span>Wavelength</span><b>{wavelength} nm</b></label>
              <input type="range" min="380" max="750" value={wavelength} onChange={e => setWavelength(Number(e.target.value))} />
              <div className="meta"><span>380</span><span>750</span></div>
            </div>
          </>
        )}
      </div>

      <div className="sim-detail">
        <div>
          <div className="sim-stage">
            {sim.id === 'projectile' && <ProjectileLab angle={angle} velocity={velocity} gravity={gravityMap[gravityKey]} />}
            {sim.id === 'harmonic' && <HarmonicLab amplitude={amplitude} length={length} damping={damping} />}
            {sim.id === 'optics' && <OpticsLab n={n} incidence={incidence} wavelength={wavelength} />}
          </div>

          <div className="sim-readout">
            {readouts.map(r => (
              <div key={r.k} className="ro">
                <k>{r.k}</k>
                <v>{r.v}</v>
              </div>
            ))}
          </div>
        </div>

        <div className="lab-prose">
          <h3>What you’re seeing</h3>
          <p>{sim.long}</p>
          <p>Every frame is computed from the equations above — no baked animation. Drag the sliders and the trajectory, period, or bending updates instantly. That immediacy is the teaching method: you learn the shape of the equation by feeling how it responds.</p>

          <h3>Try this</h3>
          <ul>
            {sim.id === 'projectile' && (
              <>
                <li>Set angle to 45° — that’s maximum range on flat ground. Why? sin2θ peaks at 1.</li>
                <li>Switch to Moon gravity and watch range ~6×. Same v₀, same θ, different g.</li>
                <li>Lower velocity to 8 m/s — the parabola becomes almost symmetric even with drag ignored.</li>
              </>
            )}
            {sim.id === 'harmonic' && (
              <>
                <li>Increase length — period grows as √L. Double L, period ×1.41.</li>
                <li>Add damping — amplitude decays exponentially. The trace shows it.</li>
                <li>Set amplitude small (8°) to stay in linear regime where T is independent of A.</li>
              </>
            )}
            {sim.id === 'optics' && (
              <>
                <li>Raise n — light slows more, bends more, exit angle widens.</li>
                <li>Sweep wavelength from 380nm to 750nm — color shifts, effective n shifts slightly (dispersion).</li>
                <li>Change incidence — watch the exit ray sweep. Negative incidence bends the other way.</li>
              </>
            )}
          </ul>

          <div style={{ marginTop: 22, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link className="btn btn-primary" to="/simulations">← All simulations</Link>
            <Link className="btn btn-ghost" to="/">Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
