import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { BODY_PARTS, slugifyPart } from "@/lib/body-parts";
import { countByBodyPart, getAllExercises } from "@/lib/exercises";
import { PROGRAMS } from "@/lib/programs";

export default function HomePage() {
  const total = getAllExercises().length;
  const counts = countByBodyPart();
  const nextProgram = PROGRAMS[0];

  return (
    <AppShell>
      <section className="hero-panel" style={{ marginBottom: "1.25rem" }}>
        <p className="chip" style={{ marginBottom: "0.75rem", position: "relative", zIndex: 1 }}>
          Your strength coach
        </p>
        <h1
          className="display"
          style={{
            fontSize: "clamp(1.75rem, 6vw, 2.25rem)",
            margin: "0 0 0.6rem",
            position: "relative",
            zIndex: 1,
            maxWidth: "16ch",
          }}
        >
          Don’t guess. Follow the path.
        </h1>
        <p
          className="muted"
          style={{
            margin: "0 0 1.1rem",
            maxWidth: "36ch",
            position: "relative",
            zIndex: 1,
          }}
        >
          Step-by-step programs, body-part lessons, and {total.toLocaleString()} exercises with
          animations + coaching cues — built for your phone.
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
          <Link href={`/path/${nextProgram.id}`} className="btn btn-primary">
            Start Foundation
          </Link>
          <Link href="/body" className="btn btn-ghost">
            Train by body part
          </Link>
        </div>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            marginBottom: "0.75rem",
          }}
        >
          <h2 className="display" style={{ margin: 0, fontSize: "1.2rem" }}>
            The path to stronger
          </h2>
          <Link href="/path" className="muted" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            View all
          </Link>
        </div>
        <div style={{ display: "grid", gap: "0.75rem" }}>
          {PROGRAMS.map((p, i) => (
            <Link
              key={p.id}
              href={`/path/${p.id}`}
              className="surface"
              style={{
                padding: "1rem",
                display: "grid",
                gap: "0.45rem",
                borderColor: `color-mix(in oklab, ${p.color} 40%, var(--border))`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem" }}>
                <span className="faint" style={{ fontWeight: 700, fontSize: "0.8rem" }}>
                  Stage {i + 1}
                </span>
                <span className="level-pill" data-level={p.level}>
                  {p.level}
                </span>
              </div>
              <div className="display" style={{ fontSize: "1.15rem" }}>
                {p.title}
              </div>
              <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
                {p.tagline}
              </p>
              <div className="muted" style={{ fontSize: "0.8rem" }}>
                {p.sessions.length} sessions · {p.equipment}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 className="display" style={{ margin: "0 0 0.75rem", fontSize: "1.2rem" }}>
          How it teaches you
        </h2>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          {[
            {
              t: "1 · Pick a stage",
              d: "Foundation first, then dumbbells, then barbell compounds.",
            },
            {
              t: "2 · Run the session",
              d: "Sets, rest timers, and coaching notes live on one phone screen.",
            },
            {
              t: "3 · Study each move",
              d: "Every exercise has a GIF and numbered form steps.",
            },
            {
              t: "4 · Target weak links",
              d: "Browse by body part when you want focused practice.",
            },
          ].map((item) => (
            <div key={item.t} className="surface-soft" style={{ padding: "0.9rem 1rem" }}>
              <div className="display" style={{ fontSize: "0.98rem", marginBottom: "0.25rem" }}>
                {item.t}
              </div>
              <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
                {item.d}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            marginBottom: "0.75rem",
          }}
        >
          <h2 className="display" style={{ margin: 0, fontSize: "1.2rem" }}>
            Body map
          </h2>
          <Link href="/library" className="muted" style={{ fontSize: "0.85rem", fontWeight: 600 }}>
            Full library
          </Link>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
            gap: "0.65rem",
          }}
        >
          {BODY_PARTS.filter((b) => b.id !== "neck").map((part) => (
            <Link
              key={part.id}
              href={`/body/${slugifyPart(part.id)}`}
              className="surface"
              style={{
                padding: "0.9rem",
                borderColor: `color-mix(in oklab, ${part.accent} 45%, var(--border))`,
              }}
            >
              <div style={{ fontSize: "1.25rem", marginBottom: "0.25rem" }}>{part.emoji}</div>
              <div className="display" style={{ fontSize: "1rem" }}>
                {part.label}
              </div>
              <div className="faint" style={{ fontSize: "0.78rem", marginTop: "0.2rem" }}>
                {counts[part.id] ?? 0} moves
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
