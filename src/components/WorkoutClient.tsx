"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Exercise, Session } from "@/lib/types";
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
  const [showSteps, setShowSteps] = useState(false);

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

  function startRest(sec: number) {
    setRestTotal(sec);
    setRestLeft(sec);
  }

  function completeSet() {
    if (!item) return;
    if (setIndexNum + 1 < item.sets.length) {
      setSetIndexNum((s) => s + 1);
      startRest(item.restSec);
      return;
    }
    if (index + 1 < session.exercises.length) {
      setIndex((i) => i + 1);
      setSetIndexNum(0);
      startRest(25);
      setShowSteps(false);
      return;
    }
    setDone(true);
    markSessionComplete(session.id);
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
          You finished {session.title}. Rest well, then keep climbing the path.
        </p>
        <div className="stack" style={{ position: "relative", zIndex: 1 }}>
          <Link href={`/path/${programId}`} className="btn btn-primary btn-block btn-lg">
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
    <div className="stack-md">
      <div>
        <p className="muted" style={{ margin: "0 0 0.3rem", fontSize: "0.85rem" }}>
          {programTitle} · Move {index + 1} of {totalMoves}
        </p>
        <h2 className="display" style={{ margin: "0 0 0.65rem", fontSize: "1.4rem" }}>
          {exercise.name}
        </h2>
        <div className="progress-track" aria-hidden>
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="faint" style={{ margin: "0.4rem 0 0", fontSize: "0.78rem" }}>
          {progressPct}% complete · targets {exercise.target}
        </p>
      </div>

      <MediaDemo
        key={exercise.id}
        gifPath={exercise.gif_url}
        imagePath={exercise.image}
        alt={`${exercise.name} form demo`}
        autoPlay
        size="hero"
        caption="Watch once, then match the form. Pause anytime."
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
      </div>

      <div className="workout-dock">
        <button type="button" className="btn btn-primary btn-block btn-lg" onClick={completeSet}>
          {setIndexNum + 1 < totalSets
            ? "Complete set · start rest"
            : index + 1 < totalMoves
              ? "Next exercise"
              : "Finish workout"}
        </button>
      </div>

      <div className="surface" style={{ padding: "0.9rem" }}>
        <button
          type="button"
          className="btn btn-ghost btn-block"
          style={{ marginBottom: showSteps ? "0.85rem" : 0 }}
          onClick={() => setShowSteps((s) => !s)}
        >
          {showSteps ? "Hide teaching steps" : "Show teaching steps"}
        </button>
        {showSteps ? <StepGuide steps={exercise.steps} compact /> : null}
      </div>

      <p className="faint" style={{ fontSize: "0.75rem", margin: 0, textAlign: "center" }}>
        Media © Gym visual · {exercise.equipment}
      </p>
    </div>
  );
}
