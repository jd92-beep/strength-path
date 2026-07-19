"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  LANG_MODES,
  t,
  type AppLangMode,
  type UiKey,
} from "./ui-strings";

const KEY = "strength-path-lang-mode";
const EVENT = "strength-path-lang";

let cachedMode: AppLangMode = "both";
let cachedRaw: string | null | undefined = undefined;

function readMode(): AppLangMode {
  if (typeof window === "undefined") return "both";
  const raw = localStorage.getItem(KEY);
  if (raw === cachedRaw) return cachedMode;
  cachedRaw = raw;
  if (raw === "en" || raw === "yue" || raw === "both") {
    cachedMode = raw;
  } else {
    cachedMode = "both";
  }
  return cachedMode;
}

function writeMode(mode: AppLangMode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, mode);
  cachedRaw = mode;
  cachedMode = mode;
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const handler = () => cb();
  window.addEventListener("storage", handler);
  window.addEventListener(EVENT, handler);
  return () => {
    window.removeEventListener("storage", handler);
    window.removeEventListener(EVENT, handler);
  };
}

type LocaleCtx = {
  mode: AppLangMode;
  setMode: (m: AppLangMode) => void;
  /** Primary string for current mode (EN for both). */
  tr: (key: UiKey) => string;
  /** Show both blocks when mode is both. */
  showEn: boolean;
  showYue: boolean;
  modes: typeof LANG_MODES;
};

const Ctx = createContext<LocaleCtx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const mode = useSyncExternalStore(subscribe, readMode, () => "both" as AppLangMode);
  const setMode = useCallback((m: AppLangMode) => writeMode(m), []);

  const value = useMemo<LocaleCtx>(
    () => ({
      mode,
      setMode,
      tr: (key) => t(key, mode === "both" ? "en" : mode),
      showEn: mode === "en" || mode === "both",
      showYue: mode === "yue" || mode === "both",
      modes: LANG_MODES,
    }),
    [mode, setMode],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLocale() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

/** Safe optional hook for rare cases outside provider (shouldn't happen). */
export function useLocaleOptional() {
  return useContext(Ctx);
}
