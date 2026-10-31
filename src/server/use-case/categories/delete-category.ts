import { eq } from "drizzle-orm";
import { category, product } from "@/db/schema";
import type { Context } from "@/server/context";
import { ORPCError } from "@orpc/server";

export class DeleteCategoryUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(id: string) {
    // Check if category has associated products before attempting deletion
    const [existingProduct] = await this.db
      .select({ id: product.id })
      .from(product)
      .where(eq(product.categoryId, id))
      .limit(1);

    if (existingProduct) {
      throw new ORPCError("BAD_REQUEST", {
        message: "Cannot delete this category because it has associated products. Please reassign or delete the products first.",
      });
    }

    const [deletedCategory] = await this.db
      .delete(category)
      .where(eq(category.id, id))
      .returning();

    if (!deletedCategory) {
      throw new ORPCError("NOT_FOUND", {
        message: "Category not found",
      });
    }

    return deletedCategory;
  }
}
