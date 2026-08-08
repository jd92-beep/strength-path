"use client";

import { useLocaleOptional } from "@/lib/locale";

type Props = {
  total: number;
  left: number;
  onSkip: () => void;
};

export function RestRing({ total, left, onSkip }: Props) {
  const locale = useLocaleOptional();
  const r = 42;
  const c = 2 * Math.PI * r;
  const pct = total > 0 ? left / total : 0;
  const offset = c * (1 - pct);

  // role="timer" + aria-live="off": the per-second value must NOT be in a
  // polite live region, or screen readers announce every tick.
  const ariaLabel = (locale?.tr("restSecondsAria") ?? "Rest {n} seconds").replace(
    "{n}",
    String(left),
  );

  return (
    <div className="rest-ring glow-edge" role="timer" aria-live="off" aria-label={ariaLabel}>
      <div className="rest-ring__visual">
        <svg viewBox="0 0 100 100" className="rest-ring__svg">
          <circle cx="50" cy="50" r={r} className="rest-ring__track" />
          <circle
            cx="50"
            cy="50"
            r={r}
            className="rest-ring__progress"
            strokeDasharray={c}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="rest-ring__time">
          <span className="rest-ring__sec">{left}</span>
          <span className="rest-ring__unit">{locale?.tr("secUnit") ?? "sec"}</span>
        </div>
      </div>
      <div className="rest-ring__copy">
        <p className="rest-ring__title">{locale?.tr("restReset") ?? "Rest & reset"}</p>
        <p className="muted">{locale?.tr("breatheReady") ?? "Breathe. Next set when ready."}</p>
        <button type="button" className="btn btn-ghost" onClick={onSkip}>
          {locale?.tr("skipRest") ?? "Skip rest"}
        </button>
      </div>
    </div>
  );
}
