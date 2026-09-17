import { useEffect, useMemo, useRef, useState } from 'react';

const DEG = Math.PI / 180;

function wavelengthToColor(wl) {
  // wl 380-750 -> approx color
  if (wl < 440) return `rgba(130,120,255,0.9)`;
  if (wl < 490) return `rgba(90,200,255,0.85)`;
  if (wl < 510) return `rgba(80,255,200,0.85)`;
  if (wl < 580) return `rgba(180,255,90,0.85)`;
  if (wl < 645) return `rgba(255,210,50,0.9)`;
  return `rgba(255,90,90,0.9)`;
}

export default function OpticsLab({ n = 1.52, incidence = 0, wavelength = 580 }) {
  const wrapRef = useRef(null);
  const [size, setSize] = useState({ w: 720, h: 440 });
  const pulseRef = useRef(null);
  const pulseTailRef = useRef(null);

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
    const cx = w / 2;
    const baseY = h - 48;
    const halfW = Math.min(86, w * 0.22);
    const prismH = Math.min(140, h * 0.5);
    const apex = { x: cx, y: baseY - prismH };
    const v0 = { x: cx - halfW, y: baseY };
    const v1 = { x: cx + halfW, y: baseY };
    const E = { x: (v0.x + apex.x) / 2, y: (v0.y + apex.y) / 2 };
    // slight dispersion: n depends on wl (Cauchy approx)
    const nEff = n + (580 - wavelength) * 0.00025;
    const s = 0.55 + (incidence / 90) * 0.18;
    const N = { x: apex.x + halfW * s, y: apex.y + prismH * s };
    const startX = 24;
    const endX = w - 24;
    const L1 = E.x - startX;
    const L2 = Math.hypot(N.x - E.x, N.y - E.y);
    // exit angle approx via Snell: nEff * sin(theta_inside) = sin(theta_out)
    // simplify: fan width based on n
    const baseOut = 12 + (nEff - 1.3) * 18;
    const outAngle = (baseOut + incidence * 0.6) * DEG;
    const dir = { dx: Math.cos(outAngle), dy: Math.sin(outAngle) };
    const L3 = (endX - N.x) / dir.dx;
    const V = 100;
    const t1 = L1 / V;
    const t2 = (L2 * nEff) / V;
    const t3 = L3 / V;
    return { w, h, cx, baseY, halfW, prismH, apex, v0, v1, E, N, startX, endX, dir, L1, L2, L3, t1, t2, t3, V, nEff, cycle: t1 + t2 + t3 + 0.5 };
  }, [size, n, incidence, wavelength]);

  useEffect(() => {
    if (!scene) return;
    let raf = 0;
    let start = performance.now();
    const loop = (now) => {
      const t = (now - start) / 1000;
      const q = t % scene.cycle;
      const setPos = (el, x, y, op = 1) => {
        if (!el) return;
        el.setAttribute('cx', x);
        el.setAttribute('cy', y);
        el.style.opacity = String(op);
      };
      if (q < scene.t1) {
        const p = q / scene.t1;
        const x = scene.startX + scene.L1 * p;
        const y = scene.E.y + incidence * 0.6;
        setPos(pulseRef.current, x, y, 1);
        setPos(pulseTailRef.current, x - 10, y, 0.45);
      } else if (q < scene.t1 + scene.t2) {
        const p = (q - scene.t1) / scene.t2;
        const x = scene.E.x + (scene.N.x - scene.E.x) * p;
        const y = scene.E.y + (scene.N.y - scene.E.y) * p;
        setPos(pulseRef.current, x, y, 0.95);
        setPos(pulseTailRef.current, x - 6, y, 0.4);
      } else {
        const d = (q - scene.t1 - scene.t2) * scene.V;
        const dist = Math.min(d, scene.L3);
        const x = scene.N.x + scene.dir.dx * dist;
        const y = scene.N.y + scene.dir.dy * dist;
        setPos(pulseRef.current, x, y, 1);
        setPos(pulseTailRef.current, x - 8 * scene.dir.dx, y - 8 * scene.dir.dy, 0.5);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [scene, incidence]);

  if (!scene) return <div ref={wrapRef} className="viz-wrap" style={{ minHeight: 440 }} />;

  const { w, h, apex, v0, v1, E, N, startX, endX, dir, baseY } = scene;
  const color = wavelengthToColor(wavelength);

  return (
    <div ref={wrapRef} className="viz-wrap" style={{ minHeight: 440 }}>
      <svg className="viz" viewBox={`0 0 ${w} ${h}`} width={w} height={h} fill="none">
        {Array.from({ length: Math.floor(w / 36) }).map((_, i) => (
          <line key={`v${i}`} x1={i * 36} y1="0" x2={i * 36} y2={h} stroke="rgba(148,163,184,0.06)" strokeWidth="1" />
        ))}
        {Array.from({ length: Math.floor(h / 36) }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 36} x2={w} y2={i * 36} stroke="rgba(148,163,184,0.06)" strokeWidth="1" />
        ))}

        {/* prism */}
        <path d={`M ${v0.x} ${v0.y} L ${apex.x} ${apex.y} L ${v1.x} ${v1.y} Z`} fill="rgba(233,237,245,0.05)" stroke="rgba(233,237,245,0.3)" strokeWidth="1.2" />

        {/* incident */}
        <line x1={startX} y1={E.y + incidence * 0.6} x2={E.x} y2={E.y} stroke="rgba(233,237,245,0.7)" strokeWidth="1.6" />
        {/* inside */}
        <line x1={E.x} y1={E.y} x2={N.x} y2={N.y} stroke="rgba(233,237,245,0.45)" strokeWidth="1.6" />
        {/* exit */}
        <line x1={N.x} y1={N.y} x2={endX} y2={N.y + (endX - N.x) * (dir.dy / dir.dx)} stroke={color} strokeWidth="2" />

        {/* pulse */}
        <circle ref={pulseTailRef} r="3.2" fill={color} opacity="0" />
        <circle ref={pulseRef} r="4.2" fill={color} opacity="0" />

        <text x="14" y="26" fill="rgba(148,163,184,0.6)" fontSize="11" style={{ fontFamily: 'var(--font-mono)' }}>
          n={scene.nEff.toFixed(3)} · λ={wavelength}nm · θᵢ={incidence}° · v=c/n
        </text>
        <text x={w / 2} y={baseY - 14} textAnchor="middle" fill="rgba(233,237,245,0.5)" fontSize="11" style={{ fontFamily: 'var(--font-mono)' }}>
          n = {n.toFixed(2)} (glass)
        </text>
      </svg>
    </div>
  );
}
