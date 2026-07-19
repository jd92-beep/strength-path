"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="af-app">
      <main className="af-shell" style={{ paddingTop: "4rem", textAlign: "center" }}>
        <p className="af-eyebrow">Something went wrong</p>
        <h1 className="af-large-title" style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>
          Couldn’t load this screen
        </h1>
        <p className="muted" style={{ marginBottom: "1.5rem" }}>
          Try again. If it keeps failing, go home and open another workout.
        </p>
        <div className="stack" style={{ maxWidth: "20rem", marginInline: "auto" }}>
          <button type="button" className="btn btn-primary btn-block" onClick={reset}>
            Try again
          </button>
          <Link href="/" className="btn btn-ghost btn-block">
            Summary
          </Link>
        </div>
      </main>
    </div>
  );
}
