"use client";

import { AppShell } from "@/components/AppShell";
import { ExerciseCard } from "@/components/ExerciseCard";
import { BilingualList, BilingualText } from "@/components/Bilingual";
import { useLocale } from "@/lib/locale";
import { localizedPattern } from "@/lib/localize";
import type { MovementPattern, TeachLesson } from "@/lib/teaching";
import { applyYueToLesson } from "@/lib/teaching-yue";
import type { Exercise } from "@/lib/types";

export function PatternPageClient({
  patternId,
  label,
  skillFocus,
  color,
  exercises,
  lesson,
}: {
  patternId: string;
  label: string;
  skillFocus: string;
  color: string;
  exercises: Exercise[];
  lesson: TeachLesson | null;
}) {
  const { tr, mode } = useLocale();
  const loc = localizedPattern(patternId as MovementPattern, label, skillFocus, mode);
  const lessonEn = lesson;
  const lessonYue = lesson ? applyYueToLesson(lesson) : null;

  return (
    <AppShell title={loc.label} backHref="/learn">
      <div className="stack-md page-center">
        <section
          className="surface"
          style={{
            padding: "1.15rem",
            borderColor: `color-mix(in oklab, ${color} 40%, var(--border))`,
            background: `linear-gradient(155deg, color-mix(in oklab, ${color} 18%, var(--surface)), var(--surface))`,
          }}
        >
          <p className="chip" style={{ marginBottom: "0.55rem" }}>
            {mode === "yue" ? "動作模式" : mode === "both" ? "Pattern · 模式" : "Movement pattern"}
          </p>
          <h1 className="display" style={{ margin: "0 0 0.4rem", fontSize: "1.45rem" }}>
            {loc.label}
          </h1>
          <p className="muted" style={{ margin: 0 }}>
            {loc.skillFocus}
          </p>
        </section>

        {lessonEn && lessonYue ? (
          <section className="surface" style={{ padding: "1.1rem" }}>
            <h2 className="display" style={{ fontSize: "1.05rem", margin: "0 0 0.75rem" }}>
              {mode === "yue" ? "點教呢個模式" : mode === "both" ? "How we teach · 點教" : "How we teach this pattern"}
            </h2>
            <div className="stack">
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
                <BilingualText
                  en={`${lessonEn.tempo} · ${lessonEn.setsRepsHint}`}
                  yue={`${lessonYue.tempo} · ${lessonYue.setsRepsHint}`}
                  as="p"
                />
              </div>
              <div>
                <p className="faint" style={{ margin: "0 0 0.4rem", fontWeight: 700, fontSize: "0.78rem" }}>
                  {tr("setup")}
                </p>
                <BilingualList enItems={lessonEn.setup} yueItems={lessonYue.setup} ordered />
              </div>
            </div>
          </section>
        ) : null}

        <section>
          <div className="section-head">
            <h2 className="display">{mode === "yue" ? "練習示範" : "Practice demos"}</h2>
            <span className="faint" style={{ fontSize: "0.8rem" }}>
              {exercises.length}
            </span>
          </div>
          <div className="stack">
            {exercises.map((ex, i) => (
              <ExerciseCard key={ex.id} exercise={ex} featured={i === 0} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
