"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { AppShell } from "@/components/AppShell";
import { WorkoutClient } from "@/components/WorkoutClient";
import { Reveal } from "@/components/Reveal";
import { useLocale } from "@/lib/locale";
import { filterExercises, getExercisesByIds } from "@/lib/exercises";
import type { Exercise, Session } from "@/lib/types";
import {
  DEFAULT_REPS,
  DEFAULT_REST_SEC,
  DEFAULT_SETS,
  ROUTINE_PROGRAM_ID,
  deleteRoutine,
  estimateMinutes,
  getRoutinesSnapshot,
  newRoutineId,
  routineToSession,
  saveRoutine,
  subscribeRoutines,
  type Routine,
} from "@/lib/routines";

const EMPTY: Routine[] = [];
const emptyRoutines = () => EMPTY;

type View =
  | { kind: "list" }
  | { kind: "edit"; draft: Routine }
  | { kind: "live"; session: Session; exercises: Exercise[] };

/* Drawn icons — one stroke weight, no glyph stand-ins. */
function Icon({ path, label }: { path: string; label: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label={label}
    >
      <path d={path} />
    </svg>
  );
}
const ICON_UP = "M10 15V5M5 10l5-5 5 5";
const ICON_DOWN = "M10 5v10M5 10l5 5 5-5";
const ICON_REMOVE = "M5 5l10 10M15 5L5 15";

