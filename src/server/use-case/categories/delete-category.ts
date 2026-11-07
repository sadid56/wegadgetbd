import { and, eq } from "drizzle-orm";
import { category, product } from "@/db/schema";
import type { Context } from "@/server/context";
import { ORPCError } from "@orpc/server";
import { cacheService, CACHE_KEYS } from "@/server/services/cache";
import { writeAudit } from "@/server/lib/orm";

export class DeleteCategoryUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly actorId: string = "admin",
  ) {}

  async execute(id: string) {
    // Check if category has active associated products before attempting deletion
    const [existingProduct] = await this.db
      .select({ id: product.id })
      .from(product)
      .where(and(eq(product.categoryId, id), eq(product.isDeleted, false)))
      .limit(1);

    if (existingProduct) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Cannot delete this category because it has active associated products. Please reassign or delete the products first.",
      });
    }

    const [deletedCategory] = await this.db
      .update(category)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(category.id, id))
      .returning();

    if (!deletedCategory) {
      throw new ORPCError("NOT_FOUND", {
        message: "Category not found",
      });
    }

    await cacheService.deletePattern(CACHE_KEYS.categoriesPattern);

    await writeAudit(this.db, {
      action: "UPDATE_SETTINGS",
      actorId: this.actorId,
      metadata: {
        categoryId: id,
        categoryName: deletedCategory.name,
        type: "CATEGORY_DELETE",
        softDelete: true,
      },
    });

    return deletedCategory;
  }
}
