import { eq } from "drizzle-orm";
import { product, category, customerReview, order } from "@/db/schema";
import type { Context } from "@/server/context";
import { cacheService, CACHE_KEYS } from "@/server/services/cache";
import { revalidateProductPaths } from "@/server/lib/revalidate";
import type { TrashItemType } from "@/server/schemas/admin.schema";
import { ORPCError } from "@orpc/server";

export class RestoreTrashUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly actorId: string,
  ) {}

  async execute({ id, itemType }: { id: string; itemType: TrashItemType }) {
    let restored: boolean = false;

    switch (itemType) {
      case "PRODUCT": {
        const [updated] = await this.db
          .update(product)
          .set({ isDeleted: false, deletedAt: null })
          .where(eq(product.id, id))
          .returning();
        if (updated) {
          restored = true;
          revalidateProductPaths([updated.slug]);
        }
        break;
      }

      case "CATEGORY": {
        const [updated] = await this.db
          .update(category)
          .set({ isDeleted: false, deletedAt: null })
          .where(eq(category.id, id))
          .returning();
        if (updated) {
          restored = true;
          await cacheService.deletePattern(CACHE_KEYS.categoriesPattern);
        }
        break;
      }

      case "REVIEW": {
        const [updated] = await this.db
          .update(customerReview)
          .set({ isDeleted: false, deletedAt: null })
          .where(eq(customerReview.id, id))
          .returning();
        if (updated) {
          restored = true;
        }
        break;
      }

      case "ORDER": {
        const [updated] = await this.db
          .update(order)
          .set({ isDeleted: false, deletedAt: null })
          .where(eq(order.id, id))
          .returning();
        if (updated) {
          restored = true;
        }
        break;
      }

      default:
        throw new ORPCError("BAD_REQUEST", { message: `Unsupported item type: ${itemType}` });
    }

    if (!restored) {
      throw new ORPCError("NOT_FOUND", { message: `Item of type ${itemType} with ID ${id} not found.` });
    }

    return { success: true, id, itemType };
  }
}

