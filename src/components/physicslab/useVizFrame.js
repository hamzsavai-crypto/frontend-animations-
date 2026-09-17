import { useEffect, useRef, useState } from 'react';

/**
 * Drives a requestAnimationFrame loop for a physics visual.
 * - pauses when the element scrolls out of view
 * - pauses when the tab is hidden
 * The callback receives elapsed seconds (dt-capped) and mutates
 * SVG attributes directly — no React re-renders per frame.
 *
 * Returns a ref to attach to the visual's container element.
 */
export default function useVizFrame(cb) {
  const cbRef = useRef(cb);
  cbRef.current = cb;
  const ref = useRef(null);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setRunning(true);
      return undefined;
    }

    let inView = false;
    const sync = () => setRunning(inView && document.visibilityState !== 'hidden');

    const io = new IntersectionObserver(
      entries => {
        inView = entries[entries.length - 1].isIntersecting;
        sync();
      },
      { rootMargin: '80px' }
    );
    io.observe(el);
    document.addEventListener('visibilitychange', sync);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  useEffect(() => {
    if (!running) return undefined;
    let raf = 0;
    let last = performance.now();
    let t = 0;

    const loop = now => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      cbRef.current(t, dt);
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  return ref;
}
