import { revalidatePath } from "next/cache";
import { routing } from "@/i18n/routing";

/**
 * Revalidates SSG/ISR product listing and detail pages across all locales
 * whenever a product is created, updated, deleted, or restored.
 */
export function revalidateProductPaths(slugs: Array<string | null | undefined>) {
  const uniqueSlugs = Array.from(new Set(slugs.filter((s): s is string => Boolean(s))));

  try {
    for (const locale of routing.locales) {
      revalidatePath(`/${locale}`, "page");
      revalidatePath(`/${locale}/products`, "page");
      for (const slug of uniqueSlugs) {
        revalidatePath(`/${locale}/products/${slug}`, "page");
      }
    }
  } catch {
    // Ignore when executed outside Next.js request/runtime context (e.g. CLI scripts)
  }
}
