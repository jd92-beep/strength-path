"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Exercise, Session } from "@/lib/types";
import { buildLesson } from "@/lib/teaching";
import { MediaDemo } from "./MediaDemo";
import { RestRing } from "./RestRing";
import { StepGuide } from "./StepGuide";
import { markSessionComplete } from "@/lib/progress";

type Props = {
  session: Session;
  exercises: Exercise[];
  programTitle: string;
  programId: string;
};

export function WorkoutClient({ session, exercises, programTitle, programId }: Props) {
  const map = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises]);
  const [index, setIndex] = useState(0);
  const [setIndexNum, setSetIndexNum] = useState(0);
  const [restLeft, setRestLeft] = useState(0);
  const [restTotal, setRestTotal] = useState(0);
  const [done, setDone] = useState(false);
  const [teachOpen, setTeachOpen] = useState(false);

  const safeIndex = Math.min(index, Math.max(session.exercises.length - 1, 0));
  const item = session.exercises[safeIndex];
  const exercise = item ? map.get(item.exerciseId) : undefined;
  const lesson = useMemo(() => (exercise ? buildLesson(exercise) : null), [exercise]);
  const totalMoves = session.exercises.length;
  const totalSets = item?.sets.length ?? 0;
  const currentSet = totalSets > 0 ? item.sets[Math.min(setIndexNum, totalSets - 1)] : undefined;
  const resting = restLeft > 0;

  const progressPct = done
    ? 100
    : totalMoves === 0
      ? 0
      : Math.round(((safeIndex + (totalSets ? setIndexNum / totalSets : 0)) / totalMoves) * 100);

  // Stable timer: only re-bind when a rest period starts/stops, not every second.
  useEffect(() => {
    if (!resting) return;
    const t = setInterval(() => {
      setRestLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [resting, restTotal]);

  function startRest(sec: number) {
    const safe = Math.max(0, Math.floor(sec));
    setRestTotal(safe);
    setRestLeft(safe);
  }

  function completeSet() {
    if (!item || !currentSet) return;

    // Completing during rest skips remaining rest first.
    if (restLeft > 0) {
      setRestLeft(0);
    }

    if (setIndexNum + 1 < item.sets.length) {
      setSetIndexNum((s) => s + 1);
      startRest(item.restSec);
      return;
    }
    if (safeIndex + 1 < session.exercises.length) {
      setIndex(safeIndex + 1);
      setSetIndexNum(0);
      startRest(25);
      setTeachOpen(false);
      return;
    }
    setDone(true);
    markSessionComplete(session.id, programId);
  }

  if (!session.exercises.length) {
    return (
      <div className="surface" style={{ padding: "1.25rem", textAlign: "center" }}>
        <p className="display" style={{ margin: "0 0 0.5rem" }}>
          Empty workout
        </p>
        <p className="muted" style={{ margin: "0 0 1rem" }}>
          This session has no exercises configured.
        </p>
        <Link href={`/path/${programId}`} className="btn btn-primary">
          Back to program
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="hero-panel" style={{ textAlign: "center" }}>
        <p className="chip" style={{ marginBottom: "0.75rem", position: "relative", zIndex: 1 }}>
          Session complete
        </p>
        <h2
          className="display"
          style={{ fontSize: "1.7rem", margin: "0 0 0.5rem", position: "relative", zIndex: 1 }}
        >
          Stronger than yesterday
        </h2>
        <p className="muted" style={{ marginBottom: "1.25rem", position: "relative", zIndex: 1 }}>
          You finished {session.title}. Review form on Learn when you recover.
        </p>
        <div className="stack" style={{ position: "relative", zIndex: 1 }}>
          <Link href={`/path/${programId}`} className="btn btn-primary btn-block btn-lg">
            Back to program
          </Link>
          <Link href="/learn" className="btn btn-ghost btn-block">
            Study patterns
          </Link>
        </div>
      </div>
    );
  }

  if (!item || !exercise || !lesson || !currentSet) {
    return (
      <div className="surface" style={{ padding: "1.25rem", textAlign: "center" }}>
        <p className="display" style={{ margin: "0 0 0.5rem" }}>
          Missing exercise data
        </p>
        <p className="muted" style={{ margin: "0 0 1rem" }}>
          Could not load move {safeIndex + 1}
          {item ? ` (${item.exerciseId})` : ""}. Skip to the next session or program.
        </p>
        <div className="stack">
          {safeIndex + 1 < totalMoves ? (
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={() => {
                setIndex(safeIndex + 1);
                setSetIndexNum(0);
                setRestLeft(0);
              }}
            >
              Skip to next move
            </button>
          ) : null}
          <Link href={`/path/${programId}`} className="btn btn-ghost btn-block">
            Back to program
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="stack-md">
      <div>
        <p className="muted" style={{ margin: "0 0 0.3rem", fontSize: "0.85rem" }}>
          {programTitle} · Move {safeIndex + 1} of {totalMoves}
        </p>
        <h2 className="display" style={{ margin: "0 0 0.45rem", fontSize: "1.35rem" }}>
          {exercise.name}
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginBottom: "0.65rem" }}>
          <Link href={`/learn/${lesson.pattern}`} className="chip chip-accent">
            {lesson.patternLabel}
          </Link>
          <span className="chip">{lesson.tempo}</span>
        </div>
        <div className="progress-track" aria-hidden>
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <MediaDemo
        key={exercise.id}
        gifPath={exercise.gif_url}
        imagePath={exercise.image}
        alt={`${exercise.name} form demo`}
        autoPlay
        size="hero"
        caption="Match the demo shape before adding speed."
      />

      {restLeft > 0 ? (
        <RestRing total={restTotal || restLeft} left={restLeft} onSkip={() => setRestLeft(0)} />
      ) : null}

      <div className="surface workout-set-panel">
        <div className="workout-set-panel__top">
          <span className="chip">
            Set {setIndexNum + 1} / {totalSets}
          </span>
          <span className="workout-reps">{currentSet.reps}</span>
        </div>
        {currentSet.note ? (
          <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
            {currentSet.note}
          </p>
        ) : null}
        <p style={{ margin: 0, fontSize: "0.98rem", lineHeight: 1.45 }}>{item.coaching}</p>
        <div className="teach-callout teach-callout--soft" style={{ marginTop: "0.25rem" }}>
          <strong>Feel</strong>
          <p>{lesson.feel}</p>
        </div>
      </div>

      <div className="workout-dock">
        <button type="button" className="btn btn-primary btn-block btn-lg" onClick={completeSet}>
          {restLeft > 0
            ? "Skip rest · complete set"
            : setIndexNum + 1 < totalSets
              ? "Complete set · start rest"
              : safeIndex + 1 < totalMoves
                ? "Next exercise"
                : "Finish workout"}
        </button>
      </div>

      <div className="surface" style={{ padding: "0.9rem" }}>
        <button
          type="button"
          className="btn btn-ghost btn-block"
          style={{ marginBottom: teachOpen ? "0.85rem" : 0 }}
          onClick={() => setTeachOpen((s) => !s)}
        >
          {teachOpen ? "Hide coaching" : "Open coaching (cues · fixes · steps)"}
        </button>
        {teachOpen ? (
          <div className="stack-md">
            <section>
              <h3 className="teach-panel__title">Setup</h3>
              <ol className="teach-numbered">
                {lesson.setup.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </section>
            <section>
              <h3 className="teach-panel__title">If form breaks</h3>
              {lesson.mistakes.slice(0, 2).map((m) => (
                <div key={m.bad} className="mistake-card" style={{ marginBottom: "0.45rem" }}>
                  <div className="mistake-card__bad">
                    <span>Avoid</span>
                    <p>{m.bad}</p>
                  </div>
                  <div className="mistake-card__fix">
                    <span>Do this</span>
                    <p>{m.fix}</p>
                  </div>
                </div>
              ))}
            </section>
            <section>
              <h3 className="teach-panel__title">Steps</h3>
              <StepGuide steps={exercise.steps} compact />
            </section>
            <Link href={`/exercise/${exercise.id}`} className="btn btn-ghost btn-block">
              Full form studio →
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
