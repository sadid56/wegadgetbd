import { and, count, eq, inArray } from "drizzle-orm";
import { customerReview } from "@/db/schema";
import type { Context } from "@/server/context";

export async function getProductReviewCountMap(
  db: Context["db"],
  productIds: string[],
): Promise<Map<string, number>> {
  const map = new Map<string, number>();
  if (productIds.length === 0) return map;

  const rows = await db
    .select({
      productId: customerReview.productId,
      total: count(),
    })
    .from(customerReview)
    .where(
      and(
        inArray(customerReview.productId, productIds),
        eq(customerReview.status, "APPROVED"),
        eq(customerReview.isDeleted, false),
      ),
    )
    .groupBy(customerReview.productId);

  for (const row of rows) {
    if (row.productId) {
      map.set(row.productId, Number(row.total ?? 0));
    }
  }

  return map;
}

export function formatDiscountBadge(originalPrice: number, salePrice: number): string | null {
  if (!(originalPrice > salePrice && salePrice > 0)) return null;
  const pct = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  return pct > 0 ? `-${pct}%` : `Save ৳${Math.round(originalPrice - salePrice)}`;
}

export function formatProduct<T extends Record<string, unknown>>(p: T) {
  const images = (Array.isArray(p.images) ? p.images : []) as string[];
  return {
    ...p,
    description: (p.description ?? p.markdown_description ?? "") as string,
    price: Number(p.price),
    discountPrice: p.discountPrice != null ? Number(p.discountPrice) : null,
    rating: Number(p.rating ?? 5),
    stockCount: Number(p.stockCount ?? 0),
    ratingCount: Number(p.ratingCount ?? 0),
    soldCount: Number(p.soldCount ?? 360),
    isFeatured: Boolean(p.isFeatured ?? false),
    tags: (Array.isArray(p.tags) ? p.tags : []) as string[],
    images,
    thumbnail: (p.thumbnail ?? (images.length > 0 ? images[0] : null)) as string | null,
    videoLinks: (Array.isArray(p.videoLinks) ? p.videoLinks : []) as string[],
  };
}

