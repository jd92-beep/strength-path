"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BODY_PARTS, slugifyPart } from "@/lib/body-parts";
import { useLocale } from "@/lib/locale";

/**
 * Interactive anatomy map. The figure is authored SVG rather than traced stock
 * art so it stays on-brand, has no licence to carry, and every muscle group can
 * be its own hit target.
 *
 * Regions are real <a> elements (SVG anchors) so keyboard, focus and
 * open-in-new-tab all behave; the click handler upgrades them to client-side
 * navigation when JS is available.
 */

const ACCENT: Record<string, string> = Object.fromEntries(
  BODY_PARTS.map((b) => [b.id, b.accent]),
);

/* Region names for the accessible label. The visible bilingual labels live on
   the card grid below the figure. */
const EN: Record<string, string> = {
  neck: "Neck",
  shoulders: "Shoulders",
  chest: "Chest",
  back: "Back",
  "upper arms": "Arms",
  "lower arms": "Forearms",
  waist: "Core",
  "upper legs": "Legs",
  "lower legs": "Calves",
};

type View = "front" | "back";

export function MuscleMap({
  counts,
  activePart,
}: {
  counts: Record<string, number>;
  activePart?: string;
}) {
  const router = useRouter();
  const { tr } = useLocale();
  const [view, setView] = useState<View>("front");

  // A plain render function, not a nested component: declaring a component
  // inside render recreates it every pass and resets its reconciliation.
  // Hover and focus highlighting is pure CSS — no state needed for it.
  const region = (part: string, shapes: React.ReactNode) => {
    const href = `/body/${slugifyPart(part)}`;
    const n = counts[part] ?? 0;
    return (
      <a
        href={href}
        className="muscle-region"
        data-active={activePart === part}
        style={{ ["--region" as string]: ACCENT[part] ?? "var(--primary)" }}
        aria-label={`${EN[part] ?? part} — ${n} ${tr("moves")}`}
        onClick={(e) => {
          e.preventDefault();
          router.push(href);
        }}
      >
        {shapes}
      </a>
    );
  };

  return (
    <div className="muscle-map">
      <div className="muscle-map__views" role="group" aria-label={tr("muscleView")}>
        {(["front", "back"] as const).map((v) => (
          <button
            key={v}
            type="button"
            className="muscle-map__view"
            data-active={view === v}
            aria-pressed={view === v}
            onClick={() => setView(v)}
          >
            {v === "front" ? tr("muscleFront") : tr("muscleBack")}
          </button>
        ))}
      </div>

      <div className="muscle-map__stage">
        <svg
          viewBox="0 0 200 330"
          className="muscle-figure"
          role="img"
          aria-label={tr("muscleMapHint")}
        >
          {/* Body silhouette sits under the groups so the figure reads as one
              continuous person even where muscle shapes do not touch. */}
          <g className="muscle-figure__body" aria-hidden>
            <ellipse cx="100" cy="24" rx="15" ry="17" />
            <rect x="92" y="38" width="16" height="12" rx="5" />
            <rect x="76" y="48" width="48" height="92" rx="19" />
            <rect x="80" y="128" width="40" height="30" rx="13" />
            <rect x="80" y="150" width="17" height="98" rx="8.5" />
            <rect x="103" y="150" width="17" height="98" rx="8.5" />
            <rect x="82" y="240" width="14" height="52" rx="7" />
            <rect x="104" y="240" width="14" height="52" rx="7" />
            <ellipse cx="88" cy="296" rx="9" ry="5" />
            <ellipse cx="112" cy="296" rx="9" ry="5" />
            <rect x="54" y="58" width="16" height="76" rx="8" transform="rotate(-7 62 96)" />
            <rect x="130" y="58" width="16" height="76" rx="8" transform="rotate(7 138 96)" />
            <rect x="47" y="126" width="14" height="62" rx="7" transform="rotate(-7 54 157)" />
            <rect x="139" y="126" width="14" height="62" rx="7" transform="rotate(7 146 157)" />
            <ellipse cx="50" cy="194" rx="7" ry="9" transform="rotate(-7 50 194)" />
            <ellipse cx="150" cy="194" rx="7" ry="9" transform="rotate(7 150 194)" />
          </g>

          {view === "front" ? (
            <>
              {region("neck", <rect x="91" y="37" width="18" height="13" rx="5" />)}
              {region(
                "shoulders",
                <>
                  <ellipse cx="70" cy="63" rx="13" ry="12" />
                  <ellipse cx="130" cy="63" rx="13" ry="12" />
                </>,
              )}
              {region(
                "chest",
                <>
                  <rect x="79" y="53" width="19" height="27" rx="9" />
                  <rect x="102" y="53" width="19" height="27" rx="9" />
                </>,
              )}
              {region(
                "upper arms",
                <>
                  <ellipse cx="62" cy="94" rx="10" ry="21" transform="rotate(-7 62 94)" />
                  <ellipse cx="138" cy="94" rx="10" ry="21" transform="rotate(7 138 94)" />
                </>,
              )}
              {region(
                "lower arms",
                <>
                  <ellipse cx="54" cy="150" rx="8.5" ry="23" transform="rotate(-7 54 150)" />
                  <ellipse cx="146" cy="150" rx="8.5" ry="23" transform="rotate(7 146 150)" />
                </>,
              )}
              {region("waist", <rect x="84" y="84" width="32" height="48" rx="12" />)}
              {region(
                "upper legs",
                <>
                  <ellipse cx="88" cy="186" rx="13" ry="38" />
                  <ellipse cx="112" cy="186" rx="13" ry="38" />
                </>,
              )}
              {region(
                "lower legs",
                <>
                  <ellipse cx="89" cy="258" rx="9.5" ry="30" />
                  <ellipse cx="111" cy="258" rx="9.5" ry="30" />
                </>,
              )}
            </>
          ) : (
            <>
              {region("neck", <rect x="91" y="37" width="18" height="13" rx="5" />)}
              {region(
                "shoulders",
                <>
                  <ellipse cx="70" cy="63" rx="13" ry="12" />
                  <ellipse cx="130" cy="63" rx="13" ry="12" />
                </>,
              )}
              {/* One continuous V-taper from traps to waist. Two separate
                  shapes left dark notches where they failed to meet. */}
              {region(
                "back",
                <path d="M90 47 h20 L124 56 L117 114 Q100 122 83 114 L76 56 Z" />,
              )}
              {region(
                "upper arms",
                <>
                  <ellipse cx="62" cy="94" rx="10" ry="21" transform="rotate(-7 62 94)" />
                  <ellipse cx="138" cy="94" rx="10" ry="21" transform="rotate(7 138 94)" />
                </>,
              )}
              {region(
                "lower arms",
                <>
                  <ellipse cx="54" cy="150" rx="8.5" ry="23" transform="rotate(-7 54 150)" />
                  <ellipse cx="146" cy="150" rx="8.5" ry="23" transform="rotate(7 146 150)" />
                </>,
              )}
              {region("waist", <rect x="86" y="114" width="28" height="24" rx="9" />)}
              {region(
                "upper legs",
                <>
                  <rect x="80" y="138" width="40" height="26" rx="13" />
                  <ellipse cx="88" cy="198" rx="13" ry="34" />
                  <ellipse cx="112" cy="198" rx="13" ry="34" />
                </>,
              )}
              {region(
                "lower legs",
                <>
                  <ellipse cx="89" cy="258" rx="9.5" ry="30" />
                  <ellipse cx="111" cy="258" rx="9.5" ry="30" />
                </>,
              )}
            </>
          )}
        </svg>
      </div>

    </div>
  );
}
