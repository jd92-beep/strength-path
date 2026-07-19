import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { getAllExercises } from "@/lib/exercises";
import { detectPattern, patternCatalog } from "@/lib/teaching";

export const metadata = {
  title: "Learn patterns",
};

export default function LearnPage() {
  const all = getAllExercises();
  const counts = Object.fromEntries(
    patternCatalog().map((p) => [p.id, all.filter((e) => detectPattern(e) === p.id).length]),
  );

  return (
    <AppShell title="Learn" backHref="/">
      <div className="stack-md">
        <section className="hero-panel hero-panel--learn">
          <p className="chip" style={{ position: "relative", zIndex: 1, marginBottom: "0.75rem" }}>
            Teaching system
          </p>
          <h1
            className="display"
            style={{ fontSize: "1.65rem", margin: "0 0 0.5rem", position: "relative", zIndex: 1 }}
          >
            Learn movement patterns, not random exercises.
          </h1>
          <p className="muted" style={{ margin: 0, position: "relative", zIndex: 1, maxWidth: "38ch" }}>
            Every demo is taught through Watch → Steps → Cues → Fix → Level up. Pick a pattern, then
            open any exercise for the full studio.
          </p>
        </section>

        <section className="stack">
          {patternCatalog().map((p) => (
            <Link key={p.id} href={`/learn/${p.id}`} className="surface surface-interactive path-card">
              <span className="path-card__rail" style={{ background: p.color }} aria-hidden />
              <div className="path-card__top">
                <span
                  className="chip"
                  style={{
                    borderColor: "transparent",
                    background: `color-mix(in oklab, ${p.color} 20%, var(--surface))`,
                    color: p.color,
                  }}
                >
                  Pattern
                </span>
                <span className="faint" style={{ fontSize: "0.78rem", fontWeight: 700 }}>
                  {counts[p.id] ?? 0} demos
                </span>
              </div>
              <div className="display" style={{ fontSize: "1.15rem" }}>
                {p.label}
              </div>
              <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
                {p.skillFocus}
              </p>
            </Link>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
