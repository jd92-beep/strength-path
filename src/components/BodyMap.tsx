import Link from "next/link";
import { BODY_PARTS, slugifyPart } from "@/lib/body-parts";

const REGION_HREF: Record<string, string> = {
  head: "neck",
  chest: "chest",
  shoulders: "shoulders",
  arms: "upper arms",
  core: "waist",
  back: "back",
  legs: "upper legs",
  calves: "lower legs",
};

const REGION_COLOR: Record<string, string> = Object.fromEntries(
  BODY_PARTS.map((b) => [b.id, b.accent]),
);

type Props = {
  counts: Record<string, number>;
  /** Highlight a body part id when on a detail page */
  activePart?: string;
};

export function BodyMap({ counts, activePart }: Props) {
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
      <div className="bodymap__figure" aria-hidden>
        <svg viewBox="0 0 200 360" className="bodymap__svg">
          <defs>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="oklch(0.32 0.04 250)" />
              <stop offset="100%" stopColor="oklch(0.22 0.03 250)" />
            </linearGradient>
            <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="oklch(0 0 0 / 0.35)" />
            </filter>
          </defs>
          {/* Silhouette */}
          <g filter="url(#soft)" fill="url(#bodyGrad)" stroke="oklch(0.45 0.04 250)" strokeWidth="1.2">
            <circle cx="100" cy="34" r="22" />
            <path d="M70 62c8-10 52-10 60 0 14 16 22 34 24 58 1 14-8 24-20 26l-6 2v18c18 6 30 22 34 42 3 16-2 28-14 32-6 2-12-2-14-8l-8-28c-2 18-4 48-4 72 0 22 2 40 6 54 2 8-2 14-10 14s-12-6-10-14c4-14 6-32 6-54 0-24-2-54-4-72l-8 28c-2 6-8 10-14 8-12-4-17-16-14-32 4-20 16-36 34-42v-18l-6-2c-12-2-21-12-20-26 2-24 10-42 24-58z" />
          </g>
          {/* Highlight rings for active zones */}
          {activePart === "chest" || !activePart ? (
            <ellipse
              cx="100"
              cy="118"
              rx="28"
              ry="18"
              fill={REGION_COLOR.chest}
              opacity={activePart === "chest" ? 0.45 : 0.18}
            />
          ) : null}
          {activePart === "upper legs" || !activePart ? (
            <ellipse
              cx="100"
              cy="230"
              rx="30"
              ry="40"
              fill={REGION_COLOR["upper legs"]}
              opacity={activePart === "upper legs" ? 0.4 : 0.14}
            />
          ) : null}
          {activePart === "waist" || !activePart ? (
            <ellipse
              cx="100"
              cy="160"
              rx="22"
              ry="16"
              fill={REGION_COLOR.waist}
              opacity={activePart === "waist" ? 0.45 : 0.16}
            />
          ) : null}
        </svg>
      </div>

      <div className="bodymap__list" role="list">
        {parts.map((p) => {
          const active = activePart === p.id;
          const color = REGION_COLOR[p.id] ?? "var(--primary)";
          return (
            <Link
              key={p.key}
              href={`/body/${slugifyPart(REGION_HREF[p.key] ?? p.id)}`}
              className="bodymap__item"
              data-active={active}
              style={{ ["--region" as string]: color }}
              role="listitem"
            >
              <span className="bodymap__dot" />
              <span className="bodymap__meta">
                <span className="bodymap__label">{p.label}</span>
                <span className="bodymap__count">{counts[p.id] ?? 0} moves</span>
              </span>
              <span className="bodymap__chev" aria-hidden>
                →
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
