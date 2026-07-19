"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/",
    label: "Summary",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <circle cx="12" cy="12" r="7.5" strokeOpacity="0.55" />
        <circle cx="12" cy="12" r="10.5" strokeOpacity="0.3" />
      </svg>
    ),
  },
  {
    href: "/path",
    label: "Workouts",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 8h3l2-3h6l2 3h3v11H4V8z" strokeLinejoin="round" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    ),
  },
  {
    href: "/learn",
    label: "Library",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 4h5v16H5zM14 4h5v16h-5z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/library",
    label: "Search",
    icon: (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="6.5" />
        <path d="M16 16l4 4" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="af-tabbar" aria-label="Primary">
      <div className="af-tabbar__inner">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className="af-tab"
              data-active={active}
              aria-current={active ? "page" : undefined}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
