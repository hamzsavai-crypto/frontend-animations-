import { useMemo, useRef } from 'react';
import useMeasure from './useMeasure';
import useVizFrame from './useVizFrame';

const FLIGHT = 2.4; // seconds
const HOLD = 1.0; // pause after impact
const CYCLE = FLIGHT + HOLD;
const DEG = Math.PI / 180;

/**
 * SIM·01 — Projectile motion.
 * A ball leaves a 45° launcher, follows the true ballistic parabola
 * (constant horizontal velocity), leaves a fading trail, and ripples
 * on impact. The faint dashed curve is the predicted trajectory.
 */
export default function ProjectileViz() {
  const [measureRef, size] = useMeasure();
  const w = size.w;
  const h = size.h;

  const ballRef = useRef(null);
  const g1Ref = useRef(null);
  const g2Ref = useRef(null);
  const trailRef = useRef(null);
  const rippleRef = useRef(null);

  const scene = useMemo(() => {
    if (!w || !h) return null;
    const groundY = h - 44;
    const ox = 48; // launcher origin
    const barrel = 22;
    const p0 = { x: ox + barrel * Math.cos(45 * DEG), y: groundY - barrel * Math.sin(45 * DEG) };
    const endX = w - 56;
    const midX = (p0.x + endX) / 2;
    const apexY = Math.max(30, groundY - Math.min(128, h * 0.52));
    const p1 = { x: midX, y: 2 * apexY - groundY }; // quadratic bezier control
    const p2 = { x: endX, y: groundY };
    return { groundY, ox, p0, p1, p2 };
  }, [w, h]);

  const frameRef = useVizFrame(function tickProjectile(t) {
    if (!scene) return;
    const phase = t % CYCLE;
    const p = Math.min(1, phase / FLIGHT);
    const { p0, p1, p2 } = scene;

    const pos = pp => {
      const u = 1 - pp;
      return {
        x: u * u * p0.x + 2 * u * pp * p1.x + pp * pp * p2.x,
        y: u * u * p0.y + 2 * u * pp * p1.y + pp * pp * p2.y
      };
    };

    const b = pos(p);
    ballRef.current?.setAttribute('cx', b.x);
    ballRef.current?.setAttribute('cy', b.y);

    const g1 = pos(Math.max(0, p - 0.045));
    g1Ref.current?.setAttribute('cx', g1.x);
    g1Ref.current?.setAttribute('cy', g1.y);
    g1Ref.current?.setAttribute('opacity', p > 0.045 ? '0.35' : '0');

    const g2 = pos(Math.max(0, p - 0.1));
    g2Ref.current?.setAttribute('cx', g2.x);
    g2Ref.current?.setAttribute('cy', g2.y);
    g2Ref.current?.setAttribute('opacity', p > 0.1 ? '0.15' : '0');

    if (trailRef.current) {
      trailRef.current.style.strokeDashoffset = String(1 - p);
    }

    if (rippleRef.current) {
      if (phase > FLIGHT) {
        const rp = (phase - FLIGHT) / HOLD;
        rippleRef.current.setAttribute('cx', p2.x);
        rippleRef.current.setAttribute('cy', scene.groundY);
        rippleRef.current.setAttribute('r', String(3 + 30 * rp));
        rippleRef.current.style.opacity = String((1 - rp) * 0.55);
      } else {
        rippleRef.current.style.opacity = '0';
      }
    }
  });

  const attachRef = el => {
    measureRef.current = el;
    frameRef.current = el;
  };

  if (!scene) {
    return <div ref={attachRef} className="viz-wrap" aria-hidden="true" />;
  }

  const { groundY, ox, p0, p1, p2 } = scene;
  const arcR = 34;
  const arcEnd = { x: ox + arcR * Math.cos(45 * DEG), y: groundY - arcR * Math.sin(45 * DEG) };

  const gridLines = [];
  for (let x = 36; x < w; x += 36) gridLines.push({ key: `v${x}`, x1: x, y1: 0, x2: x, y2: h });
  for (let y = 36; y < h; y += 36) gridLines.push({ key: `h${y}`, x1: 0, y1: y, x2: w, y2: y });

  const ticks = [];
  for (let x = 20; x < w - 12; x += 14) {
    ticks.push({ key: `t${x}`, x1: x, y1: groundY, x2: x - 7, y2: groundY + 7 });
  }

  return (
    <div ref={attachRef} className="viz-wrap" aria-hidden="true">
      <svg className="viz" viewBox={`0 0 ${w} ${h}`} width={w} height={h} fill="none">
        {/* faint grid */}
        {gridLines.map(l => (
          <line key={l.key} {...l} stroke="rgba(148,163,184,0.055)" strokeWidth="1" />
        ))}

        {/* ground */}
        <line x1="0" y1={groundY} x2={w} y2={groundY} stroke="rgba(148,163,184,0.25)" strokeWidth="1" />
        {ticks.map(l => (
          <line key={l.key} {...l} stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
        ))}

        {/* predicted trajectory (dashed) */}
        <path
          d={`M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`}
          stroke="rgba(148,163,184,0.22)"
          strokeWidth="1"
          strokeDasharray="3 6"
        />

        {/* travelled path */}
        <path
          ref={trailRef}
          d={`M ${p0.x} ${p0.y} Q ${p1.x} ${p1.y} ${p2.x} ${p2.y}`}
          stroke="rgba(255,178,36,0.5)"
          strokeWidth="1.5"
          pathLength="1"
          strokeDasharray="1 1"
          strokeDashoffset="1"
          strokeLinecap="round"
        />

        {/* launcher */}
        <line
          x1={ox}
          y1={groundY}
          x2={p0.x}
          y2={p0.y}
          stroke="rgba(233,237,245,0.5)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx={ox} cy={groundY} r="3" fill="rgba(233,237,245,0.6)" />
        <line
          x1={ox}
          y1={groundY}
          x2={arcEnd.x}
          y2={arcEnd.y}
          stroke="rgba(255,178,36,0.5)"
          strokeWidth="1"
        />

        {/* ball + ghosts */}
        <circle ref={g2Ref} r="4.5" fill="#FFB224" opacity="0" />
        <circle ref={g1Ref} r="5.5" fill="#FFB224" opacity="0" />
        <circle ref={ballRef} cx={p0.x} cy={p0.y} r="6.5" fill="#FFB224" />

        {/* impact ripple */}
        <circle ref={rippleRef} r="0" stroke="#FFB224" strokeWidth="1.5" opacity="0" />

        {/* labels */}
        <text
          x={16}
          y={44}
          fill="rgba(148,163,184,0.55)"
          fontSize="10"
          style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}
        >
          v₀ = 20 m/s
        </text>
        <text
          x={ox + 44}
          y={groundY - 26}
          fill="rgba(148,163,184,0.55)"
          fontSize="10"
          style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}
        >
          θ = 45°
        </text>
      </svg>
    </div>
  );
}
