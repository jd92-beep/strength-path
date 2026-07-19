type Props = {
  /** 0–1 */
  move?: number;
  exercise?: number;
  stand?: number;
  size?: number;
};

export function ActivityRings({
  move = 0.72,
  exercise = 0.48,
  stand = 0.9,
  size = 132,
}: Props) {
  const stroke = 10;
  const gap = 4;
  const c = size / 2;
  const rings = [
    { value: move, color: "var(--ring-move)", r: c - stroke / 2 - 2 },
    { value: exercise, color: "var(--ring-exercise)", r: c - stroke / 2 - 2 - (stroke + gap) },
    { value: stand, color: "var(--ring-stand)", r: c - stroke / 2 - 2 - 2 * (stroke + gap) },
  ];

  return (
    <div className="af-rings" style={{ width: size, height: size }} aria-hidden>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        {rings.map((ring) => {
          const circ = 2 * Math.PI * ring.r;
          const offset = circ * (1 - Math.min(1, Math.max(0, ring.value)));
          return (
            <g key={ring.color}>
              <circle
                cx={c}
                cy={c}
                r={ring.r}
                fill="none"
                stroke="oklch(1 0 0 / 0.08)"
                strokeWidth={stroke}
              />
              <circle
                cx={c}
                cy={c}
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${c} ${c})`}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
