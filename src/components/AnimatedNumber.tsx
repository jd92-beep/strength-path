"use client";

import { useEffect, useRef, useState } from "react";

export function AnimatedNumber({
  value,
  duration = 900,
  format = (n: number) => String(Math.round(n)),
}: {
  value: number;
  duration?: number;
  format?: (n: number) => string;
}) {
  const [display, setDisplay] = useState(0);
  const displayRef = useRef(0);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = setTimeout(() => {
        displayRef.current = value;
        setDisplay(value);
      }, 0);
      return () => clearTimeout(id);
    }
    // Animate from the currently displayed value so a value change doesn't
    // flicker the number back to 0.
    const from = displayRef.current;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const next = from + (value - from) * eased;
      displayRef.current = next;
      setDisplay(next);
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [value, duration]);

  return <span>{format(display)}</span>;
}
