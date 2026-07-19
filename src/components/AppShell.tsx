import Link from "next/link";
import { BottomNav } from "./BottomNav";

export function AppShell({
  children,
  title,
  backHref,
  bare = false,
}: {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
  bare?: boolean;
}) {
  return (
    <>
      <header className="app-header">
        <div className="app-header__inner">
          {backHref ? (
            <Link href={backHref} className="chip" aria-label="Go back" style={{ paddingInline: "0.7rem" }}>
              ← Back
            </Link>
          ) : (
            <Link href="/" className="brand">
              Strength<span>Path</span>
            </Link>
          )}
          {title ? <h1 className="page-title">{title}</h1> : null}
        </div>
      </header>
      <main className={bare ? undefined : "shell"}>{children}</main>
      <BottomNav />
    </>
  );
}
