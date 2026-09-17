import { useEffect, useRef } from 'react';

/**
 * Live coordinate readout for the hero. The dot field behind the
 * hero already responds to the cursor — this makes that reaction
 * legible, like an instrument logging the pointer's position.
 */
export default function CursorReadout() {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return undefined;

    if (window.matchMedia('(pointer: coarse)').matches) {
      el.textContent = 'x — · y —';
      return undefined;
    }

    let raf = 0;
    let x = 0;
    let y = 0;
    let seen = false;

    const update = () => {
      raf = 0;
      if (!seen) return;
      el.textContent = `x ${String(x).padStart(4, '0')} · y ${String(y).padStart(4, '0')}`;
    };

    const onMove = e => {
      seen = true;
      x = Math.round(e.clientX);
      y = Math.round(e.clientY);
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="lab-readout" aria-hidden="true">
      <svg className="cross" width="9" height="9" viewBox="0 0 9 9" fill="none">
        <path d="M4.5 0v9M0 4.5h9" stroke="currentColor" strokeWidth="1" />
      </svg>
      <span ref={textRef}>x 0000 · y 0000</span>
    </div>
  );
}
