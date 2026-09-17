import { useEffect, useMemo, useRef, useState } from 'react';

export default function HarmonicLab({ amplitude = 30, length = 1.2, damping = 0.02 }) {
  const wrapRef = useRef(null);
  const [size, setSize] = useState({ w: 720, h: 440 });
  const rodRef = useRef(null);
  const bobRef = useRef(null);
  const traceRef = useRef(null);
  const pointsRef = useRef([]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scene = useMemo(() => {
    const { w, h } = size;
    if (!w || !h) return null;
    const cx = w * 0.38;
    const pivotY = 56;
    const Lpx = Math.min(160, Math.max(90, length * 90));
    const g = 9.81;
    const omega = Math.sqrt(g / length);
    const T = (2 * Math.PI) / omega;
    return { w, h, cx, pivotY, Lpx, omega, T, g };
  }, [size, length]);

  useEffect(() => {
    if (!scene) return;
    let raf = 0;
    let start = performance.now();
    const DEG = Math.PI / 180;
    const SWEEP = 110;
    const yMid = scene.h - 68;
    const waveAmp = 42;

    const loop = (now) => {
      const t = (now - start) / 1000;
      // pendulum angle with damping: θ = A*e^{-bt} * sin(ωt) but we want continuous looping, so use modulo with decay reset every 8s
      const cycle = 10;
      const local = t % cycle;
      // damping envelope: e^{-b * local} but reset each cycle
      const env = Math.exp(-damping * local * 3);
      const theta = amplitude * DEG * env * Math.sin(scene.omega * local);

      const bx = scene.cx + scene.Lpx * Math.sin(theta);
      const by = scene.pivotY + scene.Lpx * Math.cos(theta);

      rodRef.current?.setAttribute('x2', bx);
      rodRef.current?.setAttribute('y2', by);
      bobRef.current?.setAttribute('cx', bx);
      bobRef.current?.setAttribute('cy', by);

      // oscilloscope
      const writeX = scene.w - 40;
      const pt = {
        tw: t,
        x: writeX,
        y: yMid - waveAmp * env * Math.sin(scene.omega * local)
      };
      pointsRef.current.push(pt);
      for (const p of pointsRef.current) {
        const age = t - p.tw;
        p.x = writeX - age * SWEEP;
      }
      // keep last 8 seconds
      pointsRef.current = pointsRef.current.filter(p => t - p.tw < 8 && p.x > 30);
      let d = '';
      pointsRef.current.forEach((p, i) => {
        d += `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
      });
      if (traceRef.current) traceRef.current.setAttribute('d', d);

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [scene, amplitude, damping]);

  if (!scene) return <div ref={wrapRef} className="viz-wrap" style={{ minHeight: 440 }} />;

  const { w, h, cx, pivotY, Lpx } = scene;
  const yMid = h - 68;

  return (
    <div ref={wrapRef} className="viz-wrap" style={{ minHeight: 440 }}>
      <svg className="viz" viewBox={`0 0 ${w} ${h}`} width={w} height={h} fill="none">
        {Array.from({ length: Math.floor(w / 36) }).map((_, i) => (
          <line key={`v${i}`} x1={i * 36} y1="0" x2={i * 36} y2={h} stroke="rgba(148,163,184,0.06)" strokeWidth="1" />
        ))}
        {Array.from({ length: Math.floor(h / 36) }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 36} x2={w} y2={i * 36} stroke="rgba(148,163,184,0.06)" strokeWidth="1" />
        ))}

        {/* pivot */}
        <line x1={cx - 28} y1={pivotY} x2={cx + 28} y2={pivotY} stroke="rgba(148,163,184,0.25)" strokeWidth="1.2" />
        {Array.from({ length: 5 }).map((_, i) => (
          <line key={i} x1={cx - 22 + i * 11} y1={pivotY - 7} x2={cx - 16 + i * 11} y2={pivotY} stroke="rgba(148,163,184,0.18)" strokeWidth="1" />
        ))}

        {/* rod */}
        <line ref={rodRef} x1={cx} y1={pivotY} x2={cx} y2={pivotY + Lpx} stroke="rgba(233,237,245,0.55)" strokeWidth="2" />
        <circle ref={bobRef} r="12" fill="#5eead4" />

        {/* oscilloscope baseline */}
        <line x1="28" y1={yMid} x2={w - 28} y2={yMid} stroke="rgba(148,163,184,0.14)" strokeWidth="1" strokeDasharray="3 5" />
        <path ref={traceRef} d="" stroke="#5eead4" strokeWidth="1.6" fill="none" strokeLinecap="round" />

        <text x="14" y="26" fill="rgba(148,163,184,0.6)" fontSize="11" style={{ fontFamily: 'var(--font-mono)' }}>
          L={length.toFixed(1)}m · ω={scene.omega.toFixed(2)} rad/s · T={scene.T.toFixed(2)}s · b={damping}
        </text>
        <text x="36" y={yMid + 26} fill="rgba(148,163,184,0.45)" fontSize="10" style={{ fontFamily: 'var(--font-mono)' }}>
          oscilloscope — θ(t)
        </text>
      </svg>
    </div>
  );
}
