"use client";

import { useMemo, useState } from "react";
import type { Exercise } from "@/lib/types";
import { buildLesson } from "@/lib/teaching";
import { MediaDemo } from "./MediaDemo";
import { StepGuide } from "./StepGuide";

type Tab = "watch" | "steps" | "cues" | "mistakes" | "level";

const TABS: { id: Tab; label: string }[] = [
  { id: "watch", label: "Watch" },
  { id: "steps", label: "Steps" },
  { id: "cues", label: "Cues" },
  { id: "mistakes", label: "Fix" },
  { id: "level", label: "Level up" },
];

export function TeachStudio({
  exercise,
  autoPlay = true,
}: {
  exercise: Exercise;
  autoPlay?: boolean;
}) {
  const lesson = useMemo(() => buildLesson(exercise), [exercise]);
  const [tab, setTab] = useState<Tab>("watch");

  return (
    <div className="teach">
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
        caption="Learn the shape first — then match it set by set."
      />

      <div className="teach__meta-row">
        <span className="chip">{exercise.equipment}</span>
        <span className="chip chip-accent">{exercise.target}</span>
        <span className="chip">{lesson.tempo}</span>
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

      <div className="teach-panel surface" role="tabpanel">
        {tab === "watch" && (
          <div className="stack">
            <h3 className="teach-panel__title">What to notice in the demo</h3>
            <ul className="teach-bullets">
              <li>Joint path — does it match the {lesson.patternLabel.toLowerCase()} pattern?</li>
              <li>Tempo — count “{lesson.tempo}” while you watch one rep.</li>
              <li>
                Finish position — you should <em>feel</em>: {lesson.feel}
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
            <h3 className="teach-panel__title">Step-by-step</h3>
            <StepGuide steps={exercise.steps} />
            {exercise.instructions ? (
              <div className="teach-callout teach-callout--soft">
                <strong>Full coach note</strong>
                <p>{exercise.instructions}</p>
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
            <h3 className="teach-panel__title">Common misses → quick fixes</h3>
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
              Rule of thumb: if you can’t keep the demo shape for every rep, regress. If the last 2
              reps still look crisp, progress next session.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
