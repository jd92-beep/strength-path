import { AppShell } from "@/components/AppShell";
import { ExerciseCard } from "@/components/ExerciseCard";
import { BODY_PARTS } from "@/lib/body-parts";
import { filterExercises, uniqueValues } from "@/lib/exercises";
import Link from "next/link";

export const metadata = {
  title: "Exercise library",
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; body?: string; equipment?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const body = sp.body ?? "";
  const equipment = sp.equipment ?? "";

  const results = filterExercises({
    q: q || undefined,
    bodyPart: body || undefined,
    equipment: equipment || undefined,
    limit: 60,
  });
  const equipmentOptions = uniqueValues("equipment");

  return (
    <AppShell title="Library" backHref="/">
      <form action="/library" method="get" style={{ display: "grid", gap: "0.65rem", marginBottom: "1rem" }}>
        <label className="sr-only" htmlFor="q">
          Search exercises
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Search name, muscle, equipment…"
          style={{
            width: "100%",
            minHeight: "2.85rem",
            borderRadius: "999px",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--ink)",
            padding: "0.65rem 1rem",
          }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem" }}>
          <label style={{ display: "grid", gap: "0.25rem", fontSize: "0.78rem", color: "var(--ink-muted)" }}>
            Body part
            <select
              name="body"
              defaultValue={body}
              style={{
                minHeight: "2.5rem",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--ink)",
                padding: "0.4rem 0.55rem",
              }}
            >
              <option value="">All</option>
              {BODY_PARTS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </select>
          </label>
          <label style={{ display: "grid", gap: "0.25rem", fontSize: "0.78rem", color: "var(--ink-muted)" }}>
            Equipment
            <select
              name="equipment"
              defaultValue={equipment}
              style={{
                minHeight: "2.5rem",
                borderRadius: "12px",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--ink)",
                padding: "0.4rem 0.55rem",
              }}
            >
              <option value="">All</option>
              {equipmentOptions.map((eq) => (
                <option key={eq} value={eq}>
                  {eq}
                </option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" className="btn btn-primary btn-block">
          Filter exercises
        </button>
      </form>

      {(q || body || equipment) && (
        <p className="muted" style={{ marginTop: 0, fontSize: "0.88rem" }}>
          Showing {results.length} result{results.length === 1 ? "" : "s"}
          {results.length === 60 ? " (capped at 60)" : ""}.{" "}
          <Link href="/library" style={{ color: "var(--primary)" }}>
            Clear
          </Link>
        </p>
      )}

      <div style={{ display: "grid", gap: "0.65rem" }}>
        {results.map((ex) => (
          <ExerciseCard key={ex.id} exercise={ex} />
        ))}
      </div>

      {!results.length ? (
        <div className="surface" style={{ padding: "1.25rem", textAlign: "center" }}>
          <p className="display" style={{ margin: "0 0 0.35rem" }}>
            No matches
          </p>
          <p className="muted" style={{ margin: 0 }}>
            Try a broader search or clear filters.
          </p>
        </div>
      ) : null}
    </AppShell>
  );
}
