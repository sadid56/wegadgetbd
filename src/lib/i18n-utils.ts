import { LOCALE_COOKIE_NAME, type Locale } from "@/i18n/config";

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/**
 * Converts English digits (0-9) to Bengali digits (০-৯)
 */
export function toBengaliNumber(val: number | string | null | undefined): string {
  if (val === null || val === undefined) return "";
  return val.toString().replace(/\d/g, (d) => BENGALI_DIGITS[Number(d)]);
}

/**
 * Formats a localized price string.
 * Example:
 * formatPrice(1200, "en") => "৳1,200"
 * formatPrice(1200, "bn") => "৳ ১,২০০"
 */
export function formatPrice(amount: number | string | null | undefined, locale: string = "en"): string {
  if (amount === null || amount === undefined) return "৳0";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "৳0";

  const formattedEn = num.toLocaleString("en-US");
  if (locale === "bn") {
    return `৳ ${toBengaliNumber(formattedEn)}`;
  }
  return `৳${formattedEn}`;
}

/**
 * Sets the locale cookie in browser and triggers a page refresh
 */
export function setClientLocale(nextLocale: Locale): void {
  if (typeof document === "undefined") return;

  // Set cookie for 1 year
  const maxAge = 60 * 60 * 24 * 365;
  document.cookie = `${LOCALE_COOKIE_NAME}=${nextLocale}; path=/; max-age=${maxAge}; SameSite=Lax`;

  // Trigger full server-side refresh without changing URL
  window.location.reload();
}

