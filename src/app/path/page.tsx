import { AppShell } from "@/components/AppShell";
import { WorkoutTile } from "@/components/WorkoutTile";
import { PROGRAMS } from "@/lib/programs";

export const metadata = {
  title: "Workouts",
};

export default function PathPage() {
  return (
    <AppShell title="Workouts" backHref="/">
      <div className="af-stack">
        <div>
          <p className="af-eyebrow">Programs</p>
          <h1 className="af-large-title" style={{ fontSize: "1.85rem" }}>
            Strength path
          </h1>
          <p className="af-caption" style={{ marginTop: "0.45rem" }}>
            Climb Foundation → Dumbbell → Barbell. Each stage is a guided multi-session plan.
          </p>
        </div>

        <div className="af-tile-stack">
          {PROGRAMS.map((program, i) => (
            <WorkoutTile
              key={program.id}
              large={i === 0}
              href={`/path/${program.id}`}
              title={program.title}
              subtitle={program.tagline}
              meta={`${program.sessions.length} workouts · ${program.weeks} weeks · ${program.equipment}`}
              badge={`Stage ${i + 1} · ${program.level}`}
              gradientKey={program.id}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
