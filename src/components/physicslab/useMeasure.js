import { useEffect, useRef, useState } from 'react';

/** Measures an element via ResizeObserver → [ref, { w, h }]. */
export default function useMeasure() {
  const ref = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const update = () => {
      const r = el.getBoundingClientRect();
      setSize(s =>
        Math.abs(s.w - r.width) > 0.5 || Math.abs(s.h - r.height) > 0.5
          ? { w: r.width, h: r.height }
          : s
      );
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
}
