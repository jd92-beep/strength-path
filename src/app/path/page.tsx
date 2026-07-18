import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PROGRAMS } from "@/lib/programs";

export const metadata = {
  title: "Strength path",
};

export default function PathPage() {
  return (
    <AppShell title="Strength path" backHref="/">
      <p className="muted" style={{ marginTop: 0, marginBottom: "1.1rem" }}>
        Climb in order if you are new. Each stage teaches form, then load, then the big compounds.
      </p>

      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.9rem" }}>
        {PROGRAMS.map((program, i) => (
          <li key={program.id}>
            <Link
              href={`/path/${program.id}`}
              className="surface"
              style={{
                display: "block",
                padding: "1.1rem",
                borderColor: `color-mix(in oklab, ${program.color} 42%, var(--border))`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                  marginBottom: "0.45rem",
                }}
              >
                <span
                  className="chip"
                  style={{
                    background: `color-mix(in oklab, ${program.color} 22%, var(--surface))`,
                    color: program.color,
                    borderColor: "transparent",
                  }}
                >
                  Stage {i + 1}
                </span>
                <span className="level-pill" data-level={program.level}>
                  {program.level}
                </span>
              </div>
              <h2 className="display" style={{ margin: "0 0 0.35rem", fontSize: "1.3rem" }}>
                {program.title}
              </h2>
              <p className="muted" style={{ margin: "0 0 0.75rem" }}>
                {program.description}
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.4rem",
                  fontSize: "0.82rem",
                }}
              >
                <span className="chip">{program.weeks} weeks</span>
                <span className="chip">{program.sessions.length} workouts</span>
                <span className="chip">{program.equipment}</span>
              </div>
            </Link>
          </li>
        ))}
      </ol>
    </AppShell>
  );
}
