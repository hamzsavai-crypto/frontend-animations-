import { useMemo, useRef } from 'react';
import useMeasure from './useMeasure';
import useVizFrame from './useVizFrame';

const DEG = Math.PI / 180;
const V = 92; // light speed in the scene (px/s), scaled
const N_GLASS = 1.52;

// exit fan: angle from horizontal (deg, downward) + color
const RAYS = [
  { angle: 2, color: 'rgba(248,113,113,0.8)' },
  { angle: 8, color: 'rgba(251,191,36,0.85)' },
  { angle: 15, color: 'rgba(134,239,172,0.7)' },
  { angle: 22, color: 'rgba(167,139,250,0.85)' }
];

/**
 * SIM·03 — Refraction & dispersion.
 * A white beam enters a glass prism, slows inside (n = 1.52), and
 * exits split into a fan of colors. A bright pulse travels the whole
 * path at a speed that is visibly slower within the glass.
 */
export default function OpticsViz() {
  const [measureRef, size] = useMeasure();
  const w = size.w;
  const h = size.h;

  const pulseARef = useRef(null);
  const pulseBRef = useRef(null);
  const exitRefs = useRef([]);
  const exitTailRefs = useRef([]);

  const scene = useMemo(() => {
    if (!w || !h) return null;
    const cx = w / 2;
    const baseY = h - 40;
    const halfW = Math.min(58, w * 0.17);
    const prismH = Math.min(92, h * 0.42);
    const apex = { x: cx, y: baseY - prismH };
    const v0 = { x: cx - halfW, y: baseY };
    const v1 = { x: cx + halfW, y: baseY };

    // entry point: midpoint of the left face
    const E = { x: (v0.x + apex.x) / 2, y: (v0.y + apex.y) / 2 };
    // exit point on the right face (toward the base)
    const s = 0.55;
    const N = { x: apex.x + halfW * s, y: apex.y + prismH * s };

    const startX = 24;
    const endX = w - 22;

    const L1 = E.x - startX; // incident
    const L2 = Math.hypot(N.x - E.x, N.y - E.y); // inside glass
    const dirs = RAYS.map(r => {
      const a = r.angle * DEG;
      return { dx: Math.cos(a), dy: Math.sin(a) };
    });
    const L3 = dirs.map(d => (endX - N.x) / d.dx); // distance to right edge
    const t1 = L1 / V;
    const t2 = (L2 * N_GLASS) / V;
    const t3 = Math.max(...L3) / V;

    return {
      cx,
      baseY,
      apex,
      v0,
      v1,
      E,
      N,
      startX,
      endX,
      dirs,
      L1,
      L2,
      L3,
      t1,
      t2,
      t3,
      cycle: t1 + t2 + t3 + 0.45
    };
  }, [w, h]);

  const frameRef = useVizFrame(function tickOptics(t) {
    if (!scene) return;
    const s = scene;
    const q = t % s.cycle;

    const pulseA = pulseARef.current;
    const pulseB = pulseBRef.current;
    if (!pulseA) return;

    const setPulse = (el, x, y, color, opacity) => {
      el.setAttribute('cx', x);
      el.setAttribute('cy', y);
      el.setAttribute('fill', color);
      el.style.opacity = String(opacity);
    };
    const hide = el => {
      if (el) el.style.opacity = '0';
    };

    // exit pulses (shared tail + head per ray)
    RAYS.forEach((_, i) => hide(exitRefs.current[i]));
    RAYS.forEach((_, i) => hide(exitTailRefs.current[i]));

    if (q < s.t1) {
      // travelling along the incident beam
      const p = q / s.t1;
      const x = s.startX + s.L1 * p;
      const y = s.E.y;
      setPulse(pulseA, x, y, 'rgba(233,237,245,0.95)', 1);
      setPulse(pulseB, x - 9, y, 'rgba(233,237,245,0.5)', 0.6);
    } else if (q < s.t1 + s.t2) {
      // inside the glass — same distance, slower
      const p = (q - s.t1) / s.t2;
      const x = s.E.x + (s.N.x - s.E.x) * p;
      const y = s.E.y + (s.N.y - s.E.y) * p;
      setPulse(pulseA, x, y, 'rgba(233,237,245,0.9)', 0.95);
      setPulse(pulseB, x - 8, y - 1, 'rgba(233,237,245,0.45)', 0.5);
    } else {
      // dispersion fan
      const d = (q - s.t1 - s.t2) * V;
      s.dirs.forEach((dir, i) => {
        const dist = Math.min(d, s.L3[i]);
        const head = exitRefs.current[i];
        const tail = exitTailRefs.current[i];
        if (!head) return;
        const x = s.N.x + dir.dx * dist;
        const y = s.N.y + dir.dy * dist;
        setPulse(head, x, y, RAYS[i].color, 1);
        if (tail) {
          const td = Math.max(0, dist - 9);
          setPulse(tail, s.N.x + dir.dx * td, s.N.y + dir.dy * td, RAYS[i].color, 0.4);
        }
      });
    }
  });

  const attachRef = el => {
    measureRef.current = el;
    frameRef.current = el;
  };

  if (!scene) {
    return <div ref={attachRef} className="viz-wrap" aria-hidden="true" />;
  }

  const { cx, baseY, apex, v0, v1, E, N, startX, dirs, endX } = scene;

  const gridLines = [];
  for (let x = 36; x < w; x += 36) gridLines.push({ key: `v${x}`, x1: x, y1: 0, x2: x, y2: h });
  for (let y = 36; y < h; y += 36) gridLines.push({ key: `h${y}`, x1: 0, y1: y, x2: w, y2: y });

  return (
    <div ref={attachRef} className="viz-wrap" aria-hidden="true">
      <svg className="viz" viewBox={`0 0 ${w} ${h}`} width={w} height={h} fill="none">
        {/* faint grid */}
        {gridLines.map(l => (
          <line key={l.key} {...l} stroke="rgba(148,163,184,0.055)" strokeWidth="1" />
        ))}

        {/* prism */}
        <path
          d={`M ${v0.x} ${v0.y} L ${apex.x} ${apex.y} L ${v1.x} ${v1.y} Z`}
          fill="rgba(233,237,245,0.04)"
          stroke="rgba(233,237,245,0.28)"
          strokeWidth="1"
        />

        {/* incident beam */}
        <line
          x1={startX}
          y1={E.y}
          x2={E.x}
          y2={E.y}
          stroke="rgba(233,237,245,0.7)"
          strokeWidth="1.5"
        />

        {/* inside beam */}
        <line x1={E.x} y1={E.y} x2={N.x} y2={N.y} stroke="rgba(233,237,245,0.4)" strokeWidth="1.5" />

        {/* dispersion fan */}
        {dirs.map((d, i) => (
          <line
            key={`r${i}`}
            x1={N.x}
            y1={N.y}
            x2={endX}
            y2={N.y + (endX - N.x) * (d.dy / d.dx)}
            stroke={RAYS[i].color}
            strokeWidth="1.5"
          />
        ))}

        {/* travelling pulse + tail */}
        <circle ref={el => (exitTailRefs.current[3] = el)} r="2.5" opacity="0" />
        <circle ref={el => (exitTailRefs.current[2] = el)} r="2.5" opacity="0" />
        <circle ref={el => (exitTailRefs.current[1] = el)} r="2.5" opacity="0" />
        <circle ref={el => (exitTailRefs.current[0] = el)} r="2.5" opacity="0" />
        <circle ref={el => (exitRefs.current[3] = el)} r="2.5" opacity="0" />
        <circle ref={el => (exitRefs.current[2] = el)} r="2.5" opacity="0" />
        <circle ref={el => (exitRefs.current[1] = el)} r="2.5" opacity="0" />
        <circle ref={el => (exitRefs.current[0] = el)} r="2.5" opacity="0" />
        <circle ref={pulseBRef} r="3" opacity="0" />
        <circle ref={pulseARef} r="3" opacity="0" />

        {/* labels */}
        <text
          x={cx}
          y={baseY - 22}
          textAnchor="middle"
          fill="rgba(233,237,245,0.5)"
          fontSize="10.5"
          style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}
        >
          n = 1.52
        </text>
        <text
          x={startX}
          y={E.y - 12}
          fill="rgba(148,163,184,0.5)"
          fontSize="10"
          style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}
        >
          white light
        </text>
      </svg>
    </div>
  );
}
