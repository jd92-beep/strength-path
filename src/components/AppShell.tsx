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
    <div className="af-app">
      <header className="af-header">
        <div className={`af-header__inner ${title ? "af-header__inner--titled" : ""}`.trim()}>
          <div className="af-header__left">
            {backHref ? (
              <Link href={backHref} className="af-back" aria-label="Go back">
                <span aria-hidden>‹</span> Back
              </Link>
            ) : (
              <Link href="/" className="af-brand">
                Strength Path
              </Link>
            )}
          </div>
          {title ? <h1 className="af-header__title">{title}</h1> : <span />}
          <div className="af-header__right" aria-hidden />
        </div>
      </header>
      <main className="af-shell">{children}</main>
      <BottomNav />
    </div>
  );
}
