"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { AppShell } from "@/components/AppShell";
import { computeStats, getLogSnapshot, subscribeLog, type SetLogEntry } from "@/lib/log";
import { getProgressSnapshot, subscribeProgress, type ProgressState } from "@/lib/progress";
import { resolveNextSession } from "@/lib/path-resume";
import { SummaryRings } from "@/components/SummaryRings";
import { ExerciseCard } from "@/components/ExerciseCard";
import { WorkoutTile } from "@/components/WorkoutTile";
import { BodyPartIcon } from "@/components/BodyPartIcon";
import { ScrollRail } from "@/components/ScrollRail";
import type { Exercise } from "@/lib/types";
import type { Program } from "@/lib/types";
import { useLocale } from "@/lib/locale";
import { localizedPattern, localizedProgram, localizedSession, stageBadge } from "@/lib/localize";
import type { MovementPattern } from "@/lib/teaching";
import {
  equipmentHref,
  equipmentImageSrc,
  labelEquipment,
  type EquipmentCategory,
} from "@/lib/equipment";

type Pattern = { id: string; label: string; skillFocus: string; color: string };
type MachineItem = EquipmentCategory & { count: number };

const EMPTY_LOG: SetLogEntry[] = [];
const EMPTY_PROGRESS: ProgressState = { completedSessions: [], completedExercises: [] };
const emptyLog = () => EMPTY_LOG;
const emptyProgress = () => EMPTY_PROGRESS;

export function HomeClient({
  total,
  langCount,
  programs,
  patterns,
  machines,
  spotlight,
}: {
  total: number;
  langCount: number;
  programs: Program[];
  patterns: Pattern[];
  machines: MachineItem[];
  spotlight: Exercise[];
}) {
  const { tr, mode } = useLocale();
  const log = useSyncExternalStore(subscribeLog, getLogSnapshot, emptyLog);
  const progress = useSyncExternalStore(subscribeProgress, getProgressSnapshot, emptyProgress);
  const stats = computeStats(log);
  const next = useMemo(() => resolveNextSession(progress, programs), [progress, programs]);
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

        <section className="hero-chips" aria-label={tr("summary")}>
          <Link href="/path" className="hero-chip" style={{ ["--c" as string]: "var(--ring-move)" }}>
            <strong>{progress.completedSessions.length}</strong> {tr("sessions")}
          </Link>
          <Link href="/history" className="hero-chip" style={{ ["--c" as string]: "var(--ring-exercise)" }}>
            <strong>{stats.totalSets}</strong> {tr("loggedSets").toLowerCase()}
          </Link>
          <Link href="/history" className="hero-chip" style={{ ["--c" as string]: "var(--ring-stand)" }}>
            <strong>{stats.daysActive}</strong> {tr("daysActive").toLowerCase()}
          </Link>
        </section>

        {next ? (
          <section className="resume-rail" aria-label={tr("trainToday")}>
            <div className="resume-rail__copy">
              <p className="af-eyebrow">{tr("trainToday")}</p>
              <h2 className="resume-rail__title">
                {localizedSession(next.program.id, next.session, mode).title}
              </h2>
              <p className="resume-rail__meta">
                {localizedProgram(next.program, mode).title}
                {" · "}
                {next.session.durationMin} {tr("min")}
                {" · "}
                {next.kind === "start"
                  ? tr("startPath")
                  : next.kind === "repeat"
                    ? tr("repeatSession")
                    : tr("continueSession")}
              </p>
            </div>
            <div className="resume-rail__actions">
              <Link
                href={`/workout/${next.session.id}`}
                className="btn btn-primary btn-lg"
                style={{ borderRadius: "999px" }}
              >
                {tr("letsGo")}
              </Link>
              <Link href="/quick" className="btn btn-ghost">
                {tr("quickSession")}
              </Link>
            </div>
          </section>
        ) : null}

        <section>
          <div className="af-section-head">
            <h2>{tr("startWorkout")}</h2>
            <Link href="/path">{tr("seeAll")}</Link>
          </div>
          <div className="af-tile-stack">
            {programs.map((prog, i) => {
              const p = localizedProgram(prog, mode);
              return (
                <WorkoutTile
                  key={prog.id}
                  large={i === 0}
                  href={`/path/${prog.id}`}
                  title={p.title}
                  subtitle={p.tagline}
                  meta={`${prog.sessions.length} ${tr("sessions")} · ${p.equipment}`}
                  badge={i === 0 ? tr("featured") : stageBadge(i, prog.level, mode)}
                  accent={prog.color}
                  stage={i + 1}
                />
              );
            })}
          </div>
        </section>

        <section>
          <div className="af-section-head">
            <h2>{tr("byMachine")}</h2>
            <Link href="/equipment">{tr("seeAll")}</Link>
          </div>
          <p className="af-caption" style={{ marginTop: "-0.15rem", marginBottom: "0.55rem" }}>
            {mode === "yue"
              ? "揀你面前嘅器材，睇示範學動作。"
              : mode === "both"
                ? "Pick a machine. 揀器材學示範。"
                : "Pick a machine type and learn the demos for it."}
          </p>
          <ScrollRail role="list">
            {machines.map((m) => (
              <Link
                key={m.id}
                href={equipmentHref(m.id)}
                className="af-mini-tile af-mini-tile--machine"
                style={{ ["--g" as string]: m.color }}
                role="listitem"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={equipmentImageSrc(m.slug)}
                  alt={labelEquipment(m, "en")}
                  className="af-mini-tile__photo"
                  width={168}
                  height={168}
                  loading="lazy"
                  decoding="async"
                />
                <span className="af-mini-tile__body">
                  <span className="af-mini-tile__kicker">{tr("machineType")}</span>
                  <span className="af-mini-tile__label">{labelEquipment(m, mode)}</span>
                  <span className="af-mini-tile__sub">
                    {m.count} {tr("moves")}
                  </span>
                </span>
              </Link>
            ))}
          </ScrollRail>
        </section>

        <section>
          <div className="af-section-head">
            <h2>{tr("trainerTips")}</h2>
            <Link href="/learn">{tr("seeAll")}</Link>
          </div>
          <ScrollRail>
            {patterns.map((p) => {
              const loc = localizedPattern(
                p.id as MovementPattern,
                p.label,
                p.skillFocus,
                mode,
              );
              return (
                <Link
                  key={p.id}
                  href={`/learn/${p.id}`}
                  className="af-mini-tile"
                  style={{ ["--g" as string]: p.color }}
                >
                  <span className="af-mini-tile__label">{loc.label}</span>
                  <span className="af-mini-tile__sub">{tr("formPattern")}</span>
                </Link>
              );
            })}
          </ScrollRail>
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
            {total.toLocaleString()} {tr("moves")} · GIF · {langCount} {tr("demoLangs")}
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
