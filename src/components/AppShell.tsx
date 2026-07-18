import Link from "next/link";
import { BottomNav } from "./BottomNav";

export function AppShell({
  children,
  title,
  backHref,
}: {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
}) {
  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: "var(--z-sticky)" as unknown as number,
          backdropFilter: "blur(10px)",
          background: "color-mix(in oklab, var(--bg) 85%, transparent)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="shell"
          style={{
            paddingBlock: "0.75rem",
            paddingBottom: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            minHeight: "3.25rem",
          }}
        >
          {backHref ? (
            <Link
              href={backHref}
              className="chip"
              style={{ paddingInline: "0.65rem" }}
              aria-label="Go back"
            >
              ←
            </Link>
          ) : (
            <Link href="/" className="display" style={{ fontSize: "1.05rem" }}>
              Strength<span style={{ color: "var(--primary)" }}>Path</span>
            </Link>
          )}
          {title ? (
            <h1
              className="display"
              style={{
                margin: 0,
                fontSize: "1.05rem",
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </h1>
          ) : null}
        </div>
      </header>
      <main className="shell">{children}</main>
      <BottomNav />
    </>
  );
}
