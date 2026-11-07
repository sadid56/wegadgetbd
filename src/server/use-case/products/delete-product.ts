import { eq } from "drizzle-orm";
import { product } from "@/db/schema";
import type { Context } from "@/server/context";
import { writeAudit } from "@/server/lib/orm";

export class DeleteProductUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly actorId: string,
  ) {}

  async execute(id: string) {
    const [deleted] = await this.db
      .update(product)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(product.id, id))
      .returning();

    if (deleted) {
      await writeAudit(this.db, {
        action: "DELETE_PRODUCT",
        actorId: this.actorId,
        metadata: { productId: id, title: deleted.title, softDelete: true },
      });
    }

    return {
      success: true,
      id,
    };
  }
}

