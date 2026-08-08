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
    // crosses the threshold). Only reveal it if it's actually within/near the
    // viewport — otherwise leave it hidden and let the observer fire on scroll.
    const fallback = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const margin = 200;
      if (rect.top < window.innerHeight + margin && rect.bottom > -margin) {
        setInView(true);
      }
    }, 1200);
    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, [threshold, inView]);

  return { ref, inView };
}
