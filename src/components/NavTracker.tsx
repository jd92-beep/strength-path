"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { pushNav } from "@/lib/nav-history";

/** Records each path so BackButton can return to the real previous page. */
export function NavTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    pushNav(pathname);
  }, [pathname]);

  return null;
}
