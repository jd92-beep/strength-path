import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { BODY_PARTS, slugifyPart } from "@/lib/body-parts";
import { countByBodyPart } from "@/lib/exercises";

export const metadata = {
  title: "Body parts",
};

export default function BodyPage() {
  const counts = countByBodyPart();

  return (
    <AppShell title="Train by body" backHref="/">
      <p className="muted" style={{ marginTop: 0, marginBottom: "1.1rem" }}>
        Pick a region. You’ll get teaching notes plus every matching exercise from the dataset.
      </p>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {BODY_PARTS.map((part) => (
          <Link
            key={part.id}
            href={`/body/${slugifyPart(part.id)}`}
            className="surface"
            style={{
              padding: "1rem",
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: "0.85rem",
              alignItems: "center",
              borderColor: `color-mix(in oklab, ${part.accent} 42%, var(--border))`,
            }}
          >
            <span
              style={{
                width: "2.75rem",
                height: "2.75rem",
                borderRadius: "12px",
                display: "grid",
                placeItems: "center",
                fontSize: "1.25rem",
                background: `color-mix(in oklab, ${part.accent} 22%, var(--surface))`,
              }}
            >
              {part.emoji}
            </span>
            <span>
              <span className="display" style={{ display: "block", fontSize: "1.05rem" }}>
                {part.label}
              </span>
              <span className="muted" style={{ fontSize: "0.85rem" }}>
                {part.blurb}
              </span>
            </span>
            <span className="chip">{counts[part.id] ?? 0}</span>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
