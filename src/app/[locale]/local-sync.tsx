"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";

export function LocaleSync() {
  const locale = useLocale();

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const isBn = locale === "bn";

    root.lang = locale;
    root.setAttribute("data-locale", locale);
    root.style.setProperty("--font-app", isBn ? "var(--font-hind-siliguri)" : "var(--font-inter)");

    body.classList.toggle("font-bn", isBn);
    body.classList.toggle("font-en", !isBn);
  }, [locale]);

  return null;
}
