"use client";

import { useEffect, useRef, useState } from "react";

export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = setTimeout(() => setInView(true), 0);
      return () => clearTimeout(id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    // Safety net: never let content stay permanently hidden if the observer
    // never fires (e.g. page loaded in a background tab, element never quite
    // crosses the threshold). Reveal it anyway after a short grace period.
    const fallback = setTimeout(() => setInView(true), 1200);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, [threshold, inView]);

  return { ref, inView };
}
