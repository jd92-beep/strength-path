"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/lib/locale";

/**
 * True browser-style back: returns to the previous screen in history
 * (e.g. Summary → Foundation → Back lands on Summary).
 * Falls back to `fallbackHref` only when there is no usable history.
 */
export function BackButton({ fallbackHref = "/" }: { fallbackHref?: string }) {
  const router = useRouter();
  const { tr } = useLocale();

  function handleBack() {
    // sessionStorage flag set on every in-app navigation
    const hasAppHistory =
      typeof window !== "undefined" &&
      (window.history.state?.__sp === true ||
        (typeof sessionStorage !== "undefined" &&
          sessionStorage.getItem("sp-nav") === "1"));

    if (hasAppHistory && window.history.length > 1) {
      router.back();
      return;
    }

    // If we opened Foundation from Summary via client nav, history works.
    // If user landed deep-linked, go to fallback (usually /).
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  }

  return (
    <button type="button" className="af-back" onClick={handleBack} aria-label={tr("back")}>
      <span aria-hidden>‹</span> {tr("back")}
    </button>
  );
}

/** Call once from layout client to mark that we have in-app navigation. */
export function markAppNavigation() {
  if (typeof sessionStorage !== "undefined") {
    sessionStorage.setItem("sp-nav", "1");
  }
}
