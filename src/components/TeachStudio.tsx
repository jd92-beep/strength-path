"use client";

import { useEffect, useMemo, useState } from "react";
import type { Exercise } from "@/lib/types";
import { buildLesson } from "@/lib/teaching";
import { applyYueToLesson } from "@/lib/teaching-yue";
import { useExerciseI18n } from "@/hooks/useExerciseI18n";
import { markExerciseLearned } from "@/lib/progress";
import { useLocale } from "@/lib/locale";
import { MediaDemo } from "./MediaDemo";
import { StepGuide } from "./StepGuide";
import { ExerciseMeta } from "./ExerciseMeta";
import { BilingualList, BilingualText } from "./Bilingual";
import { BodyPartIcon } from "./BodyPartIcon";

type Tab = "watch" | "steps" | "cues" | "mistakes" | "level" | "data";

export function TeachStudio({
  exercise,
  autoPlay = false,
}: {
  exercise: Exercise;
  autoPlay?: boolean;
}) {
  const { tr, mode } = useLocale();
  const lessonEn = useMemo(() => buildLesson(exercise), [exercise]);
  const lessonYue = useMemo(() => applyYueToLesson(lessonEn), [lessonEn]);
  const lesson = mode === "yue" ? lessonYue : lessonEn;
  const [tab, setTab] = useState<Tab>("watch");
  const i18n = useExerciseI18n(exercise);

  useEffect(() => {
    const t = window.setTimeout(() => markExerciseLearned(exercise.id), 0);
    return () => window.clearTimeout(t);
  }, [exercise.id]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "watch", label: tr("watch") },
    { id: "steps", label: tr("steps") },
    { id: "cues", label: tr("cues") },
    { id: "mistakes", label: tr("fix") },
    { id: "level", label: tr("level") },
    { id: "data", label: tr("data") },
  ];

  return (
    <div className="teach">
      <div className="teach-hero-card">
        <div className="teach__pattern" style={{ ["--pattern" as string]: lesson.color }}>
          <BodyPartIcon bodyPart={exercise.body_part} size={48} className="teach__pattern-icon" />
          <div>
            <p className="teach__pattern-label">
              {mode === "both" ? (
                <>
                  <span className="bi-en">{lessonEn.patternLabel}</span>
                  <span className="bi-sep" />
                  <span className="bi-yue">{lessonYue.patternLabel}</span>
                </>
              ) : (
                lesson.patternLabel
              )}
            </p>
            <p className="teach__pattern-focus">
              {mode === "both" ? (
                <>
                  <span className="bi-en">{lessonEn.skillFocus}</span>
                  <span className="bi-sep" />
                  <span className="bi-yue">{lessonYue.skillFocus}</span>
                </>
              ) : (
                lesson.skillFocus
              )}
            </p>
          </div>
        </div>

        <MediaDemo
          key={exercise.id}
          gifPath={exercise.gif_url}
          imagePath={exercise.image}
          alt={`${exercise.name} form demo`}
          autoPlay={autoPlay}
          size="hero"
          caption={`${exercise.name} · © Gym visual`}
        />

        <div className="teach__meta-row">
          <span className="chip chip-with-icon">
            <BodyPartIcon bodyPart={exercise.body_part} size={18} />
            {exercise.body_part}
          </span>
          <span className="chip">{exercise.equipment}</span>
          <span className="chip chip-accent">{exercise.target}</span>
          {exercise.muscle_group ? <span className="chip">{exercise.muscle_group}</span> : null}
        </div>

        {exercise.secondary_muscles?.length ? (
          <div className="muscle-row muscle-row--inline">
            <span className="muscle-row__label">{tr("alsoHits")}</span>
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
        {tabs.map((t) => (
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
            <h3 className="teach-panel__title">{tr("watch")}</h3>
            <div className="teach-callout">
              <strong>{tr("breathing")}</strong>
              <BilingualText en={lessonEn.breathe} yue={lessonYue.breathe} as="p" />
            </div>
            <div className="teach-callout teach-callout--soft">
              <strong>{tr("feel")}</strong>
              <BilingualText en={lessonEn.feel} yue={lessonYue.feel} as="p" />
            </div>
            <div className="teach-callout teach-callout--soft">
              <strong>{tr("starterDose")}</strong>
              <BilingualText en={lessonEn.setsRepsHint} yue={lessonYue.setsRepsHint} as="p" />
            </div>
            <p className="muted" style={{ margin: 0, fontSize: "0.88rem" }}>
              {mode === "both"
                ? "Tempo · 節奏"
                : mode === "yue"
                  ? "節奏"
                  : "Tempo"}
              : {mode === "yue" ? lessonYue.tempo : lessonEn.tempo}
              {mode === "both" ? ` · ${lessonYue.tempo}` : ""}
            </p>
          </div>
        )}

        {tab === "steps" && (
          <div className="stack">
            <h3 className="teach-panel__title">{tr("steps")}</h3>
            {i18n.loading ? (
              <p className="faint">Loading…</p>
            ) : null}
            {mode === "both" ? (
              <>
                <div className="guide-block">
                  <p className="guide-block__label">{tr("guideEn")}</p>
                  <StepGuide steps={i18n.en.steps} />
                  {i18n.en.instructions ? (
                    <p className="muted" style={{ marginTop: "0.75rem" }}>
                      {i18n.en.instructions}
                    </p>
                  ) : null}
                </div>
                <div className="guide-block guide-block--yue">
                  <p className="guide-block__label">{tr("guideYue")}</p>
                  <StepGuide steps={i18n.yue.steps} />
                  {i18n.yue.instructions ? (
                    <p className="muted" style={{ marginTop: "0.75rem" }}>
                      {i18n.yue.instructions}
                    </p>
                  ) : null}
                </div>
              </>
            ) : mode === "yue" ? (
              <>
                <StepGuide steps={i18n.yue.steps} />
                {i18n.yue.instructions ? (
                  <div className="teach-callout teach-callout--soft">
                    <strong>{tr("coachNote")}</strong>
                    <p>{i18n.yue.instructions}</p>
                  </div>
                ) : null}
              </>
            ) : (
              <>
                <StepGuide steps={i18n.en.steps} />
                {i18n.en.instructions ? (
                  <div className="teach-callout teach-callout--soft">
                    <strong>{tr("coachNote")}</strong>
                    <p>{i18n.en.instructions}</p>
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}

        {tab === "cues" && (
          <div className="stack-md">
            <section>
              <h3 className="teach-panel__title">{tr("setup")}</h3>
              <BilingualList enItems={lessonEn.setup} yueItems={lessonYue.setup} ordered />
            </section>
            <section>
              <h3 className="teach-panel__title">{tr("howTo")}</h3>
              <BilingualList enItems={lessonEn.execute} yueItems={lessonYue.execute} ordered />
            </section>
            <div className="teach-callout">
              <strong>{tr("feel")}</strong>
              <BilingualText en={lessonEn.feel} yue={lessonYue.feel} as="p" />
            </div>
          </div>
        )}

        {tab === "mistakes" && (
          <div className="stack">
            <h3 className="teach-panel__title">{tr("fix")}</h3>
            {(mode === "yue" ? lessonYue.mistakes : lessonEn.mistakes).map((m, i) => (
              <div key={m.bad} className="mistake-card">
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
          </div>
        )}

        {tab === "level" && (
          <div className="stack">
            <div className="level-card level-card--down">
              <span className="level-card__kicker">{tr("easier")}</span>
              <BilingualText en={lessonEn.regress} yue={lessonYue.regress} as="p" />
            </div>
            <div className="level-card level-card--up">
              <span className="level-card__kicker">{tr("harder")}</span>
              <BilingualText en={lessonEn.progress} yue={lessonYue.progress} as="p" />
            </div>
          </div>
        )}

        {tab === "data" && <ExerciseMeta exercise={exercise} />}
      </div>

    </div>
  );
}
