import { eq } from "drizzle-orm";
import { category } from "@/db/schema";
import type { Context } from "@/server/context";

export class DeleteCategoryUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(id: string) {
    const [deletedCategory] = await this.db
      .delete(category)
      .where(eq(category.id, id))
      .returning();

    return deletedCategory;
  }
}

