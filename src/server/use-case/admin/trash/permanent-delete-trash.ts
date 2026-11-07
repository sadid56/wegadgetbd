import { eq } from "drizzle-orm";
import { product, category, customerReview, order } from "@/db/schema";
import type { Context } from "@/server/context";
import { cacheService, CACHE_KEYS } from "@/server/services/cache";
import { writeAudit } from "@/server/lib/orm";
import { deleteFileFromStorage, deleteMultipleFilesFromStorage } from "@/lib/storage";
import type { TrashItemType } from "@/server/schemas/admin.schema";
import { ORPCError } from "@orpc/server";

export class PermanentDeleteTrashUseCase {
  constructor(
    private readonly db: Context["db"],
    private readonly actorId: string,
  ) {}

  async execute({ id, itemType }: { id: string; itemType: TrashItemType }) {
    let deleted: boolean = false;
    let itemTitle: string | undefined;
    let deletedFilesCount = 0;

    switch (itemType) {
      case "PRODUCT": {
        const found = await this.db.query.product.findFirst({
          where: eq(product.id, id),
        });

        if (!found) {
          throw new ORPCError("NOT_FOUND", { message: "Product not found" });
        }

        itemTitle = found.title;

        // Clean up files in Supabase Storage
        if (Array.isArray(found.images) && found.images.length > 0) {
          try {
            await deleteMultipleFilesFromStorage(found.images);
            deletedFilesCount += found.images.length;
          } catch (storageErr) {
            console.error("[PermanentDelete] Error cleaning product images from storage:", storageErr);
          }
        }

        const [res] = await this.db.delete(product).where(eq(product.id, id)).returning();
        deleted = Boolean(res);
        break;
      }

      case "CATEGORY": {
        const found = await this.db.query.category.findFirst({
          where: eq(category.id, id),
        });

        if (!found) {
          throw new ORPCError("NOT_FOUND", { message: "Category not found" });
        }

        itemTitle = found.name;

        // Clean up category icon in Supabase Storage if present
        if (found.icon) {
          try {
            await deleteFileFromStorage(found.icon);
            deletedFilesCount += 1;
          } catch (storageErr) {
            console.error("[PermanentDelete] Error cleaning category icon from storage:", storageErr);
          }
        }

        const [res] = await this.db.delete(category).where(eq(category.id, id)).returning();
        deleted = Boolean(res);
        await cacheService.deletePattern(CACHE_KEYS.categoriesPattern);
        break;
      }

      case "REVIEW": {
        const found = await this.db.query.customerReview.findFirst({
          where: eq(customerReview.id, id),
        });

        if (!found) {
          throw new ORPCError("NOT_FOUND", { message: "Review not found" });
        }

        itemTitle = found.customerName;

        // Clean up review media in Supabase Storage if present
        const filesToDelete: string[] = [];
        if (found.customerPic) filesToDelete.push(found.customerPic);
        if (found.mediaUrl) filesToDelete.push(found.mediaUrl);

        if (filesToDelete.length > 0) {
          try {
            await deleteMultipleFilesFromStorage(filesToDelete);
            deletedFilesCount += filesToDelete.length;
          } catch (storageErr) {
            console.error("[PermanentDelete] Error cleaning review files from storage:", storageErr);
          }
        }

        const [res] = await this.db.delete(customerReview).where(eq(customerReview.id, id)).returning();
        deleted = Boolean(res);
        break;
      }

      case "ORDER": {
        const found = await this.db.query.order.findFirst({
          where: eq(order.id, id),
        });

        if (!found) {
          throw new ORPCError("NOT_FOUND", { message: "Order not found" });
        }

        itemTitle = `Order #${found.id.slice(0, 8)} (${found.customerName})`;
        const [res] = await this.db.delete(order).where(eq(order.id, id)).returning();
        deleted = Boolean(res);
        break;
      }

      default:
        throw new ORPCError("BAD_REQUEST", { message: `Unsupported item type: ${itemType}` });
    }

    if (!deleted) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", { message: `Failed to permanently delete item.` });
    }

    await writeAudit(this.db, {
      action: itemType === "PRODUCT" ? "DELETE_PRODUCT" : "STATUS_CHANGE",
      actorId: this.actorId,
      metadata: {
        event: "PERMANENT_DELETE",
        itemType,
        id,
        title: itemTitle,
        deletedFilesCount,
      },
    });

    return { success: true, id, itemType, deletedFilesCount };
  }
}

