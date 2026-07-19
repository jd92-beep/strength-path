import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { getExercisesByIds } from "@/lib/exercises";
import { getProgram, PROGRAMS } from "@/lib/programs";
import { gradientForKey } from "@/lib/fitness-theme";
import { ExercisePhoto } from "@/components/ExercisePhoto";

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
      <div className="af-stack">
        <section
          className="af-tile af-tile--large"
          style={{ background: gradientForKey(program.id), minHeight: "11rem" }}
        >
          <div className="af-tile__veil" />
          <div className="af-tile__content">
            <span className="af-tile__badge">{program.level}</span>
            <h1 className="af-tile__title" style={{ fontSize: "1.85rem" }}>
              {program.title}
            </h1>
            <p className="af-tile__sub">{program.tagline}</p>
            <p className="af-tile__meta">
              {program.weeks} weeks · {program.sessions.length} sessions · {program.equipment}
            </p>
          </div>
        </section>

        <p className="muted" style={{ margin: 0, fontSize: "0.95rem" }}>
          {program.description}
        </p>

        <section>
          <div className="af-section-head">
            <h2>Sessions</h2>
          </div>
          <div className="af-stack-sm">
            {program.sessions.map((session, idx) => {
              const moves = getExercisesByIds(session.exercises.map((e) => e.exerciseId));
              return (
                <article key={session.id} className="surface" style={{ padding: "1rem", borderRadius: "18px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "0.5rem",
                      marginBottom: "0.35rem",
                    }}
                  >
                    <span className="faint" style={{ fontWeight: 700, fontSize: "0.78rem" }}>
                      WORKOUT {idx + 1}
                    </span>
                    <span className="muted" style={{ fontSize: "0.8rem" }}>
                      {session.durationMin} MIN
                    </span>
                  </div>
                  <h3 className="display" style={{ margin: "0 0 0.3rem", fontSize: "1.2rem" }}>
                    {session.title}
                  </h3>
                  <p className="muted" style={{ margin: "0 0 0.85rem", fontSize: "0.9rem" }}>
                    {session.focus}
                  </p>

                  <div className="af-h-scroll" style={{ marginBottom: "0.85rem" }}>
                    {moves.map((m) => (
                      <Link
                        key={m.id}
                        href={`/exercise/${m.id}`}
                        style={{
                          flex: "0 0 auto",
                          width: "4.5rem",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "4.5rem",
                            height: "4.5rem",
                            borderRadius: "14px",
                            overflow: "hidden",
                            background: "#111",
                            marginBottom: "0.3rem",
                          }}
                        >
                          <ExercisePhoto
                            imagePath={m.image}
                            bodyPart={m.body_part}
                            alt=""
                            width={72}
                            height={72}
                            className="ex-thumb"
                          />
                        </div>
                        <span
                          className="faint"
                          style={{
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {m.name}
                        </span>
                      </Link>
                    ))}
                  </div>

                  <Link href={`/workout/${session.id}`} className="btn btn-primary btn-block btn-lg">
                    Let’s Go
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
