"use client";

import Link from "next/link";
import { BottomNav } from "@/components/BottomNav";
import { useLocale } from "@/lib/locale";

export default function NotFound() {
  const { tr } = useLocale();

  return (
    <div className="af-app">
      <main className="af-shell" style={{ paddingTop: "4rem", textAlign: "center" }}>
        <p className="af-eyebrow">404</p>
        <h1 className="af-large-title" style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
          {tr("notFoundTitle")}
        </h1>
        <p className="muted" style={{ marginBottom: "1.5rem" }}>
          {tr("notFoundBody")}
        </p>
        <div className="stack" style={{ maxWidth: "20rem", marginInline: "auto" }}>
          <Link href="/" className="btn btn-primary btn-block">
            {tr("backToSummary")}
          </Link>
          <Link href="/library" className="btn btn-ghost btn-block">
            {tr("searchDemos")}
          </Link>
          <Link href="/path" className="btn btn-ghost btn-block">
            {tr("workouts")}
          </Link>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
