"use client";

import { useRef, type HTMLAttributes } from "react";

/**
 * Horizontal scroll rail that also drags with a mouse (touch scrolls natively).
 * Suppresses the click that would otherwise fire after a drag.
 */
export function ScrollRail({
  className = "af-h-scroll",
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);
  const moved = useRef(false);

  return (
    <div
      ref={ref}
      className={className}
      onPointerDown={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        drag.current = { x: e.clientX, left: ref.current.scrollLeft };
        moved.current = false;
      }}
      onPointerMove={(e) => {
        if (!drag.current || !ref.current) return;
        const dx = e.clientX - drag.current.x;
        if (Math.abs(dx) > 4) moved.current = true;
        ref.current.scrollLeft = drag.current.left - dx;
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerLeave={() => {
        drag.current = null;
      }}
      onClickCapture={(e) => {
        if (moved.current) {
          e.preventDefault();
          e.stopPropagation();
          moved.current = false;
        }
      }}
      {...rest}
    >
      {children}
    </div>
  );
}
