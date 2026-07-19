"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Marks history so BackButton can prefer router.back() after in-app navigation. */
export function NavTracker() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      sessionStorage.setItem("sp-nav", "1");
      // Tag current history entry
      window.history.replaceState(
        { ...(window.history.state || {}), __sp: true, path: pathname },
        "",
      );
    } catch {
      /* private mode */
    }
  }, [pathname]);

  return null;
}
