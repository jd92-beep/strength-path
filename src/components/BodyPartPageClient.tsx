"use client";

import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { ExerciseCard } from "@/components/ExerciseCard";
import { MediaDemo } from "@/components/MediaDemo";
import { BodyPartIcon } from "@/components/BodyPartIcon";
import { BilingualList, BilingualText } from "@/components/Bilingual";
import { useLocale } from "@/lib/locale";
import type { Exercise } from "@/lib/types";

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

export function BodyPartPageClient({
  partId,
  label,
  accent,
  goalEn,
  goalYue,
  tipsEn,
  tipsYue,
  starterEn,
  starterYue,
  featured,
  exercises,
}: {
  partId: string;
  label: string;
  accent: string;
  goalEn: string;
  goalYue: string;
  tipsEn: string[];
  tipsYue: string[];
  starterEn: string;
  starterYue: string;
  featured: Exercise[];
  exercises: Exercise[];
}) {
  const { tr, mode } = useLocale();
  const title =
    mode === "yue"
      ? `${BODY_YUE[partId] || label}訓練`
      : mode === "both"
        ? `${label} · ${BODY_YUE[partId] || label}`
        : `${label} training`;
  const hero = featured[0];

  return (
    <AppShell title={title} backHref="/body">
      <div className="stack-md page-center">
        <div
          className="surface"
          style={{
            padding: "1.15rem",
            borderColor: `color-mix(in oklab, ${accent} 45%, var(--border))`,
            background: `linear-gradient(160deg, color-mix(in oklab, ${accent} 18%, var(--surface)), var(--surface))`,
          }}
        >
          <BodyPartIcon bodyPart={partId} size={64} className="teach__pattern-icon" />
          <h1 className="display" style={{ margin: "0.55rem 0 0.4rem", fontSize: "1.4rem" }}>
            {title}
          </h1>
          <BilingualText en={goalEn} yue={goalYue} as="p" className="muted" />
        </div>

        {hero ? (
          <MediaDemo
            gifPath={hero.gif_url}
            imagePath={hero.image}
            alt={`${hero.name} form demo`}
            autoPlay={false}
            size="lg"
            caption={hero.name}
          />
        ) : null}

        <section>
          <h2 className="display" style={{ fontSize: "1.05rem", margin: "0 0 0.55rem" }}>
            {mode === "yue" ? "點練呢個部位" : mode === "both" ? "How to train · 點練" : "How to train this area"}
          </h2>
          <BilingualList enItems={tipsEn} yueItems={tipsYue} />
          <div className="surface-soft" style={{ marginTop: "0.75rem", padding: "0.85rem 1rem" }}>
            <strong style={{ color: "var(--ring-exercise)" }}>
              {mode === "yue" ? "起步計劃：" : "Starter plan: "}
            </strong>
            <BilingualText en={starterEn} yue={starterYue} as="span" />
          </div>
        </section>

        <section>
          <h2 className="display" style={{ fontSize: "1.05rem", margin: "0 0 0.65rem" }}>
            {mode === "yue" ? "適合起步嘅動作" : "Good starting moves"}
          </h2>
          <div className="stack">
            {featured.map((ex) => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2 className="display" style={{ fontSize: "1.05rem", margin: 0 }}>
              {mode === "yue" ? "全部動作" : `All ${label.toLowerCase()} exercises`}
            </h2>
            <span className="faint">{exercises.length}</span>
          </div>
          <div className="stack">
            {exercises.slice(0, 40).map((ex) => (
              <ExerciseCard key={ex.id} exercise={ex} />
            ))}
          </div>
          {exercises.length > 40 ? (
            <p className="muted" style={{ marginTop: "0.85rem" }}>
              <Link href={`/library?body=${encodeURIComponent(partId)}`} className="section-link">
                {tr("seeAll")} →
              </Link>
            </p>
          ) : null}
        </section>
      </div>
    </AppShell>
  );
}
