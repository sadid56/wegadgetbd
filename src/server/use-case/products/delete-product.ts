import { eq } from "drizzle-orm";
import { product } from "@/db/schema";
import type { Context } from "@/server/context";
import { revalidateProductPaths } from "@/server/lib/revalidate";

export class DeleteProductUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly _actorId: string,
  ) {}

  async execute(id: string) {
    const [deleted] = await this.db
      .update(product)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(product.id, id))
      .returning();

    if (deleted) {
      revalidateProductPaths([deleted.slug]);
    }

    return {
      success: true,
      id,
    };
  }
}

