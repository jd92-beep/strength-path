"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { AnimatedNumber } from "@/components/AnimatedNumber";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/locale";
import {
  clearLog,
  computePersonalRecords,
  computeStats,
  downloadFile,
  getLogSnapshot,
  groupByDay,
  subscribeLog,
  toCsv,
  weeklyVolume,
  type SetLogEntry,
} from "@/lib/log";
import { estimate1RM, parseRepRange } from "@/lib/progression";
import { getExercise } from "@/lib/exercises";

const HEALTH_APPS = [
  { name: "Apple Health", color: "var(--ring-move)" },
  { name: "Google Health · Health Connect", color: "var(--ring-stand)" },
  { name: "Samsung Health", color: "var(--ring-exercise)" },
  { name: "OnePlus Health / Honor Health", color: "var(--violet)" },
];

function emptyServerSnapshot(): SetLogEntry[] {
  return EMPTY;
}
const EMPTY: SetLogEntry[] = [];

export function HistoryClient() {
  const { tr, mode } = useLocale();
  const entries = useSyncExternalStore(subscribeLog, getLogSnapshot, emptyServerSnapshot);
  const dateLocale = mode === "en" ? "en-GB" : "zh-HK";
  const stats = computeStats(entries);
  const days = groupByDay(entries);
  const prs = useMemo(() => computePersonalRecords(entries, 10), [entries]);
  const weeks = useMemo(() => weeklyVolume(entries, 8, dateLocale), [entries, dateLocale]);
  const maxVol = Math.max(1, ...weeks.map((w) => w.volumeKg));

  return (
    <AppShell title={tr("historyTitle")} backHref="/">
      <div className="af-stack">
        <div>
          <p className="af-eyebrow">{tr("history")}</p>
          <h1 className="af-large-title" style={{ fontSize: "1.85rem" }}>
            {tr("historyTitle")}
          </h1>
        </div>

        <Reveal delay={80}>
          <div className="stat-grid">
            <div className="stat-card" style={{ ["--c" as string]: "var(--ring-exercise)" }}>
              <strong>
                <AnimatedNumber value={stats.totalSets} format={(n) => Math.round(n).toLocaleString()} />
              </strong>
              <span>{tr("loggedSets")}</span>
            </div>
            <div className="stat-card" style={{ ["--c" as string]: "var(--ring-move)" }}>
              <strong>
                <AnimatedNumber
                  value={stats.totalVolumeKg}
                  format={(n) => Math.round(n).toLocaleString()}
                />
              </strong>
              <span>{tr("totalVolume")}</span>
            </div>
            <div className="stat-card" style={{ ["--c" as string]: "var(--ring-stand)" }}>
              <strong>
                <AnimatedNumber value={stats.daysActive} format={(n) => Math.round(n).toLocaleString()} />
              </strong>
              <span>{tr("daysActive")}</span>
            </div>
          </div>
        </Reveal>

        {weeks.some((w) => w.sets > 0) ? (
          <Reveal as="section" delay={160} className="surface chart-card">
            <h2 className="chart-card__title">{tr("weeklyVolume")}</h2>
            <div className="vol-chart" role="img" aria-label={tr("weeklyVolume")}>
              {weeks.map((w) => (
                <div key={w.week} className="vol-chart__col">
                  <div className="vol-chart__bar-wrap">
                    <div
                      className="vol-chart__bar"
                      style={{ height: `${Math.max(4, (w.volumeKg / maxVol) * 100)}%` }}
                      title={`${w.volumeKg} kg · ${w.sets} sets`}
                    />
                  </div>
                  <span className="vol-chart__label">{w.label}</span>
                  <span className="vol-chart__val">{w.volumeKg || "–"}</span>
                </div>
              ))}
            </div>
          </Reveal>
        ) : null}

        <Reveal as="section" delay={240} className="surface chart-card">
          <h2 className="chart-card__title">{tr("personalRecords")}</h2>
          {prs.length === 0 ? (
            <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
              {tr("noPrsYet")}
            </p>
          ) : (
            <ul className="pr-list">
              {prs.map((pr) => {
                const row = (
                  <>
                    <span className="pr-row__name">{pr.exerciseName}</span>
                    <span className="pr-row__data">
                      <strong>{pr.bestWeightKg} kg</strong>
                      <span className="muted">
                        {" "}· {pr.repsAtBest} ({tr("est1RM")} ~{estimate1RM(pr.bestWeightKg, parseRepRange(pr.repsAtBest).min || 1)} kg)
                      </span>
                    </span>
                  </>
                );
                return (
                  <li key={pr.exerciseId}>
                    {/* Dataset IDs can be renamed/removed — dead links 404 with dynamicParams=false */}
                    {getExercise(pr.exerciseId) ? (
                      <Link href={`/exercise/${pr.exerciseId}`} className="pr-row">
                        {row}
                      </Link>
                    ) : (
                      <div className="pr-row">{row}</div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </Reveal>

        {days.length === 0 ? (
          <div className="hist-empty">
            <p className="display" style={{ margin: 0 }}>
              {tr("historyEmpty")}
            </p>
            <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
              {tr("historyEmptyCta")}
            </p>
            <Link href="/path" className="btn btn-primary" style={{ marginTop: "0.35rem" }}>
              {tr("startWorkout")}
            </Link>
          </div>
        ) : (
          <div className="af-stack-sm">
            {days.map((d) => (
              <section key={d.day} className="hist-day">
                <div className="hist-day__head">
                  <span className="hist-day__date">
                    {new Date(d.ts).toLocaleDateString(dateLocale, {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                  <span className="hist-day__meta">
                    {d.sets.length} {tr("set").toLowerCase()}
                  </span>
                </div>
                {d.sets.map((s, i) => {
                  const data = (
                    <>
                      <span className="hist-set__name">{s.exerciseName}</span>
                      <span className="hist-set__data">
                        {s.reps}
                        {typeof s.weightKg === "number" ? ` · ${s.weightKg} kg` : ""}
                        {s.rpe ? ` · ${s.rpe}` : ""}
                      </span>
                    </>
                  );
                  return getExercise(s.exerciseId) ? (
                    <Link
                      key={`${s.ts}-${i}`}
                      href={`/exercise/${s.exerciseId}`}
                      className="hist-set"
                    >
                      {data}
                    </Link>
                  ) : (
                    <div key={`${s.ts}-${i}`} className="hist-set">
                      {data}
                    </div>
                  );
                })}
              </section>
            ))}
          </div>
        )}

        <Reveal as="section" delay={120} className="af-stack-sm">
          <h2 style={{ margin: 0, fontSize: "1.2rem" }}>{tr("healthSync")}</h2>
          <p className="muted" style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.5 }}>
            {tr("healthSyncBlurb")}
          </p>
          <div className="af-stack-sm">
            {HEALTH_APPS.map((h) => (
              <div key={h.name} className="sync-card">
                <p className="sync-card__title">
                  <span className="af-dot" style={{ background: h.color }} />
                  {h.name}
                </p>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.55rem", flexWrap: "wrap" }}>
            <button
              type="button"
              className="btn btn-primary"
              disabled={entries.length === 0}
              onClick={() => downloadFile("strength-path-log.csv", "text/csv", toCsv(entries))}
            >
              {tr("exportCsv")}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={entries.length === 0}
              onClick={() =>
                downloadFile(
                  "strength-path-log.json",
                  "application/json",
                  JSON.stringify(entries, null, 2),
                )
              }
            >
              {tr("exportJson")}
            </button>
          </div>
        </Reveal>

        {entries.length > 0 ? (
          <button
            type="button"
            className="btn btn-ghost btn-block"
            style={{ color: "var(--danger)" }}
            onClick={() => {
              if (window.confirm(tr("clearHistoryConfirm"))) clearLog();
            }}
          >
            {tr("clearHistory")}
          </button>
        ) : null}
      </div>
    </AppShell>
  );
}
