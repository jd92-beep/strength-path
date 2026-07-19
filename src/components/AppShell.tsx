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
  bare?: boolean;
}) {
  return (
    <div className="af-app">
      <header className="af-header">
        <div className="af-header__inner">
          {backHref ? (
            <Link href={backHref} className="af-back" aria-label="Go back">
              <span aria-hidden>‹</span> Back
            </Link>
          ) : (
            <Link href="/" className="af-brand">
              Strength Path
            </Link>
          )}
          {title ? <h1 className="af-header__title">{title}</h1> : null}
        </div>
      </header>
      <main className="af-shell">{children}</main>
      <BottomNav />
    </div>
  );
}
