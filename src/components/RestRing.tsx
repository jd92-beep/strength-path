"use client";

type Props = {
  total: number;
  left: number;
  onSkip: () => void;
};

export function RestRing({ total, left, onSkip }: Props) {
  const r = 42;
  const c = 2 * Math.PI * r;
  const pct = total > 0 ? left / total : 0;
  const offset = c * (1 - pct);

  return (
    <div className="rest-ring" role="timer" aria-live="polite" aria-label={`Rest ${left} seconds`}>
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
          <span className="rest-ring__unit">sec</span>
        </div>
      </div>
      <div className="rest-ring__copy">
        <p className="rest-ring__title">Rest & reset</p>
        <p className="muted">Breathe. Next set when ready.</p>
        <button type="button" className="btn btn-ghost" onClick={onSkip}>
          Skip rest
        </button>
      </div>
    </div>
  );
}
