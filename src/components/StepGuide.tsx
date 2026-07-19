export function StepGuide({
  steps,
  compact = false,
}: {
  steps: string[];
  compact?: boolean;
}) {
  if (!steps?.length) {
    return <p className="muted">No step-by-step instructions available.</p>;
  }

  return (
    <ol className={`step-list ${compact ? "step-list--compact" : ""}`.trim()}>
      {steps.map((step, i) => (
        <li key={i}>
          <div className="step-list__body">
            <p className="step-list__text">{step}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
