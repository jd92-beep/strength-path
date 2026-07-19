"use client";

import { useLocale } from "@/lib/locale";
import type { AppLangMode } from "@/lib/ui-strings";

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { mode, setMode, modes, tr } = useLocale();

  return (
    <div className={`lang-switch ${compact ? "lang-switch--compact" : ""}`.trim()} role="group" aria-label={tr("language")}>
      {!compact ? <span className="lang-switch__label">{tr("language")}</span> : null}
      <div className="lang-switch__seg">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            className="lang-switch__btn"
            data-active={mode === m.id}
            onClick={() => setMode(m.id as AppLangMode)}
            aria-pressed={mode === m.id}
          >
            {m.id === "en" ? "EN" : m.id === "yue" ? "粵" : "EN+粵"}
          </button>
        ))}
      </div>
    </div>
  );
}
