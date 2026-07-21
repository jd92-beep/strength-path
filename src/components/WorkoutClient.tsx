"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Exercise, Session, WorkoutExercise } from "@/lib/types";
import { buildLesson } from "@/lib/teaching";
import { applyYueToLesson } from "@/lib/teaching-yue";
import { useLocale } from "@/lib/locale";
import { MediaDemo } from "./MediaDemo";
import { RestRing } from "./RestRing";
import { StepGuide } from "./StepGuide";
import { BilingualList, BilingualText } from "./Bilingual";
import { BodyPartIcon } from "./BodyPartIcon";
import { markSessionComplete } from "@/lib/progress";
import { lastWeightFor, logSet, type SetRpe } from "@/lib/log";
import { localizedCoaching, localizedSession, localizedSetNote } from "@/lib/localize";
import { findSubstitutes } from "@/lib/substitutions";
import {
  estimate1RM,
  parseRepRange,
  restForRpe,
  sessionProgressionNotes,
  suggestWeightKg,
} from "@/lib/progression";
import { getExercise } from "@/lib/exercises";

type Props = {
  session: Session;
  exercises: Exercise[];
  programTitle: string;
  programId: string;
};

export function WorkoutClient({ session, exercises, programId }: Props) {
  const { tr, mode } = useLocale();
  const sessionLoc = localizedSession(programId, session, mode);
  const [slots, setSlots] = useState<WorkoutExercise[]>(() =>
    session.exercises.map((e) => ({ ...e, sets: e.sets.map((s) => ({ ...s })) })),
  );
  const [extraExercises, setExtraExercises] = useState<Exercise[]>([]);
  const map = useMemo(() => {
    const m = new Map(exercises.map((e) => [e.id, e]));
    for (const e of extraExercises) m.set(e.id, e);
    return m;
  }, [exercises, extraExercises]);

  const [index, setIndex] = useState(0);
  const [setIndexNum, setSetIndexNum] = useState(0);
  const [restLeft, setRestLeft] = useState(0);
  const [restTotal, setRestTotal] = useState(0);
  const [done, setDone] = useState(false);
  const [teachOpen, setTeachOpen] = useState(false);
  const [swapOpen, setSwapOpen] = useState(false);
  const [weightKg, setWeightKg] = useState<number | "">("");
  const [weightForId, setWeightForId] = useState<string | null>(null);
  const [rpe, setRpe] = useState<SetRpe | null>(null);
  const [setsLogged, setSetsLogged] = useState(0);
  const [cueIndex, setCueIndex] = useState(0);

  const safeIndex = Math.min(index, Math.max(slots.length - 1, 0));
  const item = slots[safeIndex];
  const exercise = item ? map.get(item.exerciseId) : undefined;
  const lessonEn = useMemo(() => (exercise ? buildLesson(exercise) : null), [exercise]);
  const lessonYue = useMemo(
    () => (lessonEn ? applyYueToLesson(lessonEn) : null),
    [lessonEn],
  );
  const lesson = mode === "yue" ? lessonYue : lessonEn;
  const totalMoves = slots.length;
  const totalSets = item?.sets.length ?? 0;
  const currentSet = totalSets > 0 ? item.sets[Math.min(setIndexNum, totalSets - 1)] : undefined;
  const resting = restLeft > 0;

  const substitutes = useMemo(
    () => (item ? findSubstitutes(item.exerciseId, 4) : []),
    [item],
  );

  const weightHint = useMemo(() => {
    if (!item || !exercise || exercise.equipment === "body weight" || !currentSet) return null;
    return suggestWeightKg(exercise.id, currentSet.reps);
  }, [item, exercise, currentSet]);

  const restCues = useMemo(() => {
    if (!lessonEn || !lessonYue) return [] as { en: string; yue: string }[];
    const cues: { en: string; yue: string }[] = [];
    if (lessonEn.setup[0]) cues.push({ en: lessonEn.setup[0], yue: lessonYue.setup[0] });
    if (lessonEn.breathe) cues.push({ en: lessonEn.breathe, yue: lessonYue.breathe });
    if (lessonEn.mistakes[0]) {
      cues.push({
        en: `${lessonEn.mistakes[0].bad} → ${lessonEn.mistakes[0].fix}`,
        yue: `${lessonYue.mistakes[0].bad} → ${lessonYue.mistakes[0].fix}`,
      });
    }
    if (lessonEn.feel) cues.push({ en: lessonEn.feel, yue: lessonYue.feel });
    return cues;
  }, [lessonEn, lessonYue]);

  const progressPct = done
    ? 100
    : totalMoves === 0
      ? 0
      : Math.round(((safeIndex + (totalSets ? setIndexNum / totalSets : 0)) / totalMoves) * 100);

  // Seed the weight stepper when the exercise changes (adjust-state-during-render pattern)
  if (exercise && weightForId !== exercise.id) {
    setWeightForId(exercise.id);
    setRpe(null);
    setSwapOpen(false);
    const hint = currentSet ? suggestWeightKg(exercise.id, currentSet.reps) : undefined;
    const last = lastWeightFor(exercise.id);
    if (exercise.equipment === "body weight") {
      setWeightKg("");
    } else if (hint) {
      setWeightKg(hint.kg);
    } else {
      setWeightKg(last ?? "");
    }
  }

  useEffect(() => {
    if (!resting) return;
    const t = setInterval(() => {
      setRestLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [resting, restTotal]);

  useEffect(() => {
    if (!resting || restCues.length < 2) return;
    const t = setInterval(() => {
      setCueIndex((i) => (i + 1) % restCues.length);
    }, 8000);
    return () => clearInterval(t);
  }, [resting, restCues.length]);

  function startRest(sec: number) {
    const safe = Math.max(0, Math.floor(sec));
    setRestTotal(safe);
    setRestLeft(safe);
    setCueIndex(0);
  }

  function applySwap(alt: Exercise) {
    setExtraExercises((prev) => (prev.some((e) => e.id === alt.id) ? prev : [...prev, alt]));
    setSlots((prev) =>
      prev.map((slot, i) =>
        i === safeIndex
          ? {
              ...slot,
              exerciseId: alt.id,
              coaching:
                mode === "yue"
                  ? "替代動作——跟教學要點做乾淨次數。"
                  : "Substitute move — clean reps using the coaching cues.",
            }
          : slot,
      ),
    );
    setSwapOpen(false);
    setWeightForId(null); // force weight reseed
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
        rpe: rpe ?? undefined,
      });
      setSetsLogged((n) => n + 1);
    }

    const restSec = restForRpe(item.restSec, rpe);
    setRpe(null);

    if (setIndexNum + 1 < item.sets.length) {
      setSetIndexNum((s) => s + 1);
      startRest(restSec);
      return;
    }
    if (safeIndex + 1 < slots.length) {
      setIndex(safeIndex + 1);
      setSetIndexNum(0);
      startRest(Math.min(restSec, 40));
      setTeachOpen(false);
      return;
    }
    setDone(true);
    markSessionComplete(session.id, programId);
  }

  if (!slots.length) {
    return (
      <div className="surface" style={{ padding: "1.25rem", textAlign: "center" }}>
        <p className="display">{tr("missingData")}</p>
        <Link href={programId === "quick" ? "/quick" : `/path/${programId}`} className="btn btn-primary">
          {programId === "quick" ? tr("quickSession") : tr("backToProgram")}
        </Link>
      </div>
    );
  }

  if (done) {
    const notes = sessionProgressionNotes(
      programId,
      session.id,
      slots.map((s) => {
        const ex = map.get(s.exerciseId) ?? getExercise(s.exerciseId);
        const top = s.sets[s.sets.length - 1]?.reps ?? "8–12";
        return { id: s.exerciseId, name: ex?.name ?? s.exerciseId, plannedTop: top };
      }),
    );

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
        <div className="session-summary" style={{ position: "relative", zIndex: 1 }}>
          <p className="session-summary__title">{tr("sessionSummary")}</p>
          <p className="session-summary__stat">
            <strong>{setsLogged}</strong> {tr("totalSetsShort")}
          </p>
          {notes.length > 0 ? (
            <ul className="session-summary__notes">
              <li className="faint" style={{ listStyle: "none", marginBottom: "0.35rem" }}>
                {tr("nextTime")}
              </li>
              {notes.map((n) => (
                <li key={n.exerciseId}>
                  {mode === "yue" ? n.messageYue : mode === "both" ? `${n.messageEn} · ${n.messageYue}` : n.messageEn}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="stack" style={{ position: "relative", zIndex: 1 }}>
          <Link
            href={programId === "quick" ? "/quick" : `/path/${programId}`}
            className="btn btn-primary btn-block btn-lg"
          >
            {programId === "quick" ? tr("quickSession") : tr("backToProgram")}
          </Link>
          <Link href="/history" className="btn btn-ghost btn-block">
            {tr("history")}
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
        <Link
          href={programId === "quick" ? "/quick" : `/path/${programId}`}
          className="btn btn-ghost btn-block"
        >
          {programId === "quick" ? tr("quickSession") : tr("backToProgram")}
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

  const cue = restCues[cueIndex % Math.max(restCues.length, 1)];

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
        <>
          <RestRing total={restTotal || restLeft} left={restLeft} onSkip={() => setRestLeft(0)} />
          {cue ? (
            <div className="rest-cue surface">
              <p className="rest-cue__label">{tr("restCue")}</p>
              <BilingualText en={cue.en} yue={cue.yue} as="p" />
            </div>
          ) : null}
        </>
      ) : null}

      <div className="surface workout-set-panel">
        <div className="workout-set-panel__top">
          <span className="chip set-chip">{setLabel}</span>
          <span className="workout-reps">{currentSet.reps}</span>
        </div>
        {exercise.equipment !== "body weight" ? (
          <>
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
            {weightHint ? (
              <p className="weight-hint">
                <span className="chip chip-accent" style={{ marginRight: "0.4rem" }}>
                  {tr("suggestWeight")} {weightHint.kg} kg
                </span>
                <span className="muted" style={{ fontSize: "0.82rem" }}>
                  {weightHint.reason === "progress"
                    ? tr("suggestProgress")
                    : weightHint.reason === "deload"
                      ? tr("suggestDeload")
                      : tr("suggestLast")}
                </span>
              </p>
            ) : null}
            {typeof weightKg === "number" && weightKg > 0 ? (
              <p className="muted" style={{ margin: "0.25rem 0 0", fontSize: "0.82rem" }}>
                {tr("est1RM")}: <strong>{estimate1RM(weightKg, parseRepRange(currentSet.reps).min || 1)} kg</strong>
              </p>
            ) : null}
          </>
        ) : null}

        <div className="rpe-row">
          <span className="log-row__label">{tr("howItFelt")}</span>
          <div className="rpe-pills">
            {(
              [
                ["easy", "rpeEasy"],
                ["ok", "rpeOk"],
                ["hard", "rpeHard"],
              ] as const
            ).map(([id, key]) => (
              <button
                key={id}
                type="button"
                className="rpe-pill"
                data-active={rpe === id}
                onClick={() => setRpe((cur) => (cur === id ? null : id))}
              >
                {tr(key)}
              </button>
            ))}
          </div>
        </div>

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

      {substitutes.length > 0 ? (
        <div className="surface" style={{ padding: "0.85rem" }}>
          <button
            type="button"
            className="btn btn-ghost btn-block"
            style={{ marginBottom: swapOpen ? "0.65rem" : 0 }}
            onClick={() => setSwapOpen((s) => !s)}
          >
            {swapOpen ? tr("hideCoaching") : `${tr("noEquipment")} · ${tr("swapMove")}`}
          </button>
          {swapOpen ? (
            <ul className="swap-list">
              {substitutes.map((alt) => (
                <li key={alt.id}>
                  <button type="button" className="swap-list__btn" onClick={() => applySwap(alt)}>
                    <span className="swap-list__name">{alt.name}</span>
                    <span className="swap-list__meta">
                      {alt.equipment} · {tr("useThis")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

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
