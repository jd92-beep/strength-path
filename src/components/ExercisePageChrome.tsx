"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLocale } from "@/lib/locale";
import { localizedPattern } from "@/lib/localize";
import type { MovementPattern } from "@/lib/teaching";

const BODY_YUE: Record<string, string> = {
  chest: "胸",
  back: "背",
  "upper legs": "大腿",
  shoulders: "膊頭",
  "upper arms": "手臂",
  waist: "核心",
  "lower legs": "小腿",
  "lower arms": "前臂",
  cardio: "心肺",
  neck: "頸",
};

export function ExercisePageChrome({
  exerciseId,
  name,
  pattern,
  patternLabel,
  bodyPart,
  bodyHref,
  equipment,
  target,
  related,
  children,
}: {
  exerciseId: string;
  name: string;
  pattern: string;
  patternLabel: string;
  bodyPart: string;
  bodyHref: string;
  equipment: string;
  target: string;
  related: { id: string; name: string }[];
  children: ReactNode;
}) {
  const { tr, mode } = useLocale();
  const loc = localizedPattern(pattern as MovementPattern, patternLabel, "", mode);
  const bodyLabel =
    mode === "yue"
      ? BODY_YUE[bodyPart] || bodyPart
      : mode === "both"
        ? `${bodyPart} · ${BODY_YUE[bodyPart] || bodyPart}`
        : bodyPart;
  const moreLabel =
    mode === "yue"
      ? `更多${BODY_YUE[bodyPart] || bodyPart}動作`
      : mode === "both"
        ? `More ${bodyPart} · 更多${BODY_YUE[bodyPart] || bodyPart}`
        : `More ${bodyPart}`;
  const targetLabel = mode === "yue" ? `目標 · ${target}` : `target · ${target}`;

  return (
    <div className="stack-lg">
      <header className="studio-head">
        <p className="studio-head__id">
          {tr("formStudio")} · #{exerciseId}
        </p>
        <h1 className="studio-head__title">{name}</h1>
        <div className="studio-head__tags">
          <Link href={`/learn/${pattern}`} className="chip chip-accent">
            {loc.label}
          </Link>
          <Link href={bodyHref} className="chip">
            {bodyLabel}
          </Link>
          <span className="chip">{equipment}</span>
          <span className="chip">{targetLabel}</span>
        </div>
      </header>

      {children}

      {related.length ? (
        <section>
          <div className="section-head">
            <h2 className="display">{moreLabel}</h2>
          </div>
          <div className="related-rail">
            {related.map((ex) => (
              <Link key={ex.id} href={`/exercise/${ex.id}`} className="related-rail__item">
                {ex.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
