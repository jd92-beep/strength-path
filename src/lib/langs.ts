import type { LangCode } from "./types";
import langs from "@/data/langs.json";

export type LangMeta = {
  code: LangCode;
  label: string;
  flag: string;
};

export const LANGS = langs as LangMeta[];

export function isLangCode(v: string): v is LangCode {
  return LANGS.some((l) => l.code === v);
}
