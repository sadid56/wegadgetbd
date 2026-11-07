import { eq } from "drizzle-orm";
import { category } from "@/db/schema";
import type { Context } from "@/server/context";
import type { UpdateCategoryInput } from "@/server/schemas/categories.schema";
import { cacheService, CACHE_KEYS } from "@/server/services/cache";
import { writeAudit } from "@/server/lib/orm";

export class UpdateCategoryUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly actorId: string = "admin",
  ) {}

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

    if (updatedCategory) {
      await writeAudit(this.db, {
        action: "UPDATE_SETTINGS",
        actorId: this.actorId,
        metadata: {
          categoryId: id,
          categoryName: updatedCategory.name,
          changes: Object.keys(data),
          type: "CATEGORY_UPDATE",
        },
      });
    }

    return updatedCategory;
  }
}

