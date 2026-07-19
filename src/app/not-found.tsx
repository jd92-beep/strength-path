import Link from "next/link";

export default function NotFound() {
  return (
    <div className="af-app">
      <main className="af-shell" style={{ paddingTop: "4rem", textAlign: "center" }}>
        <p className="af-eyebrow">404</p>
        <h1 className="af-large-title" style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>
          Page not found
        </h1>
        <p className="muted" style={{ marginBottom: "1.5rem" }}>
          That workout, exercise, or pattern doesn’t exist — or the link is incomplete.
        </p>
        <div className="stack" style={{ maxWidth: "20rem", marginInline: "auto" }}>
          <Link href="/" className="btn btn-primary btn-block">
            Back to Summary
          </Link>
          <Link href="/library" className="btn btn-ghost btn-block">
            Search demos
          </Link>
          <Link href="/path" className="btn btn-ghost btn-block">
            Workouts
          </Link>
        </div>
      </main>
    </div>
  );
}
