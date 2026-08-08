"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { useLocale } from "@/lib/locale";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { tr } = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="af-app">
      <main className="af-shell" style={{ paddingTop: "4rem", textAlign: "center" }}>
        <p className="af-eyebrow">{tr("errorEyebrow")}</p>
        <h1 className="af-large-title" style={{ fontSize: "1.75rem", marginBottom: "0.75rem" }}>
          {tr("errorTitle")}
        </h1>
        <p className="muted" style={{ marginBottom: "1.5rem" }}>
          {tr("errorBody")}
        </p>
        <div className="stack" style={{ maxWidth: "20rem", marginInline: "auto" }}>
          <button type="button" className="btn btn-primary btn-block" onClick={reset}>
            {tr("tryAgain")}
          </button>
          <Link href="/" className="btn btn-ghost btn-block">
            {tr("summary")}
          </Link>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
