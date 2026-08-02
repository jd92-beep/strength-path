"use client";

import { useEffect } from "react";

/**
 * Global tap-ripple: on pointer-down over any .btn / [data-ripple], spawn a
 * radial ripple that expands from the touch point. One delegated listener for
 * the whole app — no per-button wiring. Respects prefers-reduced-motion.
 */
export function TapFX() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    function onDown(e: PointerEvent) {
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        ".btn, [data-ripple]",
      );
      if (!target || target.hasAttribute("disabled")) return;

      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const span = document.createElement("span");
      span.className = "tapfx-ripple";
      span.style.width = span.style.height = `${size}px`;
      span.style.left = `${e.clientX - rect.left - size / 2}px`;
      span.style.top = `${e.clientY - rect.top - size / 2}px`;
      // Ensure the host clips the ripple
      if (getComputedStyle(target).position === "static") target.style.position = "relative";
      target.appendChild(span);
      span.addEventListener("animationend", () => span.remove(), { once: true });
    }

    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, []);

  return null;
}
