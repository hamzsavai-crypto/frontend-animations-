import { useEffect, useMemo, useRef, useState } from 'react';

const DEG = Math.PI / 180;

export default function ProjectileLab({ angle = 45, velocity = 20, gravity = 9.81 }) {
  const wrapRef = useRef(null);
  const ballRef = useRef(null);
  const trailRef = useRef(null);
  const shadowRef = useRef(null);
  const [size, setSize] = useState({ w: 720, h: 420 });
  const [t, setT] = useState(0);

  // measure
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
    const g = gravity;
    const v0 = velocity;
    const th = angle * DEG;
    const vx = v0 * Math.cos(th);
    const vy = v0 * Math.sin(th);
    const flight = (2 * vy) / g;
    const range = vx * flight;
    const apex = (vy * vy) / (2 * g);
    const groundY = h - 48;
    const ox = 64;
    const scaleX = (w - 120) / Math.max(range, 20);
    const scaleY = (h - 120) / Math.max(apex * 1.35, 20);
    const scale = Math.min(scaleX, scaleY);
    return { w, h, g, v0, th, vx, vy, flight, range, apex, groundY, ox, scale };
  }, [size, angle, velocity, gravity]);

  // animation loop
  useEffect(() => {
    if (!scene) return;
    let raf = 0;
    let start = performance.now();
    let lastT = 0;
    const loop = (now) => {
      const elapsed = (now - start) / 1000;
      // loop every flight + 0.8s pause
      const cycle = scene.flight + 0.9;
      const local = elapsed % cycle;
      const p = Math.min(1, local / scene.flight);
      setT(local);
      if (ballRef.current) {
        const x = scene.ox + scene.vx * local * scene.scale;
        const y = scene.groundY - (scene.vy * local - 0.5 * scene.g * local * local) * scene.scale;
        // clamp when beyond ground
        const cy = local <= scene.flight ? y : scene.groundY;
        const cx = local <= scene.flight ? x : scene.ox + scene.range * scene.scale;
        ballRef.current.setAttribute('cx', cx);
        ballRef.current.setAttribute('cy', cy);
        if (shadowRef.current) {
          shadowRef.current.setAttribute('cx', cx);
          shadowRef.current.setAttribute('cy', scene.groundY);
          shadowRef.current.setAttribute('opacity', local <= scene.flight ? String(0.18 + 0.25 * (1 - p)) : '0.42');
        }
      }
      if (trailRef.current) {
        trailRef.current.style.strokeDashoffset = String(1 - p);
      }
      lastT = local;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [scene]);

  if (!scene) {
    return <div ref={wrapRef} className="viz-wrap" style={{ minHeight: 440 }} />;
  }

  const { w, h, groundY, ox, range, apex, scale, vx, vy, flight } = scene;
  const predicted = `M ${ox} ${groundY} Q ${ox + (range * scale) / 2} ${groundY - apex * scale * 1.08} ${ox + range * scale} ${groundY}`;

  // readout calcs based on current t (clamped)
  const curT = Math.min(t, flight);
  const curX = vx * curT;
  const curY = vy * curT - 0.5 * gravity * curT * curT;
  const curVy = vy - gravity * curT;

  return (
    <div ref={wrapRef} className="viz-wrap" style={{ minHeight: 440 }}>
      <svg className="viz" viewBox={`0 0 ${w} ${h}`} width={w} height={h} fill="none">
        {/* grid */}
        {Array.from({ length: Math.floor(w / 36) }).map((_, i) => (
          <line key={`v${i}`} x1={i * 36} y1="0" x2={i * 36} y2={h} stroke="rgba(148,163,184,0.06)" strokeWidth="1" />
        ))}
        {Array.from({ length: Math.floor(h / 36) }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 36} x2={w} y2={i * 36} stroke="rgba(148,163,184,0.06)" strokeWidth="1" />
        ))}

        {/* ground */}
        <line x1="0" y1={groundY} x2={w} y2={groundY} stroke="rgba(148,163,184,0.28)" strokeWidth="1.2" />
        <rect x="0" y={groundY} width={w} height={h - groundY} fill="rgba(148,163,184,0.04)" />

        {/* predicted dashed */}
        <path d={predicted} stroke="rgba(148,163,184,0.22)" strokeWidth="1" strokeDasharray="4 7" />

        {/* live trail */}
        <path ref={trailRef} d={predicted} stroke="#FFB224" strokeWidth="1.8" pathLength="1" strokeDasharray="1 1" strokeDashoffset="1" strokeLinecap="round" />

        {/* launcher */}
        <g>
          <line x1={ox} y1={groundY} x2={ox + 26 * Math.cos(angle * DEG)} y2={groundY - 26 * Math.sin(angle * DEG)} stroke="rgba(233,237,245,0.55)" strokeWidth="5" strokeLinecap="round" />
          <circle cx={ox} cy={groundY} r="4" fill="rgba(233,237,245,0.7)" />
        </g>

        {/* shadow */}
        <ellipse ref={shadowRef} cx={ox} cy={groundY} rx="14" ry="3.5" fill="#FFB224" opacity="0.18" />

        {/* ball */}
        <circle ref={ballRef} r="7" fill="#FFB224" />

        {/* labels */}
        <text x="16" y="28" fill="rgba(148,163,184,0.6)" fontSize="11" style={{ fontFamily: 'var(--font-mono)' }}>
          g = {gravity.toFixed(2)} m/s² · v₀ = {velocity} m/s · θ = {angle}°
        </text>
        <text x={ox + range * scale + 8} y={groundY - 8} fill="rgba(148,163,184,0.55)" fontSize="10" style={{ fontFamily: 'var(--font-mono)' }}>
          R = {range.toFixed(1)} m
        </text>
      </svg>

      {/* overlay readout */}
      <div style={{ position: 'absolute', right: 12, bottom: 12, display: 'flex', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--lab-faint)' }}>
        <span>t={curT.toFixed(2)}s</span>
        <span>x={curX.toFixed(1)}m</span>
        <span>y={Math.max(0, curY).toFixed(1)}m</span>
        <span>vy={curVy.toFixed(1)}m/s</span>
      </div>
    </div>
  );
}
