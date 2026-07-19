import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { BodyMap } from "@/components/BodyMap";
import { ExerciseCard } from "@/components/ExerciseCard";
import { countByBodyPart, getAllExercises, getExercise } from "@/lib/exercises";
import { PROGRAMS } from "@/lib/programs";
import { patternCatalog } from "@/lib/teaching";
import { LANGS } from "@/lib/langs";

export default function HomePage() {
  const total = getAllExercises().length;
  const counts = countByBodyPart();
  const nextProgram = PROGRAMS[0];
  const spotlightIds = ["0662", "0043", "0652", "0025", "0293", "0334"];
  const spotlight = spotlightIds.map((id) => getExercise(id)).filter(Boolean);
  const patterns = patternCatalog().slice(0, 6);

  return (
    <AppShell>
      <div className="stack-lg">
        <section className="hero-panel">
          <p className="chip" style={{ marginBottom: "0.9rem", position: "relative", zIndex: 1 }}>
            {total.toLocaleString()} demos · 10 languages · phone-first
          </p>
          <h1
            className="display"
            style={{
              fontSize: "2rem",
              margin: "0 0 0.55rem",
              position: "relative",
              zIndex: 1,
              maxWidth: "12ch",
              lineHeight: 1.05,
            }}
          >
            Form first. Strength second.
          </h1>
          <p
            className="muted"
            style={{
              margin: "0 0 1.2rem",
              maxWidth: "34ch",
              position: "relative",
              zIndex: 1,
              fontSize: "1rem",
            }}
          >
            Every move from the open exercise dataset — GIF, muscles, equipment, and instructions you
            can switch across {LANGS.length} languages.
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
              Enter learn studio
            </Link>
            <Link href={`/path/${nextProgram.id}`} className="btn btn-ghost">
              Train Foundation
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>{total.toLocaleString()}</strong>
              <span>exercises</span>
            </div>
            <div className="hero-stat">
              <strong>{LANGS.length}</strong>
              <span>languages</span>
            </div>
            <div className="hero-stat">
              <strong>GIF</strong>
              <span>+ stills</span>
            </div>
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2 className="display">Featured demos</h2>
            <Link href="/library" className="section-link">
              All demos
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
            <h2 className="display">Learn by pattern</h2>
            <Link href="/learn" className="section-link">
              All patterns
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

        <section className="surface" style={{ padding: "1.15rem", borderRadius: "20px" }}>
          <h2 className="display" style={{ margin: "0 0 0.75rem", fontSize: "1.1rem" }}>
            Full dataset coverage
          </h2>
          <ul className="teach-bullets">
            <li>
              <strong>1,324</strong> exercises with GIF + 180×180 thumbnail
            </li>
            <li>
              Fields: id, name, category, body part, equipment, target, muscle group, secondary
              muscles, media id, attribution
            </li>
            <li>
              Instructions + steps in <strong>10 languages</strong> (switch inside Form studio)
            </li>
            <li>Media © Gym visual — shown on every demo</li>
          </ul>
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
                <div className="display" style={{ fontSize: "1.2rem" }}>
                  {p.title}
                </div>
                <p className="muted" style={{ margin: 0 }}>
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