export function RoutinesClient() {
  const { tr, mode } = useLocale();
  const routines = useSyncExternalStore(subscribeRoutines, getRoutinesSnapshot, emptyRoutines);
  const [view, setView] = useState<View>({ kind: "list" });
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim();
    if (q.length < 2) return [];
    return filterExercises({ q, limit: 24 });
  }, [query]);

  function startEditing(routine?: Routine) {
    setQuery("");
    setView({
      kind: "edit",
      draft: routine
        ? { ...routine, exercises: routine.exercises.map((e) => ({ ...e })) }
        : { id: newRoutineId(), name: "", exercises: [], updatedAt: Date.now() },
    });
  }

  function start(routine: Routine) {
    const session = routineToSession(routine);
    const exercises = getExercisesByIds(session.exercises.map((e) => e.exerciseId));
    setView({ kind: "live", session, exercises });
  }

  function patchDraft(fn: (d: Routine) => Routine) {
    setView((v) => (v.kind === "edit" ? { kind: "edit", draft: fn(v.draft) } : v));
  }

  // ---------------------------------------------------------------- running
  if (view.kind === "live") {
    return (
      <AppShell title={view.session.title} backHref="/routines">
        <div className="stack-md">
          <button
            type="button"
            className="btn btn-ghost btn-block"
            onClick={() => setView({ kind: "list" })}
          >
            {tr("back")} · {tr("routines")}
          </button>
          <WorkoutClient
            session={view.session}
            exercises={view.exercises}
            programId={ROUTINE_PROGRAM_ID}
          />
        </div>
      </AppShell>
    );
  }

  // ---------------------------------------------------------------- editing
  if (view.kind === "edit") {
    const draft = view.draft;
    const canSave = draft.exercises.length > 0;
    const picked = getExercisesByIds(draft.exercises.map((e) => e.exerciseId));
    const nameOf = (id: string) => picked.find((p) => p.id === id)?.name ?? id;

    return (
      <AppShell title={tr("newRoutine")} backHref="/routines">
        <div className="af-stack">
          <section className="surface routine-card">
            <label className="routine-field">
              <span className="routine-field__label">{tr("routineName")}</span>
              <input
                className="routine-input"
                value={draft.name}
                placeholder={tr("untitledRoutine")}
                maxLength={60}
                onChange={(e) => patchDraft((d) => ({ ...d, name: e.target.value }))}
              />
            </label>
          </section>

          {draft.exercises.length > 0 ? (
            <ol className="routine-move-list">
              {draft.exercises.map((ex, i) => (
                <li key={`${ex.exerciseId}-${i}`} className="surface routine-move">
                  <div className="routine-move__head">
                    <span className="routine-move__name">{nameOf(ex.exerciseId)}</span>
                    <div className="routine-move__actions">
                      <button
                        type="button"
                        className="icon-btn"
                        disabled={i === 0}
                        onClick={() =>
                          patchDraft((d) => {
                            const next = [...d.exercises];
                            [next[i - 1], next[i]] = [next[i], next[i - 1]];
                            return { ...d, exercises: next };
                          })
                        }
                      >
                        <Icon path={ICON_UP} label="Move up" />
                      </button>
                      <button
                        type="button"
                        className="icon-btn"
                        disabled={i === draft.exercises.length - 1}
                        onClick={() =>
                          patchDraft((d) => {
                            const next = [...d.exercises];
                            [next[i], next[i + 1]] = [next[i + 1], next[i]];
                            return { ...d, exercises: next };
                          })
                        }
                      >
                        <Icon path={ICON_DOWN} label="Move down" />
                      </button>
                      <button
                        type="button"
                        className="icon-btn icon-btn--danger"
                        onClick={() =>
                          patchDraft((d) => ({
                            ...d,
                            exercises: d.exercises.filter((_, n) => n !== i),
                          }))
                        }
                      >
                        <Icon path={ICON_REMOVE} label={tr("removeMove")} />
                      </button>
                    </div>
                  </div>

                  <div className="routine-move__grid">
                    <label className="routine-field routine-field--tight">
                      <span className="routine-field__label">{tr("routineSets")}</span>
                      <input
                        className="routine-input"
                        type="number"
                        inputMode="numeric"
                        min={1}
                        max={10}
                        value={ex.sets}
                        onChange={(e) => {
                          const v = Math.min(10, Math.max(1, Math.round(e.target.valueAsNumber || 1)));
                          patchDraft((d) => ({
                            ...d,
                            exercises: d.exercises.map((x, n) => (n === i ? { ...x, sets: v } : x)),
                          }));
                        }}
                      />
                    </label>
                    <label className="routine-field routine-field--tight">
                      <span className="routine-field__label">{tr("repsLabel")}</span>
                      <input
                        className="routine-input"
                        value={ex.reps}
                        maxLength={12}
                        onChange={(e) =>
                          patchDraft((d) => ({
                            ...d,
                            exercises: d.exercises.map((x, n) =>
                              n === i ? { ...x, reps: e.target.value } : x,
                            ),
                          }))
                        }
                      />
                    </label>
                    <label className="routine-field routine-field--tight">
                      <span className="routine-field__label">{tr("restLabel")} (s)</span>
                      <input
                        className="routine-input"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        max={600}
                        step={15}
                        value={ex.restSec}
                        onChange={(e) => {
                          const v = Math.min(600, Math.max(0, Math.round(e.target.valueAsNumber || 0)));
                          patchDraft((d) => ({
                            ...d,
                            exercises: d.exercises.map((x, n) => (n === i ? { ...x, restSec: v } : x)),
                          }));
                        }}
                      />
                    </label>
                  </div>
                </li>
              ))}
            </ol>
          ) : null}

          <section className="surface routine-card">
            <label className="routine-field">
              <span className="routine-field__label">{tr("addMove")}</span>
              <input
                className="routine-input"
                type="search"
                value={query}
                placeholder={mode === "yue" ? "搵動作、肌肉或者器材" : "Search move, muscle or equipment"}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            {results.length > 0 ? (
              <ul className="routine-results">
                {results.map((ex) => (
                  <li key={ex.id}>
                    <button
                      type="button"
                      className="routine-result"
                      onClick={() => {
                        patchDraft((d) => ({
                          ...d,
                          exercises: [
                            ...d.exercises,
                            {
                              exerciseId: ex.id,
                              sets: DEFAULT_SETS,
                              reps: DEFAULT_REPS,
                              restSec: DEFAULT_REST_SEC,
                            },
                          ],
                        }));
                        setQuery("");
                      }}
                    >
                      <span className="routine-result__name">{ex.name}</span>
                      <span className="routine-result__meta">
                        {ex.body_part} · {ex.equipment}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : query.trim().length >= 2 ? (
              <p className="muted routine-note">{tr("noResults")}</p>
            ) : null}
          </section>

          {!canSave ? <p className="muted routine-note">{tr("routineNeedsMove")}</p> : null}

          <div className="stack">
            <button
              type="button"
              className="btn btn-primary btn-block btn-lg"
              disabled={!canSave}
              onClick={() => {
                saveRoutine({
                  ...draft,
                  name: draft.name.trim() || tr("untitledRoutine"),
                });
                setView({ kind: "list" });
              }}
            >
              {tr("saveRoutine")}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-block"
              onClick={() => setView({ kind: "list" })}
            >
              {tr("back")}
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  // ------------------------------------------------------------------- list
  return (
    <AppShell title={tr("routines")} backHref="/">
      <div className="af-stack">
        <div>
          <h1 className="af-large-title" style={{ fontSize: "1.85rem" }}>
            {tr("routines")}
          </h1>
          <p className="muted" style={{ margin: "0.45rem 0 0", fontSize: "0.95rem" }}>
            {tr("routinesBlurb")}
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary btn-block btn-lg"
          onClick={() => startEditing()}
        >
          {tr("newRoutine")}
        </button>

        {routines.length === 0 ? (
          <p className="muted routine-empty">{tr("routinesEmpty")}</p>
        ) : (
          <ul className="routine-list">
            {routines.map((r, i) => (
              <Reveal as="li" key={r.id} delay={i * 60} className="surface routine-summary">
                <div className="routine-summary__copy">
                  <h2 className="routine-summary__name">{r.name}</h2>
                  <p className="routine-summary__meta">
                    {r.exercises.length} {tr("moves")} · ~{estimateMinutes(r)} {tr("min")}
                  </p>
                </div>
                <div className="routine-summary__actions">
                  <button type="button" className="btn btn-primary" onClick={() => start(r)}>
                    {tr("startRoutine")}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => startEditing(r)}>
                    {tr("editRoutine")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost routine-summary__delete"
                    onClick={() => {
                      if (window.confirm(tr("confirmDeleteRoutine"))) deleteRoutine(r.id);
                    }}
                  >
                    {tr("deleteRoutine")}
                  </button>
                </div>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
