import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { BodyMap } from "@/components/BodyMap";
import { ExerciseCard } from "@/components/ExerciseCard";
import { countByBodyPart, getAllExercises, getExercise } from "@/lib/exercises";
import { PROGRAMS } from "@/lib/programs";
import { patternCatalog } from "@/lib/teaching";

export default function HomePage() {
  const total = getAllExercises().length;
  const counts = countByBodyPart();
  const nextProgram = PROGRAMS[0];
  const spotlightIds = ["0662", "0043", "0652", "0025", "0293"];
  const spotlight = spotlightIds.map((id) => getExercise(id)).filter(Boolean);
  const patterns = patternCatalog().slice(0, 6);

  return (
    <AppShell>
      <div className="stack-lg">
        <section className="hero-panel">
          <p className="chip" style={{ marginBottom: "0.85rem", position: "relative", zIndex: 1 }}>
            React · mobile strength coach
          </p>
          <h1
            className="display"
            style={{
              fontSize: "1.9rem",
              margin: "0 0 0.55rem",
              position: "relative",
              zIndex: 1,
              maxWidth: "14ch",
            }}
          >
            Learn the move. Then get strong.
          </h1>
          <p
            className="muted"
            style={{
              margin: "0 0 1.15rem",
              maxWidth: "36ch",
              position: "relative",
              zIndex: 1,
            }}
          >
            Pattern-based teaching, playable form demos, and guided sessions — built for your phone
            browser.
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
            <Link href="/learn" className="btn btn-primary btn-lg">
              Open learn studio
            </Link>
            <Link href={`/path/${nextProgram.id}`} className="btn btn-ghost">
              Start training
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{total.toLocaleString()}</strong>
              <span>demos</span>
            </div>
            <div className="hero-stat">
              <strong>{patternCatalog().length}</strong>
              <span>patterns</span>
            </div>
            <div className="hero-stat">
              <strong>5</strong>
              <span>teach tabs</span>
            </div>
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2 className="display">How teaching works</h2>
            <Link href="/learn" className="section-link">
              All patterns
            </Link>
          </div>
          <div className="teach-flow">
            {[
              { n: "1", t: "Watch", d: "Playable GIF with pause & fullscreen" },
              { n: "2", t: "Steps", d: "Dataset instructions, ordered" },
              { n: "3", t: "Cues", d: "Setup + execute for the pattern" },
              { n: "4", t: "Fix", d: "Common mistakes → quick fixes" },
              { n: "5", t: "Level", d: "Regress or progress safely" },
            ].map((item) => (
              <div key={item.n} className="teach-flow__item">
                <span className="teach-flow__n">{item.n}</span>
                <div>
                  <strong>{item.t}</strong>
                  <p>{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2 className="display">Study a pattern</h2>
            <Link href="/learn" className="section-link">
              View all
            </Link>
          </div>
          <div className="pattern-grid">
            {patterns.map((p) => (
              <Link
                key={p.id}
                href={`/learn/${p.id}`}
                className="pattern-tile"
                style={{ ["--pattern" as string]: p.color }}
              >
                <span className="pattern-tile__dot" />
                <span className="pattern-tile__label">{p.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2 className="display">Featured form demos</h2>
            <Link href="/library" className="section-link">
              Library
            </Link>
          </div>
          <div className="stack">
            {spotlight.map((ex, i) =>
              ex ? <ExerciseCard key={ex.id} exercise={ex} featured={i === 0} /> : null,
            )}
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2 className="display">Train path</h2>
            <Link href="/path" className="section-link">
              Stages
            </Link>
          </div>
          <div className="stack">
            {PROGRAMS.map((p, i) => (
              <Link key={p.id} href={`/path/${p.id}`} className="surface surface-interactive path-card">
                <span className="path-card__rail" style={{ background: p.color }} aria-hidden />
                <div className="path-card__top">
                  <span className="faint" style={{ fontWeight: 700, fontSize: "0.78rem" }}>
                    STAGE {i + 1}
                  </span>
                  <span className="level-pill" data-level={p.level}>
                    {p.level}
                  </span>
                </div>
                <div className="display" style={{ fontSize: "1.15rem" }}>
                  {p.title}
                </div>
                <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>
                  {p.tagline}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2 className="display">Body map</h2>
            <Link href="/body" className="section-link">
              Regions
            </Link>
          </div>
          <BodyMap counts={counts} />
        </section>
      </div>
    </AppShell>
  );
}
