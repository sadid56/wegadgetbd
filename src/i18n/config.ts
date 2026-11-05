export const LOCALES = ["en", "bn"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export interface LocaleMeta {
  code: Locale;
  label: string;
  nativeName: string;
  flag: string;
}

export const LOCALE_MAP: Record<Locale, LocaleMeta> = {
  en: {
    code: "en",
    label: "English",
    nativeName: "English",
    flag: "🇺🇸",
  },
  bn: {
    code: "bn",
    label: "Bengali",
    nativeName: "বাংলা",
    flag: "🇧🇩",
  },
};

