import { eq } from "drizzle-orm";
import { category } from "@/db/schema";
import type { Context } from "@/server/context";
import type { UpdateCategoryInput } from "@/server/schemas/categories.schema";
import { cacheService, CACHE_KEYS } from "@/server/services/cache";

export class UpdateCategoryUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute({ id, data }: UpdateCategoryInput) {
    const [updatedCategory] = await this.db
      .update(category)
      .set({
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: data.slug }),
        ...(data.icon !== undefined && { icon: data.icon }),
      })
      .where(eq(category.id, id))
      .returning();

    await cacheService.deletePattern(CACHE_KEYS.categoriesPattern);

    return updatedCategory;
  }
}

