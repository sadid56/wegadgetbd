import { desc, eq } from "drizzle-orm";
import { product, category } from "@/db/schema";
import type { Context } from "@/server/context";
import type { TopPickProduct } from "@/server/schemas/products.schema";

export class GetLatestArrivalsUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(limit = 4): Promise<TopPickProduct[]> {
    // Simply fetch the latest products ordered by creation date
    const rows = await this.db
      .select({
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        discountPrice: product.discountPrice,
        images: product.images,
        brand: product.brand,
        rating: product.rating,
        soldCount: product.soldCount,
        inStock: product.inStock,
        categoryName: category.name,
      })
      .from(product)
      .leftJoin(category, eq(product.categoryId, category.id))
      .where(eq(product.status, "ACTIVE"))
      .orderBy(desc(product.createdAt))
      .limit(limit);

    return rows.map((p, index) => this.mapProduct(p, index));
  }

  private mapProduct(
    p: {
      id: string;
      title: string;
      slug: string;
      price: string | number;
      discountPrice: string | number | null;
      images: string[] | null;
      brand: string | null;
      rating: string | number | null;
      soldCount: number | null;
      inStock: boolean | null;
      categoryName: string | null;
    },
    index: number,
  ): TopPickProduct {
    const priceNum = Number(p.price);
    const discountNum = p.discountPrice != null ? Number(p.discountPrice) : null;
    const hasDiscount = discountNum !== null && discountNum > 0 && discountNum < priceNum;
    const price = hasDiscount ? discountNum : priceNum;
    const originalPrice = hasDiscount ? priceNum : null;

    let badge: string | null = "New";
    let badgeVariant: string | null = "new";

    if (hasDiscount) {
      badge = "Sale";
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
      rating: Number(p.rating ?? 5.0).toFixed(1),
      reviewCount: `${Math.max(p.soldCount || 0, 100)}+`,
      price,
      originalPrice,
      image: rawImage,
      inStock: p.inStock ?? true,
    };
  }
}
