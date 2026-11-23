import { and, desc, eq } from "drizzle-orm";
import { product, category } from "@/db/schema";
import type { Context } from "@/server/context";
import type { TopPickProduct } from "@/server/schemas/products.schema";
import { formatDiscountBadge, getProductReviewCountMap } from "./_shared";

export class GetTopPicksUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(limit = 4): Promise<TopPickProduct[]> {
    // Select products with highest sales and highest rating
    const rows = await this.db
      .select({
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discountPrice,
        images: product.images,
        rating: product.rating,
        soldCount: product.soldCount,
        inStock: product.inStock,
        categoryName: category.name,
      })
      .from(product)
      .leftJoin(category, eq(product.categoryId, category.id))
      .where(and(eq(product.status, "ACTIVE"), eq(product.isDeleted, false)))
      .orderBy(desc(product.soldCount), desc(product.rating), desc(product.createdAt))
      .limit(limit);

    const reviewCountMap = await getProductReviewCountMap(
      this.db,
      rows.map((r) => r.id),
    );

    return rows.map((p, index) => this.mapProduct(p, index, reviewCountMap.get(p.id) ?? 0));
  }

  private mapProduct(
    p: {
      id: string;
      title: string;
      slug: string;
      price: string | number;
      discountPrice: string | number | null;
      images: string[] | null;
      brand?: string | null;
      rating: string | number | null;
      soldCount: number | null;
      inStock: boolean | null;
      categoryName: string | null;
    },
    _index: number,
    reviewCount: number,
  ): TopPickProduct {
    const priceNum = Number(p.price);
    const discountNum = p.discountPrice != null ? Number(p.discountPrice) : null;
    const hasDiscount = discountNum !== null && discountNum > 0 && discountNum < priceNum;
    const price = hasDiscount ? discountNum : priceNum;
    const originalPrice = hasDiscount ? priceNum : null;

    let badge: string | null = "Best Seller";
    let badgeVariant: string | null = "default";

    if (hasDiscount) {
      badge = formatDiscountBadge(priceNum, discountNum) ?? "Sale";
      badgeVariant = "sale";
    }

    const rawImage = Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : null;

    return {
      id: p.id,
      title: p.title,
      slug: p.slug,
      brand: p.brand || p.categoryName || "GADGET",
      badge,
      badgeVariant,
      rating: reviewCount > 0 ? Number(p.rating ?? 0).toFixed(1) : "0.0",
      reviewCount,
      price,
      originalPrice,
      thumbnail: rawImage,
      inStock: p.inStock ?? true,
    };
  }
}
