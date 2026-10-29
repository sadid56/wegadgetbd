import { eq } from "drizzle-orm";
import { product, auditLog, type AuditAction } from "@/db/schema";
import type { Context } from "@/server/context";

export class DeleteProductUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly actorId: string,
  ) {}

  async execute(id: string) {
    const [deleted] = await this.db.delete(product).where(eq(product.id, id)).returning();

    if (deleted) {
      await this.db
        .insert(auditLog)
        .values({
          action: "DELETE_PRODUCT" as AuditAction,
          actorId: this.actorId,
          metadata: { productId: id, title: deleted.title },
        })
        .catch(() => null);
    }

    return {
      success: true,
      id,
    };
  }
}

