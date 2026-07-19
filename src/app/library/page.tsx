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
  searchParams: Promise<{ q?: string; body?: string; equipment?: string; target?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const body = sp.body ?? "";
  const equipment = sp.equipment ?? "";
  const target = sp.target ?? "";

  const results = filterExercises({
    q: q || undefined,
    bodyPart: body || undefined,
    equipment: equipment || undefined,
    target: target || undefined,
    limit: 80,
  });
  const equipmentOptions = uniqueValues("equipment");
  const targetOptions = uniqueValues("target");

  return (
    <AppShell title="Demos" backHref="/">
      <div className="stack-md">
        <p className="muted" style={{ margin: 0, fontSize: "0.92rem" }}>
          Search the full <strong>1,324</strong>-exercise catalog. Filter by body part, equipment, or
          target muscle — then open the Form studio for GIF, steps (10 languages), and every dataset
          field.
        </p>

        <form action="/library" method="get" className="stack">
          <label className="sr-only" htmlFor="q">
            Search exercises
          </label>
          <input
            id="q"
            name="q"
            className="field"
            defaultValue={q}
            placeholder="Search name, muscle, equipment…"
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.55rem" }}>
            <label style={{ display: "grid", gap: "0.25rem", fontSize: "0.78rem", color: "var(--ink-muted)" }}>
              Body part
              <select name="body" defaultValue={body} className="select-field">
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
              <select name="equipment" defaultValue={equipment} className="select-field">
                <option value="">All</option>
                {equipmentOptions.map((eq) => (
                  <option key={eq} value={eq}>
                    {eq}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label style={{ display: "grid", gap: "0.25rem", fontSize: "0.78rem", color: "var(--ink-muted)" }}>
            Target muscle
            <select name="target" defaultValue={target} className="select-field">
              <option value="">All targets</option>
              {targetOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="btn btn-primary btn-block btn-lg">
            Filter demos
          </button>
        </form>

        {(q || body || equipment || target) && (
          <p className="muted" style={{ margin: 0, fontSize: "0.88rem" }}>
            Showing {results.length}
            {results.length === 80 ? " (capped at 80)" : ""} ·{" "}
            <Link href="/library" className="section-link">
              Clear
            </Link>
          </p>
        )}

        <div className="stack">
          {results.map((ex, i) => (
            <ExerciseCard
              key={ex.id}
              exercise={ex}
              featured={i === 0 && !q && !body && !equipment && !target}
            />
          ))}
        </div>

        {!results.length ? (
          <div className="surface" style={{ padding: "1.35rem", textAlign: "center", borderRadius: "18px" }}>
            <p className="display" style={{ margin: "0 0 0.35rem" }}>
              No matches
            </p>
            <p className="muted" style={{ margin: 0 }}>
              Try a broader search or clear filters.
            </p>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
