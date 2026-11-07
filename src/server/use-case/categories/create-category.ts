import { category } from "@/db/schema";
import type { Context } from "@/server/context";
import type { CreateCategoryInput } from "@/server/schemas/categories.schema";
import { cacheService, CACHE_KEYS } from "@/server/services/cache";
import { writeAudit } from "@/server/lib/orm";

export class CreateCategoryUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly actorId: string = "admin",
  ) {}

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

    if (newCategory) {
      await writeAudit(this.db, {
        action: "UPDATE_SETTINGS",
        actorId: this.actorId,
        metadata: {
          categoryId: newCategory.id,
          categoryName: newCategory.name,
          type: "CATEGORY_CREATE",
        },
      });
    }

    return newCategory;
  }
}

