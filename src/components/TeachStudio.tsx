"use client";

import { useEffect, useMemo, useState } from "react";
import type { Exercise, LangCode } from "@/lib/types";
import { LANGS } from "@/lib/langs";
import { buildLesson } from "@/lib/teaching";
import { useExerciseI18n } from "@/hooks/useExerciseI18n";
import { markExerciseLearned } from "@/lib/progress";
import { MediaDemo } from "./MediaDemo";
import { StepGuide } from "./StepGuide";
import { ExerciseMeta } from "./ExerciseMeta";

type Tab = "watch" | "steps" | "cues" | "mistakes" | "level" | "data";

const TABS: { id: Tab; label: string }[] = [
  { id: "watch", label: "Watch" },
  { id: "steps", label: "Steps" },
  { id: "cues", label: "Cues" },
  { id: "mistakes", label: "Fix" },
  { id: "level", label: "Level" },
  { id: "data", label: "Data" },
];

export function TeachStudio({
  exercise,
  autoPlay = false,
}: {
  exercise: Exercise;
  autoPlay?: boolean;
}) {
  const lesson = useMemo(() => buildLesson(exercise), [exercise]);
  const [tab, setTab] = useState<Tab>("watch");
  const [lang, setLang] = useState<LangCode>("en");
  const i18n = useExerciseI18n(exercise, lang);

  useEffect(() => {
    // Defer so we don't sync-set during render/effect in strict mode warnings
    const t = window.setTimeout(() => markExerciseLearned(exercise.id), 0);
    return () => window.clearTimeout(t);
  }, [exercise.id]);

  return (
    <div className="teach">
      <div className="teach-hero-card">
        <div
          className="teach__pattern"
          style={{ ["--pattern" as string]: lesson.color }}
        >
          <span className="teach__pattern-dot" aria-hidden />
          <div>
            <p className="teach__pattern-label">{lesson.patternLabel}</p>
            <p className="teach__pattern-focus">{lesson.skillFocus}</p>
          </div>
        </div>

        <MediaDemo
          key={exercise.id}
          gifPath={exercise.gif_url}
          imagePath={exercise.image}
          alt={`${exercise.name} form demo`}
          autoPlay={autoPlay}
          size="hero"
          caption={`${exercise.name} · ${exercise.media_id || "demo"} · © Gym visual`}
        />

        <div className="teach-toolbar">
          <div className="teach__meta-row">
            <span className="chip">{exercise.equipment}</span>
            <span className="chip chip-accent">{exercise.target}</span>
            <span className="chip">{exercise.body_part}</span>
            {exercise.muscle_group ? (
              <span className="chip">{exercise.muscle_group}</span>
            ) : null}
          </div>
          <label className="lang-picker">
            <span className="lang-picker__label">Language</span>
            <select
              className="lang-picker__select"
              value={lang}
              onChange={(e) => setLang(e.target.value as LangCode)}
              aria-label="Instruction language"
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {exercise.secondary_muscles?.length ? (
          <div className="muscle-row muscle-row--inline">
            <span className="muscle-row__label">Also hits</span>
            <div className="muscle-row__tags">
              {exercise.secondary_muscles.map((m) => (
                <span key={m} className="muscle-tag muscle-tag--sec">
                  {m}
                </span>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="teach-tabs" role="tablist" aria-label="Teaching sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className="teach-tab"
            data-active={tab === t.id}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="teach-panel" role="tabpanel">
        {tab === "watch" && (
          <div className="stack">
            <h3 className="teach-panel__title">Watch like a coach</h3>
            <ul className="teach-bullets">
              <li>
                Pattern: <strong>{lesson.patternLabel}</strong> — {lesson.skillFocus}
              </li>
              <li>
                Tempo cue: <strong>{lesson.tempo}</strong>
              </li>
              <li>
                You should feel: <strong>{lesson.feel}</strong>
              </li>
            </ul>
            <div className="teach-callout">
              <strong>Breathing</strong>
              <p>{lesson.breathe}</p>
            </div>
            <div className="teach-callout teach-callout--soft">
              <strong>Starter dose</strong>
              <p>{lesson.setsRepsHint}</p>
            </div>
          </div>
        )}

        {tab === "steps" && (
          <div className="stack">
            <div className="teach-panel__head-row">
              <h3 className="teach-panel__title">Step-by-step</h3>
              {i18n.loading ? (
                <span className="faint" style={{ fontSize: "0.78rem" }}>
                  Loading {lang}…
                </span>
              ) : (
                <span className="chip">{LANGS.find((l) => l.code === lang)?.flag} {lang}</span>
              )}
            </div>
            {i18n.error ? (
              <p className="muted" style={{ margin: "0 0 0.65rem", fontSize: "0.88rem" }}>
                Couldn’t load {lang} instructions — showing English.
              </p>
            ) : null}
            <StepGuide steps={i18n.steps} />
            {i18n.instructions ? (
              <div className="teach-callout teach-callout--soft">
                <strong>Full instructions ({lang})</strong>
                <p>{i18n.instructions}</p>
              </div>
            ) : null}
          </div>
        )}

        {tab === "cues" && (
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
              <h3 className="teach-panel__title">Execute</h3>
              <ol className="teach-numbered">
                {lesson.execute.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
            </section>
            <div className="teach-callout">
              <strong>Where you should feel it</strong>
              <p>{lesson.feel}</p>
            </div>
          </div>
        )}

        {tab === "mistakes" && (
          <div className="stack">
            <h3 className="teach-panel__title">Common misses → fixes</h3>
            {lesson.mistakes.map((m) => (
              <div key={m.bad} className="mistake-card">
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
          </div>
        )}

        {tab === "level" && (
          <div className="stack">
            <div className="level-card level-card--down">
              <span className="level-card__kicker">Easier · regress</span>
              <p>{lesson.regress}</p>
            </div>
            <div className="level-card level-card--up">
              <span className="level-card__kicker">Harder · progress</span>
              <p>{lesson.progress}</p>
            </div>
            <p className="muted" style={{ margin: 0, fontSize: "0.9rem" }}>
              Keep the demo shape on every rep. Break form → regress. Clean last reps → progress.
            </p>
          </div>
        )}

        {tab === "data" && <ExerciseMeta exercise={exercise} />}
      </div>
    </div>
  );
}
