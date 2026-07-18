"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Exercise, Session } from "@/lib/types";
import { gifUrl } from "@/lib/media";
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
  const [done, setDone] = useState(false);
  const [showSteps, setShowSteps] = useState(true);

  const item = session.exercises[index];
  const exercise = item ? map.get(item.exerciseId) : undefined;
  const totalMoves = session.exercises.length;
  const totalSets = item?.sets.length ?? 0;
  const progressPct = done
    ? 100
    : Math.round(((index + setIndexNum / Math.max(totalSets, 1)) / totalMoves) * 100);

  useEffect(() => {
    if (restLeft <= 0) return;
    const t = setInterval(() => setRestLeft((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [restLeft]);

  function completeSet() {
    if (!item) return;
    if (setIndexNum + 1 < item.sets.length) {
      setSetIndexNum((s) => s + 1);
      setRestLeft(item.restSec);
      return;
    }
    if (index + 1 < session.exercises.length) {
      setIndex((i) => i + 1);
      setSetIndexNum(0);
      setRestLeft(session.exercises[index + 1]?.restSec ? 20 : 0);
      setShowSteps(true);
      return;
    }
    setDone(true);
    markSessionComplete(session.id);
  }

  if (done) {
    return (
      <div className="hero-panel" style={{ textAlign: "center" }}>
        <p className="chip" style={{ marginBottom: "0.75rem" }}>
          Session complete
        </p>
        <h2 className="display" style={{ fontSize: "1.6rem", margin: "0 0 0.5rem" }}>
          Stronger than yesterday
        </h2>
        <p className="muted" style={{ marginBottom: "1.25rem" }}>
          You finished {session.title}. Rest well, then keep climbing the path.
        </p>
        <div style={{ display: "grid", gap: "0.65rem" }}>
          <Link href={`/path/${programId}`} className="btn btn-primary btn-block">
            Back to program
          </Link>
          <Link href="/body" className="btn btn-ghost btn-block">
            Train a body part
          </Link>
        </div>
      </div>
    );
  }

  if (!item || !exercise) {
    return <p className="muted">Exercise data missing for this session.</p>;
  }

  const currentSet = item.sets[setIndexNum];

  return (
    <div style={{ display: "grid", gap: "1rem" }}>
      <div>
        <p className="muted" style={{ margin: "0 0 0.25rem", fontSize: "0.85rem" }}>
          {programTitle} · Move {index + 1}/{totalMoves}
        </p>
        <h2 className="display" style={{ margin: "0 0 0.5rem", fontSize: "1.35rem" }}>
          {exercise.name}
        </h2>
        <div className="progress-track" aria-hidden>
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="exercise-media">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={gifUrl(exercise.gif_url)} alt={`${exercise.name} demonstration`} />
      </div>

      <div className="surface" style={{ padding: "1rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "0.75rem",
            marginBottom: "0.5rem",
          }}
        >
          <span className="chip">
            Set {setIndexNum + 1}/{totalSets}
          </span>
          <span className="display" style={{ fontSize: "1.5rem", color: "var(--primary)" }}>
            {currentSet.reps}
          </span>
        </div>
        {currentSet.note ? (
          <p className="muted" style={{ margin: "0 0 0.65rem", fontSize: "0.9rem" }}>
            {currentSet.note}
          </p>
        ) : null}
        <p style={{ margin: 0, fontSize: "0.95rem" }}>{item.coaching}</p>
      </div>

      {restLeft > 0 ? (
        <div
          className="surface-soft"
          style={{
            padding: "0.9rem 1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span className="muted">Rest</span>
          <span className="display" style={{ fontSize: "1.4rem" }}>
            {restLeft}s
          </span>
          <button type="button" className="btn btn-ghost" onClick={() => setRestLeft(0)}>
            Skip
          </button>
        </div>
      ) : null}

      <button type="button" className="btn btn-primary btn-block" onClick={completeSet}>
        {setIndexNum + 1 < totalSets
          ? "Complete set → rest"
          : index + 1 < totalMoves
            ? "Next exercise"
            : "Finish workout"}
      </button>

      <div className="surface" style={{ padding: "1rem" }}>
        <button
          type="button"
          className="btn btn-ghost btn-block"
          style={{ marginBottom: showSteps ? "0.85rem" : 0 }}
          onClick={() => setShowSteps((s) => !s)}
        >
          {showSteps ? "Hide teaching steps" : "Show teaching steps"}
        </button>
        {showSteps ? <StepGuide steps={exercise.steps} /> : null}
      </div>

      <p className="faint" style={{ fontSize: "0.75rem", margin: 0 }}>
        Media © Gym visual · {exercise.equipment} · targets {exercise.target}
      </p>
    </div>
  );
}
