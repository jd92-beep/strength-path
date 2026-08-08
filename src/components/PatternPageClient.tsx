"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ExerciseCard } from "@/components/ExerciseCard";
import { Reveal } from "@/components/Reveal";
import { BilingualList, BilingualText } from "@/components/Bilingual";
import { BodyPartIcon } from "@/components/BodyPartIcon";
import { useLocale } from "@/lib/locale";
import { localizedPattern } from "@/lib/localize";
import type { MovementPattern, PatternGroup, TeachLesson } from "@/lib/teaching";
import { applyYueToLesson } from "@/lib/teaching-yue";

const INITIAL_SHOW = 40;

const BODY_YUE: Record<string, string> = {
  chest: "胸",
  back: "背",
  "upper legs": "腿",
  shoulders: "膊頭",
  "upper arms": "手臂",
  waist: "核心",
  "lower legs": "小腿",
  "lower arms": "前臂",
  cardio: "心肺",
  neck: "頸",
};

export function PatternPageClient({
  patternId,
  label,
  skillFocus,
  color,
  groups,
  lesson,
}: {
  patternId: string;
  label: string;
  skillFocus: string;
  color: string;
  groups: PatternGroup[];
  lesson: TeachLesson | null;
}) {
  const { tr, mode } = useLocale();
  const loc = localizedPattern(patternId as MovementPattern, label, skillFocus, mode);
  const total = groups.reduce((n, g) => n + g.exercises.length, 0);
  // Cap initial render — big patterns (isolation, push) have 250+ cards.
  const offsets = groups.map((_, gi) =>
    groups.slice(0, gi).reduce((n, g) => n + g.exercises.length, 0),
  );
  const visibleGroups = groups
    .map((g, gi) => ({
      bodyPart: g.bodyPart,
      count: g.exercises.length,
      exercises: g.exercises.slice(0, Math.max(0, INITIAL_SHOW - offsets[gi])),
    }))
    .filter((g) => g.exercises.length > 0);
  const bodyLabel = (bp: string) =>
    mode === "yue"
      ? BODY_YUE[bp] || bp
      : mode === "both"
        ? `${bp} · ${BODY_YUE[bp] || bp}`
        : bp;
  const lessonEn = lesson;
  const lessonYue = lesson ? applyYueToLesson(lesson) : null;

  return (
    <AppShell title={loc.label} backHref="/learn">
      <div className="stack-md page-center">
        <section
          className="af-tile af-tile--large af-tile--photo"
          style={{ ["--a" as string]: color, minHeight: "12rem" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/pattern-banners/${patternId}.jpg`}
            alt=""
            className="af-tile__photo"
            loading="lazy"
            decoding="async"
            aria-hidden
          />
          <span className="af-tile__scrim" aria-hidden />
          <div className="af-tile__content">
            <span className="af-tile__badge">
              {mode === "yue" ? "動作模式" : mode === "both" ? "Pattern · 模式" : "Movement pattern"}
            </span>
            <h1 className="af-tile__title" style={{ fontSize: "1.6rem" }}>
              {loc.label}
            </h1>
            <p className="af-tile__sub">{loc.skillFocus}</p>
          </div>
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
            <h2 className="display">{mode === "yue" ? "全部練習示範" : "All demos"}</h2>
            <span className="faint" style={{ fontSize: "0.8rem" }}>
              {total} {tr("moves")}
            </span>
          </div>
          <div className="stack">
            {visibleGroups.map((g, gi) => (
              <details key={g.bodyPart} className="fold" open={gi === 0}>
                <summary className="fold__head">
                  <BodyPartIcon bodyPart={g.bodyPart} size={30} className="fold__icon" alt="" />
                  <span className="fold__title">{bodyLabel(g.bodyPart)}</span>
                  <span className="fold__count">{g.count}</span>
                  <span className="fold__chev" aria-hidden>
                    ›
                  </span>
                </summary>
                <div className="stack fold__body">
                  {g.exercises.map((ex, i) => (
                    <Reveal key={ex.id} delay={Math.min(i * 60, 300)}>
                      <ExerciseCard exercise={ex} featured={gi === 0 && i === 0} />
                    </Reveal>
                  ))}
                </div>
              </details>
            ))}
          </div>
          {total > INITIAL_SHOW ? (
            <p className="muted" style={{ marginTop: "0.85rem" }}>
              <Link
                href={`/library?pattern=${encodeURIComponent(patternId)}`}
                className="section-link"
              >
                {tr("seeAll")} →
              </Link>
            </p>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}
