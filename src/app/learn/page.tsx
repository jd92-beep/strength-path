import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { WorkoutTile } from "@/components/WorkoutTile";
import { getAllExercises } from "@/lib/exercises";
import { detectPattern, patternCatalog } from "@/lib/teaching";

export const metadata = {
  title: "Library",
};

export default function LearnPage() {
  const all = getAllExercises();
  const catalog = patternCatalog();

  return (
    <AppShell title="Library" backHref="/">
      <div className="af-stack">
        <div>
          <p className="af-eyebrow">Form library</p>
          <h1 className="af-large-title" style={{ fontSize: "1.85rem" }}>
            Patterns
          </h1>
          <p className="af-caption" style={{ marginTop: "0.45rem" }}>
            Learn like a coach: watch the demo, lock setup cues, fix mistakes, then level up.
          </p>
        </div>

        <div className="af-tile-stack">
          {catalog.map((p) => {
            const count = all.filter((e) => detectPattern(e) === p.id).length;
            return (
              <WorkoutTile
                key={p.id}
                href={`/learn/${p.id}`}
                title={p.label}
                subtitle={p.skillFocus}
                meta={`${count} demos`}
                badge="Pattern"
                gradientKey={p.id}
              />
            );
          })}
        </div>

        <Link href="/library" className="btn btn-ghost btn-block">
          Search all exercises
        </Link>
      </div>
    </AppShell>
  );
}
