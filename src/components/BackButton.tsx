"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/locale";

/**
 * Prefer real browser history so Summary → Foundation → Back returns to Summary,
 * not a hard-coded middle page like /path.
 */
export function BackButton({ fallbackHref = "/" }: { fallbackHref?: string }) {
  const router = useRouter();
  const { tr } = useLocale();

  function handleBack() {
    const before = typeof window !== "undefined" ? window.location.pathname : "";
    router.back();

    // If history didn't change (direct land / no prior entry), go to fallback.
    window.setTimeout(() => {
      if (typeof window === "undefined") return;
      if (window.location.pathname === before) {
        router.push(fallbackHref || "/");
      }
    }, 120);
  }

  return (
    <button type="button" className="af-back" onClick={handleBack} aria-label={tr("back")}>
      <span aria-hidden>‹</span> {tr("back")}
    </button>
  );
}
