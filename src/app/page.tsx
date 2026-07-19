import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SummaryRings } from "@/components/SummaryRings";
import { ExerciseCard } from "@/components/ExerciseCard";
import { WorkoutTile } from "@/components/WorkoutTile";
import { getAllExercises, getExercise } from "@/lib/exercises";
import { PROGRAMS } from "@/lib/programs";
import { patternCatalog } from "@/lib/teaching";
import { LANGS } from "@/lib/langs";

export default function HomePage() {
  const total = getAllExercises().length;
  const nextProgram = PROGRAMS[0];
  const spotlight = ["0662", "0043", "0652", "0025"]
    .map((id) => getExercise(id))
    .filter(Boolean);
  const patterns = patternCatalog().slice(0, 4);

  return (
    <AppShell>
      <div className="af-stack">
        <header className="af-summary-head">
          <div>
            <p className="af-eyebrow">Summary</p>
            <h1 className="af-large-title">For You</h1>
          </div>
          <SummaryRings size={118} />
        </header>

        <section className="af-ring-legend" aria-label="Activity rings">
          <div>
            <span className="af-dot" style={{ background: "var(--ring-move)" }} />
            Move
          </div>
          <div>
            <span className="af-dot" style={{ background: "var(--ring-exercise)" }} />
            Exercise
          </div>
          <div>
            <span className="af-dot" style={{ background: "var(--ring-stand)" }} />
            Stand
          </div>
        </section>

        <section>
          <div className="af-section-head">
            <h2>Start a workout</h2>
            <Link href="/path">See All</Link>
          </div>
          <div className="af-tile-stack">
            <WorkoutTile
              large
              href={`/path/${nextProgram.id}`}
              title={nextProgram.title}
              subtitle={nextProgram.tagline}
              meta={`${nextProgram.sessions.length} sessions · ${nextProgram.equipment}`}
              badge="Featured"
              gradientKey={nextProgram.id}
            />
            {PROGRAMS.slice(1).map((p) => (
              <WorkoutTile
                key={p.id}
                href={`/path/${p.id}`}
                title={p.title}
                subtitle={p.tagline}
                meta={`${p.sessions.length} workouts · ${p.level}`}
                badge={p.level}
                gradientKey={p.id}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="af-section-head">
            <h2>Trainer tips</h2>
            <Link href="/learn">See All</Link>
          </div>
          <div className="af-h-scroll">
            {patterns.map((p) => (
              <Link
                key={p.id}
                href={`/learn/${p.id}`}
                className="af-mini-tile"
                style={{ ["--g" as string]: p.color }}
              >
                <span className="af-mini-tile__label">{p.label}</span>
                <span className="af-mini-tile__sub">Form pattern</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="af-section-head">
            <h2>By body</h2>
            <Link href="/body">See All</Link>
          </div>
          <div className="af-h-scroll" style={{ marginBottom: "0.25rem" }}>
            {[
              { href: "/body/chest", label: "Chest" },
              { href: "/body/back", label: "Back" },
              { href: "/body/upper-legs", label: "Legs" },
              { href: "/body/shoulders", label: "Shoulders" },
              { href: "/body/upper-arms", label: "Arms" },
              { href: "/body/waist", label: "Core" },
            ].map((b) => (
              <Link key={b.href} href={b.href} className="af-mini-tile" style={{ ["--g" as string]: "#30d158", minHeight: "4.5rem", width: "7.5rem" }}>
                <span className="af-mini-tile__label">{b.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="af-section-head">
            <h2>With demos</h2>
            <Link href="/library">Search</Link>
          </div>
          <p className="af-caption">
            {total.toLocaleString()} moves · GIF form · {LANGS.length} languages
          </p>
          <div className="af-stack-sm">
            {spotlight.map((ex, i) =>
              ex ? <ExerciseCard key={ex.id} exercise={ex} featured={i === 0} /> : null,
            )}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
