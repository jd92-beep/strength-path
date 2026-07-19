"use client";

import { useLocale } from "@/lib/locale";

/** Renders English and/or Cantonese text blocks based on app language mode. */
export function BilingualText({
  en,
  yue,
  as: Tag = "p",
  className = "",
}: {
  en: string;
  yue: string;
  as?: "p" | "span" | "div" | "h2" | "h3" | "li";
  className?: string;
}) {
  const { showEn, showYue, mode } = useLocale();

  if (mode === "en") {
    return <Tag className={className}>{en}</Tag>;
  }
  if (mode === "yue") {
    return <Tag className={className}>{yue}</Tag>;
  }

  return (
    <Tag className={`bi-block ${className}`.trim()}>
      {showEn ? <span className="bi-en">{en}</span> : null}
      {showEn && showYue ? <span className="bi-sep" aria-hidden /> : null}
      {showYue ? <span className="bi-yue">{yue}</span> : null}
    </Tag>
  );
}

export function BilingualList({
  enItems,
  yueItems,
  ordered = false,
}: {
  enItems: string[];
  yueItems: string[];
  ordered?: boolean;
}) {
  const { showEn, showYue, mode } = useLocale();
  const List = ordered ? "ol" : "ul";
  const className = ordered ? "teach-numbered" : "teach-bullets";

  if (mode === "en") {
    return (
      <List className={className}>
        {enItems.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </List>
    );
  }
  if (mode === "yue") {
    return (
      <List className={className}>
        {yueItems.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </List>
    );
  }

  const n = Math.max(enItems.length, yueItems.length);
  return (
    <List className={className}>
      {Array.from({ length: n }).map((_, i) => (
        <li key={i}>
          {showEn && enItems[i] ? <span className="bi-en">{enItems[i]}</span> : null}
          {showEn && showYue && enItems[i] && yueItems[i] ? (
            <span className="bi-sep" aria-hidden />
          ) : null}
          {showYue && yueItems[i] ? <span className="bi-yue">{yueItems[i]}</span> : null}
        </li>
      ))}
    </List>
  );
}
