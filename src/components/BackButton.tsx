"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/locale";
import { popNav } from "@/lib/nav-history";

/**
 * True previous page via session stack (Summary → Foundation → Back = Summary).
 * Fallback only when there is no prior in-app entry (direct land / refresh).
 */
export function BackButton({ fallbackHref = "/" }: { fallbackHref?: string }) {
  const router = useRouter();
  const { tr } = useLocale();

  function handleBack() {
    const prev = popNav();
    if (prev) {
      router.push(prev);
      return;
    }
    router.push(fallbackHref || "/");
  }

  return (
    <button type="button" className="af-back" onClick={handleBack} aria-label={tr("back")}>
      <span aria-hidden>‹</span> {tr("back")}
    </button>
  );
}
