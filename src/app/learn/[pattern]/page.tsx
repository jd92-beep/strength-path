import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ExerciseCard } from "@/components/ExerciseCard";
import { getAllExercises } from "@/lib/exercises";
import {
  exercisesForPattern,
  patternCatalog,
  type MovementPattern,
  buildLesson,
} from "@/lib/teaching";

export function generateStaticParams() {
  return patternCatalog().map((p) => ({ pattern: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pattern: string }>;
}) {
  const { pattern } = await params;
  const meta = patternCatalog().find((p) => p.id === pattern);
  return { title: meta ? `Learn ${meta.label}` : "Pattern" };
}

export default async function PatternPage({
  params,
}: {
  params: Promise<{ pattern: string }>;
}) {
  const { pattern } = await params;
  const meta = patternCatalog().find((p) => p.id === pattern);
  if (!meta) notFound();

  const all = getAllExercises();
  const list = exercisesForPattern(all, pattern as MovementPattern, 30);
  const sample = list[0];
  const lesson = sample ? buildLesson(sample) : null;

  return (
    <AppShell title={meta.label} backHref="/learn">
      <div className="stack-md">
        <section
          className="surface"
          style={{
            padding: "1.15rem",
            borderColor: `color-mix(in oklab, ${meta.color} 40%, var(--border))`,
            background: `linear-gradient(155deg, color-mix(in oklab, ${meta.color} 18%, var(--surface)), var(--surface))`,
          }}
        >
          <p className="chip" style={{ marginBottom: "0.55rem" }}>
            Movement pattern
          </p>
          <h1 className="display" style={{ margin: "0 0 0.4rem", fontSize: "1.45rem" }}>
            {meta.label}
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            {meta.skillFocus}
          </p>
        </section>

        {lesson ? (
          <section className="surface" style={{ padding: "1.1rem" }}>
            <h2 className="display" style={{ fontSize: "1.05rem", margin: "0 0 0.75rem" }}>
              How we teach this pattern
            </h2>
            <div className="stack">
              <div className="teach-callout">
                <strong>Breathing</strong>
                <p>{lesson.breathe}</p>
              </div>
              <div className="teach-callout teach-callout--soft">
                <strong>Feel target</strong>
                <p>{lesson.feel}</p>
              </div>
              <div className="teach-callout teach-callout--soft">
                <strong>Tempo · dose</strong>
                <p>
                  {lesson.tempo} · {lesson.setsRepsHint}
                </p>
              </div>
              <div>
                <p className="faint" style={{ margin: "0 0 0.4rem", fontWeight: 700, fontSize: "0.78rem" }}>
                  SETUP CHECKLIST
                </p>
                <ol className="teach-numbered">
                  {lesson.setup.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        ) : null}

        <section>
          <div className="section-head">
            <h2 className="display">Practice demos</h2>
            <span className="faint" style={{ fontSize: "0.8rem" }}>
              {list.length} shown
            </span>
          </div>
          <div className="stack">
            {list.map((ex, i) => (
              <ExerciseCard key={ex.id} exercise={ex} featured={i === 0} />
            ))}
          </div>
          {!list.length ? (
            <p className="muted">No demos tagged for this pattern yet.</p>
          ) : (
            <p className="muted" style={{ marginTop: "0.85rem", fontSize: "0.9rem" }}>
              Open any exercise for the full studio: Watch · Steps · Cues · Fix · Level up.{" "}
              <Link href="/library" className="section-link">
                Browse library
              </Link>
            </p>
          )}
        </section>
      </div>
    </AppShell>
  );
}
