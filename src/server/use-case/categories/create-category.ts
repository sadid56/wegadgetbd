import { category } from "@/db/schema";
import type { Context } from "@/server/context";
import type { CreateCategoryInput } from "@/server/schemas/categories.schema";
import { cacheService, CACHE_KEYS } from "@/server/services/cache";

export class CreateCategoryUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(input: CreateCategoryInput) {
    const [newCategory] = await this.db
      .insert(category)
      .values({
        name: input.name,
        slug: input.slug,
        icon: input.icon ?? null,
      })
      .returning();

    await cacheService.deletePattern(CACHE_KEYS.categoriesPattern);

    return newCategory;
  }
}

