import { asc, eq } from "drizzle-orm";
import { category } from "@/db/schema";
import type { Context } from "@/server/context";
import { cacheService, CACHE_KEYS, CACHE_TTL, type ICacheService } from "@/server/services/cache";

export class ListCategoriesUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly cache: ICacheService = cacheService,
  ) {}

  async execute() {
    return this.cache.remember(CACHE_KEYS.categoriesList, CACHE_TTL.ONE_WEEK, async () => {
      return this.db
        .select({
          name: category.name,
          slug: category.slug,
          icon: category.icon,
        })
        .from(category)
        .where(eq(category.isDeleted, false))
        .orderBy(asc(category.name));
    });
  }
}
