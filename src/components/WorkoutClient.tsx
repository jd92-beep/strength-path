"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Exercise, Session } from "@/lib/types";
import { buildLesson } from "@/lib/teaching";
import { applyYueToLesson } from "@/lib/teaching-yue";
import { useLocale } from "@/lib/locale";
import { MediaDemo } from "./MediaDemo";
import { RestRing } from "./RestRing";
import { StepGuide } from "./StepGuide";
import { BilingualList, BilingualText } from "./Bilingual";
import { BodyPartIcon } from "./BodyPartIcon";
import { markSessionComplete } from "@/lib/progress";
import { lastWeightFor, logSet } from "@/lib/log";
import { localizedCoaching, localizedSession, localizedSetNote } from "@/lib/localize";
type Props = {
  session: Session;
  exercises: Exercise[];
  programTitle: string;
  programId: string;
};

export function WorkoutClient({ session, exercises, programId }: Props) {
  const { tr, mode } = useLocale();
  const sessionLoc = localizedSession(programId, session, mode);
  const map = useMemo(() => new Map(exercises.map((e) => [e.id, e])), [exercises]);
  const [index, setIndex] = useState(0);
  const [setIndexNum, setSetIndexNum] = useState(0);
  const [restLeft, setRestLeft] = useState(0);
  const [restTotal, setRestTotal] = useState(0);
  const [done, setDone] = useState(false);
  const [teachOpen, setTeachOpen] = useState(false);
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [weightForId, setWeightForId] = useState<string | null>(null);

  const safeIndex = Math.min(index, Math.max(session.exercises.length - 1, 0));
  const item = session.exercises[safeIndex];
  const exercise = item ? map.get(item.exerciseId) : undefined;
  const lessonEn = useMemo(() => (exercise ? buildLesson(exercise) : null), [exercise]);
  const lessonYue = useMemo(
    () => (lessonEn ? applyYueToLesson(lessonEn) : null),
    [lessonEn],
  );
  const lesson = mode === "yue" ? lessonYue : lessonEn;
  const totalMoves = session.exercises.length;
  const totalSets = item?.sets.length ?? 0;
  const currentSet = totalSets > 0 ? item.sets[Math.min(setIndexNum, totalSets - 1)] : undefined;
  const resting = restLeft > 0;

  const progressPct = done
    ? 100
    : totalMoves === 0
      ? 0
      : Math.round(((safeIndex + (totalSets ? setIndexNum / totalSets : 0)) / totalMoves) * 100);

  // Seed the weight stepper when the exercise changes (adjust-state-during-render pattern)
  if (exercise && weightForId !== exercise.id) {
    setWeightForId(exercise.id);
    setWeightKg(exercise.equipment === "body weight" ? "" : (lastWeightFor(exercise.id) ?? ""));
  }

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
    if (restLeft > 0) setRestLeft(0);

    if (exercise) {
      logSet({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        bodyPart: exercise.body_part,
        sessionId: session.id,
        programId,
        reps: currentSet.reps,
        weightKg: weightKg === "" ? undefined : weightKg,
      });
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
        <p className="display">{tr("missingData")}</p>
        <Link href={`/path/${programId}`} className="btn btn-primary">
          {tr("backToProgram")}
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="hero-panel" style={{ textAlign: "center" }}>
        <p className="chip" style={{ marginBottom: "0.75rem", position: "relative", zIndex: 1 }}>
          {tr("sessionComplete")}
        </p>
        <h2
          className="display"
          style={{ fontSize: "1.7rem", margin: "0 0 0.5rem", position: "relative", zIndex: 1 }}
        >
          {tr("stronger")}
        </h2>
        <div className="stack" style={{ position: "relative", zIndex: 1 }}>
          <Link href={`/path/${programId}`} className="btn btn-primary btn-block btn-lg">
            {tr("backToProgram")}
          </Link>
          <Link href="/learn" className="btn btn-ghost btn-block">
            {tr("studyPatterns")}
          </Link>
        </div>
      </div>
    );
  }

  if (!item || !exercise || !lesson || !lessonEn || !lessonYue || !currentSet) {
    return (
      <div className="surface" style={{ padding: "1.25rem", textAlign: "center" }}>
        <p className="display">{tr("missingData")}</p>
        <Link href={`/path/${programId}`} className="btn btn-ghost btn-block">
          {tr("backToProgram")}
        </Link>
      </div>
    );
  }

  const setLabel =
    mode === "yue"
      ? `${tr("set")} ${setIndexNum + 1}${tr("of")}${totalSets}`
      : mode === "both"
        ? `Set ${setIndexNum + 1}/${totalSets} · 第 ${setIndexNum + 1}/${totalSets} 組`
        : `Set ${setIndexNum + 1} / ${totalSets}`;

  return (
    <div className="stack-md workout-page">
      <div>
        <p className="muted" style={{ margin: "0 0 0.3rem", fontSize: "0.85rem" }}>
          {sessionLoc.title} · {safeIndex + 1}/{totalMoves}
        </p>
        <div style={{ display: "flex", gap: "0.65rem", alignItems: "center", marginBottom: "0.45rem" }}>
          <BodyPartIcon bodyPart={exercise.body_part} size={44} className="workout-bp-icon" />
          <h2 className="display" style={{ margin: 0, fontSize: "1.3rem" }}>
            {exercise.name}
          </h2>
        </div>
        <div className="progress-track" aria-hidden>
          <div className="progress-fill" style={{ transform: `scaleX(${progressPct / 100})` }} />
        </div>
      </div>

      <MediaDemo
        key={exercise.id}
        gifPath={exercise.gif_url}
        imagePath={exercise.image}
        alt={`${exercise.name} form demo`}
        autoPlay={false}
        size="hero"
        caption={tr("photoTap")}
      />

      {restLeft > 0 ? (
        <RestRing total={restTotal || restLeft} left={restLeft} onSkip={() => setRestLeft(0)} />
      ) : null}

      <div className="surface workout-set-panel">
        <div className="workout-set-panel__top">
          <span className="chip set-chip">{setLabel}</span>
          <span className="workout-reps">{currentSet.reps}</span>
        </div>
        {exercise.equipment !== "body weight" ? (
          <div className="log-row">
            <span className="log-row__label">{tr("weight")}</span>
            <div className="log-stepper">
              <button
                type="button"
                className="log-stepper__btn"
                aria-label="−2.5 kg"
                onClick={() =>
                  setWeightKg((w) => Math.max(0, (typeof w === "number" ? w : 0) - 2.5))
                }
              >
                −
              </button>
              <input
                className="log-stepper__input"
                type="number"
                inputMode="decimal"
                min={0}
                step={0.5}
                value={weightKg}
                placeholder="0"
                aria-label={tr("weight")}
                onChange={(e) => {
                  const v = e.target.valueAsNumber;
                  setWeightKg(Number.isFinite(v) ? Math.max(0, v) : "");
                }}
              />
              <button
                type="button"
                className="log-stepper__btn"
                aria-label="+2.5 kg"
                onClick={() => setWeightKg((w) => (typeof w === "number" ? w : 0) + 2.5)}
              >
                +
              </button>
            </div>
            <span className="log-row__label">kg</span>
          </div>
        ) : null}
        {currentSet.note ? (
          <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
            {localizedSetNote(
              programId,
              session.id,
              item.exerciseId,
              setIndexNum,
              currentSet.note,
              mode,
            )}
          </p>
        ) : null}
        <p style={{ margin: 0, fontSize: "0.98rem", lineHeight: 1.45, whiteSpace: "pre-line" }}>
          {localizedCoaching(programId, session.id, item, mode)}
        </p>
        <div className="teach-callout teach-callout--soft" style={{ marginTop: "0.25rem" }}>
          <strong>{tr("feel")}</strong>
          <BilingualText en={lessonEn.feel} yue={lessonYue.feel} as="p" />
        </div>
      </div>

      <div className="workout-dock">
        <button type="button" className="btn btn-primary btn-block btn-lg" onClick={completeSet}>
          {restLeft > 0
            ? tr("skipRestComplete")
            : setIndexNum + 1 < totalSets
              ? tr("completeSet")
              : safeIndex + 1 < totalMoves
                ? tr("nextExercise")
                : tr("finishWorkout")}
        </button>
      </div>

      <div className="surface" style={{ padding: "0.9rem" }}>
        <button
          type="button"
          className="btn btn-ghost btn-block"
          style={{ marginBottom: teachOpen ? "0.85rem" : 0 }}
          onClick={() => setTeachOpen((s) => !s)}
        >
          {teachOpen ? tr("hideCoaching") : tr("openCoaching")}
        </button>
        {teachOpen ? (
          <div className="stack-md">
            <section>
              <h3 className="teach-panel__title">{tr("setup")}</h3>
              <BilingualList enItems={lessonEn.setup} yueItems={lessonYue.setup} ordered />
            </section>
            <section>
              <h3 className="teach-panel__title">{tr("ifFormBreaks")}</h3>
              {(mode === "yue" ? lessonYue.mistakes : lessonEn.mistakes).slice(0, 2).map((m, i) => (
                <div key={m.bad} className="mistake-card" style={{ marginBottom: "0.45rem" }}>
                  <div className="mistake-card__bad">
                    <span>{tr("avoid")}</span>
                    {mode === "both" ? (
                      <p>
                        <span className="bi-en">{lessonEn.mistakes[i]?.bad}</span>
                        <span className="bi-sep" />
                        <span className="bi-yue">{lessonYue.mistakes[i]?.bad}</span>
                      </p>
                    ) : (
                      <p>{m.bad}</p>
                    )}
                  </div>
                  <div className="mistake-card__fix">
                    <span>{tr("doThis")}</span>
                    {mode === "both" ? (
                      <p>
                        <span className="bi-en">{lessonEn.mistakes[i]?.fix}</span>
                        <span className="bi-sep" />
                        <span className="bi-yue">{lessonYue.mistakes[i]?.fix}</span>
                      </p>
                    ) : (
                      <p>{m.fix}</p>
                    )}
                  </div>
                </div>
              ))}
            </section>
            <section>
              <h3 className="teach-panel__title">{tr("steps")}</h3>
              {mode === "both" ? (
                <>
                  <p className="guide-block__label">{tr("guideEn")}</p>
                  <StepGuide steps={exercise.steps} compact />
                </>
              ) : (
                <StepGuide steps={exercise.steps} compact />
              )}
            </section>
            <Link href={`/exercise/${exercise.id}`} className="btn btn-ghost btn-block">
              {tr("fullStudio")}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
