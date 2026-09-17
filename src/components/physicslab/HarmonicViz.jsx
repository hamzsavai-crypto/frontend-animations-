import { useMemo, useRef } from 'react';
import useMeasure from './useMeasure';
import useVizFrame from './useVizFrame';

const T = 2.4; // pendulum period (s)
const AMPLITUDE = 30; // degrees
const DEG = Math.PI / 180;
const SWEEP = 118; // px left of the write head

/**
 * SIM·02 — Simple harmonic motion.
 * A pendulum with θ(t) = A·sin(ωt), recorded by an oscilloscope-style
 * sweep below: the newest sample is written at the right edge and the
 * trace scrolls left, exactly as a lab data logger would show it.
 */
export default function HarmonicViz() {
  const [measureRef, size] = useMeasure();
  const w = size.w;
  const h = size.h;

  const rodRef = useRef(null);
  const bobRef = useRef(null);
  const traceRef = useRef(null);
  const headRef = useRef(null);
  const headGlowRef = useRef(null);

  const scene = useMemo(() => {
    if (!w || !h) return null;
    const cx = w / 2;
    const pivotY = 40;
    const L = Math.max(64, Math.min(100, h * 0.4));
    const yMid = h - 46;
    const waveAmp = Math.min(22, Math.max(12, h * 0.09));
    return { cx, pivotY, L, yMid, waveAmp };
  }, [w, h]);

  // ring buffer of the trace: { tw, x, y }
  const pointsRef = useRef([]);

  const frameRef = useVizFrame(function tickHarmonic(t) {
    if (!scene) return;
    const { cx, pivotY, L, yMid, waveAmp } = scene;

    // pendulum
    const theta = AMPLITUDE * DEG * Math.sin((2 * Math.PI * t) / T);
    const bx = cx + L * Math.sin(theta);
    const by = pivotY + L * Math.cos(theta);

    rodRef.current?.setAttribute('x2', bx);
    rodRef.current?.setAttribute('y2', by);
    bobRef.current?.setAttribute('cx', bx);
    bobRef.current?.setAttribute('cy', by);

    // oscilloscope trace
    const pts = pointsRef.current;
    const writeX = w - 46;
    const latest = {
      tw: t,
      x: writeX,
      y: yMid - waveAmp * Math.sin((2 * Math.PI * t) / T)
    };
    pts.push(latest);

    // everything scrolls left at SWEEP px/s
    let last = null;
    for (const p of pts) {
      const age = t - p.tw;
      p.x = writeX - age * SWEEP;
    }
    // drop points that scrolled out (oldest first, x is monotonic)
    let start = 0;
    while (start < pts.length && pts[start].x < 44) start += 1;
    const kept = start > 0 ? pts.slice(start) : pts;
    pointsRef.current = kept;
    last = kept[kept.length - 1] || null;

    let d = '';
    for (let i = 0; i < kept.length; i += 1) {
      const p = kept[i];
      d += `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }
    if (traceRef.current && d) traceRef.current.setAttribute('d', d);

    if (headRef.current && last) {
      headRef.current.setAttribute('cx', last.x);
      headRef.current.setAttribute('cy', last.y);
      headGlowRef.current?.setAttribute('cx', last.x);
      headGlowRef.current?.setAttribute('cy', last.y);
    }
  });

  const attachRef = el => {
    measureRef.current = el;
    frameRef.current = el;
  };

  if (!scene) {
    return <div ref={attachRef} className="viz-wrap" aria-hidden="true" />;
  }

  const { cx, pivotY, L, yMid, waveAmp } = scene;
  const a = AMPLITUDE * DEG;
  const arcL = { x: cx + L * 0.62 * Math.sin(-a), y: pivotY + L * 0.62 * Math.cos(-a) };
  const arcR = { x: cx + L * 0.62 * Math.sin(a), y: pivotY + L * 0.62 * Math.cos(a) };

  const gridLines = [];
  for (let x = 36; x < w; x += 36) gridLines.push({ key: `v${x}`, x1: x, y1: 0, x2: x, y2: h });
  for (let y = 36; y < h; y += 36) gridLines.push({ key: `h${y}`, x1: 0, y1: y, x2: w, y2: y });

  const hatches = [];
  for (let i = 0; i < 5; i += 1) {
    const x = cx - 24 + i * 12;
    hatches.push({ key: `h${i}`, x1: x, y1: pivotY - 7, x2: x + 6, y2: pivotY });
  }

  return (
    <div ref={attachRef} className="viz-wrap" aria-hidden="true">
      <svg className="viz" viewBox={`0 0 ${w} ${h}`} width={w} height={h} fill="none">
        {/* faint grid */}
        {gridLines.map(l => (
          <line key={l.key} {...l} stroke="rgba(148,163,184,0.055)" strokeWidth="1" />
        ))}

        {/* ceiling mount */}
        <line x1={cx - 26} y1={pivotY} x2={cx + 26} y2={pivotY} stroke="rgba(148,163,184,0.35)" strokeWidth="1.5" />
        {hatches.map(l => (
          <line key={l.key} {...l} stroke="rgba(148,163,184,0.22)" strokeWidth="1" />
        ))}

        {/* swing guide arc */}
        <path
          d={`M ${arcL.x} ${arcL.y} A ${L * 0.62} ${L * 0.62} 0 0 1 ${arcR.x} ${arcR.y}`}
          stroke="rgba(148,163,184,0.2)"
          strokeWidth="1"
          strokeDasharray="2 5"
        />

        {/* pendulum */}
        <line
          ref={rodRef}
          x1={cx}
          y1={pivotY}
          x2={cx}
          y2={pivotY + L}
          stroke="rgba(233,237,245,0.4)"
          strokeWidth="1.5"
        />
        <rect x={cx - 3} y={pivotY - 3} width="6" height="6" fill="rgba(233,237,245,0.55)" />
        <circle ref={bobRef} cx={cx} cy={pivotY + L} r="8.5" fill="#5EEAD4" />

        {/* trace baseline */}
        <line
          x1="44"
          y1={yMid}
          x2={w - 44}
          y2={yMid}
          stroke="rgba(148,163,184,0.14)"
          strokeWidth="1"
          strokeDasharray="3 5"
        />

        {/* oscilloscope trace */}
        <path ref={traceRef} d="" stroke="rgba(94,234,212,0.6)" strokeWidth="1.5" fill="none" />
        <circle ref={headGlowRef} cx={w - 46} cy={yMid} r="7" fill="rgba(94,234,212,0.16)" />
        <circle ref={headRef} cx={w - 46} cy={yMid} r="3" fill="#5EEAD4" />

        {/* labels */}
        <text
          x={w - 16}
          y={44}
          textAnchor="end"
          fill="rgba(148,163,184,0.55)"
          fontSize="10"
          style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}
        >
          T = 2.4 s
        </text>
        <text
          x={cx - L - 16}
          y={pivotY + L * 0.86}
          textAnchor="end"
          fill="rgba(148,163,184,0.55)"
          fontSize="10"
          style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}
        >
          A = {AMPLITUDE}°
        </text>
        <text
          x="44"
          y={yMid + waveAmp + 20}
          fill="rgba(148,163,184,0.4)"
          fontSize="9.5"
          style={{ fontFamily: 'var(--font-mono)', letterSpacing: '0.08em' }}
        >
          x(t) — recorded
        </text>
      </svg>
    </div>
  );
}
