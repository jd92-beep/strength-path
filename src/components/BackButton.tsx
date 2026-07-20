"use client";

import Link from "next/link";
import { useLocale } from "@/lib/locale";

/**
 * Hierarchical Back: always goes UP one level in the app structure
 * (exercise → library, workout → its program, program → programs …),
 * never to the previous browser-history page.
 */
export function BackButton({ fallbackHref = "/" }: { fallbackHref?: string }) {
  const { tr } = useLocale();

  return (
    <Link href={fallbackHref || "/"} className="af-back" aria-label={tr("back")}>
      <span aria-hidden>‹</span> {tr("back")}
    </Link>
  );
}
