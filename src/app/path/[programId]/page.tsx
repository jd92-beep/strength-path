import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { getExercisesByIds } from "@/lib/exercises";
import { getProgram, PROGRAMS } from "@/lib/programs";
import { thumbUrl } from "@/lib/media";

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
      <div className="stack-md">
        <div
          className="hero-panel"
          style={{
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

        <div>
          <h2 className="display" style={{ fontSize: "1.1rem", margin: "0 0 0.75rem" }}>
            Sessions
          </h2>
          <div className="stack-md">
            {program.sessions.map((session, idx) => {
              const ids = session.exercises.map((e) => e.exerciseId);
              const moves = getExercisesByIds(ids);
              return (
                <article key={session.id} className="surface" style={{ padding: "1rem", overflow: "hidden" }}>
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
                  <p className="muted" style={{ margin: "0 0 0.85rem", fontSize: "0.9rem" }}>
                    {session.focus}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.45rem",
                      overflowX: "auto",
                      paddingBottom: "0.55rem",
                      marginBottom: "0.75rem",
                      WebkitOverflowScrolling: "touch",
                    }}
                  >
                    {moves.map((m) => (
                      <Link
                        key={m.id}
                        href={`/exercise/${m.id}`}
                        style={{
                          flex: "0 0 auto",
                          width: "4.75rem",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            width: "4.75rem",
                            height: "4.75rem",
                            borderRadius: "12px",
                            overflow: "hidden",
                            background: "var(--media-canvas)",
                            border: "1px solid var(--border)",
                            marginBottom: "0.3rem",
                          }}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={thumbUrl(m.image)}
                            alt=""
                            width={76}
                            height={76}
                            loading="lazy"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              mixBlendMode: "multiply",
                            }}
                          />
                        </div>
                        <span
                          className="faint"
                          style={{
                            fontSize: "0.68rem",
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
                    Start guided workout
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
