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
