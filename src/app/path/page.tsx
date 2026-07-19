import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { PROGRAMS } from "@/lib/programs";

export const metadata = {
  title: "Strength path",
};

export default function PathPage() {
  return (
    <AppShell title="Strength path" backHref="/">
      <div className="stack-md">
        <p className="muted" style={{ margin: 0 }}>
          Climb in order if you are new. Each stage teaches form, then load, then the big compounds.
        </p>

        <ol className="stack" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {PROGRAMS.map((program, i) => (
            <li key={program.id}>
              <Link href={`/path/${program.id}`} className="surface surface-interactive path-card">
                <span
                  className="path-card__rail"
                  style={{ background: program.color }}
                  aria-hidden
                />
                <div className="path-card__top">
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
                <h2 className="display" style={{ margin: 0, fontSize: "1.3rem" }}>
                  {program.title}
                </h2>
                <p className="muted" style={{ margin: 0 }}>
                  {program.description}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                  <span className="chip">{program.weeks} weeks</span>
                  <span className="chip">{program.sessions.length} workouts</span>
                  <span className="chip">{program.equipment}</span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </AppShell>
  );
}
