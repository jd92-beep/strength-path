"use client";

import Link from "next/link";
import { BODY_PARTS, slugifyPart } from "@/lib/body-parts";
import { BodyPartIcon } from "./BodyPartIcon";
import { useLocale } from "@/lib/locale";

const REGION_HREF: Record<string, string> = {
  head: "neck",
  chest: "chest",
  shoulders: "shoulders",
  arms: "upper arms",
  core: "waist",
  back: "back",
  legs: "upper legs",
  calves: "lower legs",
  cardio: "cardio",
};

const REGION_COLOR: Record<string, string> = Object.fromEntries(
  BODY_PARTS.map((b) => [b.id, b.accent]),
);

const YUE_LABEL: Record<string, string> = {
  shoulders: "膊頭",
  chest: "胸",
  back: "背",
  "upper arms": "手臂",
  waist: "核心",
  "upper legs": "腿",
  "lower legs": "小腿",
  cardio: "心肺",
};

type Props = {
  counts: Record<string, number>;
  activePart?: string;
};

export function BodyMap({ counts, activePart }: Props) {
  const { mode, tr } = useLocale();
  const parts = [
    { key: "shoulders", label: "Shoulders", id: "shoulders" },
    { key: "chest", label: "Chest", id: "chest" },
    { key: "back", label: "Back", id: "back" },
    { key: "arms", label: "Arms", id: "upper arms" },
    { key: "core", label: "Core", id: "waist" },
    { key: "legs", label: "Legs", id: "upper legs" },
    { key: "calves", label: "Calves", id: "lower legs" },
    { key: "cardio", label: "Cardio", id: "cardio" },
  ];

  return (
    <div className="bodymap">
      <div className="bodymap__icons-grid" role="list">
        {parts.map((p) => {
          const active = activePart === p.id;
          const color = REGION_COLOR[p.id] ?? "var(--primary)";
          const label =
            mode === "yue"
              ? YUE_LABEL[p.id] || p.label
              : mode === "both"
                ? `${p.label} · ${YUE_LABEL[p.id] || ""}`
                : p.label;
          return (
            <Link
              key={p.key}
              href={`/body/${slugifyPart(REGION_HREF[p.key] ?? p.id)}`}
              className="bodymap__card"
              data-active={active}
              style={{ ["--region" as string]: color }}
              role="listitem"
            >
              <BodyPartIcon bodyPart={p.id} size={64} className="bodymap__card-icon" alt="" />
              <span className="bodymap__label">{label}</span>
              <span className="bodymap__count">
                {counts[p.id] ?? 0} {tr("moves")}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
