"use client";

import { Reveal } from "./Reveal";
import { useLocale } from "@/lib/locale";

export function StepGuide({
  steps,
  compact = false,
}: {
  steps: string[];
  compact?: boolean;
}) {
  const { tr } = useLocale();

  if (!steps?.length) {
    return <p className="muted">{tr("noSteps")}</p>;
  }

  return (
    <ol className={`step-list ${compact ? "step-list--compact" : ""}`.trim()}>
      {steps.map((step, i) => (
        <Reveal key={i} as="li" delay={Math.min(i * 60, 300)}>
          <div className="step-list__body">
            <p className="step-list__text">{step}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
