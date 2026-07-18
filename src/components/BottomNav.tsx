"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" />
      </svg>
    ),
  },
  {
    href: "/path",
    label: "Path",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19h4l3-7 3 4 3-9h3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/body",
    label: "Body",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="5" r="2.2" />
        <path d="M8 10h8l-1.5 5H9.5L8 10zM10 15l-1.5 5M14 15l1.5 5M9 11.5 6.5 14M15 11.5 17.5 14" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/library",
    label: "Library",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 4h5a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H5V4zM19 4h-5a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h5V4z" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav" aria-label="Primary">
      <div className="bottom-nav-inner">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link"
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
