"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { WorkoutClient } from "@/components/WorkoutClient";
import { useLocale } from "@/lib/locale";
import { patternCatalog, type MovementPattern } from "@/lib/teaching";
import { localizedPattern } from "@/lib/localize";
import {
  buildQuickSession,
  QUICK_SLOT_PATTERNS,
} from "@/lib/quick-session";
import type { Exercise, Session } from "@/lib/types";

type Equip = "any" | "body weight" | "dumbbell";

export function QuickSessionClient() {
  const { tr, mode } = useLocale();
  const catalog = patternCatalog();
  const [selected, setSelected] = useState<MovementPattern[]>(() => [...QUICK_SLOT_PATTERNS.slice(0, 5)]);
  const [equipment, setEquipment] = useState<Equip>("any");
  const [live, setLive] = useState<{ session: Session; exercises: Exercise[] } | null>(null);

  const preview = useMemo(() => {
    if (selected.length < 2) return null;
    return buildQuickSession({ patterns: selected, equipment });
  }, [selected, equipment]);

  function toggle(p: MovementPattern) {
    setSelected((cur) => {
      if (cur.includes(p)) return cur.filter((x) => x !== p);
      if (cur.length >= 6) return cur;
      return [...cur, p];
    });
  }

  if (live) {
    return (
      <AppShell title={tr("quickSession")} backHref="/">
        <div className="stack-md">
          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={() => setLive(null)}
          >
            {tr("back")} · {tr("buildSession")}
          </button>
          <WorkoutClient
            session={live.session}
            exercises={live.exercises}
            programTitle={tr("quickSession")}
            programId="quick"
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title={tr("quickSession")} backHref="/">
      <div className="af-stack">
        <div>
          <p className="af-eyebrow">{tr("buildSession")}</p>
          <h1 className="af-large-title" style={{ fontSize: "1.85rem" }}>
            {tr("quickSession")}
          </h1>
          <p className="muted" style={{ margin: "0.45rem 0 0", fontSize: "0.95rem" }}>
            {tr("quickSessionBlurb")}
          </p>
        </div>

        <section className="surface" style={{ padding: "1rem", borderRadius: "18px" }}>
          <p className="teach-panel__title" style={{ marginBottom: "0.65rem" }}>
            {tr("equipment")}
          </p>
          <div className="rpe-pills">
            {(
              [
                ["any", "equipmentAny"],
                ["body weight", "equipmentBw"],
                ["dumbbell", "equipmentDb"],
              ] as const
            ).map(([id, key]) => (
              <button
                key={id}
                type="button"
                className="rpe-pill"
                data-active={equipment === id}
                onClick={() => setEquipment(id)}
              >
                {tr(key)}
              </button>
            ))}
          </div>
        </section>

        <section className="surface" style={{ padding: "1rem", borderRadius: "18px" }}>
          <p className="teach-panel__title" style={{ marginBottom: "0.65rem" }}>
            {tr("pickPatterns")} · {selected.length}/6
          </p>
          <div className="quick-pattern-grid">
            {catalog.map((p) => {
              const loc = localizedPattern(p.id, p.label, p.skillFocus, mode);
              const on = selected.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  className="quick-pattern"
                  data-active={on}
                  style={{ ["--g" as string]: p.color }}
                  onClick={() => toggle(p.id)}
                >
                  <span className="quick-pattern__label">{loc.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {preview && preview.session.exercises.length >= 2 ? (
          <section className="surface" style={{ padding: "1rem", borderRadius: "18px" }}>
            <p className="muted" style={{ margin: "0 0 0.55rem", fontSize: "0.88rem" }}>
              {preview.session.exercises.length} {tr("moves")} · ~{preview.session.durationMin}{" "}
              {tr("min")}
            </p>
            <ol className="quick-preview">
              {preview.exercises.map((ex) => (
                <li key={ex.id}>
                  <strong>{ex.name}</strong>
                  <span className="muted"> · {ex.equipment}</span>
                </li>
              ))}
            </ol>
            <button
              type="button"
              className="btn btn-primary btn-block btn-lg"
              style={{ marginTop: "0.85rem" }}
              onClick={() => setLive(preview)}
            >
              {tr("startQuick")}
            </button>
          </section>
        ) : (
          <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
            {mode === "yue" ? "最少揀兩個動作模式。" : "Pick at least two patterns."}
          </p>
        )}
      </div>
    </AppShell>
  );
}
