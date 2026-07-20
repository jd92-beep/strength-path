"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { useLocale } from "@/lib/locale";
import {
  clearLog,
  computeStats,
  downloadFile,
  getLogSnapshot,
  groupByDay,
  subscribeLog,
  toCsv,
  type SetLogEntry,
} from "@/lib/log";

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
  const stats = computeStats(entries);
  const days = groupByDay(entries);
  const dateLocale = mode === "en" ? "en-GB" : "zh-HK";

  return (
    <AppShell title={tr("historyTitle")} backHref="/">
      <div className="af-stack">
        <div>
          <p className="af-eyebrow">{tr("history")}</p>
          <h1 className="af-large-title" style={{ fontSize: "1.85rem" }}>
            {tr("historyTitle")}
          </h1>
        </div>

        <div className="stat-grid">
          <div className="stat-card" style={{ ["--c" as string]: "var(--ring-exercise)" }}>
            <strong>{stats.totalSets.toLocaleString()}</strong>
            <span>{tr("loggedSets")}</span>
          </div>
          <div className="stat-card" style={{ ["--c" as string]: "var(--ring-move)" }}>
            <strong>{stats.totalVolumeKg.toLocaleString()}</strong>
            <span>{tr("totalVolume")}</span>
          </div>
          <div className="stat-card" style={{ ["--c" as string]: "var(--ring-stand)" }}>
            <strong>{stats.daysActive.toLocaleString()}</strong>
            <span>{tr("daysActive")}</span>
          </div>
        </div>

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
                {d.sets.map((s, i) => (
                  <Link
                    key={`${s.ts}-${i}`}
                    href={`/exercise/${s.exerciseId}`}
                    className="hist-set"
                  >
                    <span className="hist-set__name">{s.exerciseName}</span>
                    <span className="hist-set__data">
                      {s.reps}
                      {typeof s.weightKg === "number" ? ` · ${s.weightKg} kg` : ""}
                    </span>
                  </Link>
                ))}
              </section>
            ))}
          </div>
        )}

        <section className="af-stack-sm">
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
              style={entries.length === 0 ? { opacity: 0.5, cursor: "default" } : undefined}
              onClick={() => downloadFile("strength-path-log.csv", "text/csv", toCsv(entries))}
            >
              {tr("exportCsv")}
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              disabled={entries.length === 0}
              style={entries.length === 0 ? { opacity: 0.5, cursor: "default" } : undefined}
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
        </section>

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
