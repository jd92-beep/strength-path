export function StepGuide({ steps }: { steps: string[] }) {
  if (!steps?.length) {
    return <p className="muted">No step-by-step instructions available.</p>;
  }

  return (
    <ol className="step-list">
      {steps.map((step, i) => (
        <li key={i}>
          <p style={{ margin: 0, fontSize: "0.95rem" }}>{step}</p>
        </li>
      ))}
    </ol>
  );
}
