"use client";

import Link from "next/link";
import { BottomNav } from "./BottomNav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { BackButton } from "./BackButton";
import { useLocale } from "@/lib/locale";

export function AppShell({
  children,
  title,
  backHref,
}: {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
}) {
  const { tr } = useLocale();

  return (
    <div className="af-app">
      <header className="af-header">
        <div
          className={`af-header__inner ${title || backHref ? "af-header__inner--titled" : "af-header__inner--home"}`.trim()}
        >
          <div className="af-header__left">
            {backHref ? (
              <BackButton fallbackHref={backHref} />
            ) : (
              <Link href="/" className="af-brand">
                <svg className="af-brand__glyph" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="9" stroke="var(--ring-exercise)" strokeWidth="2.6" strokeLinecap="round" strokeDasharray="40 17" />
                  <circle cx="12" cy="12" r="4.5" stroke="var(--ring-stand)" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="18 11" />
                </svg>
                {tr("brand")}
              </Link>
            )}
          </div>
          {title ? (
            <h1 className="af-header__title" title={title}>
              {title}
            </h1>
          ) : (
            <span className="af-header__spacer" />
          )}
          <div className="af-header__right">
            <LanguageSwitcher compact />
          </div>
        </div>
      </header>
      <main className="af-shell">{children}</main>
      <BottomNav />
    </div>
  );
}
