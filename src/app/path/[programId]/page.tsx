import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { getExercisesByIds } from "@/lib/exercises";
import { getProgram, PROGRAMS } from "@/lib/programs";

export function generateStaticParams() {
  return PROGRAMS.map((p) => ({ programId: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const { programId } = await params;
  const program = getProgram(programId);
  return { title: program?.title ?? "Program" };
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ programId: string }>;
}) {
  const { programId } = await params;
  const program = getProgram(programId);
  if (!program) notFound();

  return (
    <AppShell title={program.title} backHref="/path">
      <div
        className="hero-panel"
        style={{
          marginBottom: "1.15rem",
          background: `linear-gradient(145deg, color-mix(in oklab, ${program.color} 30%, var(--surface)), var(--surface))`,
          borderColor: `color-mix(in oklab, ${program.color} 40%, var(--border))`,
        }}
      >
        <div style={{ position: "relative", zIndex: 1 }}>
          <span className="level-pill" data-level={program.level}>
            {program.level}
          </span>
          <h1 className="display" style={{ fontSize: "1.55rem", margin: "0.55rem 0 0.4rem" }}>
            {program.tagline}
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            {program.description}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginTop: "0.85rem" }}>
            <span className="chip">{program.weeks}-week arc</span>
            <span className="chip">{program.equipment}</span>
            <span className="chip">{program.sessions.length} sessions</span>
          </div>
        </div>
      </div>

      <h2 className="display" style={{ fontSize: "1.1rem", margin: "0 0 0.75rem" }}>
        Sessions
      </h2>
      <div style={{ display: "grid", gap: "0.85rem" }}>
        {program.sessions.map((session, idx) => {
          const ids = session.exercises.map((e) => e.exerciseId);
          const moves = getExercisesByIds(ids);
          return (
            <article key={session.id} className="surface" style={{ padding: "1rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                  marginBottom: "0.35rem",
                }}
              >
                <span className="faint" style={{ fontWeight: 700, fontSize: "0.8rem" }}>
                  Workout {idx + 1}
                </span>
                <span className="muted" style={{ fontSize: "0.8rem" }}>
                  ~{session.durationMin} min
                </span>
              </div>
              <h3 className="display" style={{ margin: "0 0 0.3rem", fontSize: "1.15rem" }}>
                {session.title}
              </h3>
              <p className="muted" style={{ margin: "0 0 0.75rem", fontSize: "0.9rem" }}>
                {session.focus}
              </p>
              <ul
                style={{
                  margin: "0 0 0.9rem",
                  paddingLeft: "1.1rem",
                  color: "var(--ink-muted)",
                  fontSize: "0.88rem",
                }}
              >
                {moves.map((m) => (
                  <li key={m.id} style={{ marginBottom: "0.2rem" }}>
                    <Link href={`/exercise/${m.id}`} style={{ textDecoration: "underline" }}>
                      {m.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/workout/${session.id}`} className="btn btn-primary btn-block">
                Start guided workout
              </Link>
            </article>
          );
        })}
      </div>
    </AppShell>
  );
}
