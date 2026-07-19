"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { SummaryRings } from "@/components/SummaryRings";
import { ExerciseCard } from "@/components/ExerciseCard";
import { WorkoutTile } from "@/components/WorkoutTile";
import { BodyPartIcon } from "@/components/BodyPartIcon";
import type { Exercise } from "@/lib/types";
import type { Program } from "@/lib/types";
import { useLocale } from "@/lib/locale";

type Pattern = { id: string; label: string; skillFocus: string; color: string };

export function HomeClient({
  total,
  langCount,
  programs,
  patterns,
  spotlight,
}: {
  total: number;
  langCount: number;
  programs: Program[];
  patterns: Pattern[];
  spotlight: Exercise[];
}) {
  const { tr, mode } = useLocale();
  const nextProgram = programs[0];
  const bodies = [
    { id: "chest", href: "/body/chest", label: "Chest", yue: "胸" },
    { id: "back", href: "/body/back", label: "Back", yue: "背" },
    { id: "upper legs", href: "/body/upper-legs", label: "Legs", yue: "腿" },
    { id: "shoulders", href: "/body/shoulders", label: "Shoulders", yue: "膊" },
    { id: "upper arms", href: "/body/upper-arms", label: "Arms", yue: "臂" },
    { id: "waist", href: "/body/waist", label: "Core", yue: "核心" },
  ];

  return (
    <AppShell>
      <div className="af-stack">
        <header className="af-summary-head">
          <div>
            <p className="af-eyebrow">{tr("summary")}</p>
            <h1 className="af-large-title">{tr("forYou")}</h1>
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
            <h2>{tr("startWorkout")}</h2>
            <Link href="/path">{tr("seeAll")}</Link>
          </div>
          <div className="af-tile-stack">
            <WorkoutTile
              large
              href={`/path/${nextProgram.id}`}
              title={nextProgram.title}
              subtitle={nextProgram.tagline}
              meta={`${nextProgram.sessions.length} ${tr("sessions")} · ${nextProgram.equipment}`}
              badge={tr("featured")}
              gradientKey={nextProgram.id}
            />
            {programs.slice(1).map((p) => (
              <WorkoutTile
                key={p.id}
                href={`/path/${p.id}`}
                title={p.title}
                subtitle={p.tagline}
                meta={`${p.sessions.length} ${tr("workoutsCount")} · ${p.level}`}
                badge={p.level}
                gradientKey={p.id}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="af-section-head">
            <h2>{tr("trainerTips")}</h2>
            <Link href="/learn">{tr("seeAll")}</Link>
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
                <span className="af-mini-tile__sub">{tr("formPattern")}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="af-section-head">
            <h2>{tr("byBody")}</h2>
            <Link href="/body">{tr("seeAll")}</Link>
          </div>
          <div className="home-icon-grid">
            {bodies.map((b) => (
              <Link key={b.href} href={b.href} className="home-icon-card">
                <BodyPartIcon bodyPart={b.id} size={72} className="home-icon-card__img" alt="" />
                <span className="home-icon-card__label">
                  {mode === "yue" ? b.yue : mode === "both" ? `${b.label} · ${b.yue}` : b.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="af-section-head">
            <h2>{tr("withDemos")}</h2>
            <Link href="/library">{tr("search")}</Link>
          </div>
          <p className="af-caption">
            {total.toLocaleString()} {tr("moves")} · GIF · {langCount} langs
          </p>
          <div className="af-stack-sm">
            {spotlight.map((ex, i) => (
              <ExerciseCard key={ex.id} exercise={ex} featured={i === 0} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
