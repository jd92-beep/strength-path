import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { BodyMap } from "@/components/BodyMap";
import { ExerciseCard } from "@/components/ExerciseCard";
import { countByBodyPart, getAllExercises, getExercise } from "@/lib/exercises";
import { PROGRAMS } from "@/lib/programs";

export default function HomePage() {
  const total = getAllExercises().length;
  const counts = countByBodyPart();
  const nextProgram = PROGRAMS[0];
  const spotlightIds = ["0662", "0043", "0652", "0025"];
  const spotlight = spotlightIds.map((id) => getExercise(id)).filter(Boolean);

  return (
    <AppShell>
      <div className="stack-lg">
        <section className="hero-panel">
          <p className="chip" style={{ marginBottom: "0.85rem", position: "relative", zIndex: 1 }}>
            Mobile strength coach
          </p>
          <h1
            className="display"
            style={{
              fontSize: "1.85rem",
              margin: "0 0 0.55rem",
              position: "relative",
              zIndex: 1,
              maxWidth: "15ch",
            }}
          >
            Get stronger without guessing.
          </h1>
          <p
            className="muted"
            style={{
              margin: "0 0 1.1rem",
              maxWidth: "38ch",
              position: "relative",
              zIndex: 1,
              fontSize: "0.98rem",
            }}
          >
            Follow a clear path, watch form demos, and train by body part — designed for the phone
            in your gym bag.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.55rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            <Link href={`/path/${nextProgram.id}`} className="btn btn-primary btn-lg">
              Start Foundation
            </Link>
            <Link href="/library" className="btn btn-ghost">
              Browse demos
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{total.toLocaleString()}</strong>
              <span>exercises</span>
            </div>
            <div className="hero-stat">
              <strong>{PROGRAMS.length}</strong>
              <span>stages</span>
            </div>
            <div className="hero-stat">
              <strong>GIF</strong>
              <span>form demos</span>
            </div>
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2 className="display">Your path</h2>
            <Link href="/path" className="section-link">
              All stages
            </Link>
          </div>
          <div className="stack">
            {PROGRAMS.map((p, i) => (
              <Link
                key={p.id}
                href={`/path/${p.id}`}
                className="surface surface-interactive path-card"
              >
                <span className="path-card__rail" style={{ background: p.color }} aria-hidden />
                <div className="path-card__top">
                  <span className="faint" style={{ fontWeight: 700, fontSize: "0.78rem" }}>
                    STAGE {i + 1}
                  </span>
                  <span className="level-pill" data-level={p.level}>
                    {p.level}
                  </span>
                </div>
                <div className="display" style={{ fontSize: "1.2rem" }}>
                  {p.title}
                </div>
                <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>
                  {p.tagline}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.15rem" }}>
                  <span className="chip">{p.sessions.length} workouts</span>
                  <span className="chip">{p.equipment}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2 className="display">Watch form first</h2>
            <Link href="/library" className="section-link">
              Library
            </Link>
          </div>
          <p className="muted" style={{ margin: "-0.35rem 0 0.85rem", fontSize: "0.9rem" }}>
            Stills load fast. Open any move for a playable demo with pause + fullscreen.
          </p>
          <div className="stack">
            {spotlight.map((ex) =>
              ex ? <ExerciseCard key={ex.id} exercise={ex} featured={ex.id === "0662"} /> : null,
            )}
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2 className="display">Body map</h2>
            <Link href="/body" className="section-link">
              All regions
            </Link>
          </div>
          <BodyMap counts={counts} />
        </section>

        <section className="surface-soft" style={{ padding: "1.1rem" }}>
          <h2 className="display" style={{ margin: "0 0 0.75rem", fontSize: "1.1rem" }}>
            How sessions feel
          </h2>
          <div className="stack">
            {[
              { t: "Demo on screen", d: "Playable form GIF with pause, loop badge, and expand." },
              { t: "Sets that guide you", d: "Reps, coaching cues, and a sticky complete button." },
              { t: "Rest that counts", d: "Circular rest timer between sets — skip when ready." },
              { t: "Steps when stuck", d: "Numbered teaching steps under every exercise." },
            ].map((item, i) => (
              <div
                key={item.t}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2rem 1fr",
                  gap: "0.7rem",
                  alignItems: "start",
                }}
              >
                <span
                  className="chip"
                  style={{
                    width: "2rem",
                    height: "2rem",
                    padding: 0,
                    justifyContent: "center",
                    background: "color-mix(in oklab, var(--primary) 18%, var(--surface))",
                    color: "var(--primary)",
                    borderColor: "transparent",
                  }}
                >
                  {i + 1}
                </span>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: "0.15rem" }}>{item.t}</div>
                  <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
                    {item.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
