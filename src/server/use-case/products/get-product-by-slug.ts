import { eq, and, or, count } from "drizzle-orm";
import { product, customerReview } from "@/db/schema";
import type { Context } from "@/server/context";
import { formatProduct } from "./_shared";

export class GetProductBySlugUseCase {
  constructor(private readonly db: Context["db"]) {}

  async execute(slug: string) {
    const foundProduct = await this.db.query.product.findFirst({
      where: and(or(eq(product.slug, slug), eq(product.id, slug)), eq(product.status, "ACTIVE"), eq(product.isDeleted, false)),
      with: { category: true },
    });

    if (!foundProduct) return null;

    const [reviewStat] = await this.db
      .select({ total: count() })
      .from(customerReview)
      .where(
        and(
          eq(customerReview.productId, foundProduct.id),
          eq(customerReview.status, "APPROVED"),
          eq(customerReview.isDeleted, false)
        )
      );

    return {
      ...formatProduct(foundProduct),
      reviewsCount: Number(reviewStat?.total ?? 0),
    };
  }
}

