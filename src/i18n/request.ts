import { getRequestConfig } from "next-intl/server";
import { locale as getRootLocale } from "next/root-params";
import { routing } from "./routing-config";
import { type Locale } from "./config";

export default getRequestConfig(async ({ locale: explicitLocale }) => {
  const requested = explicitLocale ?? (await getRootLocale());
  const locale: Locale =
    typeof requested === "string" && routing.locales.includes(requested as Locale)
      ? (requested as Locale)
      : routing.defaultLocale;

  const messages = (await import(`../messages/${locale}`)).default;

  return {
    locale,
    messages,
  };
});
